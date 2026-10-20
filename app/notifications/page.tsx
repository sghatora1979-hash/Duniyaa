'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shell } from '../../components/ui';
import { useSession } from '../../lib/auth';
import { supa, isSupaConfigured } from '../../lib/supabase';

type Req = { id: string; requester_id: string; name: string };
type Msg = { id: string; body: string; created_at: string; other: string };

export default function NotificationsPage() {
  const session = useSession();
  const [reqs, setReqs] = useState<Req[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const live = !!session && !session.id.startsWith('demo-') && isSupaConfigured();

  async function load() {
    if (!live || !session) return;
    const sb = supa();
    const { data: fr } = await sb.from('av_friendships').select('id,requester_id').eq('addressee_id', session.id).eq('status', 'pending');
    const ids = (fr || []).map((r: { requester_id: string }) => r.requester_id);
    const nameMap: Record<string, string> = {};
    if (ids.length) {
      const { data: profs } = await sb.from('av_profiles').select('id,full_name').in('id', ids);
      (profs || []).forEach((p: { id: string; full_name: string }) => { nameMap[p.id] = p.full_name || 'Duniya user'; });
    }
    setReqs((fr || []).map((r: { id: string; requester_id: string }) => ({ id: r.id, requester_id: r.requester_id, name: nameMap[r.requester_id] || 'Duniya user' })));
    const { data: ms } = await sb.from('av_messages').select('id,body,created_at,sender_id,receiver_id')
      .or('sender_id.eq.' + session.id + ',receiver_id.eq.' + session.id)
      .order('created_at', { ascending: false }).limit(10);
    const others = Array.from(new Set((ms || []).map((m: { sender_id: string; receiver_id: string }) => (m.sender_id === session.id ? m.receiver_id : m.sender_id))));
    if (others.length) {
      const { data: profs } = await sb.from('av_profiles').select('id,full_name').in('id', others);
      (profs || []).forEach((p: { id: string; full_name: string }) => { nameMap[p.id] = p.full_name || 'Duniya user'; });
    }
    setNames(nameMap);
    setMsgs((ms || []).map((m: { id: string; body: string; created_at: string; sender_id: string; receiver_id: string }) => ({
      id: m.id, body: m.body || '', created_at: m.created_at,
      other: m.sender_id === session.id ? m.receiver_id : m.sender_id,
    })));
  }
  useEffect(() => { if (session !== undefined) load(); }, [session !== undefined, live]);

  async function act(r: Req, accept: boolean) {
    const sb = supa();
    if (accept) await sb.from('av_friendships').update({ status: 'accepted' }).eq('id', r.id);
    else await sb.from('av_friendships').delete().eq('id', r.id);
    load();
  }

  return (
    <Shell title="🔔 Suchna (Notifications)" sub="Dost bhejey hue anurodh aur taaza sandesh">
      {!live && (
        <div className="card">
          <p>Demo mode me suchna khaali hai — asli login (domain ke baad) chalu hote hi dost ke anurodh aur sandesh yahan dikhenge.</p>
          <Link className="btn" href="/messages">💬 Chats dekho</Link>
        </div>
      )}
      {live && (
        <>
          <div className="card" style={{ marginBottom: 14 }}>
            <h3>👥 Dost anurodh</h3>
            {reqs.map((r) => (
              <div key={r.id} className="row" style={{ justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                <span><b>{r.name}</b> ne dost banne ka anurodh bheja</span>
                <span className="row" style={{ gap: 6 }}>
                  <button className="btn primary" onClick={() => act(r, true)}>Confirm</button>
                  <button className="btn" onClick={() => act(r, false)}>Delete</button>
                </span>
              </div>
            ))}
            {reqs.length === 0 && <p style={{ color: 'var(--mut)' }}>Koi naya anurodh nahi.</p>}
          </div>
          <div className="card">
            <h3>💬 Taaza sandesh</h3>
            {msgs.map((m) => (
              <p key={m.id} style={{ margin: '6px 0' }}><b>{names[m.other] || 'Duniya user'}</b>: {(m.body || '').slice(0, 80)} <small style={{ color: 'var(--mut)' }}>{new Date(m.created_at).toLocaleDateString('en-IN')}</small></p>
            ))}
            {msgs.length === 0 && <p style={{ color: 'var(--mut)' }}>Abhi koi sandesh nahi.</p>}
            <Link className="btn" href="/messages" style={{ marginTop: 8 }}>Saare chats kholo</Link>
          </div>
        </>
      )}
    </Shell>
  );
}
