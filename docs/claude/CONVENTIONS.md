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

<!-- $state.raw — for objects always replaced wholesale, no deep proxy needed -->
let cardState = $state.raw({ phyHit: [], menHit: [] });
function update(patch) { cardState = Object.assign({}, cardState, patch); }

<!-- Intra-component snippet — eliminates copy-pasted markup blocks -->
{#snippet conRow(label, cls)}
  <div class="fs-con-row">
    <span class="fs-con-label {cls}">{label}</span>
    <div class="fs-con-line"></div>
  </div>
{/snippet}
{@render conRow('Mild (2)', 'fs-con-label-mild')}
{@render conRow('Moderate (4)', 'fs-con-label-mod')}

<!-- NO $state() inside functions -->
function doThing() {
  let local = 0;  // plain let is fine for function-local vars
}
```

## CSS rules

- All styling in `static/assets/css/theme.css`
- No `<style>` blocks in components
- Use CSS custom properties (`var(--accent)`, `var(--bg)`) not hardcoded colours
- Canvas cards: no `position:absolute`, no `left/top` on card components — `.cv-card-positioner` wrapper owns that

## File naming

- Components: `PascalCase.svelte`
- Stores: `camelCaseStore.js`
- Routes: SvelteKit convention (`+page.svelte`, `+layout.js`)

## Version format

`YYYY.MM.NNN` — e.g. `2026.03.660`
Zip delivery: `YYYY-MM-NNN.zip` (hyphens, not dots)
