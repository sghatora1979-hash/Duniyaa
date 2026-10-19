'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supa, isSupaConfigured } from './supabase';

export type Session = { id: string; email: string } | null;

export function useSession() {
  const router = useRouter();
  const [session, setSession] = useState<Session>(undefined as unknown as Session);
  useEffect(() => {
    if (!isSupaConfigured()) { setSession(null); return; }
    supa().auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) { setSession({ id: u.id, email: u.email || '' }); ensureProfile(u.id, u.email || '', (u.user_metadata as { full_name?: string })?.full_name); }
      else setSession(null);
    });
    const { data: sub } = supa().auth.onAuthStateChange((_e, s) => {
      const u = s?.user;
      if (u) { setSession({ id: u.id, email: u.email || '' }); ensureProfile(u.id, u.email || '', (u.user_metadata as { full_name?: string })?.full_name); }
      else setSession(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return session;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session === null) router.replace('/login');
  }, [session, router]);
  if (session === undefined) return <div className="wrap"><p style={{ padding: 40 }}>Loading…</p></div>;
  if (session === null) return null;
  return <>{children}</>;
}

export async function signOut() {
  if (isSupaConfigured()) await supa().auth.signOut();
}

/** Ensure every registered user has a profile row (visible in search/friends).
   Called on login — "anyone can register, profile auto-banta hai". */
export async function ensureProfile(userId: string, email: string, metaName?: string) {
  if (!isSupaConfigured() || !userId) return;
  try {
    const { data } = await supa().from('av_profiles').select('id').eq('id', userId).maybeSingle();
    if (!data) {
      const raw = (metaName || email.split('@')[0] || 'Duniya User').replace(/[._-]+/g, ' ').trim();
      const name = raw.charAt(0).toUpperCase() + raw.slice(1);
      await supa().from('av_profiles').insert({
        id: userId,
        full_name: name,
        avatar_emoji: '🙂',
        bio: '',
      });
    }
  } catch { /* ignore — RLS/network */ }
}
