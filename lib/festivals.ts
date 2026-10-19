// Duniya — Indian festivals, government holidays, big events & sports.
// YEARLY AUTO-CALENDAR: fixed-date festivals roll forward every year on their
// own; lunar-calendar dates come from a per-year table (marked ~ in UI).
// Government-holiday dates verified against DoPT 2026 list; 2027 = expected.

export type Festival = {
  id: string;
  name: string;      // English
  hi: string;        // Hindi
  date: string;      // YYYY-MM-DD
  approx?: boolean;  // lunar calendar — date may shift
  states: string[];  // state names, or ['ALL']
  religions?: string[];
  nationalHoliday?: boolean;
  emoji: string;
};

export const STATES = [
  'All India',
  'Andhra Pradesh', 'Assam', 'Bihar', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

/* ---------- Fixed-date festivals: happen every year, same date ---------- */
type AnnualDef = {
  id: string; name: string; hi: string; month: number; day: number;
  states: string[]; religions?: string[]; nationalHoliday?: boolean; emoji: string;
};
const ANNUAL_FIXED: AnnualDef[] = [
  { id: 'lohri', name: 'Lohri', hi: 'लोहड़ी', month: 1, day: 13, states: ['Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir'], religions: ['Sikh', 'Hindu'], emoji: '🔥' },
  { id: 'pongal', name: 'Pongal', hi: 'पोंगल', month: 1, day: 14, states: ['Tamil Nadu'], religions: ['Hindu'], emoji: '🍚' },
  { id: 'makar', name: 'Makar Sankranti', hi: 'मकर संक्रांति', month: 1, day: 14, states: ['Gujarat', 'Maharashtra', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'], religions: ['Hindu'], emoji: '🪁' },
  { id: 'maghbihu', name: 'Magh Bihu', hi: 'माघ बिहू', month: 1, day: 14, states: ['Assam'], emoji: '🎋' },
  { id: 'republic', name: 'Republic Day', hi: 'गणतंत्र दिवस', month: 1, day: 26, states: ['ALL'], nationalHoliday: true, emoji: '🇮🇳' },
  { id: 'baisakhi', name: 'Baisakhi', hi: 'बैसाखी', month: 4, day: 13, states: ['Punjab', 'Haryana'], religions: ['Sikh', 'Hindu'], emoji: '🌾' },
  { id: 'rongalibihu', name: 'Rongali Bihu', hi: 'रोंगाली बिहू', month: 4, day: 14, states: ['Assam'], emoji: '🥁' },
  { id: 'puthandu', name: 'Puthandu (Tamil New Year)', hi: 'पुथांडु', month: 4, day: 14, states: ['Tamil Nadu'], religions: ['Hindu'], emoji: '🌿' },
  { id: 'vishu', name: 'Vishu', hi: 'विशु', month: 4, day: 14, states: ['Kerala'], religions: ['Hindu'], emoji: '🌼' },
  { id: 'independence', name: 'Independence Day', hi: 'स्वतंत्रता दिवस', month: 8, day: 15, states: ['ALL'], nationalHoliday: true, emoji: '🇮🇳' },
  { id: 'gandhi', name: 'Gandhi Jayanti', hi: 'गांधी जयंती', month: 10, day: 2, states: ['ALL'], nationalHoliday: true, emoji: '🕊️' },
  { id: 'hornbill', name: 'Hornbill Festival', hi: 'हॉर्नबिल महोत्सव', month: 12, day: 1, states: ['Nagaland'], emoji: '🦅' },
  { id: 'christmas', name: 'Christmas', hi: 'क्रिसमस', month: 12, day: 25, states: ['ALL'], religions: ['Christian'], nationalHoliday: true, emoji: '🎄' },
];

/* ---------- Lunar-calendar festivals: per-year dates (approx) ---------- */
type LunarDef = {
  id: string; name: string; hi: string;
  states: string[]; religions?: string[]; nationalHoliday?: boolean; emoji: string;
  dates: Record<number, string>; // year -> 'MM-DD'
};
const LUNAR: LunarDef[] = [
  { id: 'shivratri', name: 'Maha Shivratri', hi: 'महाशिवरात्रि', states: ['ALL'], religions: ['Hindu'], emoji: '🕉️', dates: { 2026: '02-15', 2027: '03-07', 2028: '02-24' } },
  { id: 'holi', name: 'Holi', hi: 'होली', states: ['ALL'], religions: ['Hindu'], emoji: '🎨', dates: { 2026: '03-04', 2027: '03-22', 2028: '03-11' } },
  { id: 'eidfitr', name: 'Eid al-Fitr', hi: 'ईद-उल-फ़ित्र', states: ['ALL'], religions: ['Muslim'], nationalHoliday: true, emoji: '🌙', dates: { 2026: '03-20', 2027: '03-10', 2028: '02-28' } },
  { id: 'eidazha', name: 'Eid al-Adha', hi: 'ईद-उल-अज़हा', states: ['ALL'], religions: ['Muslim'], emoji: '🕌', dates: { 2026: '05-27', 2027: '05-17', 2028: '05-05' } },
  { id: 'rathyatra', name: 'Rath Yatra', hi: 'रथ यात्रा', states: ['Odisha'], religions: ['Hindu'], emoji: '🛞', dates: { 2026: '06-27', 2027: '07-06', 2028: '06-24' } },
  { id: 'hemis', name: 'Hemis Festival', hi: 'हेमिस महोत्सव', states: ['Ladakh'], religions: ['Buddhist'], emoji: '🎭', dates: { 2026: '07-05', 2027: '07-05', 2028: '07-03' } },
  { id: 'rakhi', name: 'Raksha Bandhan', hi: 'रक्षाबंधन', states: ['ALL'], religions: ['Hindu'], emoji: '🧵', dates: { 2026: '08-28', 2027: '08-21', 2028: '08-09' } },
  { id: 'onam', name: 'Onam', hi: 'ओणम', states: ['Kerala'], religions: ['Hindu'], emoji: '🌸', dates: { 2026: '08-26', 2027: '08-27', 2028: '08-16' } },
  { id: 'janmashtami', name: 'Janmashtami', hi: 'जन्माष्टमी', states: ['ALL'], religions: ['Hindu'], emoji: '🦚', dates: { 2026: '09-04', 2027: '09-03', 2028: '08-23' } },
  { id: 'ganesh', name: 'Ganesh Chaturthi', hi: 'गणेश चतुर्थी', states: ['Maharashtra', 'Goa', 'Karnataka', 'Telangana', 'Andhra Pradesh'], religions: ['Hindu'], emoji: '🐘', dates: { 2026: '09-14', 2027: '09-16', 2028: '09-05' } },
  { id: 'navratri', name: 'Navratri / Durga Puja', hi: 'नवरात्रि / दुर्गा पूजा', states: ['Gujarat', 'West Bengal', 'Assam', 'Maharashtra'], religions: ['Hindu'], emoji: '💃', dates: { 2026: '10-09', 2027: '10-06', 2028: '09-25' } },
  { id: 'dussehra', name: 'Dussehra', hi: 'दशहरा', states: ['ALL'], religions: ['Hindu'], nationalHoliday: true, emoji: '🏹', dates: { 2026: '10-20', 2027: '10-16', 2028: '10-05' } },
  { id: 'kullu', name: 'Kullu Dussehra', hi: 'कुल्लू दशहरा', states: ['Himachal Pradesh'], religions: ['Hindu'], emoji: '🏔️', dates: { 2026: '10-20', 2027: '10-16', 2028: '10-05' } },
  { id: 'diwali', name: 'Diwali', hi: 'दीवाली', states: ['ALL'], religions: ['Hindu', 'Sikh', 'Jain'], nationalHoliday: true, emoji: '🪔', dates: { 2026: '11-08', 2027: '10-28', 2028: '10-17' } },
  { id: 'bhaidooj', name: 'Bhai Dooj', hi: 'भाई दूज', states: ['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Haryana'], religions: ['Hindu'], emoji: '👫', dates: { 2026: '11-10', 2027: '10-30', 2028: '10-19' } },
  { id: 'chhath', name: 'Chhath Puja', hi: 'छठ पूजा', states: ['Bihar', 'Uttar Pradesh', 'Jharkhand'], religions: ['Hindu'], emoji: '🌅', dates: { 2026: '11-17', 2027: '11-04', 2028: '10-24' } },
  { id: 'pushkar', name: 'Pushkar Fair', hi: 'पुष्कर मेला', states: ['Rajasthan'], emoji: '🐪', dates: { 2026: '11-17', 2027: '11-12', 2028: '11-01' } },
  { id: 'gurpurab', name: 'Guru Nanak Gurpurab', hi: 'गुरु नानक गुरपुरब', states: ['Punjab', 'Haryana'], religions: ['Sikh'], nationalHoliday: true, emoji: '🙏', dates: { 2026: '11-24', 2027: '11-13', 2028: '11-02' } },
  { id: 'losar', name: 'Losar (Tibetan New Year)', hi: 'लोसर', states: ['Ladakh', 'Sikkim'], religions: ['Buddhist'], emoji: '🏔️', dates: { 2026: '02-18', 2027: '02-18', 2028: '02-07' } },
];

const pad = (n: number) => String(n).padStart(2, '0');

/** All festivals for a calendar year (fixed roll forward + lunar table). */
export function festivalsForYear(y: number): Festival[] {
  const out: Festival[] = ANNUAL_FIXED.map((f) => ({
    id: `${f.id}-${y}`, name: f.name, hi: f.hi,
    date: `${y}-${pad(f.month)}-${pad(f.day)}`,
    states: f.states, religions: f.religions,
    nationalHoliday: f.nationalHoliday, emoji: f.emoji,
  }));
  for (const l of LUNAR) {
    const md = l.dates[y];
    if (!md) continue;
    out.push({
      id: `${l.id}-${y}`, name: l.name, hi: l.hi, date: `${y}-${md}`,
      approx: true, states: l.states, religions: l.religions,
      nationalHoliday: l.nationalHoliday, emoji: l.emoji,
    });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/** This year + next year — the live calendar (never goes stale). */
export function allFestivals(from: Date = new Date()): Festival[] {
  const y = from.getFullYear();
  return [...festivalsForYear(y), ...festivalsForYear(y + 1)];
}

/** Back-compat export (used for counts). */
export const FESTIVALS: Festival[] = allFestivals();

const todayStr = (d: Date = new Date()) => d.toISOString().slice(0, 10);

/** Festivals on/after today, within `days`, sorted by date. */
export function upcomingFestivals(days: number, from: Date = new Date()): Festival[] {
  const t = todayStr(from);
  const end = todayStr(new Date(from.getTime() + days * 86400000));
  return allFestivals(from)
    .filter((f) => f.date >= t && f.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** All festivals for a state ('All India' = everything). */
export function festivalsByState(state: string, from: Date = new Date()): Festival[] {
  const all = allFestivals(from);
  if (state === 'All India') return all;
  return all.filter((f) => f.states.includes('ALL') || f.states.includes(state));
}

/** National holiday tomorrow? (for the "kal chhutti hai" banner) */
export function holidayTomorrow(from: Date = new Date()): Festival | null {
  const t = todayStr(new Date(from.getTime() + 86400000));
  return allFestivals(from).find((f) => f.date === t && f.nationalHoliday) ?? null;
}

/** Pretty date: 2026-10-20 -> 20 Oct 2026 */
export function prettyDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

/* ---------- Sports seasons (annual, recurring — months are stable) ---------- */
export type SportEvent = {
  name: string; hi: string; months: string; level: string; emoji: string;
};
export const SPORTS: SportEvent[] = [
  { name: 'IPL (Cricket)', hi: 'आईपीएल (क्रिकेट)', months: 'Mar – May', level: 'National', emoji: '🏏' },
  { name: 'Ranji Trophy (Cricket)', hi: 'रणजी ट्रॉफी (क्रिकेट)', months: 'Oct – Mar', level: 'State-wise', emoji: '🏏' },
  { name: 'ISL (Football)', hi: 'आईएसएल (फुटबॉल)', months: 'Sep – Mar', level: 'National', emoji: '⚽' },
  { name: 'Pro Kabaddi', hi: 'प्रो कबड्डी', months: 'Oct – Dec', level: 'National', emoji: '🤼' },
  { name: 'Hockey India League', hi: 'हॉकी इंडिया लीग', months: 'Dec – Mar', level: 'National', emoji: '🏑' },
  { name: 'National Games', hi: 'राष्ट्रीय खेल', months: 'Rotational', level: 'State-wise', emoji: '🏅' },
];

/* ---------- Big events: concerts, fairs, stadium shows (verified) ---------- */
export type BigEvent = {
  name: string; venue: string; date: string; dateEnd?: string;
  approx?: boolean; emoji: string; kind: string;
};
export const BIG_EVENTS: BigEvent[] = [
  // Verified Oct 2026 (web, Oct 2026)
  { name: 'Dharamshala Intl Film Festival', venue: 'Dharamshala, HP', date: '2026-10-29', dateEnd: '2026-11-01', emoji: '🎬', kind: 'Film' },
  { name: "Guns N' Roses live", venue: 'Bengaluru', date: '2026-11-14', emoji: '🎸', kind: 'Rock concert' },
  { name: "Guns N' Roses live", venue: 'Guwahati', date: '2026-11-17', emoji: '🎸', kind: 'Rock concert' },
  { name: 'Pushkar Camel Fair', venue: 'Pushkar, Rajasthan', date: '2026-11-17', dateEnd: '2026-11-24', emoji: '🐪', kind: 'Fair' },
  { name: 'IFFI Goa', venue: 'Panaji, Goa', date: '2026-11-20', dateEnd: '2026-11-28', emoji: '🎥', kind: 'Film' },
  { name: 'Fred again.. live', venue: 'Delhi NCR', date: '2026-12-05', emoji: '🎧', kind: 'Concert' },
  { name: 'Fred again.. live', venue: 'Mumbai', date: '2026-12-09', emoji: '🎧', kind: 'Concert' },
  { name: 'Fred again.. live', venue: 'Bengaluru', date: '2026-12-13', emoji: '🎧', kind: 'Concert' },
  { name: 'Sunburn Festival', venue: 'Goa', date: '2026-12-18', dateEnd: '2026-12-21', approx: true, emoji: '🎶', kind: 'EDM festival' },
  { name: 'Comic Con India', venue: 'Kolkata', date: '2026-12-20', dateEnd: '2026-12-21', emoji: '🦸', kind: 'Pop culture' },
  { name: 'Jaipur Literature Festival', venue: 'Jaipur', date: '2027-01-14', dateEnd: '2027-01-18', emoji: '📚', kind: 'Literature' },
  { name: 'International Kite Festival', venue: 'Ahmedabad', date: '2027-01-14', dateEnd: '2027-01-16', emoji: '🪁', kind: 'Festival' },
  // Annual recurring (month-level, every year)
  { name: 'Sunburn Festival', venue: 'Goa', date: '', approx: true, emoji: '🎶', kind: 'EDM · every Dec' },
  { name: 'NH7 Weekender', venue: 'Multi-city', date: '', approx: true, emoji: '🎤', kind: 'Music · Oct–Dec' },
  { name: 'Comic Con India', venue: 'Multi-city', date: '', approx: true, emoji: '🦸', kind: 'Pop culture · Dec' },
];

/** Big events with a date in the next `days` (dated ones only). */
export function upcomingBigEvents(days: number, from: Date = new Date()): BigEvent[] {
  const t = todayStr(from);
  const end = todayStr(new Date(from.getTime() + days * 86400000));
  return BIG_EVENTS.filter((e) => e.date && e.date >= t && e.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date));
}
