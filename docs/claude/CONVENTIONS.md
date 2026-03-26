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

## SvelteFlow rules

```js
// flowNodes and flowEdges MUST be writable stores
let flowNodes = writable([]);
let flowEdges = writable([]);

// Subscribe and .set() — NOT reassign
canvas.nodes.subscribe(v => flowNodes.set(v));
canvas.edges.subscribe(v => flowEdges.set(v));

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

`YYYY.MM.NNN` — e.g. `2026.03.576`
Zip delivery: `YYYY.MM.NNN.zip`
