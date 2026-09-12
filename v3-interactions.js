(() => {
  const page = document.querySelector('.v3-page');

  if (!page) {
    return;
  }

  const stations = [
    {
      id: 'koramangala',
      name: 'Koramangala 4th Block',
      open: 2,
      total: 4,
      status: 'available',
      connector: 'CCS2',
      output: '180kW'
    },
    {
      id: 'indiranagar',
      name: 'Indiranagar',
      open: 0,
      total: 2,
      status: 'busy',
      connector: 'CCS2',
      output: '180kW'
    },
    {
      id: 'mysuru-highway',
      name: 'Mysuru Highway',
      open: 3,
      total: 6,
      status: 'available',
      connector: 'CCS2',
      output: '180kW'
    },
    {
      id: 'hosur-road',
      name: 'Hosur Road',
      open: 1,
      total: 4,
      status: 'busy',
      connector: 'CCS2',
      output: '180kW'
    },
    {
      id: 'whitefield',
      name: 'Whitefield',
      open: 4,
      total: 6,
      status: 'available',
      connector: 'CCS2',
      output: '180kW'
    }
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuToggle = document.querySelector('[data-v3-menu-toggle]');
  const navLinks = document.querySelector('#v3-nav-links');
  const searchForm = document.querySelector('#v3-route-search');
  const searchInput = document.querySelector('#v3-route-query');
  const locationButton = document.querySelector('[data-v3-use-location]');
  const statusElement = document.querySelector('#v3-route-status');
  const selectedResult = document.querySelector('#v3-selected-result');
  const selectedName = document.querySelector('#v3-selected-name');
  const selectedOpen = document.querySelector('#v3-selected-open');
  const selectedSpec = document.querySelector('#v3-selected-spec');
  const resultRows = [...document.querySelectorAll('[data-v3-result]')];
  const stationBoardItems = [...document.querySelectorAll('[data-v3-board-station]')];
  const reliabilitySection = document.querySelector('[data-v3-reliability]');
  const reliabilityTrace = document.querySelector('.v3-reliability-trace');
  const scopeWaveform = document.querySelector('.v3-scope-waveform');
  const scopeDot = document.querySelector('.v3-scope-dot');
  let selectedId = 'mysuru-highway';
  let motionModulePromise;

  const normalise = (value) => String(value || '').trim().toLowerCase();

  const getStation = (id) => stations.find((station) => station.id === id);

  const setStatus = (message, state = '') => {
    if (!statusElement) {
      return;
    }

    statusElement.textContent = message;
    statusElement.dataset.state = state;
  };

  const isWideNavigation = () => window.matchMedia('(min-width: 66rem)').matches;

  const setNavState = (open) => {
    if (!menuToggle || !navLinks) {
      return;
    }

    const wide = isWideNavigation();
    const nextOpen = wide ? false : open;
    menuToggle.setAttribute('aria-expanded', String(nextOpen));
    navLinks.classList.toggle('is-open', nextOpen);
    navLinks.hidden = wide ? false : !nextOpen;
    menuToggle.querySelector('[data-v3-menu-label]').textContent = nextOpen ? 'Close' : 'Menu';
    menuToggle.querySelector('i').className = nextOpen ? 'ti ti-x' : 'ti ti-menu-2';
  };

  if (menuToggle && navLinks) {
    setNavState(false);
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setNavState(!isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setNavState(false));
    });

    window.addEventListener('resize', () => setNavState(false), { passive: true });
  }

  const updateSelectionPanel = (station) => {
    if (!selectedResult || !selectedName || !selectedOpen || !selectedSpec) {
      return;
    }

    selectedResult.hidden = !station;

    if (!station) {
      return;
    }

    selectedName.textContent = station.name;
    selectedOpen.textContent = `${station.open}/${station.total} ${station.status}`;
    selectedOpen.dataset.status = station.status;
    selectedSpec.textContent = `${station.connector} / ${station.output}`;
  };

  const loadAnime = () => {
    if (!motionModulePromise) {
      motionModulePromise = import('https://esm.sh/animejs@4')
        .then((module) => module)
        .catch(() => null);
    }

    return motionModulePromise;
  };

  const animateTargets = async (targets) => {
    if (prefersReducedMotion || !targets.length) {
      targets.forEach((target) => {
        target.style.strokeDashoffset = '0';
      });
      return;
    }

    const module = await loadAnime();

    if (!module?.animate) {
      targets.forEach((target) => {
        target.style.strokeDashoffset = '0';
      });
      return;
    }

    module.animate(targets, {
      strokeDashoffset: [1, 0],
      duration: 760,
      delay: (_target, index) => index * 45,
      ease: 'outCubic'
    });
  };

  const animateScopeSignal = async () => {
    if (prefersReducedMotion || !scopeWaveform || !scopeDot) {
      return;
    }

    const module = await loadAnime();

    if (!module?.animate) {
      return;
    }

    module.animate(scopeWaveform, {
      strokeDashoffset: [0, -84],
      duration: 3200,
      ease: 'inOutSine',
      loop: true,
      alternate: true
    });
    module.animate(scopeDot, {
      r: [5, 8],
      opacity: [.72, 1],
      duration: 1600,
      ease: 'inOutSine',
      loop: true,
      alternate: true
    });
  };

  const setSelectedStation = (id, shouldFocus = false) => {
    const station = getStation(id);

    if (!station) {
      return;
    }

    selectedId = id;
    updateSelectionPanel(station);

    stationBoardItems.forEach((item) => {
      const isSelected = item.dataset.v3BoardStation === id;
      item.classList.toggle('is-selected', isSelected);
      item.setAttribute('aria-pressed', String(isSelected));
    });

    resultRows.forEach((row) => {
      const isSelected = row.dataset.v3Result === id;
      row.classList.toggle('is-selected', isSelected);
      row.setAttribute('aria-pressed', String(isSelected));
    });

    if (shouldFocus) {
      const result = resultRows.find((row) => row.dataset.v3Result === id);
      result?.focus({ preventScroll: false });
    }
  };

  const filterStations = (query) => {
    const needle = normalise(query);
    const matches = stations.filter((station) => {
      if (!needle) {
        return true;
      }

      return [station.id, station.name, station.status, station.connector]
        .some((value) => normalise(value).includes(needle));
    });

    resultRows.forEach((row) => {
      row.hidden = !matches.some((station) => station.id === row.dataset.v3Result);
    });

    if (!needle) {
      setSelectedStation(selectedId);
      setStatus('Showing 5 named stations. Select a station to view open bays.');
      return;
    }

    if (!matches.length) {
      updateSelectionPanel(null);
      setStatus('No matching station found for that search. Try a Karnataka location or use your current location.', 'error');
      return;
    }

    setSelectedStation(matches[0].id, true);
    setStatus(`Showing ${matches.length} matching station${matches.length === 1 ? '' : 's'} with named bay status.`, 'success');
  };

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      setStatus('Checking named stations…');
      window.setTimeout(() => filterStations(searchInput.value), prefersReducedMotion ? 0 : 120);
    });
  }

  locationButton?.addEventListener('click', () => {
    setStatus('Location unavailable in preview. Enter a named Karnataka route.', 'error');
    searchInput?.focus();
  });

  resultRows.forEach((row) => {
    row.addEventListener('click', () => setSelectedStation(row.dataset.v3Result));
  });

  stationBoardItems.forEach((item) => {
    item.addEventListener('click', () => setSelectedStation(item.dataset.v3BoardStation));
  });

  const revealReliabilityTrace = () => {
    if (!reliabilityTrace || reliabilityTrace.dataset.v3Animated === 'true') {
      return;
    }

    reliabilityTrace.dataset.v3Animated = 'true';
    animateTargets([reliabilityTrace]);
  };

  if (reliabilitySection && reliabilityTrace && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        revealReliabilityTrace();
        currentObserver.disconnect();
      }
    }, { threshold: .25 });
    observer.observe(reliabilitySection);
  } else {
    revealReliabilityTrace();
  }

  animateScopeSignal();
  setSelectedStation(selectedId);
})();
