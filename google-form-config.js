// Public Google Form configuration for the v1 contact form.
// Leave action and entry IDs empty until the public Form and linked Sheet are ready.
// Never put Google API keys, OAuth tokens, or private Sheet credentials in this file.
window.SURGE_GOOGLE_FORM = {
  action: '',
  entries: {
    name: '',
    email: '',
    topic: '',
    message: ''
  },
  ownerEmail: window.SURGE_SITE_CONFIG?.contactEmail || ''
};
