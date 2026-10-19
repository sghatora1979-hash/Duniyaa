'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { supa, isSupaConfigured } from '../../lib/supabase';
import { RequireAuth } from '../../lib/auth';
import { useLang, Shell } from '../../components/ui';

type Person = { id: string; full_name: string; avatar_emoji: string; bio: string };
type Ship = { id: string; requester_id: string; addressee_id: string; status: string };

export default function Friends() {
  return <RequireAuth><Hub /></RequireAuth>;
}

function Hub() {
  const { t } = useLang();
  const [tab, setTab] = useState<'requests' | 'friends' | 'find'>('requests');
  const [me, setMe] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!isSupaConfigured()) { setLoading(false); return; }
      const { data: { user } } = await supa().auth.getUser();
      if (!user) { setLoading(false); return; }
      setMe(user.id);
      const [{ data: ppl }, { data: shp }] = await Promise.all([
        supa().from('av_profiles').select('id,full_name,avatar_emoji,bio').neq('id', user.id).order('created_at', { ascending: false }).limit(60),
        supa().from('av_friendships').select('id,requester_id,addressee_id,status')
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`),
      ]);
      setPeople(((ppl as Person[]) ?? []));
      setShips(((shp as Ship[]) ?? []));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const incoming = ships.filter((s) => s.status === 'pending' && s.addressee_id === me);
  const acceptedIds = new Set(
    ships.filter((s) => s.status === 'accepted')
      .flatMap((s) => [s.requester_id, s.addressee_id])
  );
  const friends = people.filter((p) => acceptedIds.has(p.id));
  const pendingOut = new Set(ships.filter((s) => s.status === 'pending' && s.requester_id === me).map((s) => s.addressee_id));
  const byId = new Map(people.map((p) => [p.id, p]));
  const shown = people.filter((p) =>
    (p.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

  async function act(shipId: string, acceptIt: boolean) {
    if (acceptIt) {
      await supa().from('av_friendships').update({ status: 'accepted' }).eq('id', shipId);
    } else {
      await supa().from('av_friendships').delete().eq('id', shipId);
    }
    load();
  }

  async function addFriend(pid: string) {
    await supa().from('av_friendships').insert({ requester_id: me, addressee_id: pid, status: 'pending' });
    load();
  }

  const tabBtn = (id: typeof tab, label: string, badge?: number) => (
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
      {label}{badge ? ` (${badge})` : ''}
    </button>
  );

  return (
    <Shell title={`👥 ${t('friends')}`}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {tabBtn('requests', `📩 ${t('friendRequests')}`, incoming.length)}
        {tabBtn('friends', `👥 ${t('myFriends')}`, friends.length)}
        {tabBtn('find', `🔍 ${t('findPeople')}`)}
      </div>

      {loading && <div className="skel"><div className="bar" /><div className="bar" /></div>}

      {!loading && tab === 'requests' && (
        <>
          {incoming.length === 0 && <div className="card"><p className="psub" style={{ margin: 0 }}>{t('noRequests')}</p></div>}
          {incoming.map((s) => {
            const p = byId.get(s.requester_id);
            if (!p) return null;
            return (
              <div className="member" key={s.id}>
                <Link href={`/profile/${p.id}`} className="avatar" style={{ textDecoration: 'none' }}>{p.avatar_emoji || '🙂'}</Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b>{p.full_name || 'Member'}</b>
                  {p.bio ? <small>{p.bio}</small> : null}
                </div>
                <button className="btn" style={{ fontSize: '.8rem', padding: '8px 14px' }} onClick={() => act(s.id, true)}>✅ {t('accept')}</button>
                <button className="btn ghost" style={{ fontSize: '.8rem', padding: '8px 14px' }} onClick={() => act(s.id, false)}>✖️ {t('decline')}</button>
              </div>
            );
          })}
        </>
      )}

      {!loading && tab === 'friends' && (
        <>
          {friends.length === 0 && <div className="card"><p className="psub" style={{ margin: 0 }}>{t('noFriendsYet')}</p></div>}
          {friends.map((p) => (
            <div className="member" key={p.id}>
              <Link href={`/profile/${p.id}`} className="avatar" style={{ textDecoration: 'none' }}>{p.avatar_emoji || '🙂'}</Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b>{p.full_name || 'Member'}</b>
                {p.bio ? <small>{p.bio}</small> : <small>{t('tapToChat')}</small>}
              </div>
              <Link href={`/profile/${p.id}`} className="btn ghost" style={{ fontSize: '.8rem', padding: '8px 14px' }}>👤</Link>
              <Link href={`/messages?peer=${p.id}`} className="btn violet" style={{ padding: '8px 16px', fontSize: '.85rem' }}>💬 {t('message')}</Link>
            </div>
          ))}
        </>
      )}

      {!loading && tab === 'find' && (
        <>
          <div className="row" style={{ marginBottom: 6 }}>
            <input
              className="input" style={{ margin: 0, flex: 1 }}
              placeholder={`${t('search')}…`} value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn ghost" onClick={load} title={t('refresh')}>🔄</button>
          </div>
          {shown.map((p) => {
            const isFriend = acceptedIds.has(p.id);
            const sent = pendingOut.has(p.id);
            return (
              <div className="member" key={p.id}>
                <Link href={`/profile/${p.id}`} className="avatar" style={{ textDecoration: 'none' }}>{p.avatar_emoji || '🙂'}</Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b>{p.full_name || 'Member'}</b>
                  {p.bio ? <small>{p.bio}</small> : null}
                </div>
                {isFriend ? (
                  <Link href={`/messages?peer=${p.id}`} className="btn violet" style={{ padding: '8px 16px', fontSize: '.85rem' }}>💬 {t('message')}</Link>
                ) : sent ? (
                  <span className="pill">📩 {t('requestSent')}</span>
                ) : (
                  <button className="btn" style={{ fontSize: '.8rem', padding: '8px 14px' }} onClick={() => addFriend(p.id)}>➕ {t('addFriend')}</button>
                )}
              </div>
            );
          })}
          {shown.length === 0 && (
            <div className="card"><p style={{ color: 'var(--mut)' }}>{t('findPeople')} 💬</p></div>
          )}
        </>
      )}
    </Shell>
  );
}
