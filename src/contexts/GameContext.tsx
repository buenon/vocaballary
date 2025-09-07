import { createContext, useContext } from "react";
import type { Round } from "../types";

export type GameContextValue = {
  loading: boolean;
  round: Round | null;
  roundSeed: number;
  score: number;
  strikes: number;
  highScore: number;
  gameOver: boolean;
  answer: (index: 0 | 1) => void;
  restart: () => void;
};

export const GameContext = createContext<GameContextValue | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
