# QA Gaps — Known Limits of the Test Harness

*Last updated: 2026.03.137 — assertion count updated (81→85), 8 worlds now covered, NA-63–66 added, two FCon rules violations fixed.*

The test harness (Node + `qa_named.js`) catches a lot, but has structural limits.
These are the gaps that exist and what to do about each.

---

## Gap 1 — No React render simulation (HIGH RISK)

**What it means:** `qa_named.js` is Node-based. It can parse and inspect `ui.js` as
text, but it cannot actually call `ReactDOM.render()` or execute React component
functions. A `ReferenceError` inside `CampaignApp` that only triggers during render
(e.g. `packRolling is not defined`) will pass all current assertions but crash every
campaign page in a real browser.

**What was missed:** The 2026.03.56 `packRolling is not defined` crash. The state
declaration was dropped; Node syntax checks passed; paren balance passed; the bug
only surfaced when React tried to mount the component.

**Mitigation in place:** NA-20 checks that 24 key `var X = ...` declarations exist
by string match. This is brittle (doesn't verify scope) but catches a dropped
declaration.

**Better fix:** A headless browser smoke test (Playwright or Puppeteer) that loads
each campaign page and verifies React mounts without console errors. Blocked on
network access for npm install. Add to backlog when npm is available.

---

## Gap 2 — Static source inspection only (MEDIUM RISK)

**What it means:** Assertions that check `ui.js` source text (NA-19 through NA-22)
verify presence of strings, not that those strings are in the right scope or wired
correctly. A function could be defined outside `CampaignApp` when it should be
inside, or a `useEffect` dep array could be empty when it should have deps — both
would pass the current assertions.

**What was missed:** The 2026.03.44 `renderResult()` invisible content bug. The
function existed and was "called" — but it was called in the wrong place with no
output connected to the render tree. NA-19 now checks call count (≥2) which is
a better proxy, but it's still not a runtime assertion.

**Mitigation in place:** NA-19 (renderResult call sites), NA-20 (state var names),
NA-22 (function names present).

---

## Gap 3 — No script dependency graph verification (MEDIUM RISK)

**What it means:** NA-13/14/21 check that files appear before `core/ui.js` in
HTML `<script>` tags. But they don't verify that every *symbol used* in `ui.js`
is actually *exported* by the files loaded before it. A new global used in `ui.js`
that isn't in any loaded script would crash silently.

**What was missed:** The 2026.03.36 `GENERATOR_GROUPS is not defined` crash — the
symbol was used in `ui.js` but the file that defined it wasn't included on `index.html`.

**Mitigation in place:** NA-13 checks for `campaigns-meta.js` and `shared.js`.
NA-63/64 now verify all 8 guide pages have correct worldKey and data-campaign attrs.

---

## Gap 4 — No run.html React component aria coverage check (LOW RISK)

**What it means:** run.html is 1,587 lines of React-rendered session tooling.
The static grep-based aria check (NA-65 area) cannot verify that icon-only buttons
rendered by React components carry aria-labels at runtime.

**Mitigation:** Sprint G (run.html accessibility pass) will add a minimum
aria-label count assertion once the pass is complete.

---

## Current assertion count: 85

| Range | What they cover |
|-------|----------------|
| NA-01–NA-10 | FCon rules compliance (stress, refresh, stunt cost, contest wording) |
| NA-11–NA-22 | Script load order, state declarations, function presence |
| NA-23–NA-40 | Content quality (aspect scoring, tone, sensory tags) |
| NA-41–NA-58 | World-specific data integrity (all 8 worlds) |
| NA-59 | Stunt tags present on all 196 stunts |
| NA-60 | No duplicate opposition in encounter results |
| NA-61–NA-62 | sessionzero.html + run.html load all 8 world data files |
| NA-63–NA-64 | All 8 guide pages have correct worldKey + data-campaign |
| NA-65 | run.html + character-creation.html in SW APP_SHELL |
| NA-66 | No opposition skill rating > 5 (FCon Superb cap) |

## QA command

```bash
# Full suite (85 named + 128/128 smoke)
node --check core/ui.js && node --check core/ui-landing.js && node --check core/intro.js && \
node -e "var fs=require('fs');eval(fs.readFileSync('data/shared.js','utf8'));eval(fs.readFileSync('data/universal.js','utf8'));['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(c){eval(fs.readFileSync('data/'+c+'.js','utf8'));});eval(fs.readFileSync('core/engine.js','utf8'));var errs=[],total=0;['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'].forEach(function(camp){var t=filteredTables(mergeUniversal(CAMPAIGNS[camp].tables),{});['npc_minor','npc_major','scene','campaign','encounter','seed','compel','challenge','contest','consequence','faction','complication','backstory','obstacle','countdown','constraint'].forEach(function(gen){try{var r=generate(gen,t,4);if(!r||typeof r!=='object')errs.push(camp+'/'+gen);total++;}catch(e){errs.push(camp+'/'+gen+': '+e.message);}});});console.log('Smoke: '+total+'/128  errors:'+errs.length);" && \
node devdocs/qa_named.js
```
