<script>
  import { onMount } from 'svelte';
  import { VERSION } from '$lib/version.js';

  let theme = 'dark';
  let step = 0;

  let STEPS = $derived((() => {
    const base = [
      { id: 'campaign',    title: 'Choose Your Campaign' },
      { id: 'mode',        title: 'How Deep Do You Want to Go?' },
      { id: 'pccount',     title: 'How Many Players?' },
      { id: 'setting',     title: 'The World You\'re Playing In' },
      { id: 'highconcept', title: 'High Concept' },
      { id: 'trouble',     title: 'Trouble' },
    ];
    if (mode === 'trio') {
      base.push(
        { id: 'phase1', title: 'Phase 1 — Your First Adventure' },
        { id: 'phase2', title: 'Phase 2 — Crossing Paths' },
        { id: 'phase3', title: 'Phase 3 — Crossing Paths Again' },
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
      { id: 'questions', title: 'Session Zero Questions' },
      { id: 'summary',   title: 'Summary & Export' },
    );
    return base;
  })());

  let totalSteps = $derived(STEPS.length);
  let stepId = $derived(STEPS[step] ? STEPS[step].id : 'campaign');
  let progress = $derived(((step + 1) / totalSteps * 100));
  $effect(() => { if (step >= STEPS.length) step = 0; });

  function next() { if (step < totalSteps - 1) step += 1; }
  function back() { if (step > 0) step -= 1; }

  // PC count and per-PC data collection
  let pcCount = 2;
  let pcIndex = 0;
  let pcDrafts = [];
  $effect(() => {
    while (pcDrafts.length < pcCount) pcDrafts.push({ name: '', hc: '', trouble: '' });
    pcDrafts = pcDrafts.slice(0, pcCount);
  });
  let currentPc = $derived(pcDrafts[pcIndex] || { name: '', hc: '', trouble: '' });
  let fromSessionZero = false;
  let sentToPrep = false;

  function updateCurrentPc(field, value) {
    pcDrafts = pcDrafts.map((pc, i) => i === pcIndex ? { ...pc, [field]: value } : pc);
  }

  onMount(() => {
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      theme = p.theme || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}

    // Read URL params — world, mode, from (Session Zero handoff)
    try {
      const params = new URLSearchParams(window.location.search);
      const w = params.get('world');
      const m = params.get('mode');
      const from = params.get('from');
      if (w && CAMPAIGNS[w]) {
        campId = w;
        if (m && ['standard', 'trio', 'flashback'].includes(m)) mode = m;
        if (from === 'sz') {
          fromSessionZero = true;
          step = STEPS.findIndex(s => s.id === 'pccount');
          if (step < 0) step = 2;
        } else {
          step = 1;
        }
      }
    } catch (e) {}
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      p.theme = theme;
      localStorage.setItem('fate_prefs_v1', JSON.stringify(p));
    } catch (e) {}
  }

  // ── Campaign data ──────────────────────────────────────────────────────
  let campId = null;
  let mode = 'standard';

  const CAMPAIGNS = {
    thelongafter: { name: 'The Long After',          icon: '◈', genre: 'Sword & Planet',   tagline: 'Warlords and ruined gods in the wreckage of civilisation' },
    cyberpunk:    { name: 'Neon Abyss',              icon: '⬡', genre: 'Cyberpunk',        tagline: 'Chrome, corp-blood, and the city that eats its own' },
    fantasy:      { name: 'Shattered Kingdoms',      icon: '✦', genre: 'Dark Fantasy',     tagline: 'Grim blades, older magic, and the weight of history' },
    space:        { name: 'Void Runners',            icon: '◯', genre: 'Space Western',    tagline: 'Hard vacuum, hard choices, and no one coming to help' },
    victorian:    { name: 'The Gaslight Chronicles',  icon: '⊕', genre: 'Gothic Horror',   tagline: 'Gaslight and secrets and things that should not exist' },
    postapoc:     { name: 'The Long Road',           icon: '◻', genre: 'Post-Apocalypse',  tagline: 'The world already ended. Survive what comes next' },
    western:      { name: 'Dust and Iron',           icon: '◈', genre: 'Frontier Western', tagline: 'Frontier justice. Railroad money and the weight of the old war' },
    dVentiRealm:  { name: 'dVenti Realm',            icon: '⬟', genre: 'High Fantasy',    tagline: 'The Senate collapsed. The Vaults are still here. So is everything sealed inside them.' },
  };

  let camp = $derived(campId ? CAMPAIGNS[campId] : null);

  const CAMP_ORDER = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];

  const MODES = [
    { id: 'standard',  label: 'Condensed Standard', tag: 'Recommended', sub: 'High Concept → Trouble → Relationship → leave the rest blank → play. Fastest path to the table.' },
    { id: 'trio',      label: 'Phase Trio',         tag: 'Enriched',    sub: 'Collaborative backstory workshop. Three phases produce all five aspects through shared stories. ~20 min extra.' },
    { id: 'flashback', label: 'Flashback Slots',    tag: 'Play-First',  sub: 'Start with High Concept + Trouble + top skill only. Discover the rest during play through flashback moments.' },
  ];

  let rerolls = 0;
  let copied = '';
  function reroll() { rerolls += 1; }

  function copyMarkdown() {
    const campName = camp ? camp.name : 'Unknown';
    const modeLabel = mode === 'trio' ? 'Phase Trio' : mode === 'flashback' ? 'Flashback Slots' : 'Condensed Standard';
    const lines = [
      '# Session Zero Summary',
      '**Campaign:** ' + campName,
      '**Mode:** ' + modeLabel,
      '**Date:** ' + new Date().toLocaleDateString(),
      '', '---', '',
      '## Character Sheet Template', '',
      '### Aspects',
      '- **High Concept:** _______________',
      '- **Trouble:** _______________',
    ];
    if (mode === 'standard') {
      lines.push('- **Relationship:** _______________', '- **Free Aspect:** _______________', '- **Free Aspect:** _______________');
    } else if (mode === 'trio') {
      lines.push('- **Phase 1 Aspect:** _______________', '- **Phase 2 (Relationship):** _______________', '- **Phase 3 Aspect:** _______________');
    } else {
      lines.push('- **Flashback 1:** _(discover during play)_', '- **Flashback 2:** _(discover during play)_', '- **Flashback 3:** _(discover during play)_');
    }
    lines.push('', '### Skills (Pyramid)',
      '- **Great (+4):** _______________',
      '- **Good (+3):** _______________, _______________',
      '- **Fair (+2):** _______________, _______________, _______________',
      '- **Average (+1):** _______________, _______________, _______________, _______________',
      '', '### Stunts (3 free)',
      '1. _______________', '2. _______________', '3. _______________',
      '', '### Vitals',
      '- **Physical Stress:** ☐ ☐ ☐ (+ more from Physique)',
      '- **Mental Stress:** ☐ ☐ ☐ (+ more from Will)',
      '- **Consequences:** Mild (2) / Moderate (4) / Severe (6)',
      '- **Refresh:** 3',
      '', '---', '',
      '*Generated by Fate Condensed Session Zero Wizard*'
    );
    const md = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(md).then(() => { copied = 'Copied!'; setTimeout(() => { copied = ''; }, 2000); });
    }
  }

  function copyJSON() {
    const campName = camp ? camp.name : 'Unknown';
    const modeLabel = mode === 'trio' ? 'Phase Trio' : mode === 'flashback' ? 'Flashback Slots' : 'Condensed Standard';
    const aspectSlots = mode === 'standard'
      ? ['High Concept', 'Trouble', 'Relationship', 'Free Aspect', 'Free Aspect']
      : mode === 'trio'
      ? ['High Concept', 'Trouble', 'Phase 1 Aspect', 'Phase 2 (Relationship)', 'Phase 3 Aspect']
      : ['High Concept', 'Trouble', 'Flashback 1 (discover during play)', 'Flashback 2 (discover during play)', 'Flashback 3 (discover during play)'];
    const payload = {
      format: 'ogma', version: '2.0.0', generator: 'session_zero',
      campaign: campName, campId: campId, ts: Date.now(),
      data: {
        mode: modeLabel, aspects: aspectSlots,
        skillPyramid: { great4: 1, good3: 2, fair2: 3, average1: 4 },
        stunts: 3, refresh: 3,
        currentIssue: wd ? wd.current[ciIdx].name : '',
        impendingIssue: wd ? wd.impending[iiIdx].name : '',
      },
    };
    const json = JSON.stringify(payload, null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(json).then(() => { copied = 'JSON Copied!'; setTimeout(() => { copied = ''; }, 2000); });
    }
  }

  async function sendToPrep() {
    if (!campId) return;
    try {
      const { generateSzPack } = await import('$lib/stores/canvasStore.js');
      const { CAMPAIGNS: C } = await import('$lib/../data/shared.js');
      const DB = (await import('$lib/db.js')).default;
      const campData = C[campId];
      if (!campData || !DB) return;
      const campN = campData.meta?.name || campId;
      const pack = generateSzPack(pcDrafts, campId, campN, campData, mode);
      const prepKey = 'board_canvas_prep_v1_' + campId;
      const existing = await DB.loadSession(prepKey).catch(() => null);
      const prev = existing?.cards || [];
      await DB.saveSession(prepKey, { cards: prev.concat(pack), ts: Date.now() });
      sentToPrep = true;
      setTimeout(() => { sentToPrep = false; }, 3000);
    } catch(e) { console.error('[Ogma] sendToPrep failed:', e); }
  }

  function selectCamp(id) { campId = id; }
  function selectMode(id) { mode = id; }

  // ── Per-world curated content (avoids importing full data modules) ────
  const WORLD_DATA = {
    thelongafter: {
      current:  [{ name: 'The Warlords Are Consolidating', desc: 'Three rival warlords have begun absorbing smaller settlements. Travel is dangerous. Tribute is mandatory.' }, { name: 'The Phade Vaults Are Waking Up', desc: 'Ancient automated systems are reactivating across the waste. Some offer miracles. Some enforce quarantine protocols.' }],
      impending: [{ name: 'The God-Machine Stirs', desc: 'Something beneath the Cradle is broadcasting. The signal is old. The response will not be kind.' }, { name: 'The Pilgrim Roads Are Being Taxed', desc: 'Movement between settlements now requires paying tribute to whoever controls the nearest checkpoint. Trade is dying. So is goodwill.' }],
      hc: ['Last Cartographer of the Before-Times', 'Scavenger-Priest of the Rusted Saints', 'Vault Delver Who Reads the Old Signs', 'Road Tax Collector with a Legitimate Monopoly'],
      troubles: ['The Map Shows a City That Shouldn\'t Exist', 'Faith Built on Parts That No Longer Fit', 'The Route That Pays My Salary Doesn\'t Exist Anymore', 'The Old Machines Listen to Me — and That Scares People'],
      questions: ['What do you carry from the Before-Times that you cannot use but will not abandon?', 'Which warlord\'s territory did you cross to get here, and what did you leave behind as payment?', 'What did the last Phade vault you entered show you that you wish you could forget?', 'Who taught you to survive, and why did they stop traveling with you?', 'What do you believe about the God-Machine, and how does that belief put you at odds with someone at this table?', 'What skill do you have that is useless in this world but defined who you were in the old one?'],
    },
    cyberpunk: {
      current:  [{ name: 'The Blackout Districts Are Expanding', desc: 'Corporate infrastructure is failing in the lower city. No grid, no law, no extraction.' }, { name: 'Neural Debt Is the New Slavery', desc: 'Corpo clinics offer free augmentation. The contract is lifetime. Default means repossession — of the implant, not the debt.' }],
      impending: [{ name: 'The AI Quarantine Is Failing', desc: 'Something behind the Cage is learning to speak through people. The signs are subtle. The corps know.' }, { name: 'The Mesh Is Going Dark in Patches', desc: 'Comms blackouts are spreading district by district. Someone is cutting the network deliberately. No one is claiming responsibility.' }],
      hc: ['Debt-Bonded Neural Translator', 'Ex-Corpo Medic Running an Unlicensed Clinic', 'Protest Archivist Who Films Everything', 'Street Doc with a Corporate Kill Switch'],
      troubles: ['My Employer Owns My Language Centers', 'Every Patient Is Evidence', 'The Footage Has Made Me a Target', 'The Kill Switch Has a Timer I Can\'t See'],
      questions: ['What piece of yourself did you sell to survive, and do you want it back?', 'Who in the lower city depends on you, and what happens to them if you disappear?', 'What corporate secret did you stumble onto, and why haven\'t they silenced you yet?', 'Which district do you refuse to enter, and what happened there?', 'What augmentation do you wish you\'d never installed?', 'Who was the last person you trusted completely, and how did that end?'],
    },
    fantasy: {
      current:  [{ name: 'The Blight Spreads East', desc: 'A slow fungal transformation that doesn\'t kill but rewrites. Three border towns have gone silent.' }, { name: 'The Inquisition Hunts Hedge Magic', desc: 'The Church has declared all unsanctioned magic heretical. Practitioners are disappearing.' }],
      impending: [{ name: 'The Old Oaths Are Waking', desc: 'The dead are rising not as enemies, but as creditors. Ancient bargains demand payment.' }, { name: 'The Hedge Witches Are Disappearing', desc: 'One by one, the folk practitioners who kept the villages healthy are vanishing. The Church says nothing. The villages are starting to ask.' }],
      hc: ['Disgraced Knight-Inquisitor Who Saw What the Blight Actually Is', 'Hedge Witch Paid in Secrets', 'Exiled Prince Hiding as a Traveling Merchant', 'Battle-Surgeon Who Stitches with Scar-Thread'],
      troubles: ['The Crown\'s Spies Recognize My Hands', 'I Know Too Much to Be Safe Anywhere', 'The Magic Is Burning Out of Me', 'The Thread Remembers What It Healed'],
      questions: ['What oath did you break, and who still holds you to the original terms?', 'What did the Blight change about someone you loved?', 'Which faction offered you protection, and what did they ask in return?', 'What magic do you carry that you don\'t fully understand?', 'Who at this table wronged you before the campaign begins — and do they know?', 'What is the one thing you would never do, no matter the cost?'],
    },
    space: {
      current:  [{ name: 'The Belt Is Blockaded', desc: 'Fleet patrols have cut off the outer stations. Supply chains are breaking. Prices are tripling.' }, { name: 'Jump Drive Fuel Is Running Out', desc: 'The refinery at Ceres went dark. Without new supply, long-range travel stops within months.' }],
      impending: [{ name: 'The Signal from Beyond the Gate', desc: 'Something is transmitting from outside charted space. The frequency matches no known language.' }, { name: 'A New Faction Is Buying Debt', desc: 'Someone is purchasing outstanding station contracts at face value. No one knows who or why. Ships that take the offer stop being heard from.' }],
      hc: ['Jump Drive Mechanic Three Payments Behind', 'Retired Fleet Medic Running Cargo', 'Salvage Auctioneer with a Questionable Ledger', 'Station-Born Pilot Who\'s Never Touched Dirt'],
      troubles: ['The Drive Works. The Paperwork Doesn\'t.', 'The Fleet Wants Me Back and Won\'t Take No', 'Half My Inventory Has Prior Owners', 'I\'ve Never Breathed Air I Didn\'t Pay For'],
      questions: ['What did you leave behind on your last station, and why can\'t you go back for it?', 'What does your ship mean to you — is it a tool, a home, or an escape?', 'Who in the Fleet still has authority over you, and what would it take to sever that tie?', 'What cargo did you agree to carry without asking what was inside?', 'What happened the last time you trusted a stranger in the void?', 'What do you owe, and to whom, and what happens when they collect?'],
    },
    victorian: {
      current:  [{ name: 'The Fog Hides Things That Hunt', desc: 'Disappearances in Whitechapel are accelerating. The police have stopped investigating.' }, { name: 'The Royal Society Has a Secret Wing', desc: 'Behind the lectures and papers, something is being studied that defies natural law.' }],
      impending: [{ name: 'The Threshold Is Thinning', desc: 'The boundary between what is real and what should not be is weakening. The signs are in the mirrors.' }, { name: 'The Clockwork Servants Are Dreaming', desc: 'Automated devices across the city are exhibiting unscheduled behaviours at night. The engineers who built them have no explanation.' }],
      hc: ['Alienist Who Studies What Studies Him Back', 'Society Photographer with a Darkroom Secret', 'Clockwork Surgeon Wanted by the College', 'Inspector Who Sees Patterns No One Else Can'],
      troubles: ['My Notes Are Starting to Write Themselves', 'Some Subjects Appear in the Negative That Weren\'t in the Room', 'My Methods Work. My Methods Are Illegal.', 'The Patterns Lead Somewhere I Don\'t Want to Go'],
      questions: ['What did you see that no one else believes?', 'Which institution protects you, and what do they expect in return?', 'What personal vice or obsession do you use to cope with what you know?', 'Who in your social circle would be destroyed if your true work were revealed?', 'What experiment or investigation went wrong, and what did it cost?', 'What draws you to the darkness — curiosity, duty, or something you can\'t name?'],
    },
    postapoc: {
      current:  [{ name: 'The Water War Has Started', desc: 'Two convoys are fighting over the last clean aquifer. Everyone else is choosing sides.' }, { name: 'Radio Silence from the Northern Settlements', desc: 'Three communities stopped broadcasting. Scouts haven\'t returned.' }],
      impending: [{ name: 'Winter Is Coming Early', desc: 'The growing season is shortening. Food stores won\'t last. Migration or conflict is inevitable.' }, { name: 'The Seeds Aren\'t Germinating', desc: 'This season\'s planting has produced almost nothing. The soil isn\'t dead — something is in it that shouldn\'t be.' }],
      hc: ['Convoy Medic Who Buries What She Can\'t Fix', 'Water-Finder Who Charges What the Water\'s Worth', 'Radio Operator Who Heard Something in the Static', 'Former Teacher Keeping Knowledge Alive'],
      troubles: ['The Graves Are Catching Up', 'Everyone Needs Me. Nobody Trusts Me.', 'The Voice on the Radio Knows My Name', 'The Children Don\'t Understand What Was Lost'],
      questions: ['What do you remember about the world before, and how does that memory help or hurt you?', 'Who did you fail to save, and how does that shape what you do now?', 'What resource do you control or protect, and who wants to take it from you?', 'What rule have you made for yourself that you will not break?', 'Who at this table did you meet on the road, and what happened that made you decide to travel together?', 'What are you walking toward — a place, a person, or an idea?'],
    },
    western: {
      current:  [{ name: 'The Railroad Is Buying Everything', desc: 'Land agents are making offers that aren\'t optional. Holdouts are finding their water rights disputed.' }, { name: 'A Hanging Gone Wrong', desc: 'The wrong man swung. The real killer is still out there. The town knows but won\'t speak.' }],
      impending: [{ name: 'The Army Is Coming', desc: 'Fort Reno is deploying a full regiment. Whatever they\'re responding to, the frontier won\'t be the same after.' }, { name: 'The Water Rights Are Being Redrawn', desc: 'A federal surveyor arrived last week with new maps. By his reckoning, every claim downstream of the ridge belongs to the railroad now.' }],
      hc: ['Land Surveyor Working Both Sides of the Deed', 'Circuit Rider Preacher with a Warrant', 'Assay Office Clerk Who Knows Every Vein', 'Former Cavalry Scout Who Walked Away'],
      troubles: ['Three Towns Believe the Same Acre Is Theirs', 'The Lord\'s Work and the Law\'s Work Crossed Once', 'The Company Pays My Salary and Owns My Silence', 'I Saw What Happened at Sand Creek'],
      questions: ['What brought you west — opportunity, escape, or something you can\'t name?', 'What do you own that someone powerful wants?', 'Which side of the law are you on, and has that always been the case?', 'Who do you owe a debt to that money can\'t settle?', 'What happened in the last town that means you can\'t go back?', 'What do you believe about justice, and when was that belief last tested?'],
    },
    dVentiRealm: {
      current:  [{ name: 'The Senate Has Collapsed', desc: 'The governing body of the realm has dissolved. Regional powers are filling the vacuum. Law is local and contradictory.' }, { name: 'The Vaults Are Opening', desc: 'Ancient sealed repositories are cracking. What comes out is valuable, dangerous, and claimed by multiple factions.' }],
      impending: [{ name: 'The Sealed Ones Are Waking', desc: 'The things that were locked in the Vaults are becoming aware. They are not grateful.' }, { name: 'The Arbiters\' Guild Has Gone Quiet', desc: 'The guild that mediated disputes between the regional powers has stopped responding to summons. Without them, every disagreement becomes a confrontation.' }],
      hc: ['Vault Warden Who Lost Their Key', 'Senate Exile with Dangerous Testimony', 'Guild Artificer Whose Creations Malfunction Creatively', 'Wandering Arbiter with No Authority Left'],
      troubles: ['The Key Wasn\'t Lost — It Was Taken', 'My Testimony Would Destroy Three Houses', 'The Malfunctions Are Getting Smarter', 'I Judge by Laws That No Longer Exist'],
      questions: ['What was your role before the Senate fell, and what is it now?', 'Which Vault have you seen opened, and what came out?', 'What faction wants your loyalty, and what are they offering?', 'What skill or knowledge do you have that makes you valuable — and dangerous?', 'Who at this table do you know from before the collapse, and has your relationship changed?', 'What would you restore if you could — the Senate, the Vaults, or something else entirely?'],
    },
  };

  let wd = $derived(campId ? WORLD_DATA[campId] : null);
  let ciIdx = $derived(wd ? rerolls % wd.current.length : 0);
  let iiIdx = $derived(wd && wd.impending.length > 1 ? (rerolls + 1) % wd.impending.length : 0);

  function pickN(arr, n) {
    if (!arr || arr.length === 0) return [];
    const shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, n);
  }

  // Reactive picks that change on reroll
  let hcExamples = $derived(wd ? pickN(wd.hc, 4) : []);
  let trExamples = $derived(wd ? pickN(wd.troubles, 4) : []);
  let qExamples = $derived(wd ? pickN(wd.questions, 6) : []);
</script>

<svelte:head>
  <title>Session Zero — Ogma</title>
  <meta name="description" content="Step-by-step Fate Condensed character creation wizard for your whole table." />
</svelte:head>

<div class="land-shell">
  <a href="#main" class="skip-link">Skip to main content</a>

  <header class="land-topnav topbar" role="banner">
    <a href="/" class="topbar-wordmark" aria-label="Ogma home">OGMA</a>
    <div class="topbar-spacer" style="flex:1"></div>
    <div class="topbar-status">
      <a href="/help" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none">&#128218; Help</a>
      <a href="/about" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none">About</a>
      <button class="btn btn-icon btn-ghost" onclick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style="width:44px;height:44px">{theme === 'dark' ? '☀️' : '◑'}</button>
    </div>
  </header>

  <div class="sz-container" id="main">
    {#if step === 0}
      <div class="sz-header">
        <div class="sz-title">Session Zero</div>
        <div class="sz-subtitle">Fate Condensed Character Creation Wizard</div>
      </div>
    {/if}

    <!-- Progress bar -->
    {#if fromSessionZero}
      <div class="sz-handoff-banner">
        <span class="sz-handoff-icon">&#10003;</span>
        <span>World and mode carried from Session Zero &mdash; <strong>{camp ? camp.name : ''}</strong>, <strong>{mode}</strong></span>
      </div>
    {/if}

    <div class="sz-progress-wrap">
      <div class="sz-step-counter">Step {step + 1} of {totalSteps}</div>
      <div class="sz-progress-bar" role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label="Step {step + 1} of {totalSteps}">
        <div class="sz-progress-fill" style="width:{progress}%"></div>
      </div>
    </div>

    <!-- Step content -->
    <div class="sz-step-title">{STEPS[step].title}</div>

    {#if stepId === 'campaign'}
      <div class="sz-body">
        <p>Which world are you playing in? This determines the setting details, example aspects, and story prompts throughout the wizard.</p>
        <div style="display:flex; align-items:flex-start; gap:10px; padding:10px 14px; background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:var(--glass-radius); margin:8px 0 4px; font-size:var(--text-sm); color:var(--text-dim); line-height:1.6">
          <span style="font-size:18px; flex-shrink:0">&#128161;</span>
          <span><strong style="color:var(--text); font-weight:600">Works solo or with your full table. </strong>Run it alone to prep your campaign and print character sheets, or share your screen and walk through it together as a group.</span>
        </div>
      </div>
      <div class="sz-grid sz-grid-2">
        {#each CAMP_ORDER as id}
          <button class="sz-option" class:selected={campId === id} onclick={() => selectCamp(id)} type="button">
            <div class="sz-option-title">{CAMPAIGNS[id].name}</div>
            <div class="sz-option-sub">{CAMPAIGNS[id].tagline.split('.')[0]}.</div>
          </button>
        {/each}
      </div>

    {:else if stepId === 'mode'}
      <div class="sz-body">
        <p>All three methods produce valid Fate Condensed characters. Choose based on how much time you have and how much pre-play collaboration your group wants.</p>
      </div>
      <div class="sz-grid">
        {#each MODES as md}
          <button class="sz-option" class:selected={mode === md.id} onclick={() => selectMode(md.id)} type="button" style="text-align:left">
            <div class="sz-option-tag">{md.tag}</div>
            <div class="sz-option-title">{md.label}</div>
            <div class="sz-option-sub">{md.sub}</div>
          </button>
        {/each}
      </div>
    {:else if stepId === 'pccount'}
      <div class="sz-body">
        <p>How many players are at the table today? The wizard will collect a name, High Concept, and Trouble for each one.</p>
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
            <div class="sz-card-title">&#127761; Impending Issue &mdash; Brewing on the Horizon</div>
            <div class="sz-issue-name">{wd.impending[iiIdx].name}</div>
            <div class="sz-issue-desc">{wd.impending[iiIdx].desc}</div>
          </div>

          <button class="btn btn-ghost sz-reroll" onclick={reroll} type="button">&#127922; Different issues</button>
        {/if}

        <div class="sz-tip">Discuss for 5 minutes: What does this world feel like? Who has power? What's at stake? This shared understanding is the foundation everything else builds on.</div>
      </div>
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
        </div>
        <p>Who is this character? One phrase that captures their role in the story.</p>
        <div class="sz-prompt-box">"If someone asked <em>what's your character about?</em> at a bar, what would you say?"</div>
        <div class="sz-input-group">
          <label class="sz-input-label" for="pc-hc">High Concept</label>
          <input id="pc-hc" type="text" class="sz-input" placeholder="e.g. Burned Ex-Corporate Fixer" value={currentPc.hc} oninput={e => updateCurrentPc('hc', e.target.value)} autocomplete="off" />
        </div>
        {#if hcExamples.length > 0}
          <div class="sz-card">
            <div class="sz-card-title">{camp ? camp.name : ''} Examples</div>
            <ul class="sz-aspect-list">
              {#each hcExamples as ex}<li><button class="sz-example-pick" type="button" onclick={() => updateCurrentPc('hc', ex)}>{ex}</button></li>{/each}
            </ul>
            <button class="btn btn-ghost sz-reroll" onclick={reroll} type="button">&#127922; New examples</button>
          </div>
        {/if}
        <div class="sz-dnd">In D&amp;D, your class + race IS your character concept. In Fate, High Concept is a narrative phrase that can be invoked and compelled.</div>
        <div class="sz-tip">Double-edged = good. "Sword-Sworn to a Dead King" helps AND causes problems.</div>
      </div>

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
        <p>What makes {currentPc.name || 'this character'}'s life harder? This is the aspect that will earn the most fate points.</p>
        <div class="sz-prompt-box">"When things go wrong for your character, <em>why</em> do they go wrong? What keeps pulling them back into trouble?"</div>
        <div class="sz-input-group">
          <label class="sz-input-label" for="pc-trouble">Trouble</label>
          <input id="pc-trouble" type="text" class="sz-input" placeholder="e.g. The Handler Knows Everything" value={currentPc.trouble} oninput={e => updateCurrentPc('trouble', e.target.value)} autocomplete="off" />
        </div>
        {#if trExamples.length > 0}
          <div class="sz-card">
            <div class="sz-card-title">Setting Examples</div>
            <ul class="sz-aspect-list">
              {#each trExamples as ex}<li><button class="sz-example-pick" type="button" onclick={() => updateCurrentPc('trouble', ex)}>{ex}</button></li>{/each}
            </ul>
            <button class="btn btn-ghost sz-reroll" onclick={reroll} type="button">&#127922; New examples</button>
          </div>
        {/if}
        <div class="sz-tip">A boring trouble earns you nothing. "Has Enemies" is flat. "The Warlord's Daughter Wants Me Dead" is a compel waiting to happen every single session.</div>
      </div>

    {:else if stepId === 'relationship'}
      <div class="sz-body">
        <p>Pair up. Each player connects their character to one other PC. Good relationships have tension &mdash; not hostility, but imbalance.</p>
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
        <div class="sz-tip">The relationship aspect is the strongest compel material in the entire campaign. Cross-PC history is fuel. Invest here.</div>
        <div class="sz-warn">Write this one down on paper now. It's your third aspect.</div>
      </div>

    {:else if stepId === 'freeaspects'}
      <div class="sz-body">
        <p>These can be anything &mdash; gear, history, reputation, a catchphrase, a connection to the setting. No restrictions beyond fitting the world.</p>
        <div class="sz-card sz-card--success">
          <div class="sz-card-title">&#10003; You Can Leave These Blank</div>
          <p>Official Condensed rule (p.47). Most experienced Fate GMs recommend leaving at least one blank. You'll know what your character needs after the first scene, not before it.</p>
        </div>
        <ul class="sz-aspect-list">
          <li>A signature piece of equipment or weapon</li>
          <li>A reputation or title that precedes you</li>
          <li>A personal code or belief that drives decisions</li>
          <li>A connection to a faction, place, or NPC in the setting</li>
          <li>A catchphrase that captures your attitude</li>
        </ul>
      </div>

    {:else if stepId === 'phase1'}
      <div class="sz-body">
        <p>Go around the table. Each player tells a short story about something that happened to their character before the campaign begins.</p>
        <div class="sz-prompt-box">"I was at <span class="sz-prompt-fill">[location]</span> when <span class="sz-prompt-fill">[threat]</span> happened, and I survived by <span class="sz-prompt-fill">______</span>."</div>
        <div class="sz-example">"I was at the Sealed Phade Vault when the Servitors reactivated, and I survived by talking to the lead unit in a language I shouldn't know." &rarr; Aspect: "The Old Machines Listen to Me"</div>
        <p>After you narrate, ask yourself: "What does this say about who I am?" Write that as your third aspect.</p>
      </div>

    {:else if stepId === 'phase2'}
      <div class="sz-body">
        <p>Pass your Phase 1 story to the player on your left. They were there. How were they involved?</p>
        <p>This produces your <strong>Relationship aspect</strong> &mdash; grounded in a shared story.</p>
        <p>Narrate one sentence about how you were involved, then write the aspect.</p>
        <div class="sz-tip">If someone is struggling: "I was the one who brought the rope" is enough. The aspect writes itself from there.</div>
      </div>

    {:else if stepId === 'phase3'}
      <div class="sz-body">
        <p>Pass your Phase 1 story to the player on your <strong>right</strong> (a different player than Phase 2). They pick a role and narrate their involvement. This produces your fifth and final aspect.</p>
        <div class="sz-tip">After this step, every character should have five aspects: High Concept, Trouble, and three from the Phase Trio.</div>
        <div class="sz-warn">Write all five aspects down before moving to Skills.</div>
      </div>

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

    {:else if stepId === 'skills'}
      <div class="sz-body">
        <p>Your skill pyramid defines what your character is good at. Assign ratings in this shape:</p>

        <div class="sz-skill-pyramid">
          {#each [['Great (+4)', '1 skill'], ['Good (+3)', '2 skills'], ['Fair (+2)', '3 skills'], ['Average (+1)', '4 skills'], ['Mediocre (+0)', 'Everything else']] as row}
            <div class="sz-skill-row-wrap">
              <span class="sz-skill-label">{row[0]}</span>
              <div class="sz-skill-row"><div class="sz-skill-slot">{row[1]}</div></div>
            </div>
          {/each}
        </div>

        <div class="sz-card">
          <div class="sz-card-title">The 19 Skills</div>
          <ul class="sz-skill-list">
            {#each [
              ['Academics', 'Mundane knowledge, education, history, sciences, medicine'],
              ['Athletics', 'Physical potential — running, jumping, dodging attacks'],
              ['Burglary', 'Bypassing security, picking pockets, committing crimes'],
              ['Contacts', 'Knowing the right people, information networks'],
              ['Crafts', 'Building, breaking, and repairing things'],
              ['Deceive', 'Lying convincingly, creating false identities'],
              ['Drive', 'Controlling vehicles under pressure'],
              ['Empathy', 'Reading moods, spotting lies, understanding people'],
              ['Fight', 'Hand-to-hand combat, melee weapons'],
              ['Investigate', 'Deliberate study, piecing together clues'],
              ['Lore', 'Specialized or arcane knowledge, the weird stuff'],
              ['Notice', 'Spotting things in the moment, reacting quickly'],
              ['Physique', 'Raw strength, toughness — also sets physical stress boxes'],
              ['Provoke', 'Intimidation, goading, scaring people'],
              ['Rapport', 'Building trust, making connections, persuasion'],
              ['Resources', 'Access to money, gear, and material things'],
              ['Shoot', 'Ranged combat — guns, bows, throwing weapons'],
              ['Stealth', 'Staying unseen, escaping, blending in'],
              ['Will', 'Mental fortitude, resisting pressure — also sets mental stress boxes'],
            ] as sk}
              <li><strong>{sk[0]}</strong> &mdash; {sk[1]}</li>
            {/each}
          </ul>
        </div>

        <div class="sz-dnd">D&amp;D has 6 ability scores + 18 skills. Fate has 19 skills that cover both. Your skill rating IS your expected result — no separate modifier calculation. A +3 in Fight means you reliably hit Good (+3) difficulty.</div>

        <div class="sz-tip">Physique sets your physical stress boxes. Will sets your mental stress boxes. Characters with neither above +0 get 3 boxes each &mdash; which isn't much. Plan accordingly.</div>
      </div>

    {:else if stepId === 'stunts'}
      <div class="sz-body">
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
          <div class="sz-card-title">&#10003; Leave All Three Blank</div>
          <p>Define stunts the first time you wish you had one. "I wish I could do X right now" is the perfect moment to write a stunt. This is official Condensed design.</p>
        </div>
        <div class="sz-dnd">In D&amp;D, feats are picked at creation and rarely change. In Fate, stunts can be rewritten at every milestone. Pick what sounds fun now; change it when you learn what your character actually needs.</div>
      </div>

    {:else if stepId === 'stress'}
      <div class="sz-body">
        <p>Look at your Physique rating and your Will rating. Find them on the table below.</p>

        <table class="sz-stress-table">
          <thead><tr><th>Skill Rating</th><th>Stress Boxes</th></tr></thead>
          <tbody>
            <tr><td>Mediocre (+0)</td><td>&#9744; &#9744; &#9744; (3 boxes)</td></tr>
            <tr><td>Average (+1) or Fair (+2)</td><td>&#9744; &#9744; &#9744; &#9744; (4 boxes)</td></tr>
            <tr><td>Good (+3) or Great (+4)</td><td>&#9744; &#9744; &#9744; &#9744; &#9744; &#9744; (6 boxes)</td></tr>
            <tr><td>Superb (+5)+</td><td>&#9744; &#9744; &#9744; &#9744; &#9744; &#9744; + extra mild consequence</td></tr>
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
          <p>Treatment requires a successful overcome roll: Academics for physical, Empathy for mental.</p>
        </div>

        <div class="sz-dnd">D&amp;D has hit points. Fate has stress (plot armour that clears every scene) and consequences (named aspects that stick). "Badly Burned Hands" isn't just damage &mdash; it's an aspect the GM can compel and enemies can invoke.</div>

        <div class="sz-tip">Stress clears after every scene. Consequences stick around and can be compelled against you &mdash; but they also earn you fate points when they cause trouble.</div>
      </div>
    {:else if stepId === 'questions'}
      <div class="sz-body">
        <p>Go around the table. Each player answers two of these questions aloud. Every answer should name another character. These become aspect seeds.</p>

        {#if qExamples.length > 0}
          <div class="sz-card">
            <div class="sz-card-title">World Questions &mdash; {camp ? camp.name : ''}</div>
            <ol style="margin:8px 0 0 18px; color:var(--text-dim); line-height:1.8">
              {#each qExamples as q}
                <li style="padding:3px 0">{q}</li>
              {/each}
            </ol>
            <button class="btn btn-ghost sz-reroll" onclick={reroll} type="button">&#127922; Different questions</button>
          </div>
        {/if}

        <div class="sz-tip">High Concept and Trouble are enough to start play. The other three aspects reveal themselves in the first session.</div>
      </div>

    {:else if stepId === 'summary'}
      {@const campName = camp ? camp.name : '-'}
      {@const modeLabel = mode === 'trio' ? 'Phase Trio' : mode === 'flashback' ? 'Flashback Slots' : 'Condensed Standard'}
      {@const aspectSlots = mode === 'standard' ? ['High Concept', 'Trouble', 'Relationship', 'Free Aspect', 'Free Aspect'] : mode === 'trio' ? ['High Concept', 'Trouble', 'Phase 1 Aspect', 'Phase 2 (Relationship)', 'Phase 3 Aspect'] : ['High Concept', 'Trouble', 'Flashback 1 (during play)', 'Flashback 2 (during play)', 'Flashback 3 (during play)']}
      <div class="sz-body">
        <div class="sz-summary-section">
          <div class="sz-summary-label">Campaign</div>
          <div class="sz-summary-value">{campName}</div>
        </div>
        <div class="sz-summary-section">
          <div class="sz-summary-label">Mode</div>
          <div class="sz-summary-value">{modeLabel}</div>
        </div>
        <div class="sz-summary-section">
          <div class="sz-summary-label">Aspect Slots</div>
          <ol style="margin:8px 0 0 20px; color:var(--text-dim)">
            {#each aspectSlots as s}
              <li style="padding:4px 0">{s}</li>
            {/each}
          </ol>
        </div>
        <div class="sz-summary-section">
          <div class="sz-summary-label">Skill Pyramid</div>
          <div class="sz-summary-value">1 &times; Great (+4) &middot; 2 &times; Good (+3) &middot; 3 &times; Fair (+2) &middot; 4 &times; Average (+1)</div>
        </div>
        <div class="sz-summary-section">
          <div class="sz-summary-label">Stunts &amp; Refresh</div>
          <div class="sz-summary-value">3 free stunts (can leave blank) &middot; Refresh: 3</div>
        </div>

        <!-- Advancement -->
        <div class="sz-card">
          <div class="sz-card-title">Milestones &amp; Breakthroughs &mdash; Advancement</div>
          <div style="margin-bottom:10px">
            <strong style="color:var(--gold)">Milestone</strong>
            <span style="color:var(--text-muted)"> (end of each session)</span>
            <div style="font-size:14px; color:var(--text-dim); margin-top:4px">Swap two skill ranks, rewrite a stunt, rewrite one aspect (not high concept), or buy a new stunt for 1 Refresh.</div>
          </div>
          <div>
            <strong style="color:var(--gold)">Breakthrough</strong>
            <span style="color:var(--text-muted)"> (end of a story arc)</span>
            <div style="font-size:14px; color:var(--text-dim); margin-top:4px">Everything from a milestone PLUS: rewrite your high concept, increase one skill by +1, and begin recovery of moderate/severe consequences.</div>
          </div>
        </div>

        <!-- Checklist -->
        <div class="sz-card">
          <div class="sz-card-title">&#10003; Quick Checklist</div>
          <ul class="sz-aspect-list">
            <li>High Concept written down</li>
            <li>Trouble written down</li>
            {#if mode === 'flashback'}
              <li>Three Flashback Slots noted (use during play)</li>
            {:else}
              <li>Relationship aspect written down</li>
            {/if}
            {#if mode === 'trio'}
              <li>Phase 1 + Phase 2 + Phase 3 aspects written down</li>
            {:else if mode === 'standard'}
              <li>Free aspects: written or marked blank</li>
            {:else}
              <li>Remaining aspects: discover during play</li>
            {/if}
            <li>Skill pyramid filled in (at minimum: Great, Good, and Fair rows)</li>
            <li>Stunts: filled in or marked blank for later</li>
            <li>Stress boxes counted from Physique and Will</li>
            <li>Refresh: 3 (minus extra stunts beyond 3)</li>
          </ul>
        </div>

        <!-- Export bar -->
        <div class="sz-export-bar">
          <button class="btn btn-primary" onclick={sendToPrep}><i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Send to Table Prep</button>
          <button class="btn btn-ghost" onclick={copyMarkdown}>&#128203; Markdown</button>
          <button class="btn btn-ghost" onclick={copyJSON}>&#123; &#125; JSON</button>
          <button class="btn btn-ghost" onclick={() => { if (typeof window !== 'undefined') window.print(); }}>&#128424; Print</button>
        </div>
        {#if copied}
          <div class="sz-copied">{copied}</div>
        {/if}
        {#if sentToPrep}
          <div class="sz-copied">&#10003; {pcCount} character pack{pcCount > 1 ? 's' : ''} sent to prep canvas</div>
        {/if}

        <div class="sz-tip">Session 1 starts IN the situation. No tavern. No meeting. The opening hook drops the PCs directly into the action. Aspects you left blank will reveal themselves naturally in the first few scenes.</div>

        <!-- Start session -->
        <div class="sz-ready-box">
          <div class="sz-ready-label">&#127922; Ready to play?</div>
          <div class="sz-ready-desc">Start a local session on this device. The board opens in Prep mode with your world loaded.</div>
          <button
            class="btn btn-primary sz-ready-cta"
            onclick={() => {
              if (typeof window === 'undefined') return;
              try {
                localStorage.setItem('ogma_sz_seed', JSON.stringify({
                  _sz_auto_pc: true, campId: campId || 'fantasy', ts: Date.now(),
                  mode, currentIssue: wd ? wd.current[ciIdx].name : '',
                  impendingIssue: wd ? wd.impending[iiIdx].name : '',
                  hcExamples, trExamples,
                }));
              } catch(e) {}
              window.location.href = '/campaigns/' + (campId || 'fantasy') + '?canvas=prep&sz=1';
            }}
          >&#9654; Open {campName} Prep Canvas</button>
        </div>

        <div style="text-align:center; margin-top:16px">
          <a href="/" class="btn btn-ghost" style="font-size:var(--text-sm)">&rarr; All Worlds</a>
        </div>
      </div>
    {/if}

    <!-- Navigation -->
    <div class="sz-nav">
      {#if step > 0}
        <button class="btn btn-ghost" onclick={back}>&larr; Back</button>
      {:else}
        <div></div>
      {/if}
      {#if step < totalSteps - 1}
        <button class="btn btn-primary" onclick={() => {
          if (stepId === 'trouble' && pcIndex < pcCount - 1) {
            pcIndex += 1;
            step = STEPS.findIndex(s => s.id === 'highconcept');
          } else {
            if (stepId === 'trouble') pcIndex = 0;
            next();
          }
        }} disabled={stepId === 'campaign' && !campId}>{stepId === 'trouble' && pcIndex < pcCount - 1 ? 'Next Player \u2192' : 'Next \u2192'}</button>
      {/if}
    </div>
  </div>

  <footer class="sz-footer">
    Fate&trade; is a trademark of Evil Hat Productions, LLC. &middot;
    <a href="/license">License &amp; Attribution</a> &middot;
    <a href="/help">Help &amp; Wiki</a> &middot;
    <a href="/about">About Ogma</a>
    <span class="about-version-badge">v{VERSION}</span>
  </footer>
</div>
