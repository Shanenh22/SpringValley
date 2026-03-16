(function(){
  'use strict';
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function statusRegion(form){
    var el = form.querySelector('#form-status,[role="status"]');
    if (!el) {
      el = document.createElement('div');
      el.id = 'form-status';
      el.setAttribute('role','status');
      el.setAttribute('aria-live','polite');
      el.className = 'form-status';
      form.appendChild(el);
    }
    return el;
  }
  ready(function(){
    var forms = Array.prototype.slice.call(document.querySelectorAll('form[data-api="contact"], form#ask-form'));
    forms.forEach(function(form){
      if (form.__svBound) return;
      form.__svBound = true;
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var sr = statusRegion(form);
        var cfg = window.SITE_CONFIG || {};
        var endpoint = cfg.CONTACT_API_URL || 'process-contact-form.php';
        var fd = new FormData(form);
        var btn = form.querySelector('[type="submit"]');
        if (btn) { btn.disabled = true; btn.dataset.prev = btn.textContent || btn.value || 'Submit'; if ('textContent' in btn) btn.textContent = 'Sending…'; }
        fetch(endpoint, { method:'POST', body:fd, headers:{'X-Requested-With':'XMLHttpRequest'} })
          .then(function(r){ return r.json().catch(function(){ return { success:r.ok }; }); })
          .then(function(data){
            if (data && data.success) {
              sr.textContent = data.message || 'Thanks. Your message has been sent.';
              sr.className = 'form-status success';
              form.reset();
              if (typeof window.trackSiteEvent === 'function') window.trackSiteEvent('contact_form_submit', {form_id: form.id || 'contact'});
            } else {
              throw new Error((data && data.message) || 'Unable to send');
            }
          })
          .catch(function(err){
            sr.textContent = err.message || 'Sorry, something went wrong. Please call our office.';
            sr.className = 'form-status error';
          })
          .finally(function(){ if (btn) { btn.disabled = false; if ('textContent' in btn) btn.textContent = btn.dataset.prev; } });
      });
    });
  });
})();
