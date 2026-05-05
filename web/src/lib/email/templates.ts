import type { ContactInput, QuoteInput } from '@/lib/schemas';

const escape = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const wrap = (title: string, body: string) => `<!doctype html>
<html lang="el"><head><meta charset="utf-8"><title>${escape(title)}</title></head>
<body style="margin:0;padding:0;background:#f8f7f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#190602;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f6;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
        <tr><td style="background:#c8102e;padding:24px 32px;">
          <div style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">ΣΠΑΘΗΣ — Μεταφορική</div>
          <div style="color:#ffffff;font-size:20px;font-weight:800;margin-top:6px;">${escape(title)}</div>
        </td></tr>
        <tr><td style="padding:32px;">${body}</td></tr>
        <tr><td style="background:#190602;padding:18px 32px;color:#ffffff80;font-size:12px;text-align:center;">metaforikikefalonias.gr · Σκάλα Κεφαλονιάς</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const row = (label: string, value: unknown) =>
  value === undefined || value === null || value === ''
    ? ''
    : `<tr>
        <td style="padding:8px 0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#190602a0;width:38%;vertical-align:top;">${escape(label)}</td>
        <td style="padding:8px 0;font-size:15px;color:#190602;line-height:1.55;">${escape(value)}</td>
      </tr>`;

export function contactNotificationEmail(input: ContactInput) {
  const body = `
    <div style="font-size:15px;color:#190602b0;margin-bottom:18px;">Νέο μήνυμα από τη φόρμα επικοινωνίας στο metaforikikefalonias.gr.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e7e5e4;">
      ${row('Ονοματεπώνυμο', input.name)}
      ${row('Email', input.email)}
      ${row('Τηλέφωνο', input.phone)}
      ${row('Γλώσσα', input.language === 'el' ? 'Ελληνικά' : 'English')}
      ${row('Μήνυμα', input.message)}
    </table>
    <div style="margin-top:24px;font-size:12px;color:#190602a0;">Απαντήστε απευθείας σε αυτό το email για να επικοινωνήσετε με τον αποστολέα.</div>
  `;
  return {
    subject: `Νέο μήνυμα: ${input.name}`,
    html: wrap('Νέο μήνυμα επικοινωνίας', body),
  };
}

const cargoLabel = (t: QuoteInput['cargoType']) =>
  ({ full_load: 'Συμπαγές φορτίο', container: 'Container', haulage: 'Τρακτόρευση', other: 'Άλλο' })[t];

export function quoteNotificationEmail(input: QuoteInput) {
  const body = `
    <div style="font-size:15px;color:#190602b0;margin-bottom:18px;">Νέο αίτημα προσφοράς από τη φόρμα του metaforikikefalonias.gr.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e7e5e4;">
      ${row('Ονοματεπώνυμο', input.name)}
      ${row('Εταιρεία', input.company)}
      ${row('Email', input.email)}
      ${row('Τηλέφωνο', input.phone)}
      ${row('Τύπος φορτίου', cargoLabel(input.cargoType))}
      ${row('Από', input.origin)}
      ${row('Προς', input.destination)}
      ${row('Βάρος (kg)', input.weightKg)}
      ${row('Όγκος (m³)', input.volumeM3)}
      ${row('Παραλαβή', input.pickupDate)}
      ${row('Παράδοση', input.deliveryDate)}
      ${row('Σημειώσεις', input.notes)}
      ${row('Γλώσσα', input.language === 'el' ? 'Ελληνικά' : 'English')}
    </table>
  `;
  return {
    subject: `Νέο αίτημα προσφοράς: ${input.origin} → ${input.destination}`,
    html: wrap('Νέο αίτημα προσφοράς', body),
  };
}

export function userAutoReplyEmail(name: string, language: 'el' | 'en') {
  const subject =
    language === 'el'
      ? 'Λάβαμε το μήνυμά σας — ΣΠΑΘΗΣ Μεταφορική'
      : 'We received your message — SPATHIS Logistics';
  const body =
    language === 'el'
      ? `<div style="font-size:16px;line-height:1.6;color:#190602;">
          Γεια σας ${escape(name)},<br><br>
          Λάβαμε το μήνυμά σας. Θα επικοινωνήσουμε μαζί σας εντός 24 ωρών για να σας απαντήσουμε ή να σας στείλουμε προσφορά.<br><br>
          Για κάτι επείγον, μπορείτε να καλέσετε στο <strong>6938 255 178</strong> ή <strong>6943 450 557</strong>.<br><br>
          Με εκτίμηση,<br>
          <strong>Σπάθης Θανάσης</strong><br>
          ΣΠΑΘΗΣ — Μεταφορική Κεφαλονιάς
        </div>`
      : `<div style="font-size:16px;line-height:1.6;color:#190602;">
          Hello ${escape(name)},<br><br>
          We've received your message. We'll get back to you within 24 hours with a reply or a quote.<br><br>
          For anything urgent, please call <strong>+30 6938 255 178</strong> or <strong>+30 6943 450 557</strong>.<br><br>
          Best regards,<br>
          <strong>Spathis Thanasis</strong><br>
          SPATHIS — Kefalonia Logistics
        </div>`;
  return { subject, html: wrap(subject, body) };
}
