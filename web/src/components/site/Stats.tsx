'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SectionHeader } from './Services';

const keys = ['vehicles', 'routes', 'years', 'ontime'] as const;

export function Stats() {
  const t = useTranslations('Stats');

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader eyebrow={t('eyebrow')} title={t('title')} align="center" />
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-px rounded-3xl border border-border bg-border lg:grid-cols-4">
          {keys.map((k, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex flex-col items-center gap-2 bg-white p-10 first:rounded-tl-3xl"
            >
              <span className="text-5xl font-extrabold tracking-tight text-ink tabular-nums sm:text-6xl">
                {t(`${k}Number`)}
              </span>
              <span className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {t(`${k}Label`)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
