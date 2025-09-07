/**
 * Enhanced Mobile Navigation System - FIXED VERSION
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
    
    // Enhance mobile navigation structure
    this.enhanceMobileStructure();
    
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
    // Only enhance if we're missing the mobile structure
    if (this.siteNav.querySelector('.menu-header')) {
      return; // Already enhanced
    }
    
    // Clear existing content for clean rebuild
    const existingLinks = this.siteNav.querySelector('.site-links');
    
    // Create complete mobile drawer structure
    const mobileHTML = `
      <div class="menu-header">
        <button class="menu-close" id="menu-close" aria-label="Close navigation menu" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
        <div class="brand-row">
          <div class="practice-name">Spring Valley Dental</div>
        </div>
      </div>

      <div class="menu-ctas">
        <a href="tel:+19728522222" class="menu-cta call" aria-label="Call our office">
          Call
        </a>
        <a href="contact.html" class="menu-cta book" aria-label="Book an appointment online">
          Book
        </a>
        <a href="https://www.google.com/maps/place/14228+Midway+Rd+%23100,+Dallas,+TX+75244" class="menu-cta directions" aria-label="Get directions to our office" target="_blank">
          Directions
        </a>
      </div>

      <div class="menu-section">
        <div class="section-title">I need...</div>
        <ul class="intent-grid">
          <li><a href="emergency.html">Emergency Care</a></li>
          <li><a href="services.html#whitening">Teeth Whitening</a></li>
          <li><a href="services.html#implants">Dental Implants</a></li>
          <li><a href="services.html#crowns">Crowns & Bridges</a></li>
          <li><a href="services.html#orthodontics">Orthodontics</a></li>
          <li><a href="services.html#cosmetic">Cosmetic Dentistry</a></li>
        </ul>
      </div>

      <div class="menu-section">
        <div class="section-title">Patients</div>
        <ul class="menu-links">
          <li><a href="services.html">Our Services</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="patient-info.html">Patient Info</a></li>
          <li><a href="reviews.html">Reviews</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>

      <div class="menu-footer">
  <div class="practice-info">
    <p>Most Insurance Accepted</p>
    <p>⭐⭐⭐⭐⭐ 4.9/5 Rating</p>
  </div>
</div>
    `;
    
    // Replace content but preserve desktop links
    this.siteNav.innerHTML = mobileHTML;
    
    // Re-add desktop links for larger screens (hidden on mobile)
    if (existingLinks) {
      existingLinks.classList.add('desktop-links');
      this.siteNav.appendChild(existingLinks);
    }
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
    if (!this.siteNav) return;
    
    if (this.isMobile()) {
      // Mobile: show mobile structure, hide desktop
      this.showMobileStructure();
      this.hideDesktopStructure();
    } else {
      // Desktop: show desktop structure, hide mobile
      this.showDesktopStructure();
      this.hideMobileStructure();
      // Ensure nav is visible on desktop
      this.siteNav.style.display = 'block';
      this.siteNav.removeAttribute('hidden');
    }
  }
  
  showMobileStructure() {
    const mobileElements = this.siteNav?.querySelectorAll('.menu-header, .menu-ctas, .menu-section, .menu-footer');
    mobileElements?.forEach(element => {
      element.style.display = '';
    });
  }
  
  hideMobileStructure() {
    const mobileElements = this.siteNav?.querySelectorAll('.menu-header, .menu-ctas, .menu-section, .menu-footer');
    mobileElements?.forEach(element => {
      element.style.display = 'none';
    });
  }
  
  showDesktopStructure() {
    const desktopLinks = this.siteNav?.querySelector('.desktop-links, .site-links');
    if (desktopLinks) {
      desktopLinks.style.display = 'flex';
    }
  }
  
  hideDesktopStructure() {
    const desktopLinks = this.siteNav?.querySelector('.desktop-links, .site-links');
    if (desktopLinks) {
      desktopLinks.style.display = 'none';
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
 * FAQ Accordion Functionality
 */
class FAQAccordion {
  constructor() {
    this.faqItems = document.querySelectorAll('.faq-item');
    this.faqQuestions = document.querySelectorAll('.faq-question');
    this.init();
  }
  
  init() {
    // Handle div-based FAQ items
    this.faqQuestions.forEach((question, index) => {
      question.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleFAQ(question);
      });
      
      // Keyboard support
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleFAQ(question);
        }
      });
      
      // Set initial ARIA state
      question.setAttribute('aria-expanded', 'false');
      question.setAttribute('tabindex', '0');
    });
    
    // Handle search functionality
    this.initFAQSearch();
  }
  
  toggleFAQ(question) {
    const faqItem = question.closest('.faq-item');
    const answer = faqItem?.querySelector('.faq-answer');
    
    if (!faqItem || !answer) return;
    
    const isOpen = faqItem.classList.contains('open');
    
    if (isOpen) {
      // Close
      faqItem.classList.remove('open');
      answer.classList.remove('show');
      question.setAttribute('aria-expanded', 'false');
    } else {
      // Open
      faqItem.classList.add('open');
      answer.classList.add('show');
      question.setAttribute('aria-expanded', 'true');
    }
  }
  
  initFAQSearch() {
    const searchInput = document.querySelector('.faq-search input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
      this.filterFAQs(e.target.value);
    });
  }
  
  filterFAQs(searchTerm) {
    const faqSections = document.querySelectorAll('.faq-section');
    const noResults = document.querySelector('.no-results');
    let hasResults = false;
    
    faqSections.forEach(section => {
      const questions = section.querySelectorAll('.faq-item, details');
      let sectionHasResults = false;
      
      questions.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matches = text.includes(searchTerm.toLowerCase());
        
        if (searchTerm === '' || matches) {
          item.style.display = '';
          sectionHasResults = true;
          hasResults = true;
        } else {
          item.style.display = 'none';
        }
      });
      
      // Hide section if no results
      section.style.display = sectionHasResults ? '' : 'none';
    });
    
    // Show/hide no results message
    if (noResults) {
      noResults.style.display = hasResults ? 'none' : 'block';
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

/**
 * Initialize all navigation functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize mobile navigation
  new MobileNavigation();
  
  // Initialize FAQ functionality if FAQ elements exist
  if (document.querySelector('.faq-item, .faq-question')) {
    new FAQAccordion();
  }
  
  // Initialize smooth scrolling
  new SmoothScroll();
  
  console.log('Navigation system initialized');
});