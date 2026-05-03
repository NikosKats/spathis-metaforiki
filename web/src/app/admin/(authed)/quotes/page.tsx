import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

type Row = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  cargo_type: 'full_load' | 'container' | 'haulage' | 'other';
  origin: string;
  destination: string;
  status: 'new' | 'quoted' | 'won' | 'lost' | 'spam';
  created_at: string;
};

async function getQuotes(): Promise<Row[]> {
  if (!isConfigured()) return [];
  try {
    const sb = await createClient();
    const { data } = await sb
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    return (data ?? []) as Row[];
  } catch {
    return [];
  }
}

const cargoLabel: Record<Row['cargo_type'], string> = {
  full_load: 'Full load',
  container: 'Container',
  haulage: 'Haulage',
  other: 'Other',
};

export default async function QuotesList() {
  const rows = await getQuotes();

  return (
    <div className="px-6 py-10 sm:px-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Quote requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? 'request' : 'requests'}
          </p>
        </div>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
        {rows.length === 0 ? (
          <div className="px-8 py-20 text-center text-sm text-muted-foreground">No quote requests yet.</div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/quotes/${r.id}`}
                  className="group flex items-center gap-4 px-6 py-4 transition hover:bg-secondary"
                >
                  <StatusBadge status={r.status} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-ink">{r.name}</span>
                        {r.company && (
                          <span className="text-xs text-muted-foreground">· {r.company}</span>
                        )}
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink/70">
                          {cargoLabel[r.cargo_type]}
                        </span>
                      </div>
                      <time className="flex-shrink-0 text-xs text-muted-foreground tabular-nums">
                        {new Date(r.created_at).toLocaleString('el-GR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </time>
                    </div>
                    <div className="mt-1.5 text-sm text-ink/75">
                      <span className="font-medium">{r.origin}</span>
                      <span className="mx-2 text-muted-foreground">→</span>
                      <span className="font-medium">{r.destination}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Row['status'] }) {
  const styles = {
    new: 'bg-[var(--brand)]/10 text-[var(--brand)]',
    quoted: 'bg-amber-50 text-amber-700',
    won: 'bg-emerald-50 text-emerald-700',
    lost: 'bg-zinc-100 text-zinc-500',
    spam: 'bg-zinc-100 text-zinc-400',
  } as const;
  return (
    <span
      className={`inline-flex h-5 flex-shrink-0 items-center gap-1 rounded-full px-2 text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {status}
    </span>
  );
}
