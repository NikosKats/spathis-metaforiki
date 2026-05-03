import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SERVICES } from '@/lib/services-config';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://spathismetaforiki.gr';

const STATIC_PATHS = [
  { path: '', priority: 1.0, freq: 'weekly' as const },
  { path: '/services', priority: 0.9, freq: 'monthly' as const },
  { path: '/about', priority: 0.7, freq: 'monthly' as const },
  { path: '/quote', priority: 0.9, freq: 'monthly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const allPaths: { path: string; priority: number; freq: 'weekly' | 'monthly' }[] = [
    ...STATIC_PATHS,
    ...SERVICES.map((s) => ({
      path: `/services/${s.slug}`,
      priority: 0.8,
      freq: 'monthly' as const,
    })),
  ];

  return allPaths.flatMap(({ path, priority, freq }) =>
    routing.locales.map((locale) => {
      const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
      return {
        url: `${SITE}${prefix}${path}`,
        lastModified: now,
        changeFrequency: freq,
        priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              `${SITE}${l === routing.defaultLocale ? '' : `/${l}`}${path}`,
            ]),
          ),
        },
      };
    }),
  );
}
