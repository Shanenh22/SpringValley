(function(){
  'use strict';
  if (window.__SV_ANALYTICS_INIT__) return;
  window.__SV_ANALYTICS_INIT__ = true;

  function onReady(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once:true });
    else fn();
  }

  function readConsent(){
    try { return JSON.parse(localStorage.getItem((window.SITE_CONFIG && window.SITE_CONFIG.CONSENT && window.SITE_CONFIG.CONSENT.STORAGE_KEY) || 'svda_consent_v1') || '{}'); }
    catch(e){ return {}; }
  }

  function loadScript(src, attrs){
    var s = document.createElement('script');
    s.src = src; s.async = true;
    Object.keys(attrs || {}).forEach(function(k){ s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s);
    return s;
  }

  function initGA(id){
    if (!id || window.__SV_GA_READY__) return;
    window.__SV_GA_READY__ = true;
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id));
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ dataLayer.push(arguments); };
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    gtag('js', new Date());
    gtag('config', id, { anonymize_ip: true, transport_type: 'beacon' });
  }

  function updateConsent(granted){
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  }

  function track(name, params){
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
    }
    if (typeof window.plausible === 'function') {
      try { window.plausible(name, { props: params || {} }); } catch(e){}
    }
  }
  window.trackSiteEvent = track;

  onReady(function(){
    var cfg = window.SITE_CONFIG || {};
    var a = cfg.ANALYTICS || {};
    var consent = readConsent();
    if (a.ENABLE_GA && a.GA_MEASUREMENT_ID) initGA(a.GA_MEASUREMENT_ID);
    updateConsent(!!consent.analytics);

    document.addEventListener('sv:consent-updated', function(e){ updateConsent(!!(e.detail && e.detail.analytics)); });

    document.addEventListener('click', function(e){
      var tel = e.target.closest && e.target.closest('a[href^="tel:"]');
      if (tel) track('phone_click', {link_url: tel.getAttribute('href')});
      var dir = e.target.closest && e.target.closest('a.directions, a[href*="google.com/maps"], a[href*="maps.google.com"]');
      if (dir) track('directions_click', {link_url: dir.getAttribute('href')});
      var form = e.target.closest && e.target.closest('[data-form-type]');
      if (form) track('patient_form_click', {form_type: form.getAttribute('data-form-type')});
    }, {passive:true});
  });
})();
