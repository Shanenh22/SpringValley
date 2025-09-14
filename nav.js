// nav.js — consolidated, fixed, and compatible with your injected header
(() => {
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  class MobileNavigation {
    constructor() {
      this.header    = null;
      this.siteNav   = null;
      this.hamburger = null;
      this.overlay   = null;
      this.closeBtn  = null;
      this.isOpen    = false;
      this.scrollY   = 0;
      this._boundHandleKeydown = this._handleKeydown.bind(this);
      this._boundOnResize = this._onResize.bind(this);
      this._waitForDOM();
    }

    _waitForDOM(tries=0) {
      // Header is injected by js/header.js; wait until it's present
      this.header    = $('.site-header');
      this.siteNav   = $('#site-nav');
      this.hamburger = $('#nav-toggle');
      this.overlay   = $('#nav-overlay');
      this.closeBtn  = this.siteNav ? this.siteNav.querySelector('.menu-close') : null;

      if (this.header && this.siteNav && this.hamburger && this.overlay) {
        this._init();
      } else if (tries < 100) {
        setTimeout(() => this._waitForDOM(tries+1), 20);
      } else {
        console.warn('[nav] Failed to find required elements.');
      }
    }

    _init() {
      // Make nav available to AT (CSS controls visibility/state)
      this.siteNav.removeAttribute('hidden');
      this.hamburger.setAttribute('aria-controls', 'site-nav');
      this.hamburger.setAttribute('aria-expanded', 'false');
      if (this.closeBtn) {
        this.closeBtn.setAttribute('aria-controls', 'site-nav');
        this.closeBtn.setAttribute('aria-label', 'Close menu');
      }

      // Events
      this.hamburger.addEventListener('click', (e) => { e.preventDefault(); this.toggleMenu(); });
      if (this.closeBtn) this.closeBtn.addEventListener('click', (e) => { e.preventDefault(); this.closeMenu(); });
      this.overlay.addEventListener('click', () => this.closeMenu());
      document.addEventListener('keydown', this._boundHandleKeydown);
      window.addEventListener('resize', this._boundOnResize);

      // Close menu when any link inside menu is activated
      this.siteNav.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        this.closeMenu();
      });

      this._markCurrentPage();
      this._forceShowHeader();
      this._enableHeaderAutoShow();

      console.log('[nav] initialized');
    }

    // ---------- Drawer control ----------
    _hamburgerIsVisible() {
      const style = window.getComputedStyle(this.hamburger);
      return style.display !== 'none' && style.visibility !== 'hidden' && this.hamburger.offsetParent !== null;
    }
    _shouldUseDrawer() {
      // Prefer visibility over hard width check
      return this._hamburgerIsVisible() || window.innerWidth <= 768;
    }

    openMenu() {
      if (!this._shouldUseDrawer()) return;
      if (this.isOpen) return;
      this.isOpen = true;
      this.siteNav.classList.add('is-open');
      this.overlay.classList.add('is-active');
      this.hamburger.setAttribute('aria-expanded', 'true');
      this._lockScroll();
      this._moveFocusIntoMenu();
      this._forceShowHeader(); // keep header visible while open
    }

    closeMenu() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.siteNav.classList.remove('is-open');
      this.overlay.classList.remove('is-active');
      this.hamburger.setAttribute('aria-expanded', 'false');
      this._unlockScroll();
      // Return focus to hamburger if focus is inside menu
      if (this.siteNav.contains(document.activeElement)) {
        this.hamburger.focus({ preventScroll: true });
      }
    }

    toggleMenu() { this.isOpen ? this.closeMenu() : this.openMenu(); }

    _lockScroll() {
      this.scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    }
    _unlockScroll() {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, this.scrollY || 0);
      this.scrollY = 0;
    }

    _moveFocusIntoMenu() {
      const focusables = this.siteNav.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      const first = focusables[0];
      if (first) first.focus({ preventScroll: true });
    }

    _handleKeydown(e) {
      if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.closeMenu();
        return;
      }
      if (e.key !== 'Tab' || !this.isOpen) return;

      const focusables = Array.from(this.siteNav.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    _onResize() {
      // If resized to desktop while menu is open, close it
      if (!this._shouldUseDrawer() && this.isOpen) this.closeMenu();
    }

    // ---------- Current-page marker ----------
    _markCurrentPage() {
      try {
        const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        $$('.site-nav a[href], .desktop-links a[href], .menu-links a[href]').forEach(a => a.removeAttribute('aria-current'));
        const match = $(`.site-nav a[href="${here}"], .desktop-links a[href="${here}"], .menu-links a[href="${here}"]`);
        if (match) match.setAttribute('aria-current', 'page');
      } catch (_) {}
    }

    // ---------- Header auto-hide / show on scroll ----------
    _forceShowHeader() {
      if (!this.header) this.header = $('.site-header');
      if (this.header) {
        this.header.classList.remove('is-hidden');
        this.header.style.transform = 'translateY(0)';
      }
    }
    _enableHeaderAutoShow() {
      if (!this.header) this.header = $('.site-header');
      if (!this.header) return;
      let lastY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const THRESHOLD = 10;    // px
      const DOWN_HIDE_AT = 64; // don't hide until scrolled a bit
      let ticking = false;

      const onScroll = () => {
        const y = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (this.isOpen || y <= 0) {
          this._forceShowHeader();
          lastY = y;
          ticking = false;
          return;
        }
        const delta = y - lastY;
        if (Math.abs(delta) >= THRESHOLD) {
          if (delta > 0 && y > DOWN_HIDE_AT) this.header.classList.add('is-hidden');
          else this.header.classList.remove('is-hidden');
          lastY = y;
        }
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
      }, { passive: true });

      window.addEventListener('hashchange', () => this._forceShowHeader());
      window.addEventListener('load', () => this._forceShowHeader());
      if (this.hamburger) this.hamburger.addEventListener('click', () => this._forceShowHeader());

      // Observe #site-nav hidden attribute to keep header visible while menu opens/closes
      if (this.siteNav && window.MutationObserver) {
        new MutationObserver(() => this._forceShowHeader())
          .observe(this.siteNav, { attributes: true, attributeFilter: ['hidden'] });
      }
    }
  }

  // Boot once DOM is parsed
  document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
    if (typeof SmoothScroll === 'function') { try { new SmoothScroll(); } catch(_){} }
  });
})();
