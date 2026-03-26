# Project Memory — Ogma
_Persistent context for model-switching and session handoffs._
_Last updated: 2026.03.644_

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit + Svelte 5.51.0 (full runes mode) |
| Build | Vite 7, `@sveltejs/adapter-static`, `npx vite build` |
| Canvas | `@xyflow/svelte` — pan/zoom/connect/minimap/node types |
| UI Primitives | `bits-ui@2.16.3` — Dialog, Accordion, DropdownMenu, ToggleGroup, Tooltip, AlertDialog, Collapsible, Select, Popover |
| Icons | Font Awesome 7.2 Free via jsDelivr CDN (cached by SW for offline) |
| Card Design | FateX-inspired fate-sheet tokens (`--fs-*`) — off-white `#F5F0E8` body, campaign-tinted headers |
| State | Svelte `writable`/`derived` stores in plain JS + `$state` in components |
| Persistence | Dexie 4 (IndexedDB) |
| Sync | WebSocket multiplayer via PartySocket (`syncStore.js`) |
| Styling | Global `static/assets/css/theme.css` — no `<style>` blocks in components |
| PWA | `static/sw.js` + `static/manifest.json` |
| Deploy | Cloudflare Pages (auto-deploy from `main`), `static/_redirects` for SPA routing |
| Offline | `build/` directory with `start.sh/.bat/.command` launcher scripts + README.txt |

---

## Key file paths

```
src/lib/engine.js                    Pure-function content generator (no Svelte imports)
src/lib/db.js                        Dexie 4 IndexedDB wrapper (no Svelte imports)
src/lib/helpers.js                   Shared utility functions
src/lib/stores/canvasStore.js        Canvas: card CRUD, generate, connectors, undo, SvelteFlow derived stores
src/lib/stores/playStore.js          Play mode: players, turn order, FP, stress, GM pool
src/lib/stores/binderStore.js        Binder: saved cards, tray, pin/unpin
src/lib/stores/syncStore.js          WebSocket: connect/disconnect, room code, role
src/lib/stores/sessionStore.js       Session: active generator, result history, prefs
src/lib/stores/chromeStore.js        Chrome: toast queue, theme, SW update
src/lib/components/board/Board.svelte         Main app shell
src/lib/components/board/nodes/              4 SvelteFlow node components
src/lib/components/board/nodeTypes.js        SvelteFlow node registry (module-level)
src/data/                            8 campaign data files + shared + universal + index
src/routes/+layout.js                ssr=false, prerender=false
static/assets/css/theme.css          ALL styling — never add <style> to components
static/sw.js                         Service worker — cache name bumped by bump-version.sh
static/_redirects                    /* /index.html 200
scripts/bump-version.sh              Run before every zip delivery
docs/claude/BOOTSTRAP.md             Session startup checklist
docs/claude/CANVAS-WORKSHOP.md       Canvas sprint status and backlog
```

---

## Svelte 5 runes rules (CRITICAL — applies to all 81 components)

- `let x = $state(value)` — ALL mutable local state. Never plain `let` for reassigned vars.
- `let x = $derived(expr)` — computed values. Expression only, never a wrapping function.
- `let { prop = default } = $props()` — component props. Never `export let`.
- `$effect(() => { ... })` — side effects. Replaces `$: { ... }`.
- `onclick={}` not `on:click={}` — Svelte 5 event syntax throughout.
- `{@render children?.()}` not `<slot />` — snippet rendering.
- **`$state()` only at component top level** — never inside function bodies.
- **Zero `runes={false}` files** — all components are on runes mode.

---

## SvelteFlow canvas architecture

```
canvasStore.cards (writable)
  → canvasStore.nodes (derived) — maps x/y → position, card as data, edge labels
  → canvasStore.edges (derived) — from canvasStore.connectors (with label field)

Board.svelte:
  flowNodes = writable([])   ← MUST be writable store, NOT $state([])
  flowEdges = writable([])   ← MUST be writable store, NOT $state([])
  canvas.nodes.subscribe(v => flowNodes.set(v))
  canvas.edges.subscribe(v => flowEdges.set(v))
```

**Critical rules for card components:**
- No `style="left:Xpx; top:Ypx"` — SvelteFlow positions nodes
- No `onmousedown` drag handlers — SvelteFlow handles dragging
- No `position:absolute` — SvelteFlow handles layout
- `nodrag nopan` class on interactive zones (buttons, inputs) inside nodes

**ogma_canvas context** (set in Board.svelte, read by node components):
```js
{ mode, campId, playCardIds, connectSourceId, cardSearch,
  onDelete, onReroll, onUpdate, onSendToTable, onOpen, onInvoke, onUpdateConnector }
```

---

## Component inventory (82 .svelte files)

```
src/lib/components/
├── cards/           6    CvLabel, CvTag, StressRow, ClockTrack, Cv4Card, BackPanel
│   └── fronts/     18    NpcMinor, NpcMajor, Scene, Campaign, Encounter, Seed,
│                         Compel, Challenge, Contest, Consequence, Faction,
│                         Complication, Backstory, Obstacle, Countdown, Constraint,
│                         Custom, Pc
├── board/          20    Board, BoardCard, BoardLabel, BoardSticky, BoardBoost,
│                         TurnBar, PlayerRow, CombatTracker, PlayPanel, BinderPanel,
│                         DossierModal, Topbar, ExportMenu, ExportPanel, HelpPanel,
│                         StuntPanel, MobileList, CommandPalette,
│                         CanvasContextMenu, GenerateFAB
│   └── nodes/       4    CardNode, StickyNode, BoostNode, LabelNode
├── campaign/        3    Campaign, FatePointTracker, Landing
├── panels/          1    LeftPanel
├── dice/            1    DicePanel
├── player/          1    PlayerSurface
└── shared/          2    HelpDiceRoller, Footer

src/routes/                26 route page/layout files
```

---

## Campaign worlds (8)

| Key | Name |
|-----|------|
| `fantasy` | Shattered Kingdoms |
| `cyberpunk` | Neon Abyss |
| `postapoc` | The Long After |
| `space` | Void Runners |
| `victorian` | Gaslight Chronicles |
| `western` | Dust and Iron |
| `thelongafter` | The Long Road |
| `dVentiRealm` | dVenti Realm |

---

## What's complete

**Svelte 5 migration** — all 82 components on runes, zero legacy files.

**SvelteFlow canvas** — pan/zoom/connect/minimap, 4 node types, modal dossier,
edge labels (click to cycle: Knows/Opposes/Ally/Fears/Owes/Loves/Rival/Commands/Seeks),
card minimise/expand (double-click or ▲ button), search dim (non-matching nodes fade),
connect mode visual, NPC acted state, clock trigger ring, card entrance animation,
empty canvas hint, fitView on load.

**Play mode** — Players | Generate tabs, exchange tracker (XCHG), stress colour coding
(amber=physical, purple=mental), FP coin-flip animation, compel offer modal (+1 FP),
GM pool urgency pulse, AlertDialog confirms, NPC acted state on canvas.

**FateX-style card restyling (v600)** — all 18 card fronts + Cv4Card shell + StressRow +
ClockTrack rewritten with `--fs-*` fate-sheet design tokens. Off-white `#F5F0E8` card body
(WCAG AAA), campaign-tinted gradient headers for all 8 worlds, FA icons in headers,
FateX five-aspect layout on character cards (NpcMajor/NpcMinor/Pc), skill ladder with
`+N` badges, stress tracks (physical blue/mental purple), consequence write-in slots,
stunt blocks. Non-character cards adopt same visual tokens with their own data layouts.
All interactive elements preserved (stress toggles, contest scoring, countdown clock,
consequence treated checkbox, custom card inline editing).

**Font Awesome 7.2 Free (v593)** — loaded via jsDelivr CDN, cached by service worker
for offline. ~200 emoji→FA replacements across ~45 files. Zero emoji HTML entities
remain in any .svelte file. All icons use `aria-hidden="true"`.

**Legal compliance (v586)** — Fate Condensed attribution corrected to fate-srd.com
canonical text (Lara Turner, correct author list). D&D SRD 5.2.1 exact required
attribution text. All HTTP→HTTPS. Shared Footer.svelte on all 6 page layouts with
Help/About/License links. FA 7.2 Free attribution with tri-license (CC BY 4.0 / OFL 1.1 / MIT).

**Mobile UX (iPhone 13 target)** — 12 fixes: iOS zoom fix on inputs, GenerateFAB for
canvas generation (right-click unavailable on iOS), 44px touch targets throughout
(topbar icons, turn pills, FP buttons, stress boxes, scene controls), drawer backdrop,
topbar overflow `···` menu, floater safe-area-inset-bottom, scene controls always visible
(extracted from horizontal scroll strip), topbar safe-area-inset-top for PWA.

**Offline distribution** — `build/` directory with launcher scripts (`start.sh`,
`start.bat`, `start.command`), README.txt, service worker precaching all assets + FA CDN.
Distributed as `ogma-offline-YYYY-MM-NNN.zip`.

**Repo cleanup** — `react-source/` deleted, stale docs removed, adapters pruned.

---

## Active backlog (next priorities)

### Tier 1 — Polish card restyling
- BackPanel (GM guidance back-face) audit — may still use old `--cv-card-*` tokens
- Canvas integration check — verify fs-card appearance inside SvelteFlow nodes at various zoom levels
- Export formats (Markdown/print/PDF) — may need updated formatting to match new card layout
- CvLabel and CvTag components — now orphaned (no remaining imports), candidates for deletion
- **BL-03** Victorian adjective pass [S] — weakest world voice

### Tier 2 — Features & content
- **BL-01** localStorage schema [S] — structured prefs (needed for BL-09, BL-10)
- **BL-02** Stunt data implementation [M] — spec in `docs/stunt-data-spec.md`
- **BL-07** GM Tips depth [M]
- **BL-08** Western world content depth [M] — more tables
- **BL-15** Mobile nav overhaul spike [M]
- **WC-02** Node groups — scene spatial grouping on canvas [M]
- **WC-05** Canvas templates — starter scene layouts [M]
- **WC-07** Player-facing gmOnly card toggle [S]
- **WC-08** Consequence stickies auto-placed from player tracker [M]
- **PREP-06** Undo covers card moves (currently delete+reroll only) [M]
- **PREP-08** Ctrl+A select all nodes [S]

### Tier 3 — Parked
- **BL-06** Shareable links [M]
- **BL-09** PWA install nudge [S, needs BL-01]
- **BL-10** Milestone tracker panel tab [M, needs BL-01]
- **BL-16** Ogma rebrand [M, needs GitHub username confirmation]
- **BL-25** Spike — FateX Sheet Setup / Edit mode concepts for canvas, Session Zero, and Character Creation [M]
- Session Zero Tool — design agreed, not built

---

## Deployment

- **URL:** ogma.net
- **Platform:** Cloudflare Pages — auto-deploys from `main` branch
- **Repo:** github.com/brs165/ogma-fate
- **Build command:** `npm run build` (runs `bash scripts/bump-version.sh && npx vite build`)
- **Build output:** `build/`
- **SPA routing:** `static/_redirects` → `/* /index.html 200`
- **Version format:** `YYYY.MM.NNN` (e.g. `2026.03.644`)
- **Zip naming:** source = `YYYY-MM-NNN.zip`, offline = `ogma-offline-YYYY-MM-NNN.zip`
- **Current version:** `2026.03.644`

---

## Session startup

```bash
# 1. Orient
pwd && git branch && git log --oneline -5

# 2. Build health check
npm run build 2>&1 | tail -5   # Must print "✔ done"

# 3. Fetch live files before editing (always)
# https://raw.githubusercontent.com/brs165/ogma-fate/main/static/assets/css/theme.css
# https://raw.githubusercontent.com/brs165/ogma-fate/main/src/lib/engine.js
# Add others per task

# 4. QA gate before every zip delivery
node scripts/qa-hard.mjs
node scripts/qa-export.mjs
npm run build
```
