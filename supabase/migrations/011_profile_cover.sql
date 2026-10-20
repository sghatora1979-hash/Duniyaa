-- 011_profile_cover.sql — Duniya v4.7: profile cover photo column.
-- Supabase → SQL Editor me ek baar paste karke Run karo.
alter table public.av_profiles
  add column if not exists cover_url text;
