import { useCallback, useEffect, useMemo, useState } from "react";
import type { Round, WordItem } from "../types";
import { useRoundController } from "./useRoundController";

export function useGameEngine() {
  const [items, setItems] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [roundKey, setRoundKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);
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
    fetch("/assets/data/manifest.sample.json")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setItems(Array.isArray(data) ? data : data.items || []);
      })
      .catch(() => {
        if (cancelled) return;
        setItems([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const round: Round | null = useRoundController(items, roundKey);

  const answer = useCallback(
    (index: 0 | 1) => {
      if (gameOver || !round) return;
      const isCorrect = index === round.correctIndex;
      if (isCorrect) {
        setScore((s) => s + 1);
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
    [gameOver, round]
  );

  const restart = useCallback(() => {
    setScore(0);
    setStrikes(0);
    setGameOver(false);
    setRoundKey((k) => k + 1);
  }, []);

  useMemo(() => {
    if (gameOver) {
      setHighScore((prev) => {
        const next = Math.max(prev, score);
        try {
          localStorage.setItem("vocaballary:highScore", String(next));
        } catch {}
        return next;
      });
    }
  }, [gameOver, score]);

  return {
    // state
    loading,
    round,
    score,
    strikes,
    highScore,
    gameOver,
    // actions
    answer,
    restart,
  } as const;
}
