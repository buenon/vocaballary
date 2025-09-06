import { useRef, useState } from "react";
import { useHoop } from "../contexts/HoopContext";

export function useBallAnimation(correct: boolean, onRelease?: () => void) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const heightRef = useRef<number>(0);
  const { rimCenter, rimWidth, netBottomY, swoosh } = useHoop();
  const [scale, setScale] = useState(1);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    const rect = rootRef.current?.getBoundingClientRect();
    heightRef.current = rect?.height ?? 0;
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || !startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setOffset({ x: dx, y: dy });
  }

  function endDrag() {
    setDragging(false);
    const releasedDy = offset.y;
    const fraction = 0.5; // 50% of ball height
    const thresholdPx = heightRef.current ? -heightRef.current * fraction : -50;
    if (releasedDy <= thresholdPx) {
      // Above threshold: animate throw to rim if known
      if (rimCenter && rootRef.current) {
        const ballRect = rootRef.current.getBoundingClientRect();
        const ballCenter = {
          x: ballRect.left + ballRect.width / 2,
          y: ballRect.top + ballRect.height / 2,
        };
        // Choose end X: center for correct; edge for wrong (based on start side)
        let targetX = rimCenter.x;
        if (rimWidth && !correct) {
          const sign = ballCenter.x < rimCenter.x ? -1 : 1;
          targetX = rimCenter.x + sign * (rimWidth / 2);
        }
        const dx = targetX - ballCenter.x;
        const dy = rimCenter.y - ballCenter.y - ballRect.height * 0.2; // end slightly above rim (lower than before)
        const startOffset = { ...offset };
        const duration = 500;
        const t0 = performance.now();
        function easeOutCubic(t: number) {
          return 1 - Math.pow(1 - t, 3);
        }
        function frame(ts: number) {
          const p = Math.min(1, (ts - t0) / duration);
          const e = easeOutCubic(p);
          const x = startOffset.x + dx * e;
          // arc: lift peak mid-flight using a parabola
          const peak = -Math.max(Math.abs(dy), ballRect.height) * 0.6;
          const arcY = dy * e + peak * (1 - (2 * p - 1) ** 2);
          const y = startOffset.y + arcY;
          if (rimWidth) {
            const targetScale = Math.min(1, (rimWidth * 0.7) / ballRect.width);
            const s = 1 - (1 - targetScale) * e;
            setScale(s);
          }
          setOffset({ x, y });
          if (p < 1) {
            requestAnimationFrame(frame);
          } else {
            // After reaching the rim area, proceed to end-state, then delay before commit
            const finalize = () => {
              setTimeout(() => {
                setOffset({ x: 0, y: 0 });
                setScale(1);
                startRef.current = null;
                onRelease?.();
              }, 2000);
            };
            if (netBottomY && rootRef.current && correct) {
              // Drop straight through the net to its bottom, then delay
              const br = rootRef.current.getBoundingClientRect();
              const currentCenterY = br.top + br.height / 2;
              const dropDy = netBottomY - currentCenterY;
              const dropStart = performance.now();
              const dropDur = 350;
              const startY = y;
              function dropFrame(ts2: number) {
                const p2 = Math.min(1, (ts2 - dropStart) / dropDur);
                const y2 = startY + dropDy * p2;
                setOffset({ x, y: y2 });
                if (p2 < 1) {
                  requestAnimationFrame(dropFrame);
                } else {
                  swoosh();
                  finalize();
                }
              }
              requestAnimationFrame(dropFrame);
            } else {
              // No net metrics or not correct: just delay and finish
              finalize();
            }
            // Note: in a fuller impl we'd clear pending timers on unmount
          }
        }
        requestAnimationFrame(frame);
      } else {
        setOffset({ x: 0, y: 0 });
        startRef.current = null;
        onRelease?.();
      }
    } else {
      // Below threshold: snap back
      setOffset({ x: 0, y: 0 });
      startRef.current = null;
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!(e.target as HTMLElement).hasPointerCapture?.(e.pointerId))
      return endDrag();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    endDrag();
  }

  return {
    // State
    dragging,
    offset,
    scale,
    // Refs
    rootRef,
    // Event handlers
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
