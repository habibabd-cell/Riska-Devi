/**
 * RISKA DEVI - PORTFOLIO INTERACTIVE & MOTION GRAPHICS ENGINE
 * Clean, lightweight, and high performance (60-120fps)
 * Includes:
 * 1. Interactive Constellation Canvas Particle System
 * 2. GSAP ScrollTrigger & Text Stagger Animations
 * 3. Dynamic Text Rotator / Typing Effect
 * 4. 3D Perspective Tilt Physics & Mouse Spotlight
 * 5. Animated Number Counters & Skill Bars
 * 6. Gallery Category Filter & Interactive Lightbox Modal
 * 7. Copy-to-Clipboard with Toast & Confetti Burst
 * 8. Scroll Laser Progress & Circular Scroll-to-Top
 * 9. Interactive Collaboration Form to WhatsApp
 * 10. Testimonials Carousel Slider
 * 11. Interactive CV / Resume Modal & Print Trigger
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 1. CANVAS PARTICLE CONSTELLATION BACKGROUND
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);

        const mouse = {
            x: null,
            y: null,
            radius: 140
        };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            // Move spotlight glow
            const spotlight = document.getElementById('spotlightGlow');
            if (spotlight) {
                spotlight.style.left = `${e.clientX}px`;
                spotlight.style.top = `${e.clientY}px`;
            }
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.6 ? '#ec4899' : (Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4');
                this.baseAlpha = Math.random() * 0.5 + 0.2;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.baseAlpha;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse repulsion
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        this.x -= Math.cos(angle) * force * 3;
                        this.y -= Math.sin(angle) * force * 3;
                    }
                }

                this.draw();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        const alpha = (1 - dist / 110) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = '#8b5cf6';
                        ctx.globalAlpha = alpha;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // 2. DYNAMIC TEXT ROTATOR / TYPED EFFECT
    const textRotator = document.getElementById('roleRotator');
    if (textRotator) {
        const roles = [
            "Matematika & Data Analyst",
            "Public Speaker & Moderator",
            "Social & Youth Activist",
            "Digital Creative & Drone Video",
            "Petugas Lapangan BPS 2026"
        ];
        let roleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentRole = roles[roleIdx];
            if (isDeleting) {
                textRotator.textContent = currentRole.substring(0, charIdx - 1);
                charIdx--;
            } else {
                textRotator.textContent = currentRole.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeleting ? 35 : 75;

            if (!isDeleting && charIdx === currentRole.length) {
                typeSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                typeSpeed = 400;
            }

            setTimeout(typeLoop, typeSpeed);
        }
        typeLoop();
    }

    // 3. GSAP & SCROLLTRIGGER MOTION GRAPHICS
    if (window.gsap) {
        if (window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Hero Entrance Timeline
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
        heroTl
            .from('#heroBadge', { y: -30, opacity: 0, scale: 0.9, duration: 0.8 })
            .from('#heroTitle', { y: 40, opacity: 0, duration: 1 }, '-=0.5')
            .from('#heroDesc', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
            .from('#heroCta', { y: 20, opacity: 0, stagger: 0.15, duration: 0.7 }, '-=0.5')
            .from('#heroMeta', { opacity: 0, y: 15, duration: 0.6 }, '-=0.4')
            .from('#heroImageCard', { scale: 0.85, opacity: 0, rotationY: 15, duration: 1.2, ease: 'back.out(1.4)' }, '-=0.8')
            .from('#heroStatsCard', { y: 30, opacity: 0, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.5');

        // ScrollTrigger for Sections
        gsap.utils.toArray('.gsap-reveal-section').forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 50,
                opacity: 0,
                duration: 0.9,
                ease: 'power2.out'
            });
        });

        // Staggered Cards Reveal
        gsap.utils.toArray('.gsap-stagger-container').forEach(container => {
            const cards = container.querySelectorAll('.gsap-card');
            if (cards.length) {
                gsap.from(cards, {
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 80%',
                    },
                    y: 40,
                    opacity: 0,
                    scale: 0.96,
                    stagger: 0.12,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        });
    }

    // 4. 3D TILT PHYSICS FOR CARDS
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // 5. ANIMATED NUMBER COUNTERS
    let countersStarted = false;
    function runCounters() {
        if (countersStarted) return;
        const counters = document.querySelectorAll('.counter-val');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, stepTime);
        });
        countersStarted = true;
    }

    const statsSection = document.getElementById('statsSection');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                runCounters();
            }
        }, { threshold: 0.4 });
        observer.observe(statsSection);
    }

    // 6. SKILL PROGRESS BAR ANIMATION
    const skillBars = document.querySelectorAll('.progress-bar-fill');
    if (skillBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }
        }, { threshold: 0.2 });

        const keahlianSec = document.getElementById('keahlian');
        if (keahlianSec) skillsObserver.observe(keahlianSec);
    }

    // 7. INTERACTIVE TIMELINE LASER FILL
    const timelineLaserFill = document.getElementById('timelineLaserFill');
    const timelineSection = document.getElementById('pengalaman');
    if (timelineLaserFill && timelineSection) {
        window.addEventListener('scroll', () => {
            const rect = timelineSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight && rect.bottom > 0) {
                const totalHeight = rect.height;
                const scrolled = windowHeight - rect.top;
                const percentage = Math.min(Math.max((scrolled / totalHeight) * 100, 0), 100);
                timelineLaserFill.style.height = `${percentage}%`;
            }
        });
    }

    // 8. GALLERY FILTER SYSTEM
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('bg-pink-500', 'text-white', 'shadow-lg', 'shadow-pink-500/30');
                b.classList.add('bg-slate-800/80', 'text-slate-300', 'hover:bg-slate-700');
            });
            btn.classList.remove('bg-slate-800/80', 'text-slate-300', 'hover:bg-slate-700');
            btn.classList.add('bg-pink-500', 'text-white', 'shadow-lg', 'shadow-pink-500/30');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden-item');
                    item.style.position = 'relative';
                    item.style.visibility = 'visible';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1) translateY(0)';
                } else {
                    item.classList.add('hidden-item');
                    setTimeout(() => {
                        if (item.classList.contains('hidden-item')) {
                            item.style.position = 'absolute';
                            item.style.visibility = 'hidden';
                        }
                    }, 400);
                }
            });
        });
    });

    // 9. INTERACTIVE LIGHTBOX MODAL
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxBadge = document.getElementById('lightboxBadge');
    const closeLightboxBtn = document.getElementById('closeLightbox');

    function openLightbox(src, title, desc, badge) {
        if (!lightboxModal) return;
        lightboxImg.src = src;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;
        lightboxBadge.textContent = badge;
        lightboxModal.classList.remove('pointer-events-none');
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        lightboxModal.classList.add('pointer-events-none');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (lightboxImg) lightboxImg.src = '';
        }, 300);
    }

    document.querySelectorAll('.open-lightbox').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const title = card.querySelector('.card-title')?.textContent || '';
            const desc = card.querySelector('.card-desc')?.textContent || '';
            const badge = card.querySelector('.card-badge')?.textContent || '';
            if (img) {
                openLightbox(img.src, title, desc, badge);
            }
        });
    });

    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
                closeLightbox();
            }
        });
    }

    // 10. TESTIMONIALS SLIDER
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevSlideBtn = document.getElementById('prevTestimonial');
    const nextSlideBtn = document.getElementById('nextTestimonial');

    function showSlide(idx) {
        if (!slides.length) return;
        slides.forEach((slide, i) => {
            if (i === idx) {
                slide.classList.remove('hidden', 'opacity-0');
                slide.classList.add('opacity-100');
            } else {
                slide.classList.add('hidden', 'opacity-0');
                slide.classList.remove('opacity-100');
            }
        });
    }

    if (prevSlideBtn && nextSlideBtn && slides.length > 0) {
        prevSlideBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });

        nextSlideBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });

        // Auto slide every 6 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 6500);
    }

    // 11. INTERACTIVE COLLABORATION FORM TO WHATSAPP
    const collabForm = document.getElementById('collabForm');
    if (collabForm) {
        collabForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('collabName')?.value || '';
            const org = document.getElementById('collabOrg')?.value || '';
            const topic = document.getElementById('collabTopic')?.value || '';
            const msg = document.getElementById('collabMsg')?.value || '';

            const waText = `Halo Kak Riska Devi,%0A%0ASaya *${encodeURIComponent(name)}* dari *${encodeURIComponent(org)}*.%0A%0A*Topik/Keperluan:* ${encodeURIComponent(topic)}%0A*Pesan:* ${encodeURIComponent(msg)}%0A%0AMohon konfirmasi kesediaan untuk berkolaborasi. Terima kasih!`;
            
            triggerConfetti();
            showToast('Mengarahkan ke WhatsApp... 🚀');

            setTimeout(() => {
                window.open(`https://wa.me/6282383542435?text=${waText}`, '_blank');
            }, 800);
        });
    }

    // 12. CV RESUME MODAL & PRINT
    const cvModal = document.getElementById('cvModal');
    const openCvBtns = document.querySelectorAll('.open-cv-modal');
    const closeCvBtn = document.getElementById('closeCvModal');
    const printCvBtn = document.getElementById('printCvBtn');

    openCvBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cvModal) {
                cvModal.classList.remove('pointer-events-none');
                cvModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeCvBtn && cvModal) {
        closeCvBtn.addEventListener('click', () => {
            cvModal.classList.remove('active');
            cvModal.classList.add('pointer-events-none');
            document.body.style.overflow = '';
        });
    }

    if (cvModal) {
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal || e.target.classList.contains('modal-backdrop')) {
                cvModal.classList.remove('active');
                cvModal.classList.add('pointer-events-none');
                document.body.style.overflow = '';
            }
        });
    }

    if (printCvBtn) {
        printCvBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 13. COPY-TO-CLIPBOARD WITH CONFETTI & TOAST
    window.copyToClipboard = function(text, label) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`${label} berhasil disalin! 📋`);
            triggerConfetti();
        }).catch(err => {
            showToast(`Gagal menyalin: ${text}`);
        });
    };

    function showToast(msg) {
        const toast = document.getElementById('toastNotification');
        const toastMsg = document.getElementById('toastMessage');
        if (toast && toastMsg) {
            toastMsg.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3200);
        }
    }

    function triggerConfetti() {
        if (window.confetti) {
            confetti({
                particleCount: 55,
                spread: 65,
                origin: { y: 0.85 },
                colors: ['#ec4899', '#8b5cf6', '#06b6d4', '#fbbf24', '#10b981']
            });
        }
    }

    // 14. CIRCULAR SCROLL PROGRESS & BACK TO TOP
    const backToTopBtn = document.getElementById('backToTopBtn');
    const scrollProgressCircle = document.getElementById('scrollProgressCircle');
    const circumference = 2 * Math.PI * 18;

    if (scrollProgressCircle) {
        scrollProgressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        scrollProgressCircle.style.strokeDashoffset = circumference;
    }

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight);

        if (scrollProgressCircle) {
            const offset = circumference - (scrollPercent * circumference);
            scrollProgressCircle.style.strokeDashoffset = offset;
        }

        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-6');
                backToTopBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-6');
                backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 15. MOBILE DRAWER NAVIGATION
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenu');

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.remove('translate-x-full');
            mobileDrawer.classList.add('translate-x-0');
        });
    }

    if (closeMobileMenuBtn && mobileDrawer) {
        closeMobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.add('translate-x-full');
            mobileDrawer.classList.remove('translate-x-0');
        });
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer) {
                mobileDrawer.classList.add('translate-x-full');
                mobileDrawer.classList.remove('translate-x-0');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            if (cvModal) {
                cvModal.classList.remove('active');
                cvModal.classList.add('pointer-events-none');
                document.body.style.overflow = '';
            }
        }
    });
});
