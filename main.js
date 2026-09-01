/* ==========================================================
   Riska Devi — Custom Script
   Semua interaktivitas: menu mobile, modal, lightbox, filter
   galeri, counter, testimonial, particle bg, spotlight,
   scroll progress, toast, form kolaborasi via WhatsApp.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Lucide Icons ---------- */
  if (window.lucide) lucide.createIcons();

  /* ---------- 2. Toast Notification ---------- */
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  window.showToast = function (message) {
    if (!toastNotification) return;
    if (message && toastMessage) toastMessage.textContent = message;
    toastNotification.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('is-visible');
    }, 2500);
  };

  /* ---------- 2b. Copy to Clipboard (Email / WhatsApp / dsb) ---------- */
  window.copyToClipboard = function (text, label) {
    const name = label || 'Teks';
    const onSuccess = () => showToast(name + ' berhasil disalin!');
    const onError = () => showToast('Gagal menyalin, coba lagi.');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        fallbackCopy(text, onSuccess, onError);
      });
    } else {
      fallbackCopy(text, onSuccess, onError);
    }
  };

  function fallbackCopy(text, onSuccess, onError) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      ok ? onSuccess() : onError();
    } catch (e) {
      onError();
    }
  }

  /* ---------- 4. Mobile Menu Drawer ---------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeMobileMenu = document.getElementById('closeMobileMenu');

  function openDrawer() { mobileDrawer && mobileDrawer.classList.add('is-open'); }
  function closeDrawer() { mobileDrawer && mobileDrawer.classList.remove('is-open'); }

  mobileMenuBtn && mobileMenuBtn.addEventListener('click', openDrawer);
  closeMobileMenu && closeMobileMenu.addEventListener('click', closeDrawer);

  if (mobileDrawer) {
    mobileDrawer.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', closeDrawer);
    });
  }

  /* ---------- 5. Generic Modal Helper (CV & Lightbox) ---------- */
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('opacity-0', 'pointer-events-none');
    modalEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('opacity-0', 'pointer-events-none');
    modalEl.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* ---------- 6. CV Modal ---------- */
  const cvModal = document.getElementById('cvModal');
  const closeCvModal = document.getElementById('closeCvModal');

  document.querySelectorAll('.open-cv-modal').forEach(btn => {
    btn.addEventListener('click', () => openModal(cvModal));
  });
  closeCvModal && closeCvModal.addEventListener('click', () => closeModal(cvModal));
  cvModal && cvModal.querySelector('.modal-backdrop') &&
    cvModal.querySelector('.modal-backdrop').addEventListener('click', () => closeModal(cvModal));

  /* ---------- 7. Lightbox Gallery ---------- */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxBadge = document.getElementById('lightboxBadge');
  const closeLightbox = document.getElementById('closeLightbox');

  document.querySelectorAll('.open-lightbox').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.card-title');
      const desc = item.querySelector('.card-desc');
      const badge = item.querySelector('.card-badge');

      if (lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
      }
      if (lightboxTitle) lightboxTitle.textContent = title ? title.textContent : '';
      if (lightboxDesc) lightboxDesc.textContent = desc ? desc.textContent : '';
      if (lightboxBadge) lightboxBadge.textContent = badge ? badge.textContent : 'Dokumentasi';

      openModal(lightboxModal);
    });
  });
  closeLightbox && closeLightbox.addEventListener('click', () => closeModal(lightboxModal));
  lightboxModal && lightboxModal.querySelector('.lightbox-backdrop') &&
    lightboxModal.querySelector('.lightbox-backdrop').addEventListener('click', () => closeModal(lightboxModal));

  /* Close any open modal with ESC */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(cvModal);
      closeModal(lightboxModal);
    }
  });

  /* ---------- 7b. Flip Cards (Sertifikat) — tap to flip on touch devices ---------- */
  document.querySelectorAll('.flip-card-container').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't flip when a button inside the card (e.g. "Lihat Piagam Digital") is clicked
      if (e.target.closest('button')) return;
      card.classList.toggle('is-flipped');
    });
  });

  /* ---------- 8. Gallery Filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('bg-pink-500', 'text-white', 'shadow-lg', 'shadow-pink-500/30');
        b.classList.add('bg-slate-800/80', 'text-slate-300');
      });
      btn.classList.add('bg-pink-500', 'text-white', 'shadow-lg', 'shadow-pink-500/30');
      btn.classList.remove('bg-slate-800/80', 'text-slate-300');

      galleryItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---------- 9. Counter Animation on Scroll ---------- */
  const counters = document.querySelectorAll('.counter-val');
  const statsSection = document.getElementById('statsSection');
  let countersStarted = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else counter.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- 10. IntersectionObserver: reveal cards + counters + timeline ---------- */
  const revealTargets = document.querySelectorAll('.gsap-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => io.observe(el));

  function startCountersOnce() {
    if (countersStarted) return;
    countersStarted = true;
    animateCounters();
  }

  if (statsSection) {
    // Lower threshold + negative bottom margin so the counters reliably fire on
    // smaller/mobile viewports where the stats grid rarely covers 40% of the screen.
    const statsIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCountersOnce();
          statsIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    statsIo.observe(statsSection);

    // Fallback: if the stats section is already visible on initial load
    // (e.g. short page, tall viewport), the observer may fire late or not
    // at all on some mobile browsers — check immediately as a safety net.
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      startCountersOnce();
    }
  }

  /* ---------- 11. Timeline Laser Fill ---------- */
  const timelineLaserFill = document.getElementById('timelineLaserFill');
  const timelineSection = document.getElementById('pengalaman');

  function updateTimelineLaser() {
    if (!timelineLaserFill || !timelineSection) return;
    const rect = timelineSection.getBoundingClientRect();
    const winH = window.innerHeight;
    const total = rect.height + winH;
    const scrolled = winH - rect.top;
    const pct = Math.max(0, Math.min(1, scrolled / total));
    timelineLaserFill.style.height = (pct * 100) + '%';
  }

  /* ---------- 12. Scroll Progress Circle + Back To Top ---------- */
  const backToTopBtn = document.getElementById('backToTopBtn');
  const progressCircle = document.getElementById('scrollProgressCircle');
  const radius = progressCircle ? progressCircle.r.baseVal.value : 18;
  const circumference = 2 * Math.PI * radius;

  if (progressCircle) {
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
  }

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? scrollTop / docHeight : 0;

    if (progressCircle) {
      progressCircle.style.strokeDashoffset = circumference - pct * circumference;
    }
    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-6');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-6');
      }
    }
  }

  backToTopBtn && backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateTimelineLaser();
  }, { passive: true });

  updateScrollProgress();
  updateTimelineLaser();

  /* ---------- 13. Testimonial Carousel ---------- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove('hidden', 'opacity-0');
      } else {
        slide.classList.add('hidden', 'opacity-0');
      }
    });
  }

  if (slides.length) showSlide(activeSlide);

  prevBtn && prevBtn.addEventListener('click', () => {
    activeSlide = (activeSlide - 1 + slides.length) % slides.length;
    showSlide(activeSlide);
  });
  nextBtn && nextBtn.addEventListener('click', () => {
    activeSlide = (activeSlide + 1) % slides.length;
    showSlide(activeSlide);
  });

  /* ---------- 14. Role Rotator (Typing Effect) ---------- */
  const roleRotator = document.getElementById('roleRotator');
  const roles = [
    'Matematika & Data Analyst',
    'Digital Creative',
    'Public Speaker',
    'Petugas BPS 2026',
    'Social Activist'
  ];

  if (roleRotator) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = false;

    function typeLoop() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }
      }
      roleRotator.textContent = roles[roleIndex].slice(0, charIndex);
      setTimeout(typeLoop, deleting ? 40 : 80);
    }
    setTimeout(typeLoop, 1400);
  }

  /* ---------- 15. Tilt Effect on Gallery Cards ---------- */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    });
  });

  /* ---------- 16. Magnetic Button Effect ---------- */
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  /* ---------- 17. Spotlight Cursor Follower ---------- */
  const spotlight = document.getElementById('spotlightGlow');
  if (spotlight && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('mousemove', (e) => {
      spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }

  /* ---------- 18. Particle Canvas Background ---------- */
  const canvas = document.getElementById('particleCanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.floor((canvas.width * canvas.height) / 22000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.15
      }));
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 72, 153, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
  }

  /* ---------- 19. Collaboration Form -> WhatsApp ---------- */
  const collabForm = document.getElementById('collabForm');
  const WA_NUMBER = '6282383542435';

  collabForm && collabForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('collabName')?.value.trim();
    const org = document.getElementById('collabOrg')?.value.trim();
    const topic = document.getElementById('collabTopic')?.value;
    const msg = document.getElementById('collabMsg')?.value.trim();

    if (!name || !org || !msg) {
      showToast('Mohon lengkapi semua data terlebih dahulu');
      return;
    }

    const text =
      `Halo Riska, saya *${name}* dari *${org}*.%0A` +
      `Keperluan: ${topic}%0A` +
      `Detail: ${msg}`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
    showToast('Membuka WhatsApp...');
    collabForm.reset();
  });

  /* ---------- 20. GSAP ScrollTrigger (opsional, jika tersedia) ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.gsap-stagger-container').forEach(container => {
      const cards = container.querySelectorAll('.gsap-card');
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        stagger: 0.08,
        duration: 0.6,
        scrollTrigger: {
          trigger: container,
          start: 'top 85%'
        }
      });
    });
  }

});
