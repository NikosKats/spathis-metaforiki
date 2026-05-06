'use client';

import { Phone, MessageCircle, Mail } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const PHONE_TEL = '+306938255178';
const WHATSAPP = 'https://wa.me/306938255178';
const VIBER = 'viber://chat?number=%2B306938255178';

// Sticky bottom dock — shown only on mobile (< sm). Provides one-tap access
// to phone, WhatsApp/Viber, email, and the quote form regardless of where
// the user is in the page. Uses safe-area-inset-bottom so it sits above
// iPhone home indicators / Android nav bars.

export function MobileCTADock() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

  return (
    <>
      {/* Spacer so page content isn't hidden behind the fixed dock */}
      <div aria-hidden className="h-16 sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
      <nav
        aria-label="Quick contact"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur-md sm:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-4 gap-1 px-2 py-1.5">
          <DockBtn href={`tel:${PHONE_TEL}`} icon={Phone} label={t('callNow')} />
          <DockBtn href={WHATSAPP} icon={MessageCircle} label="WhatsApp" external />
          <DockBtn href="mailto:aspathis@hotmail.gr" icon={Mail} label="Email" />
          <DockBtnLink to={`${prefix}/quote`} label={t('quote')} primary />
        </div>
      </nav>
    </>
  );
}

function DockBtn({
  href,
  icon: Icon,
  label,
  external,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink transition active:bg-secondary"
    >
      <Icon className="h-5 w-5 text-[var(--brand)]" />
      <span className="leading-none">{label}</span>
    </a>
  );
}

function DockBtnLink({ to, label, primary }: { to: string; label: string; primary?: boolean }) {
  return (
    <Link
      href={to}
      className={
        primary
          ? 'flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl bg-[var(--brand)] px-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition active:bg-[var(--brand-strong)]'
          : 'flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink transition active:bg-secondary'
      }
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="14" x2="15" y2="14" />
        <line x1="9" y1="18" x2="13" y2="18" />
      </svg>
      <span className="leading-none">{label}</span>
    </Link>
  );
}
