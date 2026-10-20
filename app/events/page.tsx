'use client';
import { useEffect, useState } from 'react';
import { Shell } from '../../components/ui';
import { upcomingBigEvents, prettyDate, type BigEvent } from '../../lib/festivals';

type MyEvent = { name: string; date: string; venue: string };
const LS_KEY = 'duniya_my_events';

function loadMine(): MyEvent[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') as MyEvent[]; } catch { return []; }
}

export default function EventsPage() {
  const [big, setBig] = useState<BigEvent[]>([]);
  const [mine, setMine] = useState<MyEvent[]>([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');

  useEffect(() => { setBig(upcomingBigEvents(120)); setMine(loadMine()); }, []);

  function add() {
    if (!name.trim() || !date) return;
    const ev = { name: name.trim(), date, venue: venue.trim() };
    const all = [...loadMine(), ev].sort((a, b) => a.date.localeCompare(b.date));
    try { localStorage.setItem(LS_KEY, JSON.stringify(all)); } catch { /* ignore */ }
    setMine(all); setName(''); setDate(''); setVenue('');
  }

  return (
    <Shell title="🎪 Utsav (Events)" sub="Bade events aur tumhare apne karyakram">
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>➕ Apna event jodo</h3>
        <input className="input" placeholder="Event ka naam" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: 8 }} />
        <div className="row" style={{ gap: 8 }}>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input className="input" placeholder="Jagah (venue)" value={venue} onChange={(e) => setVenue(e.target.value)} />
        </div>
        <button className="btn primary" onClick={add} style={{ marginTop: 8 }}>Event jodo</button>
      </div>
      {mine.length > 0 && (
        <div className="card" style={{ marginBottom: 14 }}>
          <h3>🗓️ Mere events</h3>
          {mine.map((e, i) => (
            <p key={i} style={{ margin: '6px 0' }}>🎉 <b>{e.name}</b> — {prettyDate(e.date)}{e.venue ? ' · ' + e.venue : ''}</p>
          ))}
        </div>
      )}
      <div className="card">
        <h3>🎪 Aane wale bade events</h3>
        {big.map((e, i) => (
          <div key={e.name + e.date + i} className="row" style={{ gap: 10, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
            <span style={{ fontSize: 26 }}>{e.emoji}</span>
            <span><b>{e.name}</b><br /><small style={{ color: 'var(--mut)' }}>{prettyDate(e.date)}{e.dateEnd ? ' – ' + prettyDate(e.dateEnd) : ''} · {e.venue}</small></span>
          </div>
        ))}
        {big.length === 0 && <p style={{ color: 'var(--mut)' }}>Abhi koi bada event nahi.</p>}
      </div>
    </Shell>
  );
}
