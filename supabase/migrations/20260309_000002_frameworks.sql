create table if not exists frameworks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  niche text not null,
  industry text not null,
  objective text not null,
  strategy_json jsonb not null,
  created_at timestamptz default now()
);

create index if not exists idx_frameworks_user_created_at on frameworks(user_id, created_at desc);

alter table frameworks enable row level security;

drop policy if exists "users see own frameworks" on frameworks;
create policy "users see own frameworks"
on frameworks for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "users insert own frameworks" on frameworks;
create policy "users insert own frameworks"
on frameworks for insert to authenticated
with check (auth.uid() = user_id);
