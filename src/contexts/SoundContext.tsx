/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SoundContextValue = {
  startMusic: (options?: { mutedAutoplay?: boolean }) => void;
  stopMusic: () => void;
  playScore: () => void;
  playMiss: () => void;
  musicEnabled: boolean;
  preloadSoundtrack: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [musicEnabled, setMusicEnabled] = useState(false);

  const soundtrackRef = useRef<HTMLAudioElement | null>(null);
  const scoreRef = useRef<HTMLAudioElement | null>(null);
  const missRef = useRef<HTMLAudioElement | null>(null);
  const unlockAttachedRef = useRef(false);
  const unlockHandlerRef = useRef<(() => void) | null>(null);

  // Lazily create audio elements once
  useEffect(() => {
    const soundtrack = new Audio("/assets/sound/soundtrack.mp3");
    soundtrack.loop = true;
    soundtrack.preload = "auto";
    soundtrack.volume = 0.8;
    soundtrackRef.current = soundtrack;

    const score = new Audio("/assets/sound/score.mp3");
    score.preload = "auto";
    score.volume = 0.8;
    scoreRef.current = score;

    const miss = new Audio("/assets/sound/miss.mp3");
    miss.preload = "auto";
    miss.volume = 0.8;
    missRef.current = miss;

    return () => {
      soundtrack.pause();
      soundtrackRef.current = null;
      scoreRef.current = null;
      missRef.current = null;
    };
  }, []);

  const preloadSoundtrack = useCallback(() => {
    const el = soundtrackRef.current;
    if (!el) return;
    try {
      // Begin fetching decoder/metadata; does not start playback
      el.load();
    } catch {
      // ignore
    }
  }, []);

  const startMusic = useCallback((options?: { mutedAutoplay?: boolean }) => {
    const el = soundtrackRef.current;
    if (!el) return;
    // Do not attempt to start while page is hidden (avoids lock-screen start)
    if (document.visibilityState !== "visible") {
      const onceVisible = () => {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", onceVisible);
          startMusic(options);
        }
      };
      document.addEventListener("visibilitychange", onceVisible);
      return;
    }
    if (options?.mutedAutoplay) {
      el.muted = true;
    }
    const tryPlay = () =>
      el
        .play()
        .then(() => {
          setMusicEnabled(true);
          // remove unlock listeners if attached
          if (unlockAttachedRef.current && unlockHandlerRef.current) {
            const u = unlockHandlerRef.current;
            window.removeEventListener("pointerdown", u, {
              capture: true,
            } as EventListenerOptions);
            window.removeEventListener("mousedown", u, {
              capture: true,
            } as EventListenerOptions);
            window.removeEventListener("touchstart", u, {
              capture: true,
            } as EventListenerOptions);
            window.removeEventListener("keydown", u, {
              capture: true,
            } as EventListenerOptions);
            unlockAttachedRef.current = false;
            unlockHandlerRef.current = null;
          }
          // If playing muted (from mutedAutoplay), attach a one-time unmute on first gesture
          if (el.muted && !unlockAttachedRef.current) {
            const unmute = () => {
              el.muted = false;
              window.removeEventListener("pointerdown", unmute, {
                capture: true,
              } as EventListenerOptions);
              window.removeEventListener("mousedown", unmute, {
                capture: true,
              } as EventListenerOptions);
              window.removeEventListener("touchstart", unmute, {
                capture: true,
              } as EventListenerOptions);
              window.removeEventListener("keydown", unmute, {
                capture: true,
              } as EventListenerOptions);
              unlockAttachedRef.current = false;
              unlockHandlerRef.current = null;
            };
            unlockHandlerRef.current = unmute;
            unlockAttachedRef.current = true;
            window.addEventListener("pointerdown", unmute, {
              capture: true,
            } as EventListenerOptions);
            window.addEventListener("mousedown", unmute, {
              capture: true,
            } as EventListenerOptions);
            window.addEventListener("touchstart", unmute, {
              capture: true,
            } as EventListenerOptions);
            window.addEventListener("keydown", unmute, {
              capture: true,
            } as EventListenerOptions);
          }
        })
        .catch(() => {
          // NotAllowedError until user gesture or other transient issue.
          // Attach persistent unlock listeners to retry on every gesture until success.
          if (!unlockAttachedRef.current) {
            const unlock = () => {
              tryPlay();
            };
            unlockHandlerRef.current = unlock;
            unlockAttachedRef.current = true;
            window.addEventListener("pointerdown", unlock, {
              capture: true,
            } as EventListenerOptions);
            window.addEventListener("mousedown", unlock, {
              capture: true,
            } as EventListenerOptions);
            window.addEventListener("touchstart", unlock, {
              capture: true,
            } as EventListenerOptions);
            window.addEventListener("keydown", unlock, {
              capture: true,
            } as EventListenerOptions);
          }
        });
    tryPlay();
  }, []);

  const stopMusic = useCallback(() => {
    const el = soundtrackRef.current;
    if (!el) return;
    el.pause();
    try {
      el.currentTime = 0;
    } catch {
      // ignore
      void 0;
    }
    setMusicEnabled(false);
  }, []);

  const playScore = useCallback(() => {
    const el = scoreRef.current;
    if (!el) return;
    try {
      el.currentTime = 0;
    } catch {
      // ignore
      void 0;
    }
    el.play().catch(() => {});
  }, []);

  const playMiss = useCallback(() => {
    const el = missRef.current;
    if (!el) return;
    try {
      el.currentTime = 0;
    } catch {
      // ignore
      void 0;
    }
    el.play().catch(() => {});
  }, []);

  // Pause music when page hidden; resume when visible if enabled
  useEffect(() => {
    const onVisibility = () => {
      const s = soundtrackRef.current;
      if (!s) return;
      if (document.visibilityState === "hidden") {
        s.pause();
      } else {
        if (musicEnabled) {
          s.play().catch(() => {});
        } else {
          // Try to start again when returning to tab
          // (helps recover from prior NotAllowed or transient failures)
          try {
            s.play()
              .then(() => setMusicEnabled(true))
              .catch(() => {
                // will be unlocked by user gesture listeners if present
              });
          } catch {
            // ignore
          }
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [musicEnabled]);

  const value = useMemo(
    () => ({
      startMusic,
      stopMusic,
      playScore,
      playMiss,
      musicEnabled,
      preloadSoundtrack,
    }),
    [
      startMusic,
      stopMusic,
      playScore,
      playMiss,
      musicEnabled,
      preloadSoundtrack,
    ]
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
