(() => {
  const mapContainer = document.querySelector('[data-map-container]');
  const loadMapButton = mapContainer?.querySelector('[data-load-map]');

  const createGoogleMapFrame = () => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://maps.google.com/maps?hl=en&z=15&q=13.312764%2C77.115488&output=embed';
    iframe.title = 'Google Maps view of the confirmed SURGE charging destination in Tumakuru, Karnataka';
    iframe.width = '100%';
    iframe.height = '420';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    return iframe;
  };

  const loadMap = () => {
    if (!mapContainer || !loadMapButton) return;

    const iframe = createGoogleMapFrame();
    mapContainer.classList.remove('map-placeholder');
    mapContainer.replaceChildren(iframe);
    iframe.focus({ preventScroll: true });
  };

  loadMapButton?.addEventListener('click', loadMap, { once: true });
})();
