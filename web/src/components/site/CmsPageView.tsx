import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { AnnouncementBar } from './AnnouncementBar';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { getPageBySlug, pickField, type Locale } from '@/lib/cms';

// Server component that renders any /pages CMS row by slug. Used by
// /privacy, /terms (and any future static page) so we have a single
// markdown rendering pipeline + metadata helper.

const FALLBACK_BODY: Record<string, { title_el: string; title_en: string; body_el: string; body_en: string }> = {
  privacy: {
    title_el: 'Πολιτική Απορρήτου',
    title_en: 'Privacy Policy',
    body_el: '## Πολιτική Απορρήτου\n\n_Ενημερωμένη έκδοση εκκρεμεί. Επικοινωνήστε μαζί μας για ερωτήσεις σχετικά με τη διαχείριση των προσωπικών σας δεδομένων._',
    body_en: '## Privacy Policy\n\n_Updated version pending. Please contact us for questions about how we handle your personal data._',
  },
  terms: {
    title_el: 'Όροι Χρήσης',
    title_en: 'Terms of Service',
    body_el: '## Όροι Χρήσης\n\n_Ενημερωμένη έκδοση εκκρεμεί. Επικοινωνήστε μαζί μας για ερωτήσεις σχετικά με τους όρους συνεργασίας._',
    body_en: '## Terms of Service\n\n_Updated version pending. Please contact us for questions about the terms of cooperation._',
  },
};

export async function CmsPageView({ slug, locale }: { slug: string; locale: Locale }) {
  const row = await getPageBySlug(slug);
  const fallback = FALLBACK_BODY[slug];
  if (!row && !fallback) notFound();

  const title = row ? pickField<string>(row, 'title', locale) ?? '' : fallback.title_el;
  const titleEn = row ? row.title_en : fallback.title_en;
  const body =
    (row ? pickField<string>(row, 'body', locale) : null) ??
    (locale === 'el' ? fallback.body_el : fallback.body_en);
  const html = await marked.parse(body || '', { async: true });

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <article className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              {locale === 'en' ? titleEn || title : title}
            </h1>
            <div
              className="prose-spathis mt-10 max-w-none text-base leading-relaxed text-ink/85 sm:text-lg [&_a]:text-[var(--brand)] [&_a]:underline [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_p]:mt-5 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
