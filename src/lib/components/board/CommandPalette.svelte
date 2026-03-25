<script>
  import { onMount } from 'svelte';

  export let actions = [];
  export let onClose = () => {};

  let q = '';
  let sel = 0;
  let inputEl;

  onMount(() => {
    if (inputEl) inputEl.focus();
  });

  $: filtered = q
    ? actions.filter(a =>
        a.label.toLowerCase().includes(q.toLowerCase()) ||
        (a.sub || '').toLowerCase().includes(q.toLowerCase())
      )
    : actions;

  // Reset selection when filter changes
  $: if (filtered) sel = 0;

  function exec(action) {
    if (action.fn) action.fn();
    onClose();
  }

  function onOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      sel = Math.min(sel + 1, filtered.length - 1);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      sel = Math.max(sel - 1, 0);
    }
    if (e.key === 'Enter' && filtered[sel]) {
      e.preventDefault();
      exec(filtered[sel]);
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="cmd-overlay" on:click={onOverlayClick}>
  <div class="cmd-modal" role="dialog" aria-label="Command palette">
    <input
      bind:this={inputEl}
      bind:value={q}
      class="cmd-input"
      type="text"
      placeholder="Type a command…"
      aria-label="Search commands"
      on:input={() => (sel = 0)}
      on:keydown={onKeyDown}
    />
    <div class="cmd-list">
      {#if filtered.length === 0}
        <div class="cmd-empty">No matching commands</div>
      {/if}
      {#each filtered as a, i (a.id)}
        <button
          class="cmd-item"
          class:cmd-active={i === sel}
          on:click={() => exec(a)}
          on:mouseenter={() => (sel = i)}
        >
          <span class="cmd-icon">{a.icon || ''}</span>
          <span class="cmd-label">{a.label}</span>
          {#if a.shortcut}
            <span class="cmd-shortcut">{a.shortcut}</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</div>
