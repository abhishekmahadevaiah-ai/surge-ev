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
  const gallery = document.querySelector('[data-gallery-track]');
  if (gallery) {
    const slides = Array.from(gallery.querySelectorAll('[data-gallery-slide]'));
    const previousButton = document.querySelector('[data-gallery-previous]');
    const nextButton = document.querySelector('[data-gallery-next]');
    const status = document.querySelector('[data-gallery-status]');
    let activeIndex = 0;
    let scrollFrame = 0;
    let statusTimeout = 0;

    const setActiveIndex = (nextIndex, announce = true) => {
      activeIndex = Math.max(0, Math.min(slides.length - 1, nextIndex));
      if (previousButton) previousButton.disabled = activeIndex === 0;
      if (nextButton) nextButton.disabled = activeIndex === slides.length - 1;
      if (status && announce) status.textContent = `Showing illustration ${activeIndex + 1} of ${slides.length}.`;
    };

    const currentSlideIndex = () => {
      const trackStart = gallery.getBoundingClientRect().left + Number.parseFloat(getComputedStyle(gallery).scrollPaddingInlineStart || '0');
      return slides.reduce((closestIndex, slide, index) => {
        const closestDistance = Math.abs(slides[closestIndex].getBoundingClientRect().left - trackStart);
        const slideDistance = Math.abs(slide.getBoundingClientRect().left - trackStart);
        return slideDistance < closestDistance ? index : closestIndex;
      }, 0);
    };

    const showSlide = (index) => {
      const targetIndex = Math.max(0, Math.min(slides.length - 1, index));
      const target = slides[targetIndex];
      if (!target) return;
      const trackLeft = gallery.getBoundingClientRect().left;
      const targetOffset = gallery.scrollLeft + target.getBoundingClientRect().left - trackLeft;
      const scrollPadding = Number.parseFloat(getComputedStyle(gallery).scrollPaddingInlineStart || '0');
      gallery.scrollLeft = Math.max(0, targetOffset - scrollPadding);
      setActiveIndex(targetIndex);
    };

    previousButton?.addEventListener('click', () => showSlide(currentSlideIndex() - 1));
    nextButton?.addEventListener('click', () => showSlide(currentSlideIndex() + 1));

    gallery.addEventListener('keydown', (event) => {
      if (event.target !== gallery) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        showSlide(currentSlideIndex() + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });

    gallery.addEventListener('scroll', () => {
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        setActiveIndex(currentSlideIndex(), false);
        scrollFrame = 0;
      });
      if (statusTimeout) window.clearTimeout(statusTimeout);
      statusTimeout = window.setTimeout(() => {
        setActiveIndex(currentSlideIndex());
        statusTimeout = 0;
      }, 160);
    }, { passive: true });

    setActiveIndex(0, false);
  }

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
