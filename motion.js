// Small progressive enhancements. Content remains available without JavaScript.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const carousel = document.querySelector('[data-carousel]');

  if (carousel) {
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const selectors = [...carousel.querySelectorAll('.carousel-select')];
    const toggle = carousel.querySelector('[data-carousel-toggle]');
    const caption = carousel.querySelector('[data-carousel-caption]');
    let current = 0;
    let paused = reducedMotion.matches;
    let hovering = false;
    let inView = true;
    let timer;

    const syncPlayback = () => {
      clearTimeout(timer);
      const playing = !paused && !hovering && inView && !document.hidden && !reducedMotion.matches;
      carousel.dataset.playing = String(playing);
      toggle.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
      toggle.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
      toggle.hidden = reducedMotion.matches;
      if (playing) timer = setTimeout(() => showSlide((current + 1) % slides.length), 7500);
    };

    const showSlide = (index) => {
      current = index;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        slide.setAttribute('aria-hidden', String(i !== index));
        selectors[i].classList.toggle('is-current', i === index);
        selectors[i].setAttribute('aria-pressed', String(i === index));
      });
      caption.textContent = slides[index].dataset.caption;
      syncPlayback();
    };

    selectors.forEach((button, index) => button.addEventListener('click', () => {
      paused = true; // Manual selection stays put until the visitor chooses Play.
      showSlide(index);
    }));
    toggle.addEventListener('click', () => { paused = !paused; syncPlayback(); });
    carousel.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      hovering = true;
      syncPlayback();
    });
    carousel.addEventListener('pointerleave', () => { hovering = false; syncPlayback(); });
    carousel.addEventListener('focusin', () => { paused = true; syncPlayback(); });
    document.addEventListener('visibilitychange', syncPlayback);
    document.querySelector('#site-menu')?.addEventListener('close', syncPlayback);
    document.querySelector('.menu-toggle')?.addEventListener('click', () => {
      paused = true;
      syncPlayback();
    });
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) paused = true;
      syncPlayback();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      }, { threshold: 0.1 }).observe(carousel);
    }
    carousel.querySelector('.carousel-controls').hidden = false;
    syncPlayback();
  }

  // An accessible botanical index: keyboard arrows, Home/End and visible focus.
  document.querySelectorAll('[data-ingredient-explorer]').forEach((explorer) => {
    const tabs = [...explorer.querySelectorAll('[role="tab"]')];
    const panels = [...explorer.querySelectorAll('[data-ingredient-panel]')];
    const select = (index) => {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
    };
    panels.forEach((panel, i) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tabs[i].id);
      panel.tabIndex = 0;
    });
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(next);
        tabs[next].focus();
      });
    });
    explorer.classList.add('is-enhanced');
    explorer.querySelector('[role="tablist"]').hidden = false;
    select(0);
  });

  // Reveal whole editorial groups once, rather than making every line move.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const groups = document.querySelectorAll('.editorial-intro > *, .product-feature > *, .section-heading, .ingredient-explorer, .ritual-copy, .faq-section > div, .about-story > *, .values-grid > article, .ritual-steps > article, .ingredient-rows > article, .statement > *, .waitlist > div');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add('is-visible');
        observer.unobserve(target);
      });
    }, { threshold: 0.08 });
    groups.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add('reveal');
      observer.observe(element);
    });
    reducedMotion.addEventListener('change', () => {
      if (!reducedMotion.matches) return;
      groups.forEach(element => element.classList.add('is-visible'));
      observer.disconnect();
    });
  }

  const header = document.querySelector('.site-header');
  if (header) {
    let scheduled = false;
    const updateHeader = () => {
      header.classList.toggle('header-scrolled', window.scrollY > 60);
      scheduled = false;
    };
    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateHeader);
    }, { passive: true });
    updateHeader();
  }
})();
