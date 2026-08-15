/* -------------------------------------------------------------
   FI PATEL ELECTRICALS - MAIN APPLICATION ENGINE
   ------------------------------------------------------------- */

// #11: Page Loading Spinner - hide after DOM ready
function initPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 600);
  }
}

// Hero Slideshow Controller (Ken Burns Crossfade + #4 Touch Swipe)
function initHeroSlideshow() {
  const slides = document.querySelectorAll('#heroSlideshow .slide');
  const dots = document.querySelectorAll('#sliderDotsBar .slider-dot');
  const wrapper = document.getElementById('heroSliderWrapper');

  let currentIndex = 0;
  const progressFill = document.getElementById('heroProgressFill');
  let progressTimer = null;
  let progressWidth = 0;
  const SLIDE_DURATION = 3500;
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

  // Dot click handlers
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.getAttribute('data-index')) || 0;
      goToSlide(targetIndex);
      startAutoPlay();
    });
  });

  // Arrow navigation handlers
  const prevArrow = document.getElementById('heroSlidePrev');
  const nextArrow = document.getElementById('heroSlideNext');
  if (prevArrow) prevArrow.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
  if (nextArrow) nextArrow.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

  // Hover pause (desktop)
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
  }

  // #4: Touch Swipe Support for Mobile
  if (wrapper) {
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50;

    wrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff > 0) {
          nextSlide(); // Swipe left → next
        } else {
          prevSlide(); // Swipe right → prev
        }
      }
      startAutoPlay();
    }, { passive: true });
  }

  startAutoPlay();
}

// 3D Scroll Reveal Animation Observer
function init3DScrollObserver() {
  const elementsToAnimate = document.querySelectorAll(
    '.reveal-3d-scroll, .why-card, .step-card, .team-contact-card, .testimonial-card, .calc-card, .inquiry-box, .location-card, .video-frame-card'
  );

  elementsToAnimate.forEach(el => el.classList.add('reveal-3d-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px 50px 0px'
  });

  elementsToAnimate.forEach(el => observer.observe(el));
}

// Mobile Menu Toggle
function initMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
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
        let count = 0;
        const speed = Math.max(Math.floor(target / 40), 1);
        const timer = setInterval(() => {
          count += speed;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          el.textContent = count + suffix;
        }, 30);
      });
    }
  }, { threshold: 0.3 });

  observer.observe(section);
}

// Form Submission Handler (sends direct lead to WhatsApp)
function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  const alertBox = document.getElementById('formAlertBox');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formNameInput')?.value || '';
      const phone = document.getElementById('formPhoneInput')?.value || '';
      const city = document.getElementById('formCityInput')?.value || '';
      const email = document.getElementById('formEmailInput')?.value || 'Not provided';
      const sector = document.getElementById('formSectorSelect')?.value || 'Residential';

      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.style.background = '#d1fae5';
        alertBox.style.color = '#065f46';
        alertBox.textContent = '✅ Inquiry Submitted! Redirecting to WhatsApp...';
      }

      // Build structured WhatsApp message
      const textMessage = `Hello Fi Patel Electricals,\n\nI want a Solar Rooftop Inquiry:\n• Name: ${name}\n• Mobile: ${phone}\n• City/Area: ${city}\n• Email: ${email}\n• Category: ${sector}`;
      const waUrl = `https://wa.me/919409264992?text=${encodeURIComponent(textMessage)}`;

      setTimeout(() => {
        window.open(waUrl, '_blank');
        form.reset();
        if (alertBox) alertBox.style.display = 'none';
      }, 1200);
    });
  }
}

// Unique One-by-One Photo Showcase Controller
function initWorkShowcase() {
  const stage = document.getElementById('workStage');
  const slides = document.querySelectorAll('#workStage .work-slide');
  const thumbs = document.querySelectorAll('#workThumbnails .thumb-item');
  const prevBtn = document.getElementById('workPrevBtn');
  const nextBtn = document.getElementById('workNextBtn');
  const counter = document.getElementById('workCounter');
  const progressBar = document.getElementById('showcaseProgress');
  const container = document.getElementById('workShowcase');

  if (!slides || slides.length === 0) return;

  let currentIndex = 0;
  let autoTimer = null;
  let progressTimer = null;
  let progressWidth = 0;
  const DURATION = 4500; // ms per slide
  const INTERVAL = 50;

  function updateSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    thumbs.forEach(thumb => thumb.classList.remove('active'));

    currentIndex = ((index % slides.length) + slides.length) % slides.length;

    // Horizontal Swipe Animation
    if (stage) {
      stage.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    slides[currentIndex].classList.add('active');
    if (thumbs[currentIndex]) {
      thumbs[currentIndex].classList.add('active');
    }

    if (counter) {
      const currentFormatted = String(currentIndex + 1).padStart(2, '0');
      const totalFormatted = String(slides.length).padStart(2, '0');
      counter.textContent = `${currentFormatted} / ${totalFormatted}`;
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
        nextSlide();
      }
    }, INTERVAL);
  }

  function stopProgress() {
    if (progressTimer) clearInterval(progressTimer);
  }

  function nextSlide() {
    updateSlide(currentIndex + 1);
  }

  function prevSlide() {
    updateSlide(currentIndex - 1);
  }

  // Event Listeners
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startProgress(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startProgress(); });

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const idx = parseInt(thumb.getAttribute('data-index')) || 0;
      updateSlide(idx);
      startProgress();
    });
  });

  // Touch Swipe for Mobile
  if (container) {
    let startX = 0;
    let endX = 0;

    container.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
      stopProgress();
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      const diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startProgress();
    }, { passive: true });

    // Hover Pause (Desktop)
    container.addEventListener('mouseenter', stopProgress);
    container.addEventListener('mouseleave', startProgress);
  }

  // Initial Boot
  updateSlide(0);
  startProgress();
}

// Navbar Scroll Shadow & Back To Top Button
function initScrollFeatures() {
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// FAQ Accordion Toggle Controller
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all items
        faqItems.forEach(el => el.classList.remove('active'));
        // If clicked item wasn't active, open it
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// Mobile Swipe Hint Auto Fade
function initMobileSwipeHint() {
  const hint = document.getElementById('mobileSwipeHint');
  if (hint) {
    setTimeout(() => {
      hint.style.opacity = '0';
      hint.style.transition = 'opacity 0.8s ease';
      setTimeout(() => hint.remove(), 800);
    }, 4500);
  }
}

// Boot Application
document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initHeroSlideshow();
  initWorkShowcase();
  initStatCounters();
  init3DScrollObserver();
  initMobileMenu();
  initInquiryForm();
  initFaqAccordion();
  initMobileSwipeHint();
  initScrollFeatures();
});

