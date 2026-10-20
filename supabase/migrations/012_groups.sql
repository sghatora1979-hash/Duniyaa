-- 012: Groups (Samuh) — Duniya groups + members
create table if not exists public.av_groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.av_profiles(id) on delete cascade,
  name text not null,
  description text,
  cover_url text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.av_group_members (
  group_id uuid not null references public.av_groups(id) on delete cascade,
  user_id uuid not null references public.av_profiles(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

alter table public.av_groups enable row level security;
alter table public.av_group_members enable row level security;

drop policy if exists "av_groups read" on public.av_groups;
create policy "av_groups read" on public.av_groups for select using (is_public or owner_id = auth.uid());
drop policy if exists "av_groups create" on public.av_groups;
create policy "av_groups create" on public.av_groups for insert with check (auth.uid() = owner_id);
drop policy if exists "av_groups own" on public.av_groups;
create policy "av_groups own" on public.av_groups for update using (auth.uid() = owner_id);
drop policy if exists "av_groups del" on public.av_groups;
create policy "av_groups del" on public.av_groups for delete using (auth.uid() = owner_id);

drop policy if exists "av_group_members read" on public.av_group_members;
create policy "av_group_members read" on public.av_group_members for select using (true);
drop policy if exists "av_group_members join" on public.av_group_members;
create policy "av_group_members join" on public.av_group_members for insert with check (auth.uid() = user_id);
drop policy if exists "av_group_members leave" on public.av_group_members;
create policy "av_group_members leave" on public.av_group_members for delete using (auth.uid() = user_id);
