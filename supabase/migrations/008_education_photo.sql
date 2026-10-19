-- 008_education_photo.sql — education history + profile photo (Duniya v4.7)
-- Run once in Supabase SQL Editor, after 001-007.

alter table public.av_profiles add column if not exists avatar_url text;
alter table public.av_profiles add column if not exists edu_10th text;
alter table public.av_profiles add column if not exists edu_10th_school text;
alter table public.av_profiles add column if not exists edu_12th text;
alter table public.av_profiles add column if not exists edu_12th_school text;
alter table public.av_profiles add column if not exists edu_grad text;
alter table public.av_profiles add column if not exists edu_grad_college text;
alter table public.av_profiles add column if not exists edu_masters text;
alter table public.av_profiles add column if not exists edu_masters_college text;
alter table public.av_profiles add column if not exists job_history text;
