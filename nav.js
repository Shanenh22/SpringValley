// nav.js — consolidated, robust, and CSS-driven header reveal
(() => {
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  class MobileNavigation {
    constructor() {
      this.header       = null;
      this.siteNav      = null;
      this.hamburger    = null;
      this.overlay      = null; // supports #nav-overlay or .nav-overlay
      this.closeBtn     = null;
      this.isOpen       = false;
      this.scrollY      = 0;
      this.breakpoint   = 768;

      this._boundKeydown  = this._handleKeydown.bind(this);
      this._boundResize   = this._onResize.bind(this);
      this._boundDocClick = this._onDocumentClick.bind(this);

      this._waitForDOM();
    }

    /* ---------- bootstrap ---------- */
    _waitForDOM(tries=0) {
      this.header    = this.header    || $('.site-header');
      this.siteNav   = this.siteNav   || $('#site-nav');
      this.hamburger = this.hamburger || $('#nav-toggle');
      this.overlay   = this.overlay   || $('#nav-overlay') || $('.nav-overlay');
      this.closeBtn  = this.closeBtn  || (this.siteNav ? this.siteNav.querySelector('.menu-close') : null);

      if (this.header && this.siteNav && this.hamburger && this.overlay) {
        this._init();
      } else if (tries < 100) {
        setTimeout(() => this._waitForDOM(tries+1), 20); // ~2s total
      } else {
        console.warn('[nav] Required elements not found.');
      }
    }

    _init() {
      // Make menu available to AT; CSS manages visual state
      this.siteNav.removeAttribute('hidden');

      // ARIA wiring
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
      document.addEventListener('keydown', this._boundKeydown);
      window.addEventListener('resize', this._boundResize);

      // Close when any link in the drawer is clicked
      this.siteNav.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (link) this.closeMenu();
      });

      // Safety net: close on any click outside drawer/toggle
      document.addEventListener('click', this._boundDocClick, true);

      // Observe hidden attr just in case other code toggles it
      if (window.MutationObserver) {
        new MutationObserver(() => this._forceShowHeader())
          .observe(this.siteNav, { attributes: true, attributeFilter: ['hidden'] });
      }

      this._markCurrentPage();
      this._forceShowHeader();
      this._enableHeaderAutoShow();

      // Also ensure header is shown on load/hashchange
      window.addEventListener('load', () => this._forceShowHeader());
      window.addEventListener('hashchange', () => this._forceShowHeader());

      console.log('[nav] initialized');
    }

    /* ---------- helpers ---------- */
    _hamburgerIsVisible() {
      const s = window.getComputedStyle(this.hamburger);
      return s.display !== 'none' && s.visibility !== 'hidden' && this.hamburger.offsetParent !== null;
    }
    _shouldUseDrawer() { return this._hamburgerIsVisible() || window.innerWidth <= this.breakpoint; }

    /* ---------- open/close ---------- */
    openMenu() {
      if (!this._shouldUseDrawer() || this.isOpen) return;
      this.isOpen = true;
      this.siteNav.classList.add('is-open');
      this.overlay.classList.add('is-active');
      this.hamburger.setAttribute('aria-expanded', 'true');
      this._lockScroll();
      this._moveFocusIntoMenu();
      this._forceShowHeader(); // keep header visible while menu is open
    }

    closeMenu() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.siteNav.classList.remove('is-open');
      this.overlay.classList.remove('is-active');
      this.hamburger.setAttribute('aria-expanded', 'false');
      this._unlockScroll();

      // Return focus to hamburger if the focus was inside the drawer
      if (this.siteNav.contains(document.activeElement)) {
        this.hamburger.focus({ preventScroll: true });
      }

      // Ensure header is visible immediately after closing
      this._forceShowHeader();
    }

    toggleMenu() { this.isOpen ? this.closeMenu() : this.openMenu(); }

    /* ---------- scroll locking ---------- */
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

    /* ---------- a11y / focus ---------- */
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
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    /* ---------- resize & outside-click ---------- */
    _onResize() {
      const nowMobile = this._shouldUseDrawer();
      if (!nowMobile) {
        // Fully reset any mobile state when entering desktop
        this.isOpen = false;
        this.siteNav.classList.remove('is-open');
        this.overlay.classList.remove('is-active');
        this.hamburger.setAttribute('aria-expanded','false');

        // Make sure nav is available to AT (CSS controls visual)
        this.siteNav.removeAttribute('hidden');

        // Re-mark current page & force a micro reflow to clear stale paints
        this._markCurrentPage();
        void this.siteNav.offsetHeight;

        // Ensure header shows immediately after resize
        this._forceShowHeader();
      } else {
        // Keep ARIA in sync on mobile widths
        this.hamburger.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
      }
    }

    _onDocumentClick(e) {
      if (!this.isOpen) return;
      const inDrawer = e.target.closest('#site-nav');
      const onToggle = e.target.closest('#nav-toggle');
      if (!inDrawer && !onToggle) this.closeMenu();
    }

    /* ---------- current page marker ---------- */
    _markCurrentPage() {
      try {
        const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        $$('.site-nav a[href], .desktop-links a[href], .menu-links a[href]').forEach(a => a.removeAttribute('aria-current'));
        const match = $(`.site-nav a[href="${here}"], .desktop-links a[href="${here}"], .menu-links a[href="${here}"]`);
        if (match) match.setAttribute('aria-current', 'page');
      } catch(_) {}
    }

    /* ---------- header hide/show on scroll (CSS-driven) ---------- */
    _forceShowHeader() {
      if (!this.header) this.header = $('.site-header');
      if (this.header) this.header.classList.remove('is-hidden');
      // NOTE: Do not set inline transforms here — CSS handles .navbar slide
    }

    _enableHeaderAutoShow() {
      if (!this.header) this.header = $('.site-header');
      if (!this.header) return;

      let lastY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const THRESHOLD    = 1;   // more eager reveal
      const DOWN_HIDE_AT = 60;  // don't hide until you've scrolled a bit
      let ticking = false;

      const onScroll = () => {
        const y = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (this.isOpen || y <= 0) { this._forceShowHeader(); lastY = y; ticking = false; return; }
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
    }
  }

  // Boot once DOM is parsed
  document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
    if (typeof SmoothScroll === 'function') { try { new SmoothScroll(); } catch(_){} }
  });
})();
