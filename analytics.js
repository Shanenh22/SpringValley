/* analytics.js – central loader for Plausible + Google Analytics (GA4) with full conversion tracking
   Configure in site-config.js:

   window.SITE_CONFIG = {
     ANALYTICS: {
       ENABLE_PLAUSIBLE: true,
       DOMAIN: 'springvalleydentistry.com',

       ENABLE_GA: true,
       GA_MEASUREMENT_ID: 'G-KY64HPT0ER'
     }
   };
*/
(function () {
  'use strict';
  if (window.__ANALYTICS_INIT__) return;
  window.__ANALYTICS_INIT__ = true;

  var CFG = window.SITE_CONFIG || {};
  var A = (CFG && CFG.ANALYTICS) || {};

  // ── Helper: inject a <script> tag ──────────────────────────────────────────
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

  // ── Helper: fire a GA4 conversion event ────────────────────────────────────
  function gaConversion(eventName, params) {
    if (window.gtag && A.GA_MEASUREMENT_ID) {
      try {
        window.gtag('event', eventName, params || {});
      } catch(e) {}
    }
  }

  // ── Helper: fire a Plausible custom event ──────────────────────────────────
  function plausibleEvent(name, props) {
    if (window.plausible) {
      try { window.plausible(name, props ? { props: props } : undefined); } catch(e) {}
    }
  }

  // ── 1. Plausible (privacy-friendly, no cookies) ────────────────────────────
  if (A.ENABLE_PLAUSIBLE && A.DOMAIN) {
    addScript(A.PLAUSIBLE_SRC || 'https://plausible.io/js/plausible.js', {
      defer: true,
      attrs: { 'data-domain': A.DOMAIN }
    });
  }

  // ── 2. Google Analytics 4 ──────────────────────────────────────────────────
  if (A.ENABLE_GA && A.GA_MEASUREMENT_ID) {
    addScript(
      'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(A.GA_MEASUREMENT_ID),
      { async: true }
    );

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', A.GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      transport_type: 'beacon',
      // GA4 conversion events — mark these in GA4 Admin > Events > Mark as conversion
      // after at least one event fires so they appear in the list.
    });
  }

  // ── 3. Conversion: Phone Clicks ────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (!a) return;
    var label = a.getAttribute('href');
    plausibleEvent('Phone Click', { number: label });
    gaConversion('phone_call', {
      event_category: 'conversion',
      event_label: label,
      value: 1
    });
  });

  // ── 4. Conversion: Directions / Maps Clicks ────────────────────────────────
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.directions, a[href*="google.com/maps"]');
    if (!a) return;
    plausibleEvent('Directions Click');
    gaConversion('get_directions', {
      event_category: 'conversion',
      event_label: 'google_maps',
      value: 1
    });
  });

  // ── 5. Conversion: Appointment Form Submissions ────────────────────────────
  // Fires on any form with id="contact-form", id="ask-form", or data-api="contact"
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form#contact-form, form#ask-form, form[data-api="contact"]');
    if (!form) return;
    plausibleEvent('Form Submit', { form: form.id || 'contact' });
    gaConversion('generate_lead', {
      event_category: 'conversion',
      event_label: form.id || 'contact_form',
      value: 1
    });
  }, true); // capture phase so it fires before preventDefault

  // ── 6. Conversion: Book / CTA Button Clicks ────────────────────────────────
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.button-primary, a.btn-book, a.cta-link.book');
    if (!a) return;
    var label = a.textContent.trim().slice(0, 60);
    plausibleEvent('CTA Click', { label: label });
    gaConversion('cta_click', {
      event_category: 'engagement',
      event_label: label
    });
  });

  // ── 7. Conversion: Google Review CTA Clicks ────────────────────────────────
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="google.com/maps?cid"], a.review-btn');
    if (!a) return;
    plausibleEvent('Review CTA Click');
    gaConversion('review_click', {
      event_category: 'engagement',
      event_label: 'google_review'
    });
  });

  // ── 8. Conversion: Financing / Membership Page Clicks ─────────────────────
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="financing"], a[href*="membership"]');
    if (!a) return;
    var label = a.getAttribute('href');
    plausibleEvent('Financing Interest', { page: label });
    gaConversion('financing_interest', {
      event_category: 'engagement',
      event_label: label
    });
  });

  // ── 9. Scroll depth milestones (engagement signal) ────────────────────────
  var scrollMilestones = { 25: false, 50: false, 75: false, 90: false };
  window.addEventListener('scroll', function () {
    var pct = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    Object.keys(scrollMilestones).forEach(function(m) {
      if (!scrollMilestones[m] && pct >= parseInt(m)) {
        scrollMilestones[m] = true;
        plausibleEvent('Scroll Depth', { depth: m + '%' });
        gaConversion('scroll', { percent_scrolled: parseInt(m) });
      }
    });
  }, { passive: true });

  // ── 10. Financing provider clicks (already existed in financing.html) ──────
  // Expose a helper so financing.html inline script can call it
  window.trackFinancingClick = function(provider) {
    plausibleEvent('Financing Click', { provider: provider });
    gaConversion('financing_click', {
      event_category: 'conversion',
      event_label: provider,
      value: 1
    });
  };

})();
