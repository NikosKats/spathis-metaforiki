import { Phone, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LogoMark } from './LogoMark';
import { LangSwitcher } from './LangSwitcher';

const PHONE_DISPLAY = '6938 255 178';
const PHONE_TEL = '+306938255178';

export function SiteHeader() {
  const t = useTranslations('Nav');

  const links = [
    { href: '#services', label: t('services') },
    { href: '#routes', label: t('routes') },
    { href: '#process', label: t('process') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        <a href="#" aria-label="ΣΠΑΘΗΣ" className="flex-shrink-0">
          <LogoMark />
        </a>
        <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
            >
              {link.label}
            </a>
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
          <LangSwitcher />
          <a
            href="#quote"
            className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]"
          >
            <span className="hidden sm:inline">{t('quote')}</span>
            <span className="sm:hidden">{t('callNow')}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
