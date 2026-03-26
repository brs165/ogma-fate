<script>
  import { Handle, Position } from '@xyflow/svelte';
  import BoardSticky from '../BoardSticky.svelte';
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
  <Handle type="source" position={Position.Right} id="src" />
  <Handle type="target" position={Position.Left} id="tgt" />
  <BoardSticky
    card={data}
    onDelete={ctx.onDelete || null}
    onUpdate={ctx.onUpdate || null}
  />
</div>
