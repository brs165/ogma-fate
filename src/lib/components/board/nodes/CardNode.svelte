<script>
  import { Handle, Position } from '@xyflow/svelte';
  import BoardCard from '../BoardCard.svelte';
  import { getContext } from 'svelte';
  let { id = '', data = {}, selected = false } = $props();
  const ctx = getContext('ogma_canvas') || {};

  let dimmed = $derived(
    ctx.cardSearch
      ? !(
          (data.title || '').toLowerCase().includes(ctx.cardSearch.toLowerCase()) ||
          (data.summary || '').toLowerCase().includes(ctx.cardSearch.toLowerCase()) ||
          (data.text || '').toLowerCase().includes(ctx.cardSearch.toLowerCase()) ||
          (data.genId || '').toLowerCase().includes(ctx.cardSearch.toLowerCase())
        )
      : false
  );
</script>

<div class="ogma-node-wrap{ctx.connectSourceId === id ? ' sf-connect-source' : ''}{ctx.mode === 'play' && data.acted ? ' npc-acted' : ''}{data.genId === 'countdown' && data.cardState?.clockFull ? ' clock-triggered' : ''}{dimmed ? ' sf-dimmed' : ''}">
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
