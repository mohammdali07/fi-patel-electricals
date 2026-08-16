/* -------------------------------------------------------------
   FI PATEL ELECTRICALS - ULTRA PREMIUM APPLICATION ENGINE
   ------------------------------------------------------------- */

// ==========================================
// 1. WEB AUDIO API SOUND GENERATOR & TOGGLE
// ==========================================
class SoundFXEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false; // Muted as per user preference
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.08) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback swallow
    }
  }

  click() {
    this.playTone(580, 'sine', 0.06, 0.06);
  }

  slide() {
    this.playTone(440, 'triangle', 0.04, 0.03);
  }

  success() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.08, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    } catch (e) {}
  }
}

const sfx = new SoundFXEngine();

function initSoundToggle() {
  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      if (sfx.enabled) {
        soundBtn.classList.add('sound-on');
        soundBtn.setAttribute('title', 'Sound Effects Enabled');
        soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        sfx.click();
      } else {
        soundBtn.classList.remove('sound-on');
        soundBtn.setAttribute('title', 'Sound Effects Muted');
        soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      }
    });
  }

  // Resume audio context on first click anywhere
  document.addEventListener('click', () => sfx.init(), { once: true });
}

// ==========================================
// 2. HERO SLIDESHOW WITH TOUCH & PROGRESS
// ==========================================
function initHeroSlideshow() {
  const slides = document.querySelectorAll('#heroSlideshow .slide');
  const dots = document.querySelectorAll('#heroDotsBar .slider-dot');
  const wrapper = document.getElementById('heroSliderWrapper');
  const progressFill = document.getElementById('heroProgressFill');

  if (!slides || slides.length === 0) return;

  let currentIndex = 0;
  let progressTimer = null;
  let progressWidth = 0;
  const SLIDE_DURATION = 4000;
  const PROGRESS_INTERVAL = 50;

  function resetProgressBar() {
    progressWidth = 0;
    if (progressFill) progressFill.style.width = '0%';
  }

  function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentIndex = ((index % slides.length) + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    resetProgressBar();
    sfx.slide();
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  function startAutoPlay() {
    stopAutoPlay();
    progressTimer = setInterval(() => {
      progressWidth += (PROGRESS_INTERVAL / SLIDE_DURATION) * 100;
      if (progressFill) progressFill.style.width = Math.min(progressWidth, 100) + '%';
      if (progressWidth >= 100) {
        nextSlide();
      }
    }, PROGRESS_INTERVAL);
  }

  function stopAutoPlay() {
    if (progressTimer) clearInterval(progressTimer);
  }

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index')) || 0;
      goToSlide(idx);
      startAutoPlay();
    });
  });

  // Arrows
  const prevArrow = document.getElementById('heroSlidePrev');
  const nextArrow = document.getElementById('heroSlideNext');
  if (prevArrow) prevArrow.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
  if (nextArrow) nextArrow.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

  // Hover Pause
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);

    // Touch Swipe
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoPlay();
    }, { passive: true });
  }

  startAutoPlay();
}

const GALLERY_DATA = [
  { id: 0, src: "PRoject completed/ChatGPT Image Aug 15, 2026, 10_47_10 AM.png", title: "High-Efficiency Mono PERC Installation", location: "Vasna, Gujarat", cat: "residential", catLabel: "Residential" },
  { id: 1, src: "PRoject completed/ChatGPT Image Aug 15, 2026, 10_56_16 AM.png", title: "Heavy Galvanized Structure Mounting", location: "Kanai, Himmatnagar", cat: "mounting", catLabel: "Mounting" },
  { id: 2, src: "PRoject completed/ChatGPT Image Aug 15, 2026, 10_56_26 AM.png", title: "Industrial Power Generation Plant", location: "Kesharpura, Sabarkantha", cat: "commercial", catLabel: "Commercial" }
];

let activeFilteredList = [...GALLERY_DATA];
let currentLightboxIndex = 0;

function initGalleryAndLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const photoGrid = document.getElementById('projectPhotoGrid');
  const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
  const showcaseContainer = document.getElementById('workShowcase');
  const gridWrapper = document.getElementById('photoGridWrapper');

  // Filter Pills Logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.click();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      if (filter === 'all') {
        activeFilteredList = [...GALLERY_DATA];
      } else {
        activeFilteredList = GALLERY_DATA.filter(item => item.cat === filter);
      }

      renderPhotoGrid(activeFilteredList);
      updateCarouselSlides(activeFilteredList);
    });
  });

  // View Switcher (Grid vs Carousel Stage)
  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.click();
      viewToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-view');
      if (mode === 'carousel') {
        if (showcaseContainer) showcaseContainer.style.display = 'block';
        if (gridWrapper) gridWrapper.style.display = 'none';
      } else {
        if (showcaseContainer) showcaseContainer.style.display = 'none';
        if (gridWrapper) gridWrapper.style.display = 'block';
      }
    });
  });

  // Initial Grid Render
  renderPhotoGrid(activeFilteredList);
  initLightboxModal();
  initWorkShowcase();
}

function renderPhotoGrid(items) {
  const grid = document.getElementById('projectPhotoGrid');
  if (!grid) return;

  grid.innerHTML = items.map((item, idx) => `
    <div class="grid-photo-card reveal-3d-scroll" data-index="${idx}" data-src="${item.src}">
      <img src="${item.src}" alt="${item.title}" loading="lazy">
    </div>
  `).join('');

  // Attach click listener for Lightbox
  grid.querySelectorAll('.grid-photo-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index')) || 0;
      openLightbox(idx);
    });
  });
}

function initWorkShowcase() {
  const stage = document.getElementById('workStage');
  const prevBtn = document.getElementById('workPrevBtn');
  const nextBtn = document.getElementById('workNextBtn');
  const counter = document.getElementById('workCounter');
  const dotsBar = document.getElementById('workDotsBar');
  const progressBar = document.getElementById('showcaseProgress');
  const container = document.getElementById('workShowcase');

  if (!stage) return;

  let currentIndex = 0;
  let progressTimer = null;
  let progressWidth = 0;
  const DURATION = 4500;
  const INTERVAL = 50;

  window.updateCarouselSlides = function(items) {
    stage.innerHTML = items.map((item, idx) => `
      <div class="work-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <img src="${item.src}" alt="${item.title}" loading="lazy">
        <div class="slide-location-badge">
          <i class="fa-solid fa-location-dot"></i> ${item.location || 'Kanai, Himmatnagar'}
        </div>
      </div>
    `).join('');

    if (dotsBar) {
      dotsBar.innerHTML = items.map((_, idx) => `
        <button class="slider-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Project ${idx + 1}"></button>
      `).join('');

      dotsBar.querySelectorAll('.slider-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          const idx = parseInt(e.target.getAttribute('data-index')) || 0;
          goToSlide(idx);
        });
      });
    }

    // Attach fullscreen handler to slides
    stage.querySelectorAll('.work-slide').forEach((slide, idx) => {
      slide.addEventListener('click', () => openLightbox(idx));
    });

    goToSlide(0);
  };

  function goToSlide(index) {
    const slides = stage.querySelectorAll('.work-slide');
    const dots = dotsBar ? dotsBar.querySelectorAll('.slider-dot') : [];
    if (!slides || slides.length === 0) return;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentIndex = ((index % slides.length) + slides.length) % slides.length;
    stage.style.transform = `translateX(-${currentIndex * 100}%)`;

    if (slides[currentIndex]) slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');

    if (counter) {
      const cur = String(currentIndex + 1).padStart(2, '0');
      const tot = String(slides.length).padStart(2, '0');
      counter.textContent = `${cur} / ${tot}`;
    }

    resetProgressBar();
  }

  function resetProgressBar() {
    progressWidth = 0;
    if (progressBar) progressBar.style.width = '0%';
  }

  function startProgress() {
    stopProgress();
    progressTimer = setInterval(() => {
      progressWidth += (INTERVAL / DURATION) * 100;
      if (progressBar) progressBar.style.width = Math.min(progressWidth, 100) + '%';
      if (progressWidth >= 100) {
        goToSlide(currentIndex + 1);
      }
    }, INTERVAL);
  }

  function stopProgress() {
    if (progressTimer) clearInterval(progressTimer);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); startProgress(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); startProgress(); });

  if (container) {
    let startX = 0;
    container.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
      stopProgress();
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].screenX;
      const diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
      startProgress();
    }, { passive: true });

    container.addEventListener('mouseenter', stopProgress);
    container.addEventListener('mouseleave', startProgress);
  }

  updateCarouselSlides(activeFilteredList);
  startProgress();
}

// Lightbox Modal
function initLightboxModal() {
  const modal = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  if (!modal) return;

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    sfx.click();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentLightboxIndex = ((currentLightboxIndex - 1) + activeFilteredList.length) % activeFilteredList.length;
    updateLightboxContent();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % activeFilteredList.length;
    updateLightboxContent();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}

function openLightbox(index) {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;

  currentLightboxIndex = index;
  updateLightboxContent();
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  sfx.click();
}

function updateLightboxContent() {
  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  const cat = document.getElementById('lightboxCat');
  const loc = document.getElementById('lightboxLoc');
  const waBtn = document.getElementById('lightboxWaBtn');

  const item = activeFilteredList[currentLightboxIndex];
  if (!item) return;

  if (img) img.src = item.src;
  if (title) title.textContent = item.title;
  if (cat) cat.textContent = item.catLabel;
  if (loc) loc.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${item.location || 'Kanai, Himmatnagar'}`;

  if (waBtn) {
    const waMsg = `Hello Fi Patel Electricals,\nI saw this solar project in your gallery and want details:\n• Title: ${item.title}\n• Location: ${item.location || 'Kanai, Himmatnagar'}`;
    waBtn.href = `https://wa.me/919409264992?text=${encodeURIComponent(waMsg)}`;
  }
}

// ==========================================
// 4. CUSTOM VIDEO PLAYER (Installisation.mp4)
// ==========================================
function initCustomVideoPlayer() {
  const video = document.getElementById('projectVideo');
  if (!video) return;

  video.muted = true;
  video.loop = true;

  const ensurePlay = () => {
    if (video.paused) {
      video.play().catch(() => {});
    }
  };

  ensurePlay();
  video.addEventListener('pause', ensurePlay);
  window.addEventListener('scroll', ensurePlay, { passive: true });
  document.addEventListener('touchstart', ensurePlay, { passive: true });
  document.addEventListener('click', ensurePlay, { passive: true });
}

// ==========================================
// 5. HIMMATNAGAR SUN HOURS & SOLAR CALCULATOR WIDGET
// ==========================================
function initSunHoursWidget() {
  const capacityInput = document.getElementById('sunCapacityInput');
  const dailyOutput = document.getElementById('dailyOutputVal');
  const co2Output = document.getElementById('co2OutputVal');

  if (!capacityInput) return;

  function calculateSunData() {
    const kw = parseFloat(capacityInput.value) || 3.24;
    // Sabarkantha average solar irradiation = ~4.5 - 5.4 kWh/kWp/day
    const dailyUnits = Math.round(kw * 4.8);
    // CO2 offset ~0.85 kg per kWh saved
    const dailyCO2 = Math.round(dailyUnits * 0.85);

    if (dailyOutput) dailyOutput.textContent = `${dailyUnits} Units / Day`;
    if (co2Output) co2Output.textContent = `${dailyCO2} kg CO₂ Saved / Day`;
  }

  capacityInput.addEventListener('input', () => {
    calculateSunData();
    sfx.slide();
  });

  calculateSunData();
}

// ==========================================
// 6. FAQ ACCORDION & REAL-TIME SEARCH FILTER
// ==========================================
function initFaqAccordionAndSearch() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faqSearchInput');

  // Accordion Toggle
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(el => el.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
          sfx.click();
        }
      });
    }
  });

  // Real-time Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

// ==========================================
// 7. INQUIRY FORM & WHATSAPP DIRECT LEAD ROUTING
// ==========================================
function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  const alertBox = document.getElementById('formAlertBox');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formNameInput')?.value || '';
    const phone = document.getElementById('formPhoneInput')?.value || '';
    const city = document.getElementById('formCityInput')?.value || '';
    const email = document.getElementById('formEmailInput')?.value || 'Not provided';
    const sector = document.getElementById('formSectorSelect')?.value || 'Residential';

    sfx.success();

    if (alertBox) {
      alertBox.style.display = 'block';
      alertBox.style.background = '#d1fae5';
      alertBox.style.color = '#065f46';
      alertBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> Inquiry Received! Connecting to WhatsApp...';
    }

    const textMessage = `☀️ *NEW SOLAR INQUIRY - FI PATEL ELECTRICALS*\n\n• *Name:* ${name}\n• *Mobile:* ${phone}\n• *City/Location:* ${city}\n• *Email:* ${email}\n• *Installation Type:* ${sector}\n\n_Sent via Official Website Inquiry Form_`;
    const waUrl = `https://wa.me/919409264992?text=${encodeURIComponent(textMessage)}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
      form.reset();
      if (alertBox) alertBox.style.display = 'none';
    }, 1200);
  });
}

// ==========================================
// 8. SCROLL OBSERVER & SCROLL PROGRESS
// ==========================================
function initScrollFeatures() {
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const scrollProgress = document.getElementById('globalScrollProgress');
  const heroContent = document.querySelector('.hero-content');
  const heroSlider = document.querySelector('.hero-image-wrapper');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Reading Progress Bar
    if (scrollProgress && docHeight > 0) {
      const pct = (scrollY / docHeight) * 100;
      scrollProgress.style.width = Math.min(Math.max(pct, 0), 100) + '%';
    }

    // Navbar Scrolled Effect
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Hero Parallax Fade (Desktop)
    if (scrollY < 650 && window.innerWidth > 768) {
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.1}px)`;
        heroContent.style.opacity = Math.max(1 - (scrollY / 850), 0.7);
      }
      if (heroSlider) {
        heroSlider.style.transform = `translateY(${scrollY * 0.05}px)`;
      }
    }

    // Scrollspy Nav Links
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentSection && link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    // Back to Top Button
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      sfx.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Mobile Hamburger Menu
function initMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      sfx.click();
    });

    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }
}

// Animated Stat Counters Observer
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  const section = document.getElementById('statsCounterBar');

  if (!section || !statNumbers || statNumbers.length === 0) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      statNumbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const duration = 1600;
        const stepTime = 25;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current) + suffix;
        }, stepTime);
      });
    }
  }, { threshold: 0.2 });

  observer.observe(section);
}

// PWA Service Worker & Install Prompt
function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then((reg) => {
        reg.update();
      }).catch(err => {
        console.log('SW registration failed:', err);
      });
    });
  }

  let deferredPrompt;
  const pwaBtn = document.getElementById('pwaInstallBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBtn) {
      pwaBtn.style.display = 'inline-flex';
      pwaBtn.addEventListener('click', () => {
        pwaBtn.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          deferredPrompt = null;
        });
      });
    }
  });
}

// ==========================================
// BOOT APPLICATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initSoundToggle();
  initHeroSlideshow();
  initGalleryAndLightbox();
  initCustomVideoPlayer();
  initSunHoursWidget();
  initFaqAccordionAndSearch();
  initInquiryForm();
  initScrollFeatures();
  initMobileMenu();
  initStatCounters();
  initPWA();
});
