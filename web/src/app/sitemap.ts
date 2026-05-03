import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://spathismetaforiki.gr';

const PATHS = ['', '/quote'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => {
      const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
      const url = `${SITE}${prefix}${path}`;
      return {
        url,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: path === '' ? 1.0 : 0.8,
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
