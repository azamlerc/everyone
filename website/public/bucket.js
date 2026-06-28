// bucket.js — fetches the bucket list from the API, renders the map and list

let allItems    = [];
let nearItems   = null;   // null = not in near mode; array = near mode results
let searchItems = null;   // null = not in search mode; array = search results
let showBeen    = true;
let showTodo    = true;
let map, beenLayer, todoLayer, nearLayer;
let searchTimer = null;

// ── fetch & boot ───────────────────────────────────────────────────────────────

async function load() {
  const res = await fetch('/api/bucket');
  allItems = await res.json();
  initMap();
  render();
  setupToggles();
  setupSearch();
}

// ── map ────────────────────────────────────────────────────────────────────────

function initMap() {
  const lightTiles = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
  );
  const darkTiles = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { subdomains: 'abcd', maxZoom: 19, attribution: '&copy; OpenStreetMap contributors &copy; CartoDB' }
  );

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  map = L.map('map', { center: [23, 20], zoom: 2, scrollWheelZoom: false, layers: [prefersDark ? darkTiles : lightTiles] });
  map.once('mousedown touchstart', () => map.scrollWheelZoom.enable());

  function makeCluster(cls) {
    return L.markerClusterGroup({
      maxClusterRadius: 60,
      disableClusteringAtZoom: 8,
      iconCreateFunction: cluster => L.divIcon({
        html: `<div><span>${cluster.getChildCount()}</span></div>`,
        className: `marker-cluster marker-cluster-${cls}`,
        iconSize: L.point(40, 40)
      })
    });
  }

  beenLayer = makeCluster('been');
  todoLayer = makeCluster('todo');
  nearLayer = makeCluster('near');

  populateMapLayers(allItems);
  beenLayer.addTo(map);
  todoLayer.addTo(map);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    map.removeLayer(e.matches ? lightTiles : darkTiles);
    map.addLayer(e.matches ? darkTiles : lightTiles);
  });
}

function activeItems() {
  if (nearItems   !== null) return nearItems;
  if (searchItems !== null) return searchItems;
  return allItems;
}

function populateMapLayers(items) {
  beenLayer.clearLayers();
  todoLayer.clearLayers();
  nearLayer.clearLayers();

  const inSpecialMode = nearItems !== null || searchItems !== null;
  items.forEach(item => {
    const marker = makeMarker(item);
    if (!marker) return;
    marker.addTo(inSpecialMode ? nearLayer : (item.been ? beenLayer : todoLayer));
  });
}

function makeMarker(item) {
  const loc = item.location;
  if (!loc?.coordinates) return null;
  const [lon, lat] = loc.coordinates;
  if (!isFinite(lat) || !isFinite(lon)) return null;

  const inSpecialMode = nearItems !== null || searchItems !== null;
  const tag   = inSpecialMode ? 'markerNear' : (item.been ? 'markerBeen' : 'markerTodo');
  const emoji = (item.flag || '').split(' ')[0];
  const stars = '★'.repeat(item.challenge || 0);
  const extra = item.distanceKm != null
    ? `<br><small style="opacity:0.6">${item.distanceKm} km away</small>`
    : '';
  const popup = `<a href="${item.link}" target="_blank">${item.flag || ''} ${item.name}</a>
    <br><small style="opacity:0.6">${stars}</small>${extra}`;

  return L.marker([lat, lon], {
    icon: L.divIcon({
      className: `emoji-pin ${tag}`,
      html: `<div class="pin-emoji">${emoji}</div>`,
      iconSize:    [25, 41],
      iconAnchor:  [12, 41],
      popupAnchor: [0, -30]
    })
  }).bindPopup(popup);
}

function refreshMap() {
  if (!map) return;
  const inSpecialMode = nearItems !== null || searchItems !== null;
  if (inSpecialMode) {
    map.removeLayer(beenLayer);
    map.removeLayer(todoLayer);
    map.addLayer(nearLayer);
  } else {
    map.removeLayer(nearLayer);
    if (showBeen) map.addLayer(beenLayer); else map.removeLayer(beenLayer);
    if (showTodo) map.addLayer(todoLayer); else map.removeLayer(todoLayer);
  }
}

function zoomToItems(items) {
  const points = items
    .filter(i => i.location?.coordinates)
    .map(i => [i.location.coordinates[1], i.location.coordinates[0]]);
  if (points.length > 0) map.fitBounds(points, { padding: [40, 40] });
}

// ── list ───────────────────────────────────────────────────────────────────────

function render() {
  const container = document.getElementById('items');
  const source    = activeItems();
  const visible   = source.filter(item => item.been ? showBeen : showTodo);

  container.innerHTML = visible.map(item => {
    const cls   = item.been ? '' : 'todo';
    const stars = '★'.repeat(item.challenge || 0);
    const meta  = item.distanceKm != null
      ? `<span class="challenge">${item.distanceKm} km</span>`
      : `<span class="challenge">${stars}</span>`;
    return `<div class="${cls}">
      ${item.flag || ''} <a href="${item.link}" target="_blank">${item.name}</a>
      ${meta}
    </div>`;
  }).join('');
}

// ── near me ────────────────────────────────────────────────────────────────────

async function loadNearby(lat, lon) {
  const res = await fetch(`/api/nearby?lat=${lat}&lon=${lon}&km=500`);
  nearItems = await res.json();
  populateMapLayers(nearItems);
  zoomToItems(nearItems);
  refreshMap();
  render();
}

// ── search ─────────────────────────────────────────────────────────────────────

async function doSearch(query) {
  if (!query) {
    searchItems = null;
    populateMapLayers(allItems);
    map.setView([23, 20], 2);
    refreshMap();
    render();
    return;
  }

  const res   = await fetch('/api/search', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ query })
  });
  searchItems = await res.json();
  populateMapLayers(searchItems);
  zoomToItems(searchItems);
  refreshMap();
  render();
}

function setupSearch() {
  const input = document.getElementById('search');
  input.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => doSearch(input.value.trim()), 500);
  });
}

// ── toggles ────────────────────────────────────────────────────────────────────

function setupToggles() {
  const beenBtn = document.getElementById('toggle-been');
  const todoBtn = document.getElementById('toggle-todo');
  const nearBtn = document.getElementById('toggle-near');

  function update() {
    beenBtn.classList.toggle('on', showBeen);
    todoBtn.classList.toggle('on', showTodo);
    refreshMap();
    render();
  }

  beenBtn.addEventListener('click', () => { showBeen = !showBeen; update(); });
  todoBtn.addEventListener('click', () => { showTodo = !showTodo; update(); });

  nearBtn.addEventListener('click', () => {
    if (nearItems !== null) {
      nearItems = null;
      nearBtn.classList.remove('on');
      populateMapLayers(allItems);
      map.setView([23, 20], 2);
      refreshMap();
      render();
      return;
    }

    nearBtn.textContent = '📍 Locating…';
    navigator.geolocation.getCurrentPosition(
      pos => {
        nearBtn.textContent = '📍 Near me';
        nearBtn.classList.add('on');
        loadNearby(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        nearBtn.textContent = '📍 Near me';
        alert('Could not get your location.');
      }
    );
  });
}

load();
