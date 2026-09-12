(() => {
  const frame = document.querySelector('[data-racing-video]');

  if (!frame) {
    return;
  }

  const iframe = frame.querySelector('iframe');
  const fallback = frame.querySelector('[data-racing-fallback]');
  let hasLoaded = false;

  const showState = (state) => {
    frame.dataset.state = state;
    if (state === 'error' && fallback) {
      fallback.hidden = false;
    }
  };

  iframe?.addEventListener('load', () => {
    hasLoaded = true;
    showState('loaded');
  }, { once: true });

  iframe?.addEventListener('error', () => showState('error'), { once: true });

  window.setTimeout(() => {
    if (!hasLoaded) {
      showState('error');
    }
  }, 10000);
})();
