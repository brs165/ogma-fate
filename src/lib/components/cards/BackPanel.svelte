<script>
  import CvLabel from './CvLabel.svelte';

  export let genId = '';
  export let catColor = 'var(--accent)';

  const CV4_BODY = "system-ui,-apple-system,sans-serif";
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const accentBlue  = 'var(--c-blue,#60a5fa)';
  const accentRed   = 'var(--c-red,#E06060)';

  const CV4_HELP = {
    npc_minor: {
      what: 'A supporting character with one aspect, one peak skill, and one stress box.',
      when: 'Shopkeepers, witnesses, bystanders \u2014 anyone who has one scene and a name.',
      rule: 'No consequences \u2014 one solid hit takes them out. Use the aspect as a compel hook immediately. Never give a minor NPC a second stress box by mistake; that turns them into a major NPC.',
      invoke: 'A PC with Athletics needs to leap a rooftop. The guard\u2019s aspect is \u201cAlways Watching the Exits\u201d. Invoke it as an obstacle \u2014 they spotted the PC\u2019s route, adding passive opposition.',
      compel: 'The informant\u2019s weakness is \u201cDesperate for Coin\u201d. Compel it: someone offers them money mid-scene and they hesitate just long enough to blow the party\u2019s cover.',
    },
    npc_major: {
      what: 'A full character: skill pyramid, stunts, dual stress tracks, and a complete aspect suite.',
      when: 'Recurring antagonists, key allies, anyone who survives a conflict and returns.',
      rule: 'Refresh = free invokes they can spend against the party. High Concept and Trouble are the most compellable aspects. Consequence recovery requires a treatment roll before timing starts.',
      invoke: 'The warlord\u2019s High Concept is \u201cFeared Across Three Territories\u201d. Invoke it on a Provoke roll to intimidate the PC into backing down without combat \u2014 +2 or a reroll.',
      compel: 'The same warlord\u2019s Trouble is \u201cI Never Forgive a Debt\u201d. Compel it when a PC who once helped them asks a favour \u2014 the warlord has to honour it, even when it costs them.',
    },
    faction: {
      what: 'An organisation with a goal, method, structural weakness, and a human face.',
      when: 'Between sessions or when players ask who is behind something.',
      rule: 'Goal + Method = two sides of one faction aspect. The Face is the person the PCs deal with. The Weakness is how the faction can be disrupted without direct confrontation.',
      invoke: 'The faction\u2019s aspect is \u201cResources Flow Upward, Never Down\u201d. Invoke it when they bribe a checkpoint: the bribe gets through because the faction\u2019s money is everywhere.',
      compel: 'The same faction aspect means a local chapter is starved of supplies. Compel it: a faction lieutenant asks the PCs to help, because they can\u2019t ask headquarters without losing face.',
    },
    scene: {
      what: 'Situation aspects and zones that make a location mechanically and dramatically alive.',
      when: 'Before any scene where action is likely. Use framing questions to decide if the scene is worth playing.',
      rule: 'Scene aspects last until the fiction changes them. Free invokes reset each scene. Zones control movement.',
      invoke: 'The scene aspect is \u201cChoking Dust Storm Closing In\u201d. A PC uses its free invoke on a Notice roll to spot the enemy before visibility drops to zero.',
      compel: 'The same aspect: compel it mid-fight to cut off a PC\u2019s escape route. The storm arrived early and the exit zone is now impassable \u2014 here\u2019s a Fate point.',
    },
    campaign: {
      what: 'A current issue, an impending threat, and setting aspects defining what kind of world this is.',
      when: 'Session zero, between arcs, or when the table needs a shared frame to pull against.',
      rule: 'Current issue = what is already on fire. Impending = what happens if they do not act. Both are aspects. Use them every session or they disappear.',
      invoke: 'The current issue is \u201cThe Water Rights War Is Already Being Fought\u201d. Invoke it when the PCs need to explain why every faction is armed \u2014 free narrative permission.',
      compel: 'The impending issue is \u201cThe Rail Company Arrives in Sixty Days\u201d. Compel it: the company\u2019s advance scouts are already in town, asking questions, and they\u2019ve noticed the PCs.',
    },
    encounter: {
      what: 'A full conflict setup: opposition, zones, stakes, twist, and starting GM fate points.',
      when: 'Any scene with direct opposition. The twist fires mid-conflict, not in the first exchange.',
      rule: 'GM starts with 1 FP per PC. Always state victory and defeat conditions before the first roll. The twist is optional.',
      invoke: 'Spend a GM fate point to invoke the encounter aspect \u201cNarrow Corridors, No Flanking\u201d against a PC\u2019s Fight attack: the tight space negates their advantage.',
      compel: 'A PC\u2019s trouble is relevant: they\u2019re \u201cKnown in Every Town\u201d. Compel it \u2014 a guard recognises them the moment they walk in and sounds the alarm.',
    },
    seed: {
      what: 'A 3-scene skeleton: opening, complication, climax. Drop-in ready for one session.',
      when: 'Session prep, unexpected cancellations, or when you need something playable in minutes.',
      rule: 'Do not add more scenes. The constraint is the design.',
      invoke: 'The seed\u2019s situation aspect is \u201cOld Debts Come Due Tonight\u201d. Invoke it in the opening scene to establish why the NPC called the PCs specifically \u2014 free context, no roll needed.',
      compel: 'The same aspect in the climax: compel a PC whose trouble relates to owing favours. They can\u2019t refuse the call for help, even though they know it\u2019s a trap.',
    },
    compel: {
      what: 'A situation where an aspect makes things worse in exchange for a Fate point.',
      when: 'When a player aspect is relevant and making life harder would be more interesting.',
      rule: 'Event compels happen to the character. Decision compels require a hard choice. Player refuses by spending 1 FP.',
      invoke: 'Not applicable \u2014 a Compel is itself the activation of an aspect. If a player refuses, that costs them 1 FP. The GM gains nothing from invoking vs. compelling the same aspect.',
      compel: 'A PC\u2019s trouble is \u201cI Always Finish What I Start\u201d. Event compel: the building is on fire and the target escaped, but the evidence is still inside. Here\u2019s a Fate point \u2014 do you go in?',
    },
    challenge: {
      what: 'A series of overcome rolls where each result matters and changes the fiction.',
      when: 'Extended tasks where failure at multiple stages has independent consequences.',
      rule: 'Each roll succeeds, fails, or ties independently. Declare all stakes before the first roll.',
      invoke: 'A PC rolls Crafts to repair the transmitter mid-challenge. Invoke the scene aspect \u201cPartially Flooded Engine Room\u201d for +2 on a creative approach: standing water conducts the signal.',
      compel: 'Mid-challenge, a PC\u2019s High Concept \u201cSelf-Taught Mechanic\u201d gets compelled: the procedure requires training they don\u2019t have. They can solve it \u2014 but it will take an extra roll and a cost.',
    },
    contest: {
      what: 'Two sides competing for a goal, not fighting, but racing, arguing, or outmanoeuvring.',
      when: 'Chases, debates, political manoeuvring, escape sequences.',
      rule: 'Both sides roll every exchange. Three victories wins (default). Ties add a twist. The loser earns a Fate point.',
      invoke: 'A PC is one victory from winning the debate. Invoke their aspect \u201cI\u2019ve Read Every Document in This Archive\u201d for +2 on the final Academics roll.',
      compel: 'The PC is ahead in a footchase but their trouble is \u201cI Never Leave Anyone Behind\u201d. Compel it: an ally just tripped. Do they keep running or stop? Here\u2019s a Fate point.',
    },
    consequence: {
      what: 'An aspect a character takes to absorb a hit instead of being taken out.',
      when: 'When stress will not cover the overflow and the player wants to stay in the scene.',
      rule: 'Mild = 2 shifts. Moderate = 4. Severe = 6. Recovery needs a treatment overcome roll first.',
      invoke: 'The PC took a Mild consequence: \u201cKnocked Around\u201d. In the next scene, an enemy invokes it for +2 on a Provoke roll \u2014 battered people are easier to intimidate.',
      compel: 'Same consequence: compel it when the PC tries to climb a wall. \u201cYou\u2019re knocked around \u2014 the GM offers a Fate point. You can make the climb but you\u2019ll worsen the injury.\u201d',
    },
    complication: {
      what: 'A new aspect that enters the scene and makes everything harder.',
      when: 'End of a scene that resolved cleanly, or when a scene needs a second wind.',
      rule: 'Complications arrive with at least one free invoke. Remove them only when the fiction justifies it.',
      invoke: 'The complication \u201cReinforcements Called In\u201d arrives with one free invoke. Use it on the new NPCs\u2019 first action in the exchange \u2014 they arrived coordinated and ready.',
      compel: 'The complication is \u201cThe Safe House Is Compromised\u201d. Compel it when a PC tries to retreat there: they arrive and walk straight into an ambush. Fate point offered.',
    },
    pc: {
      what: 'A complete Fate Condensed player character: 5 aspects, full skill pyramid, 3 stunts, stress tracks, and session zero questions.',
      when: 'Session zero, one-shots, or when a player needs an instant character. Generate 3\u20134, let players pick and customise.',
      rule: 'Skill pyramid: 1\u00d7+4, 2\u00d7+3, 3\u00d7+2, 4\u00d7+1. Refresh 3 with 3 free stunts. Physique/Will determine stress track length. All 3 consequence slots always open at creation.',
      invoke: 'A PC\u2019s High Concept is \u201cVault-Born Archivist on First Surface Mission\u201d. Invoke it when they recall pre-war technical schematics \u2014 +2 on Lore, and the fiction earns it.',
      compel: 'The same PC\u2019s Trouble is \u201cThe Map In My Head Has Never Been Wrong Before\u201d. Compel it when the map is wrong: they trusted it too long and now they\u2019re deep in hostile territory.',
    },
    backstory: {
      what: 'Targeted questions that build a character history and create hooks into the campaign.',
      when: 'Session zero, or when a new player joins and needs weaving into the party.',
      rule: 'Every answer should name another PC or NPC and leave something unresolved. Hooks are invitations, never mandates.',
      invoke: 'A backstory established that the PC \u201cOwes the Settlement That Patched Them Up\u201d. Turn it into an aspect and invoke it when the settlement sends a messenger \u2014 the PC\u2019s history opens a door.',
      compel: 'The same aspect: compel it when the settlement asks for something dangerous. \u201cYou owe them. Here\u2019s a Fate point if you agree even though it\u2019s a terrible idea.\u201d',
    },
    obstacle: {
      what: 'A passive threat that opposes the party without taking an action each exchange.',
      when: 'Environmental dangers, barriers, conditions. Anything that resists without acting in the conflict.',
      rule: 'Obstacles do not act in a conflict. Passive opposition = their rating. Disable by overcoming at rating + 2.',
      invoke: 'The obstacle aspect is \u201cFloodwater Rising Fast\u201d. Invoke it against a PC\u2019s Athletics roll to cross: the water\u2019s current is now actively opposing them, not just a difficulty number.',
      compel: 'The same obstacle: compel a PC whose trouble is \u201cI Can\u2019t Leave Anyone Behind\u201d. The water is rising and someone\u2019s stuck. Do they go back? Fate point on the table.',
    },
    countdown: {
      what: 'A ticking clock that creates urgency without requiring direct opposition.',
      when: 'Whenever players risk losing momentum, or a threat has a natural deadline.',
      rule: 'Fill one box per trigger. The last box fires the outcome, no roll, no negotiation. Show the track openly.',
      invoke: 'The countdown aspect is \u201cThe Convoy Reaches the Border in Four Hours\u201d. Invoke it when a PC is stalling \u2014 it\u2019s a reminder the clock is an aspect with mechanical weight.',
      compel: 'Two boxes left. Compel a PC\u2019s trouble to fill one now: their impulsive action triggered the next stage early. Fate point, and the clock ticks forward.',
    },
    constraint: {
      what: 'A limitation that forces the party to change their approach rather than roll higher.',
      when: 'When the obvious solution is too easy, or a scene needs tactical texture without more enemies.',
      rule: 'Constraints do not deal stress, they change the rules. Bypass requires specific fiction, not a high roll.',
      invoke: 'The constraint is \u201cNo Weapons Inside the Negotiation Chamber\u201d. Invoke it on a Contacts roll to establish that a PC has a contact who can smuggle one in \u2014 using the rule as the hook.',
      compel: 'Same constraint. A PC goes for their weapon anyway \u2014 compel their impulsive trouble. Guards move. The room goes hostile. Fate point, and the negotiation just became a conflict.',
    },
    custom: {
      what: 'A blank card you fill in yourself \u2014 title, type, and notes all editable in place.',
      when: 'Any time the generators produce something close but not quite right, or you need to capture an improvised NPC, location, aspect, or clue right now.',
      rule: 'Click the title or notes to edit. Tap the type pill to cycle: Aspect \u2192 NPC \u2192 Location \u2192 Clue \u2192 Other. The type tints the card accent colour for quick visual scanning.',
      invoke: 'You improvised an NPC mid-scene and named them. Create a custom card with type NPC, write their aspect and peak skill in the notes. Now it\u2019s a real card you can invoke from.',
      compel: 'You noted a location detail as a custom Aspect card: \u201cThe Chandelier Is Hanging by One Chain.\u201d Compel it against the most reckless PC \u2014 they notice it, and they have an idea.',
    },
  };

  $: help = CV4_HELP[genId] || { what: '', when: '', rule: '', invoke: '', compel: '' };
</script>

<div style:padding="12px 16px 14px"
     style:display="flex"
     style:flex-direction="column"
     style:gap="10px">

  <!-- What / When -->
  <div style:display="flex" style:gap="12px">
    <div style:flex="1">
      <CvLabel label="WHAT IT GENERATES" color={catColor} />
      <p style:margin="0"
         style:font-size="11px"
         style:color="var(--cv-card-text-dim)"
         style:line-height="1.65"
         style:font-family={CV4_BODY}>
        {help.what}
      </p>
    </div>
    <div style:flex="1">
      <CvLabel label="WHEN TO USE IT" color={catColor} />
      <p style:margin="0"
         style:font-size="11px"
         style:color="var(--cv-card-text-dim)"
         style:line-height="1.65"
         style:font-family={CV4_BODY}>
        {help.when}
      </p>
    </div>
  </div>

  <!-- Table rule -->
  <div style:padding="8px 12px"
       style:background="color-mix(in srgb,{catColor} 8%,var(--cv-card-dark,var(--panel)))"
       style:border-left="3px solid {catColor}"
       style:border-radius="0 2px 2px 0">
    <CvLabel label="TABLE RULE" color={catColor} />
    <p style:margin="0"
       style:font-size="11px"
       style:color="var(--cv-card-text-dim)"
       style:line-height="1.7"
       style:font-family={CV4_BODY}>
      {help.rule}
    </p>
  </div>

  <!-- Invoke + Compel examples -->
  {#if help.invoke || help.compel}
    <div style:display="flex" style:gap="8px">
      {#if help.invoke}
        <div style:flex="1"
             style:padding="8px 10px"
             style:background="color-mix(in srgb,{accentBlue} 8%,var(--cv-card-dark,var(--panel)))"
             style:border-left="3px solid {accentBlue}"
             style:border-radius="0 2px 2px 0">
          <div style:display="flex" style:align-items="center" style:gap="5px" style:margin-bottom="4px">
            <CvLabel label="INVOKE" color={accentBlue} />
            <span style:font-size="9px"
                  style:color={accentBlue}
                  style:font-family={CV4_MONO}
                  style:opacity="0.7"
                  style:letter-spacing="0.1em">
              EXAMPLE
            </span>
          </div>
          <p style:margin="0"
             style:font-size="11px"
             style:color="var(--cv-card-text-dim)"
             style:line-height="1.6"
             style:font-family={CV4_BODY}>
            {help.invoke}
          </p>
        </div>
      {/if}

      {#if help.compel}
        <div style:flex="1"
             style:padding="8px 10px"
             style:background="color-mix(in srgb,{accentRed} 8%,var(--cv-card-dark,var(--panel)))"
             style:border-left="3px solid {accentRed}"
             style:border-radius="0 2px 2px 0">
          <div style:display="flex" style:align-items="center" style:gap="5px" style:margin-bottom="4px">
            <CvLabel label="COMPEL" color={accentRed} />
            <span style:font-size="9px"
                  style:color={accentRed}
                  style:font-family={CV4_MONO}
                  style:opacity="0.7"
                  style:letter-spacing="0.1em">
              EXAMPLE
            </span>
          </div>
          <p style:margin="0"
             style:font-size="11px"
             style:color="var(--cv-card-text-dim)"
             style:line-height="1.6"
             style:font-family={CV4_BODY}>
            {help.compel}
          </p>
        </div>
      {/if}
    </div>
  {/if}
</div>
