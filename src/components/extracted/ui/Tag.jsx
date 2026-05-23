import { statusStyle, useExtractedTheme } from '../theme.js';

export default function Tag({ s }) {
  const T = useExtractedTheme();
  const { bg, fg } = statusStyle(s, T);

  return <span style={{ background: bg, color: fg, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{s}</span>;
}
