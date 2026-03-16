/* form-submit.js - submit forms to API Gateway (Lambda + SES) with a11y + safety */
(function(){
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var API = CFG.CONTACT_API_URL;
  var RECIPIENT = 'info@springvalleydentistry.com'; // enforced client-side; also enforce server-side!

  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  function ensureStatusRegion(form){
    var sr = form.querySelector('[role="status"]#form-status');
    if (!sr) {
      sr = document.createElement('div');
      sr.id = 'form-status';
      sr.setAttribute('role', 'status');
      sr.setAttribute('aria-live', 'polite');
      sr.className = 'sr-only'; // visually hidden class in your CSS
      form.appendChild(sr);
    }
    return sr;
  }

  function showStatus(sr, msg){ if (sr) sr.textContent = msg; }

  ready(function(){
    if (!API) return;

    var forms = Array.from(document.querySelectorAll(
      'form#ask-form, form#contact-form, form[data-api="contact"]'
    ));

    forms.forEach(function(form){
      var status = ensureStatusRegion(form);

      form.addEventListener('submit', async function(e){
        e.preventDefault();

        var btn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (btn) { btn.disabled = true; btn.dataset.prevText = btn.textContent || btn.value; (btn.textContent ? btn.textContent = 'Sending…' : btn.value = 'Sending…'); }
        form.setAttribute('aria-busy','true');

        // Build payload
        var data = {};
        new FormData(form).forEach((v,k) => { data[k]=v; });

        // Force recipient (also enforce on server)
        data.to = RECIPIENT;

        // Turnstile
        if (CFG.ENABLE_TURNSTILE) {
          var tokenInput = form.querySelector('input[name="cf-turnstile-response"]');
          if (!tokenInput || !tokenInput.value) {
            showStatus(status, 'Please complete the anti-spam check.');
            alert('Please complete the anti-spam check.');
            if (btn) { btn.disabled=false; (btn.textContent ? btn.textContent = btn.dataset.prevText : btn.value = btn.dataset.prevText); }
            form.removeAttribute('aria-busy');
            return;
          }
          data.turnstileToken = tokenInput.value;
        }

        // Minimal validation
        if (!data.firstName || !data.lastName || !data.email) {
          showStatus(status, 'Please complete required fields.');
          alert('Please complete required fields.');
          if (btn) { btn.disabled=false; (btn.textContent ? btn.textContent = btn.dataset.prevText : btn.value = btn.dataset.prevText); }
          form.removeAttribute('aria-busy');
          return;
        }

        // Fetch with timeout
        var ctrl = new AbortController();
        var t = setTimeout(()=>ctrl.abort(), 15000);

        try {
          var res = await fetch(API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-store',
            referrerPolicy: 'no-referrer',
            signal: ctrl.signal
          });
          clearTimeout(t);

          if (!res.ok) throw new Error('Request failed: ' + res.status);
          var out = await res.json().catch(function(){ return {}; });
          var msg = out.message || 'Thanks! We received your message and will get back to you shortly.';
          showStatus(status, msg);
          form.reset();
          if (window.turnstile && CFG.ENABLE_TURNSTILE) turnstile.reset();

        } catch (err) {
          console.error(err);
          showStatus(status, 'Sorry, something went wrong. Please call our office or try again.');
          alert('Sorry, something went wrong. Please call our office or try again.');
        } finally {
          if (btn) { btn.disabled=false; (btn.textContent ? btn.textContent = btn.dataset.prevText : btn.value = btn.dataset.prevText); }
          form.removeAttribute('aria-busy');
        }
      });
    });

    // Render Turnstile widget if enabled and placeholder exists
    if (CFG.ENABLE_TURNSTILE && CFG.TURNSTILE_SITE_KEY) {
      var ph = document.getElementById('cf-turnstile');
      if (ph) {
        var s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        s.async = true; s.defer = true;
        document.head.appendChild(s);
        ph.setAttribute('data-sitekey', CFG.TURNSTILE_SITE_KEY);
        ph.classList.add('cf-turnstile');
      }
    }
  });
})();
