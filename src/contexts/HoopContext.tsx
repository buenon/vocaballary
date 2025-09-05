import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type HoopContextValue = {
  swooshKey: number;
  swoosh: () => void;
};

const HoopContext = createContext<HoopContextValue | null>(null);

export function HoopProvider({ children }: { children: React.ReactNode }) {
  const [swooshKey, setSwooshKey] = useState(0);
  const swoosh = useCallback(() => setSwooshKey((v) => v + 1), []);

  const value = useMemo(() => ({ swooshKey, swoosh }), [swooshKey, swoosh]);
  return <HoopContext.Provider value={value}>{children}</HoopContext.Provider>;
}

export function useHoop() {
  const ctx = useContext(HoopContext);
  if (!ctx) {
    throw new Error("useHoop must be used within a HoopProvider");
  }
  return ctx;
}
