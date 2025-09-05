import { useEffect, useRef } from "react";
// In future, HUD could consume useGame directly to avoid props altogether
import * as S from "./HUD.styled";

type HUDProps = {
  score: number;
  strikes: number;
  highScore: number;
};

export default function HUD({ score, strikes, highScore }: HUDProps) {
  const previousStrikesRef = useRef(strikes);
  const justHitIndex = strikes > previousStrikesRef.current ? strikes - 1 : -1;
  useEffect(() => {
    previousStrikesRef.current = strikes;
  }, [strikes]);
  return (
    <S.Bar>
      <S.Left>Score: {score}</S.Left>
      <S.Strikes>
        {[0, 1, 2].map((i) => (
          <S.StrikeAnimated
            key={i}
            data-active={i < strikes}
            data-just-hit={i === justHitIndex}
          >
            X
          </S.StrikeAnimated>
        ))}
      </S.Strikes>
      <S.Right>Best: {highScore}</S.Right>
    </S.Bar>
  );
}
