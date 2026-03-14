# Ogma Architecture Guide

> Technical deep-dive for contributors. Covers the execution model, data flow, React patterns, IndexedDB persistence, the service worker, and the Liquid Glass design system. Read this before touching `core/*.js`.

---

## The One Rule

> **No build step. No server. Works from `file://`.**

Every architectural decision flows from this constraint. It means:

- Raw JavaScript via `<script>` tags - no bundler, no transpiler
- `var` only - `const`/`let` may fail in some `file://` contexts on older browsers
- No ES modules (`import`/`export`) - not supported over `file://` in all browsers
- React 18 via CDN UMD - `ReactDOM.render` is fine; no JSX
- Global variables - `CAMPAIGNS`, `GENERATORS`, `UNIVERSAL`, `HELP_CONTENT` are all globals
- Node.js used for QA only - the actual runtime is the browser

---

## Execution Model

### Script Load Order (Campaign Pages)

```html
<!-- React 18 via CDN UMD - must be first -->
<script src="https://cdnjs.cloudflare.com/.../react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/.../react-dom.production.min.js"></script>

<!-- Data layer - builds CAMPAIGNS global, must be in this order -->
<script src="../data/shared.js?v=N"></script>       <!-- CAMPAIGNS={}, GENERATORS, HELP_CONTENT -->
<script src="../data/universal.js?v=N"></script>     <!-- UNIVERSAL -->
<script src="../data/[campaign].js?v=N"></script>    <!-- CAMPAIGNS["X"] = {...} -->

<!-- Logic and UI - must be after data layer -->
<script src="../core/engine.js?v=N"></script>        <!-- generate(), toMarkdown(), exports -->
<script src="../core/ui.js?v=N"></script>            <!-- React components -->
<script src="../core/db.js?v=N"></script>            <!-- IndexedDB wrapper -->
<script src="../core/intro.js?v=N"></script>         <!-- Intro overlay engine -->
```

`index.html` loads all six campaign data files. The `?v=N` query parameter is stamped by `bump-version.sh` to bust browser and service worker caches.

### Global Namespace

All functions and variables are globals - no module isolation. To prevent collisions:
- Engine functions use descriptive names: `generateMinorNPC`, `mergeUniversal`, `filteredTables`
- Data variables use ALL_CAPS: `CAMPAIGNS`, `UNIVERSAL`, `GENERATORS`, `ALL_SKILLS`
- Internal helpers use underscore prefix: `_fariId()`, `_roll20Id()`

---

## Data Flow

```
User clicks Roll
  │
  ▼
CampaignApp.doRoll()
  │
  ├── genId = activeGen (e.g. "npc_major")
  ├── partySize = settings.partySize (default 4)
  ├── tables = filteredTables(
  │             mergeUniversal(CAMPAIGNS[campId].tables),
  │             tablePrefs  ← from IndexedDB
  │           )
  │
  ▼
generate(genId, tables, partySize)   ← engine.js
  │
  ├── dispatches to generateMajorNPC(tables)
  │   ├── pick(tables.names_first) + pick(tables.names_last)
  │   ├── fillTemplate(tables.major_concepts)
  │   ├── pick(tables.troubles)
  │   ├── fillTemplate(tables.other_aspects) × 3
  │   ├── pickN(ALL_SKILLS, 6) → pyramid
  │   └── pickN(tables.stunts, 2)
  │
  ▼
result = { name, aspects, skills, stunts, physical_stress, mental_stress, refresh }
  │
  ▼
CampaignApp state update
  ├── setResult({ genId, data: result })
  ├── setRolling(true) → 2s animation → setRolling(false)
  └── DB.saveResult(campId, genId, result) → IndexedDB
        │
        ▼
renderResult(genId, data)   ← ui.js
  └── MajorResult({ data })  ← stateful React component
        ├── useState('aspects') for tab
        ├── StressBoxes  ← with local useState for hit tracking
        └── StuntRow × 2
```

---

## React Patterns

### No JSX - Use `h()`

```js
var h = React.createElement;

// JSX equivalent: <div className="card"><span>Hello</span></div>
h('div', { className: 'card' },
  h('span', null, 'Hello')
)
```

### State Declaration Pattern

React Hooks are used, but the UMD build doesn't export them directly. Always destructure:

```js
// useState
var _s = useState(false);
var value = _s[0];
var setValue = _s[1];

// useEffect
useEffect(function() {
  // setup
  return function() { /* cleanup */ };
}, [dependency]);

// useRef
var ref = useRef(null);
```

Do not write `const [value, setValue] = useState(false)` - `const` and destructuring may fail in some `file://` contexts.

### useState Updater Pattern

When new state depends on old state, always use the functional form:

```js
// Correct - safe under React concurrent mode
setScore(function(prev) { return prev + 1; });

// Incorrect - may read stale closure value
setScore(score + 1);
```

This is especially important for the contest victory track and stress box toggling.

### Component Structure

Every result renderer follows this pattern:

```js
function XxxResult(props) {
  var d = props.data;
  // State declarations at the top
  var _tab = useState('aspects'); var tab = _tab[0]; var setTab = _tab[1];
  // Return single root element
  return h('div', null,
    // ...children
  );
}
```

Result renderers receive only `{data}`. They do not receive campaign ID, colour tokens, or any other context. They access campaign theme through CSS custom properties (`var(--accent)`, `var(--c-red)`, etc.).

### Fragment

```js
return h(Fragment, null,
  h('div', null, 'First'),
  h('div', null, 'Second')
);
```

---

## Design System

### CSS Custom Properties Architecture

All design tokens live in `assets/css/theme.css`. Two layers:

**Base tokens (`:root`):**
```css
:root {
  --glass-radius:    16px;
  --glass-radius-sm: 12px;
  --glass-blur:      blur(20px) saturate(160%);
  --glass-blur-sm:   blur(12px) saturate(140%);
  --text-sm:    14px;
  --text-base:  15px;
  --text-md:    16px;
  --font-ui:    'SF Pro Text', -apple-system, sans-serif;
  /* ...etc */
}
```

**Theme tokens (overridden per data-theme and data-campaign):**
```css
[data-theme="dark"] {
  --bg:        #0a0e12;
  --panel:     rgba(255,255,255,0.05);
  --border:    rgba(255,255,255,0.09);
  --glass-bg:  rgba(255,255,255,0.08);
  --glass-border: rgba(255,255,255,0.12);
  --glass-shadow: 0 12px 40px rgba(0,0,0,0.35);
  --glass-inset:  inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.15);
  --text:      #f0f4f8;
  --text-dim:  rgba(255,255,255,0.70);
  --text-muted: rgba(255,255,255,0.50);
  /* ...etc */
}

[data-campaign="cyberpunk"] {
  --accent:    #00b8cc;
  --accent-dim: #005a6a;
  --gold:      #00e5ff;
  --c-red:     #ff2060;
  /* ...etc */
}

[data-theme="light"][data-campaign="cyberpunk"] {
  --accent:    #076478;  /* passes 6.4:1 contrast on white */
  /* ...etc */
}
```

### Liquid Glass Component Pattern

Every glass surface uses the same token stack:

```css
.component {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--glass-radius);
  box-shadow: var(--glass-inset), var(--glass-shadow);
}
```

The specular highlight (planned for BL-36):
```css
.component::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 42%);
  pointer-events: none;
  border-radius: inherit;
}
```

### WCAG Compliance Notes

- `--text-muted` is `rgba(255,255,255,0.50)` dark / `rgba(0,0,0,0.60)` light - set specifically for ≥4.5:1
- Campaign accent colours in light mode are audited individually - `[data-theme="light"][data-campaign="X"]` overrides
- Approved light mode accents: thelongafter `#9A5E10` (5.0:1), cyberpunk `#076478` (6.4:1), fantasy `#856508` (5.2:1)
- Touch targets: all interactive elements set to `min-height: 44px` via sidebar CSS

---

## Pattern G Layout

The current layout for all six campaign pages:

```
app-shell (data-theme, data-campaign, data-gm-mode)
├── topbar (44px sticky)
│   ├── ☰ hamburger (mobile) - toggles sidebar
│   └── "🎲 Ogma · CampaignName [Genre]"
│
├── app-body
│   ├── nav.sidebar (220px desktop / off-canvas mobile)
│   │   ├── GM Mode [ON/OFF badge]
│   │   ├── ◎ FP Tracker
│   │   ├── 📋 History
│   │   ├── [Character generators]
│   │   ├── [Scene generators]
│   │   ├── [Pacing generators]
│   │   ├── [World generators] ← Campaign Guide link above Campaign Issues
│   │   ├── 🎛 Customize | ⚙ Settings | ☀️/🌙 Theme
│   │   ├── [Help] ← Play Intro → Campaign Guide → Rules → D&D → Learn → Home
│   │   └── [About] ← Ogma · License
│   │
│   └── div.content-panel
│       ├── div.roll-hero (ref=rollBtnRef) ← Roll button
│       └── main#main > div.main-layout
│           └── result panel
│
├── [modals: Help, Settings, Tables, History, FP Tracker]
└── button.roll-fab (mobile FAB, IntersectionObserver-driven)
```

**Key state in CampaignApp:**

| State | Default | Purpose |
|-------|---------|---------|
| `showSidebar` | false | Mobile sidebar open/close |
| `gmMode` | true | Shows/hides GM coaching overlays |
| `activeGen` | 'npc_minor' | Currently selected generator |
| `result` | null | Current generator output |
| `rolling` | false | Animation state |
| `showFAB` | false | IntersectionObserver on rollBtnRef |
| `showExport` | false | ShareDrawer visibility |
| `showHelp` | false | HelpModal visibility |
| `showSettings` | false | Settings modal visibility |
| `showTables` | false | Table manager modal visibility |
| `showHistory` | false | History panel visibility |
| `inspireMode` | false | Inspiration mode (3 results) |

**GM Mode behaviour:**
- `gmMode=true`: shows `.gm-note`, `.gm-pill-wrap`, `.gm-guidance`, `.next-step-strip`
- `gmMode=false`: `data-gm-mode="off"` on `app-shell` - CSS hides all GM coaching
- Persisted to `localStorage` via `LS.get('gm_mode')`

**TIMING constants:**
```js
var TIMING = {
  COPY_CONFIRM_MS: 2200,  // "Copied!" confirmation duration
  TOAST_MS:        2500,  // Toast notification duration
  ROLL_MIN_MS:     2000,  // Minimum roll animation duration
  INTRO_REPLAY_MS: 150,   // Delay before replaying intro
};
```

---

## IndexedDB Persistence

`core/db.js` provides a thin wrapper around IndexedDB with localStorage fallback.

### Database Schema

```
Database: "fate_generator_db"
Version:  1

Object Stores:
  "results"   - keyed by campId, stores last result per campaign
  "pinned"    - keyed by campId, stores array of pinned cards
  "prefs"     - keyed by campId, stores table preferences
```

### DB API

```js
DB.saveResult(campId, genId, data)  → Promise
DB.loadResult(campId)               → Promise<{genId, data} | null>
DB.savePin(campId, card)            → Promise
DB.loadPins(campId)                 → Promise<card[]>
DB.removePin(campId, cardId)        → Promise
DB.savePrefs(campId, prefs)         → Promise
DB.loadPrefs(campId)                → Promise<prefs | {}>
```

### localStorage Fallback

`localStorage` is used for lightweight preferences that don't need the full IDB schema:

```js
// Schema: fate_prefs_v1 → { theme, gm_mode, party_size, universal_toggle }
var LS = {
  get:    function(key) { /* parse from fate_prefs_v1 */ },
  set:    function(key, val) { /* write to fate_prefs_v1 */ },
};
```

The migration shim (BL-01) handles upgrading from the old flat `fate_theme` / `fate-theme` keys.

---

## Service Worker

`sw.js` implements a cache-first strategy using `fate-generator-YYYY.MM.B` as the cache key.

### Cache Strategy

1. On install: pre-cache all `APP_SHELL` files
2. On fetch: serve from cache if available; fall back to network; update cache on success
3. On activate: delete old cache versions

### APP_SHELL Must Include

Every file the tool needs to function offline:
- All HTML pages (index, 6 campaigns, 2 static, 8 guides)
- All `data/*.js` files
- All `core/*.js` files
- `assets/css/theme.css`
- `assets/img/og-default.png`
- Favicons
- `manifest.json`

Adding a new campaign file or page without adding it to APP_SHELL causes offline failures. This is checked manually - no automated guard currently exists.

---

## VTT Export Architecture

Two export formats are implemented in `core/engine.js` (end of file):

### Fari JSON (toFariJSON)

Produces a Fari App v4 character object. Also accepted by Foundry VTT "Fate Core Official" importer.

Structure: `{ character: ICharacter }` where `ICharacter` has:
- `id`: random ID
- `name`: character name
- `group`: campaign name
- `pages`: array of pages, each with sections, each with blocks
- `version`: 4 (required by Fari)

Block types used: `Text`, `Skill`, `SlotTracker`, `Number`

Major NPC: 3 pages (Character, Stress & Stunts, GM Notes)
Minor NPC: 2 pages (Character, GM Notes)

### Roll20 JSON (toRoll20JSON)

Produces a Roll20 Developer Mode import blob for the "Fate by Evil Hat" sheet.

Structure: `{ schema_version: 2, type: "character", character: { name, bio, attribs, abilities } }`

The `attribs` array uses Roll20's repeating section convention:
`repeating_aspects_<rowId>_aspect-name` / `aspect-value`
`repeating_skills_<rowId>_skill-name` / `skill-value`
`repeating_stunts_<rowId>_stunt-name` / `stunt-description` / etc.

**Both functions:**
- Return `null` for non-NPC generator IDs
- Are only called from `ShareDrawer` when `isNpc` is true
- Live in `core/engine.js` (already in APP_SHELL)

---

## Versioning

**CalVer:** `YYYY.MM.B` - year, month, build-within-month. Examples: `2026.03.1`, `2026.03.12`.

`bump-version.sh` auto-detects the current version and increments `B`. It updates:
- `sw.js` - cache key string
- `about.html` - displayed version
- All `?v=N` parameters in HTML script tags (via sed)

Never bump mid-sprint. One bump per release.

---

## QA Battery

### Smoke Test (96/96)

Runs all 16 generators × 6 campaigns = 96 combinations. Confirms each returns a non-null, non-undefined object. Runs in Node (~100ms).

### Named Assertions (18/18)

`qa_named.js` in project root. Covers:
- NA-01: Minor NPC stress ≤ 3 (all 6 campaigns)
- NA-02: Major NPC refresh formula correct (all 6 campaigns)
- NA-03: No stunt charges a Fate Point
- NA-04: Contest tie result contains no "twist aspect" text
- NA-05: toMarkdown produces >20 chars for all 96 combinations
- NA-06: No generator output contains "significant milestone"
- NA-07: Postapoc faction name arrays have no duplicates

### Stress Test (19,200 runs)

Runs 19,200 random generator calls. Checks zero crashes and zero undefined results. Run when making engine changes - not required for data-only changes.

### VTT Export Tests

```js
// Fari: 12 combinations (2 NPC types × 6 campaigns)
// Validates: JSON parseable, character key, pages array, version=4, name present

// Roll20: 12 combinations
// Validates: JSON parseable, character key, attribs array, character_name, schema_version=2

// Non-NPC null guard: 10 checks (5 non-NPC generators × 2 export functions)
// Validates: returns null, not an object or error
```

---

*Document version: 2026.03.12*
