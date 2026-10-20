-- 010_storage_buckets.sql — Duniya v4.7: photo/file storage buckets.
-- Supabase → SQL Editor me ek baar paste karke Run karo.
-- App teen buckets use karta hai:
--   av-media = profile photo, album photo, reels photo-clip (public read)
--   av-kyc   = KYC documents (private — sirf owner)
--   av-vault = Briefcase files (private — sirf owner)

insert into storage.buckets (id, name, public) values ('av-media', 'av-media', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('av-kyc', 'av-kyc', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('av-vault', 'av-vault', false)
  on conflict (id) do nothing;

-- av-media: sab dekh sakte hain, login user upload/update/delete kar sakta hai
drop policy if exists "av-media public read" on storage.objects;
create policy "av-media public read" on storage.objects
  for select using (bucket_id = 'av-media');
drop policy if exists "av-media auth insert" on storage.objects;
create policy "av-media auth insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'av-media');
drop policy if exists "av-media auth update" on storage.objects;
create policy "av-media auth update" on storage.objects
  for update to authenticated using (bucket_id = 'av-media');
drop policy if exists "av-media auth delete" on storage.objects;
create policy "av-media auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'av-media');

-- av-kyc + av-vault: sirf owner (jisne upload kiya) dekh/badla sakta hai
drop policy if exists "av-private owner all" on storage.objects;
create policy "av-private owner all" on storage.objects
  for all to authenticated
  using (bucket_id in ('av-kyc', 'av-vault') and owner = auth.uid())
  with check (bucket_id in ('av-kyc', 'av-vault') and owner = auth.uid());
