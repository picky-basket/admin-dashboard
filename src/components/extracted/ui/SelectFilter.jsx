import { useExtractedTheme } from '../theme.js';

export default function SelectFilter({ value, onChange, children }) {
  const T = useExtractedTheme();

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: '9px 10px', borderRadius: 9, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: 'inherit', background: T.inputBg, color: T.text, outline: 'none', cursor: 'pointer', minHeight: 40 }}>
      {children}
    </select>
  );
}
