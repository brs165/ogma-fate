# Roadmap — Ogma

See `docs/claude/CANVAS-WORKSHOP.md` for the detailed canvas backlog with sprint assignments.

---

## Current version: 2026.03.579

**Stack:** SvelteKit + Svelte 5 runes + SvelteFlow + Bits UI + Dexie 4
**QA gate:** 81 `.svelte` files | 6 stores | `npm run build` passes | `qa-hard.mjs` passes

---

## Recently completed (2026.03.x series)

- Full Svelte 5 runes migration (`$state`, `$derived`, `$props` throughout)
- SvelteFlow canvas integration (pan/zoom/connect/minimap/node types)
- Bits UI adoption: Dialog, Accordion, DropdownMenu, ToggleGroup, Tooltip,
  AlertDialog, Collapsible, Select, Popover
- Play mode: Players/Generate tabs, exchange tracker, stress colour coding,
  compel modal, GM pool urgency
- Canvas: card entrance animation, empty state hint, connect mode visual,
  fitView on load, NPC acted state, clock trigger ring
- Repo cleanup: react-source removed, stale docs deleted, adapters pruned

---

## Active backlog

### Tier 1 — Fix broken things
See `docs/claude/CANVAS-WORKSHOP.md` Sprint 1 remaining items.

### Tier 2 — Missing core features
- **BL-01** localStorage schema — structured prefs object
- **BL-02** Stunt data (spec done at `docs/stunt-data-spec.md`)
- **BL-03** Victorian adjective pass — content quality
- **BL-04** QA Playwright smoke tests

### Tier 3 — Improvements
- **WC-02** Node groups (scene grouping on canvas)
- **WC-03** Edge labels (relationship types)
- **WC-04** Card minimise/expand
- **WC-05** Canvas templates
- **WC-07** Player-facing gmOnly card toggle
- **WC-08** Consequence stickies auto-placed
- **BL-06** Shareable links
- **BL-07** GM Tips depth
- **BL-08** Western world expansion

### Parked
- Session Zero Tool (design agreed, not built)
- Ogma rebrand (needs GitHub username confirmation first)
- PWA install nudge (needs BL-01 first)
- Milestone tracker panel tab (needs BL-01 first)
