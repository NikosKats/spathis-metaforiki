# Spathis Logistics — Architecture

## Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router, TypeScript, Turbopack) | Best i18n, SEO, server actions, mature ecosystem |
| Styling | Tailwind CSS 4 + shadcn/ui | Fast iteration, accessible primitives |
| i18n | `next-intl` | Type-safe, App-Router native, locale-prefixed routing |
| DB / Auth | Supabase (Postgres + Auth + Storage) | Single platform for admin auth, content, file uploads |
| Email | Resend + react-email templates | Reliable transactional, nice DX, Greek-friendly |
| Forms | React Hook Form + Zod | Type-safe, accessible, small bundle |
| Hosting | Cloudflare Pages (`@cloudflare/next-on-pages`) | Cheap, fast, edge runtime, free Web Analytics |
| Analytics | Cloudflare Web Analytics | Cookieless → no GDPR banner needed for tracking |
| Domain (primary) | `spathismetaforiki.gr` | Cloudflare DNS — brand-led canonical |
| Domain (EMD redirect) | `metaforikikefalonias.gr` | 301 → primary via standalone Cloudflare Worker (`redirect-worker/`) |

## Languages
- **Default:** `el` (Greek) — Greek-island business, .gr TLD, Greek primary audience
- **Secondary:** `en` (English) — for shipping partners / expats / foreign businesses
- **URL pattern:** `/` (Greek), `/en/...` (English) — clean, SEO-friendly, easy to flip if you want EN default later

## Sitemap
```
/                          Home (el)
/en                        Home (en)
/[locale]/services         Services overview
/[locale]/services/[slug]  Per-service page (full-loads, containers, haulage)
/[locale]/routes           Routes & coverage (Kefalonia ↔ mainland)
/[locale]/about            About / company story
/[locale]/contact          Contact form + map + phones
/[locale]/quote            Quote request form (longer)
/[locale]/blog             News / blog index
/[locale]/blog/[slug]      Blog post
/[locale]/privacy          Privacy policy (GDPR)
/[locale]/terms            Terms

/admin                     Admin login (Supabase Auth)
/admin/dashboard           Stats: submissions, quotes
/admin/submissions         Contact submissions inbox
/admin/quotes              Quote requests inbox
/admin/services            Edit services content
/admin/pages               Edit static pages content
/admin/blog                Manage blog posts
/admin/settings            Site-wide settings (contact info, hours)
```

## Database (Supabase)
Tables (full SQL in `supabase/schema.sql`):
- `contact_submissions` — public form → admin inbox
- `quote_requests` — quote form → admin inbox (+ Resend notification)
- `services` — CMS-managed
- `pages` — CMS-managed (about, terms, privacy)
- `blog_posts` — CMS-managed
- `site_settings` — phones, email, hours, address
- `admin_audit_log` — who changed what, when

All public-write tables have **RLS** locked down: anonymous can `INSERT` only; authenticated admins can `SELECT/UPDATE/DELETE`. CMS tables: anonymous `SELECT` published rows; admin `ALL`.

## Auth model
- Supabase Auth, email + password
- Single `admin` role enforced via RLS using `auth.jwt() -> 'role'` or membership in `admin_users` table
- You bootstrap the first admin via Supabase dashboard

## Email flows (Resend)
1. Contact form submission → notification to `aspathis@hotmail.gr` (Greek template)
2. Quote request → notification to admin + auto-reply to user in their submitted language
3. (Future) Newsletter / blog post notifications

## Integrations / extras
- **Google Maps** embed on Contact (Skala, Kefalonia)
- **`tel:` buttons** — mobile-prominent for both numbers
- **WhatsApp** click-to-chat (`https://wa.me/30694...`)
- **Viber** click-to-chat (`viber://chat?number=...`) — common for Greek truckers
- **Cookie banner** — minimal, only shows if we add 3rd-party scripts later. Cloudflare Analytics is cookieless so a banner isn't required by default; we'll still ship a `/privacy` page.
- **SEO:** sitemap.xml, robots.txt, hreflang, JSON-LD `LocalBusiness` + `MovingCompany` schema
- **OG images:** auto-generated per page via `next/og`

## Logo
The PNG you shared needs to become an SVG. Two options:
1. Get the vector source file from the designer (best)
2. I'll trace it from the PNG (good enough for web, ~2 min job)

## Repo layout
```
spathis-logistics/
├── brief/                    Briefs, architecture, content drafts
├── assets/                   Source assets (logo PNG, images)
├── web/                      Next.js app (App Router) → spathismetaforiki.gr
│   ├── src/
│   │   ├── app/[locale]/     Localized public routes
│   │   ├── app/admin/        Admin (not localized)
│   │   ├── app/api/          API routes (form handlers, webhooks)
│   │   ├── components/
│   │   ├── lib/              supabase client, resend client, utils
│   │   ├── i18n/             next-intl config + messages
│   │   ├── messages/         el.json, en.json
│   │   └── middleware.ts     next-intl locale routing (Edge runtime)
│   └── public/
├── redirect-worker/          Tiny Cloudflare Worker → metaforikikefalonias.gr
│   └── src/index.ts          301s all paths to spathismetaforiki.gr
└── supabase/
    ├── schema.sql            Tables + RLS policies
    └── seed.sql              Initial services / settings
```

## Domain strategy
- **Primary (canonical):** `spathismetaforiki.gr` — brand-led, all SEO equity accrues here
- **EMD redirect:** `metaforikikefalonias.gr` → 301 to primary, preserving path + query
  - Captures direct-type traffic for the high-volume Greek query "μεταφορική Κεφαλονιάς"
  - Implemented as standalone Cloudflare Worker (`redirect-worker/`) attached to the EMD zone
- Future EMD redirects (e.g. `metaforikikefalonia.gr`, `kefalonia-metaforiki.gr`) plug into the same Worker by adding routes in `redirect-worker/wrangler.jsonc`

## Env vars
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY    (server-only, admin actions)
RESEND_API_KEY
RESEND_FROM_EMAIL            no-reply@spathismetaforiki.gr
ADMIN_NOTIFICATION_EMAIL     aspathis@hotmail.gr
NEXT_PUBLIC_SITE_URL         https://spathismetaforiki.gr
GOOGLE_MAPS_EMBED_URL        (or use a static iframe)
```

## Open question (please confirm)
**Default language: Greek?** I'm setting `el` as default (Greek users hit `spathismetaforiki.gr/`, English users hit `/en/`). If you'd rather English default, say so — 30-second change.
