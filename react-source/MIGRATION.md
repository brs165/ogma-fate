# MIGRATION.md — React → Svelte Migration Spec

> **Purpose:** Self-contained reference for Claude Code to migrate Ogma from React 18 CDN UMD (`h()` calls) to SvelteKit. Every session reads this document. No conversation history needed.
>
> **Source:** `fate-suite-new/` (React, no-build, UMD globals)
> **Target:** `ogma-svelte/` (SvelteKit, component files, Vite build)

---

## Architecture Overview

### Current Stack (React)
- React 18 via CDN UMD — no JSX, all `h()` calls
- No build step, no modules, no imports
- Globals: `window.h`, `window.useState`, `window.BoardApp`, etc.
- State: `useState`, `useEffect`, `useRef` hooks
- Styling: `assets/css/theme.css` (197 KB) + 185 inline `style:{}` objects in renderers
- Data: `core/engine.js` (pure functions), `core/db.js` (Dexie 4 IDB)
- Sync: WebSocket-based multiplayer via `createTableSync()`
- PWA: Service worker in `sw.js`

### Target Stack (Svelte)
- SvelteKit with Vite
- `.svelte` component files with `<script>`, `<template>`, `<style>`
- Svelte stores (`writable`, `derived`) replace custom hooks
- Same CSS file (`theme.css`) imported globally
- Same engine, db, and data files (copy unchanged)
- Same WebSocket sync protocol
- Adapter-static for PWA deployment

---

## Pattern Translation Guide

### State

```
REACT:
var _x = useState(0); var x = _x[0]; var setX = _x[1];
setX(5);
setX(function(prev) { return prev + 1; });

SVELTE:
let x = 0;
x = 5;
x = x + 1;  // reactive by default
```

### Props

```
REACT:
function MyComponent(props) {
  var title = props.title || '';
  var onClose = props.onClose;

SVELTE:
<script>
  export let title = '';
  export let onClose = () => {};
</script>
```

### Effects

```
REACT (run on mount):
useEffect(function() { doThing(); return cleanup; }, []);

SVELTE:
import { onMount, onDestroy } from 'svelte';
onMount(() => { doThing(); });
onDestroy(() => { cleanup(); });


REACT (run when dep changes):
useEffect(function() { recalc(x); }, [x]);

SVELTE:
$: recalc(x);


REACT (derived value):
var total = result != null ? result + mod : null;

SVELTE:
$: total = result != null ? result + mod : null;
```

### Refs

```
REACT:
var ref = useRef(null);
h('div', {ref: ref});
ref.current.focus();

SVELTE:
let ref;
<div bind:this={ref}>
ref.focus();
```

### Conditional Rendering

```
REACT:
condition && h('div', null, 'text')
condition ? h('div', null, 'A') : h('div', null, 'B')

SVELTE:
{#if condition}<div>text</div>{/if}
{#if condition}<div>A</div>{:else}<div>B</div>{/if}
```

### List Rendering

```
REACT:
items.map(function(item) { return h('div', {key: item.id}, item.name); })

SVELTE:
{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}
```

### Events

```
REACT:
h('button', {onClick: fn, onMouseDown: fn2}, 'Click')

SVELTE:
<button on:click={fn} on:mousedown={fn2}>Click</button>
```

### Fragments

```
REACT:
h(Fragment, null, child1, child2)

SVELTE:
(no wrapper needed — just place elements adjacent)
```

### Class Binding

```
REACT:
h('div', {className: 'foo' + (active ? ' active' : '')})

SVELTE:
<div class="foo" class:active>
```

### Style Binding

```
REACT:
h('div', {style: {color: dynamicColor, fontSize: 14}})

SVELTE:
<div style:color={dynamicColor} style:font-size="14px">
```

### Custom Hooks → Svelte Stores

```
REACT:
function useBoardCards(key) {
  var _cards = useState([]); var cards = _cards[0]; var setCards = _cards[1];
  useEffect(function() { loadFromIDB(key).then(setCards); }, []);
  function addCard(c) { setCards(function(p) { return p.concat([c]); }); }
  return { cards, addCard };
}

// In component:
var bc = useBoardCards('mykey');
var cards = bc.cards;

SVELTE (store):
// src/lib/stores/canvasStore.js
import { writable } from 'svelte/store';

export function createCanvasStore(key) {
  const cards = writable([]);
  loadFromIDB(key).then(data => cards.set(data));
  function addCard(c) { cards.update(prev => [...prev, c]); }
  return { cards, addCard };
}

// In component:
const { cards, addCard } = createCanvasStore('mykey');
// Use $cards for auto-subscription
```

---

## File Structure — Target

```
ogma-svelte/
├── src/
│   ├── lib/
│   │   ├── engine.js              ← copy from core/engine.js (no changes)
│   │   ├── db.js                  ← copy from core/db.js (no changes)
│   │   ├── helpers.js             ← extract from ui-board.js L97-206
│   │   ├── stores/
│   │   │   ├── canvasStore.js     ← from useBoardCards
│   │   │   ├── playStore.js       ← from useBoardPlayState
│   │   │   ├── binderStore.js     ← from useBoardBinder
│   │   │   ├── syncStore.js       ← from useBoardSync + createTableSync
│   │   │   └── sessionStore.js    ← from useGeneratorSession
│   │   └── components/
│   │       ├── cards/
│   │       │   ├── CvLabel.svelte
│   │       │   ├── CvTag.svelte
│   │       │   ├── StressRow.svelte
│   │       │   ├── ClockTrack.svelte
│   │       │   ├── Cv4Card.svelte          ← flip container
│   │       │   ├── fronts/
│   │       │   │   ├── NpcMinor.svelte
│   │       │   │   ├── NpcMajor.svelte
│   │       │   │   ├── Scene.svelte
│   │       │   │   ├── Campaign.svelte
│   │       │   │   ├── Encounter.svelte
│   │       │   │   ├── Seed.svelte
│   │       │   │   ├── Compel.svelte
│   │       │   │   ├── Challenge.svelte
│   │       │   │   ├── Contest.svelte
│   │       │   │   ├── Consequence.svelte
│   │       │   │   ├── Faction.svelte
│   │       │   │   ├── Complication.svelte
│   │       │   │   ├── Backstory.svelte
│   │       │   │   ├── Obstacle.svelte
│   │       │   │   ├── Countdown.svelte
│   │       │   │   └── Constraint.svelte
│   │       │   └── BackPanel.svelte        ← GM Guidance
│   │       ├── board/
│   │       │   ├── BoardCard.svelte
│   │       │   ├── BoardLabel.svelte
│   │       │   ├── BoardSticky.svelte      ← extract from BoardCard sticky branch
│   │       │   ├── BoardBoost.svelte       ← extract from BoardCard boost branch
│   │       │   ├── TurnBar.svelte
│   │       │   ├── PlayerRow.svelte
│   │       │   ├── CombatTracker.svelte
│   │       │   ├── PlayPanel.svelte
│   │       │   ├── BinderPanel.svelte
│   │       │   ├── DossierModal.svelte
│   │       │   ├── Topbar.svelte
│   │       │   ├── ExportMenu.svelte
│   │       │   ├── ExportPanel.svelte
│   │       │   ├── ExportPage.svelte
│   │       │   ├── MobileList.svelte
│   │       │   └── CommandPalette.svelte
│   │       ├── panels/
│   │       │   ├── LeftPanel.svelte
│   │       │   ├── StuntPanel.svelte
│   │       │   ├── HelpPanel.svelte
│   │       │   └── GeneratePanel.svelte
│   │       ├── dice/
│   │       │   └── DicePanel.svelte
│   │       ├── player/
│   │       │   └── PlayerSurface.svelte
│   │       ├── campaign/
│   │       │   ├── ResultCard.svelte
│   │       │   ├── ResultHelpPanel.svelte
│   │       │   ├── ExportModal.svelte
│   │       │   ├── SessionPackPanel.svelte
│   │       │   ├── Floater.svelte
│   │       │   └── FatePointTracker.svelte
│   │       └── shared/
│   │           ├── Toast.svelte
│   │           ├── ErrorBoundary.svelte
│   │           └── StuntSuggester.svelte
│   ├── routes/
│   │   ├── +layout.svelte         ← global CSS, theme, fonts
│   │   ├── +page.svelte           ← Landing (from LandingApp)
│   │   └── campaigns/
│   │       └── [world]/
│   │           └── +page.svelte   ← Campaign + Board (from CampaignApp + BoardApp)
│   └── app.html
├── static/
│   ├── assets/css/theme.css       ← copy (already optimized)
│   ├── assets/fonts/              ← copy
│   ├── data/                      ← copy all world data files
│   ├── sw.js                      ← adapt for Vite build
│   └── manifest.json              ← copy
├── svelte.config.js
├── vite.config.js
└── package.json
```

---

## Component Inventory — Migration Tiers

### TIER 0 — Framework-free (copy unchanged)

| File | Lines | Notes |
|------|-------|-------|
| `core/engine.js` | 2,038 | Pure functions. No DOM, no React. Copy to `src/lib/engine.js`. Add `export` to `generate()`, `filteredTables()`, `mergeUniversal()`, `stressFromRating()`, `generatePC()`. |
| `core/db.js` | 1,016 | Dexie 4 wrapper. Copy to `src/lib/db.js`. Add `export` to `DB` object. |
| `data/*.js` | ~8 files | Campaign data. Convert `var CAMPAIGNS = {}` to `export const CAMPAIGNS = {}`. |
| `data/shared.js` | | Shared tables. Same treatment. |
| `data/universal.js` | | Universal merge tables. Same treatment. |
| `assets/css/theme.css` | 2,744 lines | Copy to `static/assets/css/`. Import in `+layout.svelte`. |

### TIER 1 — Leaf Components (no child components)

| React Function | Lines | Target Svelte File | State | Key Notes |
|----------------|-------|--------------------|-------|-----------|
| `cv4Lbl()` | 5 | `CvLabel.svelte` | 0 | Helper → component. Props: `label`, `color`. |
| `cv4Tag()` | 8 | `CvTag.svelte` | 0 | Props: `text`, `color`. |
| `cv4StressTrack()` | 43 | `StressRow.svelte` | 0 | Props: `label`, `hits` (array), `setHits` (callback), `color`. Interactive: click toggles box. |
| `cv4Clock()` | 41 | `ClockTrack.svelte` | 0 | Props: `boxes`, `filled`, `setFilled`, `color`. Interactive: click fills/unfills. |
| `cv4BackPanel()` | ~60 | `BackPanel.svelte` | 0 | Props: `genId`, `catColor`. Static GM guidance text. |
| `BoardLabel` | 59 | `BoardLabel.svelte` | 2 (`editing`, `draft`) | Double-click to edit. Props: `card`, `onUpdate`, `onDelete`, `onDragStart`. |
| `CombatTracker` | 57 | `CombatTracker.svelte` | 0 | Table layout. Props: `players`, `npcCards`, `onToggleActed`, `onToggleNpcActed`. |
| `CommandPalette` | 46 | `CommandPalette.svelte` | 2 (`q`, `sel`) | Props: `actions`, `onClose`. Keyboard nav: ↑↓ Enter Escape. |
| `TpTurnBar` | 29 | (merged into `TurnBar.svelte`) | 0 | Tiny — merge with `BoardTurnBar`. |

### TIER 2 — Composed Components (use Tier 1)

| React Function | Lines | Target Svelte File | State | Dependencies |
|----------------|-------|--------------------|-------|-------------|
| `cv4Card` | ~180 | `Cv4Card.svelte` | 4 (`flipped`, `hovered`, `visible`, `reduced`) | Uses CvLabel, CvTag, StressRow, ClockTrack, BackPanel, and one of 16 front renderers. CSS 3D flip. |
| `cv4FrontNpcMinor` | ~22 | `fronts/NpcMinor.svelte` | 0 | Uses CvLabel, CvTag, StressRow. Props: `data`, `campName`, `catColor`, `ctx`. |
| `cv4FrontNpcMajor` | ~43 | `fronts/NpcMajor.svelte` | 0 | Same pattern, richer layout. |
| *(14 more front renderers)* | 14–65 each | `fronts/*.svelte` | 0–2 | Same pattern per generator type. |
| `BoardCard` | 284 | `BoardCard.svelte` | 2 (`editing`, `draft`) + branches for sticky/boost | Uses Cv4Card. Has 3 card type branches: sticky, boost, generated. Props: `card`, `onDelete`, `onReroll`, `onUpdate`, `onDragStart`, `onInvoke`, `mode`. |
| `BoardPlayerRow` | 117 | `PlayerRow.svelte` | 1 (`expanded`) | Interactive: stress boxes, consequences, FP, concede, compel. |
| `BoardTurnBar` | 120 | `TurnBar.svelte` | 2 (`dragId`, `overId`) | Drag-reorder pills. NPC pills. Round counter. Scene controls. |
| `TpDicePanel` | 240 | `DicePanel.svelte` | 8 states | Phase machine (idle→flicker→reveal→done). Skill pills. Boost button. Invoke badge. Stats. History. Opposition ladder. |
| `BoardExportPanel` | 172 | `ExportPanel.svelte` | 4 (`selected`, `format`, `delivery`, `importText`) | Card checklist. 8 export formats. Copy/download. |
| `BoardHelpPanel` | 178 | `HelpPanel.svelte` | 1 (`openSection`) | Accordion sections: actions, aspects, stress, conflict, optional, advanced, opposition, zones. |
| `BoardStuntPanel` | 146 | `StuntPanel.svelte` | 3 | StuntSuggester integration. |
| `BoardPlayPanel` | 81 | `PlayPanel.svelte` | 0 | Player list + Quick NPC + Starter Scene buttons. |
| `BoardBinderPanel` | 134 | `BinderPanel.svelte` | 2 (`filterGen`, `search`) | Card search/filter, pin/unpin, tray. |
| `BoardDossier` | 117 | `DossierModal.svelte` | 0 | Full-screen card view with action buttons. |
| `BoardExportMenu` | 118 | `ExportMenu.svelte` | 1 (`open`) | Dropdown: Image Pack, Print, JSON. |
| `PlayerSurface` | 389 | `PlayerSurface.svelte` | 7+ | Player device: join wizard (3 steps), character sheet, dice rolling, compel banner, tent mode, aspect creation. |

### TIER 3 — Page-Level Components (compose everything)

| React Function | Lines | Target | State | Notes |
|----------------|-------|--------|-------|-------|
| `BoardTopbar` | 229 | `Topbar.svelte` | 0 (props only) | Mode toggle, sync status, panel toggles, world selector, a11y, export, theme. |
| `BoardMobileList` | 82 | `MobileList.svelte` | 0 | Card list view for mobile. |
| `BoardApp` | 1,473 | `Board.svelte` | 30+ states | **The big one.** Canvas rendering, drag system, pan/zoom, keyboard shortcuts, all floaters, command palette, toast queue, dossier, export page. Split state into stores. |
| `CampaignApp` | 1,718 | `Campaign.svelte` | 40+ states | **Second big one.** Sidebar, generator, result panel, action bar, session pack, board integration. Split state into stores. |
| `LandingApp` | (in HTML) | `Landing.svelte` | 5 | World selector, CRT overlay, hero section. |

### TIER 4 — Stores (extract from custom hooks)

| React Hook | Lines | Target Store | Notes |
|------------|-------|-------------|-------|
| `useBoardCards` | 208 | `canvasStore.js` | Card CRUD, generate, delete, reroll, undo stack, IDB persist. |
| `useBoardPlayState` | 172 | `playStore.js` | Players, turn order, rounds, FP, stress, acted, GM pool. |
| `useBoardBinder` | 146 | `binderStore.js` | Binder cards, tray, pin/unpin, send to canvas/table. |
| `useBoardSync` | 52 | `syncStore.js` | WebSocket connect/disconnect, room code, role. |
| `useGeneratorSession` | 215 | `sessionStore.js` | Active generator, result history, chain rolls, prefs. |
| `useChromeHooks` | 99 | `chromeStore.js` | Toast, theme, SW update, Safari fixes, PWA. |

---

## Critical Patterns to Preserve

### 1. Drag System (direct DOM, not reactive)
The drag system MUST use direct DOM manipulation during drag, with a single store update on drop. This was a deliberate performance fix. In Svelte:
```svelte
<script>
  function onDragStart(e, cardId) {
    const el = e.target.closest('.board-card');
    // During drag: el.style.left/top directly
    // On drop: cards.update(...)
  }
</script>
```

### 2. CSS 3D Flip (Cv4Card)
The card flip uses `perspective`, `rotateY(180deg)`, `backface-visibility: hidden`. Svelte handles this naturally — just bind the `flipped` class and use CSS transitions. The `prefers-reduced-motion` check replaces flip with `display:none` toggle.

### 3. WebSocket Sync Protocol
The sync protocol (player_hello, player_roll, compel_offer, compel_response, player_create_aspect, broadcast_state) must be preserved exactly. The message format is JSON with `{type, ...payload}`. Wrap in a Svelte store that exposes `connect()`, `disconnect()`, `send()`, and a readable `status`.

### 4. Dice Phase Machine
TpDicePanel uses a 4-phase state machine: `idle → flicker → reveal → done`. The flicker phase uses `setInterval` for random face animation. The reveal phase sequences die reveals with `setInterval`. Timers must be cleaned up in `onDestroy`.

### 5. IDB Persistence
Every canvas card, play state, FP state, binder, and tray is persisted to IndexedDB via Dexie. The DB schema is in `core/db.js`. Stores should call `DB.saveSession()` / `DB.loadSession()` in their update functions, same as the React hooks do.

### 6. Card Interactive State
Stress boxes, countdown clocks, contest scores, and consequence treatment checkboxes persist across page reloads via `cardState` on each canvas card. The `onUpdate` callback from `cv4Card` passes interactive state back to `BoardCard`, which calls `updateCard(id, { cardState })`. This must work the same way in Svelte — the card component dispatches state changes upward.

---

## Migration Rules

1. **One component per `.svelte` file.** No multi-component files.
2. **Keep CSS in `theme.css`.** Don't duplicate styles into `<style>` blocks. Exception: component-scoped animations that don't exist in theme.css.
3. **Keep engine.js pure.** No Svelte imports in engine. It's a library.
4. **Keep db.js pure.** No Svelte imports in db. It's a library.
5. **Stores are plain JS files** that export Svelte stores. They can import from engine/db.
6. **Components import stores**, not the other way around.
7. **Preserve all 339 QA assertions** — adapt `tests/qa_named.js` to check `.svelte` files instead of React source.
8. **Preserve the sync protocol exactly** — a React player must be able to connect to a Svelte GM and vice versa during migration.
9. **Preserve all a11y** — `role`, `aria-label`, `aria-pressed`, `aria-expanded`, focus management, `prefers-reduced-motion`.

---

## QA Checklist Per Component

After migrating each component, verify:

- [ ] `npm run dev` compiles without errors
- [ ] Component renders visually correct (compare to React version)
- [ ] All interactive state works (clicks, toggles, inputs)
- [ ] Keyboard navigation works (Enter, Escape, arrow keys where applicable)
- [ ] `prefers-reduced-motion` respected where applicable
- [ ] No console errors or warnings
- [ ] TypeScript/JSDoc types on props (optional but recommended)

---

## Session Prompts for Claude Code

### Session 1: Foundation
```
Read MIGRATION.md. Set up the SvelteKit project structure. Copy engine.js,
db.js, shared.js, universal.js, and all 8 world data files. Convert var
globals to ES module exports. Copy theme.css to static/. Create +layout.svelte
that imports theme.css and sets up the app shell. Verify npm run dev compiles.
```

### Session 2: Tier 1 Leaf Components
```
Read MIGRATION.md. Migrate all Tier 1 leaf components: CvLabel, CvTag,
StressRow, ClockTrack, BackPanel, BoardLabel, CombatTracker, CommandPalette.
Read the React source for each (line ranges in MIGRATION.md), write the
.svelte file. Run npm run dev after each to verify compilation.
```

### Session 3: Card Front Renderers
```
Read MIGRATION.md. Migrate all 16 cv4Front* functions from
core/ui-renderers.js into src/lib/components/cards/fronts/*.svelte.
Each is a pure render function — props in, HTML out. Use the Tier 1
components (CvLabel, CvTag, StressRow) where the React source uses
cv4Lbl(), cv4Tag(), cv4StressTrack(). Run npm run dev after each.
```

### Session 4: Cv4Card + DicePanel
```
Read MIGRATION.md. Migrate cv4Card (the flip container) and TpDicePanel
(the dice roller). cv4Card uses the front renderers from Session 3 and
BackPanel from Session 2. It has CSS 3D flip animation and reduced-motion
support. DicePanel has the flicker→reveal phase machine with setInterval
timers. Both have significant interactive state. Run npm run dev.
```

### Session 5: Board Components (Tier 2)
```
Read MIGRATION.md. Migrate BoardCard, PlayerRow, TurnBar, PlayPanel,
BinderPanel, DossierModal, ExportMenu, ExportPanel, HelpPanel, StuntPanel.
These compose Tier 1 components. BoardCard has 3 branches (sticky, boost,
generated) — consider splitting into BoardSticky.svelte and BoardBoost.svelte.
Run npm run dev after each.
```

### Session 6: Stores (Tier 4)
```
Read MIGRATION.md. Create all Svelte stores: canvasStore (from useBoardCards),
playStore (from useBoardPlayState), binderStore (from useBoardBinder),
syncStore (from useBoardSync + createTableSync), sessionStore (from
useGeneratorSession), chromeStore (from useChromeHooks). Each store exports
writable/derived stores and action functions. Wire IDB persistence.
```

### Session 7: Board.svelte (Tier 3)
```
Read MIGRATION.md. Migrate BoardApp → Board.svelte. This is the largest
component (1,473 lines in React). It composes all Tier 2 board components
and all Tier 4 stores. Key systems: canvas drag (direct DOM), pan/zoom,
keyboard shortcuts (Ctrl+K, Space, R, F, G, Ctrl+Z), toast queue, export
page, dossier modal. The drag system MUST use direct DOM during drag with
a single store update on drop. Run npm run dev.
```

### Session 8: Campaign.svelte + PlayerSurface (Tier 3)
```
Read MIGRATION.md. Migrate CampaignApp → Campaign.svelte and
PlayerSurface → PlayerSurface.svelte. Campaign has the sidebar, generator
panel, result display, action bar, session pack. PlayerSurface has the
join wizard (3 steps), character sheet, dice rolling, compel banner, and
table tent mode. Wire the Board component integration (canvasView toggle).
Run npm run dev.
```

### Session 9: Landing + Routing + PWA
```
Read MIGRATION.md. Create Landing.svelte from the existing index.html
landing page. Set up SvelteKit routing: / for landing, /campaigns/[world]
for campaign pages. Adapt sw.js for Vite build output. Verify manifest.json,
offline support, and service worker registration. Run npm run build and
test with a local preview server.
```

### Session 10: QA + Polish
```
Read MIGRATION.md. Adapt tests/qa_named.js to verify Svelte source files
instead of React source. Run the full QA battery. Fix any compilation
errors, missing props, broken interactions. Verify the sync protocol works
(GM on one tab, player on another). Test all 8 worlds × 16 generators
via smoke test. Verify IDB persistence across page reloads.
```
