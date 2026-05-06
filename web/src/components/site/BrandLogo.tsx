import { cn } from '@/lib/utils';

// Refined SVG version of the ΣΠΑΘΗΣ Μεταφορική Κεφαλονιάς logo.
// Two variants: `light` (dark mark, dark text — for white backgrounds) and
// `dark` (red mark, white text — for the lamp / dark hero strips).
// Width-driven; height auto. Use `markOnly` to render just the disc.

type Variant = 'light' | 'dark';

const PALETTE: Record<Variant, { disc: string; mark: string; word: string; sub: string }> = {
  light: {
    disc: 'var(--ink)',
    mark: 'var(--brand)',
    word: 'var(--ink)',
    sub: 'var(--brand)',
  },
  dark: {
    disc: 'var(--brand)',
    mark: '#ffffff',
    word: '#ffffff',
    sub: '#ffffff',
  },
};

export function BrandLogo({
  variant = 'light',
  size = 280,
  className,
  withWordmark = true,
  markOnly = false,
}: {
  variant?: Variant;
  size?: number;
  className?: string;
  withWordmark?: boolean;
  markOnly?: boolean;
}) {
  const c = PALETTE[variant];

  return (
    <div className={cn('flex flex-col items-center', className)} style={{ width: size }}>
      <SigmaArrowDisc disc={c.disc} mark={c.mark} className={markOnly ? '' : 'mb-4'} />
      {!markOnly && withWordmark && (
        <div className="flex flex-col items-center w-full">
          <Wordmark color={c.word} />
          <Subtitle color={c.sub} />
        </div>
      )}
    </div>
  );
}

/* The Σ-as-double-arrow mark inside a disc.
   Shape decomposition (viewBox 0 0 100 100):
   - Top right-pointing chevron arrow with a horizontal tail going left.
   - A diagonal connector from the top-arrow's underside down-left to the
     bottom-arrow's left end (mirrors the Σ diagonal).
   - Bottom right-pointing chevron arrow with a horizontal tail going right.
   Combined, the silhouette reads as Σ AND as forward motion. */
function SigmaArrowDisc({
  disc,
  mark,
  className,
}: {
  disc: string;
  mark: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block w-full', className)}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="50" fill={disc} />
      <path
        d="
          M 22 28
          L 56 28
          L 56 22
          L 78 38
          L 56 46
          L 56 41
          L 39 41
          L 22 60
          L 56 60
          L 56 55
          L 78 62
          L 56 78
          L 56 72
          L 22 72
          Z
        "
        fill={mark}
      />
    </svg>
  );
}

/* Custom inline wordmark — heavy, slightly oblique. We could embed a real
   font file later; for now Inter at 800 weight with extra tracking gives a
   close match to the original chunky display type. */
function Wordmark({ color }: { color: string }) {
  return (
    <div
      className="font-extrabold leading-none"
      style={{
        color,
        fontSize: 'min(72px, 22cqw)',
        letterSpacing: '0.02em',
        fontStyle: 'italic',
        transform: 'skewX(-5deg)',
      }}
    >
      ΣΠΑΘΗΣ
    </div>
  );
}

function Subtitle({ color }: { color: string }) {
  return (
    <div
      className="font-medium leading-none mt-2"
      style={{
        color,
        fontSize: 'min(14px, 4.5cqw)',
        letterSpacing: '0.28em',
      }}
    >
      ΜΕΤΑΦΟΡΙΚΗ&nbsp;&nbsp;ΚΕΦΑΛΟΝΙΑΣ
    </div>
  );
}
