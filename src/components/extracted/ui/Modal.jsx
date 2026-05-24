import { useEffect } from 'react';
import { useExtractedTheme } from '../theme.js';

export default function Modal({ title, onClose, children, w = 480 }) {
  const T = useExtractedTheme();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: T.card, borderRadius: 18, width: '100%', maxWidth: w, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.3)', border: `1px solid ${T.border}` }}>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: T.card, zIndex: 1, borderRadius: '18px 18px 0 0' }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: T.text, marginTop: 0 }}>{title}</span>
          <button onClick={onClose} style={{ background: T.bgAlt, border: 'none', width: 32, height: 32, borderRadius: 8, fontSize: 18, cursor: 'pointer', color: T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 0 }}>×</button>
        </div>
        <div style={{ padding: '16px' }}>{children}</div>
      </div>
    </div>
  );
}
