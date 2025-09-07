import { useEffect, useMemo, useRef, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import { HoopProvider, useHoop } from "../../contexts/HoopContext";
import { SoundProvider, useSound } from "../../contexts/SoundContext";
import { useGameEngine } from "../../hooks/useGameEngine";
import { useHoopPositioning } from "../../hooks/useHoopPositioning";
import { usePreloadImages } from "../../hooks/usePreloadImages";
import Ball from "../Ball/Ball";
import BasketballBoard from "../BasketballBoard/BasketballBoard";
import Hoop from "../BasketballBoard/Hoop";
import HUD from "../HUD/HUD";
import Layout from "../Layout/Layout";
import Splash from "../Splash/Splash";
import WordImage from "../WordImage/WordImage";
import * as S from "./Game.styled";
import GameOver from "./GameOver";

export default function Game() {
  const engine = useGameEngine();
  const { round, answer, loading, gameOver } = engine;
  const boardRef = useRef<HTMLDivElement>(null!);
  const hoopPosition = useHoopPositioning(boardRef);

  // Splash state: show at least 2s and until initial resources are ready
  const [imageReady, setImageReady] = useState(false);
  const mountAtRef = useRef<number>(Date.now());
  const [showSplash, setShowSplash] = useState(true);
  const [initialSplashDone, setInitialSplashDone] = useState(false);
  const [readyToStart, setReadyToStart] = useState(false);

  // Preload the current round's target image
  useEffect(() => {
    if (!round?.target?.path) return;
    setImageReady(false);
    const img = new Image();
    img.onload = () => setImageReady(true);
    img.onerror = () => setImageReady(true); // don't block if it fails
    img.src = round.target.path;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [round?.target?.path]);

  // Preload static UI images used at initial render
  const staticAssets = useMemo(
    () => [
      "/assets/background.png",
      "/assets/hoop-back.png",
      "/assets/hoop-front.png",
      "/assets/net-top.png",
      "/assets/net-bottom.png",
      "/assets/basketball.svg",
      "/assets/manifest.json",
    ],
    []
  );
  const { ready: staticReady } = usePreloadImages(staticAssets);

  // Control splash readiness: after >= 2000ms AND resources ready
  useEffect(() => {
    const check = () => {
      const elapsed = Date.now() - mountAtRef.current;
      const resourcesReady = !loading && imageReady && staticReady;
      const shouldHide = elapsed >= 2000 && resourcesReady;
      setReadyToStart(shouldHide);
    };
    const id = window.setInterval(check, 50);
    return () => window.clearInterval(id);
  }, [loading, imageReady, staticReady]);

  return (
    <HoopProvider>
      <SoundProvider>
        <GameContext.Provider value={engine}>
          <Layout>
            <Splash
              visible={showSplash && !initialSplashDone}
              ready={readyToStart}
              onStart={() => {
                setShowSplash(false);
                setInitialSplashDone(true);
              }}
            />
            <MusicStarterAfterStart active={!showSplash && initialSplashDone} />
            <S.CourtLayer>
              <SoundControls />
              <HUD
                score={engine.score}
                strikes={engine.strikes}
                highScore={engine.highScore}
              />
              <BasketballBoard ref={boardRef} />
              {hoopPosition && (
                <>
                  <S.HoopBackContainer
                    $top={hoopPosition.top}
                    $left={hoopPosition.left}
                    $width={hoopPosition.width}
                  >
                    <img src="/assets/hoop-back.png" alt="hoop back" />
                  </S.HoopBackContainer>
                  <HoopZLayer
                    $top={hoopPosition.top}
                    $left={hoopPosition.left}
                    $width={hoopPosition.width}
                  />
                </>
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
      </SoundProvider>
    </HoopProvider>
  );
}

function HoopZLayer({
  $top,
  $left,
  $width,
}: {
  $top: number;
  $left: number;
  $width: number;
}) {
  const { isSwishing } = useHoop();
  return (
    <S.HoopContainer
      $top={$top}
      $left={$left}
      $width={$width}
      $front={isSwishing}
    >
      <Hoop />
    </S.HoopContainer>
  );
}

function MusicStarterAfterStart({ active }: { active: boolean }) {
  const { startMusic, preloadSoundtrack, musicMuted } = useSound();
  const startedRef = useRef(false);
  useEffect(() => {
    preloadSoundtrack();
  }, [preloadSoundtrack]);
  useEffect(() => {
    if (!active || startedRef.current || musicMuted) return;
    startedRef.current = true;
    startMusic();
  }, [active, startMusic, musicMuted]);
  return null;
}

function SoundControls() {
  const { musicMuted, sfxMuted, toggleMusicMuted, toggleSfxMuted, startMusic } =
    useSound();
  return (
    <S.SoundToggles>
      <S.SoundBtn
        onClick={() => {
          const willBeMuted = !musicMuted;
          toggleMusicMuted();
          if (!willBeMuted) {
            startMusic();
          }
        }}
        data-off={musicMuted}
        aria-pressed={musicMuted}
        aria-label="Toggle music"
      >
        <img src="/assets/music.svg" alt="music" />
      </S.SoundBtn>
      <S.SoundBtn
        onClick={toggleSfxMuted}
        data-off={sfxMuted}
        aria-pressed={sfxMuted}
        aria-label="Toggle sound effects"
      >
        <img src="/assets/sfx.svg" alt="sfx" />
      </S.SoundBtn>
    </S.SoundToggles>
  );
}
