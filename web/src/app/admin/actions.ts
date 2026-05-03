'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function signInAction(formData: FormData) {
  if (!isConfigured()) return { error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.' };

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Email and password required.' };

  const sb = await createClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect('/admin');
}

export async function signOutAction() {
  if (!isConfigured()) redirect('/admin/login');
  const sb = await createClient();
  await sb.auth.signOut();
  redirect('/admin/login');
}

export async function updateContactStatus(id: string, status: 'new' | 'handled' | 'spam') {
  if (!isConfigured()) return { error: 'not_configured' };
  const sb = await createClient();
  const { error } = await sb.from('contact_submissions').update({ status }).eq('id', id);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function updateQuoteStatus(id: string, status: 'new' | 'quoted' | 'won' | 'lost' | 'spam') {
  if (!isConfigured()) return { error: 'not_configured' };
  const sb = await createClient();
  const { error } = await sb.from('quote_requests').update({ status }).eq('id', id);
  if (error) return { error: error.message };
  return { ok: true };
}
