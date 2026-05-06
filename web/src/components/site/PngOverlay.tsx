/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';

// Loads a PNG and renders it absolutely-positioned over a sibling fallback.
// Probes the file via `new Image()` so the result is reliable even when the
// request completed before React hydration (which makes <img onLoad> miss).
// If the file 404s or has no image data, this component returns null and
// the fallback shows through.

export function PngOverlay({ src, className }: { src: string; className?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const probe = new Image();
    probe.src = src;
    probe.onload = () => setShow(probe.naturalWidth > 0);
    probe.onerror = () => setShow(false);
  }, [src]);

  if (!show) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={className ?? 'absolute inset-0 h-full w-full object-contain'}
    />
  );
}
