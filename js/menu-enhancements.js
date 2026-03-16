(function(){
  'use strict';
  document.addEventListener('click', function(e){
    var toggle = e.target.closest && e.target.closest('#nav-toggle, .hamburger');
    if (!toggle) return;
    setTimeout(function(){
      var nav = document.getElementById('site-nav');
      if (!nav || nav.querySelector('.menu-header')) return;
      var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.PRACTICE) || {};
      var wrap = document.createElement('div');
      wrap.className = 'menu-header';
      wrap.innerHTML = `
        <button class="menu-close" type="button" aria-controls="site-nav" aria-label="Close menu">×</button>
        <div class="brand-row"><div class="practice-meta"><div class="practice-name">Spring Valley Dental</div><div class="practice-hours">Call for same-day availability</div></div></div>
        <div class="menu-ctas" role="group" aria-label="Primary actions">
          <a class="menu-cta call" href="${cfg.PHONE_TEL || 'tel:+19728522222'}">Call</a>
          <a class="menu-cta book" href="contact.html">Book</a>
          <a class="menu-cta directions" href="${cfg.MAP_URL || '#'}" target="_blank" rel="noopener">Directions</a>
        </div>`;
      nav.insertBefore(wrap, nav.firstChild);
      var section = document.createElement('div');
      section.className = 'menu-section';
      section.innerHTML = '<h3 class="section-title">Popular services</h3><ul class="menu-links intent-grid"><li><a href="emergency.html">Emergency care</a></li><li><a href="teeth-cleaning.html">Cleaning & checkup</a></li><li><a href="teeth-whitening.html">Teeth whitening</a></li><li><a href="dental-implants.html">Dental implants</a></li></ul>';
      nav.appendChild(section);
      wrap.querySelector('.menu-close').addEventListener('click', function(){ toggle.click(); });
    }, 20);
  }, {passive:true});
})();
