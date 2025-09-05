import { useEffect, useState } from "react";
import { useRoundController } from "../../hooks/useRoundController";
import type { WordItem } from "../../types";
import BallRack from "../BallRack/BallRack";
import WordImage from "../WordImage/WordImage";
import * as S from "./GameRunner.styled";

export default function GameRunner() {
  const [items, setItems] = useState<WordItem[]>([]);

  useEffect(() => {
    fetch("/assets/data/manifest.sample.json")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : data.items || []))
      .catch(() => setItems([]));
  }, []);

  const round = useRoundController(items);

  return round ? (
    <S.Wrapper>
      <WordImage item={round.target} />
      <BallRack options={round.options} />
    </S.Wrapper>
  ) : (
    "Loading..."
  );
}
