# Ogma Architecture Guide

> Technical deep-dive for contributors. Covers the execution model, data flow, React patterns, IndexedDB persistence, the service worker, Cloudflare Pages deployment, and the Table canvas multiplayer system. Read this before touching `core/*.js`.
>
> **Last updated:** 2026.03.214

---

## Architecture overview

> **HTTPS-first. Offline after first load. No backend. No build step.**

- Raw JavaScript via `<script>` tags — no bundler, no transpiler
- React 18 via CDN UMD — no JSX. `React.createElement` aliased as `h`.
- `const`/`let`, arrow functions, destructuring in all 4 split UI files. `ui.js` and `core/*.js` remain `var`-based.
- Global variables — `CAMPAIGNS`, `GENERATORS`, `UNIVERSAL`, `HELP_CONTENT`
- Service worker (`sw.js`) caches `APP_SHELL` for full offline use
- IDB (Dexie 4) for all persistence — no localStorage for data (only prefs)
- Multiplayer via Cloudflare Workers Durable Objects — optional, opt-in, offline mode unchanged

---

## Script load order (campaign pages)

```html
<!-- React 18 via CDN UMD -->
<script src="https://cdnjs.cloudflare.com/.../react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/.../react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/.../dexie.min.js"></script>

<!-- Data layer -->
<script src="../data/shared.js?v=N"></script>
<script src="../data/universal.js?v=N"></script>
<script src="../data/[campaign].js?v=N"></script>

<!-- Multiplayer client (same-origin vendored) -->
<script src="../assets/js/partysocket.js?v=N"></script>

<!-- Logic layer -->
<script src="../core/engine.js?v=N"></script>
<script src="../core/db.js?v=N"></script>

<!-- UI layer -->
<script src="../core/ui-primitives.js?v=N"></script>
<script src="../core/ui-renderers.js?v=N"></script>  <!-- includes PrepCanvas (Table) -->
<script src="../core/ui-modals.js?v=N"></script>
<script src="../core/ui-landing.js?v=N"></script>
<script src="../core/ui.js?v=N"></script>             <!-- includes CampaignApp + sync fns -->
<script src="../core/intro.js?v=N"></script>
```

`<base href="/">` is required on all campaign pages (Cloudflare Pages Pretty URLs strip `.html`; without it, `../core/` resolves to `/campaigns/core/`).

---

## Cloudflare Pages deployment

- **CDN scripts must NOT be in SW CDN_SCRIPTS.** The SW intercept strips CORS headers. `if (isCDN) return` in the fetch handler lets the browser handle CDN scripts natively with full CORS support.
- **`_headers` file** sets CSP for all pages. `script-src` allows `cdnjs.cloudflare.com` and `static.cloudflareinsights.com`. `connect-src` allows `wss://*.workers.dev`. CF Pages consumes `_headers` at deploy time — it is never served as a URL and must NOT be in SW APP_SHELL.
- **Pretty URLs** — CF Pages strips `.html` from URLs. `<base href="/">` on every campaign page prevents relative path breakage. Join links must use `window.location.pathname.replace(/\.html$/, '')`.
- **SW skipWaiting** — `self.skipWaiting()` on install forces immediate takeover so users on old SW versions get the new SW on next visit without closing tabs.

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
                     renderCard(genId, data)   ← FlipCard (MTG-style)
```

---

## Table canvas architecture

`PrepCanvas` (in `core/ui-renderers.js`) is the full-screen interactive session surface.

### State model

```
PrepCanvas local state:
  pinnedCards[]    ← from props.pinnedCards / props.setPinnedCards (CampaignApp owns)
  extras{}         ← keyed by card.id: { x, y, size, phyHit, menHit, gmOnly, ... }
  players[]        ← player roster with FP, stress, consequences
  round, scene     ← counters
  gmFP             ← GM fate point pool
  heroCard         ← currently expanded card (for TpHeroModal)
  tableSync        ← from props (CampaignApp creates/destroys)
```

### IDB persistence

`SAVE_KEY = 'tp_canvas_' + campId`. `persistCanvas(patch)` merges state and saves on every change. Also calls `tableSync.broadcastState()` if GM is hosting.

### Card rendering

Canvas cards are positioned absolutely (`left: ex.x, top: ex.y`) inside `tp-canvas-inner` which is scaled/translated for zoom/pan. Cards have compact `cc-` CSS with glass backdrop-filter.

Tapping card body (`.tp-card-expand-btn`) sets `heroCard` and opens `TpHeroModal` — a full-screen modal with the existing `FlipCard` (`rc-*` components), blur backdrop, and a dice roller strip.

### Multiplayer sync flow

```
GM side:
  persistCanvas() → tableSync.broadcastState(state)
                    (gmOnly cards filtered before send)

Player side:
  useEffect on tableSync → listen for 'welcome'/'state' messages
  → apply: setPinnedCards, setPlayers, setExtras, setRound, setScene
  → 'welcome': showToast('Canvas synced')

Card expand sync:
  GM taps card → setHeroCard(card) + ws.send({type:'card_expand', cardId})
  Player receives → setHeroCard(matching card from pinnedCards)
  GM closes → ws.send({type:'card_collapse'})
  Player receives → setHeroCard(null)
```

---

## Multiplayer server (ogma-sync)

**Repo:** separate `ogma-sync/` directory (NOT in fate-suite-new)
**Deployed:** `ogma-sync.brs165.workers.dev`
**Deploy:** GitHub Action with `wrangler deploy --config wrangler.toml` (not `npx partykit deploy`)
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
| Navigation requests | Cache-first, fallback to index.html |
| All other same-origin assets | Cache-first, network fallback, 404 on miss (never reject) |

`self.skipWaiting()` on install + `clients.claim()` on activate = immediate takeover on update.

---

## IDB schema (Dexie 4)

```javascript
db.version(1).stores({
  sessions: 'key',        // key-value store: prep_wizard_v1, run_session_v1, tp_canvas_[campId]
  cards: '[campId+id]',   // pinned cards per campaign
});
```

Key constants:
- `RUN_IDB_KEY = 'run_session_v1'` (run.html)
- `TP_CANVAS_KEY_PREFIX = 'tp_canvas_'` (PrepCanvas, appended with campId)
- `PREP_WIZARD_KEY = 'prep_wizard_v1'` (Session Zero Wizard)

---

## React patterns

All components use `useState`, `useEffect`, `useRef`, `useCallback` imported via:
```javascript
var useState = React.useState;
var useEffect = React.useEffect;
// etc. — all aliased in ui-primitives.js
```

**useEffect dep arrays** — NA-28 assertion enforces all useEffects in CampaignApp have dep arrays (`}, [...])`). Violating this breaks the QA gate.

**No JSX** — all elements created with `h(type, props, ...children)`.

**Component communication** — props only, no context. Large state trees (PrepCanvas) are self-contained with local state; CampaignApp passes `pinnedCards`/`setPinnedCards` as props for the cross-component persistence path.

---

## Design system

`assets/css/theme.css` (~2200 lines). Key namespaces:

| Prefix | Used for |
|--------|---------|
| `cc-` | Canvas cards on Table (compact, draggable) |
| `tp-` | Table canvas shell, hero modal, gen callout, dropdowns, turn bar |
| `rs-` | Run session surface (run.html) + Table player roster |
| `rc-` | Result card (MTG FlipCard — spine, face, back) |
| `fd-` | Field Dossier result renderers |
| `dr-` | Dice roller widget |
| `rtp-` | Result help panel |
| `.callout-*` | Help page callout boxes (scenario/info/warning/dnd/tip) |

**CSS variables:** `--accent`, `--text`, `--text-dim`, `--text-muted`, `--border`, `--border-mid`, `--glass-bg`, `--glass-blur`, `--glass-border`, `--panel`, `--panel-raised`, `--inset`, `--c-red`, `--c-green`, `--c-blue`, `--c-purple`, `--c-amber`, `--focus-ring`.

**Animation keyframes defined in theme.css:**
- `fadeUp` — cards, panel entries
- `cc-pop-in` — new canvas card bounce entrance
- `tp-shell-rise` / `tp-overlay-in` / `tp-close-spin` — hero modal sequence
- `dr-pop` / `dr-spin` — dice face animations
- `result-slide` — result card entrance
- World-specific: `tla-idle`, `neo-scan`, `fan-rune`, `sp-idle`, `vic-flicker`, `pa-blink`

