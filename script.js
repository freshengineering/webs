document.addEventListener('DOMContentLoaded', () => {
    // Enable JS-only scroll reveal (content stays visible if JS/CSS fails)
    document.body.classList.add('js-reveal');

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
            mobileBtn.setAttribute('aria-expanded', mobileBtn.classList.contains('active'));
            // Animate hamburger to X
            const spans = mobileBtn.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }

    const closeMobileMenu = () => {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileBtn) {
                mobileBtn.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                mobileBtn.querySelectorAll('span').forEach(span => span.classList.remove('active'));
            }
        }
    };

    // Close mobile menu when a nav link is clicked (CSS handles smooth scrolling)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu on Escape or click outside the nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) && mobileBtn && !mobileBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.service-card, .project-card, .about-text, .section-title');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Simple Form Submission Handler (Prevent default reload)
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            const status = form.querySelector('.form-status');
            const setStatus = (msg, ok) => {
                if (!status) return;
                status.textContent = msg;
                status.classList.remove('is-success', 'is-error');
                status.classList.add(ok ? 'is-success' : 'is-error');
            };

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';

            // Get form data
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    setStatus('Thanks — your message has been sent. We’ll respond within one business day.', true);
                    form.reset();
                } else {
                    const data = await response.json();
                    const msg = (data && data.errors)
                        ? data.errors.map(error => error.message).join(', ')
                        : 'Something went wrong. Please email info@freshengineering.com.au or call 0492 930 492.';
                    setStatus(msg, false);
                }
            } catch (error) {
                setStatus('Network error. Please email info@freshengineering.com.au or call 0492 930 492.', false);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }
});
