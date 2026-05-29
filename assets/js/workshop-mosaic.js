/**
 * Talleres hero: mosaic scroll reveal + lightbox (talleres.html only).
 */
(function () {
  'use strict';

  var SLIDES = [
    { src: 'assets/images/Slide-1.webp', name: 'Registros Akásicos' },
    { src: 'assets/images/Slide-2.webp', name: 'Biodecodificación' },
    { src: 'assets/images/Slide-3.webp', name: 'Constelaciones Familiares' },
    { src: 'assets/images/Slide-4.webp', name: 'Meditación y Presencia' }
  ];

  var mosaic = document.getElementById('workshop-mosaic');
  if (!mosaic) return;

  var currentIndex = 0;
  var lightbox = null;
  var lightboxImg = null;
  var lightboxCaption = null;
  var touchStartX = 0;
  var bodyOverflow = '';

  function removeWillChange() {
    var imgs = mosaic.querySelectorAll('.workshop-mosaic__cell img');
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].classList.add('workshop-mosaic__img--scroll-done');
    }
  }

  function initScrollReveal() {
    if (typeof IntersectionObserver === 'undefined') {
      mosaic.classList.add('workshop-mosaic--visible');
      removeWillChange();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (!entries[i].isIntersecting) continue;
          mosaic.classList.add('workshop-mosaic--visible');
          removeWillChange();
          observer.disconnect();
          return;
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(mosaic);
  }

  function createLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'workshop-lightbox';
    lightbox.id = 'workshop-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('aria-label', 'Galería ampliada de talleres');

    lightbox.innerHTML =
      '<button type="button" class="workshop-lightbox__btn workshop-lightbox__close" aria-label="Cerrar galería">×</button>' +
      '<button type="button" class="workshop-lightbox__btn workshop-lightbox__prev" aria-label="Imagen anterior">‹</button>' +
      '<button type="button" class="workshop-lightbox__btn workshop-lightbox__next" aria-label="Imagen siguiente">›</button>' +
      '<div class="workshop-lightbox__content">' +
        '<div class="workshop-lightbox__img-wrap">' +
          '<img class="workshop-lightbox__img" src="" alt="">' +
        '</div>' +
        '<p class="workshop-lightbox__caption"></p>' +
      '</div>';

    document.body.appendChild(lightbox);
    lightboxImg = lightbox.querySelector('.workshop-lightbox__img');
    lightboxCaption = lightbox.querySelector('.workshop-lightbox__caption');

    lightbox.querySelector('.workshop-lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.workshop-lightbox__prev').addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(currentIndex - 1);
    });
    lightbox.querySelector('.workshop-lightbox__next').addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(currentIndex + 1);
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    lightbox.querySelector('.workshop-lightbox__img-wrap').addEventListener('click', function (e) {
      e.stopPropagation();
    });

    lightbox.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      if (!lightbox.classList.contains('workshop-lightbox--open')) return;
      var touch = e.changedTouches[0];
      if (!touch) return;
      var delta = touch.clientX - touchStartX;
      if (Math.abs(delta) < 50) return;
      if (delta > 0) goTo(currentIndex - 1);
      else goTo(currentIndex + 1);
    }, { passive: true });

    document.addEventListener('keydown', onKeydown);
  }

  function setLightboxSlide(index, animate) {
    var slide = SLIDES[index];
    currentIndex = index;
    lightbox.setAttribute('aria-label', slide.name);

    function apply() {
      lightboxImg.src = slide.src;
      lightboxImg.alt = 'Taller: ' + slide.name;
      lightboxCaption.textContent = slide.name;
      requestAnimationFrame(function () {
        lightboxImg.classList.remove('workshop-lightbox__img--fade');
      });
    }

    if (animate) {
      lightboxImg.classList.add('workshop-lightbox__img--fade');
      setTimeout(apply, 250);
    } else {
      lightboxImg.src = slide.src;
      lightboxImg.alt = 'Taller: ' + slide.name;
      lightboxCaption.textContent = slide.name;
      lightboxImg.classList.remove('workshop-lightbox__img--fade');
    }
  }

  function goTo(index) {
    var next = (index + SLIDES.length) % SLIDES.length;
    if (next === currentIndex) return;
    setLightboxSlide(next, true);
  }

  function openLightbox(index) {
    if (!lightbox) createLightbox();
    setLightboxSlide(index, false);
    bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightbox.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      lightbox.classList.add('workshop-lightbox--open');
    });
    lightbox.querySelector('.workshop-lightbox__close').focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('workshop-lightbox--open')) return;
    lightbox.classList.remove('workshop-lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = bodyOverflow;
  }

  function onKeydown(e) {
    if (!lightbox || !lightbox.classList.contains('workshop-lightbox--open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(currentIndex + 1);
    }
  }

  function initMosaicClicks() {
    var cells = mosaic.querySelectorAll('button.workshop-mosaic__cell[data-slide-index]');
    for (var i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-slide-index'), 10);
        if (!isNaN(idx)) openLightbox(idx);
      });
    }
  }

  initScrollReveal();
  initMosaicClicks();
})();
