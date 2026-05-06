import { cn } from '@/lib/utils';
import { PngOverlay } from './PngOverlay';

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
  // If the client provides a real raster logo at /public/logo-mark.png it
  // will overlay (and fully cover) the inline SVG fallback. When the file
  // doesn't exist the onError handler hides the broken <img> and the SVG
  // shows through. Drop both `/logo-mark.png` and `/logo-mark-light.png`
  // (or just one) into web/public to override.
  return (
    <div className={cn('relative aspect-square w-full', className)}>
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-full w-full"
        aria-hidden="true"
      >
      <circle cx="50" cy="50" r="50" fill={disc} />
      {/* Refined Σ-as-double-arrow path:
          - Upper bar (x ≈ 17 → 60) + right-pointing chevron (extends to x ≈ 82)
          - Diagonal slope from top-bar's right end down-left to bottom-bar's left
          - Lower bar mirrors upper (x ≈ 17 → 60 + chevron to x ≈ 82)
          - Chevron has a 4px stepped flange (taller than the body), matching
            the chunky look of the original mark. */}
      <path
        d="
          M 17 27
          L 58 27
          L 58 22
          L 82 36
          L 58 44
          L 58 39
          L 38 39
          L 17 61
          L 58 61
          L 58 56
          L 82 65
          L 58 78
          L 58 73
          L 17 73
          Z
        "
        fill={mark}
      />
      </svg>
      <PngOverlay src="/logo-mark.png" />
    </div>
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
