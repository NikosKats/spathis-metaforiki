import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Truck, Container } from 'lucide-react';
import { HeroAnimated } from '@/components/site/HeroAnimated';

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="flex flex-1 flex-col">
      <HeroAnimated
        eyebrow={t('Home.heroEyebrow')}
        title={t('Home.heroTitle')}
        subtitle={t('Home.heroSubtitle')}
        ctaPrimary={t('Home.ctaPrimary')}
        ctaSecondary={t('Home.ctaSecondary')}
        ctaPrimaryHref="#quote"
        ctaSecondaryHref="#contact"
      />

      <section className="mx-auto max-w-6xl w-full px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight text-ink">{t('Services.title')}</h2>
        <p className="mt-2 text-zinc-600">{t('Services.subtitle')}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { key: 'fullLoads', icon: Truck },
            { key: 'containers', icon: Container },
            { key: 'haulage', icon: Truck },
          ].map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
            >
              <Icon className="h-8 w-8 text-brand" />
              <h3 className="mt-4 text-xl font-semibold">{t(`Services.${key}`)}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
