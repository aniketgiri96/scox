-- SEOX v3 core schema
-- Source: SEOX3 Complete Architecture (multi-user SaaS)

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid references auth.users primary key,
  email text unique not null,
  full_name text,
  plan text default 'free' check (plan in ('free', 'starter', 'pro', 'agency')),
  audits_used integer default 0,
  audits_limit integer default 1,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  niche text not null,
  industry text not null,
  url text,
  score integer,
  grade text,
  result_json jsonb,
  is_public boolean default false,
  public_slug text unique,
  created_at timestamptz default now()
);

create table if not exists industry_patterns (
  archetype text primary key,
  total_audits integer default 0,
  avg_score numeric(5,2) default 0,
  common_issues jsonb default '{}'::jsonb,
  top_insights jsonb default '[]'::jsonb,
  schema_types jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists competitor_analyses (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references audits(id) on delete cascade not null,
  competitors text[] not null,
  gaps_json jsonb,
  battle_plan jsonb,
  created_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references audits(id) on delete cascade not null,
  pdf_url text not null,
  white_label boolean default false,
  brand_name text,
  created_at timestamptz default now()
);

create table if not exists usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  audit_id uuid references audits(id) on delete cascade,
  tokens_used integer default 0,
  cost_usd numeric(10,4) default 0,
  created_at timestamptz default now()
);

create index if not exists idx_audits_user_id_created_at on audits(user_id, created_at desc);
create index if not exists idx_usage_logs_user_id_created_at on usage_logs(user_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table profiles enable row level security;
alter table audits enable row level security;
alter table industry_patterns enable row level security;
alter table competitor_analyses enable row level security;
alter table reports enable row level security;
alter table usage_logs enable row level security;

-- profiles
 drop policy if exists "users see own profile" on profiles;
create policy "users see own profile"
on profiles for select to authenticated
using (auth.uid() = id);

 drop policy if exists "users update own profile" on profiles;
create policy "users update own profile"
on profiles for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- audits
 drop policy if exists "users see own audits" on audits;
create policy "users see own audits"
on audits for select to authenticated
using (auth.uid() = user_id or is_public = true);

 drop policy if exists "users insert own audits" on audits;
create policy "users insert own audits"
on audits for insert to authenticated
with check (auth.uid() = user_id);

 drop policy if exists "users update own audits" on audits;
create policy "users update own audits"
on audits for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- industry patterns are globally readable
 drop policy if exists "patterns public read" on industry_patterns;
create policy "patterns public read"
on industry_patterns for select
using (true);

-- competitor analyses
 drop policy if exists "users see own competitor analyses" on competitor_analyses;
create policy "users see own competitor analyses"
on competitor_analyses for select to authenticated
using (
  exists (
    select 1 from audits a where a.id = competitor_analyses.audit_id and a.user_id = auth.uid()
  )
);

 drop policy if exists "users insert own competitor analyses" on competitor_analyses;
create policy "users insert own competitor analyses"
on competitor_analyses for insert to authenticated
with check (
  exists (
    select 1 from audits a where a.id = competitor_analyses.audit_id and a.user_id = auth.uid()
  )
);

-- reports
 drop policy if exists "users see own reports" on reports;
create policy "users see own reports"
on reports for select to authenticated
using (
  exists (
    select 1 from audits a where a.id = reports.audit_id and a.user_id = auth.uid()
  )
);

 drop policy if exists "users insert own reports" on reports;
create policy "users insert own reports"
on reports for insert to authenticated
with check (
  exists (
    select 1 from audits a where a.id = reports.audit_id and a.user_id = auth.uid()
  )
);

-- usage logs
 drop policy if exists "users see own usage" on usage_logs;
create policy "users see own usage"
on usage_logs for select to authenticated
using (auth.uid() = user_id);

 drop policy if exists "users insert own usage" on usage_logs;
create policy "users insert own usage"
on usage_logs for insert to authenticated
with check (auth.uid() = user_id);
