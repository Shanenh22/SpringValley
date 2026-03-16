// Injected site header (normalized for nav.js + no hamburger CTAs)
(function() {
  // Ensure a mount exists (in case it was forgotten on a page)
  var mount = document.getElementById('site-header');
  if (!mount) {
    mount = document.createElement('div');
    mount.id = 'site-header';
    // put it right after <body> opens
    document.body.insertBefore(mount, document.body.firstChild);
  }

  mount.innerHTML = `
<header class="site-header" role="banner">
  <!-- Global contact top bar -->
  <div class="top-bar">
    <span>Spring Valley Dental Associates • 14228 Midway Rd, Suite 100, Dallas, TX 75244</span>
    <a href="tel:+19728522222">Call: (972) 852-2222</a>
  </div>

  <div class="navbar">
    <a aria-label="Spring Valley Dental Associates home" class="logo" href="index.html">
      <picture aria-label="Spring Valley logo">
        <source media="(max-width:768px)" srcset="images/spring-valley-logo-mobile.svg" type="image/svg+xml"/>
        <source media="(min-width:769px)" srcset="images/spring-valley-logo-desktop.svg" type="image/svg+xml"/>
        <img src="images/spring-valley-logo-desktop.svg" alt="Spring Valley Dental" loading="eager" fetchpriority="high"/>
      </picture>
    </a>

    <nav id="site-nav" class="site-nav" aria-label="Primary" hidden>
      <!-- Desktop Navigation -->
      <ul class="site-links desktop-links">
        <li><a href="index.html" aria-current="page">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="emergency.html">Emergency</a></li>
        <li><a href="patient-info.html" data-nowrap>Patient Info</a></li>
        <li><a href="reviews.html">Reviews</a></li>
        <li><a href="faq.html">FAQ</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a class="cta" href="contact.html" data-nowrap>Book Online</a></li>
      </ul>

      <!-- Mobile Drawer Header -->
      <div class="menu-header">
        <button class="menu-close" aria-label="Close menu">×</button>
        <div class="brand-row">
          <h2 class="practice-name">Spring Valley Dental</h2>
        </div>
        <div class="menu-ctas" role="group" aria-label="Quick actions">
          <a class="menu-cta call" href="tel:+19728522222" aria-label="Call our office">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
            Call
          </a>
          <a class="menu-cta book" href="contact.html" aria-label="Book an appointment">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
            Book
          </a>
          <a class="menu-cta directions" href="https://www.google.com/maps/place/14228+Midway+Rd+%23100,+Dallas,+TX+75244" target="_blank" rel="noopener" aria-label="Get directions">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg>
            Map
          </a>
        </div>
      </div>

      <!-- Main menu items (mobile) -->
      <div class="menu-section">
        <h3 class="section-title">Pages</h3>
        <ul class="menu-links">
          <li><a href="index.html" aria-current="page">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="emergency.html">Emergency</a></li>
          <li><a href="patient-info.html" data-nowrap>Patient Info</a></li>
          <li><a href="reviews.html">Reviews</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>

      <!-- Service-specific links (mobile) -->
      <div class="menu-section">
        <h3 class="section-title">I need...</h3>
        <ul class="intent-grid">
          <li><a href="emergency.html">Emergency Care</a></li>
          <li><a href="teeth-cleaning.html">Cleaning &amp; Exam</a></li>
          <li><a href="dental-implants.html">Dental Implants</a></li>
          <li><a href="invisalign.html">Invisalign</a></li>
        </ul>
      </div>

      <!-- Footer info (mobile) -->
      <div class="menu-footer">
        <div class="practice-info">
          <p><strong>Spring Valley Dental Associates</strong></p>
          <p>14228 Midway Rd, Suite 100<br>Dallas, TX 75244</p>
          <p><a href="tel:+19728522222">(972) 852-2222</a></p>
        </div>
      </div>
    </nav>

    <div class="nav-overlay" id="nav-overlay"></div>
    <button aria-controls="site-nav" aria-expanded="false" aria-label="Toggle navigation menu"
            class="hamburger" id="nav-toggle" type="button">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
  `;

  // Force header visible immediately (prevents it being stuck hidden)
  var headerEl = mount.querySelector('.site-header');
  if (headerEl) {
    headerEl.classList.remove('is-hidden');
    headerEl.style.transform = ''; // clear any inherited inline transform
  }

  // Safety: normalize the external Directions link target/rel if present
  var dir = mount.querySelector('a[href*="google.com/maps"]');
  if (dir) { dir.target = '_blank'; dir.rel = 'noopener'; }
})();
