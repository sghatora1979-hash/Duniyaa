'use client';
/**
 * Duniya FB/IG hybrid UI: mobile bottom nav, desktop sidebar with Muse AI,
 * Stories carousel, and sponsored posts. All client-side, Supabase-backed.
 */
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supa, isSupaConfigured } from '../lib/supabase';
import { signOut } from '../lib/auth';
import { useLang } from './ui';
import type { StrKey } from '../lib/i18n';
import {
  upcomingFestivals, holidayTomorrow, prettyDate, SPORTS,
  upcomingBigEvents, type Festival, type BigEvent,
} from '../lib/festivals';
import { WORLDS, getWorld, upcomingWorldFestivals, type World, type WorldFestival } from '../lib/worlds';

/* ============ Shared nav model (Orkut + VK pattern, MIRRORED) ============
   VK/Orkut keep primary nav on the LEFT — Duniya mirrors it to the RIGHT.
   Same familiar pattern, visibly different arrangement. */
export type NavTab = { href: string; icon: string; key: StrKey; label?: string };
export const MAIN_TABS: NavTab[] = [
  { href: '/home', icon: '🏠', key: 'home' },
  { href: '/reels', icon: '🎬', key: 'reels', label: 'Clips' },
  { href: '/messages', icon: '💬', key: 'messages' },
  { href: '/friends', icon: '👥', key: 'friends' },
  { href: '/links', icon: '🔗', key: 'links' },
  { href: '/festivals', icon: '🎉', key: 'festivals' },
];
export type MoreTab = NavTab | { action: 'logout'; icon: string; key: StrKey };
export const MORE_TABS: MoreTab[] = [
  { href: '/live', icon: '📡', key: 'live' },
  { href: '/family', icon: '🌳', key: 'family' },
  { href: '/briefcase', icon: '💼', key: 'briefcase' },
  { href: '/business', icon: '🏢', key: 'business' },
  { href: '/rewards', icon: '🏆', key: 'rewards' },
  { href: '/profile', icon: '👤', key: 'profile' },
  { href: '/albums', icon: '📷', key: 'albums' },
  { action: 'logout', icon: '🚪', key: 'logout' },
];

/* ---------------- Mobile bottom nav ---------------- */
/* MIRRORED: Instagram puts Home leftmost — Duniya puts it rightmost.
   Same 5-tab pattern, reversed order. */
const TABS = [
  { href: '/profile', icon: '👤', key: 'profile' as const, label: null as string | null },
  { href: '/messages', icon: '💬', key: 'messages' as const, label: null as string | null },
  { href: '/home#composer', icon: '➕', key: 'create' as const, label: null as string | null },
  { href: '/reels', icon: '🎬', key: 'reels' as const, label: 'Clips' },
  { href: '/home', icon: '🏠', key: 'home' as const, label: null as string | null },
];

export function MobileNav() {
  const path = usePathname();
  const { t } = useLang();
  return (
    <nav className="mobilenav" aria-label="Primary">
      <div className="mrow">
        {TABS.map((tb) => (
          <Link
            key={tb.key}
            href={tb.href}
            className={tb.key !== 'create' && path === tb.href.split('#')[0] ? 'active' : ''}
          >
            <span className="mic">{tb.icon}</span>
            {tb.label ?? t(tb.key)}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/* ---------------- Desktop sidebar ---------------- */
/* (Nav links live in the top bar now — sidebar keeps Muse AI + Rewards.) */

const DUNIYA_AI_REPLIES = [
  'Bahut badhiya sawal! 👏 Duniya AI ka jawab: is duniya me sab kuch sambhav hai — feed, reels, parivaar, sab!',
  'Samajh gaya! 💡 Tip: roz post karo aur 🏆 rewards jeeto!',
  'Wah! 🎉 Tum Duniya ke star ho! Apni duniya ke tyohar bhi dekho — 🎉 Festivals page par!',
  'Accha sawal hai! 🌍 Duniya AI poori duniya jaanta hai — religions, festivals, sports, sab!',
];

/* ============ Duniya AI / The World AI — user's world ============
   Asked once ("aapki duniya kaunsi hai?"); festivals, sports, religions
   and the AI greeting adapt to it. Synced across components via event. */
export function useWorld() {
  const [worldId, setWorldId] = useState<string>(() =>
    typeof window === 'undefined' ? 'india' : (localStorage.getItem('duniya-world') || 'india'));
  useEffect(() => {
    const h = (e: Event) => setWorldId((e as CustomEvent<string>).detail);
    window.addEventListener('duniya-world', h);
    return () => window.removeEventListener('duniya-world', h);
  }, []);
  const setWorld = (id: string) => {
    try { localStorage.setItem('duniya-world', id); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent('duniya-world', { detail: id }));
  };
  return { world: getWorld(worldId), worldId, setWorld };
}

export function WorldPicker({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();
  const { worldId, setWorld } = useWorld();
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.85rem', fontWeight: 700 }}>
      <span>🌍 {t('myWorld')}</span>
      <select
        value={worldId}
        onChange={(e) => setWorld(e.target.value)}
        className="input"
        style={{ margin: 0, padding: compact ? '6px 10px' : '9px 12px', fontSize: '.85rem', width: 'auto', flex: 1 }}
        aria-label={t('chooseWorld')}
      >
        {WORLDS.map((w) => (
          <option key={w.id} value={w.id}>{w.flag} {w.name}</option>
        ))}
      </select>
    </label>
  );
}
/* LEFT rail: widgets (VK/Orkut put these RIGHT — mirrored LEFT) */

const DAILY_TIPS: string[] = [
  'Roz ek post karo — regular creators ko zyada rewards milte hain.',
  'Apni bhasha me post karo — Duniya 23 bhashaon me hai.',
  'Family tree me purani photos jodo — yaadein surakshit rahen.',
  'Clips banao — chhote videos par tez rewards.',
  'Doston ko invite karo — har judne wale par bonus.',
  'Briefcase me zaroori kagaz rakho — password se surakshit.',
  'Live jao — apne gaon/sheher se seedha jud jao.',
];

function DailyTip() {
  const tip = DAILY_TIPS[Math.floor(Date.now() / 86400000) % DAILY_TIPS.length];
  return (
    <div className="sidecard tipcard">
      <h3>💡 Aaj ka tip</h3>
      <p style={{ fontSize: '.88rem', color: 'var(--mut)', margin: 0, lineHeight: 1.6 }}>{tip}</p>
    </div>
  );
}

/* Upcoming festivals + "kal chhutti" banner (date-driven, auto-updates).
   Follows the user's world: India = full calendar, else the world's own. */
function FestivalWidget() {
  const { t, lang } = useLang();
  const { world } = useWorld();
  const [items, setItems] = useState<Array<{
    key: string; emoji: string; name: string; date: string; approx?: boolean; holiday?: boolean;
  }>>([]);
  const [hol, setHol] = useState<Festival | null>(null);
  const [picked, setPicked] = useState(true);
  useEffect(() => {
    try { setPicked(!!localStorage.getItem('duniya-world')); } catch { /* ignore */ }
    if (world.id === 'india') {
      setItems(upcomingFestivals(21).slice(0, 3).map((f) => ({
        key: f.id, emoji: f.emoji, name: lang === 'hi' ? f.hi : f.name,
        date: f.date, approx: f.approx, holiday: f.nationalHoliday,
      })));
      setHol(holidayTomorrow());
    } else {
      setItems(upcomingWorldFestivals(world, 120).slice(0, 4).map((f) => ({
        key: f.name, emoji: f.emoji, name: lang === 'hi' ? f.hi : f.name,
        date: f.date, approx: f.approx,
      })));
      setHol(null);
    }
  }, [world, lang]);
  return (
    <div className="sidecard">
      <h3>🎉 {t('upcomingFestivals')}</h3>
      {!picked && (
        <p style={{ fontSize: '.85rem', fontWeight: 700, margin: '0 0 6px' }}>
          🌍 {t('chooseWorld')}
        </p>
      )}
      <div style={{ marginBottom: 10 }}><WorldPicker compact /></div>
      {hol && (
        <div className="holbanner">
          🏛️ {t('holidayTomorrow')}: <b>{lang === 'hi' ? hol.hi : hol.name}</b> ({prettyDate(hol.date)})
        </div>
      )}
      {items.length === 0 && <p style={{ fontSize: '.85rem', color: 'var(--mut)', margin: 0 }}>—</p>}
      <div className="hstrip">
        {items.map((f) => (
          <div className="hcard" key={f.key}>
            <span className="femoji">{f.emoji}</span>
            <b>{f.name}{f.approx ? ' ~' : ''}</b>
            <small>{prettyDate(f.date)}{f.holiday ? ' · 🏛️' : ''}</small>
          </div>
        ))}
      </div>
      <Link href="/festivals" className="btn ghost" style={{ marginTop: 10, fontSize: '.85rem', padding: '8px 18px', display: 'inline-block', textDecoration: 'none' }}>
        {t('festivals')} →
      </Link>
    </div>
  );
}

/* India now: sports seasons — follows the user's world */
function SportsCard() {
  const { t } = useLang();
  const { world } = useWorld();
  const rows = world.id === 'india'
    ? SPORTS.map((s) => ({ emoji: s.emoji, name: s.name, sub: `${s.months} · ${s.level}` }))
    : world.sports.map((s) => ({ emoji: s.emoji, name: s.name, sub: s.months }));
  return (
    <div className="sidecard">
      <h3>🏟️ {world.flag} {world.id === 'india' ? t('indiaNow') : world.name} · {t('sports')}</h3>
      <div className="hstrip">
        {rows.map((s) => (
          <div className="hcard" key={s.name}>
            <span className="femoji">{s.emoji}</span>
            <b>{s.name}</b>
            <small>{s.sub}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

/* RIGHT-rail second bar: big events — concerts, fairs, stadium shows.
   Follows the user's world (India = verified listings). */
function EventsCard() {
  const { t, lang } = useLang();
  const { world } = useWorld();
  const [events, setEvents] = useState<BigEvent[]>([]);
  const [wfest, setWfest] = useState<WorldFestival[]>([]);
  useEffect(() => {
    if (world.id === 'india') {
      setEvents(upcomingBigEvents(75).slice(0, 4));
      setWfest([]);
    } else {
      setEvents([]);
      setWfest(upcomingWorldFestivals(world, 150).slice(0, 4));
    }
  }, [world]);
  return (
    <div className="sidecard">
      <h3>🎪 Events</h3>
      {events.length === 0 && wfest.length === 0 && (
        <p style={{ fontSize: '.85rem', color: 'var(--mut)', margin: '0 0 6px' }}>
          {t('indiaNow')} — {t('sports')} ⬇
        </p>
      )}
      <div className="hstrip">
        {events.map((e, i) => (
          <div className="hcard" key={`${e.name}-${e.date}-${i}`}>
            <span className="femoji">{e.emoji}</span>
            <b>{e.name}</b>
            <small>{prettyDate(e.date)}{e.dateEnd ? ` – ${prettyDate(e.dateEnd)}` : ''}<br />{e.venue}</small>
          </div>
        ))}
        {wfest.map((f) => (
          <div className="hcard" key={f.name}>
            <span className="femoji">{f.emoji}</span>
            <b>{lang === 'hi' ? f.hi : f.name}{f.approx ? ' ~' : ''}</b>
            <small>{prettyDate(f.date)}</small>
          </div>
        ))}
      </div>
      <div className="navsep" />
      <div className="hstrip">
        {SPORTS.slice(0, 3).map((s) => (
          <div className="hcard" key={s.name}>
            <span className="femoji">{s.emoji}</span>
            <b>{s.name}</b>
            <small>{s.months}</small>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '.75rem', color: 'var(--mut)', margin: '8px 0 0' }}>
        📻 {lang === 'hi' ? 'ताज़ा इवेंट्स के लिए देखते रहें' : 'More events added regularly'}
      </p>
    </div>
  );
}

/* LEFT rail: profile + nav first (Facebook pattern — Sandeep's order, 2026-10-19),
   then Duniya AI + widgets. */
export function NavCard() {
  const { t } = useLang();
  const path = usePathname();
  const router = useRouter();

  async function doLogout() {
    await signOut();
    router.replace('/login');
  }

  return (
    <div className="sidecard navrail" aria-label="Navigation">
      <ProfileMini />
      <nav>
        {MAIN_TABS.map((tb) => (
          <Link key={tb.href} href={tb.href} className={path === tb.href ? 'active' : ''}>
            <span className="nic">{tb.icon}</span>
            <span>{tb.label ?? t(tb.key)}</span>
          </Link>
        ))}
        <div className="navsep" />
        {MORE_TABS.map((m) =>
          'href' in m ? (
            <Link key={m.href} href={m.href} className={path === m.href ? 'active' : ''}>
              <span className="nic">{m.icon}</span>
              <span>{m.label ?? t(m.key)}</span>
            </Link>
          ) : (
            <button key="logout" onClick={doLogout}>
              <span className="nic">{m.icon}</span>
              <span>{t(m.key)}</span>
            </button>
          )
        )}
      </nav>
    </div>
  );
}

export function LeftRail() {
  const { t, lang } = useLang();
  const { world } = useWorld();
  const [q, setQ] = useState('');
  const greeting = lang === 'hi' ? world.aiGreetingHi : world.aiGreeting;
  const [chat, setChat] = useState<Array<{ me: boolean; text: string }>>([
    { me: false, text: greeting },
  ]);

  function ask() {
    if (!q.trim()) return;
    const mine = q.trim();
    setQ('');
    setChat((c) => [...c, { me: true, text: mine }]);
    setTimeout(() => {
      const reply = DUNIYA_AI_REPLIES[Math.floor(Math.random() * DUNIYA_AI_REPLIES.length)];
      setChat((c) => [...c, { me: false, text: reply }]);
    }, 700);
  }

  return (
    <aside className="rail-left" aria-label="Navigation and widgets">
      <NavCard />
      <div className="sidecard aicard">
        <h3>✨ {t('duniyaAI')}</h3>
        <div style={{ maxHeight: 180, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {chat.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.me ? 'flex-end' : 'flex-start',
                background: m.me ? 'var(--acc)' : 'rgba(255,255,255,.7)',
                color: m.me ? '#fff' : 'var(--ink)',
                padding: '7px 11px', borderRadius: 12, fontSize: '.82rem', maxWidth: '92%',
              }}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="airow">
          <input
            className="input" style={{ margin: 0 }} placeholder={`${t('duniyaAI')}…`}
            value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
          />
          <button className="btn violet" style={{ padding: '10px 16px' }} onClick={ask}>➤</button>
        </div>
      </div>
      <div className="sidecard">
        <h3>⭐ {t('rewards')}</h3>
        <p style={{ fontSize: '.85rem', color: 'var(--mut)', margin: 0 }}>
          Post karo, doston ko jodo, 🏆 jeeto!
        </p>
        <Link href="/rewards" className="btn ghost" style={{ marginTop: 10, fontSize: '.85rem', padding: '8px 18px' }}>
          {t('rewards')} →
        </Link>
      </div>
      <DailyTip />
      <SportsCard />
    </aside>
  );
}

/* Upcoming birthdays of accepted friends (next 30 days) + one-tap wish */
function BirthdayWidget() {
  const { t, lang } = useLang();
  const [bdays, setBdays] = useState<Array<{ id: string; full_name: string; avatar_emoji: string; nextIn: number }>>([]);
  useEffect(() => {
    (async () => {
      if (!isSupaConfigured()) return;
      try {
        const { data: { user } } = await supa().auth.getUser();
        if (!user) return;
        const { data: ships } = await supa().from('av_friendships')
          .select('requester_id,addressee_id').eq('status', 'accepted')
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
        const ids = [...new Set(((ships ?? []) as Array<{ requester_id: string; addressee_id: string }>)
          .flatMap((s) => [s.requester_id, s.addressee_id]).filter((id) => id !== user.id))];
        if (!ids.length) return;
        const { data: profs } = await supa().from('av_profiles')
          .select('id,full_name,avatar_emoji,dob').in('id', ids).not('dob', 'is', null);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const list = (((profs ?? []) as Array<{ id: string; full_name: string; avatar_emoji: string; dob: string }>)
          .map((p) => {
            const d = new Date(p.dob);
            let next = new Date(now.getFullYear(), d.getMonth(), d.getDate());
            if (next < today) next = new Date(now.getFullYear() + 1, d.getMonth(), d.getDate());
            const days = Math.round((next.getTime() - today.getTime()) / 86400000);
            return { id: p.id, full_name: p.full_name, avatar_emoji: p.avatar_emoji, nextIn: days };
          })
          .filter((p) => p.nextIn <= 30)
          .sort((a, b) => a.nextIn - b.nextIn)
          .slice(0, 5));
        setBdays(list);
      } catch { /* ignore */ }
    })();
  }, []);
  if (!bdays.length) return null;
  return (
    <div className="sidecard">
      <h3>🎂 {t('upcomingBirthdays')}</h3>
      <div className="hstrip">
        {bdays.map((b) => (
          <div className="hcard" key={b.id}>
            <span className="femoji">{b.avatar_emoji || '🎂'}</span>
            <b>{b.full_name || 'Friend'}</b>
            <small>{b.nextIn === 0 ? (lang === 'hi' ? 'आज!' : 'Today!') : `${b.nextIn} ${lang === 'hi' ? 'दिन में' : 'days'}`}</small>
            <Link href={`/messages?peer=${b.id}`} className="btn ghost" style={{ fontSize: '.75rem', padding: '6px 12px', marginTop: 4 }}>
              💌 {t('sendWish')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

/* RIGHT rail: Orkut-style profile block + VK-style vertical nav (mirrored RIGHT) */

function ProfileMini() {
  const [name, setName] = useState<string | null>(null);
  const [emoji, setEmoji] = useState('👤');
  useEffect(() => {
    (async () => {
      try {
        if (!isSupaConfigured()) return;
        const { data: { user } } = await supa().auth.getUser();
        if (!user) return;
        const { data } = await supa().from('av_profiles')
          .select('full_name,avatar_emoji').eq('id', user.id).single();
        if (data) {
          const d = data as { full_name?: string; avatar_emoji?: string };
          setName(d.full_name || null);
          setEmoji(d.avatar_emoji || '👤');
        }
      } catch { /* silent — card still renders */ }
    })();
  }, []);
  return (
    <div className="sidecard profile-mini">
      <div className="pm-head">
        <div className="avatar">{emoji}</div>
        <div className="pm-meta">
          <b>{name ?? 'Duniya User'}</b>
          <Link href="/profile">View profile →</Link>
        </div>
      </div>
    </div>
  );
}

/* RIGHT rail: Sponsored + events + birthdays + festivals (Facebook pattern) */
export function RightRail() {
  return (
    <aside className="rail-right" aria-label="Events and more">
      <div>
        <h3 className="railh">Sponsored</h3>
        <SponsoredCard seed={1} />
      </div>
      <FriendRequestsCard />
      <EventsCard />
      <BirthdayWidget />
      <FestivalWidget />
    </aside>
  );
}

/* Mobile chip row: every section stays reachable when the right rail hides */
export function ChipRow() {
  const { t } = useLang();
  const path = usePathname();
  const all: NavTab[] = [...MAIN_TABS, ...(MORE_TABS.filter((m) => 'href' in m) as NavTab[])];
  return (
    <div className="chiprow" aria-label="Sections">
      {all.map((tb) => (
        <Link key={tb.href} href={tb.href} className={path === tb.href ? 'active' : ''}>
          {tb.icon} {tb.label ?? t(tb.key)}
        </Link>
      ))}
    </div>
  );
}

/* Back-compat: anything still importing Sidebar gets the left widgets rail */
export const Sidebar = LeftRail;

/* ---------------- Stories carousel ---------------- */
export type Story = {
  id: string; user_id: string; caption: string; cover_emoji: string;
  media_url: string | null; created_at: string;
  av_profiles?: { full_name: string };
};

export function StoriesBar({ onSelect }: { onSelect: (stories: Story[], idx: number) => void }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [seen, setSeen] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      if (!isSupaConfigured()) return;
      const { data } = await supa()
        .from('av_stories')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(30);
      if (data) {
        setStories(data as Story[]);
        const ids = Array.from(new Set((data as Story[]).map((s) => s.user_id)));
        if (ids.length) {
          const { data: profs } = await supa().from('av_profiles').select('id,full_name').in('id', ids);
          const m: Record<string, string> = {};
          (profs || []).forEach((p: { id: string; full_name: string }) => (m[p.id] = p.full_name));
          setNames(m);
        }
      }
    })();
  }, []);

  function markSeen(id: string) {
    setSeen((s) => new Set(s).add(id));
  }

  return (
    <div className="stories" aria-label="Stories">
      <Link href="/reels" className="story create" style={{ textDecoration: 'none' }}>
        <div className="ring"><div className="ringin">➕</div></div>
        <small>Create</small>
      </Link>
      {stories.map((s, i) => (
        <div
          key={s.id} className={`story ${seen.has(s.id) ? 'seen' : ''}`}
          onClick={() => { markSeen(s.id); onSelect(stories, i); }}
        >
          <div className="ring"><div className="ringin">{s.cover_emoji}</div></div>
          <small>{(names[s.user_id] || 'Member').split(' ')[0]}</small>
        </div>
      ))}
    </div>
  );
}

export function StoryViewer({ stories, idx, onClose, onNav }: {
  stories: Story[]; idx: number; onClose: () => void; onNav: (i: number) => void;
}) {
  const s = stories[idx];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    setTick(0);
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    const close = setTimeout(() => {
      if (idx < stories.length - 1) onNav(idx + 1);
      else onClose();
    }, 6000);
    return () => { clearInterval(id); clearTimeout(close); };
  }, [idx]);

  if (!s) return null;
  return (
    <div className="storyviewer" onClick={onClose}>
      <div className="sframe" onClick={(e) => e.stopPropagation()}>
        <div className="sbar">
          {stories.map((_, i) => (
            <i key={i} className={i < idx || (i === idx && tick >= 6) ? 'done' : ''} />
          ))}
        </div>
        <button className="sclose" onClick={onClose}>✕</button>
        <div className="scontent">
          <div className="big">{s.cover_emoji}</div>
          <h3 style={{ margin: '0 0 8px' }}>{s.caption || 'Story'}</h3>
          <small style={{ opacity: .7 }}>{new Date(s.created_at).toLocaleString()}</small>
        </div>
        {idx > 0 && (
          <button className="sclose" style={{ right: 'auto', left: 14 }} onClick={() => onNav(idx - 1)}>‹</button>
        )}
        {idx < stories.length - 1 && (
          <button className="sclose" style={{ top: 'auto', bottom: 20, right: 14 }} onClick={() => onNav(idx + 1)}>›</button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Refer & Earn — share to every app ---------------- */
export function ShareButtons({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const eu = encodeURIComponent(url);
  const et = encodeURIComponent(text);

  const APPS = [
    { name: 'WhatsApp', icon: '💚', cls: 'green', href: `https://wa.me/?text=${et}%20${eu}` },
    { name: 'Telegram', icon: '✈️', cls: 'sky', href: `https://t.me/share/url?url=${eu}&text=${et}` },
    { name: 'Facebook', icon: '📘', cls: 'blue', href: `https://www.facebook.com/sharer/sharer.php?u=${eu}` },
    { name: 'Messenger', icon: '💬', cls: 'blue', href: `fb-messenger://share?link=${eu}` },
    { name: 'LinkedIn', icon: '💼', cls: 'blue', href: `https://www.linkedin.com/sharing/share-offsite/?url=${eu}` },
    { name: 'Instagram', icon: '📸', cls: 'pink', href: undefined },
  ];

  async function nativeShare() {
    try {
      if (navigator.share) await navigator.share({ title: 'Duniya', text, url });
    } catch { /* dismissed */ }
  }

  function copy() {
    navigator.clipboard?.writeText(`${text} ${url}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: 'center' }}>
        {typeof navigator !== 'undefined' && (navigator as Navigator & { share?: unknown }).share && (
          <button className="btn3d" onClick={nativeShare}>📤 Share…</button>
        )}
        {APPS.map((a) =>
          a.href ? (
            <a key={a.name} className={`btn3d ${a.cls}`} style={{ padding: '12px 18px', fontSize: '.9rem' }}
              href={a.href} target="_blank" rel="noopener noreferrer" title={`Share on ${a.name}`}>
              {a.icon} {a.name}
            </a>
          ) : (
            <button key={a.name} className={`btn3d ${a.cls}`} style={{ padding: '12px 18px', fontSize: '.9rem' }}
              onClick={copy} title="Copy link — paste it in Instagram DM or story">
              {a.icon} {a.name}
            </button>
          )
        )}
        <button className="btn3d gold" style={{ padding: '12px 18px', fontSize: '.9rem' }} onClick={copy}>
          {copied ? '✓ Copied!' : '🔗 Copy link'}
        </button>
      </div>
      {copied && <p className="ok" style={{ textAlign: 'center' }}>Link copied — paste it anywhere! 📋</p>}
    </div>
  );
}

export function ReferCard() {
  const [refUrl, setRefUrl] = useState('https://duniyaaaa.netlify.app/welcome');
  useEffect(() => {
    (async () => {
      try {
        if (!isSupaConfigured()) return;
        const { data: { user } } = await supa().auth.getUser();
        const base = typeof window !== 'undefined' ? window.location.origin : 'https://duniyaaaa.netlify.app';
        setRefUrl(user ? `${base}/welcome?ref=${user.id.slice(0, 8)}` : `${base}/welcome`);
      } catch { /* keep default */ }
    })();
  }, []);
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem' }}>🎁</div>
      <h3 style={{ margin: '6px 0' }}>Refer a Friend — sab jagah share karo!</h3>
      <p style={{ color: 'var(--mut)', fontSize: '.92rem' }}>
        Dost judega to tumhe <b>+50 🏆</b> coins! WhatsApp, Telegram, Facebook, Messenger, LinkedIn, Instagram — kahin bhi bhejo!
      </p>
      <div className="note" style={{ wordBreak: 'break-all', fontSize: '.82rem' }}>{refUrl}</div>
      <ShareButtons
        url={refUrl}
        text="Duniya join karo — India ka apna social network! 🇮🇳 Feed, Clips, Live, Family Tree — sab kuch ek jagah!"
      />
    </div>
  );
}

/* ---------------- Sponsored posts ---------------- */
const SPONSORS = [
  { name: 'Calm Horizons', emoji: '🌅', text: 'Find your peace — meditation retreats across the Himalayas. Book your escape today!', cta: 'Learn more' },
  { name: 'Articulate', emoji: '🎨', text: 'Speak 22 Indian languages fluently! Join 2 lakh+ learners on Articulate.', cta: 'Try free' },
  { name: 'Desi Dhaaga', emoji: '🧵', text: 'Handloom sarees, direct from weavers. Festive collection — up to 40% off!', cta: 'Shop now' },
];

export function SponsoredCard({ seed = 0 }: { seed?: number }) {
  const s = SPONSORS[seed % SPONSORS.length];
  const { t } = useLang();
  const [soon, setSoon] = useState(false);
  return (
    <div className="card sponsored">
      <span className="sponlabel">Sponsored</span>
      <div className="posthead">
        <div className="avatar">{s.emoji}</div>
        <div className="pmeta"><b>{s.name}</b><small>Sponsored · Duniya Ads</small></div>
      </div>
      <p className="ptext">{s.text}</p>
      <div className="pactions">
        <button className="btn violet" style={{ padding: '8px 20px', fontSize: '.88rem' }} onClick={() => setSoon(true)}>{s.cta} →</button>
      </div>
      {soon && <p className="note" style={{ margin: '10px 0 0' }}>{t('demoAdSoon')}</p>}
    </div>
  );
}

/* -------- Friend requests (RIGHT rail — Facebook pattern) -------- */
type FriendReq = { id: string; name: string; emoji: string };

export function FriendRequestsCard() {
  const [reqs, setReqs] = useState<FriendReq[]>([]);
  useEffect(() => {
    (async () => {
      if (!isSupaConfigured()) return;
      try {
        const { data: { user } } = await supa().auth.getUser();
        if (!user) return;
        const { data: ships } = await supa().from('av_friendships')
          .select('id,requester_id').eq('status', 'pending').eq('addressee_id', user.id)
          .order('created_at', { ascending: false }).limit(5);
        const rows = (ships as Array<{ id: string; requester_id: string }>) || [];
        if (!rows.length) { setReqs([]); return; }
        const { data: profs } = await supa().from('av_profiles')
          .select('id,full_name,avatar_emoji').in('id', rows.map((r) => r.requester_id));
        const m: Record<string, { full_name: string; avatar_emoji: string }> = {};
        ((profs as Array<{ id: string; full_name: string; avatar_emoji: string }>) || [])
          .forEach((p) => { m[p.id] = p; });
        setReqs(rows.map((r) => ({
          id: r.id,
          name: m[r.requester_id]?.full_name || 'Duniya User',
          emoji: m[r.requester_id]?.avatar_emoji || '🙂',
        })));
      } catch { /* ignore */ }
    })();
  }, []);

  async function act(id: string, accept: boolean) {
    try {
      if (accept) await supa().from('av_friendships').update({ status: 'accepted' }).eq('id', id);
      else await supa().from('av_friendships').delete().eq('id', id);
    } catch { /* ignore */ }
    setReqs((prev) => prev.filter((r) => r.id !== id));
  }

  if (!reqs.length) return null;
  return (
    <div className="sidecard">
      <h3>👥 Friend requests</h3>
      {reqs.map((r) => (
        <div key={r.id} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <div className="avatar">{r.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b style={{ fontSize: '.9rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</b>
            <div className="row" style={{ marginTop: 4, gap: 6, flexWrap: 'nowrap' }}>
              <button className="btn violet" style={{ padding: '6px 14px', fontSize: '.8rem' }} onClick={() => act(r.id, true)}>Confirm</button>
              <button className="btn ghost" style={{ padding: '6px 14px', fontSize: '.8rem', margin: 0 }} onClick={() => act(r.id, false)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------- People you may know (Home center — Facebook pattern) -------- */
type Suggestion = { id: string; full_name: string; avatar_emoji: string };

export function PeopleYouMayKnow() {
  const [people, setPeople] = useState<Suggestion[]>([]);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      if (!isSupaConfigured()) return;
      try {
        const { data: { user } } = await supa().auth.getUser();
        if (!user) return;
        const { data: ships } = await supa().from('av_friendships')
          .select('requester_id,addressee_id')
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
        const known = new Set<string>([user.id]);
        ((ships as Array<{ requester_id: string; addressee_id: string }>) || [])
          .forEach((s) => { known.add(s.requester_id); known.add(s.addressee_id); });
        const { data: profs } = await supa().from('av_profiles')
          .select('id,full_name,avatar_emoji').order('created_at', { ascending: false }).limit(30);
        const list = ((profs as Suggestion[]) || [])
          .filter((p) => !known.has(p.id)).slice(0, 8);
        setPeople(list);
      } catch { /* ignore */ }
    })();
  }, []);

  async function addFriend(pid: string) {
    try {
      const { data: { user } } = await supa().auth.getUser();
      if (!user) return;
      const { error } = await supa().from('av_friendships')
        .insert({ requester_id: user.id, addressee_id: pid, status: 'pending' });
      if (error) throw error;
      setSent((prev) => new Set(prev).add(pid));
    } catch { /* ignore */ }
  }

  const visible = people.filter((p) => !hidden.has(p.id));
  if (!visible.length) return null;
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
        <b style={{ fontSize: '1rem' }}>👥 People you may know</b>
        <small style={{ color: 'var(--mut)' }}>Duniya par naye dost banao</small>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6 }}>
        {visible.map((p) => (
          <div key={p.id} style={{
            minWidth: 148, maxWidth: 148, border: '1px solid rgba(0,0,0,.08)',
            borderRadius: 14, padding: 12, textAlign: 'center', position: 'relative',
            background: 'var(--card)',
          }}>
            <button
              aria-label="Dismiss" onClick={() => setHidden((prev) => new Set(prev).add(p.id))}
              style={{ position: 'absolute', top: 6, right: 8, border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--mut)', fontSize: '.95rem' }}
            >✕</button>
            <div style={{ fontSize: '2.2rem', lineHeight: 1.2 }}>{p.avatar_emoji || '🙂'}</div>
            <b style={{ fontSize: '.88rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.full_name || 'Duniya User'}</b>
            <button
              className="btn violet" disabled={sent.has(p.id)}
              style={{ padding: '7px 12px', fontSize: '.8rem', marginTop: 8, width: '100%' }}
              onClick={() => addFriend(p.id)}
            >
              {sent.has(p.id) ? '✓ Sent' : '➕ Add friend'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
