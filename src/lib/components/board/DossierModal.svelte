<script>
  import { Dialog } from 'bits-ui';
  import { GENERATORS } from '../../engine.js';
  import { HELP_CONTENT } from '../../../data/shared.js';

  const BOARD_TYPE_COLOR = {
    npc_minor:    {stripe:'#e8b83a', tc:'#b8860b', bg:'#fffbee'},
    npc_major:    {stripe:'#e8793a', tc:'#c4581a', bg:'#fff3ee'},
    backstory:    {stripe:'#4a90d9', tc:'#2a70b9', bg:'#eef4fd'},
    scene:        {stripe:'#3aaa7a', tc:'#2a8a5a', bg:'#eefaf4'},
    encounter:    {stripe:'#d04a6a', tc:'#b03050', bg:'#fef0f3'},
    complication: {stripe:'#d04a6a', tc:'#b03050', bg:'#fef0f3'},
    challenge:    {stripe:'#4a90d9', tc:'#2a70b9', bg:'#eef4fd'},
    contest:      {stripe:'#6a7dd4', tc:'#5a6db8', bg:'#f0f1fc'},
    obstacle:     {stripe:'#888',    tc:'#555',    bg:'#f5f4f1'},
    countdown:    {stripe:'#e8793a', tc:'#c4581a', bg:'#fff3ee'},
    constraint:   {stripe:'#888',    tc:'#555',    bg:'#f5f4f1'},
    campaign:     {stripe:'#6a7dd4', tc:'#5a6db8', bg:'#f0f1fc'},
    seed:         {stripe:'#e8b83a', tc:'#b8860b', bg:'#fffbee'},
    faction:      {stripe:'#6a7dd4', tc:'#5a6db8', bg:'#f0f1fc'},
    compel:       {stripe:'#3aaa7a', tc:'#2a8a5a', bg:'#eefaf4'},
    consequence:  {stripe:'#e8793a', tc:'#c4581a', bg:'#fff3ee'},
    custom:       {stripe:'#888',    tc:'#555',    bg:'#f5f4f1'},
    boost:        {stripe:'#f4b942', tc:'#b8860b', bg:'#fffbee'},
  };

  let { card = null, onClose = null, onReroll = null, onDelete = null, campName = '', campId = '' } = $props();

  let open = $derived(card !== null);
  let C = $derived(card ? (BOARD_TYPE_COLOR[card.genId] || {stripe:'#888', tc:'#555', bg:'#f5f4f1'}) : {});
  let genMeta = $derived(card ? ((GENERATORS || []).find(g => g.id === card.genId) || {}) : {});
  let hc = $derived(card ? (HELP_CONTENT[card.genId] || null) : null);

  function handleClose() { if (onClose) onClose(); }
</script>

<Dialog.Root {open} onOpenChange={(o) => { if (!o) handleClose(); }}>
  <Dialog.Portal>
    <Dialog.Overlay class="modal-overlay" />
    <Dialog.Content class="modal-content bd-modal-compact" aria-describedby={undefined}>
      <div class="bd-top">
        <Dialog.Title class="bd-title">{card?.title || ''}</Dialog.Title>
        {#if card}
          <div class="bd-badge" style="color:{C.tc}; border-color:{C.tc}; background:{C.bg}">
            {#if genMeta.icon}<i class="fa-solid {genMeta.icon}" aria-hidden="true"></i>&nbsp;{/if}{genMeta.label || card.genId}
          </div>
        {/if}
        <Dialog.Close class="bd-close" aria-label="Close">✕</Dialog.Close>
      </div>

      {#if card}
        <div class="bd-guidance">
          {#if hc && hc.what}
            <div class="bd-guidance-what">{hc.what}</div>
          {/if}

          {#if hc && (hc.invoke_example || hc.compel_example)}
            <div class="bd-guidance-examples">
              {#if hc.invoke_example}
                <div class="bd-ex-invoke">
                  <span class="bd-ex-lbl">✦ Invoke</span>
                  <span>{hc.invoke_example}</span>
                </div>
              {/if}
              {#if hc.compel_example}
                <div class="bd-ex-compel">
                  <span class="bd-ex-lbl">⊗ Compel</span>
                  <span>{hc.compel_example}</span>
                </div>
              {/if}
            </div>
          {/if}

          {#if hc && Array.isArray(hc.rules) && hc.rules.length > 0}
            <div class="bd-guidance-rules">
              {#each hc.rules as rule, i (i)}
                <div class="bd-rule-row">
                  <span class="bd-rule-pip">◈</span>
                  <span>{rule}</span>
                </div>
              {/each}
            </div>
          {/if}

          {#if !hc || (!hc.what && !hc.invoke_example && !hc.compel_example)}
            <div style="color:var(--text-muted); font-size:12px; padding:8px 0; font-style:italic">
              No GM guidance for this generator yet.
            </div>
          {/if}

          {#if hc && hc.srd_url}
            <a href={hc.srd_url} target="_blank" rel="noopener noreferrer" class="bd-srd-link">
              Fate Condensed SRD ↗
            </a>
          {/if}
        </div>

        <div class="bd-footer">
          <button class="bd-chain" onclick={() => { if (onReroll) onReroll(card.id); handleClose(); }} aria-label="Chain — generate a new card of this type">↻ Chain</button>
          <button class="bd-delete" onclick={() => { if (onDelete) onDelete(card.id); handleClose(); }} aria-label="Remove card from canvas">✕</button>
        </div>
      {/if}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
