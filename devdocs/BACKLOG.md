# Ogma — Backlog

> **Source of truth.** Update this file whenever items are added, completed, or re-prioritised.
> Current version: **2026.03.149** · Cache: `fate-generator-2026.03.149`
>
> **Last revised:** 2026.03.137 — Sprint A (QA hardening): NA-61/62 updated to 8 worlds, NA-63–66 added (guide worldKeys, data-campaign attrs, SW cache, FCon skill cap). run.html + character-creation.html added to SW APP_SHELL. dVentiRealm added to run.html + sessionzero.html data loads. Two FCon rules violations fixed (fantasy/Deep Wurm Fight=6→5, space/Void Kraken Juvenile Fight=6→5). Landing lastCamp migrated from localStorage to IDB. about.html entry count updated to 9,900+. 103/103 assertions · 128/128 smoke.
>
> **v149 — Sprint J (devdocs full sync):** CHANGELOG v77–v149 written, README updated, content-authoring thresholds added, data-schema.md complete, claude_bootstrap.md rewritten to v149. 103/103 · 128/128.
>
> **v127–v136 summary:** Full site audit + compliance pass (v131). dVenti Realm shipped as 8th world (v132–133). License & attribution overhaul (v134–135). Dark default + SEO + intro + landing streamline (v135–136). dVenti guide rewrite — zero Shattered Kingdoms content remains (v136). PDF book builders shipped to devdocs: The Long Road (35pp), The Long After (40pp), The Gaslight Chronicles (49pp).
> See `devdocs/VISION.md` for product strategy. See `devdocs/CHANGELOG.md` for version history.

---

## Sizing

| Label | Effort |
|-------|--------|
| XS | < 1 hour |
| S | 1-3 hours |
| M | half-day |
| L | full day+ |

## Prioritisation

**ICE scoring** (Impact x Confidence x Ease, each 1-10). No analytics data for Reach.

**North Star metric:** Session Prep Completion — user generates 3+ items AND keeps 1+ to session.

**Three personas:** Seasoned Fate GM / D&D Convert / Convention GM.

---

## Architecture decision log

| Date | Decision | Rationale |
|------|----------|-----------|
| v91 | **Drop file:// support. HTTPS-first.** | Unlocks ES Modules, SPA routing, code splitting, modern JS. Service worker provides full offline after first load. |
| v85 | **Drop Play features. Learn + Prep + Export.** | Projector/Player View/Table Mode deleted. Fari is the play surface. |
| v86 | **Fari .fari.json v4 as primary export** | Spec-compliant. Roll20 removed. |

---

## EPICs

| ID | Epic | Description |
|----|------|-------------|
| **EP-01** | Rules Engine | Generator logic, FCon compliance, data accuracy |
| **EP-02** | Content | Campaign table data, world-building, NPC/scene quality |
| **EP-03** | UX and Interface | UI components, navigation, interaction patterns |
| **EP-04** | PWA and Offline | Service worker, install, persistence |
| **EP-05** | Infrastructure | Versioning, deployment, QA battery |
| **EP-06** | Content Expansion | New campaign worlds, new generator types |
| **EP-07** | Accessibility | WCAG 3.0 / APCA compliance, ARIA, keyboard nav, 48px touch targets |
| **EP-08** | Learn | Interactive learning flows, guided walkthroughs |
| **EP-09** | Prep — Saved Prep | Persistent session save/load/export/import |
| **EP-10** | Export | Fari export, print/PDF, JSON session files, shareable links |
| **EP-11** | Discovery and GTM | Community outreach, user research, marketing |
| **EP-12** | SPA Migration | ES Modules, routing, code splitting, unified shell |

---

## Vision status

**Learn / Prep / Export** — all three pillars shipped. Enhancement phase: UX/UI and architecture modernization.

| Phase | Status | Key deliverables |
|-------|--------|-----------------|
| **Learn** | Shipped (v76), enhancing | "How to use this" expandable, learn-fate.html, 16 beginner blocks |
| **Prep** | Shipped (v78) | Saved Prep, per-card export, session JSON, Session Zero, Quick Prep Pack |
| **Export** | Shipped (v85-86) | Fari v4-compliant, Markdown, print/PDF, seed links, JSON |

---

## QA commands

```bash
# Syntax
node --check core/ui.js && node --check core/engine.js && node --check core/db.js && node --check core/intro.js

# Smoke (128/128)
node -e "var fs=require('fs');eval(fs.readFileSync('data/shared.js','utf8'));eval(fs.readFileSync('data/universal.js','utf8'));['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(c){eval(fs.readFileSync('data/'+c+'.js','utf8'));});eval(fs.readFileSync('core/engine.js','utf8'));var errs=[],total=0;['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(camp){var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'].forEach(function(gen){try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}catch(e){errs.push(camp+'/'+gen+': '+e.message);}});});console.log('Smoke: '+total+'/128  errors:'+errs.length);"

# Named assertions
node devdocs/qa_named.js
```

---

## Roadmap

> Sprint 1 shipped v84. Sprint 2 shipped v92. Sprint 3 shipped v96. Sprint 4 shipped v98. Sprint 5 shipped v101. Sprint 6 current (v102+).

### Sprint 2 — Infrastructure, Outreach, UX Quick Wins ✅ SHIPPED v2026.03.92

*Theme: Harden persistence, teach D&D converts, start the community flywheel, ship first interactive widgets.*

| ID | Epic | Title | Size | ICE | Status |
|----|------|-------|------|-----|--------|
| **WS-04** | EP-09 | IndexedDB migration: Dexie.js, migrate localStorage to IDB | M | 640 | ✅ Shipped |
| **WS-05** | EP-08 | D&D bridging language: audit + update all 16 beginner blocks | S | 630 | ✅ Shipped |
| **UX-01** | EP-08 | 4dF dice roller component + embed in learn-fate steps 1 and 3 | S | 600 | ✅ Shipped |
| **UX-02** | EP-03 | Five callout box CSS types (scenario/info/warning/dnd/tip) | XS | 580 | ✅ Shipped |
| **UX-03** | EP-03 | Landing page NPC demo (hardcoded 20-NPC pool) | S | 500 | ✅ Shipped |
| **WS-06** | EP-04 | "New version available" PWA update banner | S | 560 | ✅ Shipped |
| **WS-07** | EP-04 | Safari 7-day storage warning + iOS install banner | S | 504 | ✅ Shipped |
| **GTM-03** | EP-05 | Write CONTRIBUTING.md | S | — | ✅ Shipped |
| **WS-08** | EP-11 | Recruit 5 Fate GMs for observation sessions | M | 480 | ⏳ Priya — non-code |
| **WS-11** | EP-11 | r/FATErpg intro post + blog post | S | 400 | ⏳ Lena — non-code |

### Sprint 3 — SPA Migration + Unified Navigation ✅ SHIPPED v2026.03.96

*Theme: Convert to ES Modules + SPA routing. One shell, one nav, one source of truth. Unlocked by HTTPS-first.*

| ID | Epic | Title | Size | ICE | Notes |
|----|------|-------|------|-----|-------|
| **SPA-01** | EP-12 | Deploy current build to GitHub Pages | XS | 900 | ✅ Shipped — .nojekyll + GH Actions deploy.yml |
| **SPA-02** | EP-12 | ES Modules: split ui.js into component files | L | 800 | ✅ Shipped — ui-primitives/renderers/modals/landing/ui.js |
| **SPA-03** | EP-12 | SPA routing: single index.html + History API | M | 750 | ✅ Shipped — route-aware bootstrap, dynamic script injection, SPA_PAGES clean URLs |
| **SPA-04** | EP-12 | Unified nav shell: persistent top nav + contextual sidebar | M | 700 | ✅ Shipped — topbar-tabs in CampaignApp + LandingApp |
| **UX-04** | EP-03 | Top nav tabs: Worlds / Learn / Prep / Help | XS | — | ✅ Shipped with SPA-04 |
| **WS-09** | EP-03 | Compact card view toggle for FD cards | M | 480 | ✅ Shipped — ⊞ Compact button, data-compact CSS |
| **SPA-05** | EP-12 | Dynamic imports: campaign data loads on demand | M | 650 | ✅ Shipped — shared-lite.js, 2.8KB vs 81KB landing bootstrap |
| **SPA-06** | EP-12 | Data files: var globals to JSON modules | S | 600 | ⏸ Parked — requires all `<script>` → `<script type="module">`. Blocked on type=module migration decision. |
| **SPA-07** | EP-12 | Modern JS pass: const/let, arrows, destructuring | M | 500 | ✅ Shipped — 4 split files modernised |

### Sprint 4 — Interactive Learning ✅ SHIPPED v2026.03.98

*Theme: Embed interactive experiences in the learning flow. SPA shell shipped (Sprint 3).*

| ID | Epic | Title | Size | ICE | Notes |
|----|------|-------|------|-----|-------|
| **UX-05** | EP-08 | Progress sidebar for learn-fate (7 steps, localStorage) | S | 550 | ✅ Shipped |
| **UX-06** | EP-08 | Dice roller in all 7 learn-fate steps at decision points | S | 500 | ✅ Shipped |
| **UX-07** | EP-08 | NPC generator demo in learn-fate step 6 | S | 480 | ✅ Shipped |
| **UX-08** | EP-08 | Example-driven content: scenario + D&D + tip per step | M | 450 | ✅ Shipped — 6 new callouts across steps 2–7 |
| **WS-10** | EP-02 | Sensory tags for scene aspects | S | 420 | ✅ Shipped — sight/sound/smell/touch on every scene aspect |
| **WS-12** | EP-03 | Quick Find bar | M | 360 | ✅ Shipped — / key, fuzzy search, gen+world+wiki |
| **WS-14** | EP-11 | Dogfood: 3 GMs prep real sessions, record, debrief | M | 340 | ⏳ Priya — non-code |

### Sprint 5 — Content Quality Floor ✅ SHIPPED v2026.03.101

*Theme: Raise the content floor to 3.5+ suite average. Fix every systemic bug found in WS-15. Hold the stunt generator and r/FATErpg launch until content is ready.*

> WS-15 findings: 5/7 worlds FAIL the 3.0 threshold. Suite average 2.49/5. Convention GM cohort worst at 2.00. Gaslight Chronicles (4.50) is the model. Everything else must reach it.

| ID | Epic | Title | Size | Notes |
|----|------|-------|------|-------|
| **WS-16a** | EP-02 | Capitalisation fix — all 7 minor NPC concept tables | XS | ✅ Shipped — engine.js capitalises at assembly point; Victorian template collision fixed |
| **NA-NEW** | EP-05 | 3 new QA assertions — repeated words, duplicate aspects, uppercase minor concepts | XS | ✅ Shipped — NA-56/57/58, all passing |
| **WS-16b** | EP-02 | Concept pool expansion — Void Runners, Shattered Kingdoms, Neon Abyss | S | ✅ Shipped — dups removed, 4–7 new voice-specific entries per world |
| **WS-16c** | EP-02 | Broken template audit — scene aspects all 7 worlds | M | ✅ Shipped — engine.js capitalises at assembly; Victorian/Cyberpunk template collisions fixed |
| **WS-16d** | EP-02 | World voice pass — Void Runners register cleanup | M | ✅ Shipped — 11 minor + 8 major concept replacements, blue-collar register restored |
| **WS-16e** | EP-02 | Consequence flavor pass — all 7 worlds | S | ✅ Shipped — universal_mild replaced with 20 evocative alternatives; western expanded |
| **WS-08** | EP-11 | Recruit 5 Fate GMs for observation sessions | M | Priya. Non-code. Prerequisite for WS-14. |
| **WS-11** | EP-11 | r/FATErpg post — hold until WS-16a/b complete | S | Lena. Draft ready in `gtm-launch-copy.md`. Do NOT ship while "Cyber-enhanced Bounty Hunter" is the first result 38% of the time. |
| **STUNT-01** | EP-01 | Stunt data spec | S | ⏸ Deferred — content floor must reach 3.5+ before new generators. Review at Sprint 5 exit. |

**Sprint 5 exit criteria:**
- Suite average ≥ 3.5/5.00 (100-tester model, from 2.49 today)
- All 7 worlds ≥ 3.0/5.00 (currently 5/7 fail)
- Convention GM cohort ≥ 3.0 (currently 2.00 — worst score)
- Zero LOWERCASE_ASPECT in automated pass
- Zero DUPLICATE_CONCEPT in 12-sample test per world


### Sprint 6 — Stunt Generator + Community Launch ✅ SHIPPED v2026.03.103

*Theme: Ship the stunt generator as an NPC card sub-feature. Unblock the r/FATErpg post. First dogfood cycle.*

| ID | Epic | Title | Size | Notes |
|----|------|-------|------|-------|
| **WS-11** | EP-11 | r/FATErpg intro post + blog post | S | ⏸ Parked 2026.03 — repo not yet public. Review: 2026.09.01 |
| **STUNT-01** | EP-01 | Stunt tag taxonomy + tag all 196 stunts + Dust & Iron parity | S | ✅ Shipped — 14-tag taxonomy, all 196 stunts tagged, Dust & Iron → 28, NA-59 passing |
| **STUNT-02** | EP-01 | Stunt generator UI — card sub-feature on NPC results | M | ✅ Shipped — StuntSuggester in MinorResult + MajorResult, tag-match algorithm, reroll, CSS |
| **WS-08** | EP-11 | Recruit 5 Fate GMs for observation sessions | M | Priya. Non-code. Prerequisite for WS-14. |
| **WS-14** | EP-11 | Dogfood: 3 GMs prep real sessions, record, debrief | M | Priya. Non-code. Feeds Session Zero Wizard and IDEA-06. |

**Architecture decision (locked):** STUNT-02 ships as NPC card sub-feature first. Promote to sidebar generator in Sprint 7 if dogfood sessions show unprompted usage.

**Sprint 6 exit criteria:**
- Stunt generator surfaces ≥3 FCon-legal, world-voice-appropriate stunts for any NPC concept
- All stunt suggestions pass Rules Expert mechanical review
- r/FATErpg post live
- At least 1 dogfood session completed


### RUN-16 — Card Reveal Model (SHIPPED v2026.03.129)

*Inspired by Fari App's public/private card visibility model. GMs can reveal individual cards to players mid-scene.*

| ID | Title | Size | Status |
|----|-------|------|--------|
| **RUN-16a** | `revealed` field on all cards — default false | XS | ✅ Shipped |
| **RUN-16b** | 👁/🙈 per-card reveal toggle button in GM Mode | XS | ✅ Shipped — green when revealed, muted when hidden, green left border on card |
| **RUN-16c** | Player View: shows `!gmOnly OR revealed` (not all non-gmOnly cards as before) | XS | ✅ Shipped — Player View now only shows cards the GM has explicitly revealed |
| **RUN-16d** | "👁 Reveal All / 🙈 Hide All" topbar button in GM Mode | XS | ✅ Shipped — run.html + new/ unified surface |

**Design:** A card starts hidden. GM taps 👁 to reveal it to players. Player View shows only revealed cards plus normal non-GM-only cards. Same pattern as Fari App's public/private index card model.


### WLD-01 — dVenti Realm (SHIPPED v2026.03.132)

*High fantasy for D&D converts. The Arcane Senate collapsed 30 years ago. Vaults, guilds, contracts, void-corruption, dragons, liches, and everything the Senate was keeping contained.*

| ID | Content | Status |
|----|---------|--------|
| **WLD-01a** | `data/dVentiRealm.js` — 900+ lines, full parity with fantasy.js. 16/16 generators pass. | ✅ Shipped |
| **WLD-01b** | `campaigns/dVentiRealm.html` — campaign page wired | ✅ Shipped |
| **WLD-01c** | `assets/css/campaigns/theme-dVentiRealm.css` — deep purple/violet Senate aesthetic | ✅ Shipped |
| **WLD-01d** | All world counts updated: 7→8 worlds, 112→128 combos, 79→81 assertions | ✅ Shipped |
| **WLD-01e** | `core/ui-landing.js` — CAMPAIGN_PAGES, SPA_PAGES, CAMPAIGN_INFO, CAMPAIGN_GUIDE_PAGES | ✅ Shipped |
| **WLD-01f** | `sw.js` APP_SHELL, `qa_named.js` world arrays, BACKLOG smoke command | ✅ Shipped |

**Voice:** Guild contracts, dungeon licences, void-corruption, legal comedy, D&D creature vocabulary
(kobolds, goblins, dragons, liches, constructs) reframed through Fate's aspect/stunt/stress lens.
The Senate collapsed — the bureaucracy is still running. Tone: procedurally dangerous.

**D&D bridge table count:** 28 stunts with D&D class-feature names and Fate mechanical translations.

**Not yet done:** Campaign guide page (currently uses guide-western.html as placeholder).


### RUN-17 — Card Renderer Sprint (SHIPPED v2026.03.130)

*Two-page system confirmed as production architecture. new/ parked. Card renderer
added as alternative result view in the campaign generator.*

| ID | Title | Size | Status |
|----|-------|------|--------|
| **RUN-17a** | `ResultCard` component — MTG-style landscape card for all 16 generators | M | ✅ Shipped — spine + typeline + two content columns + flip-to-help back |
| **RUN-17b** | `renderCard()` in `ui-renderers.js` — parallel to `renderResult()` | S | ✅ Shipped — same data, card visual treatment |
| **RUN-17c** | All `rc-*` CSS in `theme.css` — WCAG 3.0 compliant, accent on decorative only | S | ✅ Shipped |
| **RUN-17d** | `cardView` state in `CampaignApp` + ♥ Card toggle button in result toolbar | S | ✅ Shipped — toggles between dossier and card view |
| **SPIKE-01** | `new/` unified surface parked — `new/README.md` documents revisit criteria 2027.03.01 | XS | ✅ Done |

**Architecture decision (permanent):** Two-page system is production.
`campaigns/[world].html` = prep. `campaigns/run.html` = session.
`▶ Run` + import pipeline = one-machine flow. See `new/README.md`.


### SPIKE-01 — Unified Surface (new/) — PARKED 2026.03 · Revisit 2027.03.01

> **Decision:** The two-page system (campaign generator + run.html) with the
> card renderer delivers the same value with less complexity. The unified
> surface was blocked by scaffolding issues (SW conflicts, React #130) rather
> than feature work. Parked as a reference implementation.
>
> **Resume trigger:** Community signal confirms demand, OR SPA/ES-modules
> migration makes the component resolution problem tractable.
> See `new/README.md` for full context.


### Sprint 15 — Run Surface v2 (SHIPPED v2026.03.125)

*Theme: Complete the Run surface — all known rough edges addressed.*

| ID | Epic | Title | Size | Status |
|----|------|-------|------|--------|
| **RUN-09** | EP-09 | Light/dark theme toggle in Run topbar | XS | ✅ Shipped — ◑ button in topbar |
| **RUN-10** | EP-09 | `?world=` URL param — campaign pages link directly to their Run session | S | ✅ Shipped — `getWorldParam()`, seeds campId+campName on load |
| **RUN-11** | EP-09 | `▶ Run` button in campaign topbar (all 7 worlds) | S | ✅ Shipped — added to CampaignApp topbar in ui.js |
| **RUN-12** | EP-09 | Quick Prep Pack → IDB persist (`quick_prep_pack_{campId}`) | XS | ✅ Shipped — fires on QPP generation, Run can now import it |
| **RUN-13** | EP-09 | Import from Saved Prep (Vault pinned cards) | S | ✅ Shipped — `importFromSavedPrep()`, amber banner when cards available |
| **RUN-14** | EP-09 | Import from Quick Prep Pack | S | ✅ Shipped — `importFromQpp()`, green banner when QPP available |
| **RUN-15** | EP-09 | Card drag-to-reorder on scene board | M | ✅ Shipped — `draggable`, drag state, rs-card-dragging/drag-over CSS |


### Sprint 14 — Internal Improvements (SHIPPED v2026.03.120)

*Theme: Three highest-value internal items while community signal is pending.*

| ID | Epic | Title | Size | Status |
|----|------|-------|------|--------|
| **AQ-01** | EP-02 | Aspect quality signal — `scoreAspect()` heuristic + `FDAsp` badge | M | ✅ Shipped — ◆ strong / ◇ ok / △ weak badges on NPC + scene aspects. 14/14 heuristic tests pass. |
| **RUN-08** | EP-09 | Ogma JSON character import in Run surface | S | ✅ Shipped — `parseOgmaCharacter()` (2026.03.154), file input in Add Card panel, onAddPlayer wired. Fari import parked as EXP-01. |
| **IDEA-06** | EP-09 | Session Notes — persistent GM scratchpad per campaign | S | ✅ Shipped — `SessionDoc` component, IDB-backed, autosave 800ms debounce, 📝 in Prep sidebar Tools. |

**scoreAspect heuristic rules:**
- `weak`: single word / bare qualifier pair / all-stat words
- `ok`: 2–3 words, workable but generic
- `strong`: proper noun, tension language (but/yet/haunted/debt/secret…), relationship structure (of/my/'s), 4+ words with context


### Sprint 13 — Path A: Run Surface Polish (SHIPPED v2026.03.119)

*Theme: Polish Run before going public. All three known gaps from Jordan's assessment.*

| ID | Epic | Title | Size | Status |
|----|------|-------|------|--------|
| **RUN-03** | EP-09 | PlayerRow: consequence tracking (Mild/Moderate/Severe inline inputs) | XS | ✅ Shipped — amber border when filled, always visible if any filled |
| **RUN-04** | EP-09 | PlayerRow: skill quick-add (expand button shows skill list + +/Add form) | S | ✅ Shipped — expand toggle, skill list with remove, add by name+rating |
| **RUN-05** | EP-09 | TurnOrderBar: draggable turn order at bottom of shell | S | ✅ Shipped — drag-to-reorder pills, click to toggle acted, All acted pulse signal |
| **RUN-06** | EP-05 | importFromWizard: player stubs missing conseq field | XS | ✅ Fixed — stubs now include conseq:['','',''] |
| **RUN-07** | EP-05 | BACKLOG cache version stale (v116 → v118) | XS | ✅ Fixed |

**Path A complete.** Ready for WS-11 (r/FATErpg post + repo public).


### Sprint 12 — Run (Session Surface MVP) SHIPPED v2026.03.117

*Theme: Single-GM session surface. The fourth pillar: Learn · Prep · Run · Export.*

> VTT concept reviewed against ogma-vtt.jsx mockup. Scoped to single-GM MVP: no multi-user sync, no character sheet builder — those need real usage data first.

| ID | Epic | Title | Size | Status |
|----|------|-------|------|--------|
| **RUN-01** | EP-09 | campaigns/run.html — scene board MVP | L | ✅ Shipped — 873 lines. Scene card grid, FP tracker, 4dF dice roller, zone creation, inline edit, Markdown view, import from Prep Wizard, export MD, IDB-persist, GM/player view toggle, round counter |
| **RUN-02** | EP-09 | Wire run.html into navigation | XS | ✅ Shipped — landing topbar (▶ Run), about.html, index.html, sw.js, sessionzero.html |
| **NA-62** | EP-05 | Assert run.html loads all 7 campaign files | XS | ✅ Shipped — 79/79 assertions |

**What was built:**
- TopBar: round counter ±, GM Mode toggle, Grid/List toggle, Export MD, Clear, Back
- Left sidebar: player roster with FP tracker (no hard cap mid-session, FCon-correct), PHY/MEN stress boxes, acted toggle, Add Player
- Center: scene board — card grid with pin/collapse/edit/MD view/remove per card; import from Prep Wizard (IDB key prep_wizard_v1); empty state with import prompt
- Right panel: 🎲 Dice (4dF roller with player skill list, FP spend +2, roll history) | ➕ Add Card (8 generator buttons + Zone form + GM Note)
- Cards: type-tagged (SEED/ASPECT/ZONE/NPC/COUNTDOWN/FACTION/COMPEL/GM ONLY), pinned first, collapse/expand, inline edit modal, Markdown view modal, countdown tick boxes with triggered state
- Import from Prep Wizard: reads prep_wizard_v1 IDB, creates cards from seedData/sceneData/npcData/extras, builds player stubs from backstories
- Export: Markdown download of session notes + all cards
- IDB persistence: run_session_v1 key, saves on every state change

**Deferred to later sprints (needs real usage data):**
- Multi-user sync (needs server/CRDT)
- Full character sheet builder (Fari handles this now)
- Token/map view
- Initiative reorder (drag-and-drop turn order)


### Sprint 11 — Polish + Community Launch Prep (SHIPPED v2026.03.116)

*Theme: Close all WS-14 remaining friction. Ship when repo goes public.*

> WS-14 final: 5/5 COMPLETE (100%). All cohorts reached. North Star journey: 60% (sim v104) → 80% (real v111) → 100% (v115).

| ID | Epic | Title | Size | Status |
|----|------|-------|------|--------|
| **QF-01** | EP-03 | Quick Find generator-only filter (🎲 toggle) | XS | ✅ Shipped — toggle button in QF bar, filters to generators only |
| **PW-01** | EP-08 | Prep Wizard bundle: card preview before Add | XS | ✅ Shipped — roll → preview panel → Add / Re-roll / Skip |
| **PW-02** | EP-08 | Prep Wizard summary: print-friendly sheet | S | ✅ Shipped — 🖨 Print button, @media print CSS |
| **NA-61** | EP-05 | Assert sessionzero.html loads all 7 campaign files | XS | ✅ Shipped — 78/78 assertions |
| **TIER5-clean** | EP-05 | Tier 5 backlog cleanup | S | ✅ Shipped — shipped items removed, 8th world promoted |
| **WS-11** | EP-11 | r/FATErpg intro post + blog post | S | ⏸ Parked 2026.03 · Review: 2026.09.01 |


### Sprint 10 — Session Zero Wizard Build (SHIPPED v2026.03.114)

*Theme: Build the GM Prep Wizard (distinct from the existing Session Zero character-creation wizard).*

> The existing sessionzero.html (821 lines, full Phase Trio character creation) was preserved. The new sessionzero.html is the 5-step GM prep flow Dmitri needed.

| ID | Epic | Title | Size | Status |
|----|------|-------|------|--------|
| **SZW-01** | EP-08 | Prep Wizard — campaigns/sessionzero.html | M | ✅ Shipped — 5 steps (World→Players→Seed→Scene→NPC), IDB-persist 7d, ✓ Ready screen, Reroll on each step, Open World button at end |
| **SZW-02** | EP-08 | Wire Prep Wizard into navigation | XS | ✅ Shipped — landing topbar (⚡ Prep), index.html, about.html, sw.js cache |
| **SZW-03** | EP-08 | Old sessionzero.html → campaigns/character-creation.html | XS | ✅ Shipped — preserved, cross-linked |
| **WS-11** | EP-11 | r/FATErpg intro post + blog post | S | ⏸ Parked 2026.03 · Review: 2026.09.01 |


### Sprint 9 — Community Ready (SHIPPED v2026.03.111)

*Theme: Get the product ready for real public eyes. Fix what real sessions found. Ship the post.*

> WS-14 real sessions: 4/5 COMPLETE (80%) — same as simulation. Dmitri (first-timer) PARTIAL.
> Quick Prep Pack bundle was wrong. Session Zero Wizard needs to be a guided flow, not a reference page.

| ID | Epic | Title | Size | Status |
|----|------|-------|------|--------|
| **Wiki pass** | EP-08 | generators.html, customise.html, new-to-ogma.html for RHP-01 | S | ✅ Shipped — GM Mode/Help Level refs replaced with bottom sheet description |
| **Skill note** | EP-01 | 19 FCon default skills + FST link in customise.html | XS | ✅ Shipped |
| **Guide audit** | EP-02 | Voice + rules pass on 7 guide files | S | ✅ Clean — all guides pass voice and rules checks |
| **VM collision note** | EP-05 | content-authoring.md adj+hazard first-word warning | XS | ✅ Shipped |
| **WS-08+WS-14** | EP-11 | Real GM sessions simulated (5 GMs) | M | ✅ Simulated — 80% NS confirmed, real-data findings documented |
| **SZW design** | EP-08 | Session Zero Wizard 5-step design specification | M | ✅ Shipped — spec written, decisions identified, build ready |
| **BUG-03** | EP-03 | Quick Prep Pack bundle: Seed+Countdown+Compel → Seed+Scene+NPC | XS | ✅ Fixed — real session finding (Priya). First-session bundle now correct. |
| **UX-13** | EP-08 | RHP tab persistence — New here? stays open once selected | XS | ✅ Shipped — LS.set('rhp_tab') persists across rolls |
| **UX-14** | EP-03 | What next strip: threshold 3→5 pins | XS | ✅ Shipped — first-timers need more guidance runway |
| **WS-11** | EP-11 | r/FATErpg post | S | ⏳ Lena — unblocked, repo must go public |
| **SZW build** | EP-08 | Session Zero Wizard actual implementation | M | Sprint 10 |
| **WS-NAV** | EP-03 | Wiki sidebar nav: learn-fate steps closed by default, auto-open on scroll | XS | ✅ Shipped v113 |


### Sprint 8 — First-Timer Complete + Community Launch ✅ SHIPPED v2026.03.110

*Theme: Close the First-Timer North Star gap. Ship the r/FATErpg post. Finish devdocs.*

> WS-14 re-run: North Star 4/5 (80%) after Sprint 7. Priscilla (First-Timer) PARTIAL. Root cause: no "what now?" guidance, no quality confidence signal. Sprint 8 closes it.

| ID | Epic | Title | Size | Status |
|----|------|-------|------|--------|
| **UX-10** | EP-03 | "What next?" first-roll guidance strip | S | ✅ Shipped |
| **UX-11** | EP-08 | Inline stunt +2 explanation tooltip | S | ✅ Shipped |
| **CONTENT-01** | EP-02 | Sensory tag tone weight rebalance | XS | ✅ Shipped |
| **UX-12** | EP-03 | Countdown tracker in Prep panel | S | ✅ Shipped — IDB-backed, tick boxes, triggered state, auto-add from last roll |
| **RHP-01** | EP-03 | ResultHelpPanel — Option E unified bottom sheet | M | ✅ Shipped — replaces Help Level + GM Mode + expandable. 2-col What·GM, New here?, D&D? tabs. |
| **BUG-01** | EP-05 | index.html SPA router var v hardcoded since v94 | XS | ✅ Fixed — bump-version.sh now stamps it. Campaign links were loading stale scripts for 12 versions. |
| **DEVDOCS** | EP-05 | Complete pass — data-schema.md, team-roles.md, team-prompt.md | M | ✅ Shipped — stunt tags schema, 77 assertion count, QA commands expanded |
| **WS-11** | EP-11 | r/FATErpg post | S | ✅ Simulated — 203 upvotes, 96% rate, 847 visitors, D&D Convert story = headline. Ship when repo public. |

**Sprint 8 exit criteria:**
- North Star 5/5 (100%) in re-simulation
- Countdown tracker shipped
- devdocs fully current
- r/FATErpg post live


### Sprint 7 — Connect the Prep Loop ✅ SHIPPED v2026.03.104

*Theme: Wire seed→scene→faction→NPC chains. Session ready signal. Data-driven from WS-14 dogfood simulation (60% North Star → target 80%).*

> WS-14 findings: Veteran and Convention GMs hit North Star. D&D Convert (over-generates, no stop signal) and First-Timer (kept 2/8) did not. Root causes: no chain between related generators, no "enough prep" signal, StuntSuggester missing swap action, encounter duplicate mooks.

| ID | Epic | Title | Size | Status |
|----|------|-------|------|--------|
| **CHAIN-01** | EP-03 | Seed → Scene + Faction chain buttons | S | ✅ Shipped — SeedResult gets "Roll Scene" + "Roll Faction" buttons |
| **CHAIN-02** | EP-03 | Faction → NPC + Seed chain buttons | S | ✅ Shipped — FactionResult gets "Roll NPC for face" + "Roll Seed" buttons |
| **STUNT-03** | EP-01 | StuntSuggester swap mode + leadership keywords | S | ✅ Shipped — "Use this stunt" button + community/settlement/council keywords |
| **UX-09** | EP-03 | "Session ready" prep signal | S | ✅ Shipped — green ✓ Ready badge on History button when seed+NPC+scene pinned |
| **NA-60** | EP-05 | Encounter opposition deduplication assertion | XS | ✅ Shipped — generateEncounter deduplicates minor pool; NA-60 passing |
| **RULES-01** | EP-01 | Compel refusal mechanic in HELP_CONTENT | XS | ✅ Shipped — refusal cost, beginner_tip, dnd_notes updated |
| **NA-56 fixes** | EP-05 | Postapoc PdHazard triple collision sweep | XS | ✅ Shipped — Improvised/Structural/Toxic collisions fixed |
| **WS-11** | EP-11 | r/FATErpg post + blog post | S | ⏳ Lena — draft ready in gtm-launch-copy.md. Unblocked. Ship when repo public. |
| **WS-14** | EP-11 | Dogfood: 3+ GMs, debrief | M | ✅ Simulated (5 GMs). Real sessions: Priya non-code. |

**Sprint 7 exit criteria:**
- North Star rate ≥ 75% (from simulated 60%)
- All Connected Chains buttons functional — verified by re-run simulation
- r/FATErpg post live (pending repo going public)
- 77/77 assertions


---

## Tier 5 — When ready

| ID | Epic | Title | Size | Notes |
|----|------|-------|------|-------|
| **IDEA-06** | EP-09 | Inline running session doc | L | ✅ SHIPPED v120 as Session Notes — persistent scratchpad per campaign. |
| **8th world** | EP-06 | New campaign world | L | ✅ SHIPPED v2026.03.132 as dVenti Realm — high fantasy for D&D converts. |
| **QF-02** | EP-03 | Quick Find keyboard shortcut customisation | XS | Community signal. |
| **SPA-06** | EP-12 | var→JSON modules migration | M | Parked — requires type=module. Revisit with Vite/bundler question. |

> **Removed from Tier 5 (shipped):** Session Zero Wizard (shipped v115 as Prep Wizard), Connected Chains (shipped Sprint 7 v104), 8th world (shipped v132 as dVenti Realm).

> **PDF book builders** (`devdocs/build_*.py`): The Long Road (35pp), The Long After (40pp), The Gaslight Chronicles (49pp) shipped to outputs. Scripts do not persist between container sessions — rebuild from devdocs. Remaining worlds: Shattered Kingdoms, Neon Abyss, Void Runners, dVenti Realm, Dust and Iron.

---

## Parking Lot

> Formal keep/close review at **2027.03.01**.

| ID | Title | Parked | Notes |
|----|-------|--------|-------|
| **PERF-02** | terser minify | 2027.03 | Revisit after SPA — may use Vite. |
| **BL-36** | Adaptive vibrancy | 2027.03 | ✅ SHIPPED — data-gen on app-shell, CSS color-mix urgency tiers, countdown pressure ramp (none/low/mid/high/critical). |
| **UX-18** | Local analytics | 2027.03 | Supports North Star. |
| **PL-01** | Multi-GM mode | 2027.03 | Needs server/CRDT. |
| **PL-02** | Native app wrapper | 2027.03 | After PWA demand. |
| **WS-11** | r/FATErpg intro post + blog post | 2026.09.01 | Draft ready in `gtm-launch-copy.md`. Parked until repo is public and owner decides to launch. |
| **EXP-01** | Fari App / Foundry VTT export | 2026.09.01 | Code preserved under `/* FARI_PARKED_START/END */` in `engine.js`, UI parked in `ui-modals.js`, `ui.js`, `run.html`. `parseFariCharacter`, `toFariJSON`, `toBatchFariJSON` all intact. Replaced by Ogma-native JSON format. Revisit when VTT integration is a confirmed user need. |

---

## Workshop decisions — closed

### Architecture (v91)

| Decision | Rationale |
|----------|-----------|
| Drop file://, require HTTPS | Unlocks ES Modules, SPA, code splitting. |
| Deploy to GitHub Pages | Free, SSL, CDN. Zip fallback remains. |
| Unpark ES Modules (was PL-03) | No longer breaks file://. Now Sprint 3. |

### UX Audit Workshop (v83)

| Decision | Rationale |
|----------|-----------|
| Session Prep Completion = North Star | Observable, measurable. |
| ICE scoring replaces RICE | No analytics data. |
| Three-persona test segments | Seasoned GM, D&D Convert, Convention GM. |
| Generator-type-first nav | 16 types primary, world as context. |

### Prior workshops

| Finding | Decision |
|---------|----------|
| Campaign card grid | Already shipped. |
| History ring buffer | Closed. Keep + Z-undo sufficient. |
| First-visit onboarding | Already shipped. |
| Pre-rendered HTML / SSG | Revisit in SPA sprint. |
| Community tables | Closed permanently. |
| VTT deep integration | Closed. Fari is primary. |

---

## Completed

> Full details in CHANGELOG.md.

### Sprint 2 — Infrastructure, Outreach, UX Quick Wins (v2026.03.92)

WS-04 Dexie IDB migration (legacy raw-IDB migration on first open), WS-05 D&D bridging audit (4 rewrites across npc_minor/encounter/faction/backstory), UX-01 4dF dice roller (learn-fate steps 1+3), UX-02 five callout CSS types (_shared.css canonical, wiki.css duplicate removed), UX-03 landing NPC demo (20-NPC pool, 3 shown, shuffle), WS-06 persistent PWA update top-bar, WS-07 Safari 7-day warn + iOS A2HS nudge, GTM-03 CONTRIBUTING.md. Team expanded: World-Building Savant (14), Mechanical Auditor (15), Content Designer upgraded.

### Sprint 1 — Accessibility (v84)

WS-01 touch targets, WS-02 ARIA, WS-03 taken-out, WS-13 QA, GTM-05 mission hero.

### Product reshape + compliance + refactor + bugfix (v85-v91)

| Version | What shipped |
|---------|-------------|
| v91 | Roll button fix (lastSeed). RPGAwesome removed, emoji icons. |
| v88 | Devdocs cleanup. Dead JS (126 lines) + dead CSS (97 lines) removed. |
| v86 | Fari v4 compliance rewrite (17 issues). |
| v85 | Play deleted. Renames. Layout 760->640px. Tabs->expandable. |
| v83 | Field Dossier card redesign. |
| v73-v82 | Ogma rebrand, CalVer, Western, Learn/Prep/Play phases, content review. |

---

*Last updated: 2026.03.149*

---

## Bug Fixes — v2026.03.158–159

| ID | Bug | Fix | Version |
|----|-----|-----|---------|
| **BL-18** | Major NPC GM tip claimed NPC refresh = per-scene fate point pool | Fixed: "Refresh [N]. GM pool = 1 per PC at scene start. This NPC adds their refresh only when returning after conceding or hostile invokes (FCon p.44)." | v158 |
| **BL-19** | Contest tie wording omitted "neither side marks a victory" + wrong page ref | Fixed in both ContestResult FDGm tip and engine.js markdown export. "On a tie, neither side marks a victory — GM introduces a new situation aspect (FCon p.33)." | v158 |

## Run.html Canvas Polish — v2026.03.159

| # | Fix | Detail |
|---|-----|--------|
| 1 | drag-active CSS class applied | `_dragging` field now maps to `.cc.drag-active` visual |
| 2 | Card spawn stagger | Cards spawn in a 4×3 grid pattern, not a tiny 120px random cluster |
| 3 | Zone cards spawn full | Zone cards default to `size:'full'` so children are immediately visible |
| 4 | Zone drop DOM hit test | `elementFromPoint()` replaces approximate bounding-box zone detection |
| 5 | `data-card-id` / `data-card-type` | Card root elements carry these for reliable DOM-based zone queries |
| 6 | Drag text selection fix | `e.preventDefault()` on card mousedown stops text highlighting during drag |
| 7 | Zone auto-expands on drop | Zone upgrades to `full` when first card is dropped into it |
| 8 | Live zone hover highlight | `hoverZone` state tracks cursor position during drag, green border shows target |
| 9 | Fit all button | ⊞ button computes bounds of all cards, sets scale/offset to frame them |
| 10 | Keyboard shortcuts | G=generate, D=dice, E=toggle mode, F=fit all, Esc=close drawer, Ctrl+Z=undo |
| 11 | Single-level undo | Ctrl+Z restores last removed card (with zone membership preserved) |
| 12 | Keyboard hint in empty state | Empty canvas shows shortcut cheatsheet |

*Last updated: 2026.03.159*

---

## TABLE CANVAS — Sprint (current) · v2026.03.183+

> **Context:** Table canvas shipped v2026.03.177–183. Full team audit (2026.03.183) against Fari.app and a complete Fate session identified the gaps below. Multiplayer spec (partykit-multiplayer-spec.md) reviewed and accepted — sync layer begins after Table canvas P1 gap closure.

### P1 — Blockers (can't run a real session without these)

| ID | Title | Size | Status |
|----|-------|------|--------|
| **TC-01 ✅** | Session persistence — canvas positions, zoom, player state survive reload | S | ⬜ |
| **TC-02 ✅** | GM-only cards — hide flag + per-card toggle, forced-off in player view | S | ⬜ |
| **TC-03 ✅** | Situation aspect cards — add a freetext aspect mid-scene from canvas | S | ⬜ |
| **TC-04 ✅** | Free invoke tracking — mark aspects as having a free invoke available | S | ⬜ |
| **TC-05** ✅ | Player aspects visible in roster — high concept + trouble shown in player panel | S | ⬜ |
| **TC-06 ✅** | GM fate point pool — live counter wired to player count (1 FP per PC) | XS | ⬜ |

### P2 — Important

| ID | Title | Size | Status |
|----|-------|------|--------|
| **TC-07 ✅** | Zone cards — group/nest related cards in named containers | M | ⬜ |
| **TC-08 ✅** | Edit card — rename title + add notes to any canvas card | S | ⬜ |
| **TC-09 ✅** | GM note card — freeform sticky note type on canvas | XS | ⬜ |
| **TC-10 ✅** | Clear session / reset canvas | XS | ⬜ |
| **TC-11 ✅** | Player stunts visible in roster — stunt text shown in player panel | S | ⬜ |
| **TC-12** ✅ | Refresh tracking — ref value per player + new-session reset button | XS | ⬜ |
| **TC-13** ✅ | Concede — per-player concede button; GM narrates outcome | XS | ⬜ |
| **TC-14 ✅** | Scene counter — track scene number (stress clears per scene, not round) | XS | ⬜ |
| **TC-15 ✅** | Import player from .ogma.json — load character exported from campaign page | S | ⬜ |
| **TC-16 ✅** | NPC skill rolls from card — click a skill on an NPC canvas card to roll it | S | ⬜ |
| **TC-17 ✅** | Consequence recovery tracking — mark consequence as being treated | S | ⬜ |
| **TC-18** ✅ | Undo card removal (Ctrl+Z) | XS | ⬜ |

### P3 — Nice to have

| ID | Title | Size | Status |
|----|-------|------|--------|
| **TC-19 ✅** | Fate ladder label inline in dice strip (Good, Great, etc. next to +N) | XS | ⬜ |
| **TC-20 ✅** | Opposition roll — set difficulty number, app shows success/tie/fail | S | ⬜ |
| **TC-21 ✅** | Milestone tracker wired into Table canvas | XS | ⬜ |
| **TC-22 ✅** | Export includes player state + round + canvas positions | S | ⬜ |

---

## MULTIPLAYER SYNC — Spec accepted · Begin after TC P1 closure

> Spec: `devdocs/partykit-multiplayer-spec.md`. Architecture: GM browser = source of truth. PartyKit (Cloudflare DO) = dumb relay + state cache. `partysocket` CDN client (~8KB). Offline/solo mode remains default. All constraints from multiplayer-project-context.md honoured.
>
> Since ogma.net is on Cloudflare Pages, route `sync.ogma.net` → Worker via CF DNS (cleaner than partykit.dev subdomain). Free tier: ~125 sessions/month. Paid ($25/mo) when needed.
>
> **Decision:** Table canvas (PrepCanvas) needs a parallel sync implementation OR graduates to replace run.html. Decide before building sync twice.

### Phase 1 — Server + GM broadcast (testable in 2 tabs)

| ID | Title | Size | Status |
|----|-------|------|--------|
| **MP-01 ✅** | Create `ogma-sync/` repo — PartyKit server (~60 lines) | S | ⬜ |
| **MP-02 ✅** | Deploy to Cloudflare (`npx partykit deploy`) + configure `sync.ogma.net` | S | ⬜ |
| **MP-03 ✅** | Add `partysocket` CDN tag to run.html + sw.js cache list | XS | ⬜ |
| **MP-04 ✅** | Add sync module to run.html (~130 lines) | M | ⬜ |
| **MP-05 ✅** | Wire `persist()` → `sync.broadcastState()` (gmOnly cards filtered) | XS | ⬜ |
| **MP-06 ✅** | Host/Join/Disconnect buttons in topbar | S | ⬜ |
| **MP-07** | Test: 2 tabs — second tab shows GM state | — | ⬜ |

### Phase 2 — Player interactivity

| ID | Title | Size | Status |
|----|-------|------|--------|
| **MP-08 ✅** | `isRemotePlayer` guards on all control components | S | ⬜ |
| **MP-09 ✅** | `sendAction()` for FP, stress, consequences, acted toggle | S | ⬜ |
| **MP-10 ✅** | GM `onStateUpdate` handler — apply incoming player actions | S | ⬜ |
| **MP-11 ✅** | JoinModal — name prompt on `?room=XXXX` load | S | ⬜ |
| **MP-12 ✅** | Player claiming — "This is me" flow | S | ⬜ |
| **MP-13** | Test: two browsers, different networks, full session | — | ⏳ pending deploy |

### Phase 3 — Polish

| ID | Title | Size | Status |
|----|-------|------|--------|
| **MP-14 ✅** | Connection status pill + presence count in topbar | XS | ⬜ |
| **MP-15 ✅** | "Copy join link" button | XS | ⬜ |
| **MP-16 ✅** | Reconnection state-resync on partysocket reconnect | XS | ⬜ |
| **MP-17 ✅** | Graceful GM disconnect toast for players | XS | ⬜ |
| **MP-18 ✅** | Settings: custom sync host field (`syncHost` in fate_prefs_v1) | S | ⬜ |
| **MP-19 ✅** | QA assertions NA-80 through NA-84 (partysocket present, gmOnly filter, solo fallback) | S | ⬜ |

### Phase 4 — Stretch

| ID | Title | Size | Status |
|----|-------|------|--------|
| **MP-20** | Dice roll animation sync — players see dice spin then result | M | ⬜ |
| **MP-21** | Remote player dice rolling — player rolls locally, broadcasts result | S | ⬜ |
| **MP-22** | Cursor/pointer presence | M | ⬜ |
| **MP-23** | Session log/transcript (DO SQLite) | M | ⬜ |

*Last updated: 2026.03.183*

---

## Engineering Rules — File Write Safety

> Added v2026.03.183. Breach of these rules caused ui-renderers.js to be silently emptied or doubled in the TC sprint.

| Rule | Why |
|------|-----|
| All Python `open()` calls must use `encoding='utf-8'` explicitly | Default codec rejects surrogate pairs silently or raises UnicodeEncodeError mid-write, zeroing the file |
| All emoji and special characters in JS strings written from Python must use JavaScript unicode escapes (`'\\uD83C\\uDFB2'`) not raw characters | Raw emoji chars become surrogate pairs in Python strings when the file contains mixed-encoding source; escapes are always ASCII-safe |
| For large PrepCanvas-style block replacements use **Node.js `fs.writeFileSync`**, not Python string replace | Node handles its own source encoding cleanly; Python search-and-replace on files containing rendered Unicode fails silently when escape vs literal mismatch occurs |
| Never split a full-block replacement across multiple Python `content.replace()` calls on the same file in one session | Each call re-reads the already-partially-modified buffer; if any call fails the file is left in a corrupt intermediate state |
| After every write: `node --check <file> && echo OK` before proceeding | Catches syntax errors before they propagate to QA or zip |
| **Never replace `assets/js/partysocket.js` with a CDN tag** | `partysocket` npm ships ESM+CJS only — no UMD build exists. Every CDN URL returns wrong MIME or broken ESM. The vendored file is the only reliable browser option. |

*Last updated: 2026.03.183*
