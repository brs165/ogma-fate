# Changelog

All notable changes to Ogma are documented in this file.

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
