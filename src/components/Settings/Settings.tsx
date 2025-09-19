import { useState } from "react";
import { useSound } from "../../contexts/SoundContext";
import * as S from "./Settings.styled";

export default function Settings() {
  const { musicMuted, sfxMuted, toggleMusicMuted, toggleSfxMuted, startMusic } =
    useSound();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMusicToggle = () => {
    const willBeMuted = !musicMuted;
    toggleMusicMuted();
    if (!willBeMuted) {
      startMusic();
    }
  };

  return (
    <>
      <S.SettingsButton
        onClick={() => setIsModalOpen(true)}
        aria-label="Open sound settings"
      >
        <img
          src="/vocaballary/assets/settings.svg"
          alt="settings"
          style={{ width: "24px", height: "24px", filter: "brightness(0)" }}
        />
      </S.SettingsButton>

      {isModalOpen && (
        <S.ModalOverlay onClick={() => setIsModalOpen(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <h2>Sound Settings</h2>
              <S.CloseButton
                onClick={() => setIsModalOpen(false)}
                aria-label="Close settings"
              >
                X
              </S.CloseButton>
            </S.ModalHeader>

            <S.SoundControls>
              <S.SoundControl>
                <S.SoundBtn
                  onClick={handleMusicToggle}
                  $muted={musicMuted}
                  aria-pressed={musicMuted}
                  aria-label="Toggle music"
                >
                  <img
                    src="/vocaballary/assets/music.svg"
                    alt="music"
                    style={{ width: "28px", height: "28px" }}
                  />
                </S.SoundBtn>
                <S.SoundLabel>Music</S.SoundLabel>
              </S.SoundControl>

              <S.SoundControl>
                <S.SoundBtn
                  onClick={toggleSfxMuted}
                  $muted={sfxMuted}
                  aria-pressed={sfxMuted}
                  aria-label="Toggle sound effects"
                >
                  <img
                    src="/vocaballary/assets/sfx.svg"
                    alt="sfx"
                    style={{ width: "28px", height: "28px" }}
                  />
                </S.SoundBtn>
                <S.SoundLabel>Sound Effects</S.SoundLabel>
              </S.SoundControl>
            </S.SoundControls>

            <S.Attribution>
              <S.AttributionText>
                Created by <strong>Nadav Bueno</strong>
              </S.AttributionText>
              <S.AttributionText $license>
                Emoji graphics by{" "}
                <a
                  href="https://github.com/jdecked/twemoji"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twemoji
                </a>{" "}
                (CC-BY 4.0)
              </S.AttributionText>
            </S.Attribution>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
