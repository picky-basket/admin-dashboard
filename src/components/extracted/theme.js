import { useAppStore } from '../../store/appStore.jsx';

export const LIGHT = {
  teal: '#2A9D8F',
  tealLt: '#e0f5f3',
  orange: '#E76F51',
  navy: '#0f1923',
  text: '#1a1a1a',
  muted: '#6b7280',
  border: '#e8ecf0',
  bg: '#f4f7f6',
  bgAlt: '#eef2f1',
  card: '#ffffff',
  green: '#22c55e',
  greenL: '#dcfce7',
  red: '#ef4444',
  redL: '#fee2e2',
  yellow: '#f59e0b',
  yellowL: '#fef3c7',
  blue: '#3b82f6',
  blueL: '#dbeafe',
  inputBg: '#ffffff'
};

export const DARK = {
  teal: '#2fcfbe',
  tealLt: '#0d3330',
  orange: '#f4845f',
  navy: '#070d14',
  text: '#f0f4f8',
  muted: '#64748b',
  border: '#1e2d3d',
  bg: '#0b1520',
  bgAlt: '#0f1e2e',
  card: '#111f2e',
  green: '#34d399',
  greenL: '#052e1c',
  red: '#f87171',
  redL: '#2d0f0f',
  yellow: '#fbbf24',
  yellowL: '#2d1f04',
  blue: '#60a5fa',
  blueL: '#0f1e38',
  inputBg: '#0d1c2b'
};

export function useExtractedTheme() {
  const { darkMode } = useAppStore();
  return darkMode ? DARK : LIGHT;
}

export const statusStyle = (s, T) => ({
  'In Stock': { bg: T.greenL, fg: T.green },
  'Low Stock': { bg: T.yellowL, fg: T.yellow },
  'Out of Stock': { bg: T.redL, fg: T.red },
  Pending: { bg: T.yellowL, fg: T.yellow },
  Packing: { bg: T.blueL, fg: T.blue },
  Delivering: { bg: T.tealLt, fg: T.teal },
  Delivered: { bg: T.greenL, fg: T.green },
  Cancelled: { bg: T.redL, fg: T.red },
  Active: { bg: T.greenL, fg: T.green },
  Inactive: { bg: T.bgAlt, fg: T.muted },
  Settled: { bg: T.greenL, fg: T.green },
  Refunded: { bg: T.redL, fg: T.red }
}[s] || { bg: T.bgAlt, fg: T.muted });
