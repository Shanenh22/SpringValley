class MobileNavigation {
constructor() {
this.hamburger = document.getElementById('nav-toggle') || document.getElementById('hamburger');
this.siteNav = document.getElementById('site-nav');
this.navOverlay = document.getElementById('nav-overlay');
this.body = document.body;
this.html = document.documentElement;
// Track navigation state
this.isOpen = false;
this.breakpoint = 768;
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

// Handle initial state
this.handleResize();

// Show navigation after JS loads (prevents flash)
this.siteNav.removeAttribute('hidden');

// Set initial ARIA states
this.updateARIA();

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
// Close button in mobile drawer
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
    const link = e.target.closest('a');
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
if (this.siteNav) {
  this.siteNav.classList.add('is-open');
}
if (this.navOverlay) {
  this.navOverlay.classList.add('is-active');
}
if (this.html) {
  this.html.classList.add('nav-locked');
}
if (this.body) {
  this.body.classList.add('nav-locked');
}

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
}, 250);

// Prevent body scroll
this.lockScroll();
}
closeMenu() {
console.log('Closing mobile menu');
this.isOpen = false;
// Remove classes
if (this.siteNav) {
  this.siteNav.classList.remove('is-open');
}
if (this.navOverlay) {
  this.navOverlay.classList.remove('is-active');
}
if (this.html) {
  this.html.classList.remove('nav-locked');
}
if (this.body) {
  this.body.classList.remove('nav-locked');
}

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
  if (this.hamburger) {
    this.hamburger.focus();
  }
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
if (e.key !== 'Tab') return;
const focusableElements = this.siteNav.querySelectorAll(
  'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
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

Smooth Scroll for Anchor Links
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
// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
console.log('DOM loaded, initializing navigation...');
try {
new MobileNavigation();
new SmoothScroll();
console.log('Navigation classes initialized successfully');
} catch (error) {
console.error('Error initializing navigation:', error);
}
});