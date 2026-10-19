// Duniya AI / The World AI — region-aware worlds.
// Every user picks "my world" once; festivals, sports, religions and the AI
// greeting adapt to it. India keeps the full festivals.ts calendar;
// other worlds carry their own major festivals + sports (seed data, approx
// where lunar). Expandable — add a world = add its festivals/sports.

export type WorldFestival = {
  name: string; hi: string; date: string; approx?: boolean; emoji: string;
};
export type WorldSport = { name: string; months: string; emoji: string };
export type World = {
  id: string;
  name: string;   // English
  hi: string;     // Hindi
  flag: string;
  religions: string[];
  festivals: WorldFestival[];
  sports: WorldSport[];
  aiGreeting: string;
  aiGreetingHi: string;
};

export const WORLDS: World[] = [
  {
    id: 'india', name: 'India', hi: 'भारत', flag: '🇮🇳',
    religions: ['Hinduism', 'Islam', 'Sikhism', 'Christianity', 'Buddhism', 'Jainism'],
    festivals: [], // full calendar lives in lib/festivals.ts
    sports: [],    // full list lives in lib/festivals.ts (SPORTS)
    aiGreeting: 'Namaste! I am Duniya AI — friend of the whole world. Ask me anything!',
    aiGreetingHi: 'नमस्ते! मैं दुनिया AI हूँ — पूरी दुनिया का दोस्त। कुछ भी पूछो!',
  },
  {
    id: 'china', name: 'China', hi: 'चीन', flag: '🇨🇳',
    religions: ['Buddhism', 'Taoism', 'Chinese folk religion'],
    festivals: [
      { name: 'Chinese New Year', hi: 'चीनी नववर्ष', date: '2027-02-06', approx: true, emoji: '🧧' },
      { name: 'Dragon Boat Festival', hi: 'ड्रैगन बोट महोत्सव', date: '2027-06-09', approx: true, emoji: '🐉' },
      { name: 'Mid-Autumn Festival', hi: 'मध्य शरद महोत्सव', date: '2027-09-15', approx: true, emoji: '🏮' },
      { name: 'National Day', hi: 'राष्ट्रीय दिवस', date: '2026-10-01', emoji: '🇨🇳' },
    ],
    sports: [
      { name: 'Table Tennis (China Open)', months: 'Sep – Oct', emoji: '🏓' },
      { name: 'Badminton (China Open)', months: 'Sep', emoji: '🏸' },
      { name: 'CBA Basketball', months: 'Oct – Apr', emoji: '🏀' },
      { name: 'Chinese Super League', months: 'Mar – Nov', emoji: '⚽' },
    ],
    aiGreeting: 'Ni hao! I am Duniya AI — tell me about China and I will tell you about the world.',
    aiGreetingHi: 'नी हाओ! मैं दुनिया AI हूँ — चीन के बारे में बताओ, दुनिया के बारे में जानो।',
  },
  {
    id: 'europe', name: 'Europe', hi: 'यूरोप', flag: '🇪🇺',
    religions: ['Christianity'],
    festivals: [
      { name: 'Christmas', hi: 'क्रिसमस', date: '2026-12-25', emoji: '🎄' },
      { name: 'Easter', hi: 'ईस्टर', date: '2027-03-28', approx: true, emoji: '🐣' },
      { name: 'Oktoberfest', hi: 'ऑक्टोबरफेस्ट', date: '2027-09-18', approx: true, emoji: '🍺' },
      { name: "New Year's Day", hi: 'नववर्ष', date: '2027-01-01', emoji: '🎆' },
    ],
    sports: [
      { name: 'UEFA Champions League', months: 'Sep – May', emoji: '⚽' },
      { name: 'La Liga (Spain)', months: 'Aug – May', emoji: '⚽' },
      { name: 'Bundesliga (Germany)', months: 'Aug – May', emoji: '⚽' },
      { name: 'Tour de France', months: 'July', emoji: '🚴' },
    ],
    aiGreeting: 'Hello! I am Duniya AI — Europe to the world, ask me anything!',
    aiGreetingHi: 'हैलो! मैं दुनिया AI हूँ — यूरोप से पूरी दुनिया तक, कुछ भी पूछो!',
  },
  {
    id: 'uk', name: 'England / UK', hi: 'इंग्लैंड', flag: '🇬🇧',
    religions: ['Christianity'],
    festivals: [
      { name: 'Christmas', hi: 'क्रिसमस', date: '2026-12-25', emoji: '🎄' },
      { name: 'Easter', hi: 'ईस्टर', date: '2027-03-28', approx: true, emoji: '🐣' },
      { name: 'Guy Fawkes Night', hi: 'गाय फॉक्स नाइट', date: '2026-11-05', emoji: '🎆' },
      { name: 'Notting Hill Carnival', hi: 'नॉटिंग हिल कार्निवल', date: '2027-08-30', approx: true, emoji: '🎭' },
    ],
    sports: [
      { name: 'Premier League', months: 'Aug – May', emoji: '⚽' },
      { name: 'Wimbledon (Tennis)', months: 'Jun – Jul', emoji: '🎾' },
      { name: 'The Ashes (Cricket)', months: 'Rotational', emoji: '🏏' },
      { name: 'Six Nations (Rugby)', months: 'Feb – Mar', emoji: '🏉' },
    ],
    aiGreeting: 'Hello! I am Duniya AI — from England to the whole world!',
    aiGreetingHi: 'हैलो! मैं दुनिया AI हूँ — इंग्लैंड से पूरी दुनिया तक!',
  },
  {
    id: 'usa', name: 'USA', hi: 'अमेरिका', flag: '🇺🇸',
    religions: ['Christianity'],
    festivals: [
      { name: 'Thanksgiving', hi: 'थैंक्सगिविंग', date: '2026-11-26', emoji: '🦃' },
      { name: 'Independence Day', hi: 'स्वतंत्रता दिवस', date: '2027-07-04', emoji: '🇺🇸' },
      { name: 'Super Bowl', hi: 'सुपर बाउल', date: '2027-02-14', approx: true, emoji: '🏈' },
      { name: 'Christmas', hi: 'क्रिसमस', date: '2026-12-25', emoji: '🎄' },
    ],
    sports: [
      { name: 'NFL (American Football)', months: 'Sep – Feb', emoji: '🏈' },
      { name: 'NBA (Basketball)', months: 'Oct – Jun', emoji: '🏀' },
      { name: 'MLB (Baseball)', months: 'Mar – Oct', emoji: '⚾' },
      { name: 'MLS (Soccer)', months: 'Feb – Dec', emoji: '⚽' },
    ],
    aiGreeting: 'Hey! I am Duniya AI — connecting America with the whole world!',
    aiGreetingHi: 'हे! मैं दुनिया AI हूँ — अमेरिका को पूरी दुनिया से जोड़ता हूँ!',
  },
  {
    id: 'middle-east', name: 'Middle East', hi: 'मध्य पूर्व', flag: '🕌',
    religions: ['Islam'],
    festivals: [
      { name: 'Ramadan begins', hi: 'रमज़ान', date: '2027-02-08', approx: true, emoji: '🌙' },
      { name: 'Eid al-Fitr', hi: 'ईद-उल-फ़ित्र', date: '2027-03-10', approx: true, emoji: '🌙' },
      { name: 'Eid al-Adha', hi: 'ईद-उल-अज़हा', date: '2027-05-17', approx: true, emoji: '🕌' },
      { name: 'National Day (UAE)', hi: 'राष्ट्रीय दिवस', date: '2026-12-02', emoji: '🇦🇪' },
    ],
    sports: [
      { name: 'Saudi Pro League', months: 'Aug – May', emoji: '⚽' },
      { name: 'AFC Champions League', months: 'Sep – May', emoji: '⚽' },
      { name: 'Dubai Tennis', months: 'Feb', emoji: '🎾' },
      { name: 'Qatar Grand Prix (F1)', months: 'Nov', emoji: '🏎️' },
    ],
    aiGreeting: 'Salam! I am Duniya AI — from the Middle East to the whole world!',
    aiGreetingHi: 'सलाम! मैं दुनिया AI हूँ — मध्य पूर्व से पूरी दुनिया तक!',
  },
  {
    id: 'se-asia', name: 'Southeast Asia', hi: 'दक्षिण-पूर्व एशिया', flag: '🌏',
    religions: ['Buddhism', 'Islam', 'Christianity'],
    festivals: [
      { name: 'Songkran (Thailand)', hi: 'सोंगक्रान', date: '2027-04-13', emoji: '💦' },
      { name: 'Tet (Vietnam)', hi: 'टेट', date: '2027-02-06', approx: true, emoji: '🧧' },
      { name: 'Vesak Day', hi: 'वेसाक', date: '2027-05-20', approx: true, emoji: '🪷' },
      { name: 'Independence Day (Indonesia)', hi: 'स्वतंत्रता दिवस', date: '2027-08-17', emoji: '🇮🇩' },
    ],
    sports: [
      { name: 'AFF Championship', months: 'Dec – Jan', emoji: '⚽' },
      { name: 'SEA Games', months: 'Rotational', emoji: '🏅' },
      { name: 'Thai League 1', months: 'Aug – May', emoji: '⚽' },
      { name: 'Sepak Takraw', months: 'Year-round', emoji: '🤾' },
    ],
    aiGreeting: 'Sawadee! I am Duniya AI — Southeast Asia meets the whole world!',
    aiGreetingHi: 'सावाडी! मैं दुनिया AI हूँ — दक्षिण-पूर्व एशिया से पूरी दुनिया तक!',
  },
];

export function getWorld(id: string): World {
  return WORLDS.find((w) => w.id === id) ?? WORLDS[0];
}

/** Upcoming festivals for a non-India world (date-filtered). */
export function upcomingWorldFestivals(world: World, days: number, from: Date = new Date()): WorldFestival[] {
  const t = from.toISOString().slice(0, 10);
  const end = new Date(from.getTime() + days * 86400000).toISOString().slice(0, 10);
  return world.festivals
    .filter((f) => f.date >= t && f.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date));
}
