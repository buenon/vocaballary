## VocaBall — Design & Implementation Plan

### Product goals

- Teach basic nouns (ages 6–10) via a quick, tactile shoot-and-choose game.
- Mobile-first; responsive to tablets/desktop; no analytics/monetization now.
- Local high score; simple, cartoon vibe; fast loads.

### Core loop

1. Load manifest and prefetch small asset set.
2. Show 1 image centered; show 2 labeled balls (1 correct).
3. Drag/flick a ball to shoot.
4. Determine hit+correct → score++, else strike++.
5. Next round; end at 3 strikes; update high score.

### Screens

- Game (primary)
- Game Over overlay (score, high score, Play Again)
- Settings/About (OpenMoji attribution; sound toggle)

### Architecture

- `App` → `Game`
  - `Layout` (responsive stage + pillarboxes)
  - `Court` (round container)
    - `Backboard`, `Hoop`, `Net` (visual hoop assembly)
    - `PromptImage` (SVG)
    - `BallRack` → `Ball` x2 (label text, swipe/throw)
    - `HUD` (Score, Strikes, HighScoreMini)
    - `RoundFX` (swish/miss)
- State
  - `GameContext`: `{ score, strikes, round, highScore, settings }`
  - `useRoundController()`: select target/decoy, shuffle positions
  - `useStorage()`: localStorage for high score
  - `useAudio()` later: voice-over + SFX
- Data
  - `manifest.json` (compact): `[{ w, c, u, p, aliases }]`

### Interactions

- Drag/flick: pointer down/move/up; compute velocity; animate along bezier.
- Judge: crossing hoop goal ring + correctness.
- Feedback: swish/miss animations; score/strike updates.

### Styling & responsiveness

- Stage portrait 9:16; pillarboxed on wide screens.
- Hoop/backboard positioned by percentages; capped max widths.
- Touch targets ≥44px; type scale with CSS clamp.

### Accessibility

- Readable labels; aria-labels on balls; respect `prefers-reduced-motion`.

### Performance

- Preload next round’s image/audio; memoize; lazy-load noncritical assets.

### Asset pipeline (OpenMoji hybrid)

- Vendor pack in `vendor/openmoji/` untouched.
- Curated subset under `public/assets/svg/<category>/<slug>.svg`.
- Scripts to generate `manifest.json`; include attribution (CC BY-SA 4.0).

### Milestones

1. Court foundation (done: layout, hoop assembly)
2. Ball + input (drag/flick + arc)
3. Round controller + minimal `manifest.json`
4. Judging + HUD + round transitions
5. High score + basic audio
6. Polish + Settings/About
7. Content ramp + pipeline

### Minimal data models

- `WordItem`: `{ w: string; aliases?: string[]; c: string; u: string; p: string }`
- `Round`: `{ target: WordItem; options: [WordItem, WordItem]; correctIndex: 0|1 }`
- `GameState`: `{ score: number; strikes: 0|1|2|3; round: number; highScore: number }`
