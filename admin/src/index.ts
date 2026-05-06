// ΣΠΑΘΗΣ admin worker — single static HTML page with vanilla JS that
// authenticates against Supabase and provides full CRUD over the project's
// CMS tables (contact_submissions, quote_requests, services, pages,
// site_settings, admin_users). RLS enforces the actual permissions
// server-side, so the public anon key embedded in the page is safe.
//
// Mounted at metaforikikefalonias.gr/admin* (path-based route).

const SUPABASE_URL = 'https://ujjhzepejonpprtdgahb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_R5wm-cwoHS2VvCzSFoPuHQ_3Roy67aJ';

const HTML = `<!doctype html>
<html lang="el">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Admin · ΣΠΑΘΗΣ</title>
<base href="/admin/">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
  :root {
    --brand: #c8102e;
    --brand-strong: #a00c24;
    --ink: #190602;
    --surface: #f8f7f6;
    --muted: #b8b8b8;
    --border: #e7e5e4;
    --warn: #92400e;
    --warn-bg: #fef3c7;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: var(--surface); color: var(--ink); -webkit-font-smoothing: antialiased;
  }
  a { color: inherit; text-decoration: none; }
  button { font: inherit; cursor: pointer; border: 0; background: none; color: inherit; }
  input, textarea, select { font: inherit; }

  /* layout */
  .center { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
  .card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
  .card.login { width: 100%; max-width: 380px; }
  .logo { width: 48px; height: 48px; border-radius: 999px; background: var(--ink); color: var(--brand); display: grid; place-items: center; font-weight: 900; font-size: 24px; margin: 0 auto 16px; }
  h1 { font-size: 22px; font-weight: 800; text-align: center; }
  .sub { color: #6b6661; text-align: center; margin-top: 4px; font-size: 14px; }

  /* form controls */
  label { display: block; margin-top: 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #6b6661; }
  input[type=text], input[type=email], input[type=password], input[type=number], input[type=date], input[type=url], input[type=tel], textarea, select {
    width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 10px; margin-top: 6px; outline: 0; transition: border .15s; background: #fff;
  }
  textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
  input:focus, textarea:focus, select:focus { border-color: var(--ink); }

  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; border-radius: 999px; font-weight: 600; font-size: 14px; transition: all .15s; }
  .btn-primary { background: var(--brand); color: #fff; }
  .btn-primary:hover { background: var(--brand-strong); }
  .btn-primary:disabled, .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-secondary { background: #fff; border: 1px solid var(--border); color: var(--ink); }
  .btn-secondary:hover { border-color: var(--ink); background: var(--surface); }
  .btn-danger { background: #fff; border: 1px solid #fecaca; color: #b91c1c; }
  .btn-danger:hover { background: #fef2f2; border-color: #f87171; }
  .btn-block { width: 100%; }

  .err { margin-top: 12px; padding: 10px 12px; background: #fee; border: 1px solid #fcc; color: #900; border-radius: 10px; font-size: 13px; }
  .ok { margin-top: 12px; padding: 10px 12px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; border-radius: 10px; font-size: 13px; }
  .denied { padding: 14px; background: var(--warn-bg); border: 1px solid #fde68a; color: var(--warn); border-radius: 10px; font-size: 13px; margin-bottom: 14px; }

  /* shell */
  .shell { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
  @media (max-width: 720px) { .shell { grid-template-columns: 1fr; } .sidebar { display: none; } }
  .sidebar { background: #fff; border-right: 1px solid var(--border); padding: 20px 12px; }
  .brand { display: flex; align-items: center; gap: 10px; padding: 6px 8px 18px; }
  .brand-disc { width: 32px; height: 32px; border-radius: 999px; background: var(--ink); color: var(--brand); display: grid; place-items: center; font-weight: 900; font-size: 16px; }
  .brand-text small { display: block; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6661; }
  .brand-text strong { font-size: 14px; font-weight: 800; }
  .nav-section { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #9c9c9c; padding: 14px 12px 6px; }
  .navlink { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px; color: #6b6661; font-weight: 500; font-size: 14px; transition: all .15s; cursor: pointer; }
  .navlink:hover, .navlink.active { background: var(--surface); color: var(--ink); }
  .navlink .dot { width: 6px; height: 6px; border-radius: 999px; background: var(--brand); margin-left: auto; opacity: 0; }
  .navlink.has-new .dot { opacity: 1; }
  .signout { margin-top: 18px; border-top: 1px solid var(--border); padding-top: 14px; }

  /* main */
  .main { padding: 28px clamp(16px, 4vw, 40px); max-width: 1200px; }
  .page-head { display: flex; align-items: end; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .page-head h2 { font-size: 24px; font-weight: 800; }
  .page-head .meta { color: #6b6661; font-size: 13px; }

  /* filter bar */
  .filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; align-items: center; }
  .filters input[type=text], .filters select { width: auto; min-width: 0; margin-top: 0; padding: 8px 12px; font-size: 13px; }
  .filters input[type=text] { min-width: 220px; }
  .filter-pills { display: flex; gap: 4px; }
  .filter-pill { padding: 6px 12px; border-radius: 999px; border: 1px solid var(--border); background: #fff; font-size: 12px; font-weight: 600; color: #6b6661; cursor: pointer; }
  .filter-pill.active { background: var(--ink); color: #fff; border-color: var(--ink); }

  /* list */
  .list { background: #fff; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .row { display: grid; grid-template-columns: auto 1fr auto auto; gap: 14px; align-items: start; padding: 14px 18px; border-bottom: 1px solid var(--border); transition: background .12s; cursor: pointer; }
  .row:last-child { border-bottom: 0; }
  .row:hover { background: var(--surface); }
  .row .badge { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 7px; border-radius: 999px; height: 18px; }
  .badge.new { background: rgba(200,16,46,0.1); color: var(--brand); }
  .badge.handled, .badge.won, .badge.published { background: #ecfdf5; color: #047857; }
  .badge.quoted, .badge.draft { background: #fef3c7; color: #92400e; }
  .badge.lost, .badge.spam, .badge.archived, .badge.unpublished { background: #f4f4f5; color: #71717a; }
  .row .who { font-weight: 600; font-size: 14px; color: var(--ink); }
  .row .who small { font-weight: 400; color: #6b6661; margin-left: 6px; font-size: 12px; }
  .row .preview { font-size: 13px; color: #525252; margin-top: 4px; line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .row time { font-size: 11px; color: #9c9c9c; white-space: nowrap; }
  .row .actions { display: flex; gap: 6px; opacity: 0; transition: opacity .15s; }
  .row:hover .actions { opacity: 1; }
  .row .icon-btn { width: 28px; height: 28px; border-radius: 8px; background: #fff; border: 1px solid var(--border); display: grid; place-items: center; font-size: 14px; }
  .row .icon-btn:hover { border-color: var(--ink); }
  .row .icon-btn.danger:hover { color: #b91c1c; border-color: #fecaca; background: #fef2f2; }
  .empty { padding: 60px 20px; text-align: center; color: #6b6661; font-size: 14px; }

  /* pagination */
  .pager { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 20px; font-size: 13px; }
  .pager .pageinfo { color: #6b6661; }

  /* detail */
  .detail-grid { display: grid; grid-template-columns: 1fr 280px; gap: 20px; }
  @media (max-width: 720px) { .detail-grid { grid-template-columns: 1fr; } }
  .back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #6b6661; margin-bottom: 18px; }
  .back:hover { color: var(--ink); cursor: pointer; }
  .detail-head { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .detail-head h1 { font-size: 22px; font-weight: 700; margin-top: 6px; flex-basis: 100%; }
  .contact-line { display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; color: #525252; margin-top: 6px; }
  .body { white-space: pre-wrap; line-height: 1.6; font-size: 15px; color: #2e2e2e; margin-top: 24px; }
  .field { margin-top: 16px; }
  .field-label { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6661; }
  .field-value { font-weight: 600; font-size: 14px; margin-top: 3px; }
  .status-actions { display: flex; flex-direction: column; gap: 6px; }
  .danger-zone { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--border); }

  /* CMS form sections */
  .form-grid { display: grid; gap: 16px; }
  .form-grid.two { grid-template-columns: 1fr 1fr; }
  @media (max-width: 720px) { .form-grid.two { grid-template-columns: 1fr; } }
  .form-section { margin-bottom: 24px; }
  .form-section h3 { font-size: 14px; font-weight: 700; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .item-row { display: flex; gap: 10px; align-items: center; padding: 10px 0; border-bottom: 1px dashed var(--border); }
  .item-row .grow { flex: 1; }

  .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 10px; flex-wrap: wrap; }

  /* modal */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: grid; place-items: center; padding: 16px; z-index: 50; }
  .modal { background: #fff; border-radius: 16px; padding: 24px; max-width: 380px; width: 100%; }
  .modal h3 { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
  .modal p { font-size: 14px; color: #525252; line-height: 1.5; }
  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 18px; }
</style>
</head>
<body>
<div id="app"><div class="center"><p class="sub">Loading…</p></div></div>
<script>
const SUPABASE_URL = ${JSON.stringify(SUPABASE_URL)};
const SUPABASE_ANON_KEY = ${JSON.stringify(SUPABASE_ANON_KEY)};
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PAGE_SIZE = 25;

const app = document.getElementById('app');
const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const formatDate = (s) => s ? new Date(s).toLocaleString('el-GR', { dateStyle: 'short', timeStyle: 'short' }) : '';
const formatDateLong = (s) => s ? new Date(s).toLocaleString('el-GR', { dateStyle: 'long', timeStyle: 'short' }) : '';
const cargoLabel = (t) => ({ full_load: 'Συμπαγές', container: 'Container', haulage: 'Τρακτόρευση', other: 'Άλλο' })[t] || t;

// Routing — hash patterns
function parseRoute() {
  const h = window.location.hash.replace(/^#/, '') || 'submissions';
  const parts = h.split('/');
  return { tab: parts[0] || 'submissions', id: parts[1] || null, sub: parts[2] || null };
}
window.addEventListener('hashchange', render);

// State for filters/pagination — keyed by tab
const tabState = {};
function getState(tab) {
  if (!tabState[tab]) tabState[tab] = { search: '', status: '', page: 0 };
  return tabState[tab];
}

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
        <p class="sub">Σύνδεση για διαχείριση μηνυμάτων &amp; περιεχομένου.</p>
        <form id="login">
          <label>Email</label>
          <input name="email" type="email" required autocomplete="email" />
          <label>Password</label>
          <input name="password" type="password" required autocomplete="current-password" />
          <button type="submit" class="btn btn-primary btn-block" id="submit" style="margin-top:20px;">Σύνδεση</button>
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
      window.location.hash = 'submissions';
      render();
    }
  };
}

async function renderShell(user) {
  const { tab, id } = parseRoute();
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

        <div class="nav-section">Inbox</div>
        <a class="navlink \${tab === 'submissions' ? 'active' : ''} \${submissionsNew > 0 ? 'has-new' : ''}" href="#submissions">📥 Μηνύματα<span class="dot"></span></a>
        <a class="navlink \${tab === 'quotes' ? 'active' : ''} \${quotesNew > 0 ? 'has-new' : ''}" href="#quotes">📋 Προσφορές<span class="dot"></span></a>

        <div class="nav-section">CMS</div>
        <a class="navlink \${tab === 'services' ? 'active' : ''}" href="#services">🚚 Υπηρεσίες</a>
        <a class="navlink \${tab === 'pages' ? 'active' : ''}" href="#pages">📄 Σελίδες</a>
        <a class="navlink \${tab === 'settings' ? 'active' : ''}" href="#settings">⚙ Ρυθμίσεις</a>
        <a class="navlink \${tab === 'admins' ? 'active' : ''}" href="#admins">👥 Διαχειριστές</a>

        <div class="signout">
          <div style="font-size:11px;color:#9c9c9c;padding:0 12px 8px;">\${escapeHtml(user.email)}</div>
          <button class="navlink" id="signout">↩ Αποσύνδεση</button>
        </div>
      </aside>
      <main class="main" id="main"></main>
    </div>\`;
  document.getElementById('signout').onclick = async () => { await sb.auth.signOut(); render(); };

  switch (tab) {
    case 'submissions': id ? renderSubmissionDetail(id) : renderSubmissionsList(); break;
    case 'quotes': id ? renderQuoteDetail(id) : renderQuotesList(); break;
    case 'services': renderServices(); break;
    case 'pages': renderPages(); break;
    case 'settings': renderSettings(); break;
    case 'admins': renderAdmins(); break;
    default: window.location.hash = 'submissions';
  }
}

// ============ Submissions ============
async function renderSubmissionsList() {
  const main = document.getElementById('main');
  const state = getState('submissions');
  const offset = state.page * PAGE_SIZE;
  let q = sb.from('contact_submissions').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + PAGE_SIZE - 1);
  if (state.status) q = q.eq('status', state.status);
  if (state.search) q = q.or(\`name.ilike.%\${state.search}%,email.ilike.%\${state.search}%,message.ilike.%\${state.search}%\`);

  const { data: rows, count, error } = await q;
  if (error) { main.innerHTML = denied(error); return; }

  const renderRow = (r) => \`
    <div class="row" data-id="\${r.id}">
      <span class="badge \${r.status}">\${r.status}</span>
      <div>
        <div class="who">\${escapeHtml(r.name)} <small>\${escapeHtml(r.email)}</small></div>
        <div class="preview">\${escapeHtml(r.message)}</div>
      </div>
      <time>\${formatDate(r.created_at)}</time>
      <div class="actions">
        <button class="icon-btn danger" data-act="delete" data-id="\${r.id}" title="Διαγραφή">🗑</button>
      </div>
    </div>\`;

  main.innerHTML = \`
    <header class="page-head">
      <div>
        <h2>Μηνύματα επικοινωνίας</h2>
        <p class="meta">\${count ?? 0} εγγραφές</p>
      </div>
    </header>
    \${filterBar('submissions', ['', 'new', 'handled', 'spam'], state)}
    <div class="list">\${rows.length === 0 ? '<div class="empty">Καμία εγγραφή.</div>' : rows.map(renderRow).join('')}</div>
    \${pager(count ?? 0, state, 'submissions')}\`;

  wireFilters('submissions', renderSubmissionsList);
  wireRowClicks(main, 'submissions', async (id) => {
    if (await confirmModal('Διαγραφή μηνύματος;', 'Η ενέργεια δεν αναιρείται.')) {
      const { error: e2 } = await sb.from('contact_submissions').delete().eq('id', id);
      if (e2) alert(e2.message); else renderSubmissionsList();
    }
  });
}

async function renderSubmissionDetail(id) {
  const main = document.getElementById('main');
  const { data: r, error } = await sb.from('contact_submissions').select('*').eq('id', id).maybeSingle();
  if (error || !r) { main.innerHTML = backLink('submissions') + denied(error || { message: 'Δεν βρέθηκε' }); return; }

  main.innerHTML = \`
    \${backLink('submissions')}
    <div class="detail-grid">
      <div class="card">
        <div class="detail-head">
          <span class="badge \${r.status}">\${r.status}</span>
          <time style="font-size:12px;color:#6b6661;">\${formatDateLong(r.created_at)}</time>
          <h1>\${escapeHtml(r.name)}</h1>
        </div>
        <div class="contact-line">
          <a href="mailto:\${escapeHtml(r.email)}">📧 \${escapeHtml(r.email)}</a>
          \${r.phone ? '<a href="tel:' + escapeHtml(r.phone) + '">📞 ' + escapeHtml(r.phone) + '</a>' : ''}
          <span>🌐 \${r.language === 'el' ? 'Ελληνικά' : 'English'}</span>
        </div>
        <div class="body">\${escapeHtml(r.message)}</div>
      </div>
      <aside>
        <div class="card">
          <div class="field-label">Status</div>
          <p style="margin-top: 6px; font-size: 14px;">\${r.status}</p>
          <div class="status-actions" style="margin-top: 14px;">
            \${['new','handled','spam'].map((s) => \`<button class="btn btn-secondary" data-status="\${s}" \${s === r.status ? 'disabled' : ''}>Mark as \${s}</button>\`).join('')}
          </div>
          <div class="danger-zone">
            <button class="btn btn-danger btn-block" id="delete">🗑 Διαγραφή</button>
          </div>
        </div>
      </aside>
    </div>\`;

  main.querySelectorAll('[data-status]').forEach((btn) => {
    btn.onclick = async () => {
      btn.disabled = true; btn.textContent = 'Saving…';
      const { error: e2 } = await sb.from('contact_submissions').update({ status: btn.dataset.status }).eq('id', r.id);
      if (e2) { alert(e2.message); btn.disabled = false; return; }
      window.location.hash = 'submissions';
    };
  });
  document.getElementById('delete').onclick = async () => {
    if (await confirmModal('Διαγραφή μηνύματος;', 'Η ενέργεια δεν αναιρείται.')) {
      const { error: e2 } = await sb.from('contact_submissions').delete().eq('id', r.id);
      if (e2) alert(e2.message); else window.location.hash = 'submissions';
    }
  };
}

// ============ Quotes ============
async function renderQuotesList() {
  const main = document.getElementById('main');
  const state = getState('quotes');
  const offset = state.page * PAGE_SIZE;
  let q = sb.from('quote_requests').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + PAGE_SIZE - 1);
  if (state.status) q = q.eq('status', state.status);
  if (state.search) q = q.or(\`name.ilike.%\${state.search}%,email.ilike.%\${state.search}%,company.ilike.%\${state.search}%,origin.ilike.%\${state.search}%,destination.ilike.%\${state.search}%\`);

  const { data: rows, count, error } = await q;
  if (error) { main.innerHTML = denied(error); return; }

  const renderRow = (r) => \`
    <div class="row" data-id="\${r.id}">
      <span class="badge \${r.status}">\${r.status}</span>
      <div>
        <div class="who">\${escapeHtml(r.name)}\${r.company ? ' <small>' + escapeHtml(r.company) + '</small>' : ''}</div>
        <div class="preview">\${escapeHtml(r.origin)} → \${escapeHtml(r.destination)} · \${escapeHtml(cargoLabel(r.cargo_type))}</div>
      </div>
      <time>\${formatDate(r.created_at)}</time>
      <div class="actions">
        <button class="icon-btn danger" data-act="delete" data-id="\${r.id}" title="Διαγραφή">🗑</button>
      </div>
    </div>\`;

  main.innerHTML = \`
    <header class="page-head">
      <div>
        <h2>Αιτήματα προσφοράς</h2>
        <p class="meta">\${count ?? 0} εγγραφές</p>
      </div>
    </header>
    \${filterBar('quotes', ['', 'new', 'quoted', 'won', 'lost', 'spam'], state)}
    <div class="list">\${rows.length === 0 ? '<div class="empty">Καμία εγγραφή.</div>' : rows.map(renderRow).join('')}</div>
    \${pager(count ?? 0, state, 'quotes')}\`;

  wireFilters('quotes', renderQuotesList);
  wireRowClicks(main, 'quotes', async (id) => {
    if (await confirmModal('Διαγραφή αιτήματος;', 'Η ενέργεια δεν αναιρείται.')) {
      const { error: e2 } = await sb.from('quote_requests').delete().eq('id', id);
      if (e2) alert(e2.message); else renderQuotesList();
    }
  });
}

async function renderQuoteDetail(id) {
  const main = document.getElementById('main');
  const { data: r, error } = await sb.from('quote_requests').select('*').eq('id', id).maybeSingle();
  if (error || !r) { main.innerHTML = backLink('quotes') + denied(error || { message: 'Δεν βρέθηκε' }); return; }

  const fields = [
    ['Από', r.origin], ['Προς', r.destination],
    ['Τύπος', cargoLabel(r.cargo_type)],
    ['Βάρος', r.weight_kg ? r.weight_kg + ' kg' : null],
    ['Όγκος', r.volume_m3 ? r.volume_m3 + ' m³' : null],
    ['Παραλαβή', r.pickup_date], ['Παράδοση', r.delivery_date],
  ].filter(([_, v]) => v != null && v !== '');

  main.innerHTML = \`
    \${backLink('quotes')}
    <div class="detail-grid">
      <div class="card">
        <div class="detail-head">
          <span class="badge \${r.status}">\${r.status}</span>
          <time style="font-size:12px;color:#6b6661;">\${formatDateLong(r.created_at)}</time>
          <h1>\${escapeHtml(r.name)}\${r.company ? ' · ' + escapeHtml(r.company) : ''}</h1>
        </div>
        <div class="contact-line">
          <a href="mailto:\${escapeHtml(r.email)}">📧 \${escapeHtml(r.email)}</a>
          \${r.phone ? '<a href="tel:' + escapeHtml(r.phone) + '">📞 ' + escapeHtml(r.phone) + '</a>' : ''}
          <span>🌐 \${r.language === 'el' ? 'Ελληνικά' : 'English'}</span>
        </div>
        <div style="margin-top:22px;display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));">
          \${fields.map(([l, v]) => \`<div class="field"><div class="field-label">\${escapeHtml(l)}</div><div class="field-value">\${escapeHtml(v)}</div></div>\`).join('')}
        </div>
        \${r.notes ? '<div class="body">' + escapeHtml(r.notes) + '</div>' : ''}
      </div>
      <aside>
        <div class="card">
          <div class="field-label">Status</div>
          <p style="margin-top: 6px; font-size: 14px;">\${r.status}</p>
          <div class="status-actions" style="margin-top: 14px;">
            \${['new','quoted','won','lost','spam'].map((s) => \`<button class="btn btn-secondary" data-status="\${s}" \${s === r.status ? 'disabled' : ''}>Mark as \${s}</button>\`).join('')}
          </div>
          <div class="danger-zone">
            <button class="btn btn-danger btn-block" id="delete">🗑 Διαγραφή</button>
          </div>
        </div>
      </aside>
    </div>\`;

  main.querySelectorAll('[data-status]').forEach((btn) => {
    btn.onclick = async () => {
      btn.disabled = true; btn.textContent = 'Saving…';
      const { error: e2 } = await sb.from('quote_requests').update({ status: btn.dataset.status }).eq('id', r.id);
      if (e2) { alert(e2.message); btn.disabled = false; return; }
      window.location.hash = 'quotes';
    };
  });
  document.getElementById('delete').onclick = async () => {
    if (await confirmModal('Διαγραφή αιτήματος;', 'Η ενέργεια δεν αναιρείται.')) {
      const { error: e2 } = await sb.from('quote_requests').delete().eq('id', r.id);
      if (e2) alert(e2.message); else window.location.hash = 'quotes';
    }
  };
}

// ============ Services CMS ============
async function renderServices() {
  const main = document.getElementById('main');
  const { data, error } = await sb.from('services').select('*').order('display_order');
  if (error) { main.innerHTML = denied(error); return; }

  main.innerHTML = \`
    <header class="page-head">
      <div>
        <h2>Υπηρεσίες</h2>
        <p class="meta">\${data.length} εγγραφές · εμφανίζονται στη σελίδα /services</p>
      </div>
      <button class="btn btn-primary" id="add">+ Νέα υπηρεσία</button>
    </header>
    <div id="list">\${data.map(renderServiceCard).join('')}</div>\`;

  document.getElementById('add').onclick = () => editService(null);
  data.forEach((s) => {
    document.getElementById('edit-' + s.id).onclick = () => editService(s);
    document.getElementById('del-' + s.id).onclick = async () => {
      if (await confirmModal('Διαγραφή υπηρεσίας;', escapeHtml(s.title_el))) {
        const { error: e2 } = await sb.from('services').delete().eq('id', s.id);
        if (e2) alert(e2.message); else renderServices();
      }
    };
  });
}

function renderServiceCard(s) {
  return \`
    <div class="card" style="margin-bottom:12px;">
      <div style="display:flex;gap:12px;align-items:start;justify-content:space-between;flex-wrap:wrap;">
        <div style="min-width:0;flex:1;">
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <span class="badge \${s.published ? 'published' : 'unpublished'}">\${s.published ? 'published' : 'unpublished'}</span>
            <span style="font-size:11px;color:#6b6661;">#\${s.display_order} · \${escapeHtml(s.slug)}</span>
          </div>
          <h3 style="margin-top:8px;font-size:18px;font-weight:700;">\${escapeHtml(s.title_el)} <span style="color:#9c9c9c;font-weight:400;font-size:14px;">/ \${escapeHtml(s.title_en)}</span></h3>
          <p style="margin-top:6px;color:#525252;font-size:14px;">\${escapeHtml(s.short_el || '')}</p>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-secondary" id="edit-\${s.id}">Edit</button>
          <button class="btn btn-danger" id="del-\${s.id}">🗑</button>
        </div>
      </div>
    </div>\`;
}

function editService(s) {
  const main = document.getElementById('main');
  const isNew = !s;
  s = s || { slug: '', title_el: '', title_en: '', short_el: '', short_en: '', description_el: '', description_en: '', icon: 'truck', display_order: 0, published: true };
  main.innerHTML = \`
    \${backLink('services')}
    <div class="card">
      <h2 style="font-size:20px;font-weight:700;margin-bottom:16px;">\${isNew ? 'Νέα' : 'Επεξεργασία'} υπηρεσίας</h2>
      <form id="f">
        <div class="form-grid two">
          <div><label>Slug (URL)</label><input name="slug" value="\${escapeHtml(s.slug)}" required pattern="[a-z0-9-]+" /></div>
          <div><label>Σειρά</label><input type="number" name="display_order" value="\${s.display_order}" /></div>
        </div>
        <div class="form-grid two">
          <div><label>Τίτλος (EL)</label><input name="title_el" value="\${escapeHtml(s.title_el)}" required /></div>
          <div><label>Τίτλος (EN)</label><input name="title_en" value="\${escapeHtml(s.title_en)}" required /></div>
        </div>
        <div class="form-grid two">
          <div><label>Σύντομο (EL)</label><textarea name="short_el">\${escapeHtml(s.short_el || '')}</textarea></div>
          <div><label>Σύντομο (EN)</label><textarea name="short_en">\${escapeHtml(s.short_en || '')}</textarea></div>
        </div>
        <div class="form-grid two">
          <div><label>Περιγραφή (EL)</label><textarea name="description_el" rows="5">\${escapeHtml(s.description_el || '')}</textarea></div>
          <div><label>Περιγραφή (EN)</label><textarea name="description_en" rows="5">\${escapeHtml(s.description_en || '')}</textarea></div>
        </div>
        <div class="form-grid two">
          <div><label>Icon (lucide name)</label><input name="icon" value="\${escapeHtml(s.icon || 'truck')}" /></div>
          <div><label>Δημοσιευμένο</label><select name="published"><option value="true" \${s.published ? 'selected' : ''}>Ναι</option><option value="false" \${!s.published ? 'selected' : ''}>Όχι</option></select></div>
        </div>
        <div style="margin-top:20px;display:flex;gap:8px;">
          <button type="submit" class="btn btn-primary">\${isNew ? 'Δημιουργία' : 'Αποθήκευση'}</button>
          <a class="btn btn-secondary" href="#services">Άκυρο</a>
        </div>
        <div id="msg"></div>
      </form>
    </div>\`;
  document.getElementById('f').onsubmit = async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    fd.published = fd.published === 'true';
    fd.display_order = Number(fd.display_order || 0);
    const msg = document.getElementById('msg');
    const op = isNew ? sb.from('services').insert(fd) : sb.from('services').update(fd).eq('id', s.id);
    const { error } = await op;
    if (error) msg.innerHTML = '<div class="err">' + escapeHtml(error.message) + '</div>';
    else { msg.innerHTML = '<div class="ok">Αποθηκεύτηκε.</div>'; setTimeout(() => window.location.hash = 'services', 600); }
  };
}

// ============ Pages CMS ============
async function renderPages() {
  const main = document.getElementById('main');
  const { data, error } = await sb.from('pages').select('*').order('slug');
  if (error) { main.innerHTML = denied(error); return; }

  main.innerHTML = \`
    <header class="page-head">
      <div>
        <h2>Στατικές σελίδες</h2>
        <p class="meta">\${data.length} σελίδες</p>
      </div>
      <button class="btn btn-primary" id="add">+ Νέα σελίδα</button>
    </header>
    <div>\${data.map((p) => \`
      <div class="card" style="margin-bottom:12px;">
        <div style="display:flex;gap:12px;align-items:start;justify-content:space-between;flex-wrap:wrap;">
          <div style="min-width:0;flex:1;">
            <span class="badge \${p.published ? 'published' : 'unpublished'}">\${p.published ? 'published' : 'unpublished'}</span>
            <span style="font-size:11px;color:#6b6661;margin-left:6px;">/\${escapeHtml(p.slug)}</span>
            <h3 style="margin-top:8px;font-size:18px;font-weight:700;">\${escapeHtml(p.title_el)} <span style="color:#9c9c9c;font-weight:400;font-size:14px;">/ \${escapeHtml(p.title_en)}</span></h3>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-secondary" data-edit="\${p.id}">Edit</button>
            <button class="btn btn-danger" data-del="\${p.id}">🗑</button>
          </div>
        </div>
      </div>\`).join('')}</div>\`;

  document.getElementById('add').onclick = () => editPage(null);
  main.querySelectorAll('[data-edit]').forEach((btn) => btn.onclick = () => editPage(data.find((p) => p.id === btn.dataset.edit)));
  main.querySelectorAll('[data-del]').forEach((btn) => btn.onclick = async () => {
    const p = data.find((x) => x.id === btn.dataset.del);
    if (await confirmModal('Διαγραφή σελίδας;', '/' + p.slug)) {
      const { error: e2 } = await sb.from('pages').delete().eq('id', p.id);
      if (e2) alert(e2.message); else renderPages();
    }
  });
}

function editPage(p) {
  const main = document.getElementById('main');
  const isNew = !p;
  p = p || { slug: '', title_el: '', title_en: '', body_el: '', body_en: '', meta_description_el: '', meta_description_en: '', published: true };
  main.innerHTML = \`
    \${backLink('pages')}
    <div class="card">
      <h2 style="font-size:20px;font-weight:700;margin-bottom:16px;">\${isNew ? 'Νέα' : 'Επεξεργασία'} σελίδας</h2>
      <form id="f">
        <div><label>Slug</label><input name="slug" value="\${escapeHtml(p.slug)}" required pattern="[a-z0-9-]+" /></div>
        <div class="form-grid two" style="margin-top:14px;">
          <div><label>Τίτλος (EL)</label><input name="title_el" value="\${escapeHtml(p.title_el)}" required /></div>
          <div><label>Τίτλος (EN)</label><input name="title_en" value="\${escapeHtml(p.title_en)}" required /></div>
        </div>
        <div class="form-grid two">
          <div><label>Meta description (EL)</label><textarea name="meta_description_el">\${escapeHtml(p.meta_description_el || '')}</textarea></div>
          <div><label>Meta description (EN)</label><textarea name="meta_description_en">\${escapeHtml(p.meta_description_en || '')}</textarea></div>
        </div>
        <div class="form-grid two">
          <div><label>Body markdown (EL)</label><textarea name="body_el" rows="14">\${escapeHtml(p.body_el || '')}</textarea></div>
          <div><label>Body markdown (EN)</label><textarea name="body_en" rows="14">\${escapeHtml(p.body_en || '')}</textarea></div>
        </div>
        <div style="margin-top:14px;"><label>Δημοσιευμένο</label><select name="published"><option value="true" \${p.published ? 'selected' : ''}>Ναι</option><option value="false" \${!p.published ? 'selected' : ''}>Όχι</option></select></div>
        <div style="margin-top:20px;display:flex;gap:8px;">
          <button type="submit" class="btn btn-primary">\${isNew ? 'Δημιουργία' : 'Αποθήκευση'}</button>
          <a class="btn btn-secondary" href="#pages">Άκυρο</a>
        </div>
        <div id="msg"></div>
      </form>
    </div>\`;
  document.getElementById('f').onsubmit = async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    fd.published = fd.published === 'true';
    const msg = document.getElementById('msg');
    const op = isNew ? sb.from('pages').insert(fd) : sb.from('pages').update(fd).eq('id', p.id);
    const { error } = await op;
    if (error) msg.innerHTML = '<div class="err">' + escapeHtml(error.message) + '</div>';
    else { msg.innerHTML = '<div class="ok">Αποθηκεύτηκε.</div>'; setTimeout(() => window.location.hash = 'pages', 600); }
  };
}

// ============ Site settings ============
async function renderSettings() {
  const main = document.getElementById('main');
  const { data, error } = await sb.from('site_settings').select('*').eq('id', 1).maybeSingle();
  if (error) { main.innerHTML = denied(error); return; }
  const s = data || { id: 1 };
  main.innerHTML = \`
    <header class="page-head">
      <div>
        <h2>Ρυθμίσεις site</h2>
        <p class="meta">Στοιχεία επικοινωνίας &amp; ωράριο που εμφανίζονται σε footer / contact / JSON-LD.</p>
      </div>
    </header>
    <div class="card">
      <form id="f">
        <div class="form-section">
          <h3>📞 Επικοινωνία</h3>
          <div class="form-grid two">
            <div><label>Πρωτεύον τηλέφωνο</label><input name="phone_primary" value="\${escapeHtml(s.phone_primary || '')}" placeholder="+306938255178" /></div>
            <div><label>Δευτερεύον τηλέφωνο</label><input name="phone_secondary" value="\${escapeHtml(s.phone_secondary || '')}" /></div>
            <div><label>Email</label><input type="email" name="email" value="\${escapeHtml(s.email || '')}" /></div>
            <div><label>WhatsApp</label><input name="whatsapp_number" value="\${escapeHtml(s.whatsapp_number || '')}" /></div>
            <div><label>Viber</label><input name="viber_number" value="\${escapeHtml(s.viber_number || '')}" /></div>
          </div>
        </div>
        <div class="form-section">
          <h3>📍 Διεύθυνση</h3>
          <div class="form-grid two">
            <div><label>Διεύθυνση (EL)</label><input name="address_el" value="\${escapeHtml(s.address_el || '')}" /></div>
            <div><label>Διεύθυνση (EN)</label><input name="address_en" value="\${escapeHtml(s.address_en || '')}" /></div>
          </div>
          <div><label>Google Maps embed URL</label><input type="url" name="google_maps_embed_url" value="\${escapeHtml(s.google_maps_embed_url || '')}" /></div>
        </div>
        <div class="form-section">
          <h3>🕒 Ωράριο</h3>
          <div class="form-grid two">
            <div><label>Ωράριο (EL)</label><input name="hours_el" value="\${escapeHtml(s.hours_el || '')}" /></div>
            <div><label>Ωράριο (EN)</label><input name="hours_en" value="\${escapeHtml(s.hours_en || '')}" /></div>
          </div>
        </div>
        <div class="form-section">
          <h3>🌐 Social</h3>
          <div class="form-grid two">
            <div><label>Facebook URL</label><input type="url" name="social_facebook" value="\${escapeHtml(s.social_facebook || '')}" /></div>
            <div><label>Instagram URL</label><input type="url" name="social_instagram" value="\${escapeHtml(s.social_instagram || '')}" /></div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Αποθήκευση</button>
        <div id="msg"></div>
      </form>
    </div>\`;
  document.getElementById('f').onsubmit = async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    Object.keys(fd).forEach((k) => { if (fd[k] === '') fd[k] = null; });
    const msg = document.getElementById('msg');
    const { error: e2 } = await sb.from('site_settings').upsert({ id: 1, ...fd });
    if (e2) msg.innerHTML = '<div class="err">' + escapeHtml(e2.message) + '</div>';
    else msg.innerHTML = '<div class="ok">Αποθηκεύτηκε.</div>';
  };
}

// ============ Admin users ============
async function renderAdmins() {
  const main = document.getElementById('main');
  const { data: { user } } = await sb.auth.getUser();
  const { data, error } = await sb.from('admin_users').select('*').order('created_at');
  if (error) { main.innerHTML = denied(error); return; }
  main.innerHTML = \`
    <header class="page-head">
      <div>
        <h2>Διαχειριστές</h2>
        <p class="meta">\${data.length} ενεργοί λογαριασμοί</p>
      </div>
    </header>
    <div class="card" style="margin-bottom:14px;background:#fef3c7;border-color:#fde68a;color:#92400e;font-size:13px;">
      ⚠ Νέοι λογαριασμοί δημιουργούνται μέσω Supabase dashboard → Authentication → Users.
      Στη συνέχεια προσθέτονται εδώ μέσω "Add admin".
    </div>
    <div class="list">\${data.map((a) => \`
      <div class="row" style="grid-template-columns:1fr auto auto;">
        <div>
          <div class="who">\${escapeHtml(a.email)}\${a.user_id === user.id ? ' <small style="color:var(--brand);font-weight:600;">(εσείς)</small>' : ''}</div>
          <div class="preview">user_id: \${escapeHtml(a.user_id)}</div>
        </div>
        <time>\${formatDate(a.created_at)}</time>
        <button class="btn btn-danger" data-rm="\${a.user_id}" \${a.user_id === user.id ? 'disabled title="Δεν μπορείτε να διαγράψετε τον εαυτό σας"' : ''}>Αφαίρεση</button>
      </div>\`).join('')}</div>
    <div class="card" style="margin-top:16px;">
      <h3 style="font-size:14px;font-weight:700;margin-bottom:10px;">Προσθήκη υπάρχοντα auth user ως admin</h3>
      <form id="addf" style="display:flex;gap:8px;flex-wrap:wrap;align-items:end;">
        <div style="flex:1;min-width:280px;">
          <label>User ID (UUID από Supabase Auth)</label>
          <input name="user_id" required pattern="[0-9a-f-]{36}" placeholder="918a3e78-40aa-45b0-a4b7-fa684f01b83f" />
        </div>
        <div style="flex:1;min-width:200px;">
          <label>Email</label>
          <input type="email" name="email" required />
        </div>
        <button type="submit" class="btn btn-primary">+ Add admin</button>
      </form>
      <div id="addmsg"></div>
    </div>\`;
  main.querySelectorAll('[data-rm]').forEach((btn) => btn.onclick = async () => {
    const userId = btn.dataset.rm;
    if (await confirmModal('Αφαίρεση δικαιωμάτων admin;', 'Ο χρήστης παραμένει στο σύστημα αλλά δεν θα έχει πρόσβαση εδώ.')) {
      const { error: e2 } = await sb.from('admin_users').delete().eq('user_id', userId);
      if (e2) alert(e2.message); else renderAdmins();
    }
  });
  document.getElementById('addf').onsubmit = async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    const msg = document.getElementById('addmsg');
    const { error: e2 } = await sb.from('admin_users').insert(fd);
    if (e2) msg.innerHTML = '<div class="err">' + escapeHtml(e2.message) + '</div>';
    else { msg.innerHTML = '<div class="ok">Προστέθηκε.</div>'; setTimeout(renderAdmins, 600); }
  };
}

// ============ Helpers ============
function denied(error) {
  return \`<div class="denied">\${escapeHtml(error.message || error)}<br><small>Πιθανόν δεν έχετε δικαιώματα. Επιβεβαιώστε ότι ο λογαριασμός σας είναι στο <code>admin_users</code>.</small></div>\`;
}

function backLink(tab) {
  return \`<a class="back" href="#\${tab}">← Πίσω</a>\`;
}

function filterBar(tab, statuses, state) {
  return \`
    <div class="filters">
      <input type="text" id="search" placeholder="🔍 Αναζήτηση…" value="\${escapeHtml(state.search)}" />
      <div class="filter-pills">
        \${statuses.map((s) => \`<button class="filter-pill \${state.status === s ? 'active' : ''}" data-status="\${s}">\${s || 'Όλα'}</button>\`).join('')}
      </div>
    </div>\`;
}

function wireFilters(tab, rerender) {
  const state = getState(tab);
  const search = document.getElementById('search');
  let timer;
  if (search) search.oninput = () => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.search = search.value; state.page = 0; rerender(); }, 250);
  };
  document.querySelectorAll('[data-status]').forEach((btn) => btn.onclick = () => {
    if (btn.tagName === 'BUTTON' && btn.classList.contains('filter-pill')) {
      state.status = btn.dataset.status;
      state.page = 0;
      rerender();
    }
  });
}

function wireRowClicks(main, tab, deleteHandler) {
  main.querySelectorAll('.row[data-id]').forEach((row) => {
    row.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof Element && target.closest('[data-act]')) {
        const act = target.closest('[data-act]');
        if (act.dataset.act === 'delete') { e.stopPropagation(); deleteHandler(act.dataset.id); }
        return;
      }
      window.location.hash = tab + '/' + row.dataset.id;
    });
  });
}

function pager(total, state, tab) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const cur = state.page + 1;
  const setPage = (n) => { state.page = Math.max(0, Math.min(totalPages - 1, n)); render(); };
  setTimeout(() => {
    const prev = document.querySelector('[data-page=prev]');
    const next = document.querySelector('[data-page=next]');
    if (prev) prev.onclick = () => setPage(state.page - 1);
    if (next) next.onclick = () => setPage(state.page + 1);
  }, 0);
  return totalPages > 1 ? \`
    <div class="pager">
      <button class="btn btn-secondary" data-page="prev" \${state.page === 0 ? 'disabled' : ''}>← Προηγ.</button>
      <span class="pageinfo">Σελίδα \${cur} από \${totalPages} · \${total} εγγραφές</span>
      <button class="btn btn-secondary" data-page="next" \${state.page >= totalPages - 1 ? 'disabled' : ''}>Επόμ. →</button>
    </div>\` : '';
}

// confirm modal — returns Promise<boolean>
function confirmModal(title, body) {
  return new Promise((resolve) => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = \`
      <div class="modal">
        <h3>\${escapeHtml(title)}</h3>
        <p>\${escapeHtml(body)}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" id="no">Άκυρο</button>
          <button class="btn btn-danger" id="yes">Διαγραφή</button>
        </div>
      </div>\`;
    document.body.appendChild(wrap);
    const finish = (v) => { wrap.remove(); resolve(v); };
    wrap.querySelector('#yes').onclick = () => finish(true);
    wrap.querySelector('#no').onclick = () => finish(false);
    wrap.addEventListener('click', (e) => { if (e.target === wrap) finish(false); });
  });
}

render();
</script>
</body>
</html>`;

export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    // Healthcheck path so we can verify the worker is running
    if (url.pathname === '/admin/health') {
      return new Response('ok', { headers: { 'content-type': 'text/plain' } });
    }
    // Everything under /admin* serves the SPA — client-side hash routing
    // takes over from there.
    return new Response(HTML, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300',
        'x-robots-tag': 'noindex, nofollow',
      },
    });
  },
};
