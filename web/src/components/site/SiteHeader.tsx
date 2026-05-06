import { Phone, ArrowRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { LogoMark } from './LogoMark';
import { LangSwitcher } from './LangSwitcher';
import { MobileNav } from './MobileNav';
import { routing } from '@/i18n/routing';

const PHONE_DISPLAY = '6938 255 178';
const PHONE_TEL = '+306938255178';

export async function SiteHeader() {
  const t = await getTranslations('Nav');
  const locale = await getLocale();
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  const home = prefix || '/';

  const links = [
    { href: `${prefix}/services`, label: t('services') },
    { href: `${home}#routes`, label: t('routes') },
    { href: `${prefix}/about`, label: t('about') },
    { href: `${home}#contact`, label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        <Link href={home} aria-label="ΣΠΑΘΗΣ" className="flex-shrink-0">
          <LogoMark />
        </Link>
        <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <a
            href={`tel:${PHONE_TEL}`}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-secondary md:inline-flex"
          >
            <Phone className="h-4 w-4 text-[var(--brand)]" />
            <span className="hidden xl:inline">{PHONE_DISPLAY}</span>
            <span className="xl:hidden">{t('callNow')}</span>
          </a>
          <LangSwitcher className="hidden sm:flex" />
          <Link
            href={`${prefix}/quote`}
            className="group hidden items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)] sm:inline-flex"
          >
            {t('quote')}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
