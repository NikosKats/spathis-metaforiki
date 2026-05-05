import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { AnnouncementBar } from '@/components/site/AnnouncementBar';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { getPublishedPosts, pickField, type Locale } from '@/lib/blog';
import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: PageProps<'/[locale]/blog'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const path = (loc: string) => `${loc === routing.defaultLocale ? '' : `/${loc}`}/blog`;
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
    },
  };
}

export default async function BlogIndex({ params }: PageProps<'/[locale]/blog'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Blog');
  const posts = await getPublishedPosts();
  const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`;

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-surface py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              {t('eyebrow')}
            </div>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4">
            {posts.length === 0 ? (
              <div className="rounded-3xl border border-border bg-surface px-8 py-20 text-center">
                <p className="text-base text-muted-foreground">{t('empty')}</p>
              </div>
            ) : (
              <ul className="grid gap-8 sm:grid-cols-2">
                {posts.map((post) => {
                  const title = pickField<string>(post, 'title', locale as Locale) ?? '';
                  const excerpt = pickField<string>(post, 'excerpt', locale as Locale) ?? '';
                  return (
                    <li key={post.id}>
                      <Link
                        href={`${localePrefix}/blog/${post.slug}`}
                        className="group block rounded-3xl border border-border bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-ink/30 hover:shadow-[0_24px_48px_-24px_rgba(25,6,2,0.18)]"
                      >
                        {post.published_at && (
                          <time
                            dateTime={post.published_at}
                            className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground"
                          >
                            {new Date(post.published_at).toLocaleDateString(locale, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </time>
                        )}
                        <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">{title}</h2>
                        {excerpt && (
                          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{excerpt}</p>
                        )}
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                          {t('readMore')}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
