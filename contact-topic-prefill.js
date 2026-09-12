(() => {
  const allowedTopics = new Set(['Fleet partnership', 'Host a station', 'Franchisee']);
  const select = document.querySelector('#contact-topic');

  if (!select) {
    return;
  }

  const topic = new URLSearchParams(window.location.search).get('topic');

  if (!allowedTopics.has(topic)) {
    return;
  }

  select.value = topic;
  select.dispatchEvent(new Event('change', { bubbles: true }));
})();
