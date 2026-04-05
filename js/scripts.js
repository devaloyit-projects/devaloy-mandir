
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll progress bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    // Add back to top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    // Dark Mode Toggle
    const darkModeBtn = document.createElement('button');
    darkModeBtn.className = 'dark-mode-toggle';
    darkModeBtn.innerHTML = '🌙';
    darkModeBtn.setAttribute('aria-label', 'Toggle Dark Mode');
    document.querySelector('.nav-container').appendChild(darkModeBtn);

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '☀️';
    }

    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const darkActive = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', darkActive);
        darkModeBtn.innerHTML = darkActive ? '☀️' : '🌙';
    });

    // Scroll progress update
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercent = (scrollTop / scrollHeight) * 100;
                scrollProgress.style.width = scrollPercent + '%';

                // Back to top button visibility
                if (scrollTop > 500) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }

                // Navbar scroll effect
                const nav = document.querySelector('nav');
                if (scrollTop > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // Back to top click handler
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const heroDonateBtn = document.getElementById('heroDonateBtn');
    const heroFindBtn = document.getElementById('heroFindBtn');
    const donationForm = document.getElementById('donationForm');
    const mapUrl = 'https://www.google.com/maps/search/?api=1&query=85-29+Commonwealth+Blvd,+Bellerose,+NY+11426';
    const flyerPopup = document.getElementById('flyerPopup');
    const flyerCloseBtn = document.getElementById('flyerCloseBtn');

    function closeFlyerPopup() {
        flyerPopup?.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function openFlyerPopup() {
        flyerPopup?.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    // Delay flyer popup slightly with "Smart" logic (Once every 24 hours)
    function shouldShowFlyer() {
        const lastShown = localStorage.getItem('flyerLastShown');
        if (!lastShown) return true;
        
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const now = new Date().getTime();
        return (now - parseInt(lastShown)) > twentyFourHours;
    }

    if (shouldShowFlyer()) {
        setTimeout(() => {
            openFlyerPopup();
            localStorage.setItem('flyerLastShown', new Date().getTime().toString());
        }, 1500);
    }
    
    flyerCloseBtn?.addEventListener('click', closeFlyerPopup);
    flyerPopup?.addEventListener('click', (event) => {
        if (event.target === flyerPopup) closeFlyerPopup();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeFlyerPopup();
    });

    // Zelle Copy to Clipboard
    const copyZelleBtn = document.getElementById('copyZelleBtn');
    const zelleId = document.getElementById('zelleId');

    copyZelleBtn?.addEventListener('click', () => {
        const email = zelleId.textContent;
        navigator.clipboard.writeText(email).then(() => {
            const icon = copyZelleBtn.querySelector('.material-symbols-outlined');
            const originalIcon = icon.textContent;
            
            icon.textContent = 'check';
            copyZelleBtn.classList.add('copied');
            
            setTimeout(() => {
                icon.textContent = originalIcon;
                copyZelleBtn.classList.remove('copied');
            }, 2000);
        });
    });

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', String(isExpanded));
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMenu();
        }
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Smooth scroll
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    heroDonateBtn?.addEventListener('click', () => scrollToSection('donate'));
    heroFindBtn?.addEventListener('click', () => window.open(mapUrl, '_blank'));

    // Donation amount selection
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('customAmount').value = this.dataset.amount;
        });
    });

    // Initialize Stripe (Replace with your actual publishable key)
    const stripe = typeof Stripe !== 'undefined' ? Stripe('pk_test_51O4M6CSI7z9u8m8k6k6k6k6k6k6k6k6k') : null;

    // Check for payment success/cancel in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
        alert('🙏 Thank you for your generous donation! You will receive an email confirmation shortly.');
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('canceled')) {
        alert('The donation process was canceled. If you encountered any issues, please contact us.');
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Handle donation form submission
    async function handleDonation(event) {
        event.preventDefault();
        const submitBtn = event.target.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;

        const name = document.getElementById('donorName').value;
        const email = document.getElementById('donorEmail').value;
        const amount = document.getElementById('customAmount').value;
        const type = document.getElementById('donationType').value;

        if (!amount || amount <= 0) {
            alert('Please select or enter a donation amount');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Redirecting...';

            // --- ZERO-COST HOSTING (GITHUB PAGES) ---
            // Replace the URL below with your actual Stripe Payment Link from your Dashboard
            // Recommendation: Create a "Pay what you want" link for general donations
            const stripePaymentLink = 'https://donate.stripe.com/your-payment-link-placeholder';
            
            // Redirect to Stripe directly
            window.location.href = stripePaymentLink;

            /* 
            // DEPRECATED: Server-side logic (requires Node.js)
            const response = await fetch('/api/create-checkout-session', { ... });
            ...
            */
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again later.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
    donationForm?.addEventListener('submit', handleDonation);

    // Scroll reveal animation observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .about-text, .about-image, .feature-card, .location-info, .map-embed, .donation-form, .aim-card, .event-card, .gallery-item, .footer-section, .footer-bottom, h2, .section-subtitle');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Add stagger animation to cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Aims & Objectives Interactivity
    const aimCards = document.querySelectorAll('.aim-card');
    
    // Create Detail Modal
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

    const modalContent = detailModal.querySelector('.detail-modal-content');
    const modalIcon = detailModal.querySelector('.aim-icon');
    const modalTitle = detailModal.querySelector('h3');
    const modalDesc = detailModal.querySelector('p');
    const modalClose = detailModal.querySelector('.detail-modal-close');

    function closeDetailModal() {
        detailModal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeDetailModal);
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) closeDetailModal();
    });

    aimCards.forEach(card => {
        // 3D Tilt Effect
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });

        // Modal Open
        card.addEventListener('click', () => {
            const icon = card.querySelector('.aim-icon').innerHTML;
            const title = card.querySelector('h3').innerHTML;
            const desc = card.querySelector('p').innerHTML;

            modalIcon.innerHTML = icon;
            modalTitle.innerHTML = title;
            modalDesc.innerHTML = desc + "<br><br>Our commitment to this objective is unwavering. We strive to create a meaningful impact through dedicated practice, community engagement, and a focus on long-term spiritual and social well-being.";
            
            detailModal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        });

        // Animation Delay
        const index = Array.from(aimCards).indexOf(card);
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // Enhanced hover effects for gallery items
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // Gallery carousel
    const galleryTrack = document.getElementById('galleryTrack');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const galleryDots = document.getElementById('galleryDots');
    const galleryCarousel = document.getElementById('galleryCarousel');
    const gallerySlides = galleryTrack ? Array.from(galleryTrack.querySelectorAll('.gallery-slide')) : [];
    let activeSlideIndex = 0;
    let galleryAutoplayId = null;

    function renderGalleryDots() {
        if (!galleryDots) return;
        galleryDots.innerHTML = gallerySlides.map((_, index) =>
            `<button class="gallery-dot${index === activeSlideIndex ? ' active' : ''}" type="button" data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>`
        ).join('');
    }

    function goToGallerySlide(index) {
        if (!galleryTrack || gallerySlides.length === 0) return;
        activeSlideIndex = (index + gallerySlides.length) % gallerySlides.length;
        galleryTrack.style.transform = `translateX(-${activeSlideIndex * 100}%)`;
        renderGalleryDots();
    }

    function startGalleryAutoplay() {
        if (gallerySlides.length <= 1) return;
        stopGalleryAutoplay();
        galleryAutoplayId = window.setInterval(() => {
            goToGallerySlide(activeSlideIndex + 1);
        }, 4500);
    }

    function stopGalleryAutoplay() {
        if (galleryAutoplayId) {
            window.clearInterval(galleryAutoplayId);
            galleryAutoplayId = null;
        }
    }

    if (gallerySlides.length > 0) {
        renderGalleryDots();
        goToGallerySlide(0);

        galleryPrev?.addEventListener('click', () => goToGallerySlide(activeSlideIndex - 1));
        galleryNext?.addEventListener('click', () => goToGallerySlide(activeSlideIndex + 1));
        galleryDots?.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            const slideIndex = Number(target.dataset.slide);
            if (Number.isFinite(slideIndex)) goToGallerySlide(slideIndex);
        });

        galleryCarousel?.addEventListener('mouseenter', stopGalleryAutoplay);
        galleryCarousel?.addEventListener('mouseleave', startGalleryAutoplay);
        galleryCarousel?.addEventListener('focusin', stopGalleryAutoplay);
        galleryCarousel?.addEventListener('focusout', startGalleryAutoplay);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopGalleryAutoplay();
            else startGalleryAutoplay();
        });

        startGalleryAutoplay();
    }

    // Load and Render Events
    async function loadEvents() {
        const grid = document.getElementById('eventsGrid');
        if (!grid) return;

        // Default fallback events if API fails or file is opened locally
        const fallbackEvents = [
            { title: "Full Moon Meditation", date: "Feb 2", day: "Wednesday", time: "7:00 PM - 8:30 PM", description: "Join us for a special guided meditation under the full moon." },
            { title: "Community Charity Drive", date: "Feb 15", day: "Saturday", time: "10:00 AM - 2:00 PM", description: "Help us support local families in need. Donate goods or time." },
            { title: "Spiritual Workshop", date: "Feb 20", day: "Thursday", time: "6:00 PM - 8:00 PM", description: "Explore ancient wisdom traditions and modern applications." }
        ];

        let eventsToRender = [];

        try {
            // Try API first (for local backend), fallback to static JSON (for GitHub Pages)
            let response = await fetch('/api/events');
            if (!response.ok) {
                response = await fetch('events.json');
            }

            if (response.ok) {
                const data = await response.json();
                if (data.events && Array.isArray(data.events)) {
                    eventsToRender = data.events;
                }
            }
        } catch (e) {
            console.log('Using fallback events data');
            eventsToRender = fallbackEvents;
        }

        // If we have no events after trying API, use fallbacks
        if (eventsToRender.length === 0) {
            eventsToRender = fallbackEvents;
        }

        // Sort events by date (assuming they follow "Month Day" format)
        const months = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
        eventsToRender.sort((a, b) => {
            const [aMonth, aDay] = a.date.split(' ');
            const [bMonth, bDay] = b.date.split(' ');
            const aDate = new Date(2026, months[aMonth] || 0, parseInt(aDay) || 1);
            const bDate = new Date(2026, months[bMonth] || 0, parseInt(bDay) || 1);
            return aDate - bDate;
        });

        grid.innerHTML = eventsToRender.map(event => {
            const imageHtml = event.image ? `<img src="${event.image}" alt="${escapeHtml(event.title)}" class="event-image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">` : '';
            return `
            <div class="event-card reveal">
                ${imageHtml}
                <div class="event-date">${escapeHtml(event.date)}</div>
                <h3>${escapeHtml(event.title)}</h3>
                <div class="event-meta">
                    <span class="event-time">🕒 ${escapeHtml(event.time)}</span>
                    <span>• ${escapeHtml(event.day)}</span>
                </div>
                <p class="event-desc">${escapeHtml(event.description)}</p>
                <div class="event-actions">
                    <button class="event-btn">Details</button>
                </div>
            </div>
        `;
        }).join('');
        
        // Re-initialize reveal animations for new elements
        if (typeof revealObserver !== 'undefined') {
            document.querySelectorAll('.event-card.reveal').forEach(el => {
                revealObserver.observe(el);
            });
        }
    }
    
    // Listen for updates from the admin panel "tunnel"
    const eventChannel = new BroadcastChannel('devaloy-events-channel');
    eventChannel.onmessage = (event) => {
        if (event.data === 'event-updated') {
            console.log('Received push update from admin panel, refreshing events...');
            loadEvents();
        }
    };

    loadEvents();

    // Utility function to escape HTML
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Parallax effect for hero section
    let isParallaxScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isParallaxScrolling) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                if (hero && scrolled < window.innerHeight) {
                    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
                }
                isParallaxScrolling = false;
            });
            isParallaxScrolling = true;
        }
    }, { passive: true });

    // Add ripple effect to buttons
    function createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    document.querySelectorAll('.btn, .event-btn, .submit-btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Add ripple keyframe
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
                if (navLink) {
                    document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('is-active'));
                    navLink.classList.add('is-active');
                }
            }
        });
    }, { threshold: 0.3, rootMargin: "-100px 0px" });

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Expose functions for inline handlers if any remain
    window.scrollToSection = scrollToSection;
    window.handleDonation = handleDonation;
});
