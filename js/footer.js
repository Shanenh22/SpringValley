document.addEventListener('DOMContentLoaded', function() {
    const footerHTML = `
    <footer class="footer" role="contentinfo">
      <div class="footer-container">
        <!-- Column 1: Contact + Map -->
        <section class="footer-column" aria-labelledby="footer-contact">
          <h4 id="footer-contact">Contact Us</h4>
          <div class="footer-address">
            Spring Valley Dental Associates<br>
            14228 Midway Rd, Suite 100<br>
            Dallas, TX 75244<br>
            Phone: <a href="tel:+19728522222">(972) 852-2222</a><br>
            Email: <a href="mailto:info@springvalleydentistry.com">info@springvalleydentistry.com</a>
          </div>

          <div class="map-container" aria-label="Location map">
            <iframe
              title="Spring Valley Dental Associates Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3346.7234567890123!2d-96.8395!3d32.9443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c26d39eab13f3%3A0x3e1243026b4b017b!2s14228%20Midway%20Rd%20%23100%2C%20Dallas%2C%20TX%2075244!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              style="border:0"
              allowfullscreen>
            </iframe>
          </div>
        </section>

        <!-- Column 2: Quick links -->
        <nav class="footer-column" aria-labelledby="footer-links">
          <h4 id="footer-links">Quick Links</h4>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="patient-info.html" data-nowrap>Patient Info</a></li>
            <li><a href="privacy.html">Privacy &amp; Terms</a></li>
            <li><a href="ask-a-question.html">Ask a Question</a></li>
            <li><a href="contact.html">Book Online</a></li>
          </ul>
        </nav>

        <!-- Column 3: Hours + Social -->
        <section class="footer-column" aria-labelledby="footer-hours">
          <h4 id="footer-hours">Office Hours</h4>
          <ul class="hours-list">
            <li>Monday: 10:00 AM — 7:00 PM</li>
            <li>Tuesday: 8:30 AM — 4:00 PM</li>
            <li>Wednesday: 8:00 AM — 1:00 PM</li>
            <li>Thursday: 8:00 AM — 3:00 PM</li>
            <li>Friday: 8:00 AM — 3:00 PM</li>
            <li>Saturday: By appointment only</li>
            <li>Sunday: Closed</li>
            <li>Find us on <a href="https://www.google.com/maps/search/?api=1&query=14228+Midway+Rd,+Suite+100,+Dallas,+TX+75244" target="_blank" rel="noopener">Google Maps</a>.</li>
          </ul>

          <div class="social-links icons-only" aria-label="Social media">
            <a href="https://www.instagram.com/springvalleydental_dallas?igsh=NTM0aXVkMzA3czd2" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 5.75a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 18 5.75z"/></svg>
            </a>
            <a href="https://www.facebook.com/share/16xP4Vjixk/?mibextid=wwXIfr" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 22v-8h2.7l.4-3h-3.1V8.7c0-.9.3-1.5 1.7-1.5h1.5V4.5c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7.5v3h2.5v8z"/></svg>
            </a>
          </div>
        </section>
      </div>

      <p class="copy">© <span id="current-year"></span> Spring Valley Dental Associates. All rights reserved.</p>
    </footer>
    `;
    
    // Insert the footer HTML
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
        
        // Set the current year
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
});