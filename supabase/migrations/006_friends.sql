-- 006_friends.sql — friend requests + profile detail fields (Duniya v4.5)
-- Run once in Supabase SQL Editor, after 001-005.

-- Profile detail fields (phone already exists in 001)
alter table public.av_profiles add column if not exists address text;
alter table public.av_profiles add column if not exists job_title text;
alter table public.av_profiles add column if not exists company text;

-- Friendships: one row per pair, requester -> addressee
create table if not exists public.av_friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.av_profiles(id) on delete cascade,
  addressee_id uuid not null references public.av_profiles(id) on delete cascade,
  status text not null default 'pending', -- pending | accepted
  created_at timestamptz default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

alter table public.av_friendships enable row level security;

drop policy if exists "friendships readable by parties" on public.av_friendships;
create policy "friendships readable by parties" on public.av_friendships
  for select using (
    auth.uid() = requester_id or auth.uid() = addressee_id
  );

drop policy if exists "users can request friendship" on public.av_friendships;
create policy "users can request friendship" on public.av_friendships
  for insert with check (auth.uid() = requester_id);

drop policy if exists "parties can update friendship" on public.av_friendships;
create policy "parties can update friendship" on public.av_friendships
  for update using (
    auth.uid() = requester_id or auth.uid() = addressee_id
  );

drop policy if exists "parties can delete friendship" on public.av_friendships;
create policy "parties can delete friendship" on public.av_friendships
  for delete using (
    auth.uid() = requester_id or auth.uid() = addressee_id
  );

-- Profiles must be readable for search + public profile pages.
-- (If 001 already created a permissive select policy this is a no-op guard.)
drop policy if exists "profiles readable by authenticated" on public.av_profiles;
create policy "profiles readable by authenticated" on public.av_profiles
  for select using (auth.role() = 'authenticated');
