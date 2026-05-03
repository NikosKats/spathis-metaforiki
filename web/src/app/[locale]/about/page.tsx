import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Compass, Eye, MapPinned, Shield } from 'lucide-react';
import { AnnouncementBar } from '@/components/site/AnnouncementBar';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { QuoteCTA } from '@/components/site/QuoteCTA';
import { Stats } from '@/components/site/Stats';
import { routing } from '@/i18n/routing';

const valueIcons = [Compass, Eye, MapPinned, Shield];

export async function generateMetadata({ params }: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  const path = (loc: string) => `${loc === routing.defaultLocale ? '' : `/${loc}`}/about`;
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
    },
  };
}

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');
  const values = t.raw('values') as Array<{ title: string; desc: string }>;

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-surface py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              {t('eyebrow')}
            </div>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t('storyTitle')}
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink/85">
              <p>{t('storyP1')}</p>
              <p>{t('storyP2')}</p>
            </div>
          </div>
        </section>

        <section className="bg-surface py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t('valuesTitle')}
            </h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {values.map((value, i) => {
                const Icon = valueIcons[i] ?? Shield;
                return (
                  <div
                    key={value.title}
                    className="flex gap-5 rounded-3xl border border-border bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-ink text-[var(--brand)]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-ink">{value.title}</h3>
                      <p className="mt-2 text-base leading-relaxed text-muted-foreground">{value.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <Stats />
        <QuoteCTA />
      </main>
      <SiteFooter />
    </>
  );
}
