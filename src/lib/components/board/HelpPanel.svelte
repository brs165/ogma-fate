<script>
  import { Accordion, Popover } from 'bits-ui';

  let inspoPrompt = $state(null);

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
    { id: 'quickref', title: '⚡ Quick Reference', content: [
      {head: 'Ladder', body: '−2 Terrible · −1 Poor · 0 Mediocre · +1 Average · +2 Fair · +3 Good · +4 Great · +5 Superb · +6 Fantastic · +7 Epic · +8 Legendary'},
      {head: 'Outcomes', body: 'Fail (miss by 1+): it gets worse. Tie (match): succeed at minor cost. Succeed (beat by 1–2): you get what you want. Succeed w/ Style (beat by 3+): you get what you want + a boost.'},
      {head: '4 Actions', body: 'Overcome (remove obstacle) · Create Advantage (add aspect + free invokes) · Attack (deal stress) · Defend (oppose)'},
      {head: 'Invoke', body: 'Spend 1 FP → +2 or reroll. Free invoke → same, no FP cost.'},
    ]},
    { id: 'basics', title: 'Fate Basics', content: [
      {head: 'Golden Rule', body: 'Decide what you want to happen fictionally first, then figure out the mechanics.'},
      {head: 'Silver Rule', body: "Never let mechanics trump the fiction. If it makes no fictional sense, it doesn\u2019t happen."},
      {head: 'Fate Points', body: 'Start each session at your refresh value. Spend to invoke aspects (+2 or reroll). Earn when compelled.'},
    ]},
    { id: 'aspects', title: 'Aspects & Invokes', content: [
      {head: 'Invoke', body: 'Spend 1 FP for +2 or a reroll. Must be narratively relevant.'},
      {head: 'Compel', body: 'GM offers 1 FP to complicate life via an aspect. Player can refuse for 1 FP.'},
      {head: 'Free invokes', body: "From Create Advantage. Don\u2019t cost FP. Stack them."},
      {head: 'Boost', body: 'Temporary aspect with 1 free invoke, then gone.'},
    ]},
    { id: 'actions', title: 'The Four Actions', content: [
      {head: 'Overcome', body: 'Remove an obstacle. Can succeed, succeed with cost, tie, or fail.'},
      {head: 'Create Advantage', body: 'Add a situational aspect with free invokes.'},
      {head: 'Attack', body: 'Deal stress or consequences. Defender rolls to oppose.'},
      {head: 'Defend', body: 'Oppose attacks, creates advantages, or overcomes against you.'},
    ]},
    { id: 'stress', title: 'Stress & Consequences', content: [
      {head: 'Stress', body: 'Absorbs hits. Check boxes equal to or greater than the hit. Clears after conflict ends.'},
      {head: 'Consequences', body: 'Aspects that absorb hits. Mild −2, Moderate −4, Severe −6. Takes time to recover.'},
      {head: 'Taken Out', body: "Can\u2019t absorb a hit — opponent decides what happens to you."},
      {head: 'Concede', body: 'Before a roll, exit the conflict. Take a consequence but narrate your exit.'},
    ]},
    { id: 'npcs', title: 'Minor vs Major NPCs', content: [
      {head: 'Minor NPC', body: '1–2 aspects, one skill at +1–+3, 1–2 stress boxes. One solid hit takes them out. No consequence slots.'},
      {head: 'Major NPC', body: 'Full character. 5 aspects, skill pyramid, stress tracks, all consequence slots.'},
    ]},
    { id: 'conflict', title: 'Challenges, Contests & Conflicts', content: [
      {head: 'Challenge', body: 'Series of overcome rolls. Each can succeed or fail independently.'},
      {head: 'Contest', body: 'Two sides race to 3 victories. Each exchange both roll.'},
      {head: 'Conflict', body: 'Full structure with zones, turn order, stress/consequences.'},
      {head: 'Zones', body: 'Areas within the scene. Moving 1 zone is free. Further costs Overcome.'},
    ]},
    { id: 'opposition', title: '⚔ Opposition Library', content: [
      {head: 'Mook (low)', body: 'One skill +1. 1 stress box. Use in groups of 2–4.'},
      {head: 'Skilled (medium)', body: 'Peak +2, two aspects. 2 stress boxes. One stunt.'},
      {head: 'Lieutenant (high)', body: 'Peak +3, three aspects. 3 stress boxes, mild consequence.'},
      {head: 'Boss (extreme)', body: 'Full character. 5 aspects, +4 peak. All consequence slots.'},
    ]},
  ];
</script>

<div class="blp-body blp-help">
  <Accordion.Root type="single" class="hp-accordion">
    {#each sections as sec (sec.id)}
      <Accordion.Item value={sec.id} class="hp-item">
        <Accordion.Header>
          <Accordion.Trigger class="bh-head">
            <span class="bh-head-text">{sec.title}</span>
            <span class="bh-head-chevron" aria-hidden="true">›</span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="bh-body">
          {#each sec.content as item, i (i)}
            <div class="bh-rule">
              <strong>{item.head}: </strong>{item.body}
            </div>
          {/each}
        </Accordion.Content>
      </Accordion.Item>
    {/each}
  </Accordion.Root>

  <div class="bh-inspo">
    <Popover.Root open={inspoPrompt !== null} onOpenChange={(o) => { if (!o) inspoPrompt = null; }}>
      <Popover.Trigger class="bh-inspo-btn" onclick={rollInspo}>
        🎲 What would happen?
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content class="bh-inspo-popover" sideOffset={8} align="start">
          <Popover.Arrow class="bh-inspo-arrow" />
          <div class="bh-inspo-roll-result">{inspoPrompt}</div>
          <button class="bh-inspo-reroll" onclick={rollInspo}>🎲 Reroll</button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  </div>

  <div class="bh-tip">
    <strong>✦ Aspect tip: </strong>Good aspects are double-edged — invokable AND compellable.
  </div>

  <div class="bh-tip">
    <strong>✦ Stunt format: </strong>Because I [description], I get +2 to [skill] when [narrow circumstance].
  </div>
</div>
