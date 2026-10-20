'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Item = { icon: string; title: string; sub: string; href: string };
type Section = { name: string; items: Item[] };

/* Facebook ke Menu jaisa logic, Duniya ke apne naam */
const SECTIONS: Section[] = [
  {
    name: '✨ Banao (Create)',
    items: [
      { icon: '✍️', title: 'Post', sub: 'Apne vichaar likho', href: '/home' },
      { icon: '🎬', title: 'Clip', sub: 'Apni photo ka short clip', href: '/reels' },
      { icon: '📖', title: 'Story', sub: '24 ghante wali story', href: '/home' },
      { icon: '🌱', title: 'Jeevan Update', sub: 'Life update share karo', href: '/home' },
      { icon: '🏪', title: 'Dukaan Page', sub: 'Apne business ka page', href: '/business' },
      { icon: '📢', title: 'Prachaar', sub: 'Ad lagao', href: '/business' },
      { icon: '🏘️', title: 'Samuh', sub: 'Naya group banao', href: '/groups' },
      { icon: '🎪', title: 'Utsav', sub: 'Naya event jodo', href: '/events' },
    ],
  },
  {
    name: '👥 Dost aur Duniya (Social)',
    items: [
      { icon: '👥', title: 'Mitra', sub: 'Doston ko dhoondo', href: '/friends' },
      { icon: '🏘️', title: 'Samuh', sub: 'Groups me shamil ho', href: '/groups' },
      { icon: '🎪', title: 'Utsav', sub: 'Aas-paas ke events', href: '/events' },
      { icon: '💼', title: 'Naukri', sub: 'Rozgaar ke avsar', href: '/briefcase' },
      { icon: '🎁', title: 'Inaam', sub: 'Rewards kamao', href: '/rewards' },
      { icon: '👨‍👩‍👧', title: 'Parivaar', sub: 'Family tree', href: '/family' },
      { icon: '📸', title: 'Albums', sub: 'Tasveeron ke sangrah', href: '/albums' },
      { icon: '🎉', title: 'Tyohar', sub: 'Festivals calendar', href: '/festivals' },
      { icon: '🔴', title: 'Live', sub: 'Live jao', href: '/live' },
      { icon: '🔗', title: 'Jod', sub: 'Apne social links', href: '/links' },
    ],
  },
  {
    name: '💼 Kaam-Kaaj (Professional)',
    items: [
      { icon: '🎛️', title: 'Duniya Studio', sub: 'Insights, content, kamai', href: '/studio' },
      { icon: '📢', title: 'Duniya Prachaar', sub: 'Ads manager', href: '/business' },
      { icon: '🏢', title: 'Duniya Vyapaar', sub: 'Business suite', href: '/business' },
    ],
  },
];

export function MenuPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  const needle = q.trim().toLowerCase();
  const sections = SECTIONS.map((s) => ({
    ...s,
    items: needle ? s.items.filter((i) => (i.title + ' ' + i.sub).toLowerCase().includes(needle)) : s.items,
  })).filter((s) => s.items.length > 0);
  return (
    <>
      <div className="menubackdrop" onClick={onClose} />
      <aside className="menupanel" role="dialog" aria-label="Duniya Menu">
        <div className="menuhead">
          <h2>☰ Duniya Menu</h2>
          <button className="iconbtn" onClick={onClose} aria-label="Close menu">✕</button>
        </div>
        <input
          className="input"
          placeholder="🔍 Menu me dhoondo..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ margin: '0 14px 10px' }}
        />
        <div className="menuscroll">
          {sections.map((s) => (
            <div key={s.name} style={{ marginBottom: 14 }}>
              <h3 className="menusection">{s.name}</h3>
              {s.items.map((i) => (
                <Link key={i.title + i.href} href={i.href} className="menulink" onClick={onClose}>
                  <span className="menuicon">{i.icon}</span>
                  <span><b>{i.title}</b><small>{i.sub}</small></span>
                </Link>
              ))}
            </div>
          ))}
          {sections.length === 0 && <p style={{ padding: '10px 16px', color: 'var(--mut)' }}>Kuch nahi mila.</p>}
        </div>
      </aside>
    </>
  );
}
