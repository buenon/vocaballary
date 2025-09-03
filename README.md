# VocaBall — A Kids Vocabulary Basketball Game

VocaBall is a fun, cartoon-style basketball game that helps kids practice English vocabulary. Each round shows an image at center court and three basketballs at the bottom with different words. Players swipe to shoot the ball labeled with the correct word. Correct shots score points. Misses count as strikes—after three strikes, the game ends. The app tracks the player’s personal best (high score) locally so they can try to beat it.

## Audience

- Ages 6–10
- Non–English speakers (beginner-level English vocabulary)

## Platform

- Mobile web app optimized for touch (phones and small tablets)
- Primary interaction is swipe gesture; tap-and-flick also supported

## Visual & Feel

- Cartoon basketball court and hoop
- Arcade-like ball arc and feedback animations

## Gameplay

1. An image appears at mid-court.
2. Three basketballs at the bottom show different word labels.
3. One label matches the image; its position is randomized each round.
4. Player swipes a ball to shoot:
   - Correct word → the shot scores; +1 point.
   - Wrong word → a strike is recorded.
5. The round advances immediately after a shot. After three strikes, the game ends.
6. High score is stored on the device and shown to encourage replay.

## Content & Language

- Launch language: English only
- Designed for easy future localization (copy isolated and structured)
- Word list and image assets: to be defined
- Categories (e.g., animals, food, objects): to be defined

## Audio

- Voice-over pronunciations for words at/near launch
- Other sound effects can be added later

## Data & Privacy

- High score stored in localStorage
- No analytics or tracking at this time
- No monetization

## Development

### Tech Stack

- React + TypeScript + Vite
- React 19 with Fast Refresh
- ESLint and TypeScript for code quality

### Requirements

- Node.js: v24.7.0 (as per `.nvmrc`)
- Yarn 4 (project uses `"packageManager": "yarn@4.9.4"`)

### Setup

1. Use the correct Node version:
   ```bash
   nvm use
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the dev server:
   ```bash
   yarn dev
   ```
   Open the printed URL (typically `http://localhost:5173`).

### Scripts

- `yarn dev`: Start Vite dev server with HMR.
- `yarn build`: Type-check and build for production (`tsc -b && vite build`).
- `yarn preview`: Preview the production build locally.
- `yarn lint`: Run ESLint across the project.

## Deployment

- Intended target: GitHub Pages
- Steps (basic):
  1. Build the site: `yarn build` (outputs to `dist/`).
  2. Publish `dist/` to GitHub Pages (e.g., via `gh-pages` branch or GitHub Actions).
  3. If deploying to a subpath (e.g., `username.github.io/repo`), ensure Vite `base` is configured accordingly.

## License

TBD. If open-sourcing, choose a license (e.g., MIT). Otherwise, mark as proprietary.

## Attribution

- Emoji artworks from OpenMoji – the open-source emoji and icon project.
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Website: https://openmoji.org

Note on assets
- Original OpenMoji assets were downloaded from the official OpenMoji repository and are stored locally under `vendor/openmoji/` for pipeline use. They are excluded from source control (see `.gitignore`).
- Curated copies used by the app live under `public/assets/svg/` and are committed.
