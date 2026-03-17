/* analytics.js – central loader for Plausible + optional Google Analytics (gtag)
   Configure in site-config.js:

   window.SITE_CONFIG = {
     ANALYTICS: {
       ENABLE_PLAUSIBLE: true,
       DOMAIN: 'springvalleydentistry.com',
       // Optional self-hosted plausible script:
       // PLAUSIBLE_SRC: 'https://analytics.example.com/js/plausible.js'

       ENABLE_GA: false,           // set true to enable GA
       GA_MEASUREMENT_ID: ''       // e.g. 'G-XXXXXXX'
     }
   };
*/
(function () {
  'use strict';
  if (window.__ANALYTICS_INIT__) return;
  window.__ANALYTICS_INIT__ = true;

  var CFG = window.SITE_CONFIG || {};
  var A = (CFG && CFG.ANALYTICS) || {};

  // Helper to inject a script
  function addScript(src, opts) {
    var s = document.createElement('script');
    if (opts && opts.async) s.async = true;
    if (opts && opts.defer) s.defer = true;
    if (opts && opts.attrs) {
      Object.keys(opts.attrs).forEach(function(k){ s.setAttribute(k, opts.attrs[k]); });
    }
    s.src = src;
    document.head.appendChild(s);
    return s;
  }

  // --- Plausible (privacy-friendly) ---
  if (A.ENABLE_PLAUSIBLE && A.DOMAIN) {
    addScript(A.PLAUSIBLE_SRC || 'https://plausible.io/js/plausible.js', {
      defer: true,
      attrs: { 'data-domain': A.DOMAIN }
    });
  }

  // --- Google Analytics (gtag) optional ---
  if (A.ENABLE_GA && A.GA_MEASUREMENT_ID) {
    addScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(A.GA_MEASUREMENT_ID), { async: true });

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    // Basic config; anonymize IPs and use beacon transport
    gtag('config', A.GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      transport_type: 'beacon'
    });
  }

  // --- Lightweight event helpers (optional but handy) ---
  // Track phone clicks
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (!a) return;
    if (window.plausible) { try { plausible('Phone Click'); } catch(_){} }
    if (window.gtag && A.GA_MEASUREMENT_ID) {
      gtag('event', 'click', { event_category: 'tel', event_label: a.getAttribute('href') });
    }
  });

  // Track Directions/Maps clicks
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.directions, a[href*="google.com/maps"]');
    if (!a) return;
    if (window.plausible) { try { plausible('Directions Click'); } catch(_){} }
    if (window.gtag && A.GA_MEASUREMENT_ID) {
      gtag('event', 'click', { event_category: 'maps', event_label: a.getAttribute('href') });
    }
  });

})();
