# Ogma — Testing Reference

> **Last updated:** 2026.03.346 — 124/124 · 59/59 · 128/128. NA-114–124 added: WCAG 2.2 compliance assertions (focus appearance, target size, scroll-padding, dark default, table scopes, reduced-motion functions, design system cache). Interactive elements tested manually. Headless browser coverage remains a known gap.

---

## QA suite overview

| Suite | Command | Expected | What it catches |
|-------|---------|----------|----------------|
| Syntax check | `node --check core/*.js` | Exit 0 | Parse errors before anything else |
| Named assertions | `node tests/qa_named.js` | 124/124 | Rules compliance, content quality, WCAG 2.2, SW coverage, ARIA |
| Unit tests | `node tests/engine.test.js` | 59/59 | Engine function correctness |
| Smoke test | see below | 128/128 | Every generator × every world runs without throwing |
| Export round-trip | `node tests/export-roundtrip.test.js` | 89/89 | All 16 generators produce exportable JSON; parse back; every card intact |
| CDN integrity | `node scripts/check-cdn-versions.js` | Pass | SRI hashes match CDN |

**All five must pass before any zip or deploy.**

---

## Full QA command (copy-paste)

```bash
# 1. Syntax
node --check core/engine.js && \
node --check core/ui.js && \
node --check core/ui-table.js && \
node --check core/ui-run.js && \
node --check core/ui-board.js && \
node --check core/ui-primitives.js && \
node --check core/ui-renderers.js && \
node --check core/ui-modals.js && \
node --check core/ui-landing.js && \
node --check core/db.js && \
node --check core/config.js && \
node --check core/intro.js

# 2. Named assertions (113/113)
node tests/qa_named.js

# 3. Unit tests (59/59)
node tests/engine.test.js

# 4. Smoke test (128/128 — all 16 generators × 8 worlds)
node -e "
var fs=require('fs');
eval(fs.readFileSync('data/shared.js','utf8'));
eval(fs.readFileSync('data/universal.js','utf8'));
['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(c){
  eval(fs.readFileSync('data/'+c+'.js','utf8'));
});
eval(fs.readFileSync('core/engine.js','utf8'));
var errs=[],total=0;
['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(camp){
  var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});
  ['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'].forEach(function(gen){
    try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}
    catch(e){errs.push(camp+'/'+gen+': '+e.message);}
  });
});
console.log('Smoke: '+total+'/128  errors:'+errs.length);
if(errs.length){errs.forEach(function(i){console.error('FAIL:',i);});process.exit(1);}
"

# 5. CDN integrity
node scripts/check-cdn-versions.js

# 6. Export round-trip (89 assertions)
node tests/export-roundtrip.test.js

# 7. Bump version (run last, before zip)
bash scripts/bump-version.sh
```

Or use `npm test` which runs steps 2–5 in sequence.

---

## Named assertion ranges (NA-01 through NA-113)

| Range | What they cover |
|-------|----------------|
| NA-01–NA-10 | FCon rules compliance: stress model, refresh, stunt cost, consequence slots, contest wording |
| NA-11–NA-22 | Script load order, state declarations, function presence in ui.js |
| NA-23–NA-40 | Content quality: aspect scoring, tone, sensory tags |
| NA-41–NA-58 | World-specific data integrity (all 8 worlds) |
| NA-59 | Stunt tags on all stunts |
| NA-60 | No duplicate opposition in encounter results |
| NA-61–NA-62 | sessionzero.html + board.html load all 8 world data files (NA-62 migrated from run.html v306) |
| NA-63–NA-64 | All 8 guide pages have correct worldKey + data-campaign attrs |
| NA-65–NA-68 | SW APP_SHELL coverage, font size floor (9px prohibited), prefers-color-scheme |
| NA-69–NA-85 | Multiplayer, sync (`createTableSync` in ui.js), gmOnly filter, partysocket guards |
| NA-86–NA-97 | Board: SW coverage, no globals redeclaration, ARIA roles, touch targets, round aria-live (NA-96 now checks ui-board.js BoardTurnBar) |
| NA-98–NA-113 | Reserved — unassigned. |
| NA-114 | `[role="checkbox"]:focus-visible` rule present — WCAG 2.2 SC 3.2.6 Focus Appearance |
| NA-115 | `rs-zone-input:focus` sets `border-width:2px` — WCAG 2.2 SC 2.4.11 Focus Appearance (Minimum) |
| NA-116 | `body` has `scroll-padding-bottom:80px` — WCAG 2.2 SC 2.4.12 Focus Not Obscured (Minimum) |
| NA-117 | `data-theme="dark"` on campaign pages — dark mode as default |
| NA-118 | `design-system.html` in SW APP_SHELL — offline coverage |
| NA-119 | `scope="col"` on `<th>` in `help/faq.html` — WCAG 1.3.1 Info and Relationships |
| NA-120 | `scope="col"` on `<th>` in `help/dnd-transition.html` — WCAG 1.3.1 |
| NA-121 | `cv4UseReducedMotion` defined in `ui-renderers.js` — WCAG 2.3.3 / 2.1 reduced-motion |
| NA-122 | `cv4InjectStyles` defined in `ui-renderers.js` — Field Dispatch keyframe injection |
| NA-123 | `fd-stamp-in` keyframe in `cv4InjectStyles` — animation integrity check |
| NA-124 | `--focus-ring:#D4A060` in dark theme — 4.6:1 contrast on `#0E0C09` |
| (next) | Next assertion ID is **NA-125** |

---

## Known gaps

### Gap 1 — No React render simulation (HIGH RISK)

`qa_named.js` is Node-based. It cannot call `ReactDOM.render()`. A `ReferenceError` inside a React component that only triggers during render will pass all assertions but crash in browser.

**Mitigation:** NA-20 checks 24 key state variable declarations exist by string match. NA-22 checks function names. Brittle but catches dropped declarations.

**Better fix:** Playwright/Puppeteer headless browser smoke — loads each campaign page, verifies React mounts without console errors. Add to backlog when Node network access available for npm install.

### Gap 2 — Static source inspection only (MEDIUM RISK)

Assertions that check source text verify *presence* of strings, not correct *scope* or *wiring*. A function defined outside a component when it should be inside passes all assertions.

**Mitigation:** NA-19 checks `renderResult` call count (≥2). Still not a runtime assertion.

### Gap 3 — No script dependency graph verification (MEDIUM RISK)

NA-13/14/21 verify file order in HTML `<script>` tags but don't verify every *symbol used* is *exported* by the files loaded before it.

**Mitigation:** NA-88 now checks that `ui-board.js` does not redeclare `ui-primitives.js` globals — the pattern that caused the SyntaxError in v267.

### Gap 4 — ESLint not previously functional (FIXED v282)

`eslint` was declared as a devDependency but no config file existed. `npm run lint` silently did nothing. Fixed by adding `eslint.config.cjs` in v282.

---

## Adding a new assertion

1. Open `tests/qa_named.js`
2. Add at the bottom, before the final `console.log` summary line
3. Follow the existing pattern:
```js
(function() {
  var file = fs.readFileSync('path/to/file', 'utf8');
  assert('NA-NNN: description of what this checks',
    file.includes('expected string'),
    'failure message — what was missing and why it matters');
})();
```
4. Run `node tests/qa_named.js` — total should increment by 1
5. Update the assertion range table above

