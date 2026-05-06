import { cn } from '@/lib/utils';
import { PngOverlay } from './PngOverlay';

// Brand mark used in the header and dark footer.
// Renders the official PNG from /public when present, falling back to an
// inline SVG approximation if the file is missing. Drop these into web/public:
//   /logo-mark.png   — disc + Σ-arrow only (used in the small header lockup)
//   /logo-full.png   — full lockup (disc + ΣΠΑΘΗΣ wordmark + subtitle)
// `inverted` switches to the dark-background variant (white wordmark) and
// also tries `/logo-mark-light.png` + `/logo-full-light.png` first.

export function LogoMark({
  className,
  withWordmark = true,
  inverted = false,
}: {
  className?: string;
  withWordmark?: boolean;
  inverted?: boolean;
}) {
  const markSrc = inverted ? '/logo-mark-light.png' : '/logo-mark.png';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Bumped from 36px → 52px so the PNG's internal padding doesn't make
          the visible disc look small next to the wordmark. */}
      <div className="relative h-13 w-13 flex-shrink-0" style={{ height: 52, width: 52 }}>
        <SigmaArrowMark className={cn('h-full w-full', inverted ? 'text-white' : 'text-ink')} />
        <PngOverlay src={markSrc} />
      </div>
      {/* PngOverlay only renders if the file exists; otherwise the SVG above shows through. */}
      {withWordmark && (
        <div className="flex flex-col leading-tight">
          <span
            className={cn(
              'text-base font-extrabold tracking-tight',
              inverted ? 'text-white' : 'text-ink',
            )}
          >
            ΣΠΑΘΗΣ
          </span>
          <span
            className={cn(
              'text-[10px] font-medium uppercase tracking-[0.18em]',
              inverted ? 'text-white/60' : 'text-muted-foreground',
            )}
          >
            Μεταφορική
          </span>
        </div>
      )}
    </div>
  );
}

function SigmaArrowMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('absolute inset-0', className)}
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="18" fill="currentColor" />
      <path
        d="M10.5 11.5 L23.5 11.5 L20.5 14 L13.5 14 L17.5 17.5 L13.5 21.5 L20.5 21.5 L23.5 24 L10.5 24 Z"
        fill="var(--brand)"
      />
      <path d="M21.2 9.4 L26 13.5 L21.2 13.5 Z" fill="var(--brand)" opacity="0.95" />
      <path d="M21.2 22.5 L26 22.5 L21.2 26.6 Z" fill="var(--brand)" opacity="0.95" />
    </svg>
  );
}
