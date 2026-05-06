// Tiny CMS reader — uses the Supabase REST API directly so we don't have
// to bundle @supabase/supabase-js (≈500 KB) into the worker. Public anon
// key + RLS allow `select` on rows where `published = true`.

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

async function rest<T>(path: string): Promise<T[]> {
  if (!URL || !KEY) return [];
  try {
    const res = await fetch(`${URL}/rest/v1/${path}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      // Re-validate hourly so CMS edits show up reasonably fast without
      // hammering the DB.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

// ----- Blog posts -----
export type BlogPost = {
  id: string;
  slug: string;
  title_el: string;
  title_en: string;
  excerpt_el: string | null;
  excerpt_en: string | null;
  body_el: string | null;
  body_en: string | null;
  cover_image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
};

export type Locale = 'el' | 'en';

export async function getPublishedPosts(): Promise<BlogPost[]> {
  return rest<BlogPost>(
    'blog_posts?status=eq.published&order=published_at.desc&limit=50',
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const rows = await rest<BlogPost>(
    `blog_posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
  );
  return rows[0] ?? null;
}

// ----- Static pages (terms / privacy / about / etc.) -----
export type CmsPage = {
  id: string;
  slug: string;
  title_el: string;
  title_en: string;
  body_el: string | null;
  body_en: string | null;
  meta_description_el: string | null;
  meta_description_en: string | null;
  published: boolean;
};

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  const rows = await rest<CmsPage>(
    `pages?slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`,
  );
  return rows[0] ?? null;
}

// Pick a localised field from a row, falling back to el if the requested
// locale's column is empty.
export function pickField<T>(
  row: { [k: string]: unknown },
  base: string,
  locale: Locale,
): T | null {
  return (
    (row[`${base}_${locale}`] as T) ?? (row[`${base}_el`] as T) ?? null
  );
}
