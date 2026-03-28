# Testing — Ogma

## QA gate (run before every delivery)

```bash
node scripts/qa-hard.mjs    # Must exit 0 — 189 content + engine + static analysis checks
node scripts/qa-export.mjs  # Must exit 0 — export round-trip checks
node scripts/qa-unit.mjs    # Must exit 0 — engine.js unit tests
npm run build               # Must print "✔ done"
```

---

## qa-hard.mjs checks (189 checks)

- Campaign registry: 8 worlds registered
- Table keys complete: all required table keys present per world
- Smoke test: generate() succeeds for all 17 generators × 8 worlds (136 combos)
- NPC major fields: name, aspects, skills, stress present
- NPC minor fields: name, aspect, weakness present
- PC fields: high concept, trouble, aspects present
- Aspect not undefined: no raw `undefined` in generated aspects
- Skills in FCon list: only valid Fate Condensed skills used
- Pick tables non-empty: all random tables have at least 1 entry
- No raw undefined: no `undefined` string in any generated output
- Stunt data valid: all stunt objects have required fields
- Svelte 5 static analysis: no legacy patterns in components
- Aspect word count: warn if outside 3–8 words (error if >15)

## qa-export.mjs checks

- Export round-trip: save → reload → parse produces same structure
- JSON format: valid ogma JSON schema (`format: 'ogma'`)
- Markdown format: valid markdown with correct headings
- Card titles preserved through export
- Forbids legacy keys: `ogma`, `cards`, `type`

## qa-unit.mjs checks

- Node-based unit tests for engine.js generator logic
- Tests all generator types produce valid output
- No browser required

## qa-smoke.mjs (Playwright)

- Browser-based smoke tests via Playwright headless Chromium
- Starts local preview server on port 4174
- Tests 25+ routes for JS errors and runtime crashes
- Catches infinite loops, nav timeouts that static analysis misses
- Requires: `npx playwright install chromium`

---

## Manual smoke checklist (post-deploy)

```
[ ] Landing page loads
[ ] World picker works — navigate to /campaigns/fantasy
[ ] Sidebar generator list visible
[ ] Click generator → card appears in result panel
[ ] Space bar → generates result
[ ] Send to Table → card appears on canvas
[ ] Drag card → position persists on reload
[ ] Right-click canvas → context menu appears at cursor
[ ] Context menu generate → card at click position
[ ] Canvas templates → Opening Scene template drops 4 cards
[ ] Export → JSON download works
[ ] Service worker registers (Application tab)
[ ] Offline: reload after network off → app still loads
[ ] Mobile: Table FAB opens bottom sheet
[ ] Mobile: Welcome banner wraps cleanly on small screen
[ ] Session Zero wizard → Send All to Table → cards land on canvas
```

---

## Known test gaps

**Gap 1 — No multiplayer integration tests**
WebSocket sync (PartySocket) is untested in CI. The sync protocol is tested
manually with two browser tabs.

**Gap 2 — No visual regression tests**
CSS changes can break layout without failing QA. Manual visual review required.

---

## Svelte 5 specific issues to watch

- `$state()` inside function bodies — silent bug, UI stops updating
- `$derived()` re-runs on every dependency change — avoid expensive operations
- Store subscriptions in `initStores()` must clean up in `unsubs` array
- `$effect` that reads and writes the same state → infinite loop

---

## Content quality scoring

Mechanical Auditor scores generated content on 5 axes (1–10 each):
- **Voice** — sounds like the world
- **Narrative** — immediately usable at table
- **Mechanical** — FCon-valid stats and aspects
- **Polish** — no artifacts, no truncation, no duplicates
- **Pacing** — gives GM something to act on now

Target: average ≥ 7 across all generators for a world to ship.
