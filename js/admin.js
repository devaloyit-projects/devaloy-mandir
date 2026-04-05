// Admin Panel JavaScript

const API_BASE = '';
let adminToken = null;

// Create a BroadcastChannel to communicate with the main page
const eventChannel = new BroadcastChannel('devaloy-events-channel');

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const adminTokenInput = document.getElementById('adminToken');
const rememberTokenCheckbox = document.getElementById('rememberToken');
const logoutBtn = document.getElementById('logoutBtn');
const addEventBtn = document.getElementById('addEventBtn');
const eventsGrid = document.getElementById('eventsGrid');
const eventsCount = document.getElementById('eventsCount');
const noEvents = document.getElementById('noEvents');
const eventModal = document.getElementById('eventModal');
const eventForm = document.getElementById('eventForm');
const modalClose = document.getElementById('modalClose');
const cancelBtn = document.getElementById('cancelBtn');
const uploadArea = document.getElementById('uploadArea');
const eventPhoto = document.getElementById('eventPhoto');
const uploadPreview = document.getElementById('uploadPreview');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImage');
const toastContainer = document.getElementById('toastContainer');
const formError = document.getElementById('formError');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeEventListeners();
    loadEvents();
});

function checkAuth() {
    adminToken = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    if (adminToken) {
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginPage.style.display = 'flex';
    dashboard.style.display = 'none';
}

function showDashboard() {
    loginPage.style.display = 'none';
    dashboard.style.display = 'block';
}

function initializeEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    // Events
    addEventBtn.addEventListener('click', () => openEventModal());
    modalClose.addEventListener('click', closeEventModal);
    cancelBtn.addEventListener('click', closeEventModal);
    eventForm.addEventListener('submit', handleEventSubmit);

    // File Upload
    uploadArea.addEventListener('click', () => eventPhoto.click());
    eventPhoto.addEventListener('change', handlePhotoSelect);
    removeImageBtn.addEventListener('click', removeImage);

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
            const date = new Date(e.target.value);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            // Store day for form submission
            document.getElementById('eventDate').dataset.day = day;
        }
    });

    // Close modal on outside click
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeEventModal();
        }
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const token = adminTokenInput.value.trim();

    if (!token) {
        showError('Please enter admin token');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/verify-token`, {
            headers: {
                'x-admin-token': token
            }
        });

        if (response.ok) {
            adminToken = token;
            if (rememberTokenCheckbox.checked) {
                localStorage.setItem('adminToken', adminToken);
            } else {
                sessionStorage.setItem('adminToken', adminToken);
            }
            showSuccess('Login successful!');
            showDashboard();
            loadEvents();
        } else {
            showError('Invalid admin token');
        }
    } catch (error) {
        showError('Login failed. Please try again.');
    }
}

function handleLogout() {
    adminToken = null;
    sessionStorage.removeItem('adminToken');
    localStorage.removeItem('adminToken');
    showLogin();
    showSuccess('Logged out successfully');
}

async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE}/api/events`);
        const data = await response.json();
        renderEvents(data.events || []);
    } catch (error) {
        console.error('Failed to load events:', error);
        showError('Failed to load events');
    }
}

function renderEvents(events) {
    eventsCount.textContent = `${events.length} event${events.length !== 1 ? 's' : ''}`;

    if (events.length === 0) {
        eventsGrid.style.display = 'none';
        noEvents.style.display = 'block';
        return;
    }

    eventsGrid.style.display = 'grid';
    noEvents.style.display = 'none';

    eventsGrid.innerHTML = events.map(event => {
        const currentYear = new Date().getFullYear();
        const eventDate = new Date(event.date + ', ' + currentYear); // Use current year for parsing display date
        const formattedDate = event.date;
        const imageHtml = event.image ? `<img src="${event.image}" alt="${event.title}" class="event-image-admin">` : '';

        return `
            <div class="event-card-admin">
                ${imageHtml}
                <div class="event-content-admin">
                    <div class="event-date-admin">${formattedDate}</div>
                    <h3 class="event-title-admin">${escapeHtml(event.title)}</h3>
                    ${event.time ? `<div class="event-time-admin">
                        <span class="material-symbols-outlined">schedule</span>
                        ${escapeHtml(event.time)}
                    </div>` : ''}
                    <p class="event-desc-admin">${escapeHtml(event.description)}</p>
                    <div class="event-actions">
                        <button class="btn-icon btn-edit" onclick="editEvent(${event.id})">
                            <span class="material-symbols-outlined">edit</span>
                            Edit
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteEvent(${event.id})">
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

    if (eventId) {
        document.getElementById('modalTitle').textContent = 'Edit Event';
        document.getElementById('eventId').value = eventId;
        loadEventData(eventId);
    } else {
        document.getElementById('modalTitle').textContent = 'Add New Event';
        eventForm.reset();
        document.getElementById('eventId').value = '';
        document.getElementById('eventImage').value = '';
        removeImage();
    }
}

async function loadEventData(eventId) {
    try {
        const response = await fetch(`${API_BASE}/api/events`);
        const data = await response.json();
        const event = (data.events || []).find(e => e.id === eventId);

        if (event) {
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDescription').value = event.description;
            document.getElementById('eventTime').value = event.time || '';

            if (event.date) {
                const currentYear = new Date().getFullYear();
                const date = new Date(event.date + ', ' + currentYear);
                const dateInput = document.getElementById('eventDate');
                dateInput.value = date.toISOString().split('T')[0];
                dateInput.dataset.day = date.toLocaleDateString('en-US', { weekday: 'long' });
            }

            if (event.image) {
                document.getElementById('eventImage').value = event.image;
                showImagePreview(event.image);
            }
        }
    } catch (error) {
        console.error('Failed to load event:', error);
        showError('Failed to load event data');
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

    const formData = {
        title: document.getElementById('eventTitle').value.trim(),
        description: document.getElementById('eventDescription').value.trim(),
        time: document.getElementById('eventTime').value.trim(),
        date: document.getElementById('eventDate').value,
        day: document.getElementById('eventDate').dataset.day,
        image: document.getElementById('eventImage').value || null
    };

    // Validate
    if (!formData.title || !formData.description || !formData.date || !formData.day) {
        showFormError('Please fill in all required fields');
        return;
    }

    // Format date
    const dateObj = new Date(formData.date);
    formData.date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    try {
        const eventId = document.getElementById('eventId').value;
        const url = eventId
            ? `${API_BASE}/api/events/${eventId}`
            : `${API_BASE}/api/events`;

        const method = eventId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-admin-token': currentToken
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save event');
        }

        showSuccess(eventId ? 'Event updated successfully!' : 'Event created successfully!');
        
        // Push the update through the tunnel to any open main site tabs
        if (typeof eventChannel !== 'undefined') {
            eventChannel.postMessage('event-updated');
        }

        closeEventModal();
        loadEvents();
    } catch (error) {
        console.error('Failed to save event:', error);
        showFormError(error.message || 'Failed to save event');
    }
}

function editEvent(eventId) {
    openEventModal(eventId);
}

async function deleteEvent(eventId) {
    console.log('deleteEvent called for ID:', eventId);
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    try {
        const currentToken = getAuthToken();
        console.log('Sending DELETE request for ID:', eventId, 'with token:', currentToken ? 'present' : 'missing');
        const response = await fetch(`${API_BASE}/api/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'x-admin-token': currentToken
            }
        });

        console.log('DELETE response status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to delete event');
        }

        showSuccess('Event deleted successfully!');
        
        // Push the update through the tunnel to any open main site tabs
        if (typeof eventChannel !== 'undefined') {
            eventChannel.postMessage('event-updated');
        }

        loadEvents();
    } catch (error) {
        console.error('Failed to delete event:', error);
        showError('Failed to delete event');
    }
}

async function handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (file) {
        await handleFileUpload(file);
    }
}

async function handleFileUpload(file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        showFormError('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
        return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        showFormError('File too large. Maximum size is 5MB.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const currentToken = getAuthToken();
        const response = await fetch(`${API_BASE}/api/upload`, {
            method: 'POST',
            headers: {
                'x-admin-token': currentToken
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload image');
        }

        const data = await response.json();
        document.getElementById('eventImage').value = data.url;
        showImagePreview(data.url);
        hideFormError();
    } catch (error) {
        console.error('Failed to upload image:', error);
        showFormError(error.message || 'Failed to upload image');
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
function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? 'check_circle' : 'error';
    toast.innerHTML = `
        <span class="material-symbols-outlined toast-icon">${icon}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showFormError(message) {
    formError.textContent = message;
    formError.style.display = 'block';
}

function hideFormError() {
    formError.style.display = 'none';
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions global for inline onclick handlers
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;