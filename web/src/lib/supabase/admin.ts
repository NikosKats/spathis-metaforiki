// Lightweight Supabase REST client for the public form API routes.
// Avoids pulling in the full @supabase/supabase-js SDK (≈500 KB).
// Uses the publishable/anon key — RLS policies on the target tables allow
// anonymous INSERTs.

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

export async function supabaseInsert<T extends Record<string, unknown>>(
  table: string,
  row: T,
): Promise<{ ok: boolean; status: number; error?: string }> {
  if (!URL || !KEY) return { ok: false, status: 0, error: 'not_configured' };

  const res = await fetch(`${URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    return { ok: false, status: res.status, error };
  }
  return { ok: true, status: res.status };
}
