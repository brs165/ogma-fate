# CLAUDE.md — Ogma (SvelteKit)

## What this project is

Ogma is a browser-based offline-first PWA that generates Fate Condensed tabletop RPG content
for GMs. Built with SvelteKit + Svelte 5. Deployed at ogma.net via Cloudflare Pages.

## Stack

- **Framework:** SvelteKit + Svelte 5.51.0 — full runes mode (`$state`, `$derived`, `$props`)
- **Build:** Vite 7, `@sveltejs/adapter-static`, `npx vite build`
- **Canvas:** Native pointer/wheel pan-zoom (SvelteFlow removed v662)
- **UI:** `bits-ui@2.16.3` — headless accessible primitives
- **Icons:** Font Awesome 7.2 Free via jsDelivr CDN (cached by SW for offline)
- **State:** Svelte stores (`writable`, `derived`) in plain JS + `$state` in components
- **Persistence:** Dexie 4 (IndexedDB)
- **Sync:** WebSocket multiplayer via PartySocket
- **Styling:** `static/assets/css/theme.css` — ALL styling here, no `<style>` blocks
- **Card design:** FateX-inspired fate-sheet tokens (`--fs-*`) — off-white body, campaign-tinted headers
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
| `src/data/` | 11 campaign data modules |
| `src/routes/+layout.js` | `ssr=false, prerender=false` |
| `static/assets/css/theme.css` | Global stylesheet |
| `static/sw.js` | Service worker |
| `static/_redirects` | `/* /index.html 200` |
| `scripts/bump-version.sh` | Version stamper — run before every zip |
| `docs/claude/BOOTSTRAP.md` | Session startup checklist |
| `docs/claude/PROJECT_MEMORY.md` | Full project state, known issues, backlog |

## Component inventory (75 .svelte files)

| Directory | Count | Contents |
|-----------|-------|---------|
| `cards/` | 4 | StressRow, ClockTrack, Cv4Card, BackPanel |
| `cards/fronts/` | 18 | 18 generator card fronts (all use `fs-*` fate-sheet tokens) |
| `board/` | 17 | Board, OgmaCanvas, BoardCard, BoardSticky, BoardBoost, BoardLabel, BoardGroup, Topbar, DossierModal, ExportMenu, ExportPanel, HelpPanel, StuntPanel, MobileList, CommandPalette, CanvasContextMenu, GenerateFAB |
| `campaign/` | 3 | Campaign, FatePointTracker, Landing |
| `panels/` | 1 | LeftPanel |
| `dice/` | 1 | DicePanel |
| `shared/` | 3 | HelpDiceRoller, Footer, OgmaTooltip |
| `routes/` | 27 | Layouts + pages (marketing, help, campaigns) |

## Architecture rules

1. **Svelte 5 runes everywhere** — `$state()`, `$derived()`, `$props()`, `$effect()`
2. **CSS in theme.css only** — no `<style>` blocks in any component
3. **engine.js and db.js are pure JS** — no Svelte imports, ever
4. **Stores are plain `.js`** — no Svelte syntax in store files
5. **Canvas cards** must NOT have left/top on the component — only the .cv-card-positioner wrapper
6. **Preserve all a11y** — role, aria-label, aria-pressed, aria-expanded

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
