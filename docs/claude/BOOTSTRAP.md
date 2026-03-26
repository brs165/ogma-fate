# Bootstrap — Session Startup Checklist

Read this at the start of every session on ogma-fate.

---

## 1. Orient

```bash
pwd                          # Should be …/ogma-fate
git branch                   # Confirm on main
git log --oneline -5         # See recent work
npm run build 2>&1 | tail -5 # Must print "✔ done"
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
| `src/lib/components/board/nodes/` | 4 SvelteFlow node components |
| `src/lib/components/board/nodeTypes.js` | SvelteFlow node registry (module-level only) |
| `src/data/` | 8 campaign data files + shared/universal/index |
| `src/routes/+layout.js` | `ssr=false, prerender=false` |
| `static/assets/css/theme.css` | ALL styling — no `<style>` blocks in components |
| `static/sw.js` | Service worker — bumped by bump-version.sh |
| `scripts/bump-version.sh` | Run before every zip |

---

## 4. Stack facts (critical)

**Svelte 5 runes — 82 components, zero legacy:**
- `$state()` on every mutable `let` — never plain `let` for reassigned vars
- `$props()` for all component props — never `export let`
- `onclick=` not `on:click=` — Svelte 5 event syntax
- `$derived(expr)` — expression only, never a wrapping `() => {}`
- `$state()` only at component top level — never inside function bodies

**SvelteFlow — non-negotiable rules:**
- `flowNodes`/`flowEdges` MUST be `writable([])` stores, NOT `$state([])`
- Card components must NOT have `left/top` style or `onmousedown` handlers
- `nodeTypes.js` must be module-level — never inside a component or reactive block
- `nodrag nopan` on buttons/inputs inside node components

**CSS:**
- `static/assets/css/theme.css` only — never add `<style>` blocks to components
- Card fronts use `fs-*` CSS classes (fate-sheet design tokens) — never inline old `--cv-card-*` vars

**Icons:**
- Font Awesome 7.2 Free via jsDelivr CDN — cached by service worker for offline
- All icons use `<i class="fa-solid fa-name" aria-hidden="true"></i>` pattern
- Zero emoji HTML entities in any .svelte file — FA icons throughout

---

## 5. Component inventory (82 files)

```
src/lib/components/
├── cards/fronts/   18    NpcMinor, NpcMajor, Scene, Campaign, Encounter, Seed,
│                         Compel, Challenge, Contest, Consequence, Faction,
│                         Complication, Backstory, Obstacle, Countdown,
│                         Constraint, Custom, Pc
├── cards/           6    CvLabel, CvTag, StressRow, ClockTrack, Cv4Card, BackPanel
├── board/          20    Board, BoardCard, BoardSticky, BoardBoost, BoardLabel,
│                         TurnBar, PlayerRow, CombatTracker, PlayPanel, BinderPanel,
│                         DossierModal, Topbar, ExportMenu, ExportPanel, HelpPanel,
│                         StuntPanel, MobileList, CommandPalette,
│                         CanvasContextMenu, GenerateFAB
│   └── nodes/       4    CardNode, StickyNode, BoostNode, LabelNode
├── campaign/        3    Campaign, FatePointTracker, Landing
├── dice/            1    DicePanel
├── panels/          1    LeftPanel
├── player/          1    PlayerSurface
└── shared/          2    HelpDiceRoller, Footer

src/routes/         26    route pages/layouts
```

---

## 6. QA gate — must pass before every zip delivery

```bash
node scripts/qa-hard.mjs    # Content + engine + static analysis (188 checks)
node scripts/qa-export.mjs  # Export round-trip (166 checks)
npm run build               # Must print "✔ done"
```

### Static analysis checks (in qa-hard.mjs)
- `$state()` timer variables read inside `$effect()` → infinite loop
- `$state()` inside function bodies → invalid Svelte 5
- `on:click` instead of `onclick` → Svelte 4 syntax
- `export let` instead of `$props()` → Svelte 4 props
- `<style>` blocks in components → CSS rule violation
- Emoji HTML entities → should be FA icons
- `--cv-card-*` tokens in card fronts → should use `--fs-*` (warning)

### Browser smoke tests (optional — requires Playwright)
```bash
npx playwright install chromium   # One-time setup
node scripts/qa-smoke.mjs         # Loads all 26 routes, generates on 8 worlds,
                                   # tests nav + footer. Exit 0=pass, 2=skipped
```

---

## 7. Zip delivery

```bash
# Source zip (for GitHub push)
bash scripts/bump-version.sh
zip -rq YYYY-MM-NNN.zip . \
  -x "node_modules/*" -x ".svelte-kit/*" -x "build/*" -x ".git/*"

# Offline distribution zip (pre-built, for end users)
npx vite build
cd build && zip -rq ../ogma-offline-YYYY-MM-NNN.zip .
```

Current version: `2026.03.652`

---

## 8. Architecture rules (non-negotiable)

1. One component per `.svelte` file
2. CSS in `static/assets/css/theme.css` only — no `<style>` blocks
3. `engine.js` and `db.js` are pure JS — no Svelte imports ever
4. Stores are plain `.js` — no Svelte syntax
5. Components import from stores; stores never import from components
6. Preserve all a11y: `role`, `aria-label`, `aria-pressed`, `aria-expanded`
7. SvelteFlow nodes must NOT have their own drag/position logic
8. `nodeTypes.js` must be at module level — never reactive
