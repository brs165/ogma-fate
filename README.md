# Ogma — Fate Condensed GM Aid

A browser-based, offline-first progressive web app for Fate Condensed GMs.
Generate world-specific content, run sessions, track players — all in one tab.

**Live:** [ogma.net](https://ogma.net)

---

## Features

- 17 generators × 8 campaign worlds (136 generator/world combinations)
- Freeform canvas (SvelteFlow) — generate cards, arrange, connect, annotate
- Play mode — turn order, fate points, stress, consequences, GM pool
- Session Zero — guided world/character setup → export to prep canvas
- Offline-first PWA — works without internet after first load
- Multiplayer — players join via room code, see GM canvas in real time
- Export — Markdown, JSON, Excalidraw

---

## Stack

- **SvelteKit** + **Svelte 5** (runes: `$state`, `$derived`, `$props`)
- **@xyflow/svelte** — canvas pan/zoom/connect
- **bits-ui** — accessible headless UI components
- **Dexie 4** — IndexedDB persistence
- **Vite 7** + `adapter-static` — build
- **Cloudflare Pages** — deploy

---

## Development

```bash
npm install
npm run dev       # Dev server at localhost:5173
npm run build     # Production build → build/
npm run preview   # Preview production build
```

### QA

```bash
node scripts/qa-hard.mjs    # Content + engine checks (must exit 0)
node scripts/qa-export.mjs  # Export round-trip checks (must exit 0)
```

### Delivery

```bash
bash scripts/bump-version.sh   # Bump version
# Zip: YYYY.MM.NNN.zip (excluding node_modules, .svelte-kit, build, .git)
```

---

## Architecture

See `CLAUDE.md` for architecture rules, component inventory, and engineering conventions.
See `docs/claude/` for session bootstrap, project memory, team voices, and world voices.

### Key rules

1. All styling in `static/assets/css/theme.css` — no `<style>` blocks
2. `engine.js` and `db.js` are pure JS — no Svelte imports
3. Svelte 5 runes everywhere — `$state()`, `$derived()`, `$props()`
4. SvelteFlow `nodes`/`edges` must be `writable()` stores, not `$state([])`
5. Card components must not have `left/top` style or `onmousedown` drag — SvelteFlow owns that

---

## Worlds

Shattered Kingdoms (fantasy) · Neon Abyss (cyberpunk) · Void Runners (space) ·
The Long After (post-apoc) · The Long Road (road post-apoc) ·
Gaslight Chronicles (Victorian) · Dust and Iron (western) · dVenti Realm (original fantasy)

---

## Attribution

Fate Condensed SRD © Evil Hat Productions, LLC.
Licensed under Creative Commons Attribution 3.0 Unported.
Randy Oest / Amazing Rando Design — fate-srd.com

See `LICENSING.md` for full attribution.

---

## History

Built March 2026. Original React 18 CDN UMD codebase migrated to SvelteKit + Svelte 5.
The `react-source/` directory contains the original codebase (read-only reference).
