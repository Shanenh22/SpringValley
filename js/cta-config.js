const CTA_PHONE = 'tel:+19728522222';
const CTA_BOOK = 'contact.html';
const CTA_MAP = 'https://www.google.com/maps/place/14228+Midway+Rd+%23100,+Dallas,+TX+75244/@32.9436588,-96.8381082,17z';
document.addEventListener('DOMContentLoaded', function(){
  var bar = document.querySelector('.sticky-cta-bar');
  if (!bar) return;
  var call = bar.querySelector('.cta-link.call');
  var book = bar.querySelector('.cta-link.book');
  var dir = bar.querySelector('.cta-link.directions');
  if (call) call.href = CTA_PHONE;
  if (book) book.href = CTA_BOOK;
  if (dir) { dir.href = CTA_MAP; dir.target = '_blank'; dir.rel = 'noopener'; }
});
