/**
 * Andrea Blangino - Reconectando Bio
 * Navegación: menú hamburguesa en móvil, accesible (ARIA, teclado, foco).
 * Navbar: sombra al hacer scroll.
 * FAQ: acordeón expandible (uno abierto a la vez).
 * Contadores animados al entrar en viewport.
 * Recursos: carrusel de videos (un video a la vez, flechas y dots).
 */
(function () {
    'use strict';

    var body = document.body;
    var nav = document.querySelector('.nav-bar');
    var trigger = document.querySelector('.nav-trigger');
    var menu = document.getElementById('nav-menu-mobile');
    var backdrop = menu ? menu.querySelector('.nav-menu-backdrop') : null;
    var menuLinks = menu ? menu.querySelectorAll('.nav-menu-link, .nav-menu-cta') : [];
    var openClass = 'nav-menu-open';
    var labelOpen = 'Cerrar menú de navegación';
    var labelClosed = 'Abrir menú de navegación';

    function isMenuOpen() {
        return body.classList.contains(openClass);
    }

    function openMenu() {
        if (!nav || !trigger || !menu) return;
        body.classList.add(openClass);
        trigger.setAttribute('aria-expanded', 'true');
        trigger.setAttribute('aria-label', labelOpen);
        menu.setAttribute('aria-hidden', 'false');
        if (menuLinks.length) {
            setTimeout(function () {
                menuLinks[0].focus();
            }, 100);
        }
    }

    function closeMenu() {
        if (!nav || !trigger || !menu) return;
        body.classList.remove(openClass);
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-label', labelClosed);
        menu.setAttribute('aria-hidden', 'true');
        trigger.focus();
    }

    function toggleMenu() {
        if (isMenuOpen()) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function handleTriggerClick(e) {
        e.preventDefault();
        toggleMenu();
    }

    function handleLinkClick() {
        if (isMenuOpen()) {
            closeMenu();
        }
    }

    function handleKeydown(e) {
        if (e.key !== 'Escape') return;
        if (isMenuOpen()) {
            e.preventDefault();
            closeMenu();
        }
    }

    function initNav() {
        if (!trigger || !menu) return;

        trigger.addEventListener('click', handleTriggerClick);
        menu.setAttribute('aria-hidden', 'true');

        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].addEventListener('click', handleLinkClick);
        }

        if (backdrop) {
            backdrop.addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', handleKeydown);
    }

    // ----- Navbar: sombra al hacer scroll -----
    function initNavScroll() {
        if (!nav) return;
        function onScroll() {
            if (window.scrollY > 20) {
                nav.classList.add('nav-bar-scrolled');
            } else {
                nav.classList.remove('nav-bar-scrolled');
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ----- FAQ Accordion -----
    function initFaq() {
        var triggers = document.querySelectorAll('.faq-trigger');
        var items = document.querySelectorAll('.faq-item');

        function closeAll() {
            for (var i = 0; i < triggers.length; i++) {
                triggers[i].setAttribute('aria-expanded', 'false');
            }
            for (var j = 0; j < items.length; j++) {
                var content = items[j].querySelector('.faq-content');
                if (content) {
                    content.style.maxHeight = '0';
                    content.setAttribute('aria-hidden', 'true');
                }
            }
        }

        function openPanel(btn, content) {
            if (!content) return;
            content.style.maxHeight = content.scrollHeight + 'px';
            content.setAttribute('aria-hidden', 'false');
            btn.setAttribute('aria-expanded', 'true');
        }

        for (var i = 0; i < triggers.length; i++) {
            (function (btn) {
                var item = btn.closest('.faq-item');
                var content = item ? item.querySelector('.faq-content') : null;

                btn.addEventListener('click', function () {
                    var isExpanded = btn.getAttribute('aria-expanded') === 'true';
                    closeAll();
                    if (!isExpanded && content) {
                        openPanel(btn, content);
                    }
                });
            })(triggers[i]);
        }
    }

    // ----- Contadores animados (viewport) -----
    function initCounters() {
        var counters = document.querySelectorAll('.stat-number[data-counter]');
        if (!counters.length) return;

        function formatValue(current, suffix) {
            if (suffix === 'k+') {
                return current + 'k+';
            }
            return current + (suffix || '');
        }

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-counter'), 10);
            var suffix = el.getAttribute('data-suffix') || '+';
            var duration = 1500;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var easeOut = 1 - Math.pow(1 - progress, 2);
                var current = Math.round(start + (target - start) * easeOut);
                el.textContent = formatValue(current, suffix);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.textContent = formatValue(target, suffix);
                }
            }

            window.requestAnimationFrame(step);
        }

        var observer = new IntersectionObserver(
            function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    if (entries[i].isIntersecting) {
                        var el = entries[i].target;
                        if (!el.hasAttribute('data-counted')) {
                            el.setAttribute('data-counted', 'true');
                            animateCounter(el);
                        }
                        observer.unobserve(el);
                    }
                }
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
        );

        for (var j = 0; j < counters.length; j++) {
            observer.observe(counters[j]);
        }
    }

    // ----- Video carousel (Recursos) -----
    var VIDEO_EMBEDS = [
        'https://www.youtube.com/embed/NetMzf0Xle8?start=3',
        'https://www.youtube.com/embed/D8xBGy54phQ?start=2',
        'https://www.youtube.com/embed/0HoeNWtTxhI',
        'https://www.youtube.com/embed/GGdPz02RkTo'
    ];

    function initVideoCarousel() {
        var carousel = document.getElementById('video-carousel');
        var iframe = document.getElementById('video-carousel-iframe');
        var prevBtn = document.getElementById('video-carousel-prev');
        var nextBtn = document.getElementById('video-carousel-next');
        var dots = carousel ? carousel.querySelectorAll('.video-carousel__dot') : [];

        if (!carousel || !iframe || !prevBtn || !nextBtn) return;

        var current = 0;
        var total = VIDEO_EMBEDS.length;

        function goTo(index) {
            current = (index + total) % total;
            iframe.src = VIDEO_EMBEDS[current];
            iframe.title = 'Video ' + (current + 1) + ' — Andrea Blangino';

            for (var d = 0; d < dots.length; d++) {
                dots[d].setAttribute('aria-selected', d === current ? 'true' : 'false');
            }
        }

        prevBtn.addEventListener('click', function () {
            goTo(current - 1);
        });
        nextBtn.addEventListener('click', function () {
            goTo(current + 1);
        });

        for (var i = 0; i < dots.length; i++) {
            (function (idx) {
                dots[idx].addEventListener('click', function () {
                    goTo(idx);
                });
            })(i);
        }

        carousel.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goTo(current - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goTo(current + 1);
            }
        });
    }

    function init() {
        initNav();
        initNavScroll();
        initFaq();
        initCounters();
        initVideoCarousel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
