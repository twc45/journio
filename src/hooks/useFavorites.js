import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "journio_favorites_v1";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setFavorites(JSON.parse(raw));
      } catch (e) {
        console.warn("Journio: failed to load favorites", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = (next) => {
    setFavorites(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((e) =>
      console.warn("Journio: failed to save favorites", e)
    );
  };

  const isFavorited = useCallback(
    (text) => favorites.some((f) => f.text === text),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (text) => {
      const existing = favorites.find((f) => f.text === text);
      if (existing) {
        persist(favorites.filter((f) => f.id !== existing.id));
      } else {
        const entry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          text,
          savedAt: new Date().toISOString(),
        };
        persist([entry, ...favorites]);
      }
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    (id) => {
      persist(favorites.filter((f) => f.id !== id));
    },
    [favorites]
  );

  return { favorites, loaded, isFavorited, toggleFavorite, removeFavorite };
}