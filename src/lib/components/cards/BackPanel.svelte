<script>
  let { genId = '', catColor = 'var(--fs-section)' } = $props();

  const CV4_HELP = {
    npc_minor: {
      srd_url: '/fate-condensed/being-game-master#npcs',
      what: 'A supporting character with one aspect, one peak skill, and one stress box.',
      when: 'Shopkeepers, witnesses, bystanders \u2014 anyone who has one scene and a name.',
      rule: 'No consequences \u2014 one solid hit takes them out. Use the aspect as a compel hook immediately. Never give a minor NPC a second stress box by mistake; that turns them into a major NPC.',
      mistakes: 'Don\u2019t over-invest in minor NPCs. If you\u2019re giving them a backstory, multiple skills, or consequences, they\u2019re a major NPC \u2014 promote them. The other common mistake is forgetting their weakness aspect exists; it\u2019s the best compel hook on the table.',
      pairs: 'Scene (gives context for the NPC\u2019s presence), Complication (the NPC triggers the mid-scene shift), Compel (use their weakness aspect).',
      invoke: 'A PC with Athletics needs to leap a rooftop. The guard\u2019s aspect is \u201cAlways Watching the Exits\u201d. Invoke it as an obstacle \u2014 they spotted the PC\u2019s route, adding passive opposition.',
      compel: 'The informant\u2019s weakness is \u201cDesperate for Coin\u201d. Compel it: someone offers them money mid-scene and they hesitate just long enough to blow the party\u2019s cover.',
    },
    npc_major: {
      srd_url: '/fate-condensed/being-game-master#npcs',
      what: 'A full character: skill pyramid, stunts, dual stress tracks, and a complete aspect suite.',
      when: 'Recurring antagonists, key allies, anyone who survives a conflict and returns.',
      rule: 'Refresh = free invokes they can spend against the party. High Concept and Trouble are the most compellable aspects. Consequence recovery requires a treatment roll before timing starts.',
      mistakes: 'Don\u2019t forget to spend their fate points. Major NPCs earn and spend FP just like PCs \u2014 compel their own aspects to give them FP, then invoke against the party. The other trap is making them too skilled; a +5 peak against a party of +3s feels unfair. Match them to the party\u2019s tier.',
      pairs: 'Encounter (the NPC is the primary opposition), Faction (they\u2019re the face of the faction), Consequence (track their injuries between scenes).',
      invoke: 'The warlord\u2019s High Concept is \u201cFeared Across Three Territories\u201d. Invoke it on a Provoke roll to intimidate the PC into backing down without combat \u2014 +2 or a reroll.',
      compel: 'The same warlord\u2019s Trouble is \u201cI Never Forgive a Debt\u201d. Compel it when a PC who once helped them asks a favour \u2014 the warlord has to honour it, even when it costs them.',
    },
    faction: {
      srd_url: '/fate-system-toolkit/factions',
      what: 'An organisation with a goal, method, structural weakness, and a human face.',
      when: 'Between sessions or when players ask who is behind something.',
      rule: 'Goal + Method = two sides of one faction aspect. The Face is the person the PCs deal with. The Weakness is how the faction can be disrupted without direct confrontation.',
      mistakes: 'Don\u2019t make factions monolithic. If every member thinks and acts the same way, there\u2019s nothing to compel. Internal disagreement \u2014 between the Face and the leadership, between chapters \u2014 is where drama lives. Also: the Weakness should be exploitable without violence.',
      pairs: 'Major NPC (the face gets a full sheet), Campaign (the faction drives a current or impending issue), Encounter (faction agents as opposition).',
      invoke: 'The faction\u2019s aspect is \u201cResources Flow Upward, Never Down\u201d. Invoke it when they bribe a checkpoint: the bribe gets through because the faction\u2019s money is everywhere.',
      compel: 'The same faction aspect means a local chapter is starved of supplies. Compel it: a faction lieutenant asks the PCs to help, because they can\u2019t ask headquarters without losing face.',
    },
    scene: {
      srd_url: '/fate-condensed/aspects-and-fate-points#situation-aspects',
      what: 'Situation aspects and zones that make a location mechanically and dramatically alive.',
      when: 'Before any scene where action is likely. Use framing questions to decide if the scene is worth playing.',
      rule: 'Scene aspects last until the fiction changes them. Free invokes reset each scene. Zones control movement \u2014 free movement to adjacent zones, overcome roll if impeded. 2\u20134 zones is ideal for most conflicts.',
      mistakes: 'Don\u2019t create scenes without aspects. A bare room with no scene aspects is a missed opportunity \u2014 every scene should have at least one aspect the players can invoke or be compelled by. Also: if you can\u2019t answer \u201cwhat\u2019s at stake?\u201d in one sentence, the scene isn\u2019t focused enough. Skip it or tighten it.',
      pairs: 'Encounter (combat in this location), Obstacle (environmental hazard in a zone), Complication (aspect changes mid-scene).',
      invoke: 'The scene aspect is \u201cChoking Dust Storm Closing In\u201d. A PC uses its free invoke on a Notice roll to spot the enemy before visibility drops to zero.',
      compel: 'The same aspect: compel it mid-fight to cut off a PC\u2019s escape route. The storm arrived early and the exit zone is now impassable \u2014 here\u2019s a Fate point.',
    },
    campaign: {
      srd_url: '/fate-condensed/getting-started#define-your-setting',
      what: 'A current issue, an impending threat, and setting aspects defining what kind of world this is.',
      when: 'Session zero, between arcs, or when the table needs a shared frame to pull against.',
      rule: 'Current issue = what is already on fire. Impending = what happens if they do not act. Both are aspects. Use them every session or they disappear from the fiction.',
      mistakes: 'Don\u2019t make the impending issue too distant. If it never feels urgent, it\u2019s not impending \u2014 it\u2019s scenery. Every 2\u20133 sessions, the impending issue should create a concrete consequence the players can see. The current issue should be referenced in every session \u2014 if it\u2019s not, replace it.',
      pairs: 'Faction (who drives the current issue?), Seed (a one-shot adventure within the campaign frame), Countdown (the impending issue has a ticking clock).',
      invoke: 'The current issue is \u201cThe Water Rights War Is Already Being Fought\u201d. Invoke it when the PCs need to explain why every faction is armed \u2014 free narrative permission.',
      compel: 'The impending issue is \u201cThe Rail Company Arrives in Sixty Days\u201d. Compel it: the company\u2019s advance scouts are already in town, asking questions, and they\u2019ve noticed the PCs.',
    },
    encounter: {
      srd_url: '/fate-condensed/challenges-conflicts-and-contests#conflicts',
      what: 'A full conflict setup: opposition, zones, stakes, twist, and starting GM fate points.',
      when: 'Any scene with direct opposition. The twist fires mid-conflict, not in the first exchange.',
      rule: 'GM starts with 1 FP per PC. Always state victory and defeat conditions before the first roll. The twist is optional but keeps mid-conflict interesting.',
      mistakes: 'Don\u2019t start a conflict without declaring the stakes. \u201cWhat happens if you win? What if you lose?\u201d must be answered before the first dice roll. Without stakes, combat is a grind. Also: don\u2019t forget concessions \u2014 let NPCs offer to surrender or flee when they\u2019re losing.',
      pairs: 'Scene (the location and its zones), Major NPC (the primary antagonist), Countdown (the conflict has a deadline).',
      invoke: 'Spend a GM fate point to invoke the encounter aspect \u201cNarrow Corridors, No Flanking\u201d against a PC\u2019s Fight attack: the tight space negates their advantage.',
      compel: 'A PC\u2019s trouble is relevant: they\u2019re \u201cKnown in Every Town\u201d. Compel it \u2014 a guard recognises them the moment they walk in and sounds the alarm.',
    },
    seed: {
      srd_url: '/fate-condensed/getting-started',
      what: 'A 3-scene skeleton: opening, complication, climax. Drop-in ready for one session.',
      when: 'Session prep, unexpected cancellations, or when you need something playable in minutes.',
      rule: 'Do not add more scenes. The 3-scene constraint is the design \u2014 it forces focus. Each scene should answer a question: \u201cwhat\u2019s the situation?\u201d, \u201cwhat went wrong?\u201d, and \u201chow does it end?\u201d',
      mistakes: 'Don\u2019t over-prepare. The seed gives you three beats \u2014 let the players fill in the gaps. If you script transitions between scenes, you\u2019re writing a railroad. Let the players\u2019 choices determine how they get from scene 1 to scene 2.',
      pairs: 'Scene (flesh out a key location), Encounter (the climax fight), Compel (the complication scene).',
      invoke: 'The seed\u2019s situation aspect is \u201cOld Debts Come Due Tonight\u201d. Invoke it in the opening scene to establish why the NPC called the PCs specifically \u2014 free context, no roll needed.',
      compel: 'The same aspect in the climax: compel a PC whose trouble relates to owing favours. They can\u2019t refuse the call for help, even though they know it\u2019s a trap.',
    },
    compel: {
      srd_url: '/fate-condensed/aspects-and-fate-points#compels',
      what: 'A situation where an aspect makes things worse in exchange for a Fate point.',
      when: 'When a player aspect is relevant and making life harder would be more interesting than making it easier.',
      rule: 'Event compels happen to the character. Decision compels require a hard choice. Player refuses by spending 1 FP. Compels should create drama, not punishment.',
      mistakes: 'Don\u2019t use compels as gotchas. A compel should feel like \u201cof course that would happen\u201d, not \u201cyou didn\u2019t see this coming.\u201d Also: don\u2019t compel the same aspect every scene \u2014 rotate through all five. If a Trouble never gets compelled, it\u2019s not a real Trouble.',
      pairs: 'Consequence (a consequence aspect gets compelled), Campaign (the current issue compels a PC), Encounter (mid-fight compels change the tactical picture).',
      invoke: 'Not applicable \u2014 a Compel is itself the activation of an aspect. If a player refuses, that costs them 1 FP. The GM gains nothing from invoking vs. compelling the same aspect.',
      compel: 'A PC\u2019s trouble is \u201cI Always Finish What I Start\u201d. Event compel: the building is on fire and the target escaped, but the evidence is still inside. Here\u2019s a Fate point \u2014 do you go in?',
    },
    challenge: {
      srd_url: '/fate-condensed/challenges-conflicts-and-contests#challenges',
      what: 'A series of overcome rolls where each result matters and changes the fiction independently.',
      when: 'Extended tasks where failure at multiple stages has independent consequences. Disarming a bomb while calming the crowd while hacking the console.',
      rule: 'Each roll succeeds, fails, or ties independently. Declare all stakes before the first roll. Aim for one task per character in the scene.',
      mistakes: 'Don\u2019t make a challenge where every roll uses the same skill \u2014 that\u2019s just a sequence of overcome actions, not a challenge. The whole point is different characters using different skills on different problems simultaneously. Also: a mix of successes and failures is the best outcome \u2014 total success is boring.',
      pairs: 'Countdown (the challenge has a deadline), Obstacle (one task involves bypassing an obstacle), Scene (the location creates the complications).',
      invoke: 'A PC rolls Crafts to repair the transmitter mid-challenge. Invoke the scene aspect \u201cPartially Flooded Engine Room\u201d for +2 on a creative approach: standing water conducts the signal.',
      compel: 'Mid-challenge, a PC\u2019s High Concept \u201cSelf-Taught Mechanic\u201d gets compelled: the procedure requires training they don\u2019t have. They can solve it \u2014 but it will take an extra roll and a cost.',
    },
    contest: {
      srd_url: '/fate-condensed/challenges-conflicts-and-contests#contests',
      what: 'Two sides competing for a goal, not fighting, but racing, arguing, or outmanoeuvring.',
      when: 'Chases, debates, political manoeuvring, escape sequences \u2014 any time the question is \u201cdo I X before they Y?\u201d',
      rule: 'Both sides roll every exchange. Three victories wins (default). On a tie, neither side scores \u2014 the GM introduces a new situation aspect or unexpected twist. The loser earns a Fate point.',
      mistakes: 'Don\u2019t let contests drag. If neither side is scoring, the twist on ties should escalate the situation \u2014 new NPCs, environmental shifts, time pressure. Also: don\u2019t forget that creating advantages is allowed alongside the contest roll. Aspect stacking is how you win.',
      pairs: 'Scene (the terrain affects the contest), Complication (mid-contest twist), Countdown (the contest has a hard deadline).',
      invoke: 'A PC is one victory from winning the debate. Invoke their aspect \u201cI\u2019ve Read Every Document in This Archive\u201d for +2 on the final Academics roll.',
      compel: 'The PC is ahead in a footchase but their trouble is \u201cI Never Leave Anyone Behind\u201d. Compel it: an ally just tripped. Do they keep running or stop? Here\u2019s a Fate point.',
    },
    consequence: {
      srd_url: '/fate-condensed/challenges-conflicts-and-contests#taking-harm',
      what: 'An aspect a character takes to absorb a hit instead of being taken out.',
      when: 'When stress will not cover the overflow and the player wants to stay in the scene.',
      rule: 'Mild = 2 shifts absorbed. Moderate = 4. Severe = 6. Recovery needs a treatment overcome roll first: Fair (+2) for mild, Great (+4) for moderate, Fantastic (+6) for severe. Add +2 if treating yourself.',
      mistakes: 'Don\u2019t let consequences be passive. A consequence is an aspect \u2014 it should be invoked and compelled in subsequent scenes. \u201cBroken Arm\u201d isn\u2019t just flavour text; it\u2019s a +2 for anyone who invokes it against the character. Also: don\u2019t forget that recovery has two steps \u2014 the treatment roll, then the time.',
      pairs: 'Encounter (where consequences are taken), Compel (the consequence aspect gets compelled later), Major NPC (track NPC consequences too).',
      invoke: 'The PC took a Mild consequence: \u201cKnocked Around\u201d. In the next scene, an enemy invokes it for +2 on a Provoke roll \u2014 battered people are easier to intimidate.',
      compel: 'Same consequence: compel it when the PC tries to climb a wall. \u201cYou\u2019re knocked around \u2014 the GM offers a Fate point. You can make the climb but you\u2019ll worsen the injury.\u201d',
    },
    complication: {
      srd_url: '/fate-condensed/aspects-and-fate-points#situation-aspects',
      what: 'A new aspect that enters the scene and makes everything harder.',
      when: 'End of a scene that resolved too cleanly, or when a scene needs a second wind.',
      rule: 'Complications arrive with at least one free invoke. Remove them only when the fiction justifies it.',
      mistakes: 'Don\u2019t use complications as punishment for player success. They work best as \u201cyes, but\u201d \u2014 the players succeeded, and now something new is true. A complication should open a new problem, not undo the old victory.',
      pairs: 'Scene (the complication changes a zone or aspect), Contest (mid-race twist), Encounter (reinforcements, environment shift).',
      invoke: 'The complication \u201cReinforcements Called In\u201d arrives with one free invoke. Use it on the new NPCs\u2019 first action in the exchange \u2014 they arrived coordinated and ready.',
      compel: 'The complication is \u201cThe Safe House Is Compromised\u201d. Compel it when a PC tries to retreat there: they arrive and walk straight into an ambush. Fate point offered.',
    },
    pc: {
      srd_url: '/fate-condensed/getting-started#create-your-characters',
      what: 'A complete Fate Condensed player character: 5 aspects, full skill pyramid, 3 stunts, stress tracks, and session zero questions.',
      when: 'Session zero, one-shots, or when a player needs an instant character. Generate 3\u20134, let players pick and customise.',
      rule: 'Skill pyramid: 1\u00d7+4, 2\u00d7+3, 3\u00d7+2, 4\u00d7+1. Refresh 3 with 3 free stunts. Physique/Will determine stress track length. All 3 consequence slots always open at creation.',
      mistakes: 'Don\u2019t hand a generated PC to a player as-is. These are starting points \u2014 players should rename aspects, swap skills, and rewrite stunts. A PC that feels like yours is a PC you\u2019ll advocate for. Also: make sure every PC has at least one aspect that connects them to another PC.',
      pairs: 'Backstory (generates session zero questions), Campaign (aspects should reference the current or impending issue), Seed (instant one-shot: 3 PCs + 1 seed = playable in minutes).',
      invoke: 'A PC\u2019s High Concept is \u201cVault-Born Archivist on First Surface Mission\u201d. Invoke it when they recall pre-war technical schematics \u2014 +2 on Lore, and the fiction earns it.',
      compel: 'The same PC\u2019s Trouble is \u201cThe Map In My Head Has Never Been Wrong Before\u201d. Compel it when the map is wrong: they trusted it too long and now they\u2019re deep in hostile territory.',
    },
    backstory: {
      srd_url: '/fate-condensed/getting-started#create-your-characters',
      what: 'Targeted questions that build a character history and create hooks into the campaign.',
      when: 'Session zero, or when a new player joins and needs weaving into the party.',
      rule: 'Every answer should name another PC or NPC and leave something unresolved. Hooks are invitations, never mandates.',
      mistakes: 'Don\u2019t let backstory answers exist in isolation. If a player says \u201cI grew up in the ruins\u201d, ask \u201cwho did you grow up with, and what happened to them?\u201d Every backstory fact should connect to at least one other character and create at least one open question.',
      pairs: 'PC (the backstory belongs to this character), Campaign (backstory should reference setting aspects), Faction (the character has a relationship with a faction).',
      invoke: 'A backstory established that the PC \u201cOwes the Settlement That Patched Them Up\u201d. Turn it into an aspect and invoke it when the settlement sends a messenger \u2014 the PC\u2019s history opens a door.',
      compel: 'The same aspect: compel it when the settlement asks for something dangerous. \u201cYou owe them. Here\u2019s a Fate point if you agree even though it\u2019s a terrible idea.\u201d',
    },
    obstacle: {
      srd_url: '/fate-condensed/optional-rules#obstacles',
      what: 'A passive threat that opposes the party without taking an action each exchange.',
      when: 'Environmental dangers, barriers, conditions. Anything that resists without acting in the conflict.',
      rule: 'Obstacles do not act in a conflict. Passive opposition = their rating. Disable by overcoming at rating + 2. Types: blocks (prevent action), hazards (deal stress), distractions (demand attention).',
      mistakes: 'Don\u2019t give obstacles turns. They\u2019re passive \u2014 they just exist. A locked door doesn\u2019t attack, but it\u2019s Great (+4) opposition to anyone trying to get through it. Also: don\u2019t use obstacles as substitutes for NPCs. If the threat can think and adapt, it\u2019s an NPC.',
      pairs: 'Scene (the obstacle exists in a zone), Encounter (obstacles alongside NPCs make richer conflicts), Challenge (overcoming the obstacle is one task in the challenge).',
      invoke: 'The obstacle aspect is \u201cFloodwater Rising Fast\u201d. Invoke it against a PC\u2019s Athletics roll to cross: the water\u2019s current is now actively opposing them, not just a difficulty number.',
      compel: 'The same obstacle: compel a PC whose trouble is \u201cI Can\u2019t Leave Anyone Behind\u201d. The water is rising and someone\u2019s stuck. Do they go back? Fate point on the table.',
    },
    countdown: {
      srd_url: '/fate-condensed/optional-rules#countdowns',
      what: 'A ticking clock that creates urgency without requiring direct opposition.',
      when: 'Whenever players risk losing momentum, or a threat has a natural deadline.',
      rule: 'Fill one box per trigger. The last box fires the outcome, no roll, no negotiation. Show the track openly \u2014 hidden countdowns feel unfair.',
      mistakes: 'Don\u2019t make the trigger too frequent or too rare. If a box fills every exchange, the countdown is just a timer \u2014 boring. If it only fills on specific player actions, they\u2019ll just avoid the trigger. The best triggers are things that happen as a natural consequence of play: \u201ceach time the alarm is tripped\u201d, \u201ceach scene that passes.\u201d',
      pairs: 'Encounter (the countdown fires during the conflict), Campaign (the impending issue has a countdown), Constraint (the countdown enforces the constraint\u2019s deadline).',
      invoke: 'The countdown aspect is \u201cThe Convoy Reaches the Border in Four Hours\u201d. Invoke it when a PC is stalling \u2014 it\u2019s a reminder the clock is an aspect with mechanical weight.',
      compel: 'Two boxes left. Compel a PC\u2019s trouble to fill one now: their impulsive action triggered the next stage early. Fate point, and the clock ticks forward.',
    },
    constraint: {
      srd_url: '/fate-adversary-toolkit/constraints',
      what: 'A limitation that forces the party to change their approach rather than roll higher.',
      when: 'When the obvious solution is too easy, or a scene needs tactical texture without more enemies.',
      rule: 'Constraints do not deal stress, they change the rules. Bypass requires specific fiction, not a high roll. The party must find a different approach.',
      mistakes: 'Don\u2019t make constraints unbypassable. The whole point is that the players find a creative workaround \u2014 if there\u2019s no bypass, it\u2019s just a wall. Also: don\u2019t stack too many constraints in one scene. One is interesting, two is tactical, three is frustrating.',
      pairs: 'Scene (the constraint is a property of the location), Obstacle (the constraint limits approach to the obstacle), Challenge (one task in the challenge is finding the bypass).',
      invoke: 'The constraint is \u201cNo Weapons Inside the Negotiation Chamber\u201d. Invoke it on a Contacts roll to establish that a PC has a contact who can smuggle one in \u2014 using the rule as the hook.',
      compel: 'Same constraint. A PC goes for their weapon anyway \u2014 compel their impulsive trouble. Guards move. The room goes hostile. Fate point, and the negotiation just became a conflict.',
    },
    custom: {
      srd_url: null,
      what: 'A blank card you fill in yourself \u2014 title, type, and notes all editable in place.',
      when: 'Any time the generators produce something close but not quite right, or you need to capture an improvised NPC, location, aspect, or clue right now.',
      rule: 'Click the title or notes to edit. Tap the type pill to cycle: Aspect \u2192 NPC \u2192 Location \u2192 Clue \u2192 Other. The type tints the card accent colour for quick visual scanning.',
      mistakes: 'Don\u2019t forget custom cards exist. Mid-session improvisation is where the best content comes from \u2014 an NPC you named on the spot, a location detail that got a reaction, a clue you didn\u2019t plan. Capture it as a custom card so it persists on the canvas.',
      pairs: 'Any generator \u2014 custom cards supplement generated content with your own improvised material. Particularly useful alongside Scene (capture a detail) and Major NPC (quick stat block for an improvised character).',
      invoke: 'You improvised an NPC mid-scene and named them. Create a custom card with type NPC, write their aspect and peak skill in the notes. Now it\u2019s a real card you can invoke from.',
      compel: 'You noted a location detail as a custom Aspect card: \u201cThe Chandelier Is Hanging by One Chain.\u201d Compel it against the most reckless PC \u2014 they notice it, and they have an idea.',
    },
  };

  let help = $derived(CV4_HELP[genId] || { what: '', when: '', rule: '', invoke: '', compel: '' });
</script>

<div style="display:flex; flex-direction:column; gap:10px">

  <!-- What / When -->
  <div style="display:flex; gap:12px">
    <div style="flex:1">
      <div class="fs-section-hdr">WHAT IT GENERATES</div>
      <p style="margin:0; font-size:12px; color:var(--fs-text-dim); line-height:1.65">{help.what}</p>
    </div>
    <div style="flex:1">
      <div class="fs-section-hdr">WHEN TO USE IT</div>
      <p style="margin:0; font-size:12px; color:var(--fs-text-dim); line-height:1.65">{help.when}</p>
    </div>
  </div>

  <!-- Table rule -->
  <div class="fs-stunt" style="border-left:3px solid var(--fs-section); border-radius:0 3px 3px 0; padding:8px 12px">
    <div class="fs-stunt-name">TABLE RULE</div>
    <p style="margin:0 0 4px; font-size:12px; color:var(--fs-text-dim); line-height:1.7">{help.rule}</p>
    {#if help.srd_url}
      <a href="https://fate-srd.com{help.srd_url}"
         style="font-size:10px; font-weight:700; color:var(--fs-section); opacity:0.8; text-decoration:none; letter-spacing:0.06em; display:inline-flex; align-items:center; gap:3px"
         target="_blank" rel="noreferrer noopener"
         aria-label="Read on the Fate SRD (opens in new tab)"
      >SRD <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px"></i></a>
    {/if}
  </div>

  <!-- Common mistakes -->
  {#if help.mistakes}
    <div class="fs-stunt" style="border-left:3px solid #c62828; border-radius:0 3px 3px 0; padding:8px 12px">
      <div class="fs-stunt-name" style="color:#c62828"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true" style="font-size:10px"></i> COMMON MISTAKES</div>
      <p style="margin:0; font-size:12px; color:var(--fs-text-dim); line-height:1.7">{help.mistakes}</p>
    </div>
  {/if}

  <!-- Pairs well with -->
  {#if help.pairs}
    <div class="fs-stunt" style="border-left:3px solid #2e7d32; border-radius:0 3px 3px 0; padding:8px 12px">
      <div class="fs-stunt-name" style="color:#2e7d32"><i class="fa-solid fa-link" aria-hidden="true" style="font-size:10px"></i> PAIRS WELL WITH</div>
      <p style="margin:0; font-size:12px; color:var(--fs-text-dim); line-height:1.7">{help.pairs}</p>
    </div>
  {/if}

  <!-- Invoke + Compel examples -->
  {#if help.invoke || help.compel}
    <div style="display:flex; gap:8px">
      {#if help.invoke}
        <div class="fs-stunt" style="flex:1; border-left:3px solid #1565c0; border-radius:0 3px 3px 0">
          <div style="display:flex; align-items:center; gap:5px; margin-bottom:4px">
            <span class="fs-stunt-name" style="color:#1565c0; margin-bottom:0">INVOKE</span>
            <span style="font-size:9px; color:#1565c0; opacity:0.7; letter-spacing:0.1em">EXAMPLE</span>
          </div>
          <p style="margin:0; font-size:12px; color:var(--fs-text-dim); line-height:1.6">{help.invoke}</p>
        </div>
      {/if}

      {#if help.compel}
        <div class="fs-stunt" style="flex:1; border-left:3px solid #c62828; border-radius:0 3px 3px 0">
          <div style="display:flex; align-items:center; gap:5px; margin-bottom:4px">
            <span class="fs-stunt-name" style="color:#c62828; margin-bottom:0">COMPEL</span>
            <span style="font-size:9px; color:#c62828; opacity:0.7; letter-spacing:0.1em">EXAMPLE</span>
          </div>
          <p style="margin:0; font-size:12px; color:var(--fs-text-dim); line-height:1.6">{help.compel}</p>
        </div>
      {/if}
    </div>
  {/if}
</div>
