import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import logoSrc from '../logo.svg';
import { useAppStore } from '../store/appStore.jsx';
import { DARK, LIGHT } from '../components/extracted/theme.js';
import Button from '../components/extracted/ui/Button.jsx';
import Field from '../components/extracted/ui/Field.jsx';

const Btn = Button;

function LoginExtracted({ onLogin, dark }) {
  const T = dark ? DARK : LIGHT;
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const go = () => {
    if (!email || !pass) {
      setErr('Enter email and password.');
      return;
    }
    setLoading(true);
    setErr('');
    setTimeout(() => {
      if (email === 'admin@pickybasket.com' && pass === 'picky2024') onLogin();
      else {
        setErr('Wrong email or password.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight: '100vh', background: dark ? 'linear-gradient(135deg,#040a10 60%,#0d2420)' : 'linear-gradient(135deg,#0f1923 60%,#1f7a6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: T.card, borderRadius: 22, padding: '36px 28px', width: '100%', maxWidth: 400, boxShadow: '0 32px 80px rgba(0,0,0,.5)', border: `1px solid ${T.border}` }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src={logoSrc} alt="Picky Basket" style={{ width: 80, height: 80, margin: '0 auto 14px', display: 'block', objectFit: 'contain' }} />
          <div style={{ fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: -0.5 }}>Picky Basket</div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 3, fontWeight: 500 }}>Admin Portal</div>
        </div>
        <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="admin@pickybasket.com" />
        <Field label="Password" value={pass} onChange={setPass} type="password" placeholder="••••••••" />
        {err ? <div style={{ fontSize: 13, color: T.red, padding: '8px 12px', background: T.redL, borderRadius: 8, marginBottom: 12, fontWeight: 500 }}>{err}</div> : null}
        <Btn full onClick={go} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Btn>
        <div onClick={() => { setEmail('admin@pickybasket.com'); setPass('picky2024'); onLogin(); }} style={{ marginTop: 12, padding: 11, background: T.tealLt, borderRadius: 10, fontSize: 12, color: T.teal, textAlign: 'center', cursor: 'pointer', border: `1px dashed ${T.teal}`, fontWeight: 700 }}>
          👆 Demo: Click to sign in instantly
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/login' });
  const { darkMode, setLoggedIn } = useAppStore();

  const handleLogin = () => {
    setLoggedIn(true);
    const redirect = typeof search?.redirect === 'string' ? search.redirect : '/';
    navigate({ to: redirect.startsWith('/') ? redirect : '/' });
  };

  return <LoginExtracted onLogin={handleLogin} dark={darkMode} />;
}
