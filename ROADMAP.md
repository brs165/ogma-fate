# Roadmap — Ogma

See `docs/claude/PROJECT_MEMORY.md` for full project state and `docs/claude/CANVAS-WORKSHOP.md` for canvas backlog.

---

## Current version: 2026.03.652

**Stack:** SvelteKit + Svelte 5 runes + SvelteFlow + Bits UI + Dexie 4 + FA 7.2 Free
**QA gate:** 82 `.svelte` files | 6 stores | 187 hard checks | 166 export checks | `npm run build` passes

---

## Recently completed (v586–v600)

- **FateX-style card restyling** — all 18 card fronts + Cv4Card shell rewritten with `--fs-*` fate-sheet tokens. Off-white `#F5F0E8` body, campaign-tinted gradient headers, FateX five-aspect layout on character cards, skill ladder with rating badges, stress tracks, consequence slots. All interactions preserved.
- **Font Awesome 7.2 Free** — ~200 emoji→FA replacements across ~45 files. Zero emoji remaining. CDN via jsDelivr, cached by SW for offline.
- **Legal compliance** — Fate Condensed attribution corrected (Lara Turner, fate-srd.com canonical text). D&D SRD 5.2.1 exact required attribution. Shared Footer.svelte on all pages.
- **About page** updated — 17 generators, 136 combinations, 187 QA checks, Cloudflare Pages.

## Previously completed (v576–v582)

- Full Svelte 5 runes migration (`$state`, `$derived`, `$props` throughout)
- SvelteFlow canvas integration (pan/zoom/connect/minimap/node types)
- Bits UI adoption: Dialog, Accordion, DropdownMenu, ToggleGroup, Tooltip, AlertDialog, Collapsible, Select, Popover
- Play mode: Players/Generate tabs, exchange tracker, stress colour coding, compel modal, GM pool urgency
- Canvas: card entrance animation, empty state hint, connect mode visual, fitView on load, NPC acted state, clock trigger ring
- Repo cleanup: react-source removed, stale docs deleted, adapters pruned

---

## Active backlog

### Tier 1 — Polish card restyling
- BackPanel (GM guidance back-face) audit — may still use old `--cv-card-*` tokens
- Canvas integration check — verify fs-card inside SvelteFlow nodes at various zoom
- Export formats (Markdown/print/PDF) — update formatting for new card layout
- CvLabel/CvTag — orphaned components, candidates for deletion
- **BL-03** Victorian adjective pass — weakest world voice

### Tier 2 — Features & content
- **BL-01** localStorage schema — structured prefs object
- **BL-02** Stunt data (spec done at `docs/stunt-data-spec.md`)
- **BL-07** GM Tips depth
- **BL-08** Western world expansion
- **BL-15** Mobile nav overhaul spike
- **WC-02** Node groups (scene grouping on canvas)
- **WC-05** Canvas templates
- **WC-07** Player-facing gmOnly card toggle
- **WC-08** Consequence stickies auto-placed
- **PREP-06** Undo covers card moves
- **PREP-08** Ctrl+A select all nodes

### Parked
- Session Zero Tool (design agreed, not built)
- Ogma rebrand (needs GitHub username confirmation first)
- **BL-25** Spike — FateX Sheet Setup/Edit mode concepts for canvas, Session Zero, Character Creation [M]
- **BL-06** Shareable links
- **BL-09** PWA install nudge (needs BL-01 first)
- **BL-10** Milestone tracker panel tab (needs BL-01 first)
