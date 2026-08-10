(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function countUp(element, target, suffix, duration) {
    duration = duration || 1600;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      element.textContent = current + (suffix || '');
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            countUp(el, target, suffix);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  var openFormBtn = document.getElementById('open-contact-form');
  var contactModal = document.getElementById('contact-modal');
  var modalOverlay = document.getElementById('contact-modal-overlay');
  var modalClose = document.getElementById('contact-modal-close');
  var modalDone = document.getElementById('contact-modal-done');
  var contactForm = document.getElementById('contact-form');
  var modalBody = document.getElementById('contact-modal-body');
  var modalSuccess = document.getElementById('contact-modal-success');

  function openContactModal() {
    contactModal.classList.add('is-open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var firstInput = document.getElementById('contact-name');
    setTimeout(function () {
      if (firstInput) firstInput.focus();
    }, 400);
  }

  function closeContactModal() {
    contactModal.classList.remove('is-open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () {
      modalBody.classList.remove('is-hidden');
      modalSuccess.hidden = true;
      contactForm.reset();
    }, 500);
  }

  if (openFormBtn) {
    openFormBtn.addEventListener('click', openContactModal);
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeContactModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeContactModal);
  }

  if (modalDone) {
    modalDone.addEventListener('click', closeContactModal);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && contactModal.classList.contains('is-open')) {
      closeContactModal();
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('contact-name').value.trim();
      var org = document.getElementById('contact-org').value.trim();
      var email = document.getElementById('contact-email').value.trim();
      var need = document.getElementById('contact-need').value;
      var deadline = document.getElementById('contact-deadline').value;
      var message = document.getElementById('contact-message').value.trim();

      if (!name || !org || !email || !need || !deadline || !message) return;

      var subject = encodeURIComponent('Contact depuis racin.africa — ' + name);
      var body = encodeURIComponent(
        'Nom : ' + name + '\n' +
        'Organisation : ' + org + '\n' +
        'Courriel : ' + email + '\n' +
        'Nature du besoin : ' + need + '\n' +
        'Échéance : ' + deadline + '\n' +
        '\nMessage :\n' + message
      );

      window.location.href = 'mailto:contact@racin.africa?subject=' + subject + '&body=' + body;

      modalBody.classList.add('is-hidden');
      modalSuccess.hidden = false;
    });
  }
})();
