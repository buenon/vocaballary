import { useEffect, useState } from "react";
import { useGame } from "../../contexts/GameContext";
import { useHoop } from "../../contexts/HoopContext";
import type { WordItem } from "../../types";
import Spinner from "../Spinner/Spinner";
import * as S from "./WordImage.styled";

type Props = { item: WordItem };

export default function WordImage({ item }: Props) {
  const {
    isCenterFront,
    setIsCenterFront,
    resultHighlight,
    setResultHighlight,
  } = useHoop();
  const [imgLoading, setImgLoading] = useState(true);
  const [imgKey, setImgKey] = useState(0);
  useEffect(() => {
    setIsCenterFront(false);
    setImgLoading(true);
    setResultHighlight(null);
    setImgKey((k) => k + 1); // force <img> remount so onLoad fires even for cached/same src
  }, [item, setIsCenterFront, setResultHighlight]);

  // As an extra guard, reset highlight when the round seed changes
  const { roundSeed } = useGame();
  useEffect(() => {
    setResultHighlight(null);
  }, [roundSeed, setResultHighlight]);
  return (
    <S.Wrap className={isCenterFront ? "front" : undefined}>
      <S.Frame
        className={isCenterFront ? "front" : undefined}
        $result={resultHighlight}
      >
        {imgLoading && (
          <S.SpinnerWrap>
            <Spinner size={36} />
          </S.SpinnerWrap>
        )}
        <S.Img
          key={imgKey}
          src={item.path}
          alt={item.word}
          style={imgLoading ? { visibility: "hidden" } : undefined}
          onLoad={() => setImgLoading(false)}
          onError={() => setImgLoading(false)}
        />
      </S.Frame>
    </S.Wrap>
  );
}
