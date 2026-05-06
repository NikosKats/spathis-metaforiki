import { setRequestLocale } from 'next-intl/server';
import { AnnouncementBar } from '@/components/site/AnnouncementBar';
import { SiteHeader } from '@/components/site/SiteHeader';
import { Hero } from '@/components/site/Hero';
import { BrandLamp } from '@/components/site/BrandLamp';
import { RouteMarquee } from '@/components/site/RouteMarquee';
import { Services } from '@/components/site/Services';
import { Process } from '@/components/site/Process';
import { Routes } from '@/components/site/Routes';
import { Stats } from '@/components/site/Stats';
import { QuoteCTA } from '@/components/site/QuoteCTA';
import { FAQ } from '@/components/site/FAQ';
import { ContactSection } from '@/components/site/ContactSection';
import { SiteFooter } from '@/components/site/SiteFooter';

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <RouteMarquee />
        <BrandLamp />
        <Services />
        <Process />
        <Routes locale={locale} />
        <Stats />
        <QuoteCTA />
        <FAQ />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
