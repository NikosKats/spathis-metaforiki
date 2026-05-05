import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

type Row = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  language: 'el' | 'en';
  status: 'new' | 'handled' | 'spam';
  created_at: string;
};

async function getSubmissions(): Promise<Row[]> {
  if (!isConfigured()) return [];
  try {
    const sb = await createClient();
    const { data } = await sb
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    return (data ?? []) as Row[];
  } catch {
    return [];
  }
}

export default async function SubmissionsList() {
  const rows = await getSubmissions();

  return (
    <div className="px-6 py-10 sm:px-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Contact submissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? 'message' : 'messages'}
          </p>
        </div>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
        {rows.length === 0 ? (
          <div className="px-8 py-20 text-center text-sm text-muted-foreground">
            No submissions yet.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/submissions/${r.id}`}
                  className="group flex items-start gap-4 px-6 py-4 transition hover:bg-secondary"
                >
                  <StatusBadge status={r.status} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">{r.name}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{r.email}</span>
                      </div>
                      <time className="flex-shrink-0 text-xs text-muted-foreground tabular-nums">
                        {new Date(r.created_at).toLocaleString('el-GR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </time>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-ink/75">{r.message}</p>
                  </div>
                  <ArrowRight className="mt-2 h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
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
    handled: 'bg-emerald-50 text-emerald-700',
    spam: 'bg-zinc-100 text-zinc-500',
  } as const;
  return (
    <span
      className={`mt-1 inline-flex h-5 flex-shrink-0 items-center gap-1 rounded-full px-2 text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {status}
    </span>
  );
}
