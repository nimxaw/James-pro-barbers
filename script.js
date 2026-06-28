/* ============================================================
   James Pro — interactions & scroll motion
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Image fallback chain ----------
     Primary = Unsplash. If it fails, try a topical LoremFlickr photo,
     then finally the bundled on-brand SVG so nothing ever shows broken. */
  document.querySelectorAll('img[data-svg]').forEach((img) => {
    const toSvg = () => { if (img.src.indexOf('assets/') === -1) img.src = img.dataset.svg; };
    img.addEventListener('error', function onErr() {
      if (img.dataset.flickr && img.src.indexOf('loremflickr') === -1 && img.src.indexOf('assets/') === -1) {
        img.src = img.dataset.flickr;            // step 1 → real topical photo
      } else {
        toSvg();                                 // step 2 → local SVG, stop here
        img.removeEventListener('error', onErr);
      }
    });
    // Watchdog: if neither remote source has loaded in time, drop to the
    // bundled SVG so an image can never stay blank on a slow/blocked network.
    setTimeout(() => { if (!img.complete || img.naturalWidth === 0) toSvg(); }, 7000);
  });

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  const bar = preloader.querySelector('.preloader__bar span');
  const countEl = document.getElementById('preloaderCount');
  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 18;
    if (p >= 100) { p = 100; clearInterval(tick); finishLoad(); }
    bar.style.width = p + '%';
    countEl.textContent = Math.floor(p) + '%';
  }, 130);

  function finishLoad() {
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.add('loaded');
      playHero();
    }, 350);
  }

  /* ---------- Hero line reveal ---------- */
  function playHero() {
    const lines = document.querySelectorAll('.hero__title .line > span');
    lines.forEach((l, i) => {
      l.style.transition = 'transform 1s cubic-bezier(0.16,1,0.3,1)';
      l.style.transitionDelay = (0.15 + i * 0.12) + 's';
      requestAnimationFrame(() => { l.style.transform = 'translateY(0)'; });
    });
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 500 + i * 120);
    });
  }

  /* ---------- Navbar scroll state ---------- */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (y / h) * 100 + '%';
    // parallax
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax);
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = 'translateY(' + (-offset) + 'px)';
    });
    // reveal safety net — guarantees elements reveal on scroll even if the
    // IntersectionObserver misses one (e.g. clip-path quirks).
    document.querySelectorAll('.reveal:not(.in), .reveal-img:not(.in)').forEach((el) => {
      if (el.closest('.hero')) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.88) el.classList.add('in');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => { burger.classList.remove('open'); links.classList.remove('open'); })
  );

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal:not(.hero .reveal), .reveal-img').forEach((el) => io.observe(el));

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll('.count');
  const cObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const dur = 1600; const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      cObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => cObserver.observe(c));

  /* ---------- Custom cursor ---------- */
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  if (window.matchMedia('(hover: hover)').matches) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px) translate(-50%,-50%)';
    });
    function follow() {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(follow);
    }
    follow();
    document.querySelectorAll('[data-cursor="hover"]').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
  }

  /* ---------- Booking form ---------- */
  const form = document.getElementById('bookForm');
  const note = document.getElementById('bookNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.hidden = false;
    form.reset();
    note.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
