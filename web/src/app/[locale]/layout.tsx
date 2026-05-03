import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Meta' });

  // localePrefix: 'as-needed' → default locale ('el') has no /el prefix
  const path = (loc: string) => (loc === routing.defaultLocale ? '/' : `/${loc}`);

  return {
    title: { default: t('siteName'), template: `%s | ${t('siteName')}` },
    description: t('tagline'),
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
    },
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      title: t('siteName'),
      description: t('tagline'),
      locale: locale === 'el' ? 'el_GR' : 'en_US',
      url: path(locale),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>;
}
