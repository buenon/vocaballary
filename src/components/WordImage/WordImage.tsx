import { useEffect, useState } from "react";
import { useHoop } from "../../contexts/HoopContext";
import type { WordItem } from "../../types";
import Spinner from "../Spinner/Spinner";
import * as S from "./WordImage.styled";

type Props = { item: WordItem };

export default function WordImage({ item }: Props) {
  const { isCenterFront, setIsCenterFront } = useHoop();
  const [imgLoading, setImgLoading] = useState(true);
  useEffect(() => {
    setIsCenterFront(false);
    setImgLoading(true);
  }, [item, setIsCenterFront]);
  return (
    <S.Wrap className={isCenterFront ? "front" : undefined}>
      <S.Frame className={isCenterFront ? "front" : undefined}>
        {imgLoading && (
          <S.SpinnerWrap>
            <Spinner size={36} />
          </S.SpinnerWrap>
        )}
        <S.Img
          src={item.p}
          alt={item.w}
          style={imgLoading ? { visibility: "hidden" } : undefined}
          onLoad={() => setImgLoading(false)}
          onError={() => setImgLoading(false)}
        />
      </S.Frame>
    </S.Wrap>
  );
}
