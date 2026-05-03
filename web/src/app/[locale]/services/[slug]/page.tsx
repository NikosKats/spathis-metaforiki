import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Check, Phone } from 'lucide-react';
import { AnnouncementBar } from '@/components/site/AnnouncementBar';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { BreadcrumbJsonLd, ServiceJsonLd } from '@/components/site/JsonLd';
import { SERVICES, getService, type ServiceSlug } from '@/lib/services-config';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SERVICES.map(({ slug }) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/services/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  const cfg = getService(slug);
  if (!cfg) return {};
  const t = await getTranslations({ locale, namespace: 'ServiceDetail' });
  const title = t(`${cfg.msgKey}Title`);
  const description = t(`${cfg.msgKey}Subtitle`);
  const path = (loc: string) =>
    `${loc === routing.defaultLocale ? '' : `/${loc}`}/services/${slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
    },
  };
}

export default async function ServiceDetail({ params }: PageProps<'/[locale]/services/[slug]'>) {
  const { locale, slug } = await params;
  const cfg = getService(slug);
  if (!cfg) notFound();

  setRequestLocale(locale);
  const t = await getTranslations('ServiceDetail');
  const Icon = cfg.icon;
  const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`;

  const includes = t.raw(`${cfg.msgKey}Includes`) as string[];
  const ideal = t.raw(`${cfg.msgKey}Ideal`) as string[];

  const tNav = await getTranslations('Nav');
  const title = t(`${cfg.msgKey}Title`);
  const subtitle = t(`${cfg.msgKey}Subtitle`);

  return (
    <>
      <ServiceJsonLd
        name={title}
        description={subtitle}
        slug={slug}
        locale={locale as 'el' | 'en'}
      />
      <BreadcrumbJsonLd
        items={[
          { name: tNav('home'), href: localePrefix || '/' },
          { name: tNav('services'), href: `${localePrefix}/services` },
          { name: title, href: `${localePrefix}/services/${slug}` },
        ]}
      />
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-surface pb-16 pt-12 sm:pb-24 sm:pt-16">
          <div className="mx-auto max-w-5xl px-4">
            <Link
              href={`${localePrefix}/services`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t('back')}
            </Link>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-[var(--brand)]">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                {t(`${cfg.msgKey}Eyebrow`)}
              </div>
            </div>
            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {t(`${cfg.msgKey}Title`)}
            </h1>
            <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {t(`${cfg.msgKey}Subtitle`)}
            </p>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  {t(`${cfg.msgKey}IncludesTitle`)}
                </h2>
                <ul className="mt-6 space-y-3">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="text-base leading-relaxed text-ink/85">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  {t(`${cfg.msgKey}IdealTitle`)}
                </h2>
                <ul className="mt-6 space-y-3">
                  {ideal.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-ink/70" />
                      </span>
                      <span className="text-base leading-relaxed text-ink/85">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-ink py-16 text-white sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t('ctaTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-white/70">
              {t('ctaSubtitle')}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`${localePrefix}/quote`}
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]"
              >
                {t('ctaPrimary')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="tel:+306938255178"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="h-4 w-4" /> {t('ctaSecondary')}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

// Type guard placeholder for the slug param type
export type { ServiceSlug };
