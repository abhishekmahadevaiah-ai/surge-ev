// Public brand and support configuration supplied by SURGE.
// Do not add a registered address or unverified operating details here.
window.SURGE_SITE_CONFIG = Object.freeze({
  legalName: 'SURGE Energy Pvt. Ltd.',
  brand: 'SURGE',
  tagline: 'YOUR ELECTRIC PIT STOP',
  supportEmail: 'support@surgecharging.com',
  supportPhone: '+91 9110605621',
  supportPhoneHref: '+919110605621',
  siteUrl: 'https://www.surgecharging.com',
  powerOutput: '120 kW DC',
  connectors: 'Dual CCS2',
  location: 'Tumakuru, Karnataka',
});

(() => {
  const hydratePublicContact = () => {
    const config = window.SURGE_SITE_CONFIG;
    document.querySelectorAll('[data-surge-contact-email]').forEach((element) => {
      element.href = `mailto:${config.supportEmail}`;
      if (element.dataset.surgeContactEmailLabel !== 'false') {
        element.textContent = config.supportEmail;
      }
    });
    document.querySelectorAll('[data-surge-contact-phone]').forEach((element) => {
      element.href = `tel:${config.supportPhoneHref}`;
      if (element.dataset.surgeContactPhoneLabel !== 'false') {
        element.textContent = config.supportPhone;
      }
    });
    document.querySelectorAll('[data-surge-legal-name]').forEach((element) => {
      element.textContent = config.legalName;
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydratePublicContact, { once: true });
  } else {
    hydratePublicContact();
  }
})();
