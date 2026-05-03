import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { updateQuoteStatus } from '@/app/admin/actions';

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
  weight_kg: number | null;
  volume_m3: number | null;
  pickup_date: string | null;
  delivery_date: string | null;
  notes: string | null;
  language: 'el' | 'en';
  status: 'new' | 'quoted' | 'won' | 'lost' | 'spam';
  user_agent: string | null;
  created_at: string;
};

async function getRow(id: string): Promise<Row | null> {
  if (!isConfigured()) return null;
  try {
    const sb = await createClient();
    const { data } = await sb.from('quote_requests').select('*').eq('id', id).maybeSingle();
    return (data as Row | null) ?? null;
  } catch {
    return null;
  }
}

const cargoLabel: Record<Row['cargo_type'], string> = {
  full_load: 'Full load',
  container: 'Container',
  haulage: 'Tractor haulage',
  other: 'Other',
};

export default async function QuoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getRow(id);
  if (!row) notFound();

  async function setStatus(formData: FormData) {
    'use server';
    const status = formData.get('status') as Row['status'];
    await updateQuoteStatus(row!.id, status);
    revalidatePath('/admin/quotes');
    redirect('/admin/quotes');
  }

  return (
    <div className="px-6 py-10 sm:px-10">
      <Link
        href="/admin/quotes"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to quotes
      </Link>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-white p-8">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink/70">
                {cargoLabel[row.cargo_type]}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <time className="text-xs text-muted-foreground">
                {new Date(row.created_at).toLocaleString('el-GR', { dateStyle: 'long', timeStyle: 'short' })}
              </time>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">{row.name}</h1>
            {row.company && <p className="mt-1 text-sm text-muted-foreground">{row.company}</p>}
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
            <div className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Field label="Origin" value={row.origin} />
              <Field label="Destination" value={row.destination} />
              {row.weight_kg !== null && <Field label="Weight" value={`${row.weight_kg} kg`} />}
              {row.volume_m3 !== null && <Field label="Volume" value={`${row.volume_m3} m³`} />}
              {row.pickup_date && <Field label="Pickup" value={row.pickup_date} />}
              {row.delivery_date && <Field label="Delivery" value={row.delivery_date} />}
            </div>
            {row.notes && (
              <div className="mt-8 rounded-2xl bg-secondary p-5 text-sm leading-relaxed text-ink/85 whitespace-pre-wrap">
                {row.notes}
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Status</h2>
          <p className="mt-3 text-sm text-ink">{row.status}</p>
          <form action={setStatus} className="mt-5 grid gap-2">
            {(['new', 'quoted', 'won', 'lost', 'spam'] as const).map((s) => (
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
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
