(function(){
  'use strict';
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var cfg = window.SITE_CONFIG || {}; var key = (cfg.CONSENT && cfg.CONSENT.STORAGE_KEY) || 'svda_consent_v1';
    try { if (localStorage.getItem(key)) return; } catch(e) {}
    var bar = document.createElement('div');
    bar.className = 'consent-banner';
    bar.innerHTML = '<p>We use analytics to improve site performance and patient experience. You can accept or decline optional analytics cookies.</p><div class="consent-actions"><button type="button" class="consent-btn secondary" data-choice="decline">Decline</button><button type="button" class="consent-btn primary" data-choice="accept">Accept</button></div>';
    document.body.appendChild(bar);
    bar.addEventListener('click', function(e){
      var btn = e.target.closest('button[data-choice]'); if (!btn) return;
      var granted = btn.getAttribute('data-choice') === 'accept';
      try { localStorage.setItem(key, JSON.stringify({ analytics: granted, updatedAt: new Date().toISOString() })); } catch(err) {}
      document.dispatchEvent(new CustomEvent('sv:consent-updated', { detail: { analytics: granted } }));
      bar.remove();
    });
  });
})();
