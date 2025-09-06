import type { WordItem } from "../../types";
import Ball from "../Ball/Ball";
import * as S from "./BallRack.styled";

type BallRackProps = {
  options: [WordItem, WordItem];
  onSelectIndex?: (index: 0 | 1) => void;
  correctIndex?: 0 | 1;
};

export default function BallRack({
  options,
  onSelectIndex,
  correctIndex,
}: BallRackProps) {
  return (
    <S.Rack>
      <Ball
        word={options[0]}
        xPercent={30}
        correct={correctIndex === 0}
        onRelease={() => {
          onSelectIndex?.(0);
        }}
      />
      <Ball
        word={options[1]}
        xPercent={70}
        correct={correctIndex === 1}
        onRelease={() => {
          onSelectIndex?.(1);
        }}
      />
    </S.Rack>
  );
}
