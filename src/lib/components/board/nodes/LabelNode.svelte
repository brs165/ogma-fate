<svelte:options runes={false} />

<script>
  import BoardLabel from '../BoardLabel.svelte';
  import { getContext } from 'svelte';
  export let id = '';
  export let data = {};
  const ctx = getContext('ogma_canvas') || {};
</script>

<div class="ogma-node-wrap">
  <BoardLabel
    card={data}
    onDelete={ctx.onDelete || null}
    onUpdate={ctx.onUpdate || null}
  />
</div>
