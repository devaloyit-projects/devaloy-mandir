// Admin Panel JavaScript - Refined & Modernized

const API_BASE = '';
let adminToken = null;
let allEvents = [];

// Create a BroadcastChannel to communicate with the main page
const eventChannel = new BroadcastChannel('devaloy-events-channel');

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboard = document.getElementById('dashboard');
const sidebar = document.getElementById('sidebar');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const adminTokenInput = document.getElementById('adminToken');
const rememberTokenCheckbox = document.getElementById('rememberToken');
const logoutBtn = document.getElementById('logoutBtn');
const addEventBtn = document.getElementById('addEventBtn');
const eventsGrid = document.getElementById('eventsGrid');
const eventsCount = document.getElementById('eventsCount');
const upcomingCount = document.getElementById('upcomingCount');
const noEvents = document.getElementById('noEvents');
const eventSearch = document.getElementById('eventSearch');
const eventModal = document.getElementById('eventModal');
const eventForm = document.getElementById('eventForm');
const modalClose = document.getElementById('modalClose');
const cancelBtn = document.getElementById('cancelBtn');
const uploadArea = document.getElementById('uploadArea');
const eventPhoto = document.getElementById('eventPhoto');
const uploadPreview = document.getElementById('uploadPreview');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImage');
const replaceImageBtn = document.getElementById('replaceImageBtn');
const toastContainer = document.getElementById('toastContainer');
const formError = document.getElementById('formError');
const sidebarToggle = document.getElementById('toggleSidebar');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeEventListeners();
});

function checkAuth() {
    adminToken = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    if (adminToken) {
        showDashboard();
        loadEvents();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginPage.style.display = 'flex';
    dashboard.style.display = 'none';
    sidebar.style.display = 'none';
    adminTokenInput.focus();
}

function showDashboard() {
    loginPage.style.display = 'none';
    dashboard.style.display = 'block';
    sidebar.style.display = 'flex';
}

function initializeEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    // Sidebar & Navigation
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    document.querySelectorAll('.sidebar-nav li:not(.disabled-link)').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
            this.classList.add('active');
            const tab = this.dataset.tab;
            document.getElementById('currentPageTitle').textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
            if (window.innerWidth <= 992) sidebar.classList.remove('open');
        });
    });

    // Events
    addEventBtn.addEventListener('click', () => openEventModal());
    modalClose.addEventListener('click', closeEventModal);
    cancelBtn.addEventListener('click', closeEventModal);
    eventForm.addEventListener('submit', handleEventSubmit);
    
    // Search
    eventSearch.addEventListener('input', (e) => {
        filterEvents(e.target.value);
    });

    // File Upload
    uploadArea.addEventListener('click', (e) => {
        if (e.target.closest('.preview-overlay')) return;
        eventPhoto.click();
    });
    replaceImageBtn?.addEventListener('click', () => eventPhoto.click());
    eventPhoto.addEventListener('change', handlePhotoSelect);
    removeImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeImage();
    });

    // Drag and Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    });

    // Date input change to auto-calculate day
    document.getElementById('eventDate').addEventListener('change', (e) => {
        if (e.target.value) {
            const date = new Date(e.target.value + 'T00:00:00');
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            document.getElementById('eventDate').dataset.day = day;
        }
    });

    // Close modal on outside click
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) closeEventModal();
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const token = adminTokenInput.value.trim();
    const submitBtn = loginForm.querySelector('button');

    if (!token) {
        showError('Please enter security token');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Verifying...</span>';
        
        const response = await fetch(`${API_BASE}/api/verify-token`, {
            headers: { 'x-admin-token': token }
        });

        if (response.ok) {
            adminToken = token;
            if (rememberTokenCheckbox.checked) {
                localStorage.setItem('adminToken', adminToken);
            } else {
                sessionStorage.setItem('adminToken', adminToken);
            }
            showSuccess('Access granted');
            showDashboard();
            loadEvents();
        } else {
            showError('Invalid security token');
        }
    } catch (error) {
        showError('Verification failed. Server unreachable.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Authorize Access</span><span class="material-symbols-outlined">arrow_forward</span>';
    }
}

function handleLogout() {
    if (!confirm('Are you sure you want to sign out?')) return;
    adminToken = null;
    sessionStorage.removeItem('adminToken');
    localStorage.removeItem('adminToken');
    showLogin();
    showSuccess('Session terminated');
}

async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE}/api/events`);
        const data = await response.json();
        allEvents = data.events || [];
        updateStats();
        renderEvents(allEvents);
    } catch (error) {
        console.error('Failed to load events:', error);
        showError('Database synchronization failed');
    }
}

function updateStats() {
    eventsCount.textContent = allEvents.length;
    
    // Count upcoming this month
    const now = new Date();
    const thisMonth = now.getMonth();
    const months = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
    
    const upcoming = allEvents.filter(event => {
        const monthStr = event.date.split(' ')[0];
        return months[monthStr] === thisMonth;
    });
    
    upcomingCount.textContent = upcoming.length;
}

function filterEvents(query) {
    const term = query.toLowerCase();
    const filtered = allEvents.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.description.toLowerCase().includes(term) ||
        event.date.toLowerCase().includes(term)
    );
    renderEvents(filtered);
}

function renderEvents(events) {
    if (events.length === 0) {
        eventsGrid.style.display = 'none';
        noEvents.style.display = 'flex';
        return;
    }

    eventsGrid.style.display = 'grid';
    noEvents.style.display = 'none';

    eventsGrid.innerHTML = events.map(event => {
        const imageHtml = event.image 
            ? `<img src="${event.image}" alt="${event.title}" class="event-image-admin">` 
            : `<div class="image-placeholder"><span class="material-symbols-outlined">image_not_supported</span></div>`;

        return `
            <div class="event-card-admin">
                ${imageHtml}
                <div class="event-content-admin">
                    <div class="event-date-admin">${event.date} • ${event.day || ''}</div>
                    <h3 class="event-title-admin">${escapeHtml(event.title)}</h3>
                    ${event.time ? `<div class="event-time-admin">
                        <span class="material-symbols-outlined">schedule</span>
                        ${escapeHtml(event.time)}
                    </div>` : ''}
                    <p class="event-desc-admin">${escapeHtml(event.description)}</p>
                    <div class="card-footer">
                        <button class="btn btn-secondary btn-sm btn-icon" onclick="editEvent(${event.id})">
                            <span class="material-symbols-outlined">edit</span>
                            Edit
                        </button>
                        <button class="btn btn-danger btn-sm btn-icon" style="background: #fee; color: #e53e3e; border: none; font-weight:700;" onclick="deleteEvent(${event.id})">
                            <span class="material-symbols-outlined">delete</span>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openEventModal(eventId = null) {
    eventModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    hideFormError();

    if (eventId) {
        document.getElementById('modalTitle').textContent = 'Modify Event';
        document.getElementById('eventId').value = eventId;
        loadEventData(eventId);
    } else {
        document.getElementById('modalTitle').textContent = 'Create New Event';
        eventForm.reset();
        document.getElementById('eventId').value = '';
        document.getElementById('eventImage').value = '';
        removeImage();
    }
}

async function loadEventData(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (event) {
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventTime').value = event.time || '';

        if (event.date) {
            const currentYear = new Date().getFullYear();
            const dateStr = event.date + ', ' + currentYear;
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                document.getElementById('eventDate').value = date.toISOString().split('T')[0];
                document.getElementById('eventDate').dataset.day = event.day;
            }
        }

        if (event.image) {
            document.getElementById('eventImage').value = event.image;
            showImagePreview(event.image);
        }
    }
}

function closeEventModal() {
    eventModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    eventForm.reset();
    removeImage();
}

function getAuthToken() {
    return adminToken || sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
}

async function handleEventSubmit(e) {
    e.preventDefault();
    const currentToken = getAuthToken();
    const saveBtn = document.getElementById('saveBtn');

    const rawDate = document.getElementById('eventDate').value;
    const dateObj = new Date(rawDate + 'T00:00:00');
    
    const formData = {
        title: document.getElementById('eventTitle').value.trim(),
        description: document.getElementById('eventDescription').value.trim(),
        time: document.getElementById('eventTime').value.trim(),
        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        day: document.getElementById('eventDate').dataset.day,
        image: document.getElementById('eventImage').value || null
    };

    if (!formData.title || !formData.description || !rawDate) {
        showFormError('Required fields are missing');
        return;
    }

    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="material-symbols-outlined">sync</span><span>Saving...</span>';
        
        const eventId = document.getElementById('eventId').value;
        const url = eventId ? `${API_BASE}/api/events/${eventId}` : `${API_BASE}/api/events`;
        const method = eventId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-admin-token': currentToken
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Cloud save failed');

        showSuccess(eventId ? 'Event updated' : 'Event published');
        if (typeof eventChannel !== 'undefined') eventChannel.postMessage('event-updated');

        closeEventModal();
        loadEvents();
    } catch (error) {
        showFormError('Transaction failed. Check connection.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span class="material-symbols-outlined">save</span><span>Save Event</span>';
    }
}

function editEvent(eventId) {
    openEventModal(eventId);
}

async function deleteEvent(eventId) {
    if (!confirm('Permanently remove this event? This action cannot be undone.')) return;

    try {
        const currentToken = getAuthToken();
        const response = await fetch(`${API_BASE}/api/events/${eventId}`, {
            method: 'DELETE',
            headers: { 'x-admin-token': currentToken }
        });

        if (!response.ok) throw new Error('Delete operation failed');

        showSuccess('Event removed');
        if (typeof eventChannel !== 'undefined') eventChannel.postMessage('event-updated');
        loadEvents();
    } catch (error) {
        showError('Deletion failed');
    }
}

async function handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (file) await handleFileUpload(file);
}

async function handleFileUpload(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        showError('Format not supported (JPG/PNG only)');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showError('File exceeds 5MB limit');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const uploadAreaContent = uploadArea.querySelector('.upload-content');
        const originalContent = uploadAreaContent.innerHTML;
        uploadAreaContent.innerHTML = '<span class="material-symbols-outlined rotate">sync</span><p>Uploading...</p>';
        
        const currentToken = getAuthToken();
        const response = await fetch(`${API_BASE}/api/upload`, {
            method: 'POST',
            headers: { 'x-admin-token': currentToken },
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        document.getElementById('eventImage').value = data.url;
        showImagePreview(data.url);
        uploadAreaContent.innerHTML = originalContent;
    } catch (error) {
        showError('Image upload failed');
    }
}

function showImagePreview(src) {
    previewImage.src = src;
    uploadArea.querySelector('.upload-content').style.display = 'none';
    uploadPreview.style.display = 'block';
}

function removeImage() {
    document.getElementById('eventImage').value = '';
    eventPhoto.value = '';
    uploadArea.querySelector('.upload-content').style.display = 'block';
    uploadPreview.style.display = 'none';
}

// Toast Notifications
function showSuccess(message) { showToast(message, 'success'); }
function showError(message) { showToast(message, 'error'); }

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'check_circle' : 'error';
    toast.innerHTML = `
        <span class="material-symbols-outlined toast-icon">${icon}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;
    if (!toastContainer) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        container.appendChild(toast);
    } else {
        toastContainer.appendChild(toast);
    }
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function showFormError(message) {
    formError.textContent = message;
    formError.style.display = 'block';
}

function hideFormError() {
    formError.style.display = 'none';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
