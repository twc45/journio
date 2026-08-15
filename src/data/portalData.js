import { ZODIAC_SIGNS } from "./zodiacData";
import { getMoonPhase } from "../utils/moonPhase";

// Fixed numerology / calendar portal days.
export const PORTAL_DAYS = [
  { month: 1, day: 1, name: "New Year Portal", fact: "The turn of the calendar year is widely treated as a natural reset point — a day for clearing old energy and setting fresh intentions.", ritual: "Write down what you're ready to leave behind, and what you're ready to begin." },
  { month: 2, day: 2, name: "2:2 Portal", fact: "Repeating-number dates like 2/2 are believed by many to amplify the meaning of that number — 2 is tied to balance and partnership.", ritual: "Reflect on one relationship, in your life or with yourself, that needs more balance." },
  { month: 3, day: 3, name: "3:3 Portal", fact: "3 is often linked to creativity and self-expression in numerology.", ritual: "Write freely for five minutes about something you've been wanting to create." },
  { month: 3, day: 20, name: "Spring Equinox", fact: "Day and night fall into near-perfect balance today, as the sun crosses the celestial equator heading north.", ritual: "Note one thing in your life that feels ready to grow." },
  { month: 4, day: 4, name: "4:4 Portal", fact: "4 is associated with foundations and stability — the groundwork beneath everything else.", ritual: "Write about one foundation in your life you're grateful for." },
  { month: 5, day: 5, name: "5:5 Portal", fact: "5 is tied to change and momentum in numerology — a number associated with things being set into motion.", ritual: "Name one change you've been putting off starting." },
  { month: 6, day: 6, name: "6:6 Portal", fact: "6 is often linked to home, harmony, and care for others.", ritual: "Write about someone you want to show up better for." },
  { month: 6, day: 21, name: "Summer Solstice", fact: "The longest day of the year in the Northern Hemisphere — the sun reaches its highest point in the sky.", ritual: "Write down what's currently at its peak in your life." },
  { month: 7, day: 7, name: "7:7 Portal", fact: "7 is widely considered a number of introspection, spirituality, and inner knowing.", ritual: "Ask yourself one honest question and write the first answer that comes." },
  {
    month: 8,
    day: 8,
    name: "Lion's Gate Portal",
    fact: "Peaking each year on August 8th, the Lion's Gate is marked by the sun in Leo aligning with Sirius, the brightest star in the night sky — a date many spiritual traditions treat as especially potent for manifestation.",
    ritual: "Write down 8 desires you're ready to receive from the universe.",
  },
  { month: 9, day: 9, name: "9:9 Portal", fact: "9 is the last single-digit number, often read as a symbol of completion before a new cycle begins.", ritual: "Write about a chapter in your life that feels ready to close." },
  { month: 9, day: 22, name: "Autumn Equinox", fact: "Day and night balance again as the sun crosses the celestial equator heading south.", ritual: "Note one thing you're ready to release, the way trees release their leaves." },
  { month: 10, day: 10, name: "10:10 Portal", fact: "10 is often read as a number of new beginnings, built on everything that came before it.", ritual: "Write about a fresh start you're quietly working toward." },
  { month: 11, day: 11, name: "11:11 Portal", fact: "Perhaps the most widely recognised 'angel number' — many treat 11:11 sightings as a nudge to pay closer attention to their thoughts in that moment.", ritual: "Write down exactly what you were thinking about right before you opened this." },
  { month: 12, day: 12, name: "12:12 Portal", fact: "12 is tied to cycles reaching completion — 12 months, 12 hours on a clock face.", ritual: "Write about how far you've come this year." },
  { month: 8, day: 10, name: "Winter Solstice", fact: "The shortest day of the year in the Northern Hemisphere — from here, the light begins to return.", ritual: "Write down one small light you're looking forward to." },
];

// Zodiac season changes — built from the same sign data used in the Astrology tab.
// Skips any date that's already covered by a fixed portal day above (e.g. Cancer starts
// the same day as the Summer Solstice), so only one card ever shows per day.
const fixedKeys = new Set(PORTAL_DAYS.map((p) => `${p.month}-${p.day}`));
const SEASON_STARTS = ZODIAC_SIGNS.filter((sign) => !fixedKeys.has(`${sign.start[0]}-${sign.start[1]}`)).map(
  (sign) => ({
    month: sign.start[0],
    day: sign.start[1],
    name: `${sign.name} Season Begins`,
    fact: `The sun moves into ${sign.name} today, opening three weeks of ${sign.element.toLowerCase()} energy. ${sign.facts[0]}`,
    ritual: `Write about what you'd like to invite into your life this ${sign.name} season.`,
  })
);

const ALL_FIXED_DAYS = [...PORTAL_DAYS, ...SEASON_STARTS];

// Traditional folk names for each month's full moon.
const MOON_NAMES = [
  "Wolf Moon", "Snow Moon", "Worm Moon", "Pink Moon", "Flower Moon", "Strawberry Moon",
  "Buck Moon", "Sturgeon Moon", "Harvest Moon", "Hunter's Moon", "Beaver Moon", "Cold Moon",
];

export function getTodayPortal(date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const fixed = ALL_FIXED_DAYS.find((p) => p.month === month && p.day === day);
  if (fixed) return fixed;

  // No fixed date today — fall back to whatever the moon's actually doing,
  // which naturally brings up a card roughly every couple of weeks.
  const moon = getMoonPhase(date);
  if (moon.name === "Full Moon") {
    const moonName = MOON_NAMES[date.getMonth()];
    return {
      name: `${moonName} · Full Moon`,
      fact: `Tonight's full moon is traditionally called the ${moonName}, one of the year's twelve named full moons.`,
      ritual: "Write down what feels ready to come to completion, or what you're releasing under tonight's full light.",
    };
  }
  if (moon.name === "New Moon") {
    return {
      name: "New Moon",
      fact: "The sky is at its darkest tonight — the Moon sits between Earth and the Sun, invisible from here. Many treat new moons as the natural start of a fresh cycle.",
      ritual: "Write down one intention you're planting for the weeks ahead.",
    };
  }

  return null;
}