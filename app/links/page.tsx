'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supa, isSupaConfigured } from '../../lib/supabase';
import { RequireAuth } from '../../lib/auth';
import { useLang, Shell } from '../../components/ui';
import { ReferCard } from '../../components/hybrid';

const SECTIONS = [
  { href: '/home', icon: '🏠', key: 'home' as const },
  { href: '/reels', icon: '🎬', key: 'reels' as const, label: 'Clips' },
  { href: '/live', icon: '📡', key: 'live' as const },
  { href: '/messages', icon: '💬', key: 'messages' as const },
  { href: '/friends', icon: '👥', key: 'friends' as const },
  { href: '/family', icon: '🌳', key: 'family' as const },
  { href: '/briefcase', icon: '💼', key: 'briefcase' as const },
  { href: '/business', icon: '🏢', key: 'business' as const },
  { href: '/rewards', icon: '🏆', key: 'rewards' as const },
  { href: '/profile', icon: '👤', key: 'profile' as const },
];

const SOCIALS: Array<{ key: string; icon: string; label: string; prefix: string }> = [
  { key: 'telegram', icon: '✈️', label: 'Telegram', prefix: 'https://t.me/' },
  { key: 'facebook', icon: '📘', label: 'Facebook', prefix: 'https://facebook.com/' },
  { key: 'instagram', icon: '📸', label: 'Instagram', prefix: 'https://instagram.com/' },
  { key: 'tiktok', icon: '🎵', label: 'TikTok', prefix: 'https://tiktok.com/@' },
  { key: 'vk', icon: '🔷', label: 'VK', prefix: 'https://vk.com/' },
  { key: 'youtube', icon: '▶️', label: 'YouTube', prefix: 'https://youtube.com/@' },
];

export default function Links() {
  return <RequireAuth><Hub /></RequireAuth>;
}

function Hub() {
  const { t } = useLang();
  const [socials, setSocials] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      if (!isSupaConfigured()) return;
      const { data: { user } } = await supa().auth.getUser();
      if (!user) return;
      const { data } = await supa().from('av_profiles').select('social_links').eq('id', user.id).single();
      if (data) setSocials((data.social_links as Record<string, string>) || {});
    })();
  }, []);

  const mine = SOCIALS.filter((s) => socials[s.key]);

  return (
    <Shell title={`🔗 ${t('links')}`} sub={t('quickLinks')}>
      <div className="linkgrid">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="linkcard">
            <span className="lic">{s.icon}</span>
            {s.label ?? t(s.key)}
          </Link>
        ))}
      </div>

      <h2 className="genlabel">{t('mySocialLinks')}</h2>
      {mine.length === 0 ? (
        <div className="card">
          <p style={{ color: 'var(--mut)' }}>{t('noSocialLinks')}</p>
          <Link href="/profile" className="btn violet" style={{ padding: '8px 18px', fontSize: '.88rem' }}>
            👤 {t('profile')} →
          </Link>
        </div>
      ) : (
        <div className="card">
          <div className="socrow">
            {mine.map((s) => (
              <a
                key={s.key} className="socbtn"
                href={`${s.prefix}${encodeURIComponent(socials[s.key])}`}
                target="_blank" rel="noopener noreferrer"
              >
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <h2 className="genlabel">🎁 Refer & Earn</h2>
      <ReferCard />
    </Shell>
  );
}
