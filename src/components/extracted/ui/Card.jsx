import { useExtractedTheme } from '../theme.js';

export default function Card({ children, style }) {
  const T = useExtractedTheme();
  return <div style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, padding: 16, ...style }}>{children}</div>;
}
