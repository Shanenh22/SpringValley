(function(){
  'use strict';
  var PHONE = 'tel:+19728522222';
  function track(formType){ if (typeof window.trackSiteEvent === 'function') window.trackSiteEvent('patient_form_start', {form_type: formType}); }
  window.openOpenDentalForm = function(key){
    var forms = {
      NEW_PATIENT_FORM_URL: 'https://patientviewer.com/WebFormsGWT/GWT/WebForms/WebForms.html?DOID=20379&RKID=5353&WSDID=180392&NFID=180395&NFID=180398&NFID=180401&NFID=180404&NFID=180407',
      EXISTING_PATIENT_FORM_URL: PHONE,
      EMERGENCY_FORM_URL: PHONE,
      CONSULTATION_FORM_URL: PHONE
    };
    var url = forms[key];
    if (!url) return;
    track((key || '').toLowerCase());
    if (url.indexOf('tel:') === 0) { window.location.href = url; return; }
    window.location.href = url;
  };
})();
