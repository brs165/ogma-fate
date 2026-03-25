# Project Memory — Ogma SvelteKit

Persistent context for model-switching and session handoffs.
Last updated: March 2026.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit (Svelte 5 engine, using Svelte 4 `export let` syntax) |
| Build | Vite 7, `@sveltejs/adapter-static` |
| State | Svelte stores (`writable`, `derived`) in plain JS |
| Persistence | Dexie 4 (IndexedDB) |
| Sync | WebSocket multiplayer (JSON `{type, ...payload}`) |
| Styling | Global `static/assets/css/theme.css` (2,744 lines) |
| PWA | Service worker + `manifest.json` |

---

## File paths

```
src/lib/engine.js           2,045 lines  Pure-function content generator
src/lib/db.js                 996 lines  Dexie 4 IndexedDB wrapper
src/lib/helpers.js            114 lines  Shared utilities
src/lib/stores/               6 files    Svelte stores
src/lib/components/          48 files    Svelte components
src/lib/components/cards/fronts/  18 files    Card front renderers
src/data/                    11 files    Campaign data modules
src/routes/                   3 files    SvelteKit route pages
static/assets/css/theme.css            Global stylesheet
react-source/                          Original React codebase (read-only)
```

---

## Store inventory

| Store | File | Lines | Purpose |
|-------|------|-------|---------|
| Canvas | `canvasStore.js` | 198 | Card CRUD, generate, delete, reroll, undo stack, IDB persist |
| Play | `playStore.js` | 176 | Players, turn order, rounds, fate points, stress, GM pool |
| Binder | `binderStore.js` | 141 | Binder cards, tray, pin/unpin, send to canvas |
| Sync | `syncStore.js` | 135 | WebSocket connect/disconnect, room code, role |
| Session | `sessionStore.js` | 189 | Active generator, result history, chain rolls, prefs |
| Chrome | `chromeStore.js` | 115 | Toast queue, theme toggle, SW update, PWA lifecycle |

---

## Component inventory

| Directory | Count | Key components |
|-----------|-------|---------------|
| `cards/` | 6 | CvLabel, CvTag, StressRow, ClockTrack, Cv4Card, BackPanel |
| `cards/fronts/` | 18 | 18 generator-specific card fronts (NpcMinor through Custom, Pc) |
| `board/` | 18 | Board (main), BoardCard, Topbar, TurnBar, PlayerRow, ExportPanel, HelpPanel, CommandPalette, etc. |
| `campaign/` | 3 | Campaign, FatePointTracker, Landing |
| `panels/` | 1 | LeftPanel |
| `dice/` | 1 | DicePanel (4-phase state machine: idle→flicker→reveal→done) |
| `player/` | 1 | PlayerSurface (join wizard, character sheet, dice, compel, tent mode) |
| **Total** | **48** | + 3 route files = **51 `.svelte` files** |

---

## Data modules (11 files in `src/data/`)

`fantasy.js`, `cyberpunk.js`, `space.js`, `western.js`, `victorian.js`, `postapoc.js`, `thelongafter.js`, `dVentiRealm.js`, `shared.js`, `shared-lite.js`, `universal.js`

---

## QA gate numbers

| Check | Expected |
|-------|----------|
| `npm run dev` | Zero errors (warnings OK) |
| `npm run build` | Prints "✔ done" |
| `.svelte` file count | 51 |
| Store file count | 6 |
| Data module count | 11 |
| Engine export count | 20 |
| TODO/FIXME/STUB markers | 0 |
| `react-source/` modifications | 0 (must stay pristine) |

---

## Key engineering rules

### 1. Drag system — direct DOM, not reactive
The canvas drag system uses direct DOM manipulation (`el.style.left/top`) during drag for performance. A single Svelte store update happens on drop. This was a deliberate performance decision from the React era. Do not make drag reactive.

### 2. Card flip — CSS 3D transform
`Cv4Card.svelte` uses `perspective`, `rotateY(180deg)`, `backface-visibility: hidden` for the flip animation. The `prefers-reduced-motion` media query replaces the flip with a `display:none` toggle. The flip state is a local `flipped` variable, not a store.

### 3. Sync protocol — preserved from React
The WebSocket sync protocol uses JSON messages: `{type, ...payload}`. Message types: `player_hello`, `player_roll`, `compel_offer`, `compel_response`, `player_create_aspect`, `broadcast_state`. A React player must be able to connect to a Svelte GM and vice versa. Do not change the wire format.

### 4. IDB persistence — every state persists
Canvas cards, play state, fate points, binder, tray — all persisted to IndexedDB via Dexie. Stores call `DB.saveSession()` / `DB.loadSession()` on mutation. Loss of persistence is a regression.

### 5. engine.js and db.js — pure libraries
These files must never import from Svelte. They are framework-agnostic libraries. Stores import from them; they do not import from stores.

### 6. CSS lives in theme.css
All styling is in `static/assets/css/theme.css`. Components should not have `<style>` blocks unless adding animations that don't exist in theme.css. This is a deliberate architectural choice, not technical debt.

---

## Model-switching handoff

When switching between Claude models mid-session:

1. Read `CLAUDE.md` for architecture rules and commands
2. Read this file (`docs/claude/PROJECT_MEMORY.md`) for current state
3. Run `npm run build` to verify the project compiles
4. Run `find src -name "*.svelte" | wc -l` to confirm file count (51)
5. Check `git status` for any in-progress work
6. Continue from where the previous model left off
