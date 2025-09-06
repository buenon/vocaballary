import type { WordItem } from "../../types";
import Ball from "../Ball/Ball";
import * as S from "./BallRack.styled";

type BallRackProps = {
  options: [WordItem, WordItem];
  onSelectIndex?: (index: 0 | 1) => void;
};

export default function BallRack({ options, onSelectIndex }: BallRackProps) {
  return (
    <S.Rack>
      <Ball
        word={options[0]}
        xPercent={30}
        onRelease={() => {
          onSelectIndex?.(0);
        }}
      />
      <Ball
        word={options[1]}
        xPercent={70}
        onRelease={() => {
          onSelectIndex?.(1);
        }}
      />
    </S.Rack>
  );
}
