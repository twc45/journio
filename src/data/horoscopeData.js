const HOROSCOPES = [
  "Today asks for patience — something you've been rushing may need more time than you think.",
  "A small decision today carries more weight than it seems. Trust the quiet choice over the loud one.",
  "You've been giving a lot of energy outward. Today, let some of it come back to you.",
  "Something you've been avoiding writing about is ready to be written. You'll know it when you see it.",
  "The universe isn't asking you to have it all figured out today — just to show up honestly.",
  "A pattern you've noticed in yourself lately is trying to tell you something. Listen closer.",
  "Rest isn't the opposite of progress today. It might be the whole point.",
  "You're allowed to change your mind about something. That's not inconsistency, that's growth.",
  "Someone or something from your past may resurface today. Notice what it stirs up, then let it settle.",
  "Today favours clarity over comfort. A direct conversation with yourself, on paper, will help.",
  "You don't need permission to want what you want. Today's a good day to admit it, at least to your notebook.",
  "The universe is quiet today, not distant. Sometimes silence is the message.",
  "A small act of discipline today will matter more than a big burst of motivation would have.",
  "You're closer to something than it feels like. Write down what 'closer' would actually look like.",
  "Today rewards honesty over politeness — even the kind you owe yourself.",
  "Something you've outgrown is still taking up space. Today's a good day to notice what.",
  "You're allowed to take up more room than you've been taking lately.",
  "A door you thought had closed may not have. Write down what you'd do if it opened again.",
  "Today isn't asking for a breakthrough — just one honest sentence.",
  "You've been carrying something for someone else. Consider setting it down, at least for today.",
  "The version of you a year from now is being shaped by something small you do today.",
  "Today favours listening over speaking, even in your own head.",
  "Something you've called a weakness might actually be a boundary in disguise.",
  "You're allowed to enjoy something without justifying it. Today, try that.",
  "A worry you're carrying may be louder than the actual risk. Write down the difference.",
  "Today's a good day to ask yourself what you'd do if no one was watching.",
  "You've been preparing for something without realising it. Today, notice the preparation.",
  "Something quiet in your life deserves more credit than it's getting. Name it.",
  "Today asks you to trust a feeling before you can fully explain it.",
  "You're allowed to want two things that seem to contradict each other. Write about both.",
  "A comparison you've been making with someone else isn't serving you today. Set it down.",
  "The thing you keep putting at the bottom of the list might belong nearer the top.",
  "Today's a good day for gentleness, especially toward the parts of you that are still figuring things out.",
  "Something you did recently mattered more than you gave it credit for. Write it down before you forget.",
  "You're not behind. Today's a good day to actually believe that, even briefly.",
];

function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getDailyHoroscope(signName, date = new Date()) {
  const key = `${toDateStr(date)}-${signName || "unknown"}`;
  const idx = hashString(key) % HOROSCOPES.length;
  return HOROSCOPES[idx];
}