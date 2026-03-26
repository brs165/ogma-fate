# CLAUDE.md — Ogma (SvelteKit)

## What this project is

Ogma is a browser-based offline-first PWA that generates Fate Condensed tabletop RPG content
for GMs. Built with SvelteKit + Svelte 5 + SvelteFlow. Deployed at ogma.net via Cloudflare Pages.

## Stack

- **Framework:** SvelteKit + Svelte 5.51.0 — full runes mode (`$state`, `$derived`, `$props`)
- **Build:** Vite 7, `@sveltejs/adapter-static`, `npx vite build`
- **Canvas:** `@xyflow/svelte` — SvelteFlow for the Prep & Play board
- **UI:** `bits-ui@2.16.3` — headless accessible primitives
- **State:** Svelte stores (`writable`, `derived`) in plain JS + `$state` in components
- **Persistence:** Dexie 4 (IndexedDB)
- **Sync:** WebSocket multiplayer via PartySocket
- **Styling:** `static/assets/css/theme.css` — ALL styling here, no `<style>` blocks
- **PWA:** `static/sw.js` + `static/manifest.json`
- **Deploy:** Cloudflare Pages, auto-deploy from `main`, `static/_redirects` for SPA routing

## Key files

| File | Purpose |
|------|---------|
| `src/lib/engine.js` | Pure-function content generator (no Svelte imports) |
| `src/lib/db.js` | Dexie 4 IndexedDB wrapper (no Svelte imports) |
| `src/lib/helpers.js` | Shared utility functions |
| `src/lib/stores/` | 6 stores: canvas, play, binder, sync, session, chrome |
| `src/lib/components/board/Board.svelte` | Main app shell |
| `src/lib/components/board/nodes/` | SvelteFlow node components (4 files) |
| `src/lib/components/board/nodeTypes.js` | SvelteFlow node registry (module-level) |
| `src/data/` | 11 campaign data modules |
| `src/routes/+layout.js` | `ssr=false, prerender=false` |
| `static/assets/css/theme.css` | Global stylesheet |
| `static/sw.js` | Service worker |
| `static/_redirects` | `/* /index.html 200` |
| `scripts/bump-version.sh` | Version stamper — run before every zip |
| `docs/claude/BOOTSTRAP.md` | Session startup checklist |
| `docs/claude/PROJECT_MEMORY.md` | Full project state, known issues, backlog |

## Component inventory (54 .svelte files)

| Directory | Count | Contents |
|-----------|-------|---------|
| `cards/` | 6 | CvLabel, CvTag, StressRow, ClockTrack, Cv4Card, BackPanel |
| `cards/fronts/` | 18 | 18 generator card fronts |
| `board/` | 18 | Board, BoardCard, BoardSticky, BoardBoost, BoardLabel + 13 others |
| `board/nodes/` | 4 | CardNode, StickyNode, BoostNode, LabelNode |
| `campaign/` | 3 | Campaign, FatePointTracker, Landing |
| `panels/` | 1 | LeftPanel |
| `dice/` | 1 | DicePanel |
| `player/` | 1 | PlayerSurface |
| `shared/` | 2 | HelpDiceRoller, Footer |
| `routes/` | 3+ | +layout, +page, campaigns/[world]/+page, etc. |

## Architecture rules

1. **Svelte 5 runes everywhere** — `$state()`, `$derived()`, `$props()`, `$effect()`
2. **CSS in theme.css only** — no `<style>` blocks in any component
3. **engine.js and db.js are pure JS** — no Svelte imports, ever
4. **Stores are plain `.js`** — no Svelte syntax in store files
5. **SvelteFlow nodes/edges MUST be `writable()` stores** — not `$state([])`
6. **Card components have no positioning or drag logic** — SvelteFlow owns that
7. **`nodeTypes.js` at module level** — never inside reactive block or function
8. **Preserve all a11y** — role, aria-label, aria-pressed, aria-expanded

## Commands

```bash
npm run dev       # Dev server (Vite 7)
npm run build     # Production build → build/
npm run preview   # Preview production build

# QA gate (run before every delivery)
node scripts/qa-hard.mjs
node scripts/qa-export.mjs
bash scripts/bump-version.sh  # bump version before zip
```

## Deployment

- Cloudflare Pages auto-deploys from `main` on push
- Build command in CF dashboard: `npm run build`
- Build output dir: `build`
- GitHub Pages: DISABLED (`.github/workflows/deploy.yml.disabled`)
