(() => {
  const topicAliases = new Map([
    ['Fleet partnership', 'Fleet enquiry'],
    ['Host a station', 'Charging-site enquiry'],
    ['Franchisee', 'Other'],
    ['Fleet enquiry', 'Fleet enquiry'],
    ['Charging-site enquiry', 'Charging-site enquiry'],
    ['Charging support', 'Charging support'],
    ['Other', 'Other'],
  ]);
  const select = document.querySelector('#contact-topic');

  if (!select) {
    return;
  }

  const requestedTopic = new URLSearchParams(window.location.search).get('topic');
  const topic = topicAliases.get(requestedTopic);
  if (!topic) {
    return;
  }

  select.value = topic;
  select.dispatchEvent(new Event('change', { bubbles: true }));
})();
