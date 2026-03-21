# Ogma — Roadmap

> **Source of truth** for all planned work. Update whenever items change.
> **Current version:** 2026.03.294 · QA: 113/113 named · 59/59 unit
> **Last revised:** 2026.03.294 — Mobile sprint (MOB-01–04); code review merge (EH-1–5, PB-1–2); XSS fix; _redirects removed

---

## Sizing

| Label | Effort |
|-------|--------|
| XS | < 1 hour |
| S | 1–3 hours |
| M | half-day |
| L | full day+ |

---

## Engineering rules

| Rule | Why |
|------|-----|
| All Python `open()` writes must use `encoding='utf-8'` | Default codec silently zeros files on surrogate pairs |
| All emoji in JS strings written from Python must use unicode escapes | Raw chars become surrogate pairs |
| Large block replacements → Node.js `fs.writeFileSync`, not Python replace | Node owns the encoding |
| After every write: `node --check <file> && echo OK` | Catches syntax before QA/zip |
| **Never replace `assets/js/partysocket.js` with a CDN tag** | partysocket ships ESM+CJS only — no UMD build exists on any CDN |
| `_headers` must NOT be in SW APP_SHELL | CF Pages consumes it server-side |
| Never redeclare `h`, `useState`, `useEffect`, `useRef`, `useCallback`, `Fragment` | All declared as `const` in `ui-primitives.js` — re-declaring with `var` is a SyntaxError |
| CDN scripts must NOT be intercepted by SW | SW intercept strips CORS headers; `if(isCDN) return` |
| `<base href="/">` required on all campaign HTML pages | CF Pages Pretty URLs strip `.html` |
| Before changing CSS: grep every consumer, check stacking context side-effects | See CONVENTIONS.md "Before changing any CSS" |
| Before fixing a bug: diff against last known-good first | See CONVENTIONS.md "When something is broken" |

---

## Active — needs owner verification

| ID | Title | Notes |
|----|-------|-------|
| **MP-07** | Two-tab multiplayer test | Host tab 1, join tab 2. Player should see GM canvas on connect. |
| **MP-13** | Two-device / two-network test | Real devices, different networks. Full session: add cards, roll dice, stress. |
| **VIS-01** | Table visual redesign confirmation | Hard refresh (Ctrl+Shift+R) required. Test: card hover glow, hero modal tap, gen callout, circular FP buttons. |
| **WS-11** | r/FATErpg intro post | Draft in `gtm-launch-copy.md`. Blocked on repo going public. Owner timing. |

---

## Board — Sprint 2 (at-table tools)

Sprint 1 shipped v266–278. Sprint 2 wires the at-table tools into the board surface.

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **BRD-01** | Play mode visual distinction | S | Play mode looks identical to Prep. Needs different topbar accent colour + multiplayer controls visible in Play |
| **BRD-02** | Dice floater in board | S | Reuse `TpDicePanel` from ui-table.js. Floating panel, same as run.html drawer dice tab |
| **BRD-03** | Fate Point tracker floater | S | Reuse `FatePointTracker` from ui.js wired into board topbar |
| **BRD-04** | Scene/encounter/compel dossier GM tips | S | Non-NPC dossier shows sparse content. Add invoke guidance + GM tip per generator type |
| **BRD-05** | Multiplayer host/join in board | M | Wire `createSync` from ui.js. Play mode unlocks Host/Join. Cursor presence on board canvas |
| **BRD-06** | Board section labels | S | Drag-and-drop text headers on canvas ("Scene 1", "NPCs", etc.) — new card type |
| **BRD-07** | Pin count → tappable Table link | XS | `bt-table` button in topbar should navigate to run.html, count should update live from IDB |

---

## Table / run.html — UX debt from playtest

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **TBL-01** | Player "waiting to be added" state | S | Player joins via room code but GM hasn't added them yet. Canvas visible but no FP/stress. Need "waiting for GM" overlay or auto-create empty slot |
| **TBL-02** | Dice panel as floater on small screens | S | Drawer covers canvas on 13" laptops. Dice should be `position:fixed` floater (already is in PrepCanvas — replicate in run.html) |
| **TBL-03** | New round visual confirmation | XS | Round increment is silent. Brief highlight/flash on the round counter when it ticks. Also clears acted status — no feedback that it happened |
| **TBL-04** | World name in run.html topbar | XS | No world context shown. One line — read campName state, add to topbar |
| **TBL-05** | Generator drawer discovery | S | Empty canvas state should mention the ➕ button. Drawer button label "➕ Generate" is easy to miss |

---

## Tier 1 (next build priorities)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **BL-01** | localStorage schema | S | Long-pending — enables PWA install nudge + milestone tracker tab |
| **MOB-05** | run.html safe area bottom padding | XS | Sticky topbar has no env(safe-area-inset-*) padding |
| **EXP-04** | Export board canvas as JSON | S | DB.exportCanvasState() exists — needs UI trigger in board topbar |
| **WS-11** | r/FATErpg launch post | — | Repo must be public first. Highest-leverage non-code action. |

---

## Tier 2

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **BL-02** | Stunt data spec | M | Long-pending — needed before stunt UI can be built |
| **MOB-06** | Board mobile: canvas usable when panel open | S | Panel now overlays canvas but canvas tap-target is behind backdrop |
| **QA-01** | Widen NA-29 search window | XS | 300-char window too tight — verbose console.warn will trip it again |

---

## Tier 3 / Parking lot

| ID | Title | Notes |
|----|-------|-------|
| **PL-03** | Pre-join character builder | Before joining via room code, player builds character. Loads into Table on join. |
| **WLD-02** | 9th campaign world | Parked — revisit 2027.03.01 |
| **PDF-04–08** | 5 remaining PDF books | Parked — revisit 2027.03.01 |
| **PERF-02** | Vite/terser minify | Revisit after SPA decision |
| **SPA-06** | var→JSON modules | Requires `<script type="module">` everywhere. Blocked. |
| **PL-01** | Multi-GM mode | Needs CRDT |
| **PL-02** | Native app wrapper | After PWA demand confirmed |
| **EXP-01** | Fari App / Foundry VTT export | Code preserved. Revisit when VTT integration confirmed as user need. |

---

## Community

| ID | Title | Notes |
|----|-------|-------|
| **WS-11** | r/FATErpg launch post | Non-code. Highest-leverage non-code move. Fari entered maintenance mode Feb 2024 — community is looking for a successor. Draft in gtm-launch-copy.md. Owner timing. |
| **WS-08** | Recruit Fate GMs for observation sessions | Non-code |
| **WS-14** | Dogfood: 3 GMs prep real sessions, record, debrief | Non-code |

---

## What shipped — summary (full detail in CHANGELOG.md)

| Version | What |
|---------|------|
| v2026.03.294 | Code review merge (v292 external review): EH-1 console.warn on all DB writes, EH-2/3 SW promise chain fixes, EH-4 IDB retry budget (2 failures before permanent disable), EH-5 migration warns, PB-1 timer cleanup returns (rollTimerRef ReferenceError fixed), PB-2 getAppShell lazy cache. TBL-02 re-applied after merge. NA-29 regression fixed (session-save warn strings shortened to fit 300-char window). |
| v2026.03.293 | Mobile sprint: MOB-01 viewport-fit=cover (36 HTML files), MOB-04 safe-area FAB + floaters, MOB-03 board topbar responsive (bt-nav-text, bt-nav-hide-xs, 520px breakpoint), MOB-02 board left panel collapsible (leftOpen state, blp-wrap/blp-hidden, blp-backdrop, bt-panel-toggle). |
| v2026.03.292 | Security: dice-roller.js XSS fix (CWE-79/116) — full rewrite from innerHTML interpolation to DOM construction; el() helper, zero innerHTML in file. |
| v2026.03.291 | Bugfix: exportCards/importCards ReferenceError (functions were referenced but never defined); exportCanvasState missing .catch(); 300ms sync timeout documented. |
| v2026.03.290 | _redirects deleted — CF Pages Pretty URLs handles everything it did. References cleaned from BOOTSTRAP, ROADMAP, sw.js, index.html. |
| v2026.03.289 | Tier 1 complete: TBL-02 dice drawer→floater on small screens; TBL-05 empty canvas generate CTA; EXP-02 JSON export/import (exportCards + importCards in action bar); EXP-03 copy-link button promoted to action bar with ✅ feedback. |
| v2026.03.288 | MP-07 sync fix: player state now applies on join (remoteStateCbRef pattern); GM auto-rebroadcasts on presence change; gmOnly card extras stripped from broadcast — positions/notes no longer leak to players. |
| v2026.03.287 | Board Sprint 2 complete: BRD-02 dice floater (TpDicePanel, FP-spend bridge, sync broadcast), BRD-03 FP tracker floater (FatePointTracker, IDB persist per world), BRD-05 board multiplayer (Host/Join modal, createTableSync, room code in topbar, sync status chip). ui-table.js + ui.js added to board.html and SW APP_SHELL. EXP-02/EXP-03 promoted to Tier 1. |
| v2026.03.286 | Roll button → vertical stack: action-bar column layout, Roll 56→44px, Inspire full-width with descriptive label, contextual pill rows with labels, secondaries full-width row. |
| v2026.03.285 | Code quality sprint: BOOTSTRAP HOW YOU WORK section, ESLint config (eslint.config.cjs), testing.md rewrite (113 assertions), code-quality.md (var/const split, naming, file size, JSDoc). engine.js: 22 new JSDoc blocks, all 31 public functions documented. ARCHITECTURE.md load order updated. |
| v2026.03.282 | dVentiRealm rewrite: dragon extinction as history layer, kobold crisis factions, ward-line mystery, diviner silence impending issue, 3 new kobold NPC archetypes, 5 new troubles, 4 new seed locations. Guide HTML fully rewritten. SRD-clean (no beholders). |
| v2026.03.281 | Tier 2: BRD-06 board section labels (drag/rename/colour-cycle, keyboard, context menu, ARIA role=heading); BL-03 Victorian adjective pass (VtAdj 15→25, VtAdj2 14→20, VtNoun/VtAir/VtSurface all expanded, London list +4); BL-04 QA battery +12 assertions (NA-86–97: board SW coverage, no globals redecl, modal ARIA, card keyboard, font floor, touch targets, round aria-live); QA summary counter fixed |
| v2026.03.279–280 | WCAG 2.1 AA + HIG audit: 18 issues fixed — C-01 dossier focus trap, C-02 context menu keyboard nav + roles, C-03 canvas card keyboard access (Enter/Delete/Arrows), C-04 sticky Enter/F2 edit, C-05 cc-ibtn 20→44px touch, C-06 rs-fp-btn touch target, S-01 21× font size violations (8/9px→11px), S-02 board dark mode card colours, S-03 stress labels font floor, S-04 backdrop dismiss fix, S-05 cc-cdbox 17→44px, S-06 card arrow-key repositioning, M-02 mode toggle aria-pressed, M-03 zoom aria-labels, M-04 round aria-live, M-05 world select chevron, M-06 dossier role=dialog |
| v2026.03.279 | Tier 1 UX sprint: TBL-04 world icon+name in run.html topbar, TBL-03 new round flash + toast, BRD-07 Table link passes world param, BRD-01 Play mode Live chip + green topbar, BRD-04 GM tips for all 16 generator types in dossier, TBL-01 player waiting state after join |
| v2026.03.278 | Board Sprint 1.5: canvas pan (drag bg + wheel zoom), sticky notes editable (double-click), reroll undo (Ctrl+Z), cascade card placement, world picker dropdown, run.html board-pins import bridge, "📄 Board" back-link in run.html topbar |
| v2026.03.272–277 | Board Sprint 1 stabilisation: SyntaxError fixes (useCallback/h redeclaration), body orb bleed-through (isolation:isolate on tp-view), tp-canvas-wrap background revert, generate popover position:fixed fix restoring run.html canvas layout, docs updates (UX personas, conversion maps, CSS checklist, baseline diff rule) |
| v2026.03.266–271 | Board Sprint 1: campaigns/board.html + core/ui-board.js (1153L) — 16 generators, canvas, drag, dossier modal, help panel, right-click context menu, zoom, IDB persistence, Prep/Play modes, sticky notes, theme toggle |
| v2026.03.265 | UI removals: Prep tab, Countdown from leftnav, Miles. toolbar button; Table button back to topbar-status |
| v2026.03.261 | SW APP_SHELL paths / to absolute; base href sweep; routing overhaul; external code review fixes (11 issues) |
| v2026.03.253 | MP-23 Session log: DO SQLite worker, SessionLogPanel, broadcastLog |
| v2026.03.247 | Content quality sprint: western/dVentiRealm table expansion |
| v2026.03.232 | JOIN-01: JoinTableCard on landing |
| v2026.03.230 | MP-20/21/22: dice broadcast, player roll, cursor presence |
| v2026.03.229 | Code quality Tier 3: ui-table.js split, 59 unit tests, ErrorBoundary, JSDoc |
| v2026.03.224–226 | OSS readiness: LICENSE, SRI, CI, CONTRIBUTING, ARCHITECTURE, ADRs |

*Last updated: 2026.03.294*
