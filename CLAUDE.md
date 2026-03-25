# CLAUDE.md — Ogma (SvelteKit)

## What this project is

Ogma is a browser-based PWA that generates tabletop RPG content for Fate Condensed GMs.
Built with **SvelteKit + Vite + adapter-static**, migrated from a React 18 UMD codebase (March 2026).

## Stack

- **Framework:** SvelteKit (Svelte 5 runes-compatible, using Svelte 4 `export let` syntax)
- **Build:** Vite 7, `@sveltejs/adapter-static`
- **State:** Svelte stores (`writable`, `derived`) in plain JS files
- **Persistence:** Dexie 4 (IndexedDB)
- **Sync:** WebSocket-based multiplayer
- **Styling:** `static/assets/css/theme.css` (global, not component-scoped)
- **PWA:** Service worker + manifest for offline support

## Key files

- `src/lib/engine.js` — pure-function content generator (no Svelte imports)
- `src/lib/db.js` — Dexie 4 IndexedDB wrapper (no Svelte imports)
- `src/lib/helpers.js` — shared utility functions
- `src/lib/stores/` — 6 Svelte stores (canvas, play, binder, sync, session, chrome)
- `src/lib/components/` — 51 `.svelte` components across 6 directories
- `src/data/` — 11 campaign data files (ES modules)
- `src/routes/` — SvelteKit routes (`/` landing, `/campaigns/[world]` game board)
- `static/assets/` — CSS, fonts, images
- `MIGRATION.md` — historical migration spec (React → Svelte), kept as reference
- `react-source/` — original React codebase (read-only reference, do not modify)

## Component inventory (51 files)

| Directory | Count | Contents |
|-----------|-------|---------|
| `cards/` | 7 | CvLabel, CvTag, StressRow, ClockTrack, Cv4Card, BackPanel + fronts/ |
| `cards/fronts/` | 17 | NpcMinor, NpcMajor, Scene, Campaign, Encounter, Seed, Compel, Challenge, Contest, Consequence, Faction, Complication, Backstory, Obstacle, Countdown, Constraint, Custom, Pc |
| `board/` | 18 | Board, BoardCard, BoardLabel, BoardSticky, BoardBoost, TurnBar, PlayerRow, CombatTracker, PlayPanel, BinderPanel, DossierModal, Topbar, ExportMenu, ExportPanel, HelpPanel, StuntPanel, MobileList, CommandPalette |
| `campaign/` | 3 | Campaign, FatePointTracker, Landing |
| `panels/` | 1 | LeftPanel |
| `dice/` | 1 | DicePanel |
| `player/` | 1 | PlayerSurface |
| `routes/` | 3 | +layout, +page (landing), campaigns/[world]/+page |

## Stores (6 files)

| Store | Source hook | Purpose |
|-------|-----------|---------|
| `canvasStore.js` | useBoardCards | Card CRUD, generate, delete, reroll, undo, IDB persist |
| `playStore.js` | useBoardPlayState | Players, turns, rounds, FP, stress, GM pool |
| `binderStore.js` | useBoardBinder | Binder cards, tray, pin/unpin |
| `syncStore.js` | useBoardSync | WebSocket connect/disconnect, room code |
| `sessionStore.js` | useGeneratorSession | Active generator, result history, chain rolls |
| `chromeStore.js` | useChromeHooks | Toast, theme, SW update, PWA |

## Architecture rules

1. One component per `.svelte` file
2. Keep CSS in `static/assets/css/theme.css` — don't duplicate into `<style>` blocks
3. `engine.js` and `db.js` are pure JS libraries — no Svelte imports
4. Stores are plain JS files that export Svelte stores
5. Components import stores, not the other way around
6. Preserve all accessibility: `role`, `aria-label`, `aria-pressed`, `aria-expanded`
7. The drag system MUST use direct DOM during drag, single store update on drop
8. Run `npm run dev` after changes to verify compilation

## Commands

```bash
npm run dev          # Start dev server (Vite 7)
npm run build        # Production build (adapter-static → build/)
npm run preview      # Preview production build
```

## QA checks

```bash
# Compilation
npm run dev          # Should start with zero errors (warnings OK)
npm run build        # Should succeed: "✔ done"

# File counts
find src -name "*.svelte" | wc -l   # Should be 51
ls src/lib/stores/*.js | wc -l      # Should be 6

# Engine exports
node -e "import('./src/lib/engine.js').then(m => console.log(Object.keys(m)))"

# No stubs or TODOs
grep -rn "TODO\|FIXME\|STUB" src/ --include="*.svelte" --include="*.js"
```
