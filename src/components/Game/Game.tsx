import { GameContext } from "../../contexts/GameContext";
import { HoopProvider } from "../../contexts/HoopContext";
import { useGameEngine } from "../../hooks/useGameEngine";
import BasketballBoard from "../BasketballBoard/BasketballBoard";
import HUD from "../HUD/HUD";
import Layout from "../Layout/Layout";
import * as S from "./Game.styled";
import GameOver from "./GameOver";
import GameRunner from "./GameRunner";

export default function Game() {
  const engine = useGameEngine();

  return (
    <HoopProvider>
      <GameContext.Provider value={engine}>
        <Layout>
          <S.CourtLayer>
            <HUD
              score={engine.score}
              strikes={engine.strikes}
              highScore={engine.highScore}
            />
            <BasketballBoard />
            {!engine.gameOver ? (
              <GameRunner />
            ) : (
              <GameOver
                score={engine.score}
                best={engine.highScore}
                onRestart={engine.restart}
              />
            )}
          </S.CourtLayer>
        </Layout>
      </GameContext.Provider>
    </HoopProvider>
  );
}
