/* ============================================================
   RUTA VERDE — USO SIN INTERNET (service worker)
   La primera vez que alguien abre la página publicada, se guardan en su teléfono los archivos
   de la guía. Las fotos y el mapa se guardan a medida que se ven. Así, en el Cocora o en Pijao,
   sin señal, la guía y su tour siguen abriendo.
   Cuando cambies algún archivo de la página, sube el número de VERSION para que se actualice.
   ============================================================ */
const VERSION = 'rv-6';
const CORE = [
  './', 'index.html', 'styles.css?v=5', 'manifest.webmanifest',
  'data.js?v=5', 'data2.js?v=5', 'geo.js?v=5', 'routes.js?v=5', 'i18n.js?v=5', 'en.js?v=5', 'en2.js?v=5',
  'core.js?v=5', 'maps.js?v=5', 'ui.js?v=5', 'pdf.js?v=5',
  'img/heroCocora-l.webp', 'img/icon-192.png'
];
const LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];
/* fotos pequeñas de todas las tarjetas: unos 2 MB, se guardan para verlas sin señal */
const THUMBS = ['img/aborrajado-s.webp', 'img/aguapanela-s.webp', 'img/ajiaco-s.webp', 'img/almuerzo1-s.webp', 'img/almuerzo2-s.webp', 'img/almuerzo3-s.webp', 'img/arepa-s.webp', 'img/armenia-s.webp', 'img/bahareque-s.webp', 'img/bandeja-s.webp', 'img/buenavista-s.webp', 'img/buenavista2-s.webp', 'img/cafeGranos-s.webp', 'img/cafeLeche-s.webp', 'img/cafetal-s.webp', 'img/cafetal2-s.webp', 'img/calarca-s.webp', 'img/calarca2-s.webp', 'img/calarcaVista-s.webp', 'img/calentado-s.webp', 'img/casaTipica-s.webp', 'img/chorizo-s.webp', 'img/chuleta-s.webp', 'img/circasia-s.webp', 'img/cocora-s.webp', 'img/cocora2-s.webp', 'img/cocora3-s.webp', 'img/cocora4-s.webp', 'img/cocora5-s.webp', 'img/cocora6-s.webp', 'img/cocora7-s.webp', 'img/comida1-s.webp', 'img/comida2-s.webp', 'img/cordoba-s.webp', 'img/croquetas-s.webp', 'img/empanada-s.webp', 'img/filandia-s.webp', 'img/filandia2-s.webp', 'img/filandia3-s.webp', 'img/filandia4-s.webp', 'img/filandia5-s.webp', 'img/filandia6-s.webp', 'img/filandia7-s.webp', 'img/filandia8-s.webp', 'img/filandia9-s.webp', 'img/genova-s.webp', 'img/hamburguesa-s.webp', 'img/heroCocora-s.webp', 'img/jardin-s.webp', 'img/jardin2-s.webp', 'img/mariposario-s.webp', 'img/montenegro-s.webp', 'img/museo-s.webp', 'img/palma-s.webp', 'img/palmsSign-s.webp', 'img/parque-s.webp', 'img/parque2-s.webp', 'img/parque3-s.webp', 'img/pijao-s.webp', 'img/pijao2-s.webp', 'img/pijao3-s.webp', 'img/quimbaya-s.webp', 'img/quindio-s.webp', 'img/salento-s.webp', 'img/salento2-s.webp', 'img/salento3-s.webp', 'img/salento4-s.webp', 'img/salento5-s.webp', 'img/sancocho-s.webp', 'img/tebaida-s.webp', 'img/tebaida2-s.webp', 'img/trucha-s.webp'];
const MAX_TILES = 400; /* pedazos de mapa guardados como máximo */

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(async c => {
    await c.addAll(CORE);
    await Promise.all(LIBS.map(u => c.add(new Request(u, {mode:'cors'})).catch(() => {})));
    await c.addAll(THUMBS).catch(() => {});
  }).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== 'rv-tiles').map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function trimTiles(){
  const c = await caches.open('rv-tiles'), keys = await c.keys();
  for (let i = 0; i < keys.length - MAX_TILES; i++) await c.delete(keys[i]);
}

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  /* clima en vivo: siempre de internet (si no hay, la página usa el clima típico) */
  if (url.hostname.includes('open-meteo')) return;

  /* pedazos del mapa satelital: los ya vistos sirven sin internet */
  if (url.hostname === 'server.arcgisonline.com'){
    e.respondWith(caches.open('rv-tiles').then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      const res = await fetch(req); if (res.ok || res.type === 'opaque'){ c.put(req, res.clone()); trimTiles(); } return res;
    }));
    return;
  }

  /* la página: primero internet (para tener lo más nuevo); sin señal, la copia guardada */
  if (req.mode === 'navigate'){
    e.respondWith(fetch(req).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put('index.html', cp)); return res; })
      .catch(() => caches.match('index.html')));
    return;
  }

  /* archivos, fotos, letras y librerías: la copia guardada y, si no está, de internet (y se guarda) */
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok && (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(url.hostname))){
      const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp));
    }
    return res;
  })));
});
