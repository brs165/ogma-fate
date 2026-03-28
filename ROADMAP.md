# Roadmap — Ogma

See `docs/claude/PROJECT_MEMORY.md` for full project state and `docs/claude/TEAM-VOICES.md` for workshop voices.

---

## Current version: v2026.03.699

**Stack:** SvelteKit + Svelte 5.51.0 runes + native canvas (OgmaCanvas.svelte) + Bits UI 2.16.3 + Dexie 4 + FA 7.2 Free
**QA gate:** 76 `.svelte` files (48 components + 28 routes) | 3 stores | 189 hard checks | 166 export checks

---

## Strategic direction

Ogma is **Learn + Generate + Table** — not a VTT. The moat is Fate-native generation and spatial prep that no other tool does well. Online play is solved elsewhere.

**Pillars:**
- **Learn** — interactive tutorials, D&D-to-Fate transition, at-table reference
- **Generate** — 17 generators across 8 worlds, world-flavoured content
- **Table** — spatial canvas for GM prep, draggable cards, connectors

---

## Sprint 7 ✅ DONE — Doc + Divider + Tooltip + SZ flow (v668)

- [x] TEAM-VOICES.md rewritten for current stack
- [x] ROADMAP.md updated with full sprint plan
- [ ] Split layout drag-to-resize (pointer events on `.cp-divider`, localStorage persist) — deferred
- [ ] OgmaTooltip wired to 8 key educational touchpoints — deferred
- [x] Session Zero Done step → "→ Send All to Table" button

---

## Content & polish backlog

- **BL-03** Victorian adjective pass — `data/victorian.js` [S]
- **BL-08** Western world depth — `data/western.js` [M]

---

## Sprint 9 ✅ DONE — Canvas features (v670)

- **WC-05** Canvas templates — Opening Scene, Investigation, Climax, Session Zero
- **WC-02** Node groups — labelled regions with resize handles and tinted backgrounds

---

## Sprint 10 — PDF world books (v671–v675)

**Goal:** Every world has a print-ready digest.

Pattern: `reportlab --break-system-packages`, 6×9 digest, world palette accent colour,
Evil Hat Worlds of Adventure layout. Scripts rebuilt each session from pattern.

Shipped: The Long Road (35pp, v648), The Long After (40pp, v651), The Gaslight Chronicles (49pp, v654)

- **PDF-04** Shattered Kingdoms (dark fantasy)
- **PDF-05** Neon Abyss (cyberpunk)
- **PDF-06** Void Runners (space western)
- **PDF-07** dVenti Realm (high fantasy)
- **PDF-08** Dust and Iron (frontier western)

---

## Sprint 11 ✅ DONE — Polish pass (v671)

**Goal:** Everything feels finished.

- **BL-07b** GM Tips depth — second pass on 3 weakest generators
- **WC-06** Canvas minimap — toggle show/hide, click to pan
- **WC-07** Card stacking — drag card onto another to form a stack, click to fan
- Help wiki — at-the-table quick reference card (single printable page)
- WCAG 2.1 AA audit — verify all Bits upgrades pass with assistive technology

---

## Completed

### v2026.03.699 — Onboarding system (25 recommendations)
- Progressive onboarding: welcome banner, coach marks, first-roll guidance
- Contextual HelpPanel auto-expands section matching active generator
- Quick Start summaries on all 8 help pages
- Web Share API on Learn Fate guide
- Mobile FAB hint toast, canvas template grid in gen-column
- Context-aware empty state for embedded canvas
- Session Zero handoff retry (replaced fixed timeout)
- autoGuidance reactive via `$effect`
- Mobile-responsive onboarding CSS with safe-area-inset support

### v2026.03.691 — Code audit (8 fixes)
- Character creation infinite loop fix (immutable array rebuild)
- Export selection reset on card change
- Event listener leak in reduced-motion handler
- Debounced store persistence (was writing on every keystroke)
- Math.min/max stack overflow with large arrays
- Mobile table rewrite: single-Board architecture
- Duplicate CSS blocks removed

### v2026.03.680 — Svelte 5 runes compliance audit
- `void` dependency hacks removed, sync `$effect` anti-patterns → `$derived`
- `$state.raw` adopted for wholesale-replaced objects
- `tick()` replaces `setTimeout(..., 0)`

### v2026.03.665–667 — Strategic pivot + Bits UI + delight pass
- Play/binder/sync removed (syncStore, playStore, binderStore, 9 components)
- 50/50 split layout: generator | Table, always both visible
- Board `embedded` prop, `sendToTable()` exported
- Direct → Table button on every generator result
- DicePanel rebuilt: card UI, draggable, modifier strip, Fate die faces, haptic
- FatePointTracker: fd-card shell, draggable, Bits Tabs
- Bits Checkbox → StressRow, ClockTrack
- Bits Tabs → LeftPanel + ScrollArea, FatePointTracker
- Bits AlertDialog → Board Clear Table
- Bits RadioGroup → ExportPanel, DicePanel
- Bits Collapsible → Campaign sidebar accordion, Backstory write-ins
- Bits Progress → Session Zero wizard
- OgmaTooltip.svelte component created
- 51 `title=` → `aria-label` conversion across board components
- FP dots → `<button aria-pressed>`
- Canvas card hover lift shadow, seed pack stagger, skill bars, contest victory pop,
  scene free-invoke spend toggle, encounter interactive stress, dice result animations,
  mobile haptic vibration

### v2026.03.662–664 — Native canvas migration
- SvelteFlow removed; OgmaCanvas.svelte (~250 lines) with pointer pan/zoom
- Card width 646px, auto height; CSS transform on cv-viewport
- connectors as SVG overlay; minimap as scaled CSS rects

### v2026.03.600–660 — Foundation
- FateX card restyling (all 18 fronts, fs-* tokens)
- Font Awesome 7.2 Free (~200 emoji replacements)
- Legal compliance (Fate Condensed attribution)
- Deep dive learning content, Teacher voice
- Canvas polish: gmOnly, undo, consequence stickies, Ctrl+A

---

## Future sprints (parked)

### Rules Correctness
6 targeted FCon compliance fixes: stress rule (p.35), consequence timing (p.37),
concede timing (p.36), Create Advantage tie (p.19), boost rules (p.23), PC stress slots (p.12).

### Just-in-Time Help
Persistent help strip, "?" button on canvas cards as floating aside, OgmaTooltip pass on
card elements (compel badges, challenge skill+difficulty, countdown trigger, contest track).

### Interactive Learning
`/help/workshop` — 8 scenario exercises with choices + FCon citations.
`/help/mistakes` — 20 common Fate errors with D&D comparison + mid-session fixes.

### Content Quality + Navigation
Expand `how-to-use-ogma`, cross-links between generators, client-side help search.

---

## PDF Backlog (parked ~2 months)

- **PDF-04** Shattered Kingdoms
- **PDF-05** Neon Abyss
- **PDF-06** Void Runners
- **PDF-07** dVenti Realm
- **PDF-08** Dust and Iron
