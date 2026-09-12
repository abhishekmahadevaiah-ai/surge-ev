(() => {
  const formSelector = '[data-surge-google-form]';
  const formConfig = window.SURGE_GOOGLE_FORM || {};
  const entries = formConfig.entries || {};

  const isConfigured = () => {
    const action = String(formConfig.action || '').trim();
    const entryValues = ['name', 'email', 'topic', 'message']
      .map((key) => String(entries[key] || '').trim());

    if (!/^https:\/\/docs\.google\.com\/forms\/.+\/formResponse$/.test(action)) {
      return false;
    }

    return entryValues.every((entry) => /^entry\.\d+$/.test(entry));
  };

  const setStatus = (statusElement, message, state) => {
    if (!statusElement) {
      return;
    }

    statusElement.textContent = message;
    statusElement.dataset.state = state;
  };

  const readValues = (form) => {
    const data = new FormData(form);
    return {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      topic: String(data.get('topic') || '').trim(),
      message: String(data.get('message') || '').trim(),
      website: String(data.get('website') || '').trim()
    };
  };

  const submitToGoogleForm = async (values) => {
    const body = new URLSearchParams();
    body.set(entries.name, values.name);
    body.set(entries.email, values.email);
    body.set(entries.topic, values.topic);
    body.set(entries.message, values.message);

    await fetch(String(formConfig.action).trim(), {
      method: 'POST',
      mode: 'no-cors',
      body
    });
  };

  const initialiseForm = (form) => {
    const statusElement = form.querySelector('[data-surge-form-status]');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setStatus(statusElement, '', '');

      if (!form.reportValidity()) {
        setStatus(statusElement, 'Please complete the required fields.', 'error');
        return;
      }

      const values = readValues(form);
      if (values.website) {
        setStatus(statusElement, 'Message could not be sent.', 'error');
        return;
      }

      if (!isConfigured()) {
        setStatus(statusElement, 'Google Form is not connected yet. Add the public Form action and entry IDs before sending.', 'error');
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalLabel = submitButton.textContent;
        submitButton.textContent = 'Sending enquiry…';
      }

      try {
        setStatus(statusElement, 'Sending enquiry…', 'sending');
        await submitToGoogleForm(values);
        form.reset();
        setStatus(statusElement, 'Enquiry sent. SURGE will reply to the email provided.', 'success');
      } catch {
        setStatus(statusElement, 'Google Form could not be reached. Please try again.', 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalLabel || 'Send enquiry';
        }
      }
    });
  };

  const initialise = () => {
    document.querySelectorAll(formSelector).forEach(initialiseForm);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})();
