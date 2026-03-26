<script>
  import { Handle, Position } from '@xyflow/svelte';
  import BoardBoost from '../BoardBoost.svelte';
  import { getContext } from 'svelte';  const ctx = getContext('ogma_canvas') || {};

  let { id = '', data = {} } = $props();</script>

<div class="ogma-node-wrap">
  <Handle type="source" position={Position.Right} id="src" />
  <Handle type="target" position={Position.Left} id="tgt" />
  <BoardBoost
    card={data}
    onDelete={ctx.onDelete || null}
    onUpdate={ctx.onUpdate || null}
  />
</div>
