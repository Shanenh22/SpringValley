document.addEventListener('DOMContentLoaded', function(){
  var ph = document.getElementById('footer-placeholder');
  if (!ph) return;
  var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.PRACTICE) || {};
  ph.innerHTML = `
  <footer class="footer footer-inner">
      <div class="footer-container">
        <section class="footer-column">
          <h4>Contact Us</h4>
          <ul>
            <li>${cfg.NAME || 'Spring Valley Dental Associates'}</li>
            <li>14228 Midway Rd, Suite 100</li>
            <li>Dallas, TX 75244</li>
            <li>Phone: <a href="${cfg.PHONE_TEL || 'tel:+19728522222'}">${cfg.PHONE_DISPLAY || '(972) 852-2222'}</a></li>
            <li>Email: <a href="mailto:${cfg.EMAIL || 'info@springvalleydentistry.com'}">${cfg.EMAIL || 'info@springvalleydentistry.com'}</a></li>
          </ul>
        </section>
        <section class="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="patient-info.html">Patient Info</a></li>
            <li><a href="ask-a-question.html">Ask a Question</a></li>
            <li><a href="contact.html">Book Online</a></li>
          </ul>
        </section>
        <section class="footer-column">
          <h4>Hours</h4>
          <ul>
            <li>Mon: 10:00 AM – 7:00 PM</li>
            <li>Tue: 8:30 AM – 4:00 PM</li>
            <li>Wed: 8:00 AM – 1:00 PM</li>
            <li>Thu–Fri: 8:00 AM – 3:00 PM</li>
            <li>Sat: By appointment</li>
          </ul>
        </section>
      </div>
      <p class="copy">© <span id="current-year"></span> Spring Valley Dental Associates. All rights reserved.</p>
  </footer>`;
  var year = document.getElementById('current-year'); if (year) year.textContent = new Date().getFullYear();
});
