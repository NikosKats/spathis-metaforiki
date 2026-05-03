import { getTranslations } from 'next-intl/server';
import { renderOgImage, ogContentType, ogImageSize } from '@/lib/og';

export const runtime = 'edge';
export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'ΣΠΑΘΗΣ — Μεταφορική Κεφαλονιάς';

export default async function OG({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Hero' });
  return renderOgImage({
    eyebrow: t('eyebrow'),
    title: t('title'),
    subtitle: t('subtitle'),
  });
}
