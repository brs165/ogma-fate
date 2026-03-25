<svelte:options runes={false} />

<script>
  import { onMount } from 'svelte';

  let theme = 'dark';
  let step = 0;

  const STEPS = [
    { id: 'campaign',  title: 'Choose Your Campaign' },
    { id: 'mode',      title: 'How Deep Do You Want to Go?' },
    { id: 'setting',   title: "The World You're Playing In" },
    { id: 'aspects',   title: 'Aspects — Who Are You?' },
    { id: 'skills',    title: 'Skills & Stunts' },
    { id: 'stress',    title: 'Stress & Consequences' },
    { id: 'questions', title: 'Session Zero Questions' },
    { id: 'summary',   title: 'Summary & Export' },
  ];

  $: stepId = STEPS[step].id;
  $: totalSteps = STEPS.length;
  $: progress = ((step + 1) / totalSteps * 100);

  function next() { if (step < totalSteps - 1) step += 1; }
  function back() { if (step > 0) step -= 1; }

  onMount(() => {
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      theme = p.theme || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}

    // Read ?world= param to pre-select campaign
    try {
      const params = new URLSearchParams(window.location.search);
      const w = params.get('world');
      if (w && CAMPAIGNS[w]) {
        campId = w;
        step = 1;
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

  $: camp = campId ? CAMPAIGNS[campId] : null;

  const CAMP_ORDER = ['thelongafter','cyberpunk','fantasy','space','victorian','postapoc','western','dVentiRealm'];

  const MODES = [
    { id: 'standard',  label: 'Condensed Standard', tag: 'Recommended', sub: 'High Concept → Trouble → Relationship → leave the rest blank → play. Fastest path to the table.' },
    { id: 'trio',      label: 'Phase Trio',         tag: 'Enriched',    sub: 'Collaborative backstory workshop. Three phases produce all five aspects through shared stories. ~20 min extra.' },
    { id: 'flashback', label: 'Flashback Slots',    tag: 'Play-First',  sub: 'Start with High Concept + Trouble + top skill only. Discover the rest during play through flashback moments.' },
  ];

  let rerolls = 0;
  function reroll() { rerolls += 1; }

  function selectCamp(id) { campId = id; }
  function selectMode(id) { mode = id; }

  // ── Per-world curated content (avoids importing full data modules) ────
  const WORLD_DATA = {
    thelongafter: {
      current:  [{ name: 'The Warlords Are Consolidating', desc: 'Three rival warlords have begun absorbing smaller settlements. Travel is dangerous. Tribute is mandatory.' }, { name: 'The Phade Vaults Are Waking Up', desc: 'Ancient automated systems are reactivating across the waste. Some offer miracles. Some enforce quarantine protocols.' }],
      impending: [{ name: 'The God-Machine Stirs', desc: 'Something beneath the Cradle is broadcasting. The signal is old. The response will not be kind.' }],
      hc: ['Last Cartographer of the Before-Times', 'Scavenger-Priest of the Rusted Saints', 'Vault Delver Who Reads the Old Signs', 'Road Tax Collector with a Legitimate Monopoly'],
      troubles: ['The Map Shows a City That Shouldn\'t Exist', 'Faith Built on Parts That No Longer Fit', 'The Route That Pays My Salary Doesn\'t Exist Anymore', 'The Old Machines Listen to Me — and That Scares People'],
      questions: ['What do you carry from the Before-Times that you cannot use but will not abandon?', 'Which warlord\'s territory did you cross to get here, and what did you leave behind as payment?', 'What did the last Phade vault you entered show you that you wish you could forget?', 'Who taught you to survive, and why did they stop traveling with you?', 'What do you believe about the God-Machine, and how does that belief put you at odds with someone at this table?', 'What skill do you have that is useless in this world but defined who you were in the old one?'],
    },
    cyberpunk: {
      current:  [{ name: 'The Blackout Districts Are Expanding', desc: 'Corporate infrastructure is failing in the lower city. No grid, no law, no extraction.' }, { name: 'Neural Debt Is the New Slavery', desc: 'Corpo clinics offer free augmentation. The contract is lifetime. Default means repossession — of the implant, not the debt.' }],
      impending: [{ name: 'The AI Quarantine Is Failing', desc: 'Something behind the Cage is learning to speak through people. The signs are subtle. The corps know.' }],
      hc: ['Debt-Bonded Neural Translator', 'Ex-Corpo Medic Running an Unlicensed Clinic', 'Protest Archivist Who Films Everything', 'Street Doc with a Corporate Kill Switch'],
      troubles: ['My Employer Owns My Language Centers', 'Every Patient Is Evidence', 'The Footage Has Made Me a Target', 'The Kill Switch Has a Timer I Can\'t See'],
      questions: ['What piece of yourself did you sell to survive, and do you want it back?', 'Who in the lower city depends on you, and what happens to them if you disappear?', 'What corporate secret did you stumble onto, and why haven\'t they silenced you yet?', 'Which district do you refuse to enter, and what happened there?', 'What augmentation do you wish you\'d never installed?', 'Who was the last person you trusted completely, and how did that end?'],
    },
    fantasy: {
      current:  [{ name: 'The Blight Spreads East', desc: 'A slow fungal transformation that doesn\'t kill but rewrites. Three border towns have gone silent.' }, { name: 'The Inquisition Hunts Hedge Magic', desc: 'The Church has declared all unsanctioned magic heretical. Practitioners are disappearing.' }],
      impending: [{ name: 'The Old Oaths Are Waking', desc: 'The dead are rising not as enemies, but as creditors. Ancient bargains demand payment.' }],
      hc: ['Disgraced Knight-Inquisitor Who Saw What the Blight Actually Is', 'Hedge Witch Paid in Secrets', 'Exiled Prince Hiding as a Traveling Merchant', 'Battle-Surgeon Who Stitches with Scar-Thread'],
      troubles: ['The Crown\'s Spies Recognize My Hands', 'I Know Too Much to Be Safe Anywhere', 'The Magic Is Burning Out of Me', 'The Thread Remembers What It Healed'],
      questions: ['What oath did you break, and who still holds you to the original terms?', 'What did the Blight change about someone you loved?', 'Which faction offered you protection, and what did they ask in return?', 'What magic do you carry that you don\'t fully understand?', 'Who at this table wronged you before the campaign begins — and do they know?', 'What is the one thing you would never do, no matter the cost?'],
    },
    space: {
      current:  [{ name: 'The Belt Is Blockaded', desc: 'Fleet patrols have cut off the outer stations. Supply chains are breaking. Prices are tripling.' }, { name: 'Jump Drive Fuel Is Running Out', desc: 'The refinery at Ceres went dark. Without new supply, long-range travel stops within months.' }],
      impending: [{ name: 'The Signal from Beyond the Gate', desc: 'Something is transmitting from outside charted space. The frequency matches no known language.' }],
      hc: ['Jump Drive Mechanic Three Payments Behind', 'Retired Fleet Medic Running Cargo', 'Salvage Auctioneer with a Questionable Ledger', 'Station-Born Pilot Who\'s Never Touched Dirt'],
      troubles: ['The Drive Works. The Paperwork Doesn\'t.', 'The Fleet Wants Me Back and Won\'t Take No', 'Half My Inventory Has Prior Owners', 'I\'ve Never Breathed Air I Didn\'t Pay For'],
      questions: ['What did you leave behind on your last station, and why can\'t you go back for it?', 'What does your ship mean to you — is it a tool, a home, or an escape?', 'Who in the Fleet still has authority over you, and what would it take to sever that tie?', 'What cargo did you agree to carry without asking what was inside?', 'What happened the last time you trusted a stranger in the void?', 'What do you owe, and to whom, and what happens when they collect?'],
    },
    victorian: {
      current:  [{ name: 'The Fog Hides Things That Hunt', desc: 'Disappearances in Whitechapel are accelerating. The police have stopped investigating.' }, { name: 'The Royal Society Has a Secret Wing', desc: 'Behind the lectures and papers, something is being studied that defies natural law.' }],
      impending: [{ name: 'The Threshold Is Thinning', desc: 'The boundary between what is real and what should not be is weakening. The signs are in the mirrors.' }],
      hc: ['Alienist Who Studies What Studies Him Back', 'Society Photographer with a Darkroom Secret', 'Clockwork Surgeon Wanted by the College', 'Inspector Who Sees Patterns No One Else Can'],
      troubles: ['My Notes Are Starting to Write Themselves', 'Some Subjects Appear in the Negative That Weren\'t in the Room', 'My Methods Work. My Methods Are Illegal.', 'The Patterns Lead Somewhere I Don\'t Want to Go'],
      questions: ['What did you see that no one else believes?', 'Which institution protects you, and what do they expect in return?', 'What personal vice or obsession do you use to cope with what you know?', 'Who in your social circle would be destroyed if your true work were revealed?', 'What experiment or investigation went wrong, and what did it cost?', 'What draws you to the darkness — curiosity, duty, or something you can\'t name?'],
    },
    postapoc: {
      current:  [{ name: 'The Water War Has Started', desc: 'Two convoys are fighting over the last clean aquifer. Everyone else is choosing sides.' }, { name: 'Radio Silence from the Northern Settlements', desc: 'Three communities stopped broadcasting. Scouts haven\'t returned.' }],
      impending: [{ name: 'Winter Is Coming Early', desc: 'The growing season is shortening. Food stores won\'t last. Migration or conflict is inevitable.' }],
      hc: ['Convoy Medic Who Buries What She Can\'t Fix', 'Water-Finder Who Charges What the Water\'s Worth', 'Radio Operator Who Heard Something in the Static', 'Former Teacher Keeping Knowledge Alive'],
      troubles: ['The Graves Are Catching Up', 'Everyone Needs Me. Nobody Trusts Me.', 'The Voice on the Radio Knows My Name', 'The Children Don\'t Understand What Was Lost'],
      questions: ['What do you remember about the world before, and how does that memory help or hurt you?', 'Who did you fail to save, and how does that shape what you do now?', 'What resource do you control or protect, and who wants to take it from you?', 'What rule have you made for yourself that you will not break?', 'Who at this table did you meet on the road, and what happened that made you decide to travel together?', 'What are you walking toward — a place, a person, or an idea?'],
    },
    western: {
      current:  [{ name: 'The Railroad Is Buying Everything', desc: 'Land agents are making offers that aren\'t optional. Holdouts are finding their water rights disputed.' }, { name: 'A Hanging Gone Wrong', desc: 'The wrong man swung. The real killer is still out there. The town knows but won\'t speak.' }],
      impending: [{ name: 'The Army Is Coming', desc: 'Fort Reno is deploying a full regiment. Whatever they\'re responding to, the frontier won\'t be the same after.' }],
      hc: ['Land Surveyor Working Both Sides of the Deed', 'Circuit Rider Preacher with a Warrant', 'Assay Office Clerk Who Knows Every Vein', 'Former Cavalry Scout Who Walked Away'],
      troubles: ['Three Towns Believe the Same Acre Is Theirs', 'The Lord\'s Work and the Law\'s Work Crossed Once', 'The Company Pays My Salary and Owns My Silence', 'I Saw What Happened at Sand Creek'],
      questions: ['What brought you west — opportunity, escape, or something you can\'t name?', 'What do you own that someone powerful wants?', 'Which side of the law are you on, and has that always been the case?', 'Who do you owe a debt to that money can\'t settle?', 'What happened in the last town that means you can\'t go back?', 'What do you believe about justice, and when was that belief last tested?'],
    },
    dVentiRealm: {
      current:  [{ name: 'The Senate Has Collapsed', desc: 'The governing body of the realm has dissolved. Regional powers are filling the vacuum. Law is local and contradictory.' }, { name: 'The Vaults Are Opening', desc: 'Ancient sealed repositories are cracking. What comes out is valuable, dangerous, and claimed by multiple factions.' }],
      impending: [{ name: 'The Sealed Ones Are Waking', desc: 'The things that were locked in the Vaults are becoming aware. They are not grateful.' }],
      hc: ['Vault Warden Who Lost Their Key', 'Senate Exile with Dangerous Testimony', 'Guild Artificer Whose Creations Malfunction Creatively', 'Wandering Arbiter with No Authority Left'],
      troubles: ['The Key Wasn\'t Lost — It Was Taken', 'My Testimony Would Destroy Three Houses', 'The Malfunctions Are Getting Smarter', 'I Judge by Laws That No Longer Exist'],
      questions: ['What was your role before the Senate fell, and what is it now?', 'Which Vault have you seen opened, and what came out?', 'What faction wants your loyalty, and what are they offering?', 'What skill or knowledge do you have that makes you valuable — and dangerous?', 'Who at this table do you know from before the collapse, and has your relationship changed?', 'What would you restore if you could — the Senate, the Vaults, or something else entirely?'],
    },
  };

  $: wd = campId ? WORLD_DATA[campId] : null;
  $: ciIdx = wd ? rerolls % wd.current.length : 0;
  $: iiIdx = wd ? (rerolls + 1) % wd.impending.length : 0;

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
  $: hcExamples = wd ? pickN(wd.hc, 4) : []; void rerolls;
  $: trExamples = wd ? pickN(wd.troubles, 4) : []; void rerolls;
  $: qExamples = wd ? pickN(wd.questions, 6) : []; void rerolls;
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
      <button class="btn btn-icon btn-ghost" on:click={toggleTheme}
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
    <div class="sz-step-counter">Step {step + 1} of {totalSteps}</div>
    <div style="width:100%; height:3px; border-radius:2px; background:var(--border); margin-bottom:12px; overflow:hidden">
      <div style="width:{progress}%; height:100%; border-radius:2px; background:var(--accent, var(--gold, #888)); transition:width 0.3s ease"></div>
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
          <button class="sz-option" class:selected={campId === id} on:click={() => selectCamp(id)} type="button">
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
          <button class="sz-option" class:selected={mode === md.id} on:click={() => selectMode(md.id)} type="button" style="text-align:left">
            <div class="sz-option-tag">{md.tag}</div>
            <div class="sz-option-title">{md.label}</div>
            <div class="sz-option-sub">{md.sub}</div>
          </button>
        {/each}
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

          <button class="btn btn-ghost sz-reroll" on:click={reroll} type="button">&#127922; Different issues</button>
        {/if}

        <div class="sz-tip">Discuss for 5 minutes: What does this world feel like? Who has power? What's at stake? This shared understanding is the foundation everything else builds on.</div>
      </div>
    {:else if stepId === 'aspects'}
      <div class="sz-body"><p>Character aspects. (Content coming in next pass.)</p></div>
    {:else if stepId === 'skills'}
      <div class="sz-body"><p>Skills and stunts. (Content coming in next pass.)</p></div>
    {:else if stepId === 'stress'}
      <div class="sz-body"><p>Stress and consequences. (Content coming in next pass.)</p></div>
    {:else if stepId === 'questions'}
      <div class="sz-body"><p>Session zero questions. (Content coming in next pass.)</p></div>
    {:else if stepId === 'summary'}
      <div class="sz-body"><p>Summary and export. (Content coming in next pass.)</p></div>
    {/if}

    <!-- Navigation -->
    <div class="sz-nav">
      {#if step > 0}
        <button class="btn btn-ghost" on:click={back}>&larr; Back</button>
      {:else}
        <div></div>
      {/if}
      {#if step < totalSteps - 1}
        <button class="btn btn-primary" on:click={next} disabled={stepId === 'campaign' && !campId}>Next &rarr;</button>
      {/if}
    </div>
  </div>

  <footer style="text-align:center; padding:20px; font-size:12px; color:var(--text-muted); border-top:1px solid var(--border); margin-top:20px">
    Fate&trade; is a trademark of Evil Hat Productions, LLC. &middot;
    <a href="/license" style="color:var(--text-muted)">License &amp; Attribution</a> &middot;
    <a href="/help" style="color:var(--text-muted)">Help &amp; Wiki</a> &middot;
    <a href="/about" style="color:var(--text-muted)">About Ogma</a>
  </footer>
</div>
