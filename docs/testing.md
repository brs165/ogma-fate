# Testing — Ogma

## QA gate (run before every delivery)

```bash
node scripts/qa-hard.mjs    # Must exit 0 — content + engine checks
node scripts/qa-export.mjs  # Must exit 0 — export round-trip checks
npm run build               # Must print "✔ done"
```

---

## qa-hard.mjs checks

- Campaign registry: 8 worlds registered
- Table keys complete: all required table keys present per world
- Smoke test: generate() succeeds for all 17 generators × 8 worlds
- NPC major fields: name, aspects, skills, stress present
- NPC minor fields: name, aspect, weakness present
- PC fields: high concept, trouble, aspects present
- Aspect not undefined: no raw `undefined` in generated aspects
- Skills in FCon list: only valid Fate Condensed skills used
- Pick tables non-empty: all random tables have at least 1 entry
- No raw undefined: no `undefined` string in any generated output
- Aspect word count: warn if outside 3–8 words (error if >15)

## qa-export.mjs checks

- Export round-trip: save → reload → parse produces same structure
- JSON format: valid ogma JSON schema
- Markdown format: valid markdown with correct headings
- Card titles preserved through export

---

## Manual smoke checklist (post-deploy)

```
[ ] Landing page loads
[ ] World picker works — navigate to /campaigns/fantasy
[ ] Left panel generator list visible
[ ] Click generator → card appears on canvas
[ ] Space bar → generates card
[ ] Drag card → position persists on reload
[ ] Right-click canvas → context menu appears at cursor
[ ] Context menu generate → card at click position
[ ] Prep ↔ Play mode switch works
[ ] Play mode: add player → appears in left panel
[ ] Play mode: stress boxes toggle
[ ] Play mode: FP +/− works
[ ] Round counter increments
[ ] Undo (Ctrl+Z) restores deleted card
[ ] Export → Markdown download works
[ ] Service worker registers (Application tab)
[ ] Offline: reload after network off → app still loads
```

---

## Known test gaps

**Gap 1 — No browser render tests**
QA scripts run in Node.js and test the engine/data layer only. Component render
errors, Svelte 5 reactivity bugs, and SvelteFlow integration issues are not
caught by the automated gate. Manual smoke testing is required after every
significant component change.

**Planned fix:** Playwright headless smoke tests (backlog BL-04).

**Gap 2 — No multiplayer integration tests**
WebSocket sync (PartySocket) is untested in CI. The sync protocol is tested
manually with two browser tabs.

**Gap 3 — No visual regression tests**
CSS changes can break layout without failing QA. Manual visual review required.

---

## Svelte 5 specific issues to watch

- `$state()` inside function bodies — silent bug, UI stops updating
- `flowNodes`/`flowEdges` must stay as `writable()` — if changed to `$state`, cards disappear
- `$derived()` re-runs on every dependency change — avoid expensive operations
- Store subscriptions in `initStores()` must clean up in `unsubs` array

---

## Content quality scoring

Mechanical Auditor scores generated content on 5 axes (1–10 each):
- **Voice** — sounds like the world
- **Narrative** — immediately usable at table
- **Mechanical** — FCon-valid stats and aspects
- **Polish** — no artifacts, no truncation, no duplicates
- **Pacing** — gives GM something to act on now

Target: average ≥ 7 across all generators for a world to ship.
