import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ΣΠΑΘΗΣ — Μεταφορική Κεφαλονιάς',
    short_name: 'ΣΠΑΘΗΣ',
    description:
      'Μεταφορική εταιρεία στη Σκάλα Κεφαλονιάς. Συμπαγή φορτία, containers, τρακτορεύσεις από και προς την Κεφαλονιά.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#190602',
    theme_color: '#c8102e',
    lang: 'el',
    icons: [
      // SVG covers all sizes on Chromium and Firefox. iOS still uses
      // apple-touch-icon (set in <link> tag) as PNG fallback.
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'any' },
      { src: '/icon-mask.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'maskable' },
    ],
    categories: ['business', 'logistics', 'travel'],
    shortcuts: [
      {
        name: 'Ζητήστε προσφορά',
        short_name: 'Quote',
        url: '/quote',
        description: 'Ζητήστε προσφορά για μεταφορά',
      },
      {
        name: 'Επικοινωνία',
        short_name: 'Contact',
        url: '/#contact',
      },
    ],
  };
}
