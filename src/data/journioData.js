export const PROMPTS = [
  "What did the universe try to tell you today, and did you actually listen?",
  "Write about a small thing this week that felt like quiet magic.",
  "What are you ready to release under tonight's sky?",
  "Describe a moment today when you felt completely present.",
  "What pattern keeps showing up in your life lately? What might it be teaching you?",
  "If your intuition could speak in full sentences, what would it say right now?",
  "What does 'enough' feel like in your body today?",
  "Write a letter to the version of you who started this journal.",
  "Name one sign you've been given lately. What do you think it means?",
  "What would you write if no one, not even you, would judge it?",
  "What's something you're carrying that isn't actually yours to carry?",
  "Write about a version of your future self you'd like to become closer to.",
  "What's a fear you've outgrown, even a little?",
  "Describe today using only colours, textures, and sounds.",
  "What are you avoiding writing about right now? Start there instead.",
  "Who in your life makes you feel most like yourself?",
  "What would you do today if you fully trusted the timing of your life?",
  "Write down three things you noticed today that you'd normally walk past.",
  "What's a belief about yourself you're ready to question?",
  "If today had a title, like a chapter in a book, what would it be?",
  "What does your body need that your mind keeps overriding?",
  "Write about a risk that turned out to be worth it.",
  "What's something you know now that you wish you'd known a year ago?",
  "Describe the version of peace you're chasing right now.",
  "What conversation have you been avoiding, and why?",
  "Write about a moment of unexpected kindness — given or received.",
  "What's one thing you're proud of that no one else noticed?",
  "If your current season of life had a name, what would you call it?",
  "What are you holding onto out of habit rather than love?",
  "Write a note to the person you were five years ago.",
  "What does 'home' mean to you right now, and has that changed?",
  "What's something you keep saying yes to that you actually want to say no to?",
  "Describe a dream — sleeping or waking — that's stayed with you.",
  "What would you attempt if you knew you couldn't fail?",
  "Write about the last time you felt truly free.",
  "What does your inner voice sound like when it's kind to you?",
  "Name something you're grieving, even quietly — a person, a chapter, a version of yourself.",
  "What's one boundary you're proud of holding lately?",
  "Write about a place that feels like it holds a piece of you.",
  "What would today look like if you moved through it slower?",
  "What's something you used to believe about love that you no longer do?",
  "Describe a small ritual that grounds you, and why it works.",
  "What are you quietly hoping for, even if you haven't said it out loud?",
  "Write about a lesson your younger self would be surprised you learned.",
  "What does your gut say about a decision you've been putting off?",
  "What's a compliment you received that you never quite let yourself believe?",
  "Write about something you've forgiven — yourself or someone else.",
  "What would you do differently if you weren't worried what it looked like to others?",
  "Describe the energy you want to carry into tomorrow.",
  "What's a question you wish someone would ask you?",
];

// 1 = journalled that day, 0 = missed. Last entry is "today".
export const JOURNEY = [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1];

export function currentStreak(days) {
  let count = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i] === 1) count++;
    else break;
  }
  return count;
}

export function longestStreak(days) {
  let best = 0;
  let cur = 0;
  for (const d of days) {
    cur = d === 1 ? cur + 1 : 0;
    best = Math.max(best, cur);
  }
  return best;
}