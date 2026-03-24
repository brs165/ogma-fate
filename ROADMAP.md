# Ogma — Roadmap

> **Source of truth** for all planned work. Update whenever items change.
> **Current version:** 2026.03.393 · QA: 269/269 named · 59/59 unit · 89/89 export · 128/128 smoke
> **Last revised:** 2026.03.393 — Play sprint (4 sprints): dice roller redesign (learn-fate visual), scene-end stress clear, remove card from table, cv4Card CSS 3D flip, free invoke counter on stickies, character sheet on player surface, boost card type, opposition Fate Ladder dropdown. LABEL_STYLES crash fix. CSP connect-src fix.

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

## Workshop backlog — Play sprint plan

> Added v2026.03.395. Six workshop voices × 100 iterations. Prioritised by "what unblocks real sessions."

### Sprint A — Player comes alive (S)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WS-20** | Player dice rolling | S | PlayerSurface skills inert. Add `doRoll` + `player_roll` sync action. Players must roll from their device. |
| **WS-21** | Enrich broadcast payload | XS | `broadcastPlayState` sends `{cards, fp, players}` only. Add `round`, `order`, `gmPool`, `rollHistory`. |
| **WS-22** | Player turn indicator | XS | PlayerSurface shows "Your turn" / "Waiting for X". Depends WS-21. |
| **WS-23** | Roll result broadcast | S | Player rolls → GM toast + all-device history. New sync action `player_roll`. |
| **WS-25** | GM pool visible to players | XS | `gmPool` not in broadcast. FCon FP economy requires transparency. |

### Sprint B — Seven quick wins (XS each)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WS-24** | Session notes on board | XS | `SessionDoc` exists in `ui-modals.js`, never wired into BoardApp. One import. |
| **WS-31** | Help panel: Conflicts | XS | Missing entry for zones, exchanges, taken out, conceding. Most common rules questions. |
| **WS-34** | Player surface full-width cards | XS | `ps-card-scaler` at 88%/220px → full width, natural scroll. |
| **WS-35** | Quick NPC in play mode | XS | One-click "⚡ Quick NPC" generates `npc_minor` onto canvas without opening generate panel. |
| **WS-40** | Session start refresh | XS | FCon p.19: FP resets to max(refresh, current FP). "Start Session" button. |
| **WS-42** | Keyboard shortcut for rolling | XS | Spacebar/Enter on focused skill triggers `doRoll`. |
| **WS-43** | Canvas zoom-to-fit | XS | Button to auto-fit all cards in viewport. |

### Sprint C — Invoke sprint (M)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WS-26** | Invoke workflow | M | Tap aspect → select player → deduct 1 FP (or free invoke) → "+2" flagged on dice → "invoked by X" trail. |
| **WS-37** | Free invoke → dice bonus wiring | M | Consuming pip flags "+2 no FP cost" in dice panel for next roll. |
| **WS-39** | Create Advantage outcome mapping | S | Success=1 free invoke, SWS=2, Tie=boost card, Fail=opponent gets invoke. |

### Sprint D — Conflict completeness (S)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WS-28** | Concede button | S | Exit conflict → earn 1 FP per consequence taken. Remove from turn order. FCon p.35. |
| **WS-29** | NPC cards in turn order | S | NPC-type cards as draggable pills in `BoardTurnBar`. |
| **WS-45** | Consequence recovery on player row | S | `BoardPlayerRow` consequences have no treatment/recovery UI — only text. Add checkboxes. |
| **WS-32** | Scene transition workflow | S | "New Scene": archive cards to binder, clear canvas, reset GM pool, prompt for scene aspect. |

### Sprint E — Full FP economy (M)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WS-27** | Compel offer flow | M | GM taps aspect → offers FP → push to player → accept/refuse. Sync actions `compel_offer`/`compel_response`. |
| **WS-30** | Player creates aspect | M | Create Advantage → player names aspect from device → sticky with free invokes on GM canvas. Sync `player_create_aspect`. |

### Sprint F — Content teaching (S)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WS-55** | Quick reference overlay | S | Fate Ladder + four outcomes + four actions — toggleable overlay during play. |
| **WS-56** | Aspect quality coaching | S | Tips on stickies/custom cards. `scoreAspect()` exists but unused on board. |
| **WS-57** | Stunt validation hint | XS | Flag stunts not matching "Because I [X], +2 to [Skill] when [narrow]" template. |
| **WS-60** | Compel example library | S | 3–5 world-specific examples per world. |
| **WS-61** | "What would happen" prompts | S | Random twists/complications/NPC actions from world data. Inspiration button. |

### Sprint G — GM polish (S–M)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WS-33** | Board export: Markdown | S | Board gets Markdown + Obsidian export (CampaignApp has 8 formats, board has 3). |
| **WS-36** | Multi-step undo | S | Stack of 5–10 operations (delete, card state, player changes). |
| **WS-38** | Session end summary | M | Export log: rolls, FP flow, consequences, cards generated. |
| **WS-44** | Card search on canvas | S | Search/filter highlights or scrolls to matching cards. |
| **WS-46** | Drag card between PREP and PLAY | S | Direct move (not copy) between canvases. |

### Sprint H — Platform hardening (XS–S)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WS-47** | Player reconnect recovery | S | "Request full state" handshake on reconnect. |
| **WS-48** | Simultaneous roll guard | XS | Queue toasts with stagger delay. |
| **WS-49** | Max players guard | XS | Soft cap warning at 6, hard display cap. |
| **WS-50** | Per-panel error boundary | S | Wrap each major panel independently. Single crash shouldn't kill the board. |
| **WS-51** | IDB storage quota warning | XS | `navigator.storage.estimate()` check with toast. |
| **WS-52** | Export format versioning | XS | Add `{version: 1}` wrapper to JSON exports. |
| **WS-53** | Print-friendly scene state | S | Clean print layout: cards, roster, turn order. |
| **WS-54** | Session state URL | M | Shareable snapshot of board state for async review. |

### Rules items (not yet sprinted)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WS-41** | Extra mild consequence slot | XS | Superb (+5)+ Physique/Will. `engine.js` comments note "not implemented." |
| **WS-74** | Bronze rule: everything is a character | M | Organizations, vehicles as tracked entities. FCon p.47. |
| **WS-75** | Weapon/armor ratings | XS | FCon p.58 optional rule. Flag in help as optional. |
| **WS-76** | Scale rules | S | FCon p.57. +2 per step difference. Rare but important. |

### Content items (not yet sprinted)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WS-58** | Sample scenario per world | L | Pre-built loadable scene: 1 aspect, 2 zones, 2 NPCs, 1 countdown, 1 issue. |
| **WS-59** | Opposition library | M | 5–8 curated NPCs per world, loadable from help panel. |
| **WS-62** | Zone template library | M | Common environments with pre-built aspects and difficulties per world. |

### UX / platform items (not yet sprinted)

| ID | Title | Size | Notes |
|----|-------|------|-------|
| **WS-63** | Combat tracker density view | M | Compact table: all combatants inline with stress/FP/acted. |
| **WS-64** | Campaign arc tracker | L | Current/impending issues + milestone progress across sessions. |
| **WS-65** | Relationship map | L | Visual web of PC/NPC relationships from aspects. |
| **WS-66** | Sound/ambience integration | M | Per-world ambient audio. Web audio API. |
| **WS-69** | Dice statistics panel | S | Distribution curve, streaks, per-player averages. Post-session review. |
| **WS-70** | Quick actions palette (⌘K) | M | Command palette for power users. |
| **WS-71** | Colorblind-safe state indicators | S | Shapes/patterns/icons alongside colour for stress/FP/acted. |
| **WS-72** | Player avatar selection | XS | Emoji/icon pick for visual identity in turn bar. |
| **WS-73** | Table tent mode | XS | Large name+HC display on player device for physical table. |

---

## Completed — reference (moved from Open)

| ID | Status | Notes |
|----|--------|-------|
| ~~UNI-01–06~~ | ✅ | Unified surface. BoardApp is single PREP/PLAY surface. PrepCanvas retired. |
| ~~BDR-01~~ | ✅ | Drafting Tray. |
| ~~BDR-02~~ | ✅ | Binder filter strip. |
| ~~BDR-03~~ | ✅ | cv4Card CSS 3D flip. |
| ~~PL-03~~ | ✅ | Pre-join character builder. |
| ~~TBL-01~~ | ✅ | Player waiting state. |
| ~~MOB-15~~ | ✅ | Mobile nav spike. |

---

## Tier 3 / Parking lot

| ID | Title | Notes |
|----|-------|-------|
| **BL-11** | Stunt builder wizard | Skipped — build when there's user demand. BL-05 stunt browser ships first. |
| **WLD-02** | 9th campaign world | Parked — revisit 2027.03.01 |
| **PDF-04–08** | 5 remaining PDF books | Parked — revisit 2027.03.01 |
| **PERF-02** | Vite/terser minify | Revisit after SPA decision |
| **SPA-06** | var→JSON modules | Requires `<script type="module">` everywhere. Blocked. |
| **PL-01** | Multi-GM mode | Needs CRDT |
| **PL-02** | Native app wrapper | After PWA demand confirmed |
| **EXP-01** | Fari App / Foundry VTT export | Code preserved. Revisit when VTT integration confirmed as user need. |
| **WS-64** | Campaign arc tracker | Current/impending issues + milestone progress across sessions. |
| **WS-65** | Relationship map | Visual web of PC/NPC relationships from aspects. |
| **WS-66** | Sound/ambience integration | Per-world ambient audio. Web audio API. |
| **WS-67** | Import from Fari / Foundry | Character and scene JSON schema mapping. |
| **WS-68** | Session recording / replay | Log every action with timestamps. Read-only timeline. |

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
| v2026.03.393 | **Play sprint (4 sprints, 8 features).** Sprint 1: TpDicePanel rewrite (learn-fate visual language, flicker→reveal→done phase machine, 68px dr-die tiles, Fate Ladder hex colours via tpLcolHex, vertical layout). Scene End button (endScene clears all phy/men stress, resets acted, confirm dialog, broadcasts). Sprint 2: removeFromTable (bidirectional — BoardCard ✕ button + BoardDossier ○ Remove button, IDB update, broadcast). cv4Card CSS 3D flip (rotateY 180deg, front=content, back=GM Guidance, reduced-motion display toggle). Sprint 3: Free invoke counter on aspect stickies (4 pips, add/consume, freeInvokes on card data). Character sheet on PlayerSurface (expandable My Character section, aspects + skill pyramid + refresh). Sprint 4: Boost card type (genId=boost, 1 free invoke, auto-expires on use, amber gradient, binder section). Opposition Fate Ladder dropdown (replaces number input, clickable ladder −2 to +8 with labels/colours). Hotfixes: LABEL_STYLES crash (pre-existing v391 — constant was used but never defined). CSP connect-src Google Fonts for SW fetch. NA-251–269. |
| v2026.03.387 | **Custom Card.** Fully inline-editable cv4-frame card. Type pill cycles Aspect→NPC→Location→Clue→Other (tints accent colour). Title and notes both click-to-edit in place. Persists to IDB via updateCard. Reroll disabled. Send to Table, Binder, export all work normally. Context menu entry added. CV4_HELP back panel with invoke/compel examples. NA-240–242. Dead code removed: mdHeader, mdWinLose (engine.js). Docs updated to v387, QA 242/242. |
| v2026.03.386 | **UX Sprint 5 — Session Zero bridge.** ▶ Start Local Session button on Session Zero completion screen writes ogma_sz_handoff to sessionStorage then navigates to board. BoardApp reads handoff on FP load, pre-populates tracker with 4 Player N slots at Refresh 3, fires toast. board.html default mode changed play→prep. NA-238–239. Sprint 5 of 5 complete — all 12 UX items shipped. |
| v2026.03.385 | **UX Sprints 2–4.** Sprint 2 (remote): player room code chip in topbar (bt-room-chip); Turn Order tab renamed from Initiative + inline rule explanation. Sprint 3 (generators): one-line sub text on every generator item; Canvas Tools separator between generators and tools. Sprint 4 (rules access): stress ≠ HP hint on NPC cards; mobile topbar max-width breakpoint. NA-232–237. |
| v2026.03.384 | **UX Sprint 1 — first-run orientation.** UX-11: Adventure Seed rename (was Quick Adventure Start) across all surfaces. UX-02: PREP/PLAY button titles fully descriptive. UX-01: empty canvas coach mark (first visit, localStorage-gated, dismissible). UX-05: PLAY mode entry coach mark explaining Send to Table / two-canvas model. NA-231. |
| v2026.03.383 | **Content sweep complete — Neon Abyss + The Long Road.** Neon Abyss: 7 fixes (4 trouble dupes, 3 stunt dupes including Ghost Routine≈Ghost Protocol). The Long Road: 9 fixes (4 trouble dupes, 5 stunt dupes including literal Jury Rig≈Jury-Rig and Ghost of the Wastes≈Wasteland Ghost). All 8 worlds now audited. |
| v2026.03.382 | **Session Zero deepening (all 8 guides) + Victorian + Void Runners audits.** Building Your Character section added to all 6 remaining guide pages (was only western + dVentiRealm). Victorian: 4 fixes (trouble dupe, 3 stunt dupes). Void Runners: 8 fixes (5 trouble dupes, 3 stunt dupes). |
| v2026.03.381 | **useBoardCards hook extracted from BoardApp.** Cards, loaded, cardsRef, lastRemovedRef/Rerolled/Placed, persistCanvas, generateCard, updateCard, deleteCard, rerollCard, undoLast, exportCanvas, importCanvas, IDB load effect all moved to hook. BoardApp drops 971→1072→971 lines; 4 state vars + IDB effect removed from component body. _bcOnChange ref wires hook → useBoardBinder. |
| v2026.03.380 | **QA hardening.** 14 new assertions NA-217–230: version stamp sync, React/Dexie CDN load order, duplicate script detection, CSP font origins, React alias definitions, top-level const/let guard, board.html redirect, campaign-data pairing, node --check all JS, ErrorBoundary presence, sw.js coverage, undefined-in-output, hook ordering. Two data bugs surfaced and fixed: dVentiRealm + western sparse array holes (double-comma). `pick()` hardened against sparse arrays. |
| v2026.03.379 | **Crash prevention QA (NA-212–216).** Five assertions: no document.write() in HTML; campMeta defined before first use in BoardApp; useBoardBinder called after campMeta; CSP allows Google Fonts; derived vars used after declaration. Confirmed NA-213/214 fire when v378 bug is reintroduced. |
| v2026.03.378 | **Three production error fixes.** (1) campMeta is undefined crash — moved derivation before useBoardBinder hook call. (2) document.write() in 36 HTML files — replaced with createElement("base") DOM pattern. (3) CSP blocking Jost — added fonts.googleapis.com + fonts.gstatic.com to _headers. |
| v2026.03.377 | **FCon content audit — 7 text violations fixed.** Major NPC refresh=2→3 in generators.html. "Initiative roll" language replaced with exchange-based FCon wording (3 sites). FAQ mild consequence recovery added treatment requirement. Stress description added "mark multiple per hit". Consequence reframed as aspect not mechanical modifier. |
| v2026.03.376 | **CHANGELOG catch-up + Shattered Kingdoms audit + Session Zero deepening.** SK: 11 data fixes (trouble dupes, stunt mixed-skill fix, succession issue). Session Zero sections added to Dust and Iron + dVentiRealm guides with PL-03 summary, skill pyramid, Physique/Will callout. |
| v2026.03.375 | **React Architect review.** Two runtime crashes fixed: `setPrepView is not defined` in `openCanvas`; `playCardIds is not defined` in `BoardTopbar` (now `onTableCount` prop). `useBoardBinder` hook extracted from BoardApp (70 lines inline state+effects+helpers → single hook call). BoardTopbar props grouped 38→8 semantic objects (`sync`, `panels`, `counts`, `exportActions`). 4 dead vars removed, 8 dead CSS classes removed, `PrepCanvas` function (1130 lines) removed from ui-table.js. `aria-label` on consequence/label/room-code/participant inputs. `showToast` → `useCallback`. Stale keyboard effect dep removed. IDB reload guard in `useBoardPlayState`. Bundle: 509KB → 304KB. |
| v2026.03.374 | **GM Screen model.** cv4Cards inline on canvas at 65% scale (replaced compact chips). `sendToTable` function + `playCardIds` Set: copies prep card to play canvas IDB, shows bullet On-table indicator. Topbar "N on table" chip. Default zoom 0.75. Dossier redesigned as compact GM Guidance panel (rules, invoke/compel examples) — no redundant card re-render. Left panel locked open in PREP; toggle only in PLAY. |
| v2026.03.373 | **UNI sprint — unified GM surface.** BoardApp is now the single surface for prep and play. UNI-01–06: BoardBinderPanel added to BoardApp (filter strip + Drafting Tray, IDB-backed). PREP/PLAY mode badge (accent/green filled pill, topbar border stripe). Generate/Stunts/Help panel always visible in both modes. Player roster collapsible accordion in PREP. PrepCanvas retired from nav (prepView state + 50 lines table sync removed from ui.js). Sidebar: single "Prep & Play" entry. Mobile nav updated. NA-206–208. |
| v2026.03.372 | **Neon Abyss content audit + CHANGELOG v344–v371.** Mechanical Auditor pass: 4 trouble duplicates replaced, 5 stunt fixes (2 dupes removed, 2 narrow stunts broadened, Flash-Bang skill corrected to Crafts), 4 stub issues fleshed out with faces/places, 3 weakness dupes replaced, 2 faction role dupes replaced, 1 twist and 1 compel situation replaced. CHANGELOG entries written for v344–v371 (was empty above v344). |
| v2026.03.370 | **PL-03 + offline fix + VIS-01.** 3-step pre-join character builder (name / aspects / skills, FCon pyramid, stress derived from Physique/Will per FCon p.12). Conditional base href in all 36 HTML files (unzip+open locally now works). fp-btn circular style restored. Mobile acronym nowrap. NA-204-205. |
| v2026.03.369 | **Binder rework (BDR-01/02/03).** Drafting Tray: IDB-persisted staging layer, Send all to Table. Binder filter strip: All/People/Scene/Story/Mechanics. GM Guidance footer: CSS maxHeight slide + spring chevron rotation. NA-202-203. |
| v2026.03.368 | **Full CSS + JS audit.** 6 campaign roll button selectors restored (orphaned since v344). PWA banner, action-bar, fp-btn base rules restored. Font stragglers to Futura. 9 dead JS functions resolved: dead helpers removed, toggleGmMode/addGMNote/exportFull wired, MD_FOOTER self-assignment fixed. |
| v2026.03.367 | **Futura typeface site-wide.** Jost (Futura proxy) replaces Fraunces+Martian Mono across all 38 HTML, theme.css, ui-renderers.js, db.js. OGMA_CONFIG.VERSION in config.js + campaign footers. Style Guide link in footers. |
| v2026.03.366 | **disconnectSync fix + Binder cv4Cards.** disconnectSync ReferenceError on Table open fixed. Binder shows full cv4Cards with Send to Table, filter strip, Drafting Tray. NA-199-203. |
| v2026.03.365 | **Build pipeline.** scripts/build.js 3-tier (terser 40% savings). npm install --ignore-scripts standard workflow. PROJECT_MEMORY.md, docs/BUILD.md, help copy fixes. |
| v2026.03.364 | **Workshop voices.** Product Strategist, UX Researcher, Mechanical Auditor added to BOOTSTRAP. content-authoring.md updated: four-audience framework, aspect quality bar, smoke test 7-to-8 worlds. |
| v2026.03.363 | **MD + help audit.** README npm table, testing.md counts, CONTRIBUTING.md, ADR-0001 all updated for current architecture. |
| v2026.03.362 | **SW regression + offline build.** Bundle removed from APP_SHELL. Build runs before every zip. |
| v2026.03.360-361 | **10-changeset apply.** Accordion nav, ExportModal, canvas wiring, toBatchMarkdown, Session Zero deepening all confirmed in v359; build pipeline, PROJECT_MEMORY, help fixes added. |
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

