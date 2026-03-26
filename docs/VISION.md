# Ogma — Vision

A browser-based, offline-first GM aid for Fate Condensed.
Open the tab, pick a world, generate content, run your session.

---

## What it is

Ogma generates ready-to-use tabletop RPG content for Fate Condensed GMs.
It runs entirely in the browser — no server, no account, no internet required after first load.

**Core loop:** Pick world → generate card → place on canvas → run session.

---

## Worlds

Eight campaign settings, each with world-specific tables:

| World | Genre |
|-------|-------|
| Shattered Kingdoms | Fantasy |
| Neon Abyss | Cyberpunk |
| Void Runners | Space opera |
| The Long After | Post-apocalyptic |
| The Long Road | Road post-apocalyptic |
| Gaslight Chronicles | Victorian / occult |
| Dust and Iron | Western |
| dVenti Realm | Original fantasy |

---

## Generators (17 per world)

Characters: Minor NPC, Major NPC, PC Backstory
Scenes: Scene Setup, Encounter, Complication
Pacing: Challenge, Contest, Obstacle, Countdown, Constraint
World: Campaign Frame, Adventure Seed, Faction, Compel, Consequence
Canvas: Custom Card, Aspect Sticky, Boost, Section Label

---

## Surfaces

### Prep Canvas
A freeform Svelte Flow canvas. Generate cards, arrange them spatially,
draw connections between related elements. Everything persists to IndexedDB.
Export to Markdown, JSON, or Excalidraw.

### Play Mode
Live session tracking on the same canvas. Turn bar, player FP and stress,
GM fate pool, round counter, scene management. Players can join via room code
and see the GM's canvas in read-only mode.

### Session Zero
Guided flow: pick world → set player count → generate backstories →
adventure seed → opening scene → export character pack to canvas.

---

## Technical stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit + Svelte 5.51.0 (runes) |
| Canvas | @xyflow/svelte (SvelteFlow) |
| UI primitives | bits-ui@2.16.3 |
| Persistence | Dexie 4 (IndexedDB) |
| Sync | WebSocket (PartySocket) |
| Styling | theme.css (no component styles) |
| Build | Vite 7 + adapter-static |
| Deploy | Cloudflare Pages (ogma.net) |

---

## Design principles

1. **Offline first** — works without internet after first load
2. **GM-first** — every interaction optimised for running, not building
3. **Rules accurate** — all generated content is valid Fate Condensed
4. **Zero friction** — one click generates, one click places
5. **Table-ready** — content is immediately usable, not just inspiration
