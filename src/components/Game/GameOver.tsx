import * as S from "./GameOver.styled";

type GameOverProps = {
  score: number;
  best: number;
  onRestart: () => void;
};

export default function GameOver({ score, best, onRestart }: GameOverProps) {
  return (
    <S.GameOverOverlay>
      <S.GameOverCard>
        <S.GameOverTitle>Game Over</S.GameOverTitle>
        <S.GameOverScores>
          <S.ScorePill>Score: {score}</S.ScorePill>
          <S.ScorePill>Best: {best}</S.ScorePill>
        </S.GameOverScores>
        <S.PlayAgainButton onClick={onRestart}>Play Again</S.PlayAgainButton>
      </S.GameOverCard>
    </S.GameOverOverlay>
  );
}
