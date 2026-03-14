# Ogma Developer Documentation

> This folder contains deep technical and team documentation for the Ogma project. It is not linked from the tool itself - it exists for contributors, maintainers, and anyone reconstituting the development team.

---

## Documents in this folder

### [`liquid-glass-static-pages.md`](./liquid-glass-static-pages.md)
**How to apply the Liquid Glass design language to text-heavy pages.**

Page-by-page recommendations for About, Quick-Start Guide, License, and Campaign Guides. Covers the core tension between the glass aesthetic and prose legibility, the three governing rules, correct vs. incorrect glass usage patterns, the type hierarchy for static pages, specular highlight scoping, and print CSS requirements. Reference this before adding any visual treatment to a documentation page.

### [`BACKLOG.md`](./BACKLOG.md)
**Active backlog - source of truth for all planned work.**

Tier 1 (ship next sprint), Tier 2, Tier 3, Parking Lot, and Completed. Updated every sprint. Moved here from the project root in 2026.03.18. The root `BACKLOG.md` is now a stub pointing here.

### [`CHANGELOG.md`](./CHANGELOG.md)
**Complete version history from pre-v31 through current.**

Reverse-chronological. Each entry covers one released version with a summary of what shipped and why. Moved from project root in 2026.03.18.

### [`content-authoring.md`](./content-authoring.md)
**How to add table entries and create new campaign worlds.**

Practical step-by-step guides: adding entries to existing tables, the content injection IIFE pattern, the full 9-step process for adding a new campaign world, Table Manager behaviour, and the content quality checklist. Supersedes the deleted `CONTRIBUTING.md`.

### [`team-memory.md`](./team-memory.md)
**Living project memory - current state, key decisions, open items.**

The "what we know right now" layer. Use alongside `prompts.md` to bootstrap a fresh AI session. Contains: current project state, architectural decision rationale, rules we keep relearning, key personas, open decisions, and a file location quick reference. Update at the end of significant sprints. Split off oldest content to `team-memory-archive.md` if it exceeds ~300 lines.

### [`prompts.md`](./prompts.md)
**How to recreate the development team.**

Contains the master system prompt for a new AI session, role-specific prompts for specialist work, working conventions, lessons learned the hard way, and a quick-reference for file locations and one-liner commands. Start here if you're picking up the project fresh.

### [`virtualteamroles.md`](./virtualteamroles.md)
**Who does what, and how.**

Defines all eight specialist roles on the virtual team: Rules Expert, Senior JS Developer, Content Designer, UX Researcher, CSS/Design Engineer, QA Engineer, Accessibility Specialist, and Infrastructure Engineer. Includes each role's domain, conduct rules, and voice. Also covers how the team handles disagreements, external audits, and decision-making.

### [`data-schema.md`](./data-schema.md)
**Complete schema definitions for all data files.**

TypeScript-style interfaces for every table type, object type, and generator result shape. Includes the Variety Matrix pattern, VarietyMatrix schema, UNIVERSAL injected keys, all 16 generator output shapes, and the Engine API surface. Use this as a reference when authoring content or building tooling.

### [`architecture.md`](./architecture.md)
**Technical deep-dive.**

Covers the execution model (no build step, script load order, global namespace), data flow from Roll click to rendered result, React patterns for the UMD build, the Liquid Glass design system, Pattern G layout structure, IndexedDB persistence, service worker strategy, VTT export architecture, versioning, and the full QA battery.

---

## Quick orientation

If you're new to the project, read in this order:

1. `README.md` (project root) - what Ogma is and how it works
2. `devdocs/team-memory.md` - current state and key decisions at a glance
3. `devdocs/content-authoring.md` - how to add table content and new campaigns
4. `devdocs/architecture.md` - how the code is structured
5. `devdocs/data-schema.md` - what all the data types look like
6. `devdocs/virtualteamroles.md` - who does what on the team
7. `devdocs/prompts.md` - how to reconstitute the team with an AI collaborator

---

## Project state as of 2026.03.12

- **16 generators** × **6 campaign worlds** = 96 combinations, all passing QA
- **2 VTT export formats**: Fari/Foundry JSON and Roll20 attribute JSON (NPC generators only)
- **Interactive result renderers**: all 16 generators have stateful UI (tappable stress, contest tracks, etc.)
- **Liquid Glass UI**: Pattern G layout (sidebar + topbar), dark/light modes, print-ready
- **Rules-accurate**: audited against Fate Condensed SRD - stress model, milestone terminology, stunt rules all correct

Current highest-priority backlog items:
- **BL-07**: GM Tips depth pass - invoke/compel examples for all 16 generators
- **BL-26**: Content verbosity pass - 224 trouble/weakness entries exceed 12 words
- **BL-34**: fate-srd.com deep links in HelpModal
- **BL-10**: Milestone & advancement tracker (session-only tab in FP panel)

Parking Lot review date: **2026.09.01**

---

*Last updated: see devdocs/CHANGELOG.md*
