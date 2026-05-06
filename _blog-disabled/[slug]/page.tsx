import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { marked } from 'marked';
import { AnnouncementBar } from '@/components/site/AnnouncementBar';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { BreadcrumbJsonLd } from '@/components/site/JsonLd';
import { getPostBySlug, pickField, type Locale } from '@/lib/cms';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/blog/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const title = pickField<string>(post, 'title', locale as Locale) ?? '';
  const excerpt = pickField<string>(post, 'excerpt', locale as Locale) ?? '';
  const path = (loc: string) => `${loc === routing.defaultLocale ? '' : `/${loc}`}/blog/${slug}`;
  return {
    title,
    description: excerpt,
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
    },
  };
}

export default async function BlogPost({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations('Blog');
  const tNav = await getTranslations('Nav');
  const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`;

  const title = pickField<string>(post, 'title', locale as Locale) ?? '';
  const body = pickField<string>(post, 'body', locale as Locale) ?? '';
  const html = await marked.parse(body, { async: true });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tNav('home'), href: localePrefix || '/' },
          { name: tNav('blog'), href: `${localePrefix}/blog` },
          { name: title, href: `${localePrefix}/blog/${slug}` },
        ]}
      />
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <article className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4">
            <Link
              href={`${localePrefix}/blog`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t('back')}
            </Link>
            {post.published_at && (
              <time
                dateTime={post.published_at}
                className="mt-8 block text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground"
              >
                {new Date(post.published_at).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            <h1 className="mt-3 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              {title}
            </h1>
            <div
              className="prose-spathis mt-12 max-w-none text-lg leading-relaxed text-ink/85 [&_a]:text-[var(--brand)] [&_a]:underline [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_p]:mt-6 [&_ul]:mt-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mt-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
