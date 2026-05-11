import { useState, useCallback } from 'react';

const STORAGE_KEY = 'quiz_leaderboard';
const MAX_ENTRIES = 20;

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

/**
 * localStorage 기반 리더보드 훅
 * @returns {{ board: Array, saveEntry: Function, clearBoard: Function }}
 */
export function useLeaderboard() {
  const [board, setBoard] = useState(load);

  const saveEntry = useCallback(({ nick, score, correct, total, category }) => {
    setBoard((prev) => {
      const updated = [
        ...prev,
        { nick, score, correct, total, category, date: new Date().toISOString() },
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearBoard = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setBoard([]);
  }, []);

  return { board, saveEntry, clearBoard };
}
