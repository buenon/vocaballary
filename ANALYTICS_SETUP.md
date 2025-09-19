# Google Analytics 4 Setup Guide for Vocaballary

## Quick Setup Steps

### 1. Create Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new account or use existing
3. Create a new **GA4 Property** (not Universal Analytics)
4. Choose "Web" as your platform
5. Enter your website URL (your GitHub Pages URL)
6. Get your **Measurement ID** (starts with `G-XXXXXXXXXX`)

### 2. Update Your Code

Replace `G-XXXXXXXXXX` with your actual Measurement ID in these files:

**File: `index.html`** (2 places)

```html
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<!-- and -->
gtag('config', 'G-XXXXXXXXXX', {
```

**File: `src/config/analytics.ts`**

```typescript
export const GA4_MEASUREMENT_ID = "G-XXXXXXXXXX";
```

### 3. Deploy and Test

1. Build your app: `yarn build`
2. Deploy to GitHub Pages
3. Visit your site and play a few rounds
4. Check Google Analytics Real-time reports (should appear within minutes)

## What's Being Tracked

### Automatic Events

- **Page Views**: When users visit your site
- **Game Start**: When users start a new game
- **Correct/Incorrect Answers**: Each answer attempt with score and round number
- **Game Over**: Final score, high score, strikes, and game duration
- **High Score Achieved**: When a new personal best is set
- **Round Complete**: Word category, correct word, selected word

### Metrics You Can Monitor

- **Unique Users**: Daily, weekly, monthly
- **Page Views**: Total visits to your game
- **Game Sessions**: How many games are played
- **Average Score**: Performance metrics
- **Most Popular Word Categories**: Which vocabulary categories are played most
- **Game Completion Rate**: How often users finish games vs. quit early
- **Average Game Duration**: How long users play

## Privacy & Compliance

This implementation:

- ✅ Only tracks anonymous usage data
- ✅ No personal information collected
- ✅ Follows Google Analytics best practices
- ✅ Can be easily disabled by removing the scripts

## Troubleshooting

### Analytics Not Showing Data

1. **Wait 24-48 hours** for initial data to appear in reports
2. Check **Real-time** reports first (appears within minutes)
3. Verify your Measurement ID is correct in both files
4. Ensure your site is publicly accessible
5. Try incognito/private browsing to test

### Common Issues

- **Wrong ID format**: Make sure it starts with `G-` not `UA-`
- **Blocked by ad blockers**: Some users may have analytics blocked
- **Development vs Production**: Analytics only works on live sites, not localhost

## Advanced Configuration

You can customize tracking by modifying `src/hooks/useAnalytics.ts` and `src/config/analytics.ts` to add more events or parameters as needed.
