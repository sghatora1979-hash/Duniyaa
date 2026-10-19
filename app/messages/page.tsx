'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supa, isSupaConfigured } from '../../lib/supabase';
import { RequireAuth } from '../../lib/auth';
import { useLang, Shell } from '../../components/ui';

type Msg = { id: string; sender_id: string; receiver_id: string; text: string; created_at: string };
type Person = { id: string; full_name: string; avatar_emoji: string };
type Conv = { peer: Person; last: Msg };

export default function Messages() {
  return <RequireAuth><Chat /></RequireAuth>;
}

function Chat() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const [me, setMe] = useState('');
  const [convs, setConvs] = useState<Conv[]>([]);
  const [peer, setPeer] = useState<Person | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [showFinder, setShowFinder] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const peerRef = useRef<Person | null>(null);
  const meRef = useRef('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  const loadConversations = useCallback(async (myId: string) => {
    const { data, error } = await supa()
      .from('av_messages')
      .select('*')
      .or(`sender_id.eq.${myId},receiver_id.eq.${myId}`)
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw error;
    const rows = (data as Msg[]) || [];
    const byPeer = new Map<string, Msg>();
    rows.forEach((m) => {
      const pid = m.sender_id === myId ? m.receiver_id : m.sender_id;
      if (!byPeer.has(pid)) byPeer.set(pid, m);
    });
    const ids = Array.from(byPeer.keys());
    let profs: Person[] = [];
    if (ids.length) {
      const { data: pd } = await supa().from('av_profiles').select('id,full_name,avatar_emoji').in('id', ids);
      profs = (pd as Person[]) || [];
    }
    const pmap = new Map(profs.map((p) => [p.id, p]));
    const list: Conv[] = [];
    byPeer.forEach((last, pid) => {
      const person = pmap.get(pid) || { id: pid, full_name: 'Member', avatar_emoji: '🙂' };
      list.push({ peer: person, last });
    });
    setConvs(list);
    return list;
  }, []);

  const openChat = useCallback(async (p: Person, myId: string) => {
    setPeer(p); peerRef.current = p;
    if (!isSupaConfigured()) return;
    const { data, error } = await supa().from('av_messages').select('*')
      .or(`and(sender_id.eq.${myId},receiver_id.eq.${p.id}),and(sender_id.eq.${p.id},receiver_id.eq.${myId})`)
      .order('created_at', { ascending: true })
      .limit(200);
    if (!error && data) {
      setMsgs(data as Msg[]);
      setTimeout(scrollBottom, 60);
    }
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      setLoading(true); setError('');
      try {
        if (!isSupaConfigured()) { setLoading(false); return; }
        const { data: { user } } = await supa().auth.getUser();
        if (!user) { setLoading(false); return; }
        setMe(user.id); meRef.current = user.id;
        const list = await loadConversations(user.id);
        // deep link ?peer=
        const qp = searchParams.get('peer');
        if (qp) {
          const found = list.find((c) => c.peer.id === qp);
          if (found) { openChat(found.peer, user.id); }
          else {
            const { data: pd } = await supa().from('av_profiles').select('id,full_name,avatar_emoji').eq('id', qp).single();
            if (pd) openChat(pd as Person, user.id);
          }
        }
      } catch (e) {
        setError(t('loadFailed'));
      } finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime: new incoming messages
  useEffect(() => {
    if (!isSupaConfigured() || !me) return;
    const ch = supa()
      .channel(`av_msgs_${me}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'av_messages' },
        (payload) => {
          const m = payload.new as Msg;
          const myId = meRef.current;
          if (m.sender_id !== myId && m.receiver_id !== myId) return;
          const pid = m.sender_id === myId ? m.receiver_id : m.sender_id;
          // update conversation list preview
          setConvs((prev) => {
            const rest = prev.filter((c) => c.peer.id !== pid);
            const existing = prev.find((c) => c.peer.id === pid);
            const peer = existing?.peer || { id: pid, full_name: 'Member', avatar_emoji: '🙂' };
            return [{ peer, last: m }, ...rest];
          });
          // append to open chat
          if (peerRef.current && peerRef.current.id === pid) {
            setMsgs((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m]);
            setTimeout(scrollBottom, 60);
          }
        })
      .subscribe();
    return () => { supa().removeChannel(ch); };
  }, [me]);

  async function refresh() {
    if (!meRef.current || refreshing) return;
    setRefreshing(true);
    try {
      await loadConversations(meRef.current);
      if (peerRef.current) await openChat(peerRef.current, meRef.current);
    } catch { /* keep old data */ }
    finally { setRefreshing(false); }
  }

  async function send() {
    if (!text.trim() || !peer || sending) return;
    const myId = meRef.current;
    if (!myId) return;
    setSending(true);
    const body = text.trim();
    setText('');
    try {
      const { data, error } = await supa().from('av_messages')
        .insert({ sender_id: myId, receiver_id: peer.id, text: body })
        .select('*').single();
      if (error) throw error;
      const m = data as Msg;
      setMsgs((prev) => [...prev, m]);
      setConvs((prev) => {
        const rest = prev.filter((c) => c.peer.id !== peer.id);
        return [{ peer, last: m }, ...rest];
      });
      setTimeout(scrollBottom, 60);
    } catch (e) {
      setText(body);
      console.error(e);
    } finally { setSending(false); }
  }

  async function findPeople() {
    if (!isSupaConfigured()) return;
    const { data: { user } } = await supa().auth.getUser();
    if (!user) return;
    const { data } = await supa().from('av_profiles')
      .select('id,full_name,avatar_emoji').neq('id', user.id).limit(30);
    if (data) setPeople(data as Person[]);
  }

  const shownConvs = convs.filter((c) =>
    (c.peer.full_name || '').toLowerCase().includes(search.toLowerCase())
  );
  const shownPeople = people.filter((p) =>
    (p.full_name || '').toLowerCase().includes(search.toLowerCase()) &&
    !convs.some((c) => c.peer.id === p.id)
  );

  return (
    <Shell title={`💬 ${t('messages')}`} sub={t('conversations')}>
      <div className="row" style={{ marginBottom: 10 }}>
        <input
          className="input" style={{ margin: 0, flex: 1 }}
          placeholder={`${t('search')}…`} value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn ghost" onClick={refresh} disabled={refreshing} title={t('refresh')}>
          {refreshing ? <span className="spinner" /> : '🔄'} {t('refresh')}
        </button>
        <button
          className="btn violet" style={{ padding: '10px 18px' }}
          onClick={() => { setShowFinder((s) => !s); if (!showFinder) findPeople(); }}
        >
          ➕
        </button>
      </div>

      {!isSupaConfigured() && <div className="note">Connect Supabase keys to use messages.</div>}
      {loading && <div className="skel"><div className="bar" style={{ width: '60%' }} /><div className="bar" /><div className="bar" style={{ width: '80%' }} /></div>}
      {error && !loading && (
        <div className="card"><p className="err">{error}</p><button className="btn violet" onClick={refresh}>{t('retry')}</button></div>
      )}

      {!loading && !error && (
        <div className={`msgwrap ${peer ? 'chatting' : ''}`}>
          {/* Conversations list */}
          <div className="convlist" aria-label={t('conversations')}>
            {showFinder && shownPeople.map((p) => (
              <div className="conv" key={p.id} onClick={() => { openChat(p, meRef.current); setShowFinder(false); }}>
                <div className="avatar">{p.avatar_emoji || '🙂'}</div>
                <div className="cmeta"><b>{p.full_name || 'Member'}</b><small>{t('tapToChat')}</small></div>
              </div>
            ))}
            {shownConvs.map((c) => (
              <div
                key={c.peer.id}
                className={`conv ${peer?.id === c.peer.id ? 'active' : ''}`}
                onClick={() => openChat(c.peer, meRef.current)}
              >
                <div className="avatar">{c.peer.avatar_emoji || '🙂'}</div>
                <div className="cmeta">
                  <b>{c.peer.full_name || 'Member'}</b>
                  <small>{c.last.sender_id === me ? 'You: ' : ''}{c.last.text.slice(0, 60)}</small>
                </div>
              </div>
            ))}
            {shownConvs.length === 0 && !showFinder && (
              <div className="card"><p style={{ color: 'var(--mut)', margin: 0 }}>{t('findPeople')} 💬</p></div>
            )}
          </div>

          {/* Conversation pane */}
          <div className="chatpane">
            {!peer ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--mut)' }}>
                <div style={{ fontSize: '2.5rem' }}>💬</div>
                <p>{t('findPeople')}</p>
              </div>
            ) : (
              <div className="card" style={{ margin: 0 }}>
                <div className="row" style={{ marginBottom: 8 }}>
                  <button className="btn ghost" style={{ padding: '8px 14px' }} onClick={() => { setPeer(null); peerRef.current = null; }}>
                    ← {t('back')}
                  </button>
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: '1.1rem' }}>{peer.avatar_emoji || '🙂'}</div>
                  <b>{peer.full_name || 'Member'}</b>
                </div>
                <div className="msgs">
                  {msgs.map((m) => (
                    <div key={m.id} className={`msg ${m.sender_id === me ? 'me' : ''}`}>
                      <small>{m.sender_id === me ? 'You' : (peer.full_name || 'Member')} · {new Date(m.created_at).toLocaleTimeString()}</small>
                      {m.text}
                    </div>
                  ))}
                  {msgs.length === 0 && <p style={{ color: 'var(--mut)' }}>{t('sayNamaste')}</p>}
                  <div ref={bottomRef} />
                </div>
                <div className="chatbar">
                  <input
                    className="input" placeholder={t('typeMessage')} value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    aria-label={t('typeMessage')}
                  />
                  <button className="btn violet" onClick={send} disabled={sending || !text.trim()}>
                    {sending ? <span className="spinner" /> : `➤ ${t('send')}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Shell>
  );
}
