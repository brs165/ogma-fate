<script>
  let { data = {}, campName = '', catColor = 'var(--accent)', cardState = {}, onUpdate = () => {} } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  const CV4_CUSTOM_TYPES = [
    { id: 'aspect',   label: 'Aspect',   color: 'var(--c-green,#34d399)' },
    { id: 'npc',      label: 'NPC',      color: 'var(--c-blue,#60a5fa)'  },
    { id: 'location', label: 'Location', color: 'var(--gold,#fbbf24)'    },
    { id: 'clue',     label: 'Clue',     color: 'var(--c-purple,#a78bfa)'},
    { id: 'other',    label: 'Other',    color: 'var(--text-muted,#888)' },
  ];

  let editTitle = false;
  let editBody  = false;
  let draftTitle = data.title || 'Untitled';
  let draftBody  = data.body  || '';

  let typeId = $derived(data.type || 'aspect');
  let typeEntry = $derived(CV4_CUSTOM_TYPES.find(t => t.id === typeId) || CV4_CUSTOM_TYPES[0]);
  let typeColor = $derived(typeEntry.color);

  function commitTitle() {
    editTitle = false;
    const val = draftTitle.trim() || 'Untitled';
    draftTitle = val;
    if (val !== data.title) onUpdate({ title: val, body: data.body, type: data.type });
  }
  function commitBody() {
    editBody = false;
    if (draftBody !== data.body) onUpdate({ title: data.title, body: draftBody, type: data.type });
  }
  function cycleType() {
    const idx  = CV4_CUSTOM_TYPES.findIndex(t => t.id === typeId);
    const next = CV4_CUSTOM_TYPES[(idx + 1) % CV4_CUSTOM_TYPES.length];
    onUpdate({ title: data.title, body: data.body, type: next.id });
  }

  function onTitleKeydown(e) {
    if (e.key === 'Enter')  { e.preventDefault(); commitTitle(); }
    if (e.key === 'Escape') { draftTitle = data.title || 'Untitled'; editTitle = false; }
  }
  function onBodyKeydown(e) {
    if (e.key === 'Escape') { draftBody = data.body || ''; editBody = false; }
  }

  let titleEl;
  let bodyEl;

  function startEditTitle(e) { e.stopPropagation(); editTitle = true; }
  function startEditBody(e)  { e.stopPropagation(); editBody  = true; }

  $effect(() => { if (editTitle && titleEl) titleEl.focus(); });
  $effect(() => { if (editBody  && bodyEl)  bodyEl.focus(); });
</script>

<div style="flex:1; padding:10px 14px 12px; display:flex; flex-direction:column; gap:8px">

  <!-- Type pill -->
  <button
    onclick={(e) => { e.stopPropagation(); (cycleType)(e); }}
    title="Click to change type"
    style="align-self:flex-start; background:color-mix(in srgb,{typeColor} 15%,transparent); border:1px solid color-mix(in srgb,{typeColor} 40%,transparent); border-radius:4px; padding:2px 8px; font-size:10px; font-weight:700; font-family:{CV4_MONO}; color:{typeColor}; cursor:pointer; letter-spacing:0.12em; text-transform:uppercase; line-height:1.4"
  >{typeEntry.label} · tap to change</button>

  <!-- Title -->
  {#if editTitle}
    <!-- svelte-ignore a11y-autofocus -->
    <input
      bind:this={titleEl}
      bind:value={draftTitle}
      maxlength="80"
      autofocus
      onblur={commitTitle}
      onkeydown={onTitleKeydown}
      onclick={(e) => e.stopPropagation()}
      style="font-size:14px; font-weight:700; color:var(--text); background:transparent; border:none; border-bottom:2px solid {typeColor}; outline:none; width:100%; font-family:{CV4_MONO}; padding:2px 0"
    />
  {:else}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      onclick={startEditTitle}
      onkeydown={e => { if (e.key === 'Enter' || e.key === ' ') startEditTitle(e); }}
      role="button"
      tabindex="0"
      title="Click to edit title"
      style="font-size:14px; font-weight:700; color:var(--text); font-family:{CV4_MONO}; cursor:text; line-height:1.3; padding-bottom:2px"
    >{#if draftTitle}{draftTitle}{:else}<span style="color:var(--text-muted); font-style:italic">Untitled</span>{/if}</div>
  {/if}

  <!-- Body -->
  {#if editBody}
    <!-- svelte-ignore a11y-autofocus -->
    <textarea
      bind:this={bodyEl}
      bind:value={draftBody}
      maxlength="400"
      rows="4"
      autofocus
      onblur={commitBody}
      onkeydown={onBodyKeydown}
      onclick={(e) => e.stopPropagation()}
      placeholder="Notes, aspects, stats, anything…"
      style="font-size:11px; color:var(--text); background:var(--inset,rgba(0,0,0,.08)); border:1px solid {typeColor}66; border-radius:4px; outline:none; width:100%; resize:vertical; font-family:{CV4_SANS}; padding:6px 8px; line-height:1.55"
    ></textarea>
  {:else}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      onclick={startEditBody}
      onkeydown={e => { if (e.key === 'Enter' || e.key === ' ') startEditBody(e); }}
      role="button"
      tabindex="0"
      title="Click to edit notes"
      style="font-size:11px; color:{draftBody ? 'var(--text-dim)' : 'var(--text-muted)'}; font-style:{draftBody ? 'normal' : 'italic'}; line-height:1.55; cursor:text; white-space:pre-wrap; min-height:40px; padding:4px 0"
    >{#if draftBody}{draftBody}{:else}Click to add notes…{/if}</div>
  {/if}
</div>
