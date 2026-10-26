import { useSyncExternalStore, useCallback } from "react";

const STORAGE_KEY = "silo_favorite_book_ids";
const LEGACY_KEY = "silo_favorite_books";

// Module-level shared store: a single source of truth so every useFavorites
// instance stays in sync regardless of how many components use the hook.
let favoriteIds = loadFromStorage();
const listeners = new Set();

function loadFromStorage() {
  try {
    // New format: array of ID strings
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.filter((id) => typeof id === "string");
      }
    }

    // Migrate legacy format (array of full book objects) to IDs
    const legacyStored = localStorage.getItem(LEGACY_KEY);
    if (legacyStored) {
      const legacyParsed = JSON.parse(legacyStored);
      if (Array.isArray(legacyParsed)) {
        const ids = legacyParsed
          .map((item) => (typeof item === "string" ? item : item?.id))
          .filter(Boolean);
        localStorage.removeItem(LEGACY_KEY);
        return ids;
      }
    }

    return [];
  } catch {
    return [];
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  } catch {
    // Ignore quota errors — in-memory store stays correct for the session
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return favoriteIds;
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Stable callbacks — toggleFavorite/removeFavorite don't depend on `ids`
  // (they operate on the module-level store), so they never change identity.
  // isFavorite changes only when `ids` changes, which is correct.
  const isFavorite = useCallback((bookId) => ids.includes(bookId), [ids]);

  const toggleFavorite = useCallback((book) => {
    if (!book?.id) return;
    if (favoriteIds.includes(book.id)) {
      favoriteIds = favoriteIds.filter((x) => x !== book.id);
    } else {
      favoriteIds = [...favoriteIds, book.id];
    }
    persist();
    emit();
  }, []);

  const removeFavorite = useCallback((bookId) => {
    favoriteIds = favoriteIds.filter((x) => x !== bookId);
    persist();
    emit();
  }, []);

  return { favoriteIds: ids, isFavorite, toggleFavorite, removeFavorite };
}