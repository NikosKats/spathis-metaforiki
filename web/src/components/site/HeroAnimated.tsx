'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: ReactNode;
  ctaSecondary: ReactNode;
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function HeroAnimated({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  ctaPrimaryHref,
  ctaSecondaryHref,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-[var(--brand)] text-white">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="text-sm uppercase tracking-widest opacity-80"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mt-4 max-w-3xl text-4xl font-bold sm:text-6xl tracking-tight"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-6 max-w-2xl text-lg opacity-90"
        >
          {subtitle}
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a
            href={ctaPrimaryHref}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[var(--brand)] hover:bg-zinc-100 transition"
          >
            {ctaPrimary} <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={ctaSecondaryHref}
            className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10 transition"
          >
            {ctaSecondary}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
