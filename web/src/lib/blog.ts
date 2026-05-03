import { createClient } from '@/lib/supabase/server';

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

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!isConfigured()) return [];
  try {
    const sb = await createClient();
    const { data } = await sb
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);
    return (data ?? []) as BlogPost[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isConfigured()) return null;
  try {
    const sb = await createClient();
    const { data } = await sb
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    return (data as BlogPost | null) ?? null;
  } catch {
    return null;
  }
}

export function pickField<T>(post: { [k: string]: unknown }, base: string, locale: Locale): T | null {
  return (post[`${base}_${locale}`] as T) ?? (post[`${base}_el`] as T) ?? null;
}
