const SYNODIC_MONTH = 29.530588853; // average days in a full lunar cycle
const KNOWN_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0); // a confirmed new moon reference point

const PHASES = [
  { name: "New Moon", emoji: "🌑", maxAge: 1.84566 },
  { name: "Waxing Crescent", emoji: "🌒", maxAge: 5.53699 },
  { name: "First Quarter", emoji: "🌓", maxAge: 9.22831 },
  { name: "Waxing Gibbous", emoji: "🌔", maxAge: 12.91963 },
  { name: "Full Moon", emoji: "🌕", maxAge: 16.61096 },
  { name: "Waning Gibbous", emoji: "🌖", maxAge: 20.30228 },
  { name: "Last Quarter", emoji: "🌗", maxAge: 23.99361 },
  { name: "Waning Crescent", emoji: "🌘", maxAge: 27.68493 },
];

function getMoonAge(date) {
  const diffDays = (date.getTime() - KNOWN_NEW_MOON_UTC) / 86400000;
  let age = diffDays % SYNODIC_MONTH;
  if (age < 0) age += SYNODIC_MONTH;
  return age;
}

export function getMoonPhase(date = new Date()) {
  const age = getMoonAge(date);
  const illumination = ((1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) / 2) * 100;

  let phase = PHASES.find((p) => age <= p.maxAge);
  if (!phase) phase = PHASES[0]; // wraps back to New Moon

  const fullMoonAge = SYNODIC_MONTH / 2;
  let daysUntilFull = (fullMoonAge - age + SYNODIC_MONTH) % SYNODIC_MONTH;
  if (daysUntilFull < 0.05) daysUntilFull = SYNODIC_MONTH; // just had one, next is a full cycle away

  let daysUntilNew = (SYNODIC_MONTH - age) % SYNODIC_MONTH;
  if (daysUntilNew < 0.05) daysUntilNew = SYNODIC_MONTH;

  const nextFullMoon = new Date(date.getTime() + daysUntilFull * 86400000);
  const nextNewMoon = new Date(date.getTime() + daysUntilNew * 86400000);

  return {
    ageDays: Math.round(age * 10) / 10,
    illumination: Math.round(illumination),
    name: phase.name,
    emoji: phase.emoji,
    nextFullMoon,
    nextNewMoon,
  };
}