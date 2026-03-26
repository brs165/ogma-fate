# Bootstrap — Session Startup Checklist

Read this at the start of every Claude Code session on ogma-fate.

---

## 1. Orient

```bash
pwd                   # Should be …/ogma-fate
git branch            # Note current branch (main)
git log --oneline -5  # See recent work
npm run build 2>&1 | tail -5  # Must print "✔ done"
```

## 2. Fetch live files before editing

Always pull these raw URLs at session start so you have current state:

```
https://raw.githubusercontent.com/brs165/ogma-fate/main/static/assets/css/theme.css
https://raw.githubusercontent.com/brs165/ogma-fate/main/src/lib/engine.js
```

Add others per task (e.g. `src/lib/stores/canvasStore.js`, `src/lib/components/board/Board.svelte`).

---

## 3. Key files

| Path | What it is |
|------|-----------|
| `CLAUDE.md` | Architecture rules, commands, component inventory |
| `docs/claude/PROJECT_MEMORY.md` | Current stack, known issues, backlog |
| `src/lib/engine.js` | Pure-function content generator. No Svelte imports. |
| `src/lib/db.js` | Dexie 4 IndexedDB wrapper. No Svelte imports. |
| `src/lib/helpers.js` | Shared utility functions |
| `src/lib/stores/` | 6 stores: canvas, play, binder, sync, session, chrome |
| `src/lib/components/board/Board.svelte` | Main app shell — 800+ lines |
| `src/lib/components/board/nodes/` | SvelteFlow custom node components (4 files) |
| `src/lib/components/board/nodeTypes.js` | SvelteFlow node type registry (module-level) |
| `src/data/` | 11 campaign data modules |
| `src/routes/+layout.js` | `ssr=false, prerender=false` — client-only SPA |
| `static/assets/css/theme.css` | ALL styling lives here — no `<style>` blocks |
| `static/sw.js` | Service worker — bumped by bump-version.sh |
| `static/_redirects` | Cloudflare Pages SPA: `/* /index.html 200` |
| `scripts/bump-version.sh` | Run before every zip delivery |

---

## 4. Stack facts

- **Svelte 5.51.0** — full runes mode. Zero `runes={false}` files remain.
- **`$state()`** on every mutable `let`. Never plain `let` for reassigned vars.
- **`$props()`** for all component props. Never `export let`.
- **`onclick=`** not `on:click=`. Svelte 5 event syntax throughout.
- **SvelteFlow nodes/edges** MUST be `writable([])` stores, NOT `$state([])`.
- **No `left/top/position:absolute`** on card components — SvelteFlow positions them.
- **No drag handlers** on card components — SvelteFlow handles dragging.
- **`adapter-static`** + `fallback: 'index.html'` + `static/_redirects`.
- **`npx vite build`** in package.json build script (not bare `vite`).

---

## 5. Component inventory (54 .svelte files)

```
src/lib/components/
├── cards/           6 files   CvLabel, CvTag, StressRow, ClockTrack, Cv4Card, BackPanel
│   └── fronts/     18 files   NpcMinor, NpcMajor, Scene, Campaign, Encounter, Seed,
│                               Compel, Challenge, Contest, Consequence, Faction,
│                               Complication, Backstory, Obstacle, Countdown, Constraint,
│                               Custom, Pc
├── board/          18 files   Board, BoardCard, BoardLabel, BoardSticky, BoardBoost,
│                               TurnBar, PlayerRow, CombatTracker, PlayPanel, BinderPanel,
│                               DossierModal, Topbar, ExportMenu, ExportPanel, HelpPanel,
│                               StuntPanel, MobileList, CommandPalette
│   └── nodes/       4 files   CardNode, StickyNode, BoostNode, LabelNode
├── campaign/        3 files   Campaign, FatePointTracker, Landing
├── panels/          1 file    LeftPanel
├── dice/            1 file    DicePanel
├── player/          1 file    PlayerSurface
└── shared/          2 files   HelpDiceRoller, Footer
```

---

## 6. QA gate — run before every zip delivery

```bash
node scripts/qa-hard.mjs    # Must exit 0
node scripts/qa-export.mjs  # Must exit 0
npm run build               # Must print "✔ done"
```

---

## 7. Zip delivery format

```bash
# Bump version first
bash scripts/bump-version.sh

# Then zip (exclude node_modules, .svelte-kit, build, .git)
zip -rq YYYY.MM.NNN.zip . \
  -x "node_modules/*" -x ".svelte-kit/*" -x "build/*" -x ".git/*"
```

Zip name matches version: `2026.03.576.zip`

---

## 8. Architecture rules

1. One component per `.svelte` file
2. CSS in `static/assets/css/theme.css` only — no `<style>` blocks
3. `engine.js` and `db.js` are pure JS — no Svelte imports ever
4. Stores are plain `.js` files — no Svelte syntax
5. Components import from stores; stores never import from components
6. Preserve all a11y: `role`, `aria-label`, `aria-pressed`, `aria-expanded`
7. SvelteFlow node components must NOT have their own drag/position logic
8. `nodeTypes.js` must be module-level — never inside a reactive block
