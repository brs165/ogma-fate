# Content Authoring — Ogma

> How to add new table entries, create a new campaign world, and validate your work.
> For schema definitions see `docs/data-schema.md`.

---

## Adding table entries to an existing world

Open `src/data/[worldKey].js`. Find the relevant table array and add your entry.

Example — adding a new NPC name to the fantasy world:
```js
// src/data/fantasy.js
names: [
  "Aldric the Grey",
  "Seraphine Dusk",
  "Your New Entry Here",  // add here
]
```

Run QA to validate:
```bash
node scripts/qa-hard.mjs   # must exit 0
```

---

## Adding a new campaign world

### Step 1 — Create the data file

Create `src/data/[worldKey].js`. Copy an existing world (e.g. `fantasy.js`) as a template.

Required top-level keys:
```js
export const CAMPAIGNS = {};
CAMPAIGNS["worldKey"] = {
  meta: {
    id: "worldKey",
    name: "World Name",
    tagline: "One line hook",
    icon: "◈",          // single glyph
    font: "'Inter', sans-serif",
  },
  colors: { /* see data-schema.md */ },
  lightColors: { /* see data-schema.md */ },
  tables: { /* all required tables — see data-schema.md */ },
};
```

### Step 2 — Register in the index

Add to `src/data/index.js`:
```js
import { CAMPAIGNS as worldKey } from './worldKey.js';

export const CAMPAIGNS = {
  ...existingWorlds,
  ...worldKey,   // add here
};
```

### Step 3 — Validate

```bash
node scripts/qa-hard.mjs   # must exit 0
npm run build               # must compile
```

### Step 4 — Add world voice

Add a section to `docs/claude/WORLD-VOICES.md` with:
- Tone and voice description
- What makes this world's aspects different
- Naming conventions
- Things that should never appear in generated content

### Step 5 — Add inspirations

Add a row to `docs/campaign-inspirations.csv` with books, films, shows.

---

## Required tables (all worlds must have these)

See `docs/data-schema.md` for the full required table list and value shapes.

Core required: `names`, `aspects`, `skills`, `locations`, `factions`, `complications`,
`motivations`, `weaknesses`, `secrets`, `stunts`, `scene_aspects`, `zone_descriptions`.

---

## QA commands

```bash
# Content validation — checks all 8 worlds × 17 generators
node scripts/qa-hard.mjs

# Export round-trip
node scripts/qa-export.mjs

# Build check
npm run build
```

All three must pass before merging content changes.

---

## Stunt data format

See `docs/stunt-data-spec.md` for the canonical stunt object shape.
Stunts live in `tables.stunts` in each world file.

---

## World voice guidelines

- Aspects should be 3–8 words (warn), never over 15 (error in QA)
- No `undefined` in any visible field
- Skills must be from the FCon skill list (QA enforces this)
- Major NPC refresh must equal 3 (hardcoded FCon rule)
- Names should feel native to the world — avoid modern English names in fantasy/historical worlds
