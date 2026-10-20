'use client';
import { useEffect, useState } from 'react';
import { Shell } from '../../components/ui';
import { useSession } from '../../lib/auth';
import { supa, isSupaConfigured } from '../../lib/supabase';

type Group = { id: string; name: string; description: string; members: number; joined: boolean };

const LS_KEY = 'duniya_groups_demo';
const SEED: Group[] = [
  { id: 'demo-g1', name: '🌾 Punjab Pind Parivaar', description: 'Apne pind ke dost aur khabrein', members: 128, joined: false },
  { id: 'demo-g2', name: '📸 Duniya Photography', description: 'Photo shaukeenon ka adda', members: 86, joined: false },
  { id: 'demo-g3', name: '🎓 MVIT 1997 Batch', description: 'Purane college dost', members: 56, joined: false },
];

function loadLocal(): Group[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as Group[];
  } catch { /* ignore */ }
  return SEED;
}
function saveLocal(gs: Group[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(gs)); } catch { /* ignore */ }
}

export default function GroupsPage() {
  const session = useSession();
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState('');
  const live = !!session && !session.id.startsWith('demo-') && isSupaConfigured();

  async function load() {
    if (live && session) {
      const sb = supa();
      const { data } = await sb.from('av_groups').select('id,name,description,created_at').order('created_at', { ascending: false }).limit(50);
      const { data: mem } = await sb.from('av_group_members').select('group_id').eq('user_id', session.id);
      const mine = new Set((mem || []).map((m: { group_id: string }) => m.group_id));
      setGroups((data || []).map((g: { id: string; name: string; description: string }) => ({
        id: g.id, name: g.name, description: g.description || '', members: 0, joined: mine.has(g.id),
      })));
    } else {
      setGroups(loadLocal());
    }
  }
  useEffect(() => { if (session !== undefined) load(); }, [session !== undefined, live]);

  async function create() {
    if (!name.trim()) return;
    if (live && session) {
      const sb = supa();
      const { data, error } = await sb.from('av_groups').insert({ owner_id: session.id, name: name.trim(), description: desc.trim() }).select('id').single();
      if (error) { setMsg('❌ ' + error.message); return; }
      if (data) await sb.from('av_group_members').insert({ group_id: data.id, user_id: session.id, role: 'owner' });
    } else {
      const gs = [{ id: 'demo-' + Date.now(), name: name.trim(), description: desc.trim(), members: 1, joined: true }, ...loadLocal()];
      saveLocal(gs);
    }
    setName(''); setDesc(''); setMsg('✅ Samuh ban gaya!'); load();
  }

  async function toggleJoin(g: Group) {
    if (live && session) {
      const sb = supa();
      if (g.joined) await sb.from('av_group_members').delete().eq('group_id', g.id).eq('user_id', session.id);
      else await sb.from('av_group_members').insert({ group_id: g.id, user_id: session.id, role: 'member' });
      load();
    } else {
      const gs = loadLocal().map((x) => x.id === g.id ? { ...x, joined: !x.joined, members: x.members + (x.joined ? -1 : 1) } : x);
      saveLocal(gs); setGroups(gs);
    }
  }

  return (
    <Shell title="🏘️ Samuh (Groups)" sub="Apne shauk, apne log — group banao ya shamil ho">
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>➕ Naya Samuh banao</h3>
        <input className="input" placeholder="Group ka naam" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: 8 }} />
        <input className="input" placeholder="Kis baare me hai? (chhota varnan)" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ marginBottom: 8 }} />
        <button className="btn primary" onClick={create}>Samuh banao</button>
        {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
        {!live && <p style={{ color: 'var(--mut)', fontSize: '.82rem', marginTop: 6 }}>Demo mode: groups abhi is device par save hote hain. Asli login ke baad Supabase par chalenge.</p>}
      </div>
      {groups.map((g) => (
        <div className="card" key={g.id} style={{ marginBottom: 10 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <b>{g.name}</b>
              <div style={{ color: 'var(--mut)', fontSize: '.85rem' }}>{g.description}</div>
              <div style={{ color: 'var(--mut)', fontSize: '.8rem' }}>👥 {g.members > 0 ? g.members + ' sadasya' : 'Naya samuh'}</div>
            </div>
            <button className={g.joined ? 'btn' : 'btn primary'} onClick={() => toggleJoin(g)}>{g.joined ? '✓ Shamil ho' : 'Join'}</button>
          </div>
        </div>
      ))}
      {groups.length === 0 && <p style={{ color: 'var(--mut)' }}>Abhi koi group nahi — pehla tum banao!</p>}
    </Shell>
  );
}
