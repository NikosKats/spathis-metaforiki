import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/site/AnnouncementBar';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { QuoteForm } from '@/components/site/QuoteForm';

export async function generateMetadata({ params }: PageProps<'/[locale]/quote'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Quote' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: locale === 'el' ? '/quote' : `/${locale}/quote` },
  };
}

export default async function QuotePage({ params }: PageProps<'/[locale]/quote'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Quote');

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1 bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              {t('eyebrow')}
            </div>
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          <div className="mt-12">
            <QuoteForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
