# Ogma — Roadmap

> **Source of truth** for all planned work. Update whenever items change.
> **Current version:** 2026.03.360 · QA: 198/198 named · 59/59 unit · 89/89 export
> **Last revised:** 2026.03.360 — Build pipeline (scripts/build.js 3-tier, docs/BUILD.md, package.json devDeps, sw.js bundle entry); PROJECT_MEMORY.md written; help copy fixes (at-the-table + generators "Prep tab" → "Binder")

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
| v2026.03.343–344 | **Field Dispatch design system site-wide.** Fraunces + Martian Mono. Warm-dark/cream palette. Stamp radii + physical shadows. `cv4Card` auto-height with expandable GM guidance footer. Dossier view removed — Field Dispatch card always shown. All 38 HTML files get Google Fonts. Landing, board, help, sidebar all updated. |
| v2026.03.359 | **Export modal + Board kill + Session Zero deepening.** (1) `ExportModal` replaces `ExportMenu`: full modal with card checklist (derived titles from `data.name`/`data.location`/HC), 8-format grid (MD/MM/OB/TY/TXT/JSON/IMG/Print), copy-vs-download delivery picker, Import link in footer. `toBatchMarkdown` added to engine.js. (2) `board.html` confirmed as JS redirect to `{world}.html?canvas=1`. Play → Table wired to `canvasView`/`openCanvas()`. All 8 campaign pages confirmed loading `ui-board.js`. (3) Session Zero deepening: dVentiRealm data added, `pc_high_concepts` replaces `major_concepts` for high concept examples, `questions` step added to all three modes (standard/trio/flashback) with world-specific `pc_questions` and live-generated example PC from engine. (4) Help docs updated: `fate-mechanics.html`, `at-the-table.html`, `generators.html`, `getting-started.html`. `about.html` + `index.html` Play links updated. `ARCHITECTURE.md` + `BOOTSTRAP.md` updated. 10 new QA assertions NA-188–197. |
| v2026.03.358 | **Accordion nav.** Replaced flat group-label sidebar with three-section accordion: **Play** (Table, Session Notes) → **Binder** (Cards w/ count badge, Session Zero) → **Generate** (17 generators in 4 sub-groups, scroll-contained at 55vh max-height) → Settings. One section open at a time. Section headers: 44px (WCAG 2.5.5 + Apple HIG), Fraunces italic, left accent bar on open state, chevron spring-rotates 90°. Meta badge on every closed header (active generator name, card count, online status) so state is readable without opening. `sbAcc` useState + `toggleAcc()` in CampaignApp. All 17 generators re-registered under correct GENERATOR_GROUPS (People/Scene/Story/Mechanics). 7 new QA assertions NA-181–187. |
| v2026.03.356 | **Toast + Session Zero + BL-06 + BL-15.** (1) Export toast feedback: all ExportMenu clipboard actions (`doMarkdown`, `doMermaid`, `doObsidian`) fire `onToast` after write; Typst and plain text downloads also toast. `onToast` and `onShareLink` added as props; call site passes `showToast` and `copyShareLink`. (2) Session Zero Tool linked from sidebar “At the table” section (`character-creation.html?world=`). (3) BL-06 shareable links: Copy Link item added to ExportMenu (gated on `onShareLink` prop, only shown when a result exists); fires existing `copyShareLink()` which writes seed URL and calls `showToast`. (4) BL-15 mobile nav: `bottom-nav` bar with 4 tabs (Roll, Pinned with badge, Board, Menu) fixed to bottom on mobile; sidebar drawer now stops above bottom nav; FAB and toast repositioned; all fonts ≥10px. 8 new QA assertions NA-173–180. |
| v2026.03.355 | **Text export formats.** Three new export options in ExportMenu alongside Markdown and Mermaid. (1) **Obsidian MD** — copy to clipboard; uses callout blocks (`[!quote]` HC, `[!danger]` trouble, `[!tip]` stunts), skill table, Session Zero section. (2) **Typst** — downloads `.typ` file; self-contained with page setup, all card helpers (`#asp-hc`, `#asp-tr`, `#skill-chip`, `#stunt-b`, stress boxes), compiles to styled PDF via typst.app or CLI. (3) **Plain text** — downloads `.txt` file; Unicode box-drawing border, `[HC]`/`[TR]`/`[An]` aspect tags, skill pyramid, stress □ symbols; works in any editor, Discord, Roll20, terminal. Batch variants (`toBatchObsidianMD`, `toBatchTypst`, `toBatchPlainText`) handle multi-card Table Prep exports. NA-35 updated to allow ≤2 regex-literal false positives (node --check remains authoritative). 10 new QA assertions NA-163–172. |
| v2026.03.354 | **Mermaid export.** `toMermaid(genId, data, campName)` in `engine.js` covers all 17 generators: `mindmap` for PC/NPC/backstory (aspect-skill hierarchy), `flowchart` for seed/campaign/challenge/contest/compel/consequence/countdown/obstacle/constraint/complication, `graph TD` for faction/encounter. `toBatchMermaid()` for multi-card export. ExportMenu: Mermaid item (between Markdown and JSON) copies diagram source to clipboard. 5 new QA assertions NA-158–162. |
| v2026.03.353 | **BL-01/07/08 + quick wins.** (1) BL-01: `initPrefs()` migration guard — lifts legacy `fate_theme` bare key into `fate_prefs_v1`, writes schema defaults for all 9 keys on first load. (2) Quick win: `sidebar-legal` duplicate attribution removed from sidebar panel (content-area footer is authoritative). (3) BL-07: All 17 `CV4_HELP` entries enriched with concrete `invoke` and `compel` example fields; `cv4BackPanel` renders them as two side-by-side accent blocks (blue/red). (4) BL-08 Western world data expansion: `names_first` 78→106, `names_last` 32→56, `current_issues` 4→8, `impending_issues` 4→8 (election, winter, company town, water rights court, reservation border). 9 new QA assertions NA-149–157. BL-01, BL-02, BL-08 marked complete in backlog. |
| v2026.03.350 | **Player Character generator.** `generatePC` in engine.js: 5 aspects (HC + trouble + 3 others), 10-skill pyramid (1×+4, 2×+3, 3×+2, 4×+1), 3 stunts, stress derived from Physique/Will (FCon p.12), consequences [2,4,6], refresh 3. `pc_high_concepts` (12 entries) + `pc_questions` (6 entries) added to all 8 world data files. `cv4FrontPc` renderer. `pc` in GENERATORS + Characters group + RA_ICONS. Wizard fixes: extras id stringified (`wiz_`+prefix), `exportWizardSession()` function, Export JSON button on Done screen, backstory cards normalized. 13 new QA assertions (NA-136–148), all passing. 8/8 world smoke test. |
| v2026.03.348 | **Export cleanup + round-trip test.** (1) Share link button and share-icon button removed from action bar. (2) `ShareDrawer` inline panel removed. (3) `showExport` + `linkCopied` state removed. (4) `ExportMenu` rewritten: flat list — Markdown (copy to clipboard), JSON (download), Image Pack, Print, Import — in frequency order with `export-menu-item-icon`/`body`/`label`/`sub` CSS. (5) `BoardExportMenu` rewritten same pattern + Import item. (6) `importCanvas()` handler added to BoardApp. (7) `tests/export-roundtrip.test.js` — 89 assertions: generate all 16 generators, assemble Ogma export JSON, parse back, verify every card survives. Added to `npm test`. 6 new QA assertions (NA-130–135). |
| v2026.03.347 | **Option B sidebar — Navigate tab removed.** Single scrollable panel: Characters → Scenes → Pacing → World → At the table (Table Prep, Board, Session Notes) → Settings. `sb-dock` icon strip pinned to sidebar bottom: All Worlds / Learn / Help / Online status. Board moved from Navigate into At the table. `sidebarTab` state removed. Dead `sb-panel-nav` + `sb-panel-sess` panels removed. All dock buttons: `aria-label`, `min-height:44px`, `role="toolbar"` on dock. 5 new QA assertions (NA-125–129). WCAG 2.5.8 touch targets: 44px min on all dock buttons. Font floor: `sb-dock-lbl` and `sb-count-badge` both 10px. |
| v2026.03.345 | **WCAG 2.2 + crash fixes** — (1) `cv4UseReducedMotion` + `cv4InjectStyles` restored → ReferenceError crash fixed on all campaign pages. (2) Navigate panel close-bracket bug fixed. (3) 11 new WCAG 2.2 QA assertions (NA-114–124), all passing. (4) `scope="col"` on all help-page table headers (1.3.1). (5) Focus border-width ≥2px on all `outline:none` inputs (2.4.11). (6) `[role="checkbox"]:focus-visible` ring (3.2.6). (7) `scroll-padding-bottom:80px` prevents FAB obscuring focused elements (2.4.12). (8) `data-theme="dark"` on redirect pages. (9) `design-system.html` in SW cache. (10) All MD docs updated. |
| v2026.03.342 | **Card view data parity** — all 16 `cv4Front*` renderers rewritten to show complete generator output: Minor NPC all skills; Major NPC other aspects + full stunt descriptions + consequence slots; Scene zone descriptions + framing questions; Encounter scene aspects + opposition aspects + stunts + zones; Campaign faces + places + impending desc; Seed issue + setting aspect + opposition + twist + win/lose; Challenge separate stakes fields; Contest scene aspect + stakes; Compel template text; Constraint correct fields (`restricted_action`, `consequence`, `gm_note`); Obstacle separate gm_note; Backstory actual `relationship` text. |
| v2026.03.341 | **Bugfixes:** doExport SyntaxError (EXP-07 escape level); Major NPC missing consequence slots (rules compliance); help hamburger position:fixed all 11 pages; sidebar Navigate tab + sb-header missing pieces. |
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

