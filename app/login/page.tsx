'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supa, isSupaConfigured } from '../../lib/supabase';
import { DEMO_LOGIN, demoSignIn } from '../../lib/auth';
import { useLang, Shell } from '../../components/ui';

export default function Login() {
  const { t } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function sendCode() {
    setErr(''); setMsg(''); setBusy(true);
    try {
      if (!email.includes('@')) throw new Error('Enter a valid email.');
      if (DEMO_LOGIN) {
        // 📝 DEMO: email nahi jayega — seedha OTP step.
        setStep('otp'); setMsg('📝 Demo mode — email nahi jayega. Koi bhi 6-digit number likho, login ho jayega.');
        return;
      }
      if (!isSupaConfigured()) throw new Error('Database not connected yet.');
      const { error } = await supa().auth.signInWithOtp({ email: email.trim() });
      if (error) throw error;
      setStep('otp'); setMsg(t('codeSent'));
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Failed.'); }
    finally { setBusy(false); }
  }
  async function verify() {
    setErr(''); setBusy(true);
    try {
      if (DEMO_LOGIN) {
        // 📝 DEMO: koi bhi code chalega — seedha /home.
        if (code.trim().length < 4) throw new Error('Koi bhi 6-digit number likho (demo).');
        demoSignIn(email);
        router.push('/home');
        return;
      }
      const { error } = await supa().auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
      if (error) throw error;
      router.push('/home');
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Invalid code.'); }
    finally { setBusy(false); }
  }

  return (
    <Shell title={t('login')} sub="One-time code — no passwords to forget.">
      <div className="card" style={{ maxWidth: 440 }}>
        {step === 'form' ? (
          <>
            <input className="input" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} />
            {DEMO_LOGIN && <div className="note" style={{ marginBottom: 10 }}>📝 Demo mode: koi bhi email likho — koi email nahi jayega, koi bhi code chalega. Asli OTP baad me aayega.</div>}
            <button className="btn violet" disabled={busy} onClick={sendCode}>{busy ? '…' : t('sendCode')}</button>
          </>
        ) : (
          <>
            <p>{DEMO_LOGIN ? '📝 Demo code likho (koi bhi 6-digit number):' : <>Enter the 6-digit code sent to <b>{email}</b>:</>}</p>
            <input className="input" placeholder="6-digit code" value={code} onChange={e => setCode(e.target.value)} maxLength={6} inputMode="numeric" />
            <button className="btn violet" disabled={busy} onClick={verify}>{busy ? '…' : t('verify')}</button>{' '}
            <button className="btn ghost" onClick={() => setStep('form')}>Back</button>
          </>
        )}
        {msg && <p className="ok">{msg}</p>}
        {err && <p className="err">{err}</p>}
        <p style={{ marginTop: 14 }}><small>No account? <Link href="/register">Create one</Link></small></p>
      </div>
    </Shell>
  );
}
