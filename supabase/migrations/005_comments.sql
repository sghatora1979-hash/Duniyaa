-- Duniya migration 005: post comments
-- Run in Supabase SQL editor (after 001-004).

create table if not exists public.av_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.av_posts(id) on delete cascade,
  user_id uuid not null references public.av_profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

alter table public.av_comments enable row level security;

drop policy if exists "av_comments read" on public.av_comments;
create policy "av_comments read" on public.av_comments for select using (true);

drop policy if exists "av_comments own write" on public.av_comments;
create policy "av_comments own write" on public.av_comments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists av_comments_post_idx on public.av_comments (post_id, created_at desc);

-- Realtime: allow clients to receive new messages + comments live
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'av_messages') then
    alter publication supabase_realtime add table public.av_messages;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'av_comments') then
    alter publication supabase_realtime add table public.av_comments;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'av_posts') then
    alter publication supabase_realtime add table public.av_posts;
  end if;
exception when others then
  -- publication may not exist on older projects; realtime degrades to refresh button
  null;
end $$;
