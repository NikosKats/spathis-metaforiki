import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Inbox, FileText, LayoutDashboard, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { signOutAction } from '../actions';

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function AuthedAdminLayout({ children }: { children: React.ReactNode }) {
  if (isConfigured()) {
    const sb = await createClient();
    const { data } = await sb.auth.getUser();
    if (!data.user) redirect('/admin/login');
    // Optional: enforce admin_users table membership
    const { data: admin } = await sb
      .from('admin_users')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle();
    if (!admin) redirect('/admin/login');
  } else {
    // Without Supabase configured, gate the area but render with a banner
    // so the developer can still see the UI shell.
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-border bg-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[var(--brand)]">
            <span className="text-base font-black -tracking-tight">Σ</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight text-ink">ΣΠΑΘΗΣ</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Admin
            </span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5">
          <NavLink href="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavLink href="/admin/submissions" icon={Inbox} label="Submissions" />
          <NavLink href="/admin/quotes" icon={FileText} label="Quotes" />
        </nav>
        <form action={signOutAction} className="border-t border-border p-3">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-ink"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        {!isConfigured() && (
          <div className="bg-amber-50 px-6 py-2.5 text-center text-xs font-semibold text-amber-900">
            Supabase not configured — admin shell rendering without data. Set env vars in web/.env.local.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-ink"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
