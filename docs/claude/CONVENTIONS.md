# Conventions — Ogma

## Svelte 5 runes patterns

```svelte
<!-- Props -->
let { campId = 'fantasy', onSelect = null } = $props();

<!-- Mutable state — MUST use $state() -->
let count = $state(0);
let cards = $state([]);
let open = $state(false);

<!-- Computed — use $derived() -->
let label = $derived(GENERATORS.find(g => g.id === activeGen)?.label ?? '');

<!-- Side effects -->
$effect(() => {
  document.title = campName;
});

<!-- Events — Svelte 5 syntax -->
<button onclick={handleClick}>Click</button>
<input oninput={(e) => value = e.target.value} />

<!-- Snippets (not slots) -->
let { children } = $props();
{@render children?.()}

<!-- NO $state() inside functions -->
function doThing() {
  let local = 0;  // plain let is fine for function-local vars
}
```

## SvelteFlow 1.5.1 rules

```js
// flowNodes and flowEdges MUST be plain $state arrays
let flowNodes = $state([]);
let flowEdges = $state([]);

// Subscribe and assign — NOT .set()
canvas.nodes.subscribe(v => flowNodes = v);
canvas.edges.subscribe(v => flowEdges = v);

// Update via reassignment — NOT .update()
flowNodes = flowNodes.map(n => ({ ...n, selected: true }));

// Use bind:nodes / bind:edges on <SvelteFlow>
<SvelteFlow bind:nodes={flowNodes} bind:edges={flowEdges}>

// Callback props — NOT on: dispatchers
onnodedragstop={({ nodes }) => { ... }}    // NOT on:nodedragstop
onnodeclick={({ node }) => { ... }}        // NOT on:nodeclick
onconnect={(connection) => { ... }}        // NOT on:connect
ondelete={({ edges }) => { ... }}          // NOT on:edgedelete
onedgeclick={({ edge }) => { ... }}        // NOT on:edgeclick

// Prop names
multiSelectionKey="Shift"                  // NOT multiSelectionKeyCode

// nodeTypes MUST be at module level
import { nodeTypes } from './nodeTypes.js';
// Never: $derived({ ... }) or inside initStores()
```

## CSS rules

- All styling in `static/assets/css/theme.css`
- No `<style>` blocks in components
- Use CSS custom properties (`var(--accent)`, `var(--bg)`) not hardcoded colours
- SvelteFlow nodes: no `position:absolute`, no `left/top` on card components

## File naming

- Components: `PascalCase.svelte`
- Stores: `camelCaseStore.js`
- Routes: SvelteKit convention (`+page.svelte`, `+layout.js`)

## Version format

`YYYY.MM.NNN` — e.g. `2026.03.660`
Zip delivery: `YYYY-MM-NNN.zip` (hyphens, not dots)
