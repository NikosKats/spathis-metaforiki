import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { renderOgImage, ogContentType, ogImageSize } from '@/lib/og';
import { getService } from '@/lib/services-config';

export const runtime = 'edge';
export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Service';

export default async function OG({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const cfg = getService(slug);
  if (!cfg) notFound();
  const t = await getTranslations({ locale, namespace: 'ServiceDetail' });
  return renderOgImage({
    eyebrow: t(`${cfg.msgKey}Eyebrow`),
    title: t(`${cfg.msgKey}Title`),
    subtitle: t(`${cfg.msgKey}Subtitle`),
  });
}
