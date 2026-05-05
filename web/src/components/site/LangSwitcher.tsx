'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const FULL_LABEL: Record<string, string> = {
  el: 'Ελληνικά',
  en: 'English',
};

export function LangSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  // next-intl's usePathname returns the path WITHOUT the locale segment
  const pathname = usePathname();

  return (
    <div className={cn('flex items-center gap-1 rounded-full border border-border bg-white p-0.5', className)}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          aria-current={l === locale ? 'page' : undefined}
          aria-label={FULL_LABEL[l]}
          title={FULL_LABEL[l]}
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition',
            l === locale ? 'bg-ink text-white' : 'text-muted-foreground hover:text-ink',
          )}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
