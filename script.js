// Waitlist submissions are handled by Netlify Forms after the next deployment.
// Shared mobile navigation for every Olir page.
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const primaryNav = header?.querySelector('nav');
  if (!header || !primaryNav) return;

  primaryNav.id ||= 'olir-primary-navigation';
  primaryNav.setAttribute('aria-label', 'Primary navigation');
  let menuButton = header.querySelector('.menu');
  if (!menuButton) {
    menuButton = document.createElement('button');
    menuButton.className = 'menu';
    header.querySelector('.header-actions')?.append(menuButton);
  }
  menuButton.type = 'button';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-controls', 'olir-mobile-menu');
  menuButton.setAttribute('aria-label', 'Open menu');
  menuButton.innerHTML = '<span></span><span></span>';

  const panel = document.createElement('aside');
  panel.id = 'olir-mobile-menu';
  panel.className = 'mobile-menu';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="mobile-menu__top"><span>Olir navigation</span><button type="button" class="mobile-menu__close" aria-label="Close menu">×</button></div>
    <nav aria-label="Mobile navigation">${primaryNav.innerHTML}</nav>
    <div class="mobile-menu__support"><a href="faq.html">FAQs</a><a href="contact.html">Contact</a><a href="shipping-returns.html">Shipping &amp; returns</a><a href="privacy.html">Privacy</a></div>
    <a class="button" href="product.html#waitlist">Join the first release <span>→</span></a>`;
  document.body.append(panel);

  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.setAttribute('aria-hidden', String(!open));
  };
  menuButton.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  panel.querySelector('.mobile-menu__close').addEventListener('click', () => setMenu(false));
  panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
});
