require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs/promises');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const multer = require('multer');
const rateLimit = require('express-rate-limit');

const app = express();

// --- Configuration ---
const PORT = process.env.PORT || 3000;
const EVENTS_FILE = path.join(__dirname, 'events.json');
const ADMIN_TOKEN = (process.env.ADMIN_TOKEN || 'change-me').trim();
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// --- Rate Limiting ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again in 15 minutes.' }
});

// --- Security Headers ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://js.stripe.com", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "blob:", "https://*.stripe.com", "https://fonts.gstatic.com"],
      "connect-src": ["'self'", "https://api.stripe.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      "style-src": ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      "frame-src": ["'self'", "https://js.stripe.com", "https://www.google.com"],
    },
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logging for API
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Serve static files AFTER logging but BEFORE specific API limiters
app.use(compression());
app.use(express.static(__dirname, { maxAge: '1d' }));
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

// Ensure uploads directory exists
(async () => {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
})();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'event-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// --- Auth Middleware ---
function requireAdmin(req, res, next) {
  const token = req.header('x-admin-token');
  if (token !== ADMIN_TOKEN) {
    console.error(`[AUTH FAILURE] Endpoint: ${req.method} ${req.path}`);
    console.error(`Received: "${token}" (Length: ${token ? token.length : 0})`);
    console.error(`Expected: "${ADMIN_TOKEN}" (Length: ${ADMIN_TOKEN.length})`);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// --- API Endpoints ---

// 1. Verification
app.get('/api/verify-token', adminLimiter, requireAdmin, (req, res) => {
  res.json({ success: true });
});

// 2. Events CRUD (Public & Admin)
async function readEventsFile() {
  const raw = await fs.readFile(EVENTS_FILE, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.events)) return { events: [] };
  return parsed;
}

async function writeEventsFile(events) {
  const payload = { events };
  await fs.writeFile(EVENTS_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function validateEventInput(input) {
  const requiredFields = ['title', 'date', 'description'];
  for (const field of requiredFields) {
    if (!input[field] || typeof input[field] !== 'string' || !input[field].trim()) {
      return `Invalid or missing field: ${field}`;
    }
  }
  return null;
}

// GET is public
app.get('/api/events', apiLimiter, async (req, res) => {
  try {
    const { events } = await readEventsFile();
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load events' });
  }
});

// POST, PUT, DELETE are admin
app.post('/api/events', adminLimiter, requireAdmin, async (req, res) => {
  try {
    const validationError = validateEventInput(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const data = await readEventsFile();
    const nextId = data.events.length > 0
      ? Math.max(...data.events.map((event) => Number(event.id) || 0)) + 1
      : 1;

    const event = {
      id: nextId,
      title: req.body.title.trim(),
      date: req.body.date.trim(),
      day: (req.body.day || '').trim() || 'Scheduled',
      time: (req.body.time || '').trim() || 'TBD',
      description: req.body.description.trim(),
      image: req.body.image || null,
      learnMore: true
    };

    data.events.push(event);
    await writeEventsFile(data.events);
    res.status(201).json({ event });
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.put('/api/events/:id', adminLimiter, requireAdmin, async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const validationError = validateEventInput(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const data = await readEventsFile();
    const index = data.events.findIndex((event) => Number(event.id) === eventId);
    if (index === -1) return res.status(404).json({ error: 'Event not found' });

    data.events[index] = {
      ...data.events[index],
      title: req.body.title.trim(),
      date: req.body.date.trim(),
      day: (req.body.day || '').trim() || 'Scheduled',
      time: (req.body.time || '').trim() || 'TBD',
      description: req.body.description.trim(),
      image: req.body.image !== undefined ? req.body.image : data.events[index].image,
      learnMore: true
    };

    await writeEventsFile(data.events);
    res.json({ event: data.events[index] });
  } catch (error) {
    console.error('Update Event Error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/api/events/:id', adminLimiter, requireAdmin, async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    console.log(`Server: Deleting event ${eventId}`);
    
    const data = await readEventsFile();
    const originalCount = data.events.length;
    data.events = data.events.filter((event) => Number(event.id) !== eventId);
    
    if (data.events.length === originalCount) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await writeEventsFile(data.events);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete Event Error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// 3. File Upload (Admin)
app.post('/api/upload', adminLimiter, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Stripe (Public)
app.post('/api/create-checkout-session', apiLimiter, async (req, res) => {
  try {
    const { amount, name, email, type } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Donation to Devaloy Mandir (${type})`,
            description: `Generous support from ${name}`,
          },
          unit_amount: Math.round(parseFloat(amount) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: email,
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Devaloy server running on http://localhost:${PORT}`);
});
