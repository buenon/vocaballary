import * as S from "./BasketballBoard.styled";

type BoardProps = {};

export default function BasketballBoard({}: BoardProps) {
  return (
    <S.BoardRoot>
      <S.InnerRect />
    </S.BoardRoot>
  );
}
