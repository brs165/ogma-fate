<script>
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const CV4_CUSTOM_TYPES = [
    { id: 'aspect',   label: 'Aspect',   color: '#2e7d32' },
    { id: 'npc',      label: 'NPC',      color: '#1565c0' },
    { id: 'location', label: 'Location', color: '#b8860b' },
    { id: 'clue',     label: 'Clue',     color: '#7b1fa2' },
    { id: 'other',    label: 'Other',    color: 'var(--fs-text-muted)' },
  ];

  let editTitle = $state(false);
  let editBody = $state(false);
  let draftTitle = $state(data.title || 'Untitled');
  let draftBody = $state(data.body || '');

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
    const idx = CV4_CUSTOM_TYPES.findIndex(t => t.id === typeId);
    const next = CV4_CUSTOM_TYPES[(idx + 1) % CV4_CUSTOM_TYPES.length];
    onUpdate({ title: data.title, body: data.body, type: next.id });
  }

  function onTitleKeydown(e) {
    if (e.key === 'Enter') { e.preventDefault(); commitTitle(); }
    if (e.key === 'Escape') { draftTitle = data.title || 'Untitled'; editTitle = false; }
  }
  function onBodyKeydown(e) {
    if (e.key === 'Escape') { draftBody = data.body || ''; editBody = false; }
  }

  let titleEl;
  let bodyEl;

  function startEditTitle(e) { e.stopPropagation(); editTitle = true; }
  function startEditBody(e) { e.stopPropagation(); editBody = true; }

  $effect(() => { if (editTitle && titleEl) titleEl.focus(); });
  $effect(() => { if (editBody && bodyEl) bodyEl.focus(); });
</script>

<!-- Type pill -->
<button
  onclick={(e) => { e.stopPropagation(); cycleType(); }}
  title="Click to change type"
  class="fs-skill-badge"
  style="align-self:flex-start; cursor:pointer; font-size:10px; padding:3px 10px; text-transform:uppercase; background:{typeColor}; margin-bottom:8px"
>{typeEntry.label} · tap to change</button>

<!-- Title -->
{#if editTitle}
  <input
    bind:this={titleEl}
    bind:value={draftTitle}
    maxlength="80"
    onblur={commitTitle}
    onkeydown={onTitleKeydown}
    onclick={(e) => e.stopPropagation()}
    style="font-size:15px; font-weight:800; color:var(--fs-text); background:transparent; border:none; border-bottom:2px solid {typeColor}; outline:none; width:100%; font-family:var(--font-ui); padding:2px 0; margin-bottom:8px"
  />
{:else}
  <div
    onclick={startEditTitle}
    onkeydown={e => { if (e.key === 'Enter' || e.key === ' ') startEditTitle(e); }}
    role="button"
    tabindex="0"
    aria-label="Click to edit card title"
    style="font-size:15px; font-weight:800; color:var(--fs-text); cursor:text; line-height:1.3; margin-bottom:8px"
  >{#if draftTitle}{draftTitle}{:else}<span style="color:var(--fs-text-muted); font-style:italic">Untitled</span>{/if}</div>
{/if}

<!-- Body -->
{#if editBody}
  <textarea
    bind:this={bodyEl}
    bind:value={draftBody}
    maxlength="400"
    rows="4"
    onblur={commitBody}
    onkeydown={onBodyKeydown}
    onclick={(e) => e.stopPropagation()}
    placeholder="Notes, aspects, stats, anything…"
    style="font-size:12px; color:var(--fs-text); background:var(--fs-stunt-bg); border:1px solid {typeColor}; border-radius:3px; outline:none; width:100%; resize:vertical; font-family:var(--font-ui); padding:6px 8px; line-height:1.55"
  ></textarea>
{:else}
  <div
    onclick={startEditBody}
    onkeydown={e => { if (e.key === 'Enter' || e.key === ' ') startEditBody(e); }}
    role="button"
    tabindex="0"
    aria-label="Click to edit card notes"
    style="font-size:12px; color:{draftBody ? 'var(--fs-text-dim)' : 'var(--fs-text-muted)'}; font-style:{draftBody ? 'normal' : 'italic'}; line-height:1.55; cursor:text; white-space:pre-wrap; min-height:40px"
  >{#if draftBody}{draftBody}{:else}Click to add notes…{/if}</div>
{/if}
