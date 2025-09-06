import { useLayoutEffect, useRef, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import { HoopProvider } from "../../contexts/HoopContext";
import { useGameEngine } from "../../hooks/useGameEngine";
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
  const boardRef = useRef<HTMLDivElement>(null);
  const [hoopPosition, setHoopPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  useLayoutEffect(() => {
    const updateHoopPosition = () => {
      if (!boardRef.current) return;

      const boardRect = boardRef.current.getBoundingClientRect();
      const courtLayerRect =
        boardRef.current.parentElement?.getBoundingClientRect();

      if (!courtLayerRect) return;

      // Position hoop higher up from the bottom of the board
      const hoopTop =
        boardRect.bottom - courtLayerRect.top - boardRect.height * 0.3;
      const hoopLeft =
        boardRect.left + boardRect.width / 2 - courtLayerRect.left;
      const hoopWidth = boardRect.width * 0.4; // 40% of board width (matches InnerRect)

      setHoopPosition({
        top: hoopTop,
        left: hoopLeft,
        width: hoopWidth,
      });
    };

    updateHoopPosition();

    const resizeObserver = new ResizeObserver(updateHoopPosition);
    if (boardRef.current) {
      resizeObserver.observe(boardRef.current);
    }

    window.addEventListener("resize", updateHoopPosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHoopPosition);
    };
  }, []);

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
