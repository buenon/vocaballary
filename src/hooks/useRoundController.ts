import { useMemo } from "react";
import type { Round, WordItem } from "../types";

function pickRandom<T>(arr: readonly T[], excludeIndex?: number): [T, number] {
  let idx = Math.floor(Math.random() * arr.length);
  if (excludeIndex !== undefined && arr.length > 1) {
    while (idx === excludeIndex) idx = Math.floor(Math.random() * arr.length);
  }
  return [arr[idx], idx];
}

export function useRoundController(items: WordItem[]): Round | null {
  return useMemo(() => {
    if (!items || items.length < 2) return null;
    const [target, tIdx] = pickRandom(items);
    const [decoy] = pickRandom(items, tIdx);
    const correctIndex = Math.random() < 0.5 ? 0 : 1;
    const options =
      correctIndex === 0
        ? ([target, decoy] as const)
        : ([decoy, target] as const);
    return {
      target,
      options: options as any,
      correctIndex: correctIndex as 0 | 1,
    };
  }, [items]);
}
