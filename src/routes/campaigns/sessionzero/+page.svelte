<script>
  import { onMount, untrack } from 'svelte';
  import { generate, mergeUniversal, filteredTables, suggestSkillPyramid, suggestAspects, suggestStunts, stressFromRating } from '$lib/engine.js';
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

  // ── Skill pyramid helpers ──
  const PYRAMID_SHAPE = [
    { r: 4, label: 'Great (+4)', count: 1 },
    { r: 3, label: 'Good (+3)', count: 2 },
    { r: 2, label: 'Fair (+2)', count: 3 },
    { r: 1, label: 'Average (+1)', count: 4 },
  ];

  function suggestPyramidForCurrent() {
    if (!tables) return;
    const result = suggestSkillPyramid(currentPc.hc, currentPc.trouble, tables);
    updateCurrentPc('skills', result);
  }

  function setSkill(slotIdx, skillName) {
    const skills = (currentPc.skills || []).slice();
    if (skills[slotIdx]) skills[slotIdx] = { ...skills[slotIdx], name: skillName };
    updateCurrentPc('skills', skills);
  }

  // Get skills assigned at a specific pyramid index, excluding already-used skills
  function usedSkillNames(excludeIdx) {
    return (currentPc.skills || []).filter((s, i) => i !== excludeIdx && s && s.name).map(s => s.name);
  }

  // ── Stunt helpers ──
  let stuntSuggestions = $state([]);
  let showStuntBrowser = $state(false);
  let stuntFilter = $state('');

  function refreshStuntSuggestions() {
    if (!tables) return;
    const topSkills = (currentPc.skills || []).slice(0, 3).map(s => s?.name).filter(Boolean);
    stuntSuggestions = suggestStunts(topSkills, tables, 8);
  }

  function addStunt(stunt) {
    const current = currentPc.stunts || [];
    if (current.length >= 3) return;
    if (current.some(s => s.name === stunt.name)) return;
    updateCurrentPc('stunts', [...current, stunt]);
  }

  function removeStunt(idx) {
    const current = (currentPc.stunts || []).slice();
    current.splice(idx, 1);
    updateCurrentPc('stunts', current);
  }

  // ── Stress calculation ──
  function getStressBoxes(skillName) {
    const skills = currentPc.skills || [];
    const sk = skills.find(s => s && s.name === skillName);
    return stressFromRating(sk ? sk.r : 0);
  }

  let physStress = $derived(getStressBoxes('Physique'));
  let mentalStress = $derived(getStressBoxes('Will'));

  function reroll() { rerolls += 1; }

  // ── GM Prep ──
  function roll(genId) {
    if (!campId || !CAMPAIGNS[campId]) return null;
    try {
      const t = filteredTables(mergeUniversal(CAMPAIGNS[campId].tables), {});
      return generate(genId, t, pcCount, {});
    } catch (e) {
      console.error('Session Zero generate failed:', genId, e);
      return null;
    }
  }

  function generateGmPrep() {
    if (!seedData) seedData = roll('seed');
    if (!sceneData) sceneData = roll('scene');
    if (!npcData) npcData = roll('npc_major');
  }

  function rerollSeed() { seedData = roll('seed'); }
  function rerollScene() { sceneData = roll('scene'); }
  function rerollNpc() { npcData = roll('npc_major'); }

  // ── Export & Handoff ──
  let copied = $state('');
  let sentToPrep = $state(false);
  let campName = $derived(camp ? camp.name : '');

  function goToBoard() {
    window.location.href = '/campaigns/' + (campId || 'fantasy');
  }

  async function sendAllToTable() {
    if (!campId) return;
    try {
      const { generateSzPack } = await import('$lib/stores/canvasStore.js');
      const campData = CAMPAIGNS[campId];
      if (!campData) return;
      const campN = campData.meta?.name || campName || campId;
      const gmPrep = (seedData || sceneData || npcData) ? { seed: seedData, scene: sceneData, npc: npcData } : null;
      const pack = generateSzPack(pcDrafts, campId, campN, campData, mode, gmPrep);
      const DB = (await import('$lib/db.js')).default;
      const prepKey = 'board_canvas_prep_v1_' + campId;
      const existing = await DB.loadSession(prepKey).catch(() => null);
      const prev = existing?.cards || [];
      await DB.saveSession(prepKey, { cards: prev.concat(pack), ts: Date.now() });
      sentToPrep = true;
      setTimeout(() => { sentToPrep = false; }, 3000);
    } catch(e) { console.error('[Ogma] sendAllToTable failed:', e); }
  }

  function exportJSON() {
    const items = [];
    if (seedData) items.push({ generator: 'seed', label: seedData.location || 'Seed', data: seedData, ts: Date.now() });
    if (sceneData) items.push({ generator: 'scene', label: 'Scene', data: sceneData, ts: Date.now() });
    if (npcData) items.push({ generator: 'npc_major', label: npcData.name || 'NPC', data: npcData, ts: Date.now() });
    pcDrafts.forEach((pc, i) => {
      items.push({ generator: 'pc', label: pc.name || 'PC ' + (i + 1), data: pc, ts: Date.now() });
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
    a.download = (campId || 'ogma') + '-session-zero.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function copyMarkdown() {
    const modeLabel = mode === 'trio' ? 'Phase Trio' : mode === 'flashback' ? 'Flashback Slots' : 'Condensed Standard';
    const lines = [
      '# Session Zero Summary',
      '**Campaign:** ' + (campName || '-'),
      '**Mode:** ' + modeLabel,
      '**Date:** ' + new Date().toLocaleDateString(),
      '', '---', '',
    ];
    pcDrafts.forEach((pc, i) => {
      lines.push('## ' + (pc.name || 'Player ' + (i + 1)));
      lines.push('- **High Concept:** ' + (pc.hc || '___'));
      lines.push('- **Trouble:** ' + (pc.trouble || '___'));
      if (mode === 'standard') {
        lines.push('- **Relationship:** ' + (pc.relationship || '___'));
        lines.push('- **Free Aspect:** ' + (pc.free1 || '___'));
        lines.push('- **Free Aspect:** ' + (pc.free2 || '___'));
      } else if (mode === 'trio') {
        lines.push('- **Phase 1:** ' + (pc.phase1 || '___'));
        lines.push('- **Phase 2:** ' + (pc.phase2 || '___'));
        lines.push('- **Phase 3:** ' + (pc.phase3 || '___'));
      } else {
        lines.push('- **Flashback 1:** _(discover during play)_');
        lines.push('- **Flashback 2:** _(discover during play)_');
        lines.push('- **Flashback 3:** _(discover during play)_');
      }
      if (pc.skills?.length > 0) {
        lines.push('', '### Skills');
        pc.skills.forEach(sk => { if (sk?.name) lines.push('- **' + (SKILL_LABEL[sk.r] || '+' + sk.r) + ':** ' + sk.name); });
      }
      if (pc.stunts?.length > 0) {
        lines.push('', '### Stunts');
        pc.stunts.forEach((st, j) => lines.push((j + 1) + '. **' + st.name + '** (' + (st.skill || '') + ')'));
      }
      lines.push('- **Refresh:** 3', '');
    });
    if (seedData) {
      lines.push('---', '', '## GM Prep');
      lines.push('**Seed:** ' + (seedData.location || '') + ' — ' + (seedData.objective || ''));
      if (npcData) lines.push('**NPC:** ' + (npcData.name || ''));
    }
    lines.push('', '---', '*Generated by Ogma Session Zero Wizard*');
    const md = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(md).then(() => { copied = 'Copied!'; setTimeout(() => { copied = ''; }, 2000); });
    }
  }

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
      if (nid === 'stunts') refreshStuntSuggestions();
      if (nid === 'gmprep') generateGmPrep();
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

    <!-- ── STEP: Skills ──────────────────────────────── -->
    {:else if stepId === 'skills'}
      <div class="sz-body">
        {#if pcCount > 1}
          <div class="sz-pc-progress">
            <span class="sz-pc-progress-label">Player {pcIndex + 1} of {pcCount} &mdash; Skills</span>
            <div class="sz-pc-progress-pips">
              {#each pcDrafts as _, i}<div class="sz-pc-pip" class:active={i === pcIndex} class:done={i < pcIndex}></div>{/each}
            </div>
          </div>
        {/if}
        <p>Your skill pyramid defines what {currentPc.name || 'your character'} is good at. Assign ratings in this shape:</p>

        <button class="btn btn-primary" onclick={suggestPyramidForCurrent} type="button" style="margin-bottom:16px">
          <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Suggest Pyramid Based on Aspects
        </button>

        <div class="sz-skill-pyramid">
          {#each PYRAMID_SHAPE as tier, tIdx}
            {@const startIdx = tIdx === 0 ? 0 : PYRAMID_SHAPE.slice(0, tIdx).reduce((a, t) => a + t.count, 0)}
            <div class="sz-skill-row-wrap">
              <span class="sz-skill-label">{tier.label}</span>
              <div class="sz-skill-row">
                {#each Array(tier.count) as _, slotI}
                  {@const idx = startIdx + slotI}
                  {@const currentSkill = currentPc.skills?.[idx]?.name || ''}
                  {@const used = usedSkillNames(idx)}
                  <div class="sz-skill-slot">
                    <select class="sz-skill-select" value={currentSkill} onchange={e => setSkill(idx, e.target.value)} aria-label="{tier.label} slot {slotI + 1}">
                      <option value="">--</option>
                      {#each ALL_SKILLS as sk}
                        {#if sk === currentSkill || !used.includes(sk)}
                          <option value={sk}>{sk}</option>
                        {/if}
                      {/each}
                    </select>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>

        <div class="sz-mutable"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> You can swap two skill ranks at every milestone</div>

        <div class="sz-dnd">D&amp;D has 6 ability scores + 18 skills. Fate has 19 skills that cover both. Your skill rating IS your expected result &mdash; no separate modifier calculation. A +3 in Fight means you reliably hit Good (+3) difficulty.</div>
        <div class="sz-tip">Physique sets your physical stress boxes. Will sets your mental stress boxes. Characters with neither above +0 get 3 boxes each &mdash; which isn't much.</div>
      </div>

    <!-- ── STEP: Stunts ────────────────────────────────── -->
    {:else if stepId === 'stunts'}
      <div class="sz-body">
        {#if pcCount > 1}
          <div class="sz-pc-progress">
            <span class="sz-pc-progress-label">Player {pcIndex + 1} of {pcCount} &mdash; Stunts</span>
            <div class="sz-pc-progress-pips">
              {#each pcDrafts as _, i}<div class="sz-pc-pip" class:active={i === pcIndex} class:done={i < pcIndex}></div>{/each}
            </div>
          </div>
        {/if}
        <p>There are two types of stunts:</p>
        <div class="sz-card">
          <div class="sz-card-title">+2 Bonus Stunt</div>
          <p>"Because I [describe why], I get +2 when I use [skill] to [action] when [circumstance]."</p>
        </div>
        <div class="sz-card">
          <div class="sz-card-title">Rule-Changing Stunt</div>
          <p>"Because I [describe why], I can [special effect], but only [limitation]."</p>
        </div>
        <div class="sz-card sz-card--success">
          <div class="sz-card-title"><i class="fa-solid fa-check" aria-hidden="true"></i> Leave All Three Blank</div>
          <p>Define stunts the first time you wish you had one. "I wish I could do X right now" is the perfect moment to write a stunt. This is official Condensed design.</p>
        </div>

        <!-- Selected stunts -->
        {#if (currentPc.stunts || []).length > 0}
          <div style="margin-top:12px">
            {#each currentPc.stunts as st, idx}
              <div class="sz-stunt-pick">
                <span class="sz-stunt-pick-name">{st.name}</span>
                <span class="sz-stunt-pick-skill">{st.skill || ''}</span>
                <button class="sz-stunt-remove" onclick={() => removeStunt(idx)} type="button" aria-label="Remove stunt {st.name}">&times;</button>
              </div>
            {/each}
          </div>
        {/if}

        {#if (currentPc.stunts || []).length < 3}
          <button class="btn btn-ghost" onclick={() => { showStuntBrowser = !showStuntBrowser; if (showStuntBrowser) refreshStuntSuggestions(); }} type="button" style="margin-top:8px">
            <i class="fa-solid fa-book-open" aria-hidden="true"></i> {showStuntBrowser ? 'Hide' : 'Browse'} Stunts
          </button>
        {/if}

        {#if showStuntBrowser && (currentPc.stunts || []).length < 3}
          <div style="margin-top:12px">
            <input type="text" class="sz-input" placeholder="Filter stunts..." bind:value={stuntFilter} autocomplete="off" style="margin-bottom:8px" />
            {#each stuntSuggestions.filter(s => !stuntFilter || s.name.toLowerCase().includes(stuntFilter.toLowerCase()) || (s.skill || '').toLowerCase().includes(stuntFilter.toLowerCase()) || (s.desc || '').toLowerCase().includes(stuntFilter.toLowerCase())) as st}
              <div class="sz-stunt-pick" role="button" tabindex="0" onclick={() => addStunt(st)} onkeydown={e => { if (e.key === 'Enter') addStunt(st); }} style="cursor:pointer" aria-label="Add stunt: {st.name}">
                <span class="sz-stunt-pick-name">{st.name}</span>
                <span class="sz-stunt-pick-skill">{st.skill || ''}</span>
                <span style="font-size:11px;color:var(--text-muted);flex-shrink:0">+ Add</span>
              </div>
            {/each}
            <button class="btn btn-ghost sz-reroll" onclick={refreshStuntSuggestions} type="button" style="margin-top:8px"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> More stunts</button>
          </div>
        {/if}

        <div class="sz-mutable"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> Stunts can be rewritten at every milestone</div>
        <div class="sz-dnd">In D&amp;D, feats are picked at creation and rarely change. In Fate, stunts can be rewritten at every milestone. Pick what sounds fun now; change it when you learn what your character actually needs.</div>
      </div>

    <!-- ── STEP: Stress & Consequences ─────────────── -->
    {:else if stepId === 'stress'}
      <div class="sz-body">
        {#if pcCount > 1}
          <div class="sz-pc-progress">
            <span class="sz-pc-progress-label">Player {pcIndex + 1} of {pcCount} &mdash; Stress</span>
            <div class="sz-pc-progress-pips">
              {#each pcDrafts as _, i}<div class="sz-pc-pip" class:active={i === pcIndex} class:done={i < pcIndex}></div>{/each}
            </div>
          </div>
        {/if}
        <p>Stress boxes are set by your Physique and Will ratings. Here's what {currentPc.name || 'your character'} gets:</p>

        <div class="sz-card">
          <div class="sz-card-title">Physical Stress (from Physique)</div>
          <div class="sz-stress-boxes">
            {#each Array(physStress) as _, i}
              <div class="sz-stress-box" aria-label="Physical stress box {i + 1}"></div>
            {/each}
          </div>
          <p style="font-size:12px;color:var(--text-muted);margin-top:6px">{physStress} boxes</p>
        </div>

        <div class="sz-card">
          <div class="sz-card-title">Mental Stress (from Will)</div>
          <div class="sz-stress-boxes">
            {#each Array(mentalStress) as _, i}
              <div class="sz-stress-box" aria-label="Mental stress box {i + 1}"></div>
            {/each}
          </div>
          <p style="font-size:12px;color:var(--text-muted);margin-top:6px">{mentalStress} boxes</p>
        </div>

        <table class="sz-stress-table">
          <thead><tr><th>Skill Rating</th><th>Stress Boxes</th></tr></thead>
          <tbody>
            <tr><td>Mediocre (+0)</td><td>3 boxes</td></tr>
            <tr><td>Average (+1) or Fair (+2)</td><td>4 boxes</td></tr>
            <tr><td>Good (+3) or Great (+4)</td><td>6 boxes</td></tr>
            <tr><td>Superb (+5)+</td><td>6 boxes + extra mild consequence</td></tr>
          </tbody>
        </table>

        <div class="sz-card">
          <div class="sz-card-title">Consequences</div>
          <p>Everyone starts with three consequence slots:</p>
          <table class="sz-stress-table">
            <tbody>
              <tr><td>Mild</td><td>Absorbs 2 shifts</td><td>Clears: next scene after treatment</td></tr>
              <tr><td>Moderate</td><td>Absorbs 4 shifts</td><td>Clears: full session after treatment</td></tr>
              <tr><td>Severe</td><td>Absorbs 6 shifts</td><td>Clears: after a breakthrough + treatment</td></tr>
            </tbody>
          </table>
          <p style="font-size:12px;color:var(--text-muted);margin-top:6px">Treatment requires a successful overcome roll: Academics for physical, Empathy for mental.</p>
        </div>

        <div class="sz-dnd">D&amp;D has hit points. Fate has stress (plot armour that clears every scene) and consequences (named aspects that stick). "Badly Burned Hands" isn't just damage &mdash; it's an aspect the GM can compel and enemies can invoke.</div>
        <div class="sz-tip">Stress clears after every scene. Consequences stick around and can be compelled against you &mdash; but they also earn you fate points when they cause trouble.</div>
      </div>

    <!-- ── STEP: GM Prep ─────────────────────────────── -->
    {:else if stepId === 'gmprep'}
      <div class="sz-body">
        <p>Now that your characters exist, here's a situation to drop them into. The seed, scene, and NPC are generated from your world and can reference your PCs' aspects.</p>

        {#if seedData}
          <div class="sz-prep-section">
            <div class="sz-prep-hdr">
              <span class="sz-prep-hdr-label">Adventure Seed</span>
              <span class="sz-prep-hdr-name">{seedData.location || ''}</span>
            </div>
            {#if seedData.objective}
              <div class="sz-prep-field"><div class="sz-prep-field-label">Objective</div><div class="sz-prep-field-value">{seedData.objective}</div></div>
            {/if}
            {#if seedData.complication}
              <div class="sz-prep-field"><div class="sz-prep-field-label">Complication</div><div class="sz-prep-field-value">{seedData.complication}</div></div>
            {/if}
            {#if seedData.twist}
              <div class="sz-prep-field"><div class="sz-prep-field-label">Twist (reveal late)</div><div class="sz-prep-field-value" style="font-style:italic">{seedData.twist}</div></div>
            {/if}
            <button class="btn btn-ghost sz-reroll" onclick={rerollSeed} type="button"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> Reroll seed</button>
          </div>
        {/if}

        {#if sceneData}
          <div class="sz-prep-section">
            <div class="sz-prep-hdr">
              <span class="sz-prep-hdr-label">Opening Scene</span>
            </div>
            {#if Array.isArray(sceneData.aspects) && sceneData.aspects.length > 0}
              <div class="sz-prep-field">
                <div class="sz-prep-field-label">Situation Aspects</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">
                  {#each sceneData.aspects as a}
                    <span style="font-size:11px;padding:3px 8px;background:var(--inset);border:1px solid var(--border);border-radius:4px;color:var(--text-dim);font-style:italic">{typeof a === 'string' ? a : (a.name || '')}</span>
                  {/each}
                </div>
              </div>
            {/if}
            {#if Array.isArray(sceneData.zones) && sceneData.zones.length > 0}
              <div class="sz-prep-field">
                <div class="sz-prep-field-label">Zones</div>
                {#each sceneData.zones.slice(0, 3) as z}
                  <div class="sz-prep-field-value">
                    <strong>{typeof z === 'string' ? z : (z.name || z[0] || '')}</strong>
                    {#if typeof z === 'object'} &mdash; {z.aspect || z[1] || ''}{/if}
                  </div>
                {/each}
              </div>
            {/if}
            <button class="btn btn-ghost sz-reroll" onclick={rerollScene} type="button"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> Reroll scene</button>
          </div>
        {/if}

        {#if npcData}
          {@const asp = npcData.aspects || {}}
          {@const npcSkills = npcData.skills || []}
          <div class="sz-prep-section">
            <div class="sz-prep-hdr">
              <span class="sz-prep-hdr-label">Opening NPC</span>
              <span class="sz-prep-hdr-name">{npcData.name || ''}</span>
            </div>
            {#if asp.high_concept}
              <div class="sz-prep-field"><div class="sz-prep-field-label">High Concept</div><div class="sz-prep-field-value" style="font-style:italic">{asp.high_concept}</div></div>
            {/if}
            {#if asp.trouble}
              <div class="sz-prep-field"><div class="sz-prep-field-label">Trouble</div><div class="sz-prep-field-value" style="font-style:italic">{asp.trouble}</div></div>
            {/if}
            {#if npcSkills.length > 0}
              <div class="sz-prep-field">
                <div class="sz-prep-field-label">Top Skills</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
                  {#each npcSkills.slice(0, 4) as s}
                    <span style="font-size:11px;color:var(--text-dim);background:var(--inset);border:1px solid var(--border);border-radius:4px;padding:2px 7px">
                      <strong style="color:var(--accent);font-family:var(--font-mono);margin-right:4px">+{s.r}</strong>{s.name}
                    </span>
                  {/each}
                </div>
              </div>
            {/if}
            <button class="btn btn-ghost sz-reroll" onclick={rerollNpc} type="button"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> Reroll NPC</button>
          </div>
        {/if}

        <div class="sz-tip">This is a situation, not a plot. The players' choices are the story. Prep Scene 1 in full. Follow the players after that.</div>
      </div>

    <!-- ── STEP: Questions ─────────────────────────────── -->
    {:else if stepId === 'questions'}
      <div class="sz-body">
        <p>Go around the table. Each player answers two of these questions aloud. Every answer should name another character. These become aspect seeds.</p>

        {#if wd && wd.questions}
          <div class="sz-card">
            <div class="sz-card-title">World Questions &mdash; {campName}</div>
            <ol style="margin:8px 0 0 18px;color:var(--text-dim);line-height:1.8">
              {#each wd.questions as q}
                <li style="padding:3px 0">{q}</li>
              {/each}
            </ol>
          </div>
        {/if}

        <div class="sz-tip">High Concept and Trouble are enough to start play. The other three aspects reveal themselves in the first session.</div>
      </div>

    <!-- ── STEP: Summary & Export ──────────────────────── -->
    {:else if stepId === 'summary'}
      {@const modeLabel = mode === 'trio' ? 'Phase Trio' : mode === 'flashback' ? 'Flashback Slots' : 'Condensed Standard'}
      <div class="sz-body">
        <div class="sz-summary-section">
          <div class="sz-summary-label">Campaign</div>
          <div class="sz-summary-value">{campName}</div>
        </div>
        <div class="sz-summary-section">
          <div class="sz-summary-label">Mode</div>
          <div class="sz-summary-value">{modeLabel}</div>
        </div>

        <!-- PC summaries -->
        {#each pcDrafts as pc, i}
          <div class="sz-summary-pc">
            <div class="sz-summary-pc-name">{pc.name || 'Player ' + (i + 1)}</div>
            <div class="sz-summary-aspect"><span class="sz-summary-aspect-label">HC</span><span class="sz-summary-aspect-val">{pc.hc || '(blank)'}</span></div>
            <div class="sz-summary-aspect"><span class="sz-summary-aspect-label">Trouble</span><span class="sz-summary-aspect-val">{pc.trouble || '(blank)'}</span></div>
            {#if mode === 'standard'}
              <div class="sz-summary-aspect"><span class="sz-summary-aspect-label">Relationship</span><span class="sz-summary-aspect-val">{pc.relationship || '(blank)'}</span></div>
              <div class="sz-summary-aspect"><span class="sz-summary-aspect-label">Free 1</span><span class="sz-summary-aspect-val">{pc.free1 || '(blank)'}</span></div>
              <div class="sz-summary-aspect"><span class="sz-summary-aspect-label">Free 2</span><span class="sz-summary-aspect-val">{pc.free2 || '(blank)'}</span></div>
            {:else if mode === 'trio'}
              <div class="sz-summary-aspect"><span class="sz-summary-aspect-label">Phase 1</span><span class="sz-summary-aspect-val">{pc.phase1 || '(blank)'}</span></div>
              <div class="sz-summary-aspect"><span class="sz-summary-aspect-label">Phase 2</span><span class="sz-summary-aspect-val">{pc.phase2 || '(blank)'}</span></div>
              <div class="sz-summary-aspect"><span class="sz-summary-aspect-label">Phase 3</span><span class="sz-summary-aspect-val">{pc.phase3 || '(blank)'}</span></div>
            {:else}
              <div class="sz-summary-aspect"><span class="sz-summary-aspect-label">Flashbacks</span><span class="sz-summary-aspect-val">3 slots (discover during play)</span></div>
            {/if}
            {#if pc.skills?.length > 0}
              <div style="margin-top:6px;font-size:11px;color:var(--text-muted)">
                {#each pc.skills.filter(s => s?.name) as sk}
                  <span style="margin-right:8px"><strong style="color:var(--accent)">+{sk.r}</strong> {sk.name}</span>
                {/each}
              </div>
            {/if}
            {#if pc.stunts?.length > 0}
              <div style="margin-top:4px;font-size:11px;color:var(--text-muted)">
                Stunts: {pc.stunts.map(s => s.name).join(', ')}
              </div>
            {/if}
          </div>
        {/each}

        <!-- GM Prep summary -->
        {#if seedData || sceneData || npcData}
          <div class="sz-summary-section">
            <div class="sz-summary-label">GM Prep</div>
            {#if seedData}<div class="sz-summary-value" style="font-size:13px">{seedData.location || 'Seed'} &mdash; {seedData.objective || ''}</div>{/if}
            {#if npcData}<div class="sz-summary-value" style="font-size:13px">NPC: {npcData.name || ''}</div>{/if}
          </div>
        {/if}

        <!-- Advancement -->
        <div class="sz-card">
          <div class="sz-card-title">Milestones &amp; Breakthroughs</div>
          <div style="margin-bottom:10px">
            <strong style="color:var(--gold)">Milestone</strong>
            <span style="color:var(--text-muted)"> (end of each session)</span>
            <div style="font-size:14px;color:var(--text-dim);margin-top:4px">Swap two skill ranks, rewrite a stunt, rewrite one aspect (not high concept), or buy a new stunt for 1 Refresh.</div>
          </div>
          <div>
            <strong style="color:var(--gold)">Breakthrough</strong>
            <span style="color:var(--text-muted)"> (end of a story arc)</span>
            <div style="font-size:14px;color:var(--text-dim);margin-top:4px">Everything from a milestone PLUS: rewrite your high concept, increase one skill by +1, and begin recovery of moderate/severe consequences.</div>
          </div>
        </div>

        <!-- Export bar -->
        <div class="sz-export-bar">
          <button class="btn btn-primary" onclick={sendAllToTable}><i class="fa-solid fa-table-cells" aria-hidden="true"></i> Send All to Table</button>
          <button class="btn btn-ghost" onclick={copyMarkdown}><i class="fa-solid fa-clipboard" aria-hidden="true"></i> Markdown</button>
          <button class="btn btn-ghost" onclick={exportJSON}><i class="fa-solid fa-arrow-down" aria-hidden="true"></i> JSON</button>
          <button class="btn btn-ghost" onclick={() => { if (typeof window !== 'undefined') window.print(); }}><i class="fa-solid fa-print" aria-hidden="true"></i> Print</button>
        </div>
        {#if copied}
          <div class="sz-copied">{copied}</div>
        {/if}
        {#if sentToPrep}
          <div class="sz-copied"><i class="fa-solid fa-check" aria-hidden="true"></i> Session zero pack sent to prep canvas</div>
        {/if}

        <div class="sz-tip">Session 1 starts IN the situation. No tavern. No meeting. The opening hook drops the PCs directly into the action.</div>

        <!-- Start session -->
        <div class="sz-ready-box">
          <div class="sz-ready-label"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> Ready to play?</div>
          <div class="sz-ready-desc">Start a local session on this device. The board opens in Prep mode with your world loaded.</div>
          <button class="btn btn-primary sz-ready-cta" onclick={() => {
            if (typeof window === 'undefined') return;
            try {
              localStorage.setItem('ogma_sz_seed', JSON.stringify({
                _sz_auto_pc: true, campId: campId || 'fantasy', ts: Date.now(), mode,
              }));
            } catch(e) {}
            window.location.href = '/campaigns/' + (campId || 'fantasy') + '?canvas=prep&sz=1';
          }}><i class="fa-solid fa-play" aria-hidden="true"></i> Open {campName} Prep Canvas</button>
        </div>

        <div style="text-align:center;margin-top:16px">
          <button class="btn btn-ghost" onclick={() => { step = 0; campId = null; seedData = null; sceneData = null; npcData = null; pcDrafts = []; pcIndex = 0; }} style="font-size:12px">Start over</button>
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
