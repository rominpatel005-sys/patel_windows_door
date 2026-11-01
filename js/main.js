/**
 * PATEL WINDOW & DOOR - Main Website Interactions
 * Mobile Menu, Thermal Slider, Counters, Modals, Forms
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileNav();
    initThermalSlider();
    initProductFilters();
    initProjectFilters();
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

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking any nav link
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
      });
    });
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

    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        filterTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.getAttribute('data-filter');

        productCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Project Gallery Filters
  function initProjectFilters() {
    const projectTabs = document.querySelectorAll('.project-filter-tabs .filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    if (!projectTabs.length || !projectCards.length) return;

    projectTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        projectTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
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
