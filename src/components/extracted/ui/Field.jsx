import { useExtractedTheme } from '../theme.js';

export default function Field({ label, value, onChange, type = 'text', placeholder, options, rows, required }) {
  const T = useExtractedTheme();
  const base = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 9,
    border: `1.5px solid ${T.border}`,
    fontSize: 16,
    fontFamily: 'inherit',
    background: T.inputBg,
    color: T.text,
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ marginBottom: 13 }}>
      {label ? (
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>
          {label}
          {required ? <span style={{ color: T.red }}> *</span> : null}
        </label>
      ) : null}
      {options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...base, fontSize: 16 }}>
          <option value="">- choose -</option>
          {options.map((o) => (
            <option key={o.v || o} value={o.v || o}>
              {o.l || o}
            </option>
          ))}
        </select>
      ) : rows ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...base, resize: 'vertical' }} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={base} />
      )}
    </div>
  );
}
