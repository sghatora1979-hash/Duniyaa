-- 009_reels_photo.sql — Duniya v4.7: photo-clips ke liye duration column.
-- Supabase → SQL Editor me ek baar paste karke Run karo.
-- av_reels.video_url pehle se hai (001) — photo ka public URL wahi save hoga.
alter table public.av_reels
  add column if not exists duration_sec int not null default 5;
