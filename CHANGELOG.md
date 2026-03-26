# Changelog

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
