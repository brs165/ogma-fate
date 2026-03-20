// data/shared.js
// Shared constants: GENERATORS, GENERATOR_GROUPS, HELP_CONTENT, HELP_ENTRIES,
// SKILL_LABEL, ALL_SKILLS.
// Also declares the CAMPAIGNS object that campaign files populate.
// Must be loaded before any data/[campaign].js file.

// Populated by data/[campaign].js files
var CAMPAIGNS = {};

var GENERATORS = [
  {id:"npc_minor",  label:"Minor NPC",       icon:"◈", sub:"1–2 aspects · skills · stress"},
  {id:"npc_major",  label:"Major NPC",        icon:"◆", sub:"5 aspects · skill pyramid · stunts"},
  {id:"scene",      label:"Scene Setup",      icon:"◉", sub:"Situation aspects · zones"},
  {id:"campaign",   label:"Campaign Frame",  icon:"◇", sub:"Current + impending + setting"},
  {id:"encounter",  label:"Encounter",        icon:"⚔", sub:"Opposition · stakes · twist"},
  {id:"seed",       label:"Adventure Seed",   icon:"◎", sub:"3-scene skeleton · opposition · stakes · twist"},
  {id:"compel",     label:"Compel",     icon:"⊗", sub:"Aspect situation · consequence · GM tip"},
  {id:"challenge",  label:"Challenge",        icon:"⬡", sub:"Series of overcome rolls · stakes · success/failure"},
  {id:"contest",    label:"Contest",          icon:"🏁", sub:"Opposed exchanges · victory track · twist on tie"},
  {id:"consequence", label:"Consequence",     icon:"⚡", sub:"Mild · moderate · severe · compel hook"},
  {id:"faction",     label:"Faction",         icon:"⚑", sub:"Name · goal · method · weakness · face"},
  {id:"complication",label:"Complication", icon:"⚠", sub:"New aspect · arrival · environment shift"},
  {id:"backstory",   label:"PC Backstory",    icon:"📖", sub:"Session Zero questions · relationship web · hook"},
  {id:"obstacle",    label:"Obstacle",        icon:"🛡", sub:"Hazard · block · distraction - not an enemy"},
  {id:"countdown",   label:"Countdown",       icon:"⏱", sub:"Track · trigger · outcome - pacing pressure"},
  {id:"constraint",  label:"Constraint",      icon:"🔒", sub:"Limitation or resistance - forces Plan B"},
];

var GENERATOR_GROUPS = [
  {id:"people",    label:"People",    icon:"👤", gens:["npc_minor","npc_major","backstory"]},
  {id:"scene",     label:"Scene",     icon:"🎬", gens:["scene","encounter","complication"]},
  {id:"story",     label:"Story",     icon:"🌍", gens:["seed","campaign","faction"]},
  {id:"mechanics", label:"Mechanics", icon:"⚙",  gens:["compel","consequence","challenge","contest","obstacle","countdown","constraint"]},
];



var HELP_CONTENT = {
  npc_minor: {
    title: "Minor NPC",
    what: "Nameless antagonists, hired muscle, bystanders, and anyone the party won't remember by name. Use freely - they are designed to be defeated, not survived.",
    output: "1–2 aspects (high concept + optional weakness), 1–2 skills, occasional stunt, 1–3 stress boxes. No consequence slots.",
    rules: [
      "Minor NPCs have no consequence slots - one good hit can take them out.",
      "In groups, you can optionally treat a mob as sharing a single stress track (a Fate Toolkit technique). By default, each minor NPC has their own 1–3 boxes.",
      "Their weakness aspect is your best compel lever. Invoke it for +2 to tip a roll, or compel it to create complications - whichever fits the moment.",
      "Minor NPCs don't concede - they break, flee, or get taken out. Describe it cinematically.",
    ],
    gm_tips: [
      "When a PC rolls well, narrate the defeat and skip the dice — mooks exist to lose with style, not to survive.",
      "Give each one line of dialogue and one visible motivation. Anything more is wasted prep.",
      "Invoke or compel the weakness aspect in the first exchange. Every time. Don't explain — just do it.",
      "In a mob, treat the group as a single entity with one shared stress track. One strong hit clears multiple."
    ],
    invoke_example: "The mook's aspect is 'Only Follows Orders.' A PC wants to rush past them. Spend a fate point to invoke it for +2 on Athletics — someone who only follows orders doesn't improvise when something unexpected happens.",
    compel_example: "The same mook is standing guard. The GM offers a fate point: the mook's 'Only Follows Orders' aspect fires — they sound the alarm before the PCs can act, because that's what their orders say to do.",
    beginner: {
      what: "A minor NPC is a simple character the GM controls — a guard, a shopkeeper, a thug in a back alley. They're not meant to survive long. Think of them as extras in a movie: they show up, do their thing, and get out of the way.",
      terms: [
        ["Aspect", "A short phrase that's true about a character or scene. Used to get bonuses or create complications."],
        ["Stress", "Boxes you check off when you take a hit. When they're all checked, you're out of the fight."],
        ["Stunt", "A special ability that gives +2 in a specific situation, or lets you do something once per scene."],
        ["Invoke", "Spend a fate point + name a relevant aspect to get +2 on your dice roll."],
        ["Compel", "The GM offers you a fate point to accept a complication based on an aspect."],
      ],
    },
  },
  npc_major: {
    title: "Major NPC",
    what: "Villains, faction leaders, rivals, mentors - characters who drive the story and survive more than one scene.",
    output: "5 aspects (high concept, trouble, 3 others), skill pyramid, 2 stunts, full stress tracks + all three consequence slots, Refresh 3.",
    rules: [
      "Treat exactly like a PC in conflict - they can concede, take consequences, and invoke aspects.",
      "Their trouble aspect is your primary compel lever. Use it in the first scene they appear.",
      "High concept = what they are. Trouble = what makes them a problem and a person.",
      "Major NPCs start each scene with fate points from the GM's shared pool. The pool = 1 per PC facing opposition. Spend to invoke aspects or compel PCs.",
      "A major NPC who concedes escapes - and comes back with more resources and a grudge.",
    ],
    gm_tips: [
      "Let them concede their first conflict. A villain who escapes with a grudge and earned fate points is worth ten who die in session one.",
      "Show the high concept in action before the PCs engage. Let them win something off-screen so the players respect the stakes.",
      "Let them invoke their own high concept for +2 on their biggest roll. Make the players feel the gap between capable and dangerous."
    ],
    invoke_example: "The villain's high concept is 'Ruthless Veteran Who's Seen Everything.' They're interrogating a prisoner. Spend a fate point to give them +2 on Provoke — decades of experience make the pressure feel precise, not angry.",
    compel_example: "The villain has the party cornered. The GM offers a fate point on their trouble: 'Can't Let Go of the Old Code.' They hesitate — not mercy, just something personal they can't finish. The party escapes. The villain hates themselves for it.",
    beginner: {
      what: "A major NPC is a fully-detailed character the GM controls — a villain, a rival, a powerful ally. They have a complete character sheet just like a player character: aspects that define who they are, skills that say what they're good at, stunts that give them special abilities, and stress tracks that determine how much punishment they can take.",
      terms: [
        ["High Concept", "The one phrase that captures who this character is. 'Burned Ex-Corp Fixer' tells you everything you need to know."],
        ["Trouble", "What makes their life complicated — and what the players can exploit."],
        ["Refresh", "The number of fate points this NPC starts with. Default 3, reduced by extra stunts."],
        ["Concede", "Instead of being defeated, an NPC can give up and leave the scene. They survive — and come back later."],
        ["Skill Pyramid", "Skills arranged in a pyramid shape: one highest, two next, three below that. Higher = better at it."],
      ],
    },
  },
  scene: {
    title: "Scene Setup",
    what: "Situation aspects for any scene - combat, social, exploration, tense standoffs, chases. Use for any situation with meaningful conflict.",
    output: "3–5 tagged situation aspects (tone, movement, cover, danger, usable) plus 2–4 named zones with their own aspects.",
    rules: [
      "Situation aspects exist until removed by an overcome action or the scene ends.",
      "Anyone (PC or NPC) can invoke them for +2 or a reroll. GMs can compel them.",
      "🎲 Free invoke shown on an aspect = it's pre-placed for players to find. Hand them an index card. In play, free invokes come from Create Advantage.",
      "Zones limit movement. Moving past opposition into another zone costs an action if contested.",
      "Zone aspects are always true - they define what's possible in the zone. Invoke them for +2 with a fate point, as with any aspect.",
    ],
    gm_tips: [
      "Announce exactly two aspects up front — the ones any alert person notices. The rest get discovered through Notice, Investigate, or getting hit.",
      "The hidden aspect is your best tool. Decide before the scene starts which one the players don't know yet — it's your compel setup.",
      "When a PC fails a roll, check whether a scene aspect just got worse or a new one just appeared.",
      "Name each zone and give it one aspect. Players will immediately start exploiting them — that's the point."
    ],
    invoke_example: "The scene has 'Slippery Deck' as a zone aspect. A PC is chasing someone across the boat. Spend a fate point to invoke 'Slippery Deck' - the target loses their footing, giving the PC +2 on their Athletics roll to catch them.",
    compel_example: "The same 'Slippery Deck' is in play when a PC tries to take a precise shot. The GM offers a fate point: the aspect compels a misfire - the PC slips just as they fire, and the shot goes wide. They take the fate point and accept the consequence.",
    beginner: {
      what: "This generates the setup for a scene — the place where the action happens. It creates situation aspects (short phrases describing what's true about the environment) and zones (distinct areas characters can move between). Think of it as the GM describing the room before the action starts.",
      terms: [
        ["Situation Aspect", "A phrase that's true about the scene: 'Slippery Deck,' 'Thick Smoke,' 'Crowded Market.' Anyone can use these for bonuses or complications."],
        ["Zone", "A distinct area within the scene. A bar might have zones: 'Behind the Counter,' 'Dance Floor,' 'Back Alley.' Moving between zones can cost an action."],
        ["Free Invoke", "A one-time bonus you get when you discover or create an aspect. Use it for +2 without spending a fate point."],
      ],
    },
  },
  campaign: {
    title: "Campaign Frame",
    what: "The macro-level threats and permanent truths that define your campaign world. These are your session-to-session compel engine.",
    output: "1 current issue (immediate, active threat), 1 impending issue (building pressure), 3 setting aspects (permanent world truths).",
    rules: [
      "Current issues are happening NOW - they create compel pressure every single session.",
      "Impending issues become current if the party fails to address them.",
      "Setting aspects are always true, always invokable, and never go away.",
      "Issues have faces (named NPCs) and places - these are ready-made hooks for scenes.",
      "You can compel an issue aspect whenever a PC's goals conflict with the larger threat.",
    ],
    gm_tips: [
      "The current issue is your automatic compel engine. Every time a PC's goal bumps against it, you have a compel ready.",
      "The impending issue is a clock. Narrate it advancing one step between sessions when the party ignores it. Make the progression visible.",
      "Setting aspects are always true, always invokable, always compellable. They are not flavour — they are permanent pressure.",
      "Faces have off-screen agendas. Decide each session what one face did while the party was busy, then show the consequences."
    ],
    invoke_example: "The setting aspect is 'Everyone Here Has Lost Something.' A PC is negotiating with a reluctant contact. Invoke the aspect for +2 on Rapport — shared loss creates trust faster than any argument.",
    compel_example: "A PC is trying to stay low-profile, but the current issue is 'The Authority Is Tightening Its Grip.' The GM offers a fate point: a patrol appears on their route. They take the complication and the fate point.",
    beginner: {
      what: "This generates the big-picture setup for your game world — the major problems everyone is dealing with, the looming threats on the horizon, and the truths about the setting that never change. Think of it as the backdrop that makes every individual scene matter.",
      terms: [
        ["Current Issue", "A problem that's happening RIGHT NOW in the world. It affects everyone and creates pressure every session."],
        ["Impending Issue", "A problem that's building. If nobody deals with it, it becomes the next current issue."],
        ["Setting Aspect", "A permanent truth about the world. 'The River Divides the Rich from the Poor' — always true, always usable."],
        ["Face", "A named NPC who represents an issue or faction. They make abstract problems feel personal."],
      ],
    },
  },
  encounter: {
    title: "Encounter",
    what: "Full conflict setup - framing, opposition, stakes, and a twist. Works for combat, chases, social confrontations, and dramatic scenes.",
    output: "Situation aspects, zones, mixed opposition (minor + possibly major NPC), GM fate points, victory/defeat conditions, mid-scene twist.",
    rules: [
      "GM fate points = number of PCs. This is your entire compel budget for the scene.",
      "Spend fate points to: compel a PC aspect or invoke an aspect for an NPC. Stunts activate automatically when their conditions are met - no fate point cost.",
      "State victory/defeat conditions BEFORE the first dice roll. 'Kill everything' is rarely the right goal.",
      "Popcorn initiative (p.31): after acting, that character passes initiative to anyone who hasn't gone yet - PC or NPC. At the start, the situation determines who goes first.",
      "The twist is a mid-encounter complication. Drop it when the outcome feels settled - not at the start.",
      "Fail a roll? Offer: succeed with a minor cost (complication, bad aspect) or a major cost (consequence, serious setback). Never just say no.",
      "Conceding (p.37): before being taken out, anyone can concede. They narrate their exit, earn 1 FP per consequence taken. Let villains concede - they come back.",
      "Full Defense (p.48): skip your action, get +2 to all defends this round. Use when holding ground or covering someone.",
      "Teamwork (p.32): one rolls, each helper with Average (+1)+ in a relevant skill adds +1. No cap on helpers, just that +1 each.",
    ],
    gm_tips: [
      "Your first sentence at the table is the victory condition — say it aloud before any dice roll. Everything else follows.",
      "GM fate points start at 1 per PC. That's your entire compel and invoke budget. Spend it deliberately.",
      "Hold the twist until the outcome feels settled. Dropping it too early kills the tension it was meant to restore.",
      "Offer success at a cost before flat failure — it keeps the fiction moving.",
      "Popcorn initiative: whoever just acted names who goes next. Nobody waits for their turn."
    ],
    invoke_example: "The scene aspect is 'Emergency Lights Only - Red and Wrong.' An NPC is fleeing. Spend a GM fate point to invoke the aspect against the chasing PC's Notice roll: −2, because the strobing red light keeps destroying their depth perception.",
    compel_example: "A PC has the aspect 'I Always Check the Exits.' The encounter starts in a room with blocked exits. The GM offers a fate point: the compel makes the PC spend the first exchange assessing escape routes instead of acting offensively. Drama, not punishment.",
    beginner: {
      what: "This generates a complete fight, chase, or confrontation — everything the GM needs to run an action scene. It includes the enemies, the environment, what counts as winning, and a twist to drop in when things get predictable.",
      terms: [
        ["Opposition", "The enemies or obstacles the players face. Minor NPCs go down fast; major NPCs fight back hard."],
        ["Victory Condition", "What 'winning' looks like. Not always killing enemies — might be escaping, protecting someone, or reaching a location."],
        ["Defeat Condition", "What happens if the players lose. Makes the stakes feel real."],
        ["GM Fate Points", "The GM's budget for the scene. Equal to the number of players. Spend them to boost enemies or create complications."],
        ["Twist", "A mid-scene surprise: reinforcements arrive, the building starts collapsing, the hostage turns out to be the real threat."],
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
    title: "Adventure Seed",
    what: "A complete one-page scenario skeleton - location, objective, complication, three-scene structure, opposition, victory and defeat conditions, and a mid-scene twist. Everything needed to run a session from a standing start.",
    output: "Location · Objective · Complication · Scene 1 opening · Scene 2 midpoint · Scene 3 climax · Opposition · Victory/Defeat conditions · Twist · Campaign issue tie-in",
    rules: [
      "State the victory condition before the first roll. Players need to know what winning looks like.",
      "The defeat condition is equally important - it gives the stakes real weight.",
      "Scene 1 is a framing tool. Run it as written, then follow the players wherever they go.",
      "The twist is for when the outcome feels settled. Drop it then - not at the start.",
      "Opposition here follows the same rules as Encounter opposition - mooks and/or a major NPC.",
      "The three-scene structure is a suggestion, not a script. Real sessions are messier and better.",
    ],
    tips: [
      "The complication should force a choice, not just add an obstacle. Choices are drama.",
      "Pull your literal first sentence from the opening description. Read it exactly.",
      "Prep Scene 1 and nothing else. The rest emerges.",
    ],
    invoke_example: "The setting aspect is 'Nobody Asks Questions After Dark.' A PC is trying to bluff their way past a guard. Invoke it for +2 on Deceive — the guard doesn't want to know, because knowing means paperwork and trouble.",
    compel_example: "The complication is 'The Person Who Hired Them Is Already Dead.' A PC has the trouble 'I Never Walk Away from a Job.' The GM offers a fate point: the compel locks them into finishing the job even though the situation has completely changed and every smart move says to leave.",
    beginner: {
      what: "This generates a complete one-session adventure — a location, an objective, complications, three scenes, and win/lose conditions. Everything a GM needs to run a game night from a standing start, even with zero prep time.",
      terms: [
        ["Adventure Seed", "A scenario seed for one session of play. Not a full script — just enough structure to start playing."],
        ["Scene 1 / 2 / 3", "A three-scene arc: opening (drop players in), midpoint (complicate things), climax (resolve it). Flexible, not rigid."],
        ["Complication", "Something that forces the players to make a hard choice. Not just an obstacle — a dilemma."],
        ["Opening Hook", "The GM's very first sentence at the table. Sets the scene instantly. No preamble."],
      ],
    },
  },
  compel: {
    title: "Compel",
    what: "A situation that invokes a specific PC aspect, a natural consequence if accepted, and guidance on the fate point offer.",
    output: "Situation description, consequence if accepted, and the fate point offer framing.",
    rules: [
      "Compels work on aspects - find one that creates genuine tension, not just inconvenience.",
      "Offer the fate point before stating the consequence. The player accepts or pays 1 to refuse.",
      "The consequence should complicate the current scene, not punish the character.",
      "Quick test: remove the fate point from the offer. Would the complication still make the story better? Yes = good compel. No = reframe it.",
      "Refusal costs the player 1 FP. Note it - a drained player is primed to accept the next one.",
      "Remind players they can compel their own aspects. The best player-initiated compels are the ones you didn't see coming.",
    ],
    gm_tips: [
      "Compel in Scene 1. It signals to the players that the mechanic is live and fate points are moving.",
      "Offer the fate point first, then state the complication. This order makes acceptance feel like agency rather than punishment.",
      "Two to three compels per session is the right cadence. If an hour passes without one, offer one now.",
      "Two refusals means you're finding the right aspects. The refusal still costs them a fate point — that's fine.",
      "Compel the situation, not the character. 'Your aspect means this happens' is stronger than 'your aspect means you fail.'"
    ],
    invoke_example: "A PC has the aspect 'Loyalty to the Crew Above All.' They're trying to talk a neutral contact into helping. Invoke the aspect for +2 on Rapport - their genuine commitment to protecting people reads as trustworthy, not just desperate.",
    compel_example: "The same PC has gathered intel the crew needs urgently. But the situation aspect 'Every Exit Has Eyes' is in play. The GM offers a fate point: their loyalty compel fires - they can't leave a teammate who's still inside, even though it means walking through the surveillance zone.",
    beginner: {
      what: "A compel is when the GM uses one of your character's aspects to create a complication. The GM offers you a fate point: if you accept, the complication happens and you gain the fate point. If you refuse, you spend a fate point to avoid it. This is the core drama engine of Fate — your character's personality creates both advantages and problems.",
      terms: [
        ["Compel", "The GM says: 'Because of your aspect, this complication happens. Here's a fate point.' You choose to accept or refuse."],
        ["Fate Point", "A token you spend for +2 bonuses and earn by accepting compels. The flow of fate points IS the pacing of the game."],
        ["Accept", "Take the fate point, accept the complication. Your character's personality just drove the story."],
        ["Refuse", "Spend a fate point to avoid the complication. You stay in control, but you're poorer."],
      ],
    },
  },
  challenge: {
    title: "Challenge",
    what: "A structured non-combat situation requiring a series of overcome actions against fixed difficulties. Not a Contest (opposed exchange-by-exchange competition) - a Challenge is a collective effort against a problem.",
    output: "Challenge name and description, primary skill(s), opposing force with difficulty, success and failure outcomes, campaign stakes.",
    rules: [
      "State the challenge type and primary skill before any dice roll. Players need to know the playing field.",
      "Opposing force = what is working against them. Give it a difficulty number (usually 2–4 for standard, 5+ for hard).",
      "Declare success AND failure outcomes before the first roll - both need to matter.",
      "Use Create Advantage to let players set up for the decisive roll. Reward preparation.",
      "Failure changes the situation and costs something. It's not a dead end.",
      "Place a free invoke on a scene aspect before the challenge starts. It's a gift the players will remember.",
    ],
    gm_tips: [
      "A challenge is right when a single roll feels arbitrary but a full conflict would be overkill.",
      "Declare the primary skill and difficulty before any dice touch the table. Players need the playing field first.",
      "Let players Create Advantage before the decisive roll — reward preparation with free invokes when it matters.",
      "Keep it to 3-5 rolls. Past five, the tension deflates. End it decisively.",
      "Failure changes the situation — it never ends the scene. Ask what failure looks like before the roll."
    ],
    invoke_example: "The challenge is breaking into a locked archive. A PC used Create Advantage earlier to place 'Guard Rotation on a Predictable Loop.' Now they invoke that free invoke for +2 on Burglary — the window is exactly where they predicted.",
    compel_example: "Halfway through the same challenge, a PC has the aspect 'My Tools Are Always Jury-Rigged.' The GM offers a fate point mid-challenge: a critical piece of equipment fails at the worst moment, raising the difficulty of the next roll. They take the fate point. The tension spikes.",
    beginner: {
      what: "A challenge is a structured problem that takes several rolls to solve but isn't a fight. Breaking into a vault, navigating a storm, performing a ritual. Multiple skills, multiple rolls, one goal. Think of it as a montage — each roll is a step in the plan.",
      terms: [
        ["Challenge", "A multi-roll problem. Each roll uses a different skill. Success and failure both change the situation."],
        ["Overcome", "The action you use in a challenge — you're trying to get past an obstacle or difficulty."],
        ["Difficulty", "A target number set by the GM. Fair (+2) is routine, Good (+3) is hard, Great (+4) is very hard."],
        ["Create Advantage", "Set up a helpful aspect before the big roll. Successful setup gives a free +2 boost."],
      ],
    },
  },
  contest: {
    title: "Contest",
    what: "Two or more sides in direct opposition, resolved exchange by exchange with a victory track. First to 3 victories wins. Use for chases, races, debates, tense negotiations, ritual duels, and any situation where both sides are actively competing but not trying to harm each other directly.",
    output: "Contest type and framing, both sides with primary skills, victory track (first to 3), twist pool for ties, situation aspects, and success/failure outcomes.",
    rules: [
      "Each exchange: one character per side overcomes. Allies add +1 (teamwork) or try Create Advantage - risky if they fail (see below).",
      "Highest effort marks a victory. Succeed with style and no one else does = two victories.",
      "First to 3 victories wins. For longer contests, use up to 5 (but no more).",
      "On a tie for highest effort, NO ONE marks a victory. Instead, the GM introduces a new situation aspect - an unexpected twist that changes the contest.",
      "Creating Advantages in a contest is risky (p.33): if you fail, your side either forfeits its overcome roll OR you give the other side a free invoke to preserve your roll.",
      "In dangerous environments, add a hazard aspect and compel it as normal. The victory track is unchanged.",
    ],
    gm_tips: [
      "Put the victory track (first to 3) on the table where everyone can see both sides. The visible score is half the tension.",
      "Ties are your most powerful tool. When nobody marks a victory, immediately introduce a new situation aspect — don't pause to think.",
      "Succeed with style (2+ shifts, other side didn't): mark 2 victories. This is the swing moment — watch for it.",
      "Creating Advantage during a contest costs your action for that exchange. It's a calculated gamble, not a free move.",
      "The tie-twist is where session stories come from. Treasure it."
    ],
    invoke_example: "It's a chase, tied at 2–2. The situation aspect 'Gridlock Makes Every Route a Gamble' is in play. The pursuing PC spends a fate point to invoke it: the target is slowed by traffic, giving the PC +2 on Athletics. Victory 3. Chase over.",
    compel_example: "Same chase, at 1–2 against the party. A PC has the trouble 'Can't Pass Up a Score.' They're running through a market district. The GM offers a fate point: a distraction catches their eye - something valuable sitting unattended. They hesitate. The target gains ground. The trade-off is perfect.",
    beginner: {
      what: "A contest is a race between two sides — a chase, a debate, a ritual duel. Each round, both sides roll. Whoever rolls higher scores a victory point. First to 3 victories wins. When both sides tie, nobody scores and something unexpected happens instead.",
      terms: [
        ["Contest", "A back-and-forth competition. Not trying to hurt each other — trying to outperform. Chases, races, debates."],
        ["Victory Track", "A visible scoreboard. First to 3 (or sometimes 5) wins. Put it on the table where everyone can see."],
        ["Exchange", "One round of the contest. Both sides roll, highest wins that round."],
        ["Tie", "When nobody wins the round. Instead, the GM introduces a twist — a new complication that changes the contest."],
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
    what: "A consequence is an aspect a character takes to avoid being taken out. It absorbs a hit but creates a new problem that persists - and can be compelled.",
    output: "Severity level (mild/moderate/severe), a named consequence aspect, the context in which it was suffered, and a compel hook to use in the next scene.",
    rules: [
      "Consequences have three severity levels - mild (2 stress absorbed), moderate (4), severe (6).",
      "Mild clears after the next scene where recovery is addressed - but first requires a successful overcome roll (Fair +2). Moderate: overcome at Great +4, then clears after a full session. Severe: overcome at Fantastic +6, then clears after a breakthrough (FCon p.39) with treatment complete. Use Academics for physical, Empathy for mental. Difficulty +2 if treating yourself.",
      "Anyone can invoke or compel it - including the character who took it.",
      "The GM should compel the consequence at least once before it clears. That is how it earns its keep.",
      "Unlike D&D hit points, consequences are not just damage - they are story hooks with mechanical teeth.",
    ],
    tips: [
      "Name them evocatively. 'Badly Burned Hands' beats 'Injured' every time - it does more narrative work.",
      "Compel it in the very next scene. Don't wait. Establishing the pattern early is everything.",
      "Remind players they can invoke their own consequences for +2 when the fiction supports it. They forget.",
    ],
    invoke_example: "A PC has the consequence 'Badly Burned Hands' from last session. Now they're trying to intimidate a prisoner. They invoke their own consequence for +2 on Provoke — they hold up their bandaged hands and say 'You think I'm afraid of pain?'",
    compel_example: "Same consequence, next scene. The PC needs to pick a lock under pressure. The GM offers a fate point: 'Badly Burned Hands' makes fine motor control unreliable. They accept the complication, take the fate point, and try anyway — with shaking fingers.",
    beginner: {
      what: "When your character gets hurt in a fight and stress boxes aren't enough, you take a consequence — a lasting injury written as an aspect. 'Badly Burned Hands' or 'Shattered Confidence.' It absorbs some of the hit, but now that phrase is true about your character until it heals. Anyone — including your enemies — can invoke or compel it.",
      terms: [
        ["Consequence", "A named injury/condition written on your sheet. It absorbs damage but creates a new aspect others can use against you."],
        ["Mild (−2)", "A minor injury. Clears after one scene with treatment. Example: 'Winded.'"],
        ["Moderate (−4)", "A serious injury. Clears after a full session with treatment. Example: 'Cracked Ribs.'"],
        ["Severe (−6)", "A major trauma. Clears after a breakthrough with treatment. Example: 'Crippled Leg.'"],
        ["Treatment", "A roll to start the healing process. Academics for physical, Empathy for mental."],
        ["Taken Out", "If you can't absorb all the damage with stress and consequences, you're out. The attacker decides what happens."],
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
    what: "A group with a unified goal, a consistent method of pursuing it, an exploitable weakness, and a named face NPC who represents it in play.",
    output: "Faction name, goal, method, weakness, and one named face NPC with a role description.",
    rules: [
      "Factions are not statted - they exert pressure through NPCs, compels, and scene aspects.",
      "Give the faction an aspect - a true statement about how it operates. Use it like any aspect.",
      "The named face is a full major NPC - run them with the Major NPC generator.",
      "Faction goals drive the campaign clock. If PCs do nothing, factions advance toward their goals.",
      "Weaknesses are not automatically known to the PCs - they have to discover them through play.",
    ],
    tips: [
      "Two factions with conflicting goals = engine. Three with overlapping methods = the ideal mess.",
      "Between sessions: narrate what each faction achieved off-screen. One sentence each. It makes them feel real.",
      "The named face has a personal goal that doesn't perfectly align with the faction's. That misalignment is the hook.",
    ],
    invoke_example: "The faction's method is 'Controls the Supply Lines.' A PC is trying to understand why a settlement is running low on essentials. Invoke the faction's aspect for +2 on Investigate — the shortage pattern suddenly makes sense as deliberate pressure, not bad luck.",
    compel_example: "The party's contact was going to help. The GM offers a fate point: the faction's reach triggers — the contact goes quiet because they've been warned. The faction isn't attacking. It's just reminding everyone who runs things here.",
    beginner: {
      what: "A faction is an organized group with its own goals — a guild, a government, a criminal network, a religion. They act in the background between sessions, advancing their plans whether the players pay attention or not. You don't fight a faction directly — you deal with their agents, undermine their plans, or turn their people.",
      terms: [
        ["Faction", "An organization with a goal, a method, and a weakness. They're not stat blocks — they're pressure."],
        ["Named Face", "The NPC who represents the faction in play. You talk to the face, not the faction."],
        ["Goal", "What the faction wants. If the players do nothing, the faction moves toward this every session."],
        ["Weakness", "How the faction can be undermined. Players discover it through investigation and clever play."],
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
    what: "A mid-scene interruption: a new aspect enters the fiction, someone arrives uninvited, or the environment shifts. Use when the scene has settled or the dice produce a failure with interesting consequences.",
    output: "Complication type, new scene aspect, an arriving NPC, an environmental shift, and a spotlight recommendation for which to lead with.",
    rules: [
      "A complication is not a punishment - it is a new set of fictional facts that change what is possible.",
      "New aspects from complications can be invoked immediately with a free invoke if a PC helped create them.",
      "Arrivals should enter with their own agenda. They are not there to help or hinder - they are there.",
      "Environment shifts may create new zones, require Overcome rolls to traverse, or change which skills apply.",
      "The GM can compel any new aspect immediately - and should offer fate points to do so.",
    ],
    tips: [
      "One element, then pause. Let them react before the next one lands.",
      "The best complication is a choice: solve the new problem or push forward. Both should hurt a little.",
      "If they Created Advantage to set up, invert one of those free invokes as the complication. Personal.",
    ],
    invoke_example: "A complication just introduced 'Someone Is Watching from the Rooftop' as a scene aspect. A PC is trying to move unseen. They invoke the new aspect for +2 on Stealth — knowing where the watcher IS means knowing where the blind spots are.",
    compel_example: "Same aspect, different PC. A PC with 'I Don't Leave Without What I Came For' is mid-extraction. The GM offers a fate point: the watcher makes the clean exit impossible. Accept the complication — leave empty-handed, or be seen.",
    beginner: {
      what: "A complication is something the GM drops into the middle of a scene to shake things up — a new problem appears, someone unexpected arrives, or the environment changes. It's not punishment; it's the story getting more interesting. Used when the scene feels too settled or predictable.",
      terms: [
        ["Complication", "A new fictional fact that changes what's possible in the scene. Not 'you fail' — 'something new is happening.'"],
        ["Scene Aspect", "A complication often creates a new aspect everyone can use. 'The Bridge Is Collapsing' is now true for everyone."],
        ["Free Invoke", "When a new aspect appears from a complication, someone gets a one-time free +2 from it."],
        ["Spotlight", "Which element to introduce first — the new aspect, the arriving NPC, or the environment change."],
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
    what: "Session Zero questions that draw out character history, a relationship web exercise that creates cross-PC connections, and an opening hook that frames the first scene.",
    output: "Three backstory questions, a relationship web prompt, and an opening hook for Session 1.",
    rules: [
      "Do backstory at the table together. An aspect no one else knows can't be invoked or compelled by anyone - including you.",
      "Every answer should produce an aspect. Write as they talk - don't wait until they finish.",
      "The relationship web creates cross-PC aspects - these become the strongest compel material in the campaign.",
      "Let high concept and trouble emerge from the answers. Assigning them in advance kills the discovery.",
      "The opening hook is your literal first sentence at the table. Drop them in.",
    ],
    tips: [
      "Ask what you don't know. If you already know the answer, you're narrating, not discovering.",
      "Let the answers surprise you. The campaign you didn't plan is better than the one you did.",
      "The cross-PC questions matter more than the individual ones. Shared history is your best compel material.",
    ],
    invoke_example: "A backstory question produced the aspect 'Trained by Someone Who Trusted Me.' Two sessions in, a PC needs to bypass a security system their old mentor designed. Invoke that aspect for +2 on Investigate - they know how their mentor thinks, where the gaps are, what gets overlooked.",
    compel_example: "Same aspect. The PC's old mentor is on the opposite side of the current conflict. The GM offers a fate point: the compel is that the PC won't act against the mentor directly, even if it would solve the problem. The relationship from Session Zero becomes the dramatic constraint that shapes the campaign.",
    beginner: {
      what: "This generates questions for Session Zero — the first gathering where players create their characters together. The questions draw out who your character is, how they relate to the other players' characters, and what happened before the story begins. Every answer becomes an aspect that matters in play.",
      terms: [
        ["Session Zero", "The first session where everyone creates characters together and establishes the world. No dice, just conversation."],
        ["Backstory Question", "A prompt like 'What did you sacrifice to get here?' The answer reveals character and creates aspects."],
        ["Relationship Web", "How the player characters know each other. These connections become the strongest source of drama."],
        ["Opening Hook", "The GM's first sentence at the actual game. One sentence that drops the players straight into action."],
      ],
    },
  },
  obstacle: {
    title: "Obstacle",
    what: "An obstacle is NOT an enemy - it cannot be attacked and taken out. It must be avoided, circumvented, or endured. Three types: hazards attack, blocks prevent, distractions force choices.",
    output: "One obstacle: a hazard (skill rating + Weapon + disable method), a block (skill rating + disable method), or a distraction (choice + repercussions for each option).",
    rules: [
      "Hazards act in initiative and attack. To disable: take a risk and overcome at rating +2. Cannot be taken out by attacking.",
      "Blocks don't act in initiative. They provide passive opposition when you try to do the thing they prevent. Failure against a block with a Weapon rating means you take a hit.",
      "Distractions have no mechanical attack - they present a choice with consequences on both sides. The drama comes from the decision, not the dice.",
      "To disable a hazard or block, you must take a risk (put yourself in danger) and overcome at the obstacle's rating +2.",
      "Obstacle vs enemy: enemies can be taken out. Obstacles cannot. Don't let players try.",
      "Use obstacles to accent enemies, not replace them. One obstacle per scene is usually enough. Overuse frustrates players.",
    ],
    gm_tips: [
      "One obstacle per scene. It splits PC attention and gives non-combat characters something meaningful to contribute.",
      "Announce the type immediately: hazard (attacks on its turn), block (passive opposition), or distraction (forces a choice).",
      "A hazard nobody knows exists until it attacks isn't tension — it's an ambush. Announce it upfront.",
      "Distractions are your most narrative-friendly obstacle. Name both sides of the choice before anyone rolls."
    ],
    invoke_example: "The obstacle is a hazard: 'Collapsing Scaffolding.' Its aspect is 'Groaning Under Its Own Weight.' A PC uses Create Advantage to place 'Weak Point Identified' on the scene, then invokes it for free to get +2 on the overcome roll to bring it down safely. One well-placed hit.",
    compel_example: "Same scaffolding. A PC has the aspect 'Never Leaves Someone Behind.' A teammate is directly underneath. The GM offers a fate point: they can't just bring it down — they have to get their teammate clear first. They break from the plan.",
    beginner: {
      what: "An obstacle is NOT an enemy — you can't defeat it by attacking. It's something dangerous or blocking that must be avoided, disabled, or endured. A collapsing ceiling, a locked door, a raging fire. Three types: hazards (they attack you), blocks (they stop you), and distractions (they force a hard choice).",
      terms: [
        ["Hazard", "An obstacle that actively hurts you — fire, poison gas, collapsing rubble. It attacks on its turn like an enemy, but you can't take it out by fighting."],
        ["Block", "An obstacle that prevents a specific action — a locked door blocks passage, a ward blocks magic. Overcome it or find another way."],
        ["Distraction", "A situation that forces a choice: save the hostage or chase the villain? Both options have costs."],
        ["Disable", "The way to get rid of a hazard or block. Usually requires a risky overcome roll at a high difficulty."],
      ],
    },
  },
  countdown: {
    title: "Countdown",
    what: "A countdown adds urgency: deal with it now or things get worse. It has a track of boxes, a trigger that fills them, and an outcome when the last box is checked.",
    output: "A countdown clock with named threat, number of boxes, time unit, trigger condition, and outcome when the clock strikes zero.",
    rules: [
      "A countdown track is a row of boxes marked left to right. Shorter track = faster doom.",
      "A trigger is the event that marks a box - as simple as 'one exchange passes' or as specific as 'a PC fails a roll.'",
      "When the last box is marked, the outcome happens. Period. This is not negotiable once established.",
      "You can show them the track without saying what it represents. The mystery is half the pressure.",
      "Stack triggers: one that fires every exchange, one that fires on a specific event. Acceleration is drama.",
      "A visible countdown does more for pacing than three extra enemies.",
    ],
    gm_tips: [
      "Visible track, no secrets. Put it on the table where everyone can see it from the moment you introduce it.",
      "Check each box, pause a beat, say nothing. The silence does more work than any description.",
      "State the trigger once clearly before play starts. Never change it or quietly fudge it — the contract is everything.",
      "When the last box fills, the outcome happens. No exceptions. Softening it breaks the tool permanently."
    ],
    invoke_example: "The countdown 'Building Demolition Sequence' has 2 boxes marked. A PC is trying to disable it. They used Create Advantage last exchange to place 'Exposed Control Panel' on the scene. Now they invoke that free invoke for +2 on Crafts to stop the sequence. The urgency makes every +2 feel enormous.",
    compel_example: "Same countdown, 3 of 4 boxes marked. A PC has the trouble 'I Always Make It Personal.' The GM offers a fate point: instead of going straight for the disable panel, the compel pulls them toward confronting the person who set the charges. The last box may fill before they get there.",
    beginner: {
      what: "A countdown is a visible timer — a row of boxes on the table that fill up as things get worse. When the last box is checked, something bad happens. The bomb goes off, the ritual completes, the bridge collapses. It creates urgency: deal with it now or face the consequences.",
      terms: [
        ["Countdown Track", "A row of boxes (usually 4-6) drawn on the table. Everyone can see how close to disaster they are."],
        ["Trigger", "What causes a box to fill. Could be 'one per round' or 'each time a PC fails a roll' or a specific event."],
        ["Outcome", "What happens when the last box fills. Non-negotiable — the GM commits to it and follows through."],
        ["Urgency", "The whole point. A visible, ticking clock makes every decision feel weightier."],
      ],
    },
  },
  constraint: {
    title: "Constraint",
    what: "A constraint modifies enemies or obstacles by adding a limitation (restricting PC actions) or a resistance (making the target hard to deal with in a specific way). Constraints force creative problem-solving.",
    output: "Either a limitation (restricted action + consequence for taking it anyway) or a resistance (what it blocks + how to bypass it).",
    rules: [
      "Limitations don't forbid - they impose a cost. Players can always act. The question is whether they will.",
      "Resistances force Plan B. If the dragon is immune to mortal weapons, the party needs the one sword that works. That's a quest, not a roadblock.",
      "A good resistance drives most of a session: the party discovers the resistance, researches the bypass, and then executes the plan.",
      "Constraints are modifiers - they attach to enemies or obstacles, not to the scene as a whole.",
      "Limitations work best when the players know about them before they act. Hidden limitations feel like punishments; visible ones feel like tactical puzzles.",
      "Every resistance needs a bypass. No bypass = wall, not constraint. Build the bypass before the session.",
    ],
    gm_tips: [
      "State limitations before players commit to an action — after the roll is a gotcha. Before the roll is a puzzle.",
      "Resistances require a bypass. The players need to know a bypass exists, even if they don't know what it is yet.",
      "One constraint: interesting. Two: a puzzle. Three: a slog. Stop at two per encounter.",
      "Players figure out bypasses through Investigate, Lore, or the right NPC conversation. Reward the research."
    ],
    invoke_example: "The constraint is a resistance: 'Armoured Hide — Blades Can't Pierce It.' A PC has found the bypass (a gap at the throat). They invoke the aspect 'One Weak Spot' that they placed via Create Advantage — for +2 on Fight to strike the gap under pressure.",
    compel_example: "Same creature. A PC's high concept is 'I Solve Every Problem with Force.' The GM offers a fate point: their usual approach is useless against the hide. They're off balance, frustrated, swinging at something that shrugs off every blow. The limitation becomes character texture.",
    beginner: {
      what: "A constraint makes an enemy or obstacle harder to deal with in a specific way. A creature with armoured hide that blades can't pierce. A curse that prevents magic in the area. It forces the players to think creatively — their usual approach won't work, so they need Plan B. Every constraint has a bypass: the one thing that DOES work.",
      terms: [
        ["Limitation", "A restriction on what players can do. 'No weapons allowed inside' — you CAN break the rule, but there's a cost."],
        ["Resistance", "Something the enemy is immune to. 'Immune to fire' means you need a different approach entirely."],
        ["Bypass", "The one thing that gets past the resistance. Finding the bypass IS the adventure."],
        ["Cost", "What happens if you try the restricted action anyway. Not 'you can't' — 'you can, but here's the price.'"],
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
    },
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

var HELP_ENTRIES = [
  {
    id:"npc_minor", icon:"◎", label:"Minor NPC",
    what:"A named minor NPC (mook): concept, one weakness, and 1–2 stress boxes.",
    how:"Instant extras for any scene — read the name and concept aloud, use the weakness as a compel hook.",
    tip:"Don't name every mook - only the ones who might interact with the party. Optionally, treat a mob as sharing a single stress track.",
    rule:"Fate Condensed p.43 - Minor NPCs: 1–2 aspects, 0–3 stress boxes, no consequences.",
    srd_url:"https://fate-srd.com/fate-condensed/being-game-master#npcs",
  },
  {
    id:"npc_major", icon:"◉", label:"Major NPC",
    what:"A full antagonist or ally: high concept, trouble, 3 other aspects, a skill pyramid, 2–3 stunts, stress and consequences.",
    how:"Your session's central antagonist or ally in one roll — read concept + trouble to set the personality, reveal other aspects through play.",
    tip:"Major NPCs should feel like PCs. Give them a want, a fear, and a reason the party might sympathise with them.",
    rule:"Fate Condensed p.43 - Major NPCs: full aspects, skills, stunts, stress, and consequences.",
    srd_url:"https://fate-srd.com/fate-condensed/being-game-master#npcs",
  },
  {
    id:"scene", icon:"◈", label:"Scene Setup",
    what:"Scene aspects (tone, movement, cover, danger, usable), 2–4 zones with their own aspects, and zone descriptions.",
    how:"Sets the stage before players arrive — read zone names aloud, reveal visible aspects, keep hidden ones for discovery.",
    tip:"Scene aspects can be invoked by anyone. Put at least one 'usable' aspect in reach - players love having options.",
    rule:"Fate Condensed p.23 & p.30 - Situation aspects persist as long as the situation does. Zones and their aspects are on p.29.",
    srd_url:"https://fate-srd.com/fate-condensed/aspects-and-fate-points#situation-aspects",
  },
  {
    id:"campaign", icon:"◇", label:"Campaign Frame",
    what:"One current issue (already causing problems), one impending issue (coming crisis), setting aspects, key faces, and important places.",
    how:"Defines what your world is fighting about — hand players the current issue and let the impending issue build pressure between sessions.",
    tip:"Current issues give the party something to react to. Impending issues create urgency. Setting aspects are always true - spend a fate point to invoke them like any other aspect.",
    rule:"Fate Condensed p.4 - Define your setting: issues are aspects that represent current and impending threats.",
    srd_url:"https://fate-srd.com/fate-condensed/getting-started#define-your-setting",
  },
  {
    id:"encounter", icon:"⚔", label:"Encounter",
    what:"A named opposition force, 2 possible twists, a victory condition, a defeat condition, and the GM's starting fate points.",
    how:"A complete action scene, ready to run — announce the victory condition first, hold the twist for when things feel settled.",
    tip:"The defeat condition is just as important as victory - it gives consequences weight. GM fate points = number of PCs.",
    rule:"Fate Condensed p.34–38 - Conflicts end when one side concedes or is taken out. GM fate points: p.44.",
    srd_url:"https://fate-srd.com/fate-condensed/conflicts",
  },
  {
    id:"seed", icon:"◎", label:"Adventure Seed",
    what:"A full one-page scenario skeleton: location, objective, complication, three-scene structure, opposition, victory/defeat conditions, and a mid-scene twist.",
    how:"An entire session from a standing start — read the opening hook as your first words, prep Scene 1 only, let the rest emerge.",
    tip:"A complete seed is one session of prep. Everything after Scene 1 is a reaction to the players, not a plan. The complication should force a choice, not just an obstacle.",
    rule:"Book of Hanz - A Fate session is a situation with pressure, not a plotted sequence of events.",
    srd_url:"https://fate-srd.com/fate-condensed/getting-started",
  },
  {
    id:"compel", icon:"⊗", label:"Compel",
    what:"A concrete situation invoking a specific aspect, a consequence if accepted, and the fate point offer framing.",
    how:"The fastest way to create drama and move fate points — offer the point first, name the aspect, state the consequence.",
    tip:"A good compel creates dramatic interest, not punishment. If accepting feels narratively satisfying, it is a good compel. Players can refuse by spending 1 fate point — that's not failure, it's the economy working.",
    rule:"Fate Condensed p.25–26 — Compels offer a fate point for a complication. To refuse: the player spends 1 fate point instead. If refused, the situation doesn't happen. You can invoke free invokes or fate points but cannot keep compelling the same aspect in the same scene.",
    beginner_tip:"Offer the fate point visibly — hold it out. Say: 'Your aspect [X] suggests [situation]. I offer you a fate point if [complication] happens. You can refuse by spending one instead.' The player decides. No wrong answer.",
    dnd_notes:"D&D has Inspiration and story awards but no negotiated drama economy. Fate compels are offers, not punishments — refusing costs a fate point, accepting earns one. The GM is trying to make the character's story matter, not trap the player.",
    srd_url:"https://fate-srd.com/fate-condensed/aspects-and-fate-points#compels",
  },
  {
    id:"challenge", icon:"⬡", label:"Challenge",
    what:"A series of overcome rolls against fixed difficulties, resolved collectively. Not a Contest (opposed exchange-by-exchange competition).",
    how:"Turns a complex problem into 3-5 meaningful rolls — announce the stakes up front, let players Create Advantage before the big moment.",
    tip:"Keep challenges to 3–5 rolls. Longer drags the tension. Use Create Advantage first to set up the decisive action.",
    rule:"Fate Condensed p.32–33 - Challenges use overcome actions against set difficulties. Contests (p.33) are opposed rolls with a victory track.",
    srd_url:"https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests#challenges",
  },
  {
    id:"contest", icon:"🏁", label:"Contest",
    what:"Two sides in direct opposition, exchange by exchange. First to 3 victories wins. Ties introduce twists.",
    how:"Tracks a race or rivalry exchange by exchange — visible victory track, ties introduce twists, succeed with style for double victories.",
    tip:"Announce the victory track visibly. Ties are the best part - they introduce new aspects that change the contest. Use them aggressively.",
    rule:"Fate Condensed p.33 - Contests: opposed overcome rolls, victory track (first to 3), twist on ties.",
    srd_url:"https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests#contests",
  },
  {
    id:"consequence", icon:"⚡", label:"Consequence",
    what:"A lasting aspect taken to absorb a hit - mild (2), moderate (4), or severe (6). Must be treated before it clears.",
    how:"Lasting damage that drives story — write it as an evocative aspect, compel it at least once before it heals.",
    tip:"Compel the consequence at least once before it clears. Name it specifically: 'Badly Burned Hands' not 'Injured.'",
    rule:"Fate Condensed p.35–38 - Recovery: overcome Academics (physical) or Empathy (mental) at Fair/Great/Fantastic.",
    srd_url:"https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests#taking-harm",
  },
  {
    id:"faction", icon:"⚑", label:"Faction",
    what:"A group with a goal, method, weakness, and a named face NPC who represents it in play.",
    how:"Organisations that move the world between sessions — the named face is your session anchor, advance the goal off-screen.",
    tip:"Two factions with conflicting goals = engine. Three with overlapping methods = the ideal mess.",
    rule:"Fate Adversary Toolkit - Factions advance toward their goals between sessions if the PCs don't interfere.",
    srd_url:"https://fate-srd.com/fate-system-toolkit/factions",
  },
  {
    id:"complication", icon:"⚠", label:"Complication",
    what:"A mid-scene interruption: new aspect, arriving NPC, or environment shift. Drop when the scene has settled.",
    how:"Restores energy when a scene feels settled — introduce one element at a time and let players react before the next.",
    tip:"The best complications force a choice - solve the new problem or continue with the original goal.",
    rule:"Fate Condensed p.23 - New situation aspects created by complications persist until the scene changes.",
    srd_url:"https://fate-srd.com/fate-condensed/aspects-and-fate-points#situation-aspects",
  },
  {
    id:"backstory", icon:"📖", label:"PC Backstory",
    what:"Session Zero questions that draw out character history, a relationship web exercise, and an opening hook.",
    how:"Session Zero character creation that produces playable aspects — ask questions at the table together, write aspects as they talk.",
    tip:"Relationship web questions are more important than individual questions. Cross-PC history is fuel.",
    rule:"Fate Condensed p.4–5 - Character creation is collaborative. Aspects emerge from shared discussion.",
    srd_url:"https://fate-srd.com/fate-condensed/getting-started#create-your-characters",
  },
  {
    id:"obstacle", icon:"🛡", label:"Obstacle",
    what:"A hazard, block, or distraction - an obstacle that cannot be attacked and taken out like an enemy.",
    how:"Splits player attention and rewards creative thinking — one per scene, announce the type, give non-combat PCs a way to shine.",
    tip:"One obstacle per combat scene is ideal. Give non-combat PCs a way to disable it while fighters handle enemies.",
    rule:"Fate Condensed p.49–51 - Obstacles: hazards, blocks, distractions. Adversary Toolkit expands.",
    srd_url:"https://fate-srd.com/fate-condensed/optional-rules#obstacles",
  },
  {
    id:"countdown", icon:"⏱", label:"Countdown",
    what:"A pacing clock: boxes that fill on triggers, with an outcome when the last box is checked.",
    how:"Visible urgency that paces the entire scene — place the track where everyone sees it, check boxes honestly, never fudge.",
    tip:"Put the track where players can see it. Physically marking boxes is one of the best tension tools in the game.",
    rule:"Fate Condensed p.47 - Countdowns: track + trigger + outcome.",
    srd_url:"https://fate-srd.com/fate-condensed/optional-rules#countdowns",
  },
  {
    id:"constraint", icon:"🔒", label:"Constraint",
    what:"A limitation (restricts an action with consequences) or a resistance (makes a target immune until bypassed).",
    how:"Forces Plan B and rewards investigation — announce limitations up front, let players discover bypasses through play.",
    tip:"One constraint per encounter. Two makes a puzzle. Three makes a slog. Always include a bypass for resistances.",
    rule:"Fate Adversary Toolkit - Constraints: countdowns, limitations, resistances.",
    srd_url:"https://fate-srd.com/fate-adversary-toolkit/constraints",
  },
];

var SKILL_LABEL = { 1:"Average", 2:"Fair", 3:"Good", 4:"Great", 5:"Superb", 6:"Fantastic" };
var ALL_SKILLS = ["Academics","Athletics","Burglary","Contacts","Crafts","Deceive","Drive","Empathy","Fight","Investigate","Lore","Notice","Physique","Provoke","Rapport","Resources","Shoot","Stealth","Will"];
