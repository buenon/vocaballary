import { useRef } from "react";
import { GameContext } from "../../contexts/GameContext";
import { HoopProvider } from "../../contexts/HoopContext";
import { useGameEngine } from "../../hooks/useGameEngine";
import { useHoopPositioning } from "../../hooks/useHoopPositioning";
import Ball from "../Ball/Ball";
import BasketballBoard from "../BasketballBoard/BasketballBoard";
import Hoop from "../BasketballBoard/Hoop";
import HUD from "../HUD/HUD";
import Layout from "../Layout/Layout";
import WordImage from "../WordImage/WordImage";
import * as S from "./Game.styled";
import GameOver from "./GameOver";

export default function Game() {
  const engine = useGameEngine();
  const { round, answer, loading, gameOver } = engine;
  const boardRef = useRef<HTMLDivElement>(null!);
  const hoopPosition = useHoopPositioning(boardRef);

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
            <BasketballBoard ref={boardRef} />
            {hoopPosition && (
              <S.HoopContainer
                $top={hoopPosition.top}
                $left={hoopPosition.left}
                $width={hoopPosition.width}
              >
                <Hoop />
              </S.HoopContainer>
            )}
            <S.HoopFiller />
            {round && (
              <>
                <WordImage item={round.target} />
                <S.BallRack />
                <S.BallContainer $xPercent={20}>
                  <Ball
                    word={round.options[0]}
                    xPercent={20}
                    correct={round.correctIndex === 0}
                    onRelease={() => answer(0)}
                  />
                </S.BallContainer>
                <S.BallContainer $xPercent={80}>
                  <Ball
                    word={round.options[1]}
                    xPercent={80}
                    correct={round.correctIndex === 1}
                    onRelease={() => answer(1)}
                  />
                </S.BallContainer>
              </>
            )}
            {loading && <S.LoadingText>Loading...</S.LoadingText>}
            {gameOver && (
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
