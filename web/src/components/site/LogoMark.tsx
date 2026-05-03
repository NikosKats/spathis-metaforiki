import { cn } from '@/lib/utils';

// Approximation of the brand mark — a "Σ" stylised as a forward chevron
// inside a dark disc. Replace with the official vector when the client
// provides the source file (see brief/architecture.md).
export function LogoMark({
  className,
  withWordmark = true,
  inverted = false,
}: {
  className?: string;
  withWordmark?: boolean;
  inverted?: boolean;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <SigmaArrowMark className={cn('h-9 w-9', inverted ? 'text-white' : 'text-ink')} />
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
      className={className}
      aria-hidden="true"
    >
      <circle cx="18" cy="18" r="18" fill="currentColor" />
      {/* Σ-shaped arrow: top bar pointing right, diagonal back, bottom bar pointing right */}
      <path
        d="M10.5 11.5 L23.5 11.5 L20.5 14 L13.5 14 L17.5 17.5 L13.5 21.5 L20.5 21.5 L23.5 24 L10.5 24 Z"
        fill="var(--brand)"
      />
      <path
        d="M21.2 9.4 L26 13.5 L21.2 13.5 Z"
        fill="var(--brand)"
        opacity="0.95"
      />
      <path
        d="M21.2 22.5 L26 22.5 L21.2 26.6 Z"
        fill="var(--brand)"
        opacity="0.95"
      />
    </svg>
  );
}
