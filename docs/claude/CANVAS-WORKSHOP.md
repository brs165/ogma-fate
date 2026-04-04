# Canvas Workshop — Native Canvas (v662+)
# Date: March 2026 | Version: 2026.03.699

> **SvelteFlow has been replaced** with a native pointer/wheel canvas.
> All SvelteFlow-specific notes below are archived for reference only.
> Active canvas architecture is documented in `PROJECT_MEMORY.md`.

---

## Migration: SvelteFlow → Native Canvas

### Why
SvelteFlow 1.5.1 was a freight train for what we needed. D3-primitive-style pan/zoom
with a transformed `<div>` viewport is lighter, has zero Svelte-specific opinions,
and gives us direct control over card rendering.

### What changed (v662)
- `<SvelteFlow>` block replaced with `<div class="cv-wrap">` + wheel/pointer handlers
- `<Background>` replaced with CSS `radial-gradient` dot pattern
- `<Controls>` replaced with 3 plain buttons (zoom-in / zoom-out / fit)
- `<MiniMap>` replaced with CSS minimap showing scaled card rects + viewport indicator
- 4 node wrapper components deleted: `CardNode`, `StickyNode`, `BoostNode`, `LabelNode`
- `nodeTypes.js` deleted
- `@xyflow/svelte` removed from `package.json`
- `canvasStore.js`: `nodes` derived store, `edges` derived store, `syncNodePositions()` removed
- `CanvasContextMenu.svelte`: `useSvelteFlow()` / `screenToFlowPosition` replaced with
  plain math prop (`screenToCanvas`)

### What stayed the same
- `canvasStore.cards` — source of truth, unchanged
- `canvasStore.connectors` — unchanged
- All card components (BoardCard, BoardSticky, BoardBoost, BoardLabel) — unchanged
- All card front components (18) — unchanged
- All canvas features: connect mode, search dim, gmOnly, edge labels, minimap, fit, undo

---

## Canvas feature status (post-migration)

| Feature | Status |
|---------|--------|
| Pan (drag canvas) | ✅ pointer events |
| Zoom (wheel + buttons) | ✅ |
| Card drag | ✅ pointer capture with zoom compensation |
| Connectors (SVG overlay) | ✅ |
| Edge labels (click to cycle) | ✅ |
| Minimap | ✅ CSS scaled rects |
| Fit all | ✅ computes bounding box |
| Context menu (right-click) | ✅ accurate canvas coords |
| Search dim | ✅ opacity on non-matching cards |
| Connect mode visual | ✅ dashed outline + crosshair |
| NPC acted state | ✅ |
| gmOnly toggle | ✅ |
| Empty canvas hint | ✅ |
| Undo (move + delete + reroll) | ✅ |
| Ctrl+A select all | ✅ |
| Dot background | ✅ CSS only |
| Mobile / touch | ✅ pointer events work on touch |

---

## Archived: SvelteFlow sprint history

### Sprint 1–5 (v576–v660) ✅ ALL COMPLETE — superseded by v662 migration

All SvelteFlow bugs fixed, then the entire SvelteFlow layer was replaced.
Key lessons that informed the native canvas design:

- **BUG-02 (double positioning):** Cards must NOT have `left/top` on the component —
  only the positioner wrapper. Preserved in native canvas: `.cv-card-positioner` has
  `position:absolute; left:X; top:Y`, the card component itself does not.
- **BUG-03 (drag conflict):** Pointer capture in native drag must release on `pointerup`
  even if outside the element.
- **BUG-04 (ctx menu coords):** Fixed properly in native canvas — `screenToCanvas()` math
  is a pure function passed as prop, no component tree dependency.
- **BUG-07 (plain arrays):** No longer relevant — native canvas doesn't use SF node arrays.

### Completed post-migration
- **WC-02** ✅ Node groups — labelled regions with resize handles, tinted backgrounds (v670)
- **WC-05** ✅ Canvas templates — Opening Scene, Investigation, Climax, Session Zero (v670)
- **Canvas empty state** ✅ — context-aware hints for desktop/mobile, template grid (v699)
