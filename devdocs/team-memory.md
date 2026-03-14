# Ogma - Team Memory

> **What this file is:** A living snapshot of the project's current state, key decisions, and accumulated knowledge. Update it at the end of significant sprints. Use it to bootstrap a fresh AI session alongside `prompts.md`.
>
> **What this file is not:** A duplicate of other docs. Architecture lives in `architecture.md`. Schemas live in `data-schema.md`. Team roles live in `virtualteamroles.md`. This file is the *"what we know right now"* layer.
>
> **Size guidance:** If this grows past ~300 lines, split off the oldest "lessons learned" into an archive section or a separate `team-memory-archive.md`. The working copy should stay fast to read.

---

## Current Project State

**Tool:** Ogma - On-demand Generator for Masterful Adventures
**Live URL:** https://brs165.github.io/ogma-fate
**Current version:** See `devdocs/BACKLOG.md` header
**Working directory:** `/home/claude/fate-suite-work/` (Claude) or project root (human)

**What exists:**
- 16 generators × 6 campaign worlds = 96 combinations, all passing QA
- Named assertions: see `qa_named.js` for current count
- VTT export: Fari/Foundry JSON + Roll20 JSON (NPC generators only)
- Batch export: `toBatchFariJSON()` — all pinned cards as one `.fari.json`
- Interactive result renderers: all 16 generators are stateful (tappable stress, contest tracks, etc.)
- RPG Awesome icon font: all sidebar and landing icons use it
- Three-tab FP panel: Fate Points / Milestones / Popcorn Initiative
- PWA install nudge, responsive intro overlay, session pack export

**Active backlog:** `devdocs/BACKLOG.md` — always the source of truth
**Version history:** `devdocs/CHANGELOG.md`
**Content authoring:** `devdocs/content-authoring.md`

---

## Architectural Decisions and Why

### Why var-only, no ES modules
`file://` compatibility on all browsers. If someone downloads the zip and opens `index.html` directly, it must work. ES modules require a server. This constraint is non-negotiable until a PWA-only decision is made.

### Why React 18 via CDN UMD (not JSX, not a bundler)
Same constraint as above. Also: no build step means no broken build, no dependency rot, no `npm install` before you can open the file.

### Why openPanel instead of 5 boolean states
Shipped in 2026.03.17. 5 boolean states (`showHelp`, `showFP`, `showHistory`, `showSettings`, `showTables`) each triggered independent re-renders. `openPanel` (null | string) consolidates to 1 state, enforces the mutual-exclusion constraint structurally, and cuts the keyboard handler dependency array from 7 items to 3.

### Why will-change: filter (not transform) on backdrop-filter elements
`backdrop-filter` lives in the filter compositor, not the transform compositor. Promoting with `will-change: transform` was promoting to the wrong plane. Only `.topbar`, `.sidebar`, and `.modal-overlay` get `will-change: filter` — applying it to all 25 backdrop-filter elements would exhaust GPU memory on mobile.

### Why devdocs/ for BACKLOG, CHANGELOG, bump-version.sh
These are development artifacts, not product files. Moved in 2026.03.18 to keep the project root clean. The root `bump-version.sh` is a thin forwarder — existing scripts and habits still work.

### Why the content injection IIFE pattern for table additions
```js
(function() { var t = CAMPAIGNS.cyberpunk.tables; t.key = t.key.concat([...]); })();
```
Appending via IIFE at the bottom of data files keeps the original arrays intact for diffing and attribution. Direct modification of the main object literal makes it hard to see what was added.

### Why `sessionStorage` for Popcorn Initiative (not IDB or localStorage)
Popcorn Initiative is session-only state — it should reset when the GM closes the browser. `sessionStorage` persists across FP panel open/close within a tab (solving the annoyance) but clears on tab close (which is the right behaviour for at-table use).

---

## The Rules We Keep Relearning

### "Breakthrough" is not a Fate Condensed term
Fate Condensed uses "minor milestone" (end of session) and "major milestone" (end of arc). "Breakthrough" entered from early project documentation and kept bleeding back. BL-29 and BL-41 each cleaned up a wave of instances. Run this check before any release:
```bash
grep -rn "breakthrough\|Breakthrough" data/ core/ui.js learn.html campaigns/ --include="*.js" --include="*.html"
```
The only acceptable remaining instances are: (a) `data/postapoc.js` military-breach usage, (b) `devdocs/about.html` label explicitly calling it wrong.

### Fate Core stress boxes vs Fate Condensed
Fate Core: escalating-value boxes [1][2][3]. Fate Condensed: all 1-point boxes. Our `stressFromRating(r)` returns a *count* of 1-point boxes. External reviewers have confused count with value twice. NA-01 and NA-03 guard against regressions.

### "Significant Milestone" is also not a Fate Condensed term
That's a Fate Core concept. NA-06 checks for it in generator output.

### The campName bug pattern
If a function receives `campName` as a prop but the call site passes `campName: campName` where the variable is out of scope, you get a silent undefined. This caused a ShareDrawer crash. Always verify variable scope before referencing in JSX-equivalent props.

---

## Key Personas (for UX decisions)

| Name | Type | Primary need |
|------|------|-------------|
| Marcus | D&D Convert | Stress/HP translation help; D&D contrast notes |
| Sarah | Solo GM | Speed; VTT export; minimal friction |
| Elena | Narrative Veteran | Table customisation; rules accuracy |
| Kenji | Mobile Player | At-table use; 44px touch targets; fast state |

---

## Open Decisions

| Decision | Status | Deadline |
|----------|--------|----------|
| OG meta URL (GitHub username/repo) | RESOLVED: brs165/ogma-fate | - |
| BL-12 (OG meta URLs) | SHIPPED 2026.03.16 | - |
| Parking Lot review (BL-02, BL-05, BL-08, BL-11, PL-01/02/03) | Pending | 2026.09.01 |
| Stunt generator chain (BL-02/05/11) | Parked | 2026.09.01 |
| Build toolchain migration (PL-03) | Parked — breaks file:// compat | 2026.09.01 |
| Analytics (R-14) | Permanently closed — product decision | - |
| Western campaign world (BL-08) | Parked — highest-impact content if capacity | 2026.09.01 |

---

## What the Tool Does NOT Do (hard constraints)

- No AI in the output — pure random tables
- No server — fully offline after first load
- No build step — raw JS, React 18 CDN UMD
- No ES modules — `var` only for `file://` compatibility
- No analytics — product decision, permanently closed
- No collaborative multi-GM mode — needs server/CRDT, out of scope

---

## Campaign Voice Quick Reference

| World | ID | One-line voice |
|-------|----|----------------|
| The Long After | `thelongafter` | Elegiac, mythic; nostalgia is the danger |
| Neon Abyss | `cyberpunk` | Transhumanist anxiety; chrome is a leash |
| Shattered Kingdoms | `fantasy` | Wound-lore; magic is scar tissue |
| Void Runners | `space` | Blue-collar solidarity; ship payment due |
| The Gaslight Chronicles | `victorian` | Horror in the implication, not the reveal |
| The Long Road | `postapoc` | Lyrical loss; the question is what you build |

---

## File Locations Quick Reference

| What | Where |
|------|-------|
| Generator logic | `core/engine.js` |
| All React components | `core/ui.js` |
| Campaign data (6 files) | `data/[campaign].js` |
| Shared data + HELP_CONTENT | `data/shared.js` |
| Universal tables | `data/universal.js` |
| Design system | `assets/css/theme.css` |
| Named assertions | `qa_named.js` (project root) |
| Release bump | `devdocs/bump-version.sh` (forwarded from root) |
| Active backlog | `devdocs/BACKLOG.md` |
| Version history | `devdocs/CHANGELOG.md` |
| Team prompts | `devdocs/prompts.md` |
| Content authoring | `devdocs/content-authoring.md` |
| Architecture | `devdocs/architecture.md` |
| Data schemas | `devdocs/data-schema.md` |
| Team roles | `devdocs/virtualteamroles.md` |
| Glass design for static pages | `devdocs/liquid-glass-static-pages.md` |

---

*Update this file at the end of significant sprints or when a key decision is made.*
*If it grows past 300 lines, split the oldest content to `team-memory-archive.md`.*
