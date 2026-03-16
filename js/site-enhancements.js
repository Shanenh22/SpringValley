(function(){
  'use strict';
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    document.querySelectorAll('a[href^="tel:1972"]').forEach(function(a){ a.href = a.href.replace('tel:1972','tel:+1972'); });
    document.querySelectorAll('a.directions, a[href*="google.com/maps"], a[href*="maps.google.com"]').forEach(function(a){ a.target = '_blank'; a.rel = 'noopener'; });
    document.querySelectorAll('img').forEach(function(img){
      if (!img.hasAttribute('width')) img.setAttribute('width', '800');
      if (!img.hasAttribute('height')) img.setAttribute('height', '600');
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (!img.hasAttribute('loading') && !img.hasAttribute('fetchpriority')) img.setAttribute('loading', 'lazy');
    });
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      if (a.origin !== location.origin || a.pathname !== location.pathname) return;
      var id = a.getAttribute('href').slice(1); var el = id && document.getElementById(id);
      if (!el) return; e.preventDefault();
      var header = document.querySelector('.site-header');
      var offset = (header ? header.getBoundingClientRect().height : 0) + 16;
      var y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top:y, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      el.setAttribute('tabindex','-1'); el.focus({preventScroll:true}); history.pushState(null,'','#'+id);
    });
  });
})();
