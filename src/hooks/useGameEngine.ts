import { useCallback, useEffect, useMemo, useState } from "react";
import { GAME_CATEGORIES } from "../config/analytics";
import type { Round, WordItem, WordsDB } from "../types";
import { useAnalytics } from "./useAnalytics";
import { useRoundController } from "./useRoundController";

export function useGameEngine() {
  const [items, setItems] = useState<WordsDB>({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [roundKey, setRoundKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [roundCat, setRoundCat] = useState("");
  const [gameStartTime, setGameStartTime] = useState<number>(0);

  // Analytics
  const {
    trackGameStart,
    trackScore,
    trackGameOver,
    trackHighScore,
    trackRoundComplete,
  } = useAnalytics();
  const [highScore, setHighScore] = useState(() => {
    try {
      const v = localStorage.getItem("vocaballary:highScore");
      return v ? parseInt(v, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/vocaballary/assets/manifest.json")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const rawItems = Array.isArray(data.words) ? data.words : [];
        const normalized: WordsDB = rawItems.reduce(
          (acc: WordsDB, it: string) => {
            const parts = it.split("/");
            const word = parts[1].split(".")[0].replaceAll("_", " ");
            const cat = parts[0];
            const item: WordItem = {
              word: word,
              cat: cat,
              path: `/vocaballary/assets/words/${it}`,
            };
            acc[cat] = [...(acc[cat] || []), item];
            return acc;
          },
          {}
        );
        setItems(normalized);
      })
      .catch(() => {
        if (cancelled) return;
        setItems({});
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const keys = Object.keys(items);
    const randomIndex = Math.floor(Math.random() * keys.length);
    setRoundCat(keys[randomIndex]);
  }, [items, roundKey]);

  const round: Round | null = useRoundController(items[roundCat], roundKey);

  const answer = useCallback(
    (index: 0 | 1) => {
      if (gameOver || !round) return;
      const isCorrect = index === round.correctIndex;
      const newScore = isCorrect ? score + 1 : score;

      // Track the answer attempt
      trackScore(newScore, roundKey + 1, isCorrect);

      // Track round completion with word details
      trackRoundComplete(
        roundKey + 1,
        roundCat,
        round.target.word,
        round.options[index].word
      );

      if (isCorrect) {
        setScore(newScore);
        setRoundKey((k) => k + 1);
      } else {
        setStrikes((st) => {
          const next = st + 1;
          if (next >= 3) {
            setGameOver(true);
          } else {
            setRoundKey((k) => k + 1);
          }
          return next;
        });
      }
    },
    [gameOver, round, score, roundKey, roundCat, trackScore, trackRoundComplete]
  );

  const restart = useCallback(() => {
    setScore(0);
    setStrikes(0);
    setGameOver(false);
    setRoundKey((k) => k + 1);
    setGameStartTime(Date.now());

    // Track new game start
    trackGameStart(GAME_CATEGORIES.VOCABALLARY);
  }, [trackGameStart]);

  useMemo(() => {
    if (gameOver) {
      // Track game over with duration
      const gameDuration = gameStartTime > 0 ? Date.now() - gameStartTime : 0;
      trackGameOver(score, highScore, strikes, gameDuration);

      setHighScore((prev) => {
        const next = Math.max(prev, score);
        try {
          localStorage.setItem("vocaballary:highScore", String(next));
        } catch {
          // ignore storage write failures (e.g., private mode permissions)
          void 0;
        }

        // Track new high score if achieved
        if (next > prev) {
          trackHighScore(next);
        }

        return next;
      });
    }
  }, [
    gameOver,
    score,
    highScore,
    strikes,
    gameStartTime,
    trackGameOver,
    trackHighScore,
  ]);

  return {
    // state
    loading,
    round,
    roundSeed: roundKey,
    score,
    strikes,
    highScore,
    gameOver,
    // actions
    answer,
    restart,
  } as const;
}
