# Project Memory — Ogma
_Persistent context for model-switching and session handoffs._
_Last updated: 2026.03.675 — native canvas migration (v662 in progress)_

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit + Svelte 5.55.0 (full runes mode) |
| Build | Vite 7, `@sveltejs/adapter-static`, `npx vite build` |
| Canvas | **Native — pointer/wheel events + CSS transform** (SvelteFlow removed in v662) |
| UI Primitives | `bits-ui@2.16.3` — Dialog, Accordion, DropdownMenu, ToggleGroup, AlertDialog, Collapsible, Select, Popover |
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
src/lib/stores/canvasStore.js        Canvas: card CRUD, generate, connectors, undo, IDB persist
src/lib/stores/playStore.js          Play mode: players, turn order, FP, stress, GM pool
src/lib/stores/binderStore.js        Binder: saved cards, tray, pin/unpin
src/lib/stores/syncStore.js          WebSocket: connect/disconnect, room code, role
src/lib/stores/sessionStore.js       Session: active generator, result history, prefs
src/lib/stores/chromeStore.js        Chrome: toast queue, theme, SW update
src/lib/components/board/Board.svelte         Main app shell + native canvas
src/data/                            8 campaign data files + shared + universal + index
src/routes/+layout.js                ssr=false, prerender=false
static/assets/css/theme.css          ALL styling — never add <style> to components
static/sw.js                         Service worker — cache name bumped by bump-version.sh
static/_redirects                    /* /index.html 200
scripts/bump-version.sh              Run ONCE before final zip only
docs/claude/BOOTSTRAP.md             Session startup checklist
docs/claude/CANVAS-WORKSHOP.md       Canvas sprint status and backlog
```

---

## Svelte 5 runes rules (CRITICAL — applies to all 76 components)

- `let x = $state(value)` — ALL mutable local state. Never plain `let` for reassigned vars.
- `let x = $derived(expr)` — computed values. Expression only, never a wrapping function.
- `let { prop = default } = $props()` — component props. Never `export let`.
- `$effect(() => { ... })` — side effects. Replaces `$: { ... }`.
- `onclick={}` not `on:click={}` — Svelte 5 event syntax throughout.
- `{@render children?.()}` not `<slot />` — snippet rendering.
- **`$state()` only at component top level** — never inside function bodies.
- **Zero `runes={false}` files** — all components are on runes mode.

---

## Native canvas architecture (v662+)

```
canvasStore.cards (writable)     — source of truth for all card x/y/z positions
canvasStore.connectors (writable) — array of {id, fromId, toId, label}

Board.svelte:
  panX, panY = $state(0)     viewport pan offset in px
  zoom       = $state(0.8)   viewport scale factor

  <div class="cv-wrap">
    <svg class="cv-svg-overlay">   <!-- connector lines, pointer-events:none -->
      {#each connectors}  <line x1... y1... x2... y2... />  {/each}
    </svg>
    <div class="cv-viewport" style="transform: translate({panX}px,{panY}px) scale({zoom})">
      {#each cards}
        <div class="cv-card-positioner" style="left:{card.x}px; top:{card.y}px">
          {#if card.genId === 'sticky'} <BoardSticky ... />
          {:else if card.genId === 'boost'} <BoardBoost ... />
          {:else if card.genId === 'label'} <BoardLabel ... />
          {:else} <BoardCard ... />
          {/if}
        </div>
      {/each}
    </div>
    <div class="cv-minimap">...</div>
    <div class="cv-controls">Zoom +/−/Fit</div>
  </div>
```

**Coordinate math:**
```js
// Screen → canvas (for right-click card placement)
canvasX = (screenX - panX) / zoom
canvasY = (screenY - panY) / zoom

// Canvas → screen (for connector endpoints, minimap)
screenX = cardX * zoom + panX
screenY = cardY * zoom + panY
```

**Drag handling:**
- `pointerdown` on card: capture pointer, record start offset
- `pointermove`: update card x/y = (clientX - panX)/zoom - offsetX
- `pointerup`: release capture, persist to store
- Cards do NOT have `position:absolute` with `left/top` via inline style on the card component itself — only the `.cv-card-positioner` wrapper has those

**canvasStore (v662+) — removed:**
- `nodes` derived store (SvelteFlow format)
- `edges` derived store (SvelteFlow format)
- `syncNodePositions()` function

---

## Component inventory (78 .svelte files)

```
src/lib/components/
├── cards/           4    StressRow, ClockTrack, Cv4Card, BackPanel
│   └── fronts/     18    NpcMinor, NpcMajor, Scene, Campaign, Encounter, Seed,
│                         Compel, Challenge, Contest, Consequence, Faction,
│                         Complication, Backstory, Obstacle, Countdown,
│                         Constraint, Custom, Pc
├── board/          20    Board, BoardCard, BoardLabel, BoardSticky, BoardBoost,
│                         TurnBar, PlayerRow, CombatTracker, PlayPanel, BinderPanel,
│                         DossierModal, Topbar, ExportMenu, ExportPanel, HelpPanel,
│                         StuntPanel, MobileList, CommandPalette,
│                         CanvasContextMenu, GenerateFAB
├── campaign/        3    Campaign, FatePointTracker, Landing
├── panels/          1    LeftPanel
├── dice/            1    DicePanel
├── player/          1    PlayerSurface
└── shared/          2    HelpDiceRoller, Footer

src/routes/                27 route page/layout files
```

**Deleted in v662:** `nodes/CardNode.svelte`, `nodes/StickyNode.svelte`,
`nodes/BoostNode.svelte`, `nodes/LabelNode.svelte`, `nodeTypes.js`

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

**Native canvas migration (v662)** — SvelteFlow replaced with pointer/wheel native pan/zoom.
Cards render directly via `{#each}` loop in a transformed viewport div. Connectors as SVG
overlay. Minimap as scaled position rectangles. No `@xyflow/svelte` dependency.

**Svelte 5 migration** — all 76 components on runes, zero legacy files.

**FateX-style card restyling (v600)** — all 18 card fronts + Cv4Card shell rewritten
with `--fs-*` fate-sheet design tokens.

**Font Awesome 7.2 Free (v593)** — loaded via jsDelivr CDN. ~200 emoji→FA replacements.
Zero emoji HTML entities in any .svelte file.

**Legal compliance (v586)** — Fate Condensed attribution corrected. All HTTP→HTTPS.
Shared Footer.svelte on all 6 page layouts.

**Mobile UX (iPhone 13 target)** — 12 fixes: iOS zoom fix, GenerateFAB, 44px touch targets,
drawer backdrop, topbar overflow menu, safe-area-inset.

**Offline distribution** — build/ with launcher scripts, README.txt, SW precaching.

**Canvas features** — edge labels (click cycles: Knows/Opposes/Ally/Fears/Owes/Loves/Rival/Commands/Seeks),
card minimise/expand, search dim, connect mode visual, NPC acted state, clock trigger ring,
empty canvas hint, fitAll on load, gmOnly card toggle, consequence stickies auto-placed,
undo covers card moves + reroll + delete, Ctrl+A select all.

---

## Active backlog (next priorities)

### Tier 1 — Content & polish
- **BL-03** Victorian adjective pass [S] — weakest world voice
- **BL-08** Western world content depth [M] — more tables

### Tier 2 — Features
- **WC-02** Node groups — scene spatial grouping on canvas [M]
- **WC-05** Canvas templates — starter scene layouts [M]
- **BL-06** Shareable links [M]
- **BL-16** Ogma rebrand [M, needs GitHub username confirmation — BL-12]

### Tier 3 — PDF books (remaining)
- **PDF-04** Shattered Kingdoms
- **PDF-05** Neon Abyss
- **PDF-06** Void Runners
- **PDF-07** dVenti Realm
- **PDF-08** Dust and Iron

### Recently completed
- ~~**Canvas migration**~~ SvelteFlow → native pointer/wheel canvas — v662
- ~~**BL-01**~~ localStorage schema — v624
- ~~**BL-02**~~ Stunt data — v627
- ~~**BL-07**~~ GM Tips depth — v630
- ~~**BL-15**~~ Mobile nav overhaul — v621
- ~~**WC-07**~~ gmOnly card toggle — v636
- ~~**WC-08**~~ Consequence stickies — v648

---

## Build / version rules

- **Version format:** `YYYY.MM.NNN` (e.g. `2026.03.675`)
- **Zip naming:** source = `YYYY-MM-NNN.zip`, offline = `ogma-offline-YYYY-MM-NNN.zip`
- **`npx vite build`** — use for all test/intermediate builds. No version bump.
- **`bash scripts/bump-version.sh`** — run ONCE, immediately before the final zip delivery only.
- Current version: `2026.03.675`

---

## Deployment

- **URL:** ogma.net
- **Platform:** Cloudflare Pages — auto-deploys from `main` branch
- **Repo:** github.com/brs165/ogma-fate
- **Build command:** `npm run build` (runs bump-version.sh + vite build — use `npx vite build` to avoid auto-bump)
- **Build output:** `build/`
