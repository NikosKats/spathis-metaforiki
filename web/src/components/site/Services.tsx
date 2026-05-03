'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { SERVICES } from '@/lib/services-config';
import { cn } from '@/lib/utils';

const layout: Record<string, { span: string; accent: string }> = {
  fullLoads: { span: 'lg:col-span-2', accent: 'from-[#c8102e]/10 via-transparent to-transparent' },
  containers: { span: 'lg:col-span-1', accent: 'from-[#190602]/8 via-transparent to-transparent' },
  haulage: { span: 'lg:col-span-3', accent: 'from-[#d0984f]/10 via-transparent to-transparent' },
};

export function Services() {
  const t = useTranslations('Services');
  const locale = useLocale();
  const localePrefix = locale === 'el' ? '' : `/${locale}`;

  return (
    <section id="services" className="relative bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {SERVICES.map(({ slug, msgKey, icon: Icon }, i) => {
            const item = layout[msgKey];
            return (
              <motion.a
                key={slug}
                href={`${localePrefix}/services/${slug}`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl border border-border bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-ink/30 hover:shadow-[0_24px_48px_-24px_rgba(25,6,2,0.18)] sm:p-10',
                  item.span,
                )}
              >
                <div className={cn('absolute inset-0 -z-10 bg-gradient-to-br opacity-90', item.accent)} />
                <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-[var(--brand)] transition group-hover:bg-[var(--brand)] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-12">
                  <h3 className="text-2xl font-bold tracking-tight text-ink">{t(`${msgKey}Title`)}</h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
                    {t(`${msgKey}Desc`)}
                  </p>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  {t('learnMore')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && (
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]',
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
          {eyebrow}
        </div>
      )}
      <h2 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
