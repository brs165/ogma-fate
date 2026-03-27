<script>
  // /help/reference — printable at-the-table quick reference card
  // One A4 landscape page covering the essential Fate Condensed mechanics.
  import { onMount } from 'svelte';
  let printed = $state(false);

  onMount(() => {
    // Auto-print if ?print=1 in URL
    try {
      if (new URLSearchParams(window.location.search).get('print') === '1') {
        setTimeout(() => window.print(), 400);
      }
    } catch(e) {}
  });
</script>

<svelte:head>
  <title>At-the-Table Reference — Ogma</title>
  <meta name="description" content="Fate Condensed quick reference card. Print for at-the-table use." />
</svelte:head>

<div style="max-width:900px;margin:0 auto;padding:24px 16px">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
    <h1 style="font-size:18px;font-weight:900;margin:0">At-the-Table Reference</h1>
    <div style="display:flex;gap:8px">
      <a href="/help" style="font-size:13px;color:var(--text-dim);text-decoration:none">← Help</a>
      <button class="btn" onclick={() => window.print()} style="font-size:12px;padding:6px 14px">
        <i class="fa-solid fa-print" aria-hidden="true"></i> Print
      </button>
    </div>
  </div>

  <div class="ogma-ref-card">

    <!-- Column 1: Core actions + dice -->
    <div class="ogma-ref-section">
      <div class="ogma-ref-h1">Fate Condensed</div>
      <div class="ogma-ref-h2">4 Actions</div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Overcome</span><span class="ogma-ref-val">Remove obstacle / achieve goal</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Create Advantage</span><span class="ogma-ref-val">Add aspect with free invoke(s)</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Attack</span><span class="ogma-ref-val">Inflict stress / consequences</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Defend</span><span class="ogma-ref-val">Oppose attack or advantage</span></div>

      <div class="ogma-ref-h2">Outcomes</div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Fail (below)</span><span class="ogma-ref-val">Don't achieve goal</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Tie (equal)</span><span class="ogma-ref-val">Succeed with a cost</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Succeed (+1–2)</span><span class="ogma-ref-val">Achieve goal</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Style (+3)</span><span class="ogma-ref-val">Achieve + boost</span></div>

      <div class="ogma-ref-h2">Dice</div>
      <div class="ogma-ref-note">Roll 4dF (each −1/0/+1) + skill rating. Compare to difficulty or opponent's roll.</div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Invoke aspect</span><span class="ogma-ref-val">+2 or reroll (costs 1 FP)</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Free invoke</span><span class="ogma-ref-val">+2 or reroll (no cost)</span></div>
    </div>

    <!-- Column 2: Aspects + FP economy -->
    <div class="ogma-ref-section">
      <div class="ogma-ref-h2">5 Aspect Types</div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">High Concept</span><span class="ogma-ref-val">Who you are — always active</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Trouble</span><span class="ogma-ref-val">What complicates your life</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Other ×3</span><span class="ogma-ref-val">Background, relationships, goals</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Situation</span><span class="ogma-ref-val">On scene/zone — changes with fiction</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Consequence</span><span class="ogma-ref-val">Harm taken — requires treatment to clear</span></div>

      <div class="ogma-ref-h2">Fate Point Economy</div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Session start</span><span class="ogma-ref-val">Refresh (default 3)</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Accept compel</span><span class="ogma-ref-val">Gain 1 FP</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Invoke aspect</span><span class="ogma-ref-val">Spend 1 FP</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Refuse compel</span><span class="ogma-ref-val">Spend 1 FP</span></div>
      <div class="ogma-ref-note">GM starts each scene with 1 FP per PC. Compel NPCs to refill the pool.</div>
    </div>

    <!-- Column 3: Stress + consequences + conflicts -->
    <div class="ogma-ref-section">
      <div class="ogma-ref-h2">Stress</div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Base tracks</span><span class="ogma-ref-val">3 boxes physical + 3 mental</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Physique/Will 1–2</span><span class="ogma-ref-val">+1 box to that track</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Physique/Will 3+</span><span class="ogma-ref-val">+3 boxes to that track</span></div>
      <div class="ogma-ref-note">Stress clears end of scene. Check highest single box that covers the shift.</div>

      <div class="ogma-ref-h2">Consequences</div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Mild (−2)</span><span class="ogma-ref-val">Absorb 2 shifts — clears end of scene treated</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Moderate (−4)</span><span class="ogma-ref-val">Absorb 4 — clears end of session treated</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Severe (−6)</span><span class="ogma-ref-val">Absorb 6 — clears end of arc treated</span></div>

      <div class="ogma-ref-h2">Skill Ladder</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 4mm">
        {#each [['Mediocre','0'],['Average','1'],['Fair','2'],['Good','3'],['Great','4'],['Superb','5'],['Fantastic','6'],['Epic','7']] as [l,n]}
          <div class="ogma-ref-row" style="border:none;padding:0.3mm 0">
            <span class="ogma-ref-label" style="font-weight:400">{l}</span>
            <span style="font-weight:700;font-size:8pt">+{n}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Column 4: Conflicts + scene types -->
    <div class="ogma-ref-section">
      <div class="ogma-ref-h2">Conflict Turn</div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">1. Set scene</span><span class="ogma-ref-val">Aspects, zones, objectives</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">2. Determine order</span><span class="ogma-ref-val">Notice (or agree)</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">3. Exchange</span><span class="ogma-ref-val">Everyone acts once</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">4. Concede option</span><span class="ogma-ref-val">Before opponent rolls — gain FP</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">5. Taken out</span><span class="ogma-ref-val">Opponent chooses what happens</span></div>

      <div class="ogma-ref-h2">Scene Types</div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Challenge</span><span class="ogma-ref-val">Series of overcome rolls, each matters</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Contest</span><span class="ogma-ref-val">Race to 3 victories (ties = new aspect)</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Conflict</span><span class="ogma-ref-val">Stress + consequences until taken out/concede</span></div>

      <div class="ogma-ref-h2">Milestones</div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Minor</span><span class="ogma-ref-val">Swap skill, rename aspect, rename consequence</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Significant</span><span class="ogma-ref-val">+1 skill point or stunt + minor</span></div>
      <div class="ogma-ref-row"><span class="ogma-ref-label">Major</span><span class="ogma-ref-val">+1 refresh, rename HC, clear severe + significant</span></div>
      <div class="ogma-ref-note" style="margin-top:4mm;font-size:7pt">Fate Condensed SRD — CC BY 3.0 — fate-srd.com · Generated by Ogma (ogma.net)</div>
    </div>

  </div>
</div>
