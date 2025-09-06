import { forwardRef } from "react";
import * as S from "./BasketballBoard.styled";

type BoardProps = {};

const BasketballBoard = forwardRef<HTMLDivElement, BoardProps>((_, ref) => {
  return (
    <S.BoardRoot ref={ref}>
      <S.InnerRect />
    </S.BoardRoot>
  );
});

BasketballBoard.displayName = "BasketballBoard";

export default BasketballBoard;
