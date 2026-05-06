/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils';

// Renders the full official ΣΠΑΘΗΣ lockup — disc + Σ-arrow on top,
// "ΣΠΑΘΗΣ" wordmark below in the brand's italic display style, then the
// "ΜΕΤΑΦΟΡΙΚΗ ΚΕΦΑΛΟΝΙΑΣ" subtitle. Optionally followed by the contact
// strap (address + phones + email) the way the printed business card does.
//
// If the client drops the SINGLE-image official lockup at
// /public/logo-full.png it overrides everything and renders just that PNG.

export function FullLockup({
  className,
  width = 320,
  withContact = false,
  variant = 'light',
}: {
  className?: string;
  width?: number;
  withContact?: boolean;
  variant?: 'light' | 'dark';
}) {
  const wordColor = variant === 'dark' ? '#ffffff' : 'var(--ink)';
  const subColor = variant === 'dark' ? '#ffffff' : 'var(--brand)';
  const contactColor = variant === 'dark' ? 'rgba(255,255,255,0.85)' : 'var(--ink)';

  return (
    <div
      className={cn('flex flex-col items-center text-center', className)}
      style={{ width }}
    >
      <img
        src="/logo-mark.png"
        alt="ΣΠΑΘΗΣ"
        className="block w-[60%] object-contain"
        style={{ aspectRatio: '1 / 1' }}
      />
      <div
        className="mt-3 font-extrabold leading-none"
        style={{
          color: wordColor,
          fontSize: width * 0.22,
          letterSpacing: '0.02em',
          fontStyle: 'italic',
          transform: 'skewX(-5deg)',
        }}
      >
        ΣΠΑΘΗΣ
      </div>
      <div
        className="mt-2 font-medium leading-none"
        style={{
          color: subColor,
          fontSize: width * 0.045,
          letterSpacing: '0.28em',
        }}
      >
        ΜΕΤΑΦΟΡΙΚΗ&nbsp;&nbsp;ΚΕΦΑΛΟΝΙΑΣ
      </div>
      {withContact && (
        <div
          className="mt-8 leading-relaxed"
          style={{ color: contactColor, fontSize: width * 0.04, letterSpacing: '0.16em' }}
        >
          <div className="font-bold uppercase">ΣΚΑΛΑ ΚΕΦΑΛΟΝΙΑΣ</div>
          <div className="mt-1 font-semibold">
            <span className="opacity-70">T:</span>{' '}
            <a href="tel:+306943450557" className="hover:underline tabular-nums">
              6943 450 557
            </a>
            ,{' '}
            <a href="tel:+306938255178" className="hover:underline tabular-nums">
              6938 255 178
            </a>
          </div>
          <div className="mt-1 font-semibold uppercase">
            <span className="opacity-70">E:</span>{' '}
            <a href="mailto:aspathis@hotmail.gr" className="hover:underline">
              ASPATHIS@HOTMAIL.GR
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
