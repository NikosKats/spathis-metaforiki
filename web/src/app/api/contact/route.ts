import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { getResend, RESEND_FROM, ADMIN_NOTIFICATION_EMAIL } from '@/lib/email/resend';
import { contactNotificationEmail, userAutoReplyEmail } from '@/lib/email/templates';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation_failed', issues: parsed.error.issues }, { status: 422 });
  }
  const input = parsed.data;

  // Honeypot — silently accept and drop
  if (input.website && input.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Persist (best-effort — log if env vars not configured)
  const userAgent = request.headers.get('user-agent') ?? null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const sb = createAdminClient();
      await sb.from('contact_submissions').insert({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        message: input.message,
        language: input.language,
        user_agent: userAgent,
      });
    } catch (err) {
      console.error('contact_submissions insert failed', err);
    }
  } else {
    console.warn('Supabase not configured — skipping contact_submissions insert');
  }

  // Notify admin + auto-reply (best-effort)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = getResend();
      const notification = contactNotificationEmail(input);
      await resend.emails.send({
        from: RESEND_FROM,
        to: ADMIN_NOTIFICATION_EMAIL,
        replyTo: input.email,
        subject: notification.subject,
        html: notification.html,
      });
      const autoReply = userAutoReplyEmail(input.name, input.language);
      await resend.emails.send({
        from: RESEND_FROM,
        to: input.email,
        subject: autoReply.subject,
        html: autoReply.html,
      });
    } catch (err) {
      console.error('Resend send failed', err);
    }
  } else {
    console.warn('Resend not configured — skipping email notification');
  }

  return NextResponse.json({ ok: true });
}
