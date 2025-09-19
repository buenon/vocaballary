import { useEffect, useState } from "react";

interface UseDynamicLabelOptions {
  text: string;
  element: HTMLDivElement | null;
  minFontSize?: number;
  maxFontSize?: number;
}

export const useDynamicLabel = ({
  text,
  element,
  minFontSize = 10,
  maxFontSize = 30,
}: UseDynamicLabelOptions) => {
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    if (!element || !text) return;

    const words = text.split(" ");
    const parentWidth =
      element.parentElement?.clientWidth || element.clientWidth;
    const maxTextWidth = parentWidth * 0.8;

    const findBestSplit = (words: string[]) => {
      if (words.length < 2) return { line1: words[0] || "", line2: "" };

      let bestLine1 = words.slice(0, Math.floor(words.length / 2)).join(" ");
      let bestLine2 = words.slice(Math.floor(words.length / 2)).join(" ");

      for (let i = 1; i < words.length; i++) {
        const line1 = words.slice(0, i).join(" ");
        const line2 = words.slice(i).join(" ");

        if (
          Math.abs(line1.length - line2.length) <
          Math.abs(bestLine1.length - bestLine2.length)
        ) {
          bestLine1 = line1;
          bestLine2 = line2;
        }
      }

      return { line1: bestLine1, line2: bestLine2 };
    };

    const findOptimalFontSize = () => {
      let currentSize = maxFontSize;
      while (currentSize >= minFontSize) {
        element.style.fontSize = `${currentSize}px`;
        void element.offsetWidth;

        if (element.scrollWidth <= maxTextWidth) {
          return currentSize;
        }
        currentSize -= 1;
      }
      return minFontSize;
    };

    if (words.length === 1) {
      const optimalSize = findOptimalFontSize();
      setFontSize(optimalSize);
    } else {
      // Try single line first
      element.innerHTML = `<div>${words.join(" ")}</div>`;
      const singleLineSize = findOptimalFontSize();

      if (singleLineSize === maxFontSize) {
        setFontSize(maxFontSize);
        return;
      }

      // Split into two lines
      const split = findBestSplit(words);
      element.innerHTML = `<div>${split.line1}</div><div>${split.line2}</div>`;
      const twoLineSize = findOptimalFontSize();
      setFontSize(twoLineSize);
    }
  }, [text, element, minFontSize, maxFontSize]);

  return { fontSize };
};
