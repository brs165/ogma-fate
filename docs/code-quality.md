# Code Quality — Ogma

## Guiding principle

This is a GM tool. Code quality directly affects how fast a GM can respond
mid-session. Slow renders, broken interactions, and unclear code paths all
hurt real people at real tables.

---

## Svelte 5 patterns

### State — always `$state()`
Every mutable local variable must use `$state()`:
```js
let open = $state(false);
let cards = $state([]);
let result = $state(null);
```

Never plain `let` for reassigned variables — UI won't update.

### Props — always `$props()`
```js
let { campId = 'fantasy', onSelect = null } = $props();
```

Never `export let`. That's Svelte 4.

### Derived values
```js
let label = $derived(GENERATORS.find(g => g.id === activeGen)?.label ?? '');
```

`$derived` is lazy and cached. Use it freely for computed display values.

### Effects
```js
$effect(() => {
  document.title = campName;
});
```

Use `$effect` for DOM side effects. Not for state derivation (use `$derived`).

### `$state()` only at component top level
```js
// ✅ CORRECT
let count = $state(0);

// ❌ WRONG — $state inside a function
function doThing() {
  let count = $state(0); // silent bug
}
```

---

## SvelteFlow patterns

### flowNodes and flowEdges MUST be writable stores
```js
// ✅ CORRECT
let flowNodes = writable([]);
canvas.nodes.subscribe(v => flowNodes.set(v));

// ❌ WRONG — $state doesn't work with SvelteFlow
let flowNodes = $state([]);
```

### nodeTypes MUST be at module level
```js
// ✅ CORRECT — in nodeTypes.js, imported at top of Board.svelte
export const nodeTypes = { ... };

// ❌ WRONG — inside component or reactive block
let nodeTypes = $derived({ ... });
```

### Card components must not position themselves
SvelteFlow positions node containers via CSS transform.
Card components must not set `left`, `top`, `position:absolute`, or handle `mousedown` drag.

---

## CSS rules

All styling lives in `static/assets/css/theme.css`. No exceptions.

```svelte
<!-- ✅ CORRECT — class + theme.css -->
<div class="board-card">

<!-- ❌ WRONG — inline style for layout -->
<div style="position:absolute; left:{x}px">

<!-- ❌ WRONG — style block -->
<style>
  .board-card { ... }
</style>
```

Use CSS custom properties for colours:
```css
color: var(--accent);
background: var(--bg);
border: 1px solid var(--border);
```

---

## File size guidance

| File type | Soft limit | Action if exceeded |
|-----------|------------|-------------------|
| `.svelte` component | 300 lines | Consider extracting sub-components |
| `.js` store | 200 lines | Consider splitting factory functions |
| `engine.js` | no limit | Single file by design — pure functions |
| `db.js` | no limit | Single file by design — pure functions |
| `theme.css` | no limit | Single file by design — global styles |

**Exception:** `Board.svelte` is intentionally large (~800 lines) because it is
the main app shell coordinating all stores, panels, and the SvelteFlow canvas.
It should not be split unless a clear sub-component boundary emerges.

---

## Store architecture

Stores are plain JS factory functions returning objects of Svelte stores:

```js
// canvasStore.js
export function createCanvasStore(key, tables, showToast) {
  const cards = writable([]);
  // ...
  return { cards, nodes, edges, generateCard, ... };
}
```

- Stores import from `engine.js` and `db.js` — never from components
- Components import from stores — never the reverse
- No Svelte imports in store files (`writable`, `derived` from `svelte/store` are fine)

---

## Architectural decisions

**1. No build tooling for production assets**
`static/assets/css/theme.css` is hand-authored, not compiled from Sass/Tailwind.
This keeps the deploy pipeline simple and the CSS legible.

**2. SvelteFlow for canvas, not custom drag**
The previous custom drag/pan/zoom system (direct DOM `mousemove`) was replaced by
SvelteFlow in March 2026. SvelteFlow owns all canvas interaction. Card components
must not reintroduce drag logic.

**3. Context for canvas callbacks**
`Board.svelte` sets Svelte context (`ogma_canvas`) with getter functions so node
components can call canvas operations without prop drilling through SvelteFlow.
Context getters must be live references — avoid capturing stale closures.

**4. IDB for everything persistent**
All canvas state, play state, player state, binder cards — persisted to IndexedDB
via Dexie 4. No `localStorage` for game data (only preferences like theme, dismissed
coach marks). Loss of IDB persistence is always a critical regression.
