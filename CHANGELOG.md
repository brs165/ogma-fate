# Changelog

---

## [2026.03.665] — March 2026 — Canvas UX Fixes

- Canvas cards: 646px width, auto height (was 320px)
- Binder auto-load to canvas gated to Prep mode only — Play canvas starts empty until GM sends cards
- Back arrow in Topbar now calls onClose callback (closes canvas, returns to generator) — no full page navigation
- board-app: position:fixed inset:0 z-index:300 — canvas covers full browser window including left nav
- Campaign.svelte: passes onClose={() => canvasView = false} to Board
- Topbar: onClose prop — renders as button (callback) when provided, falls back to href link when not

## [2026.03.665] — March 2026 — OgmaCanvas.svelte extraction

### Canvas refactor: Board.svelte → OgmaCanvas.svelte
- Created `OgmaCanvas.svelte` (344 lines) — self-contained canvas component
- Owns all canvas state: panX, panY, zoom, dragState, panDrag
- Owns all canvas logic: wheel zoom, pointer pan, pointer-capture card drag,
  SVG connector overlay, minimap, dot background, zoom controls, empty hint
- Exposes `fitAll()` as bound method for Board to call via `bind:this={canvasRef}`
- Board.svelte is now a pure coordinator — passes data + callbacks, owns no canvas state
- Canvas coordinate math, card rendering, context menu all live in OgmaCanvas
- 78 .svelte files (50 components + 27 routes + OgmaCanvas)

---

## [2026.03.662] — March 2026 — Native Canvas Migration (SvelteFlow Removed)

### Canvas architecture replaced
- **SvelteFlow removed:** `@xyflow/svelte` dependency deleted from `package.json`
- **Native canvas:** `<SvelteFlow>` block replaced with pointer/wheel pan-zoom viewport div
- Card rendering: direct `{#each cards}` loop in a CSS-transformed `<div class="cv-viewport">`
- Connectors: `<svg class="cv-svg-overlay">` with `<line>` elements, pure math positioning
- Minimap: CSS scaled card rectangles + viewport indicator box
- Zoom controls: 3 plain buttons (in/out/fit) replacing `<Controls />`
- Background: CSS `radial-gradient` dot pattern replacing `<Background />`
- Context menu coords: pure `screenToCanvas()` math function (no `useSvelteFlow()` required)

### Files deleted
- `src/lib/components/board/nodes/CardNode.svelte`
- `src/lib/components/board/nodes/StickyNode.svelte`
- `src/lib/components/board/nodes/BoostNode.svelte`
- `src/lib/components/board/nodes/LabelNode.svelte`
- `src/lib/components/board/nodeTypes.js`

### canvasStore.js simplified
- Removed `nodes` derived store (SvelteFlow node format)
- Removed `edges` derived store (SvelteFlow edge format)
- Removed `syncNodePositions()` (replaced by direct card position updates in drag handler)

### CanvasContextMenu.svelte
- Removed `useSvelteFlow()` / `screenToFlowPosition` import
- Now accepts `screenToCanvas` function as prop

### Docs & memory aligned
- BOOTSTRAP.md: build script rule clarified (npx vite build for tests, bump-version.sh once for zip)
- PROJECT_MEMORY.md: stack table updated, SvelteFlow architecture section replaced with native canvas section
- CANVAS-WORKSHOP.md: archived SvelteFlow sprint history, updated feature status table
- All version references updated to 2026.03.665/662

---

## [2026.03.660] — March 2026 — SvelteFlow API Fix + Doc Sweep

### Canvas crash fix — "t is not iterable"
- **Root cause:** `flowNodes`/`flowEdges` were `writable()` stores; SvelteFlow 1.5.1 expects plain `$state([])` arrays
- Changed all store `.set(v)` calls to assignment (`flowNodes = v`)
- Changed all `.update(fn)` calls to reassignment (`flowNodes = fn(flowNodes)`)
- Replaced all `on:event` dispatchers with callback props (`onnodeclick`, `onnodedragstop`, etc.)
- `on:edgedelete` → `ondelete` (SvelteFlow 1.5.1 API)
- `multiSelectionKeyCode` → `multiSelectionKey`
- Comprehensive doc sweep: corrected SvelteFlow rules in BOOTSTRAP.md, CONVENTIONS.md, TEAM-VOICES.md, PROJECT_MEMORY.md, code-quality.md (all previously had the reversed/wrong pattern documented)

---

## [2026.03.655] — March 2026 — Deep Dive Layout Fix

- Fixed `step-block` 3-column flex layout on `/help/learn-fate-deep` — nested `step-title` inside `step-body` so icon sits left, title+content stack right

---

## [2026.03.652] — March 2026 — Teacher Voice + Deep Dive Learning

### Voice 7 — The Teacher
- Added to `docs/claude/TEAM-VOICES.md`: fiction-first, learner perspective, D&D transition, interactive examples
- Deep dive page at `/help/learn-fate-deep` with 4 sections:
  1. Interactive tutorial — guided scene with Kira Vasquez, dice rollers, Teacher callouts
  2. Play-by-post walkthrough — Dr. Helena Blackwood Victorian scene, beat-by-beat
  3. Strategy guide — Create Advantage math, FP economy, conceding, self-compels
  4. First session checklist — 30-min prep, what to skip, 3-hour template, D&D habits to unlearn
- Hero text: "Learn Fate. Build worlds. Solo prep or group play — one click away."
- CSS: callout variants (info/tip/dnd/scenario), step-body, play-by-post exchange styling

---

## [2026.03.648] — March 2026 — Canvas Polish Sprint

- bits-ui Tooltip completely removed from all canvas components (Topbar, PlayerRow, TurnBar) — replaced with HTML `title` attrs. Fixed persistent "t is not iterable" crash from Tooltip/SvelteFlow conflict
- PREP-06: Undo covers card moves (captures old positions, 2px drag threshold)
- WC-08: Consequence stickies — `addStickyWithText()` in canvasStore, auto-creates color-coded stickies when GM types consequences

---

## [2026.03.636] — March 2026 — gmOnly Toggle + Docs

- WC-07: gmOnly card toggle — eye icon in BoardCard, 55% opacity + amber dashed border visual, PlayerSurface filters gmOnly cards
- Docs version stamp sweep across all claude/ docs

---

## [2026.03.633] — March 2026 — Select All + Command Palette

- PREP-08: Ctrl+A select all nodes + Ctrl+Shift+A deselect
- Command palette "Select All Nodes" entry

---

## [2026.03.630] — March 2026 — GM Tips Depth

- BL-07: GM Tips depth — 1,950→3,293 words (+69%)
- "Common Mistakes" (red) and "Pairs Well With" (green) sections added to all 18 generators

---

## [2026.03.627] — March 2026 — Stunt Data

- BL-02: 27 universal stunts tagged (18 canonical tags)
- `pickStuntsForSkills()` added to engine.js
- Major/Minor NPC/PC generators updated — 100% stunt-skill match rate

---

## [2026.03.624] — March 2026 — localStorage Schema

- BL-01: 14 keys in DEFAULTS, `LS.get()`/`LS.set()` accessor, 9 files migrated from raw localStorage

---

## [2026.03.621] — March 2026 — Mobile Nav

- BL-15: Help wiki sidebar → hamburger drawer on mobile (≤640px)
- Marketing pages get hamburger drawer with 8 world links

---

## [2026.03.612] — March 2026 — QA + BackPanel Rewrite

- BackPanel/ClockTrack rewritten with fs-* tokens
- CvLabel + CvTag deleted (82→80 components)
- QA static analysis (6 checks) + Playwright smoke tests (43 checks)
- CI pipeline updated

---

## [2026.03.600] — March 2026 — FateX Card Restyling (Option A)

### Card design overhaul — all 18 types
- `Cv4Card.svelte` rewritten: off-white `#F5F0E8` body (WCAG AAA), campaign-tinted gradient headers, FA icons, clean shadow, restyled flip button
- 80+ lines of `--fs-*` fate-sheet design tokens added to theme.css
- `.fs-*` structural CSS classes: section headers, aspect labels, skill badges, stress boxes, consequence slots, stunt blocks
- Per-campaign header gradients for all 8 worlds
- **Character cards** (NpcMajor, NpcMinor, Pc): FateX five-aspect layout, skill ladder with `+N` badges and ladder labels, physical/mental stress tracks, consequence write-in slots
- **All other cards** (Scene, Encounter, Seed, Campaign, Compel, Challenge, Contest, Consequence, Faction, Complication, Backstory, Obstacle, Countdown, Constraint, Custom): same visual tokens, own data layouts
- `StressRow.svelte` rewritten with `fs-*` classes — all interactive toggles preserved
- `ClockTrack.svelte` updated to `fs-*` tokens
- Scene category tags: translucent pills → solid-fill badges with white text
- Free Invoke: small green "FI" text → solid green "FREE INVOKE" badge
- All interactive elements verified: stress toggles, contest +1/reset, countdown clock, consequence treated checkbox, custom card inline editing

---

## [2026.03.593] — March 2026 — Font Awesome 7.2 Free Migration Complete

### FA icon migration
- ~200 emoji→FA replacements across ~45 files
- Zero emoji HTML entities remaining in any .svelte file
- Every icon uses `<i class="fa-solid fa-name" aria-hidden="true"></i>` pattern
- Help sidebar: 12 nav icons replaced (house, hand, rocket, dice-d20, book-open, etc.)
- All topbars (marketing, help, board): Help link, theme toggle
- Board components: Topbar toolbar (9 icons), Board floaters (4), MobileList sections (4)
- Campaign.svelte: sidebar icons (17), roll buttons, thumbtack, seed pack
- Landing.svelte: hero pills, CTAs, onboarding steps (13 icons)
- All 13 help content pages: callout icons, gen-card icons
- License page shoutout icons (dice-d20, hat-wizard, book, dragon)
- Character-creation, sessionzero, guide, learn, about pages
- PlayerSurface, CommandPalette, BackPanel, FatePointTracker

### Backlog
- **BL-25** logged: FateX Sheet Setup/Edit mode concepts spike

---

## [2026.03.586] — March 2026 — Legal Compliance + FA 7.2 + Footer

### Legal compliance
- Fate Condensed attribution corrected: Lara Turner (was "Ed Turner"), author list matches fate-srd.com canonical text (removed Leonard Balsera, Ryan Macklin — Fate Core authors, not FCon)
- D&D SRD 5.2.1: exact required attribution block with dndbeyond.com/srd link and Section 5 disclaimer of warranties
- All `http://www.faterpg.com` → `https://www.faterpg.com` with live links
- Removed stale "Fate Core font used with permission" claim (font not loaded)
- FA attribution updated: "version 6 / system emoji" → FA Free 7.2 with tri-license (CC BY 4.0 / OFL 1.1 / MIT)

### Font Awesome 7.2 Free
- CDN link added to `app.html` via jsDelivr
- Service worker updated to precache FA CSS + woff2 webfonts for offline
- Orphan `.fa-cart-plus` CSS rule removed from theme.css

### Shared Footer
- `Footer.svelte` component created with Help/About/License links
- Wired into 6 layouts: Landing, marketing, help, campaign guide, session zero, character creation
- Replaced 6 inline footer blocks with single shared component

### About page
- 16→17 generators, 128→136 combinations, 97→187 QA checks
- "GitHub Pages" → "Cloudflare Pages"

---

## [2026.03.579] — March 2026 — Bits UI Sprint + Repo Cleanup

### Bits UI components adopted
- `DropdownMenu` — ExportMenu (killed 30-line hand-rolled dropdown)
- `ToggleGroup` — Topbar mode switch, Binder filter strip
- `Tooltip` — all Topbar icon buttons (with keyboard shortcuts), stress boxes
- `AlertDialog` — TurnBar confirm modal (replaced `confirm()` dialogs)
- `Collapsible` — PlayerRow consequence expand (animated height)
- `Select` — world picker (icons in trigger + dropdown)
- `Popover` — HelpPanel inspiration roll with reroll button

### Delight & animation
- Card entrance: spring scale-in on every new SvelteFlow node
- FP coin-flip animation on every gain/spend in PlayerRow and FatePointTracker
- Stress track shakes when last box filled
- Mode switch: canvas desaturates 80ms then springs back
- Clock fill: expanding ring on countdown node when triggered
- Empty canvas: pulsing ◈ hint with Space/right-click instructions
- GM pool: pulse + shake when at 0

### Repo cleanup
- Deleted `react-source/` (3MB, 45+ files — migration complete)
- Deleted `ARCHITECTURE.md` (React-era, replaced by CLAUDE.md)
- Deleted `eslint.config.cjs` (linted React core/ files only)
- Deleted `.github/workflows/deploy.yml.disabled` (GitHub Pages disabled)
- Deleted `static/.nojekyll` (GitHub Pages artifact)
- Deleted `src/lib/components/shared/Footer.svelte` (never imported)
- Deleted `src/lib/index.js` (empty SvelteKit placeholder)
- Removed `@sveltejs/adapter-cloudflare` and `@sveltejs/adapter-auto` from package.json
- Moved `MIGRATION.md` → `docs/MIGRATION.md`
- Rewrote `CONTRIBUTING.md` for Svelte 5 workflow

---

## [2026.03.577] — March 2026 — Canvas Workshop + Play Surface

### Canvas fixes (SvelteFlow)
- Fixed `useSvelteFlow()` called outside SF tree (crash)
- Fixed double card positioning (left/top removed from all card components)
- Fixed drag conflict (onmousedown removed from card components)
- Added `CanvasContextMenu.svelte` child inside SF tree for accurate canvas coords
- Fixed `toastQueue.shift()` → `toastQueue.slice(1)` ($state-safe)
- Fixed `unsubs` changed from `$state([])` to plain `let`
- Added connect mode: dashed outline on source, crosshair cursor on canvas
- Added `on:nodeclick` — clicked cards come to front (z: Date.now())
- Colored MiniMap: each generator type renders its own colour
- Fixed `defaultViewport` to show first cards clearly

### Play surface
- PlayPanel rewritten: Players | Generate tabs in Play mode
- TurnBar `confirm()` → inline styled AlertDialog modal
- Stress boxes: amber = physical, purple = mental
- GM pool: pulse animation at 0
- "Rnd" → "XCHG" (exchange, correct FCon terminology)
- Compel offer modal: Accept auto-grants +1 FP
- fitView fires on load when restoring existing cards
- NPC acted state: greyed out on canvas when acted this exchange

---

## [2026.03.576] — March 2026 — Svelte 5 Runes Pass + SvelteFlow Integration

### Svelte 5 migration complete
- All 81 components on `$state()`, `$derived()`, `$props()`
- Zero `runes={false}` files
- `<slot />` → `{@render children?.()}` in layouts
- `export const ssr` moved to `+layout.js`
- `<svelte:component>` removed from Cv4Card
- Deprecated `a11y-*` svelte-ignore comments updated to `a11y_*`
- `$state()` inside function bodies fixed (DicePanel, HelpDiceRoller)

### SvelteFlow canvas
- `flowNodes`/`flowEdges` changed from `$state([])` to `writable([])` (cards now appear)
- `nodrag nopan` on interactive zones inside nodes
- Context menu generates at cursor canvas position

### Build fixes
- adapter-static with `fallback: 'index.html'`
- `static/_redirects` for Cloudflare Pages SPA routing
- `npx vite build` in package.json (not bare `vite`)
- CI removed `404.html` check
- `bump-version.sh` targets `static/sw.js`

---

## [2.0.0] — March 2026 — Svelte Migration

Complete rewrite from React to SvelteKit. Functional parity with the React version.

### Framework
- **React 18 CDN UMD** (`h()` calls, no JSX) → **SvelteKit** (`.svelte` component files)
- No build step → **Vite 7** with hot module replacement
- Global `window.*` functions → ES module `import`/`export`

### Components
- 4 monolith JS files (`ui-board.js`, `ui-renderers.js`, `ui-campaign.js`, `ui-player.js`) → **51 `.svelte` files** across 6 directories
- 17 card front renderers extracted into individual `fronts/*.svelte` files
- `BoardCard` split into `BoardCard`, `BoardSticky`, `BoardBoost`

### State management
- 6 custom React hooks (`useState`/`useEffect`) → **6 Svelte stores** (`writable`/`derived`)
  - `canvasStore.js` — card CRUD, undo stack, IDB persist
  - `playStore.js` — players, turns, rounds, fate points
  - `binderStore.js` — binder cards, tray, pin/unpin
  - `syncStore.js` — WebSocket multiplayer
  - `sessionStore.js` — generator session, result history
  - `chromeStore.js` — toast, theme, PWA lifecycle

### Routing
- Static HTML files → **SvelteKit file-based routing** with `[world]` dynamic parameter
  - `/` — landing page (world selector)
  - `/campaigns/[world]` — game board + campaign generator

### Build & deployment
- No build step (CDN script tags) → **Vite 7 + adapter-static** producing a `build/` directory
- PWA: service worker + manifest preserved

### Preserved unchanged
- `engine.js` — pure-function content generator (2,045 lines)
- `db.js` — Dexie 4 IndexedDB wrapper (996 lines)
- `theme.css` — global stylesheet
- WebSocket sync protocol (cross-compatible with React clients)
- All campaign data files (11 world modules)
- All accessibility attributes (`role`, `aria-*`, focus management)
