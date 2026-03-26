<svelte:options runes={false} />

<script>
  // ── HelpPanel — accordion rules reference with inspiration prompts ────────────
  let openSection  = null;
  let inspoPrompt  = null;

  const INSPO_PROMPTS = [
    'An NPC arrives with bad news.',
    'Something the PCs rely on breaks.',
    'A rival faction makes a move.',
    'The weather or environment shifts dramatically.',
    'An old debt comes due.',
    'Someone the PCs helped before needs help again.',
    'A hidden truth is revealed.',
    'Resources run low unexpectedly.',
    'A neutral party picks a side.',
    "A PC\u2019s trouble aspect triggers hard.",
    'The opposition changes tactics.',
    'An ally is compromised.',
    'A ticking clock accelerates.',
    'The real villain steps out of the shadows.',
    'An escape route is cut off.',
    'A moral dilemma forces a choice.',
  ];

  function rollInspo() {
    inspoPrompt = INSPO_PROMPTS[Math.floor(Math.random() * INSPO_PROMPTS.length)];
  }

  const sections = [
    {
      id: 'quickref', title: '⚡ Quick Reference',
      content: [
        {head: 'Ladder', body: '−2 Terrible · −1 Poor · 0 Mediocre · +1 Average · +2 Fair · +3 Good · +4 Great · +5 Superb · +6 Fantastic · +7 Epic · +8 Legendary'},
        {head: 'Outcomes', body: 'Fail (miss by 1+): it gets worse. Tie (match): succeed at minor cost. Succeed (beat by 1–2): you get what you want. Succeed w/ Style (beat by 3+): you get what you want + a boost.'},
        {head: '4 Actions', body: 'Overcome (remove obstacle) · Create Advantage (add aspect + free invokes) · Attack (deal stress) · Defend (oppose)'},
        {head: 'Invoke', body: 'Spend 1 FP → +2 or reroll. Free invoke → same, no FP cost.'},
      ]
    },
    {
      id: 'basics', title: 'Fate Basics',
      content: [
        {head: 'Golden Rule', body: 'Decide what you want to happen fictionally first, then figure out the mechanics.'},
        {head: 'Silver Rule', body: "Never let mechanics trump the fiction. If it makes no fictional sense, it doesn\u2019t happen."},
        {head: 'Fate Points', body: 'Start each session at your refresh value. Spend to invoke aspects (+2 or reroll). Earn when compelled.'},
        {head: 'The Ladder', body: '−2 Terrible · −1 Poor · 0 Mediocre · +1 Average · +2 Fair · +3 Good · +4 Great · +5 Superb · +6 Fantastic'},
      ]
    },
    {
      id: 'aspects', title: 'Aspects & Invokes',
      content: [
        {head: 'Invoke', body: 'Spend 1 FP for +2 or a reroll. Must be narratively relevant.'},
        {head: 'Compel', body: 'GM offers 1 FP to complicate life via an aspect. Player can refuse for 1 FP.'},
        {head: 'Free invokes', body: "From Create Advantage. Don\u2019t cost FP. Stack them."},
        {head: 'Boost', body: 'Temporary aspect with 1 free invoke, then gone.'},
        {head: 'Compel examples', body: '"Wanted By the Law" → bounty hunters arrive mid-rest. "Curious to a Fault" → you can\'t resist opening the sealed vault. "Loyal to a Broken Cause" → your old commander asks for one last favour.'},
      ]
    },
    {
      id: 'actions', title: 'The Four Actions',
      content: [
        {head: 'Overcome', body: 'Remove an obstacle. Can succeed, succeed with cost, tie, or fail.'},
        {head: 'Create Advantage', body: 'Add a situational aspect with free invokes.'},
        {head: 'Attack', body: 'Deal stress or consequences. Defender rolls to oppose.'},
        {head: 'Defend', body: 'Oppose attacks, creates advantages, or overcomes against you.'},
      ]
    },
    {
      id: 'stress', title: 'Stress & Consequences',
      content: [
        {head: 'Stress', body: 'Absorbs hits. Check boxes equal to or greater than the hit. Clears after conflict ends.'},
        {head: 'Consequences', body: 'Aspects that absorb hits. Mild −2, Moderate −4, Severe −6. Takes time to recover.'},
        {head: 'Taken Out', body: "Can\u2019t absorb a hit — opponent decides what happens to you."},
        {head: 'Concede', body: 'Before a roll, exit the conflict. Take a consequence but narrate your exit.'},
      ]
    },
    {
      id: 'npcs', title: 'Minor vs Major NPCs',
      content: [
        {head: 'Minor NPC', body: '1–2 aspects, one skill at +1–+3, 1–2 stress boxes. One solid hit takes them out. No consequence slots.'},
        {head: 'Major NPC', body: 'Full character. 5 aspects (High Concept, Trouble, 3 others), skill pyramid, stress tracks, all consequence slots. Treat like a PC.'},
        {head: 'Boss tip', body: 'Give bosses a unique stunt, an extra stress box, or a secret aspect revealed mid-fight.'},
      ]
    },
    {
      id: 'conflict', title: 'Challenges, Contests & Conflicts',
      content: [
        {head: 'Challenge', body: 'Series of overcome rolls. Each can succeed or fail independently. No active opposition.'},
        {head: 'Contest', body: 'Two sides race to 3 victories. Each exchange both roll — highest effort marks a victory; succeed with style (no one else did) = 2 victories. Tie = no victory + GM introduces a new situation aspect (unexpected twist, FCon p.33).'},
        {head: 'Conflict', body: 'Full structure with zones, turn order, stress/consequences. Use when both sides can harm each other and neither will back down.'},
        {head: 'Zones', body: 'Areas within the scene. Moving 1 zone is free. Moving further or past a barrier costs an Overcome roll. Each zone can have its own situation aspects.'},
        {head: 'Exchange', body: 'One exchange = every participant acts once (popcorn order). After acting, you choose who goes next. Repeat until conflict ends.'},
        {head: 'Concede', body: 'Before any roll, you can concede. You leave the conflict on your terms and earn 1 FP per consequence you took during this conflict. FCon p.35.'},
        {head: 'Taken Out', body: "If you can\u2019t absorb all shifts from an attack, you\u2019re taken out. The attacker narrates what happens to you. Always offer concession first."},
      ]
    },
    {
      id: 'optional', title: 'Optional Rules',
      content: [
        {head: 'Weapon ratings (FCon p.58)', body: "A weapon with Weapon:2 adds 2 extra shifts on a successful hit. Doesn\u2019t change the roll — only the damage dealt. Use sparingly: it makes fights deadlier fast."},
        {head: 'Armor ratings (FCon p.58)', body: 'Armor:1 absorbs 1 shift from any hit. Stacks with stress. Makes characters harder to take out but slows conflicts. Best for bosses or named NPCs.'},
        {head: 'Scale (FCon p.57)', body: 'When two entities differ in scale (personal vs. vehicle, individual vs. army), the larger side gets +2 per step of difference. The smaller side also gets +2 to Defend. This keeps asymmetric fights mechanically meaningful.'},
        {head: 'Extra mild consequence (FCon p.12)', body: 'Physique or Will at Superb (+5)+ grants a second mild consequence slot (physical or mental only). Rare — most PCs peak at +4.'},
      ]
    },
    {
      id: 'advanced', title: 'Advanced Concepts',
      content: [
        {head: 'Bronze Rule (FCon p.47)', body: 'Everything can be a character. Organizations, vehicles, locations, magic items, factions — give them aspects, skills, stress tracks, and consequence slots. A pirate ship might have HC: "Fastest Sloop on the Coast", skills Sail +3, Cannons +2, and 4 stress boxes. Treat it mechanically like an NPC.'},
        {head: 'When to use the Bronze Rule', body: "Use it when a non-person entity: (1) takes actions in the fiction, (2) can be attacked or damaged, (3) has narrative weight worth tracking. Don\u2019t use it for flavour — a locked door is an Overcome roll, not a character."},
        {head: 'Bronze Rule examples', body: 'Faction: HC "Shadow Council Pulls the Strings", Contacts +3, Deceive +2. Vehicle: HC "Armored War Rig", Drive +4, Weapon:2. Magical artifact: HC "The Crown Commands Obedience", Will +5, one mild consequence.'},
        {head: 'Extras (FCon p.50)', body: 'Special abilities, gear, or powers that go beyond stunts. An Extra is a permission (you can do X) plus a cost (it requires an aspect, a stunt slot, or a refresh point). Spaceships, magic systems, and cybernetics are all Extras.'},
      ]
    },
    {
      id: 'opposition', title: '⚔ Opposition Library',
      content: [
        {head: 'Mook (threat: low)', body: 'HC: "Expendable Grunt." One skill at +1. 1 stress box, no consequences. Taken out in one hit. Use in groups of 2–4.'},
        {head: 'Skilled operative (threat: medium)', body: 'HC: "Trained and Dangerous." Two aspects. Skills: peak +2, one at +1. 2 stress boxes, no consequences. Stunt: +2 to Defend when in cover.'},
        {head: 'Lieutenant (threat: high)', body: "HC: \"The Boss\u2019s Right Hand.\" Three aspects including a trouble. Skills: peak +3, two at +2, three at +1. 3 stress boxes, mild consequence. One stunt."},
        {head: 'Boss (threat: extreme)', body: 'Full character. 5 aspects, full skill pyramid (+4 peak). Stress: 4 physical, 4 mental. All 3 consequence slots. 2–3 stunts. Give them a unique aspect the PCs must discover mid-fight.'},
        {head: 'Mob (group of mooks)', body: 'Treat as one entity. Add +1 to skill per extra member (3 mooks = +3). Each stress box absorbed removes one member. Fast, scary, fragile.'},
        {head: 'Environment as opposition', body: 'Set a flat difficulty (+2 to +6) for natural hazards, traps, or automated defences. No stress track — just a target number to overcome. Add a countdown if the threat escalates.'},
      ]
    },
    {
      id: 'zones', title: '🗺 Zone Templates',
      content: [
        {head: 'Rooftop Chase (3 zones)', body: 'Zone 1: "Crowded Market Street" (free move). Zone 2: "Narrow Fire Escape" (Athletics +2 to cross, aspect: Rickety Railings). Zone 3: "Sloped Rooftop" (Athletics +3, aspect: Slippery Tiles). Good for: contests, chases.'},
        {head: 'Ambush Site (2 zones)', body: 'Zone 1: "Open Clearing" (aspect: Exposed, No Cover). Zone 2: "Dense Tree Line" (aspect: Natural Cover, Stealth +2 to enter unseen). Good for: conflicts with ranged/melee split.'},
        {head: 'Burning Building (4 zones)', body: 'Zone 1: "Lobby" (free). Zone 2: "Smoke-Filled Stairwell" (Physique +2, aspect: Choking Smoke). Zone 3: "Collapsing Floor" (Athletics +3, aspect: Floor Gives Way). Zone 4: "Roof Access" (blocked until Overcome +4). Add a 4-box countdown: "Building Collapses."'},
        {head: 'Tense Negotiation (2 zones)', body: 'Zone 1: "The Table" (social — Rapport, Deceive, Provoke). Zone 2: "The Back Room" (physical — guards, weapons, escape). Moving between = narrative shift from words to action. Aspect: "Armed Guards at Every Door."'},
        {head: 'Ship-to-Ship (3 zones)', body: 'Zone 1: "Your Deck" (free). Zone 2: "The Gap" (Athletics +3 to cross, aspect: Churning Sea). Zone 3: "Enemy Deck" (hostile territory, outnumbered). Boarding action structure.'},
        {head: 'Custom zone tips', body: '2–4 zones per scene is ideal. Give each zone one aspect. Set barrier difficulties at +2 (easy) to +4 (hard). Free movement within a zone, one free zone move per exchange, barriers cost an Overcome.'},
      ]
    },
  ];
</script>

<div class="blp-body blp-help">
  {#each sections as sec (sec.id)}
    {@const isOpen = openSection === sec.id}
    <div class="bh-section">
      <button
        class="bh-head{isOpen ? ' open' : ''}"
        on:click={() => (openSection = isOpen ? null : sec.id)}
      >
        <span>{sec.title}</span>
        <span class="bh-arrow">›</span>
      </button>
      {#if isOpen}
        <div class="bh-body">
          {#each sec.content as item, i (i)}
            <div class="bh-rule">
              <strong>{item.head}: </strong>{item.body}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/each}

  <!-- Inspiration button -->
  <div class="bh-inspo">
    <button class="bh-inspo-btn" on:click={rollInspo}>🎲 What would happen?</button>
    {#if inspoPrompt}
      <div class="bh-inspo-result">{inspoPrompt}</div>
    {/if}
  </div>

  <div class="bh-tip">
    <strong>✦ Aspect tip: </strong>Good aspects are double-edged — invokable AND compellable. If it only helps, it's a stunt. If it only hurts, it's a compel waiting to happen.
  </div>

  <div class="bh-tip">
    <strong>✦ Stunt format: </strong>Because I [description], I get +2 to [skill] when [narrow circumstance]. Or: Because I [X], once per session I can [powerful effect].
  </div>
</div>
