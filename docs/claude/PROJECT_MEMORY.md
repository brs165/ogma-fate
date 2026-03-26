# Project Memory — Ogma SvelteKit

Persistent context for model-switching and session handoffs.
Last updated: March 2026 (post Svelte 5 migration + SvelteFlow integration).

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit + Svelte 5.51.0 (runes mode — `$state`, `$derived`, `$props`, `$effect`) |
| Build | Vite 7, `@sveltejs/adapter-static`, `npx vite build` |
| Canvas | `@xyflow/svelte` (Svelte Flow) — pan/zoom/connect/minimap |
| UI Primitives | `bits-ui@2.16.3` — headless accessible components |
| State | Svelte stores (`writable`, `derived`) in plain JS + `$state` in components |
| Persistence | Dexie 4 (IndexedDB) |
| Sync | WebSocket multiplayer via PartySocket |
| Styling | Global `static/assets/css/theme.css` — no `<style>` blocks |
| PWA | `static/sw.js` service worker + `static/manifest.json` |
| Deploy | Cloudflare Pages (auto-deploy from `main`), `static/_redirects` for SPA routing |

---

## File paths

```
src/lib/engine.js           Pure-function content generator (no Svelte imports)
src/lib/db.js               Dexie 4 IndexedDB wrapper (no Svelte imports)
src/lib/helpers.js          Shared utility functions
src/lib/stores/             6 Svelte stores (canvas, play, binder, sync, session, chrome)
src/lib/components/         51+ .svelte components across 7 directories
src/lib/components/board/nodes/   4 SvelteFlow custom node components
src/data/                   11 campaign data modules (ES exports)
src/routes/                 SvelteKit route pages
src/routes/+layout.js       export const ssr = false; export const prerender = false;
static/assets/css/theme.css Global stylesheet — ALL styling lives here
static/sw.js                Service worker — cache name updated by bump-version.sh
static/_redirects           Cloudflare Pages SPA routing: /* /index.html 200
scripts/bump-version.sh     Version bump script — run before every zip delivery
```

---

## Svelte 5 runes rules (CRITICAL)

All 51 components are on Svelte 5 runes. These rules apply everywhere:

- `let x = $state(value)` — ALL mutable local state (never plain `let` for mutated vars)
- `let x = $derived(expr)` — computed values (reactive, no `$state` needed)
- `let { prop = default } = $props()` — component props (never `export let`)
- `$effect(() => { ... })` — side effects (replaces `$: { ... }`)
- `onclick={}` not `on:click={}` — Svelte 5 event syntax
- `{@render children?.()}` not `<slot />` — snippet rendering
- **NO `$state()` inside function bodies** — only at component top level
- **NO `<svelte:options runes={false} />`** — zero legacy components remain

---

## SvelteFlow canvas architecture

Cards are stored in IDB as `{ id, genId, title, summary, data, x, y, z, ts, gmOnly }`.
SvelteFlow receives them as derived stores:

```
canvasStore.cards (writable)
  → canvasStore.nodes (derived) — maps x/y → position, passes full card as data
  → canvasStore.edges (derived) — from canvasStore.connectors

Board.svelte:
  flowNodes = writable([])   ← MUST be writable store, NOT $state([])
  flowEdges = writable([])   ← MUST be writable store, NOT $state([])
  canvas.nodes.subscribe(v => flowNodes.set(v))
  canvas.edges.subscribe(v => flowEdges.set(v))
```

**Critical:** SvelteFlow subscribes to `nodes`/`edges` internally. They MUST be Svelte
writable stores. `$state([])` does not work — SvelteFlow won't react to updates.

Node components live in `src/lib/components/board/nodes/`:
- `CardNode.svelte` — all generator cards (21 genIds map to this)
- `StickyNode.svelte` — free-text aspect stickies
- `BoostNode.svelte` — boost cards with invoke counter
- `LabelNode.svelte` — section labels

Node type registry: `src/lib/components/board/nodeTypes.js`
**Must be module-level stable object — never inside a component or reactive block.**

Card components (BoardCard, BoardSticky, BoardBoost) MUST NOT have:
- `style="left:{x}px; top:{y}px"` — SvelteFlow positions nodes, not the card
- `onmousedown` drag handlers — SvelteFlow handles dragging
- `position:absolute` in CSS — SvelteFlow node containers handle layout

---

## Store inventory

| Store | File | Purpose |
|-------|------|---------|
| Canvas | `canvasStore.js` | Card CRUD, generate, connectors, IDB persist, SF derived stores |
| Play | `playStore.js` | Players, turn order, rounds, fate points, stress, GM pool |
| Binder | `binderStore.js` | Saved cards, tray, pin/unpin, send to canvas |
| Sync | `syncStore.js` | WebSocket connect/disconnect, room code, role |
| Session | `sessionStore.js` | Active generator, result history, chain rolls, prefs |
| Chrome | `chromeStore.js` | Toast queue, theme toggle, SW update, PWA lifecycle |

---

## Component inventory (54 files)

| Directory | Count | Key components |
|-----------|-------|---------------|
| `cards/` | 6 | CvLabel, CvTag, StressRow, ClockTrack, Cv4Card, BackPanel |
| `cards/fronts/` | 18 | NpcMinor…Custom, Pc |
| `board/` | 18 | Board, BoardCard, BoardSticky, BoardBoost, BoardLabel + 13 others |
| `board/nodes/` | 4 | CardNode, StickyNode, BoostNode, LabelNode (SvelteFlow nodes) |
| `campaign/` | 3 | Campaign, FatePointTracker, Landing |
| `panels/` | 1 | LeftPanel |
| `dice/` | 1 | DicePanel |
| `player/` | 1 | PlayerSurface |
| `shared/` | 2 | HelpDiceRoller, Footer |

---

## Known issues / backlog

### 🔴 Critical (fix immediately)
- **BL-SF-01:** Cards double-displaced — BoardCard/Sticky/Boost still have `left/top` style + `position:absolute`. Remove and let SvelteFlow position them.
- **BL-SF-02:** Drag conflict — BoardCard/Sticky still have `onmousedown` drag handlers fighting SvelteFlow.
- **BL-SF-03:** MiniMap unstyled — no `nodeColor` function, all nodes appear grey.

### 🟡 Important
- **BL-SF-04:** Context menu screen coords — uses `screenX/Y` (viewport), should use canvas coords.
- **BL-SF-05:** No `on:nodeclick` z-index — clicked cards don't come to front.
- **BL-SF-06:** Multi-select toolbar — wire `on:selectionchange` for batch delete/send to table.
- **BL-01:** localStorage schema — structured prefs object.
- **BL-03:** Victorian adjective pass — content quality.
- **BL-07:** GM Tips depth — richer help content.

### 🟢 Improvements
- **BL-SF-07:** Edge labels — relationship types (Knows/Opposes/Ally).
- **BL-SF-08:** Snap-to-grid toggle — `snapToGrid snapGrid={[20,20]}`.
- **BL-SF-09:** NodeResizer on major cards.
- **BL-05:** Stunt UI improvements.
- **BL-06:** Shareable links.
- **BL-08:** Western world expansion.
- **BL-16:** Ogma rebrand.

---

## Deployment

- **URL:** ogma.net
- **Platform:** Cloudflare Pages — auto-deploys from `main` branch
- **Build command:** `npm run build` (runs `bash scripts/bump-version.sh && npx vite build`)
- **Build output:** `build/`
- **SPA routing:** `static/_redirects` → `/* /index.html 200`
- **Service worker:** `static/sw.js` — cache name bumped by `scripts/bump-version.sh`
- **GitHub Pages:** DISABLED (deploy.yml.disabled)

## Version format: `YYYY.MM.NNN` (e.g. `2026.03.575`)
## Zip naming: `YYYY.MM.NNN.zip` (e.g. `2026.03.576.zip`)

---

## Session startup

```bash
# 1. Orient
pwd && git branch && git log --oneline -3

# 2. Health check
npm run build 2>&1 | tail -5

# 3. Read live files
# Always fetch from GitHub before editing:
# https://raw.githubusercontent.com/brs165/ogma-fate/main/static/assets/css/theme.css
# https://raw.githubusercontent.com/brs165/ogma-fate/main/src/lib/engine.js
# Add others as needed per task

# 4. QA gate (must pass before any zip delivery)
node scripts/qa-hard.mjs
node scripts/qa-export.mjs
```
