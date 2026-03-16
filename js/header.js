(function(){
  function mountHeader(){
    var mount = document.getElementById('site-header');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'site-header';
      document.body.insertBefore(mount, document.body.firstChild);
    }
    var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.PRACTICE) || {};
    mount.innerHTML = `
<header class="site-header" role="banner">
  <div class="top-bar">
    <span>${cfg.NAME || 'Spring Valley Dental Associates'} • ${cfg.ADDRESS_HTML || 'Dallas, TX'}</span>
    <a href="${cfg.PHONE_TEL || 'tel:+19728522222'}">Call: ${cfg.PHONE_DISPLAY || '(972) 852-2222'}</a>
  </div>
  <div class="navbar">
    <a aria-label="Spring Valley Dental Associates home" class="logo" href="index.html">
      <picture aria-label="Spring Valley logo">
        <source media="(max-width:768px)" srcset="spring-valley-logo-mobile.svg" type="image/svg+xml"/>
        <source media="(min-width:769px)" srcset="spring-valley-logo-desktop.svg" type="image/svg+xml"/>
        <img src="spring-valley-logo-desktop.svg" alt="Spring Valley Dental" width="240" height="72" loading="eager" fetchpriority="high" decoding="async"/>
      </picture>
    </a>
    <nav id="site-nav" class="site-nav" aria-label="Primary" hidden>
      <ul class="site-links desktop-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="emergency.html">Emergency</a></li>
        <li><a href="patient-info.html" data-nowrap>Patient Info</a></li>
        <li><a href="reviews.html">Reviews</a></li>
        <li><a href="faq.html">FAQ</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a class="cta" href="contact.html" data-nowrap>Book Online</a></li>
      </ul>
    </nav>
    <button aria-controls="site-nav" aria-expanded="false" aria-label="Toggle navigation menu" class="hamburger" id="nav-toggle" type="button">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="nav-overlay" hidden id="nav-overlay"></div>
</header>`;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountHeader, {once:true}); else mountHeader();
})();
