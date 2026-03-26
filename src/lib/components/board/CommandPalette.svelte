<script>
  import { Dialog } from 'bits-ui';

  let { actions = [], onClose = () => {} } = $props();

  let q = $state('');
  let sel = $state(0);

  let filtered = $derived(q
    ? actions.filter(a =>
        a.label.toLowerCase().includes(q.toLowerCase()) ||
        (a.sub || '').toLowerCase().includes(q.toLowerCase())
      )
    : actions);

  $effect(() => { void filtered; sel = 0; });

  function exec(action) {
    if (action.fn) action.fn();
    onClose();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, filtered.length - 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); }
    if (e.key === 'Enter' && filtered[sel]) { e.preventDefault(); exec(filtered[sel]); }
  }
</script>

<Dialog.Root open={true} onOpenChange={(o) => { if (!o) onClose(); }}>
  <Dialog.Portal>
    <Dialog.Overlay class="modal-overlay cmd-overlay" />
    <Dialog.Content class="cmd-content" aria-describedby={undefined}>
      <Dialog.Title class="sr-only">Command Palette</Dialog.Title>
      <div class="cmd-input-wrap">
        <span class="cmd-search-icon" aria-hidden="true"><i class="fa-solid fa-magnifying-glass"></i></span>
        <input
          bind:value={q}
          class="cmd-input"
          type="text"
          placeholder="Type a command…"
          aria-label="Search commands"
          oninput={() => (sel = 0)}
          onkeydown={onKeyDown}
          autofocus
        />
      </div>
      <div class="cmd-list">
        {#if filtered.length === 0}
          <div class="cmd-empty">No matching commands</div>
        {/if}
        {#each filtered as a, i (a.id)}
          <button
            class="cmd-item"
            class:cmd-active={i === sel}
            data-highlighted={i === sel ? '' : undefined}
            onclick={() => exec(a)}
            onmouseenter={() => (sel = i)}
          >
            <span class="cmd-item-icon">{a.icon || ''}</span>
            <span class="cmd-item-label">{a.label}</span>
            {#if a.shortcut}
              <span class="cmd-shortcut">{a.shortcut}</span>
            {/if}
          </button>
        {/each}
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
