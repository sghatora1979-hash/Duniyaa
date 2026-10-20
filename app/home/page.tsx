'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supa, isSupaConfigured } from '../../lib/supabase';
import { RequireAuth } from '../../lib/auth';
import { useLang, Shell } from '../../components/ui';
import { StoriesBar, StoryViewer, SponsoredCard, PeopleYouMayKnow, type Story } from '../../components/hybrid';

type Post = { id: string; user_id: string; text: string; image_url: string | null; likes_count: number; created_at: string };
type Profile = { id: string; full_name: string; avatar_emoji: string };
type Comment = { id: string; post_id: string; user_id: string; text: string; created_at: string };

const PAGE_SIZE = 10;

export default function Home() {
  return <RequireAuth><Feed /></RequireAuth>;
}

function Feed() {
  const { t } = useLang();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [text, setText] = useState('');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [viewer, setViewer] = useState<{ stories: Story[]; idx: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [commentBusy, setCommentBusy] = useState<Record<string, boolean>>({});
  const [commentNames, setCommentNames] = useState<Record<string, Profile>>({});
  const [shared, setShared] = useState('');
  const pageRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const mergeProfiles = useCallback(async (ids: string[]) => {
    const fresh = ids.filter((id) => id);
    if (!fresh.length) return;
    const { data } = await supa().from('av_profiles').select('id,full_name,avatar_emoji').in('id', fresh);
    if (data) {
      setProfiles((prev) => {
        const m = { ...prev };
        (data as Profile[]).forEach((p) => { m[p.id] = p; });
        return m;
      });
      setCommentNames((prev) => {
        const m = { ...prev };
        (data as Profile[]).forEach((p) => { m[p.id] = p; });
        return m;
      });
    }
  }, []);

  const loadPage = useCallback(async (page: number, append: boolean) => {
    if (!isSupaConfigured() || loadingRef.current) return;
    loadingRef.current = true;
    if (append) setLoadingMore(true); else { setLoading(true); setError(''); }
    try {
      const from = page * PAGE_SIZE;
      const { data, error } = await supa()
        .from('av_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = (data as Post[]) || [];
      setPosts((prev) => append ? [...prev, ...rows] : rows);
      setHasMore(rows.length === PAGE_SIZE);
      pageRef.current = page;
      const ids = Array.from(new Set(rows.map((p) => p.user_id)));
      await mergeProfiles(ids);
      // which of these did I like?
      const { data: { user } } = await supa().auth.getUser();
      if (user && rows.length) {
        const { data: likes } = await supa().from('av_likes')
          .select('post_id').eq('user_id', user.id)
          .in('post_id', rows.map((p) => p.id));
        if (likes) setLiked((prev) => new Set([...prev, ...likes.map((l: { post_id: string }) => l.post_id)]));
      }
    } catch (e) {
      if (!append) setError(t('loadFailed'));
    } finally {
      loadingRef.current = false;
      setLoading(false); setLoadingMore(false);
    }
  }, [mergeProfiles, t]);

  useEffect(() => { loadPage(0, false); }, [loadPage]);

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        loadPage(pageRef.current + 1, true);
      }
    }, { rootMargin: '400px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadPage]);

  async function publish() {
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      const { data: { user } } = await supa().auth.getUser();
      if (!user) return;
      const { data, error } = await supa().from('av_posts')
        .insert({ user_id: user.id, text: text.trim() }).select('*').single();
      if (error) throw error;
      setText('');
      setPosts((prev) => [data as Post, ...prev]);
      await mergeProfiles([user.id]);
      try { await supa().rpc('av_add_points', { uid: user.id, pts: 10 }); } catch { /* optional */ }
      document.getElementById('composer')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) { console.error(e); }
    finally { setBusy(false); }
  }

  async function toggleLike(p: Post) {
    const { data: { user } } = await supa().auth.getUser();
    if (!user) return;
    const isLiked = liked.has(p.id);
    // optimistic
    setLiked((prev) => { const n = new Set(prev); if (isLiked) n.delete(p.id); else n.add(p.id); return n; });
    setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, likes_count: x.likes_count + (isLiked ? -1 : 1) } : x));
    try {
      if (isLiked) {
        await supa().from('av_likes').delete().eq('post_id', p.id).eq('user_id', user.id);
        await supa().from('av_posts').update({ likes_count: Math.max(0, p.likes_count - 1) }).eq('id', p.id);
      } else {
        await supa().from('av_likes').insert({ post_id: p.id, user_id: user.id });
        await supa().from('av_posts').update({ likes_count: p.likes_count + 1 }).eq('id', p.id);
      }
    } catch (e) { console.error(e); }
  }

  async function toggleComments(p: Post) {
    const open = !commentsOpen[p.id];
    setCommentsOpen((prev) => ({ ...prev, [p.id]: open }));
    if (open && !comments[p.id]) {
      try {
        const { data, error } = await supa().from('av_comments')
          .select('*').eq('post_id', p.id).order('created_at', { ascending: true }).limit(50);
        if (error) throw error;
        const rows = (data as Comment[]) || [];
        setComments((prev) => ({ ...prev, [p.id]: rows }));
        await mergeProfiles(Array.from(new Set(rows.map((c) => c.user_id))));
      } catch (e) { console.error(e); }
    }
  }

  const [commentError, setCommentError] = useState<Record<string, string>>({});

  async function addComment(p: Post) {
    const txt = (commentText[p.id] || '').trim();
    if (!txt || commentBusy[p.id]) return;
    setCommentBusy((prev) => ({ ...prev, [p.id]: true }));
    setCommentError((prev) => ({ ...prev, [p.id]: '' }));
    try {
      const { data: { user } } = await supa().auth.getUser();
      if (!user) return;
      const { data, error } = await supa().from('av_comments')
        .insert({ post_id: p.id, user_id: user.id, text: txt }).select('*').single();
      if (error) throw error;
      setComments((prev) => ({ ...prev, [p.id]: [...(prev[p.id] || []), data as Comment] }));
      setCommentText((prev) => ({ ...prev, [p.id]: '' }));
      await mergeProfiles([user.id]);
    } catch (e) {
      console.error(e);
      setCommentError((prev) => ({ ...prev, [p.id]: t('loadFailed') }));
    }
    finally { setCommentBusy((prev) => ({ ...prev, [p.id]: false })); }
  }

  async function sharePost(p: Post) {
    const pr = profiles[p.user_id];
    const url = typeof window !== 'undefined' ? `${window.location.origin}/home` : 'https://duniyaaaa.netlify.app/home';
    const shareText = `${pr?.full_name || 'Duniya'}: ${p.text.slice(0, 120)}`;
    try {
      if (typeof navigator !== 'undefined' && (navigator as Navigator & { share?: (d: object) => Promise<void> }).share) {
        await (navigator as Navigator & { share: (d: object) => Promise<void> }).share({ title: 'Duniya', text: shareText, url });
        return;
      }
      throw new Error('no native share');
    } catch {
      try {
        await navigator.clipboard.writeText(`${shareText} ${url}`);
        setShared(p.id);
        setTimeout(() => setShared(''), 2500);
      } catch { /* clipboard unavailable */ }
    }
  }

  return (
    <Shell title={t('home')} sub="India's public digital square." wide>
      <div className="card" id="composer">
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div className="avatar" style={{ flexShrink: 0 }}>🙂</div>
          <textarea
            className="input" style={{ flex: 1, margin: 0 }} placeholder={t('whatsNew')} value={text}
            onChange={(e) => setText(e.target.value)} aria-label={t('whatsNew')}
          />
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
          <div className="row" style={{ gap: 6 }}>
            <Link href="/live" className="btn ghost" style={{ padding: '8px 14px', fontSize: '.85rem' }}>📹 Live</Link>
            <Link href="/albums" className="btn ghost" style={{ padding: '8px 14px', fontSize: '.85rem', margin: 0 }}>📷 Photo</Link>
            <Link href="/reels" className="btn ghost" style={{ padding: '8px 14px', fontSize: '.85rem', margin: 0 }}>🎬 Clip</Link>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <small style={{ color: 'var(--mut)' }}>+10 🏆 per post</small>
            <button className="btn violet" disabled={busy || !text.trim()} onClick={publish}>
              {busy ? <span className="spinner" /> : t('post')}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <b style={{ fontSize: '1rem' }}>📖 Stories</b>
          <small style={{ color: 'var(--mut)' }}>Doston ki taaza stories</small>
        </div>
        <StoriesBar onSelect={(stories, idx) => setViewer({ stories, idx })} />
      </div>
      {viewer && (
        <StoryViewer
          stories={viewer.stories} idx={viewer.idx}
          onClose={() => setViewer(null)}
          onNav={(i) => setViewer({ stories: viewer.stories, idx: i })}
        />
      )}

      <PeopleYouMayKnow />

      {!isSupaConfigured() && <div className="note">Connect Supabase keys to load the live feed.</div>}

      {loading && (
        <>
          <div className="skel"><div className="bar" style={{ width: '40%' }} /><div className="bar" /><div className="bar" style={{ width: '75%' }} /></div>
          <div className="skel"><div className="bar" style={{ width: '55%' }} /><div className="bar" /><div className="bar" style={{ width: '65%' }} /></div>
        </>
      )}

      {error && !loading && (
        <div className="card">
          <p className="err">{error}</p>
          <button className="btn violet" onClick={() => loadPage(0, false)}>{t('retry')}</button>
        </div>
      )}

      {!loading && !error && posts.map((p, i) => {
        const pr = profiles[p.user_id];
        const postComments = comments[p.id] || [];
        return (
          <div key={p.id}>
            <div className="card">
              <div className="posthead">
                <div className="avatar">{pr?.avatar_emoji || '🙂'}</div>
                <div className="pmeta">
                  <b>{pr?.full_name || 'Member'}</b>
                  <small>{new Date(p.created_at).toLocaleString()}</small>
                </div>
              </div>
              <p className="ptext">{p.text}</p>
              <div className="pactions">
                <button className={liked.has(p.id) ? 'on' : ''} onClick={() => toggleLike(p)} aria-label="Like">
                  {liked.has(p.id) ? '❤️' : '🤍'} {p.likes_count}
                </button>
                <button onClick={() => toggleComments(p)} aria-label="Comments">
                  💬 {t('comment')}{postComments.length > 0 ? ` (${postComments.length})` : ''}
                </button>
                <button onClick={() => sharePost(p)} aria-label="Share">
                  ↗️ {t('share')}
                </button>
              </div>
              {shared === p.id && <p className="ok" style={{ margin: '8px 0 0' }}>{t('linkCopied')}</p>}
              {commentsOpen[p.id] && (
                <div className="comments">
                  {postComments.map((c) => {
                    const cp = commentNames[c.user_id];
                    return (
                      <div className="comment" key={c.id}>
                        <div className="avatar">{cp?.avatar_emoji || '🙂'}</div>
                        <div className="cbody">
                          <b>{cp?.full_name || 'Member'}</b>
                          <small>{new Date(c.created_at).toLocaleString()}</small>
                          <div>{c.text}</div>
                        </div>
                      </div>
                    );
                  })}
                  {postComments.length === 0 && (
                    <p style={{ color: 'var(--mut)', fontSize: '.85rem', margin: '4px 0' }}>{t('writeComment')}</p>
                  )}
                  <div className="commentform">
                    <input
                      className="input" placeholder={t('writeComment')}
                      value={commentText[p.id] || ''}
                      onChange={(e) => setCommentText((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && addComment(p)}
                    />
                    <button
                      className="btn violet" style={{ padding: '9px 16px', fontSize: '.88rem' }}
                      disabled={commentBusy[p.id] || !(commentText[p.id] || '').trim()}
                      onClick={() => addComment(p)}
                    >
                      {commentBusy[p.id] ? <span className="spinner" /> : t('send')}
                    </button>
                  </div>
                  {commentError[p.id] && <p className="err" style={{ margin: '6px 0 0' }}>{commentError[p.id]}</p>}
                </div>
              )}
            </div>
            {(i + 1) % 4 === 0 && <SponsoredCard seed={i} />}
          </div>
        );
      })}

      {!loading && !error && posts.length === 0 && (
        <div className="card"><p style={{ color: 'var(--mut)' }}>{t('noPosts')}</p></div>
      )}

      <div ref={sentinelRef} />
      {loadingMore && <div className="skel"><div className="bar" style={{ width: '50%' }} /><div className="bar" /></div>}
      {!loading && !error && !hasMore && posts.length > 0 && (
        <p style={{ textAlign: 'center', color: 'var(--mut)', fontSize: '.9rem' }}>{t('allCaughtUp')}</p>
      )}
    </Shell>
  );
}
