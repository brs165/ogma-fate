# Ogma — Roadmap

> **Source of truth** for all planned work. Update whenever items change.
> **Current version:** 2026.03.335 · QA: 113/113 named · 59/59 unit
> **Last revised:** 2026.03.340 — Option B left-nav: topbar removed, sidebar header + Navigate tab added — v336 hotfix (universalMerge ReferenceError); v337 order-of-ops audit (BoardApp showToast/syncObj hoisting)

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
| Extract hooks when a component owns >3 related state+effect+handler groups | Return plain object, destructure in parent. See useChromeHooks, useGeneratorSession, useBoardPlayState, useBoardSync. |

---

## Active — needs owner verification

| ID | Title | Notes |
|----|-------|-------|
| **MP-07** | Two-tab multiplayer test | Host tab 1, join tab 2. Player should see GM canvas on connect. |
| **MP-13** | Two-device / two-network test | Real devices, different networks. Full session: add cards, roll dice, stress. |
| **VIS-01** | Table visual redesign confirmation | Hard refresh (Ctrl+Shift+R) required. Test: card hover glow, hero modal tap, gen callout, circular FP buttons. |
| **WS-11** | r/FATErpg intro post | Parked until **2026.06.22**. Draft in `gtm-launch-copy.md`. Blocked on repo going public. |

---

## Open — in progress / next up

| ID | Title | Size | Notes |
|----|-------|------|-------|
| ~~**TBL-01**~~ ✅ | Player waiting state | S | Player joins via room code before GM adds them. Need "Waiting for GM to add you" overlay in Board Play mode. Auto-create empty player slot on join. |
| ~~**MOB-15**~~ ✅ | Mobile nav spike | M | Board on mobile is pinch-to-zoom. Spike what a designed mobile response looks like. Bottom nav bar? Slide-in panel? Floating action pattern? |

---

## Tier 3 / Parking lot

| ID | Title | Notes |
|----|-------|-------|
| **BL-11** | Stunt builder wizard | Skipped — build when there's user demand. BL-05 stunt browser ships first. |
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
| **WS-11** | r/FATErpg launch post | Parked until **2026.06.22**. Repo must be public first. Draft ready. |
| **WS-08** | Recruit Fate GMs for observation sessions | Non-code |
| **WS-14** | Dogfood: 3 GMs prep real sessions, record, debrief | Non-code |

---

## What shipped — summary (full detail in CHANGELOG.md)

| Version | What |
|---------|------|
| v2026.03.338–340 | **Left-nav refactor (Option B):** topbar removed from campaign pages. Sidebar header (wordmark + world chip). "Navigate" tab: all nav links, Table Prep, theme toggle, status dot. Mobile: 44px slim bar (hamburger + world + generator + theme). ExportMenu opens downward. Order-of-ops audit + hotfixes. |
| v2026.03.336–337 | **Hotfix + order-of-ops audit.** v336: `universalMerge`/`prefs`/`useChromeHooks` hoisted before `useGeneratorSession` (production ReferenceError). v337: `showToast`+`toastTimerRef` hoisted before `useBoardSync`; TBL-01 useEffect moved after `_sync` destructure; full const use-before-declare audit across all UI files — clean. |
| v2026.03.335 | **TBL-01** player join UX (name prompt → auto-add to GM roster). **MOB-15** Board mobile list view (toggle button, scrollable card stack, tap-to-open, remove). ROADMAP cleanup. |
| v2026.03.334 | **BL-05** Stunt browser (Board left panel, filter by skill/tag/text, click-to-copy). **WS-12** Stunt guide expanded (weak/strong table, 8-world examples). EXP-07 image pack offline guard. A11Y-01 BoardCard role=region. QA-02 contest tie wording. |
| v2026.03.330–333 | **Architecture refactor** (9/10): 4 custom hooks (useChromeHooks, useGeneratorSession, useBoardPlayState, useBoardSync). CampaignApp 63→28 state vars. ui-run.js stripped. Export menu unified. MD doc pass. |
| v2026.03.319–329 | **Card system v4** (cv4Card 600×380, interactive stress/countdown/contest/consequence, world theming). Export menu (Image Pack / Print / JSON). Dice roller redesign. printCards fix. CI fix. |
| v2026.03.281–294 | BRD-06 section labels. BL-03 Victorian pass. BL-04 QA battery +12. WCAG 2.1 AA audit (18 fixes). Code review merge (EH/PB series). TBL-02 dice floater. |
| v2026.03.279–280 | TBL-01 ✅ player waiting state. TBL-03 ✅ round flash. TBL-04 ✅ world name topbar. TBL-05 ✅ empty canvas CTA. BRD-01 ✅ play mode chip. BRD-04 ✅ GM tips. BRD-07 ✅ table link. |
| v2026.03.266–278 | **Board Sprint 1+2**: canvas, drag, dossier, zoom, pan, sticky notes, undo. BRD-02 ✅ dice floater. BRD-03 ✅ FP tracker. BRD-05 ✅ multiplayer host/join. |
| v2026.03.229–265 | Code quality sprint. MP-20/21/22 dice/cursor broadcast. JOIN-01 landing card. SW routing. ui-table.js split. 59 unit tests. |
| v2026.03.224–226 | OSS readiness: LICENSE, SRI, CI, CONTRIBUTING, ARCHITECTURE, ADRs. |

