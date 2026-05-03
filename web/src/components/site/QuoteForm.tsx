'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { quoteSchema, type QuoteInput } from '@/lib/schemas';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function QuoteForm() {
  const t = useTranslations('Quote');
  const locale = useLocale() as 'el' | 'en';
  const [status, setStatus] = useState<Status>('idle');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { language: locale, cargoType: 'full_load', website: '' },
  });

  const cargoType = watch('cargoType');

  const onSubmit = async (data: QuoteInput) => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/quote', {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-border bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-10"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('name')} error={errors.name?.message}>
          <Input {...register('name')} autoComplete="name" />
        </Field>
        <Field label={t('company')} error={errors.company?.message}>
          <Input {...register('company')} autoComplete="organization" />
        </Field>
        <Field label={t('email')} error={errors.email?.message}>
          <Input type="email" {...register('email')} autoComplete="email" />
        </Field>
        <Field label={t('phone')} error={errors.phone?.message}>
          <Input type="tel" {...register('phone')} autoComplete="tel" />
        </Field>

        <Field label={t('cargoType')} error={errors.cargoType?.message} className="sm:col-span-2">
          <Select value={cargoType} onValueChange={(v) => setValue('cargoType', v as QuoteInput['cargoType'])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_load">{t('cargoTypeFullLoad')}</SelectItem>
              <SelectItem value="container">{t('cargoTypeContainer')}</SelectItem>
              <SelectItem value="haulage">{t('cargoTypeHaulage')}</SelectItem>
              <SelectItem value="other">{t('cargoTypeOther')}</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label={t('origin')} error={errors.origin?.message}>
          <Input placeholder={t('originPlaceholder')} {...register('origin')} />
        </Field>
        <Field label={t('destination')} error={errors.destination?.message}>
          <Input placeholder={t('destinationPlaceholder')} {...register('destination')} />
        </Field>

        <Field label={t('weight')} error={errors.weightKg?.message}>
          <Input type="number" inputMode="decimal" step="any" {...register('weightKg')} />
        </Field>
        <Field label={t('volume')} error={errors.volumeM3?.message}>
          <Input type="number" inputMode="decimal" step="any" {...register('volumeM3')} />
        </Field>

        <Field label={t('pickupDate')} error={errors.pickupDate?.message}>
          <Input type="date" {...register('pickupDate')} />
        </Field>
        <Field label={t('deliveryDate')} error={errors.deliveryDate?.message}>
          <Input type="date" {...register('deliveryDate')} />
        </Field>

        <Field label={t('notes')} error={errors.notes?.message} className="sm:col-span-2">
          <Textarea rows={4} placeholder={t('notesPlaceholder')} {...register('notes')} />
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

      <div className="mt-7 flex justify-end">
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
              <Loader2 className="h-4 w-4 animate-spin" /> {t('submitting')}
            </>
          ) : (
            <>
              {t('submit')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
