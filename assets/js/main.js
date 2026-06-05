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
    var root = document.documentElement;
    var nav = document.querySelector('.nav-bar');
    var navInner = document.querySelector('.nav-bar-inner');
    var trigger = document.getElementById('nav-trigger') || document.querySelector('.nav-trigger');
    var menu = document.getElementById('nav-menu-mobile');
    var backdrop = menu ? menu.querySelector('.nav-menu-backdrop') : null;
    var menuLinks = menu ? menu.querySelectorAll('.nav-menu-link, .nav-menu-cta') : [];
    var openClass = 'nav-menu-open';
    var labelOpen = 'Cerrar menú de navegación';
    var labelClosed = 'Abrir menú de navegación';
    var lockedScrollY = 0;
    var desktopNavBreakpoint = 1280;

    function isMobileNav() {
        return window.innerWidth < desktopNavBreakpoint;
    }

    function isMenuOpen() {
        return body.classList.contains(openClass);
    }

    function syncNavMenuOffset() {
        if (!navInner) return;
        var height = Math.ceil(navInner.getBoundingClientRect().height);
        root.style.setProperty('--nav-menu-top', height + 'px');
    }

    function lockBodyScroll() {
        body.classList.add(openClass);
        if (!isMobileNav()) return;
        lockedScrollY = window.scrollY;
        body.style.position = 'fixed';
        body.style.top = '-' + lockedScrollY + 'px';
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
    }

    function unlockBodyScroll() {
        body.classList.remove(openClass);
        if (body.style.position !== 'fixed') return;
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.width = '';
        window.scrollTo(0, lockedScrollY);
    }

    function openMenu() {
        if (!nav || !trigger || !menu) return;
        syncNavMenuOffset();
        lockBodyScroll();
        trigger.setAttribute('aria-expanded', 'true');
        trigger.setAttribute('aria-label', labelOpen);
        menu.setAttribute('aria-hidden', 'false');
        if (menuLinks.length) {
            setTimeout(function () { menuLinks[0].focus(); }, 120);
        }
    }

    function closeMenu() {
        if (!nav || !trigger || !menu) return;
        unlockBodyScroll();
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

        // Portal: fixed overlay must not live inside sticky nav (iOS/Android hit-test bugs).
        if (menu.parentElement !== body) {
            body.appendChild(menu);
        }

        syncNavMenuOffset();
        if (typeof ResizeObserver !== 'undefined' && navInner) {
            var navResizeObserver = new ResizeObserver(syncNavMenuOffset);
            navResizeObserver.observe(navInner);
        } else {
            window.addEventListener('resize', syncNavMenuOffset);
        }
        window.addEventListener('orientationchange', syncNavMenuOffset);

        trigger.addEventListener('click', handleTriggerClick);
        menu.setAttribute('aria-hidden', 'true');

        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].addEventListener('click', handleLinkClick);
        }

        if (backdrop) {
            backdrop.addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', handleKeydown);

        window.addEventListener('resize', function () {
            syncNavMenuOffset();
            // Close only when switching to desktop navbar (>=1280 / Tailwind xl),
            // otherwise opening the menu can trigger a "resize" (scrollbar) and immediately close it.
            if (window.innerWidth >= desktopNavBreakpoint && isMenuOpen()) closeMenu();
        });
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

    // ----- Fade-in al scroll (elementos con .fade-in-scroll) -----
    function initFadeInScroll() {
        var elements = document.querySelectorAll('.fade-in-scroll');
        if (!elements.length) return;
        var observer = new IntersectionObserver(
            function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    if (entries[i].isIntersecting) {
                        entries[i].target.classList.add('visible');
                    }
                }
            },
            { threshold: 0.15 }
        );
        for (var j = 0; j < elements.length; j++) {
            observer.observe(elements[j]);
        }
    }

    // ----- Imágenes con data-src: fallback IO + fade-in -----
    function initLazyImages() {
        var imgs = document.querySelectorAll('img[data-src]');
        if (!imgs.length) return;

        function reveal(el) {
            var ds = el.getAttribute('data-src');
            if (ds) {
                el.src = ds;
            }
            el.classList.add('img-loaded');
        }

        if (typeof IntersectionObserver === 'undefined') {
            for (var i = 0; i < imgs.length; i++) {
                reveal(imgs[i]);
            }
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                for (var k = 0; k < entries.length; k++) {
                    if (entries[k].isIntersecting) {
                        var el = entries[k].target;
                        reveal(el);
                        observer.unobserve(el);
                    }
                }
            },
            { rootMargin: '200px 0px', threshold: 0 }
        );

        for (var j = 0; j < imgs.length; j++) {
            observer.observe(imgs[j]);
        }
    }

    // ----- Formación hero: animate on scroll -----
    function initFormacionHero() {
        var section = document.getElementById('formacion');
        if (!section || !section.classList.contains('formacion-hero')) return;

        var observer = new IntersectionObserver(
            function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    if (entries[i].isIntersecting) {
                        entries[i].target.classList.add('formacion-visible');
                        observer.unobserve(entries[i].target);
                    }
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(section);
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

        function withEmbedOrigin(url) {
            if (!window.location.origin || window.location.origin === 'null') return url;
            return url + (url.indexOf('?') === -1 ? '?' : '&') + 'origin=' + encodeURIComponent(window.location.origin);
        }

        function goTo(index) {
            current = (index + total) % total;
            iframe.src = withEmbedOrigin(VIDEO_EMBEDS[current]);
            iframe.title = 'Video ' + (current + 1) + ' — Andrea Blangino';

            for (var d = 0; d < dots.length; d++) {
                dots[d].setAttribute('aria-selected', d === current ? 'true' : 'false');
            }

            var status = document.getElementById('video-carousel-status');
            if (status) status.textContent = 'Video ' + (current + 1) + ' de ' + total;
        }

        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.src = withEmbedOrigin(VIDEO_EMBEDS[current]);

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

    // ----- Slider de reseñas (página formación) -----
    var REVIEWS_GOOGLE_URL = 'https://www.google.com/search?q=andrea+blangino+biodecodificacion';
    var REVIEWS_DATA = [
        { author: 'Valeria', date: 'Hace 2 semanas', rating: 5, text: 'Mí experiencia con Andrea fue y sigue siendo excelente! No solo por su profesionalismo y empatía, sino con los resultados luego de la consulta. Realmente pude resolver muchas cosas y sigo haciéndolo, sino que logré modificar muchas otras que venía trayendo de muchos años. Hay un antes y un después en mi vida a partir de la consulta con Andrea. Solo me queda por decir, GRACIAS, GRACIAS , GRACIAS!' },
        { author: 'Johana Murador', date: 'Hace 1 mes', rating: 5, text: 'Mi camino comenzó con personas maravillosas que llegaron a mi vida y una de ellas es Andrea ❤️. Hermosa experiencia en cada consulta, con mucho amor y acompañamiento. Su conocimiento y comprensión son una caricia al Alma. Sin dudas una gran maestra 💛.' },
        { author: 'Luciana', date: 'Hace 3 semanas', rating: 5, text: 'Andrea es muy profesional, cálida y es portadora de un canal hermoso de luz y amor. Además hace un seguimiento y te aporta muchas herramientas. Súper recomendable' },
        { author: 'Carolina Elfstrom', date: 'Hace 2 meses', rating: 5, text: 'Amo a Andrea! Una genia total. Impresionante la claridad que tiene para canalizar y para explicar, un amor, una sencillez... Es espectacular! Un antes y un después en mí vida! 💗' },
        { author: 'Jesica Bringas', date: 'Hace 1 mes', rating: 5, text: 'Andre gracias por tu hermosa energía, por acompañar con tanto amor y dulzura cada proceso de sanación! Sos mágica! Gracias por tanto!' },
        { author: 'Vane Barañano', date: 'Hace 3 semanas', rating: 5, text: 'Agradezco con todo mi corazón haberme encontrado con Andrea, en un momento de mi vida que me sentía mal siempre y en el fondo sabía que algo andaba mal conmigo misma. Andrea me enseñó y me mostró otra manera de ver lo que me había pasado, aprender de esas experiencias, comprender que las dificultades son para crecer y somos responsables de cómo las manejamos y las vivimos.' },
        { author: 'Veronica Tellechea', date: 'Hace 2 semanas', rating: 5, text: 'Excelente taller. Con importantes herramientas para analizar y tomar conciencia de los para que del " cancer" . Que nos vino a mostrar y a enseñar. Y como seres integrales que somos ,como podemos sanar.Gracias Andrea por ser tan clara y amorosa' },
        { author: 'Veronica del Arca', date: 'Hace 1 mes', rating: 5, text: 'Andrea es una persona sumamente amorosa ! Y logra con sus palabras y su experiencia que podamos entender situaciones de nuestro clan y de nuestra vida que están íntimamente conectados, que de otra forma serían muy dolorosas comprender!' },
        { author: 'Silvia Oliver', date: 'Hace 2 meses', rating: 5, text: 'Mi experiencia con Andrea siempre ha sido altamente satisfactoria, no solo a nivel humano, sino a nivel profesional. La Sra Andrea está pendiente de sus pacientes , y busca alternativas posibles para ayudar y para que cada ser se sienta mejor cada día, y pueda lograr sanar el alma. Excelente experiencia.' },
        { author: 'Linnatte Castellanos', date: 'Hace 3 semanas', rating: 5, text: 'De corazón les digo que Andrea y su terapia es lo mejor que me a pasado, lo digo con honestidad. He hecho muchos tipos de terapia y si me habían ayudado, pero llegar a Andrea y hacer la biodecodificacion era lo que me faltaba y de verdad comprendí muchas cosas y esto ayudo a mi sanación y a aprender desde la conciencia y a tener herramientas. La recomiendo al 1000%.' }
    ];

    var FORMATION_REVIEWS_DATA = [
        {
            author: 'Adriana Garay “Petro”',
            date: 'Junio 2026',
            rating: 5,
            text: 'Excelente formación. Muy recomendada. Es un cambio de paradigma de la manera de mirar a la enfermedad y síntoma. Andrea es muy profesional, tiene una esmerada pasión por lo que hace y lo transmite a sus alumnos y consultantes. Muy responsable junto a Pablo, que no deja pasar ningún detalle. Todo muy impecable. Agradezco que se me cruzaran en mi camino.'
        },
        {
            author: 'Marisa',
            date: 'Junio 2026',
            rating: 5,
            text: 'Excelente formación. El programa, la exposición de los temas y la progresión del aprendizaje están diseñados para que puedas acompañar al otro desde un lugar empático y profesional. El grupo humano detrás de la escuela es sumamente contenedor e incondicional. Gracias, gracias, gracias.'
        },
        {
            author: 'Melisa Helmer',
            date: 'Junio 2026',
            rating: 5,
            text: 'Mi primera consulta con Andrea fue un antes y un después en mi vida. Tuve resultados inmediatos, no lo podía creer. Este año comencé a formarme con ella en Biodecodificación. Me encanta esta formación. Amo esta herramienta y la forma de enseñarlo de Andrea, poniendo toda su experiencia en cada clase y haciéndolo tan práctico que podemos entender, relacionar y pasar por el cuerpo. Lo recomiendo 100%.'
        },
        {
            author: 'Lorena Díaz Insua',
            date: 'Junio 2026',
            rating: 5,
            text: 'Un antes y un después cuando conoces esta otra forma de razonar la vida, la salud y todo lo que fui aprendiendo hasta ahora. Soy médica y la verdad se me abrió un mundo totalmente nuevo. Eternamente agradecida.'
        },
        {
            author: 'Marcela Palacio',
            date: 'Junio 2026',
            rating: 5,
            text: 'Andrea, excelente profesional. Cada clase es un eterno placer. Su acompañamiento, su forma de enseñarnos, en cada detalle, nuestros manuales son clarísimos y muy detallados. Excelente. Se nota el gran amor y respeto por esta formación. Gracias, gracias, gracias.'
        },
        {
            author: 'Paola Cuello',
            date: 'Junio 2026',
            rating: 5,
            text: 'Hace mucho que esperaba poder estudiar esto y este año tuve la oportunidad. Más que nada con Andrea, que es una hermosa persona y nos brinda su sabiduría muy amorosamente y desde el corazón. Su nivel de enseñanza es excelente y con un grupo de trabajo y apoyo genial, espectacular. Gracias, gracias, gracias Andre y Flia. Vamos por esta Primer Formación de Estudio brillante.'
        },
        {
            author: 'Valentina Sabena',
            date: 'Junio 2026',
            rating: 5,
            text: 'Una experiencia hermosa. Estoy aprendiendo muchísimo y cada clase me aporta algo nuevo, tanto en lo personal como en lo emocional. Se nota la dedicación, el amor y la pasión con la que enseña. Muy recomendable para quienes quieran sanar, comprender y crecer desde otra mirada.'
        },
        {
            author: 'Monica Arguello',
            date: 'Junio 2026',
            rating: 5,
            text: 'Excelente formación, muy didáctica la enseñanza y bibliografía con texto e imágenes ilustrativas. Clarísimo lo teórico y práctico. Súper recomendable.'
        },
        {
            author: 'Silvina Rodriguez',
            date: 'Junio 2026',
            rating: 5,
            text: 'Soy alumna de la formación de Biodecodificación de Andrea. Estoy teniendo una experiencia que va modificando mi forma de ver las cosas. Estoy contenta y agradecida por los conocimientos que estoy recibiendo de su grupo de trabajo. Súper recomiendo esta formación.'
        },
        {
            author: 'Eugenia Manzanelli',
            date: 'Junio 2026',
            rating: 5,
            text: 'Mi experiencia en la formación de Biodecodificación es hermosa y maravilloso el camino que no sabía que existía. Andrea y su equipo son seres maravillosos que brindan todo su conocimiento para uno poder comprender esto mágico que nos brinda nuestra biología. Más que agradecida de ser parte de esta formación.'
        }
    ];

    function getVisibleSlides() {
        var w = window.innerWidth;
        if (w >= 1024) return 2;
        if (w >= 768) return 2;
        return 1;
    }

    function initReviewsSlider() {
        var container = document.getElementById('testimonios-section');
        var inner = document.getElementById('reviews-slider-inner');
        var dotsContainer = container ? container.querySelector('.slider-dots') : null;
        var prevBtn = container ? container.querySelector('.slider-btn--prev') : null;
        var nextBtn = container ? container.querySelector('.slider-btn--next') : null;

        if (!container || !inner || !REVIEWS_DATA.length) return;

        var total = REVIEWS_DATA.length;
        var currentIndex = 0;
        var autoTimer = null;

        function starString(n) {
            var s = '';
            for (var i = 0; i < n; i++) s += '★';
            return s;
        }

        function buildCards() {
            inner.innerHTML = '';
            for (var i = 0; i < REVIEWS_DATA.length; i++) {
                var r = REVIEWS_DATA[i];
                var initial = r.author.charAt(0).toUpperCase();
                var card = document.createElement('div');
                card.className = 'review-card';
                card.innerHTML =
                    '<a href="' + REVIEWS_GOOGLE_URL + '" target="_blank" rel="noopener noreferrer" role="article">' +
                    '  <div class="review-header">' +
                    '    <div class="review-avatar" aria-hidden="true">' + initial + '</div>' +
                    '    <div class="review-meta">' +
                    '      <span class="review-author">' + r.author + '</span>' +
                    '      <span class="review-date">' + r.date + '</span>' +
                    '    </div>' +
                    '  </div>' +
                    '  <div class="review-stars" aria-label="' + r.rating + ' de 5 estrellas">' + starString(r.rating) + '</div>' +
                    '  <p class="review-text">"' + r.text + '"</p>' +
                    '</a>';
                inner.appendChild(card);
            }
        }

        function applyLayout() {
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            inner.style.width = (pages * 100) + '%';

            var basis = (100 / total) + '%';
            var cards = inner.querySelectorAll('.review-card');
            for (var i = 0; i < cards.length; i++) {
                cards[i].style.flex = '0 0 ' + basis;
            }
        }

        function updatePosition() {
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            var maxPage = pages - 1;
            var maxIndex = maxPage * visible;
            currentIndex = currentIndex > maxIndex ? maxIndex : currentIndex;
            currentIndex = currentIndex < 0 ? 0 : currentIndex;

            var currentPage = Math.floor(currentIndex / visible);
            if (currentPage > maxPage) currentPage = maxPage;
            var offset = currentPage * (100 / pages);
            inner.style.transform = 'translateX(-' + offset + '%)';

            if (dotsContainer) {
                var dots = dotsContainer.querySelectorAll('button');
                for (var d = 0; d < dots.length; d++) {
                    dots[d].setAttribute('aria-selected', d === currentPage ? 'true' : 'false');
                }
            }
        }

        function goTo(index) {
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            var maxPage = pages - 1;
            var maxIndex = maxPage * visible;

            currentIndex = Math.round(index / visible) * visible;
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updatePosition();
        }

        function next() {
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            var maxPage = pages - 1;
            var currentPage = Math.floor(currentIndex / visible);
            if (currentPage >= maxPage) goTo(0);
            else goTo(currentIndex + visible);
        }

        function prev() {
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            var maxPage = pages - 1;
            var currentPage = Math.floor(currentIndex / visible);
            if (currentPage <= 0) goTo(maxPage * visible);
            else goTo(currentIndex - visible);
        }

        function buildDots() {
            if (!dotsContainer) return;
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            dotsContainer.innerHTML = '';
            for (var i = 0; i < pages; i++) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('aria-label', 'Ir a página de reseñas ' + (i + 1));
                btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
                btn.addEventListener('click', function (idx) {
                    return function () { goTo(idx); };
                }(i));
                dotsContainer.appendChild(btn);
            }
        }

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(next, 5000);
        }
        function stopAuto() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        buildCards();
        applyLayout();
        buildDots();
        updatePosition();

        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        container.addEventListener('mouseenter', stopAuto);
        container.addEventListener('mouseleave', startAuto);
        startAuto();

        window.addEventListener('resize', function () {
            applyLayout();
            buildDots();
            updatePosition();
        });
    }

    function initFormationReviewsSlider() {
        var inner = document.getElementById('formation-reviews-slider-inner');
        if (!inner || !FORMATION_REVIEWS_DATA.length) return;

        var container = inner.closest('section');
        var dotsContainer = container ? container.querySelector('.slider-dots') : null;
        var prevBtn = container ? container.querySelector('.slider-btn--prev') : null;
        var nextBtn = container ? container.querySelector('.slider-btn--next') : null;
        if (!container) return;

        var total = FORMATION_REVIEWS_DATA.length;
        var currentIndex = 0;
        var autoTimer = null;

        function starString(n) {
            var s = '';
            for (var i = 0; i < n; i++) s += '★';
            return s;
        }

        function buildCards() {
            inner.innerHTML = '';
            for (var i = 0; i < FORMATION_REVIEWS_DATA.length; i++) {
                var r = FORMATION_REVIEWS_DATA[i];
                var initial = r.author.charAt(0).toUpperCase();
                var card = document.createElement('div');
                card.className = 'review-card';
                card.innerHTML =
                    '<a href="' + REVIEWS_GOOGLE_URL + '" target="_blank" rel="noopener noreferrer" role="article">' +
                    '  <div class="review-header">' +
                    '    <div class="review-avatar" aria-hidden="true">' + initial + '</div>' +
                    '    <div class="review-meta">' +
                    '      <span class="review-author">' + r.author + '</span>' +
                    '      <span class="review-date">' + r.date + '</span>' +
                    '    </div>' +
                    '  </div>' +
                    '  <div class="review-stars" aria-label="' + r.rating + ' de 5 estrellas">' + starString(r.rating) + '</div>' +
                    '  <p class="review-text">"' + r.text + '"</p>' +
                    '</a>';
                inner.appendChild(card);
            }
        }

        function applyLayout() {
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            inner.style.width = (pages * 100) + '%';

            var basis = (100 / total) + '%';
            var cards = inner.querySelectorAll('.review-card');
            for (var i = 0; i < cards.length; i++) {
                cards[i].style.flex = '0 0 ' + basis;
            }
        }

        function updatePosition() {
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            var maxPage = pages - 1;
            var maxIndex = maxPage * visible;
            currentIndex = currentIndex > maxIndex ? maxIndex : currentIndex;
            currentIndex = currentIndex < 0 ? 0 : currentIndex;

            var currentPage = Math.floor(currentIndex / visible);
            if (currentPage > maxPage) currentPage = maxPage;
            var offset = currentPage * (100 / pages);
            inner.style.transform = 'translateX(-' + offset + '%)';

            if (dotsContainer) {
                var dots = dotsContainer.querySelectorAll('button');
                for (var d = 0; d < dots.length; d++) {
                    dots[d].setAttribute('aria-selected', d === currentPage ? 'true' : 'false');
                }
            }
        }

        function goTo(index) {
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            var maxPage = pages - 1;
            var maxIndex = maxPage * visible;

            currentIndex = Math.round(index / visible) * visible;
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updatePosition();
        }

        function next() {
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            var maxPage = pages - 1;
            var currentPage = Math.floor(currentIndex / visible);
            if (currentPage >= maxPage) goTo(0);
            else goTo(currentIndex + visible);
        }

        function prev() {
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            var maxPage = pages - 1;
            var currentPage = Math.floor(currentIndex / visible);
            if (currentPage <= 0) goTo(maxPage * visible);
            else goTo(currentIndex - visible);
        }

        function buildDots() {
            if (!dotsContainer) return;
            var visible = getVisibleSlides();
            var pages = Math.max(1, Math.ceil(total / visible));
            dotsContainer.innerHTML = '';
            for (var i = 0; i < pages; i++) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('aria-label', 'Ir a página de reseñas ' + (i + 1));
                btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
                btn.addEventListener('click', function (idx) {
                    return function () { goTo(idx * getVisibleSlides()); };
                }(i));
                dotsContainer.appendChild(btn);
            }
        }

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(next, 5000);
        }
        function stopAuto() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        buildCards();
        applyLayout();
        buildDots();
        updatePosition();

        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        container.addEventListener('mouseenter', stopAuto);
        container.addEventListener('mouseleave', startAuto);
        startAuto();

        window.addEventListener('resize', function () {
            applyLayout();
            buildDots();
            updatePosition();
        });
    }

    function initFormacionOnlineVideo() {
        var video = document.getElementById('formacion-online-video');
        var button = video ? video.querySelector('button[data-video-id]') : null;
        if (!video || !button) return;

        button.addEventListener('click', function () {
            var videoId = button.getAttribute('data-video-id');
            var origin = window.location.origin && window.location.origin !== 'null'
                ? '&origin=' + encodeURIComponent(window.location.origin)
                : '';
            var iframe = document.createElement('iframe');
            iframe.className = 'w-full h-full';
            iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0' + origin;
            iframe.title = 'Conocé la Formación Online por dentro';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            video.innerHTML = '';
            video.appendChild(iframe);
        });
    }

    // ----- Active nav link for current page -----
    function initActiveNavLink() {
        var links = document.querySelectorAll('.nav-link');
        var path = window.location.pathname.split('/').pop() || 'index.html';
        links.forEach(function (link) {
            var href = (link.getAttribute('href') || '').split('/').pop();
            var isHome = path === 'index.html' || path === '';
            var isHomeLink = href === 'index.html' || href === '#inicio';
            if (href === path || (isHome && isHomeLink) || (path === '' && href === 'index.html')) {
                link.classList.add('nav-link--active');
            }
        });
    }

    // ----- Floating WhatsApp: hide when footer #contacto is in view -----
    function initWaFloat() {
        var btn = document.querySelector('.wa-float');
        var footer = document.getElementById('contacto');
        if (!btn || !footer) return;
        var io = new IntersectionObserver(function (entries) {
            btn.classList.toggle('wa-float--hidden', entries[0].isIntersecting);
        }, { threshold: 0.2 });
        io.observe(footer);
    }

    function init() {
        initNav();
        initNavScroll();
        initFaq();
        initCounters();
        initFadeInScroll();
        initLazyImages();
        initFormacionHero();
        initVideoCarousel();
        initReviewsSlider();
        initFormationReviewsSlider();
        initFormacionOnlineVideo();
        initActiveNavLink();
        initWaFloat();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
