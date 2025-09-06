import { useEffect, useState } from "react";

/**
 * Preload a list of image URLs. Resolves when all have loaded or errored.
 * Returns { ready } which becomes true once all are settled.
 */
export function usePreloadImages(urls: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!urls || urls.length === 0) {
      setReady(true);
      return;
    }
    let cancelled = false;
    let remaining = 0;
    setReady(false);

    const unique = Array.from(new Set(urls)).filter(Boolean);
    remaining = unique.length;
    if (remaining === 0) {
      setReady(true);
      return;
    }

    const done = () => {
      if (cancelled) return;
      remaining -= 1;
      if (remaining <= 0) setReady(true);
    };

    const imgs = unique.map((src) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = src;
      return img;
    });

    return () => {
      cancelled = true;
      imgs.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [urls]);

  return { ready } as const;
}
