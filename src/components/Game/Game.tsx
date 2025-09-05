import { HoopProvider } from "../../contexts/HoopContext";
import BasketballBoard from "../BasketballBoard/BasketballBoard";
import HUD from "../HUD/HUD";
import Layout from "../Layout/Layout";
import * as S from "./Game.styled";
import GameRunner from "./GameRunner";

export default function Game() {
  const highScore = 0;
  const score = 0;
  const strikes = 0;

  return (
    <HoopProvider>
      <Layout>
        <S.CourtLayer>
          <HUD score={score} strikes={strikes} highScore={highScore} />
          <BasketballBoard />
          <GameRunner />
        </S.CourtLayer>
      </Layout>
    </HoopProvider>
  );
}
