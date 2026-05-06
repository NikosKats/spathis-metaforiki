'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LangSwitcher } from './LangSwitcher';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const PHONE_TEL = '+306938255178';

export function MobileNav() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  const home = prefix || '/';
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close drawer on route change (hash or pathname)
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, [open]);

  const links = [
    { href: `${prefix}/services`, label: t('services') },
    { href: `${prefix}/gallery`, label: t('gallery') },
    { href: `${prefix}/about`, label: t('about') },
    { href: `${home}#contact`, label: t('contact') },
  ];

  const drawer = open && (
    <div className="fixed inset-0 z-50 lg:hidden">
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />
          <aside
            role="dialog"
            aria-modal="true"
            className="absolute right-0 top-0 flex h-full w-[min(360px,85vw)] flex-col bg-white shadow-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold text-ink transition hover:bg-secondary"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </nav>

            <div className="border-t border-border p-5">
              <LangSwitcher className="w-full justify-center" />
              <a
                href={`tel:${PHONE_TEL}`}
                className={cn(
                  'mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-secondary',
                )}
              >
                <Phone className="h-4 w-4 text-[var(--brand)]" />
                6938 255 178
              </a>
              <Link
                href={`${prefix}/quote`}
                onClick={() => setOpen(false)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]"
              >
                {t('quote')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-secondary lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      {mounted && drawer ? createPortal(drawer, document.body) : null}
    </>
  );
}
