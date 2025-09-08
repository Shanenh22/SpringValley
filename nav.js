/**
 * Enhanced Mobile Navigation System - Updated for HTML Structure
 * Spring Valley Dental Associates
 */

class MobileNavigation {
  constructor() {
    this.hamburger = document.getElementById('hamburger') || document.getElementById('nav-toggle');
    this.siteNav = document.getElementById('site-nav');
    this.navOverlay = document.getElementById('nav-overlay');
    this.body = document.body;
    this.html = document.documentElement;
    
    // Track navigation state
    this.isOpen = false;
    this.breakpoint = 768;
    
    // Initialize navigation
    this.init();
  }
  
  init() {
    // Check if required elements exist
    if (!this.hamburger || !this.siteNav) {
      console.warn('Navigation elements not found');
      return;
    }
    
    // Set up event listeners
    this.bindEvents();
    
    // Handle initial state
    this.handleResize();
    
    // Show navigation after JS loads (prevents flash)
    this.siteNav.removeAttribute('hidden');
    
    // Set initial ARIA states
    this.updateARIA();
    
    console.log('Mobile Navigation initialized');
  }
  
  enhanceMobileStructure() {
    // Disable automatic structure enhancement - use HTML structure instead
    return;
  }
  
  bindEvents() {
    // Hamburger menu toggle
    this.hamburger?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMenu();
    });
    
    // Close button in mobile drawer
    const menuClose = this.siteNav.querySelector('.menu-close');
    menuClose?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closeMenu();
    });
    
    // Overlay click to close
    this.navOverlay?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeMenu();
    });
    
    // Close menu when clicking links (mobile)
    this.siteNav?.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && this.isMobile() && this.isOpen) {
        // Close menu after short delay to allow navigation
        setTimeout(() => this.closeMenu(), 150);
      }
    });
    
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
    this.siteNav?.addEventListener('keydown', (e) => {
      if (this.isOpen && this.isMobile()) {
        this.handleFocusTrap(e);
      }
    });
    
    // Prevent scroll on mobile when menu is open
    this.navOverlay?.addEventListener('touchmove', (e) => {
      if (this.isOpen) {
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  openMenu() {
    if (!this.isMobile()) return;
    
    this.isOpen = true;
    
    // Add classes
    this.siteNav?.classList.add('is-open');
    this.navOverlay?.classList.add('is-active');
    this.html?.classList.add('nav-locked');
    this.body?.classList.add('nav-locked');
    
    // Force show the navigation
    if (this.siteNav) {
      this.siteNav.style.display = 'block';
      this.siteNav.removeAttribute('hidden');
    }
    
    // Update ARIA states
    this.updateARIA();
    
    // Focus management - focus close button
    setTimeout(() => {
      const menuClose = this.siteNav?.querySelector('.menu-close');
      if (menuClose) {
        menuClose.focus();
      }
    }, 250); // Wait for transition
    
    // Prevent body scroll
    this.lockScroll();
  }
  
  closeMenu() {
    this.isOpen = false;
    
    // Remove classes
    this.siteNav?.classList.remove('is-open');
    this.navOverlay?.classList.remove('is-active');
    this.html?.classList.remove('nav-locked');
    this.body?.classList.remove('nav-locked');
    
    // ADD THIS: Force reset hamburger state with slight delay
  setTimeout(() => {
    if (this.hamburger) {
      this.hamburger.setAttribute('aria-expanded', 'false');
      this.hamburger.classList.remove('active'); // in case this class exists
    }
  }, 10);
	
	// Update ARIA states
    this.updateARIA();
    
    // Return focus to hamburger button
    setTimeout(() => {
      this.hamburger?.focus();
    }, 50);
    
    // Restore body scroll
    this.unlockScroll();
  }
  
  updateARIA() {
    if (this.hamburger) {
      this.hamburger.setAttribute('aria-expanded', this.isOpen.toString());
    }
    
    if (this.navOverlay) {
      this.navOverlay.setAttribute('aria-hidden', (!this.isOpen).toString());
    }
    
    if (this.siteNav) {
      this.siteNav.setAttribute('aria-hidden', (!this.isOpen && this.isMobile()).toString());
    }
  }
  
  handleResize() {
    // Close menu on resize to larger screen
    if (!this.isMobile() && this.isOpen) {
      this.closeMenu();
    }
    
    // Update navigation visibility
    this.updateNavVisibility();
  }
  
  updateNavVisibility() {
    // Simplified - let CSS handle the responsive behavior
    if (this.siteNav) {
      this.siteNav.style.display = 'block';
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
    this.body.style.position = 'fixed';
    this.body.style.top = `-${this.scrollPosition}px`;
    this.body.style.width = '100%';
  }
  
  unlockScroll() {
    // Restore scroll position
    this.body.style.position = '';
    this.body.style.top = '';
    this.body.style.width = '';
    
    // Restore scroll position
    if (this.scrollPosition) {
      window.scrollTo(0, this.scrollPosition);
      this.scrollPosition = 0;
    }
  }
  
  handleFocusTrap(e) {
    if (e.key !== 'Tab') return;
    
    const focusableElements = this.siteNav?.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      // Shift + Tab (going backwards)
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      // Tab (going forwards)
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }
}


/**
 * Smooth Scroll for Anchor Links
 */
class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    // Handle anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
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
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
    const offset = headerHeight + 20;
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

