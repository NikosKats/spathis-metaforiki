-- Spathis Logistics — Supabase schema
-- Run in Supabase SQL editor (one-shot). Idempotent where possible.

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- Helpers
-- ============================================================
create or replace function public.is_admin() returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
  );
$$;

-- ============================================================
-- admin_users — links Supabase Auth user → admin role
-- Bootstrap: insert your auth user id here from Supabase dashboard
-- ============================================================
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "admins can read admin_users"
  on public.admin_users for select
  using (public.is_admin());

-- ============================================================
-- site_settings — singleton row of editable site-wide config
-- ============================================================
create table if not exists public.site_settings (
  id int primary key default 1,
  phone_primary text,
  phone_secondary text,
  email text,
  whatsapp_number text,
  viber_number text,
  address_el text,
  address_en text,
  hours_el text,
  hours_en text,
  google_maps_embed_url text,
  social_facebook text,
  social_instagram text,
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);

alter table public.site_settings enable row level security;

create policy "anyone can read site_settings"
  on public.site_settings for select using (true);

create policy "admins can update site_settings"
  on public.site_settings for update using (public.is_admin()) with check (public.is_admin());

create policy "admins can insert site_settings"
  on public.site_settings for insert with check (public.is_admin());

-- ============================================================
-- services — CMS-managed services (full loads, containers, haulage)
-- ============================================================
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_el text not null,
  title_en text not null,
  short_el text,
  short_en text,
  description_el text,
  description_en text,
  icon text,                       -- lucide icon name or asset path
  display_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "anyone can read published services"
  on public.services for select using (published = true or public.is_admin());

create policy "admins manage services"
  on public.services for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- pages — CMS-managed static pages (about, privacy, terms, ...)
-- ============================================================
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_el text not null,
  title_en text not null,
  body_el text,                    -- markdown
  body_en text,                    -- markdown
  meta_description_el text,
  meta_description_en text,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.pages enable row level security;

create policy "anyone can read published pages"
  on public.pages for select using (published = true or public.is_admin());

create policy "admins manage pages"
  on public.pages for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- blog_posts
-- ============================================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_el text not null,
  title_en text not null,
  excerpt_el text,
  excerpt_en text,
  body_el text,                    -- markdown
  body_en text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_published on public.blog_posts(status, published_at desc);

alter table public.blog_posts enable row level security;

create policy "anyone can read published posts"
  on public.blog_posts for select
  using (status = 'published' or public.is_admin());

create policy "admins manage blog"
  on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- contact_submissions — public contact form
-- ============================================================
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  language text not null default 'el' check (language in ('el','en')),
  user_agent text,
  ip_hash text,                    -- sha256(ip + salt) for abuse tracking, not raw IP
  status text not null default 'new' check (status in ('new','handled','spam')),
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_status on public.contact_submissions(status, created_at desc);

alter table public.contact_submissions enable row level security;

create policy "anonymous can submit contact"
  on public.contact_submissions for insert
  with check (true);

create policy "admins read/update contact"
  on public.contact_submissions for select using (public.is_admin());

create policy "admins update contact"
  on public.contact_submissions for update using (public.is_admin()) with check (public.is_admin());

create policy "admins delete contact"
  on public.contact_submissions for delete using (public.is_admin());

-- ============================================================
-- quote_requests — public quote form (longer)
-- ============================================================
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  cargo_type text not null check (cargo_type in ('full_load','container','haulage','other')),
  origin text not null,
  destination text not null,
  weight_kg numeric,
  volume_m3 numeric,
  pickup_date date,
  delivery_date date,
  notes text,
  language text not null default 'el' check (language in ('el','en')),
  user_agent text,
  ip_hash text,
  status text not null default 'new' check (status in ('new','quoted','won','lost','spam')),
  created_at timestamptz not null default now()
);

create index if not exists idx_quotes_status on public.quote_requests(status, created_at desc);

alter table public.quote_requests enable row level security;

create policy "anonymous can submit quote"
  on public.quote_requests for insert with check (true);

create policy "admins read quotes"
  on public.quote_requests for select using (public.is_admin());

create policy "admins update quotes"
  on public.quote_requests for update using (public.is_admin()) with check (public.is_admin());

create policy "admins delete quotes"
  on public.quote_requests for delete using (public.is_admin());

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_services_updated on public.services;
create trigger trg_services_updated before update on public.services
  for each row execute function public.set_updated_at();

drop trigger if exists trg_pages_updated on public.pages;
create trigger trg_pages_updated before update on public.pages
  for each row execute function public.set_updated_at();

drop trigger if exists trg_blog_updated on public.blog_posts;
create trigger trg_blog_updated before update on public.blog_posts
  for each row execute function public.set_updated_at();

drop trigger if exists trg_settings_updated on public.site_settings;
create trigger trg_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();
