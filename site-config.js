// Shared public site configuration.
// Keep public contact details in one place so page copy and links stay aligned.
window.SURGE_SITE_CONFIG = Object.freeze({
  contactEmail: 'abhishek@surgecharging.com',
});

(() => {
  const hydrateContactEmail = () => {
    const email = window.SURGE_SITE_CONFIG.contactEmail;
    document.querySelectorAll('[data-surge-contact-email]').forEach((element) => {
      element.href = `mailto:${email}`;
      if (element.dataset.surgeContactEmailLabel !== 'false') {
        element.textContent = email;
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateContactEmail, { once: true });
  } else {
    hydrateContactEmail();
  }
})();
