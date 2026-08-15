import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getZodiacSign } from "../data/zodiacData";

const STORAGE_KEY = "journio_profile_v1";

export function useProfile() {
  const [profile, setProfile] = useState(null); // null = not loaded yet or no profile saved
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setProfile(JSON.parse(raw));
      } catch (e) {
        console.warn("Journio: failed to load profile", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // day/month as numbers, e.g. saveProfile("Tom", 9, 12, 1994)
  const saveProfile = useCallback(async (name, day, month, year) => {
    const sign = getZodiacSign(month, day);
    const next = { name: name.trim(), day, month, year, signName: sign.name };
    setProfile(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("Journio: failed to save profile", e);
    }
  }, []);

  return { profile, loaded, saveProfile };
}