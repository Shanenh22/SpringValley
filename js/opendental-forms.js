/*
 * Fixed Open Dental Forms Integration Script - Spring Valley Dental Associates
 * This version handles browser popup blocking and provides fallback options
 */

// Configuration - Your actual Open Dental form URLs
const OPENDENTAL_FORMS = {
  NEW_PATIENT_FORM_URL: 'https://patientviewer.com/WebFormsGWT/GWT/WebForms/WebForms.html?DOID=20379&RKID=5353&WSDID=164555&NFID=164561&NFID=164558&NFID=164564&NFID=164567&NFID=164570',
  EXISTING_PATIENT_FORM_URL: 'tel:+19728522222', // Fallback to phone call
  EMERGENCY_FORM_URL: 'tel:+19728522222',
  CONSULTATION_FORM_URL: 'tel:+19728522222'
};

// Analytics tracking for form usage
function trackFormUsage(formType) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_start', {
      'event_category': 'Patient Forms',
      'event_label': formType,
      'form_type': formType
    });
  }
  console.log('Patient form accessed:', formType);
}

// Main function to handle form opening
function openOpenDentalForm(formUrlKey) {
  const formUrl = OPENDENTAL_FORMS[formUrlKey];
  
  if (!formUrl) {
    console.error('Form URL not found for:', formUrlKey);
    showErrorMessage('Form not available. Please call our office at (972) 852-2222.');
    return;
  }

  // Handle phone numbers differently
  if (formUrl.startsWith('tel:')) {
    window.location.href = formUrl;
    return;
  }

  // Determine form type for analytics
  const formType = formUrlKey.replace('_FORM_URL', '').toLowerCase().replace('_', '-');
  trackFormUsage(formType);

  // Try different methods to open the form
  if (formUrlKey === 'NEW_PATIENT_FORM_URL') {
    openNewPatientForm(formUrl);
  } else {
    // For other forms, direct to phone call
    window.location.href = 'tel:+19728522222';
  }
}

// Specialized function for new patient forms
function openNewPatientForm(formUrl) {
  // Check if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Mobile: Direct redirect without confirmation to avoid phone number dialog
    showRedirectMessage();
    setTimeout(() => {
      window.location.href = formUrl;
    }, 1000);
  } else {
    // Desktop: Use confirmation dialog
    const userConfirmed = confirm(
      "You're about to be redirected to our secure patient forms. This will open in the same tab. Click OK to continue, or Cancel to call us instead at (972) 852-2222."
    );
    
    if (userConfirmed) {
      showRedirectMessage();
      setTimeout(() => {
        window.location.href = formUrl;
      }, 1500);
    } else {
      // User cancelled, offer phone call
      window.location.href = 'tel:+19728522222';
    }
  }
}

// Alternative method: Try popup with better fallback
function openFormPopup(formUrl) {
  // Create a user-initiated action to avoid popup blocking
  const popup = window.open('', 'PatientForm', 'width=1000,height=700,scrollbars=yes,resizable=yes');
  
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    // Popup was blocked
    showPopupBlockedMessage(formUrl);
  } else {
    // Popup opened successfully
    popup.location.href = formUrl;
    popup.focus();
    
    // Show success message
    showFormOpenedMessage();
  }
}

// Show redirect loading message
function showRedirectMessage() {
  const message = document.createElement('div');
  message.id = 'redirect-loading-message';
  message.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(14, 54, 90, 0.2);
      z-index: 10000;
      text-align: center;
      max-width: 400px;
      border-left: 4px solid #0077B6;
    ">
      <div style="
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid #0077B6;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 1rem;
      "></div>
      <h3 style="
        color: #0E365A;
        margin-bottom: 0.5rem;
        font-family: 'Montserrat', sans-serif;
      ">Redirecting to Patient Forms</h3>
      <p style="
        color: #5A6D80;
        margin: 0;
        font-family: 'Inter', sans-serif;
      ">You'll be redirected to our secure patient registration in just a moment...</p>
    </div>
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    "></div>
  `;
  
  // Add spin animation if not already present
  if (!document.querySelector('#form-spinner-style')) {
    const style = document.createElement('style');
    style.id = 'form-spinner-style';
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(message);
}

// Show form opened successfully message
function showFormOpenedMessage() {
  const message = document.createElement('div');
  message.id = 'form-opened-message';
  message.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #8FD6C8;
      color: #0E365A;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(143, 214, 200, 0.3);
      z-index: 10000;
      max-width: 300px;
      font-family: 'Inter', sans-serif;
    ">
      <strong>Form Opened Successfully!</strong><br>
      <small>Check the new window/tab for your patient forms.</small>
    </div>
  `;
  
  document.body.appendChild(message);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    const msg = document.getElementById('form-opened-message');
    if (msg) msg.remove();
  }, 5000);
}

// Show popup blocked message with better options
function showPopupBlockedMessage(formUrl) {
  const message = document.createElement('div');
  message.id = 'popup-blocked-message';
  message.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(14, 54, 90, 0.2);
      z-index: 10000;
      text-align: center;
      max-width: 450px;
      border-left: 4px solid #0077B6;
    ">
      <div style="
        font-size: 2rem;
        margin-bottom: 1rem;
      ">??</div>
      <h3 style="
        color: #0E365A;
        margin-bottom: 1rem;
        font-family: 'Montserrat', sans-serif;
      ">Choose How to Access Your Forms</h3>
      <p style="
        color: #5A6D80;
        margin-bottom: 1.5rem;
        font-family: 'Inter', sans-serif;
        line-height: 1.5;
      ">Your browser blocked the popup. Please choose one of these options:</p>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <a href="${formUrl}" target="_blank" style="
          background: #0077B6;
          color: white;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: 600;
          display: block;
        ">Open Forms in New Tab</a>
        <button onclick="redirectToForms('${formUrl}')" style="
          background: #0E365A;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        ">Open Forms in This Tab</button>
        <a href="tel:+19728522222" style="
          background: #EEF2F6;
          color: #24313A;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: 500;
        ">Call Us Instead: (972) 852-2222</a>
      </div>
      <button onclick="closePopupMessage()" style="
        background: transparent;
        border: none;
        color: #5A6D80;
        margin-top: 1rem;
        cursor: pointer;
        text-decoration: underline;
      ">Close</button>
    </div>
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    " onclick="closePopupMessage()"></div>
  `;
  
  document.body.appendChild(message);
}

// Redirect to forms in same tab
function redirectToForms(formUrl) {
  closePopupMessage();
  showRedirectMessage();
  setTimeout(() => {
    window.location.href = formUrl;
  }, 1500);
}

// Show error message
function showErrorMessage(errorText) {
  const message = document.createElement('div');
  message.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(228, 108, 94, 0.2);
      z-index: 10000;
      text-align: center;
      max-width: 400px;
      border-left: 4px solid #E46C5E;
    ">
      <div style="font-size: 2rem; color: #E46C5E; margin-bottom: 1rem;">??</div>
      <h3 style="color: #0E365A; margin-bottom: 1rem; font-family: 'Montserrat', sans-serif;">
        Form Unavailable
      </h3>
      <p style="color: #5A6D80; margin-bottom: 1.5rem; font-family: 'Inter', sans-serif;">
        ${errorText}
      </p>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: #0077B6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
      ">Close</button>
    </div>
  `;
  document.body.appendChild(message);
}

// Close popup message
function closePopupMessage() {
  const message = document.getElementById('popup-blocked-message');
  if (message) message.remove();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Handle form buttons - Updated to be more reliable
  const formButtons = document.querySelectorAll('[data-form-type]');
  
  formButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const formType = this.getAttribute('data-form-type');
      const formUrlKey = formType.toUpperCase().replace('-', '_') + '_FORM_URL';
      openOpenDentalForm(formUrlKey);
    });
  });
  
  // Also handle direct href links as fallback
  const directFormLinks = document.querySelectorAll('a[href*="patientviewer.com"]');
  directFormLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      openNewPatientForm(this.href);
    });
  });
});

// Export functions for global access
window.openOpenDentalForm = openOpenDentalForm;
window.closePopupMessage = closePopupMessage;
window.redirectToForms = redirectToForms;