import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "journio_history_v1";

function toDateStr(date) {
  // Local calendar date as YYYY-MM-DD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function computeStreak(history) {
  const today = new Date();
  const todayStr = toDateStr(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toDateStr(yesterday);

  let anchor = null;
  if (history[todayStr]) anchor = today;
  else if (history[yesterdayStr]) anchor = yesterday;
  else return 0;

  let streak = 0;
  let cursor = new Date(anchor);
  while (history[toDateStr(cursor)]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function computeLongest(history) {
  const dates = Object.keys(history).sort();
  let longest = 0;
  let run = 0;
  let prev = null;
  for (const d of dates) {
    if (prev) {
      const diffDays = Math.round((new Date(d) - new Date(prev)) / 86400000);
      run = diffDays === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = d;
  }
  return longest;
}

function lastNDays(history, n) {
  const days = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(history[toDateStr(d)] ? 1 : 0);
  }
  return days;
}

export function useJournio() {
  const [history, setHistory] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setHistory(JSON.parse(raw));
      } catch (e) {
        console.warn("Journio: failed to load history", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Call this when the user completes today's ritual (reveals a prompt).
  // Safe to call more than once a day — only the first call each day counts.
  const recordToday = useCallback(() => {
    const todayStr = toDateStr(new Date());
    setHistory((prev) => {
      if (prev[todayStr]) return prev;
      const next = { ...prev, [todayStr]: true };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((e) =>
        console.warn("Journio: failed to save history", e)
      );
      return next;
    });
  }, []);

  return {
    loaded,
    streak: computeStreak(history),
    longest: computeLongest(history),
    totalEntries: Object.keys(history).length,
    last21Days: lastNDays(history, 21),
    recordToday,
  };
}