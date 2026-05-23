import { useExtractedTheme } from '../theme.js';

export default function EmptyState({ icon, msg }) {
  const T = useExtractedTheme();

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: T.muted }}>
      <div style={{ fontSize: 38, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{msg}</div>
    </div>
  );
}
