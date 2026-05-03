import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LogoMark } from './LogoMark';

export function SiteFooter() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');

  return (
    <footer id="contact" className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                <span className="text-[var(--brand)] text-xl font-black leading-none -tracking-tight">Σ</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-extrabold tracking-tight">ΣΠΑΘΗΣ</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">Μεταφορική</span>
              </div>
            </div>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">{t('tagline')}</p>
            <ul className="mt-8 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand)]" />
                <span>{t('address')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand)]" />
                <span>{t('hours')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand)]" />
                <span className="space-x-3 tabular-nums">
                  <a href="tel:+306938255178" className="hover:text-white">6938 255 178</a>
                  <span className="text-white/40">·</span>
                  <a href="tel:+306943450557" className="hover:text-white">6943 450 557</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand)]" />
                <a href="mailto:aspathis@hotmail.gr" className="hover:text-white">aspathis@hotmail.gr</a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand)]" />
                <span className="space-x-3">
                  <a href="https://wa.me/306938255178" className="hover:text-white">WhatsApp</a>
                  <span className="text-white/40">·</span>
                  <a href="viber://chat?number=%2B306938255178" className="hover:text-white">Viber</a>
                </span>
              </li>
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <FooterCol title={t('services')}>
              <a href="#services">{tNav('services')}</a>
              <a href="#routes">{tNav('routes')}</a>
              <a href="#process">{tNav('process')}</a>
              <a href="#quote">{tNav('quote')}</a>
            </FooterCol>
            <FooterCol title={t('company')}>
              <a href="#">{tNav('about')}</a>
              <a href="#">{tNav('blog')}</a>
              <a href="#contact">{tNav('contact')}</a>
            </FooterCol>
            <FooterCol title={t('legal')}>
              <a href="/privacy">{t('privacy')}</a>
              <a href="/terms">{t('terms')}</a>
            </FooterCol>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} ΣΠΑΘΗΣ — Μεταφορική Κεφαλονιάς. {t('rights')}</span>
          <span className="font-mono text-xs uppercase tracking-wider">spathismetaforiki.gr</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">
        {Array.isArray(children) ? (
          children.map((c, i) => (
            <li key={i} className="text-white/80 transition hover:text-white [&>a]:hover:text-white">
              {c}
            </li>
          ))
        ) : (
          <li className="text-white/80 [&>a]:hover:text-white">{children}</li>
        )}
      </ul>
    </div>
  );
}
