'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslations } from 'next-intl';
import { SectionHeader } from './Services';

type Item = { q: string; a: string };

export function FAQ() {
  const t = useTranslations('FAQ');
  const items = t.raw('items') as Item[];

  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeader eyebrow={t('eyebrow')} title={t('title')} />
        <Accordion type="single" collapsible className="mt-12 divide-y divide-border rounded-2xl border border-border bg-white">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b-0 px-6">
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-ink hover:no-underline sm:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 pr-8 text-base leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
