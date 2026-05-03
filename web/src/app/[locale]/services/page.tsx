import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { AnnouncementBar } from '@/components/site/AnnouncementBar';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { QuoteCTA } from '@/components/site/QuoteCTA';
import { SERVICES } from '@/lib/services-config';

export async function generateMetadata({ params }: PageProps<'/[locale]/services'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ServicesIndex' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: locale === 'el' ? '/services' : `/${locale}/services` },
  };
}

export default async function ServicesIndex({ params }: PageProps<'/[locale]/services'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tIndex = await getTranslations('ServicesIndex');
  const tCard = await getTranslations('Services');
  const tDetail = await getTranslations('ServiceDetail');

  const localePrefix = locale === 'el' ? '' : `/${locale}`;

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-surface py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                {tIndex('eyebrow')}
              </div>
              <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                {tIndex('title')}
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {tIndex('subtitle')}
              </p>
            </div>
            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {SERVICES.map(({ slug, msgKey, icon: Icon }) => (
                <Link
                  key={slug}
                  href={`${localePrefix}/services/${slug}`}
                  className="group flex flex-col rounded-3xl border border-border bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-ink/30 hover:shadow-[0_24px_48px_-24px_rgba(25,6,2,0.18)] sm:p-10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-[var(--brand)] transition group-hover:bg-[var(--brand)] group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h2 className="mt-8 text-2xl font-bold tracking-tight text-ink">
                    {tCard(`${msgKey}Title`)}
                  </h2>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">
                    {tDetail(`${msgKey}Subtitle`)}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    {tCard('learnMore')}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <QuoteCTA />
      </main>
      <SiteFooter />
    </>
  );
}
