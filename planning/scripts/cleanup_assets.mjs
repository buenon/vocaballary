#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'public/assets/manifest.json');
const svgBase = path.join(root, 'public/assets/svg');
const reportPath = path.join(root, 'planning/cleanup_report.json');

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJson(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2)); }

function basenameNoExt(p) { return path.basename(p, path.extname(p)); }
function dirname(p) { return path.dirname(p).replaceAll('\\', '/'); }

const slugOverrides = new Map([
  ['front-facing-baby-chick', 'chick'],
  ['baby-chick', 'chick'],
  ['hatching-chick', 'chick'],
  ['lady-beetle', 'ladybug'],
  ['one-piece-swimsuit', 'swimsuit'],
  ['high-heeled-shoe', 'shoe'],
  ["man-s-shoe", 'shoe'],
  ['folding-hand-fan', 'fan'],
  ['graduation-cap', 'cap'],
  ['video-game', 'game'],
  ['teddy-bear', 'teddy'],
  ['pool-8-ball', 'eightball'],
  ['yo-yo', 'yoyo'],
  ['shopping-cart', 'cart']
]);

const tokenStopwords = new Set([
  'front','facing','frontfacing','baby','hatching','high','heeled','one','piece',
  'folding','hand','military','video','american','soft','french','japanese',
  'red','blue','green','yellow','orange','purple','pink','white','black','brown','gray','grey',
  'light','dark','with','and','of','hot','cold','mobile','desktop','cap'
]);

function simplifyWord(word, cat) {
  const w = word.trim().toLowerCase();
  // Use overrides where possible
  for (const [from, to] of slugOverrides.entries()) {
    if (w.replace(/\s+/g, '-') === from) return to;
  }
  // Default: last token after removing stopwords
  const toks = w.split(/\s+/).filter(t => !tokenStopwords.has(t));
  if (toks.length === 0) return w.replace(/\s+/g, '');
  return toks[toks.length - 1];
}

function simplifySlug(slug, cat) {
  if (slugOverrides.has(slug)) return slugOverrides.get(slug);
  // normalize yo-yo -> yoyo
  slug = slug.replace(/yo-yo\b/, 'yoyo');
  const toks = slug.split('-').filter(t => !tokenStopwords.has(t));
  if (toks.length === 0) return slug;
  return toks[toks.length - 1];
}

function main() {
  const manifest = readJson(manifestPath);
  const items = manifest.items;

  const actions = { removed: [], renamed: [], wordChanged: [], skipped: [] };

  // Remove explicit redundant: front-facing-baby-chick if chick exists
  const idxFF = items.findIndex(it => it.path.endsWith('front-facing-baby-chick.svg'));
  if (idxFF !== -1) {
    const filePath = path.join(svgBase, items[idxFF].path);
    if (fs.existsSync(filePath)) fs.rmSync(filePath);
    actions.removed.push({ reason: 'redundant-variant', item: items[idxFF] });
    items.splice(idxFF, 1);
  }

  // Build path set for collision detection
  const pathSet = new Set(items.map(it => it.path));

  // Remove face variants where base exists
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    const slug = basenameNoExt(it.path);
    if (!slug.endsWith('-face')) continue;
    const baseSlug = slug.replace(/-face$/, '');
    const basePath = path.join(dirname(it.path), `${baseSlug}.svg`).replaceAll('\\', '/');
    if (pathSet.has(basePath)) {
      const filePath = path.join(svgBase, it.path);
      if (fs.existsSync(filePath)) fs.rmSync(filePath);
      actions.removed.push({ reason: 'face-duplicate', item: it });
      items.splice(i, 1);
      pathSet.delete(it.path);
    }
  }

  // Rename to single-word slugs and adjust words
  for (const it of items) {
    const dir = dirname(it.path);
    const slug = basenameNoExt(it.path);
    const desiredSlug = simplifySlug(slug, it.cat);
    const desiredWord = simplifyWord(it.word, it.cat);

    // Update word if simplified
    if (desiredWord !== it.word) {
      actions.wordChanged.push({ from: it.word, to: desiredWord, code: it.code, cat: it.cat });
      it.word = desiredWord;
    }

    if (desiredSlug !== slug) {
      let newRel = `${dir}/${desiredSlug}.svg`;
      // avoid collisions
      if (pathSet.has(newRel)) {
        newRel = `${dir}/${desiredSlug}-u${it.code.toLowerCase()}.svg`;
      }
      const oldAbs = path.join(svgBase, it.path);
      const newAbs = path.join(svgBase, newRel);
      fs.mkdirSync(path.dirname(newAbs), { recursive: true });
      if (fs.existsSync(oldAbs)) fs.renameSync(oldAbs, newAbs);
      pathSet.delete(it.path);
      it.path = newRel;
      pathSet.add(newRel);
      actions.renamed.push({ from: slug, to: desiredSlug, code: it.code, cat: it.cat });
    }
  }

  writeJson(manifestPath, { ...manifest, items });
  writeJson(reportPath, actions);
  console.log(`Cleanup done. Removed: ${actions.removed.length}, Renamed: ${actions.renamed.length}, WordChanged: ${actions.wordChanged.length}. Report at ${reportPath}`);
}

main();
