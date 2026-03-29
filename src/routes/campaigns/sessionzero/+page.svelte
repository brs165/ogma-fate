<script>
  import { onMount, untrack } from 'svelte';
  import { generate, mergeUniversal, filteredTables, suggestSkillPyramid, suggestAspects, suggestStunts } from '$lib/engine.js';
  import { CAMPAIGNS } from '$lib/../data/shared.js';
  import { WORLD_META, WORLD_DATA, ALL_SKILLS, SKILL_LABEL } from '$lib/../data/shared.js';
  import { LS } from '$lib/db.js';
  import Footer from '$lib/components/shared/Footer.svelte';

  let theme = $state('dark');
  let step = $state(0);
  let campId = $state(null);
  let mode = $state('standard');
  let pcCount = $state(2);
  let pcIndex = $state(0);
  let pcDrafts = $state([]);
  let rerolls = $state(0);

  // GM Prep state (Layer 4)
  let seedData = $state(null);
  let sceneData = $state(null);
  let npcData = $state(null);

  const WORLD_IDS = Object.keys(WORLD_META);

  const MODES = [
    { id: 'standard',  label: 'Condensed Standard', tag: 'Recommended', sub: 'High Concept, Trouble, Relationship, leave the rest blank, play. Fastest path to the table.' },
    { id: 'trio',      label: 'Phase Trio',         tag: 'Enriched',    sub: 'Collaborative backstory workshop. Three phases produce all five aspects through shared stories. ~20 min extra.' },
    { id: 'flashback', label: 'Flashback Slots',    tag: 'Play-First',  sub: 'Start with High Concept + Trouble + top skill only. Discover the rest during play through flashback moments.' },
  ];

  // ── Dynamic step list based on mode ──
  let STEPS = $derived((() => {
    const base = [
      { id: 'world',       title: 'Choose Your World' },
      { id: 'players',     title: 'How Many Players?' },
      { id: 'mode',        title: 'How Deep Do You Want to Go?' },
      { id: 'setting',     title: 'The World You\'re Playing In' },
      { id: 'highconcept', title: 'High Concept' },
      { id: 'trouble',     title: 'Trouble' },
    ];
    if (mode === 'trio') {
      base.push(
        { id: 'phase1', title: 'Phase 1 \u2014 Your First Adventure' },
        { id: 'phase2', title: 'Phase 2 \u2014 Crossing Paths' },
        { id: 'phase3', title: 'Phase 3 \u2014 Crossing Paths Again' },
      );
    } else if (mode === 'flashback') {
      base.push({ id: 'flashbacks', title: 'Flashback Slots' });
    } else {
      base.push(
        { id: 'relationship', title: 'Relationship Aspect' },
        { id: 'freeaspects',  title: 'Free Aspects' },
      );
    }
    base.push(
      { id: 'skills',    title: 'Skills' },
      { id: 'stunts',    title: 'Stunts' },
      { id: 'stress',    title: 'Stress & Consequences' },
      { id: 'gmprep',    title: 'GM Prep' },
      { id: 'questions', title: 'Session Zero Questions' },
      { id: 'summary',   title: 'Summary & Export' },
    );
    return base;
  })());

  let totalSteps = $derived(STEPS.length);
  let stepId = $derived(STEPS[step] ? STEPS[step].id : 'world');
  let progress = $derived(((step + 1) / totalSteps * 100));
  $effect(() => { if (step >= STEPS.length) step = 0; });

  // ── PC drafts ──
  $effect(() => {
    const count = pcCount;
    pcDrafts = untrack(() =>
      Array.from({ length: count }, (_, i) =>
        pcDrafts[i] ?? { name: '', hc: '', trouble: '', relationship: '', free1: '', free2: '', skills: [], stunts: [], phase1: '', phase2: '', phase3: '' }
      )
    );
  });
  let currentPc = $derived(pcDrafts[pcIndex] || { name: '', hc: '', trouble: '' });

  function updateCurrentPc(field, value) {
    pcDrafts = pcDrafts.map((pc, i) => i === pcIndex ? { ...pc, [field]: value } : pc);
  }

  // ── Tables for suggestion engine ──
  let tables = $derived((() => {
    if (!campId || !CAMPAIGNS[campId]) return null;
    try { return filteredTables(mergeUniversal(CAMPAIGNS[campId].tables), {}); }
    catch(e) { return null; }
  })());

  // ── World data ──
  let wd = $derived(campId ? WORLD_DATA[campId] : null);
  let camp = $derived(campId ? WORLD_META[campId] : null);
  let ciIdx = $derived(wd ? rerolls % wd.current.length : 0);
  let iiIdx = $derived(wd && wd.impending.length > 1 ? (rerolls + 1) % wd.impending.length : 0);

  // ── Suggestion helpers ──
  let hcSuggestions = $state([]);
  let trSuggestions = $state([]);
  let relSuggestions = $state([]);
  let freeSuggestions = $state([]);

  function refreshHcSuggestions() {
    if (tables) hcSuggestions = suggestAspects('high_concept', tables, 4);
  }
  function refreshTrSuggestions() {
    if (tables) trSuggestions = suggestAspects('trouble', tables, 4);
  }
  function refreshRelSuggestions() {
    if (tables) relSuggestions = suggestAspects('relationship', tables, 4);
  }
  function refreshFreeSuggestions() {
    if (tables) freeSuggestions = suggestAspects('free', tables, 4);
  }

  function reroll() { rerolls += 1; }

  // ── Navigation ──
  function next() {
    // PC loop: cycle through PCs on HC and Trouble steps
    if (stepId === 'trouble' && pcIndex < pcCount - 1) {
      pcIndex += 1;
      step = STEPS.findIndex(s => s.id === 'highconcept');
      refreshHcSuggestions();
      return;
    }
    if (stepId === 'trouble') pcIndex = 0;
    if (step < totalSteps - 1) step += 1;
    // Auto-refresh suggestions when entering relevant steps
    if (STEPS[step]) {
      const nid = STEPS[step].id;
      if (nid === 'highconcept') refreshHcSuggestions();
      if (nid === 'trouble') refreshTrSuggestions();
      if (nid === 'relationship') refreshRelSuggestions();
      if (nid === 'freeaspects') refreshFreeSuggestions();
    }
  }
  function back() {
    if (stepId === 'highconcept' && pcIndex > 0) {
      pcIndex -= 1;
      step = STEPS.findIndex(s => s.id === 'trouble');
      refreshTrSuggestions();
      return;
    }
    if (step > 0) step -= 1;
  }

  // ── Theme ──
  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
    LS.set('theme', theme);
  }

  onMount(() => {
    try {
      theme = LS.get('theme') || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  });
</script>

<svelte:head>
  <title>Session Zero \u2014 Ogma</title>
  <meta name="description" content="Unified Fate Condensed session zero wizard. World setup, character creation, and GM prep in one flow." />
</svelte:head>

<div class="land-shell">
  <a href="#main" class="skip-link">Skip to main content</a>

  <header class="land-topnav topbar">
    <a href="/" class="topbar-wordmark" aria-label="Ogma home">OGMA</a>
    <div class="topbar-spacer" style="flex:1"></div>
    <div class="topbar-status">
      <a href="/help" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none"><i class="fa-solid fa-book-open" aria-hidden="true"></i> Help</a>
      <a href="/about" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none">About</a>
      <button class="btn btn-icon btn-ghost" onclick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style="width:44px;height:44px">{theme === 'dark' ? '\u2600\uFE0F' : '\u25D1'}</button>
    </div>
  </header>

  <div class="sz-container" id="main">
    {#if step === 0}
      <div class="sz-header">
        <div class="sz-title">Session Zero</div>
        <div class="sz-subtitle">Fate Condensed \u2014 World, Characters & GM Prep</div>
      </div>
    {/if}

    <!-- Progress -->
    <div class="sz-progress-wrap">
      <div class="sz-step-counter">Step {step + 1} of {totalSteps}</div>
      <div class="sz-progress-bar" role="progressbar"
        aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={totalSteps}
        aria-label="Step {step + 1} of {totalSteps}">
        <div class="sz-progress-fill" style="width:{progress}%"></div>
      </div>
    </div>

    <div class="sz-step-title">{STEPS[step].title}</div>

    <!-- ── STEP: World ─────────────────────────────────── -->
    {#if stepId === 'world'}
      <div class="sz-body">
        <p>Which world are you playing in? This determines setting details, example aspects, and story prompts throughout the wizard.</p>
        <div class="sz-info-box">
          <span style="font-size:18px;flex-shrink:0"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i></span>
          <span><strong style="color:var(--text);font-weight:600">Works solo or with your full table.</strong> Run it alone to prep your campaign and print character sheets, or share your screen and walk through it together as a group.</span>
        </div>
      </div>
      <div class="sz-grid sz-grid-2">
        {#each WORLD_IDS as id}
          <button class="sz-option" class:selected={campId === id} onclick={() => { campId = id; }} type="button" aria-pressed={String(campId === id)}>
            <div class="sz-option-title"><i class="fa-solid {WORLD_META[id].icon}" aria-hidden="true" style="margin-right:6px"></i>{WORLD_META[id].name}</div>
            <div class="sz-option-sub">{WORLD_META[id].genre}</div>
          </button>
        {/each}
      </div>

    <!-- ── STEP: Players ───────────────────────────────── -->
    {:else if stepId === 'players'}
      <div class="sz-body">
        <p>How many players are at the table? The wizard will collect a name, High Concept, and Trouble for each one.</p>
        <div class="sz-pc-count-row">
          {#each [1,2,3,4,5,6] as n}
            <button class="sz-option sz-pc-count-btn" class:selected={pcCount === n} onclick={() => { pcCount = n; pcIndex = 0; }} type="button" aria-pressed={String(pcCount === n)}>
              <div class="sz-option-title">{n}</div>
              <div class="sz-option-sub">{n === 1 ? 'Solo' : n + ' players'}</div>
            </button>
          {/each}
        </div>
        <div class="sz-tip">You can run the wizard once per player if you prefer. This loops through all PCs in one pass.</div>
      </div>

    <!-- ── STEP: Mode ──────────────────────────────────── -->
    {:else if stepId === 'mode'}
      <div class="sz-body">
        <p>All three methods produce valid Fate Condensed characters. Choose based on how much time you have and how much pre-play collaboration your group wants.</p>
      </div>
      <div class="sz-grid">
        {#each MODES as md}
          <button class="sz-option" class:selected={mode === md.id} onclick={() => { mode = md.id; }} type="button" aria-pressed={String(mode === md.id)} style="text-align:left">
            <div class="sz-option-tag">{md.tag}</div>
            <div class="sz-option-title">{md.label}</div>
            <div class="sz-option-sub">{md.sub}</div>
          </button>
        {/each}
      </div>

    <!-- ── STEP: Setting ───────────────────────────────── -->
    {:else if stepId === 'setting'}
      <div class="sz-body">
        <p>Read these aloud. These are the pressures that define your campaign world. Everything your characters do will exist in the shadow of these issues.</p>

        {#if wd}
          <div class="sz-card">
            <div class="sz-card-title">&#9889; Current Issue &mdash; Happening NOW</div>
            <div class="sz-issue-name">{wd.current[ciIdx].name}</div>
            <div class="sz-issue-desc">{wd.current[ciIdx].desc}</div>
          </div>

          <div class="sz-card">
            <div class="sz-card-title"><i class="fa-solid fa-cloud-bolt" aria-hidden="true"></i> Impending Issue &mdash; Brewing on the Horizon</div>
            <div class="sz-issue-name">{wd.impending[iiIdx].name}</div>
            <div class="sz-issue-desc">{wd.impending[iiIdx].desc}</div>
          </div>

          <button class="btn btn-ghost sz-reroll" onclick={reroll} type="button"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> Different issues</button>
        {/if}

        <div class="sz-tip">Discuss for 5 minutes: What does this world feel like? Who has power? What's at stake? This shared understanding is the foundation everything else builds on.</div>
      </div>

    <!-- ── STEP: High Concept ──────────────────────────── -->
    {:else if stepId === 'highconcept'}
      <div class="sz-body">
        {#if pcCount > 1}
          <div class="sz-pc-progress">
            <span class="sz-pc-progress-label">Player {pcIndex + 1} of {pcCount}</span>
            <div class="sz-pc-progress-pips">
              {#each pcDrafts as _, i}<div class="sz-pc-pip" class:active={i === pcIndex} class:done={i < pcIndex}></div>{/each}
            </div>
          </div>
        {/if}
        <div class="sz-input-group">
          <label class="sz-input-label" for="pc-name">Character Name</label>
          <input id="pc-name" type="text" class="sz-input" placeholder="Leave blank to fill in later" value={currentPc.name} oninput={e => updateCurrentPc('name', e.target.value)} autocomplete="off" />
          <div class="sz-mutable"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> You can change this after any session</div>
        </div>
        <p>Who is this character? One phrase that captures their role in the story. <span style="font-style:italic;color:var(--text-muted)">Anyone can invoke your High Concept for +2 when it applies, or the GM can compel it to create complications (you earn a fate point).</span></p>
        <div class="sz-prompt-box">"If someone asked <em>what's your character about?</em> at a bar, what would you say?"</div>
        <div class="sz-input-group">
          <label class="sz-input-label" for="pc-hc">High Concept</label>
          <input id="pc-hc" type="text" class="sz-input" placeholder="e.g. Burned Ex-Corporate Fixer" value={currentPc.hc} oninput={e => updateCurrentPc('hc', e.target.value)} autocomplete="off" />
          <div class="sz-mutable"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> You can change this after any session</div>
        </div>
        {#if hcSuggestions.length > 0}
          <div class="sz-card">
            <div class="sz-card-title">{camp ? camp.name : ''} Suggestions</div>
            <div class="sz-suggest-row">
              {#each hcSuggestions as s}
                <button class="sz-suggest-btn" type="button" onclick={() => updateCurrentPc('hc', s)}>{s}</button>
              {/each}
            </div>
            <button class="btn btn-ghost sz-reroll" onclick={refreshHcSuggestions} type="button" style="margin-top:8px"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> More suggestions</button>
          </div>
        {/if}
        <div class="sz-dnd">In D&amp;D, your class + race IS your character concept. In Fate, High Concept is a narrative phrase that can be invoked and compelled.</div>
        <div class="sz-tip">Double-edged = good. "Sword-Sworn to a Dead King" helps AND causes problems.</div>
      </div>

    <!-- ── STEP: Trouble ───────────────────────────────── -->
    {:else if stepId === 'trouble'}
      <div class="sz-body">
        {#if pcCount > 1}
          <div class="sz-pc-progress">
            <span class="sz-pc-progress-label">Player {pcIndex + 1} of {pcCount} &mdash; Trouble</span>
            <div class="sz-pc-progress-pips">
              {#each pcDrafts as _, i}<div class="sz-pc-pip" class:active={i === pcIndex} class:done={i < pcIndex}></div>{/each}
            </div>
          </div>
        {/if}
        <p>What makes {currentPc.name || 'this character'}'s life harder? This is the aspect that will earn the most fate points. <span style="font-style:italic;color:var(--text-muted)">When the GM compels your Trouble, you receive a fate point. The worse the Trouble, the more fate points you earn &mdash; and FP fuel invokes (+2) on your other rolls.</span></p>
        <div class="sz-prompt-box">"When things go wrong for your character, <em>why</em> do they go wrong? What keeps pulling them back into trouble?"</div>
        <div class="sz-input-group">
          <label class="sz-input-label" for="pc-trouble">Trouble</label>
          <input id="pc-trouble" type="text" class="sz-input" placeholder="e.g. The Handler Knows Everything" value={currentPc.trouble} oninput={e => updateCurrentPc('trouble', e.target.value)} autocomplete="off" />
          <div class="sz-mutable"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> You can change this after any session</div>
        </div>
        {#if trSuggestions.length > 0}
          <div class="sz-card">
            <div class="sz-card-title">Setting Suggestions</div>
            <div class="sz-suggest-row">
              {#each trSuggestions as s}
                <button class="sz-suggest-btn" type="button" onclick={() => updateCurrentPc('trouble', s)}>{s}</button>
              {/each}
            </div>
            <button class="btn btn-ghost sz-reroll" onclick={refreshTrSuggestions} type="button" style="margin-top:8px"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> More suggestions</button>
          </div>
        {/if}
        <div class="sz-tip">A boring trouble earns you nothing. "Has Enemies" is flat. "The Warlord's Daughter Wants Me Dead" is a compel waiting to happen every single session.</div>
      </div>

    <!-- ── STEP: Relationship (standard mode) ────────── -->
    {:else if stepId === 'relationship'}
      <div class="sz-body">
        {#if pcCount > 1}
          <div class="sz-pc-progress">
            <span class="sz-pc-progress-label">Player {pcIndex + 1} of {pcCount} &mdash; Relationship</span>
            <div class="sz-pc-progress-pips">
              {#each pcDrafts as _, i}<div class="sz-pc-pip" class:active={i === pcIndex} class:done={i < pcIndex}></div>{/each}
            </div>
          </div>
        {/if}
        <p>Pair up. Each player connects their character to one other PC. Good relationships have tension &mdash; not hostility, but imbalance. <span style="font-style:italic;color:var(--text-muted)">Like all aspects, this can be invoked (+2) when the relationship helps, or compelled (fate point + complication) when it causes friction.</span></p>
        <div class="sz-card">
          <div class="sz-card-title">Pick a Template</div>
          <ul class="sz-template-list">
            <li>We served together, but one of us got the other in trouble.</li>
            <li>You saved my life. I still don't know why.</li>
            <li>We want the same thing but disagree on how to get it.</li>
            <li>I owe you something I can never repay.</li>
            <li>We used to be close. Something changed.</li>
          </ul>
        </div>
        <div class="sz-input-group">
          <label class="sz-input-label" for="pc-rel">Relationship Aspect</label>
          <input id="pc-rel" type="text" class="sz-input" placeholder="e.g. We Survived the Siege Together" value={currentPc.relationship} oninput={e => updateCurrentPc('relationship', e.target.value)} autocomplete="off" />
          <div class="sz-mutable"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> You can change this after any session</div>
        </div>
        {#if relSuggestions.length > 0}
          <div class="sz-card">
            <div class="sz-card-title">Setting Suggestions</div>
            <div class="sz-suggest-row">
              {#each relSuggestions as s}
                <button class="sz-suggest-btn" type="button" onclick={() => updateCurrentPc('relationship', s)}>{s}</button>
              {/each}
            </div>
            <button class="btn btn-ghost sz-reroll" onclick={refreshRelSuggestions} type="button" style="margin-top:8px"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> More suggestions</button>
          </div>
        {/if}
        <div class="sz-tip">The relationship aspect is the strongest compel material in the entire campaign. Cross-PC history is fuel. Invest here.</div>
      </div>

    <!-- ── STEP: Free Aspects (standard mode) ──────── -->
    {:else if stepId === 'freeaspects'}
      <div class="sz-body">
        {#if pcCount > 1}
          <div class="sz-pc-progress">
            <span class="sz-pc-progress-label">Player {pcIndex + 1} of {pcCount} &mdash; Free Aspects</span>
            <div class="sz-pc-progress-pips">
              {#each pcDrafts as _, i}<div class="sz-pc-pip" class:active={i === pcIndex} class:done={i < pcIndex}></div>{/each}
            </div>
          </div>
        {/if}
        <p>These can be anything &mdash; gear, history, reputation, a catchphrase, a connection to the setting. No restrictions beyond fitting the world.</p>
        <div class="sz-card sz-card--success">
          <div class="sz-card-title"><i class="fa-solid fa-check" aria-hidden="true"></i> You Can Leave These Blank</div>
          <p>Official Condensed rule (p.47). Most experienced Fate GMs recommend leaving at least one blank. You'll know what your character needs after the first scene, not before it.</p>
        </div>
        <div class="sz-input-group">
          <label class="sz-input-label" for="pc-free1">Free Aspect 1</label>
          <input id="pc-free1" type="text" class="sz-input" placeholder="Leave blank to discover during play" value={currentPc.free1} oninput={e => updateCurrentPc('free1', e.target.value)} autocomplete="off" />
          <div class="sz-mutable"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> You can change this after any session</div>
        </div>
        <div class="sz-input-group">
          <label class="sz-input-label" for="pc-free2">Free Aspect 2</label>
          <input id="pc-free2" type="text" class="sz-input" placeholder="Leave blank to discover during play" value={currentPc.free2} oninput={e => updateCurrentPc('free2', e.target.value)} autocomplete="off" />
          <div class="sz-mutable"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> You can change this after any session</div>
        </div>
        {#if freeSuggestions.length > 0}
          <div class="sz-card">
            <div class="sz-card-title">Aspect Ideas from {camp ? camp.name : 'your world'}</div>
            <div class="sz-suggest-row">
              {#each freeSuggestions as s}
                <button class="sz-suggest-btn" type="button" onclick={() => {
                  if (!currentPc.free1) updateCurrentPc('free1', s);
                  else if (!currentPc.free2) updateCurrentPc('free2', s);
                }}>{s}</button>
              {/each}
            </div>
            <button class="btn btn-ghost sz-reroll" onclick={refreshFreeSuggestions} type="button" style="margin-top:8px"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> More suggestions</button>
          </div>
        {/if}
      </div>

    <!-- ── STEP: Phase 1 (trio mode) ───────────────── -->
    {:else if stepId === 'phase1'}
      <div class="sz-body">
        <p>Go around the table. Each player tells a short story about something that happened to their character before the campaign begins.</p>
        <div class="sz-prompt-box">"I was at <span class="sz-prompt-fill">[location]</span> when <span class="sz-prompt-fill">[threat]</span> happened, and I survived by <span class="sz-prompt-fill">______</span>."</div>
        <div class="sz-example">"I was at the Sealed Phade Vault when the Servitors reactivated, and I survived by talking to the lead unit in a language I shouldn't know." &rarr; Aspect: "The Old Machines Listen to Me"</div>
        <p>After you narrate, ask yourself: "What does this say about who I am?" Write that as your third aspect.</p>
        <div class="sz-input-group">
          <label class="sz-input-label" for="pc-phase1">Phase 1 Aspect</label>
          <input id="pc-phase1" type="text" class="sz-input" placeholder="The aspect that emerges from your story" value={currentPc.phase1} oninput={e => updateCurrentPc('phase1', e.target.value)} autocomplete="off" />
          <div class="sz-mutable"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> You can change this after any session</div>
        </div>
      </div>

    <!-- ── STEP: Phase 2 (trio mode) ───────────────── -->
    {:else if stepId === 'phase2'}
      <div class="sz-body">
        <p>Pass your Phase 1 story to the player on your left. They were there. How were they involved?</p>
        <p>This produces your <strong>Relationship aspect</strong> &mdash; grounded in a shared story.</p>
        <p>Narrate one sentence about how you were involved, then write the aspect.</p>
        <div class="sz-input-group">
          <label class="sz-input-label" for="pc-phase2">Phase 2 Aspect (Relationship)</label>
          <input id="pc-phase2" type="text" class="sz-input" placeholder="The relationship aspect from this shared story" value={currentPc.phase2} oninput={e => updateCurrentPc('phase2', e.target.value)} autocomplete="off" />
          <div class="sz-mutable"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> You can change this after any session</div>
        </div>
        <div class="sz-tip">If someone is struggling: "I was the one who brought the rope" is enough. The aspect writes itself from there.</div>
      </div>

    <!-- ── STEP: Phase 3 (trio mode) ───────────────── -->
    {:else if stepId === 'phase3'}
      <div class="sz-body">
        <p>Pass your Phase 1 story to the player on your <strong>right</strong> (a different player than Phase 2). They pick a role and narrate their involvement. This produces your fifth and final aspect.</p>
        <div class="sz-input-group">
          <label class="sz-input-label" for="pc-phase3">Phase 3 Aspect</label>
          <input id="pc-phase3" type="text" class="sz-input" placeholder="Your fifth aspect from this collaboration" value={currentPc.phase3} oninput={e => updateCurrentPc('phase3', e.target.value)} autocomplete="off" />
          <div class="sz-mutable"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> You can change this after any session</div>
        </div>
        <div class="sz-tip">After this step, every character should have five aspects: High Concept, Trouble, and three from the Phase Trio.</div>
        <div class="sz-warn">Write all five aspects down before moving to Skills.</div>
      </div>

    <!-- ── STEP: Flashbacks (flashback mode) ───────── -->
    {:else if stepId === 'flashbacks'}
      <div class="sz-body">
        <div class="sz-card sz-card--success">
          <div class="sz-card-title">The Rule</div>
          <p>At any point during play, when a dramatic moment calls for it, declare a flashback. Narrate a brief scene from your character's past. Write the resulting aspect and use it immediately.</p>
        </div>
        <div class="sz-example">"Wait &mdash; I know this mercenary! We served together in the Siege of Orizon." &rarr; Write the aspect: "Brothers in Arms from the Siege of Orizon" &rarr; Use it now.</div>
        <p>You have three flashback slots for your Relationship aspect and two free aspects. Start Session 1 with only High Concept and Trouble written down.</p>
        <div class="sz-tip">This method produces the best aspects because they emerge from actual dramatic need.</div>
        <div class="sz-warn">For now, write only your High Concept and Trouble. Leave the other three slots blank.</div>
      </div>

    <!-- ── PLACEHOLDER: remaining steps (Layers 3-4) ── -->
    {:else}
      <div class="sz-body">
        <div class="sz-card">
          <div class="sz-card-title">Coming Next</div>
          <p>This step ({stepId}) is being built in the next layer.</p>
        </div>
      </div>
    {/if}

    <!-- ── Navigation ──────────────────────────────────── -->
    <div class="sz-nav">
      {#if step > 0}
        <button class="btn btn-ghost" onclick={back}>&larr; Back</button>
      {:else}
        <div></div>
      {/if}
      {#if step < totalSteps - 1}
        <button class="btn btn-primary" onclick={next} disabled={stepId === 'world' && !campId}>
          {stepId === 'trouble' && pcIndex < pcCount - 1 ? 'Next Player \u2192' : 'Next \u2192'}
        </button>
      {/if}
    </div>
  </div>

  <Footer />
</div>
