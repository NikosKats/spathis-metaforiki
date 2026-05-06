/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils';

// Brand logo for the BrandLamp section. Renders just the PNG (no SVG
// fallback / no inline circle). The wordmark + subtitle below stay as
// inline text styled to approximate the original italic display type.

type Variant = 'light' | 'dark';

const PALETTE: Record<Variant, { word: string; sub: string }> = {
  light: { word: 'var(--ink)', sub: 'var(--brand)' },
  dark: { word: '#ffffff', sub: '#ffffff' },
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
      <img
        src="/logo-mark.png"
        alt="ΣΠΑΘΗΣ"
        className={cn('block w-full object-contain', markOnly ? '' : 'mb-4')}
        style={{ aspectRatio: '1 / 1' }}
      />
      {!markOnly && withWordmark && (
        <div className="flex flex-col items-center w-full">
          <Wordmark color={c.word} />
          <Subtitle color={c.sub} />
        </div>
      )}
    </div>
  );
}

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
