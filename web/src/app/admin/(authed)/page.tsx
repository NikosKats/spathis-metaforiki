import Link from 'next/link';
import { Inbox, FileText, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

async function getCounts() {
  if (!isConfigured()) return null;
  try {
    const sb = await createClient();
    const [contacts, contactsNew, quotes, quotesNew] = await Promise.all([
      sb.from('contact_submissions').select('id', { count: 'exact', head: true }),
      sb.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      sb.from('quote_requests').select('id', { count: 'exact', head: true }),
      sb.from('quote_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    ]);
    return {
      contacts: contacts.count ?? 0,
      contactsNew: contactsNew.count ?? 0,
      quotes: quotes.count ?? 0,
      quotesNew: quotesNew.count ?? 0,
    };
  } catch {
    return null;
  }
}

export default async function Dashboard() {
  const counts = await getCounts();

  return (
    <div className="px-6 py-10 sm:px-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of recent leads.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card
          title="Contact submissions"
          icon={Inbox}
          total={counts?.contacts ?? 0}
          unread={counts?.contactsNew ?? 0}
          href="/admin/submissions"
        />
        <Card
          title="Quote requests"
          icon={FileText}
          total={counts?.quotes ?? 0}
          unread={counts?.quotesNew ?? 0}
          href="/admin/quotes"
        />
      </div>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  total,
  unread,
  href,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  total: number;
  unread: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-[var(--brand)]">
          <Icon className="h-4 w-4" />
        </div>
        {unread > 0 && (
          <span className="rounded-full bg-[var(--brand)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {unread} new
          </span>
        )}
      </div>
      <div>
        <div className="text-3xl font-extrabold tracking-tight text-ink tabular-nums">{total}</div>
        <div className="mt-1 text-sm font-medium text-muted-foreground">{title}</div>
      </div>
      <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
        Open
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
