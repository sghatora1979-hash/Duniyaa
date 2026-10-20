'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supa, isSupaConfigured } from './supabase';

export type Session = { id: string; email: string } | null;

/**
 * DEMO LOGIN switch (Duniya v4.7):
 * false = ASLI login — email par 6-digit OTP aayega, asli account + asli profile banega.
 *        (Shart: Supabase → Authentication → Email Templates → "Magic Link"
 *         template me line honi chahiye: {{ .Token }} — tabhi email me code aayega.)
 * true  = demo login — koi bhi email + koi bhi code → seedha andar, email nahi jata.
 *         (2026-10-19 shaam ko demo ON tha jab email template kharab tha;
 *          raat ko Sandeep ke order par FULLY WORKING ke liye OFF kiya gaya.)
 */
export const DEMO_LOGIN = true;  /* login update domain ke baad — abhi demo hi chalega (uska order 2026-10-19) */

const DEMO_KEY = 'duniya_demo_user';

/** Demo login: koi bhi email + koi bhi code → local session, /home khul jayega. */
export function demoSignIn(email: string, name?: string) {
  const u = { id: 'demo-' + email.trim().toLowerCase(), email: email.trim(), name: (name || '').trim() };
  try { localStorage.setItem(DEMO_KEY, JSON.stringify(u)); } catch { /* ignore */ }
  return u;
}

export function demoSignOut() {
  try { localStorage.removeItem(DEMO_KEY); } catch { /* ignore */ }
}

function getDemoSession(): Session {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) { const u = JSON.parse(raw); if (u && u.id && u.email) return { id: u.id, email: u.email }; }
  } catch { /* ignore */ }
  return null;
}

export function useSession() {
  const router = useRouter();
  const [session, setSession] = useState<Session>(undefined as unknown as Session);
  useEffect(() => {
    // Demo login ON hai to local demo session hi kaafi hai — Supabase ki zaroorat nahi.
    if (DEMO_LOGIN) { const d = getDemoSession(); setSession(d); return; }
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
  demoSignOut();
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
