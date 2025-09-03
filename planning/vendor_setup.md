# Vendor Setup (OpenMoji)

Place your downloaded OpenMoji Color SVG pack here:

vendor/openmoji/
├─ LICENSE (from OpenMoji)
├─ README or ATTRIBUTION (from OpenMoji)
└─ color/
   └─ svg/
      ├─ 1F34E.svg   (apple)
      ├─ 1F431.svg   (cat)
      ├─ 270F.svg    (pencil)
      └─ ...

Optional (recommended for accurate names/tags):
- vendor/openmoji/metadata.json or openmoji.csv
  - This is the official OpenMoji metadata file from their repo (contains name, group, subgroup, tags per codepoint).

Notes
- Do not modify or optimize files inside vendor/openmoji/.
- The curated subset will be copied into public/assets/svg/ and may be optimized.
- Attribution and license files must remain in vendor/openmoji/ unchanged.
