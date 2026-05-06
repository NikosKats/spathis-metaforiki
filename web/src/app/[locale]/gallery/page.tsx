import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Truck, Container, Anchor, Camera } from 'lucide-react';
import { AnnouncementBar } from '@/components/site/AnnouncementBar';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { QuoteCTA } from '@/components/site/QuoteCTA';
import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: PageProps<'/[locale]/gallery'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Gallery' });
  const path = (loc: string) => `${loc === routing.defaultLocale ? '' : `/${loc}`}/gallery`;
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
    },
  };
}

// Photo placeholders — paint a stylised tile per item until real photos are
// dropped into /public/gallery/. Each tile carries a category badge.
const items = [
  { kind: 'truck', label: 'Φορτηγό · Πάτρα ↔ Κεφαλονιά', accent: 'from-[#c8102e]/45 to-[#190602]/85', span: 'sm:col-span-2 sm:row-span-2' },
  { kind: 'container', label: 'Container 40\' HC', accent: 'from-[#190602]/65 via-[#5b403a]/40 to-[#c8102e]/30' },
  { kind: 'haulage', label: 'Τρακτόρευση · Βαρέα φορτία', accent: 'from-[#d0984f]/35 via-[#c8102e]/25 to-[#190602]/80' },
  { kind: 'truck', label: 'Παράδοση στο νησί', accent: 'from-[#190602]/70 to-[#c8102e]/40' },
  { kind: 'container', label: 'Συντονισμός λιμανιού', accent: 'from-[#c8102e]/35 to-[#190602]/80' },
  { kind: 'haulage', label: 'Σκάφος / υπερβαρές', accent: 'from-[#d0984f]/30 to-[#190602]/85' },
  { kind: 'truck', label: 'Καθημερινά δρομολόγια', accent: 'from-[#c8102e]/30 to-[#190602]/80', span: 'sm:col-span-2' },
] as const;

const iconFor = (kind: string) => (kind === 'container' ? Container : kind === 'haulage' ? Anchor : Truck);

export default async function GalleryPage({ params }: PageProps<'/[locale]/gallery'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Gallery');

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
                {t('eyebrow')}
              </div>
              <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
                {t('title')}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>

            <div className="mt-14 grid auto-rows-[180px] gap-3 sm:grid-cols-3 sm:auto-rows-[220px] lg:grid-cols-4">
              {items.map((item, i) => {
                const Icon = iconFor(item.kind);
                return (
                  <div
                    key={i}
                    className={`group relative overflow-hidden rounded-2xl border border-border bg-ink ${('span' in item && item.span) || ''}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.accent}`} />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)]"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                          <Icon className="h-4 w-4 text-white" strokeWidth={1.75} />
                        </div>
                        <Camera className="h-3.5 w-3.5 text-white/40" />
                      </div>
                      <div className="text-sm font-semibold leading-snug">{item.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              {locale === 'el'
                ? '* Εικόνες-σύμβολα. Πραγματικές φωτογραφίες θα προστεθούν σύντομα.'
                : '* Stylised placeholders. Real photos will be added soon.'}
            </p>
          </div>
        </section>
        <QuoteCTA />
      </main>
      <SiteFooter />
    </>
  );
}
