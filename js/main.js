/**
 * PATEL WINDOW & DOOR - Main Website Interactions
 * Mobile Menu, Thermal Slider, Counters, Modals, Forms
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileNav();
    initHero3DSlider();
    initThermalSlider();
    initProductFilters();
    initProductThumbnails();
    initGalleryFiltersAndLightbox();
    initAnimatedCounters();
    initQuoteModal();
    initFormHandling();
  });

  // Sticky Header
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile Navigation Drawer
  function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-menu');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking any nav link
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking mobile quote button
    const mobileQuoteBtn = document.querySelector('.mobile-quote-btn');
    if (mobileQuoteBtn) {
      mobileQuoteBtn.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===================================================================
  // HERO 3D PERSPECTIVE SLIDER ANIMATION ENGINE
  // ===================================================================
  function initHero3DSlider() {
    const track = document.getElementById('hero3dTrack');
    const wrapper = document.getElementById('hero3dWrapper');
    const slides = document.querySelectorAll('.slide-3d-item');
    const prevBtn = document.getElementById('sliderPrevBtn');
    const nextBtn = document.getElementById('sliderNextBtn');
    const curIdxEl = document.getElementById('sliderCurIdx');
    const totalCountEl = document.getElementById('sliderTotalCount');
    const dotsContainer = document.getElementById('sliderDots');
    const playPauseBtn = document.getElementById('sliderPlayPauseBtn');

    if (!track || !slides.length) return;

    const N = slides.length;
    let currentIndex = 0;
    let autoPlayTimer = null;
    let isPlaying = true;
    const AUTOPLAY_DELAY = 3600;

    if (totalCountEl) {
      totalCountEl.textContent = N.toString().padStart(2, '0');
    }

    // Build Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < N; i++) {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(i);
          restartAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];

    // Core 3D Positioning Logic
    function update3DSlides() {
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;

      slides.forEach((slide, i) => {
        let diff = (i - currentIndex) % N;
        if (diff < -Math.floor(N / 2)) diff += N;
        if (diff > Math.floor(N / 2)) diff -= N;

        if (diff === 0) {
          // Center Active Card
          slide.classList.add('active');
          slide.style.transform = 'translate3d(0, 0, 0) scale(1) rotateY(0deg)';
          slide.style.zIndex = '20';
          slide.style.opacity = '1';
          slide.style.filter = 'none';
          slide.style.pointerEvents = 'auto';
        } else if (diff === 1) {
          // Right Immediate Card
          slide.classList.remove('active');
          const tx = isSmallMobile ? '46%' : isMobile ? '52%' : '56%';
          const tz = isSmallMobile ? '-140px' : '-180px';
          const ry = isSmallMobile ? '-22deg' : '-32deg';
          const sc = isSmallMobile ? '0.84' : '0.82';
          slide.style.transform = `translate3d(${tx}, 0, ${tz}) scale(${sc}) rotateY(${ry})`;
          slide.style.zIndex = '10';
          slide.style.opacity = '0.78';
          slide.style.filter = 'brightness(0.65)';
          slide.style.pointerEvents = 'auto';
        } else if (diff === -1) {
          // Left Immediate Card
          slide.classList.remove('active');
          const tx = isSmallMobile ? '-46%' : isMobile ? '-52%' : '-56%';
          const tz = isSmallMobile ? '-140px' : '-180px';
          const ry = isSmallMobile ? '22deg' : '32deg';
          const sc = isSmallMobile ? '0.84' : '0.82';
          slide.style.transform = `translate3d(${tx}, 0, ${tz}) scale(${sc}) rotateY(${ry})`;
          slide.style.zIndex = '10';
          slide.style.opacity = '0.78';
          slide.style.filter = 'brightness(0.65)';
          slide.style.pointerEvents = 'auto';
        } else if (diff === 2) {
          // Right Outer Card
          slide.classList.remove('active');
          const tx = isSmallMobile ? '82%' : '94%';
          const tz = isSmallMobile ? '-260px' : '-340px';
          const ry = isSmallMobile ? '-35deg' : '-45deg';
          slide.style.transform = `translate3d(${tx}, 0, ${tz}) scale(0.66) rotateY(${ry})`;
          slide.style.zIndex = '5';
          slide.style.opacity = '0.45';
          slide.style.filter = 'brightness(0.4)';
          slide.style.pointerEvents = 'auto';
        } else if (diff === -2) {
          // Left Outer Card
          slide.classList.remove('active');
          const tx = isSmallMobile ? '-82%' : '-94%';
          const tz = isSmallMobile ? '-260px' : '-340px';
          const ry = isSmallMobile ? '35deg' : '45deg';
          slide.style.transform = `translate3d(${tx}, 0, ${tz}) scale(0.66) rotateY(${ry})`;
          slide.style.zIndex = '5';
          slide.style.opacity = '0.45';
          slide.style.filter = 'brightness(0.4)';
          slide.style.pointerEvents = 'auto';
        } else {
          // Far Cards (Hidden in 3D background)
          slide.classList.remove('active');
          slide.style.transform = 'translate3d(0, 0, -500px) scale(0.5)';
          slide.style.zIndex = '0';
          slide.style.opacity = '0';
          slide.style.filter = 'brightness(0.2)';
          slide.style.pointerEvents = 'none';
        }
      });

      // Update Counter
      if (curIdxEl) {
        curIdxEl.textContent = (currentIndex + 1).toString().padStart(2, '0');
      }

      // Update Dots
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
          if (dotsContainer) {
            // Scroll ONLY the dotsContainer horizontally without affecting window/page scroll
            const dotLeft = dot.offsetLeft;
            const dotWidth = dot.offsetWidth;
            const containerWidth = dotsContainer.clientWidth;
            dotsContainer.scrollTo({
              left: dotLeft - (containerWidth / 2) + (dotWidth / 2),
              behavior: 'smooth'
            });
          }
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function goToSlide(index) {
      currentIndex = (index + N) % N;
      update3DSlides();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    // Direct Click on Slide Cards
    slides.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        if (i !== currentIndex) {
          goToSlide(i);
          restartAutoplay();
        }
      });
    });

    // Arrow Nav
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        restartAutoplay();
      });
    }

    // Touch Swipe Support (differentiates horizontal swipe from vertical page scroll)
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    if (wrapper) {
      wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        // Only trigger slide transition if horizontal swipe is clearly dominant
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          restartAutoplay();
        }
      }, { passive: true });

      // Pause on mouse hover
      wrapper.addEventListener('mouseenter', pauseAutoplay);
      wrapper.addEventListener('mouseleave', () => {
        if (isPlaying) startAutoplay();
      });
    }

    // Autoplay Controls
    function startAutoplay() {
      stopAutoplay();
      autoPlayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function pauseAutoplay() {
      stopAutoplay();
    }

    function restartAutoplay() {
      if (isPlaying) {
        startAutoplay();
      }
    }

    if (playPauseBtn) {
      const pauseIcon = playPauseBtn.querySelector('.icon-pause');
      const playIcon = playPauseBtn.querySelector('.icon-play');

      playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
          startAutoplay();
          if (pauseIcon) pauseIcon.style.display = 'block';
          if (playIcon) playIcon.style.display = 'none';
        } else {
          stopAutoplay();
          if (pauseIcon) pauseIcon.style.display = 'none';
          if (playIcon) playIcon.style.display = 'block';
        }
      });
    }

    // Responsive window resize recalculation (ignores vertical address bar resize on mobile)
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        update3DSlides();
      }
    });

    // Pause autoplay when hero slider is offscreen to save mobile battery and avoid background ticks
    if ('IntersectionObserver' in window && wrapper) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            stopAutoplay();
          } else if (isPlaying) {
            startAutoplay();
          }
        });
      }, { threshold: 0.1 });
      heroObserver.observe(wrapper);
    }

    // Initial render & start autoplay
    update3DSlides();
    startAutoplay();
  }

  // Interactive Thermal Comparison Slider (Drag before & after)
  function initThermalSlider() {
    const container = document.querySelector('.slider-container');
    const handle = document.querySelector('.slider-handle');
    const beforeImg = document.querySelector('.img-before');

    if (!container || !handle || !beforeImg) return;

    let isDragging = false;

    function setPosition(xPos) {
      const rect = container.getBoundingClientRect();
      let offsetX = xPos - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      handle.style.left = `${percentage}%`;
      beforeImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    }

    handle.addEventListener('mousedown', () => (isDragging = true));
    window.addEventListener('mouseup', () => (isDragging = false));

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    // Touch support for smartphones/tablets
    handle.addEventListener('touchstart', () => (isDragging = true), { passive: true });
    window.addEventListener('touchend', () => (isDragging = false));
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    // Click container to move directly
    container.addEventListener('click', (e) => {
      setPosition(e.clientX);
    });
  }

  // Product Category Filters
  function initProductFilters() {
    const filterTabs = document.querySelectorAll('.product-filter-tabs .filter-tab');
    const productCards = document.querySelectorAll('.product-card');

    if (!filterTabs.length || !productCards.length) return;

    function applyFilter(category) {
      filterTabs.forEach((t) => {
        if (t.getAttribute('data-filter') === category) {
          t.classList.add('active');
        } else {
          t.classList.remove('active');
        }
      });

      productCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category') || '';
        const cats = cardCat.split(' ');
        if (category === 'all' || cats.includes(category) || cardCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-filter');
        applyFilter(category);
      });
    });

    // Handle Nav links pointing to #windows, #doors, #conservatories-roofing
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href') || '';
        const hash = href.split('#')[1];
        if (hash === 'windows') {
          applyFilter('windows');
        } else if (hash === 'doors') {
          applyFilter('doors');
        } else if (hash === 'conservatories-roofing') {
          applyFilter('roofing');
        }
      });
    });

    // On page load if hash matches
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (hash === 'windows') applyFilter('windows');
      else if (hash === 'doors') applyFilter('doors');
      else if (hash === 'conservatories-roofing') applyFilter('roofing');
    }
  }

  // Product Card Mini Thumbnails Switcher
  function initProductThumbnails() {
    const thumbRows = document.querySelectorAll('.product-thumb-row');
    thumbRows.forEach((row) => {
      const targetId = row.getAttribute('data-main-target');
      const mainImg = document.getElementById(targetId);
      if (!mainImg) return;

      const thumbs = row.querySelectorAll('.prod-thumb');
      thumbs.forEach((thumb) => {
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          thumbs.forEach((t) => t.classList.remove('active'));
          thumb.classList.add('active');
          mainImg.src = thumb.src;
        });
      });
    });
  }

  // Authentic Systems Gallery Filters & High-Res Lightbox Modal
  function initGalleryFiltersAndLightbox() {
    const galleryTabs = document.querySelectorAll('.gallery-filter-tabs .gallery-tab');
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxCloseBtn');

    // Filter Tabs
    if (galleryTabs.length && galleryCards.length) {
      galleryTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          galleryTabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');

          const filter = tab.getAttribute('data-gallery-filter');

          galleryCards.forEach((card) => {
            const cardCat = card.getAttribute('data-gallery-category') || '';
            const cats = cardCat.split(' ');
            if (filter === 'all' || cats.includes(filter) || cardCat === filter) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }

    // Lightbox modal opener
    if (lightbox && lightboxImg) {
      galleryCards.forEach((card) => {
        card.addEventListener('click', () => {
          const imgEl = card.querySelector('img');
          const titleEl = card.querySelector('.gallery-title');
          if (imgEl) {
            lightboxImg.src = imgEl.src;
            lightboxImg.alt = imgEl.alt || 'Architectural System';
          }
          if (lightboxCaption && titleEl) {
            lightboxCaption.textContent = titleEl.textContent;
          }
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
      });

      function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }

      if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
      }

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
          closeLightbox();
        }
      });
    }
  }

  // Animated Number Counters on Scroll
  function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.getAttribute('data-count'));
            const suffix = el.getAttribute('data-suffix') || '';
            const isDecimal = target % 1 !== 0;

            let current = 0;
            const step = target / 50;

            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                el.textContent = (isDecimal ? target.toFixed(2) : Math.round(target)) + suffix;
                clearInterval(timer);
              } else {
                el.textContent = (isDecimal ? current.toFixed(2) : Math.round(current)) + suffix;
              }
            }, 25);

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  // Quote Modal Triggers
  function initQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (!modal) return;

    const openBtns = document.querySelectorAll('[data-open-modal="quoteModal"]');
    const closeBtn = modal.querySelector('.modal-close-btn');

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const preferredSystem = btn.getAttribute('data-product-name');
        if (preferredSystem) {
          const sysSelect = document.getElementById('quoteSystem');
          if (sysSelect) sysSelect.value = preferredSystem;
        }
        modal.classList.add('open');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        modal.classList.remove('open');
      }
    });
  }

  // Form Handling & File Upload Feedback
  function initFormHandling() {
    const form = document.getElementById('quoteForm');
    const fileInput = document.getElementById('blueprintFile');
    const dropzone = document.querySelector('.file-dropzone');
    const fileMsg = document.getElementById('fileUploadMsg');

    if (fileInput && dropzone && fileMsg) {
      dropzone.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          fileMsg.textContent = `Attached: ${fileInput.files[0].name} (${(fileInput.files[0].size / 1024 / 1024).toFixed(2)} MB)`;
          fileMsg.style.color = '#38bdf8';
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting Architectural Spec...';

        setTimeout(() => {
          submitBtn.textContent = '✓ Inquiry Sent Successfully!';
          submitBtn.style.background = '#10b981';
          submitBtn.style.color = '#ffffff';

          setTimeout(() => {
            const modal = document.getElementById('quoteModal');
            if (modal) modal.classList.remove('open');
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
            submitBtn.style.background = '';
            submitBtn.style.color = '';
            form.reset();
            if (fileMsg) fileMsg.textContent = 'Drag and drop Architectural Blueprint / CAD (DWG, PDF, ZIP) or click to browse';
          }, 1800);
        }, 1200);
      });
    }
  }
})();
