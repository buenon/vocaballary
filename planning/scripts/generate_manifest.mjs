#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const vendorJsonPath = path.join(root, 'vendor/openmoji/openmoji.json');
const quotasPath = path.join(root, 'planning/category_quotas.json');
const draftOutPath = path.join(root, 'planning/manifest.draft.json');
const finalOutPath = path.join(root, 'public/assets/manifest.json');
const vendorSvgDir = path.join(root, 'vendor/openmoji/color/svg');
const curatedBase = path.join(root, 'public/assets/svg');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function categorySlug(name) {
  return slugify(name).replace(/-+/g, '-');
}

function stripLeadingColor(word) {
  const colors = ['red','blue','green','yellow','orange','purple','pink','brown','black','white','gray','grey'];
  const parts = word.split(/\s+/);
  if (parts.length > 1 && colors.includes(parts[0])) {
    return parts.slice(1).join(' ');
  }
  return word;
}

function mapCategory(entry) {
  const g = (entry.group || '').toLowerCase();
  const sg = (entry.subgroups || entry.subgroup || '').toLowerCase();

  if (g === 'animals-nature' && sg.startsWith('animal-')) return 'Animals';
  if (g === 'food-drink' && (sg === 'food-fruit' || sg === 'food-vegetable')) return 'Fruits & Vegetables';
  if (g === 'food-drink' && (sg === 'food-prepared' || sg === 'food-asian' || sg === 'food-sweet' || sg === 'drink' || sg === 'dishware')) return 'Food & Drinks';
  if (g === 'animals-nature' && (sg.startsWith('plant-') || sg === 'climate-environment' || sg === 'gardening')) return 'Nature & Plants';
  if (sg === 'sky-weather') return 'Weather';
  if (sg.startsWith('transport-') && sg !== 'transport-sign') return 'Vehicles & Transportation';
  if (sg.startsWith('place-') && sg !== 'place-religious') return 'Places & Buildings';
  if (sg === 'clothing') return 'Clothing & Accessories';
  if (sg === 'book-paper' || sg === 'writing' || sg === 'office' || sg === 'science') return 'School & Learning';
  if (sg === 'computer' || sg === 'phone' || sg === 'light-video' || sg === 'tool' || sg === 'technology' || sg === 'medical' || sg === 'healthcare' || sg === 'sound') return 'Electronics & Tools';
  if (sg === 'household' || sg === 'lock' || sg === 'time' || sg === 'mail') return 'Household Items';
  if ((g === 'activities') && (['game','arts-crafts','sport','musical-instrument','event','award-medal'].includes(sg))) return 'Toys & Games';
  if (sg === 'geometric') return 'Colors & Shapes';
  if (g === 'people-body' && sg === 'body-parts') return 'Body Parts';
  return null;
}

function isExcluded(entry) {
  const g = (entry.group || '').toLowerCase();
  const sg = (entry.subgroups || entry.subgroup || '').toLowerCase();
  const name = (entry.annotation || '').toLowerCase();

  if (g === 'flags' || g === 'smileys-emotion' || g === 'component' || g === 'extras-openmoji' || g === 'extras-unicode') return true;
  if (g === 'symbols' && sg !== 'geometric') return true;
  if (g === 'people-body' && sg !== 'body-parts') return true;
  if (['place-religious','transport-sign','brand','religion','ui-element','alphanum','keycap','punctuation','math','currency','zodiac','av-symbol','symbol-other'].includes(sg)) return true;
  if (sg.startsWith('hand-') || sg === 'hands' || sg === 'person' || sg.startsWith('person-')) return true;
  if (sg === 'monkey-face' || sg === 'cat-face') return true;
  if (name.includes('church') || name.includes('mosque') || name.includes('synagogue') || name.includes('temple')) return true;
  const bannedWords = ['dagger','sword','crossed swords','bomb','boomerang','bow and arrow','shield','water pistol','pistol','gun','rifle'];
  if (bannedWords.some(b => name.includes(b))) return true;
  const alcohol = ['wine','beer','cocktail','tropical drink','sake','champagne','tumbler glass','clinking'];
  if (alcohol.some(b => name.includes(b))) return true;
  const medical = ['syringe','pill','pills','drop of blood','blood'];
  if (medical.some(b => name.includes(b))) return true;
  return false;
}

function copyAndNormalizeSvg(fromPath, toPath) {
  const data = fs.readFileSync(fromPath, 'utf8');
  // Ensure viewBox present; if missing, we keep original (OpenMoji usually has viewBox)
  let out = data.replace(/\swidth=\"[^\"]*\"/g, '').replace(/\sheight=\"[^\"]*\"/g, '');
  fs.mkdirSync(path.dirname(toPath), { recursive: true });
  fs.writeFileSync(toPath, out, 'utf8');
}

function main() {
  const meta = readJson(vendorJsonPath);
  const quotas = readJson(quotasPath);
  const quotaMap = quotas.quotas;
  const categories = Object.keys(quotaMap);

  const buckets = Object.fromEntries(categories.map(c => [c, []]));

  for (const e of meta) {
    if (!e.hexcode || !e.annotation) continue;
    if (isExcluded(e)) continue;
    const cat = mapCategory(e);
    if (!cat || !buckets[cat]) continue;

    let word = e.annotation.toLowerCase();
    word = stripLeadingColor(word);

    const unicode = e.hexcode;
    buckets[cat].push({ word, unicode, cat });
  }

  for (const c of categories) {
    const seen = new Set();
    buckets[c] = buckets[c].filter(item => {
      const key = item.word;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  let available = 0;
  for (const c of categories) {
    const n = buckets[c].length;
    available += n;
    console.log(`${c.padEnd(26)}: available ${String(n).padStart(4)} / quota ${String(quotaMap[c]||0).padStart(4)}`);
  }
  console.log(`Total available after filtering: ${available}`);

  const items = [];
  const usedPaths = new Set();
  for (const c of categories) {
    const target = quotaMap[c] || 0;
    const list = buckets[c] || [];
    const catSlug = categorySlug(c);
    let count = 0;
    for (const it of list) {
      if (count >= target) break;
      let wslug = slugify(it.word);
      if (!wslug) wslug = `item-${it.unicode.toLowerCase()}`;
      let rel = `${catSlug}/${wslug}.svg`;
      if (usedPaths.has(rel)) rel = `${catSlug}/${wslug}-u${it.unicode.toLowerCase()}.svg`;
      usedPaths.add(rel);
      items.push({ word: it.word, cat: c, code: it.unicode, path: rel });
      count++;
    }
  }

  const draft = { version: '1', items };
  fs.mkdirSync(path.dirname(draftOutPath), { recursive: true });
  fs.writeFileSync(draftOutPath, JSON.stringify(draft, null, 2));
  console.log(`Wrote draft ${items.length} items to ${draftOutPath}`);

  // Copy curated SVGs and write final manifest
  const finalItems = [];
  for (const it of items) {
    const src = path.join(vendorSvgDir, `${it.code}.svg`);
    const dst = path.join(curatedBase, it.path);
    if (!fs.existsSync(src)) {
      console.warn(`Missing SVG for code ${it.code} (${it.word})`);
      continue;
    }
    copyAndNormalizeSvg(src, dst);
    finalItems.push(it);
  }
  const final = { version: '1', items: finalItems };
  fs.mkdirSync(path.dirname(finalOutPath), { recursive: true });
  fs.writeFileSync(finalOutPath, JSON.stringify(final, null, 2));
  console.log(`Wrote final ${finalItems.length} items to ${finalOutPath}`);
}

main();
