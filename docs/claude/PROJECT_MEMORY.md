# Project Memory — Ogma
_Persistent context for model-switching and session handoffs._
_Last updated: 2026.03.814 — Help content revamp, AddMenu in canvas controls, card generation fix_

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit + Svelte 5.51.0 (full runes mode) |
| Build | Vite 7, `@sveltejs/adapter-static`, `npx vite build` |
| Canvas | **Native — pointer/wheel events + CSS transform** (SvelteFlow removed in v662) |
| UI Primitives | `bits-ui@2.16.3` — Dialog, Accordion, DropdownMenu, ToggleGroup, AlertDialog, Collapsible, Select, Popover |
| Icons | Font Awesome 7.2 Free via jsDelivr CDN (cached by SW for offline) |
| Card Design | FateX-inspired fate-sheet tokens (`--fs-*`) — off-white `#F5F0E8` body, campaign-tinted headers |
| State | Svelte `writable`/`derived` stores in plain JS + `$state` in components |
| Persistence | Dexie 4 (IndexedDB) + localStorage prefs (`fate_prefs_v1`) |
| Sync | WebSocket multiplayer via PartySocket |
| Styling | Global `static/assets/css/theme.css` (~5,700 lines) — no `<style>` blocks in components |
| PWA | `static/sw.js` + `static/manifest.json` |
| Deploy | Cloudflare Pages (auto-deploy from `main`), `static/_redirects` for SPA routing |
| Offline | `build/` directory with `start.sh/.bat/.command` launcher scripts + README.txt |

---

## Key file paths

```
src/lib/engine.js                    Pure-function content generator (no Svelte imports)
src/lib/db.js                        Dexie 4 IndexedDB wrapper + localStorage prefs (no Svelte imports)
src/lib/helpers.js                   Shared utility functions
src/lib/stores/canvasStore.js        Canvas: card CRUD, generate, connectors, undo, IDB persist
src/lib/stores/sessionStore.js       Session: active generator, result history, prefs
src/lib/stores/chromeStore.js        Chrome: toast queue, theme, SW update
src/lib/components/board/Board.svelte         Main app shell + native canvas
src/lib/components/campaign/Campaign.svelte   Campaign page: generator UI, split layout, onboarding
src/data/                            8 campaign data files + shared + universal + index
src/routes/+layout.js                ssr=false, prerender=false
static/assets/css/theme.css          ALL styling — never add <style> to components
static/sw.js                         Service worker — cache name bumped by bump-version.sh
static/_redirects                    /* /index.html 200
scripts/bump-version.sh              Run ONCE before final zip only
docs/claude/BOOTSTRAP.md             Session startup checklist
docs/claude/CANVAS-WORKSHOP.md       Canvas sprint status and backlog
```

---

## Svelte 5 runes rules (CRITICAL — applies to all 78 .svelte files)

- `let x = $state(value)` — mutable local state. Use `$state.raw(value)` for objects always replaced wholesale (avoids deep proxy).
- `let x = $derived(expr)` — computed values. Expression only, never a wrapping function.
- `let { prop = default } = $props()` — component props. Never `export let`.
- `$effect(() => { ... })` — DOM side effects only. Not for state derivation (use `$derived`). Never write to state inside `$effect` based on another state value.
- `onclick={}` not `on:click={}` — Svelte 5 event syntax throughout.
- `{@render children?.()}` not `<slot />` — snippet rendering.
- **`$state()` only at component top level** — never inside function bodies.
- **Zero `runes={false}` files** — all components are on runes mode.
- **Dependency hacks banned** — `void expr` inside `$effect` was an anti-pattern; use bare `expr;` for silent dependencies.

---

## Native canvas architecture (v662+)

```
canvasStore.cards (writable)     — source of truth for all card x/y/z positions
canvasStore.connectors (writable) — array of {id, fromId, toId, label}

Board.svelte:
  panX, panY = $state(0)     viewport pan offset in px
  zoom       = $state(0.8)   viewport scale factor

  <div class="cv-wrap">
    <svg class="cv-svg-overlay">   <!-- connector lines, pointer-events:none -->
      {#each connectors}  <line x1... y1... x2... y2... />  {/each}
    </svg>
    <div class="cv-viewport" style="transform: translate({panX}px,{panY}px) scale({zoom})">
      {#each cards}
        <div class="cv-card-positioner" style="left:{card.x}px; top:{card.y}px">
          {#if card.genId === 'sticky'} <BoardSticky ... />
          {:else if card.genId === 'boost'} <BoardBoost ... />
          {:else if card.genId === 'label'} <BoardLabel ... />
          {:else} <BoardCard ... />
          {/if}
        </div>
      {/each}
    </div>
    <div class="cv-minimap">...</div>
    <div class="cv-controls">Zoom +/−/Fit</div>
  </div>
```

**Coordinate math:**
```js
// Screen → canvas (for right-click card placement)
canvasX = (screenX - panX) / zoom
canvasY = (screenY - panY) / zoom

// Canvas → screen (for connector endpoints, minimap)
screenX = cardX * zoom + panX
screenY = cardY * zoom + panY
```

**Drag handling:**
- `pointerdown` on card: capture pointer, record start offset
- `pointermove`: update card x/y = (clientX - panX)/zoom - offsetX
- `pointerup`: release capture, persist to store
- Cards do NOT have `position:absolute` with `left/top` via inline style on the card component itself — only the `.cv-card-positioner` wrapper has those

---

## Component inventory (78 .svelte files)

```
src/lib/components/
├── cards/           4    StressRow, ClockTrack, Cv4Card, BackPanel
│   └── fronts/     18    NpcMinor, NpcMajor, Scene, Campaign, Encounter, Seed,
│                         Compel, Challenge, Contest, Consequence, Faction,
│                         Complication, Backstory, Obstacle, Countdown,
│                         Constraint, Custom, Pc
├── board/          19    Board, OgmaCanvas, BoardCard, BoardLabel, BoardSticky,
│                         BoardBoost, BoardGroup, Topbar, AddMenu, DossierModal,
│                         ExportMenu, ExportModal, ExportPanel, HelpPanel, StuntPanel,
│                         MobileList, CommandPalette, CanvasContextMenu, GenerateFAB
├── campaign/        3    Campaign, FatePointTracker, Landing
├── panels/          1    LeftPanel
├── dice/            1    DicePanel
└── shared/          3    HelpDiceRoller, Footer, OgmaTooltip

src/routes/                29 route page/layout files
```

**Stores (3):** canvasStore.js, sessionStore.js, chromeStore.js
**Deleted stores:** playStore.js, binderStore.js, syncStore.js (play mode removed v665)

---

## Onboarding system (v699)

Progressive onboarding managed by Campaign.svelte using `db.js` localStorage prefs:

| Feature | Trigger | Persistence |
|---------|---------|-------------|
| Welcome banner | `visitCount === 1 && !introSeen` | `intro_seen[campId]` in LS |
| Ctrl+K coach mark | `visitCount >= 3 && !coachDismissed` | `coach_cmd_dismissed` in LS |
| First-roll annotation | `visitCount === 1` | Session only |
| Auto-expand GM guidance | `isFirstRoll && helpLevel === 'new_fate'` | Session only |
| Mobile FAB hint | After sendToTable on mobile | Session only (4s timeout) |
| Help level auto-upgrade | `visitCount > 5` | `help_level` in LS |
| Contextual HelpPanel | Active generator maps to section | Reactive |
| Canvas templates (empty state) | `cards.length === 0` | N/A |
| Quick Start summaries | All 8 help pages | Static (open by default) |

---

## Campaign worlds (8)

| Key | Name |
|-----|------|
| `fantasy` | Shattered Kingdoms |
| `cyberpunk` | Neon Abyss |
| `postapoc` | The Long After |
| `space` | Void Runners |
| `victorian` | Gaslight Chronicles |
| `western` | Dust and Iron |
| `thelongafter` | The Long Road |
| `dVentiRealm` | dVenti Realm |

---

## What's complete

**Onboarding system (v699)** — 25 recommendations from simulated play session reports:
welcome banner, coach marks, first-roll guidance, contextual help panel, Session Zero
jargon tooltips, canvas templates in empty state, mobile FAB hint, Quick Start summaries
on all help pages, Web Share API, mobile-responsive onboarding CSS, help level auto-upgrade.

**Native canvas migration (v662)** — SvelteFlow replaced with pointer/wheel native pan/zoom.
Cards render directly via `{#each}` loop in a transformed viewport div. Connectors as SVG
overlay. Minimap as scaled position rectangles. No `@xyflow/svelte` dependency.

**Svelte 5 migration** — all 78 .svelte files on runes, zero legacy files.

**Svelte 5 runes compliance audit (v680)** — systematic pass across all components:
`void`-dependency hacks removed, sync `$effect` anti-patterns replaced with `$derived`,
`$state.raw` adopted for wholesale-replaced objects, `tick()` replaces `setTimeout(..., 0)`.

**Code audit (v691)** — 8 issues fixed: character creation infinite loop, export selection
reset, event listener leak, debounced store persistence, Math.min/max stack overflow,
mobile table single-Board architecture.

**Canvas features** — edge labels, card minimise/expand, search dim, connect mode, NPC acted
state, clock trigger ring, empty canvas hint with templates, fitAll on load, gmOnly toggle,
consequence stickies, undo (moves + reroll + delete), Ctrl+A select all, canvas templates
(Opening Scene, Investigation, Climax, Session Zero), node groups.

**FateX-style card restyling (v600)** — all 18 card fronts + Cv4Card shell with `--fs-*` tokens.

**Font Awesome 7.2 Free (v593)** — loaded via jsDelivr CDN. ~200 emoji→FA replacements.

**Legal compliance (v586)** — Fate Condensed attribution corrected. All HTTP→HTTPS.

**Mobile UX** — single-Board mobile architecture, bottom-sheet table, safe-area-inset padding,
44px touch targets, responsive onboarding components, compact banner on small screens.

---

## Active backlog (next priorities)

### Tier 1 — Content & polish
- **BL-03** Victorian adjective pass [S] — weakest world voice
- **BL-08** Western world content depth [M] — more tables

### Tier 2 — Features
- **BL-06** Shareable links [M]
- **BL-11** Shared learning state in multiplayer [L] — GM sees player help progress

### Tier 3 — PDF books (remaining)
- **PDF-04** Shattered Kingdoms
- **PDF-05** Neon Abyss
- **PDF-06** Void Runners
- **PDF-07** dVenti Realm
- **PDF-08** Dust and Iron

### Recently completed
- ~~**JIT tooltips**~~ OgmaTooltip on ~15 card elements across 10 fronts (NpcMinor, NpcMajor, Encounter, Obstacle, Complication, Consequence, Constraint, Faction, Scene, Seed) — v815
- ~~**/help/mistakes page**~~ 20 common Fate errors with D&D comparisons, fixes, FCon citations — v815
- ~~**Generator cross-links**~~ `related` field in HELP_CONTENT, clickable buttons in Campaign How tab — v815
- ~~**Boost in BackPanel**~~ Added boost entry to CV4_HELP for card flip-side help — v815
- ~~**Help content revamp**~~ prev/next nav, SRD links, On this page TOC, mobile polish, Wiki→Help rename — v814
- ~~**AddMenu in canvas controls**~~ moved from Topbar to OgmaCanvas cv-controls panel — v814
- ~~**Card generation fix**~~ Board.svelte now imports CAMPAIGNS directly (getWorldTables was broken) — v814
- ~~**Onboarding system**~~ 25 recommendations from play session reports — v699
- ~~**Code audit**~~ 8 issues fixed, mobile table rewrite — v691
- ~~**Svelte 5 runes compliance audit**~~ void hacks, sync effects, $state.raw — v680
- ~~**Canvas migration**~~ SvelteFlow → native pointer/wheel canvas — v662
- ~~**WC-02**~~ Node groups — v670
- ~~**WC-05**~~ Canvas templates — v670
- ~~**BL-01**~~ localStorage schema — v624
- ~~**BL-02**~~ Stunt data — v627
- ~~**BL-07**~~ GM Tips depth — v630
- ~~**BL-15**~~ Mobile nav overhaul — v621

---

## Build / version rules

- **Version format:** `YYYY.MM.NNN` (e.g. `2026.03.699`)
- **Zip naming:** source = `YYYY-MM-NNN.zip`, offline = `ogma-offline-YYYY-MM-NNN.zip`
- **`npx vite build`** — use for all test/intermediate builds. No version bump.
- **`npm run build`** — same as `npx vite build`. Does NOT bump. Safe for CF Pages.
- **`bash scripts/bump-version.sh`** — run ONCE, immediately before the final zip delivery only. **Auto-commits the bump** — the change is never lost.
- Current version: `2026.03.819`

---

## Deployment

- **URL:** ogma.net
- **Platform:** Cloudflare Pages — auto-deploys from `main` branch
- **Repo:** github.com/brs165/ogma-fate
- **Build command:** `npm run build` (just `npx vite build` — no bump in CF)
- **Build output:** `build/`
