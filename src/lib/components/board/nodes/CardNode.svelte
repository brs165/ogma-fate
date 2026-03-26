<script>
  import { Handle, Position } from '@xyflow/svelte';
  import BoardCard from '../BoardCard.svelte';
  import { getContext } from 'svelte';

  export let id = '';
  export let data = {};
  export let selected = false;

  const ctx = getContext('ogma_canvas') || {};
</script>

<div class="ogma-node-wrap">
  <Handle type="source" position={Position.Right} id="src" />
  <Handle type="target" position={Position.Left} id="tgt" />
  <BoardCard
    card={data}
    mode={ctx.mode || 'prep'}
    campId={ctx.campId || ''}
    isOnTable={ctx.playCardIds ? ctx.playCardIds.has(id) : false}
    onDelete={ctx.onDelete || null}
    onReroll={ctx.onReroll || null}
    onUpdate={ctx.onUpdate || null}
    onSendToTable={ctx.onSendToTable || null}
    onOpen={ctx.onOpen || null}
    onInvoke={ctx.onInvoke || null}
    onDragStart={null}
  />
</div>
