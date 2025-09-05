import { useRef } from "react";
import type { WordItem } from "../../types";
import * as S from "./Ball.styled";

type BallProps = {
  word: WordItem;
  xPercent: number; // 0-100 horizontal position (for two balls use ~30 and ~70)
  onClick?: () => void;
};

export default function Ball({ word, xPercent, onClick }: BallProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  // const [dragging, setDragging] = useState(false);

  return (
    <S.Root
      ref={rootRef}
      style={{ ["--x" as any]: `${xPercent}%` }}
      aria-label={word.w}
      role="button"
      tabIndex={0}
      onClick={onClick}
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
