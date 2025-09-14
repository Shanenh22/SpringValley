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
