// ΣΠΑΘΗΣ — minimal service worker.
// Cache-first for static assets so the site loads instantly on repeat
// visits and works (degraded) offline. HTML pages stay network-first so
// the user always sees the freshest content.

const STATIC_CACHE = 'spathis-static-v1';
const HTML_CACHE = 'spathis-html-v1';
const STATIC_ASSETS = ['/icon.svg', '/icon-mask.svg', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== HTML_CACHE)
            .map((k) => caches.delete(k)),
        ),
      ),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Never intercept API routes, admin, server actions
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

  // Static assets: cache-first
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icon') ||
    url.pathname === '/manifest.webmanifest' ||
    url.pathname === '/sitemap.xml' ||
    url.pathname === '/robots.txt'
  ) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(STATIC_CACHE).then((c) => c.put(req, clone));
            }
            return res;
          }),
      ),
    );
    return;
  }

  // HTML pages: network-first, fall back to cache when offline
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(HTML_CACHE).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('/'))),
    );
  }
});
