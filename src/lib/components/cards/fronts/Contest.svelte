<script>
  import { RadioGroup } from 'bits-ui';
  import OgmaTooltip from '../../shared/OgmaTooltip.svelte';

  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  const LADDER = {8:"Legendary",7:"Epic",6:"Fantastic",5:"Superb",4:"Great",3:"Good",2:"Fair",1:"Average",0:"Mediocre"};

  let sA = $derived(cardState?.scoreA ?? 0);
  let sB = $derived(cardState?.scoreB ?? 0);
  let victories = $derived(data.victories_needed || 3);
  let winA = $derived(sA >= victories);
  let winB = $derived(sB >= victories);
  let sideA = $derived({ label: data.side_a || 'Side A', skills: data.skills_a || '' });
  let sideB = $derived({ label: data.side_b || 'Side B', skills: data.skills_b || '' });
  let colA = 'var(--fs-section)';
  let colB = 'var(--fs-con-sev, #c62828)';

  function addVictory(side) {
    if (side === 'a') onUpdate({ scoreA: Math.min(sA + 1, victories) });
    else              onUpdate({ scoreB: Math.min(sB + 1, victories) });
  }
  function reset(e) { e.stopPropagation(); onUpdate({ scoreA: 0, scoreB: 0 }); }
</script>

<!-- Contest type + aspect -->
{#if data.contest_type}
  <div class="fs-section-gap" style="display:flex; gap:6px; align-items:center">
    <span class="fs-skill-badge" style="font-size:11px; padding:3px 10px">{data.contest_type}</span>
    {#if data.aspect}<span style="font-size:11px; color:var(--fs-text-muted); font-style:italic">"{data.aspect}"</span>{/if}
  </div>
{/if}

<!-- Score panels -->
<OgmaTooltip tip="Victory track — each exchange, both sides roll. The winner marks a victory. First to {victories} victories wins the contest (FCon p.24).">
  <div class="fs-section-hdr" style="cursor:help; margin-bottom:6px" tabindex="0">VICTORIES (first to {victories})</div>
</OgmaTooltip>
<div class="fs-section-gap" style="display:flex; gap:8px">
  {#each [{ side: sideA, col: colA, score: sA, won: winA, key: 'a' }, { side: sideB, col: colB, score: sB, won: winB, key: 'b' }] as row}
    <div style="flex:1; background:{row.won ? 'color-mix(in srgb,' + row.col + ' 10%,transparent)' : 'var(--fs-bg-inset)'}; border:1.5px solid {row.won ? row.col : 'var(--fs-border)'}; border-radius:4px; padding:8px; transition:all .2s">
      <button
        onclick={(e) => { e.stopPropagation(); addVictory(row.key); }}
        aria-label="Add victory for {row.side.label} (current: {row.score} of {victories})"
        style="width:100%; background:none; border:none; cursor:pointer; color:{row.col}; font-size:11px; font-weight:700; text-align:center; padding:0 0 6px; font-family:var(--font-mono); letter-spacing:0.06em"
      >
        {row.side.label} {row.won ? '✓ WON' : '+ victory'}
        {#if row.won}<span class="contest-trophy" aria-hidden="true">🏆</span>{/if}
      </button>
      <div style="display:flex; gap:4px; justify-content:center" aria-label="{row.side.label} victories: {row.score} of {victories}">
        {#each Array.from({length: victories}) as _, j}
          <div
            class="{j < row.score ? 'contest-box-filled' : ''}"
            style="width:22px; height:22px; border-radius:3px; background:{j < row.score ? row.col : 'transparent'}; border:2px solid {row.col}; transition:all .15s; display:flex; align-items:center; justify-content:center"
            aria-hidden="true"
          >
            {#if j < row.score}<i class="fa-solid fa-check" aria-hidden="true" style="font-size:10px; color:#fff"></i>{/if}
          </div>
        {/each}
      </div>
      {#if row.side.skills}
        <div style="font-size:10px; color:var(--fs-text-muted); text-align:center; margin-top:4px">{row.side.skills}</div>
      {/if}
    </div>
  {/each}
</div>

<!-- Reset + Twist -->
<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px">
  <button onclick={reset} aria-label="Reset contest scores" style="padding:3px 10px; background:transparent; border:1px solid var(--fs-border); border-radius:3px; font-size:11px; color:var(--fs-text-muted); cursor:pointer">
    <i class="fa-solid fa-arrows-rotate" aria-hidden="true" style="font-size:9px"></i> Reset
  </button>
  {#if data.desc}
    <span style="font-size:11px; color:var(--fs-text-muted); flex:1; line-height:1.3">{data.desc}</span>
  {/if}
</div>

<!-- Twists -->
{#if data.twists && data.twists.length}
  <div class="fs-section-gap">
    <div class="fs-section-hdr">ON A TIE</div>
    <div class="fs-stunt-desc" style="font-style:italic; font-size:12px">{data.twists[0]}</div>
  </div>
{/if}

<!-- Stakes -->
<div style="display:flex; gap:8px">
  <div class="fs-stunt" style="flex:1; border-left:3px solid #2e7d32; border-radius:0 3px 3px 0">
    <div class="fs-stunt-name" style="color:#2e7d32">WIN</div>
    <div class="fs-stunt-desc">{data.stakes_good || ''}</div>
  </div>
  <div class="fs-stunt" style="flex:1; border-left:3px solid #c62828; border-radius:0 3px 3px 0">
    <div class="fs-stunt-name" style="color:#c62828">LOSE</div>
    <div class="fs-stunt-desc">{data.stakes_bad || ''}</div>
  </div>
</div>
