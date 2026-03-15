# Ogma Changelog

> Reverse-chronological. Each entry covers one released version. For full backlog context see `BACKLOG.md`.

---

## 2026.03.26 - Rules rework + action bar

**KB Shortcuts modal, Rules modal cleaned, unified action bar**

### Item 1 - Rules button fixed
- Toolbar Rules button was calling undefined `showPanel()` function (openPanel refactor was never fully applied to this backup) - fixed to `setShowHelp(true)`

### Item 2 - KB Shortcuts sidebar entry
- `KBShortcutsModal` component added: small modal with all 6 keyboard shortcuts
- Sidebar now shows "KB Shortcuts" (ra-keyboard icon) instead of "Rules"
- `?` key opens KB Shortcuts modal (was opening Rules)
- `showKbShortcuts` state added

### Item 3 - Rules modal cleaned
- Quick Reference grid (all 16 generators) removed from Rules modal
- Keyboard Shortcuts section removed from Rules modal
- Rules modal now contains only: What this generates, Output structure, Rules reference (Fate Condensed), Invoke/Compel examples, GM Tip, D&D callout

### Item 4 - Unified action bar (spike implemented)
- `roll-hero` section (floating above result panel) replaced
- `panel-toolbar` replaced
- New `.action-bar`: Roll + Inspire + contextual (severity/party) + secondary (Rules/Share/Pin)
- Roll stays accent-coloured pill; Inspire now clearly labelled with crystal-ball icon + Inspire text
- Secondary actions (Rules, Share, Pin) use RPG Awesome icons only, pushed right
- Mobile: Roll fills row, rest wraps below
- FAB still appears when action-bar scrolls off-screen (ref moved to action-bar)

---

## 2026.03.25 - Tier 1 cleanup (BL-52, BL-53)

**Sidebar icon sizing, dead CSS removal**

- **BL-52**: `sidebar-item-icon` font-size raised from 13px to 16px - RPG Awesome glyphs at 13px were clipping; 16px renders cleanly at all sidebar sizes
- **BL-53**: 10 tombstoned dead CSS classes removed from `theme.css`: `.camp-card`, `.camp-hero`, `.camp-hero-genre`, `.camp-hero-name`, `.camp-hero-vibes`, `.camp-name`, `.consequence-table`, `.hist-badge`, `.hist-badge-btn`, `.land-camp-list`. Tombstoned in 2026.03.17, confirmed unused.

---

## 2026.03.24 - OGMA brand + license sweep

**OGMA acronym applied to all static pages; license links confirmed everywhere**

### OGMA brand
- All 9 static HTML pages (`about.html`, `learn.html`, `license.html`, `campaigns/transition.html`, all 6 guide pages) updated: hardcoded `🎲 Ogma` replaced with `<span class="topbar-ogma"><strong>O</strong>n-demand...` markup
- `campaigns/sessionzero.html` inline React topnav: `'🎲 Ogma'` → `topbar-ogma` span component
- All 6 campaign React pages already rendered OGMA brand via `core/ui.js` at runtime (correct)

### License links
- All 6 campaign React pages (`thelongafter`, `cyberpunk`, `fantasy`, `space`, `victorian`, `postapoc`): `license.html` link added to `<noscript>` fallback — visible without JavaScript
- `about.html` footer: dead link to deleted `CONTRIBUTING.md` removed; replaced with "License & Attribution" link

### Root cause documented
- `team-memory.md` updated: static HTML pages require direct markup changes — `core/ui.js` changes only affect React-rendered pages
- CHANGELOG sprint entries were previously going to root stub `CHANGELOG.md` instead of `devdocs/CHANGELOG.md` — confirmed fixed

---

## 2026.03.23 - Bug fix sprint (continuation of .22)

**Syntax fix, missing features from .bak restore, full re-verification**

- Restored `.bak` file (from sprint .17) overwrote sprints .18–.22 from `core/ui.js`; re-applied all missing changes
- License footer (`camp-content-footer`) placement fixed: was incorrectly placed as sibling to `content-panel` in `app-body` flex row (renders as third column); moved to last child inside `content-panel`
- Syntax error fixed: extra `)` in `CampaignApp` return statement after footer insertion
- Re-applied all .20/.21/.22 ui.js features: SRD per-row links, Rules button, Quick Reference simplified, sidebar-legal links, landing gen sub text, dnd_notes D&D callout, inline rules clean render
- OGMA landing topnav confirmed (was only in CampaignApp; re-verified on LandingApp too)
- NPC SRD URLs confirmed pointing to `being-game-master` (were already fixed in .bak)

---

## 2026.03.22 - Polish sprint + .x2 devdocs review

**Versioning rule, topbar rebrand, dnd_convert restored, devdocs refresh**

- Versioning rule added to `devdocs/team-memory.md`: when patch ends in `.2`, review all devdocs before shipping
- Topbar brand: "🎲 Ogma" replaced with full OGMA acronym in `var(--accent)` — **O**n-demand **G**enerator for **M**asterful **A**dventures; bold initials 15px, body 13px, inherits campaign accent color
- `dnd_notes` field added to all 16 generators in `data/shared.js` GM_DATA block; `dnd_convert` help level now shows a blue "Vs. D&D / Pathfinder" callout per generator
- All four help levels now cleanly differentiated: `experienced` (minimal), `new_fate`/`dnd_convert`/`new_ttrpg` (full, with level-specific additions)
- `.x2 devdocs review`: fixed stale 18/18 assertion counts, bump-version.sh paths, CONTRIBUTING.md refs in `virtualteamroles.md`, `architecture.md`, `data-schema.md`, `BACKLOG.md`, `prompts.md`, `team-memory.md`

---

## 2026.03.21 - Inline help, license links, theme, Rules rename

**Theme flash fix, license audit, help content tone, landing sub text, Rules panel**

- Theme restore script moved to top of `<head>` in all 6 campaign React pages (was after CSS link, causing flash on navigation)
- License & Attribution link audit: every page now has a visible link. Added `camp-content-footer` to campaign content panel (always visible on mobile); `sidebar-legal` now links to `license.html`
- Help content tone pass: 13 `D&D contrast:` items removed from all rules arrays (lecture content, wrong for mid-session GM). 54 rewrites across rules bullets, tips, `gm_tips`, `gm_running` — "here is how this works" → "do this now"
- Landing generator items: `sub` field (e.g. `1–2 aspects · skills · stress`) now renders below each generator name in the "16 generators" section
- `?` toolbar button renamed to `Rules` with RPG Awesome icon; sidebar `Rules` item removed; Quick Reference heading simplified to "Quick Reference"
- HelpModal title changed from "Help - Minor NPC" to "Rules - Minor NPC"
- Inline help-level `dnd_convert` note: removed stale "D&D differences highlighted" label (those items were removed)

---

## 2026.03.20 - SRD inline links

**Option A: trailing SRD ↗ icon per rules row in HelpModal**

- Per-row `SRD ↗` link added to all rules bullets in HelpModal rules section
- Link is `var(--accent)` at 55% opacity, fades to full on hover; `white-space: nowrap`; `title="Read on fate-srd.com"`
- Removed the now-redundant `📖 Read the SRD rule →` block at the bottom of the modal
- 3 generators without sub-anchors (`/conflicts`, `/getting-started`, `/fate-system-toolkit/factions`) link to their section page — this is the maximum granularity the SRD provides
- `help-rule-row` CSS updated: `justify-content: space-between`; `help-rule-text` gets `flex: 1`; new `.help-rule-srd` class

---

## 2026.03.19 - Various fixes

**Branding, license links, section rename, devdocs moves**

- "Fate Condensed Campaign Generator" replaced with "Ogma - On-demand Generator for Masterful Adventures" in 19 `toMarkdown()` footer strings (`core/engine.js`) and `sw.js` comment
- `learn.html`: "Just Show Me Fate's Core" renamed to "What Makes Fate Different" to avoid confusion with the Fate Core product name
- `campaigns/sessionzero.html`: footer with License & Attribution link added
- `BACKLOG.md`, `CHANGELOG.md`, `bump-version.sh` moved to `devdocs/`; root stubs forward transparently
- `CONTRIBUTING.md` deleted; unique content migrated to `devdocs/content-authoring.md`
- `devdocs/prompts.md`: hard-coded version numbers and backlog state replaced with file references
- `devdocs/team-memory.md` created: living project memory for AI session bootstrapping
- `devdocs/content-authoring.md` created: practical step-by-step content authoring guide
- `devdocs/README.md`: updated reading order and document index

---


## 2026.03.18 - Housekeeping Sprint

**Branding fixes, devdocs restructure, team-memory, CONTRIBUTING.md retirement**

### Branding
- "Fate Condensed Campaign Generator" replaced by "Ogma - On-demand Generator for Masterful Adventures" in 19 toMarkdown footer strings (engine.js) and sw.js comment
- learn.html section "Just Show Me Fate's Core" renamed to "What Makes Fate Different" to avoid confusion with the Fate Core product name

### License links
- `campaigns/sessionzero.html`: footer with License & Attribution + About Ogma links added (it was the only page missing one)

### devdocs restructure
- `BACKLOG.md`, `CHANGELOG.md`, `bump-version.sh` moved to `devdocs/`
- Root stubs remain as thin forwarders so existing habits don't break
- `devdocs/bump-version.sh` ROOT path corrected to `../` (was pointing at devdocs/ itself)

### CONTRIBUTING.md retired
- Unique content (table authoring how-to, new campaign step-by-step, content QA checklist) migrated to `devdocs/content-authoring.md`
- File deleted from project root - project is not soliciting external contributions

### New devdocs files
- `devdocs/content-authoring.md`: practical content authoring guide with new campaign step-by-step
- `devdocs/team-memory.md`: living project memory - current state, architectural decisions, open items, file locations. Update at sprint end. Split to archive if >300 lines.

### devdocs improvements
- `devdocs/prompts.md`: hard-coded version numbers and backlog state replaced with references to live files (`devdocs/BACKLOG.md`, `qa_named.js`)
- `devdocs/README.md`: updated reading order, new files indexed, project state section now references BACKLOG.md rather than hard-coding

---

## 2026.03.17 - Engineering Sprint

**CSS decoupling, ModalHeader extraction, paint performance, openPanel state consolidation**

### Task 1 - CSS Decoupling
Five new utility classes extracted from repeated inline style objects:
- `.btn-sm` - compact button sizing (5x in ShareDrawer)
- `.label-muted` - muted label text (3x)
- `.tag-pill` - inline pill badge (3x)
- `.nav-link-fill` - sidebar nav link fill (3x)
- `.fade-up` - animation helper; replaced 4 inline `style:{animation:'fadeUp 0.3s ease both'}` objects

### Task 2 - Component Refactoring
- `ModalHeader(title, onClose)` helper extracted; all 4 modal headers now use single source of truth
- Removed ~36 lines of duplicated modal header markup

### Task 3 - Paint Performance
- `will-change: transform` corrected to `will-change: filter` on `.topbar` and `.sidebar` (transform is wrong for backdrop-filter; filter is correct)
- `will-change: filter` added to `.modal-overlay` (third element worth pre-promoting)
- Mobile blur reduction: `@media (max-width: 600px)` overrides to `blur(16px)` on sticky glass elements; visually imperceptible at phone size, meaningfully cheaper to composite
- Body orb animations disabled on mobile via `@media (max-width: 600px)` - invisible at phone size, consumed paint budget
- Dead CSS classes tombstoned with review date 2026.09.01

### Task 4 - Naming
CSS already BEM-flavored; JS already CamelCase. No retroactive rename needed.

### Task 5 - State Management
- 5 separate boolean panel states (`showHelp`, `showFP`, `showHistory`, `showSettings`, `showTables`) consolidated into single `openPanel` state (`null | 'help' | 'fp' | 'history' | 'settings' | 'tables'`)
- Each panel open previously triggered 2 state updates (setShow* + setShowSidebar) = 2 re-renders; now 1 (setOpenPanel which calls setShowSidebar internally)
- Mutual-exclusion constraint (only one panel open at a time) now structurally enforced - impossible to have two panels open simultaneously
- Keyboard handler dependency array reduced from 7 deps to 3; fewer unnecessary re-subscriptions
- Derived booleans (`showHelp = openPanel === 'help'`) are zero-cost comparisons, not state slots

---

## 2026.03.16 - Current

**Em-dash cleanup, RPG Awesome icons, OGMA identity, BL-12 through BL-48**

- All 2,634 em-dashes (—) replaced with hyphen-minus (-) site-wide for consistent rendering
- RPG Awesome icon font added to all pages via CDN (`unpkg.com/rpg-awesome@0.2.0`)
- `RA_ICONS` map + `RaIcon()` helper added to `core/ui.js`; all sidebar generator icons, GM Mode, FP Tracker, History, Customize, Settings, Theme, Help section, landing onboarding cards, and generator group headers now use RPG Awesome glyphs
- RPG Awesome attribution added to `license.html` (MIT License)
- **BL-12**: OG/Twitter meta URLs updated to `https://brs165.github.io/ogma-fate` across all 21 instances; `bump-version.sh` now defaults to `brs165/ogma-fate` on every run
- **BL-46**: `bump-version.sh` now auto-updates the `about.html` download link filename on every bump
- OGMA tagline bolded: `**O**n-demand **G**enerator for **M**asterful **A**dventures` in `about.html` body, React hero eyebrow, and React footer tagline
- **BL-42**: Popcorn Initiative tracker now persists participants to `sessionStorage` - survives FP panel close/open within a session
- **BL-39**: HelpModal Quick Reference cards now show `+ Invoke` and `+ Compel` tooltip pills (hover to preview the worked example from BL-07); generator icons use RaIcon
- **BL-40**: Encounter `gm_running` now includes a concrete Popcorn Initiative exchange walkthrough (Kira acts, passes to netrunner, netrunner passes to guard)
- **BL-44**: All six campaign guide pages now have a glass-styled nav footer with "All Worlds" and "Open [Campaign] Generator" links; no more dead-ends
- **BL-45**: `qa_named.js` NA-09 assertions verify intro responsive scaling: `fate-intro-content` class, 900px breakpoint, 1400px breakpoint, em-based title sizing
- **BL-47**: Inspire Mode (`✦ 3`) wired to `I` keyboard shortcut; added to keyboard shortcuts legend in HelpModal; `aria-keyshortcuts="I"` on button; tooltip updated with `[I]` hint
- **BL-48**: Session Zero advancement card corrected: "Milestone" -> "Minor Milestone"; "Everything from a milestone" -> "Everything from a minor milestone"

---

## 2026.03.15 - Content Sprint

**Hero redesign, nav relabels, static page rewrites, breakthrough eradication**

- Hero eyebrow changed to "On-demand Generator for Masterful Adventures" tagline
- Hero value prop: "Rules-accurate Fate Condensed NPCs, scenes, and encounters - generated in one click, ready for the table." (11 words)
- Generator section heading: "16 generators. Every result rules-ready."
- `📖 Learn` -> `📖 Quick Start` across all 12 pages and both React nav surfaces
- `learn.html` retitled "Quick-Start Guide"; lead copy rewritten
- `about.html`: doubled title fixed; OGMA tagline intro; "AI-Assisted Development" -> "How Ogma Is Built"; stale v36 download link fixed; QA stats updated to 19,200 runs / 19 assertions; "0 AI Required" -> "19,200 QA Runs"
- `about.html` Rules Expert prompt: "breakthroughs" -> correct FCon terminology
- `license.html`: human-readable intro added; redundant section removed; title fixed
- Footer: OGMA tagline; "About & contribute" split into "About Ogma" + "Contribute"; "Session Zero" -> "Session Zero Wizard" on landing
- **BL-41** (complete): learn.html "clears at breakthrough" -> "clears after a major milestone"; HelpPanel Advancement card; sessionzero.html x3; transition.html; engine.js toMarkdown; shared.js advancement HELP_CONTENT
- `devdocs/liquid-glass-static-pages.md` added
- Intro overlay responsive scaling: 640px -> 860px at 900px viewport, 1000px at 1400px; 14px -> 17px/19px font; title/sub sizes in em for proportional scaling

---

## 2026.03.13 - Mega Sprint (Tier 1 + BL-38)

**GM Tips depth, batch export, FP panel upgrade, PWA nudge, aria audit**

- **BL-07**: invoke/compel worked examples for all 16 generators; wired as `+ Invoke` / `+ Compel` GM pills in result panel and full sections in HelpModal
- **BL-34**: fate-srd.com deep links on all 16 HELP_ENTRIES; "Read the SRD rule ->" in HelpModal
- **BL-26**: 224 -> 0 entries over 12 words across all 6 campaigns; 80% now <=10 words
- **BL-03**: Victorian: all 37 over-length troubles/weaknesses trimmed
- **BL-10**: Milestone & advancement tracker tab ("Milestones") in FP panel; Minor/Major checklists; session-only
- **BL-35**: Popcorn Initiative tracker tab ("Initiative") in FP panel; pulls opposition names from last Encounter result
- **BL-09**: PWA install nudge - captures `beforeinstallprompt`, shows on 2nd+ visit, dismiss persisted
- **BL-37**: aria-live audit - result-panel confirmed polite, 220ms post-animation, PWA nudge has role=status
- **BL-38**: `toBatchFariJSON()` in engine.js + "Export to Fari / Foundry" in History panel; NA-08 assertion added (19/19 total)

---

## 2026.03.12 - Text Pass

**Em-dash "No AI" cleanup + devdocs**

- All "No AI" language removed from `manifest.json`, `index.html` (3 meta tags), `README.md` (x2), `core/ui.js`
- `devdocs/` folder created with: `README.md`, `prompts.md`, `virtualteamroles.md`, `data-schema.md`, `architecture.md`

---

## 2026.03.11 - VTT Export

**Fari/Foundry + Roll20 export (BL-33a/b)**

- `toFariJSON()` - Fari App v4 character format; also accepted by Foundry VTT "Fate Core Official" importer; NPC generators only
- `toRoll20JSON()` - Roll20 "Fate by Evil Hat" Developer Mode attribute format; NPC generators only
- ShareDrawer: second button row (VTT Export) visible on NPC generators only; null guard for all others

---

## 2026.03.10 - Interactive Renderers

**UI-07: All 16 generators upgraded to stateful React components**

- StressBoxes: tappable, accent colour fill
- MajorResult: 3-tab navigation (Aspects/Skills/Stunts)
- SceneResult: pinnable aspects, free invoke indicator
- ContestResult: live victory tracks, winner banner, Reset button, colour shifts on win
- CountdownResult: colour shifts accent->purple->red, triggered state pulses
- ConsequenceResult: two-step recovery tracker (Treatment -> Cleared)
- CompelResult: Accept/Refuse buttons with FP flow
- ChallengeResult: clickable Success/Failure markers
- FactionResult: collapsible Named Face reveal
- ComplicationResult: spotlight selector
- BackstoryResult: collapsible questions with answer area
- ConstraintResult: bypass completion checkbox
- EncounterResult: tappable NPC stress + GM FP dot counter
- SeedResult: Opening/Complications/Climax scene stepper

---

## 2026.03.9 - Rules Fixes + Guide Links

**BL-27-31: campaign guide links, sidebar reorder, FCon fixes, glossary**

- Campaign Guide links on index cards and sidebar (BL-27)
- Sidebar reorder: Play Intro -> Campaign Guide -> Rules (BL-28)
- "breakthrough" -> "major milestone" throughout (BL-29) - partial; remaining instances fixed in later sprints
- Share/Export crash: `campName` undefined (BL-30)
- Glossary redesign: 2-column categorised `dl/dt/dd` (BL-31)

---

## 2026.03.8 - UX Round

**R-01 through R-15: accessibility, touch, contrast, mobile nav polish**

- Sidebar touch targets 44px min (R-01)
- `--text-muted` contrast fixed >=4.5:1 (R-02)
- Mobile static page hamburger + dropdown (R-03)
- Empty state with icon, label, sub, Space hint (R-05)
- Sidebar `<aside>` -> `<nav aria-label="...">` (R-06)
- Label consistency: "Compel" everywhere (R-07), "Customize Tables" everywhere (R-08)
- Share drawer CSS height transition (R-09)
- Toast top-center on mobile (R-10)
- "Continue ->" last-used campaign link on index (R-11)
- World card genre as accent pill badge (R-12)
- Sticky Roll FAB via IntersectionObserver - mobile only (R-13)
- Campaign accent contrast audit + light mode fixes (R-15)

---

## 2026.03.6-7 - UI Overhaul

**UI-01 through UI-06: Pattern G layout, topbar, sidebar, landing**

- Topbar: "Ogma - CampaignName [Genre]" only (UI-01)
- GM Mode: merged gmMode + playerView into single toggle (UI-02)
- Sidebar spec rewrite (UI-03)
- `camp-hero` removed (UI-04)
- LandingApp: immersive hero, world grid, onboarding paths (UI-05)
- Static page nav: all pages ported to `land-topnav` (UI-06)

---

## 2026.03.4-5 - Mobile + Tech Debt

**Pattern G mobile nav + 13-item tech debt sprint**

- Pattern G: sidebar + topbar + content panel (BL-15)
- Removed dead `MobileBottomSheet` component (TD-01)
- `showOverflow` -> `showSidebar` (TD-02)
- 24 dead CSS classes removed ~7.5KB (TD-03)
- `pick()` empty-array guard (TD-04)
- Named TIMING constants (TD-05)
- `db.js` retry on IDB error (TD-06)
- `fillTemplate()` empty string on missing tokens (TD-07)
- `mergeUniversal()` null-guard (TD-08)
- Escape key closes sidebar + all panels (TD-09/10)
- `focus-visible` ring on sidebar elements (TD-11)
- Print stylesheet updated for Pattern G (TD-12)
- Removed dead `SKIP_KEY_PREFIX` (TD-13)

---

## 2026.03.2-3 - Rebrand + localStorage

**Ogma rebrand + versioned localStorage schema**

- localStorage versioned schema (`fate_prefs_v1`) + migration shim (BL-01)
- Ogma rebrand: titles, nav, manifest, about.html, README (BL-16)

---

## 2026.03.1 - Foundation Sprint

**QA battery + 12 engine/data bug fixes**

- Major NPC `refresh` hardcoded to 3 (BL-18) - fixed: `Math.max(1, 3 - stunts.length)`
- Contest tie note said "twist aspect" (BL-19) - fixed
- Flash-Bang + Deductive Leap charged Fate Points (R-02) - fixed
- Chrome-Heavy Enforcer minor NPC stress was 4 (R-03) - fixed to 3
- "significant milestone" in universal.js (R-05) - fixed
- Postapoc faction table duplicates (QA-03) - fixed
- `core/intro.js` missing from SW APP_SHELL (E-01) - fixed
- Attribution: Randy Oest / Amazing Rando / fate-srd.com (BL-25)
- `bump-version.sh` CalVer rewrite (BL-17)
- Learn page prompts -> collapsed `<details>` (BL-13)
- QA battery: 7 named assertions NA-01 through NA-07 (BL-04)
- Help `?` always visible in panel toolbar (BL-21)
- Export + Print -> ShareDrawer; Pin stays separate (BL-22)

---

## Pre-2026.03 (v31-v35) - Original Builds

- v31: Table Manager, Solo-use callout, Print, Inspiration Mode, Fate Point Tracker
- v32: Campaign intro sequences (all 6 worlds), `core/intro.js` engine, about.html offline section
- v33-34: Watch Intro button, mobile nav audit
- v35: Data bug QA sprint (null zone aspects, Void Kraken stress)

---

*For planned work see `BACKLOG.md`. For team and architecture docs see `devdocs/`.*
