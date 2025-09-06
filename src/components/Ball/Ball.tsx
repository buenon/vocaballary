import { useRef, useState } from "react";
import type { WordItem } from "../../types";
import * as S from "./Ball.styled";

type BallProps = {
  word: WordItem;
  xPercent: number; // 0-100 horizontal position (for two balls use ~30 and ~70)
  onRelease?: () => void;
};

export default function Ball({ word, xPercent, onRelease }: BallProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const heightRef = useRef<number>(0);

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
      // Above threshold: accept selection
      setOffset({ x: 0, y: 0 });
      startRef.current = null;
      onRelease?.();
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

  return (
    <S.Root
      ref={rootRef}
      className={dragging ? "dragging" : undefined}
      $dragX={offset.x}
      $dragY={offset.y}
      data-x={xPercent}
      aria-label={word.w}
      role="button"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <S.Layer>
        <S.Img src={"/assets/basketball.svg"} alt="basketball" />
      </S.Layer>
      <S.Layer>
        <S.Label>{word.w}</S.Label>
      </S.Layer>
    </S.Root>
  );
}
