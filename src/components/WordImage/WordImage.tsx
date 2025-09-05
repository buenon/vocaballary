import type { WordItem } from "../../types";
import * as S from "./WordImage.styled";

type Props = { item: WordItem };

export default function WordImage({ item }: Props) {
  return (
    <S.Wrap>
      <S.Frame>
        <S.Img src={item.p} alt={item.w} />
      </S.Frame>
    </S.Wrap>
  );
}
