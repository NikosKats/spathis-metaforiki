'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function QuoteCTA() {
  const t = useTranslations('QuoteCTA');

  return (
    <section id="quote" className="relative overflow-hidden bg-[var(--brand)] py-24 text-white sm:py-32">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(255,255,255,0.18),transparent_50%),radial-gradient(circle_at_85%_15%,rgba(0,0,0,0.18),transparent_50%)]"
      />
      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          {t('eyebrow')}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
        >
          {t('title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-white/85"
        >
          {t('subtitle')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-[var(--brand)] shadow-[0_12px_28px_-8px_rgba(0,0,0,0.3)] transition hover:bg-zinc-100"
          >
            {t('primary')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="tel:+306938255178"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-transparent px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
          >
            <Phone className="h-4 w-4" />
            {t('secondary')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
