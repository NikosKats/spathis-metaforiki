'use client';

import { useTranslations } from 'next-intl';

export function RouteMarquee() {
  const t = useTranslations('Trust');
  const routes = t.raw('routes') as string[];
  const doubled = [...routes, ...routes];

  return (
    <section aria-label={t('label')} className="border-y border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center gap-6">
          <span className="hidden flex-shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:block">
            {t('label')}
          </span>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10">
              {doubled.map((route, i) => (
                <div key={i} className="flex items-center gap-3 whitespace-nowrap">
                  <span className="h-1 w-1 rounded-full bg-[var(--brand)]" />
                  <span className="text-sm font-semibold tracking-tight text-ink">{route}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
