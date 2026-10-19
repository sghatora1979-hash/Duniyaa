'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { getLang, setLang, tr, LANGS, type Lang, type StrKey } from '../lib/i18n';
import { hourTheme, applyTheme, type HourTheme } from '../lib/theme';
import { MobileNav, LeftRail, RightRail, ChipRow } from './hybrid';

export function useLang() {
  const [lang, setL] = useState<Lang>('en');
  useEffect(() => setL(getLang()), []);
  const switchLang = (l: Lang) => { setLang(l); setL(l); };
  const t = (k: StrKey) => tr(k, lang);
  return { lang, switchLang, t };
}

// Applies the calm theme on mount (single theme — no hourly rotation)
export function useHourTheme() {
  const [theme, setTheme] = useState<HourTheme>(hourTheme());
  useEffect(() => { applyTheme(hourTheme()); }, []);
  return theme;
}

export function ThemeBadge() {
  const theme = useHourTheme();
  return (
    <span className="themebadge" title="Duniya calm theme">
      <span className="themedot" /> 🎨 {theme.name}
    </span>
  );
}

/* Slim mirrored topbar: language LEFT, search CENTER, logo RIGHT.
   (Every other network puts logo left — Duniya mirrors it.) */
export function Navbar() {
  const { lang, switchLang, t } = useLang();
  const router = useRouter();
  const [q, setQ] = useState('');
  function go(e: FormEvent) {
    e.preventDefault();
    router.push('/search?q=' + encodeURIComponent(q.trim()));
  }
  return (
    <nav className="topbar slim" aria-label="Primary">
      <select
        className="langbtn"
        value={lang}
        onChange={(e) => switchLang(e.target.value as Lang)}
        aria-label="Language"
      >
        {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>
      <form className="topsearch" onSubmit={go} role="search">
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`\uD83D\uDD0D ${t('searchPeople')}`}
          aria-label={t('search')}
        />
      </form>
      <Link href="/" className="logo">\uD83C\uDDEE\uD83C\uDDF3 Duniya <small style={{ fontWeight: 600, opacity: 0.85 }}>· दुनिया</small></Link>
    </nav>
  );
}

export function Shell({ children, title, sub, wide = false }: {
  children: React.ReactNode; title: string; sub?: string; wide?: boolean;
}) {
  const path = usePathname();
  const bare = path === '/login' || path === '/register';
  return (
    <div className="wrap">
      <Navbar />
      <main className="main">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <h1 className="ptitle" style={{ margin: '14px 0 4px' }}>{title}</h1>
          <ThemeBadge />
        </div>
        {sub && <p className="psub">{sub}</p>}
        {bare ? (
          children
        ) : (
          <>
            <ChipRow />
            <div className="d3">
              <LeftRail />
              <div className="feed-col">{children}</div>
              <RightRail />
            </div>
          </>
        )}
      </main>
      <footer className="foot">Duniya 🇮🇳 — Made for India · Web3-ready · v1</footer>
      <MobileNav />
    </div>
  );
}

// Daily rotating message colour — 7 colours, changes every day
export const DAY_COLORS = ['#FF6B35', '#8B5CF6', '#059669', '#DC2626', '#2563EB', '#DB2777', '#CA8A04'];
export function dayColor(): string {
  return DAY_COLORS[Math.floor(Date.now() / 86400000) % DAY_COLORS.length];
}
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
