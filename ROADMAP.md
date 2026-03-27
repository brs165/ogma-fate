# Roadmap — Ogma

See `docs/claude/PROJECT_MEMORY.md` for full project state and `docs/claude/CANVAS-WORKSHOP.md` for canvas backlog.

---

## Current version: 2026.03.660

**Stack:** SvelteKit + Svelte 5.55 runes + SvelteFlow 1.5.1 + Bits UI + Dexie 4 + FA 7.2 Free
**QA gate:** 81 `.svelte` files | 6 stores | 189 hard checks | 166 export checks | `npm run build` passes

---

## Recently completed (v655–v660)

- **SvelteFlow API fix (v659–660)** — "t is not iterable" crash root-caused: `flowNodes`/`flowEdges` were Svelte `writable()` stores; SvelteFlow 1.5.1 requires plain `$state([])` arrays. All `on:event` dispatchers → callback props. `multiSelectionKeyCode` → `multiSelectionKey`. Edge deletion → `ondelete` callback.
- **Deep dive learning content (v652–655)** — `/help/learn-fate-deep` with interactive tutorial (guided scene + dice rollers), play-by-post walkthrough, strategy guide (CA math, FP economy), first session checklist. Teacher voice (#7) added. Hero text updated.
- **Canvas polish sprint (v633–648)** — Ctrl+A select all, gmOnly card toggle (eye icon, 55% opacity), undo covers card moves, consequence stickies auto-placed from player tracker, bits-ui Tooltip removed from all canvas components (replaced with HTML title attrs).

## Previously completed (v600–v633)

- **BL-01** localStorage schema — 14 keys in DEFAULTS, LS.get()/LS.set() accessor, 9 files migrated
- **BL-02** Stunt data — 27 universal stunts tagged (18 canonical tags), `pickStuntsForSkills()`, 100% stunt-skill match rate
- **BL-07** GM Tips depth — 1,950→3,293 words (+69%), "Common Mistakes" + "Pairs Well With" sections
- **BL-15** Mobile nav — hamburger drawer on mobile for help wiki and marketing, campaign nav unified
- BackPanel/ClockTrack rewritten with fs-* tokens. CvLabel/CvTag deleted (82→80 components)
- QA static analysis (6 checks) + Playwright smoke tests (43 checks)

## Previously completed (v586–v600)

- **FateX-style card restyling** — all 18 card fronts + Cv4Card shell rewritten with `--fs-*` fate-sheet tokens
- **Font Awesome 7.2 Free** — ~200 emoji→FA replacements across ~45 files. Zero emoji remaining
- **Legal compliance** — Fate Condensed attribution corrected, D&D SRD 5.2.1 exact attribution, shared Footer

## Previously completed (v576–v582)

- Full Svelte 5 runes migration
- SvelteFlow canvas integration
- Bits UI adoption
- Play mode: Players/Generate tabs, exchange tracker, stress colour coding, compel modal
- Canvas: card entrance animation, connect mode, fitView on load, edge labels, card minimise

---

## Active backlog

### Tier 1 — Content & polish
- **BL-03** Victorian adjective pass — weakest world voice [S]
- **BL-08** Western world expansion [M]

### Tier 2 — Features
- **WC-02** Node groups (scene spatial grouping) [M]
- **WC-05** Canvas templates (starter scene layouts) [M]
- **BL-06** Shareable links [M]
- **BL-16** Ogma rebrand (needs GitHub username confirmation — BL-12) [M]

### Tier 3 — PDF books (remaining)
- **PDF-04** Shattered Kingdoms
- **PDF-05** Neon Abyss
- **PDF-06** Void Runners
- **PDF-07** dVenti Realm
- **PDF-08** Dust and Iron

### Parked
- Session Zero Tool (design agreed, not built)
- **BL-25** Spike — FateX Sheet Setup/Edit mode concepts [M]
- **BL-09** PWA install nudge (needs BL-01 — done) [S]
- **BL-10** Milestone tracker panel tab (needs BL-01 — done) [M]
- **BL-23** Spike — table mode [M]
- **BL-24** Spike — adventure seed AI cold open narrator [M]
