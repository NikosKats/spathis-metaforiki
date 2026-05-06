import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CmsPageView } from '@/components/site/CmsPageView';
import { getPageBySlug, pickField } from '@/lib/cms';
import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: PageProps<'/[locale]/terms'>): Promise<Metadata> {
  const { locale } = await params;
  const row = await getPageBySlug('terms');
  const path = (loc: string) => `${loc === routing.defaultLocale ? '' : `/${loc}`}/terms`;
  return {
    title: row ? pickField<string>(row, 'title', locale as 'el' | 'en') ?? 'Terms' : 'Terms',
    description: row ? pickField<string>(row, 'meta_description', locale as 'el' | 'en') ?? undefined : undefined,
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
    },
  };
}

export default async function TermsPage({ params }: PageProps<'/[locale]/terms'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CmsPageView slug="terms" locale={locale as 'el' | 'en'} />;
}
