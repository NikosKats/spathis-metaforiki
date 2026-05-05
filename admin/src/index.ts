// Standalone admin worker for ΣΠΑΘΗΣ.
// Single static HTML page + vanilla JS that talks to Supabase directly (auth +
// queries). RLS already gates everything to admin_users on the server side, so
// the public anon key in the page is safe.
//
// Bundle: ~6 KiB → fits easily in any Cloudflare Workers plan.

const SUPABASE_URL = 'https://ujjhzepejonpprtdgahb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_R5wm-cwoHS2VvCzSFoPuHQ_3Roy67aJ';

const HTML = `<!doctype html>
<html lang="el">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Admin · ΣΠΑΘΗΣ</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
  :root {
    --brand: #c8102e;
    --brand-strong: #a00c24;
    --ink: #190602;
    --surface: #f8f7f6;
    --muted: #b8b8b8;
    --border: #e7e5e4;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: var(--surface);
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
  }
  a { color: inherit; text-decoration: none; }
  button { font: inherit; cursor: pointer; border: 0; background: none; }
  input { font: inherit; }
  /* layout */
  .center { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
  .card.login { width: 100%; max-width: 380px; }
  .logo { width: 48px; height: 48px; border-radius: 999px; background: var(--ink); color: var(--brand); display: grid; place-items: center; font-weight: 900; font-size: 24px; margin: 0 auto 16px; }
  h1 { font-size: 22px; font-weight: 800; text-align: center; }
  .sub { color: #6b6661; text-align: center; margin-top: 4px; font-size: 14px; }
  label { display: block; margin-top: 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #6b6661; }
  input[type=email], input[type=password] { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 10px; margin-top: 6px; outline: 0; transition: border .15s; }
  input:focus { border-color: var(--ink); }
  .btn-primary { width: 100%; margin-top: 20px; padding: 12px; background: var(--brand); color: #fff; border-radius: 999px; font-weight: 700; transition: background .15s; }
  .btn-primary:hover { background: var(--brand-strong); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .err { margin-top: 12px; padding: 10px 12px; background: #fee; border: 1px solid #fcc; color: #900; border-radius: 10px; font-size: 13px; }
  /* shell */
  .shell { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
  @media (max-width: 720px) { .shell { grid-template-columns: 1fr; } .sidebar { display: none; } }
  .sidebar { background: #fff; border-right: 1px solid var(--border); padding: 20px 12px; }
  .brand { display: flex; align-items: center; gap: 10px; padding: 6px 8px 18px; }
  .brand-disc { width: 32px; height: 32px; border-radius: 999px; background: var(--ink); color: var(--brand); display: grid; place-items: center; font-weight: 900; font-size: 16px; }
  .brand-text small { display: block; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6661; }
  .brand-text strong { font-size: 14px; font-weight: 800; }
  .navlink { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px; color: #6b6661; font-weight: 500; font-size: 14px; transition: all .15s; cursor: pointer; }
  .navlink:hover, .navlink.active { background: var(--surface); color: var(--ink); }
  .navlink .dot { width: 6px; height: 6px; border-radius: 999px; background: var(--brand); margin-left: auto; opacity: 0; }
  .navlink.has-new .dot { opacity: 1; }
  .signout { margin-top: 18px; border-top: 1px solid var(--border); padding-top: 14px; }
  /* main */
  .main { padding: 28px clamp(16px, 4vw, 40px); max-width: 1100px; }
  header.page-head { display: flex; align-items: end; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  header.page-head h2 { font-size: 24px; font-weight: 800; }
  header.page-head .meta { color: #6b6661; font-size: 13px; }
  /* table-like list */
  .list { background: #fff; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .row { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start; padding: 14px 18px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background .12s; }
  .row:last-child { border-bottom: 0; }
  .row:hover { background: var(--surface); }
  .row .badge { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 7px; border-radius: 999px; height: 18px; }
  .badge.new { background: rgba(200,16,46,0.1); color: var(--brand); }
  .badge.handled, .badge.won { background: #ecfdf5; color: #047857; }
  .badge.quoted { background: #fef3c7; color: #92400e; }
  .badge.lost, .badge.spam { background: #f4f4f5; color: #71717a; }
  .row .who { font-weight: 600; font-size: 14px; color: var(--ink); }
  .row .who small { font-weight: 400; color: #6b6661; margin-left: 6px; font-size: 12px; }
  .row .preview { font-size: 13px; color: #525252; margin-top: 4px; line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .row time { font-size: 11px; color: #9c9c9c; white-space: nowrap; }
  .empty { padding: 60px 20px; text-align: center; color: #6b6661; font-size: 14px; }
  /* detail */
  .detail-grid { display: grid; grid-template-columns: 1fr 280px; gap: 20px; }
  @media (max-width: 720px) { .detail-grid { grid-template-columns: 1fr; } }
  .back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #6b6661; margin-bottom: 18px; }
  .back:hover { color: var(--ink); }
  .detail-head { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .detail-head h1 { font-size: 22px; font-weight: 700; margin-top: 6px; flex-basis: 100%; }
  .contact-line { display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; color: #525252; margin-top: 6px; }
  .body { white-space: pre-wrap; line-height: 1.6; font-size: 15px; color: #2e2e2e; margin-top: 24px; }
  .field { margin-top: 16px; }
  .field-label { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6661; }
  .field-value { font-weight: 600; font-size: 14px; margin-top: 3px; }
  .status-actions { display: flex; flex-direction: column; gap: 6px; }
  .status-btn { padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; font-size: 13px; font-weight: 600; text-align: left; transition: all .12s; background: #fff; }
  .status-btn:hover:not(:disabled) { border-color: var(--ink); background: var(--surface); }
  .status-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .denied { padding: 14px; background: #fef3c7; border: 1px solid #fde68a; color: #92400e; border-radius: 10px; font-size: 13px; margin-bottom: 14px; }
</style>
</head>
<body>
<div id="app"><div class="center"><p class="sub">Loading…</p></div></div>
<script>
const SUPABASE_URL = ${JSON.stringify(SUPABASE_URL)};
const SUPABASE_ANON_KEY = ${JSON.stringify(SUPABASE_ANON_KEY)};
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const app = document.getElementById('app');
const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const formatDate = (s) => s ? new Date(s).toLocaleString('el-GR', { dateStyle: 'short', timeStyle: 'short' }) : '';

const route = () => {
  const h = window.location.hash || '#submissions';
  const m = h.match(/^#(submissions|quotes|signin)(?:\\/(.+))?$/);
  return m ? { tab: m[1], id: m[2] || null } : { tab: 'submissions', id: null };
};

window.addEventListener('hashchange', render);

async function render() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return renderLogin();
  await renderShell(user);
}

function renderLogin() {
  app.innerHTML = \`
    <div class="center">
      <div class="card login">
        <div class="logo">Σ</div>
        <h1>ΣΠΑΘΗΣ Admin</h1>
        <p class="sub">Σύνδεση για διαχείριση μηνυμάτων &amp; προσφορών.</p>
        <form id="login">
          <label>Email</label>
          <input name="email" type="email" required autocomplete="email" />
          <label>Password</label>
          <input name="password" type="password" required autocomplete="current-password" />
          <button type="submit" class="btn-primary" id="submit">Σύνδεση</button>
          <div id="err"></div>
        </form>
      </div>
    </div>\`;
  document.getElementById('login').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const btn = document.getElementById('submit');
    const err = document.getElementById('err');
    btn.disabled = true; btn.textContent = 'Σύνδεση…'; err.innerHTML = '';
    const { error } = await sb.auth.signInWithPassword({ email: fd.get('email'), password: fd.get('password') });
    if (error) {
      err.innerHTML = '<div class="err">' + escapeHtml(error.message) + '</div>';
      btn.disabled = false; btn.textContent = 'Σύνδεση';
    } else {
      window.location.hash = '#submissions';
      render();
    }
  };
}

async function renderShell(user) {
  const { tab, id } = route();
  const [{ count: submissionsNew = 0 }, { count: quotesNew = 0 }] = await Promise.all([
    sb.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    sb.from('quote_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ]);

  app.innerHTML = \`
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-disc">Σ</div>
          <div class="brand-text"><strong>ΣΠΑΘΗΣ</strong><small>Admin</small></div>
        </div>
        <a class="navlink \${tab === 'submissions' ? 'active' : ''} \${submissionsNew > 0 ? 'has-new' : ''}" href="#submissions">📥 Μηνύματα<span class="dot"></span></a>
        <a class="navlink \${tab === 'quotes' ? 'active' : ''} \${quotesNew > 0 ? 'has-new' : ''}" href="#quotes">📋 Προσφορές<span class="dot"></span></a>
        <div class="signout"><button class="navlink" id="signout">↩ Αποσύνδεση</button></div>
      </aside>
      <main class="main" id="main"></main>
    </div>\`;
  document.getElementById('signout').onclick = async () => { await sb.auth.signOut(); render(); };

  if (id) {
    await renderDetail(tab, id);
  } else {
    await renderList(tab);
  }
}

async function renderList(tab) {
  const main = document.getElementById('main');
  const isQuotes = tab === 'quotes';
  const table = isQuotes ? 'quote_requests' : 'contact_submissions';
  const { data: rows, error } = await sb.from(table).select('*').order('created_at', { ascending: false }).limit(200);
  if (error) {
    main.innerHTML = \`<div class="denied">\${escapeHtml(error.message)} — βεβαιωθείτε ότι ο λογαριασμός σας είναι στο <code>admin_users</code>.</div>\`;
    return;
  }
  const renderRow = (r) => isQuotes ? \`
    <a class="row" href="#quotes/\${r.id}">
      <span class="badge \${r.status}">\${r.status}</span>
      <div>
        <div class="who">\${escapeHtml(r.name)} \${r.company ? '<small>' + escapeHtml(r.company) + '</small>' : ''}</div>
        <div class="preview">\${escapeHtml(r.origin)} → \${escapeHtml(r.destination)} · \${escapeHtml(cargoLabel(r.cargo_type))}</div>
      </div>
      <time>\${formatDate(r.created_at)}</time>
    </a>\` : \`
    <a class="row" href="#submissions/\${r.id}">
      <span class="badge \${r.status}">\${r.status}</span>
      <div>
        <div class="who">\${escapeHtml(r.name)} <small>\${escapeHtml(r.email)}</small></div>
        <div class="preview">\${escapeHtml(r.message)}</div>
      </div>
      <time>\${formatDate(r.created_at)}</time>
    </a>\`;
  main.innerHTML = \`
    <header class="page-head">
      <div>
        <h2>\${isQuotes ? 'Αιτήματα προσφοράς' : 'Μηνύματα επικοινωνίας'}</h2>
        <p class="meta">\${rows.length} εγγραφές</p>
      </div>
    </header>
    <div class="list">
      \${rows.length === 0 ? '<div class="empty">Καμία εγγραφή ακόμη.</div>' : rows.map(renderRow).join('')}
    </div>\`;
}

const cargoLabel = (t) => ({ full_load: 'Συμπαγές', container: 'Container', haulage: 'Τρακτόρευση', other: 'Άλλο' })[t] || t;

async function renderDetail(tab, id) {
  const main = document.getElementById('main');
  const isQuotes = tab === 'quotes';
  const table = isQuotes ? 'quote_requests' : 'contact_submissions';
  const { data: r, error } = await sb.from(table).select('*').eq('id', id).maybeSingle();
  if (error || !r) { main.innerHTML = '<a class="back" href="#' + tab + '">← Πίσω</a><div class="denied">' + escapeHtml(error?.message || 'Δεν βρέθηκε.') + '</div>'; return; }
  const statusOptions = isQuotes ? ['new','quoted','won','lost','spam'] : ['new','handled','spam'];
  const statusBtns = statusOptions.map((s) => \`<button class="status-btn" data-status="\${s}" \${s === r.status ? 'disabled' : ''}>Mark as \${s}</button>\`).join('');
  const fields = isQuotes ? \`
    \${field('Από', r.origin)} \${field('Προς', r.destination)}
    \${r.cargo_type ? field('Τύπος', cargoLabel(r.cargo_type)) : ''}
    \${r.weight_kg ? field('Βάρος', r.weight_kg + ' kg') : ''}
    \${r.volume_m3 ? field('Όγκος', r.volume_m3 + ' m³') : ''}
    \${r.pickup_date ? field('Παραλαβή', r.pickup_date) : ''}
    \${r.delivery_date ? field('Παράδοση', r.delivery_date) : ''}
  \` : '';
  const body = isQuotes ? (r.notes ? '<div class="body">' + escapeHtml(r.notes) + '</div>' : '') : '<div class="body">' + escapeHtml(r.message) + '</div>';

  main.innerHTML = \`
    <a class="back" href="#\${tab}">← Πίσω στη λίστα</a>
    <div class="detail-grid">
      <div class="card">
        <div class="detail-head">
          <span class="badge \${r.status}">\${r.status}</span>
          <time>\${formatDate(r.created_at)}</time>
          <h1>\${escapeHtml(r.name)}\${r.company ? ' · ' + escapeHtml(r.company) : ''}</h1>
        </div>
        <div class="contact-line">
          <a href="mailto:\${escapeHtml(r.email)}">📧 \${escapeHtml(r.email)}</a>
          \${r.phone ? '<a href="tel:' + escapeHtml(r.phone) + '">📞 ' + escapeHtml(r.phone) + '</a>' : ''}
        </div>
        \${fields ? '<div style="margin-top: 22px; display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">' + fields + '</div>' : ''}
        \${body}
      </div>
      <aside>
        <div class="card">
          <div class="field-label">Status</div>
          <p style="margin-top: 6px; font-size: 14px;">\${r.status}</p>
          <div class="status-actions" style="margin-top: 14px;">\${statusBtns}</div>
        </div>
      </aside>
    </div>\`;

  main.querySelectorAll('.status-btn').forEach((btn) => {
    btn.onclick = async () => {
      const status = btn.dataset.status;
      btn.disabled = true; btn.textContent = 'Saving…';
      const { error: e2 } = await sb.from(table).update({ status }).eq('id', r.id);
      if (e2) { alert(e2.message); btn.disabled = false; btn.textContent = 'Mark as ' + status; return; }
      window.location.hash = '#' + tab;
    };
  });
}

function field(label, value) {
  return \`<div class="field"><div class="field-label">\${escapeHtml(label)}</div><div class="field-value">\${escapeHtml(value)}</div></div>\`;
}

render();
</script>
</body>
</html>`;

export default {
  fetch(): Response {
    return new Response(HTML, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300',
        'x-robots-tag': 'noindex, nofollow',
      },
    });
  },
};
