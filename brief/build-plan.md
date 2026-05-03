# Spathis Logistics — Build Plan

Phased plan. Each phase is a session's worth of work — we ship and review at each boundary.

## Phase 0 — Scaffold (this session)
- [x] Folder + brief
- [x] Architecture decisions
- [ ] Next.js 15 app with TS, Tailwind, App Router, src/, Turbopack
- [ ] shadcn/ui initialized
- [ ] `next-intl` configured with `el` (default) + `en`
- [ ] Supabase client (browser + server)
- [ ] Resend client + base react-email layout
- [ ] Folder structure stubbed
- [ ] `supabase/schema.sql` — tables + RLS
- [ ] `.env.example` filled
- [ ] README with setup steps

## Phase 1 — Public site shell
- [ ] Layout: header (lang switcher, logo, nav, phone CTA), footer
- [ ] Logo: SVG trace from PNG
- [ ] Home page — hero, services teaser, routes blurb, CTA
- [ ] Services index + 3 service detail pages
- [ ] Routes / Coverage page (with Kefalonia ↔ mainland visual)
- [ ] About page
- [ ] Contact page (info only, no form yet)
- [ ] Mobile-first; sticky tel/Viber/WhatsApp buttons on mobile
- [ ] All copy in `messages/el.json` + `messages/en.json`

## Phase 2 — Forms + email
- [ ] Contact form → API route → Supabase insert + Resend notification
- [ ] Quote request form (longer: origin, destination, cargo type, weight, dates) → same flow
- [ ] react-email templates (GR + EN) — admin notification + user auto-reply
- [ ] Server-side validation (Zod) + honeypot + rate limit (Cloudflare Turnstile or simple in-memory)

## Phase 3 — Admin auth
- [ ] `/admin` login (Supabase Auth, email + password)
- [ ] Middleware to gate `/admin/*`
- [ ] Dashboard with submission counts
- [ ] Submissions inbox (read, mark-as-handled, delete with confirm)
- [ ] Quote inbox

## Phase 4 — CMS
- [ ] Site settings editor (contact info, hours, address) — used everywhere on site
- [ ] Services editor (title/description per language, icon, order)
- [ ] Pages editor (about, privacy, terms) — markdown or simple rich text
- [ ] Image upload to Supabase Storage

## Phase 5 — Blog
- [ ] Blog list + post page (public)
- [ ] Blog editor in admin (markdown + cover image)
- [ ] RSS feed
- [ ] OG images auto-generated

## Phase 6 — Polish
- [ ] SEO: sitemap.xml, robots.txt, hreflang, JSON-LD (`LocalBusiness`, `MovingCompany`)
- [ ] Per-page OG images via `next/og`
- [ ] 404 + error pages (translated)
- [ ] Loading states / skeletons
- [ ] Accessibility audit (focus states, alt text, contrast)
- [ ] Lighthouse pass (target 95+ all categories)
- [ ] Privacy policy + Terms (lawyer-light placeholders, client to review)

## Phase 7 — Deploy
- [ ] Cloudflare Pages project + connect repo
- [ ] `@cloudflare/next-on-pages` build
- [ ] DNS: point `spathismetaforiki.gr` to Cloudflare
- [ ] Email: configure Resend domain (SPF, DKIM, DMARC)
- [ ] Cloudflare Web Analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Test on real devices (iOS Safari, Android Chrome)

## Out of scope (for now)
- Driver/dispatcher portal
- Live shipment tracking
- Online payments
- Multi-tenant CMS (single admin only)
