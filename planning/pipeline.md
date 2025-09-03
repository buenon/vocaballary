# Asset Pipeline Plan (OpenMoji Hybrid)

Purpose: Prepare a curated, categorized subset (~2,000) of OpenMoji color SVGs with a compact manifest, without modifying the vendor pack.

## Inputs
- vendor/openmoji/: Your downloaded OpenMoji color SVG pack (unchanged). Keep LICENSE/ATTRIBUTION files.
- planning/category_quotas.json: Target counts per category (total 2000).
- context.txt: Word selection guidelines and category mapping rules.
- OpenMoji metadata (for names/tags/groups): use the official CSV/JSON from the OpenMoji repo when we execute the pipeline.

## Outputs
- public/assets/svg/<category>/<slug>.svg: Curated, friendly-named copies.
- public/assets/manifest.json: Compact manifest with items like { word, cat, code, path }.
- planning/coverage.json: Selected/missing summary for QA.
- planning/preview-grid.(pdf|png): Optional visual sheet for spot checks.

## Compact manifest schema (for reference)
Each item uses short keys to minimize size:
```json
{
  "version": "1",
  "items": [
    { "word": "apple", "cat": "Fruits & Vegetables", "code": "1F34E", "path": "fruits-vegetables/apple.svg" }
  ]
}
```

## Steps (no code yet)
1) Verify vendor pack
- Ensure vendor/openmoji/ contains the color SVGs and OpenMoji license/attribution files.

2) Acquire metadata
- Use OpenMoji metadata (CSV/JSON) to map codepoints → names, group/subgroup, and tags. Store locally for the run (no commit required).

3) Scan vendor SVGs
- Enumerate SVG files under vendor/openmoji/ color folder(s).
- Extract Unicode codepoint from filename (e.g., "1F34E.svg" → "1F34E").

4) Build candidate list
- Join scan results with metadata by codepoint.
- Filter by word selection guidelines (concrete kid nouns, exclude flags/gestures/UI/adult etc.).
- Keep neutral/default variants when multiple exist.

5) Categorize and quota
- Map each candidate to one of our 14 categories per context.txt rules.
- Fill per-category quotas from planning/category_quotas.json until the global 2,000 target is met.

6) Slug and disambiguation
- Create slugs: lowercase, ASCII, hyphen; singular nouns; strip punctuation.
- Resolve duplicates by suffixing with "-u<unicode>" (e.g., "apple-u1F34E").

7) Copy curated assets
- Copy selected SVGs to public/assets/svg/<category>/<slug>.svg while keeping the vendor pack untouched.

8) Normalize/optimize (curated copies only)
- Ensure each SVG has a viewBox; remove width/height attributes.
- Run SVGO with a conservative preset to preserve appearance.

9) Emit manifest.json (compact)
- For each curated asset, add { word, cat, code, path }.
- Validate against planning/manifest_schema.json.

10) QA artifacts
- Write planning/coverage.json summarizing chosen words, uncovered target words (if any), and counts per category.
- Optionally render a preview grid for quick visual review.

## Notes
- Attribution: Keep OpenMoji LICENSE in vendor and add in README and in-app About/Settings.
- Non-destructive: vendor/openmoji/ remains unchanged.
- Re-runs: the pipeline should be idempotent; curated files are overwritten if regenerated.
