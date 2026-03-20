# Ogma Architecture Guide

> Technical deep-dive for contributors. Covers the execution model, data flow, React patterns, IndexedDB persistence, the service worker, and the Liquid Glass design system. Read this before touching `core/*.js`.

---

## Architecture

> **HTTPS-first. Offline after first load. No backend.**

As of v91, `file://` support is dropped. Ogma requires a web server (GitHub Pages, localhost, etc.) for first load. Service worker caches everything for full offline use afterward.

**Current state (post-SPA Sprint 3, v96+):**
- Raw JavaScript via `<script>` tags — no bundler, no transpiler
- `const`/`let`, arrow functions, destructuring in all 4 split UI files (`ui-primitives`, `ui-renderers`, `ui-modals`, `ui-landing`). `ui.js` and `core/*.js` remain `var`-based.
- React 18 via CDN UMD — no JSX. `React.createElement` aliased as `h`.
- Global variables — `CAMPAIGNS`, `GENERATORS`, `UNIVERSAL`, `HELP_CONTENT`
- History API routing via SPA router in `index.html`
- `shared-lite.js` (2.8KB) for landing page bootstrap — full `shared.js` loaded only on campaign pages
- Node.js used for QA only — the actual runtime is the browser

**SPA-06 parked:** `var` globals → JSON modules migration requires `<script type="module">` across all HTML files. Blocked pending decision. Revisit with Vite/bundler question.

---

## Execution Model

### Script Load Order (Campaign Pages)

```html
<!-- React 18 via CDN UMD - must be first -->
<script src="https://cdnjs.cloudflare.com/.../react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/.../react-dom.production.min.js"></script>
<!-- Dexie 4 IDB wrapper -->
<script src="https://cdnjs.cloudflare.com/.../dexie.min.js"></script>

<!-- Data layer - builds CAMPAIGNS global, must be in this order -->
<script src="../data/shared.js?v=N"></script>           <!-- CAMPAIGNS={}, GENERATORS, HELP_CONTENT -->
<script src="../data/universal.js?v=N"></script>         <!-- UNIVERSAL -->
<script src="../data/[campaign].js?v=N"></script>        <!-- CAMPAIGNS["X"] = {...} -->

<!-- Logic layer -->
<script src="../core/engine.js?v=N"></script>            <!-- generate(), toMarkdown(), toFariJSON() -->
<script src="../core/db.js?v=N"></script>                <!-- Dexie 4 IDB wrapper -->

<!-- UI layer — split from original ui.js in SPA-02 (v94) -->
<script src="../core/ui-primitives.js?v=N"></script>     <!-- h alias, TIMING, emoji icons, FD primitives -->
<script src="../core/ui-renderers.js?v=N"></script>      <!-- 16 result renderers + StuntSuggester + renderResult() -->
<script src="../core/ui-modals.js?v=N"></script>         <!-- Modal, ShareDrawer, KBShortcuts, Settings, Vault, QuickFind -->
<script src="../core/ui-landing.js?v=N"></script>        <!-- CAMPAIGN_PAGES/INFO + LandingApp -->
<script src="../core/ui.js?v=N"></script>                <!-- TableManagerModal + CampaignApp -->
<script src="../core/intro.js?v=N"></script>             <!-- Intro overlay engine — must follow ui.js -->
```

`index.html` loads `data/shared-lite.js` (2.8KB) as a landing bootstrap. Full data files load dynamically when a campaign route is detected (SPA-05, v96). The `?v=N` query parameter is stamped by `bump-version.sh` to bust browser and service worker caches.

### Global Namespace

All functions and variables are globals - no module isolation. To prevent collisions:
- Engine functions use descriptive names: `generateMinorNPC`, `mergeUniversal`, `filteredTables`
- Data variables use ALL_CAPS: `CAMPAIGNS`, `UNIVERSAL`, `GENERATORS`, `ALL_SKILLS`
- Internal helpers use underscore prefix: `_fariId()`, `_rng()`

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

Currently using `var` pattern: `var _s = useState(false); var val = _s[0]; var setVal = _s[1];` — this will migrate to `const [val, setVal] = useState(false)` during the Sprint 3 ES Modules pass.

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

### Accessibility — WCAG 2.1 AA + Apple HIG

Ogma targets **WCAG 2.1 AA** as its binding standard. Apple HIG applies on top for touch/mobile. WCAG 3.0/APCA is not used (working draft, no jurisdiction requires it).

**Design tokens for compliant colour usage:**

| Token | Dark value | Light value | Min contrast | Purpose |
|-------|-----------|-------------|-------------|---------|
| `--text` | `#FFFFFF` | `#1D1D1F` | 21:1 / 16:1 | Primary body text |
| `--text-dim` | `rgba(255,255,255,0.65)` | `rgba(0,0,0,0.55)` | 8.6:1 / 4.7:1 | Secondary text |
| `--text-muted` | `rgba(255,255,255,0.55)` | `rgba(0,0,0,0.60)` | 6.3:1 / 5.2:1 | Muted/hint text |
| `--section-hdr` | `var(--accent-dim)` | `#555` per world | ≥4.5:1 | Section header labels (fd-hdr) |
| `--focus-ring` | `#A0A0A0` per world | per world | ≥3:1 on bg | Focus indicator outline |

**Focus ring system (`--focus-ring`):**
The global `:focus-visible` rule uses `var(--focus-ring)` not `var(--accent)`. `--focus-ring` is defined per-theme to guarantee ≥3:1 against that theme's background, in a hue similar to the accent colour. Dark default: `#A0A0A0` (7.6:1 on `#000`). Light default: `#404040` (13.7:1 on `#F2F2F7`). Every campaign override also defines `--focus-ring`.

**Touch target sizing:**
- Primary actions (`.btn`, sidebar nav items, generator buttons): `min-height:44px` — meets HIG
- Interactive game controls (stress boxes `.fd-box`, score boxes `.contest-box`, tick boxes `.cd-box`): 48×48px — NA-52–55 assert this
- Floater chrome (minimise/close buttons): `44×44px` inline style — HIG compliant
- Dense tool chrome on mouse: `@media(pointer:fine)` reduces vault row buttons to 28px
- `btn-xs` class: `min-height:0` — only used on ShareDrawer export buttons where 44px would break layout; explicitly accepted exception

**Typography floors:**
- Semantic labels: 11px (`--text-label` is 12px). No class may use `font-size:9px` — NA-68 asserts this.
- Body text: 12px minimum. Standard body: 15px (`--text-base`).
- Decorative badge/chrome: 10px minimum (streak badges, full-session badge).

**System preferences:**
- `prefers-reduced-motion`: global `@media` in `theme.css` sets animation/transition to 0.01ms. `intro.js` checks it individually. NA-69 asserts `prefers-color-scheme` respect.
- `prefers-color-scheme`: first load defaults to system appearance. Stored preference overrides. See `ui-primitives.js` `initTheme`.
- iOS safe areas: `env(safe-area-inset-bottom)` on Floater body and PWA nudge. `@supports` wrapped.

**Campaign accent audit (light mode):**
All campaign light mode accents verified ≥4.5:1 against `#F2F2F7`:

| World | Light accent | Ratio |
|-------|-------------|-------|
| The Long After | `#9A5E10` | 4.73:1 |
| Neon Abyss | `#076478` | 6.06:1 |
| Shattered Kingdoms | `#856508` | 5.20:1 |
| Void Runners | `#7C3ACD` | 5.63:1 |
| The Gaslight Chronicles | `#8A6512` | 4.93:1 |
| The Long Road | `#A04D12` | 5.40:1 |
| Dust and Iron | `#8B4513` | 6.36:1 |
| dVenti Realm | `#8B1A10` | 8.35:1 |

**WCAG vs HIG resolved conflicts (owner decisions):**
See `devdocs/team-prompt.md` §Accessibility for the full conflict table and resolution rationale.

---



### OGMA Topbar Brand

All 18 pages display the full acronym "On-demand Generator for Masterful Adventures" with the four initials bold at 15px, surrounding words at 13px, all in `var(--accent)`:

```css
.topbar-ogma { color: var(--accent); font-size: 13px; font-weight: 400; }
.topbar-ogma strong { font-weight: 800; font-size: 15px; }
```

React pages (LandingApp, CampaignApp, sessionzero) render it via `h('span', {className: 'topbar-ogma'}, ...)`.
Static HTML pages have the markup inlined directly in the `<a class="land-topnav-brand">` element.

## Icons

All sidebar generator icons, toolbar buttons, and landing page cards use native emoji. No icon font dependency — zero external requests, fully offline.

```js
// In core/ui.js
var RA_ICONS = {
  npc_minor: '👤',
  npc_major: '👑',
  encounter: '⚔',
  // ... one entry per generator + UI chrome key
};

function RaIcon(props) {
  var icon = RA_ICONS[props.n] || props.n || '';
  return h('span', {className: 'icon-emoji', 'aria-hidden': 'true'}, icon);
}

// Usage
h(RaIcon, {n: 'encounter'})        // renders ⚔ via RA_ICONS lookup
h(RaIcon, {n: RA_ICONS.npc_minor}) // renders 👤 directly
```

Icons are always accompanied by a visible text label or an `aria-label` on the parent button — never icon-only without accessible text.

RPG Awesome was removed in v91. Historical references in `devdocs/ideadump.md` and `devdocs/CHANGELOG.md` are kept for context.

---
## Idea Dump

`devdocs/ideadump.md` — team scratchpad for ideas that have been discussed but are not yet on the active roadmap. Ideas land here, get context, and either get promoted to `BACKLOG.md` or move to the graveyard section. See the file for current entries.

---

## Pattern G Layout

The current layout for all seven campaign pages:

```
app-shell (data-theme, data-campaign, data-gm-mode)
├── topbar (44px sticky)
│   ├── ☰ hamburger (mobile) - toggles sidebar
│   └── "🎲 Ogma · CampaignName [Genre]"
│
├── app-body
│   ├── nav.sidebar (220px desktop / off-canvas mobile)
│   │   ├── ◎ FP Tracker
│   │   ├── 📋 History
│   │   ├── [Character generators]
│   │   ├── [Scene generators]
│   │   ├── [Pacing generators]
│   │   ├── [World generators] ← Campaign Guide link above Campaign Frame
│   │   ├── 🎛 Customize | ⚙ Settings | ☀️/🌙 Theme
│   │   ├── [Help] ← Play Intro → Campaign Guide → Rules → D&D → Learn → Home
│   │   └── [About] ← Ogma · License
│   │
│   └── div.content-panel
│       ├── div.action-bar (ref=rollBtnRef) ← Roll + Inspire + secondary buttons
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
| `activeGen` | 'npc_minor' | Currently selected generator |
| `result` | null | Current generator output |
| `rolling` | false | Animation state |
| `showFAB` | false | IntersectionObserver on action-bar ref |
| `showExport` | false | ShareDrawer visibility |
| `showHelp` | false | HelpModal (Rules) visibility |
| `showKbShortcuts` | false | KBShortcutsModal visibility (? key) |
| `showVault`       | false | Vault panel visibility |
| `showSidebar`     | false | Mobile sidebar panel visibility |
| `showQuickFind`   | false | Quick Find overlay (/ key) |
| `showSettings` | false | Settings modal visibility |
| `showTables` | false | Table manager modal visibility |
| `showHistory` | false | History panel visibility |
| `showFP` | false | Fate Point tracker panel visibility |
| `showIntroModal` | true | Intro CRT modal popup on page load |
| `seedResultDone` | false | URL seed auto-generation complete flag |
| `packRolling` | false | Quick Prep Pack packet generating |
| `sessionPack` | null | Quick Prep Pack packet result (seed+countdown+compel) |
| `inspireMode` | false | Inspiration mode (3 results) |

> **Note:** A full `openPanel` consolidation (null \| string) was designed in 2026.03.17 but reverted by a .bak restore. Current code uses separate boolean states. If you attempt to consolidate again, do not restore from .bak files — they will undo it.

**ResultHelpPanel (RHP-01, v106):**
GM Mode and Help Level were removed in v106. Replaced by `ResultHelpPanel` — a 2-column bottom sheet always visible below every result card. Three tabs: What·GM (default), New here?, D&D?. Tab selection persisted to `localStorage` via `LS.get('rhp_tab')`. No pre-configuration required.

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
- All HTML pages (index, 7 campaigns, 2 static, 8 guides, 8 wiki pages)
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

Major NPC: 3 pages (Character, Stress & Consequences, GM Notes)
Minor NPC: 2 pages (Character, GM Notes)

`toFariJSON` returns `null` for non-NPC generator IDs and is only called from `ShareDrawer` when `isNpc` is true. Lives in `core/engine.js`.

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

### Smoke Test (112/112)

Runs all 16 generators × 7 campaigns = 112 combinations. Confirms each returns a non-null, non-undefined object. Runs in Node (~100ms).


### KBShortcutsModal

Opened by:
- Sidebar "KB Shortcuts" button (was "Rules" before 2026.03.26)
- `?` key (was opening HelpModal/Rules before 2026.03.26)
- `setShowKbShortcuts(true)` — separate boolean state, not part of openPanel

Content: 6 keyboard shortcuts (Space, G, P, I, ?, Esc). Lightweight; uses the shared `Modal` + `ModalHeader` components.

### Named Assertions

> Current count: 23. **Always check `qa_named.js` for the live list** — the count grows as new assertions are added.

`qa_named.js` in project root. Covers at minimum:
- NA-01: Minor NPC stress ≤ 3 (all 7 campaigns)
- NA-02: Major NPC refresh formula correct (all 7 campaigns)
- NA-03: No stunt charges a Fate Point
- NA-04: Contest tie result contains no "twist aspect" text
- NA-05: `toMarkdown` produces >20 chars for all 112 combinations
- NA-06: No generator output contains "significant milestone"
- NA-07: Postapoc faction name arrays have no duplicates
- NA-08: `toBatchFariJSON` valid JSON, version:4, correct character count, null guard
- NA-09: Intro responsive scale — 4 assertions covering CSS classes and breakpoints
- Additional assertions planned for UX-01/UX-04/UX-10 (noscript, aria-live, theme-toggle aria-label)

### Stress Test (19,200 runs)

Runs 19,200 random generator calls. Checks zero crashes and zero undefined results. Run when making engine changes - not required for data-only changes.

### VTT Export Tests

```js
// Fari: 14 NPC combinations (2 NPC types × 7 campaigns)
// Validates: JSON parseable, FariEntity envelope, version=4, UUID v4 IDs

// Batch: 6 campaign tests (2 NPCs + 1 scene per campaign)
// Validates: envelope array, character count, version=4

// Non-NPC null guard: toFariJSON returns null for non-NPC generators
```

---

*Document version: see devdocs/CHANGELOG.md*
