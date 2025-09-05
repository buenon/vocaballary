import * as S from "./BasketballBoard.styled";
import Hoop from "./Hoop";

type BoardProps = {};

export default function BasketballBoard({}: BoardProps) {
  return (
    <S.BoardRoot>
      <S.InnerRect>
        <Hoop />
      </S.InnerRect>
    </S.BoardRoot>
  );
}
