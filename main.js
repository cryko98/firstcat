/* The First Cat — $PROAILURUS
   No dependencies. Everything degrades gracefully without JS. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var docEl = document.documentElement;

  /* ── boot sequence ────────────────────────────────────── */
  (function () {
    var boot = document.getElementById('boot');
    var closed = false;
    var timer;

    function close(instant) {
      if (closed) return;
      closed = true;
      clearTimeout(timer);
      docEl.classList.remove('is-booting');
      if (!boot) return;
      if (instant) { boot.remove(); return; }
      boot.classList.add('is-done');
      setTimeout(function () { if (boot.parentNode) boot.remove(); }, 600);
    }

    if (!boot || docEl.classList.contains('no-boot')) { close(true); return; }
    try { sessionStorage.setItem('proailurus-booted', '1'); } catch (e) {}

    var lines = boot.querySelectorAll('.boot__log > li');
    var bar = boot.querySelector('.boot__bar span');
    var skip = boot.querySelector('.boot__skip');

    if (reduced) {
      Array.prototype.forEach.call(lines, function (li) { li.classList.add('is-on'); });
      if (bar) { bar.style.transitionDuration = '0ms'; bar.style.width = '100%'; }
      timer = setTimeout(close, 700);
    } else {
      var step = 250;
      var total = 300 + step * lines.length + 450;
      Array.prototype.forEach.call(lines, function (li, i) {
        setTimeout(function () { li.classList.add('is-on'); }, 300 + i * step);
      });
      requestAnimationFrame(function () {
        if (!bar) return;
        bar.style.transitionDuration = total + 'ms';
        bar.style.width = '100%';
      });
      timer = setTimeout(close, total + 320);
    }

    if (skip) skip.addEventListener('click', function () { close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') close();
    });
    /* never let a stalled animation trap the page */
    setTimeout(function () { close(true); }, 9000);
  })();

  /* ── current year in the colophon ─────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── toast ────────────────────────────────────────────── */
  var toast = document.getElementById('toast');
  var toastTimer;
  function say(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 2200);
  }

  /* ── copy the contract address ────────────────────────── */
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  /* last resort: highlight the address so the reader can hit Ctrl+C */
  function selectText(node) {
    if (!node || !window.getSelection || !document.createRange) return;
    var range = document.createRange();
    range.selectNodeContents(node);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    var label = btn.querySelector('.ca-block__copytext');
    var code = btn.querySelector('code');
    var resetTimer;

    function done(ok) {
      if (!ok) {
        selectText(code);
        say('Selected — press Ctrl+C');
        return;
      }
      btn.classList.add('is-copied');
      if (label) label.textContent = 'Copied';
      say('Contract address copied');
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        btn.classList.remove('is-copied');
        if (label) label.textContent = 'Copy';
      }, 2200);
    }

    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); },
                                                 function () { done(fallbackCopy(text)); });
      } else {
        done(fallbackCopy(text));
      }
    });
  });

  /* ── reveal on scroll, staggered per group ────────────── */
  var revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    // stagger siblings inside the same parent
    var byParent = new Map();
    Array.prototype.forEach.call(revealables, function (el) {
      var group = byParent.get(el.parentNode) || [];
      group.push(el);
      byParent.set(el.parentNode, group);
    });
    byParent.forEach(function (group) {
      group.forEach(function (el, i) {
        el.style.setProperty('--d', Math.min(i, 6) * 85 + 'ms');
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  }

  /* ── masthead shadow once scrolled ────────────────────── */
  var masthead = document.querySelector('.masthead');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      if (masthead) masthead.classList.toggle('is-stuck', window.scrollY > 12);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── active section in the nav ────────────────────────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navLinks.find(function (a) { return a.getAttribute('href') === '#' + entry.target.id; });
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ── mobile menu ──────────────────────────────────────── */
  var burger = document.querySelector('.burger');
  var mobileNav = document.getElementById('mobile-nav');

  function setMenu(open) {
    if (!burger || !mobileNav) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileNav.hidden = !open;
  }

  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720) setMenu(false);
    });
  }

  /* ── gentle parallax on the mounted plate ─────────────── */
  var mount = document.querySelector('.mount');
  if (mount && !reduced && window.matchMedia('(pointer: fine)').matches) {
    var hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      mount.style.transform = 'rotate(-0.5deg) translate3d(' + (x * -9).toFixed(2) + 'px,' +
                              (y * -9).toFixed(2) + 'px, 0)';
    });
    hero.addEventListener('mouseleave', function () {
      mount.style.transform = '';
    });
  }
})();
