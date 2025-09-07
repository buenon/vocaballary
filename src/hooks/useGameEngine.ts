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
    fetch("/assets/manifest.json")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const rawItems = Array.isArray(data) ? data : data.items || [];
        // Normalize to WordItem shape { word, cat, path, code }
        type RawItem = {
          word: string;
          cat?: string;
          path: string;
          code?: string;
          aliases?: string[];
        };
        const isFullItem = (v: unknown): v is RawItem => {
          if (!v || typeof v !== "object") return false;
          const o = v as Record<string, unknown>;
          return typeof o.word === "string" && typeof o.path === "string";
        };
        const normalized: WordItem[] = (rawItems as unknown[])
          .map((it) => {
            if (!isFullItem(it)) return null;
            const absPath = it.path.startsWith("/")
              ? it.path
              : `/assets/svg/${it.path}`;
            return {
              word: it.word,
              cat: (it.cat || "").toLowerCase(),
              path: absPath,
              code: it.code,
              aliases: Array.isArray(it.aliases) ? it.aliases : undefined,
            } as WordItem;
          })
          .filter((x): x is WordItem => x !== null);
        setItems(normalized);
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
        } catch {
          // ignore storage write failures (e.g., private mode permissions)
          void 0;
        }
        return next;
      });
    }
  }, [gameOver, score]);

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
