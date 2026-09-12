import {
  animate,
  spring,
} from 'https://esm.sh/animejs@4';

(() => {
  const SOURCE_TICKER_SELECTOR = 'section[data-kid="1-2"]';
  const HERO_SELECTOR = 'section[data-kid="1-3-1"]';
  const VISUAL_SELECTOR = '[data-kid="1-3-1-2"]';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const FALLBACK_STATIONS = [
    { id: 'koramangala', name: 'Koramangala 4th Block', status: 'available', available: 2, bays: 4, lat: 12.9352, lng: 77.6245, x: 68, y: 42, pinScale: 1.05 },
    { id: 'indiranagar', name: 'Indiranagar', status: 'busy', available: 0, bays: 2, lat: 12.9784, lng: 77.6408, x: 76, y: 28, pinScale: .86 },
    { id: 'mysuru-highway', name: 'Mysuru Highway', status: 'available', available: 3, bays: 6, lat: 12.9141, lng: 77.4942, x: 46, y: 55, pinScale: 1.16 },
    { id: 'hosur-road', name: 'Hosur Road', status: 'busy', available: 1, bays: 4, lat: 12.8568, lng: 77.6593, x: 72, y: 66, pinScale: .98 },
    { id: 'whitefield', name: 'Whitefield', status: 'available', available: 4, bays: 6, lat: 12.9698, lng: 77.7500, x: 90, y: 27, pinScale: 1.16 },
  ];

  const state = {
    stations: [],
    selectedId: 'mysuru-highway',
    userLocation: null,
    hasLocation: false,
    camera: { x: -30, y: 14, zoom: 1.14 },
    cameraTimer: null,
    cameraAnimation: null,
    scene: null,
    model: null,
    idleRotation: null,
    cableAnimation: null,
    sceneFocused: false,
    sceneHovering: false,
    sceneFocusedByKeyboard: false,
    sceneSeen: false,
    mapStage: null,
    mapWorld: null,
    mapCard: null,
    mapStatus: null,
    sheet: null,
    sheetOpen: false,
    pointer: null,
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const formatAvailability = (station) => `${station.available}/${station.bays} ${station.status === 'available' ? 'Available' : 'Busy'}`;

  const formatDistance = (distance) => Number.isFinite(distance) ? `${distance.toFixed(1)} km away` : 'Distance unavailable';

  const haversineDistance = (from, to) => {
    const radius = 6371;
    const latitudeDelta = (to.lat - from.lat) * Math.PI / 180;
    const longitudeDelta = (to.lng - from.lng) * Math.PI / 180;
    const latitudeOne = from.lat * Math.PI / 180;
    const latitudeTwo = to.lat * Math.PI / 180;
    const a = Math.sin(latitudeDelta / 2) ** 2 + Math.sin(longitudeDelta / 2) ** 2 * Math.cos(latitudeOne) * Math.cos(latitudeTwo);
    return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const parseSourceStations = (ticker) => {
    const items = [...ticker.querySelectorAll('.surge-marquee-track > span')].slice(0, FALLBACK_STATIONS.length);
    if (items.length !== FALLBACK_STATIONS.length) {
      return FALLBACK_STATIONS;
    }

    return items.map((item, index) => {
      const parts = [...item.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .filter(Boolean);
      const name = parts[0] || FALLBACK_STATIONS[index].name;
      const availability = item.querySelector('b')?.textContent.trim() || '';
      const match = availability.match(/(\d+)\s*\/\s*(\d+)/);
      const status = /available/i.test(availability) ? 'available' : 'busy';

      return {
        ...FALLBACK_STATIONS[index],
        name,
        status,
        available: match ? Number(match[1]) : FALLBACK_STATIONS[index].available,
        bays: match ? Number(match[2]) : FALLBACK_STATIONS[index].bays,
      };
    });
  };

  const stationById = (id) => state.stations.find((station) => station.id === id) || state.stations[0];

  const chargerMarkup = () => `
    <div class="surge-v4-charger-scene" data-charger-state="available" data-charger-scene tabindex="0" role="img" aria-label="Industrial 180 kilowatt dual-bay DC fast charger with CCS2 connectors and live yellow status display">
      <svg class="surge-v4-scene-wave" viewBox="0 0 700 130" aria-hidden="true" preserveAspectRatio="none">
        <path d="M0 64 C48 64 56 22 102 22 S160 108 210 108 S268 35 322 35 S376 92 430 92 S490 44 540 44 S612 71 700 71" fill="none" stroke-width="2"></path>
        <path d="M0 67 C64 67 74 55 129 55 S190 77 248 77 S310 48 365 48 S430 69 490 69 S564 57 700 57" fill="none" stroke-width="1"></path>
      </svg>
      <div class="surge-v4-charger-stage">
        <div class="surge-v4-charger-model" data-charger-model>
          <div class="surge-v4-charger-arm surge-v4-charger-arm--left" data-charger-cable-arm>
            <div class="surge-v4-charger-cable" data-charger-cable>
              <span></span><span></span><span></span><span></span>
            </div>
            <div class="surge-v4-charger-connector" aria-hidden="true">
              <div class="surge-v4-connector-shell">
                <div class="surge-v4-connector-face">
                  <span class="surge-v4-connector-pin"></span><span class="surge-v4-connector-pin"></span>
                  <span class="surge-v4-connector-pin"></span><span class="surge-v4-connector-pin"></span>
                  <span class="surge-v4-connector-pin surge-v4-connector-pin--dc"></span><span class="surge-v4-connector-pin surge-v4-connector-pin--dc"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="surge-v4-charger-arm surge-v4-charger-arm--right" data-charger-cable-arm>
            <div class="surge-v4-charger-cable" data-charger-cable>
              <span></span><span></span><span></span><span></span>
            </div>
            <div class="surge-v4-charger-connector" aria-hidden="true">
              <div class="surge-v4-connector-shell">
                <div class="surge-v4-connector-face">
                  <span class="surge-v4-connector-pin"></span><span class="surge-v4-connector-pin"></span>
                  <span class="surge-v4-connector-pin"></span><span class="surge-v4-connector-pin"></span>
                  <span class="surge-v4-connector-pin surge-v4-connector-pin--dc"></span><span class="surge-v4-connector-pin surge-v4-connector-pin--dc"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="surge-v4-charger-unit">
            <span class="surge-v4-charger-top-strip" aria-hidden="true"></span>
            <div class="surge-v4-charger-face">
              <div class="surge-v4-charger-display">
                <span class="surge-v4-charger-display-readout">180kW · CCS2 · Grid Stable</span>
              </div>
              <div class="surge-v4-charger-face-status"><span>Dual bay / 01—02</span><strong data-charger-state-label>Available</strong></div>
              <div class="surge-v4-charger-vents" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
            </div>
          </div>
          <div class="surge-v4-charger-plinth" aria-hidden="true"></div>
        </div>
      </div>
      <div class="surge-v4-charger-caption"><span>180kW / dual-bay DC fast charger</span><strong data-charger-caption-state>CCS2 / grid stable</strong></div>
    </div>
  `;

  const mapMarkup = () => `
    <div class="surge-v4-map-layer" id="surge-v4-map" data-map-layer>
      <div class="surge-v4-map-stage" data-map-stage aria-label="Interactive SURGE Karnataka network map" role="application" tabindex="0">
        <div class="surge-v4-map-world" data-map-world>
          <svg class="surge-v4-map-svg" viewBox="0 0 1000 520" aria-hidden="true" preserveAspectRatio="none">
            <path class="surge-v4-map-boundary" d="M142 122L226 72L346 82L465 48L604 87L752 54L879 130L919 255L865 370L752 425L612 465L472 432L331 466L207 403L112 310Z"></path>
            <path class="surge-v4-map-road" d="M98 389C210 343 268 286 356 291S494 341 588 267S725 179 913 104"></path>
            <path class="surge-v4-map-road" d="M112 246C245 211 302 186 400 199S555 240 684 196S816 145 924 170"></path>
            <path class="surge-v4-map-road" d="M462 47C469 122 493 177 537 232S606 352 612 465"></path>
            <path class="surge-v4-map-route" d="M186 401C301 332 390 332 469 292S570 230 674 170S806 119 913 104"></path>
            <text class="surge-v4-map-label surge-v4-map-label--route" x="390" y="312">BENGALURU — TUMKUR — MYSURU</text>
            <text class="surge-v4-map-label" x="754" y="118">WHITEFIELD</text>
            <text class="surge-v4-map-label" x="731" y="245">INDIRANAGAR</text>
            <text class="surge-v4-map-label" x="658" y="404">HOSUR ROAD</text>
            <text class="surge-v4-map-label" x="384" y="376">MYSURU HIGHWAY</text>
          </svg>
          <div class="surge-v4-map-pins" data-map-pins></div>
        </div>
        <div class="surge-v4-map-scrim" aria-hidden="true"></div>
      </div>
      <div class="surge-v4-map-overlay" aria-hidden="true"><span>SURGE / Karnataka live network</span><strong>Tap a pin to see live status</strong></div>
      <div class="surge-v4-map-controls" aria-label="Map controls">
        <button class="surge-v4-map-control" data-map-zoom="out" type="button" aria-label="Zoom out">−</button>
        <button class="surge-v4-map-control" data-map-zoom="in" type="button" aria-label="Zoom in">+</button>
        <button class="surge-v4-map-control surge-v4-map-control--location" data-map-location type="button">Use my location</button>
        <button class="surge-v4-map-control surge-v4-map-control--location" data-map-reset type="button">Reset view</button>
      </div>
      <aside class="surge-v4-map-card" data-map-card aria-live="polite"></aside>
      <button class="surge-v4-map-cluster" data-map-cluster type="button"><span>5 stations nearby</span></button>
      <p class="surge-v4-map-status" data-map-status role="status" aria-live="polite"><strong>Map ready</strong> / station states are preview data</p>
      <section class="surge-v4-map-sheet" data-map-sheet data-open="false" aria-label="Nearby station list">
        <button class="surge-v4-map-sheet-handle" data-map-sheet-toggle type="button" aria-expanded="false"><span>Open station list</span></button>
        <div class="surge-v4-map-sheet__head"><span class="surge-v4-map-sheet__eyebrow">5 named stations</span><span class="surge-v4-map-sheet__eyebrow">CCS2 / 180kW</span></div>
        <div class="surge-v4-map-sheet-list" data-map-sheet-list></div>
      </section>
    </div>
  `;

  const pinMarkup = (station) => `<button class="surge-v4-map-pin" type="button" data-station-id="${station.id}" data-status="${station.status}" aria-pressed="false" aria-label="${station.name}, ${formatAvailability(station)}" style="--pin-x:${station.x};--pin-y:${station.y};--pin-scale:${station.pinScale}"></button>`;

  const cardMarkup = (station) => {
    const distance = state.hasLocation ? formatDistance(haversineDistance(state.userLocation, station)) : 'Use location for distance';
    const stateLabel = station.status === 'available' ? 'Available' : 'Busy';
    return `<div class="surge-v4-map-card__topline"><span class="surge-v4-map-card__eyebrow">Station / live bay status</span><span class="surge-v4-map-card__state">${stateLabel}</span></div><h2 class="surge-v4-map-card__title">${station.name}</h2><p class="surge-v4-map-card__meta">CCS2 / 180kW · ${distance}</p><p class="surge-v4-map-card__status"><strong>${formatAvailability(station)}</strong> / bay telemetry nominal</p>`;
  };

  const sheetItemMarkup = (station) => `<button class="surge-v4-map-sheet-item" type="button" data-station-id="${station.id}" data-status="${station.status}" aria-pressed="false"><span><strong>${station.name}</strong><small>${state.hasLocation ? formatDistance(haversineDistance(state.userLocation, station)) : 'Tap for details'}</small></span><span>${formatAvailability(station)}</span></button>`;

  const renderCamera = () => {
    if (!state.mapWorld) return;
    state.mapWorld.style.transform = `translate3d(${state.camera.x}px, ${state.camera.y}px, 0) scale(${state.camera.zoom})`;
  };

  const scheduleCameraReset = () => {
    window.clearTimeout(state.cameraTimer);
    state.cameraTimer = window.setTimeout(() => resetCamera(), 10000);
  };

  const animateCamera = (to, duration = 650) => {
    state.cameraAnimation?.cancel?.();
    if (prefersReducedMotion) {
      Object.assign(state.camera, to);
      renderCamera();
      return;
    }
    state.cameraAnimation = animate(state.camera, {
      ...to,
      duration,
      ease: 'out(4)',
      onUpdate: renderCamera,
    });
  };

  const resetCamera = () => {
    window.clearTimeout(state.cameraTimer);
    animateCamera({ x: 0, y: 0, zoom: 1 }, prefersReducedMotion ? 0 : 750);
    state.mapStatus.innerHTML = '<strong>Corridor view</strong> / auto-reset after 10s idle';
  };

  const updateStationSelection = (id, { openSheet = false } = {}) => {
    const station = stationById(id);
    if (!station) return;
    state.selectedId = station.id;
    state.mapCard.dataset.status = station.status;
    state.mapCard.innerHTML = cardMarkup(station);
    state.mapCard.hidden = false;
    state.scene?.setAttribute('data-charger-state', station.status);
    state.scene?.querySelector('[data-charger-state-label]')?.replaceChildren(document.createTextNode(station.status === 'available' ? 'Available' : 'Busy'));
    state.scene?.querySelector('[data-charger-caption-state]')?.replaceChildren(document.createTextNode(station.status === 'available' ? 'CCS2 / grid stable' : 'CCS2 / bay busy'));

    document.querySelectorAll('[data-station-id]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.stationId === station.id));
    });

    state.mapStatus.innerHTML = `<strong>${station.name}</strong> / ${formatAvailability(station)}`;
    if (openSheet) setSheetOpen(true);
  };

  const setSheetOpen = (open) => {
    state.sheetOpen = open;
    state.sheet.dataset.open = String(open);
    const toggle = state.sheet.querySelector('[data-map-sheet-toggle]');
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.querySelector('span')?.replaceChildren(document.createTextNode(open ? 'Close station list' : 'Open station list'));
  };

  const changeZoom = (delta) => {
    state.camera.zoom = clamp(state.camera.zoom + delta, .9, 1.55);
    renderCamera();
    scheduleCameraReset();
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      state.mapStatus.textContent = 'Location access unavailable / distance cannot be calculated';
      return;
    }
    state.mapStatus.textContent = 'Requesting location / distance stays on this device';
    navigator.geolocation.getCurrentPosition((position) => {
      state.userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
      state.hasLocation = true;
      state.mapStatus.innerHTML = '<strong>Location ready</strong> / distances calculated locally';
      updateStationSelection(state.selectedId);
      renderSheetItems();
    }, () => {
      state.mapStatus.textContent = 'Location permission denied / distance unavailable';
    }, { enableHighAccuracy: false, maximumAge: 300000, timeout: 8000 });
  };

  const renderSheetItems = () => {
    const list = state.sheet.querySelector('[data-map-sheet-list]');
    list.innerHTML = state.stations.map(sheetItemMarkup).join('');
    list.querySelectorAll('[data-station-id]').forEach((button) => {
      button.addEventListener('click', () => updateStationSelection(button.dataset.stationId, { openSheet: true }));
    });
  };

  const focusCharger = () => {
    if (!state.model || state.sceneFocused) return;
    state.sceneFocused = true;
    state.idleRotation?.pause?.();
    state.scene?.setAttribute('data-focus', 'true');
    if (prefersReducedMotion) return;
    animate(state.model, { rotateY: -16, translateZ: 58, scale: 1.06, duration: 650, ease: 'out(4)' });
    state.cableAnimation?.cancel?.();
    state.cableAnimation = animate('[data-charger-cable]', { rotateZ: [-2, 3], duration: 750, delay: 40, ease: spring({ bounce: .32, duration: 720 }) });
  };

  const releaseCharger = () => {
    if (!state.model || state.sceneHovering || state.sceneFocusedByKeyboard) return;
    state.sceneFocused = false;
    state.scene?.setAttribute('data-focus', 'false');
    if (prefersReducedMotion) return;
    animate(state.model, { rotateY: 0, translateZ: 0, scale: 1, duration: 620, ease: 'out(4)' });
    animate('[data-charger-cable]', { rotateZ: 0, duration: 520, ease: 'out(3)' });
    state.idleRotation?.restart?.();
  };

  const setupCharger = (visualColumn) => {
    visualColumn.innerHTML = chargerMarkup();
    state.scene = visualColumn.querySelector('[data-charger-scene]');
    state.model = visualColumn.querySelector('[data-charger-model]');
    state.scene.addEventListener('pointerenter', () => { state.sceneHovering = true; focusCharger(); });
    state.scene.addEventListener('pointerleave', () => { state.sceneHovering = false; releaseCharger(); });
    state.scene.addEventListener('focus', () => { state.sceneFocusedByKeyboard = true; focusCharger(); });
    state.scene.addEventListener('blur', () => { state.sceneFocusedByKeyboard = false; releaseCharger(); });

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting) {
        state.sceneSeen = true;
        return;
      }
      if (state.sceneSeen) focusCharger();
    }, { threshold: .55 });
    observer.observe(state.scene);

    if (!prefersReducedMotion) {
      state.idleRotation = animate(state.model, { rotateY: [-4, 4], duration: 8000, ease: 'inOutSine', loop: true, alternate: true });
    }
  };

  const promoteMapChrome = (mapLayer) => {
    const shell = mapLayer.closest('.surge-v4-hero-shell');
    if (!shell) return;
    ['.surge-v4-map-overlay', '.surge-v4-map-controls', '[data-map-card]', '[data-map-status]'].forEach((selector) => {
      const node = mapLayer.querySelector(selector);
      if (node) shell.appendChild(node);
    });
  };

  const setupMapInteractions = (mapLayer) => {
    state.mapStage = mapLayer.querySelector('[data-map-stage]');
    state.mapWorld = mapLayer.querySelector('[data-map-world]');
    state.mapCard = mapLayer.querySelector('[data-map-card]');
    state.mapStatus = mapLayer.querySelector('[data-map-status]');
    state.sheet = mapLayer.querySelector('[data-map-sheet]');
    state.mapLayer = mapLayer;
    state.mapWorld.querySelector('[data-map-pins]').innerHTML = state.stations.map(pinMarkup).join('');
    renderSheetItems();

    mapLayer.querySelectorAll('[data-station-id]').forEach((button) => {
      button.addEventListener('mouseenter', () => updateStationSelection(button.dataset.stationId));
      button.addEventListener('focus', () => updateStationSelection(button.dataset.stationId));
      button.addEventListener('click', () => updateStationSelection(button.dataset.stationId, { openSheet: button.closest('[data-map-sheet]') !== null }));
    });

    mapLayer.querySelector('[data-map-zoom="in"]').addEventListener('click', () => changeZoom(.12));
    mapLayer.querySelector('[data-map-zoom="out"]').addEventListener('click', () => changeZoom(-.12));
    mapLayer.querySelector('[data-map-reset]').addEventListener('click', resetCamera);
    mapLayer.querySelector('[data-map-location]').addEventListener('click', requestLocation);
    mapLayer.querySelector('[data-map-cluster]').addEventListener('click', () => setSheetOpen(true));
    mapLayer.querySelector('[data-map-sheet-toggle]').addEventListener('click', () => setSheetOpen(!state.sheetOpen));

    state.mapStage.addEventListener('wheel', (event) => {
      event.preventDefault();
      changeZoom(event.deltaY > 0 ? -.06 : .06);
    }, { passive: false });

    state.mapStage.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button, a')) return;
      state.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, cameraX: state.camera.x, cameraY: state.camera.y };
      state.mapStage.setPointerCapture(event.pointerId);
    });

    state.mapStage.addEventListener('pointermove', (event) => {
      if (!state.pointer || state.pointer.id !== event.pointerId) return;
      state.camera.x = state.pointer.cameraX + event.clientX - state.pointer.x;
      state.camera.y = state.pointer.cameraY + event.clientY - state.pointer.y;
      renderCamera();
      scheduleCameraReset();
    });

    const releasePointer = (event) => {
      if (state.pointer?.id === event.pointerId) state.pointer = null;
    };
    state.mapStage.addEventListener('pointerup', releasePointer);
    state.mapStage.addEventListener('pointercancel', releasePointer);

    promoteMapChrome(mapLayer);
    updateStationSelection(state.selectedId);
    renderCamera();
    if (!prefersReducedMotion) {
      animateCamera({ x: 0, y: 0, zoom: 1 }, 2200);
    } else {
      state.camera = { x: 0, y: 0, zoom: 1 };
      renderCamera();
    }
  };

  const init = () => {
    if (document.documentElement.dataset.surgeV4 === 'ready') return;
    const ticker = document.querySelector(SOURCE_TICKER_SELECTOR);
    const hero = document.querySelector(HERO_SELECTOR);
    const visualColumn = hero?.querySelector(VISUAL_SELECTOR);
    if (!ticker || !hero || !visualColumn) return;

    state.stations = parseSourceStations(ticker);
    const shell = document.createElement('div');
    shell.className = 'surge-v4-hero-shell';
    shell.id = 'surge-v4-hero';
    shell.innerHTML = mapMarkup();
    hero.parentNode.insertBefore(shell, hero);
    shell.appendChild(hero);

    const mapLayer = shell.querySelector('[data-map-layer]');
    setupMapInteractions(mapLayer);
    setupCharger(visualColumn);

    hero.querySelector('[data-kid="1-3-1-1-5-1"]')?.replaceChildren(document.createTextNode('Tap a pin / live status'));
    hero.querySelector('[data-kid="1-3-1-1-5-3"]')?.replaceChildren(document.createTextNode('Karnataka corridor / 5 stations'));
    hero.querySelectorAll('a[href="#network"]').forEach((link) => link.setAttribute('href', '#surge-v4-map'));
    ticker.remove();
    document.documentElement.dataset.surgeV4 = 'ready';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
