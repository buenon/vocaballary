import { useCallback } from "react";
import { ANALYTICS_EVENTS, GA4_MEASUREMENT_ID } from "../config/analytics";

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export interface GameEvent {
  event_name: string;
  game_category?: string;
  score_value?: number;
  round_number?: number;
  high_score?: number;
  strikes?: number;
  word_category?: string;
  correct_word?: string;
  selected_word?: string;
  game_duration?: number;
}

export function useAnalytics() {
  const trackEvent = useCallback((eventData: GameEvent) => {
    // Only track in production or when explicitly enabled
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventData.event_name, {
        game_category: eventData.game_category || "vocaballary",
        score_value: eventData.score_value,
        round_number: eventData.round_number,
        high_score: eventData.high_score,
        strikes: eventData.strikes,
        word_category: eventData.word_category,
        correct_word: eventData.correct_word,
        selected_word: eventData.selected_word,
        game_duration: eventData.game_duration,
        // Custom parameters for better analytics
        custom_parameter_1: eventData.game_category,
        custom_parameter_2: eventData.score_value,
        custom_parameter_3: eventData.round_number,
      });
    }
  }, []);

  const trackPageView = useCallback((pageName: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", GA4_MEASUREMENT_ID, {
        page_title: pageName,
      });
    }
  }, []);

  const trackGameStart = useCallback(
    (category: string) => {
      trackEvent({
        event_name: ANALYTICS_EVENTS.GAME_START,
        game_category: category,
      });
    },
    [trackEvent]
  );

  const trackScore = useCallback(
    (score: number, round: number, isCorrect: boolean) => {
      trackEvent({
        event_name: isCorrect
          ? ANALYTICS_EVENTS.CORRECT_ANSWER
          : ANALYTICS_EVENTS.INCORRECT_ANSWER,
        score_value: score,
        round_number: round,
      });
    },
    [trackEvent]
  );

  const trackGameOver = useCallback(
    (
      finalScore: number,
      highScore: number,
      strikes: number,
      duration: number
    ) => {
      trackEvent({
        event_name: ANALYTICS_EVENTS.GAME_OVER,
        score_value: finalScore,
        high_score: highScore,
        strikes: strikes,
        game_duration: duration,
      });
    },
    [trackEvent]
  );

  const trackHighScore = useCallback(
    (newHighScore: number) => {
      trackEvent({
        event_name: ANALYTICS_EVENTS.HIGH_SCORE_ACHIEVED,
        score_value: newHighScore,
      });
    },
    [trackEvent]
  );

  const trackRoundComplete = useCallback(
    (
      round: number,
      wordCategory: string,
      correctWord: string,
      selectedWord: string
    ) => {
      trackEvent({
        event_name: ANALYTICS_EVENTS.ROUND_COMPLETE,
        round_number: round,
        word_category: wordCategory,
        correct_word: correctWord,
        selected_word: selectedWord,
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackPageView,
    trackGameStart,
    trackScore,
    trackGameOver,
    trackHighScore,
    trackRoundComplete,
  };
}
