import * as S from "./HUD.styled";

type HUDProps = {
  score: number;
  strikes: number;
  highScore: number;
};

export default function HUD({ score, strikes, highScore }: HUDProps) {
  return (
    <S.Bar>
      <div>Score: {score}</div>
      <div>Strikes: {strikes}/3</div>
      <div>Best: {highScore}</div>
    </S.Bar>
  );
}
