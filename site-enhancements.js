(() => {
  const consentKey = 'surge-cookie-consent';
  const analyticsId = String(window.SURGE_ANALYTICS_ID || '').trim();
  let transientConsent = null;

  const readConsent = () => {
    try { return window.localStorage.getItem(consentKey) || transientConsent; } catch { return transientConsent; }
  };

  const writeConsent = (value) => {
    transientConsent = value;
    try { window.localStorage.setItem(consentKey, value); } catch { /* Keep the choice for this page view if storage is blocked. */ }
  };

  const clearConsent = () => {
    transientConsent = null;
    try { window.localStorage.removeItem(consentKey); } catch { /* The site remains usable when storage is blocked. */ }
  };

  const setAnalyticsDisabled = (disabled) => {
    if (analyticsId) window[`ga-disable-${analyticsId}`] = disabled;
  };

  const clearAnalyticsCookies = () => {
    document.querySelector('[data-surge-analytics]')?.remove();
    const hostname = window.location.hostname;
    const domain = hostname.startsWith('www.') ? `.${hostname.slice(4)}` : hostname;
    const cookiePattern = /^_(?:ga|gid|gat)(?:_|$)/;

    document.cookie.split(';')
      .map((cookie) => cookie.split('=')[0].trim())
      .filter((name) => cookiePattern.test(name))
      .forEach((name) => {
        const expired = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = expired;
        document.cookie = `${expired}; domain=${hostname}`;
        if (domain !== hostname) document.cookie = `${expired}; domain=${domain}`;
      });
  };

  const loadAnalytics = () => {
    if (!/^G-[A-Z0-9]+$/i.test(analyticsId) || document.querySelector('[data-surge-analytics]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    script.dataset.surgeAnalytics = 'true';
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId, { anonymize_ip: true });
  };

  const addAnalyticsEventTracking = () => {
    document.querySelectorAll('[data-analytics-event]').forEach((element) => {
      if (element.dataset.analyticsBound === 'true') return;
      element.addEventListener('click', () => {
        if (readConsent() !== 'analytics' || typeof window.gtag !== 'function') return;
        window.gtag('event', element.dataset.analyticsEvent, {
          event_category: 'engagement',
          event_label: element.dataset.analyticsLocation || 'site',
          transport_type: 'beacon',
        });
      }, { passive: true });
      element.dataset.analyticsBound = 'true';
    });
  };

  const addSkipLink = () => {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.surge-skip-link, .skip-link, .legal-skip')) return;
    if (!main.id) main.id = 'main-content';
    const link = document.createElement('a');
    link.className = 'surge-skip-link';
    link.href = `#${main.id}`;
    link.textContent = 'Skip to content';
    document.body.prepend(link);
  };

  let activeBanner = null;
  const addConsentBanner = () => {
    if (readConsent() || activeBanner?.isConnected) return activeBanner;
    const banner = document.createElement('aside');
    banner.className = 'surge-cookie-banner';
    banner.setAttribute('aria-label', 'Data and cookie preferences');
    banner.innerHTML = `
      <div>
        <p class="surge-cookie-title">Data and cookie preferences</p>
        <p class="surge-cookie-copy">SURGE stores your preference in this browser. Optional analytics loads only if you allow it. <a href="/cookie-policy">Cookie Policy</a> · <a href="/privacy-policy">Privacy Policy</a>.</p>
      </div>
      <div class="surge-cookie-actions">
        <button class="surge-cookie-button" data-consent="necessary" type="button">Necessary only</button>
        <button class="surge-cookie-button surge-cookie-button--primary" data-consent="analytics" type="button">Allow analytics</button>
      </div>`;

    banner.addEventListener('click', (event) => {
      const button = event.target.closest('[data-consent]');
      if (!button) return;
      const choice = button.dataset.consent;
      writeConsent(choice);
      banner.remove();
      activeBanner = null;
      if (choice === 'analytics') {
        setAnalyticsDisabled(false);
        loadAnalytics();
      } else {
        setAnalyticsDisabled(true);
        clearAnalyticsCookies();
      }
      addConsentSettingsControl();
    });

    document.body.appendChild(banner);
    activeBanner = banner;
    return banner;
  };

  const addConsentSettingsControl = () => {
    if (!readConsent() || document.querySelector('.surge-consent-settings')) return;
    const button = document.createElement('button');
    button.className = 'surge-consent-settings';
    button.type = 'button';
    button.setAttribute('aria-label', 'Open data and cookie consent settings');
    button.textContent = 'Privacy settings';
    button.addEventListener('click', () => reopenConsentSettings(button));
    document.body.appendChild(button);
  };

  const reopenConsentSettings = (settingsButton) => {
    clearConsent();
    setAnalyticsDisabled(true);
    clearAnalyticsCookies();
    settingsButton?.remove();
    const banner = addConsentBanner();
    banner?.querySelector('[data-consent="necessary"]')?.focus();
  };

  const bindConsentControls = () => {
    document.querySelectorAll('[data-open-consent]').forEach((button) => {
      button.addEventListener('click', () => {
        const settingsButton = document.querySelector('.surge-consent-settings');
        if (settingsButton) {
          reopenConsentSettings(settingsButton);
        } else {
          const banner = addConsentBanner();
          banner?.querySelector('[data-consent="necessary"]')?.focus();
        }
      });
    });
  };

  const initialise = () => {
    // Keep the former theme switch limited to the legacy dark landing page.
    if (document.querySelector('#surge-top')) {
      const themeKey = 'surge-theme';
      const readTheme = () => {
        try { return window.localStorage.getItem(themeKey) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
      };
      const writeTheme = (value) => {
        try { window.localStorage.setItem(themeKey, value); } catch { /* Optional preference only. */ }
      };
      const applyTheme = (theme) => {
        document.documentElement.dataset.surgeTheme = theme === 'light' ? 'light' : 'dark';
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#F5F1E8' : '#14161A');
      };
      applyTheme(readTheme());
      if (!document.querySelector('.surge-theme-toggle')) {
        const toggle = document.createElement('button');
        toggle.className = 'surge-theme-toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-label', 'Switch legacy preview colour theme');
        toggle.textContent = 'Theme';
        toggle.addEventListener('click', () => {
          const next = document.documentElement.dataset.surgeTheme === 'light' ? 'dark' : 'light';
          writeTheme(next);
          applyTheme(next);
        });
        document.body.appendChild(toggle);
      }
    }

    addSkipLink();
    addAnalyticsEventTracking();
    bindConsentControls();
    const consent = readConsent();
    if (consent === 'analytics') {
      setAnalyticsDisabled(false);
      loadAnalytics();
      addConsentSettingsControl();
    } else if (consent === 'necessary') {
      setAnalyticsDisabled(true);
      addConsentSettingsControl();
    } else {
      setAnalyticsDisabled(true);
      clearConsent();
      addConsentBanner();
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
