import { useExtractedTheme } from '../theme.js';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  const T = useExtractedTheme();

  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: T.muted, pointerEvents: 'none' }}>🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '9px 32px 9px 32px', borderRadius: 9, border: `1.5px solid ${T.border}`, fontSize: 16, fontFamily: 'inherit', background: T.inputBg, color: T.text, outline: 'none', boxSizing: 'border-box' }}
      />
      {value ? (
        <button onClick={() => onChange('')} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: 18, lineHeight: 1, padding: '0 4px' }}>
          ×
        </button>
      ) : null}
    </div>
  );
}
