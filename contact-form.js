(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const status = document.querySelector('#contact-status');
  const fallback = document.querySelector('#contact-fallback');
  const supportEmail = window.SURGE_SITE_CONFIG?.supportEmail || 'support@surgecharging.com';

  const clearResolvedError = () => {
    if (status.dataset.state === 'error' && form.checkValidity()) {
      status.textContent = '';
      status.dataset.state = '';
    }
  };
  form.addEventListener('input', clearResolvedError);
  form.addEventListener('change', clearResolvedError);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    status.dataset.state = '';
    fallback.hidden = true;

    if (!form.reportValidity()) {
      status.textContent = 'Check the highlighted fields and complete the required privacy acknowledgement.';
      status.dataset.state = 'error';
      form.querySelector(':invalid')?.focus();
      return;
    }

    const data = new FormData(form);
    if (String(data.get('website') || '').trim()) {
      status.textContent = 'This message could not be prepared. Please contact SURGE support directly.';
      status.dataset.state = 'error';
      return;
    }

    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const topic = String(data.get('topic') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = encodeURIComponent(`SURGE website enquiry: ${topic}`);
    const body = encodeURIComponent(`Name: ${name}\nReply email: ${email}\nEnquiry type: ${topic}\n\nMessage:\n${message}`);
    const mailto = `mailto:${supportEmail}?subject=${subject}&body=${body}`;

    fallback.querySelector('[data-surge-contact-email]')?.setAttribute('href', mailto);
    fallback.hidden = false;
    status.textContent = 'Your email application should open with a draft. Review it and choose Send there; this website cannot confirm delivery.';
    status.dataset.state = 'success';
    window.location.href = mailto;
  });
})();
