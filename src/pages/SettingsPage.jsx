import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAppStore } from '../store/appStore.jsx';
import { useExtractedTheme } from '../components/extracted/theme.js';
import Button from '../components/extracted/ui/Button.jsx';
import Card from '../components/extracted/ui/Card.jsx';
import Field from '../components/extracted/ui/Field.jsx';

const Btn = Button;

function useT() {
  return useExtractedTheme();
}

function SettingsExtracted({ onLogout }) {
  const T = useT();
  const { darkMode, setDarkMode } = useAppStore();
  const [name, setName] = useState('Picky Basket');
  const [phone, setPhone] = useState('+233 30 000 0001');
  const [email, setEmail] = useState('admin@pickybasket.com');
  const [city, setCity] = useState('Accra, Ghana');
  const [fee, setFee] = useState('12');
  const [min, setMin] = useState('20');
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [saved, setSaved] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const changePw = () => {
    if (!curPw || !newPw) {
      setPwMsg('Fill both fields.');
      return;
    }
    if (curPw !== 'picky2024') {
      setPwMsg('Current password is wrong.');
      return;
    }
    setPwMsg('Password changed ✓');
    setCurPw('');
    setNewPw('');
    setTimeout(() => setPwMsg(''), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 540 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Settings</h2>
        <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>Store & admin configuration</p>
      </div>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: T.text }}>🎨 Appearance</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: T.bgAlt, borderRadius: 10, border: `1px solid ${T.border}` }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>Dark Mode</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Switch between light and dark interface</div>
          </div>
          <button type="button" onClick={() => setDarkMode((d) => !d)} style={{ width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', background: darkMode ? T.teal : '#cbd5e1', transition: 'background .2s', position: 'relative', padding: 0, flexShrink: 0 }}>
            <span style={{ position: 'absolute', top: 3, left: darkMode ? 22 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.3)' }} />
          </button>
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: T.text }}>🏪 Store Info</div>
        <Field label="Store Name" value={name} onChange={setName} />
        <Field label="Phone" value={phone} onChange={setPhone} />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="City" value={city} onChange={setCity} />
      </Card>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: T.text }}>🚚 Delivery Settings</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Base Delivery Fee" value={fee} onChange={setFee} type="number" />
          <Field label="Min. Order Amount" value={min} onChange={setMin} type="number" />
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: T.text }}>🔒 Security</div>
        <Field label="Current Password" value={curPw} onChange={setCurPw} type="password" placeholder="Enter current password" />
        <Field label="New Password" value={newPw} onChange={setNewPw} type="password" placeholder="Enter new password" />
        {pwMsg ? <div style={{ fontSize: 12, color: pwMsg.includes('✓') ? T.green : T.red, padding: '6px 10px', background: pwMsg.includes('✓') ? T.greenL : T.redL, borderRadius: 8, marginBottom: 8 }}>{pwMsg}</div> : null}
        <Btn v="outline" onClick={changePw}>Update Password</Btn>
      </Card>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <Btn onClick={save}>Save Changes</Btn>
        {saved ? <span style={{ fontSize: 13, color: T.green, fontWeight: 600 }}>✓ Saved</span> : null}
        <Btn v="danger" onClick={onLogout} style={{ marginLeft: 'auto' }}>Log Out</Btn>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { setLoggedIn } = useAppStore();

  const handleLogout = () => {
    setLoggedIn(false);
    navigate({ to: '/login' });
  };

  return <SettingsExtracted onLogout={handleLogout} />;
}
