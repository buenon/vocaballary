import { useEffect } from "react";
import { useHoop } from "../../contexts/HoopContext";
import type { WordItem } from "../../types";
import * as S from "./WordImage.styled";

type Props = { item: WordItem };

export default function WordImage({ item }: Props) {
  const { isCenterFront, setIsCenterFront } = useHoop();
  useEffect(() => {
    setIsCenterFront(false);
  }, [item, setIsCenterFront]);
  return (
    <S.Wrap className={isCenterFront ? "front" : undefined}>
      <S.Frame className={isCenterFront ? "front" : undefined}>
        <S.Img src={item.p} alt={item.w} />
      </S.Frame>
    </S.Wrap>
  );
}
