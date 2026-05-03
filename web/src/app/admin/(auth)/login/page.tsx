import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from './LoginForm';

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function LoginPage() {
  if (isConfigured()) {
    const sb = await createClient();
    const { data } = await sb.auth.getUser();
    if (data.user) redirect('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-[var(--brand)]">
            <span className="text-2xl font-black -tracking-tight">Σ</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink">ΣΠΑΘΗΣ Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage submissions and quotes.
          </p>
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-white p-7 shadow-sm">
          <LoginForm configured={isConfigured()} />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          ΣΠΑΘΗΣ — Μεταφορική Κεφαλονιάς
        </p>
      </div>
    </div>
  );
}
