'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SectionHeader } from './Services';

const routes = [
  { from: 'Αθήνα', to: 'Κεφαλονιά', time: '~7h', daily: true, fromEn: 'Athens', toEn: 'Kefalonia' },
  { from: 'Πάτρα', to: 'Κεφαλονιά', time: '~3h', daily: true, fromEn: 'Patras', toEn: 'Kefalonia' },
  { from: 'Θεσσαλονίκη', to: 'Κεφαλονιά', time: '~10h', daily: false, fromEn: 'Thessaloniki', toEn: 'Kefalonia' },
  { from: 'Ηγουμενίτσα', to: 'Κεφαλονιά', time: '~6h', daily: false, fromEn: 'Igoumenitsa', toEn: 'Kefalonia' },
];

export function Routes({ locale }: { locale: string }) {
  const t = useTranslations('Routes');

  return (
    <section id="routes" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(200,16,46,0.18),transparent_45%),radial-gradient(circle_at_80%_90%,rgba(208,152,79,0.12),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            {t('eyebrow')}
          </div>
          <h2 className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">{t('title')}</h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-white/70">{t('subtitle')}</p>
        </div>
        <div className="mt-14 grid gap-3 sm:grid-cols-2">
          {routes.map((r, i) => (
            <motion.div
              key={`${r.from}-${r.to}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group flex items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/25 hover:bg-white/[0.06]"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{t('from')}</div>
                  <div className="text-xl font-bold tracking-tight">{locale === 'en' ? r.fromEn : r.from}</div>
                </div>
                <div className="relative h-px flex-1 bg-gradient-to-r from-white/30 via-white/15 to-white/30">
                  <ArrowRight className="absolute -top-2 right-0 h-4 w-4 text-[var(--brand)]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{t('to')}</div>
                  <div className="text-xl font-bold tracking-tight">{locale === 'en' ? r.toEn : r.to}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-semibold tabular-nums text-white">{r.time}</span>
                <span
                  className={
                    r.daily
                      ? 'rounded-full border border-[var(--brand)]/40 bg-[var(--brand)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-cream)]'
                      : 'rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/60'
                  }
                >
                  {r.daily ? (locale === 'en' ? 'Daily' : 'Καθημερινά') : locale === 'en' ? 'On request' : 'Κατόπιν συνεννόησης'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
