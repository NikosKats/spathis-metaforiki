import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ArrowLeft, Phone, Mail, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { updateContactStatus } from '@/app/admin/actions';

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
  user_agent: string | null;
  created_at: string;
};

async function getRow(id: string): Promise<Row | null> {
  if (!isConfigured()) return null;
  try {
    const sb = await createClient();
    const { data } = await sb.from('contact_submissions').select('*').eq('id', id).maybeSingle();
    return (data as Row | null) ?? null;
  } catch {
    return null;
  }
}

export default async function SubmissionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getRow(id);
  if (!row) notFound();

  async function setStatus(formData: FormData) {
    'use server';
    const status = formData.get('status') as Row['status'];
    await updateContactStatus(row!.id, status);
    revalidatePath('/admin/submissions');
    redirect('/admin/submissions');
  }

  return (
    <div className="px-6 py-10 sm:px-10">
      <Link
        href="/admin/submissions"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to submissions
      </Link>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-white p-8">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {row.language === 'el' ? 'Ελληνικά' : 'English'}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <time className="text-xs text-muted-foreground">
                {new Date(row.created_at).toLocaleString('el-GR', { dateStyle: 'long', timeStyle: 'short' })}
              </time>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">{row.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <a href={`mailto:${row.email}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                <Mail className="h-3.5 w-3.5" />
                {row.email}
              </a>
              {row.phone && (
                <a href={`tel:${row.phone}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                  <Phone className="h-3.5 w-3.5" />
                  {row.phone}
                </a>
              )}
            </div>
            <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-ink/85">{row.message}</div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Status</h2>
            <p className="mt-3 text-sm text-ink">{row.status}</p>
            <form action={setStatus} className="mt-5 grid gap-2">
              {(['new', 'handled', 'spam'] as const).map((s) => (
                <button
                  key={s}
                  type="submit"
                  name="status"
                  value={s}
                  disabled={s === row.status}
                  className="flex items-center justify-center rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-ink/30 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Mark as {s}
                </button>
              ))}
            </form>
          </div>

          {row.user_agent && (
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Meta</h2>
              <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span className="font-mono break-all">{row.user_agent}</span>
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
