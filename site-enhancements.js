(() => {
  const consentKey = 'surge-cookie-consent';
  const analyticsId = String(window.SURGE_ANALYTICS_ID || '').trim();

  const readConsent = () => {
    try {
      return window.localStorage.getItem(consentKey);
    } catch {
      return null;
    }
  };

  const writeConsent = (value) => {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch {
      // The site remains usable when storage is unavailable.
    }
  };

  const clearConsent = () => {
    try {
      window.localStorage.removeItem(consentKey);
    } catch {
      // The site remains usable when storage is unavailable.
    }
  };

  const setAnalyticsDisabled = (disabled) => {
    if (analyticsId) {
      window[`ga-disable-${analyticsId}`] = disabled;
    }
  };

  const clearAnalyticsCookies = () => {
    document.querySelector('[data-surge-analytics]')?.remove();

    const hostname = window.location.hostname;
    const domain = hostname.startsWith('www.') ? `.${hostname.slice(4)}` : hostname;
    const analyticsCookiePattern = /^_(?:ga|gid|gat)(?:_|$)/;

    document.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0].trim())
      .filter((name) => analyticsCookiePattern.test(name))
      .forEach((name) => {
        const expired = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = expired;
        document.cookie = `${expired}; domain=${hostname}`;
        if (domain !== hostname) {
          document.cookie = `${expired}; domain=${domain}`;
        }
      });
  };

  const loadAnalytics = () => {
    if (!/^G-[A-Z0-9]+$/i.test(analyticsId) || document.querySelector('[data-surge-analytics]')) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    script.dataset.surgeAnalytics = 'true';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId, { anonymize_ip: true });
  };

  const addSkipLink = () => {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.surge-skip-link')) {
      return;
    }

    if (!main.id) {
      main.id = 'main-content';
    }

    const skipLink = document.createElement('a');
    skipLink.className = 'surge-skip-link';
    skipLink.href = `#${main.id}`;
    skipLink.textContent = 'Skip to content';
    document.body.prepend(skipLink);
  };

  const addConsentSettingsControl = () => {
    if (!readConsent() || document.querySelector('.surge-consent-settings')) {
      return;
    }

    const button = document.createElement('button');
    button.className = 'surge-consent-settings';
    button.type = 'button';
    button.setAttribute('aria-label', 'Open privacy settings');
    button.textContent = 'Privacy settings';

    button.addEventListener('click', () => {
      clearConsent();
      setAnalyticsDisabled(true);
      clearAnalyticsCookies();
      button.remove();
      const banner = addConsentBanner();
      banner?.querySelector('[data-consent="necessary"]')?.focus();
    });

    document.body.appendChild(button);
  };

  const addConsentBanner = () => {
    if (readConsent() || document.querySelector('.surge-cookie-banner')) {
      return null;
    }

    const banner = document.createElement('aside');
    banner.className = 'surge-cookie-banner';
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.innerHTML = `
      <div>
        <p class="surge-cookie-title">Site preferences</p>
        <p class="surge-cookie-copy">SURGE uses essential storage for your preference. Optional analytics only loads after you choose it. <a href="/privacy">Read the privacy notice</a>.</p>
      </div>
      <div class="surge-cookie-actions">
        <button class="surge-cookie-button" data-consent="necessary" type="button">Necessary only</button>
        <button class="surge-cookie-button surge-cookie-button--primary" data-consent="analytics" type="button">Allow analytics</button>
      </div>
    `;

    banner.addEventListener('click', (event) => {
      const button = event.target.closest('[data-consent]');
      if (!button) {
        return;
      }

      const consent = button.dataset.consent;
      writeConsent(consent);
      banner.remove();
      if (consent === 'analytics') {
        setAnalyticsDisabled(false);
        loadAnalytics();
      } else {
        setAnalyticsDisabled(true);
        clearAnalyticsCookies();
      }
      addConsentSettingsControl();
    });

    document.body.appendChild(banner);
    return banner;
  };

  const initialise = () => {
    addSkipLink();
    const consent = readConsent();

    if (consent === 'analytics') {
      setAnalyticsDisabled(false);
      loadAnalytics();
      addConsentSettingsControl();
      return;
    }

    if (consent === 'necessary') {
      setAnalyticsDisabled(true);
      addConsentSettingsControl();
      return;
    }

    clearConsent();
    addConsentBanner();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})();
