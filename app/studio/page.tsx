'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shell } from '../../components/ui';
import { useSession } from '../../lib/auth';
import { supa, isSupaConfigured } from '../../lib/supabase';

type Post = { id: string; body: string; created_at: string; author_id: string };
const PLAN_KEY = 'duniya_studio_plans';

export default function StudioPage() {
  const session = useSession();
  const [stats, setStats] = useState<{ posts: number | null; clips: number | null; members: number | null; myPosts: number | null }>({ posts: null, clips: null, members: null, myPosts: null });
  const [posts, setPosts] = useState<Post[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [plans, setPlans] = useState<Record<string, string>>({});
  const [planText, setPlanText] = useState('');
  const [planDay, setPlanDay] = useState(0);

  useEffect(() => {
    try { setPlans(JSON.parse(localStorage.getItem(PLAN_KEY) || '{}') as Record<string, string>); } catch { /* ignore */ }
    if (!isSupaConfigured()) return;
    (async () => {
      const sb = supa();
      const out = { posts: null as number | null, clips: null as number | null, members: null as number | null, myPosts: null as number | null };
      try { const r = await sb.from('av_posts').select('id', { count: 'exact', head: true }); out.posts = r.count ?? null; } catch { /* ignore */ }
      try { const r = await sb.from('av_reels').select('id', { count: 'exact', head: true }); out.clips = r.count ?? null; } catch { /* ignore */ }
      try { const r = await sb.from('av_profiles').select('id', { count: 'exact', head: true }); out.members = r.count ?? null; } catch { /* ignore */ }
      if (session && !session.id.startsWith('demo-')) {
        try { const r = await sb.from('av_posts').select('id', { count: 'exact', head: true }).eq('author_id', session.id); out.myPosts = r.count ?? null; } catch { /* ignore */ }
      }
      setStats(out);
      try {
        const { data } = await sb.from('av_posts').select('id,body,created_at,author_id').order('created_at', { ascending: false }).limit(8);
        const list = (data || []) as Post[];
        setPosts(list);
        const ids = Array.from(new Set(list.map((p) => p.author_id)));
        if (ids.length) {
          const { data: profs } = await sb.from('av_profiles').select('id,full_name').in('id', ids);
          const m: Record<string, string> = {};
          (profs || []).forEach((p: { id: string; full_name: string }) => { m[p.id] = p.full_name || 'Duniya user'; });
          setNames(m);
        }
      } catch { /* ignore */ }
    })();
  }, [session === undefined]);

  const days: { label: string; key: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    days.push({ label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }), key: d.toISOString().slice(0, 10) });
  }
  function savePlan() {
    if (!planText.trim()) return;
    const next = { ...plans, [days[planDay].key]: planText.trim() };
    setPlans(next);
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    setPlanText('');
  }
  const show = (n: number | null) => (n === null ? '—' : String(n));

  return (
    <Shell title="🎛️ Duniya Studio" sub="Tumhara content, insights aur kamai — ek jagah">
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>📊 Insights (live counts)</h3>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div className="statbox"><b>{show(stats.posts)}</b><small>Kul posts</small></div>
          <div className="statbox"><b>{show(stats.clips)}</b><small>Kul clips</small></div>
          <div className="statbox"><b>{show(stats.members)}</b><small>Duniya sadasya</small></div>
          <div className="statbox"><b>{show(stats.myPosts)}</b><small>Meri posts</small></div>
        </div>
        <p style={{ color: 'var(--mut)', fontSize: '.82rem', marginTop: 8 }}>Views/engagement ka graph asli data judne par aayega — abhi ye live ginti hai, nakli graph nahi dikhayenge.</p>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <h3>🗂️ Content — taaza posts</h3>
        {posts.map((p) => (
          <div key={p.id} style={{ padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
            <b>{names[p.author_id] || 'Duniya user'}</b> <small style={{ color: 'var(--mut)' }}>{new Date(p.created_at).toLocaleDateString('en-IN')}</small>
            <div>{(p.body || '').slice(0, 120)}</div>
          </div>
        ))}
        {posts.length === 0 && <p style={{ color: 'var(--mut)' }}>Abhi posts nahi dikh rahe.</p>}
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <h3>🗓️ Planned content (is hafte)</h3>
        <div className="row" style={{ gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {days.map((d, i) => (
            <button key={d.key} className={i === planDay ? 'btn primary' : 'btn'} onClick={() => setPlanDay(i)}>{d.label}</button>
          ))}
        </div>
        {plans[days[planDay].key] && <p>📌 Plan: <b>{plans[days[planDay].key]}</b></p>}
        <div className="row" style={{ gap: 8 }}>
          <input className="input" placeholder="Is din kya post karoge?" value={planText} onChange={(e) => setPlanText(e.target.value)} />
          <button className="btn primary" onClick={savePlan}>Plan jodo</button>
        </div>
      </div>

      <div className="card">
        <h3>💰 Monetization (Kamai)</h3>
        <p>Jald aa raha hai. Tab tak creators <b>Inaam (Rewards)</b> points kama sakte hain — posts, clips aur doston ko bulane par.</p>
        <Link className="btn primary" href="/rewards">🎁 Inaam dekho</Link>
      </div>
    </Shell>
  );
}
