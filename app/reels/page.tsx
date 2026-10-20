'use client';
import { useEffect, useRef, useState } from 'react';
import { supa, isSupaConfigured } from '../../lib/supabase';
import { RequireAuth } from '../../lib/auth';
import { useLang, Shell } from '../../components/ui';

type Reel = { id: string; user_id: string; title: string; cover_emoji: string; video_url: string | null; duration_sec?: number; views: number; created_at: string };
type Post = { id: string; user_id: string; text: string; likes_count: number; created_at: string; av_profiles?: { full_name: string } | null };
const EMOJIS = ['🎬', '💃', '🎭', '🎪', '🪔', '🏏', '🎶', '🍛'];
const BG = ['#4c1d95', '#701a5c', '#0c4a6e', '#14532d', '#7c2d12', '#1e1b4b'];
const DURATIONS = [3, 5, 10];

export default function Reels() {
  return <RequireAuth><ReelGrid /></RequireAuth>;
}

function ReelGrid() {
  const { t } = useLang();
  const [reels, setReels] = useState<Reel[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🎬');
  const [secs, setSecs] = useState(5);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [postText, setPostText] = useState('');
  const [busy, setBusy] = useState(false);
  const [pbusy, setPbusy] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [perr, setPerr] = useState('');
  const [watch, setWatch] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadReels() {
    if (!isSupaConfigured()) return;
    const { data } = await supa().from('av_reels').select('*').order('created_at', { ascending: false }).limit(40);
    if (data) setReels(data as Reel[]);
  }
  async function loadPosts() {
    if (!isSupaConfigured()) return;
    const { data } = await supa().from('av_posts').select('*').order('created_at', { ascending: false }).limit(15);
    const rows = (data as Post[]) || [];
    setPosts(rows);
    const ids = Array.from(new Set(rows.map((p) => p.user_id)));
    if (ids.length) {
      const { data: profs } = await supa().from('av_profiles').select('id,full_name').in('id', ids);
      const m: Record<string, string> = {};
      ((profs as { id: string; full_name: string }[]) || []).forEach((p) => { m[p.id] = p.full_name; });
      setNames(m);
    }
  }
  useEffect(() => { loadReels(); loadPosts(); }, []);

  function pickPhoto(f: File | undefined) {
    setErr(''); setMsg('');
    if (!f) { setPhoto(null); setPreview(''); return; }
    if (!f.type.startsWith('image/')) { setErr('Sirf photo file chuno (JPG/PNG).'); return; }
    if (f.size > 5 * 1024 * 1024) { setErr('Photo 5MB se chhoti rakho.'); return; }
    setPhoto(f);
    setPreview(URL.createObjectURL(f));
  }

  async function publishClip() {
    setErr(''); setMsg('');
    if (!title.trim()) { setErr('Pehle clip ka title likho.'); return; }
    setBusy(true);
    try {
      const { data: { user } } = await supa().auth.getUser();
      if (!user) throw new Error('Clip post karne ke liye asli account se login karo.');
      let mediaUrl: string | null = null;
      if (photo) {
        const ext = (photo.name.split('.').pop() || 'jpg').toLowerCase().slice(0, 4);
        const path = `reels/${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supa().storage.from('av-media').upload(path, photo, { upsert: true, contentType: photo.type });
        if (upErr) throw upErr;
        const { data: pub } = supa().storage.from('av-media').getPublicUrl(path);
        mediaUrl = pub.publicUrl;
      }
      const { error } = await supa().from('av_reels').insert({
        user_id: user.id, title: title.trim(), cover_emoji: emoji,
        video_url: mediaUrl, duration_sec: secs,
      });
      if (error) throw error;
      setTitle(''); setPhoto(null); setPreview('');
      if (fileRef.current) fileRef.current.value = '';
      setMsg('Clip post ho gayi ✓');
      await loadReels();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Post failed.'); }
    finally { setBusy(false); }
  }

  async function publishPost() {
    setPerr('');
    if (!postText.trim()) return;
    setPbusy(true);
    try {
      const { data: { user } } = await supa().auth.getUser();
      if (!user) throw new Error('Post karne ke liye asli account se login karo.');
      const { error } = await supa().from('av_posts').insert({ user_id: user.id, text: postText.trim() });
      if (error) throw error;
      setPostText('');
      await loadPosts();
    } catch (e: unknown) { setPerr(e instanceof Error ? e.message : 'Post failed.'); }
    finally { setPbusy(false); }
  }

  return (
    <Shell title={t('reels')} sub="Clips + doston ki daily posts — ek hi jagah. 📷➜🎬" wide>
      {/* ---- Clip composer ---- */}
      <div className="card">
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder="Clip title…" maxLength={80} value={title} onChange={e => setTitle(e.target.value)} />
          <select className="input" style={{ width: 90, margin: 0 }} value={emoji} onChange={e => setEmoji(e.target.value)} title="Bina photo wali clip ka emoji">
            {EMOJIS.map(e => <option key={e}>{e}</option>)}
          </select>
          <select className="input" style={{ width: 110, margin: 0 }} value={secs} onChange={e => setSecs(Number(e.target.value))} title="Clip kitne second chalegi">
            {DURATIONS.map(d => <option key={d} value={d}>{d} sec</option>)}
          </select>
          <button className="btn violet" disabled={busy} onClick={publishClip}>{busy ? '…' : t('post')}</button>
        </div>
        <div className="row" style={{ marginTop: 10, alignItems: 'center' }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={e => pickPhoto(e.target.files?.[0])} />
          {preview && <img src={preview} alt="clip preview" style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 10 }} />}
          <small style={{ color: 'var(--mut)' }}>📷 Apni photo chuno to wo hi clip banegi — chune hue seconds tak chalegi.</small>
        </div>
        {msg && <p className="ok">{msg}</p>}
        {err && <p className="err">{err}</p>}
      </div>

      {/* ---- Clips ---- */}
      {reels.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px 16px' }}>
          <div style={{ fontSize: '2.6rem' }}>🎬</div>
          <b>No clips yet</b>
          <p style={{ color: 'var(--mut)', margin: '6px 0 0' }}>Upar title + photo chuno, seconds set karo, Post dabao — pehli clip tumhari hogi!</p>
        </div>
      ) : (
        <div className="reelgrid">
          {reels.map((r, i) => (
            <div className="reel" key={r.id} style={{ ['--rc' as string]: BG[i % BG.length] }} onClick={() => setWatch(i)}>
              {r.video_url
                ? <img src={r.video_url} alt={r.title} style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 10 }} />
                : <div style={{ fontSize: '2.2rem' }}>{r.cover_emoji}</div>}
              <b>{r.title}</b>
              <small>👁 {r.views} · ⏱ {r.duration_sec || 5}s · tap to watch</small>
            </div>
          ))}
        </div>
      )}

      {/* ---- Doston ki daily posts (khaali jagah bharne ke liye) ---- */}
      <div className="card" style={{ marginTop: 18 }}>
        <b style={{ fontSize: '1.05rem' }}>👥 Doston ki daily posts</b>
        <p style={{ color: 'var(--mut)', margin: '4px 0 10px' }}><small>Dost aur follows ki taaza posts — yahi par likho, yahi par padho.</small></p>
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder="Aaj kya chal raha hai? Post likho…" maxLength={280} value={postText} onChange={e => setPostText(e.target.value)} />
          <button className="btn violet" disabled={pbusy} onClick={publishPost}>{pbusy ? '…' : t('post')}</button>
        </div>
        {perr && <p className="err">{perr}</p>}
      </div>
      {posts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
          <p style={{ color: 'var(--mut)', margin: 0 }}>Abhi koi post nahi — pehli post tum karo! ✍️</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.map((p) => (
            <div className="card" key={p.id} style={{ margin: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🙂</div>
                <div>
                  <b style={{ fontSize: '.92rem' }}>{names[p.user_id] || 'Duniya User'}</b><br />
                  <small style={{ color: 'var(--mut)' }}>{new Date(p.created_at).toLocaleString()}</small>
                </div>
              </div>
              <p style={{ margin: '4px 0' }}>{p.text}</p>
              <small style={{ color: 'var(--mut)' }}>❤️ {p.likes_count || 0} likes</small>
            </div>
          ))}
        </div>
      )}

      {watch !== null && reels[watch] && (
        <Viewer reel={reels[watch]} color={BG[watch % BG.length]}
          onClose={() => setWatch(null)}
          onNext={() => setWatch((watch + 1) % reels.length)}
          onPrev={() => setWatch((watch - 1 + reels.length) % reels.length)} />
      )}
    </Shell>
  );
}

function Viewer({ reel, color, onClose, onNext, onPrev }: {
  reel: Reel; color: string; onClose: () => void; onNext: () => void; onPrev: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [prog, setProg] = useState(0);
  const touchY = useRef<number | null>(null);
  const isPhoto = !!reel.video_url;

  // Photo clip: chune hue seconds ke baad apne aap agli clip. Progress bar bhi chalti hai.
  useEffect(() => {
    setLiked(false); setProg(0);
    if (!reel.video_url) return;
    const dur = (reel.duration_sec || 5) * 1000;
    const t0 = Date.now();
    const iv = setInterval(() => setProg(Math.min(100, ((Date.now() - t0) / dur) * 100)), 100);
    const to = setTimeout(() => onNext(), dur);
    return () => { clearInterval(iv); clearTimeout(to); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reel.id]);

  const onTouchStart = (e: React.TouchEvent) => { touchY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current === null) return;
    const dy = e.changedTouches[0].clientY - touchY.current;
    if (dy < -60) onNext();
    else if (dy > 60) onPrev();
    touchY.current = null;
  };
  return (
    <div className="viewer" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="stage" style={{ background: `linear-gradient(180deg, ${color} 0%, #000 130%)` }}>
        <button className="close" onClick={onClose}>✕</button>
        {isPhoto && (
          <div style={{ position: 'absolute', top: 10, left: 12, right: 60, height: 4, background: 'rgba(255,255,255,.3)', borderRadius: 4 }}>
            <div style={{ height: '100%', width: `${prog}%`, background: '#fff', borderRadius: 4 }} />
          </div>
        )}
        {isPhoto
          ? <img src={reel.video_url!} alt={reel.title} style={{ maxWidth: '92%', maxHeight: '58%', objectFit: 'contain', borderRadius: 14 }} />
          : <div className="vemoji">{reel.cover_emoji}</div>}
        <h2>{reel.title}</h2>
        <p style={{ color: 'rgba(255,255,255,.75)' }}>👁 {reel.views} views{isPhoto ? ` · ⏱ ${reel.duration_sec || 5}s photo clip` : ''}</p>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="vlike" onClick={() => setLiked(!liked)}>{liked ? '❤️' : '🤍'}</button>
        </div>
        <p className="hint">👆 Swipe up / down for next reel</p>
      </div>
    </div>
  );
}
