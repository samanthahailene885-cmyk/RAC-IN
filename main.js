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

  function countUp(element, target, suffix, duration) {
    duration = duration || 1600;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      element.textContent = current.toLocaleString('fr-FR') + (suffix || '');
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function observeStats(section) {
    if (!section) return;
    var numbers = section.querySelectorAll('.stat-number[data-target]');
    if (!numbers.length) return;
    var animated = false;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !animated) {
            animated = true;
            numbers.forEach(function (el) {
              var target = parseInt(el.getAttribute('data-target'), 10);
              var suffix = el.getAttribute('data-suffix') || '';
              countUp(el, target, suffix);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
  }

  observeStats(document.getElementById('stats'));
  document.querySelectorAll('.js-stats').forEach(observeStats);

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
    if (e.key === 'Escape' && contactModal && contactModal.classList.contains('is-open')) {
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

      var formData = new FormData();
      formData.append('name', name);
      formData.append('organisation', org);
      formData.append('email', email);
      formData.append('need', need);
      formData.append('deadline', deadline);
      formData.append('message', message);

      var submitBtn = contactForm.querySelector('.contact-form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';

      fetch('send_email.php', {
        method: 'POST',
        body: formData
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Envoyer le message<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        
        if (data.success) {
          modalBody.classList.add('is-hidden');
          modalSuccess.hidden = false;
        } else {
          alert('Erreur lors de l\'envoi: ' + (data.message || 'Veuillez réessayer'));
        }
      })
      .catch(function(error) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Envoyer le message<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        alert('Erreur de connexion. Veuillez réessayer.');
        console.error('Error:', error);
      });
    });
  }

  var applyForm = document.getElementById('apply-form');
  if (applyForm) {
    var params = new URLSearchParams(window.location.search);
    var poste = params.get('poste');
    var positionSelect = document.getElementById('apply-position');
    if (positionSelect && (poste === 'creation-cm' || poste === 'spontanee')) {
      positionSelect.value = poste;
    }

    applyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var errorEl = document.getElementById('apply-error');
      var submitBtn = document.getElementById('apply-submit');
      var successEl = document.getElementById('apply-success');

      if (errorEl) {
        errorEl.hidden = true;
        errorEl.textContent = '';
      }

      if (!applyForm.checkValidity()) {
        applyForm.reportValidity();
        return;
      }

      var formData = new FormData(applyForm);
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Envoi en cours...';

      fetch('send_email.php', {
        method: 'POST',
        body: formData
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = 'Envoyer ma candidature';
          if (data.success) {
            applyForm.hidden = true;
            if (successEl) successEl.hidden = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            var msg = data.message || 'Veuillez réessayer.';
            if (data.errors && data.errors.length) {
              msg = data.errors.join(' · ');
            }
            if (errorEl) {
              errorEl.textContent = msg;
              errorEl.hidden = false;
            }
          }
        })
        .catch(function (error) {
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = 'Envoyer ma candidature';
          console.error('Application form error:', error);
          if (errorEl) {
            errorEl.textContent = 'Erreur de connexion. Veuillez réessayer.';
            errorEl.hidden = false;
          }
        });
    });
  }

  /* Mesures live — page Digital & Influence */
  var liveMetrics = document.getElementById('di-live-metrics');
  if (liveMetrics) {
    function formatBytes(bytes) {
      if (!bytes || bytes < 0) return '—';
      if (bytes < 1024) return bytes + ' o';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' Ko';
      return (bytes / (1024 * 1024)).toFixed(2) + ' Mo';
    }

    function renderLiveMetrics() {
      var loadEl = document.getElementById('di-load-time');
      var weightEl = document.getElementById('di-page-weight');
      var navEntry = performance.getEntriesByType('navigation')[0];
      var loadMs = navEntry
        ? Math.round(navEntry.loadEventEnd || navEntry.duration || 0)
        : Math.round(performance.now());

      if (loadEl && loadMs > 0) {
        loadEl.textContent = loadMs < 1000
          ? loadMs + ' ms'
          : (loadMs / 1000).toFixed(1).replace('.', ',') + ' s';
      }

      var total = 0;
      var resources = performance.getEntriesByType('resource');
      for (var i = 0; i < resources.length; i++) {
        total += resources[i].transferSize || 0;
      }
      if (navEntry && navEntry.transferSize) {
        total += navEntry.transferSize;
      }

      if (weightEl) {
        weightEl.textContent = formatBytes(total);
      }

      liveMetrics.hidden = false;
    }

    if (document.readyState === 'complete') {
      setTimeout(renderLiveMetrics, 100);
    } else {
      window.addEventListener('load', function () {
        setTimeout(renderLiveMetrics, 100);
      });
    }
  }

  var refsFilters = document.querySelector('.refs-filters');
  if (refsFilters) {
    var chips = refsFilters.querySelectorAll('.refs-chip');
    var rows = document.querySelectorAll('.refs-table tbody tr');
    var cells = document.querySelectorAll('.refs-board-cell');
    var empty = document.getElementById('refs-empty');
    var table = document.querySelector('.refs-table');

    function applyRefsFilter(value) {
      var visible = 0;
      rows.forEach(function (row) {
        var sectors = row.getAttribute('data-sectors') || '';
        var show = value === 'all' || sectors.split(/\s+/).indexOf(value) !== -1;
        row.hidden = !show;
        if (show) visible += 1;
      });
      cells.forEach(function (cell) {
        var sectors = cell.getAttribute('data-sectors') || '';
        cell.hidden = !(value === 'all' || sectors.split(/\s+/).indexOf(value) !== -1);
      });
      if (table) table.hidden = visible === 0;
      if (empty) empty.hidden = visible > 0;
    }

    refsFilters.addEventListener('click', function (e) {
      var chip = e.target.closest('.refs-chip');
      if (!chip) return;
      chips.forEach(function (c) {
        var active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      applyRefsFilter(chip.getAttribute('data-filter'));
    });
  }

  /* FAQ Accordion */
  var faqSection = document.getElementById('faq');
  if (faqSection) {
    var isMobile = window.innerWidth < 768;

    // On mobile, collapse all initially
    if (isMobile) {
      var faqTriggers = faqSection.querySelectorAll('.bi-faq-trigger');
      faqTriggers.forEach(function (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      });
    }

    faqSection.addEventListener('click', function (e) {
      var trigger = e.target.closest('.bi-faq-trigger');
      if (!trigger) return;

      var isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      var answer = document.getElementById(trigger.getAttribute('aria-controls'));

      // Close all other items
      var allTriggers = faqSection.querySelectorAll('.bi-faq-trigger');
      allTriggers.forEach(function (t) {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      trigger.setAttribute('aria-expanded', !isExpanded);
    });

    // Handle keyboard navigation
    faqSection.addEventListener('keydown', function (e) {
      var trigger = e.target.closest('.bi-faq-trigger');
      if (!trigger) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  }
})();
