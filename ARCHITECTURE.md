# Ogma Architecture Guide

> Technical deep-dive for contributors. Covers the execution model, data flow, React patterns, IndexedDB persistence, the service worker, Cloudflare Pages deployment, and the Table canvas multiplayer system. Read this before touching `core/*.js`.
>
> **Last updated:** 2026.03.342

---

## Architecture overview

> **HTTPS-first. Offline after first load. No backend. No build step.**

- Raw JavaScript via `<script>` tags — no bundler, no transpiler
- React 18 via CDN UMD — no JSX. `React.createElement` aliased as `h`.
- `const`/`let` in `ui-primitives.js`, `ui-modals.js`, `ui-landing.js`. Mixed in `ui-renderers.js` and `ui-table.js` (module-level `var` constants coexist with function-scoped `var`). `ui.js`, `ui-board.js`, `ui-run.js`, `engine.js`, `db.js`, `config.js`, `intro.js`, and `data/*.js` use `var` only. See `docs/code-quality.md` for the full split rationale and ESLint enforcement.
- Global variables — `CAMPAIGNS`, `GENERATORS`, `UNIVERSAL`, `HELP_CONTENT`, `DB`, `LS`
- Service worker (`sw.js`) caches `APP_SHELL` for full offline use
- IDB (Dexie 4) for all data persistence — localStorage only for user preferences (via `LS` wrapper in `db.js`)
- Multiplayer via Cloudflare Workers Durable Objects — optional, opt-in, offline mode unchanged

---

## Script load order (campaign pages)

```html
<!-- React 18 + ReactDOM via CDN UMD -->
<script src="https://cdnjs.cloudflare.com/.../react.production.min.js" integrity="..."></script>
<script src="https://cdnjs.cloudflare.com/.../react-dom.production.min.js" integrity="..."></script>

<!-- Data layer -->
<script src="../data/shared.js?v=N"></script>     <!-- CAMPAIGNS={}, GENERATORS, HELP_CONTENT, ALL_SKILLS -->
<script src="../data/universal.js?v=N"></script>  <!-- Cross-world tables -->
<script src="../data/[world].js?v=N"></script>    <!-- Campaign-specific tables -->

<!-- Logic layer -->
<script src="../core/config.js?v=1"></script>     <!-- OGMA_CONFIG: REPO_BASE, DEFAULT_SYNC_HOST -->
<script src="../core/engine.js?v=N"></script>     <!-- generate(), filteredTables(), toMarkdown(), etc. -->

<!-- Dexie IDB library (CDN) -->
<script src="https://cdnjs.cloudflare.com/.../dexie.min.js" integrity="..."></script>

<!-- Storage + multiplayer client -->
<script src="../core/db.js?v=N"></script>         <!-- DB (IDB wrapper), LS (localStorage wrapper) -->
<script src="../assets/js/partysocket.js?v=N"></script>  <!-- PartySocket — same-origin vendored, no CDN -->

<!-- UI layer (strict order — each depends on the previous) -->
<script src="../core/ui-primitives.js?v=N"></script>  <!-- h, useState, useEffect…, ErrorBoundary, SVG icons -->
<script src="../core/ui-renderers.js?v=N"></script>   <!-- 16 result renderers, renderResult() -->
<script src="../core/ui-table.js?v=N"></script>       <!-- PrepCanvas + Table canvas components -->
<script src="../core/ui-modals.js?v=N"></script>      <!-- Modal, ShareDrawer, Settings, Vault, QuickFind -->
<script src="../core/ui-landing.js?v=N"></script>     <!-- LandingApp, CAMPAIGN_PAGES, JoinTableCard -->
<script src="../core/ui.js?v=N"></script>             <!-- CampaignApp shell — main campaign page component -->
<script src="../core/intro.js?v=N"></script>          <!-- Campaign intro animation (DOM, not React) -->
```

**Board page (`board.html`)** loads a different tail — no `ui-landing.js`, no `intro.js`, but adds board-specific scripts:
```html
<!-- After ui-primitives.js and partysocket.js... -->
<script src="../core/ui-renderers.js?v=N"></script>
<script src="../core/ui-table.js?v=N"></script>   <!-- TpDicePanel, FatePointTracker -->
<script src="../core/ui-modals.js?v=N"></script>
<script src="../core/ui.js?v=N"></script>         <!-- createTableSync, DEFAULT_FP_STATE, FatePointTracker -->
<script src="../core/ui-board.js?v=N"></script>   <!-- BoardApp — board-specific root component -->
```

**Run page (`run.html`)** is a JS redirect to `board.html?mode=play`. It preserves `?world=` and `?room=` URL params. `core/ui-run.js` is a 9-line tombstone (v330) — sync lives in `createTableSync` inside `core/ui.js`, which `board.html` loads.

`<base href="/">` is required on all campaign pages (Cloudflare Pages Pretty URLs strip `.html`; without it, `../core/` resolves to `/campaigns/core/`).

---

## CI (GitHub Actions)

Three jobs in `.github/workflows/ci.yml`:

| Job | What it does |
|-----|-------------|
| **Lint & Format** | `npm install` (no lock file — uses `npm install` not `npm ci`) then ESLint + Prettier check |
| **QA Assertions** | `node tests/qa_named.js` · `npm run smoke` · `node tests/engine.test.js` · CDN version check |
| **CDN Integrity** | `node scripts/verify-cdn-deps.js` — SRI hash verification |

**No `package-lock.json` is committed.** The `lint` job uses `npm install` which generates a fresh lock file per run. `cache: 'npm'` is omitted from `setup-node` (it requires a lock file to hash).

---

## Cloudflare Pages deployment

- **No `_redirects` file.** CF Pages Pretty URLs handles `.html` stripping automatically. The file was removed in v290 — it caused redirect conflicts. Do not re-add it.
- **`_headers` file** sets CSP for all pages. `script-src` allows `cdnjs.cloudflare.com` and `static.cloudflareinsights.com` (CF injects their analytics beacon). `connect-src` allows `wss://*.workers.dev`. CF Pages consumes `_headers` at deploy time — it is never served as a URL and must NOT be in SW APP_SHELL.
- **CDN scripts must NOT be in SW CDN_SCRIPTS.** The SW intercept strips CORS headers. `if (isCDN) return` in the fetch handler lets the browser handle CDN scripts natively with full CORS support.
- **Pretty URLs** — CF Pages strips `.html` from URLs. `<base href="/">` on every campaign page prevents relative path breakage.
- **SW skipWaiting** — `self.skipWaiting()` on install forces immediate takeover so users on old SW versions get the new SW on next visit without closing tabs.
- **CF Beacon SRI warning** — CF Pages auto-injects their Web Analytics beacon script. If the beacon URL updates before CF updates the injected hash, a console SRI warning appears. This is on CF's side and does not affect functionality.


---

## Data flow

```
User clicks Roll
  │
  ▼
CampaignApp.doRoll()
  │
  ├── genId = activeGen (e.g. "npc_major")
  ├── partySize = settings.partySize (default 4)
  ├── tables = filteredTables(
  │             mergeUniversal(CAMPAIGNS[campId].tables),
  │             tablePrefs  ← from IndexedDB
  │           )
  │
  ▼
generate(genId, tables, partySize)   ← engine.js, Node-testable
  │
  ├── Returns: { name, aspects, skills, ... }
  │
  ▼
setResult(data)  →  renderResult(genId, data)  ← ui-renderers.js
                                   OR
                     renderCard(genId, data)   ← cv4Card (600×380 landscape, world-coloured)
```

---

## Three surfaces

Ogma has three distinct session surfaces, each a separate HTML page:

| Surface | File | Root component | Purpose |
|---------|------|---------------|---------|
| **Generator** | `campaigns/[world].html` | `CampaignApp` (ui.js) | Roll generators, pin results, FP tracker, table settings |
| **Board** | `campaigns/board.html` | `BoardApp` (ui-board.js) | Unified prep/play canvas. Prep mode: generate + arrange cards. Play mode: player roster, stress/FP, round tracker, turn order. |
| **Run** | `campaigns/run.html` | Redirect | JS redirect to `board.html?mode=play`. `ui-run.js` stripped v330 — tombstone only. |

The Board and Run surfaces share sync infrastructure (`createTableSync` in ui.js) and the `PrepCanvas` component (`ui-table.js`).

---

## Table canvas architecture

`PrepCanvas` (in `core/ui-table.js`) is the full-screen interactive session surface used in campaign pages. Board's Play mode uses its own `BoardPlayerRow`/`BoardTurnBar` components rather than PrepCanvas directly.

### State model

```
PrepCanvas local state:
  pinnedCards[]    ← from props.pinnedCards / props.setPinnedCards (CampaignApp owns)
  extras{}         ← keyed by card.id: { x, y, phyHit, menHit, cdFilled, gmOnly, freeInvoke, ... }
  (size toggle removed v319 — canvas cards are fixed cv4 width 640px, 2-column grid)
  players[]        ← player roster with FP, stress, consequences
  round, scene     ← counters
  gmFP             ← GM fate point pool
  heroCard         ← currently expanded card (for TpHeroModal)
  tableSync        ← from props (CampaignApp creates/destroys)
```

### IDB persistence

`SAVE_KEY = 'tp_canvas_' + campId`. `persistCanvas()` debounces 400ms and saves on every state change. Also calls `tableSync.broadcastState()` if GM is hosting.

### Multiplayer sync flow

```
GM side:
  persistCanvas() → tableSync.broadcastState(state)
                    (gmOnly cards filtered before send — extras also filtered to prevent position leaks)

Player side:
  onRemoteState callback (registered via props.onRemoteState) ← MP-07 fix (v288)
  → apply: setPinnedCards, setPlayers, setExtras, setRound, setScene, scale, pan

Auto-rebroadcast:
  On 'presence' message (player joins) → GM re-broadcasts _lastState after 300ms delay
  (300ms allows player WS 'open' event to fire and state to settle before receiving)
```

---

## Custom hooks

Four plain functions defined above their parent component, each owning a distinct concern. No React Context API — each returns a plain object that the parent destructures.

| Hook | File | Owns |
|------|------|------|
| `useChromeHooks(campId)` | `ui.js` | Toast, PWA nudge, Safari/iOS warn, SW update, online/offline |
| `useGeneratorSession(campId, campMeta, t, universalMerge, prefs, showToast)` | `ui.js` | result, rolling, history, activeGen, pinned cards, inspire, confetti, doGenerate, selectGen, pinResult |
| `useBoardPlayState(campId, mode, loaded)` | `ui-board.js` | players, round, order, selPlayer, roundFlash, newRound, toggleActed, persistPlayState |
| `useBoardSync(showToast)` | `ui-board.js` | syncObj, syncStatus, roomCode, showJoin, connectAsHost, disconnectSync |

**Pattern:**
```js
// In parent component:
var _gs = useGeneratorSession(campId, camp, t, universalMerge, prefs, showToast);
var result = _gs.result; var doGenerate = _gs.doGenerate; // etc.
```

---

## Sync architecture (createTableSync)

`createTableSync(roomCode, role, onStateUpdate, onRoll, onToast, onPresence)` in `core/ui.js` is the sole sync factory (v330+). It replaced `createSync` in the removed `ui-run.js`.

**tableSyncCtx object** — `CampaignApp` passes sync infrastructure to `PrepCanvas` as a single context object (v330 refactor, replaces 9 drilled props):

```js
tableSyncCtx: {
  sync,       // PartySocket wrapper
  roomCode,   // current room code
  isRemote,   // player is viewing a remote GM session
  presence,   // connected player list
  onCursor,   // PrepCanvas registers cursor handler
  onState,    // PrepCanvas registers state applier
  host,       // hostTable()
  join,       // joinTable()
  disconnect, // disconnectTable()
}
```

`PrepCanvas` reads `var _sc = props.tableSyncCtx || {}` — all 9 vars destructured from one prop.

---

## Multiplayer server (ogma-sync)

**Repo:** separate `ogma-sync/` directory (NOT in fate-suite-new)  
**Deployed:** `ogma-sync.brs165.workers.dev`  
**Deploy:** GitHub Action with `wrangler deploy --config wrangler.toml`  
**Auth:** `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` as GitHub secrets

```toml
# wrangler.toml — critical: new_sqlite_classes not new_classes (free tier requirement)
[[migrations]]
tag               = "v1"
new_sqlite_classes = ["OgmaRoom"]
```

**Protocol:**
- GM → server: `{type:"state", payload:{...}}` — stored + broadcast to all players
- Player → server: `{type:"player_action", ...}` — forwarded to GM only
- Server → new joiner: `{type:"welcome", state:{...}}` — late-join catchup
- On GM disconnect: `{type:"toast", msg:"GM disconnected…"}` broadcast

**partysocket URL convention:** `wss://host/parties/main/:roomCode?role=gm`

---

## Service worker strategy

| Request type | Strategy |
|-------------|---------|
| APP_SHELL (same-origin HTML/JS/CSS) | Cache-first, network fallback |
| CDN scripts (cdnjs, etc.) | **Pass through — do NOT intercept.** `if (isCDN) return;` |
| Navigation requests | Network-first, fallback to cached page, then offline error page |
| All other same-origin assets | Cache-first, network fallback, 404 on miss (never reject) |

`self.skipWaiting()` on install + `clients.claim()` on activate = immediate takeover on update.

**Offline URL resolution:** `CLEAN_URL_MAP` in the SW offline handler maps top-level world slugs (e.g. `/thelongafter`) to their cached campaign HTML files. This handles bookmarks created before the `_redirects` file was removed, without any server-side routing.

---

## Board Play mode state

When `mode === 'play'`, `BoardApp` activates a player management layer on top of the canvas.

**State added in Play mode:**
- `players[]` — player roster with FP, ref, phy/men stress, consequences, color, `acted` flag
- `round`, `order[]` — round counter and turn order (drag-to-reorder)
- `showDice`, `showFP` — floater visibility toggles
- `syncObj`, `syncStatus`, `roomCode` — multiplayer connection state
- `fpState` — FP tracker state loaded from IDB (`board_fp_v1_[campId]`)
- `boardPlayers` — derived from `fpState.pcs` for dice floater skill rolling

**IDB key:** `board_play_session_[campId]` — persists players, round, order.

**`?mode=play` prop:** `board.html` reads `?mode=play` from the URL and passes `initialMode='play'` to `BoardApp`. This is how the `run.html` redirect lands in Play mode automatically.

**`generateBoardRoomCode()`** — 4-char unambiguous code generator (no 0/O/I/1 confusion). Called by `connectAsHost()` when `roomCode` is empty.

## IDB schema (Dexie 4)

```javascript
db.version(1).stores({
  sessions: 'key',        // key-value store: tp_canvas_[campId], run_session_v2, board_canvas_v1_[campId], board_fp_v1_[campId]
  cards: 'key',           // pinned cards per campaign: key = 'card_[campId]_[id]'
});
```

Key constants:
- `RUN_IDB_KEY = 'run_session_v2'` (run.html)
- `TP_CANVAS_KEY_PREFIX = 'tp_canvas_'` (PrepCanvas, appended with campId)
- `BOARD_CANVAS_PREP_KEY = 'board_canvas_v1'` + `_[campId]`
- `BOARD_CANVAS_PLAY_KEY = 'board_play_v1'` + `_[campId]`
- `BOARD_FP_KEY = 'board_fp_v1'` + `_[campId]`

**Export/import (EXP-02/04):** `DB.exportCards()` downloads pinned cards as JSON. `DB.exportCanvasState()` downloads full canvas state (players, cards, round, FP, extras, pan/zoom). Both accept via `DB.importFile()` which handles `type:'cards'`, `type:'canvas'`, and `type:'card'`.

---

## Layout pattern (Option B left-nav)

Campaign pages (`cyberpunk.html` etc.) use a **persistent left sidebar** with no topbar.

**Desktop (≥641px):**
- `sb-slim-bar` is hidden (`display:none!important`)
- `.sidebar` is always visible (220px) — `transform:none!important`
- Sidebar has a `.sb-header` section: `.sb-wordmark` (OGMA) + `.sb-world-chip` (world name)
- Two tabs: **Generate** (16 generators, 4 groups) and **Navigate** (nav links, Table Prep, theme toggle, online status)

**Mobile (≤640px):**
- `.sb-slim-bar` (44px): hamburger + world name + current generator + theme toggle
- Hamburger opens sidebar as full-height overlay (unchanged behaviour)
- `.app-body` is still the flex row containing sidebar + content

CSS classes: `.sb-slim-bar`, `.sb-hamburger`, `.sb-slim-world`, `.sb-slim-gen`, `.sb-header`, `.sb-wordmark`, `.sb-world-chip`, `.sb-status-row`, `.sb-status-dot`.

---

## localStorage schema (BL-01)

All user preferences are stored under a single versioned JSON key `fate_prefs_v1`. Access via `window.LS.get(key)` / `window.LS.set(key, value)` — defined in `core/db.js`.

Current schema keys: `theme`, `textsize`, `fp_state`, `universal_merge`, `help_level`, `onboarding_done`, `gm_mode`, `intro_seen` (object keyed by worldKey), `pwa_nudge_dismissed`, `visit_count_[campId]`, `ios_install_dismissed`, `safari_warn_dismissed`.

On first load, old flat keys (`fate_theme`, `fate_textsize`, etc.) are migrated to the new schema and removed.

---

## Custom hooks

Four custom hooks extract complex stateful logic from component bodies. Each returns a plain object; parent destructures:

| Hook | File | Owns |
|------|------|------|
| `useChromeHooks(campId)` | `core/ui.js` | toast, showToast, PWA nudge, Safari/iOS warn, SW update, isOnline |
| `useGeneratorSession(campId, campMeta, t, universalMerge, prefs, showToast)` | `core/ui.js` | result, rolling, history, activeGen, partySize, cardView, inspireMode, pinnedCards, doGenerate, doInspire, selectGen, pinResult |
| `useBoardPlayState(campId, mode, loaded)` | `core/ui-board.js` | players, round, order, selPlayer, roundFlash, newRound/prevRound, toggleActed, addPlayer(nameArg?), removePlayer, persistPlayState |
| `useBoardSync(showToast)` | `core/ui-board.js` | syncObj, syncStatus, roomCode, showJoin, joinInput, connectAsHost, disconnectSync |

**Declaration order rule:** All arguments passed to a custom hook must be declared *above* the hook call. `const` is not hoisted — reading it before declaration throws `ReferenceError`. Pattern: useChromeHooks → prefs → universalMerge → useGeneratorSession (v336 fix).

---

## React patterns

All components use `useState`, `useEffect`, `useRef`, `useCallback` imported via:
```javascript
var useState = React.useState;
var useEffect = React.useEffect;
// etc. — all aliased in ui-primitives.js
```

**useEffect dep arrays** — NA-28 assertion enforces all useEffects in CampaignApp have dep arrays (`}, [...])`). NA-29 enforces the session-save effect uses `[result]` only (history/activeGen are snapshot values — over-specifying would cause stale data bugs). Violating either breaks the QA gate.

**No JSX** — all elements created with `h(type, props, ...children)`.

**Component communication** — props only, no context. Large state trees (PrepCanvas) are self-contained with local state; CampaignApp passes `pinnedCards`/`setPinnedCards` as props for the cross-component persistence path.

---

## Design system

`assets/css/theme.css` (~2600 lines). Key namespaces:

| Prefix | Used for |
|--------|---------| 
| `cc-` | Canvas cards on Table (compact, draggable) |
| `tp-` | Table canvas shell, hero modal, gen callout, dropdowns, turn bar |
| `rs-` | Player roster rows, stress boxes, FP buttons, round pill, turn bar — shared between Board Play mode and PrepCanvas |
| `cv4-` | v4 landscape cards (cv4Card, cv4-body, cv4-fading) |
| `fd-` | Field Dossier result renderers |
| `dr-` | Dice roller widget |
| `bt-` | Board topbar |
| `blp-` | Board left panel (collapsible on mobile, includes Stunts tab via `.bs-*`) |
| `board-` | Board canvas, cards, floaters, dossier |
| `sb-` | Sidebar header (Option B nav): `.sb-header`, `.sb-wordmark`, `.sb-world-chip`, `.sb-slim-bar`, `.sb-status-*` |
| `bt-live-*` | Board Play mode: `bt-live-badge` (animated pulse dot + "Live/Play" text in topbar) |
| `land-` | Landing page sections and cards |
| `.callout-*` | Help page callout boxes (scenario/info/warning/dnd/tip) |

**CSS variables:** `--accent`, `--text`, `--text-dim`, `--text-muted`, `--border`, `--border-mid`, `--glass-bg`, `--glass-blur`, `--glass-border`, `--panel`, `--panel-raised`, `--inset`, `--c-red`, `--c-green`, `--c-blue`, `--c-purple`, `--c-amber`, `--focus-ring`.

**Safe area insets** — applied to all `position:fixed` elements near screen edges: roll FAB, board floaters (dice, FP), `rs-dice-floater`, `rs-topbar`, `rs-left` sidebar. All pages have `viewport-fit=cover` in their viewport meta tag (added v293).

**Animation keyframes defined in theme.css:**
- `fadeUp` — cards, panel entries, floaters
- `fadeIn` — overlays, backdrops
- `cc-pop-in` — new canvas card bounce entrance
- `tp-shell-rise` / `tp-overlay-in` / `tp-close-spin` — hero modal sequence
- `dr-pop` / `dr-spin` — dice face animations
- `result-slide` — result card entrance
- `cv4pulse` — countdown clock full alert blink
- World-specific: `tla-idle`, `neo-scan`, `fan-rune`, `sp-idle`, `vic-flicker`, `pa-blink`

---

## ErrorBoundary

`ErrorBoundary` in `core/ui-primitives.js` is the sole class component in the codebase — required because React error boundaries cannot be implemented as hooks. Wraps all `createRoot` mount points. Displays a recovery UI with "Reload" and "Clear session & reload" buttons instead of a blank white page. The error message is displayed in the UI for debugging.

---

## Icon system

SVG icons are defined as React components in `core/ui-primitives.js`:

| Component | Icon | Used for |
|-----------|------|---------|
| `FaShareIcon` | arrow-up-from-bracket | Export options (share drawer toggle) |
| `FaCartPlusIcon` | cart-plus | Save to Table Prep (pin result) |
| `FaFileArrowDownIcon` | file-arrow-down | Download/export actions |
| `FaFileArrowUpIcon` | file-arrow-up | Upload/import actions |

All icons use `fill: currentColor`, `aria-hidden: true`, and `display: inline-block; verticalAlign: middle`.
