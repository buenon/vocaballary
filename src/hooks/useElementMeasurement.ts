import { useLayoutEffect, useRef } from "react";

type ElementMeasurements = {
  rect: DOMRect;
  center: { x: number; y: number };
  width: number;
  height: number;
  bottom: number;
};

export function useElementMeasurement<T extends HTMLElement>(
  onMeasure: (measurements: ElementMeasurements) => void
) {
  const elementRef = useRef<T>(null!);

  useLayoutEffect(() => {
    const updateMeasurements = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const measurements: ElementMeasurements = {
        rect,
        center: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
      };

      onMeasure(measurements);
    };

    updateMeasurements();

    const resizeObserver = new ResizeObserver(updateMeasurements);
    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [onMeasure]);

  return elementRef;
}
