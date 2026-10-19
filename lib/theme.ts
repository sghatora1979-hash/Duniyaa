// Duniya theme engine — single calm theme (bright hourly rotation removed 2026-10-12 per user request).
export type HourTheme = { name: string; acc: string; acc2: string; glow: string; deep: string };

export const HOUR_THEMES: HourTheme[] = [
  { name: 'Warm Earth', acc: '#B4703A', acc2: '#D9A066', glow: 'rgba(180,112,58,.30)', deep: '#5C3A1E' },
];

export function hourTheme(d = new Date()): HourTheme {
  const h = Math.floor(d.getTime() / 3600000);
  return HOUR_THEMES[h % HOUR_THEMES.length];
}

export function msToNextHour(d = new Date()): number {
  const n = new Date(d);
  n.setMinutes(60, 0, 0);
  return n.getTime() - d.getTime();
}

export function applyTheme(t: HourTheme) {
  if (typeof document === 'undefined') return;
  const r = document.documentElement.style;
  r.setProperty('--th-acc', t.acc);
  r.setProperty('--th-acc2', t.acc2);
  r.setProperty('--th-glow', t.glow);
  r.setProperty('--th-deep', t.deep);
}
