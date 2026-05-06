'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LampContainer } from '@/components/ui/lamp';
import { BrandLogo } from './BrandLogo';

// Lamp section: dark ink backdrop with a brand-red conic light beam from
// the top, illuminating the ΣΠΑΘΗΣ logo (red disc + white wordmark) and the
// company tagline below.

export function BrandLamp() {
  const t = useTranslations('Hero');

  return (
    <section className="relative">
      <LampContainer>
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <BrandLogo variant="dark" size={220} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 max-w-xl text-center"
        >
          <p className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-lg font-medium text-transparent sm:text-xl">
            {t('subtitle')}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
            <span>Σκάλα Κεφαλονιάς</span>
            <span className="h-1 w-1 rounded-full bg-[var(--brand)]" />
            <a href="tel:+306938255178" className="transition hover:text-white">
              6938 255 178
            </a>
            <span className="h-1 w-1 rounded-full bg-[var(--brand)]" />
            <a href="tel:+306943450557" className="transition hover:text-white">
              6943 450 557
            </a>
          </div>
        </motion.div>
      </LampContainer>
    </section>
  );
}
