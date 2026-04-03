// ============================================
// NoHumanOps — Minimal Interactive JS
// ============================================

(function () {
    'use strict';

    // ---- DOM Elements ----
    const topbar = document.getElementById('topbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    let overlay = null;

    // ---- Create overlay for mobile nav ----
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.classList.add('nav-overlay');
        document.body.appendChild(overlay);
        overlay.addEventListener('click', closeNav);
    }

    // ---- Mobile Nav Toggle ----
    function openNav() {
        navLinks.classList.add('open');
        mobileToggle.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleNav() {
        if (navLinks.classList.contains('open')) {
            closeNav();
        } else {
            openNav();
        }
    }

    // ---- Topbar scroll effect ----
    function handleScroll() {
        if (window.scrollY > 40) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    }

    // ---- Scroll Reveal ----
    function initScrollReveal() {
        // Add .reveal class to elements we want to animate
        const revealSelectors = [
            '.card',
            '.step',
            '.stat-card',
            '.proof-quote',
            '.cta-box',
            '.section-label',
            '.section-title',
            '.section-subtitle'
        ];

        revealSelectors.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el) {
                el.classList.add('reveal');
            });
        });

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        // Stagger animations for grid children
                        const parent = entry.target.parentElement;
                        if (parent) {
                            const siblings = Array.from(parent.children).filter(function (c) {
                                return c.classList.contains('reveal');
                            });
                            const index = siblings.indexOf(entry.target);
                            const delay = index * 100;
                            entry.target.style.transitionDelay = delay + 'ms';
                        }
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        document.querySelectorAll('.reveal').forEach(function (el) {
            observer.observe(el);
        });
    }

    // ---- Smooth scroll for anchor links ----
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    closeNav();
                    const offset = topbar.offsetHeight + 16;
                    const y = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            });
        });
    }

    // ---- Close mobile nav on link click ----
    function initNavLinkClose() {
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeNav();
            });
        });
    }

    // ---- Init ----
    function init() {
        createOverlay();
        mobileToggle.addEventListener('click', toggleNav);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // check initial state

        initSmoothScroll();
        initNavLinkClose();

        // Delay reveal init slightly so CSS is painted
        requestAnimationFrame(function () {
            initScrollReveal();
        });
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();