import { useExtractedTheme } from '../theme.js';

export default function Button({ children, onClick, v = 'primary', sm, full, disabled, style }) {
  const T = useExtractedTheme();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: v === 'primary' ? T.teal : v === 'danger' ? T.redL : v === 'ghost' ? T.bgAlt : 'transparent',
        color: v === 'primary' ? '#fff' : v === 'danger' ? T.red : v === 'outline' ? T.teal : T.muted,
        border: v === 'outline' ? `1.5px solid ${T.teal}` : v === 'ghost' ? `1px solid ${T.border}` : 'none',
        padding: sm ? '6px 14px' : '9px 20px',
        borderRadius: 9,
        fontSize: sm ? 12 : 13,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: full ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        fontFamily: "'DM Sans',system-ui,sans-serif",
        transition: 'all .15s',
        minHeight: sm ? 32 : 40,
        touchAction: 'manipulation',
        ...style
      }}
    >
      {children}
    </button>
  );
}
