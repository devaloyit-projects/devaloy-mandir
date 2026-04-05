// Admin Panel JavaScript - Clean & Bug-Free Version

const API_BASE = '';
let adminToken = null;
let allEvents = [];

// Communicate with main site
const eventChannel = new BroadcastChannel('devaloy-events-channel');

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const loginPage = document.getElementById('loginPage');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const eventsGrid = document.getElementById('eventsGrid');
const eventModal = document.getElementById('eventModal');
const eventForm = document.getElementById('eventForm');
const uploadArea = document.getElementById('uploadArea');
const eventPhoto = document.getElementById('eventPhoto');
const uploadPreview = document.getElementById('uploadPreview');
const previewImage = document.getElementById('previewImage');

// Init
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initApp();
});

function checkAuth() {
    adminToken = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    if (adminToken) showDashboard(); else showLogin();
}

function showLogin() {
    loginPage.style.display = 'flex';
    dashboard.style.display = 'none';
    sidebar.style.display = 'none';
    sidebarOverlay.classList.remove('active');
}

function showDashboard() {
    loginPage.style.display = 'none';
    dashboard.style.display = 'block';
    sidebar.style.display = 'flex';
    loadEvents();
}

function initApp() {
    // Auth
    loginForm.addEventListener('submit', handleLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Sidebar Toggle Logic (Desktop Collapse + Mobile Overlay)
    const toggleSidebar = () => {
        if (window.innerWidth > 992) {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('admin_sidebar_collapsed', sidebar.classList.contains('collapsed'));
        } else {
            sidebar.classList.remove('collapsed');
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
        }
    };

    if (window.innerWidth > 992 && localStorage.getItem('admin_sidebar_collapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }

    document.getElementById('toggleSidebar').addEventListener('click', toggleSidebar);
    document.getElementById('closeSidebar').addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // Sidebar Tabs
    document.querySelectorAll('.sidebar-nav li:not(.disabled-link)').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-nav li').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            document.getElementById('currentPageTitle').textContent = li.innerText.trim();
            if (window.innerWidth <= 992) toggleSidebar();
        });
    });

    // Event Management
    document.getElementById('addEventBtn').addEventListener('click', () => openModal());
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    eventForm.addEventListener('submit', handleFormSubmit);
    document.getElementById('eventSearch').addEventListener('input', (e) => filterEvents(e.target.value));

    // Delegation for Edit/Delete
    eventsGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = parseInt(btn.dataset.id);
        if (btn.classList.contains('edit-btn')) openModal(id);
        if (btn.classList.contains('delete-btn')) deleteEvent(id);
    });

    // Uploads
    uploadArea.addEventListener('click', (e) => {
        if (!e.target.closest('.preview-overlay')) eventPhoto.click();
    });
    document.getElementById('replaceImageBtn').addEventListener('click', () => eventPhoto.click());
    document.getElementById('removeImage').addEventListener('click', (e) => { e.stopPropagation(); clearImage(); });
    eventPhoto.addEventListener('change', (e) => { if (e.target.files[0]) uploadFile(e.target.files[0]); });

    // Date/Day Sync
    document.getElementById('eventDate').addEventListener('change', (e) => {
        updateDayDataset(e.target.value);
    });
}

function updateDayDataset(dateVal) {
    if (dateVal) {
        const d = new Date(dateVal + 'T00:00:00');
        document.getElementById('eventDate').dataset.day = d.toLocaleDateString('en-US', { weekday: 'long' });
    }
}

// Logic Functions
async function handleLogin(e) {
    e.preventDefault();
    const token = document.getElementById('adminToken').value.trim();
    try {
        const res = await fetch('/api/verify-token', { headers: { 'x-admin-token': token }});
        if (res.ok) {
            adminToken = token;
            if (document.getElementById('rememberToken').checked) localStorage.setItem('adminToken', token);
            else sessionStorage.setItem('adminToken', token);
            showDashboard();
        } else { alert('Invalid security token'); }
    } catch (err) { alert('Server error'); }
}

function handleLogout() {
    if (!confirm('Sign out?')) return;
    adminToken = null;
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    showLogin();
}

async function loadEvents() {
    try {
        const res = await fetch('/api/events');
        const data = await res.json();
        allEvents = data.events || [];
        updateUI();
    } catch (err) { console.error('Load failed'); }
}

function updateUI(filtered = null) {
    const events = filtered || allEvents;
    document.getElementById('eventsCount').textContent = allEvents.length;
    
    const thisMonth = new Date().getMonth();
    const months = { 'Jan':0,'Feb':1,'Mar':2,'Apr':3,'May':4,'Jun':5,'Jul':6,'Aug':7,'Sep':8,'Oct':9,'Nov':10,'Dec':11 };
    document.getElementById('upcomingCount').textContent = allEvents.filter(ev => months[ev.date.split(' ')[0]] === thisMonth).length;

    if (events.length === 0) {
        eventsGrid.style.display = 'none';
        document.getElementById('noEvents').style.display = 'flex';
    } else {
        eventsGrid.style.display = 'grid';
        document.getElementById('noEvents').style.display = 'none';
        eventsGrid.innerHTML = events.map(ev => `
            <div class="event-card-admin">
                ${ev.image ? `<img src="${ev.image}" class="event-image-admin">` : `<div class="image-placeholder"><span class="material-symbols-outlined">image</span></div>`}
                <div class="event-content-admin">
                    <div class="event-date-admin">${ev.date} • ${ev.day || ''}</div>
                    <h3 class="event-title-admin">${ev.title}</h3>
                    <p class="event-desc-admin">${ev.description}</p>
                    <div class="card-footer">
                        <button class="btn btn-secondary edit-btn" data-id="${ev.id}">Edit</button>
                        <button class="btn btn-danger delete-btn" data-id="${ev.id}">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function filterEvents(q) {
    const term = q.toLowerCase();
    updateUI(allEvents.filter(e => e.title.toLowerCase().includes(term) || e.description.toLowerCase().includes(term)));
}

function openModal(id = null) {
    eventModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (id) {
        const ev = allEvents.find(e => e.id === id);
        document.getElementById('modalTitle').textContent = 'Edit Event';
        document.getElementById('eventId').value = ev.id;
        document.getElementById('eventTitle').value = ev.title;
        document.getElementById('eventDescription').value = ev.description;
        document.getElementById('eventTime').value = ev.time || '';
        document.getElementById('eventImage').value = ev.image || '';
        if (ev.image) showPreview(ev.image); else clearImage();
        
        const year = new Date().getFullYear();
        const d = new Date(ev.date + ', ' + year);
        if (!isNaN(d)) {
            const dateStr = d.toISOString().split('T')[0];
            document.getElementById('eventDate').value = dateStr;
            updateDayDataset(dateStr);
        }
    } else {
        eventForm.reset();
        document.getElementById('modalTitle').textContent = 'New Event';
        document.getElementById('eventId').value = '';
        document.getElementById('eventDate').dataset.day = '';
        clearImage();
    }
}

function closeModal() { eventModal.style.display = 'none'; document.body.style.overflow = ''; }

async function handleFormSubmit(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    const originalBtnText = saveBtn.innerHTML;
    
    const id = document.getElementById('eventId').value;
    const rawDate = document.getElementById('eventDate').value;
    if (!rawDate) { alert('Please select a date'); return; }
    
    const d = new Date(rawDate + 'T00:00:00');
    let day = document.getElementById('eventDate').dataset.day;
    
    // Fallback if day is not in dataset
    if (!day) {
        day = d.toLocaleDateString('en-US', { weekday: 'long' });
    }
    
    let time = document.getElementById('eventTime').value.trim();
    if (!time) time = "See description"; // Server requires non-empty time

    const payload = {
        title: document.getElementById('eventTitle').value.trim(),
        description: document.getElementById('eventDescription').value.trim(),
        time: time,
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        day: day,
        image: document.getElementById('eventImage').value || null
    };

    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = 'Saving...';
        
        const res = await fetch(id ? `/api/events/${id}` : '/api/events', {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            eventChannel.postMessage('event-updated');
            closeModal();
            loadEvents();
        } else {
            const errData = await res.json();
            alert('Save failed: ' + (errData.error || 'Unknown error'));
        }
    } catch (err) { 
        console.error(err);
        alert('Save failed. Check your connection.'); 
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnText;
    }
}

async function deleteEvent(id) {
    if (!confirm('Delete this event?')) return;
    try {
        const res = await fetch(`/api/events/${id}`, { 
            method: 'DELETE', 
            headers: { 'x-admin-token': adminToken }
        });
        if (res.ok) {
            eventChannel.postMessage('event-updated');
            loadEvents();
        } else {
            alert('Delete failed');
        }
    } catch (err) { alert('Delete failed'); }
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    try {
        const res = await fetch('/api/upload', { 
            method: 'POST', 
            headers: { 'x-admin-token': adminToken }, 
            body: formData 
        });
        if (res.ok) {
            const data = await res.json();
            document.getElementById('eventImage').value = data.url;
            showPreview(data.url);
        } else {
            alert('Upload failed');
        }
    } catch (err) { alert('Upload failed'); }
}

function showPreview(url) {
    previewImage.src = url;
    uploadArea.querySelector('.upload-content').style.display = 'none';
    uploadPreview.style.display = 'block';
}

function clearImage() {
    document.getElementById('eventImage').value = '';
    eventPhoto.value = '';
    uploadArea.querySelector('.upload-content').style.display = 'block';
    uploadPreview.style.display = 'none';
}
