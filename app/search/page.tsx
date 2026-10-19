'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supa, isSupaConfigured } from '../../lib/supabase';
import { Shell, useLang } from '../../components/ui';

type Row = { id: string; full_name: string; avatar_emoji: string };

function Results() {
  const qp = useSearchParams();
  const q = (qp.get('q') ?? '').trim();
  const { t } = useLang();
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isSupaConfigured()) return;
      try {
        const { count } = await supa().from('av_profiles').select('id', { count: 'exact', head: true });
        setTotal(count ?? 0);
      } catch { /* ignore */ }
      if (!q) { setRows([]); return; }
      setLoading(true);
      try {
        const { data } = await supa().from('av_profiles')
          .select('id,full_name,avatar_emoji')
          .ilike('full_name', `%${q}%`)
          .limit(30);
        setRows((data as Row[]) ?? []);
      } catch { setRows([]); }
      setLoading(false);
    })();
  }, [q]);

  return (
    <>
      {total !== null && (
        <p className="psub">🌍 Duniya par <b>{total.toLocaleString('en-IN')}</b> members</p>
      )}
      {!q && <p className="psub">{t('searchPeople')}</p>}
      {loading && <div className="skel"><div className="bar" /></div>}
      {!loading && q && (
        <p className="psub"><b>{rows.length}</b> {t('peopleFound')} — “{q}”</p>
      )}
      {rows.map((r) => (
        <div className="member" key={r.id}>
          <Link href={`/profile/${r.id}`} className="avatar" style={{ textDecoration: 'none' }}>{r.avatar_emoji || '👤'}</Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>{r.full_name || 'Duniya User'}</b>
            <small>Duniya member</small>
          </div>
          <Link href={`/profile/${r.id}`} className="btn ghost" style={{ fontSize: '.8rem', padding: '8px 14px' }}>
            👤 {t('viewProfile')}
          </Link>
        </div>
      ))}
      {!loading && q && rows.length === 0 && (
        <div className="card"><p className="psub" style={{ margin: 0 }}>{t('noPeopleFound')}</p></div>
      )}
    </>
  );
}

export default function SearchPage() {
  const { t } = useLang();
  return (
    <Shell title={`🔍 ${t('search')}`}>
      <Suspense fallback={<div className="skel"><div className="bar" /></div>}>
        <Results />
      </Suspense>
    </Shell>
  );
}
