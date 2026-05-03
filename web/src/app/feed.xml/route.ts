import { getPublishedPosts, pickField } from '@/lib/blog';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://spathismetaforiki.gr';

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET() {
  const posts = await getPublishedPosts();
  const updated = posts[0]?.published_at ?? new Date().toISOString();

  const items = posts
    .map((p) => {
      const title = pickField<string>(p, 'title', 'el') ?? '';
      const excerpt = pickField<string>(p, 'excerpt', 'el') ?? '';
      const link = `${SITE}/blog/${p.slug}`;
      return `
    <item>
      <title>${escape(title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${p.published_at ? new Date(p.published_at).toUTCString() : ''}</pubDate>
      <description>${escape(excerpt)}</description>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ΣΠΑΘΗΣ — Μεταφορική Κεφαλονιάς</title>
    <link>${SITE}</link>
    <description>Νέα και ενημερώσεις από τη ΣΠΑΘΗΣ Μεταφορική.</description>
    <language>el-GR</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
