# Ogma — Claude Bootstrap

> **What this is:** The single file that reconstitutes the entire Ogma project for a new Claude session.
> Paste this file as your first message, or point Claude at it with "read devdocs/claude_bootstrap.md".
> Everything needed to start working is here. No other context required.
>
> **Last updated:** 2026.03.169
> **Update rule:** Update this file whenever a major capability ships, a constraint changes, a world is added, or QA numbers change. When the build number ends in `.2`, review ALL devdocs before shipping.

---

## The project in one paragraph

**Ogma** is a browser-based, fully offline progressive web app that generates ready-to-use Fate Condensed TTRPG content for Game Masters. It has four pillars: **Learn** (interactive Fate tutorials), **Prep** (16 generators × 8 campaign worlds = 128 combinations), **Run** (session surface with scene board, FP tracker, dice), and **Export** (Fari JSON, Markdown, print/PDF). No AI in the output. No backend. No build step. Offline after first load via service worker.

**Live:** https://brs165.github.io/ogma-fate  
**Repo:** github.com/brs165/ogma-fate  
**Working directory:** `/home/claude/fate-suite-new/`  
**Current version:** 2026.03.169  
**QA baseline:** 86/86 named assertions · 128/128 smoke (8 worlds × 16 generators)

---

## Architecture — non-negotiable constraints

- **HTTPS-first.** Requires web server for first load. `file://` dropped in v91. Use localhost or GitHub Pages.
- **React 18 via CDN UMD.** `React.createElement` aliased as `h`. No JSX, no bundler, no TypeScript.
- **No build step.** Raw `<script>` tags. The entire stack runs in Node for testing.
- **Offline after first load.** Service worker (sw.js) caches APP_SHELL. IDB (Dexie 4) for persistence. No cloud sync, ever.
- **GitHub deployment is blocked from the container** (egress restrictions). Workflow: build in container → download zip → push locally.
- **No AI in generated output.** The tables are hand-authored. This is intentional and permanent.

**Script load order (campaign pages — must not change without updating sw.js and all campaign HTML):**
```
shared.js → universal.js → [campaign].js → engine.js → db.js →
ui-primitives.js → ui-renderers.js → ui-modals.js → ui-landing.js → ui.js → intro.js
```

**`core/engine.js`** has zero React/DOM dependencies — stays testable in Node. Never import React into it.

---

## Key files

| File | Role |
|------|------|
| `data/shared.js` | GENERATORS, GENERATOR_GROUPS, HELP_CONTENT, SKILL_LABEL, TABLE_GROUPS, ALL_SKILLS, `CAMPAIGNS = {}` |
| `data/shared-lite.js` | 2.8KB landing bootstrap (96% JS reduction — campaign data loads on demand) |
| `data/universal.js` | Setting-agnostic tables merged at runtime via `mergeUniversal()` |
| `data/[world].js` | Campaign tables (8 files: thelongafter, cyberpunk, fantasy, space, victorian, postapoc, western, dVentiRealm) |
| `core/engine.js` | All generator logic: `generate()`, `pick()`, `fillTemplate()`, `mergeUniversal()`, `filteredTables()`, `toMarkdown()`, `toFariJSON()` |
| `core/ui-primitives.js` | React aliases (`h`, `useState`, `useEffect`, `useRef`, `useCallback`, `Fragment`), TIMING, RA_ICONS, theme/textsize helpers, all FD card primitives, `scoreAspect()` |
| `core/ui-renderers.js` | All 16 result renderer components + `renderResult()` dispatcher + `renderCard()` (MTG card view) + `StuntSuggester` |
| `core/ui-modals.js` | `Modal` primitive, `ShareDrawer`, `KBShortcutsModal`, `SettingsModal`, `VaultPanel`, `QuickFindBar`, `SessionDoc` |
| `core/ui-landing.js` | `CAMPAIGN_PAGES`, `CAMPAIGN_INFO`, `CAMPAIGN_GUIDE_PAGES` + `LandingApp` |
| `core/ui.js` | `TableManagerModal`, `MilestoneTracker`, `PopcornTracker`, `CountdownTracker`, `FatePointTracker`, `SessionPackPanel`, `ResultHelpPanel`, `CampaignApp` (main shell) |
| `core/db.js` | Dexie 4 IDB wrapper. `LS` (localStorage prefs), `DB` (IDB sessions + cards). Migration from legacy localStorage on first open. |
| `core/intro.js` | Campaign intro animation engine. `LS.getIntroSeen()` gates full vs title-card sequence. Timer cleanup on `visibilitychange`/`pagehide`. |
| `sw.js` | Service worker. `APP_SHELL` array must include every HTML page and core asset. Cache name = `fate-generator-{CalVer}`. |
| `assets/css/theme.css` | Full design system (~1400 lines). Dark/light themes, campaign accent vars, all component CSS. |
| `campaigns/run.html` | Session surface (1588 lines of inline React). Scene board, player roster, FP tracker, dice roller, GM/player view toggle, import from Prep Wizard. |
| `qa_named.js` | 86 named assertions. Run before every release. `node devdocs/qa_named.js` |
| `devdocs/bump-version.sh` | CalVer stamping. Run before every zip. `bash devdocs/bump-version.sh` |
| `devdocs/BACKLOG.md` | **Source of truth** for all planned work |
| `devdocs/CHANGELOG.md` | Complete version history, reverse-chronological |
| `devdocs/data-schema.md` | Required tables per world, minimum depth thresholds, opposition/issues object schemas |
| `devdocs/content-authoring.md` | How to add table entries and create new worlds; minimum depth thresholds |
| `devdocs/build_long_road.py` | PDF book builder for The Long Road (35pp) |
| `devdocs/build_long_after.py` | PDF book builder for The Long After (40pp) |
| `devdocs/build_gaslight.py` | PDF book builder for The Gaslight Chronicles (49pp) |

---

## The 8 campaign worlds

| Key | Name | Tagline |
|-----|------|---------|
| `thelongafter` | The Long After | The past is high-tech. Ancient Phade vaults litter a dying world. |
| `cyberpunk` | Neon Abyss | Corporate dystopia in Meridian. |
| `fantasy` | Shattered Kingdoms | The empire fell. The ashes are still warm. |
| `space` | Void Runners | Freelancers, salvage, and the things that live in the dark between stars. |
| `victorian` | The Gaslight Chronicles | Gothic cosmic horror. The veil is thin in the gaslit streets. |
| `postapoc` | The Long Road | The world ended. The convoy keeps moving. |
| `western` | Dust and Iron | Frontier justice. Railroad money. The weight of the old war. |
| `dVentiRealm` | The dVenti Realm | The Senate collapsed 30 years ago. The vaults are still here. |

---

## QA — every release, no exceptions

```bash
# 1. Syntax (all core files)
node --check core/ui.js && node --check core/ui-primitives.js && \
node --check core/ui-renderers.js && node --check core/ui-modals.js && \
node --check core/ui-landing.js && node --check core/engine.js && \
node --check core/db.js && node --check core/intro.js

# 2. Smoke test (128/128 — 8 worlds × 16 generators)
node -e "var fs=require('fs');eval(fs.readFileSync('data/shared.js','utf8'));eval(fs.readFileSync('data/universal.js','utf8'));['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(c){eval(fs.readFileSync('data/'+c+'.js','utf8'));});eval(fs.readFileSync('core/engine.js','utf8'));var errs=[],total=0;['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(camp){var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'].forEach(function(gen){try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}catch(e){errs.push(camp+'/'+gen+': '+e.message);}});});console.log('Smoke: '+total+'/128 errors:'+errs.length);"

# 3. Named assertions (86 total)
node devdocs/qa_named.js

# 4. FCon term bleed check
grep -rn "significant milestone\|Significant Milestone" data/ core/ help/ campaigns/
```

**Release checklist:**
1. `bash devdocs/bump-version.sh` — stamps CalVer in sw.js, all HTML asset refs, about.html
2. Update `devdocs/BACKLOG.md` — version header + completed items
3. All 3 QA gates green
4. `cd /home/claude && zip -r /mnt/user-data/outputs/ogma-YYYY.MM.B.zip fate-suite-new/ --exclude "*.DS_Store" --exclude "fate-suite-new/.git/*" -q`

---

## Rules accuracy — Fate Condensed is the authority

The default is always **Fate Condensed**. When drawing from Core/FAE/toolkits, convert to FCon and flag every conversion. **We have been burned by all of the following:**

| Rule | FCon correct | Common mistake |
|------|-------------|----------------|
| Stress boxes | ALL are 1-point | Core has escalating 1/2/3 boxes |
| Advancement | **Milestone** (session-end), **Breakthrough** (arc-end) | "Significant milestone" — does NOT exist in FCon |
| Stunts cost | 3 free, each beyond = −1 Refresh. **Never cost a Fate Point.** | NA-03 catches Fate Point stunts |
| Stunt scope | Must not fire every roll | "+2 to all Fight rolls" is illegal |
| Major NPC refresh | `Math.max(1, 3 - Math.max(0, stunts.length - 3))` | Hardcoded values |
| GM fate point pool | 1 per PC (shared, not per NPC) | Per-NPC pool |
| Opposition skill cap | Max 5 (Superb) | NA-66 catches violations |
| Consequence recovery | Treatment overcome FIRST, then timing | Timing starts immediately |

**FCon sources (priority order):** Condensed SRD → Core SRD → FAE SRD → Adversary Toolkit → System Toolkit → Horror Toolkit, Book of Hanz, Fate Space (supplementary)

---

## What's currently open

**Only one actionable item:** WS-11 — r/FATErpg intro post + blog post. Draft in `devdocs/gtm-launch-copy.md`. **Blocked on repo going public.** The repo must be manually pushed to GitHub from a local machine (egress blocks container→GitHub).

**Parking lot (formal review 2027.03.01):** PERF-02 (Vite minify), BL-36 (adaptive vibrancy), UX-18 (local analytics), PL-01 (multi-GM), PL-02 (native app wrapper).

**PDF book builders** in `devdocs/`: The Long Road (35pp), The Long After (40pp), The Gaslight Chronicles (49pp) shipped. Remaining worlds: Shattered Kingdoms, Neon Abyss, Void Runners, dVenti Realm, Dust and Iron. Scripts do not persist between container sessions — rebuild from the existing three as pattern.

**Sprint J (devdocs sync)** — completed at v149. CHANGELOG current, data-schema.md written, content-authoring thresholds added.

---

## What was the last big work block

Ten quality/hardening sprints (v138–v149) with zero new features:

- **Sprint A:** QA hardening — 81→86 assertions (NA-63–67), 8th world added to all checks, 2 FCon rules violations fixed, SW cache gaps closed, localStorage→IDB migration for lastCamp
- **Sprint B:** Dust & Iron — compels 7→35, twists 10→30, opposition 4→14, weaknesses 15→40
- **Sprint C:** dVenti Realm — troubles 16→40, compels 25→40, issues +2/+2, opposition +4 major NPCs
- **Sprint D:** CSS purge — 1546→1409 lines, 162 dead lines removed
- **Sprint E:** (absorbed into A) — rules violations + SW cache gaps
- **Sprint F:** Wiki accuracy — stale Help Level content removed/replaced, Settings references fixed
- **Sprint G:** run.html accessibility — 27 aria-labels added, NA-67 assertion
- **Sprint H:** intro.js — timer cleanup on navigation away mid-sequence
- **Sprint I:** Schema consistency — dVentiRealm `major_trouble`→`troubles` (live NPC bug fixed), 9 missing tables added, `data-schema.md` written
- **Component review:** ShareDrawer duplicate `className` bug fixed (export-copied was silently broken), `HowPanel`/`WhatPanel`/`InPlayPanel` dead code deleted (~140 lines), QPP seedData bug fixed, `FDStressTrack` shaking state removed, `pinnedCardsRef` extracted from keyboard deps

---

## Absolute rules (never violate)

- No build steps, bundlers, or TypeScript
- No AI in generated output
- No shipping without all QA gates passing (syntax + smoke 128/128 + named 86/86)
- No `file://` references — use localhost or GitHub Pages
- No stunt that charges a Fate Point (NA-03 catches this)
- No opposition skill rating > 5 (NA-66 catches this)
- No "significant milestone" — not a FCon term
- No RPGAwesome — removed v91, replaced with native emoji
- No direct GitHub push from container — always deliver zip
- `bump-version.sh` before every zip, no exceptions
- Update `claude_bootstrap.md` version fields ("Last updated" + "Current version") on every build, no exceptions

## Accessibility rules (every component, every session)

The governing standard is **WCAG 2.1 AA** plus **Apple HIG** for touch/mobile. WCAG 3.0/APCA is not used. When a new WCAG vs HIG conflict arises, **raise it to the owner** — do not resolve unilaterally.

**Contrast:** All text on `--text`, `--text-dim`, `--text-muted` tokens. Section headers on `--section-hdr`. Focus rings on `--focus-ring`. Never hardcode hex on text. Body text ≥4.5:1. UI components ≥3:1.

**Font size:** 11px floor on semantic labels. 12px on body. 10px on decorative badge/chrome only. `font-size:9px` is prohibited — NA-68 catches it.

**Touch targets:** 44×44px minimum on all primary actions and game-interactive controls. Floater chrome (minimise/close) are 44×44px. Dense tool chrome may use `@media(pointer:fine)` to reduce on mouse.

**Keyboard:** Every `<div onClick>` needs `role`, `tabIndex:0`, and `onKeyDown` for Space + Enter. Follow `FDStressTrack` as the pattern. Draggable elements need keyboard alternative (Floater: `Alt+Arrow`). Focus returns to trigger on close. Focus moves into panel on open.

**ARIA:** Combobox pattern for `QuickFindBar`. `aria-label` on all textareas. Descriptive `ariaLabel` on all `<Modal>` calls. `aria-labelledby` on tabpanels. `aria-live="polite"` on roll results.

**System:** `prefers-color-scheme` respected on first load (NA-69). iOS safe area insets on fixed-position elements near bottom. `prefers-reduced-motion` already global in `theme.css`.

**Conflict format (raise to owner before shipping):**
```
CONFLICT: [brief description]
WCAG requires: [SC number + requirement]
HIG requires: [requirement]
Option A / B / C: [three paths]
```

---

## How to start a new session

**Standard session:**
```
1. Read devdocs/BACKLOG.md — what's the current sprint?
2. Run baseline QA (smoke + named)
3. Build
```

**Content sprint (adding to a world):**
```
1. Read devdocs/data-schema.md — required tables + minimum thresholds
2. Read devdocs/content-authoring.md — how to add entries
3. node -e "[audit script from content-authoring.md]" to find gaps
4. Add content, run smoke test, run named assertions
```

**Refactor session:**
```
Code is for humans to read, and only incidentally for computers to execute.
1. Read the component before touching it
2. Identify: dead state, duplicate className props, useEffect dep arrays, dead functions
3. Fix, verify QA still green, bump
```

**PDF book session:**
```
1. pip install reportlab --break-system-packages
2. python3 devdocs/build_[world].py
3. Output to /home/claude/[world].pdf, then cp to /mnt/user-data/outputs/
Pattern: 6×9 digest, world palette accent colour, Evil Hat Worlds of Adventure layout
```

---

## partysocket (multiplayer WebSocket client)

`assets/js/partysocket.js` is a **vendored 101-line drop-in**, not the npm package.

The `partysocket` npm package ships ESM + CJS only — no UMD/IIFE/global build exists at any version. Every CDN URL (`jsdelivr`, `unpkg`) returns either `text/plain` (CJS served wrong MIME) or broken ESM (unresolved internal imports). There is no `dist/index.global.js` or `window.PartySocket` build.

Do NOT replace this with a CDN script tag. The vendored file implements exactly the API surface Ogma uses (`new PartySocket({host,room,query})`, `send`, `close`, `addEventListener`) with exponential backoff reconnect and message queuing. It is stable, same-origin, and requires no maintenance.

---

*This file is the single source of truth for new Claude sessions. Keep it current.*

## Critical File Write Rules (added v2026.03.184)

Violations of these rules have caused `ui-renderers.js` to be silently emptied or
doubled during the TC sprint. **Every session must follow these without exception.**

| Rule | Enforcement |
|------|-------------|
| All Python `open()` file writes must use `encoding='utf-8'` explicitly | `open(path, 'w', encoding='utf-8')` — no default codec |
| All emoji and multi-byte chars in JS strings written from Python must use JS unicode escapes (`'\\uD83C\\uDFB2'`), never raw characters | Raw chars become surrogate pairs in Python source; escapes are always ASCII-safe |
| Large block replacements (PrepCanvas, full component rewrites) must use **Node.js `fs.writeFileSync`**, not Python `str.replace()` | Node owns the encoding; Python search-and-replace on files with rendered Unicode fails silently |
| After every write: `node --check <file> && echo OK` before proceeding | Catches syntax errors before QA or zip |
| Never split a full-block replacement across multiple Python calls on the same file | Each call on a partially-modified file risks leaving an intermediate corrupt state |

**Session pattern for large PrepCanvas-style replacements:**
```
1. node -e "... read lines, identify exact 0-indexed slice boundaries ..."
2. Write new block to /tmp/new_block.js via node fs.writeFileSync
3. Python: before = lines[:N]; after = lines[M:]; result = join(before) + new + join(after)
4. node --check immediately after
```
