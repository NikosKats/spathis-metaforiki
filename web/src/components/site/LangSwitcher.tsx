'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

// Greek-script labels for both locales (per client request)
const LABEL: Record<string, string> = {
  el: 'ΕΛ',
  en: 'ΑΓ',
};
const FULL_LABEL: Record<string, string> = {
  el: 'Ελληνικά',
  en: 'Αγγλικά',
};

export function LangSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  // Strip the current locale prefix from the pathname (only /en is prefixed; /el is the default → no prefix)
  const stripped = pathname.replace(/^\/(el|en)(?=\/|$)/, '') || '/';

  const hrefFor = (target: string) =>
    target === routing.defaultLocale ? stripped : `/${target}${stripped === '/' ? '' : stripped}`;

  return (
    <div className={cn('flex items-center gap-1 rounded-full border border-border bg-white p-0.5', className)}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={hrefFor(l)}
          aria-current={l === locale ? 'page' : undefined}
          aria-label={FULL_LABEL[l]}
          title={FULL_LABEL[l]}
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider transition',
            l === locale ? 'bg-ink text-white' : 'text-muted-foreground hover:text-ink',
          )}
        >
          {LABEL[l] ?? l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
