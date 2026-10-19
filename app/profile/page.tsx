'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supa, isSupaConfigured } from '../../lib/supabase';
import { RequireAuth, signOut } from '../../lib/auth';
import { useLang, Shell } from '../../components/ui';

export default function Profile() {
  return <RequireAuth><Editor /></RequireAuth>;
}

function Editor() {
  const { t } = useLang();
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [emoji, setEmoji] = useState('🙂');
  const [email, setEmail] = useState('');
  const [kyc, setKyc] = useState('none');
  const [wallet, setWallet] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [dob, setDob] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [school, setSchool] = useState('');
  const [college, setCollege] = useState('');
  const [religion, setReligion] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [marriageStatus, setMarriageStatus] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [edu10, setEdu10] = useState(''); const [edu10s, setEdu10s] = useState('');
  const [edu12, setEdu12] = useState(''); const [edu12s, setEdu12s] = useState('');
  const [eduGrad, setEduGrad] = useState(''); const [eduGradC, setEduGradC] = useState('');
  const [eduMast, setEduMast] = useState(''); const [eduMastC, setEduMastC] = useState('');
  const [jobHistory, setJobHistory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const EMOJIS = ['🙂', '👩🏽', '👨🏽', '👩🏽‍🦱', '👨🏽‍🦱', '🧑🏽‍💼', '👵🏽', '👴🏽', '🧕🏽', '👲🏽'];

  const SOCIALS: Array<{ key: string; icon: string; label: string; prefix: string }> = [
    { key: 'telegram', icon: '✈️', label: 'Telegram', prefix: 'https://t.me/' },
    { key: 'facebook', icon: '📘', label: 'Facebook', prefix: 'https://facebook.com/' },
    { key: 'instagram', icon: '📸', label: 'Instagram', prefix: 'https://instagram.com/' },
    { key: 'tiktok', icon: '🎵', label: 'TikTok', prefix: 'https://tiktok.com/@' },
    { key: 'vk', icon: '🔷', label: 'VK', prefix: 'https://vk.com/' },
    { key: 'youtube', icon: '▶️', label: 'YouTube', prefix: 'https://youtube.com/@' },
  ];

  useEffect(() => {
    (async () => {
      if (!isSupaConfigured()) return;
      const { data: { user } } = await supa().auth.getUser();
      if (!user) return;
      setEmail(user.email || '');
      const { data } = await supa().from('av_profiles').select('*').eq('id', user.id).single();
      if (data) {
        setName(data.full_name || ''); setUsername(data.username || '');
        setBio(data.bio || ''); setEmoji(data.avatar_emoji || '🙂');
        setKyc(data.kyc_status || 'none'); setWallet(data.wallet_address || '');
        setPhone(data.phone || ''); setAddress(data.address || '');
        setJobTitle(data.job_title || ''); setCompany(data.company || '');
        setDob(data.dob || ''); setBirthPlace(data.birth_place || '');
        setSchool(data.school || ''); setCollege(data.college || '');
        setReligion(data.religion || ''); setEthnicity(data.ethnicity || '');
        setMarriageStatus(data.marriage_status || '');
        setAvatarUrl(data.avatar_url || '');
        setEdu10(data.edu_10th || ''); setEdu10s(data.edu_10th_school || '');
        setEdu12(data.edu_12th || ''); setEdu12s(data.edu_12th_school || '');
        setEduGrad(data.edu_grad || ''); setEduGradC(data.edu_grad_college || '');
        setEduMast(data.edu_masters || ''); setEduMastC(data.edu_masters_college || '');
        setJobHistory(data.job_history || '');
        setSocials((data.social_links as Record<string, string>) || {});
      }
    })();
  }, []);

  async function save() {
    setErr(''); setMsg('');
    try {
      const { data: { user } } = await supa().auth.getUser();
      if (!user) return;
      const { error } = await supa().from('av_profiles').update({
        full_name: name.trim(), username: username.trim().toLowerCase() || null,
        bio: bio.trim(), avatar_emoji: emoji, wallet_address: wallet.trim() || null,
        phone: phone.trim() || null, address: address.trim() || null,
        job_title: jobTitle.trim() || null, company: company.trim() || null,
        dob: dob || null, birth_place: birthPlace.trim() || null,
        school: school.trim() || null, college: college.trim() || null,
        religion: religion.trim() || null, ethnicity: ethnicity.trim() || null,
        marriage_status: marriageStatus.trim() || null,
        avatar_url: avatarUrl || null,
        edu_10th: edu10.trim() || null, edu_10th_school: edu10s.trim() || null,
        edu_12th: edu12.trim() || null, edu_12th_school: edu12s.trim() || null,
        edu_grad: eduGrad.trim() || null, edu_grad_college: eduGradC.trim() || null,
        edu_masters: eduMast.trim() || null, edu_masters_college: eduMastC.trim() || null,
        job_history: jobHistory.trim() || null,
        social_links: socials,
      }).eq('id', user.id);
      if (error) throw error;
      setMsg('Profile saved ✓');
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Save failed.'); }
  }

  async function uploadPhoto(file: File | undefined) {
    if (!file) return;
    setErr(''); setMsg(''); setUploading(true);
    try {
      const { data: { user } } = await supa().auth.getUser();
      if (!user) throw new Error('Login first');
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().slice(0, 4);
      const path = `avatars/${user.id}.${ext}`;
      const { error } = await supa().storage.from('av-media').upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data: pub } = supa().storage.from('av-media').getPublicUrl(path);
      setAvatarUrl(pub.publicUrl);
      setMsg('Photo uploaded ✓ — Save dabao');
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Upload failed.'); }
    setUploading(false);
  }

  async function changePass() {
    setErr(''); setMsg('');
    if (newPass.trim().length < 6) { setErr('Password: min 6 characters'); return; }
    try {
      const { error } = await supa().auth.updateUser({ password: newPass.trim() });
      if (error) throw error;
      setNewPass('');
      setMsg(t('passwordChanged'));
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Failed.'); }
  }

  async function logout() {
    await signOut();
    router.push('/');
  }

  return (
    <Shell title={t('profile')} sub="One identity across feed, family, briefcase & business.">
      <div className="card">
        <div className="genlabel">📷 {t('profilePhoto')}</div>
        <div className="row" style={{ alignItems: 'center' }}>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="profile" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ fontSize: '3rem' }}>{emoji}</div>
          )}
          <label className="btn ghost" style={{ fontSize: '.85rem', padding: '10px 18px', cursor: 'pointer' }}>
            {uploading ? '…' : `📤 ${t('uploadPhoto')}`}
            <input type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => uploadPhoto(e.target.files?.[0])} disabled={uploading} />
          </label>
        </div>
        <div className="row" style={{ marginBottom: 8, marginTop: 8 }}>
          {EMOJIS.map(e => (
            <button key={e} onClick={() => setEmoji(e)}
              style={{ fontSize: '1.8rem', background: emoji === e ? 'rgba(192,132,252,.25)' : 'transparent', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12, cursor: 'pointer', padding: 6 }}>
              {e}
            </button>
          ))}
        </div>
        <input className="input" placeholder={t('fullName')} value={name} onChange={e => setName(e.target.value)} />
        <input className="input" placeholder="username (unique)" value={username} onChange={e => setUsername(e.target.value)} />
        <textarea className="input" placeholder="Bio…" value={bio} onChange={e => setBio(e.target.value)} />
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`📞 ${t('phone')}`} value={phone} onChange={e => setPhone(e.target.value)} />
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`📍 ${t('address')}`} value={address} onChange={e => setAddress(e.target.value)} />
        </div>
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`💼 ${t('jobTitle')}`} value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`🏢 ${t('company')}`} value={company} onChange={e => setCompany(e.target.value)} />
        </div>
        <div className="genlabel">📜 {t('lifeStory')}</div>
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} type="date" value={dob} onChange={e => setDob(e.target.value)} title={t('dateOfBirth')} />
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`🏠 ${t('birthPlace')}`} value={birthPlace} onChange={e => setBirthPlace(e.target.value)} />
        </div>
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`🏫 ${t('school')}`} value={school} onChange={e => setSchool(e.target.value)} />
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`🎓 ${t('college')}`} value={college} onChange={e => setCollege(e.target.value)} />
        </div>
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`🛐 ${t('religion')}`} value={religion} onChange={e => setReligion(e.target.value)} />
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`👥 ${t('ethnicity')}`} value={ethnicity} onChange={e => setEthnicity(e.target.value)} />
        </div>
        <input className="input" placeholder={`💍 ${t('marriageStatus')}`} value={marriageStatus} onChange={e => setMarriageStatus(e.target.value)} />
        <div className="genlabel">🎓 {t('education')}</div>
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`${t('tenth')} (e.g. 2005)`} value={edu10} onChange={e => setEdu10(e.target.value)} />
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`${t('school')}`} value={edu10s} onChange={e => setEdu10s(e.target.value)} />
        </div>
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`${t('twelfth')} (e.g. 2007)`} value={edu12} onChange={e => setEdu12(e.target.value)} />
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`${t('school')}`} value={edu12s} onChange={e => setEdu12s(e.target.value)} />
        </div>
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`${t('graduation')} (e.g. B.E. 2011)`} value={eduGrad} onChange={e => setEduGrad(e.target.value)} />
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`${t('college')}`} value={eduGradC} onChange={e => setEduGradC(e.target.value)} />
        </div>
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`${t('masters')} (e.g. M.Tech 2013)`} value={eduMast} onChange={e => setEduMast(e.target.value)} />
          <input className="input" style={{ flex: 1, margin: 0 }} placeholder={`${t('college')}`} value={eduMastC} onChange={e => setEduMastC(e.target.value)} />
        </div>
        <textarea className="input" placeholder={`💼 ${t('jobHistory')} — e.g. 2011-2015 Infosys, 2015-now Paladin Security`} value={jobHistory} onChange={e => setJobHistory(e.target.value)} />
        <input className="input" placeholder="Web3 wallet address (optional — W3C DID ready)" value={wallet} onChange={e => setWallet(e.target.value)} />
        <div className="genlabel">🔗 Social links</div>
        {SOCIALS.map(s => (
          <div className="row" key={s.key} style={{ marginBottom: 4 }}>
            <span style={{ fontSize: '1.3rem', width: 34, textAlign: 'center' }} title={s.label}>{s.icon}</span>
            <input
              className="input" style={{ flex: 1, margin: 0 }}
              placeholder={`${s.label} username`}
              value={socials[s.key] || ''}
              onChange={e => setSocials({ ...socials, [s.key]: e.target.value.trim() })}
            />
            {socials[s.key] && (
              <a href={`${s.prefix}${socials[s.key]}`} target="_blank" rel="noopener noreferrer"
                className="btn ghost" style={{ padding: '8px 14px', fontSize: '.85rem' }}>Open ↗</a>
            )}
          </div>
        ))}
        <div className="row" style={{ margin: '10px 0' }}>
          <span className="pill">📧 {email}</span>
          <span className={`pill ${kyc === 'verified' ? 'ok' : 'warn'}`}>🪪 KYC: {kyc}</span>
        </div>
        <button className="btn violet" onClick={save}>Save</button>{' '}
        <button className="btn ghost" onClick={logout}>Log out</button>
        {msg && <p className="ok">{msg}</p>}
        {err && <p className="err">{err}</p>}
      </div>
      <div className="card">
        <h3 style={{ margin: '0 0 10px', fontSize: '.95rem' }}>🔒 {t('changePassword')}</h3>
        <div className="row">
          <input className="input" style={{ flex: 1, margin: 0 }} type="password"
            placeholder={t('newPassword')} value={newPass} onChange={e => setNewPass(e.target.value)} />
          <button className="btn" style={{ fontSize: '.85rem', padding: '10px 18px' }} onClick={changePass}>{t('changePassword')}</button>
        </div>
      </div>
      <div className="note">
        <b>Web3-ready:</b> add your wallet address to link a decentralized identity (W3C DID).
        Private photos, family records and documents always stay off public blockchains.
      </div>
    </Shell>
  );
}
