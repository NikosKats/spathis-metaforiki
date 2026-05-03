'use client';

import { motion } from 'framer-motion';
import { ClipboardList, BadgeCheck, PackageCheck, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SectionHeader } from './Services';

const stepsConfig = [
  { num: '01', icon: ClipboardList, key: 'step1' },
  { num: '02', icon: BadgeCheck, key: 'step2' },
  { num: '03', icon: Truck, key: 'step3' },
  { num: '04', icon: PackageCheck, key: 'step4' },
] as const;

export function Process() {
  const t = useTranslations('Process');

  return (
    <section id="process" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader eyebrow={t('eyebrow')} title={t('title')} />
        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[42px] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />
          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-6">
            {stepsConfig.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.key}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="relative z-10 mx-auto flex h-[84px] w-[84px] items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_var(--border),0_8px_24px_-12px_rgba(25,6,2,0.18)]">
                    <Icon className="h-7 w-7 text-[var(--brand)]" strokeWidth={1.75} />
                  </div>
                  <div className="mt-6 text-center lg:text-left">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {s.num}
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-ink">{t(`${s.key}Title`)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`${s.key}Desc`)}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
