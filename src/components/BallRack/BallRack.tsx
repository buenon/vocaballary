import type { WordItem } from "../../types";
import Ball from "../Ball/Ball";
import * as S from "./BallRack.styled";

type BallRackProps = {
  options: [WordItem, WordItem];
};

export default function BallRack({ options }: BallRackProps) {
  return (
    <S.Rack>
      <Ball word={options[0]} xPercent={30} />
      <Ball word={options[1]} xPercent={70} />
    </S.Rack>
  );
}
