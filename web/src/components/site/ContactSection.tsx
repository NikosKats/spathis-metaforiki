'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2, Phone, Mail, MapPin, Clock, MessageCircle, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contactSchema, type ContactInput } from '@/lib/schemas';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactSection() {
  const t = useTranslations('Contact');
  const locale = useLocale() as 'el' | 'en';
  const [status, setStatus] = useState<Status>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { language: locale, website: '' },
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, language: locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="bg-surface py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            {t('eyebrow')}
          </div>
          <h2 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{t('subtitle')}</p>

          <div className="mt-10 grid gap-3">
            <ContactRow icon={Phone} label="6938 255 178 · 6943 450 557" href="tel:+306938255178" />
            <ContactRow icon={Mail} label="aspathis@hotmail.gr" href="mailto:aspathis@hotmail.gr" />
            <ContactRow
              icon={MessageCircle}
              label={`WhatsApp · Viber`}
              href="https://wa.me/306938255178"
              external
            />
            <ContactRow icon={MapPin} label={locale === 'el' ? 'Σκάλα Κεφαλονιάς' : 'Skala, Kefalonia'} />
            <ContactRow icon={Clock} label={locale === 'el' ? 'Δευ–Σαβ 08:00–20:00' : 'Mon–Sat 8:00–20:00'} />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl border border-border bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-10 lg:col-span-7"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('name')} error={errors.name?.message}>
              <Input {...register('name')} autoComplete="name" />
            </Field>
            <Field label={t('email')} error={errors.email?.message}>
              <Input type="email" {...register('email')} autoComplete="email" />
            </Field>
            <Field label={t('phone')} error={errors.phone?.message} className="sm:col-span-2">
              <Input type="tel" {...register('phone')} autoComplete="tel" />
            </Field>
            <Field label={t('message')} error={errors.message?.message} className="sm:col-span-2">
              <Textarea rows={5} placeholder={t('messagePlaceholder')} {...register('message')} />
            </Field>
          </div>

          {/* honeypot */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
            className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
          />

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xs text-xs text-muted-foreground">{t('consent')}</p>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className={cn(
                'group inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-base font-semibold text-white shadow-sm transition',
                'hover:bg-[var(--brand-strong)] disabled:opacity-60',
              )}
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t('sending')}
                </>
              ) : (
                <>
                  {t('send')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>

          {status === 'success' && (
            <div
              role="status"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{t('success')}</span>
            </div>
          )}
          {status === 'error' && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{t('error')}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <span className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium text-ink transition hover:border-ink/30 hover:bg-secondary">
      <Icon className="h-4 w-4 flex-shrink-0 text-[var(--brand)]" />
      {label}
    </span>
  );
  if (!href) return content;
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="block"
    >
      {content}
    </a>
  );
}
