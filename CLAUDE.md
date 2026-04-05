# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Devaloy Mandir is a community spiritual center's website with a dual-mode architecture:
- **Static Mode**: Hosted on GitHub Pages without backend features
- **Local Development Mode**: Node.js/Express server enabling full event management and Stripe donation processing

## Common Commands

### Setup & Installation
```bash
npm install
```

### Development
```bash
# Start local server with full features (port 3000)
npm start

# Set environment variables before starting
export ADMIN_TOKEN="your-secure-token"
export STRIPE_SECRET_KEY="sk_test_..."
export STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### GitHub Pages Deployment
The static version can be deployed to GitHub Pages by pushing to the main branch. Admin features and Stripe integration are disabled in static mode.

## Environment Variables

Create `.env` file (copy from `.env.example`):
- `STRIPE_SECRET_KEY`: Stripe secret key for donation processing
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key (frontend)
- `ADMIN_TOKEN`: Token for event management API
- `PORT`: Server port (default: 3000)

## High-Level Architecture

### Frontend Layer
- **index.html** (18KB): Main landing page with semantic HTML5, accessible navigation, and ARIA labels
- **style/main.css** (52KB): Comprehensive styling with CSS variables, animations (fadeInUp, bounce, shimmer, ripple), responsive design, dark mode support
- **js/scripts.js** (20KB): Client-side functionality including:
  - Scroll animations (IntersectionObserver)
  - Navigation (hamburger menu, active links)
  - Dark mode toggle (localStorage)
  - Back-to-top button
  - Scroll progress bar
  - Ripple effects
  - Stripe checkout integration

### Backend Layer
- **server.js** (5KB): Express server providing:
  - Static file serving
  - Events API (CRUD operations)
  - Stripe checkout session creation
  - File-based persistence (events.json)

### Data Layer
- **events.json**: Event data store with simple JSON structure
  ```json
  {
    "events": [
      {
        "id": 1,
        "title": "Event Name",
        "date": "Jan 15",
        "day": "Wednesday",
        "time": "7:00 PM - 8:30 PM",
        "description": "...",
        "learnMore": true
      }
    ]
  }
  ```

## API Endpoints

### Public
- `GET /api/events`: Retrieve all events

### Admin (requires `x-admin-token` header)
- `POST /api/events`: Create new event
- `PUT /api/events/:id`: Update event
- `DELETE /api/events/:id`: Delete event
- `POST /api/create-checkout-session`: Create Stripe donation session

## File Structure
```
devaloy-mandir/
├── index.html              # Main website
├── server.js               # Express backend
├── package.json            # Node dependencies
├── events.json            # Event data
├── style/
│   └── main.css           # All styles
├── js/
│   └── scripts.js         # Frontend JavaScript
├── Media/                 # Images and videos
│   ├── IMG_5506.PNG       # Fundraiser flyer (popup)
│   ├── IMG_1811.mov       # Hero video
│   ├── IMG_8976.JPG       # About/gallery images
│   └── IMG_4342.jpeg      # Activities images
├── .env.example           # Environment template
├── EVENTS_API.md          # API documentation
├── TODO.md                # Enhancement history
└── CLAUDE.md              # This file
```

## Key Features

### Event Management
Events can be managed three ways:
1. **Direct JSON editing**: Edit `events.json` file directly
2. **Admin API**: Use POST/PUT/DELETE endpoints with admin token
3. **Frontend UI**: Click "+ Add New Event" button (when server running)

### Donation System
- Stripe Checkout integration for secure donations
- Configurable donation amounts
- Success/cancel URL handling

### Design & UX
- Responsive design (mobile-first)
- Scroll animations and reveals
- Dark mode support (persists in localStorage)
- Accessibility features (skip links, ARIA labels, semantic HTML)
- Parallax hero with background video

## Important Notes

### Static vs Local Mode
- **Static** (GitHub Pages): events.json loads via fetch, but admin features disabled
- **Local** (Node server): Full API available, events.json updates persist
- Events include fallback embedded in JS for fetch failures

### Temple Address
Current address in location section: **8529 Commonwealth Blvd, Bellerose, NY 11426**

### Browser Compatibility
- Uses modern CSS features (CSS variables, Grid, Flexbox)
- IntersectionObserver for scroll animations (requires polyfill for IE)
- Fetch API for events loading

## Development Workflow

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Start server: `npm start`
4. Open http://localhost:3000
5. Edit events via admin UI or API
6. For GitHub Pages: Push changes, admin features auto-disabled

## cURL Examples

See `EVENTS_API.md` for detailed cURL examples for creating, updating, and deleting events.