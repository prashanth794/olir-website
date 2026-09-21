// Forms submit directly to Netlify; navigation never intercepts submissions.
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('dialog#site-menu');

  if (!menuButton || !menu || typeof menu.showModal !== 'function') return;

  const desktop = window.matchMedia('(min-width: 1000px)');
  let previousFocus = null;
  let previousOverflow = '';
  let previousOverflowPriority = '';
  let scrollLocked = false;

  menuButton.type = 'button';
  menuButton.setAttribute('aria-controls', menu.id);
  menu.querySelectorAll('[data-close-menu]').forEach((button) => {
    if (button instanceof HTMLButtonElement) button.type = 'button';
  });

  const updateButton = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  const unlockScroll = () => {
    if (!scrollLocked) return;
    if (previousOverflow) {
      document.body.style.setProperty('overflow', previousOverflow, previousOverflowPriority);
    } else {
      document.body.style.removeProperty('overflow');
    }
    document.body.classList.remove('menu-open');
    scrollLocked = false;
  };

  const closeMenu = () => {
    if (menu.open) menu.close();
    updateButton(false);
    unlockScroll();
  };

  const openMenu = () => {
    if (menu.open || desktop.matches) return;
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.getPropertyValue('overflow');
    previousOverflowPriority = document.body.style.getPropertyPriority('overflow');
    menu.showModal();
    document.body.style.setProperty('overflow', 'hidden');
    document.body.classList.add('menu-open');
    scrollLocked = true;
    updateButton(true);
    // The browser traps focus inside a modal dialog and makes the page inert.
    menu.querySelector('[data-close-menu]')?.focus({ preventScroll: true });
  };

  menuButton.addEventListener('click', () => {
    if (menu.open) closeMenu();
    else openMenu();
  });

  menu.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('[data-close-menu], a[href]')) {
      closeMenu();
      return;
    }

    // A backdrop click targets the dialog, but empty space inside it does too.
    if (event.target === menu) {
      const bounds = menu.getBoundingClientRect();
      const outside = event.clientX < bounds.left || event.clientX > bounds.right
        || event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (outside) closeMenu();
    }
  });

  // Escape uses the dialog's native cancel behaviour; all dismissal paths clean up.
  menu.addEventListener('close', () => {
    updateButton(false);
    unlockScroll();
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected
      && previousFocus.getClientRects().length > 0
      && (document.activeElement === document.body || menu.contains(document.activeElement))) {
      previousFocus.focus({ preventScroll: true });
    }
    previousFocus = null;
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });

  window.addEventListener('pageshow', () => {
    if (!menu.open) {
      updateButton(false);
      unlockScroll();
    } else if (desktop.matches) {
      closeMenu();
    }
  });

  // --- Asynchronous Form Submission ---
  document.querySelectorAll('form[data-netlify="true"]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
      }
      try {
        const formData = new FormData(form);
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
        if (res.ok) {
          form.innerHTML = '<div class="form-success"><p class="eyebrow">Thank you</p><p>You’re on the list. We’ll be in touch soon.</p></div>';
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = 'Error. Please try again.';
        }
      }
    });
  });

  // --- Scroll Reveal Animations ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
