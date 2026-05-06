'use client';

import { useEffect } from 'react';

// Registers /sw.js once on mount. Tiny client component (~150 bytes).
// Only runs in production — the dev server's HMR + service workers don't mix.

export function ServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* registration failures are non-fatal */
      });
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
  }, []);
  return null;
}
