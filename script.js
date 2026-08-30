// ===========================================================
// SANWARIYA SETH DIGITAL SOLUTION — script.js
// Mobile menu, sticky navbar state, scroll reveal, animated
// demo counters, and a copy-to-clipboard Telegram number.
// ===========================================================

(function () {
  'use strict';

  // ---------- Footer year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Mobile menu ----------
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }

  function toggleMenu() {
    var isOpen = mobileMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', toggleMenu);
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ---------- Sticky navbar shrink/shadow on scroll ----------
  var navbar = document.getElementById('navbar');
  var lastScrolled = false;
  function onScrollNav() {
    var scrolled = window.scrollY > 12;
    if (scrolled !== lastScrolled) {
      navbar.style.boxShadow = scrolled ? '0 12px 30px -20px rgba(0,0,0,0.6)' : 'none';
      navbar.style.background = scrolled ? 'rgba(8,11,20,0.9)' : 'rgba(8,11,20,0.72)';
      lastScrolled = scrolled;
    }
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });

  // ---------- Scroll reveal ----------
  var revealTargets = document.querySelectorAll(
    '.service-card, .process-step, .package-card, .why-card, .contact-card, .map-visual, .section-heading, .section-lead'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Animated demo counters (hero dashboard) ----------
  var counters = document.querySelectorAll('.metric-value[data-count]');
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
      var duration = 1200;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        var value = target * eased;
        el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.round(value);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
      }
      requestAnimationFrame(step);
    });
  }

  var heroPanel = document.querySelector('.hero-panel');
  if (heroPanel) {
    // Hero is above the fold, so animate shortly after load rather than
    // waiting on a scroll-triggered observer.
    window.addEventListener('load', function () {
      setTimeout(animateCounters, 350);
    });
    // Fallback in case 'load' already fired
    if (document.readyState === 'complete') {
      setTimeout(animateCounters, 350);
    }
  }

  // ---------- Telegram: copy number to clipboard ----------
  var telegramBtn = document.getElementById('telegramCopy');
  var telegramHint = document.getElementById('telegramHint');

  if (telegramBtn) {
    telegramBtn.addEventListener('click', function () {
      var number = telegramBtn.getAttribute('data-number') || '';

      function showCopied() {
        if (!telegramHint) return;
        var original = 'Tap to copy';
        telegramHint.textContent = 'Copied!';
        setTimeout(function () { telegramHint.textContent = original; }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(number).then(showCopied).catch(function () {
          fallbackCopy(number, showCopied);
        });
      } else {
        fallbackCopy(number, showCopied);
      }
    });
  }

  function fallbackCopy(text, onDone) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try { document.execCommand('copy'); } catch (e) { /* no-op */ }
    document.body.removeChild(textarea);
    if (onDone) onDone();
  }
})();
