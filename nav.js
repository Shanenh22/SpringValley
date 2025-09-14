class MobileNavigation {
  constructor() {
    this.hamburger  = document.getElementById('nav-toggle') || document.getElementById('hamburger');
    this.siteNav    = document.getElementById('site-nav');
    this.navOverlay = document.getElementById('nav-overlay');
    this.body       = document.body;
    this.html       = document.documentElement;

    // Track navigation state
    this.isOpen        = false;
    this.breakpoint    = 768;
    this.scrollPosition = 0;

    // Initialize navigation
    this.init();
  }

  init() {
    // Check if required elements exist
    if (!this.hamburger || !this.siteNav) {
      console.warn('Navigation elements not found:', {
        hamburger: !!this.hamburger,
        siteNav: !!this.siteNav
      });
      return;
    }

    // Set up event listeners
    this.bindEvents();

    // Handle initial state (sets closed for mobile/desktop)
    this.handleResize();

    // Ensure initial ARIA BEFORE revealing markup (prevents AT flicker)
    if (this.hamburger) this.hamburger.setAttribute('aria-expanded', 'false');
    this.updateARIA();

    // Reveal nav markup (CSS controls visibility)
    this.siteNav.removeAttribute('hidden');

    console.log('Mobile Navigation initialized successfully');
  }

  bindEvents() {
    // Hamburger menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    // Close button in mobile drawer (if present on load)
    const menuClose = this.siteNav.querySelector('.menu-close');
    if (menuClose) {
      menuClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeMenu();
      });
    }

    // Overlay click to close
    if (this.navOverlay) {
      this.navOverlay.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeMenu();
      });
    }

    // Close menu when clicking links (mobile)
    if (this.siteNav) {
      this.siteNav.addEventListener('click', (e) => {
        const link = e.target.closest && e.target.closest('a');
        if (link && this.isMobile() && this.isOpen) {
          // Close menu after short delay to allow navigation
          setTimeout(() => this.closeMenu(), 150);
        }
      });
    }

    // Escape key to close menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Handle focus trapping in mobile menu
    if (this.siteNav) {
      this.siteNav.addEventListener('keydown', (e) => {
        if (this.isOpen && this.isMobile()) {
          this.handleFocusTrap(e);
        }
      });
    }

    // Prevent scroll on mobile when menu is open
    if (this.navOverlay) {
      this.navOverlay.addEventListener('touchmove', (e) => {
        if (this.isOpen) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }

  toggleMenu() {
    console.log('Toggle menu called, current state:', this.isOpen);
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    if (!this.isMobile()) {
      console.log('Not mobile, skipping menu open');
      return;
    }
    console.log('Opening mobile menu');
    this.isOpen = true;

    // Add classes
    if (this.siteNav)    this.siteNav.classList.add('is-open');
    if (this.navOverlay) this.navOverlay.classList.add('is-active');
    if (this.html)       this.html.classList.add('nav-locked');
    if (this.body)       this.body.classList.add('nav-locked');

    // Ensure nav is available to AT (visibility handled by CSS)
    if (this.siteNav) this.siteNav.removeAttribute('hidden');

    // Update ARIA states
    this.updateARIA();

    // Mark background inert while nav is open
    this.toggleInert(true);

    // Focus management - prefer close button, then first focusable, then hamburger
    setTimeout(() => {
      const closeBtn = this.siteNav?.querySelector('.menu-close');
      const firstFocusable = this.siteNav?.querySelector(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      (closeBtn || firstFocusable || this.hamburger)?.focus();
    }, 250);

    // Prevent body scroll
    this.lockScroll();

    // Announce state change
    this.announce('Navigation menu opened');
  }

  closeMenu() {
    console.log('Closing mobile menu');
    this.isOpen = false;

    // Remove classes
    if (this.siteNav)    this.siteNav.classList.remove('is-open');
    if (this.navOverlay) this.navOverlay.classList.remove('is-active');
    if (this.html)       this.html.classList.remove('nav-locked');
    if (this.body)       this.body.classList.remove('nav-locked');

    // Force reset hamburger state
    setTimeout(() => {
      if (this.hamburger) {
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.hamburger.classList.remove('active');
      }
    }, 10);

    // Update ARIA states
    this.updateARIA();

    // Return focus to hamburger button
    setTimeout(() => {
      if (this.hamburger) this.hamburger.focus();
    }, 50);

    // Restore body scroll
    this.unlockScroll();

    // Restore background
    this.toggleInert(false);

    // Announce state change
    this.announce('Navigation menu closed');
  }

  updateARIA() {
    if (this.hamburger) {
      this.hamburger.setAttribute('aria-expanded', this.isOpen.toString());
    }
    if (this.navOverlay) {
      this.navOverlay.setAttribute('aria-hidden', (!this.isOpen).toString());
    }
    if (this.siteNav) {
      // Keep nav in the a11y tree on desktop; hide only when closed on mobile
      this.siteNav.setAttribute('aria-hidden', (!this.isOpen && this.isMobile()).toString());
    }
  }

  handleResize() {
    // Close menu on resize to larger screen
    if (!this.isMobile() && this.isOpen) {
      this.closeMenu();
    }
    // Update navigation visibility (let CSS handle display; ensure not hidden)
    this.updateNavVisibility();
  }

  updateNavVisibility() {
    // Let CSS handle responsive layout; ensure nav isn't 'hidden' for desktop
    if (this.siteNav) {
      this.siteNav.removeAttribute('hidden');
    }
  }

  isMobile() {
    return window.innerWidth <= this.breakpoint;
  }

  lockScroll() {
    // Store current scroll position
    this.scrollPosition = window.pageYOffset;
    // Apply scroll lock
    if (this.body) {
      this.body.style.position = 'fixed';
      this.body.style.top = `-${this.scrollPosition}px`;
      this.body.style.width = '100%';
    }
  }

  unlockScroll() {
    // Restore scroll position
    if (this.body) {
      this.body.style.position = '';
      this.body.style.top = '';
      this.body.style.width = '';
    }
    // Restore scroll position
    if (this.scrollPosition) {
      window.scrollTo(0, this.scrollPosition);
      this.scrollPosition = 0;
    }
  }

  handleFocusTrap(e) {
    // Defensive guard
    if (e.key !== 'Tab' || !this.isOpen || !this.isMobile()) return;

    const focusableElements = this.siteNav.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable  = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab (backwards)
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      // Tab (forwards)
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  announce(msg) {
    const live = document.getElementById('nav-status');
    if (live) live.textContent = msg;
  }

  toggleInert(enable) {
    const toInert = document.querySelectorAll('main, footer, .top-bar');
    toInert.forEach(el => {
      if (enable) {
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
    });
  }
}

/**
 * Smooth Scroll for Anchor Links
 * (unchanged; optional reduced-motion can be added later)
 */
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Handle anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest && e.target.closest('a[href^="#"]');
      if (!link) return;
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        this.scrollToElement(target);
      }
    });
  }

  scrollToElement(element) {
    const headerHeight   = document.querySelector('.site-header')?.offsetHeight || 0;
    const offset         = headerHeight + 20;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition  = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, initializing navigation...');

  try {
    // Your existing init
    new MobileNavigation();
    new SmoothScroll();
    console.log('Navigation classes initialized successfully');
  } catch (error) {
    console.error('Error initializing navigation:', error);
  }

  // ---- Current-page highlighting (accessibility + styling hook) ----
  // Adds aria-current="page" to the matching link in .site-links and .menu-links
  (function setupCurrentPageMarker() {
    const NAV_CONTAINER_ID = 'site-nav';
    const SELECTOR = '.site-links a, .menu-links a';

    function normalizeFile(pathname) {
      // e.g., "/" -> "index.html", "/patient-info" -> "patient-info.html"
      let file = pathname.split('/').pop() || 'index.html';
      if (!/\.[a-z0-9]+$/i.test(file)) file += '.html';
      return file.toLowerCase();
    }

    function markCurrent() {
      const currentFile = normalizeFile(location.pathname);
      const links = document.querySelectorAll(SELECTOR);
      if (!links.length) return false; // nav not injected yet

      // Clear any previous state
      links.forEach(a => a.removeAttribute('aria-current'));

      // Apply when filenames match (ignores query/hash)
      links.forEach(a => {
        const href = a.getAttribute('href') || '';
        const file = href.split('#')[0].split('?')[0].split('/').pop().toLowerCase();
        if (file && file === currentFile) {
          a.setAttribute('aria-current', 'page');
        }
      });

      return true;
    }

    // Run once now
    let applied = markCurrent();

    // Run again after full load (in case late injections happen)
    window.addEventListener('load', () => { if (!applied) applied = markCurrent(); });

    // Observe future mutations to the nav (e.g., if mobile menu/sections are injected later)
    const nav = document.getElementById(NAV_CONTAINER_ID);
    if (nav && 'MutationObserver' in window) {
      const mo = new MutationObserver(() => { markCurrent(); });
      mo.observe(nav, { childList: true, subtree: true });
    }
  })();
});
// === Auto-show header on scroll up (no extra file needed) ====================
(function () {
  'use strict';
  if (window.__HEADER_AUTOSHOW_INIT__) return;
  window.__HEADER_AUTOSHOW_INIT__ = true;

  var THRESHOLD = 8; // px before reacting to avoid jitter
  var lastY = window.pageYOffset || document.documentElement.scrollTop || 0;
  var ticking = false;

  function qs(sel){ return document.querySelector(sel); }
  function getY(){
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    return y < 0 ? 0 : y; // iOS bounce safety
  }
  function isMenuOpen() {
    var t = qs('#nav-toggle');
    var n = qs('#site-nav');
    var expanded = t && t.getAttribute('aria-expanded') === 'true';
    var visible  = n && !n.hasAttribute('hidden');
    return !!(expanded || visible);
  }
  function showHeader() {
    var h = qs('.site-header');
    if (h) h.classList.remove('is-hidden');
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var header = qs('.site-header');
      if (!header) { ticking = false; return; }

      var y = getY();

      // Never hide while the slide-out menu is open
      if (isMenuOpen()) {
        header.classList.remove('is-hidden');
        lastY = y;
        ticking = false;
        return;
      }

      var delta = y - lastY;
      if (Math.abs(delta) >= THRESHOLD) {
        if (delta > 0) {
          // scrolling down -> hide
          header.classList.add('is-hidden');
        } else {
          // scrolling up -> show
          header.classList.remove('is-hidden');
        }
        lastY = y;
      }
      ticking = false;
    });
  }

  // Wire up
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', showHeader);
  window.addEventListener('hashchange', showHeader);

  var toggle = document.getElementById('nav-toggle');
  if (toggle) toggle.addEventListener('click', showHeader);

  var nav = document.getElementById('site-nav');
  if (nav && window.MutationObserver) {
    new MutationObserver(showHeader).observe(nav, { attributes: true, attributeFilter: ['hidden'] });
  }
})();

