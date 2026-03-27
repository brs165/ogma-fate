# Roadmap — Ogma

See `docs/claude/PROJECT_MEMORY.md` for full project state and `docs/claude/TEAM-VOICES.md` for workshop voices.

---

## Current version: v2026.03.677

**Stack:** SvelteKit + Svelte 5.55 runes + native canvas (OgmaCanvas.svelte) + Bits UI 2.16.3 + Dexie 4 + FA 7.2 Free
**QA gate:** 72 `.svelte` files (45 components + 27 routes) | 3 stores | 189 hard checks | 166 export checks

---

## Strategic direction

Ogma is **Learn + Generate + Table** — not a VTT. The moat is Fate-native generation and spatial prep that no other tool does well. Online play is solved elsewhere.

**Pillars:**
- **Learn** — interactive tutorials, D&D-to-Fate transition, at-table reference
- **Generate** — 17 generators across 8 worlds, world-flavoured content
- **Table** — spatial canvas for GM prep, draggable cards, connectors

---

## Sprint 7 — In progress (v668)

### 7a — Doc + Divider + Tooltip + SZ flow
- [x] TEAM-VOICES.md rewritten for current stack
- [x] ROADMAP.md updated with full sprint plan
- [ ] Split layout drag-to-resize (pointer events on `.cp-divider`, localStorage persist)
- [ ] OgmaTooltip wired to 8 key educational touchpoints
- [ ] Session Zero Done step → "→ Send All to Table" button

---

## Sprint 8 — Content quality (v669)

**Goal:** Every world feels hand-crafted, not procedurally flat.

- **BL-03** Victorian adjective pass — `data/victorian.js`
  Replace generic adjectives with: unwholesome, peculiar, atmospheric, uncanny,
  lurid, grotesque, mesmeric, vaporous, spectral, insalubrious
- **BL-08** Western world depth — `data/western.js`
  Expand NPC tables, add frontier-specific stunts, deepen location descriptions
- **Consequence card** — recovery timing display
  Add severity → timing lookup: Mild=end scene, Moderate=end session, Severe=end arc
- **Empty Table canvas** — ghost call-to-action state when 0 cards
  Faded example card + "Roll something and send it here →" instruction label

---

## Sprint 9 ✅ DONE — Canvas features (v670)

**Goal:** The Table becomes a proper spatial workspace.

- **WC-05** Canvas templates — starter scene layouts
  One-click drops a pre-formed layout: Opening Scene (scene + 2 NPCs + countdown),
  Investigation (scene + faction + complication + obstacle),
  Climax (encounter + contest + boost × 2)
  Accessible via context menu + command palette
- **WC-02** Node groups — scene container
  Drag a resize handle to create a labelled region that visually groups cards
  Cards inside inherit a tinted background from the region colour
  Double-click region label to rename

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

## Sprint 16 — Rules Correctness (v676) ← NEXT

**6 targeted fixes, zero new features. FCon compliance.**

1. Reference card (`/help/reference`): fix stress rule — "mark as many 1-point boxes as needed to absorb shifts" (FCon p.35), not "highest single box" (that's Fate Core)
2. Consequence tooltip + reference card: Mild clears at end of *next* scene after treatment, not same scene (FCon p.37)
3. `learn-fate` + `at-the-table`: add concede timing — must be *before* opponent rolls (FCon p.36)
4. `fate-mechanics` + HELP_CONTENT: Create Advantage tie result — aspect created but *no* free invoke (FCon p.19)
5. HELP_CONTENT.boost + BoardBoost: "cannot be compelled, cannot be refused, one free invoke then gone" (FCon p.23)
6. PC generator consequence display: second Mild slot at Superb+ Physique/Will (FCon p.12)

---

## Sprint 17 — Just-in-Time Help System (v677)

**Embedded, zero-friction help at point-of-use. No new routes.**

1. Persistent help strip: `rhp-*` reference panel stays visible after rolling (collapsible, not disappearing)
2. "?" button on canvas cards → opens BackPanel as floating aside, not modal
3. OgmaTooltip pass on remaining card elements:
   - Compel card template type badges (event/decision)
   - Challenge card skill+difficulty display
   - Countdown trigger label
   - Contest victory track label
4. BoardBoost: "Cannot be compelled" tooltip on aspect text

---

## Sprint 18 — Comprehensive Learning Surface (v678–679)

**New `/help/workshop` route — 8 interactive scenario exercises.**

Each scenario: 150-word setup + 3 labeled choices + accordion reveal with FCon citation.

| # | Topic |
|---|-------|
| 1 | Fiction first — "I roll Athletics" |
| 2 | Create Advantage vs Attack — enemy in cover |
| 3 | Compel timing — when to offer the FP |
| 4 | Concede vs taken out — the difference |
| 5 | Aspects are true — can they do it? |
| 6 | FP economy — GM pool is empty |
| 7 | Consequence recovery — is it gone next session? |
| 8 | Challenge vs Conflict — burning building escape |

**New `/help/mistakes` route — 20 most common Fate errors.**

Each: what people do → why it feels right (D&D) → what FCon actually says (with page) → mid-session fix.

---

## Sprint 19 — Content Quality + Navigation (v680)

1. Expand `how-to-use-ogma` from 50 lines to full workflow walkthrough
2. Cross-links: every generator help panel gets "Try this generator →" button
3. Client-side search across all help content
4. `learn-fate` deep-link audit: steps link to relevant mechanics pages
5. `/help` index: "Start here" onboarding banner for first-time visitors

---

## PDF Backlog (parked ~2 months)

- **PDF-04** Shattered Kingdoms
- **PDF-05** Neon Abyss
- **PDF-06** Void Runners
- **PDF-07** dVenti Realm
- **PDF-08** Dust and Iron
