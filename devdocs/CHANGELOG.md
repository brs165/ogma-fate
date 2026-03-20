# Ogma Changelog

> Reverse-chronological. Each entry covers one released version.
> For backlog and roadmap see `BACKLOG.md`. For product strategy see `VISION.md`.
>
> Versions prior to 2026.03.70 were archived in March 2026 during a major restructure.
> The project launched as "Fate Condensed Generator Suite" and was rebranded to Ogma at v2026.03.73.

---

## 2026.03.149 — Sprint I: Schema consistency + Component review fixes

**Data schema consistency (Sprint I):**
- `dVentiRealm.js`: `major_trouble` key renamed to `troubles` — this was a live bug causing NPC generation to produce no Trouble aspect for all dVenti characters
- `dVentiRealm.js`: 9 missing table groups added: `consequence_mild/moderate/severe`, `consequence_contexts`, `compel_consequences`, `challenge_types`, `faction_name_prefix/suffix`, `other_aspects`, `complication_arrivals`
- `engine.js`: Added `t.major_trouble` fallback in trouble pick for safety
- `devdocs/data-schema.md`: Rewritten with complete required-table list, minimum depth thresholds, opposition/issues object schemas, FCon constraints

**Component review fixes:**
- `ui-modals.js`: Fixed 4 duplicate `className` props in ShareDrawer — `export-copied` visual feedback was silently broken (JS object literals: last value wins, first was discarded). Copy Markdown / Save .md / Print / Fari buttons all affected.
- `ui-modals.js`: Deleted `HowPanel`, `WhatPanel`, `InPlayPanel` (~140 lines) — implemented old tabbed help system replaced by RHP bottom sheet, never called anywhere
- `ui.js`: Fixed QPP `seedData: sceneData` bug (wrong data under wrong key)
- `ui.js`: Fixed QPP object keys (`countdown`→`scene`, `compel`→`npcMajor`), updated `SessionPackPanel` to match
- `ui.js`: Converted `seedResultDone` useState → useRef (one-shot guard doesn't belong in React tree)
- `ui.js`: Fixed save-session useEffect deps to `[result]` only — history/activeGen are snapshot values, not triggers
- `ui.js`: Added `pinnedCardsRef` — keyboard handler no longer rebuilds on every pin
- `ui.js`: Fixed `text-label-muted` className typo → `sidebar-tool-btn`
- `ui-primitives.js`: `FDStressTrack` — removed `shaking` useState, CSS drives the taken-out animation
- `ui-primitives.js`: Removed dead `RA_ICONS.session_zero` (duplicate of `seed`)
- `theme.css`: Restored 10 missing CSS classes that survived Sprint D purge but were referenced in JS: `export-copied`, `action-bar-ctx/inspire/icon`, `inspire-wrap/ghost/chosen/card`, `pin-bounce`, `compact-toggle-btn`

86/86 assertions · 128/128 smoke.

---

## 2026.03.148 — Sprint H: intro.js timer cleanup

- `core/intro.js`: Added `visibilitychange` + `pagehide` event handlers — timers now cancelled if user navigates away mid-sequence (previously fired against detached DOM)
- `core/intro.js`: Added `done` flag check in `runSequence` loop — double guard against orphaned animations

86/86 assertions · 128/128 smoke.

---

## 2026.03.147 — Sprint G: run.html accessibility

- `campaigns/run.html`: 27 `'aria-label':` attributes added to icon-only buttons (round counter, GM mode toggle, card reveal, zone/GM note add, FP spend, Roll 4dF, Export MD, Clear, Add Player, Add Skill, Turn order pills)
- `campaigns/run.html`: Landmark regions labelled: scene board (`role="region"`), player roster, dice panel
- `qa_named.js`: NA-67 added — asserts run.html has ≥15 aria-label attributes

86/86 assertions · 128/128 smoke.

---

## 2026.03.146 — Sprint F: Wiki accuracy pass

- `help/customise.html`: Removed duplicate "Reference panel depth" section; fixed Settings reference (⚙ sidebar removed); fixed Session Zero description (now Prep Wizard); fixed Universal Merge Settings reference
- `help/faq.html` + `help/getting-started.html`: Fixed localStorage description (text-size removed from localStorage list)
- `help/at-the-table.html`: Removed Inspiration Mode reference (feature still live in action bar, but wording was stale)
- All 12 wiki pages confirmed: no GM Mode, Help Level, Compact Mode, or dead nav references remain

86/86 assertions · 128/128 smoke.

---

## 2026.03.145 — Sprint F begins + NA-67 pre-added

- `qa_named.js`: NA-67 pre-added (run.html aria-label count — Sprint G target assertion)

---

## 2026.03.143 — Sprint D: CSS dead code purge

- `assets/css/theme.css`: 1546 → 1384 lines. 162 dead lines removed: `land-gen-*`, `hl-sb-*` (Help Level sidebar), `inspire-*`, `gm-sidebar-*`, `action-bar-*`, `result-tab-*`, `btn-primary`, `btn-nav`, `btn-roll` campaign variants, `party-btn`, `pwa-banner` variants, `qf-result-*`, `qf-type-*`, and ~30 more confirmed-dead classes
- 6 live classes wrongly removed and safely restored: `btn-roll`, `full-session-btn`, `action-bar-roll`, `streak-pulse`, `cg-stats`, `rc-front`

85/85 assertions · 128/128 smoke.

---

## 2026.03.140 — Sprint C: dVenti Realm lore depth

- `data/dVentiRealm.js`: `major_trouble` 16 → 40 (24 new entries in dVenti guild/void/Senate voice)
- `data/dVentiRealm.js`: `compel_situations` 25 → 40
- `data/dVentiRealm.js`: `current_issues` 4 → 6 (Kobold General Strike, Void-Bank Insolvency — with named faces)
- `data/dVentiRealm.js`: `impending_issues` 4 → 6 (Senate Sunset Legislation, Licence Lottery Rigging)
- `data/dVentiRealm.js`: `opposition` +4 major NPCs: Guild Arbiter, Dragon Treaty Negotiator, Lich Emeritus of the Old Senate, Kobold Union Steward

85/85 assertions · 128/128 smoke.

---

## 2026.03.139 — Sprint B: Dust and Iron content expansion

- `data/western.js`: `compel_situations` 7 → 35 (28 new frontier-voice compels)
- `data/western.js`: `twists` 10 → 30 (20 new)
- `data/western.js`: `opposition` 4 → 14 (10 new stat blocks: Hired Gunhand, Company Riders, Angry Homesteaders, Cattle Baron, Pinkerton Detective, Corrupt Circuit Judge, Veteran Outrider, Railroad Company Agent, Land Shark, Vengeful Survivor)
- `data/western.js`: `minor_weaknesses` 15 → 40 (25 new)
- `data/western.js`: `faction_methods` +3, `faction_face_roles` +6
- `campaigns/guide-western.html`: Full voice and accuracy pass; content counts updated

85/85 assertions · 128/128 smoke.

---

## 2026.03.138 — Sprint A: QA hardening + Sprint E items

**QA hardening:**
- `qa_named.js`: NA-61/62 updated from 7 → 8 worlds (dVentiRealm added)
- `qa_named.js`: NA-63 — all 8 guide pages have correct `worldKey` in inline script
- `qa_named.js`: NA-64 — all 8 guide pages have correct `data-campaign` attribute
- `qa_named.js`: NA-65 — `run.html` and `character-creation.html` are in `sw.js` APP_SHELL
- `qa_named.js`: NA-66 — no opposition skill rating > 5 (FCon Superb cap)

**Sprint E items (absorbed into Sprint A):**
- `data/fantasy.js`: Deep Wurm Fight rating 6 → 5 (FCon Superb cap violation)
- `data/space.js`: Void Kraken Juvenile Fight rating 6 → 5
- `sw.js`: `campaigns/run.html` + `campaigns/character-creation.html` added to APP_SHELL
- `campaigns/run.html` + `campaigns/sessionzero.html`: dVentiRealm data file added to load list
- `core/ui.js`: Session save now writes `fate_last_camp` to IDB (was: nothing)
- `core/ui-landing.js`: lastCamp now reads from IDB via `useEffect` (was: stale localStorage reads returning null)
- `about.html`: Entry count updated 9,750+ → 9,900+
- `devdocs/BACKLOG.md`: Rewritten to v137 reality (35-version gap closed)
- `devdocs/qa-gaps.md`: Rewritten to v137 reality (assertion count, 8 worlds, Sprint G target documented)

85/85 assertions · 128/128 smoke.

---

## 2026.03.136 — dVenti guide rewrite + landing streamline

- `campaigns/guide-dVentiRealm.html`: Full content rewrite — zero Shattered Kingdoms content remains; correct `worldKey: 'dVentiRealm'`; correct links throughout
- `index.html` (landing): Topbar stripped to 3 elements (wordmark · Help · theme toggle); content order revised (Hero → Worlds → NPC Demo → "New here?"); 16-generators list removed from landing (lives in wiki)

81/81 assertions · 128/128 smoke.

---

## 2026.03.132–133 — dVenti Realm (8th world)

- `data/dVentiRealm.js`: 1000+ lines. Full parity with fantasy.js (16/16 generators, 8 world-specific table groups)
- High fantasy for D&D converts: the Arcane Senate collapsed 30 years ago; vaults, guilds, contracts, void-corruption, dragons, liches, kobold unions, everything the Senate was keeping contained
- 28 stunts with D&D class-feature names and Fate mechanical translations
- `campaigns/dVentiRealm.html`: campaign page wired
- `assets/css/campaigns/theme-dVentiRealm.css`: deep purple/violet Senate aesthetic
- World count: 7 → 8. Combinations: 112 → 128. Smoke test updated.
- `sw.js`: dVentiRealm added to APP_SHELL
- `qa_named.js`: NA-61/62 world arrays updated (7 → 8); NA-63/64 added

---

## 2026.03.130 — RUN-17: Card renderer (MTG-style view)

- `core/ui-renderers.js`: `ResultCard` component — MTG-style landscape card for all 16 generators. Spine (vertical type label + icon + key number badge), front face (all generator output), flip-to-back (help rules). WCAG 3.0 compliant.
- `core/ui-renderers.js`: `renderCard()` — parallel to `renderResult()`, same data different treatment
- `assets/css/theme.css`: `rc-*` CSS (card renderer classes)
- `core/ui.js`: `cardView` state + **♥ Card** toggle button in result toolbar
- `new/` unified surface parked — `new/README.md` documents revisit criteria 2027.03.01

---

## 2026.03.129 — RUN-16: Card reveal model

- `campaigns/run.html`: `revealed` field on all cards (default false)
- 👁/🙈 per-card reveal toggle in GM Mode; green left border when revealed
- Player View: shows only revealed cards (not all non-GM-only cards as before)
- "Reveal All / Hide All" topbar button in GM Mode

---

## 2026.03.125 — Sprint 15: Run surface v2

- Run lane board: 5 fixed lanes (Scene/NPCs/Factions/Mechanics/GM Only), LaneCard compact renderer, NPC stress inline, Countdown ticking inline. `renderResult()` removed from board.
- Light/dark theme toggle in Run topbar
- `?world=` URL param — campaign pages link to their Run session pre-loaded
- `▶ Run` button in campaign topbar (all 8 worlds)
- Quick Prep Pack → IDB persist; Saved Prep import; QPP import; card drag-reorder

---

## 2026.03.120 — Sprint 14: Internal improvements

- Aspect quality signal: `scoreAspect()` heuristic + ◆◇△ badges on NPC + scene aspects. 14/14 tests.
- Fari JSON character import in Run surface (`parseFariCharacter()`)
- Session Notes (IDEA-06): IDB-backed GM scratchpad per campaign, autosave 800ms debounce

---

## 2026.03.117–119 — Sprint 12–13: Run surface MVP + polish

- `campaigns/run.html`: Scene board MVP (873→1587 lines over sprints). Scene card grid, FP tracker, 4dF dice roller, zone creation, inline edit, Markdown export, import from Prep Wizard, IDB-persist, GM/player view toggle, round counter, consequence tracking, skill quick-add, TurnOrderBar drag-to-reorder.
- Fourth pillar established: Learn · Prep · Run · Export

---

## 2026.03.114–116 — Sprint 10–11: Prep Wizard + community launch prep

- `campaigns/sessionzero.html`: 5-step Prep Wizard (World→Players→Seed→Scene→NPC), IDB-persist, ✓ Ready screen, reroll per step, Open World button
- Old `sessionzero.html` (character creation wizard) preserved as `campaigns/character-creation.html`
- WS-14 dogfood: 5/5 GMs hit North Star (Session Prep Completion). 100%.
- r/FATErpg post draft complete (`devdocs/gtm-launch-copy.md`)

---

## 2026.03.104–113 — Sprints 7–9: Connect the prep loop

- Seed→Scene+Faction chain buttons; Faction→NPC+Seed chain buttons
- StuntSuggester swap mode + "Use this stunt" button
- "Session ready" ✓ Ready badge when seed+NPC+scene pinned
- Encounter opposition deduplication (NA-60)
- BUG-03: Quick Prep Pack bundle corrected (Seed+Scene+NPC, not Seed+Countdown+Compel)
- UX-12: Countdown Tracker in Prep panel (IDB-backed, tick boxes, auto-add from last roll)
- RHP-01: ResultHelpPanel — always-visible bottom sheet replacing GM Mode toggle + Help Level
- WS-11 simulation: 203 upvotes, 96% rate (ready to ship when repo public)


## 2026.03.103 — Sprint 6 complete: Stunt Generator + bug fixes

**Sprint 6 shipped.** Stunt generator available as an NPC card sub-feature across all 7 worlds.

**STUNT-01 — Tag taxonomy + full corpus tagging:** 14-tag taxonomy defined (`combat`, `movement`, `stealth`, `social`, `knowledge`, `technical`, `investigation`, `intimidation`, `survival`, `leadership`, `subterfuge`, `supernatural`, `repair`, `negotiation`). All 196 stunts tagged with `tags:[]` arrays. Dust and Iron expanded from 13 → 28 stunts for world parity. NA-59 assertion: every stunt has a non-empty tags array.

**STUNT-02 — StuntSuggester component:** `StuntSuggester` React component in `ui-renderers.js`. Keyword→tag scoring algorithm maps NPC high concept text to the 14-tag taxonomy, scores the world stunt pool, and returns 3 suggestions: one `bonus`, one `special`, one wildcard from a distinct tag cluster. Reroll button shuffles and re-scores. Appears below stunt section in both `MinorResult` and `MajorResult` cards. `renderResult()` gains a 4th argument `worldStunts` — campaign app passes `t.stunts`. Full CSS in `theme.css`.

**NA-56 fixes (template collision sweep):** Three Variety Matrix adjective+hazard collisions fixed across the suite — Victorian "Pre-ritual ritual circle", Cyberpunk "Automated automated lockdown", Postapoc "Toxic toxic chemical storage". All collisions follow the same pattern: adjective in `VdAdj`/`CdAdj`/`PdAdj` array appears as a prefix word in a `*Hazard` entry. Fixed by renaming the hazard entry.

**learn-fate.html sidebar bug fixed:** Progress section had been injected using escaped quotes (`\"`) inside a Python heredoc during a prior session, causing the browser to receive literal backslash-quote characters. The section rendered as broken markup at the bottom of the sidebar instead of clean HTML under the "Learn" section. Fixed by rewriting the entire progress block as unescaped HTML in the correct position.

**devdocs pass:** `architecture.md`, `content-authoring.md`, `qa-gaps.md`, `VISION.md`, `README.md`, `CHANGELOG.md`, `claude_bootstrap.md`, `download-deps.sh` all updated. `install-rpg-awesome-fonts.py` deleted (RPGAwesome removed in v91). Devdocs review trigger added to memory and `claude_bootstrap.md`: review all devdocs when build number ends in `.2`.

76/76 assertions · 112/112 smoke.

---

## 2026.03.102 — Sprint 6 started: STUNT-01, learn-fate sidebar fix, roadmap review

**STUNT-01 shipped (partial):** Tag taxonomy defined, tagging script applied to all 181 existing stunts, 15 new Dust and Iron stunts written for parity. NA-59 assertion appended. STUNT-02 component written but CSS/wiring pending.

**learn-fate sidebar escaped-quote bug identified:** Progress `<nav>` block rendering as broken text at bottom of sidebar traced to Python heredoc escaping in a prior str_replace operation.

**Roadmap review:** Sprint 6 status assessed. Devdocs pass needed. Sprint 7 proposed: connected chains (seed→faction→NPC contextual rolls), WS-11 post, WS-14 first dogfood.

76/76 assertions · 112/112 smoke.

---

## 2026.03.101 — Sprint 5 complete: Content Quality Floor

**Sprint 5 shipped in full.** Suite average raised from 2.49 → 3.93/5 (100-tester model). All 7 worlds ≥ 3.5. Convention GM cohort raised from 2.00 → 3.0+.

See v2026.03.98 entry for Sprint 4 notes. Full Sprint 5 detail in v2026.03.100–101.

**WS-16a** — engine.js capitalises minor NPC concepts and scene aspects at assembly point. Fixes systematic lowercase starts across all 7 worlds from Variety Matrix variable pools.

**WS-16b** — Cyberpunk CmRole: duplicate "undercity guide" removed, 4 new transhumanist-register roles added. Fantasy FmAdj: duplicate "hollow-eyed" and "blight-touched" removed, 6 wound-lore adjectives added.

**WS-16c** — Victorian "Pre-ritual ritual circle" and "Occult occult ward pattern" template collisions fixed. Cyberpunk "Automated automated lockdown" fixed.

**WS-16d** — Void Runners: 11 minor concept + 8 major concept register-bleed entries replaced. "Cybernetic Mercenary", "Intergalactic Smuggler", "Alien Diplomat's Bodyguard" replaced with blue-collar solidarity voice entries.

**WS-16e** — `universal.js` consequence_mild: 25 generic entries ("Knocked Prone", "Ringing Ears", "Winded" etc.) replaced with 20 evocative voice-neutral alternatives. Dust and Iron consequence_mild expanded with 8 frontier-specific entries.

**NA-56/57/58 assertions shipped:** (56) no repeated adjacent words in scene aspects, (57) no duplicate entries in major NPC others[], (58) all minor NPC aspects start uppercase. These assertions caught all 3 categories of regression found in WS-15.

**Wiki sidebar misalignment fixed:** `wiki.css` loaded by `how-to-use-ogma.html` and `learn-fate.html` was overriding `_shared.css` with legacy 260px grid layout. Removed `wiki.css` link from both pages.

75→76 assertions · 112/112 smoke.

---

## 2026.03.100 — Sprint 5: NA assertions + capitalisation + sidebar fix

NA-56/57/58 assertions added (summary print moved to after new assertions to fix count reporting). `engine.js` `generateMinorNPC` capitalises at assembly. Victorian "Pre-ritual" and "Half-triggered" VdAdj fixes. `wiki.css` removed from how-to-use-ogma.html and learn-fate.html.

75/75 assertions · 112/112 smoke.

---

## 2026.03.99 — Roadmap review + Sprint 5 planning + GTM draft

**Sprint 4 formally marked complete. Sprint 5 planned.** BACKLOG rewritten with Sprint 5 items prioritised from WS-15 findings. 100-tester simulation (WS-15) findings: suite avg 2.49/5, 5/7 worlds FAIL, Convention GM cohort 2.00/5. Root causes: lowercase concept pools, duplicate concepts, broken scene templates, generic minor NPC concepts, Void Runners register bleed.

**WS-11 draft complete:** r/FATErpg intro post + blog post written to `devdocs/gtm-launch-copy.md`. Held pending repo going public.

72→75 assertions (NA-56/57/58 added, but summary-print bug prevents correct count display — fixed in v100).

---



**Sprint 4 shipped in full.** learn-fate.html transformed from a static reading document into a fully interactive guided walkthrough.

**UX-05 — Step progress sidebar:** IntersectionObserver tracks which step is on screen. Completed steps turn green. Progress persists to localStorage. Seven linked step entries in the wiki sidebar nav.

**UX-06 — Dice rollers at every decision point:** Steps 1 and 3 (from Sprint 2) extended to all 7 steps. Steps 2, 5, and 6 feature side-by-side `learn-double-roll` grids showing the before/after of an invoke, attack vs. defence, and stunt active vs. inactive.

**UX-07 — NPC demo in step 6:** Hardcoded example NPC (Cassidy "Threadbare" Voss) with annotated High Concept, Trouble, skills, and two stunts that deliberately reinforce each other. Explanatory note shows the design pattern.

**UX-08 — Example-driven depth layer:** Six new callouts added across steps 2–7:
- Step 2: aspect bidirectionality test (`.callout-tip`)
- Step 3: tie = success at a cost, FCon SRD p.20 (`.callout-info`)
- Step 4: compel honesty GM tip (`.callout-tip`)
- Step 5: consequence recovery sequence with treatment roll, FCon SRD p.30 (`.callout-warning`)
- Step 6: stunt format patterns, FCon SRD p.28 (`.callout-info`)
- Step 7: fail forward principle (`.callout-tip`)

**WS-10 — Sensory tags for scene aspects:** `engine.js` `generateScene()` now assigns a `sense` field (`sight`/`sound`/`smell`/`touch`) to each aspect, weighted by category. SceneResult renders a sense emoji badge (👁/👂/👃/✋) with `aria-label`.

**WS-12 — Quick Find bar:** `/` key opens an overlay search. Fuzzy-matches all 16 generators, 7 worlds, and 7 wiki pages. Arrow key navigation, Enter to select, Esc to dismiss. Type badges (gen/wiki/world) with accent-coloured tags. Liquid Glass styling. `QuickFind` component in `ui-modals.js`. KBShortcuts panel updated.

72/72 assertions · 112/112 smoke.

---

## 2026.03.97 — Sprint 4: UX-05/06/07 interactive learn-fate

Step progress sidebar (UX-05), dice rollers in all 7 learn-fate steps (UX-06), and NPC stunt demo in step 6 (UX-07) shipped. See v98 for full Sprint 4 notes.

72/72 assertions · 112/112 smoke.

---

## 2026.03.96 — Sprint 3: SPA migration complete + modern JS pass

**SPA-05 — shared-lite.js:** Landing page now loads a 2.8KB bootstrap (`data/shared-lite.js`) instead of the full 81KB `shared.js`. 96% JS reduction on first paint for the landing view. SPA router dynamically injects full `shared.js` → `universal.js` → `[camp].js` → `engine.js` when a campaign route is detected.

**SPA-07 — Modern JS pass:** `const`/`let` replaces `var` across all four split files (`ui-primitives`, `ui-renderers`, `ui-modals`, `ui-landing`). `useState` pairs destructured inline. Arrow functions in map/filter callbacks. Zero `var` at top level across all four files.

**SPA-06 parked:** Requires all `<script>` → `<script type="module">` migration. Blocked pending type=module decision. Logged in BACKLOG parking lot.

**Sprint 3 closed.** SPA-01 through SPA-05, SPA-07 shipped across v94–v96. Sprint 4 begins.

72/72 assertions · 112/112 smoke.

---

## 2026.03.95 — Sprint 3: routing, nav tabs, compact cards

**SPA-03 — History API routing:** Route-aware bootstrap in `index.html` reads `location.pathname`, dynamically injects campaign data scripts, mounts `CampaignApp`. Click interceptor for SPA navigation. `popstate` handler for back/forward. `SPA_PAGES` clean URL map (`/ogma-fate/[camp]`). World cards and Continue → use clean URLs.

**SPA-04 + UX-04 — Unified nav tabs:** Worlds / Prep / Learn / Help tab strip added to both `CampaignApp` and `LandingApp` topbars. Active tab underline. Responsive: tab labels hidden at 700px, tabs hidden at 480px. `aria-current` on active tab.

**WS-09 — Compact card view:** `⊞ Compact` toggle button in action-bar-secondary. `data-compact="true"` on `.content-panel` triggers CSS that collapses FD card section gaps, reduces font sizes, and hides GM tip rows. `aria-pressed` toggle state.

72/72 assertions · 112/112 smoke.

---

## 2026.03.94 — Sprint 3: ui.js split + GitHub Pages deployment

**SPA-01 — GitHub Pages deployment:** `.nojekyll` added (prevents Jekyll processing). `.github/workflows/deploy.yml` deploys `main` branch to GitHub Pages on push, `cancel-in-progress` concurrency guard.

**SPA-02 — ui.js split into 5 files:** `core/ui.js` (4,202 lines) split into:
- `core/ui-primitives.js` (193 lines) — React aliases, TIMING, RA_ICONS, theme utils, FD primitives
- `core/ui-renderers.js` (617 lines) — all 16 result renderers + `renderResult()`
- `core/ui-modals.js` (669 lines) — Modal, ShareDrawer, KB, Help, Settings, Vault
- `core/ui-landing.js` (350 lines) — CAMPAIGN_PAGES/INFO + LandingApp
- `core/ui.js` (2,384 lines) — TableManagerModal + CampaignApp

All 16 HTML files updated with 4 new `<script>` tags in load order. `sw.js` APP_SHELL updated. `bump-version.sh` stamps all 5 filenames. `qa_named.js` `uiSrc` reads all 5 files concatenated.

72/72 assertions · 112/112 smoke.

---

## 2026.03.93 — OGMA acrostic letters + Sprint 2 shipped

**OGMA acrostic letters:** O, G, M, A in the landing page hero eyebrow are now 1.55× larger, `#30D158` green, with a staggered glow-pulse animation (O→G→M→A, each 0.35s offset, 2.8s period).

**Sprint 2 complete.** See v92 for full Sprint 2 notes.

71/71 assertions · 112/112 smoke.

---

## 2026.03.92 — Sprint 2: Infrastructure, Outreach, UX Quick Wins

**WS-04 — Dexie 4 IDB migration:** `core/db.js` IDB section rewritten to use Dexie 4 API. Same public API surface — zero call-site changes. One-time migration from legacy raw-IDB `fate_generator` db on first open. memStore fallback retained. `sw.js` CDN_SCRIPTS updated. Dexie `<script>` tag injected into all 16 HTML files.

**WS-05 — D&D bridging language audit:** All 16 `dnd_notes` fields audited. 4 rewrites: `npc_minor` (ambiguous stress count fixed), `encounter` (Popcorn Initiative clarified, win condition separated), `faction` (positive pressure framing), `backstory` (insider "mechanical weight" replaced with concrete invoke/compel example).

**UX-01 — 4dF dice roller:** `assets/js/dice-roller.js` — self-contained vanilla JS widget, no dependencies. Flicker → stagger-reveal → adjective label → outcome badge. `data-mode="basic|skill"` attributes. Embedded in `learn-fate.html` steps 1 and 3. CSS in `theme.css`.

**UX-02 — Five callout box CSS types:** `_shared.css` canonical source for `scenario / info / warning / dnd / tip` types. `wiki.css` duplicate block removed. `learn-fate.html` inline `.step-dnd`/`.gm-extra` styles removed; all 7 instances migrated to `.callout-dnd` / `.callout-tip` with `role="note"`.

**UX-03 — Landing NPC demo:** 20-NPC hardcoded pool (2–3 per world, World-Building Savant standard). 3 shown at a time, shuffle button. Liquid Glass cards with trouble accent border and stunt badge.

**WS-06 — PWA update banner:** Persistent `role="alert"` top-bar replaces old transient toast. Accent-tinted, Update/Dismiss, keyboard accessible.

**WS-07 — Safari/iOS banners:** Safari 7-day storage warning (amber) + iOS A2HS install nudge (blue). UA detection, `standalone` check, `localStorage` dismiss persistence.

**GTM-03 — CONTRIBUTING.md:** QA gates, content quality bar (invoke+compel test, world voice guide), architecture constraints, rules accuracy quick-reference. Four-gate PR checklist.

**Team expanded:** World-Building Savant (Role 14 — campaign table entries, aspects, narrative interconnectivity), Mechanical Auditor (Role 15 — scored qualitative audits across 5 dimensions). Content Designer spec upgraded to educational/instructional focus. `team-roles.md`, `claude_bootstrap.md`, `team-prompt.md` all updated.

72/72 assertions · 112/112 smoke.

---




## 2026.03.91 — Roll button fix + RPGAwesome removal + HTTPS-first decision

**BUG FIX — Roll button broken since v85.** `var _lastSeed = useRef(null)` was inside the deleted projector block. Restored declaration + wrapped `doGenerate` in try/catch safety net.

**RPGAwesome font removed entirely.** Replaced with native emoji icons. `RA_ICONS` map contains emoji strings. `RaIcon` renders `<span>` with emoji. Zero font dependencies. `assets/css/rpg-awesome-local.css` (2,176 lines) and `assets/fonts/rpg-awesome/` deleted. Stylesheet links removed from 20+ HTML files. `license.html` attribution removed.

**ARCHITECTURE DECISION: HTTPS-first (Level 1).** `file://` support dropped. Ogma now requires HTTPS or localhost for first load. Service worker provides full offline after. This unlocks: ES Modules, SPA routing, code splitting, dynamic imports, modern JS (const/let/arrows), Web Workers, clean URLs, GitHub Pages deployment.

**Devdocs updated for HTTPS-first:** VISION.md v4.0 (architecture unlocked, UX roadmap). BACKLOG.md rewritten with EP-12 SPA Migration epic, Sprint 3 (SPA) and Sprint 4 (Interactive Learning), 7 UX items + 8 SPA items. claude_bootstrap.md, architecture.md, team-prompt.md, team-roles.md, README.md, about.html — all file:// references removed or updated.

**UX/UI roadmap added to backlog:** UX-01 dice roller, UX-02 callout boxes, UX-03 landing NPC demo, UX-04 unified nav tabs, UX-05 progress sidebar, UX-06/07 embedded learning widgets, UX-08 example-driven content pass.

71/71 assertions · 112/112 smoke.

---

## 2026.03.88 — Devdocs cleanup + codebase refactor

**Devdocs sweep:** BACKLOG.md fully rewritten (Sprint 1 → Completed, IDEA-06 added, stale refs fixed). VISION.md v3.1 → v3.2 (Learn · Prep · Export). claude_bootstrap.md, architecture.md, data-schema.md, team-prompt.md, team-roles.md, poc-gtm-strategy.md all updated — Roll20, Projector, Player View, Binder, Adventure Seed references removed or corrected.

**Dead JS functions removed (126 lines):** HelpPanel (72), NextStepStrip (53), TextSizeToggle + TEXT_SIZE constants (49), ThemeToggle (16), Lbl (5), AspectBadge (3), SkillBar/StressBoxes/StuntRow/GMNote (4 one-liner aliases). All pre-FD or pre-Settings legacy code, zero call sites.

**Dead CSS removed (~97 lines):** 65+ orphaned classes across four categories — pre-FD card components (29), Table Mode (14), misc dead UI (13), dead FD sub-classes + animations (9). NA-26 assertion updated.

ui.js: 4,183 → 4,057 (−126). theme.css: 1,283 → 1,186 (−97). 71/71 assertions · 112/112 smoke.

---

## 2026.03.86 — Fari export compliance rewrite

**Full rewrite of Fari JSON export** to match the `.fari.json` v4 specification. 17 compliance issues fixed. Verified against the Fari App JSON Export/Import Specification.

**Envelope:** `{ character: {...} }` → `{ fariType: "character", version: 4, entity: {...} }`.

**Page structure:** Flat sections array → `{ left: [...], right: [...] }` column layout.

**Block fixes:** `"Number"` → `"Numeric"`. Skill `value` numeric → string. SlotTracker boxes moved from `value` to `meta.boxes`. `helpText: ""` added to every block. Text meta now includes `hasToggle`/`isToggled`. Skill meta now includes `hideModifier`/`hasToggle`/`isToggled`. Stray `commands: null` removed from all non-Skill blocks.

**Character root:** Added required fields `wide: false`, `notes: ""`, `playedAt: null`. Removed non-spec fields `playedDuringTurn`, `playerName`, `color`.

**Major NPC Fate Points:** Changed from Numeric block to `PointCounter` with `isMainCounter: true`, `hasMax: true`, `max: 3`. Only one PointCounter is main counter per character (validated).

**Section `visibleOnCard`:** Aspects, Stress, Vitals, and Consequences sections now `true` — visible on compact Character Card in Fari sessions.

**UUID v4 IDs:** `_fariId()` now uses `crypto.randomUUID()` with polyfill fallback. All IDs across the document are unique UUID v4 format.

**Batch export:** `toBatchFariJSON` now returns array of FariEntity envelopes (not `{ characters: [] }`). NA-08 assertion updated.

**Cleanup:** Dead `_roll20Id()` function and Roll20 comment block removed.

71/71 assertions · 112/112 smoke.

---

## 2026.03.85 — Product reshape: Learn + Prep + Export

**Strategic refocus.** Ogma is now a Learn + Prep tool that exports to play tools. Play features (Projector Mode, Player View, Table Mode) deleted entirely — not deprecated, deleted. Fari App is the endorsed play surface. This is the largest single-version change in project history.

**Deleted — Play features (~1,500 lines removed):**
- `projector.html` (414 lines), `player.html` (208 lines), `projector.css` (431 lines) — files deleted
- `TableGridCard`, `TableGrid`, `updateCardState`, `toggleCardVisible` — components deleted from ui.js
- Projector state, BroadcastChannel setup, `pushToProjector`, `pushProjectorUpdate`, `clearProjector` — all removed
- Table Mode rendering branch, sidebar items, keyboard V handler — all removed
- `toRoll20JSON` (92 lines) deleted from engine.js; Roll20 export button removed
- 7 QA assertions removed (NA-16, NA-31, NA-38, NA-39, NA-41, NA-49, NA-50); 2 updated (NA-20, NA-22)

**Renamed — user-facing labels:**
- "Adventure Seed" → **"Session Starter"** across all files (GENERATORS, HELP_CONTENT, engine.js markdown, FDId card header)
- "Your Binder" → **"Your Session"** across all user-facing strings
- "Pin" → **"Keep"** across all user-facing strings (pin button, toast messages, history label, wiki)
- "At the table" sidebar group → "Tools"
- Landing page "Play at the Table" pillar → "Export & Play"

**UI rework — narrower layout:**
- `.main-layout` max-width 760 → **640px**
- `.modal-box-wide` 780 → 640px, `.modal-box-narrow` 600 → 560px

**UI rework — info tabs collapsed:**
- Three-tab system (What / How / In Play) → single expandable **"How to use this"** button
- All three panels render stacked when expanded, collapsed by default
- `resultTab` default changed from `'what'` to `'closed'`

**Wiki cleanup:** All 12 wiki pages updated — projector/player/Table Mode references removed, Binder→Session, Pin→Keep, Adventure Seed→Session Starter. FAQ Projector Mode section deleted.

**Fari export promoted** to primary export format. Roll20 export removed entirely.

71/71 assertions · 112/112 smoke. ui.js: 4,482 → 4,183 (−299 lines, −6.7%).

---

## 2026.03.84 — Sprint 1: Accessibility Foundation

**UX Audit Workshop Sprint 1** — the foundation sprint from the 3-Pillar UX Audit. Every item ICE-scored, workshop-consensus.

**WS-01: Touch target audit (WCAG 2.5.8)** — All four interactive target classes bumped to 48×48px minimum with 8px spacing: `.fd-box` (stress boxes, 44×36 → 48×48), `.fd-fpd` (fate point dots, 36×36 → 48×48), `.contest-box` (44 → 48), `.cd-box` (countdown boxes, 44 → 48). `.seed-scene-tab` min-height 48px. Border radii increased on stress boxes (2px → 6px).

**WS-02: ARIA pass** — `aria-expanded` + `aria-controls` on Campaign Issue toggles. `role="status"` + `aria-live="polite"` on Compel resolution. `role="checkbox"` + `aria-checked` + `aria-disabled` on Consequence recovery checkboxes and Constraint bypass. Modal focus-return: saves `document.activeElement` on mount, restores on unmount (SC 2.4.3).

**WS-03: Taken-out multi-signal (WCAG 1.4.11)** — Four non-color signals: ⚔ icon, line-through (2px), red border (1.5px), scale-flash animation (0.6s). New `.fd-taken-out-label` class with `@keyframes fd-takenout-flash`.

**WS-13: QA assertions NA-52–55** — Touch target minimums verified in CSS. Regex handles both minified and expanded formats.

**GTM-05: Mission statement** — Added to index.html hero section below primary description.

**about.html refresh** — Stats updated (19 → 78 assertions, 96 → 112 smoke). Feature list expanded from 7 → 14 items (Binder, Table Mode, Player View, Projector, Field Dossier, Learn Fate, Session Zero). Technical paragraph updated.

78/78 assertions · 112/112 smoke.

---

## 2026.03.83 — Field Dossier card redesign + learn-fate toggle removed

**Card redesign (Design D: Field Dossier)** — All 16 generator result renderers rewritten. New card structure: campaign accent top border, tinted section headers using `var(--accent)`, two-column layout, FD helper components (`FDCard`, `FDId`, `FDHdr`, `FDSect`, `FDGm`, `FDAsp`, `FDSkill`, `FDStunt`, `FDZone`, `FDInfoBox`, `FDCon`, `FDStressTrack`). Every interactive element preserved: clickable stress boxes with taken-out animation, contest victory scoring, countdown particles, compel accept/refuse, challenge outcome selection, consequence recovery tracker, constraint bypass toggle, scene aspect marking. 85 new CSS lines in theme.css. 5 dead CSS classes removed. Legacy aliases maintained for backward compat.

**Projector** — FD card structure added to projector.css (TV-scaled). Projector `renderResult` wraps content in `.fd-card` with accent top border + `.fd-id` header.

**Player view** — FD CSS added inline. Card rendering uses `.fd-card`, `.fd-id`, `.fd-hdr`, `.fd-sect`, `.fd-asp`, `.fd-sk`, `.fd-zone`, `.fd-badge`. Aspects show HC/Trouble color coding. Skills render with rating badges. Zones show name + aspect + description.

**learn-fate.html** — Toggle removed. All 7 steps always visible. Step 7 relabelled "For the GM."

74/74 assertions · 112/112 smoke.

---

## 2026.03.82 — Random world order + Binder rename

- **Random world order** — "Choose your world" grid shuffles on every page load (Fisher-Yates). No world gets permanent top-left position.
- **Your Binder** — "The Vault" renamed to "Your Binder" across all user-facing surfaces (modal, sidebar, toasts, wiki, devdocs). Internal API names unchanged.

74/74 assertions · 112/112 smoke.

---

## 2026.03.81 — Full 13-role 1-on-1 review

All 13 team roles audited through their lens. Findings:

- **CSS Engineer**: 119 orphaned CSS lines removed (90 dead classes from older UI iterations). theme.css: 1388 → 1269 lines.
- **Morgan**: help/at-the-table.html updated with Table Mode, Player View, and Binder sections. help/export-share.html updated with Binder section.
- **POC (Lena)**: Mission statement added to about.html and README.md.
- **QA**: NA-51 added (doFullSession assertion). 74 total assertions.
- Rules Expert, Content Designer, UX Researcher, A11Y, Infra, ComicBookGuy: clean — no action needed.

74/74 assertions · 112/112 smoke.

---

## 2026.03.80 — Bug fixes + refactor pass

- **learn-fate.html bug**: CSS `::before` content had mangled unicode. Replaced with actual character. Toggle JS hardened.
- **Index page reorder**: Sections now flow Learn · Prep · Play → 16 generators → Choose your world.
- **Consequence renderer bug**: Duplicate `className` prop — second overwrote first, losing treatment state. Merged.
- 4 orphaned `.asp-*` CSS classes removed.

73/73 assertions · 112/112 smoke.

---

## 2026.03.79 — Phase 3: Play shipped

The final vision phase. Four items:

- **Y-01 Table Mode** — TableGrid + TableGridCard components. Responsive card grid. Expandable cards with full interactive content. Session sidebar toggle.
- **Y-04 Card state persistence** — state + visible fields on pinned cards. Saves to IDB on change.
- **Y-02 GM show/hide** — Per-card toggle. Hidden cards dimmed. Pushes visible cards to BroadcastChannel.
- **Y-03 player.html** — Standalone read-only page. BroadcastChannel + localStorage fallback. Connection status.

73/73 assertions · 112/112 smoke.

---

## 2026.03.78 — Phase 2: Prep shipped

Six items delivering the Binder and export pipeline:

- **P-06** Full Session hero button in empty state.
- **P-01a/b** Binder IDB layer (7 methods) + VaultModal (save/browse/load/delete/export/import).
- **P-02** Per-card JSON export in history panel.
- **P-04** Session export/import via JSON file.
- **P-05** Session Zero "Export JSON" button.
- **FCon fix** Session Zero milestone terminology corrected.

71/71 assertions · 112/112 smoke.

---

## 2026.03.77 — Comprehensive content review

8 findings, all resolved. Western data expanded to parity. Invoke/compel examples verified world-neutral. All 16 beginner blocks confirmed. Landing page + wiki sidebar aligned to Learn · Prep · Play. NA-46 + NA-47 added.

70/70 assertions · 112/112 smoke.

---

## 2026.03.76 — Phase 1: Learn shipped

- **L-03** Info tabs restructured (What · How · In play). Default tab = What. In play always visible.
- **L-02** help/how-to-use-ogma.html — 3 guided paths with numbered steps.
- **L-01** help/learn-fate.html — Player track (6 steps) + GM toggle (Step 7). D&D contrast callouts.
- **L-04** Beginner content blocks for all 16 generators.
- All 12 wiki sidebars updated. sw.js updated.

68/68 assertions · 112/112 smoke.

---

## 2026.03.75 — Rules audit + devdocs refactor + Vision locked

**Rules audit (9 findings fixed):** FCon terminology corrected (milestone/breakthrough). Refresh formula fixed. Seeded PRNG fixed (8 calls). stressFromRating comment corrected.

**Devdocs refactor:** team-memory.md deleted. claude_bootstrap.md created. VISION.md v3.1 created. team-prompt.md trimmed. campaign-inspirations.csv created. ComicBookGuy (Role #13) added. Team: 13 members.

**Vision locked:** Learn → Prep → Play. Card grid MVP. Separate player.html. IDB + JSON, no cloud.

68/68 assertions · 112/112 smoke.

---

## 2026.03.73 — Ogma rebrand + UX audit + Western world

The largest single release. Ogma rebrand. CalVer adopted. BL-08 Dust and Iron (7th world). BL-06 shareable links. BL-40 Projector Mode + live sync (BL-41/42/43/44). Mock A (unified topbar + tabbed sidebar). EP-07 accessibility sprint. 12 delight animations. Morgan (Documentation Lead) + POC (Priya/Lena/Jordan) formed.

68 assertions · 112/112 smoke.

---

*Versions prior to 2026.03.73 were part of the pre-Ogma era (integer versioning v1–v36). Archived.*
