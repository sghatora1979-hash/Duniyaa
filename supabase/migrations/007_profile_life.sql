-- 007_profile_life.sql — life-profile fields: bio-data, timeline, religion (Duniya v4.6)
-- Run once in Supabase SQL Editor, after 001-006.

alter table public.av_profiles add column if not exists dob date;
alter table public.av_profiles add column if not exists birth_place text;
alter table public.av_profiles add column if not exists school text;
alter table public.av_profiles add column if not exists college text;
alter table public.av_profiles add column if not exists religion text;
alter table public.av_profiles add column if not exists ethnicity text;
alter table public.av_profiles add column if not exists marriage_status text;
