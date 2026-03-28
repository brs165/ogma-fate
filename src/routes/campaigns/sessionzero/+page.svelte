<script>
  import { onMount } from 'svelte';
  import { Progress } from 'bits-ui';
  import { generate, mergeUniversal, filteredTables } from '$lib/engine.js';
  import { CAMPAIGNS } from '$lib/../data/shared.js';
  import { LS } from '$lib/db.js';
  import Footer from '$lib/components/shared/Footer.svelte';

  let theme = $state('dark');
  let step = $state(0);
  let campId = $state(null);
  let playerCount = $state(3);

  // Generated content per step
  let backstories = $state([]);
  let seedData = $state(null);
  let sceneData = $state(null);
  let npcData = $state(null);
  let extras = $state([]);

  const STEPS = [
    { id: 'world',   n: 1, label: 'World' },
    { id: 'players', n: 2, label: 'Players' },
    { id: 'seed',    n: 3, label: 'Seed' },
    { id: 'scene',   n: 4, label: 'Scene' },
    { id: 'npc',     n: 5, label: 'NPC' },
    { id: 'done',    n: 6, label: 'Done' },
  ];

  const WORLD_META = {
    thelongafter: { name: 'The Long After', icon: '◈', genre: 'Sword & Planet' },
    cyberpunk:    { name: 'Neon Abyss', icon: '⬡', genre: 'Cyberpunk' },
    fantasy:      { name: 'Shattered Kingdoms', icon: '✦', genre: 'Dark Fantasy' },
    space:        { name: 'Void Runners', icon: '◯', genre: 'Space Western' },
    victorian:    { name: 'The Gaslight Chronicles', icon: '⊕', genre: 'Gothic Horror' },
    postapoc:     { name: 'The Long Road', icon: '◻', genre: 'Post-Apocalypse' },
    western:      { name: 'Dust and Iron', icon: '◈', genre: 'Frontier Western' },
    dVentiRealm:  { name: 'dVenti Realm', icon: '⬟', genre: 'High Fantasy' },
  };
  const WORLD_IDS = Object.keys(WORLD_META);

  let campName = $derived(campId && WORLD_META[campId] ? WORLD_META[campId].name : '');

  function roll(genId) {
    if (!campId || !CAMPAIGNS[campId]) return null;
    try {
      const t = filteredTables(mergeUniversal(CAMPAIGNS[campId].tables), {});
      return generate(genId, t, playerCount, {});
    } catch (e) {
      console.error('Prep Wizard generate failed:', genId, e);
      return null;
    }
  }

  function selectWorld(id) { campId = id; }

  function nextStep() {
    if (step === 0 && !campId) return;
    step += 1;
    // Auto-generate content for steps that need it
    if (step === 1) generateBackstories();
    if (step === 2 && !seedData) seedData = roll('seed');
    if (step === 3 && !sceneData) sceneData = roll('scene');
    if (step === 4 && !npcData) npcData = roll('npc_major');
  }
  function prevStep() { if (step > 0) step -= 1; }

  function generateBackstories() {
    backstories = [];
    for (let i = 0; i < playerCount; i++) {
      backstories.push(roll('backstory'));
    }
    backstories = backstories;
  }

  function rerollBackstory(i) {
    backstories[i] = roll('backstory');
    backstories = backstories;
  }

  function rerollSeed() { seedData = roll('seed'); }
  function rerollScene() { sceneData = roll('scene'); }
  function rerollNpc() { npcData = roll('npc_major'); }

  function goToBoard() {
    window.location.href = '/campaigns/' + (campId || 'fantasy');
  }

  function sendAllToTable() {
    // Pack all generated cards into sessionStorage, navigate to campaign
    // Campaign.svelte reads ogma_sz_handoff on mount and fires ogma:sz-card events
    const cards = [];
    if (seedData)   cards.push({ genId: 'seed',      data: seedData });
    if (sceneData)  cards.push({ genId: 'scene',     data: sceneData });
    if (npcData)    cards.push({ genId: 'npc_major', data: npcData });
    backstories.forEach(b => { if (b) cards.push({ genId: 'backstory', data: b }); });
    if (!cards.length) { goToBoard(); return; }
    try {
      sessionStorage.setItem('ogma_sz_handoff', JSON.stringify({ campId, cards, ts: Date.now() }));
    } catch(e) {}
    window.location.href = '/campaigns/' + (campId || 'fantasy') + '?sz=1';
  }

  function exportSession() {
    const items = [];
    if (seedData) items.push({ generator: 'seed', label: seedData.location || 'Seed', data: seedData, ts: Date.now() });
    if (sceneData) items.push({ generator: 'scene', label: (sceneData.aspects && sceneData.aspects[0]) ? (sceneData.aspects[0].name || 'Scene') : 'Scene', data: sceneData, ts: Date.now() });
    if (npcData) items.push({ generator: 'npc_major', label: npcData.name || 'NPC', data: npcData, ts: Date.now() });
    backstories.forEach((b, i) => {
      if (b) items.push({ generator: 'backstory', label: 'Backstory ' + (i + 1), data: b, ts: Date.now() });
    });
    const exportObj = {
      format: 'ogma', version: '2.0.0',
      campaign: campName || '', campId: campId || '',
      ts: Date.now(),
      results: items,
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (campId || 'ogma') + '-session-prep.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  onMount(() => {
    try {
      theme = LS.get('theme') || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
    LS.set('theme', theme);
  }
</script>

<svelte:head>
  <title>Prep Wizard — Ogma</title>
  <meta name="description" content="10-minute GM prep wizard for Fate Condensed. Start with a world, end with a session." />
</svelte:head>

<div class="land-shell">
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="land-topnav topbar">
    <a href="/" class="topbar-wordmark" aria-label="Ogma home">OGMA</a>
    <div class="topbar-spacer" style="flex:1"></div>
    <div class="topbar-status">
      <a href="/help" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none"><i class="fa-solid fa-book-open" aria-hidden="true"></i> Help</a>
      <a href="/about" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none">About</a>
      <button class="btn btn-icon btn-ghost" onclick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style="width:44px;height:44px">{theme === 'dark' ? '☀️' : '◑'}</button>
    </div>
  </header>

  <main id="main-content" style="flex:1;display:flex;flex-direction:column;align-items:center;padding:24px 16px 80px">
    <div style="width:100%;max-width:600px">

      <!-- Progress tracker -->
      <div class="pw-track" aria-label="Wizard progress">
        {#each STEPS as s, i}
          <div class="pw-track-step" class:done={i < step} class:active={i === step}>
            <div class="pw-track-dot">{i < step ? '✓' : s.n}</div>
            <div class="pw-track-label">{s.label}</div>
          </div>
        {/each}
      </div>
      <Progress.Root
        value={step}
        max={STEPS.length - 1}
        aria-label="Session Zero progress"
        style="margin-bottom:20px"
      >
        <Progress.Indicator style="width:{(step / (STEPS.length - 1)) * 100}%" />
      </Progress.Root>

      <!-- ── STEP 1: Choose World ──────────────────────────────────── -->
      {#if step === 0}
        <div class="pw-step-content">
        <div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:6px">STEP 1 OF 6</div>
        <h1 style="font-size:26px;font-weight:800;letter-spacing:-.025em;color:var(--text);margin-bottom:8px;line-height:1.2">Which world are you running?</h1>
        <p style="font-size:13px;color:var(--text-dim);line-height:1.65;margin-bottom:24px">Pick a campaign setting. Everything after this is tailored to your world.</p>

        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:24px">
          {#each WORLD_IDS as id}
            <button
              style="background:{campId === id ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--glass-bg)'};border:1px solid {campId === id ? 'var(--accent)' : 'var(--glass-border)'};border-radius:10px;padding:14px;cursor:pointer;text-align:left;font-family:var(--font-ui);{campId === id ? 'box-shadow:0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent)' : ''}"
              onclick={() => selectWorld(id)}
              aria-pressed={String(campId === id)}
            >
              <div style="font-size:22px;margin-bottom:6px">{WORLD_META[id].icon}</div>
              <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px">{WORLD_META[id].name}</div>
              <div style="font-size:10px;color:var(--text-muted)">{WORLD_META[id].genre}</div>
            </button>
          {/each}
        </div>

        </div><!-- /pw-step-content -->

      <!-- ── STEP 2: Player Count ──────────────────────────────────── -->
      {:else if step === 1}
        <div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:6px">STEP 2 OF 6</div>
        <h1 style="font-size:26px;font-weight:800;letter-spacing:-.025em;color:var(--text);margin-bottom:8px;line-height:1.2">How many players?</h1>
        <p style="font-size:13px;color:var(--text-dim);line-height:1.65;margin-bottom:24px">This sets the opposition scale and generates a backstory hook for each player to kick off the session.</p>

        <div style="display:flex;align-items:center;justify-content:center;gap:24px;margin-bottom:24px">
          <button style="width:44px;height:44px;border-radius:50%;border:2px solid var(--border);background:var(--panel);color:var(--text);font-size:20px;font-weight:700;cursor:pointer" disabled={playerCount <= 1} onclick={() => { playerCount -= 1; generateBackstories(); }}>&minus;</button>
          <div style="text-align:center">
            <div style="font-size:48px;font-weight:900;color:var(--text);line-height:1">{playerCount}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px">{playerCount === 1 ? 'player' : 'players'}</div>
          </div>
          <button style="width:44px;height:44px;border-radius:50%;border:2px solid var(--border);background:var(--panel);color:var(--text);font-size:20px;font-weight:700;cursor:pointer" disabled={playerCount >= 6} onclick={() => { playerCount += 1; generateBackstories(); }}>+</button>
        </div>

        {#if backstories.length > 0}
          <div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:10px">Backstory hooks &mdash; one per player</div>
          {#each backstories as b, i}
            {#if b}
              <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:8px;padding:12px;margin-bottom:8px">
                <div style="font-size:10px;font-weight:700;color:var(--accent);margin-bottom:4px">Player {i + 1}</div>
                {#if b.question}<div style="font-size:12px;color:var(--text-dim);font-style:italic;margin-bottom:4px">"{b.question}"</div>{/if}
                {#if b.aspect}<div style="font-size:12px;color:var(--text);font-weight:600">{b.aspect}</div>{/if}
                {#if b.hook}<div style="font-size:11px;color:var(--text-dim);margin-top:4px">{b.hook}</div>{/if}
                <button style="margin-top:6px;font-size:11px;padding:4px 10px;border:1px solid var(--border);border-radius:4px;background:var(--panel);color:var(--text-muted);cursor:pointer" onclick={() => rerollBackstory(i)}><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> New hook</button>
              </div>
            {/if}
          {/each}
        {/if}

      <!-- ── STEP 3: Quick Adventure Start (Seed) ─────────────────── -->
      {:else if step === 2}
        <div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:6px">STEP 3 OF 6</div>
        <h1 style="font-size:26px;font-weight:800;letter-spacing:-.025em;color:var(--text);margin-bottom:8px;line-height:1.2">What's the situation?</h1>
        <p style="font-size:13px;color:var(--text-dim);line-height:1.65;margin-bottom:24px">This is your scenario skeleton &mdash; the location, objective, and complication. Prep Scene 1 in full. Follow the players after that.</p>

        {#if seedData}
          <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:10px;overflow:hidden;margin-bottom:16px">
            <div style="padding:10px 14px;background:color-mix(in srgb,var(--accent) 8%,transparent);border-bottom:1px solid var(--glass-border);display:flex;align-items:center;gap:8px">
              <span style="font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)">Quick Adventure Start</span>
              <span style="flex:1"></span>
              <span style="font-size:13px;font-weight:700;color:var(--text)">{seedData.location || ''}</span>
            </div>
            <div style="padding:14px">
              {#if seedData.objective}
                <div style="margin-bottom:10px"><div style="font-size:10px;font-weight:700;color:var(--text-muted);margin-bottom:3px">Objective</div><div style="font-size:13px;color:var(--text)">{seedData.objective}</div></div>
              {/if}
              {#if seedData.complication}
                <div style="margin-bottom:10px"><div style="font-size:10px;font-weight:700;color:var(--c-red,#f87171);margin-bottom:3px">Complication</div><div style="font-size:13px;color:var(--text-dim)">{seedData.complication}</div></div>
              {/if}
              {#if seedData.twist}
                <div><div style="font-size:10px;font-weight:700;color:var(--c-purple,#a78bfa);margin-bottom:3px">Twist &mdash; reveal late</div><div style="font-size:13px;color:var(--text-dim);font-style:italic">{seedData.twist}</div></div>
              {/if}
            </div>
            <div style="padding:8px 14px;font-size:11px;color:var(--text-muted);border-top:1px solid var(--glass-border);font-style:italic">This is a situation, not a plot. The players' choices are the story.</div>
          </div>
          <button style="font-size:12px;padding:8px 16px;border:1px solid var(--border);border-radius:6px;background:var(--panel);color:var(--text-muted);cursor:pointer" onclick={rerollSeed}><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> Reroll seed</button>
        {:else}
          <div style="text-align:center;padding:40px;color:var(--text-muted)">Generating&hellip;</div>
        {/if}

      <!-- ── STEP 4: Scene Setup ───────────────────────────────────── -->
      {:else if step === 3}
        <div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:6px">STEP 4 OF 6</div>
        <h1 style="font-size:26px;font-weight:800;letter-spacing:-.025em;color:var(--text);margin-bottom:8px;line-height:1.2">Where does Session 1 open?</h1>
        <p style="font-size:13px;color:var(--text-dim);line-height:1.65;margin-bottom:24px">Read zone names aloud when you describe the scene. Reveal visible aspects now &mdash; keep hidden ones for discovery rolls.</p>

        {#if sceneData}
          <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:10px;overflow:hidden;margin-bottom:16px">
            <div style="padding:10px 14px;background:color-mix(in srgb,var(--accent) 8%,transparent);border-bottom:1px solid var(--glass-border)">
              <span style="font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)">Scene Setup</span>
            </div>
            <div style="padding:14px">
              {#if Array.isArray(sceneData.aspects) && sceneData.aspects.length > 0}
                <div style="font-size:10px;font-weight:700;color:var(--text-muted);margin-bottom:6px">Situation aspects <span style="font-weight:400;font-style:italic">— facts about the scene anyone can use (invoke for +2 or compel for complications)</span></div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
                  {#each sceneData.aspects as a}
                    <span style="font-size:11px;padding:3px 8px;background:var(--inset);border:1px solid var(--border);border-radius:4px;color:var(--text-dim);font-style:italic">{typeof a === 'string' ? a : (a.name || '')}</span>
                  {/each}
                </div>
              {/if}
              {#if Array.isArray(sceneData.zones) && sceneData.zones.length > 0}
                <div style="font-size:10px;font-weight:700;color:var(--text-muted);margin-bottom:5px">Zones <span style="font-weight:400;font-style:italic">— areas in the scene; moving between zones costs an action</span></div>
                <div style="display:flex;flex-direction:column;gap:4px">
                  {#each sceneData.zones.slice(0, 3) as z}
                    <div style="font-size:11px;color:var(--text-dim)">
                      <strong style="color:var(--text);margin-right:6px">{typeof z === 'string' ? z : (z.name || z[0] || '')}</strong>
                      <span>{typeof z === 'object' ? (z.aspect || z[1] || '') : ''}</span>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
            <div style="padding:8px 14px;font-size:11px;color:var(--text-muted);border-top:1px solid var(--glass-border);font-style:italic">Put at least one usable aspect in reach &mdash; players love having options.</div>
          </div>
          <button style="font-size:12px;padding:8px 16px;border:1px solid var(--border);border-radius:6px;background:var(--panel);color:var(--text-muted);cursor:pointer" onclick={rerollScene}><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> Reroll scene</button>
        {:else}
          <div style="text-align:center;padding:40px;color:var(--text-muted)">Setting the scene&hellip;</div>
        {/if}

      <!-- ── STEP 5: Opening NPC ───────────────────────────────────── -->
      {:else if step === 4}
        <div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:6px">STEP 5 OF 6</div>
        <h1 style="font-size:26px;font-weight:800;letter-spacing:-.025em;color:var(--text);margin-bottom:8px;line-height:1.2">Who do the players meet first?</h1>
        <p style="font-size:13px;color:var(--text-dim);line-height:1.65;margin-bottom:24px">Your opening NPC &mdash; could be an antagonist, a contact, or a bystander. Introduce them through what they're doing, not who they are.</p>

        {#if npcData}
          {@const asp = npcData.aspects || {}}
          {@const skills = npcData.skills || []}
          <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:10px;overflow:hidden;margin-bottom:16px">
            <div style="padding:10px 14px;background:color-mix(in srgb,var(--accent) 8%,transparent);border-bottom:1px solid var(--glass-border);display:flex;align-items:center;gap:8px">
              <span style="font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)">Major NPC</span>
              <span style="flex:1"></span>
              <span style="font-size:13px;font-weight:700;color:var(--text)">{npcData.name || ''}</span>
            </div>
            <div style="padding:14px">
              {#if asp.high_concept}
                <div style="margin-bottom:8px"><div style="font-size:10px;font-weight:700;color:var(--text-muted);margin-bottom:3px">High Concept <span style="font-weight:400;font-style:italic">— their defining trait; invoke it for +2 or compel it for complications</span></div><div style="font-size:13px;color:var(--text);font-style:italic">{asp.high_concept}</div></div>
              {/if}
              {#if asp.trouble}
                <div style="margin-bottom:8px"><div style="font-size:10px;font-weight:700;color:var(--c-red,#f87171);margin-bottom:3px">Trouble <span style="font-weight:400;font-style:italic">— their main weakness; compel it to earn fate points</span></div><div style="font-size:13px;color:var(--text-dim);font-style:italic">{asp.trouble}</div></div>
              {/if}
              {#if skills.length > 0}
                <div style="margin-top:8px">
                  <div style="font-size:10px;font-weight:700;color:var(--text-muted);margin-bottom:5px">Top skills</div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    {#each skills.slice(0, 4) as s}
                      <span style="font-size:11px;color:var(--text-dim);background:var(--inset);border:1px solid var(--border);border-radius:4px;padding:2px 7px">
                        <strong style="color:var(--accent);font-family:var(--font-mono);margin-right:4px">+{s.r}</strong>{s.name}
                      </span>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
            <div style="padding:8px 14px;font-size:11px;color:var(--text-muted);border-top:1px solid var(--glass-border);font-style:italic">Refresh: {npcData.refresh || 3}. Introduce through action &mdash; let the players figure out who they are.</div>
          </div>
          <button style="font-size:12px;padding:8px 16px;border:1px solid var(--border);border-radius:6px;background:var(--panel);color:var(--text-muted);cursor:pointer" onclick={rerollNpc}><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> Reroll NPC</button>
        {:else}
          <div style="text-align:center;padding:40px;color:var(--text-muted)">Generating your opening NPC&hellip;</div>
        {/if}

      <!-- ── STEP 6: Done ──────────────────────────────────────────── -->
      {:else if step === 5}
        <div style="text-align:center;padding:16px 0 0;margin-bottom:24px">
          <div style="display:inline-flex;align-items:center;gap:8px;background:color-mix(in srgb,var(--c-green) 12%,transparent);border:1px solid color-mix(in srgb,var(--c-green) 25%,transparent);border-radius:100px;padding:8px 20px;font-size:14px;font-weight:800;color:var(--c-green);margin-bottom:20px;letter-spacing:.04em"><i class="fa-solid fa-check" aria-hidden="true"></i> Ready to play</div>
          <h1 style="font-size:24px;font-weight:800;color:var(--text);margin-bottom:8px;letter-spacing:-.02em">You have a session.</h1>
          <p style="font-size:13px;color:var(--text-dim);line-height:1.65;margin-bottom:24px;max-width:440px;margin-left:auto;margin-right:auto">
            Seed, scene, NPC{backstories.length > 0 ? `, and ${backstories.length} backstory hook${backstories.length > 1 ? 's' : ''}` : ''}. Open the generator and your cards are ready to play.
          </p>
        </div>

        <div class="pw-summary-items">
          {#if seedData}
            <div class="pw-summary-item">
              <span class="pw-summary-gen">Seed</span>
              <span class="pw-summary-text">{seedData.location || ''} &mdash; {seedData.objective || ''}</span>
            </div>
          {/if}
          {#if sceneData}
            <div class="pw-summary-item">
              <span class="pw-summary-gen">Scene</span>
              <span class="pw-summary-text">{Array.isArray(sceneData.aspects) && sceneData.aspects[0] ? (typeof sceneData.aspects[0] === 'string' ? sceneData.aspects[0] : sceneData.aspects[0].name || 'Scene ready') : 'Scene ready'}</span>
            </div>
          {/if}
          {#if npcData}
            <div class="pw-summary-item">
              <span class="pw-summary-gen">NPC</span>
              <span class="pw-summary-text">{npcData.name || ''}{npcData.aspects?.high_concept ? ' — ' + npcData.aspects.high_concept : ''}</span>
            </div>
          {/if}
        </div>

        <div class="pw-action-row">
          <button
            style="display:inline-flex;align-items:center;gap:8px;background:var(--accent);border:2px solid var(--accent);border-radius:8px;padding:13px 28px;font-size:14px;font-weight:800;color:#fff;cursor:pointer;box-shadow:0 0 16px color-mix(in srgb,var(--accent) 35%,transparent)"
            onclick={sendAllToTable}
          ><i class="fa-solid fa-table-cells" aria-hidden="true"></i> Send All to Table</button>
          <button
            style="display:inline-flex;align-items:center;gap:8px;background:var(--glass-bg);border:2px solid var(--border-mid);border-radius:8px;padding:13px 28px;font-size:14px;font-weight:800;color:var(--text);cursor:pointer"
            onclick={goToBoard}
          ><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> Open Generator</button>
          <button
            style="background:none;border:1px solid var(--border);border-radius:8px;padding:12px 20px;font-size:13px;font-weight:600;color:var(--text-dim);cursor:pointer"
            onclick={exportSession}
            title="Export all prep cards as Ogma JSON"
            aria-label="Export session prep as JSON"
          ><i class="fa-solid fa-arrow-down" aria-hidden="true"></i> Export JSON</button>
          <button
            style="background:none;border:1px solid var(--border);border-radius:8px;padding:12px 20px;font-size:13px;font-weight:700;color:var(--text-dim);cursor:pointer"
            onclick={() => { if (typeof window !== 'undefined') window.print(); }}
            title="Print your session sheet"
          ><i class="fa-solid fa-print" aria-hidden="true"></i> Print</button>
          <a href="/campaigns/character-creation?world={campId}&mode=standard&from=sz" class="btn btn-ghost" style="font-size:13px;font-weight:600;padding:12px 20px">&rarr; Character Creation</a>
        </div>

        <div style="text-align:center;margin-top:12px">
          <button style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:12px;text-decoration:underline" onclick={() => { step = 0; campId = null; seedData = null; sceneData = null; npcData = null; backstories = []; }}>Start over</button>
        </div>
      {/if}

      <!-- ── Navigation ────────────────────────────────────────────── -->
      <div style="display:flex;justify-content:space-between;margin-top:32px;padding-top:16px;border-top:1px solid var(--border)">
        {#if step > 0}
          <button style="padding:10px 20px;border:1px solid var(--border);border-radius:6px;background:var(--panel);color:var(--text-dim);cursor:pointer;font-size:14px;font-weight:600" onclick={prevStep}>&larr; Back</button>
        {:else}
          <div></div>
        {/if}
        {#if step < 5}
          <button style="padding:10px 20px;border:2px solid var(--accent);border-radius:6px;background:var(--glass-bg);color:var(--text);cursor:pointer;font-size:14px;font-weight:700;box-shadow:0 0 8px color-mix(in srgb,var(--accent) 20%,transparent)" disabled={step === 0 && !campId} onclick={nextStep}>Next &rarr;</button>
        {/if}
      </div>

    </div>
  </main>

  <Footer />
</div>
