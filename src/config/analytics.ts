// Google Analytics 4 Configuration

export const GA4_MEASUREMENT_ID = "G-Q0DTPCLQES";

// Custom event names for consistent tracking
export const ANALYTICS_EVENTS = {
  GAME_START: "game_start",
  CORRECT_ANSWER: "correct_answer",
  INCORRECT_ANSWER: "incorrect_answer",
  GAME_OVER: "game_over",
  HIGH_SCORE_ACHIEVED: "high_score_achieved",
  ROUND_COMPLETE: "round_complete",
  PAGE_VIEW: "page_view",
} as const;

// Game categories for analytics
export const GAME_CATEGORIES = {
  VOCABALLARY: "vocaballary",
} as const;
