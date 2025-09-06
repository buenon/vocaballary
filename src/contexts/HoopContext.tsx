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
  rimCenter: { x: number; y: number } | null;
  setRimCenter: (pt: { x: number; y: number } | null) => void;
  rimWidth: number | null;
  setRimWidth: (w: number | null) => void;
  netBottomY: number | null;
  setNetBottomY: (y: number | null) => void;
};

const HoopContext = createContext<HoopContextValue | null>(null);

export function HoopProvider({ children }: { children: React.ReactNode }) {
  const [swooshKey, setSwooshKey] = useState(0);
  const swoosh = useCallback(() => setSwooshKey((v) => v + 1), []);
  const [rimCenter, setRimCenter] = useState<{ x: number; y: number } | null>(
    null
  );
  const [rimWidth, setRimWidth] = useState<number | null>(null);
  const [netBottomY, setNetBottomY] = useState<number | null>(null);

  const value = useMemo(
    () => ({
      swooshKey,
      swoosh,
      rimCenter,
      setRimCenter,
      rimWidth,
      setRimWidth,
      netBottomY,
      setNetBottomY,
    }),
    [swooshKey, swoosh, rimCenter, rimWidth, netBottomY]
  );
  return <HoopContext.Provider value={value}>{children}</HoopContext.Provider>;
}

export function useHoop() {
  const ctx = useContext(HoopContext);
  if (!ctx) {
    throw new Error("useHoop must be used within a HoopProvider");
  }
  return ctx;
}
