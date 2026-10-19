'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supa, isSupaConfigured } from '../../lib/supabase';
import { RequireAuth } from '../../lib/auth';
import { Shell, useLang } from '../../components/ui';

type Photo = { id: string; image_url: string; created_at: string; text: string };

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_HI = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

export default function AlbumsPage() {
  return (
    <RequireAuth>
      <AlbumGrid />
    </RequireAuth>
  );
}

function AlbumGrid() {
  const { t, lang } = useLang();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'grid' | 'timeline' | 'memories' | 'auto'>('grid');

  useEffect(() => {
    (async () => {
      if (!isSupaConfigured()) { setLoading(false); return; }
      try {
        const { data: { user } } = await supa().auth.getUser();
        if (!user) { setLoading(false); return; }
        const { data } = await supa().from('av_posts')
          .select('id,image_url,created_at,text')
          .eq('user_id', user.id)
          .not('image_url', 'is', null)
          .order('created_at', { ascending: false })
          .limit(200);
        setPhotos(((data as Photo[]) ?? []).filter((p) => p.image_url));
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const months = lang === 'hi' ? MONTHS_HI : MONTHS_EN;

  // Group by YYYY-MM for the 365-day timeline
  const timeline = useMemo(() => {
    const groups = new Map<string, Photo[]>();
    for (const p of photos) {
      const d = new Date(p.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(p);
    }
    return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [photos]);

  // Auto-albums: every 30 photos (oldest first) become one album
  const autoAlbums = useMemo(() => {
    const asc = [...photos].reverse();
    const groups: Photo[][] = [];
    for (let i = 0; i < asc.length; i += 30) groups.push(asc.slice(i, i + 30));
    return groups;
  }, [photos]);
  const memories = useMemo(() => {
    const now = new Date();
    const md = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return photos.filter((p) => {
      const d = new Date(p.created_at);
      const pmd = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return pmd === md && d.getFullYear() < now.getFullYear();
    });
  }, [photos]);

  const tabBtn = (id: typeof tab, label: string) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      style={{
        fontSize: '.85rem', fontWeight: 700, borderRadius: 999, padding: '8px 16px',
        cursor: 'pointer', fontFamily: 'inherit',
        background: tab === id ? 'linear-gradient(90deg,var(--th-acc),var(--th-acc2))' : 'var(--card)',
        color: tab === id ? '#fff' : 'var(--ink)',
        border: tab === id ? '1px solid transparent' : '1px solid rgba(0,0,0,.10)',
      }}
    >
      {label}
    </button>
  );

  return (
    <Shell title={`📷 ${t('albums')}`} sub={t('myPhotos')}>
      <Link href="/home#composer" className="btn" style={{ marginBottom: 14 }}>
        📸 {t('addTodaysPhoto')}
      </Link>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {tabBtn('grid', `🖼️ ${t('albums')}`)}
        {tabBtn('timeline', `📅 ${lang === 'hi' ? 'टाइमलाइन' : 'Timeline'}`)}
        {tabBtn('memories', `💭 ${lang === 'hi' ? 'यादें' : 'Memories'}`)}
        {tabBtn('auto', `📚 ${t('autoAlbums')}`)}
      </div>

      {loading && <div className="skel"><div className="bar" /><div className="bar" /></div>}

      {!loading && photos.length === 0 && (
        <div className="card"><p className="psub" style={{ margin: 0 }}>{t('noPhotosYet')}</p></div>
      )}

      {!loading && photos.length > 0 && tab === 'grid' && (
        <div className="reelgrid">
          {photos.map((p) => (
            <div className="reel" key={p.id} style={{ aspectRatio: '1/1' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt={p.text?.slice(0, 60) || 'photo'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} loading="lazy" />
            </div>
          ))}
        </div>
      )}

      {!loading && photos.length > 0 && tab === 'timeline' && (
        <>
          {timeline.map(([key, list]) => {
            const [y, m] = key.split('-').map(Number);
            return (
              <div key={key}>
                <h2 className="ptitle" style={{ fontSize: '1.2rem', margin: '18px 0 8px' }}>
                  {months[m - 1]} {y} <span className="pill" style={{ verticalAlign: 'middle' }}>{list.length}</span>
                </h2>
                <div className="reelgrid">
                  {list.map((p) => (
                    <div className="reel" key={p.id} style={{ aspectRatio: '1/1' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image_url} alt={p.text?.slice(0, 60) || 'photo'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} loading="lazy"
                        title={new Date(p.created_at).toLocaleDateString()} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      {!loading && photos.length > 0 && tab === 'memories' && (
        <>
          {memories.length === 0 ? (
            <div className="card">
              <p className="psub" style={{ margin: 0 }}>
                {lang === 'hi'
                  ? 'आज के दिन की पुरानी फ़ोटो अभी नहीं हैं — हर दिन फ़ोटो डालो, यादें बनेंगी।'
                  : 'No old photos from this day yet — post daily and memories will build up.'}
              </p>
            </div>
          ) : (
            <>
              <p className="psub">💭 {lang === 'hi' ? 'आज के दिन, पिछले सालों में' : 'On this day, in past years'}</p>
              <div className="reelgrid">
                {memories.map((p) => {
                  const yrs = new Date().getFullYear() - new Date(p.created_at).getFullYear();
                  return (
                    <div key={p.id} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 14, overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image_url} alt={p.text?.slice(0, 60) || 'photo'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      <small style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,.6)', color: '#fff', borderRadius: 8, padding: '3px 10px', fontSize: '.75rem' }}>
                        {yrs} {lang === 'hi' ? 'साल पहले' : yrs === 1 ? 'year ago' : 'years ago'}
                      </small>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {!loading && photos.length > 0 && tab === 'auto' && (
        <>
          {autoAlbums.map((group, gi) => (
            <div key={gi}>
              <h2 className="ptitle" style={{ fontSize: '1.2rem', margin: '18px 0 8px' }}>
                📚 {t('autoAlbums')} {gi + 1} <span className="pill" style={{ verticalAlign: 'middle' }}>{group.length} {t('photos')}</span>
              </h2>
              <div className="reelgrid">
                {group.map((p) => (
                  <div key={p.id} style={{ aspectRatio: '1/1', borderRadius: 14, overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image_url} alt={p.text?.slice(0, 60) || 'photo'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {!loading && photos.length > 0 && (
        <p className="psub" style={{ marginTop: 14 }}>📸 <b>{photos.length}</b> {t('myPhotos')}</p>
      )}
    </Shell>
  );
}
