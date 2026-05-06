/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils';

// Brand mark used in the header. Renders the official PNG from /public.
// Drop these into web/public to override:
//   /logo-mark.png         — used in the header (light surfaces)
//   /logo-mark-light.png   — used when `inverted` is true (dark surfaces)

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
      <img
        src={markSrc}
        alt="ΣΠΑΘΗΣ"
        className="h-13 w-13 flex-shrink-0 object-contain"
        style={{ height: 52, width: 52 }}
      />
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
