(() => {
  const themeKey = 'surge-theme-v2';
  const isTheme = (value) => value === 'light' || value === 'dark';

  const readTheme = () => {
    try {
      const savedTheme = window.localStorage.getItem(themeKey);
      if (isTheme(savedTheme)) return savedTheme;
    } catch {
      // Theme selection still works for the current page when storage is blocked.
    }

    // Start in SURGE's light theme unless the visitor explicitly saved another choice.
    return 'light';
  };

  const applyTheme = (theme) => {
    const nextTheme = isTheme(theme) ? theme : 'light';
    document.documentElement.dataset.theme = nextTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      nextTheme === 'dark' ? '#0B1220' : '#FFFFFF',
    );

    try {
      window.localStorage.setItem(themeKey, nextTheme);
    } catch {
      // The chosen theme remains applied for this page view.
    }

    return nextTheme;
  };

  const initialTheme = readTheme();
  document.documentElement.dataset.theme = initialTheme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    initialTheme === 'dark' ? '#0B1220' : '#FFFFFF',
  );

  const syncThemeControls = () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(isDark));
      button.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
      const label = button.querySelector('[data-theme-label]');
      if (label) label.textContent = isDark ? 'Light mode' : 'Dark mode';
      const icon = button.querySelector('.ti');
      icon?.classList.toggle('ti-sun', isDark);
      icon?.classList.toggle('ti-moon', !isDark);
    });
  };

  const setTheme = (theme) => {
    const result = applyTheme(theme);
    syncThemeControls();
    return result;
  };

  const attachThemeControls = () => {
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      if (button.dataset.themeBound === 'true') return;
      button.addEventListener('click', () => {
        setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
      });
      button.dataset.themeBound = 'true';
    });
    syncThemeControls();
  };

  window.SURGE_THEME = Object.freeze({
    get: () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
    set: setTheme,
    toggle: () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'),
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachThemeControls, { once: true });
  } else {
    attachThemeControls();
  }
})();
