<script>
  import BoardLabel from '../BoardLabel.svelte';
  import { getContext } from 'svelte';  const ctx = getContext('ogma_canvas') || {};
  let dimmed = $derived(
    ctx.cardSearch
      ? !(
          (data.text || '').toLowerCase().includes(ctx.cardSearch.toLowerCase()) ||
          (data.genId || '').toLowerCase().includes(ctx.cardSearch.toLowerCase())
        )
      : false
  );

  let { id = '', data = {} } = $props();</script>

<div class="ogma-node-wrap{dimmed ? ' sf-dimmed' : ''}">
  <BoardLabel
    card={data}
    onDelete={ctx.onDelete || null}
    onUpdate={ctx.onUpdate || null}
  />
</div>
