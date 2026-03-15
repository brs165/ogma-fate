# Ogma - A Fate Condensed Generator Suite
## Backlog

> **Source of truth.** Update this file whenever items are added, completed, or re-prioritised.
> Current version: **2026.03.26** · Cache: `fate-generator-2026.03.26`

---

## Sizing

| Label | Effort |
|-------|--------|
| XS | < 1 hour |
| S | 1–3 hours |
| M | half-day |
| L | full day+ |

---

## EPICs

| ID | Epic | Description |
|----|------|-------------|
| **EP-01** | Rules Engine | Generator logic, FCon compliance, data accuracy |
| **EP-02** | Content | Campaign table data, world-building, NPC/scene quality |
| **EP-03** | UX & Interface | UI components, navigation, interaction patterns |
| **EP-04** | PWA & Offline | Service worker, install, persistence, localStorage |
| **EP-05** | Infrastructure | Versioning, build tooling, QA battery, CI |
| **EP-06** | Content Expansion | New campaign worlds, new generator types |

---

## QA Commands

Run from the project root. Requires Node.js.

### Smoke test (96/96)
```
node -e "
var fs=require('fs');
eval(fs.readFileSync('data/shared.js','utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'].forEach(function(c){eval(fs.readFileSync('data/'+c+'.js','utf8'));});
eval(fs.readFileSync('core/engine.js','utf8'));
var camps=['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'];
var gens=['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'];
var errs=[];var total=0;
camps.forEach(function(camp){
  var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});
  gens.forEach(function(gen){
    try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}
    catch(e){errs.push(camp+'/'+gen+': '+e.message);}
  });
});
console.log('Smoke: '+total+'/96  errors:'+errs.length);
errs.forEach(function(e){console.log('  FAIL: '+e);});
"
```

### Stress test (19,200 runs)
```
node -e "
var fs=require('fs');
eval(fs.readFileSync('data/shared.js','utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'].forEach(function(c){eval(fs.readFileSync('data/'+c+'.js','utf8'));});
eval(fs.readFileSync('core/engine.js','utf8'));
var camps=['thelongafter','cyberpunk','fantasy','space','victorian','postapoc'];
var gens=['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'];
var tbls={};camps.forEach(function(c){tbls[c]=filteredTables(mergeUniversal(CAMPAIGNS[c].tables),{});});
var crashes=0;var undefs=0;
for(var i=0;i<19200;i++){var c=camps[i%camps.length];var g=gens[Math.floor(Math.random()*gens.length)];
  try{var r=generate(g,tbls[c],4);if(!r||typeof r!=='object')undefs++;}catch(e){crashes++;}}
console.log('Stress: 19200 runs  crashes:'+crashes+'  undefs:'+undefs);
"
```

### Named assertions (NA-01 through NA-07)
```
node qa_named.js
```
Covers: minor stress ≤3, major refresh formula, no FP stunts, contest tie text, toMarkdown coverage, no "significant milestone", postapoc faction dedup, toBatchFariJSON validity (NA-08).

---

## Tier 1 - Ship next sprint
> **Theme: Content expansion.** Engineering, UI, performance, and copy are solid. The constraint is now table richness.

| Priority | ID | Epic | Title | Size | Notes |
|---|---|---|---|---|---|
| 1 | **BL-52** | EP-02 | RPG Awesome sidebar icon baseline - verify `sidebar-item-icon` renders at >=14px; add explicit font-size override if needed | XS | RaIcon inherits parent font-size (13px on sidebar items). Some glyphs may clip at that size. Quick CSS audit. |
| 2 | **BL-53** | EP-02 | Dead CSS removal - remove `.camp-card`, `.camp-hero`, `.camp-hero-*`, `.camp-name`, `.consequence-table`, `.hist-badge`, `.hist-badge-btn`, `.land-camp-list` tombstone classes | XS | Tombstoned in 2026.03.17. Review date 2026.09 but they can go earlier if confident. |
| 3 | **BL-08** | EP-06 | Frontier/western world - `data/western.js`, 1,300+ entries | L | Highest-impact content expansion. devdocs/content-authoring.md has full how-to. Review date 2026.09 but move up if capacity exists. |

---

## Tier 2 - Next sprint

| ID | Epic | Title | Size | Blocked on | Notes |
|----|------|-------|------|------------|-------|
| **BL-32** | EP-02 | Optimised GM Automation content integration - review source, map to generators, write table entries | L | Content delivery | **Blocked.** Pending source material from product. Cannot scope or start until delivered. |

---

## Tier 3 - When ready

| ID | Epic | Title | Size | Blocked on | Notes |
|----|------|-------|------|------------|-------|
| **BL-06** | EP-03 | Shareable result links - seeded PRNG + URL hash, Copy Link button on result cards | M | BL-12 | Requires seeded PRNG (real engine change) and a public URL to be useful. Demoted - blocked by hosting decision. |
| **BL-36** | EP-03 | Adaptive vibrancy contrast engine - sample `--camp-bg` luminance, apply `--glass-tint` when contrast would fail 4.5:1 | M | R-15 ✓ | Good a11y work. Complex. Depends on R-15 accent audit as foundation. |
| **BL-12** | EP-05 | OG meta URLs - `og:url`, `og:image`, `twitter:image` across all pages | XS | GitHub username/repo from owner | **Needs a decision.** Has been blocked for months. Either get the answer and ship in an hour, or park permanently. Review by 2026.09. |

---

## Parking Lot
> Items parked indefinitely are scheduled for a formal keep/close review at **2026.09.01**.

| ID | Epic | Title | Notes |
|----|------|-------|-------|
| **R-14** | EP-05 | Opt-in localStorage analytics event log | Permanently parked - product decision. Will not be reopened. |
| **BL-02** | EP-01 | Stunt generator - rules design & data spec | Parked - scope too broad for current focus. Prerequisite for BL-05, BL-11. Review 2026.09. |
| **BL-05** | EP-03 | Stunt generator - wire to UI as 17th generator | Blocked on BL-02. Parked with it. Review 2026.09. |
| **BL-11** | EP-03 | Stunt builder wizard | Blocked on BL-05. Parked with it. Review 2026.09. |
| **BL-08** | EP-06 | Frontier/western world - `data/western.js` | New campaign world, 1,300+ entries. Highest-impact content expansion if capacity exists. Review 2026.09. |
| **PL-01** | EP-04 | Collaborative multi-GM mode | Needs server / CRDT. Out of scope for offline-first. Review 2026.09. |
| **PL-02** | EP-04 | Native app wrapper (Capacitor / Tauri) | Revisit after PWA install nudge proves demand. Review 2026.09. |
| **PL-03** | EP-05 | Build toolchain migration (Vite + JSX + TS) | Breaks `file://` compat. Revisit if PWA-only. Review 2026.09. |

---

## Completed

| ID | Epic | Title | Version |
|----|------|-------|---------|
| UX-05 | EP-03 | "Table Manager" → "Customize Tables" label | v31 |
| ND-14 | EP-03 | Solo-use callout on Session Zero step 1 | v31 |
| PROD-01 | EP-05 | `bump-version.sh` accepts optional `username repo` args | v31 |
| ND-11 | EP-03 | Print button confirmed production-ready | v31 |
| ND-07 | EP-03 | Inspiration Mode - ✦ 3 button, `doInspire()` | v31 |
| ND-10 | EP-04 | Fate Point tracker - `FatePointTracker` component, localStorage persisted | v31 |
| - | EP-03 | Campaign intro sequences - all 6 worlds + index | v32 |
| - | EP-03 | `core/intro.js` shared engine - skip, first-seen, title card on return | v32 |
| - | EP-03 | `about.html` offline/download section + zip link | v32 |
| - | EP-03 | Watch Intro button - index nav, campaign nav, mobile ⋯ sheet | v33 |
| - | EP-03 | Mobile nav audit + Watch Intro fixes (icon-only, mobile-visible) | v34 |
| - | EP-01 | DATA BUG - 8 zone entries with `null` aspect | v35 QA |
| - | EP-01 | DATA BUG - Void Kraken Juvenile `stress: 8` → `6` | v35 QA |
| BL-18 | EP-01 | ENGINE BUG - Major NPC `refresh` hardcoded to `3` | 2026.03.1 |
| BL-19 | EP-01 | ENGINE BUG - Contest tie note said "twist aspect" | 2026.03.1 |
| R-02 | EP-01 | DATA BUG - Flash-Bang + Deductive Leap charged Fate Points | 2026.03.1 |
| R-03 | EP-01 | DATA BUG - Chrome-Heavy Enforcer minor NPC stress was 4 | 2026.03.1 |
| R-05 | EP-01 | DATA BUG - "significant milestone" in universal.js | 2026.03.1 |
| QA-03 | EP-02 | DATA BUG - Postapoc faction table duplicates | 2026.03.1 |
| E-01 | EP-04 | OFFLINE BUG - `core/intro.js` missing from SW APP_SHELL | 2026.03.1 |
| BL-25 | EP-05 | Attribution - Randy Oest / Amazing Rando / fate-srd.com | 2026.03.1 |
| BL-17 | EP-05 | CalVer - `bump-version.sh` rewritten to auto-detect YYYY.MM.B | 2026.03.1 |
| BL-13 | EP-03 | Learn page AI prompts → collapsed `<details>` pattern | 2026.03.1 |
| BL-14 | EP-03 | Intro CRT scanline overlay - confirmed fully implemented | 2026.03.1 |
| BL-20 | EP-03 | Remove Quick Roll ↺ button - confirmed already removed | 2026.03.1 |
| BL-21 | EP-03 | Help `?` added to `panel-toolbar-right` - always visible | 2026.03.1 |
| BL-22 | EP-03 | Export + Print → inline `⬆ Share` drawer; Pin stays separate | 2026.03.1 |
| BL-04 | EP-05 | QA battery - corrected harness + 7 named assertions (NA-01–NA-07) | 2026.03.1 |
| BL-01 | EP-04 | localStorage versioned schema (`fate_prefs_v1`) + migration shim | 2026.03.2 |
| BL-16 | EP-03 | Ogma rebrand - titles, nav, manifest, about.html, README | 2026.03.2 |
| TD-01 | EP-03 | Removed dead `MobileBottomSheet` component (70 lines) | 2026.03.5 |
| TD-02 | EP-03 | Renamed `showOverflow` → `showSidebar` for clarity | 2026.03.5 |
| TD-03 | EP-05 | Removed 24 dead CSS classes (~7.5KB) | 2026.03.5 |
| TD-04 | EP-01 | `pick()` empty-array guard - returns `""` instead of `undefined` | 2026.03.5 |
| TD-05 | EP-05 | Named `TIMING` constants replace magic timeout numbers in ui.js | 2026.03.5 |
| TD-06 | EP-04 | `db.js` `dbPromise` resets on IDB error - allows retries | 2026.03.5 |
| TD-07 | EP-01 | `fillTemplate()` returns `""` on missing token keys | 2026.03.5 |
| TD-08 | EP-01 | `mergeUniversal()` null-guards tables input | 2026.03.5 |
| TD-09 | EP-03 | Escape key closes sidebar + all open panels | 2026.03.5 |
| TD-10 | EP-03 | Escape added to keyboard shortcuts legend in HelpModal | 2026.03.5 |
| TD-11 | EP-03 | `focus-visible` ring added to all sidebar interactive elements | 2026.03.5 |
| TD-12 | EP-05 | Print stylesheet updated for Pattern G layout classes | 2026.03.5 |
| TD-13 | EP-03 | Removed dead `SKIP_KEY_PREFIX` constant from intro.js | 2026.03.5 |
| BL-15 | EP-03 | Mobile nav overhaul - Pattern G (sidebar + topbar) | 2026.03.4 |
| UI-01 | EP-03 | Topbar redesign - Ogma · CampaignName [Genre] only | 2026.03.6 |
| UI-02 | EP-03 | GM Mode - merged gmMode + playerView into single toggle | 2026.03.6 |
| UI-03 | EP-03 | Sidebar spec rewrite - exact nav hierarchy per design brief | 2026.03.6 |
| UI-04 | EP-03 | camp-hero removed from content panel | 2026.03.6 |
| UI-05 | EP-03 | LandingApp - immersive hero, world grid, onboarding paths | 2026.03.6 |
| UI-06 | EP-03 | Static page nav - all pages ported to `land-topnav` | 2026.03.7 |
| R-01 | EP-03 | Sidebar touch targets raised to 44px min | 2026.03.8 |
| R-02 | EP-03 | --text-muted contrast fixed ≥4.5:1 | 2026.03.8 |
| R-03 | EP-03 | Mobile static page nav - hamburger + dropdown | 2026.03.8 |
| R-04 | EP-05 | Removed duplicate sidebar-tool-btn CSS definition | 2026.03.8 |
| R-05 | EP-03 | Empty state - icon, label, sub, Space shortcut hint | 2026.03.8 |
| R-06 | EP-03 | Sidebar landmark: `<aside>` → `<nav aria-label="Generators and tools">` | 2026.03.8 |
| R-07 | EP-03 | Label consistency: "Compel" everywhere | 2026.03.8 |
| R-08 | EP-03 | Label consistency: "Customize Tables" everywhere | 2026.03.8 |
| R-09 | EP-03 | Share drawer: CSS height transition 200ms | 2026.03.8 |
| R-10 | EP-03 | Toast: top-center on mobile | 2026.03.8 |
| R-11 | EP-03 | "Continue →" last-used campaign link on index | 2026.03.8 |
| R-12 | EP-03 | World card genre as accent pill badge | 2026.03.8 |
| R-13 | EP-03 | Sticky Roll FAB via IntersectionObserver - mobile only | 2026.03.8 |
| R-15 | EP-03 | Campaign accent contrast audit + fixes (thelongafter/cyberpunk/fantasy light) | 2026.03.8 |
| BL-27 | EP-03 | Campaign Guide links on index cards + sidebar | 2026.03.9 |
| BL-28 | EP-03 | Sidebar reorder: Play Intro → Campaign Guide → Rules | 2026.03.9 |
| BL-29 | EP-01 | FCon rules: "breakthrough" → "major milestone" throughout | 2026.03.9 |
| BL-30 | EP-01 | Share/Export crash: `campName` undefined fix | 2026.03.9 |
| BL-31 | EP-03 | Glossary redesign: 2-col categorised dl/dt/dd | 2026.03.9 |
| BL-33a | EP-03 | Fari/Foundry JSON export - `toFariJSON()` + ShareDrawer "🎲 Fari / Foundry" button on NPC generators | 2026.03.11 |
| BL-33b | EP-03 | Roll20 JSON export - `toRoll20JSON()` + ShareDrawer "🎲 Roll20" button on NPC generators | 2026.03.11 |
| UI-07 | EP-03 | Interactive result renderers - all 16 generators upgraded | 2026.03.10 |
| BL-07 | EP-02 | GM Tips depth pass - invoke/compel examples for all 16 generators; wired as ✦ Invoke + ⊗ Compel eg. GM pills and HelpModal sections | 2026.03.15 |
| BL-34 | EP-03 | fate-srd.com deep links - `srd_url` on all 16 HELP_ENTRIES, rendered as "📖 Read the SRD rule →" in HelpModal | 2026.03.15 |
| BL-26 | EP-02 | Content verbosity pass - 224 → 0 entries over 12 words across all 6 campaigns; 80% now ≤10 words | 2026.03.15 |
| BL-03 | EP-02 | Victorian campaign quality pass - all 37 over-length troubles/weaknesses trimmed; voice preserved | 2026.03.15 |
| BL-10 | EP-03 | Milestone & advancement tracker - Minor/Major milestone checklists as "⬡ Milestones" tab in FP panel | 2026.03.15 |
| BL-35 | EP-03 | Popcorn Initiative tracker - "🏁 Initiative" tab in FP panel, pulls opposition names from last Encounter result | 2026.03.15 |
| BL-09 | EP-04 | PWA install nudge - `beforeinstallprompt` captured, subtle banner after 2nd visit, dismiss persisted in LS | 2026.03.15 |
| BL-37 | EP-03 | `aria-live="polite"` audit - result-panel confirmed polite, result set at 220ms (post-animation safe), PWA nudge has role=status | 2026.03.15 |
| BL-38 | EP-03 | Batch Fari export - `toBatchFariJSON()` in engine.js + "🎲 Export to Fari / Foundry" in History panel; NA-08 assertion added | 2026.03.15 |

---

*Last updated: 2026.03.19*
