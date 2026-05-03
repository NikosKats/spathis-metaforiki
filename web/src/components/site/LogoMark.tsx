import { cn } from '@/lib/utils';

export function LogoMark({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-ink shadow-sm">
        <span className="text-[var(--brand)] text-xl font-black leading-none -tracking-tight">Σ</span>
      </div>
      {withWordmark && (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-extrabold tracking-tight text-ink">ΣΠΑΘΗΣ</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Μεταφορική
          </span>
        </div>
      )}
    </div>
  );
}
