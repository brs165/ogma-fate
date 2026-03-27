# Roadmap — Ogma

See `docs/claude/PROJECT_MEMORY.md` for full project state.

---

## Current version: 2026.03.665

**Stack:** SvelteKit + Svelte 5.55 runes + native canvas (OgmaCanvas.svelte) + Bits UI + Dexie 4 + FA 7.2 Free
**QA gate:** 78 `.svelte` files | 3 stores (canvas, session, chrome) | 189 hard checks | 166 export checks

---

## Strategic direction (March 2026)

Ogma is **Learn + Generate + Table** — not a VTT. Online play is a solved problem (Foundry, Roll20, Owlbear). What nobody does well is Fate-native generation and spatial prep. That is the moat.

**Removed:** PartyKit/CloudFlare sync, Play mode, Binder, TurnBar, CombatTracker, PlayPanel, PlayerRow, PlayerSurface
**Focused on:** generators, the Table canvas, the dice roller, and learning content

---

## Active sprint backlog (committed)

### Sprint 1 ✅ DONE — Deletions + Table rename
- Deleted: syncStore, playStore, binderStore, 9 components
- Board.svelte: 824 → 381 lines, play/binder/sync removed
- Topbar: mode toggle, sync controls, binder button removed. "Table" label added.
- canvasStore: loadBinderToCanvas + play canvas guard removed
- DossierModal, OgmaCanvas, ExportMenu: dead props stripped

### Sprint 2 — 50/50 split layout (Generator | Table)
- Campaign page: left = generator result, right = Table canvas, draggable divider with snap points (30/70, 50/50, 70/30, 0/100)
- Split ratio persisted per world in localStorage
- Full-table button collapses generator panel, table fills content area
- Mobile: generator fills screen, Table accessible via "◈ Table" bottom-sheet (80vh, swipe to dismiss)
- Campaign.svelte + Board.svelte merge into unified WorldPage layout — no canvasView boolean toggle

### Sprint 3 — Direct generation → Table
- Every generator result card gets "→ Table" button
- Direct send to canvas at smart grid position (no binder staging)
- Session Zero: cards send directly to Table
- Roll history panel: every past result has "→ Table" action

### Sprint 4 — Dice roller rebuild (card UI + draggable + modifiers)
- DicePanel.svelte rewritten with fd-card visual treatment
- Draggable by header strip (pointer-capture, same pattern as canvas cards)
- Modifier strip: tap +2 buttons (invoke = +2), stacks, running total shown
- Skill ladder: tap-to-select (Mediocre +0 through Epic +7), world-labelled
- Result: 4 Fate die faces (SVG +-0), shift number, ladder label, outcome tag
- Collapse button: folds to header strip only
- Roll history strip: last 5 rolls, dismissable

### Sprint 5 — FatePointTracker card treatment
- FatePointTracker.svelte gets fd-card shell (same visual as canvas cards)
- Draggable floater by header
- Simplified: single GM pool counter + per-PC optional tracking
- No player roster required — pool sets at session start manually

---

## Remaining content backlog

- **BL-03** Victorian adjective pass [S]
- **BL-08** Western world content depth [M]
- **WC-02** Node groups — scene spatial grouping [M]
- **WC-05** Canvas templates — starter scene layouts [M]
- **PDF-04–08** Shattered Kingdoms, Neon Abyss, Void Runners, dVenti Realm, Dust and Iron

---

## Recently completed

- **v662–664** Native canvas migration — SvelteFlow removed, OgmaCanvas.svelte, 646px cards, full-screen fixed layout, back button callback
- **v660** SvelteFlow API fix — flowNodes/flowEdges plain $state arrays
- **v652–655** Deep dive learning content, Teacher voice
- **v633–648** Canvas polish — gmOnly toggle, undo moves, consequence stickies, Ctrl+A
- **v600** FateX card restyling — all 18 fronts with fs-* tokens
- **v593** Font Awesome 7.2 Free — ~200 emoji replacements
- **v586** Legal compliance — attribution corrected
