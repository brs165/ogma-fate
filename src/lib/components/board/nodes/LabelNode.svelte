<script>
  import BoardLabel from '../BoardLabel.svelte';
  import { getContext } from 'svelte';  const ctx = getContext('ogma_canvas') || {};

  let { id = '', data = {} } = $props();</script>

<div class="ogma-node-wrap">
  <BoardLabel
    card={data}
    onDelete={ctx.onDelete || null}
    onUpdate={ctx.onUpdate || null}
  />
</div>
