(() => {
  const menuButton = document.querySelector('#menu-toggle');
  const menu = document.querySelector('#primary-navigation');

  const closeMenu = () => {
    if (!menuButton || !menu) return;
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    menuButton.querySelector('.menu-label').textContent = 'Menu';
    menuButton.querySelector('.ti')?.classList.replace('ti-x', 'ti-menu-2');
  };

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menu.classList.toggle('is-open', !isOpen);
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      menuButton.querySelector('.menu-label').textContent = isOpen ? 'Menu' : 'Close';
      menuButton.querySelector('.ti')?.classList.toggle('ti-menu-2', isOpen);
      menuButton.querySelector('.ti')?.classList.toggle('ti-x', !isOpen);
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 761px)').matches) closeMenu();
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealItems.length) {
    document.documentElement.classList.add('v7-motion');
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }

  import('https://esm.sh/animejs@4')
    .then(({ animate, svg }) => {
      const waveLines = document.querySelectorAll('.energy-wave__line');
      if (!waveLines.length) return;
      animate(svg.createDrawable(waveLines), {
        draw: ['0 .18', '.82 1'],
        duration: 7200,
        ease: 'linear',
        loop: true,
        alternate: true
      });
    })
    .catch(() => {
      // The energy accent remains a complete static SVG when the motion CDN is unavailable.
    });
})();
