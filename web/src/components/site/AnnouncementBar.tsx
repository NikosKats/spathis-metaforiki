import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AnnouncementBar() {
  const t = useTranslations('Announcement');
  return (
    <div className="bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-xs sm:text-sm">
        <span className="hidden h-1.5 w-1.5 rounded-full bg-[var(--brand)] sm:inline-block" />
        <span className="text-center text-white/85">{t('text')}</span>
        <a
          href="#quote"
          className="group hidden items-center gap-1 font-semibold text-white underline-offset-4 hover:underline sm:inline-flex"
        >
          {t('cta')}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
