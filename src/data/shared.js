// data/shared.js
// Shared constants: GENERATORS, GENERATOR_GROUPS, HELP_CONTENT, HELP_ENTRIES,
// SKILL_LABEL, ALL_SKILLS.
// Also declares the CAMPAIGNS object that campaign files populate.
// Must be loaded before any data/[campaign].js file.

// Re-export merged CAMPAIGNS from the campaign registry
export { CAMPAIGNS } from './index.js';

export const GENERATORS = [
  {id:"npc_minor",  label:"Minor NPC",       icon:"fa-user", sub:"1–2 aspects · skills · stress"},
  {id:"npc_major",  label:"Major NPC",        icon:"fa-crown", sub:"5 aspects · skill pyramid · stunts"},
  {id:"scene",      label:"Scene Setup",      icon:"fa-fire", sub:"Situation aspects · zones"},
  {id:"campaign",   label:"Campaign Frame",  icon:"fa-globe", sub:"Current + impending + setting"},
  {id:"encounter",  label:"Encounter",        icon:"fa-burst", sub:"Opposition · stakes · twist"},
  {id:"seed",       label:"Adventure Seed",   icon:"fa-seedling", sub:"3-scene skeleton · opposition · stakes · twist"},
  {id:"compel",     label:"Compel",     icon:"fa-rotate-left", sub:"Aspect situation · consequence · GM tip"},
  {id:"challenge",  label:"Challenge",        icon:"fa-bullseye", sub:"Series of overcome rolls · stakes · success/failure"},
  {id:"contest",    label:"Contest",          icon:"fa-trophy", sub:"Opposed exchanges · victory track · twist on tie"},
  {id:"consequence", label:"Consequence",     icon:"fa-bolt", sub:"Mild · moderate · severe · compel hook"},
  {id:"faction",     label:"Faction",         icon:"fa-flag", sub:"Name · goal · method · weakness · face"},
  {id:"complication",label:"Complication", icon:"fa-triangle-exclamation", sub:"New aspect · arrival · environment shift"},
  {id:"pc",          label:"Player Character", icon:"fa-star",      sub:"5 aspects · skill pyramid · stunts · refresh 3"},
  {id:"backstory",   label:"PC Backstory",    icon:"fa-masks-theater", sub:"Session Zero questions · relationship web · hook"},
  {id:"stunt",       label:"Stunt",           icon:"fa-wand-magic-sparkles", sub:"Campaign stunt · skill · type"},
  {id:"obstacle",    label:"Obstacle",        icon:"fa-shield-halved", sub:"Hazard · block · distraction - not an enemy"},
  {id:"countdown",   label:"Countdown",       icon:"fa-clock", sub:"Track · trigger · outcome - pacing pressure"},
  {id:"constraint",  label:"Constraint",      icon:"fa-lock", sub:"Limitation or resistance - forces Plan B"},
];

export const GENERATOR_GROUPS = [
  {id:"people",    label:"People",    icon:"fa-users", gens:["npc_minor","npc_major","pc","backstory"]},
  {id:"scene",     label:"Scene",     icon:"fa-clapperboard", gens:["scene","encounter","complication"]},
  {id:"story",     label:"Story",     icon:"fa-earth-americas", gens:["seed","campaign","faction"]},
  {id:"mechanics", label:"Mechanics", icon:"fa-gears",  gens:["compel","consequence","challenge","contest","obstacle","countdown","constraint"]},
];



export const HELP_CONTENT = {
  npc_minor: {
    title: "Minor NPC",
    what: "Nameless antagonists, hired muscle, and bystanders. They exist to be defeated, not survived.",
    output: "1–2 aspects (high concept + optional weakness), 1–2 skills, occasional stunt, 1–3 stress boxes. No consequence slots.",
    rules: [
      "No consequence slots — one good hit takes them out.",
      "Optionally treat a mob as sharing one stress track. Default: 1–3 boxes each.",
      "Their weakness aspect is your best compel lever.",
      "Minor NPCs never concede — they break, flee, or get taken out.",
    ],
    rule_urls: ['/fate-condensed/being-game-master#npcs', '/fate-condensed/optional-rules#mobs', '/fate-condensed/aspects-and-fate-points#compels', null],
    gm_tips: [
      "PC rolls well? Narrate the defeat, skip the dice.",
      "One line of dialogue, one visible motivation. More is wasted prep.",
      "Invoke or compel the weakness in the first exchange.",
      "Treat a mob as one entity with a shared stress track."
    ],
    invoke_example: "The mook's aspect is 'Only Follows Orders.' A PC rushes past. Invoke for +2 on Athletics — someone following orders doesn't improvise.",
    compel_example: "The same mook stands guard. The GM offers a fate point: 'Only Follows Orders' fires — they sound the alarm before the PCs act.",
    beginner: {
      what: "A minor NPC is a simple GM-controlled character — a guard, a shopkeeper, a thug. Think of them as movie extras.",
      terms: [
        ["Aspect", "A short phrase about a character or scene, used for bonuses or complications."],
        ["Stress", "Boxes you check when hit. All checked means you're out."],
        ["Stunt", "A special ability: +2 in a narrow situation, or a once-per-scene exception."],
        ["Invoke", "Spend a fate point on a relevant aspect for +2 on your roll."],
        ["Compel", "The GM offers a fate point if you accept a complication from an aspect."],
      ],
    },
  },
  npc_major: {
    title: "Major NPC",
    what: "Villains, rivals, and mentors who drive the story and survive more than one scene.",
    output: "5 aspects (high concept, trouble, 3 others), skill pyramid, 2 stunts, full stress tracks + all three consequence slots, Refresh 3.",
    rules: [
      "Treat exactly like a PC — they concede, take consequences, and invoke aspects.",
      "Their trouble aspect is your primary compel lever.",
      "High concept = what they are. Trouble = what makes them dangerous and human.",
      "Major NPCs draw fate points from the GM pool (1 per PC).",
      "A major NPC who concedes escapes — and returns stronger.",
    ],
    rule_urls: ['/fate-condensed/being-game-master#npcs', '/fate-condensed/aspects-and-fate-points#compels', '/fate-condensed/being-game-master#npcs', '/fate-condensed/being-game-master#the-gms-fate-points', '/fate-condensed/conflicts#conceding'],
    gm_tips: [
      "Let them concede their first conflict. An escaped villain outweighs ten dead ones.",
      "Show the high concept in action before PCs engage.",
      "Invoke their high concept for +2 on their biggest roll."
    ],
    invoke_example: "The villain's high concept is 'Ruthless Veteran Who's Seen Everything.' Interrogating a prisoner, spend a fate point for +2 on Provoke — decades of experience make the pressure precise.",
    compel_example: "The villain has the party cornered. The GM offers a fate point on their trouble: 'Can't Let Go of the Old Code.' They hesitate. The party escapes.",
    beginner: {
      what: "A major NPC is a fully-detailed GM-controlled character — a villain, rival, or powerful ally. Built just like a PC.",
      terms: [
        ["High Concept", "One phrase capturing who they are."],
        ["Trouble", "What complicates their life — and what players can exploit."],
        ["Refresh", "Fate points per session. Default 3, reduced by extra stunts."],
        ["Concede", "Leave the scene instead of being taken out. They survive and return."],
        ["Skill Pyramid", "Skills ranked in pyramid shape: one highest, two next, three below."],
      ],
    },
  },
  scene: {
    title: "Scene Setup",
    what: "Situation aspects for any scene — combat, social, exploration, standoffs, or chases.",
    output: "3–5 tagged situation aspects (tone, movement, cover, danger, usable) plus 2–4 named zones with their own aspects.",
    rules: [
      "Situation aspects persist until overcome or the scene ends.",
      "Anyone can invoke them for +2 or a reroll. GMs can compel them.",
      "🎲 Free invoke on an aspect = pre-placed for discovery. In play, free invokes come from Create Advantage.",
      "Zones limit movement. Moving past opposition costs an action.",
      "Zone aspects are always true. Invoke for +2 with a fate point.",

      "Create Advantage tie (FCon p.19): aspect created, NO free invoke. Spend a fate point to invoke, or bank it.",
    ],
    rule_urls: ['/fate-condensed/aspects-and-fate-points#situation-aspects', '/fate-condensed/aspects-and-fate-points#situation-aspects', '/fate-condensed/aspects-and-fate-points#situation-aspects', '/fate-condensed/challenges-conflicts-and-contests#zones', '/fate-condensed/challenges-conflicts-and-contests#zones'],
    gm_tips: [
      "Announce two aspects up front. The rest get discovered through Notice, Investigate, or getting hit.",
      "Decide which aspect is hidden before the scene starts — it's your compel setup.",
      "When a PC fails, check whether a scene aspect worsened or a new one appeared.",
      "Name each zone and give it one aspect. Players will exploit them — that's the point."
    ],
    invoke_example: "The scene has 'Slippery Deck' as a zone aspect. A PC chases someone across the boat. Invoke for +2 on Athletics — the target loses their footing.",
    compel_example: "'Slippery Deck' is in play when a PC takes a precise shot. The GM offers a fate point: the PC slips as they fire and the shot goes wide.",
    beginner: {
      what: "This generates the setup for a scene — situation aspects describing the environment and zones characters move between. The GM describes the room before the action starts.",
      terms: [
        ["Situation Aspect", "A true phrase about the scene anyone can use for bonuses or complications."],
        ["Zone", "A distinct area within the scene. Moving between zones can cost an action."],
        ["Free Invoke", "A one-time +2 bonus from discovering or creating an aspect. No fate point needed."],
      ],
    },
  },
  campaign: {
    title: "Campaign Frame",
    what: "Macro-level threats and permanent truths that define your campaign world. Your session-to-session compel engine.",
    output: "1 current issue (immediate, active threat), 1 impending issue (building pressure), 3 setting aspects (permanent world truths).",
    rules: [
      "Current issues are happening NOW — they create compel pressure every session.",
      "Impending issues become current if the party ignores them.",
      "Setting aspects are always true, always invokable, permanent.",
      "Issues have faces (named NPCs) and places — ready-made scene hooks.",
      "Compel an issue aspect whenever a PC's goals conflict with the larger threat.",
    ],
    rule_urls: ['/fate-condensed/getting-started#define-your-setting', '/fate-condensed/getting-started#define-your-setting', '/fate-condensed/getting-started#define-your-setting', '/fate-condensed/getting-started#define-your-setting', '/fate-condensed/getting-started#define-your-setting'],
    gm_tips: [
      "The current issue is your automatic compel engine. Every PC goal that bumps against it yields a compel.",
      "The impending issue is a clock. Advance it visibly between sessions when ignored.",
      "Setting aspects are permanent pressure — always true, always invokable, always compellable.",
      "Each session, decide what one face did off-screen. Show the consequences."
    ],
    invoke_example: "The setting aspect is 'Everyone Here Has Lost Something.' A PC negotiates with a reluctant contact. Invoke for +2 on Rapport — shared loss builds trust fast.",
    compel_example: "A PC tries to stay low-profile, but the current issue is 'The Authority Is Tightening Its Grip.' The GM offers a fate point: a patrol appears on their route.",
    beginner: {
      what: "This generates the big-picture setup for your game world — major problems, looming threats, and permanent truths. The backdrop that makes every scene matter.",
      terms: [
        ["Current Issue", "A problem happening NOW that creates pressure every session."],
        ["Impending Issue", "A building problem. Ignored, it becomes the next current issue."],
        ["Setting Aspect", "A permanent truth about the world — always true, always usable."],
        ["Face", "A named NPC who represents an issue or faction. Makes abstract problems personal."],
      ],
    },
  },
  encounter: {
    title: "Encounter",
    what: "Full conflict setup — framing, opposition, stakes, and a twist. Works for combat, chases, social confrontations, and dramatic scenes.",
    output: "Situation aspects, zones, mixed opposition (minor + possibly major NPC), GM fate points, victory/defeat conditions, mid-scene twist.",
    rules: [
      "GM fate points = number of PCs. Your entire compel budget for the scene.",
      "Spend fate points to compel PC aspects or invoke for NPCs. Stunts activate automatically — no cost.",
      "State victory/defeat conditions BEFORE the first roll.",
      "Popcorn initiative (p.31): after acting, pass initiative to anyone who hasn't gone yet.",
      "The twist is a mid-encounter complication. Drop it when the outcome feels settled.",
      "On a failed roll, offer success at a minor or major cost. Never just say no.",
      "Conceding (p.37): before being taken out, anyone can concede. They exit and earn 1 FP per consequence taken.",
      "Full Defense (p.48): skip your action, get +2 to all defends this round.",
      "Teamwork (p.32): one rolls, each helper with Average (+1)+ adds +1.",

      "Create Advantage tie (FCon p.19): aspect created, NO free invoke. Spend a fate point to invoke, or bank it.",
    ],
    rule_urls: ['/fate-condensed/being-game-master#the-gms-fate-points', '/fate-condensed/being-game-master#the-gms-fate-points', null, '/fate-condensed/challenges-conflicts-and-contests#turn-order', null, null, '/fate-condensed/conflicts#conceding', '/fate-condensed/optional-rules#full-defense', '/fate-condensed/challenges-conflicts-and-contests#teamwork'],
    gm_tips: [
      "Your first sentence is the victory condition — say it aloud before any dice roll.",
      "GM fate points: 1 per PC. That's your entire budget. Spend deliberately.",
      "Hold the twist until the outcome feels settled.",
      "Offer success at a cost before flat failure.",
      "Popcorn initiative: whoever just acted names who goes next."
    ],
    invoke_example: "The scene aspect is 'Emergency Lights Only - Red and Wrong.' An NPC flees. Spend a GM fate point to invoke against the chasing PC's Notice: −2, strobing red destroys depth perception.",
    compel_example: "A PC has 'I Always Check the Exits.' The encounter starts with blocked exits. The GM offers a fate point: the PC spends the first exchange assessing escape routes instead of fighting.",
    beginner: {
      what: "This generates a complete fight, chase, or confrontation — enemies, environment, victory conditions, and a twist for when things get predictable.",
      terms: [
        ["Opposition", "The enemies or obstacles players face. Minor NPCs fall fast; major NPCs fight back hard."],
        ["Victory Condition", "What 'winning' looks like — not always killing enemies."],
        ["Defeat Condition", "What happens if the players lose. Makes stakes real."],
        ["GM Fate Points", "The GM's budget for the scene. Equal to the number of players."],
        ["Twist", "A mid-scene surprise that changes the situation when things feel settled."],
      ],
    },
  },
  seed: {
    gm_tips: [
      "Your literal first words at the table are Scene 1's opening description. Read it exactly. No preamble — drop them straight in.",
      "Prep Scene 1 thoroughly. Prep nothing else. The complication and Scene 2 emerge from where the players go.",
      "The complication is your mid-session hand grenade — something that demands a PC response without dictating what it should be.",
      "Know the defeat condition cold before you start. It creates the stakes that make the victory condition matter.",
      "The three-scene structure is a suggestion, not a script. Good sessions are messier and better than any outline."
    ],
    title:"Adventure Seed",
    what: "A one-page scenario skeleton — location, objective, complication, three-scene structure, opposition, and victory/defeat conditions. Everything for a session from a standing start.",
    output: "Location · Objective · Complication · Scene 1 opening · Scene 2 midpoint · Scene 3 climax · Opposition · Victory/Defeat conditions · Twist · Campaign issue tie-in",
    rules: [
      "State the victory condition before the first roll.",
      "The defeat condition gives the stakes real weight.",
      "Scene 1 is a framing tool. Run it as written, then follow the players.",
      "Drop the twist when the outcome feels settled — not at the start.",
      "Opposition follows the same rules as Encounter opposition.",
      "The three-scene structure is a suggestion, not a script.",
    ],
    rule_urls: [null, null, null, null, null, null],
    tips: [
      "The complication should force a choice, not just add an obstacle.",
      "Read the opening description as your literal first sentence.",
      "Prep Scene 1 and nothing else.",
    ],
    invoke_example: "The setting aspect is 'Nobody Asks Questions After Dark.' A PC bluffs past a guard. Invoke for +2 on Deceive — the guard doesn't want to know.",
    compel_example: "The complication is 'The Person Who Hired Them Is Already Dead.' A PC has 'I Never Walk Away from a Job.' The GM offers a fate point: the compel locks them into finishing despite every reason to leave.",
    beginner: {
      what: "This generates a complete one-session adventure — location, objective, complications, three scenes, and win/lose conditions. Run a game night from a standing start.",
      terms: [
        ["Adventure Seed", "A one-session scenario. Not a script — just enough structure to start playing."],
        ["Scene 1 / 2 / 3", "A three-scene arc: opening, midpoint, climax. Flexible, not rigid."],
        ["Complication", "Something that forces players to make a hard choice, not just an obstacle."],
        ["Opening Hook", "The GM's first sentence at the table. Sets the scene instantly."],
      ],
    },
  },
  compel: {
    title: "Compel",
    what: "A situation that triggers a PC aspect, a consequence if accepted, and fate point offer guidance.",
    output: "Situation description, consequence if accepted, and the fate point offer framing.",
    rules: [
      "Compels work on aspects — find one that creates genuine tension, not inconvenience.",
      "Offer the fate point before stating the consequence. Accept or pay 1 to refuse.",
      "The consequence should complicate the scene, not punish the character.",
      "Quick test: would the complication make the story better without the fate point? Yes = good compel.",
      "Refusal costs 1 FP. A drained player is primed to accept the next one.",
      "Players can compel their own aspects. The best self-compels surprise everyone.",
    ],
    rule_urls: ['/fate-condensed/aspects-and-fate-points#compels', '/fate-condensed/aspects-and-fate-points#compels', '/fate-condensed/aspects-and-fate-points#compels', '/fate-condensed/aspects-and-fate-points#compels', '/fate-condensed/aspects-and-fate-points#compels', '/fate-condensed/aspects-and-fate-points#compels'],
    gm_tips: [
      "Compel in Scene 1. It signals that fate points are moving.",
      "Offer the fate point first, then the complication. This order makes acceptance feel like agency.",
      "Two to three compels per session. If an hour passes without one, offer one now.",
      "Two refusals means you're targeting the right aspects.",
      "Compel the situation, not the character. 'This happens' beats 'you fail.'",

      "Self-compels are the gold standard. Reward player-initiated complications immediately.",
      "Compel consequence aspects only in scenes where they're already affecting the fiction.",
      "Scan aspect notes before each scene — one should be ready to fire.",
      "Compel chains work. One PC's compel triggers another PC's trouble — offer the second compel immediately.",
    ],
    invoke_example: "A PC has 'Loyalty to the Crew Above All.' They talk a neutral contact into helping. Invoke for +2 on Rapport — genuine commitment reads as trustworthy.",
    compel_example: "The same PC has intel the crew needs. But 'Every Exit Has Eyes' is in play. The GM offers a fate point: loyalty compels them to stay for a teammate still inside, walking through the surveillance zone.",
    beginner: {
      what: "A compel uses one of your character's aspects to create a complication. Accept the fate point and the complication happens; refuse by spending one instead. This is Fate's core drama engine.",
      terms: [
        ["Compel", "The GM offers a fate point tied to your aspect. You accept the complication or refuse."],
        ["Fate Point", "A token spent for +2 bonuses and earned by accepting compels."],
        ["Accept", "Take the fate point, accept the complication."],
        ["Refuse", "Spend a fate point to avoid the complication."],
      ],
    },
  
    dnd_notes: "D&D character flaws are optional flavor. In Fate, aspects are live mechanics. The GM offers a fate point and the player accepts the complication (gains FP) or refuses (spends FP). It is an economy, not a penalty.",
  },
  challenge: {
    title: "Challenge",
    what: "A structured non-combat problem requiring a series of overcome actions against fixed difficulties. A collective effort, not an opposed competition.",
    output: "Challenge name and description, primary skill(s), opposing force with difficulty, success and failure outcomes, campaign stakes.",
    rules: [
      "State the challenge type and primary skill before any roll.",
      "Opposing force difficulty: 2–4 standard, 5+ hard.",
      "Declare success AND failure outcomes before the first roll.",
      "Use Create Advantage to let players set up the decisive roll.",
      "Failure changes the situation. It's not a dead end.",
      "Place a free invoke on a scene aspect before starting — players remember gifts.",

      "Create Advantage tie (FCon p.19): aspect created, NO free invoke. Spend a fate point to invoke, or bank it.",
    ],
    rule_urls: ['/fate-condensed/challenges-conflicts-and-contests#challenges', null, '/fate-condensed/challenges-conflicts-and-contests#challenges', '/fate-condensed/challenges-conflicts-and-contests#challenges', '/fate-condensed/challenges-conflicts-and-contests#challenges', '/fate-condensed/challenges-conflicts-and-contests#challenges'],
    gm_tips: [
      "Use a challenge when one roll feels arbitrary but full conflict is overkill.",
      "Declare primary skill and difficulty before any dice touch the table.",
      "Let players Create Advantage before the decisive roll.",
      "Keep it to 3–5 rolls. Past five, tension deflates.",
      "Failure changes the situation — it never ends the scene.",

      "Different PCs should contribute different skills. Same skill for everyone is a montage, not a challenge.",
      "Declare failure conditions before rolling. Players trust challenges when failure changes the story.",
      "Mix success and failure. 3/5 successes yields richer fiction than 5/5.",
      "Make the decisive roll the last one. Earlier rolls narrow options for the finale.",
    ],
    invoke_example: "The challenge is breaking into a locked archive. A PC placed 'Guard Rotation on a Predictable Loop' via Create Advantage. Invoke for +2 on Burglary — the window is exactly where predicted.",
    compel_example: "Mid-challenge, a PC has 'My Tools Are Always Jury-Rigged.' The GM offers a fate point: critical equipment fails, raising the next roll's difficulty. Tension spikes.",
    beginner: {
      what: "A challenge is a structured problem taking several rolls to solve but isn't a fight. Multiple skills, multiple rolls, one goal.",
      terms: [
        ["Challenge", "A multi-roll problem using different skills. Success and failure both change the situation."],
        ["Overcome", "The action used in a challenge — getting past an obstacle or difficulty."],
        ["Difficulty", "A target number. Fair (+2) routine, Good (+3) hard, Great (+4) very hard."],
        ["Create Advantage", "Set up an aspect before the big roll for a free +2."],
      ],
    },
  
    dnd_notes: "D&D skill challenge uses rigid pass/fail math. Fate challenge: failure changes the situation rather than blocking the scene. Success at a Cost is always available. There is no 'the party failed the skill challenge.'",
  },
  contest: {
    title: "Contest",
    what: "Two or more sides in direct opposition, resolved exchange by exchange. First to 3 victories wins. Use for chases, races, debates, and any head-to-head competition without direct harm.",
    output: "Contest type and framing, both sides with primary skills, victory track (first to 3), twist pool for ties, situation aspects, and success/failure outcomes.",
    rules: [
      "Each exchange: one character per side overcomes. Allies add +1 (teamwork) or try Create Advantage.",
      "Highest effort marks a victory. Succeed with style (no one else did) = two victories.",
      "First to 3 wins. For longer contests, use up to 5.",
      "On a tie, NO ONE marks a victory. The GM introduces a new situation aspect instead.",
      "Creating Advantages is risky (p.33): failure forfeits your overcome roll OR gives the other side a free invoke.",
      "In dangerous environments, add a hazard aspect and compel normally.",
    ],
    rule_urls: ['/fate-condensed/challenges-conflicts-and-contests#contests', '/fate-condensed/challenges-conflicts-and-contests#contests', '/fate-condensed/challenges-conflicts-and-contests#contests', '/fate-condensed/challenges-conflicts-and-contests#contests', '/fate-condensed/challenges-conflicts-and-contests#contests', '/fate-condensed/challenges-conflicts-and-contests#contests'],
    gm_tips: [
      "Put the victory track on the table. The visible score is half the tension.",
      "Ties: immediately introduce a new situation aspect. Don't pause.",
      "Succeed with style = 2 victories. This is the swing moment.",
      "Creating Advantage costs your action for that exchange. A calculated gamble.",
      "The tie-twist is where session stories come from."
    ],
    invoke_example: "Chase tied 2–2. 'Gridlock Makes Every Route a Gamble' is in play. The pursuing PC invokes for +2 on Athletics — traffic slows the target. Victory 3. Chase over.",
    compel_example: "Chase at 1–2 against the party. A PC has 'Can't Pass Up a Score.' Running through a market, the GM offers a fate point: something valuable sits unattended. They hesitate. The target gains ground.",
    beginner: {
      what: "A contest is a race between two sides — each round, both roll. Higher roll scores a victory. First to 3 wins. Ties introduce twists instead.",
      terms: [
        ["Contest", "A head-to-head competition — chases, races, debates. Outperform, not harm."],
        ["Victory Track", "A visible scoreboard. First to 3 (or 5) wins."],
        ["Exchange", "One round. Both sides roll, highest wins."],
        ["Tie", "Nobody wins the round. The GM introduces a twist instead."],
      ],
    },
  },
  consequence: {
    gm_tips: [
      "Name it specifically — 'Badly Burned Hands,' not 'Injured.' The name is an aspect and needs to work like one.",
      "Plan at least one compel on it before it heals. A consequence that never gets compelled is wasted narrative weight.",
      "Remind the player they can invoke their own consequence for +2 when the fiction supports it.",
      "The GM never decides when a consequence clears. The player initiates recovery with an overcome roll.",
      "Consequences make the fiction feel real and the recovery feel earned. Let them breathe."
    ],
    title: "Consequence",
    what: "An aspect a character takes to absorb a hit instead of being taken out. It persists and can be compelled.",
    output: "Severity level (mild/moderate/severe), a named consequence aspect, the context in which it was suffered, and a compel hook to use in the next scene.",
    rules: [
      "Three severity levels: mild (2 absorbed), moderate (4), severe (6).",
      "Recovery requires an overcome roll — mild: Fair +2/one scene, moderate: Great +4/full session, severe: Fantastic +6/breakthrough. Academics for physical, Empathy for mental. +2 difficulty if self-treating.",
      "Anyone can invoke or compel it — including the character who took it.",
      "Compel the consequence at least once before it clears.",
      "Consequences are story hooks with mechanical teeth, not just damage.",
    ],
    rule_urls: ['/fate-condensed/challenges-conflicts-and-contests#taking-harm', '/fate-condensed/challenges-conflicts-and-contests#taking-harm', '/fate-condensed/aspects-and-fate-points#compels', '/fate-condensed/aspects-and-fate-points#compels', null],
    tips: [
      "Name them evocatively. 'Badly Burned Hands' beats 'Injured' every time - it does more narrative work.",
      "Compel it in the very next scene. Don't wait. Establishing the pattern early is everything.",
      "Remind players they can invoke their own consequences for +2 when the fiction supports it. They forget.",
    ],
    invoke_example: "A PC has 'Badly Burned Hands.' They intimidate a prisoner, invoking their own consequence for +2 on Provoke — bandaged hands say 'I'm not afraid of pain.'",
    compel_example: "Same consequence, next scene. The PC picks a lock. The GM offers a fate point: 'Badly Burned Hands' makes fine motor control unreliable. They accept and try with shaking fingers.",
    beginner: {
      what: "When stress boxes aren't enough, you take a consequence — a lasting injury written as an aspect. It absorbs damage but anyone can invoke or compel it until it heals.",
      terms: [
        ["Consequence", "A named injury on your sheet that absorbs damage but becomes an aspect others can use."],
        ["Mild (−2)", "Minor injury. Clears after one scene with treatment."],
        ["Moderate (−4)", "Serious injury. Clears after a full session with treatment."],
        ["Severe (−6)", "Major trauma. Clears after a breakthrough with treatment."],
        ["Treatment", "An overcome roll: Academics for physical, Empathy for mental."],
        ["Taken Out", "Can't absorb all damage? You're out. The attacker decides what happens."],
      ],
    },
  },
  faction: {
    gm_tips: [
      "Factions exert pressure through NPCs, compels, and scene aspects — not stat blocks. You deal with agents, not the faction itself.",
      "Advance the faction one step toward its goal off-screen each session the party ignores it. Make the advancement visible.",
      "The named face is your in-session avatar. Build them out with the Major NPC generator — they need a trouble aspect.",
      "The weakness is your gift to the players. Make sure a clever PC could find it through Investigate or Contacts."
    ],
    title: "Faction",
    what: "A group with a goal, a method, an exploitable weakness, and a named face NPC who represents it in play.",
    output: "Faction name, goal, method, weakness, and one named face NPC with a role description.",
    rules: [
      "Factions have no stats — they exert pressure through NPCs, compels, and scene aspects.",
      "Give the faction an aspect describing how it operates. Use it like any aspect.",
      "The named face is a full major NPC — build them with the Major NPC generator.",
      "Faction goals drive the campaign clock. If PCs do nothing, factions advance.",
      "Weaknesses must be discovered through play — not given automatically.",
    ],
    rule_urls: [null, null, null, '/fate-system-toolkit/factions', null],
    tips: [
      "Two factions with conflicting goals = engine. Three with overlapping methods = ideal mess.",
      "Between sessions: one sentence per faction on what they achieved off-screen.",
      "The named face's personal goal doesn't align perfectly with the faction's. That gap is the hook.",
    ],
    invoke_example: "The faction's method is 'Controls the Supply Lines.' A PC investigates a settlement shortage. Invoke for +2 on Investigate — the pattern reveals deliberate pressure.",
    compel_example: "The party's contact was going to help. The GM offers a fate point: the faction's reach fires — the contact goes quiet. Not an attack. A reminder.",
    beginner: {
      what: "A faction is an organized group advancing its goals between sessions. You deal with their agents, not the faction itself.",
      terms: [
        ["Faction", "An organization with a goal, a method, and a weakness. Pressure, not stat blocks."],
        ["Named Face", "The NPC who represents the faction in play."],
        ["Goal", "What the faction wants. Uncontested, they advance every session."],
        ["Weakness", "How the faction can be undermined. Discovered through play."],
      ],
    },
  },
  complication: {
    gm_tips: [
      "Deploy when the current scene's outcome feels settled — that's when a complication restores dramatic energy.",
      "Introduce one element at a time. New aspect, arriving NPC, environment shift — three separate beats, not a pile-on.",
      "A complication is not a punishment. It is new fictional facts that change what actions are now possible.",
      "New aspects from complications come with a free invoke — hand it to whoever would most benefit dramatically."
    ],
    title: "Complication",
    what: "A mid-scene interruption: new aspect, uninvited arrival, or environment shift. Deploy when the scene has settled.",
    output: "Complication type, new scene aspect, an arriving NPC, an environmental shift, and a spotlight recommendation for which to lead with.",
    rules: [
      "A complication is not punishment — it's new fictional facts changing what's possible.",
      "New aspects from complications get a free invoke if a PC helped create them.",
      "Arrivals enter with their own agenda. They're not there to help or hinder.",
      "Environment shifts may create zones, require Overcome rolls, or change applicable skills.",
      "The GM can compel any new aspect immediately.",
    ],
    rule_urls: ['/fate-condensed/aspects-and-fate-points#situation-aspects', '/fate-condensed/aspects-and-fate-points#situation-aspects', null, null, '/fate-condensed/aspects-and-fate-points#compels'],
    tips: [
      "One element, then pause. Let them react first.",
      "The best complication is a choice: solve the new problem or push forward.",
      "Invert a player's free invoke as the complication. Personal and effective.",
    ],
    invoke_example: "'Someone Is Watching from the Rooftop' appears. A PC invokes it for +2 on Stealth — knowing the watcher's position reveals the blind spots.",
    compel_example: "Same aspect. A PC with 'I Don't Leave Without What I Came For' is mid-extraction. The GM offers a fate point: the watcher makes a clean exit impossible.",
    beginner: {
      what: "A complication shakes up a settled scene — a new problem, an unexpected arrival, or an environment change. Not punishment; the story getting more interesting.",
      terms: [
        ["Complication", "A new fictional fact changing what's possible. Not 'you fail' — 'something new is happening.'"],
        ["Scene Aspect", "A complication often creates a new aspect everyone can use."],
        ["Free Invoke", "A new aspect from a complication grants a one-time free +2."],
        ["Spotlight", "Which element to introduce first — aspect, NPC arrival, or environment change."],
      ],
    },
  },
  backstory: {
    gm_tips: [
      "Ask the question and shut up. The first answer is the safe one — wait for the second, messier one.",
      "Every answer should produce at least one aspect. Write them down as the player speaks, not after.",
      "Relationship web questions matter more than individual backstory. Cross-PC aspects are the foundation of the best compels.",
      "The opening hook is one sentence that drops the party into the situation. No backstory explanation — straight to the fiction."
    ],
    title: "PC Backstory",
    what: "Session Zero questions, a relationship web for cross-PC connections, and an opening hook for the first scene.",
    output: "Three backstory questions, a relationship web prompt, and an opening hook for Session 1.",
    rules: [
      "Do backstory at the table together. An unknown aspect can't be invoked or compelled.",
      "Every answer should produce an aspect. Write as they talk.",
      "The relationship web creates cross-PC aspects — the strongest compel material.",
      "Let high concept and trouble emerge from answers. Don't assign them in advance.",
      "The opening hook is your first sentence at the table.",
    ],
    rule_urls: ['/fate-condensed/getting-started#create-your-characters', '/fate-condensed/getting-started#create-your-characters', null, null, null],
    tips: [
      "Ask what you don't know. Known answers are narration, not discovery.",
      "Let answers surprise you. Unplanned campaigns are better.",
      "Cross-PC questions matter more. Shared history is your best compel material.",
    ],
    invoke_example: "The aspect 'Trained by Someone Who Trusted Me' emerged in Session Zero. A PC bypasses a security system their mentor designed. Invoke for +2 on Investigate — they know how their mentor thinks.",
    compel_example: "Same aspect. The mentor is on the opposite side now. The GM offers a fate point: the PC won't act against the mentor directly. Session Zero history becomes the campaign's dramatic constraint.",
    beginner: {
      what: "This generates Session Zero questions for collaborative character creation. Every answer becomes an aspect that matters in play.",
      terms: [
        ["Session Zero", "First session: create characters together, establish the world. No dice."],
        ["Backstory Question", "A prompt that reveals character and creates aspects."],
        ["Relationship Web", "How PCs know each other. These connections fuel the strongest drama."],
        ["Opening Hook", "The GM's first sentence at the game. Drops players straight into action."],
      ],
    },
  },
  stunt: {
    title: "Stunt",
    what: "A trick or training giving +2 in a narrow situation, or a once-per-scene rule exception.",
    output: "Stunt name, the skill it modifies, a description of the effect, and type (bonus or special rule).",
    rules: [
      "3 free stunts at creation. A 4th costs 1 Refresh (minimum 1).",
      "Stunts must be conditional — '+2 to Fight when outnumbered' is legal. '+2 to all Fight' is not.",
      "A stunt can swap +2 for a once-per-scene rule exception.",
      "The bonus applies to one action (overcome, create advantage, attack, defend) in a specific circumstance.",
    ],
    rule_urls: ['/fate-condensed/skills-and-stunts#stunts', '/fate-condensed/skills-and-stunts#building-stunts', '/fate-condensed/skills-and-stunts#building-stunts', '/fate-condensed/skills-and-stunts#building-stunts'],
    gm_tips: [
      "Use generated stunts as suggestions during character creation or advancement.",
      "Let players rename stunts to fit their character — mechanics don't change.",
      "Make the circumstance clear enough to trigger reliably at the table.",
    ],
    invoke_example: "A PC has 'Danger Sense: +2 to defend against surprise attacks.' The villain ambushes. The stunt triggers automatically — +2 to defend, no fate point needed.",
    compel_example: "Stunts aren't compelled directly. But 'Always Ready for a Fight' can be compelled to make a PC draw a weapon in a social scene.",
    beginner: {
      what: "A stunt gives your character an edge in a specific situation. Unlike aspects, stunts cost no fate points — they fire when the condition is met.",
      terms: [
        ["Stunt", "+2 in a narrow circumstance, or a once-per-scene rule exception."],
        ["Refresh", "Fate points per session. Stunts beyond the first 3 cost 1 Refresh each."],
        ["Conditional", "Stunts fire only when their specific condition is met."],
        ["Once-per-scene", "Some stunts replace +2 with a unique ability usable once per scene."],
      ],
    },
  },
  obstacle: {
    title: "Obstacle",
    what: "An obstacle cannot be attacked and taken out. Avoid, circumvent, or endure it. Three types: hazards attack, blocks prevent, distractions force choices.",
    output: "One obstacle: a hazard (skill rating + Weapon + disable method), a block (skill rating + disable method), or a distraction (choice + repercussions for each option).",
    rules: [
      "Hazards act in initiative and attack. Disable by overcoming at rating +2. Cannot be taken out by attacking.",
      "Blocks provide passive opposition. Failure against a block with Weapon rating means you take a hit.",
      "Distractions present a choice with consequences on both sides. Drama from the decision, not the dice.",
      "Disabling requires risk and an overcome roll at rating +2.",
      "Enemies can be taken out. Obstacles cannot.",
      "One obstacle per scene accents enemies. Overuse frustrates players.",
    ],
    rule_urls: ['/fate-condensed/optional-rules#obstacles', '/fate-condensed/optional-rules#obstacles', '/fate-condensed/optional-rules#obstacles', '/fate-condensed/optional-rules#obstacles', null, null],
    gm_tips: [
      "One obstacle per scene. Splits attention and gives non-combat PCs a role.",
      "Announce the type immediately: hazard, block, or distraction.",
      "A hazard nobody knows about is an ambush, not tension. Announce upfront.",
      "Distractions: name both sides of the choice before anyone rolls."
    ],
    invoke_example: "The hazard 'Collapsing Scaffolding' has aspect 'Groaning Under Its Own Weight.' A PC places 'Weak Point Identified' via Create Advantage, then invokes it for +2 on the overcome roll.",
    compel_example: "Same scaffolding. A PC has 'Never Leaves Someone Behind.' A teammate is underneath. The GM offers a fate point: they must get the teammate clear before bringing it down.",
    beginner: {
      what: "An obstacle can't be defeated by attacking — it must be avoided, disabled, or endured. Three types: hazards attack you, blocks stop you, distractions force a hard choice.",
      terms: [
        ["Hazard", "Attacks on its turn like an enemy but can't be taken out by fighting."],
        ["Block", "Prevents a specific action. Overcome it or find another way."],
        ["Distraction", "Forces a choice where both options have costs."],
        ["Disable", "Risky overcome roll at high difficulty to remove a hazard or block."],
      ],
    },
  },
  countdown: {
    title: "Countdown",
    what: "A countdown adds urgency: a track of boxes, a trigger that fills them, and an outcome when the last box is checked.",
    output: "A countdown clock with named threat, number of boxes, time unit, trigger condition, and outcome when the clock strikes zero.",
    rules: [
      "A row of boxes marked left to right. Shorter track = faster doom.",
      "A trigger marks a box — as simple as 'one exchange passes' or as specific as 'a PC fails a roll.'",
      "When the last box fills, the outcome happens. Non-negotiable.",
      "Show the track without revealing what it represents. Mystery is half the pressure.",
      "Stack triggers for acceleration: one per exchange plus one per event.",
      "A visible countdown does more for pacing than three extra enemies.",
    ],
    rule_urls: ['/fate-condensed/optional-rules#countdowns', '/fate-condensed/optional-rules#countdowns', '/fate-condensed/optional-rules#countdowns', null, null, null],
    gm_tips: [
      "Visible track on the table from the start. No secrets.",
      "Check each box, pause, say nothing. Silence does the work.",
      "State the trigger once clearly. Never fudge it — the contract is everything.",
      "When the last box fills, the outcome happens. No exceptions."
    ],
    invoke_example: "'Building Demolition Sequence' has 2 boxes marked. A PC placed 'Exposed Control Panel' last exchange. Invoke for +2 on Crafts to stop the sequence. Urgency makes every +2 enormous.",
    compel_example: "Same countdown, 3 of 4 boxes marked. A PC has 'I Always Make It Personal.' The GM offers a fate point: the compel pulls them toward the person who set the charges instead of the panel.",
    beginner: {
      what: "A visible timer — boxes that fill as things get worse. When the last box is checked, the outcome fires. Deal with it now or face consequences.",
      terms: [
        ["Countdown Track", "A row of boxes (usually 4–6) visible on the table."],
        ["Trigger", "What fills a box — time, failed rolls, or a specific event."],
        ["Outcome", "What happens when the last box fills. Non-negotiable."],
        ["Urgency", "A visible ticking clock makes every decision weightier."],
      ],
    },
  },
  constraint: {
    title: "Constraint",
    what: "A modifier on enemies or obstacles: a limitation restricts actions, a resistance blocks a specific approach. Forces creative problem-solving.",
    output: "Either a limitation (restricted action + consequence for taking it anyway) or a resistance (what it blocks + how to bypass it).",
    rules: [
      "Limitations don't forbid — they impose a cost. Players can always act.",
      "Resistances force Plan B. Finding the bypass IS the quest.",
      "A good resistance drives a session: discover, research, execute.",
      "Constraints attach to enemies or obstacles, not the scene.",
      "Known limitations are puzzles. Hidden limitations are punishments.",
      "Every resistance needs a bypass. No bypass = wall. Build it before the session.",
    ],
    rule_urls: ['/fate-adversary-toolkit/constraints', '/fate-adversary-toolkit/constraints', '/fate-adversary-toolkit/constraints', null, null, null],
    gm_tips: [
      "State limitations before players commit. After the roll is a gotcha.",
      "Players need to know a bypass exists, even without knowing what it is.",
      "One constraint: interesting. Two: a puzzle. Three: a slog.",
      "Bypasses come from Investigate, Lore, or the right NPC. Reward research.",
    
      "Seed the bypass two scenes before the party needs it.",
      "Name the bypass at session prep. It becomes your session premise.",
      "Limitations that create trades are best. 'Attack but it alerts the entity' = drama every exchange.",
      "If the party ignores the bypass for two sessions, compress the timeline.",
    ],
    invoke_example: "Resistance: 'Armoured Hide — Blades Can't Pierce It.' A PC found the bypass and placed 'One Weak Spot' via Create Advantage. Invoke for +2 on Fight to strike the gap.",
    compel_example: "Same creature. A PC has 'I Solve Every Problem with Force.' The GM offers a fate point: their usual approach is useless. Frustrated, swinging at something that shrugs off every blow.",
    beginner: {
      what: "A constraint makes an enemy or obstacle harder to deal with in a specific way. A creature with armoured hide that blades can't pierce. A curse that prevents magic in the area. It forces the players to think creatively — their usual approach won't work, so they need Plan B. Every constraint has a bypass: the one thing that DOES work.",
      terms: [
        ["Limitation", "A restriction on what players can do. 'No weapons allowed inside' — you CAN break the rule, but there's a cost."],
        ["Resistance", "Something the enemy is immune to. 'Immune to fire' means you need a different approach entirely."],
        ["Bypass", "The one thing that gets past the resistance. Finding the bypass IS the adventure."],
        ["Cost", "What happens if you try the restricted action anyway. Not 'you can't' — 'you can, but here's the price.'"],
      ],
    },
  
    dnd_notes: "D&D has immunities (fire immune = no damage). Fate constraints redirect rather than block — the bypass is always there, it just requires fiction: find the sword, learn the word, negotiate the exception. The party is never simply stopped.",
  },


  boost: {
    title: "Boost",
    what: "A boost is a fleeting, unnamed advantage — a momentary edge. It has one free invoke and vanishes as soon as that invoke is used (or the scene ends).",
    output: "A short aspect phrase representing a temporary advantage.",
    rules: [
      "A boost can NEVER be compelled. It is not a persistent aspect — it has no dramatic weight, only mechanical weight (FCon p.23).",
      "A boost cannot be refused. It has no fate point economy attached.",
      "You get ONE free invoke. After that it is gone — it cannot be held or passed between scenes.",
      "You can pass a boost to an ally if there is narrative justification (FCon p.23).",
      "You can hold off naming a boost until you invoke it — useful when the fiction hasn\'t fully resolved.",
      "Boosts never persist beyond the end of a scene.",
    ],
    rule_urls: ['/fate-condensed/aspects-and-fate-points#boosts', '/fate-condensed/aspects-and-fate-points#boosts', '/fate-condensed/aspects-and-fate-points#boosts', '/fate-condensed/aspects-and-fate-points#boosts', null, null],
    gm_tips: [
      "Boosts from Success with Style are gifts to players. Name them quickly and evocatively — \"Off Balance\", \"In My Sights\", \"Caught Flat-Footed\".",
      "Remind players boosts disappear. A player who forgets to use a boost before the scene ends has lost it — no rollover.",
      "Boosts are not consequences, not situation aspects, not free invokes on persistent aspects. They are their own lightweight category.",
      "Use boosts to reward stylish play. A player who describes their action cinematically and rolls well deserves the boost. Make it feel good to earn one.",
      "Never let a boost become the subject of a compel. If you\'re tempted to compel a boost, you\'re thinking of a situation aspect instead — place that instead.",
    ],
    dnd_notes: "D&D advantage (roll twice, take higher) is a binary flip. A Fate boost is a named narrative fact with one free +2. The name matters — it ties the mechanical bonus to what actually happened in the fiction.",
    invoke_example: "PC rolls Fight with Style and earns a boost: \"Guard Is Overextended\". Next exchange they invoke it on their attack roll for +2 — the guard\'s poor positioning pays off immediately.",
    compel_example: "N/A — boosts cannot be compelled. If you want to create a complication from a fast-moving tactical situation, place a situation aspect instead and compel that.",
    beginner: {
      what: "A boost is a temporary +2 that lasts exactly one use. When you succeed really well at an action (Success with Style), you often get a boost — a short phrase that gives you or an ally a +2 bonus on one specific upcoming roll. Use it or lose it.",
      terms: [
        ["Boost", "A one-use +2 bonus attached to a short phrase. Cannot be compelled. Disappears after use or end of scene."],
        ["Free invoke", "Use a boost by declaring you\'re invoking it — you get +2 on your roll. Then it\'s gone."],
        ["Success with Style", "Rolling +3 or more shifts above difficulty. Often awards a boost on top of the main success."],
      ],
    },
  },

};

// ═══════════════════════════════════════════════════════════════
// GM MODE - Post-roll guidance content for all generators
// Injected into HELP_CONTENT as gm_running, gm_checklist, gm_hook
// ═══════════════════════════════════════════════════════════════
(function() {
  var gm = {
    npc_minor: {
      gm_checklist: ["One line of dialogue and a visible motivation before the first roll","Don't name them unless the players ask","Invoke or compel the weakness aspect in the first exchange","When a PC rolls well, narrate the defeat - skip the dice"],
      gm_running: "One line of dialogue, one visible motivation. Invoke or compel the weakness aspect in the first exchange - every time. Don't explain. Just do it.",
      dnd_notes: "D&D mooks have HP and AC. Fate minor NPCs have 1-2 stress boxes and a single defining aspect. Mark a box to absorb a hit; fill the track and they're taken out. No subtraction, no death saves — just two boxes and a name.",
    },
    npc_major: {
      gm_checklist: ["Open with high concept in action - show them winning something before the PCs engage","Invoke high concept on their biggest roll","Compel their trouble to give the PCs an opening","Let them concede if losing - they earn FP and come back stronger"],
      gm_running: "First scene: show the high concept in action before the PCs engage. Let them win something off-screen so the players respect the stakes. When the conflict comes: invoke their high concept for +2 on their biggest roll, compel their trouble to create an opening for the PCs, and let them concede if they're losing badly. A tactical retreat now means a more dangerous encounter later.",
      gm_hook: "This NPC's trouble aspect is your compel fuel for the next 3-4 sessions. Write it on a card and keep it visible during prep.",
      dnd_notes: "D&D boss = HP bloat plus phases. Fate villain = a character with a trouble aspect. When losing, they concede - escape, bargain, transform the situation. The goal is a recurring antagonist, not a loot drop.",
    },
    scene: {
      gm_running: "Name the zones and their aspects as you set the scene. Announce what's obvious. Decide right now which one aspect you're saving to compel - the one the players won't see coming. When someone fails a roll, check whether a scene aspect just got worse or a new one just appeared.",
      gm_checklist: ["Announce the 1-2 most visible aspects aloud", "Place index cards for each zone on the table", "Identify which aspect you'll compel first", "Decide which aspect is hidden (discoverable via Notice/Investigate)"],
      dnd_notes: "D&D cover gives +2 AC, difficult terrain halves speed. Fate situation aspects can be invoked for +2 on any relevant roll or compelled when they cause problems. The aspect is always true and always available to anyone.",
    },
    campaign: {
      gm_running: "The current issue drives this session's compels. The impending issue is your between-session clock - advance it visibly when the party ignores it. Setting aspects are always true, always invokable, and never go away - treat them as permanent compel fuel.",
      gm_checklist: ["Write the current issue on a visible card at the table", "Plan one compel per session driven by the current issue", "Decide how the impending issue advances if unaddressed", "Use setting aspects as scene-framing springboards"],
      gm_hook: "At session end, ask: has the current issue escalated or resolved? If resolved, promote the impending issue and roll a new impending.",
      dnd_notes: "D&D has faction reputation tracks and posted quest hooks. Fate issues are living aspects - \"The City Guard Owes Its Loyalty to Gold\" is simultaneously an invokable truth, a compel trigger, and a session premise in one phrase.",
    },
    encounter: {
      gm_running: "Before the first roll: victory condition aloud, fate point pool counted (1 per PC). During play: offer 'success at a cost' before flat failure. Hold the twist for when the outcome feels settled - dropping it too early kills tension. Popcorn Initiative (p.31): the character who just acted names who goes next. Nobody waits for their 'turn.' The initiative flows to whoever makes dramatic sense.",
      gm_checklist: ["State victory and defeat conditions aloud", "Confirm GM fate point pool: 1 per PC", "Announce visible situation aspects", "Hold the twist - deploy when things feel decided", "Track stress on paper, not in your head"],
      dnd_notes: "D&D initiative is a fixed queue; everyone waits their turn. Fate uses Popcorn Initiative: the last person to act points to who goes next — players and GM alternate control of the spotlight. Also: victory doesn't require killing. State an objective at the start; the scene ends when that's achieved or the opposition concedes.",
    },
    seed: {
      gm_tips: [
        "Your literal first words at the table are Scene 1's opening description. Read it exactly. No preamble — drop them straight in.",
        "Prep Scene 1 thoroughly. Prep nothing else. The complication and Scene 2 emerge from where the players go.",
        "The complication is your mid-session hand grenade — something that demands a PC response without dictating what it should be.",
        "Know the defeat condition cold before you start. It creates the stakes that make the victory condition matter.",
        "The three-scene structure is a suggestion, not a script. Good sessions are messier and better than any outline."
      ],
      gm_running: "Scene 1 is your literal opening sentence at the table - read the location description and drop the players into it with no preamble. The complication is your mid-session pivot. The defeat condition is what happens if they do nothing - make sure it's real and visible.",
      gm_checklist: ["Read Scene 1 opening aloud as your first words", "Know the defeat condition cold - it creates the stakes", "Have the complication ready but don't force it", "Let the players redirect after Scene 1 - follow them", "The three-scene structure is a suggestion, not a script"],
      gm_hook: "After the session, check: did the outcome change the campaign issue? If yes, update it. If no, the issue should escalate next time.",
      dnd_notes: "D&D adventure = dungeon map, keyed rooms, CR-balanced encounters. Fate seed = three scene frames, a complication, and opposition calibrated to be interesting rather than balanced. The three-scene structure is a suggestion, not a script.",
    },
    compel: {
      gm_checklist: ["Offer the fate point FIRST, then state the complication","Name the aspect you're compelling - be specific","Accept refusal gracefully - they spent 1 FP, that's fine","Two refusals means you're finding the right pressure points"],
      gm_running: "Offer the fate point first. Then state the complication. This order matters - the player sees the reward before the cost, which makes acceptance feel like agency rather than punishment. If they refuse, note the FP spend silently. Two refusals in a session means you're targeting the right aspects.",
      gm_compel: "The test: does accepting this create a better story moment than refusing it? If the answer is yes, the compel is working. If it feels like a punishment, reframe - the consequence should complicate, not just hinder.",
      dnd_notes: "D&D character flaws are optional flavor. In Fate, aspects are live mechanics. The GM offers a fate point and the player accepts the complication (gains FP) or refuses (spends FP). It is an economy, not a penalty.",
    },
    challenge: {
      gm_running: "Declare the challenge type and primary skill before any dice touch the table. Let players Create Advantage first - reward preparation with free invokes on the decisive roll. Keep it to 3-5 rolls maximum; longer and the tension deflates.",
      gm_checklist: ["Name the challenge and primary skill", "Set difficulty (usually Fair+2 to Great+4)", "State success AND failure outcomes before rolling", "Allow Create Advantage before the decisive roll", "Failure changes the situation - it doesn't end the scene"],
      dnd_notes: "D&D skill challenge uses rigid pass/fail math. Fate challenge: failure changes the situation rather than blocking the scene. Success at a Cost is always available. There is no \"the party failed the skill challenge.\"",
    },
    contest: {
      gm_running: "Track on paper, in front of everyone. Each exchange: both sides roll, highest effort marks a victory (succeed with style = 2 if the other side didn't). Ties: nobody marks - you introduce a new situation aspect instead. Keep the twist ready. It earns its keep.",
      gm_checklist: ["Display the victory track visibly (first to 3)", "Each exchange: one roll per side, compare efforts", "Succeed with Style = 2 victories (if no one else did)", "Ties: no victory marked, introduce a twist aspect", "Creating Advantage is risky - forfeit your roll or give enemy a free invoke"],
      dnd_notes: "D&D chase is usually one Athletics check. Fate contest is tracked exchange by exchange. Ties introduce new situation aspects - not a neutral result. The contest generates story; a single roll ends it.",
    },
    consequence: {
      gm_tips: [
        "Name it specifically — 'Badly Burned Hands,' not 'Injured.' The name is an aspect and needs to work like one.",
        "Plan at least one compel on it before it heals. A consequence that never gets compelled is wasted narrative weight.",
        "Remind the player they can invoke their own consequence for +2 when the fiction supports it.",
        "The GM never decides when a consequence clears. The player initiates recovery with an overcome roll.",
        "Consequences make the fiction feel real and the recovery feel earned. Let them breathe."
      ],
      gm_checklist: ["Name it specifically - a named aspect, not a severity label","Note who can treat it (Academics for physical, Empathy for mental)","Plan at least one compel on it before it heals","Remind the player they can invoke their own consequence for +2"],
      gm_running: "Name it specifically - 'Badly Burned Hands,' not 'Injured.' That name is an aspect and it needs to work like one. Plan at least one compel on it before it heals. And remind the player: they can invoke their own consequence for +2 when the fiction supports it - broken arm helps sell a desperate grapple.",
      gm_compel: "The scene after a consequence is taken is your compel window. The consequence aspect is fresh, narratively loaded, and mechanically active. Use it before the player forgets it exists.",
      dnd_notes: "D&D hit points are an abstract buffer. Fate consequences are named aspects that persist and can be compelled. \"Badly Burned Hands\" applies in any scene involving delicate work, climbing, or combat - and earns the player a fate point when compelled.",
    },
    faction: {
      gm_tips: [
        "Factions exert pressure through NPCs, compels, and scene aspects — not stat blocks. You deal with agents, not the faction itself.",
        "Advance the faction one step toward its goal off-screen each session the party ignores it. Make the advancement visible.",
        "The named face is your in-session avatar. Build them out with the Major NPC generator — they need a trouble aspect.",
        "The weakness is your gift to the players. Make sure a clever PC could find it through Investigate or Contacts."
      ],
      gm_checklist: ["Use the named face as your in-session avatar for the faction","Advance the faction one step toward its goal - offscreen - each session the party ignores them","Know the weakness before the session ends - even if the players don't","Compel the faction's method, not just its goal"],
      gm_running: "Factions exert pressure through NPCs, compels, and scene aspects - not stat blocks. The named face is your session anchor: build them out with the Major NPC generator. Let factions act between sessions - narrate what they achieved off-screen to make them feel real.",
      gm_hook: "At the end of this session, advance this faction one step toward its goal. Tell the players what changed. Factions that move off-screen create urgency that no encounter can match.",
      dnd_notes: "D&D factions hand out quests and track reputation scores. Fate factions are pressure systems — their goal, face, and weakness create story. You don't fight a faction in combat; you find their named face NPC, expose their weakness, and undermine the goal they're advancing every session you ignore them.",
    },
    complication: {
      gm_tips: [
        "Deploy when the current scene's outcome feels settled — that's when a complication restores dramatic energy.",
        "Introduce one element at a time. New aspect, arriving NPC, environment shift — three separate beats, not a pile-on.",
        "A complication is not a punishment. It is new fictional facts that change what actions are now possible.",
        "New aspects from complications come with a free invoke — hand it to whoever would most benefit dramatically."
      ],
      gm_checklist: ["Pick ONE element to introduce first - new aspect, NPC arrival, or environment shift","New aspects can be invoked immediately with a free invoke","Arriving NPCs have their own agenda - they're not there to help or hinder, they're there","Deploy when the scene feels settled, not at the start"],
      gm_running: "Introduce one element at a time and let the players react. The new aspect, the arriving NPC, and the environment shift are three separate beats - don't stack them. The best moment to deploy a complication is when the outcome of the current scene feels settled.",
      dnd_notes: "D&D wandering monster is a resource drain. Fate complication is a new aspect entering the fiction with a free invoke and an agenda. It changes what is possible in the scene - not what hit points you lose.",
    },
    backstory: {
      gm_tips: [
        "Ask the question and shut up. The first answer is the safe one — wait for the second, messier one.",
        "Every answer should produce at least one aspect. Write them down as the player speaks, not after.",
        "Relationship web questions matter more than individual backstory. Cross-PC aspects are the foundation of the best compels.",
        "The opening hook is one sentence that drops the party into the situation. No backstory explanation — straight to the fiction."
      ],
      gm_checklist: ["Ask the question and shut up - wait for the second, messier answer","Write down every aspect that emerges as the player speaks","Relationship web questions matter more than individual ones - do them","Opening hook: one sentence that drops the party directly into the situation"],
      gm_running: "Ask the questions and then shut up. Let the player think. Their first answer is the safe answer; wait for the second, messier one. Every answer should produce at least one aspect - write them down as the player speaks. The relationship web questions matter more than the individual ones.",
      dnd_notes: "D&D backstory is flavour text on your sheet. Fate backstory is raw material for aspects — write it to be invokable (\"Trained by the Last Knight of Ashmark\" gives you +2 when it matters) and compellable (the GM can drag that history back into the present for a fate point). If you can't invoke or compel it, it's not an aspect yet.",
    },
    obstacle: {
      gm_checklist: ["Announce type immediately: hazard / block / distraction","Hazards act in initiative - give them a rating and a Weapon value","Blocks list what they prevent and the consequence for forcing through","Distractions: name both sides of the choice before anyone rolls"],
      gm_running: "Announce the type immediately - hazard (attacks on its turn), block (passive opposition to specific actions), or distraction (forces a choice with costs on both sides). Players need to know what they're dealing with to make interesting decisions. A hazard no one knows exists until it attacks isn't tension, it's ambush.",
      dnd_notes: "D&D trap: save-or-suffer, deals damage. Fate hazard: has a skill rating, acts in initiative, attacks - but cannot be taken out by attacking. D&D difficult terrain slows movement. Fate block provides passive opposition to the specific action it prevents.",
    },
    countdown: {
      gm_checklist: ["State the trigger clearly before anyone acts","Put the track visibly on the table","Check boxes in front of the players - let the weight land","When the last box fills, the outcome happens. No exceptions."],
      gm_running: "State the trigger clearly when introducing the track - 'one box fills at the end of each exchange.' Never fudge a trigger to protect the players. When the last box fills, the outcome happens. That's the contract, and breaking it collapses the tool's power.",
      dnd_notes: "D&D environmental timers are often fudged. Fate countdown: a visible track with a clear trigger. When the last box fills, the outcome happens - no exceptions. Breaking the contract once destroys the tool.",
    },
    constraint: {
      gm_checklist: ["Announce limitations BEFORE players commit to actions","Resistances: confirm a bypass exists even if players don't know it yet","One constraint per encounter - two is a puzzle, three is a slog","Players should be able to figure out bypasses through Investigate or Lore"],
      gm_running: "State limitations before players commit to an action - not after they've rolled. A known limitation is a puzzle. A surprise limitation is a gotcha. Resistances need a bypass and the players need to know a bypass exists, even if they don't know what it is yet.",
      dnd_notes: "D&D damage immunity is often a wall with no workaround. Fate resistance always has a bypass the players can discover. Finding the bypass is a session goal. An immunity without a bypass is not a constraint - it is a dead end.",
    }
  };
  Object.keys(gm).forEach(function(k) {
    if (HELP_CONTENT[k]) {
      var g = gm[k];
      if (g.gm_running) HELP_CONTENT[k].gm_running = g.gm_running;
      if (g.gm_checklist) HELP_CONTENT[k].gm_checklist = g.gm_checklist;
      if (g.gm_compel) HELP_CONTENT[k].gm_compel = g.gm_compel;
      if (g.gm_hook) HELP_CONTENT[k].gm_hook = g.gm_hook;
      if (g.dnd_notes) HELP_CONTENT[k].dnd_notes = g.dnd_notes;
    }
  });
})();

// ═══════════════════════════════════════════════════════════════
// RELATED GENERATORS — cross-links shown in the How tab
// ═══════════════════════════════════════════════════════════════
(function() {
  var rel = {
    npc_minor:    ['scene', 'complication', 'compel'],
    npc_major:    ['encounter', 'faction', 'consequence'],
    scene:        ['encounter', 'obstacle', 'complication'],
    campaign:     ['faction', 'seed', 'countdown'],
    encounter:    ['scene', 'npc_major', 'countdown'],
    seed:         ['scene', 'encounter', 'compel'],
    compel:       ['consequence', 'encounter', 'campaign'],
    challenge:    ['countdown', 'obstacle', 'scene'],
    contest:      ['scene', 'complication', 'countdown'],
    consequence:  ['encounter', 'compel', 'npc_major'],
    faction:      ['npc_major', 'campaign', 'encounter'],
    complication: ['scene', 'contest', 'encounter'],
    pc:           ['backstory', 'campaign', 'seed'],
    backstory:    ['pc', 'campaign', 'faction'],
    obstacle:     ['scene', 'encounter', 'challenge'],
    countdown:    ['encounter', 'campaign', 'constraint'],
    constraint:   ['scene', 'obstacle', 'challenge'],
    boost:        ['encounter', 'scene', 'compel'],
  };
  Object.keys(rel).forEach(function(k) {
    if (HELP_CONTENT[k]) HELP_CONTENT[k].related = rel[k];
  });
})();

export const HELP_ENTRIES = [
  {
    id:"npc_minor", icon:"fa-user", label:"Minor NPC",
    what:"A named minor NPC (mook): concept, one weakness, and 1–2 stress boxes.",
    how:"Instant extras for any scene — read the name and concept aloud, use the weakness as a compel hook.",
    tip:"Don't name every mook - only the ones who might interact with the party. Optionally, treat a mob as sharing a single stress track.",
    rule:"Fate Condensed p.43 - Minor NPCs: 1–2 aspects, 0–3 stress boxes, no consequences.",
    srd_url:"https://fate-srd.com/fate-condensed/being-game-master#npcs",
  },
  {
    id:"npc_major", icon:"fa-crown", label:"Major NPC",
    what:"A full antagonist or ally: high concept, trouble, 3 other aspects, a skill pyramid, 2–3 stunts, stress and consequences.",
    how:"Your session's central antagonist or ally in one roll — read concept + trouble to set the personality, reveal other aspects through play.",
    tip:"Major NPCs should feel like PCs. Give them a want, a fear, and a reason the party might sympathise with them.",
    rule:"Fate Condensed p.43 - Major NPCs: full aspects, skills, stunts, stress, and consequences.",
    srd_url:"https://fate-srd.com/fate-condensed/being-game-master#npcs",
  },
  {
    id:"scene", icon:"fa-fire", label:"Scene Setup",
    what:"Scene aspects (tone, movement, cover, danger, usable), 2–4 zones with their own aspects, and zone descriptions.",
    how:"Sets the stage before players arrive — read zone names aloud, reveal visible aspects, keep hidden ones for discovery.",
    tip:"Scene aspects can be invoked by anyone. Put at least one 'usable' aspect in reach - players love having options.",
    rule:"Fate Condensed p.23 & p.30 - Situation aspects persist as long as the situation does. Zones and their aspects are on p.29.",
    srd_url:"https://fate-srd.com/fate-condensed/aspects-and-fate-points#situation-aspects",
  },
  {
    id:"campaign", icon:"fa-globe", label:"Campaign Frame",
    what:"One current issue (already causing problems), one impending issue (coming crisis), setting aspects, key faces, and important places.",
    how:"Defines what your world is fighting about — hand players the current issue and let the impending issue build pressure between sessions.",
    tip:"Current issues give the party something to react to. Impending issues create urgency. Setting aspects are always true - spend a fate point to invoke them like any other aspect.",
    rule:"Fate Condensed p.4 - Define your setting: issues are aspects that represent current and impending threats.",
    srd_url:"https://fate-srd.com/fate-condensed/getting-started#define-your-setting",
  },
  {
    id:"encounter", icon:"fa-burst", label:"Encounter",
    what:"A named opposition force, 2 possible twists, a victory condition, a defeat condition, and the GM's starting fate points.",
    how:"A complete action scene, ready to run — announce the victory condition first, hold the twist for when things feel settled.",
    tip:"The defeat condition is just as important as victory - it gives consequences weight. GM fate points = number of PCs.",
    rule:"Fate Condensed p.34–38 - Conflicts end when one side concedes or is taken out. GM fate points: p.44.",
    srd_url:"https://fate-srd.com/fate-condensed/conflicts",
  },
  {
    id:"seed", icon:"fa-seedling", label:"Adventure Seed",
    what:"A full one-page scenario skeleton: location, objective, complication, three-scene structure, opposition, victory/defeat conditions, and a mid-scene twist.",
    how:"An entire session from a standing start — read the opening hook as your first words, prep Scene 1 only, let the rest emerge.",
    tip:"A complete seed is one session of prep. Everything after Scene 1 is a reaction to the players, not a plan. The complication should force a choice, not just an obstacle.",
    rule:"Book of Hanz - A Fate session is a situation with pressure, not a plotted sequence of events.",
    srd_url:"https://fate-srd.com/fate-condensed/getting-started",
  },
  {
    id:"compel", icon:"fa-rotate-left", label:"Compel",
    what:"A concrete situation invoking a specific aspect, a consequence if accepted, and the fate point offer framing.",
    how:"The fastest way to create drama and move fate points — offer the point first, name the aspect, state the consequence.",
    tip:"A good compel creates dramatic interest, not punishment. If accepting feels narratively satisfying, it is a good compel. Players can refuse by spending 1 fate point — that's not failure, it's the economy working.",
    rule:"Fate Condensed p.25–26 — Compels offer a fate point for a complication. To refuse: the player spends 1 fate point instead. If refused, the situation doesn't happen. You can invoke free invokes or fate points but cannot keep compelling the same aspect in the same scene.",
    beginner_tip:"Offer the fate point visibly — hold it out. Say: 'Your aspect [X] suggests [situation]. I offer you a fate point if [complication] happens. You can refuse by spending one instead.' The player decides. No wrong answer.",
    dnd_notes:"D&D has Inspiration and story awards but no negotiated drama economy. Fate compels are offers, not punishments — refusing costs a fate point, accepting earns one. The GM is trying to make the character's story matter, not trap the player.",
    srd_url:"https://fate-srd.com/fate-condensed/aspects-and-fate-points#compels",
  },
  {
    id:"challenge", icon:"fa-bullseye", label:"Challenge",
    what:"A series of overcome rolls against fixed difficulties, resolved collectively. Not a Contest (opposed exchange-by-exchange competition).",
    how:"Turns a complex problem into 3-5 meaningful rolls — announce the stakes up front, let players Create Advantage before the big moment.",
    tip:"Keep challenges to 3–5 rolls. Longer drags the tension. Use Create Advantage first to set up the decisive action.",
    rule:"Fate Condensed p.32–33 - Challenges use overcome actions against set difficulties. Contests (p.33) are opposed rolls with a victory track.",
    srd_url:"https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests#challenges",
  },
  {
    id:"contest", icon:"fa-trophy", label:"Contest",
    what:"Two sides in direct opposition, exchange by exchange. First to 3 victories wins. Ties introduce twists.",
    how:"Tracks a race or rivalry exchange by exchange — visible victory track, ties introduce twists, succeed with style for double victories.",
    tip:"Announce the victory track visibly. Ties are the best part - they introduce new aspects that change the contest. Use them aggressively.",
    rule:"Fate Condensed p.33 - Contests: opposed overcome rolls, victory track (first to 3), twist on ties.",
    srd_url:"https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests#contests",
  },
  {
    id:"consequence", icon:"fa-bolt", label:"Consequence",
    what:"A lasting aspect taken to absorb a hit - mild (2), moderate (4), or severe (6). Must be treated before it clears.",
    how:"Lasting damage that drives story — write it as an evocative aspect, compel it at least once before it heals.",
    tip:"Compel the consequence at least once before it clears. Name it specifically: 'Badly Burned Hands' not 'Injured.'",
    rule:"Fate Condensed p.35–38 - Recovery: overcome Academics (physical) or Empathy (mental) at Fair/Great/Fantastic.",
    srd_url:"https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests#taking-harm",
  },
  {
    id:"faction", icon:"fa-flag", label:"Faction",
    what:"A group with a goal, method, weakness, and a named face NPC who represents it in play.",
    how:"Organisations that move the world between sessions — the named face is your session anchor, advance the goal off-screen.",
    tip:"Two factions with conflicting goals = engine. Three with overlapping methods = the ideal mess.",
    rule:"Fate Adversary Toolkit - Factions advance toward their goals between sessions if the PCs don't interfere.",
    srd_url:"https://fate-srd.com/fate-system-toolkit/factions",
  },
  {
    id:"complication", icon:"fa-triangle-exclamation", label:"Complication",
    what:"A mid-scene interruption: new aspect, arriving NPC, or environment shift. Drop when the scene has settled.",
    how:"Restores energy when a scene feels settled — introduce one element at a time and let players react before the next.",
    tip:"The best complications force a choice - solve the new problem or continue with the original goal.",
    rule:"Fate Condensed p.23 - New situation aspects created by complications persist until the scene changes.",
    srd_url:"https://fate-srd.com/fate-condensed/aspects-and-fate-points#situation-aspects",
  },
  {
    id:"backstory", icon:"fa-masks-theater", label:"PC Backstory",
    what:"Session Zero questions that draw out character history, a relationship web exercise, and an opening hook.",
    how:"Session Zero character creation that produces playable aspects — ask questions at the table together, write aspects as they talk.",
    tip:"Relationship web questions are more important than individual questions. Cross-PC history is fuel.",
    rule:"Fate Condensed p.4–5 - Character creation is collaborative. Aspects emerge from shared discussion.",
    srd_url:"https://fate-srd.com/fate-condensed/getting-started#create-your-characters",
  },
  {
    id:"obstacle", icon:"fa-shield-halved", label:"Obstacle",
    what:"A hazard, block, or distraction - an obstacle that cannot be attacked and taken out like an enemy.",
    how:"Splits player attention and rewards creative thinking — one per scene, announce the type, give non-combat PCs a way to shine.",
    tip:"One obstacle per combat scene is ideal. Give non-combat PCs a way to disable it while fighters handle enemies.",
    rule:"Fate Condensed p.49–51 - Obstacles: hazards, blocks, distractions. Adversary Toolkit expands.",
    srd_url:"https://fate-srd.com/fate-condensed/optional-rules#obstacles",
  },
  {
    id:"countdown", icon:"fa-clock", label:"Countdown",
    what:"A pacing clock: boxes that fill on triggers, with an outcome when the last box is checked.",
    how:"Visible urgency that paces the entire scene — place the track where everyone sees it, check boxes honestly, never fudge.",
    tip:"Put the track where players can see it. Physically marking boxes is one of the best tension tools in the game.",
    rule:"Fate Condensed p.47 - Countdowns: track + trigger + outcome.",
    srd_url:"https://fate-srd.com/fate-condensed/optional-rules#countdowns",
  },
  {
    id:"constraint", icon:"fa-lock", label:"Constraint",
    what:"A limitation (restricts an action with consequences) or a resistance (makes a target immune until bypassed).",
    how:"Forces Plan B and rewards investigation — announce limitations up front, let players discover bypasses through play.",
    tip:"One constraint per encounter. Two makes a puzzle. Three makes a slog. Always include a bypass for resistances.",
    rule:"Fate Adversary Toolkit - Constraints: countdowns, limitations, resistances.",
    srd_url:"https://fate-srd.com/fate-adversary-toolkit/constraints",
  },
];

export const SKILL_LABEL = { 1:"Average", 2:"Fair", 3:"Good", 4:"Great", 5:"Superb", 6:"Fantastic" };
export const ALL_SKILLS = ["Academics","Athletics","Burglary","Contacts","Crafts","Deceive","Drive","Empathy","Fight","Investigate","Lore","Notice","Physique","Provoke","Rapport","Resources","Shoot","Stealth","Will"];

// ── Session Zero world data — curated examples, issues, questions per campaign ──
export const WORLD_META = {
  thelongafter: { name: 'The Long After', icon: 'fa-compass', genre: 'Sword & Planet' },
  cyberpunk:    { name: 'Neon Abyss', icon: 'fa-microchip', genre: 'Cyberpunk' },
  fantasy:      { name: 'Shattered Kingdoms', icon: 'fa-dragon', genre: 'Dark Fantasy' },
  space:        { name: 'Void Runners', icon: 'fa-shuttle-space', genre: 'Space Western' },
  victorian:    { name: 'The Gaslight Chronicles', icon: 'fa-magnifying-glass', genre: 'Gothic Horror' },
  postapoc:     { name: 'The Long Road', icon: 'fa-biohazard', genre: 'Post-Apocalypse' },
  western:      { name: 'Dust and Iron', icon: 'fa-hat-cowboy', genre: 'Frontier Western' },
  dVentiRealm:  { name: 'dVenti Realm', icon: 'fa-dice-d20', genre: 'High Fantasy' },
};

export const WORLD_DATA = {
  thelongafter: {
    current:  [{ name: 'The Warlords Are Consolidating', desc: 'Three rival warlords have begun absorbing smaller settlements. Travel is dangerous. Tribute is mandatory.' }, { name: 'The Phade Vaults Are Waking Up', desc: 'Ancient automated systems are reactivating across the waste. Some offer miracles. Some enforce quarantine protocols.' }],
    impending: [{ name: 'The God-Machine Stirs', desc: 'Something beneath the Cradle is broadcasting. The signal is old. The response will not be kind.' }, { name: 'The Pilgrim Roads Are Being Taxed', desc: 'Movement between settlements now requires paying tribute to whoever controls the nearest checkpoint. Trade is dying. So is goodwill.' }],
    hc: ['Last Cartographer of the Before-Times', 'Scavenger-Priest of the Rusted Saints', 'Vault Delver Who Reads the Old Signs', 'Road Tax Collector with a Legitimate Monopoly'],
    troubles: ['The Map Shows a City That Shouldn\'t Exist', 'Faith Built on Parts That No Longer Fit', 'The Route That Pays My Salary Doesn\'t Exist Anymore', 'The Old Machines Listen to Me \u2014 and That Scares People'],
    questions: ['What do you carry from the Before-Times that you cannot use but will not abandon?', 'Which warlord\'s territory did you cross to get here, and what did you leave behind as payment?', 'What did the last Phade vault you entered show you that you wish you could forget?', 'Who taught you to survive, and why did they stop traveling with you?', 'What do you believe about the God-Machine, and how does that belief put you at odds with someone at this table?', 'What skill do you have that is useless in this world but defined who you were in the old one?'],
  },
  cyberpunk: {
    current:  [{ name: 'The Blackout Districts Are Expanding', desc: 'Corporate infrastructure is failing in the lower city. No grid, no law, no extraction.' }, { name: 'Neural Debt Is the New Slavery', desc: 'Corpo clinics offer free augmentation. The contract is lifetime. Default means repossession \u2014 of the implant, not the debt.' }],
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
    questions: ['What oath did you break, and who still holds you to the original terms?', 'What did the Blight change about someone you loved?', 'Which faction offered you protection, and what did they ask in return?', 'What magic do you carry that you don\'t fully understand?', 'Who at this table wronged you before the campaign begins \u2014 and do they know?', 'What is the one thing you would never do, no matter the cost?'],
  },
  space: {
    current:  [{ name: 'The Belt Is Blockaded', desc: 'Fleet patrols have cut off the outer stations. Supply chains are breaking. Prices are tripling.' }, { name: 'Jump Drive Fuel Is Running Out', desc: 'The refinery at Ceres went dark. Without new supply, long-range travel stops within months.' }],
    impending: [{ name: 'The Signal from Beyond the Gate', desc: 'Something is transmitting from outside charted space. The frequency matches no known language.' }, { name: 'A New Faction Is Buying Debt', desc: 'Someone is purchasing outstanding station contracts at face value. No one knows who or why. Ships that take the offer stop being heard from.' }],
    hc: ['Jump Drive Mechanic Three Payments Behind', 'Retired Fleet Medic Running Cargo', 'Salvage Auctioneer with a Questionable Ledger', 'Station-Born Pilot Who\'s Never Touched Dirt'],
    troubles: ['The Drive Works. The Paperwork Doesn\'t.', 'The Fleet Wants Me Back and Won\'t Take No', 'Half My Inventory Has Prior Owners', 'I\'ve Never Breathed Air I Didn\'t Pay For'],
    questions: ['What did you leave behind on your last station, and why can\'t you go back for it?', 'What does your ship mean to you \u2014 is it a tool, a home, or an escape?', 'Who in the Fleet still has authority over you, and what would it take to sever that tie?', 'What cargo did you agree to carry without asking what was inside?', 'What happened the last time you trusted a stranger in the void?', 'What do you owe, and to whom, and what happens when they collect?'],
  },
  victorian: {
    current:  [{ name: 'The Fog Hides Things That Hunt', desc: 'Disappearances in Whitechapel are accelerating. The police have stopped investigating.' }, { name: 'The Royal Society Has a Secret Wing', desc: 'Behind the lectures and papers, something is being studied that defies natural law.' }],
    impending: [{ name: 'The Threshold Is Thinning', desc: 'The boundary between what is real and what should not be is weakening. The signs are in the mirrors.' }, { name: 'The Clockwork Servants Are Dreaming', desc: 'Automated devices across the city are exhibiting unscheduled behaviours at night. The engineers who built them have no explanation.' }],
    hc: ['Alienist Who Studies What Studies Him Back', 'Society Photographer with a Darkroom Secret', 'Clockwork Surgeon Wanted by the College', 'Inspector Who Sees Patterns No One Else Can'],
    troubles: ['My Notes Are Starting to Write Themselves', 'Some Subjects Appear in the Negative That Weren\'t in the Room', 'My Methods Work. My Methods Are Illegal.', 'The Patterns Lead Somewhere I Don\'t Want to Go'],
    questions: ['What did you see that no one else believes?', 'Which institution protects you, and what do they expect in return?', 'What personal vice or obsession do you use to cope with what you know?', 'Who in your social circle would be destroyed if your true work were revealed?', 'What experiment or investigation went wrong, and what did it cost?', 'What draws you to the darkness \u2014 curiosity, duty, or something you can\'t name?'],
  },
  postapoc: {
    current:  [{ name: 'The Water War Has Started', desc: 'Two convoys are fighting over the last clean aquifer. Everyone else is choosing sides.' }, { name: 'Radio Silence from the Northern Settlements', desc: 'Three communities stopped broadcasting. Scouts haven\'t returned.' }],
    impending: [{ name: 'Winter Is Coming Early', desc: 'The growing season is shortening. Food stores won\'t last. Migration or conflict is inevitable.' }, { name: 'The Seeds Aren\'t Germinating', desc: 'This season\'s planting has produced almost nothing. The soil isn\'t dead \u2014 something is in it that shouldn\'t be.' }],
    hc: ['Convoy Medic Who Buries What She Can\'t Fix', 'Water-Finder Who Charges What the Water\'s Worth', 'Radio Operator Who Heard Something in the Static', 'Former Teacher Keeping Knowledge Alive'],
    troubles: ['The Graves Are Catching Up', 'Everyone Needs Me. Nobody Trusts Me.', 'The Voice on the Radio Knows My Name', 'The Children Don\'t Understand What Was Lost'],
    questions: ['What do you remember about the world before, and how does that memory help or hurt you?', 'Who did you fail to save, and how does that shape what you do now?', 'What resource do you control or protect, and who wants to take it from you?', 'What rule have you made for yourself that you will not break?', 'Who at this table did you meet on the road, and what happened that made you decide to travel together?', 'What are you walking toward \u2014 a place, a person, or an idea?'],
  },
  western: {
    current:  [{ name: 'The Railroad Is Buying Everything', desc: 'Land agents are making offers that aren\'t optional. Holdouts are finding their water rights disputed.' }, { name: 'A Hanging Gone Wrong', desc: 'The wrong man swung. The real killer is still out there. The town knows but won\'t speak.' }],
    impending: [{ name: 'The Army Is Coming', desc: 'Fort Reno is deploying a full regiment. Whatever they\'re responding to, the frontier won\'t be the same after.' }, { name: 'The Water Rights Are Being Redrawn', desc: 'A federal surveyor arrived last week with new maps. By his reckoning, every claim downstream of the ridge belongs to the railroad now.' }],
    hc: ['Land Surveyor Working Both Sides of the Deed', 'Circuit Rider Preacher with a Warrant', 'Assay Office Clerk Who Knows Every Vein', 'Former Cavalry Scout Who Walked Away'],
    troubles: ['Three Towns Believe the Same Acre Is Theirs', 'The Lord\'s Work and the Law\'s Work Crossed Once', 'The Company Pays My Salary and Owns My Silence', 'I Saw What Happened at Sand Creek'],
    questions: ['What brought you west \u2014 opportunity, escape, or something you can\'t name?', 'What do you own that someone powerful wants?', 'Which side of the law are you on, and has that always been the case?', 'Who do you owe a debt to that money can\'t settle?', 'What happened in the last town that means you can\'t go back?', 'What do you believe about justice, and when was that belief last tested?'],
  },
  dVentiRealm: {
    current:  [{ name: 'The Senate Has Collapsed', desc: 'The governing body of the realm has dissolved. Regional powers are filling the vacuum. Law is local and contradictory.' }, { name: 'The Vaults Are Opening', desc: 'Ancient sealed repositories are cracking. What comes out is valuable, dangerous, and claimed by multiple factions.' }],
    impending: [{ name: 'The Sealed Ones Are Waking', desc: 'The things that were locked in the Vaults are becoming aware. They are not grateful.' }, { name: 'The Arbiters\' Guild Has Gone Quiet', desc: 'The guild that mediated disputes between the regional powers has stopped responding to summons. Without them, every disagreement becomes a confrontation.' }],
    hc: ['Vault Warden Who Lost Their Key', 'Senate Exile with Dangerous Testimony', 'Guild Artificer Whose Creations Malfunction Creatively', 'Wandering Arbiter with No Authority Left'],
    troubles: ['The Key Wasn\'t Lost \u2014 It Was Taken', 'My Testimony Would Destroy Three Houses', 'The Malfunctions Are Getting Smarter', 'I Judge by Laws That No Longer Exist'],
    questions: ['What was your role before the Senate fell, and what is it now?', 'Which Vault have you seen opened, and what came out?', 'What faction wants your loyalty, and what are they offering?', 'What skill or knowledge do you have that makes you valuable \u2014 and dangerous?', 'Who at this table do you know from before the collapse, and has your relationship changed?', 'What would you restore if you could \u2014 the Senate, the Vaults, or something else entirely?'],
  },
};
