import { useGame } from "../../contexts/GameContext";
import BallRack from "../BallRack/BallRack";
import WordImage from "../WordImage/WordImage";
import * as S from "./GameRunner.styled";

export default function GameRunner() {
  const { round, answer, loading } = useGame();

  return round ? (
    <S.Wrapper>
      <WordImage item={round.target} />
      <BallRack options={round.options} onSelectIndex={answer} />
    </S.Wrapper>
  ) : loading ? (
    "Loading..."
  ) : null;
}
