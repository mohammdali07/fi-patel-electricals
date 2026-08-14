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

  if (!slides || slides.length === 0) return;

  let currentIndex = 0;
  let slideTimer = null;

  function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentIndex = ((index % slides.length) + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  function startAutoPlay() {
    stopAutoPlay();
    slideTimer = setInterval(nextSlide, 3500);
  }
  function stopAutoPlay() {
    if (slideTimer) clearInterval(slideTimer);
  }

  // Dot click handlers
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.getAttribute('data-index')) || 0;
      goToSlide(targetIndex);
      startAutoPlay();
    });
  });

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
    '.team-contact-card, .gallery-card, .testimonial-card, .calc-card, .inquiry-box, .location-card, .video-frame-card'
  );

  elementsToAnimate.forEach(el => el.classList.add('reveal-3d-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
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
    });

    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

// Form Submission Handler (now includes email field)
function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  const alertBox = document.getElementById('formAlertBox');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.style.background = '#d1fae5';
        alertBox.style.color = '#065f46';
        alertBox.textContent = '✅ Thank you! Our team will contact you shortly.';
      }

      form.reset();
      setTimeout(() => {
        if (alertBox) alertBox.style.display = 'none';
      }, 5000);
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
      thumbs[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
      navbar.style.boxShadow = scrollY > 40
        ? '0 10px 30px rgba(0, 0, 0, 0.12)'
        : '0 4px 20px rgba(0, 0, 0, 0.06)';
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

// Boot Application
document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initHeroSlideshow();
  initWorkShowcase();
  init3DScrollObserver();
  initMobileMenu();
  initInquiryForm();
  initScrollFeatures();
});

