# Ogma — Tabletop RPG Content Generator

A browser-based PWA that generates tabletop RPG content for **Fate Condensed** GMs. Supports 8 campaign worlds with 17+ generator types (NPCs, scenes, factions, encounters, and more).

## Stack

- **SvelteKit** with Vite 7
- **Svelte 5** (using `export let` props and `$:` reactivity)
- **adapter-static** for PWA deployment
- **Dexie 4** for IndexedDB persistence
- **WebSocket** multiplayer sync
- **51 components**, **6 stores**, **11 data modules**

## Getting started

```bash
npm install
npm run dev          # Start dev server
npm run build        # Production build → build/
npm run preview      # Preview production build
```

## Project structure

```
src/
├── lib/
│   ├── engine.js           # Pure-function content generator
│   ├── db.js               # Dexie 4 IndexedDB wrapper
│   ├── helpers.js           # Shared utilities
│   ├── stores/              # 6 Svelte stores (canvas, play, binder, sync, session, chrome)
│   └── components/
│       ├── cards/           # Card rendering (CvLabel, CvTag, StressRow, ClockTrack, Cv4Card, BackPanel)
│       │   └── fronts/      # 17 generator-specific card fronts
│       ├── board/           # Game board (Board, BoardCard, Topbar, TurnBar, ExportPanel, etc.)
│       ├── campaign/        # Campaign management (Campaign, Landing, FatePointTracker)
│       ├── panels/          # Side panels (LeftPanel)
│       ├── dice/            # Dice roller (DicePanel)
│       └── player/          # Player device (PlayerSurface)
├── data/                    # 11 campaign world data files
├── routes/
│   ├── +layout.svelte       # Global CSS + app shell
│   ├── +page.svelte         # Landing page (/)
│   └── campaigns/[world]/
│       └── +page.svelte     # Game board (/campaigns/[world])
└── app.html
static/
├── assets/css/theme.css     # Global stylesheet
├── assets/fonts/            # Custom fonts
└── manifest.json            # PWA manifest
react-source/                # Original React codebase (read-only reference)
```

## History

Migrated from React 18 CDN UMD (no-build, `h()` calls) to SvelteKit in March 2026. See `MIGRATION.md` for the full migration spec and pattern translation guide.
