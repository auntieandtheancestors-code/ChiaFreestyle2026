/* =============================================
   CHIA FREESTYLE — Main JavaScript
   ============================================= */

(function () {
  'use strict';

  /* ---- Navbar scroll state ---- */
  const nav = document.querySelector('.nav');
  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---- Active nav link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Hamburger menu ---- */
  const hamburger   = document.querySelector('.nav__hamburger');
  const mobileMenu  = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile a');

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---- Hero entrance ---- */
  document.querySelectorAll('.hero').forEach(hero => {
    requestAnimationFrame(() => hero.classList.add('loaded'));
  });

  /* ---- Scroll animations (IntersectionObserver) ---- */
  const animObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-anim]').forEach(el => {
    animObserver.observe(el);
  });

  /* ---- Smooth parallax on hero bg ---- */
  const heroBgs = document.querySelectorAll('.hero__bg');
  if (heroBgs.length) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBgs.forEach(bg => {
        bg.style.transform = `scale(1.06) translateY(${scrolled * 0.18}px)`;
      });
    }, { passive: true });
  }

  /* ---- Page hero parallax ---- */
  const pageHeroBg = document.querySelector('.page-hero__bg');
  if (pageHeroBg) {
    window.addEventListener('scroll', () => {
      pageHeroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ---- Counter animation for stats ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stats__num[data-target]').forEach(el => {
    statsObserver.observe(el);
  });

})();
