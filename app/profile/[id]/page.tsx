'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supa, isSupaConfigured } from '../../../lib/supabase';
import { RequireAuth } from '../../../lib/auth';
import { Shell, useLang } from '../../../components/ui';

type P = {
  id: string; full_name: string; username: string; avatar_emoji: string; bio: string;
  phone: string; address: string; job_title: string; company: string;
  dob: string; birth_place: string; school: string; college: string;
  religion: string; ethnicity: string; marriage_status: string;
  avatar_url: string;
  edu_10th: string; edu_10th_school: string; edu_12th: string; edu_12th_school: string;
  edu_grad: string; edu_grad_college: string; edu_masters: string; edu_masters_college: string;
  job_history: string;
  wallet_address: string; social_links: Record<string, string>; kyc_status: string;
};

export default function PublicProfile() {
  return <RequireAuth><View /></RequireAuth>;
}

function View() {
  const { t } = useLang();
  const params = useParams();
  const pid = (params?.id as string) ?? '';
  const [p, setP] = useState<P | null>(null);
  const [me, setMe] = useState('');
  const [relation, setRelation] = useState<'self' | 'friend' | 'pending-out' | 'pending-in' | 'none'>('none');
  const [shipId, setShipId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [myPhotos, setMyPhotos] = useState<Array<{ id: string; image_url: string }>>([]);
  const [friendCount, setFriendCount] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!isSupaConfigured() || !pid) { setLoading(false); return; }
      const { data: { user } } = await supa().auth.getUser();
      const uid = user?.id ?? '';
      setMe(uid);
      const { data } = await supa().from('av_profiles').select('*').eq('id', pid).single();
      setP((data as P) ?? null);
      // latest photos + friend count for the profile front look
      try {
        const { data: ph } = await supa().from('av_posts').select('id,image_url').eq('user_id', pid).not('image_url', 'is', null).order('created_at', { ascending: false }).limit(6);
        setMyPhotos(((ph ?? []) as Array<{ id: string; image_url: string }>).filter((x) => x.image_url));
        const { count } = await supa().from('av_friendships').select('id', { count: 'exact', head: true }).eq('status', 'accepted').or(`requester_id.eq.${pid},addressee_id.eq.${pid}`);
        setFriendCount(count ?? 0);
      } catch { /* ignore */ }
      if (uid && uid === pid) { setRelation('self'); }
      else if (uid) {
        const { data: ships } = await supa().from('av_friendships').select('id,requester_id,addressee_id,status')
          .or(`and(requester_id.eq.${uid},addressee_id.eq.${pid}),and(requester_id.eq.${pid},addressee_id.eq.${uid})`);
        const s = (ships ?? [])[0] as { id: string; requester_id: string; status: string } | undefined;
        if (!s) setRelation('none');
        else if (s.status === 'accepted') setRelation('friend');
        else if (s.requester_id === uid) { setRelation('pending-out'); setShipId(s.id); }
        else { setRelation('pending-in'); setShipId(s.id); }
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [pid]);

  useEffect(() => { load(); }, [load]);

  async function addFriend() {
    await supa().from('av_friendships').insert({ requester_id: me, addressee_id: pid, status: 'pending' });
    load();
  }
  async function accept() {
    if (shipId) await supa().from('av_friendships').update({ status: 'accepted' }).eq('id', shipId);
    load();
  }
  async function decline() {
    if (shipId) await supa().from('av_friendships').delete().eq('id', shipId);
    load();
  }

  const canSeePrivate = relation === 'self' || relation === 'friend';
  const socials = p?.social_links ?? {};

  return (
    <Shell title={`👤 ${p?.full_name || t('viewProfile')}`}>
      {loading && <div className="skel"><div className="bar" /><div className="bar" /></div>}
      {!loading && !p && <div className="card"><p className="psub">—</p></div>}
      {!loading && p && (
        <>
          <div className="card" style={{ textAlign: 'center', padding: '22px 16px' }}>
            {p.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.avatar_url} alt={p.full_name} style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--th-acc)' }} />
            ) : (
              <div style={{ fontSize: '4rem' }}>{p.avatar_emoji || '🙂'}</div>
            )}
            <h2 className="ptitle" style={{ margin: '8px 0 2px' }}>{p.full_name || 'Duniya User'}</h2>
            {p.username && <p className="psub" style={{ margin: 0 }}>@{p.username}</p>}
            {p.bio && <p style={{ marginTop: 8 }}>{p.bio}</p>}
            {(p.job_title || p.company) && (
              <p className="psub" style={{ margin: '6px 0 0' }}>
                💼 {[p.job_title, p.company].filter(Boolean).join(' · ')}
              </p>
            )}
            {(p.religion || p.ethnicity || p.marriage_status) && (
              <p className="psub" style={{ margin: '6px 0 0' }}>
                {[p.religion && `🛐 ${p.religion}`, p.ethnicity && `👥 ${p.ethnicity}`, p.marriage_status && `💍 ${p.marriage_status}`].filter(Boolean).join(' · ')}
              </p>
            )}
            <p className="psub" style={{ margin: '6px 0 0' }}>👥 <b>{friendCount}</b> {t('friends')}</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {relation === 'self' && (
                <Link href="/profile" className="btn" style={{ fontSize: '.85rem', padding: '8px 18px' }}>✏️ {t('profile')}</Link>
              )}
              {relation === 'none' && (
                <button className="btn" style={{ fontSize: '.85rem', padding: '8px 18px' }} onClick={addFriend}>➕ {t('addFriend')}</button>
              )}
              {relation === 'pending-out' && <span className="pill">📩 {t('requestSent')}</span>}
              {relation === 'pending-in' && (
                <>
                  <button className="btn" style={{ fontSize: '.85rem', padding: '8px 18px' }} onClick={accept}>✅ {t('accept')}</button>
                  <button className="btn ghost" style={{ fontSize: '.85rem', padding: '8px 18px' }} onClick={decline}>✖️ {t('decline')}</button>
                </>
              )}
              {relation === 'friend' && (
                <Link href={`/messages?peer=${p.id}`} className="btn violet" style={{ fontSize: '.85rem', padding: '8px 18px' }}>💬 {t('message')}</Link>
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{ margin: '0 0 10px', fontSize: '.95rem' }}>📇 {t('profile')}</h3>
            {canSeePrivate ? (
              <>
                {p.phone && <p className="psub" style={{ margin: '4px 0' }}>📞 <b>{t('phone')}:</b> {p.phone}</p>}
                {p.address && <p className="psub" style={{ margin: '4px 0' }}>📍 <b>{t('address')}:</b> {p.address}</p>}
                {!p.phone && !p.address && <p className="psub" style={{ margin: 0 }}>—</p>}
              </>
            ) : (
              <p className="psub" style={{ margin: 0 }}>🔒 {t('friendsOnly')} — 📞 {t('phone')} · 📍 {t('address')}</p>
            )}
            {Object.keys(socials).length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {Object.entries(socials).filter(([, v]) => v).map(([k, v]) => (
                  <span className="pill" key={k}>{k}: {String(v)}</span>
                ))}
              </div>
            )}
          </div>

          {(p.dob || p.birth_place || p.school || p.college) && (
            <div className="card">
              <h3 style={{ margin: '0 0 10px', fontSize: '.95rem' }}>📜 {t('lifeStory')}</h3>
              {[
                p.dob && { e: '🎂', x: new Date(p.dob).toLocaleDateString() },
                p.birth_place && { e: '🏠', x: `${t('birthPlace')}: ${p.birth_place}` },
                p.school && { e: '🏫', x: `${t('school')}: ${p.school}` },
                p.college && { e: '🎓', x: `${t('college')}: ${p.college}` },
                (p.edu_10th || p.edu_10th_school) && { e: '📝', x: `${t('tenth')}: ${[p.edu_10th, p.edu_10th_school].filter(Boolean).join(' — ')}` },
                (p.edu_12th || p.edu_12th_school) && { e: '📝', x: `${t('twelfth')}: ${[p.edu_12th, p.edu_12th_school].filter(Boolean).join(' — ')}` },
                (p.edu_grad || p.edu_grad_college) && { e: '🎓', x: `${t('graduation')}: ${[p.edu_grad, p.edu_grad_college].filter(Boolean).join(' — ')}` },
                (p.edu_masters || p.edu_masters_college) && { e: '🎓', x: `${t('masters')}: ${[p.edu_masters, p.edu_masters_college].filter(Boolean).join(' — ')}` },
                (p.job_title || p.company) && { e: '💼', x: [p.job_title, p.company].filter(Boolean).join(' · ') },
                p.job_history && { e: '💼', x: `${t('jobHistory')}: ${p.job_history}` },
              ].filter(Boolean).map((row: unknown, i: number) => {
                const r = row as { e: string; x: string };
                return <p className="psub" key={i} style={{ margin: '5px 0' }}>{r.e} {r.x}</p>;
              })}
            </div>
          )}

          {myPhotos.length > 0 && (
            <div className="card">
              <h3 style={{ margin: '0 0 10px', fontSize: '.95rem' }}>📷 {t('albums')}</h3>
              <div className="reelgrid">
                {myPhotos.map((m) => (
                  <div key={m.id} style={{ aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
}
