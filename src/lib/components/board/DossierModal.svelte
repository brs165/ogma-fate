<script>
  // ── DossierModal — GM Guidance modal with focus trap ─────────────────────────
  import { onMount, onDestroy } from 'svelte';
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

  export let card               = null;
  export let onClose            = null;
  export let onReroll           = null;
  export let onSendToTable      = null;
  export let onRemoveFromTable  = null;
  export let onDelete           = null;
  export let isOnTable          = false;
  export let campName           = '';
  export let campId             = '';
  export let mode               = 'prep';

  let modalEl;

  $: C       = card ? (BOARD_TYPE_COLOR[card.genId] || {stripe:'#888', tc:'#555', bg:'#f5f4f1'}) : {};
  $: genMeta = card ? ((GENERATORS || []).find(g => g.id === card.genId) || {}) : {};
  $: hc      = card ? (HELP_CONTENT[card.genId] || null) : null;

  // C-01: Focus trap (WCAG 2.1.2)
  onMount(() => {
    if (!modalEl) return;
    const closeBtn = modalEl.querySelector('.bd-close');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 30);

    function getFocusable() {
      return Array.from(modalEl.querySelectorAll(
        'button:not([disabled]),a[href],input,textarea,select,[tabindex]:not([tabindex="-1"])'
      ));
    }

    function trap(e) {
      if (e.key === 'Escape') { if (onClose) onClose(); return; }
      if (e.key !== 'Tab') return;
      const els = getFocusable(); if (!els.length) return;
      if (e.shiftKey) {
        if (document.activeElement === els[0]) { e.preventDefault(); els[els.length - 1].focus(); }
      } else {
        if (document.activeElement === els[els.length - 1]) { e.preventDefault(); els[0].focus(); }
      }
    }
    modalEl.addEventListener('keydown', trap);
    return () => modalEl.removeEventListener('keydown', trap);
  });

  function onBackdropClick(e) {
    if (e.target === e.currentTarget && onClose) onClose();
  }
</script>

{#if card}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div class="bd-backdrop" role="presentation" aria-hidden="false" on:click={onBackdropClick}>
    <div
      class="bd-modal bd-modal-compact"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bd-title-{card.id}"
      bind:this={modalEl}
    >
      <button class="bd-close" on:click={onClose} aria-label="Close">✕</button>

      <!-- Header -->
      <div class="bd-top">
        <div class="bd-title" id="bd-title-{card.id}">{card.title}</div>
        <div class="bd-badge" style="color:{C.tc}; border-color:{C.tc}; background:{C.bg}">
          {genMeta.icon || ''}&nbsp;{genMeta.label || card.genId}
        </div>
      </div>

      <!-- GM Guidance -->
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

      <!-- Footer actions -->
      <div class="bd-footer">
        <button
          class="bd-chain"
          on:click={() => { if (onReroll) onReroll(card.id); if (onClose) onClose(); }}
          title="Generate a new card of this type"
        >↻ Chain</button>

        {#if mode === 'prep'}
          {#if isOnTable}
            <span class="bd-on-table-badge">● On table</span>
            {#if onRemoveFromTable}
              <button
                class="bd-remove-table"
                on:click={() => { onRemoveFromTable(card.id); if (onClose) onClose(); }}
                title="Remove from play table"
              >○ Remove</button>
            {/if}
          {:else}
            <button
              class="bd-send-table"
              on:click={() => { if (onSendToTable) onSendToTable(card); if (onClose) onClose(); }}
              title="Put this card on the play table"
            >→ Table</button>
          {/if}
        {/if}

        <button
          class="bd-delete"
          on:click={() => { if (onDelete) onDelete(card.id); if (onClose) onClose(); }}
          title="Remove card from canvas"
        >✕</button>
      </div>
    </div>
  </div>
{/if}
