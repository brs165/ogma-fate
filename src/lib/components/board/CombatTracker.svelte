<script>
  export let players = [];
  export let npcCards = [];
  export let onToggleActed = () => {};
  export let onToggleNpcActed = () => {};
</script>

<div class="ct-wrap">
  <table class="ct-table" role="grid">
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>FP</th>
        <th>PHY</th>
        <th>MEN</th>
        <th>Conseq</th>
        <th>&#x2713;</th>
      </tr>
    </thead>
    <tbody>
      {#each players as p (p.id)}
        {@const phyFilled = (p.phy || []).filter(Boolean).length}
        {@const menFilled = (p.men || []).filter(Boolean).length}
        {@const conseqFilled = (p.conseq || []).filter(Boolean).length}
        <tr class:ct-acted={p.acted}>
          <td class="ct-avatar">{p.avatar || '●'}</td>
          <td class="ct-name">{p.name}</td>
          <td class="ct-fp" style:color={p.fp === 0 ? 'var(--c-red)' : 'var(--accent)'}>{String(p.fp || 0)}</td>
          <td>{phyFilled}/{(p.phy || []).length}</td>
          <td>{menFilled}/{(p.men || []).length}</td>
          <td style:color={conseqFilled > 0 ? 'var(--c-amber)' : 'var(--text-muted)'}>
            {conseqFilled > 0 ? conseqFilled + ' filled' : '—'}
          </td>
          <td>
            <button
              class="ct-act-btn"
              class:acted={p.acted}
              on:click={() => onToggleActed(p.id)}
              aria-label="{p.acted ? 'Mark unacted' : 'Mark acted'} {p.name}"
            >
              {p.acted ? '✓' : '○'}
            </button>
          </td>
        </tr>
      {/each}

      {#each npcCards as npc (npc.id)}
        <tr class="ct-npc" class:ct-acted={npc.acted}>
          <td class="ct-avatar">◆</td>
          <td class="ct-name">{npc.title || 'NPC'}</td>
          <td>—</td>
          <td>—</td>
          <td>—</td>
          <td>—</td>
          <td>
            <button
              class="ct-act-btn"
              class:acted={npc.acted}
              on:click={() => onToggleNpcActed && onToggleNpcActed(npc.id)}
            >
              {npc.acted ? '✓' : '○'}
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
