import { useBallAnimation } from "../../hooks/useBallAnimation";
import type { WordItem } from "../../types";
import * as S from "./Ball.styled";

type BallProps = {
  word: WordItem;
  xPercent: number; // 0-100 horizontal position (for two balls use ~30 and ~70)
  onRelease?: () => void;
  correct?: boolean;
};

export default function Ball({
  word,
  xPercent,
  onRelease,
  correct,
}: BallProps) {
  const {
    dragging,
    offset,
    scale,
    animating,
    rootRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useBallAnimation(correct ?? false, onRelease);

  return (
    <S.Root
      ref={rootRef}
      className={dragging ? "dragging" : undefined}
      $dragX={offset.x}
      $dragY={offset.y}
      $scale={scale}
      data-animating={animating}
      data-x={xPercent}
      aria-label={word.word}
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
        <S.Label>{word.word.toUpperCase()}</S.Label>
      </S.Layer>
    </S.Root>
  );
}
