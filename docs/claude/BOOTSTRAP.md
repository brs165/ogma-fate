# Bootstrap — Session Startup Checklist

Read this at the start of every session on ogma-fate.

---

## 1. Orient

```bash
pwd                          # Should be …/ogma-fate
git branch                   # Confirm on main
git log --oneline -5         # See recent work
npx vite build 2>&1 | tail -5 # Must print "✔ done"
```

## 2. Fetch live files before editing

Always pull these before touching anything:

```
https://raw.githubusercontent.com/brs165/ogma-fate/main/static/assets/css/theme.css
https://raw.githubusercontent.com/brs165/ogma-fate/main/src/lib/engine.js
```

Add others per task (e.g. `src/lib/stores/canvasStore.js`, `src/lib/components/board/Board.svelte`).

---

## 3. Key files quick reference

| Path | What it is |
|------|-----------| 
| `CLAUDE.md` | Architecture rules, commands |
| `docs/claude/PROJECT_MEMORY.md` | Full current state, backlog |
| `docs/claude/CANVAS-WORKSHOP.md` | Canvas sprint status |
| `src/lib/engine.js` | Pure-function generator. No Svelte imports. |
| `src/lib/db.js` | Dexie 4 IDB wrapper. No Svelte imports. |
| `src/lib/stores/` | 6 stores: canvas, play, binder, sync, session, chrome |
| `src/lib/components/board/Board.svelte` | Main app shell |
| `src/data/` | 8 campaign data files + shared/universal/index |
| `src/routes/+layout.js` | `ssr=false, prerender=false` |
| `static/assets/css/theme.css` | ALL styling — no `<style>` blocks in components |
| `static/sw.js` | Service worker — bumped by bump-version.sh |
| `scripts/bump-version.sh` | Run ONCE before the final zip only |

---

## 4. Stack facts (critical)

**Svelte 5 runes — 76 files, zero legacy:**
- `$state()` on every mutable `let` — never plain `let` for reassigned vars
- `$props()` for all component props — never `export let`
- `onclick=` not `on:click=` — Svelte 5 event syntax
- `$derived(expr)` — expression only, never a wrapping `() => {}`
- `$state()` only at component top level — never inside function bodies

**Native canvas (Board.svelte) — no SvelteFlow:**
- Pan/zoom via wheel + pointer events + CSS transform
- Cards render in `<div class="cv-viewport">` with `transform: translate(panX,panY) scale(zoom)`
- Card drag: pointerdown/pointermove/pointerup accounting for zoom scale
- Connectors: `<svg class="cv-svg-overlay">` with line elements
- Minimap: scaled-down card position rectangles + viewport indicator
- Zoom controls: plain buttons calling setZoom() / fitAll()
- Background: CSS radial-gradient dot pattern
- `@xyflow/svelte` is NOT installed — never import from it

**Canvas coordinate math:**
```js
// Screen → canvas coords (right-click generate position)
canvasX = (screenX - panX) / zoom
canvasY = (screenY - panY) / zoom
```

**CSS:**
- `static/assets/css/theme.css` only — never add `<style>` blocks to components
- Card fronts use `fs-*` CSS classes — never use old `--cv-card-*` vars

**Icons:**
- Font Awesome 7.2 Free via jsDelivr CDN — cached by service worker for offline
- All icons: `<i class="fa-solid fa-name" aria-hidden="true"></i>`
- Zero emoji HTML entities in any .svelte file

---

## 5. Component inventory (77 .svelte files)

```
src/lib/components/
├── cards/fronts/   18    NpcMinor, NpcMajor, Scene, Campaign, Encounter, Seed,
│                         Compel, Challenge, Contest, Consequence, Faction,
│                         Complication, Backstory, Obstacle, Countdown,
│                         Constraint, Custom, Pc
├── cards/           4    StressRow, ClockTrack, Cv4Card, BackPanel
├── board/          20    Board, BoardCard, BoardSticky, BoardBoost, BoardLabel,
│                         TurnBar, PlayerRow, CombatTracker, PlayPanel, BinderPanel,
│                         DossierModal, Topbar, ExportMenu, ExportPanel, HelpPanel,
│                         StuntPanel, MobileList, CommandPalette,
│                         CanvasContextMenu, GenerateFAB
├── campaign/        3    Campaign, FatePointTracker, Landing
├── dice/            1    DicePanel
├── panels/          1    LeftPanel
├── player/          1    PlayerSurface
└── shared/          2    HelpDiceRoller, Footer

src/routes/         27    route pages/layouts
```

> NOTE: `src/lib/components/board/nodes/` and `nodeTypes.js` were deleted in v662 (native canvas migration).

---

## 6. QA gate — must pass before every zip delivery

```bash
node scripts/qa-hard.mjs    # Content + engine + static analysis (189 checks)
node scripts/qa-export.mjs  # Export round-trip (166 checks)
npx vite build               # Must print "✔ done"
```

---

## 7. Zip delivery

```bash
# BUILD SCRIPT RULE:
# - `npx vite build` for test builds — NO version bump
# - `bash scripts/bump-version.sh` ONCE only, immediately before the final zip

# Source zip (for GitHub push)
bash scripts/bump-version.sh
zip -rq YYYY-MM-NNN.zip . \
  -x "node_modules/*" -x ".svelte-kit/*" -x "build/*" -x ".git/*"

# Offline distribution zip
npx vite build
cd build && zip -rq ../ogma-offline-YYYY-MM-NNN.zip .
```

Current version: `2026.03.663`

---

## 8. Architecture rules (non-negotiable)

1. One component per `.svelte` file
2. CSS in `static/assets/css/theme.css` only — no `<style>` blocks
3. `engine.js` and `db.js` are pure JS — no Svelte imports ever
4. Stores are plain `.js` — no Svelte syntax
5. Components import from stores; stores never import from components
6. Preserve all a11y: `role`, `aria-label`, `aria-pressed`, `aria-expanded`
7. Canvas cards must NOT have `left/top` absolute positioning — viewport transform handles position
8. `@xyflow/svelte` is removed — do not import from it
