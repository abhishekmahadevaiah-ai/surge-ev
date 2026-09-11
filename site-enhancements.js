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

  const addConsentBanner = () => {
    if (readConsent() || document.querySelector('.surge-cookie-banner')) {
      return;
    }

    const banner = document.createElement('aside');
    banner.className = 'surge-cookie-banner';
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.innerHTML = `
      <div>
        <p class="surge-cookie-title">Site preferences</p>
        <p class="surge-cookie-copy">SURGE uses essential storage for your preference. Optional analytics only loads after you choose it. <a href="privacy.html">Read the privacy notice</a>.</p>
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
        loadAnalytics();
      }
    });

    document.body.appendChild(banner);
  };

  const initialise = () => {
    addSkipLink();
    if (readConsent() === 'analytics') {
      loadAnalytics();
    } else {
      addConsentBanner();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})();
