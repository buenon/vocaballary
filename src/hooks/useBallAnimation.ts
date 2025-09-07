import { useEffect, useRef, useState } from "react";
import { useHoop } from "../contexts/HoopContext";
import { useSound } from "../contexts/SoundContext";

export function useBallAnimation(correct: boolean, onRelease?: () => void) {
  // Tunable animation parameters
  const THROW_THRESHOLD_FRACTION = 0.5; // drag distance as fraction of ball height to trigger throw
  const THROW_DURATION_MS = 500; // time to travel to rim area
  const THROW_ARC_PEAK_FACTOR = 0.3; // arc apex relative to max(|dy|, ballHeight)
  const END_ABOVE_RIM_BALL_HEIGHT_FACTOR = 0.2; // end slightly above rim by ball height fraction
  const SCALE_TARGET_RIM_WIDTH_FACTOR = 0.7; // scale target size relative to rim width
  const FINALIZE_DELAY_MS = 1000; // delay after landing before resetting and answering
  const SCORE_APPROACH_EARLY_MS = 300; // score SFX early timing during approach
  const MISS_APPROACH_EARLY_MS = 300; // miss SFX early timing during approach

  // Correct shot drop parameters
  const DROP_DURATION_MS = 200;
  const DROP_END_BIAS_PX = 128; // positive lowers final made-shot position after net
  const MADE_FALL_FINAL_Y_PERCENT = 0.3; // final screen Y for made shots as % from top

  // Miss/bounce parameters
  const MISS_RIM_HIT_Y_OFFSET = 40; // how deep the ball dips to hit rim visually
  const BOUNCE_HEIGHT_PX = -340; // negative for upward arc
  const BOUNCE_DISTANCE_PX = 100; // lateral move during bounce
  const BOUNCE_DURATION_MS = 800;
  const MISS_X_OFFSET_FACTOR = 1; // multiply (rimWidth/2) for miss aiming
  const MISS_FALL_FINAL_Y_PERCENT = 0.6; // final screen Y for missed shots as % from top
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const heightRef = useRef<number>(0);
  const {
    rimCenter,
    rimWidth,
    netBottomY,
    swoosh,
    setIsSwishing,
    setIsCenterFront,
    setResultHighlight,
  } = useHoop();
  const { playScore, playMiss } = useSound();
  const scoreSfxPlayedRef = useRef(false);
  const missSfxPlayedRef = useRef(false);
  const [scale, setScale] = useState(1);
  const [animating, setAnimating] = useState(false);

  // Animation cleanup refs
  const animationRef = useRef<number | null>(null);
  // Track all timeouts so we can cancel stale ones between shots
  const timeoutsRef = useRef<number[]>([]);
  // Token to invalidate stale rAF/timeout callbacks across shots
  const animTokenRef = useRef(0);

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

  // Cleanup function to cancel any running animations
  const cleanup = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (timeoutsRef.current.length) {
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
    }
  };

  function endDrag() {
    // Invalidate all previous callbacks and cancel any scheduled work
    animTokenRef.current += 1;
    const token = animTokenRef.current;
    cleanup();
    // reset one-shot SFX guards for this throw
    scoreSfxPlayedRef.current = false;
    missSfxPlayedRef.current = false;
    setDragging(false);
    setAnimating(true);
    const releasedDy = offset.y;
    const thresholdPx = heightRef.current
      ? -heightRef.current * THROW_THRESHOLD_FRACTION
      : -50;
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
          targetX = rimCenter.x + sign * (rimWidth / 2) * MISS_X_OFFSET_FACTOR;
        }
        const dx = targetX - ballCenter.x;
        const dy =
          rimCenter.y -
          ballCenter.y -
          ballRect.height * END_ABOVE_RIM_BALL_HEIGHT_FACTOR; // end slightly above rim
        const startOffset = { ...offset };
        const duration = THROW_DURATION_MS;
        const t0 = performance.now();
        function easeOutCubic(t: number) {
          return 1 - Math.pow(1 - t, 3);
        }

        function animateRimBounceAndFall(
          rimX: number,
          rimY: number,
          onComplete: () => void
        ) {
          if (!rootRef.current) return onComplete();

          const bounceStart = performance.now();

          // Bounce parameters (operate purely in offset space)
          const rimHitY = rimY + MISS_RIM_HIT_Y_OFFSET; // small dip to hit rim visually
          const bounceHeight = BOUNCE_HEIGHT_PX; // bounce up
          const bounceDistance =
            ballCenter.x < (rimCenter?.x ?? 0)
              ? -BOUNCE_DISTANCE_PX
              : BOUNCE_DISTANCE_PX;
          const totalDuration = BOUNCE_DURATION_MS;
          const horizontalDistance = bounceDistance;
          // Compute consistent final Y at a percentage of viewport height
          const brNow = rootRef.current.getBoundingClientRect();
          const currentCenterYNow = brNow.top + brNow.height / 2;
          const baselineCenterY = currentCenterYNow - rimY; // where offset = 0 would place the center
          const targetCenterY =
            window.scrollY + window.innerHeight * MISS_FALL_FINAL_Y_PERCENT;
          const finalOffsetY = targetCenterY - baselineCenterY;
          const verticalDistance = finalOffsetY - rimHitY; // settle at desired final Y

          function bounceFrame(ts: number) {
            if (animTokenRef.current !== token) return; // stale frame
            const p = Math.min(1, (ts - bounceStart) / totalDuration);
            const currentX = rimX + horizontalDistance * p;
            const linearY = rimHitY + verticalDistance * p;
            const arcOffset = bounceHeight * Math.sin(p * Math.PI);
            const currentY = linearY + arcOffset;
            setOffset({ x: currentX, y: currentY });

            if (p < 1) {
              animationRef.current = requestAnimationFrame(bounceFrame);
            } else {
              animationRef.current = null;
              const id = window.setTimeout(() => {
                if (animTokenRef.current !== token) return;
                onComplete();
              }, FINALIZE_DELAY_MS);
              timeoutsRef.current.push(id);
            }
          }
          animationRef.current = requestAnimationFrame(bounceFrame);
        }

        function frame(ts: number) {
          if (animTokenRef.current !== token) return; // stale frame
          const p = Math.min(1, (ts - t0) / duration);
          const e = easeOutCubic(p);
          const x = startOffset.x + dx * e;
          // arc: lift peak mid-flight using a parabola
          const peak =
            -Math.max(Math.abs(dy), ballRect.height) * THROW_ARC_PEAK_FACTOR;
          const arcY = dy * e + peak * (1 - (2 * p - 1) ** 2);
          const y = startOffset.y + arcY;
          if (rimWidth) {
            const targetScale = Math.min(
              1,
              (rimWidth * SCALE_TARGET_RIM_WIDTH_FACTOR) / ballRect.width
            );
            const s = 1 - (1 - targetScale) * e;
            setScale(s);
          }
          setOffset({ x, y });
          // Fire SFX a bit before reaching the rim on approach
          const earlyMs = correct
            ? SCORE_APPROACH_EARLY_MS
            : MISS_APPROACH_EARLY_MS;
          const earlyThreshold = Math.max(0, 1 - earlyMs / duration);
          if (p >= earlyThreshold) {
            if (correct) {
              if (!scoreSfxPlayedRef.current) {
                playScore();
                scoreSfxPlayedRef.current = true;
              }
            } else {
              if (!missSfxPlayedRef.current) {
                playMiss();
                missSfxPlayedRef.current = true;
              }
            }
          }
          if (p < 1) {
            animationRef.current = requestAnimationFrame(frame);
          } else {
            // After reaching the rim area, proceed to end-state, then delay before commit
            const finalize = () => {
              const id = window.setTimeout(() => {
                if (animTokenRef.current !== token) return;
                setOffset({ x: 0, y: 0 });
                setScale(1);
                startRef.current = null;
                setAnimating(false);
                onRelease?.();
              }, FINALIZE_DELAY_MS);
              timeoutsRef.current.push(id);
            };
            if (netBottomY && rootRef.current && correct) {
              // Drop straight through the net to its bottom, then delay
              const br = rootRef.current.getBoundingClientRect();
              const currentCenterY = br.top + br.height / 2;
              // Compute consistent final Y at a percentage of viewport height
              const targetCenterY =
                window.scrollY + window.innerHeight * MADE_FALL_FINAL_Y_PERCENT;
              const dropDy = targetCenterY - currentCenterY + DROP_END_BIAS_PX;
              const dropStart = performance.now();
              const dropDur = DROP_DURATION_MS;
              const startY = y;
              // Bring hoop front above the ball for visual pass-through
              setIsSwishing(true);
              // Bring center image to front as ball reaches the board
              setIsCenterFront(true);
              function dropFrame(ts2: number) {
                if (animTokenRef.current !== token) return; // stale frame
                const p2 = Math.min(1, (ts2 - dropStart) / dropDur);
                const y2 = startY + dropDy * p2;
                setOffset({ x, y: y2 });
                if (p2 < 1) {
                  animationRef.current = requestAnimationFrame(dropFrame);
                } else {
                  swoosh();
                  if (!scoreSfxPlayedRef.current) {
                    playScore();
                    scoreSfxPlayedRef.current = true;
                  }
                  setResultHighlight("correct");
                  // Reset center image to back after made shot completes
                  const doneId = window.setTimeout(
                    () => setIsCenterFront(false),
                    FINALIZE_DELAY_MS
                  );
                  timeoutsRef.current.push(doneId);
                  finalize();
                }
              }
              animationRef.current = requestAnimationFrame(dropFrame);
            } else {
              // Missed shot: bounce off rim and fall to floor
              const missFinalize = () => {
                setOffset({ x: 0, y: 0 });
                setScale(1);
                startRef.current = null;
                setAnimating(false);
                setIsCenterFront(false);
                onRelease?.();
              };
              // Bring center image to front as the ball reaches the rim area for misses as well
              setIsCenterFront(true);
              if (!missSfxPlayedRef.current) {
                playMiss();
                missSfxPlayedRef.current = true;
              }
              setResultHighlight("wrong");
              animateRimBounceAndFall(x, y, missFinalize);
            }
            // Note: in a fuller impl we'd clear pending timers on unmount
          }
        }
        animationRef.current = requestAnimationFrame(frame);
      } else {
        setOffset({ x: 0, y: 0 });
        startRef.current = null;
        setAnimating(false);
        onRelease?.();
      }
    } else {
      // Below threshold: snap back
      setOffset({ x: 0, y: 0 });
      startRef.current = null;
      setAnimating(false);
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!(e.target as HTMLElement).hasPointerCapture?.(e.pointerId))
      return endDrag();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    endDrag();
  }

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  return {
    // State
    dragging,
    offset,
    scale,
    animating,
    // Refs
    rootRef,
    // Event handlers
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
