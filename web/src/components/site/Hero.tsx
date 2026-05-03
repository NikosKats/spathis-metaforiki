'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

function FloatingPaths({ position, color = 'rgb(200,16,46)' }: { position: number; color?: string }) {
  const paths = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${
      312 - i * 5 * position
    } ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${
      470 - i * 6
    } ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="h-full w-full" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
        <title>Routes</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={color}
            strokeWidth={path.width}
            strokeOpacity={0.06 + path.id * 0.012}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: [0.18, 0.4, 0.18], pathOffset: [0, 1, 0] }}
            transition={{ duration: 22 + Math.random() * 10, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </svg>
    </div>
  );
}

export function Hero() {
  const t = useTranslations('Hero');
  const titleAccent = t('titleAccent');
  const fullTitle = t('title');
  const beforeAccent = fullTitle.includes(titleAccent)
    ? fullTitle.slice(0, fullTitle.indexOf(titleAccent)).trim()
    : fullTitle;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-surface to-white">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} color="rgb(25,6,2)" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:py-28 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] motion-safe:animate-pulse" />
            {t('eyebrow')}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-3xl text-balance text-5xl font-extrabold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            {beforeAccent}{' '}
            <span className="bg-gradient-to-br from-[var(--brand)] via-[var(--brand)] to-[var(--brand-strong)] bg-clip-text text-transparent">
              {titleAccent}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            {t('subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#quote"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3.5 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(200,16,46,0.5)] transition hover:bg-[var(--brand-strong)] hover:shadow-[0_12px_28px_-8px_rgba(200,16,46,0.55)]"
            >
              {t('ctaPrimary')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-base font-semibold text-ink transition hover:border-ink hover:bg-secondary"
            >
              {t('ctaSecondary')}
            </a>
            <a
              href="tel:+306938255178"
              className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-ink lg:ml-0"
            >
              <Phone className="h-4 w-4 text-[var(--brand)]" />
              6938 255 178 · 6943 450 557
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:col-span-5 lg:block"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-ink shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(200,16,46,0.32),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(208,152,79,0.2),transparent_60%)]" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 text-white/70">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Live route</span>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] motion-safe:animate-pulse" /> on time
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-px bg-white/10 p-px">
        {[
          { k: 'Από', v: 'Πάτρα' },
          { k: 'Προς', v: 'Κεφαλονιά' },
          { k: 'Container', v: '40\' HC' },
          { k: 'ETA', v: '14:30' },
        ].map((row) => (
          <div key={row.k} className="bg-ink p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">{row.k}</div>
            <div className="mt-1 text-lg font-bold text-white">{row.v}</div>
          </div>
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--brand)]">
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M3 12h18M3 12l5-5M3 12l5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
          />
        </svg>
      </div>
    </div>
  );
}
