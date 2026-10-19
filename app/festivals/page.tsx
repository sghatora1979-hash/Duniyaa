'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Shell, useLang } from '../../components/ui';
import { WorldPicker, useWorld } from '../../components/hybrid';
import {
  FESTIVALS, STATES, upcomingFestivals, festivalsByState, prettyDate,
} from '../../lib/festivals';
import { upcomingWorldFestivals } from '../../lib/worlds';

export default function FestivalsPage() {
  const { t, lang } = useLang();
  const { world } = useWorld();
  const [state, setState] = useState('All India');
  const next30 = useMemo(() => upcomingFestivals(30), []);
  const list = useMemo(() => festivalsByState(state), [state]);
  const worldFest = useMemo(() => upcomingWorldFestivals(world, 400), [world]);

  const nameOf = (f: { name: string; hi: string }) => (lang === 'hi' ? f.hi : f.name);
  const isIndia = world.id === 'india';

  return (
    <Shell title={`🎉 ${t('festivals')}`} sub={t('upcomingFestivals')}>
      <div className="card" style={{ padding: '14px 16px' }}>
        <WorldPicker />
        {!isIndia && (
          <p className="psub" style={{ margin: '8px 0 0' }}>
            {world.flag} {world.name} · {world.religions.join(', ')}
          </p>
        )}
      </div>

      {isIndia ? (
        <>
          {/* Next 30 days */}
          <h2 className="ptitle" style={{ fontSize: '1.25rem' }}>📅 {t('next30days')}</h2>
          {next30.length === 0 && <p className="psub">—</p>}
          {next30.map((f) => (
            <div className="card" key={f.id} style={{ padding: '14px 16px' }}>
              <div className="posthead">
                <div className="avatar" style={{ width: 46, height: 46, fontSize: '1.5rem' }}>{f.emoji}</div>
                <div className="pmeta" style={{ flex: 1 }}>
                  <b>{nameOf(f)}{f.approx ? ' ~' : ''}</b>
                  <small>{prettyDate(f.date)}{f.approx ? ` · ${t('dateMayVary')}` : ''}</small>
                </div>
                {f.nationalHoliday && <span className="pill ok">🏛️ {t('nationalHoliday')}</span>}
              </div>
              <div className="pactions" style={{ marginTop: 6 }}>
                <span className="pill">{f.states.includes('ALL') ? t('allStates') : f.states.join(', ')}</span>
                <Link href="/messages" className="btn ghost" style={{ fontSize: '.8rem', padding: '7px 14px', marginLeft: 'auto' }}>
                  💌 {t('greetFriends')} →
                </Link>
              </div>
            </div>
          ))}

          {/* State filter */}
          <h2 className="ptitle" style={{ fontSize: '1.25rem', marginTop: 26 }}>🗺️ {state === 'All India' ? t('allStates') : state}</h2>
          <div className="chiprow" style={{ display: 'flex' }}>
            {STATES.map((s) => (
              <button
                key={s}
                onClick={() => setState(s)}
                className={state === s ? 'active' : ''}
                style={{
                  flexShrink: 0, fontSize: '.85rem', fontWeight: 700, borderRadius: 999,
                  padding: '8px 14px', cursor: 'pointer',
                  background: state === s ? 'linear-gradient(90deg,var(--th-acc),var(--th-acc2))' : 'var(--card)',
                  color: state === s ? '#fff' : 'var(--ink)',
                  border: state === s ? '1px solid transparent' : '1px solid rgba(0,0,0,.10)',
                }}
              >
                {s === 'All India' ? t('allStates') : s}
              </button>
            ))}
          </div>

          {list.map((f) => (
            <div className="member" key={f.id}>
              <div className="avatar" style={{ width: 40, height: 40, fontSize: '1.25rem' }}>{f.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b>{nameOf(f)}{f.approx ? ' ~' : ''}</b>
                <small>{prettyDate(f.date)}{f.nationalHoliday ? ` · 🏛️ ${t('nationalHoliday')}` : ''}</small>
              </div>
            </div>
          ))}
          <p className="psub" style={{ marginTop: 18 }}>
            📌 {FESTIVALS.length} festivals · {t('dateMayVary')}
          </p>
        </>
      ) : (
        <>
          <h2 className="ptitle" style={{ fontSize: '1.25rem' }}>
            {world.flag} {lang === 'hi' ? world.hi : world.name}
          </h2>
          {worldFest.map((f) => (
            <div className="card" key={f.name} style={{ padding: '14px 16px' }}>
              <div className="posthead">
                <div className="avatar" style={{ width: 46, height: 46, fontSize: '1.5rem' }}>{f.emoji}</div>
                <div className="pmeta" style={{ flex: 1 }}>
                  <b>{nameOf(f)}{f.approx ? ' ~' : ''}</b>
                  <small>{prettyDate(f.date)}{f.approx ? ` · ${t('dateMayVary')}` : ''}</small>
                </div>
              </div>
              <div className="pactions" style={{ marginTop: 6 }}>
                <Link href="/messages" className="btn ghost" style={{ fontSize: '.8rem', padding: '7px 14px', marginLeft: 'auto' }}>
                  💌 {t('greetFriends')} →
                </Link>
              </div>
            </div>
          ))}
          <div className="card" style={{ marginTop: 18 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '.95rem' }}>🛐 {lang === 'hi' ? 'धर्म' : 'Religions'}</h3>
            <p className="psub" style={{ margin: 0 }}>{world.religions.join(' · ')}</p>
          </div>
        </>
      )}
    </Shell>
  );
}
