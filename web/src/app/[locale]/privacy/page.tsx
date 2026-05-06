import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CmsPageView } from '@/components/site/CmsPageView';
import { getPageBySlug, pickField } from '@/lib/cms';
import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: PageProps<'/[locale]/privacy'>): Promise<Metadata> {
  const { locale } = await params;
  const row = await getPageBySlug('privacy');
  const path = (loc: string) => `${loc === routing.defaultLocale ? '' : `/${loc}`}/privacy`;
  return {
    title: row ? pickField<string>(row, 'title', locale as 'el' | 'en') ?? 'Privacy' : 'Privacy',
    description: row ? pickField<string>(row, 'meta_description', locale as 'el' | 'en') ?? undefined : undefined,
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
    },
  };
}

export default async function PrivacyPage({ params }: PageProps<'/[locale]/privacy'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CmsPageView slug="privacy" locale={locale as 'el' | 'en'} />;
}
