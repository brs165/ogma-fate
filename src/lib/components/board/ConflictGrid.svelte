<script>
  import StressRow from '../cards/StressRow.svelte';

  let {
    cards = [],
    onUpdateCard = null,
    onClose = () => {},
  } = $props();

  const LADDER = {8:"Legendary",7:"Epic",6:"Fantastic",5:"Superb",4:"Great",3:"Good",2:"Fair",1:"Average",0:"Mediocre"};

  // Filter to NPC cards only, limit to 5 for grid display
  let npcCards = $derived(
    cards.filter(c => c.gen === 'npc_minor' || c.gen === 'npc_major' || c.gen === 'npc_instant').slice(0, 5)
  );

  // Track which NPC column is expanded
  let expandedId = $state(null);

  function toggleExpand(id) {
    expandedId = expandedId === id ? null : id;
  }

  // ── NPC data accessors ──────────────────────────────────────────────────
  function getName(c) {
    return c.data?.name || 'NPC';
  }

  function getHighConcept(c) {
    if (c.gen === 'npc_instant') return c.data?.highConcept || '';
    if (c.data?.aspects?.high_concept) return c.data.aspects.high_concept;
    if (Array.isArray(c.data?.aspects) && c.data.aspects[0]) return typeof c.data.aspects[0] === 'string' ? c.data.aspects[0] : c.data.aspects[0].name || '';
    return '';
  }

  function getTrouble(c) {
    if (c.gen === 'npc_instant') return c.data?.trouble || '';
    if (c.data?.aspects?.trouble) return c.data.aspects.trouble;
    if (Array.isArray(c.data?.aspects) && c.data.aspects[1]) return typeof c.data.aspects[1] === 'string' ? c.data.aspects[1] : '';
    return '';
  }

  function getOtherAspects(c) {
    if (c.gen === 'npc_major' && c.data?.aspects?.others) return c.data.aspects.others;
    return [];
  }

  function getPeakSkill(c) {
    if (c.gen === 'npc_instant' && c.data?.peakSkill) return c.data.peakSkill;
    if (c.data?.skills?.length > 0) return c.data.skills.reduce((b, s) => s.r > (b?.r || 0) ? s : b, c.data.skills[0]);
    return null;
  }

  function getAllSkills(c) {
    if (c.gen === 'npc_instant' && c.data?.peakSkill) return [{ name: c.data.peakSkill.name, r: c.data.peakSkill.rating }];
    return c.data?.skills || [];
  }

  function getStunts(c) {
    if (c.gen === 'npc_instant' && c.data?.stunt) return [c.data.stunt];
    return c.data?.stunts || (c.data?.stunt ? [c.data.stunt] : []);
  }

  function getPhyStress(c) {
    if (c.gen === 'npc_instant') return c.data?.stress || 1;
    return c.data?.physical_stress || c.data?.stress || 2;
  }

  function getMenStress(c) {
    return c.data?.mental_stress || 0;
  }

  function getConsequences(c) {
    return c.data?.consequences || [];
  }

  function getPhyHits(c) {
    return c.cardState?.phyHit ?? Array(getPhyStress(c)).fill(false);
  }

  function getMenHits(c) {
    const menStress = getMenStress(c);
    if (!menStress) return [];
    return c.cardState?.menHit ?? Array(menStress).fill(false);
  }

  function setPhyHits(card, hits) {
    if (onUpdateCard) onUpdateCard(card.id, { cardState: { ...card.cardState, phyHit: hits } });
  }

  function setMenHits(card, hits) {
    if (onUpdateCard) onUpdateCard(card.id, { cardState: { ...card.cardState, menHit: hits } });
  }

  // ── Consequence editing ─────────────────────────────────────────────────
  function getConText(card, slot) {
    return card.cardState?.['con_' + slot] || '';
  }

  function setConText(card, slot, text) {
    if (onUpdateCard) onUpdateCard(card.id, { cardState: { ...card.cardState, ['con_' + slot]: text } });
  }

  const CON_LABELS = { 2: 'Mild', 4: 'Mod', 6: 'Severe' };
  const CON_COLORS = { 2: 'var(--fs-con-mild, #2980b9)', 4: 'var(--fs-con-mod, #b8860b)', 6: 'var(--fs-con-sev, #c62828)' };
</script>

<div class="conflict-grid-overlay">
  <div class="conflict-grid-container">
    <div class="conflict-grid-header">
      <span class="conflict-grid-title">
        <i class="fa-solid fa-table-cells" aria-hidden="true"></i> CONFLICT GRID
      </span>
      <span class="conflict-grid-count">{npcCards.length} NPC{npcCards.length !== 1 ? 's' : ''}</span>
      <button class="conflict-grid-close" onclick={onClose} aria-label="Close conflict grid">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>

    {#if npcCards.length === 0}
      <div class="conflict-grid-empty">
        <i class="fa-solid fa-users-slash" aria-hidden="true"></i>
        <p>No NPCs on the table. Generate NPCs to use the Conflict Grid.</p>
      </div>
    {:else}
      <div class="conflict-grid-columns">
        {#each npcCards as c, idx (c.id)}
          {@const peak = getPeakSkill(c)}
          {@const expanded = expandedId === c.id}
          <div class="conflict-col" class:conflict-col-expanded={expanded}>
            <!-- Name + HC -->
            <button class="conflict-col-header" onclick={() => toggleExpand(c.id)} aria-expanded={String(expanded)}>
              <div class="conflict-col-name">{getName(c)}</div>
              <div class="conflict-col-hc">{getHighConcept(c)}</div>
            </button>

            <!-- Trouble -->
            {#if getTrouble(c)}
              <div class="conflict-col-trouble">{getTrouble(c)}</div>
            {/if}

            <!-- Peak Skill -->
            {#if peak}
              <div class="conflict-col-peak">
                <span class="conflict-skill-badge">+{peak.rating || peak.r}</span>
                <span class="conflict-skill-name">{peak.name}</span>
              </div>
            {/if}

            <!-- Physical Stress -->
            <div class="conflict-col-stress">
              <StressRow label="Stress" hits={getPhyHits(c)} setHits={(h) => setPhyHits(c, h)} color="var(--fs-stress-phy)" />
            </div>

            <!-- Mental Stress (major NPCs) -->
            {#if getMenStress(c) > 0}
              <div class="conflict-col-stress">
                <StressRow label="Mental" hits={getMenHits(c)} setHits={(h) => setMenHits(c, h)} color="var(--fs-stress-men)" />
              </div>
            {/if}

            <!-- Consequences (inline editable) -->
            {#if getConsequences(c).length > 0}
              <div class="conflict-col-consequences">
                {#each getConsequences(c) as slot}
                  <div class="conflict-con-row">
                    <span class="conflict-con-label" style="color:{CON_COLORS[slot] || 'var(--fs-text-muted)'}">{CON_LABELS[slot] || '?'}</span>
                    <input
                      class="conflict-con-input"
                      type="text"
                      placeholder="\u2014"
                      value={getConText(c, slot)}
                      oninput={(e) => setConText(c, slot, e.target.value)}
                      onclick={(e) => e.stopPropagation()}
                      aria-label="{CON_LABELS[slot] || ''} consequence for {getName(c)}"
                    />
                  </div>
                {/each}
              </div>
            {/if}

            <!-- Expanded: Full skills + Stunts + Other Aspects -->
            {#if expanded}
              <div class="conflict-col-expanded-content">
                <!-- Other Aspects -->
                {#if getOtherAspects(c).length > 0}
                  <div class="conflict-expanded-section">
                    <div class="conflict-expanded-hdr">OTHER ASPECTS</div>
                    {#each getOtherAspects(c) as a}
                      <div class="conflict-expanded-aspect">{a}</div>
                    {/each}
                  </div>
                {/if}

                <!-- Full Skills -->
                {#if getAllSkills(c).length > 1}
                  <div class="conflict-expanded-section">
                    <div class="conflict-expanded-hdr">SKILLS</div>
                    {#each getAllSkills(c) as s}
                      <div class="conflict-expanded-skill">
                        <span class="conflict-skill-badge">+{s.r}</span> {s.name}
                      </div>
                    {/each}
                  </div>
                {/if}

                <!-- Stunts -->
                {#if getStunts(c).length > 0}
                  <div class="conflict-expanded-section">
                    <div class="conflict-expanded-hdr">STUNTS</div>
                    {#each getStunts(c) as st}
                      <div class="conflict-expanded-stunt">
                        <div class="conflict-stunt-name">{st.name}</div>
                        <div class="conflict-stunt-desc">{st.desc || ''}</div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
