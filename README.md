# Spathis Logistics — Website

Multilingual (Greek / English) website for **ΣΠΑΘΗΣ — Μεταφορική Κεφαλονιάς**, a logistics company in Skala, Kefalonia.

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · next-intl · Supabase · Resend · Cloudflare Pages

See [`brief/architecture.md`](brief/architecture.md) for the full architecture and [`brief/build-plan.md`](brief/build-plan.md) for the phased plan.

## Repo layout
```
spathis-logistics/
├── brief/         briefs, architecture, content drafts
├── assets/        source assets (logo, images)
├── web/           Next.js application
└── supabase/      schema + seed SQL
```

## Setup

```bash
cd web
cp .env.example .env.local   # then fill in Supabase / Resend keys
pnpm install                  # already done
pnpm dev                      # start dev server on http://localhost:3000
```

## Supabase setup
1. Create a project at https://supabase.com
2. In SQL Editor, run `supabase/schema.sql` then `supabase/seed.sql`
3. Create your admin auth user under Authentication → Users
4. Insert a row in `admin_users` with that user's id (one-off)
5. Copy URL + anon key + service role key into `web/.env.local`

## Resend setup
1. Verify `spathismetaforiki.gr` domain at https://resend.com/domains
2. Add SPF / DKIM DNS records (Cloudflare DNS makes this easy)
3. Add API key to `web/.env.local`

## Deploy (Cloudflare Pages)
Phase 7. Will use `@cloudflare/next-on-pages` (added later) and Cloudflare DNS for `spathismetaforiki.gr`.

## i18n
- Default locale: **Greek** (`el`) → `/`, `/services`, ...
- Secondary: **English** (`en`) → `/en`, `/en/services`, ...
- Add new strings in `web/src/messages/{el,en}.json`

## Languages — heads-up for Next 16
This app targets **Next.js 16**, which renamed `middleware.ts` → `proxy.ts` and `middleware()` → `proxy()`. The next-intl middleware is wired through `web/src/proxy.ts`. Reference: `web/node_modules/next/dist/docs/01-app/02-guides/internationalization.md`.
