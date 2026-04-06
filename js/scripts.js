
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // --- 1. MULTI-LANGUAGE CONFIGURATION ---
    const translations = {
        'en': {
            'nav-home': 'Home',
            'nav-about': 'About Us',
            'nav-activities': 'Activities',
            'nav-aims': 'Aims & Objective',
            'nav-gallery': 'Gallery',
            'nav-donate': 'Donate',
            'nav-logo': 'Devaloy Mandir'
        },
        'bn': {
            'nav-home': 'হোম',
            'nav-about': 'আমাদের সম্পর্কে',
            'nav-activities': 'কার্যক্রম',
            'nav-aims': 'লক্ষ্য ও উদ্দেশ্য',
            'nav-gallery': 'গ্যালারি',
            'nav-donate': 'দান করুন',
            'nav-logo': 'দেবালয় মন্দির'
        },
        'hi': {
            'nav-home': 'होम',
            'nav-about': 'हमारे बारे में',
            'nav-activities': 'गतिविधियाँ',
            'nav-aims': 'लक्ष्य और उद्देश्य',
            'nav-gallery': 'गैलरी',
            'nav-donate': 'दान दें',
            'nav-logo': 'देवालय मंदिर'
        }
    };

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        localStorage.setItem('preferredLang', lang);
        // Refresh events to pick up new language if available in Sheet
        loadEvents();
    }

    const langSwitcher = document.getElementById('langSwitcher');
    langSwitcher?.addEventListener('change', (e) => updateLanguage(e.target.value));

    // Load saved language
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    if (langSwitcher) langSwitcher.value = savedLang;
    updateLanguage(savedLang);

    // --- 2. CORE UI ELEMENTS ---
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    // --- 3. DARK MODE ---
    const darkModeBtn = document.createElement('button');
    darkModeBtn.className = 'dark-mode-toggle';
    darkModeBtn.innerHTML = '🌙';
    darkModeBtn.setAttribute('aria-label', 'Toggle Dark Mode');
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) navContainer.appendChild(darkModeBtn);

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '☀️';
    }

    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        darkModeBtn.innerHTML = isDark ? '☀️' : '🌙';
    });

    // --- 4. SCROLL EFFECTS & NAV ---
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress.style.width = (scrollTop / scrollHeight) * 100 + '%';

        backToTop.classList.toggle('visible', scrollTop > 500);
        document.querySelector('nav')?.classList.toggle('scrolled', scrollTop > 50);
    }, { passive: true });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    function toggleMenu() {
        hamburger?.classList.toggle('active');
        navMenu?.classList.toggle('active');
        document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
    }

    hamburger?.addEventListener('click', toggleMenu);
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu?.classList.contains('active')) toggleMenu();
        });
    });

    // --- 5. HERO BUTTONS ---
    const heroDonateBtn = document.getElementById('heroDonateBtn');
    const heroFindBtn = document.getElementById('heroFindBtn');
    const mapUrl = 'https://www.google.com/maps/dir/?api=1&destination=85-29+Commonwealth+Blvd,+Bellerose,+NY+11426';

    heroDonateBtn?.addEventListener('click', () => {
        document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' });
    });

    heroFindBtn?.addEventListener('click', () => {
        window.open(mapUrl, '_blank');
    });

    // --- 6. FLYER POPUP ---
    const flyerPopup = document.getElementById('flyerPopup');
    if (flyerPopup) {
        const lastShown = localStorage.getItem('flyerLastShown');
        const now = new Date().getTime();
        if (!lastShown || (now - parseInt(lastShown)) > 24 * 60 * 60 * 1000) {
            setTimeout(() => {
                flyerPopup.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                localStorage.setItem('flyerLastShown', now.toString());
            }, 1500);
        }

        document.getElementById('flyerCloseBtn')?.addEventListener('click', () => {
            flyerPopup.classList.remove('is-open');
            document.body.style.overflow = '';
        });
    }

    // --- 7. REVEAL ANIMATIONS ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    function initReveal() {
        const targets = [
            '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
            'h2', '.section-subtitle', '.about-text', '.about-image', 
            '.feature-card', '.aim-card', '.location-info', '.map-embed', 
            '.donation-form', '.zelle-box', '.footer-section', '.footer-bottom',
            '.location-card-modern', '.map-wrapper-modern'
        ];
        document.querySelectorAll(targets.join(',')).forEach(el => {
            revealObserver.observe(el);
        });
    }
    initReveal();

    // --- 8. MODAL SYSTEM ---
    const detailModal = document.createElement('div');
    detailModal.className = 'detail-modal';
    detailModal.innerHTML = `
        <div class="detail-modal-content">
            <button class="detail-modal-close" aria-label="Close details">&times;</button>
            <div class="aim-icon"></div>
            <h3></h3>
            <p></p>
        </div>
    `;
    document.body.appendChild(detailModal);

    const mIcon = detailModal.querySelector('.aim-icon');
    const mTitle = detailModal.querySelector('h3');
    const mDesc = detailModal.querySelector('p');

    function openModal(iconHtml, title, desc) {
        if (!mIcon || !mTitle || !mDesc) return;
        mIcon.innerHTML = iconHtml;
        mTitle.innerHTML = title;
        mDesc.innerHTML = desc;
        detailModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    detailModal.querySelector('.detail-modal-close')?.addEventListener('click', () => {
        detailModal.classList.remove('is-open');
        document.body.style.overflow = '';
    });

    // --- 9. AIM CARDS ---
    document.querySelectorAll('.aim-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateX(${-y * 15}deg) rotateY(${x * 15}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = '');
        card.addEventListener('click', () => {
            const icon = card.querySelector('.aim-icon')?.innerHTML || '';
            const title = card.querySelector('h3')?.innerHTML || '';
            const desc = card.querySelector('p')?.innerHTML || '';
            openModal(icon, title, desc);
        });
    });

    // --- 10. GALLERY ---
    const track = document.getElementById('galleryTrack');
    const slides = Array.from(track?.querySelectorAll('.gallery-slide') || []);
    const dotsContainer = document.getElementById('galleryDots');
    let currentSlide = 0;

    if (track && slides.length > 0 && dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `gallery-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateGallery();
            });
            dotsContainer.appendChild(dot);
        });

        function updateGallery() {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            document.querySelectorAll('.gallery-dot').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });
        }

        document.getElementById('galleryPrev')?.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateGallery();
        });
        document.getElementById('galleryNext')?.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateGallery();
        });
    }

    // --- 11. GOOGLE SHEETS EVENTS ---
    const grid = document.getElementById('eventsGrid');
    const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQTKh0_gIOWVQT33inL_MrUSZX8dzmGBylCN-wtFY8eUHnB9haiz4ubbIxsLT1oRBcTICxtgeicimk-/pub?output=csv';
    window._allEventsData = [];

    async function loadEvents() {
        if (!grid) return;
        try {
            const response = await fetch(SHEETS_URL);
            const csvData = await response.text();
            window._allEventsData = parseCSV(csvData);
            renderEvents(window._allEventsData);
        } catch (e) {
            console.error('Sheet failed');
        }
    }

    function parseCSV(csv) {
        if (!csv) return [];
        const result = [];
        let row = [], col = "", inQuotes = false;
        for (let i = 0; i < csv.length; i++) {
            const char = csv[i], next = csv[i+1];
            if (char === '"' && inQuotes && next === '"') { col += '"'; i++; }
            else if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) { row.push(col.trim()); col = ""; }
            else if ((char === '\r' || char === '\n') && !inQuotes) {
                if (col !== "" || row.length > 0) { row.push(col.trim()); result.push(row); }
                row = []; col = ""; if (char === '\r' && next === '\n') i++;
            } else col += char;
        }
        if (col !== "" || row.length > 0) { row.push(col.trim()); result.push(row); }
        if (result.length < 2) return [];
        const headers = result[0].map(h => h.toLowerCase().replace(/[*"']/g, '').trim());
        return result.slice(1).map(r => {
            const ev = {};
            headers.forEach((h, i) => ev[h] = r[i] ? r[i].replace(/^"|"$/g, '').trim() : '');
            return ev;
        });
    }

    function renderEvents(events) {
        const currentLang = localStorage.getItem('preferredLang') || 'en';
        
        // Sorting and dynamic language handling
        events.sort((a, b) => {
            const parseDate = (d) => {
                if (d.includes('/')) {
                    const [m, day, y] = d.split('/');
                    return new Date(y, m-1, day);
                }
                return new Date(2026, 0, 1);
            };
            return parseDate(a.date) - parseDate(b.date);
        });

        grid.innerHTML = events.map((ev, i) => {
            // Support for language-specific columns in Sheet (e.g. Title_bn, Description_bn)
            const title = ev[`title_${currentLang}`] || ev['title'];
            const desc = ev[`description_${currentLang}`] || ev['description'];
            
            return `
            <div class="event-card reveal">
                ${ev.imageurl ? `<img src="${ev.imageurl}" class="event-image" style="width:100%; height:200px; object-fit:cover; border-radius:8px; margin-bottom:1rem;">` : ''}
                <div class="event-date">${ev.date}</div>
                <h3>${title}</h3>
                <div class="event-meta"><span>🕒 ${ev.time}</span> • <span>${ev.day}</span></div>
                <p class="event-desc">${desc}</p>
                <div class="event-actions"><button class="event-btn" onclick="showEv(${i})">Details</button></div>
            </div>
        `;}).join('');
        
        document.querySelectorAll('.event-card').forEach(card => revealObserver.observe(card));
    }

    window.showEv = (i) => {
        const ev = window._allEventsData[i];
        if (!ev) return;
        const currentLang = localStorage.getItem('preferredLang') || 'en';
        const title = ev[`title_${currentLang}`] || ev['title'];
        const descText = ev[`description_${currentLang}`] || ev['description'];
        
        const iconHtml = ev.imageurl ? `<img src="${ev.imageurl}" style="width:80px; height:80px; border-radius:50%; object-fit:cover;">` : '📅';
        const modalDesc = `<div style="text-align:left; margin-top:1rem;">
            <div style="background:#f8f1e3; padding:1rem; border-radius:10px; margin-bottom:1rem; display:flex; gap:1rem; flex-wrap:wrap; justify-content:center;">
                <span>📅 <strong>${ev.date}</strong></span>
                <span>🕒 <strong>${ev.time}</strong></span>
            </div>
            ${descText}
        </div>`;
        openModal(iconHtml, title, modalDesc);
    };

    loadEvents();

    // --- 12. DONATIONS ---
    const donationForm = document.getElementById('donationForm');
    donationForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = document.getElementById('customAmount')?.value;
        const type = document.getElementById('donationType')?.value || 'one-time';
        if (!amount || amount <= 0) return alert('Please enter an amount');

        const STRIPE_LINKS = {
            'one-time': 'https://donate.stripe.com/your_one_time_link',
            'monthly': 'https://donate.stripe.com/your_monthly_link'
        };

        let link = STRIPE_LINKS[type] || STRIPE_LINKS['one-time'];
        const cents = Math.round(parseFloat(amount) * 100);
        window.location.href = `${link}${link.includes('?') ? '&' : '?'}prefilled_amount=${cents}`;
    });

    document.getElementById('copyZelleBtn')?.addEventListener('click', () => {
        const id = document.getElementById('zelleId')?.textContent;
        if (id) {
            navigator.clipboard.writeText(id).then(() => {
                const btn = document.getElementById('copyZelleBtn');
                const icon = btn.querySelector('span');
                icon.textContent = 'check';
                setTimeout(() => icon.textContent = 'content_copy', 2000);
            });
        }
    });

    // Ripple effect
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn, .event-btn, .submit-btn, .amount-btn');
        if (btn) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `width:${size}px; height:${size}px; left:${e.clientX - rect.left - size/2}px; top:${e.clientY - rect.top - size/2}px;`;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    });
});
