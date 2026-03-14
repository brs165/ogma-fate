# Ogma — A Fate Condensed Generator Suite
## Backlog

> **Source of truth.** Update this file whenever items are added, completed, or re-prioritised.
> Current version: **2026.03.10** · Cache: `fate-generator-2026.03.10`

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

## QA Commands (2026.03.1)

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
Covers: minor stress ≤3, major refresh formula, no FP stunts, contest tie text, toMarkdown coverage, no "significant milestone", postapoc faction dedup.

---

## Tier 1 — Ship next

| ID | Epic | Title | Size | Notes |
|----|------|-------|------|-------|
| **BL-26** | EP-02 | Content verbosity pass — 224 troubles/minor_weaknesses exceed 12 words. Target ≤10 words for 90% of entries. Worst offenders: postapoc (24w), victorian (20w), fantasy (20w). | M | Audit complete. Pure content edit, no engine change. |
| **BL-03** | EP-02 | Victorian campaign — adjective quality pass + GM Tips invoke/compel examples | S | Audit `data/victorian.js`. Add one worked invoke + one worked compel per GM tip. |
| **BL-27** | EP-03 | Campaign Guide links — add to index world cards and sidebar World section above Campaign Issues | XS | ✅ Done 2026.03.9 — see Completed |
| **BL-28** | EP-03 | Sidebar reorder — Play Intro above Campaign Guide, Campaign Guide above Campaign Issues | XS | ✅ Done 2026.03.9 — see Completed |
| **BL-29** | EP-01 | FCon rules compliance — replace "breakthrough" with "major milestone" throughout all content and UI | XS | ✅ Done 2026.03.9 — see Completed |
| **BL-30** | EP-01 | Share/Export blank page — `campName` undefined in `ShareDrawer` call | XS | ✅ Done 2026.03.9 — see Completed |
| **BL-31** | EP-03 | Glossary redesign — flat list → 2-column categorised `dl/dt/dd` with 6 sections | S | ✅ Done 2026.03.9 — see Completed |
| **BL-07** | EP-02 | GM Tips depth pass — invoke/compel examples + D&D callouts for every generator | M | Every generator gets one concrete invoke example and one compel example in the GM tip. |
| **BL-10** | EP-03 | Milestone & advancement tracker | M | BL-01 ✓ | Second tab in FP panel. Minor / Major Milestone checkboxes. Persisted in LS schema. Update: "Breakthrough" → "Major Milestone" in all tracker UI copy. |

---

## Tier 2 — Next sprint

| ID | Epic | Title | Size | Blocked on | Notes |
|----|------|-------|------|-----------|-------|
| **BL-06** | EP-03 | Shareable result links — seeded PRNG + URL hash | M | — | Encode generator + seed in URL hash. Copy link button on result cards. |
| **BL-09** | EP-04 | PWA install nudge | S | BL-01 ✓ | Detect `beforeinstallprompt`. Show subtle banner after 2nd visit. Dismiss stored in LS schema. |
| **BL-32** | EP-02 | Optimised GM Automation content integration — review source, map to generators, write table entries | L | Content delivery | Pending source material from product. |


---

## Tier 3 — When ready

| ID | Epic | Title | Size | Blocked on | Notes |
|----|------|-------|------|-----------|-------|
| **BL-12** | EP-05 | OG meta URLs — confirm GitHub username + repo | XS | User input | Update all `og:url`, `og:image`, `twitter:image`. Run `bash bump-version.sh username repo-name`. |

---

## Parking Lot
| R-14 | EP-05 | Opt-in localStorage analytics event log — permanently parked per product decision | — No active timeline

| ID | Epic | Title | Notes |
|----|------|-------|-------|
| **BL-02** | EP-01 | Stunt generator — rules design & data spec | Design `data/stunts.js` table structure. Parked — scope too broad for current focus. Prerequisite for BL-05, BL-11. |
| **BL-05** | EP-03 | Stunt generator — wire to UI as 17th generator | Blocked on BL-02. Parked with it. |
| **BL-08** | EP-06 | Frontier/western world — `data/western.js` | New campaign world. Full table set. Parked pending capacity. |
| **BL-11** | EP-03 | Stunt builder wizard | Blocked on BL-05. Parked with it. |
| **BL-12** | EP-05 | OG meta URLs | Needs GitHub username/repo from user. |
| **PL-01** | EP-04 | Collaborative multi-GM mode | Needs server / CRDT. Out of scope for offline-first. |
| **PL-02** | EP-04 | Native app wrapper (Capacitor / Tauri) | Revisit after PWA install nudge proves demand. |
| **PL-03** | EP-05 | Build toolchain migration (Vite + JSX + TS) | Breaks `file://` compat. Revisit if PWA-only. |

---

## Completed

| ID | Epic | Title | Version |
|----|------|-------|---------|
| UX-05 | EP-03 | "Table Manager" → "Customize Tables" label | v31 |
| ND-14 | EP-03 | Solo-use callout on Session Zero step 1 | v31 |
| PROD-01 | EP-05 | `bump-version.sh` accepts optional `username repo` args | v31 |
| ND-11 | EP-03 | Print button confirmed production-ready | v31 |
| ND-07 | EP-03 | Inspiration Mode — ✦ 3 button, `doInspire()` | v31 |
| ND-10 | EP-04 | Fate Point tracker — `FatePointTracker` component, localStorage persisted | v31 |
| — | EP-03 | Campaign intro sequences — all 6 worlds + index | v32 |
| — | EP-03 | `core/intro.js` shared engine — skip, first-seen, title card on return | v32 |
| — | EP-03 | `about.html` offline/download section + zip link | v32 |
| — | EP-03 | Watch Intro button — index nav, campaign nav, mobile ⋯ sheet | v33 |
| — | EP-03 | Mobile nav audit + Watch Intro fixes (icon-only, mobile-visible) | v34 |
| — | EP-01 | DATA BUG — 8 zone entries with `null` aspect | v35 QA |
| — | EP-01 | DATA BUG — Void Kraken Juvenile `stress: 8` → `6` | v35 QA |
| BL-18 | EP-01 | ENGINE BUG — Major NPC `refresh` hardcoded to `3` | 2026.03.1 |
| BL-19 | EP-01 | ENGINE BUG — Contest tie note said "twist aspect" | 2026.03.1 |
| R-02 | EP-01 | DATA BUG — Flash-Bang + Deductive Leap charged Fate Points | 2026.03.1 |
| R-03 | EP-01 | DATA BUG — Chrome-Heavy Enforcer minor NPC stress was 4 | 2026.03.1 |
| R-05 | EP-01 | DATA BUG — "significant milestone" in universal.js | 2026.03.1 |
| QA-03 | EP-02 | DATA BUG — Postapoc faction table duplicates | 2026.03.1 |
| E-01 | EP-04 | OFFLINE BUG — `core/intro.js` missing from SW APP_SHELL | 2026.03.1 |
| BL-25 | EP-05 | Attribution — Randy Oest / Amazing Rando / fate-srd.com | 2026.03.1 |
| BL-17 | EP-05 | CalVer — `bump-version.sh` rewritten to auto-detect YYYY.MM.B | 2026.03.1 |
| BL-13 | EP-03 | Learn page AI prompts → collapsed `<details>` pattern | 2026.03.1 |
| BL-14 | EP-03 | Intro CRT scanline overlay — confirmed fully implemented | 2026.03.1 |
| BL-20 | EP-03 | Remove Quick Roll ↺ button — confirmed already removed | 2026.03.1 |
| BL-21 | EP-03 | Help `?` added to `panel-toolbar-right` — always visible | 2026.03.1 |
| BL-22 | EP-03 | Export + Print → inline `⬆ Share` drawer; Pin stays separate | 2026.03.1 |
| BL-04 | EP-05 | QA battery — corrected harness + 7 named assertions (NA-01–NA-07) | 2026.03.1 |
| BL-01 | EP-04 | localStorage versioned schema (`fate_prefs_v1`) + migration shim | 2026.03.2 |
| BL-16 | EP-03 | Ogma rebrand — titles, nav, manifest, about.html, README | 2026.03.2 |
| TD-01 | EP-03 | Removed dead `MobileBottomSheet` component (70 lines) — replaced by sidebar | 2026.03.5 |
| TD-02 | EP-03 | Renamed `showOverflow` → `showSidebar` for clarity | 2026.03.5 |
| TD-03 | EP-05 | Removed 24 dead CSS classes (~7.5KB) — old header, bsheet, gen-nav, mob-hide, etc. | 2026.03.5 |
| TD-04 | EP-01 | `pick()` empty-array guard — returns `""` instead of `undefined` | 2026.03.5 |
| TD-05 | EP-05 | Named `TIMING` constants replace magic timeout numbers in ui.js | 2026.03.5 |
| TD-06 | EP-04 | `db.js` `dbPromise` resets on IDB error — allows retries instead of permanent failure | 2026.03.5 |
| TD-07 | EP-01 | `fillTemplate()` returns `""` on missing token keys instead of raw key name | 2026.03.5 |
| TD-08 | EP-01 | `mergeUniversal()` null-guards tables input | 2026.03.5 |
| TD-09 | EP-03 | Escape key closes sidebar + all open panels (keyboard nav) | 2026.03.5 |
| TD-10 | EP-03 | Escape added to keyboard shortcuts legend in HelpModal | 2026.03.5 |
| TD-11 | EP-03 | `focus-visible` ring added to all sidebar interactive elements | 2026.03.5 |
| TD-12 | EP-05 | Print stylesheet updated for Pattern G layout classes | 2026.03.5 |
| TD-13 | EP-03 | Removed dead `SKIP_KEY_PREFIX` constant from intro.js | 2026.03.5 |
| UI-01 | EP-03 | Topbar redesign — Ogma · CampaignName [Genre] only, no action buttons | 2026.03.6 |
| UI-02 | EP-03 | GM Mode — merged gmMode + playerView into single toggle. ON = tips visible, OFF = clean/player view | 2026.03.6 |
| UI-03 | EP-03 | Sidebar spec rewrite — exact nav hierarchy per design brief | 2026.03.6 |
| UI-04 | EP-03 | camp-hero removed from content panel — cleaner, distraction-free roll experience | 2026.03.6 |
| UI-05 | EP-03 | LandingApp — new immersive hero, world grid cards with hooks, onboarding paths, generator groups | 2026.03.6 |
| UI-07 | EP-03 | Interactive result renderers — all 16 generators upgraded with tappable stress, live contest tracks, compel accept/refuse, countdown with color states, consequence recovery tracker, faction face reveal, scene pinning, seed scene stepper, challenge outcome toggle, complication spotlight selector, backstory expand | 2026.03.10 |
| BL-27 | EP-03 | Campaign Guide links on index world cards + sidebar World section above Campaign Issues | 2026.03.9 |
| BL-28 | EP-03 | Sidebar reorder: Play Intro → Campaign Guide → Rules order in Help section | 2026.03.9 |
| BL-29 | EP-01 | FCon rules compliance: "breakthrough" → "major milestone" in shared.js, universal.js, ui.js, learn.html | 2026.03.9 |
| BL-30 | EP-01 | Share/Export crash: `campName: campName` (undefined) → `campName: camp.meta.name` | 2026.03.9 |
| BL-31 | EP-03 | Glossary redesign: flat 24-item list → 2-col categorised dl/dt/dd with 6 sections; added Scale and Teamwork | 2026.03.9 |
| R-01 | EP-03 | Sidebar touch targets raised to 44px min (12px vertical padding) | 2026.03.8 |
| R-02 | EP-03 | --text-muted contrast fixed: 0.50 dark / 0.60 light (≥4.5:1) | 2026.03.8 |
| R-03 | EP-03 | Mobile static page nav: hamburger + dropdown on all static/guide pages | 2026.03.8 |
| R-04 | EP-05 | Removed duplicate sidebar-tool-btn CSS definition | 2026.03.8 |
| R-05 | EP-03 | Empty state improved: icon, label, sub, Space shortcut hint | 2026.03.8 |
| R-06 | EP-03 | Sidebar landmark: <aside> → <nav aria-label="Generators and tools"> | 2026.03.8 |
| R-07 | EP-03 | Label consistency: "Compel" everywhere (was "Compel Offer") | 2026.03.8 |
| R-08 | EP-03 | Label consistency: "Customize Tables" everywhere (was "View Tables") | 2026.03.8 |
| R-09 | EP-03 | Share drawer: CSS height transition 200ms ease | 2026.03.8 |
| R-10 | EP-03 | Toast: top-center on mobile (top:60px) to avoid result card overlap | 2026.03.8 |
| R-11 | EP-03 | "Continue →" last-used campaign link on index hero (localStorage-based) | 2026.03.8 |
| R-12 | EP-03 | World card genre displayed as accent pill badge | 2026.03.8 |
| R-13 | EP-03 | Sticky Roll FAB via IntersectionObserver — mobile only, hidden on desktop | 2026.03.8 |
| R-15 | EP-03 | Campaign accent contrast audit + fixes: thelongafter/cyberpunk/fantasy light now ≥4.5:1 | 2026.03.8 |
| UI-06 | EP-03 | Static page nav (learn, about, license, D&D guide, session zero, 6 guide pages) — all ported to `land-topnav`, consistent across site | 2026.03.7 |
| BL-15 | EP-03 | Mobile nav overhaul — Pattern G (sidebar + topbar) implemented. 3 rounds of research + interactive mocks. | 2026.03.4 |

---

*Last updated: 2026.03.10*
