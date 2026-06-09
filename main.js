document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAnnouncementClose();
  initCounterAnimation();
  initServicesCarousel();
  initScrollTop();
});

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  function toggleMenu(open) {
    const isOpen = open ?? !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    hamburger.classList.toggle('active', isOpen);
    overlay.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu());
  overlay.addEventListener('click', () => toggleMenu(false));

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) toggleMenu(false);
  });
}

function initAnnouncementClose() {
  const bar = document.querySelector('.announcement-bar');
  const closeBtn = document.querySelector('.announcement-close');

  closeBtn.addEventListener('click', () => {
    bar.classList.add('hidden');
  });
}

function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach(animateCounter);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.stats');
  if (statsSection) observer.observe(statsSection);
}

function initServicesCarousel() {
  const track = document.getElementById('servicesTrack');
  const wrapper = track?.parentElement;
  const prevBtn = document.getElementById('servicesPrev');
  const nextBtn = document.getElementById('servicesNext');
  if (!track || !wrapper || !prevBtn || !nextBtn) return;

  const getScrollAmount = () => {
    const card = track.querySelector('.service-card');
    if (!card) return 300;
    const gap = parseInt(getComputedStyle(track).gap, 10) || 16;
    return card.offsetWidth + gap;
  };

  prevBtn.addEventListener('click', () => {
    wrapper.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    wrapper.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  const updateButtons = () => {
    const atStart = wrapper.scrollLeft <= 4;
    const atEnd = wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 4;
    prevBtn.classList.toggle('carousel-btn--active', !atStart);
    nextBtn.classList.toggle('carousel-btn--active', !atEnd);
  };

  wrapper.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();
}

function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
