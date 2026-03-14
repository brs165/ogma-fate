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
  {id:"campaign",   label:"Campaign Issues",  icon:"◇", sub:"Current + impending + setting"},
  {id:"encounter",  label:"Encounter",        icon:"⚔", sub:"Opposition · stakes · twist"},
  {id:"seed",       label:"Adventure Seed",   icon:"◎", sub:"3-scene skeleton · opposition · stakes · twist"},
  {id:"compel",     label:"Compel",     icon:"⊗", sub:"Aspect situation · consequence · GM tip"},
  {id:"challenge",  label:"Challenge",        icon:"⬡", sub:"Series of overcome rolls · stakes · success/failure"},
  {id:"contest",    label:"Contest",          icon:"🏁", sub:"Opposed exchanges · victory track · twist on tie"},
  {id:"consequence", label:"Consequence",     icon:"⚡", sub:"Mild · moderate · severe · compel hook"},
  {id:"faction",     label:"Faction",         icon:"⚑", sub:"Name · goal · method · weakness · face"},
  {id:"complication",label:"Scene Complication", icon:"⚠", sub:"New aspect · arrival · environment shift"},
  {id:"backstory",   label:"PC Backstory",    icon:"📖", sub:"Session Zero questions · relationship web · hook"},
  {id:"obstacle",    label:"Obstacle",        icon:"🛡", sub:"Hazard · block · distraction — not an enemy"},
  {id:"countdown",   label:"Countdown",       icon:"⏱", sub:"Track · trigger · outcome — pacing pressure"},
  {id:"constraint",  label:"Constraint",      icon:"🔒", sub:"Limitation or resistance — forces Plan B"},
];

var GENERATOR_GROUPS = [
  {id:"characters", label:"Characters", icon:"👤", gens:["npc_minor","npc_major","backstory"]},
  {id:"scenes",     label:"Scenes",     icon:"🎬", gens:["scene","encounter","complication"]},
  {id:"pacing",     label:"Pacing",     icon:"⏱",  gens:["challenge","contest","obstacle","countdown","constraint"]},
  {id:"world",      label:"World",      icon:"🌍", gens:["campaign","seed","faction","compel","consequence"]},
];



var HELP_CONTENT = {
  npc_minor: {
    title: "Minor NPC",
    what: "Nameless antagonists, hired muscle, bystanders, and anyone the party won't remember by name. Use freely — they are designed to be defeated, not survived.",
    output: "1–2 aspects (high concept + optional weakness), 1–2 skills, occasional stunt, 1–3 stress boxes. No consequence slots.",
    rules: [
      "Minor NPCs have no consequence slots — one good hit can take them out.",
      "In groups, you can optionally treat a mob as sharing a single stress track (a Fate Toolkit technique). By default, each minor NPC has their own 0–3 boxes.",
      "Their weakness aspect is your best compel lever. Tag it early to reward creative play.",
      "Minor NPCs don't concede — they break, flee, or get taken out. Describe it cinematically.",
      "Unlike D&D HP, stress boxes don't mean 'health' — they mean narrative staying power.",
    ],
    gm_tips: "Don't roll for every minor NPC. Treat them as choreography. When a PC rolls well, narrate the defeat. Save your dice for things that matter.",
  },
  npc_major: {
    title: "Major NPC",
    what: "Villains, faction leaders, rivals, mentors — characters who drive the story and survive more than one scene.",
    output: "5 aspects (high concept, trouble, 3 others), skill pyramid, 2 stunts, full stress tracks + all three consequence slots, Refresh 3.",
    rules: [
      "Treat exactly like a PC in conflict — they can concede, take consequences, and invoke aspects.",
      "Their trouble aspect is your primary compel lever. Use it in the first scene they appear.",
      "High concept answers 'who are they?'. Trouble answers 'what makes them interesting?'",
      "Major NPCs start each scene with fate points from the GM's shared pool. The pool = 1 per PC facing opposition. Spend to invoke aspects or compel PCs.",
      "A major NPC who concedes escapes — and comes back with more resources and a grudge.",
    ],
    gm_tips: "Let your villain concede their first conflict dramatically. A villain who survives and adapts is far more interesting than one the party kills in session two.",
  },
  scene: {
    title: "Scene Setup",
    what: "Situation aspects for any scene — combat, social, exploration, tense standoffs, chases. Use for any situation with meaningful conflict.",
    output: "3–5 tagged situation aspects (tone, movement, cover, danger, usable) plus 2–4 named zones with their own aspects.",
    rules: [
      "Situation aspects exist until removed by an overcome action or the scene ends.",
      "Anyone (PC or NPC) can invoke them for +2 or a reroll. GMs can compel them.",
      "Free invoke (🎲) markers are gifts — physically hand them to players as index cards. These appear on some generated scene aspects to indicate an aspect the GM is pre-placing for the players to discover. In play, free invokes are earned through Create Advantage actions.",
      "Zones limit movement. Moving past opposition into another zone costs an action if contested.",
      "Zone aspects are always true — they define what's possible in the zone. Invoke them for +2 with a fate point, as with any aspect.",
    ],
    gm_tips: "Announce 1–2 situation aspects as the players arrive. Let them discover the others through Notice, Investigate, or getting hit by them. The danger aspect they didn't notice is far more interesting than one they did. The 🎲 free invoke marker on some aspects is a prep convenience — it means you've pre-placed a free invoke for someone to discover or earn. In play, free invokes are normally created through Create Advantage actions.",
  },
  campaign: {
    title: "Campaign Issues",
    what: "The macro-level threats and permanent truths that define your campaign world. These are your session-to-session compel engine.",
    output: "1 current issue (immediate, active threat), 1 impending issue (building pressure), 3 setting aspects (permanent world truths).",
    rules: [
      "Current issues are happening NOW — they create compel pressure every single session.",
      "Impending issues become current if the party fails to address them.",
      "Setting aspects are always true, always invokable, and never go away.",
      "Issues have faces (named NPCs) and places — these are ready-made hooks for scenes.",
      "You can compel an issue aspect whenever a PC's goals conflict with the larger threat.",
    ],
    gm_tips: "Roll two campaign issues and treat them as your opening two sessions. Roll a third when the first resolves. Keep one current and one impending at all times — it maintains perpetual forward momentum.",
  },
  encounter: {
    title: "Encounter",
    what: "Full conflict setup — framing, opposition, stakes, and a twist. Works for combat, chases, social confrontations, and dramatic scenes.",
    output: "Situation aspects, zones, mixed opposition (minor + possibly major NPC), GM fate points, victory/defeat conditions, mid-scene twist.",
    rules: [
      "GM fate points = number of PCs. This is your entire compel budget for the scene.",
      "Spend fate points to: compel a PC aspect or invoke an aspect for an NPC. Stunts activate automatically when their conditions are met — no fate point cost.",
      "State victory/defeat conditions BEFORE the first dice roll. 'Kill everything' is rarely the right goal.",
      "Popcorn initiative (p.31): after acting, that character passes initiative to anyone who hasn't gone yet — PC or NPC. At the start, the situation determines who goes first.",
      "The twist is a mid-encounter complication. Drop it when the outcome feels settled — not at the start.",
      "Success at a Cost (p.16): When a PC fails a roll, you can offer success at a minor cost (a complication, a situation aspect against them) or a major cost (a consequence, a serious setback). This is the 'Yes, but...' engine — use it instead of flat failure.",
      "Conceding (p.37): A character can concede before being taken out. They negotiate terms of their exit, stay in the story, and earn one fate point per consequence taken in the conflict. Villains should concede too — a recurring enemy is worth more than a dead one.",
      "Full Defense (p.48, optional): A character skips their action to get +2 to all defend rolls until their next turn. Useful for holding a position or protecting someone.",
      "Teamwork (p.32): One character rolls, others contribute +1 each if they have at least Average (+1) in a relevant skill. Cap: each helper gives +1.",
    ],
    gm_tips: "Start IN the conflict. Skip the walk-up. Drop players into the middle of a developing situation and let them figure out positioning. The first exchange of a well-framed scene is always the most exciting.",
  },
  seed: {
    title: "Adventure Seed",
    what: "A complete one-page scenario skeleton — location, objective, complication, three-scene structure, opposition, victory and defeat conditions, and a mid-scene twist. Everything needed to run a session from a standing start.",
    output: "Location · Objective · Complication · Scene 1 opening · Scene 2 midpoint · Scene 3 climax · Opposition · Victory/Defeat conditions · Twist · Campaign issue tie-in",
    rules: [
      "State the victory condition before the first roll. Players need to know what winning looks like.",
      "The defeat condition is equally important — it gives the stakes real weight.",
      "Scene 1 is a framing tool. Run it as written, then follow the players wherever they go.",
      "The twist is for when the outcome feels settled. Drop it then — not at the start.",
      "Opposition here follows the same rules as Encounter opposition — mooks and/or a major NPC.",
      "The three-scene structure is a suggestion, not a script. Real sessions are messier and better.",
    ],
    tips: [
      "The complication should force a choice, not just add an obstacle. Choices are drama.",
      "Extract one sentence from the opening description as your literal first sentence at the table.",
      "If you prep nothing else, prep Scene 1. The rest will emerge from play.",
    ],
  },
  compel: {
    title: "Compel",
    what: "A situation that invokes a specific PC aspect, a natural consequence if accepted, and guidance on the fate point offer.",
    output: "Situation description, consequence if accepted, and the fate point offer framing.",
    rules: [
      "Compels work on aspects — find one that creates genuine tension, not just inconvenience.",
      "Offer the fate point before stating the consequence. The player accepts or pays 1 to refuse.",
      "The consequence should complicate the current scene, not punish the character.",
      "A good compel makes accepting feel dramatically satisfying, not just mechanically rewarded.",
      "If a player refuses, they spend 1 fate point. That's a resource drain — note it.",
      "Compels can be player-initiated too. Remind players they can compel their own aspects.",
    ],
    gm_tips: "Two or three compels per session is about right for a group of four. Front-load one near the opening to establish the rhythm — players who see a compel early will start generating their own.",
  },
  challenge: {
    title: "Challenge",
    what: "A structured non-combat situation requiring a series of overcome actions against fixed difficulties. Not a Contest (opposed exchange-by-exchange competition) — a Challenge is a collective effort against a problem.",
    output: "Challenge name and description, primary skill(s), opposing force with difficulty, success and failure outcomes, campaign stakes.",
    rules: [
      "State the challenge type and primary skill before any dice roll. Players need to know the playing field.",
      "Opposing force = what is working against them. Give it a difficulty number (usually 2–4 for standard, 5+ for hard).",
      "Declare success AND failure outcomes before the first roll. Both should be interesting.",
      "Use Create Advantage to let players set up for the decisive roll. Reward preparation.",
      "Failure is not the end of the scene — it changes the situation and costs something (Success at a Cost, p.16).",
      "Challenges pair well with scene aspects. Place one free invoke on the table as a resource.",
      "Note: Contests (p.33) are different — they pit two sides against each other exchange by exchange with a victory track. Use a Contest for chases, races, and opposed competitions.",
    ],
    gm_tips: "Challenges are most useful for extended non-combat sequences where a single roll would feel arbitrary. Keep them to 3–5 rolls maximum — longer and the dramatic tension deflates. The best challenges have an obvious skill path and a clever alternative.",
  },
  contest: {
    title: "Contest",
    what: "Two or more sides in direct opposition, resolved exchange by exchange with a victory track. First to 3 victories wins. Use for chases, races, debates, tense negotiations, ritual duels, and any situation where both sides are actively competing but not trying to harm each other directly.",
    output: "Contest type and framing, both sides with primary skills, victory track (first to 3), twist pool for ties, situation aspects, and success/failure outcomes.",
    rules: [
      "Each exchange, one character per side takes an overcome action. Allies can provide teamwork (+1 each) or try to Create Advantage (with risk — see below).",
      "Compare efforts at the end of each exchange. The highest effort marks a victory. Succeed with style (and no one else did) = two victories.",
      "First to 3 victories wins. For longer contests, use up to 5 (but no more).",
      "On a tie for highest effort, NO ONE marks a victory. Instead, the GM introduces a new situation aspect — an unexpected twist that changes the contest.",
      "Creating Advantages in a contest is risky (p.33): if you fail, your side either forfeits its overcome roll OR you give the other side a free invoke to preserve your roll.",
      "If a threat can harm contestants, anyone whose contest roll is lower than the threat's rating takes shifts equal to the difference. Stress and consequences apply normally.",
      "D&D Contrast: There is no initiative order — each side acts once per exchange. The drama comes from the victory track and the twists on ties, not from turn-by-turn tactics.",
    ],
    gm_tips: "Contests shine when both sides have something to lose. A chase where the villain escapes if they win is more dramatic than a foot race. Announce the victory track visibly — watching it fill creates tension. Use the tie-twist mechanic aggressively: it's the best part of the system.",
  },
  consequence: {
    title: "Consequence",
    what: "A consequence is an aspect a character takes to avoid being taken out. It absorbs a hit but creates a new problem that persists — and can be compelled.",
    output: "Severity level (mild/moderate/severe), a named consequence aspect, the context in which it was suffered, and a compel hook to use in the next scene.",
    rules: [
      "Consequences have three severity levels — mild (2 stress absorbed), moderate (4), severe (6).",
      "Each character has one slot of each type. Taking a consequence writes a new aspect on the sheet.",
      "Mild clears after the next scene where recovery is addressed — but first requires a successful overcome roll (Fair +2). Moderate: overcome at Great +4, then clears after a full session. Severe: overcome at Fantastic +6, then clears after a major milestone (FCon p.40) with treatment complete. Use Academics for physical, Empathy for mental. Difficulty +2 if treating yourself.",
      "Anyone can invoke or compel a consequence aspect — including the character who has it.",
      "The GM should compel the consequence at least once before it clears. That is how it earns its keep.",
      "Unlike D&D hit points, consequences are not just damage — they are story hooks with mechanical teeth.",
    ],
    tips: [
      "Name consequences evocatively. 'Badly Burned Hands' is better than 'Injured'.",
      "Offer the first compel on a new consequence in the very next scene — establish the pattern early.",
      "Players can invoke their own consequences for +2 if the fiction supports it. Remind them.",
    ],
  },
  faction: {
    title: "Faction",
    what: "A group with a unified goal, a consistent method of pursuing it, an exploitable weakness, and a named face NPC who represents it in play.",
    output: "Faction name, goal, method, weakness, and one named face NPC with a role description.",
    rules: [
      "Factions are not statted — they exert pressure through NPCs, compels, and scene aspects.",
      "Give each faction an aspect of its own, usually a truth derived from its goal.",
      "The named face is a major NPC. Build them out with the Major NPC generator.",
      "Faction goals drive the campaign clock. If PCs do nothing, factions advance toward their goals.",
      "Weaknesses are not automatically known to the PCs — they have to discover them through play.",
    ],
    tips: [
      "Two factions with conflicting goals creates an engine. Three with overlapping methods creates a mess — which is ideal.",
      "Let factions act between sessions. Narrate what they achieved off-screen to make them feel real.",
      "The named face should have a personal goal that doesn't perfectly align with the faction's. That's the interesting part.",
    ],
  },
  complication: {
    title: "Scene Complication",
    what: "A mid-scene interruption: a new aspect enters the fiction, someone arrives uninvited, or the environment shifts. Use when the scene has settled or the dice produce a failure with interesting consequences.",
    output: "Complication type, new scene aspect, an arriving NPC, an environmental shift, and a spotlight recommendation for which to lead with.",
    rules: [
      "A complication is not a punishment — it is a new set of fictional facts that change what is possible.",
      "New aspects from complications can be invoked immediately with a free invoke if a PC helped create them.",
      "Arrivals should enter with their own agenda. They are not there to help or hinder — they are there.",
      "Environment shifts may create new zones, require Overcome rolls to traverse, or change which skills apply.",
      "The GM can compel any new aspect immediately — and should offer fate points to do so.",
    ],
    tips: [
      "Introduce one element at a time and let the players react. Stacking all three simultaneously is overwhelming.",
      "The best complications make the players make a choice — solve the new problem or continue with the original goal.",
      "If players Created Advantage to set up the scene, a complication that inverts one of their free invokes is especially dramatic.",
    ],
  },
  backstory: {
    title: "PC Backstory",
    what: "Session Zero questions that draw out character history, a relationship web exercise that creates cross-PC connections, and an opening hook that frames the first scene.",
    output: "Three backstory questions, a relationship web prompt, and an opening hook for Session 1.",
    rules: [
      "In Fate, character creation and backstory happen at the table with the group — not in private before the session.",
      "Every answer to a backstory question should produce at least one aspect. Write them down as players speak.",
      "The relationship web creates cross-PC aspects — these become the strongest compel material in the campaign.",
      "High concept and trouble aspects should emerge naturally from backstory answers, not be assigned in advance.",
      "The opening hook is your first scene frame — drop the PCs directly into the situation with no preamble.",
    ],
    tips: [
      "Ask questions you don't know the answer to. If you already know what happened, it is narration, not discovery.",
      "Let answers surprise you. The best campaigns are built on facts the GM didn't plan for.",
      "The relationship web questions are more important than the individual questions. Cross-PC history is fuel.",
    ],
  },
  obstacle: {
    title: "Obstacle",
    what: "An obstacle is NOT an enemy — it cannot be attacked and taken out. It must be avoided, circumvented, or endured. Three types: hazards attack, blocks prevent, distractions force choices.",
    output: "One obstacle: a hazard (skill rating + Weapon + disable method), a block (skill rating + disable method), or a distraction (choice + repercussions for each option).",
    rules: [
      "Hazards act in initiative and attack. They can attack or create advantages but cannot be attacked. Overcome or create advantage against them using passive opposition = their rating.",
      "Blocks don't act in initiative. They provide passive opposition when you try to do the thing they prevent. Failure against a block with a Weapon rating means you take a hit.",
      "Distractions have no mechanical attack — they present a choice with consequences on both sides. The drama comes from the decision, not the dice.",
      "To disable a hazard or block, you must take a risk (put yourself in danger) and overcome at the obstacle's rating +2.",
      "Obstacles are NOT enemies. The defining difference: enemies can be taken out by attacking them. Obstacles cannot.",
      "Use obstacles to accent enemies, not replace them. One obstacle per scene is usually enough. Overuse frustrates players.",
    ],
    gm_tips: "Add one obstacle to a combat scene to give non-combat PCs something to do. The face character can talk down the distraction while the fighter handles the enemy. Everyone contributes.",
  },
  countdown: {
    title: "Countdown",
    what: "A countdown adds urgency: deal with it now or things get worse. It has a track of boxes, a trigger that fills them, and an outcome when the last box is checked.",
    output: "A countdown clock with named threat, number of boxes, time unit, trigger condition, and outcome when the clock strikes zero.",
    rules: [
      "A countdown track is a row of boxes marked left to right. Shorter track = faster doom.",
      "A trigger is the event that marks a box — as simple as 'one exchange passes' or as specific as 'a PC fails a roll.'",
      "When the last box is marked, the outcome happens. Period. This is not negotiable once established.",
      "You can reveal the countdown to players without telling them what it represents — this builds tension through foreshadowing.",
      "A countdown can have multiple triggers — one steady trigger plus an accelerator for specific events.",
      "Countdowns are the single best tool for creating urgency without adding more enemies.",
    ],
    gm_tips: "Put the countdown track where the players can see it. Physically checking boxes in front of them is one of the most effective tension tools in tabletop gaming. Don't hide the pressure — display it.",
  },
  constraint: {
    title: "Constraint",
    what: "A constraint modifies enemies or obstacles by adding a limitation (restricting PC actions) or a resistance (making the target hard to deal with in a specific way). Constraints force creative problem-solving.",
    output: "Either a limitation (restricted action + consequence for taking it anyway) or a resistance (what it blocks + how to bypass it).",
    rules: [
      "Limitations don't forbid actions — they impose consequences for taking them. A PC should always be free to act; the question is whether the cost is worth it.",
      "Resistances force Plan B. If the dragon is immune to mortal weapons, the party needs the one sword that works. That's a quest, not a roadblock.",
      "A good resistance drives most of a session: the party discovers the resistance, researches the bypass, and then executes the plan.",
      "Constraints are modifiers — they attach to enemies or obstacles, not to the scene as a whole.",
      "Limitations work best when the players know about them before they act. Hidden limitations feel like punishments; visible ones feel like tactical puzzles.",
      "Resistances should always have a bypass. An unbeatable resistance is not a constraint — it's a wall, and walls aren't fun.",
    ],
    gm_tips: "One constraint per encounter is ideal. Two makes a puzzle. Three makes a slog. The goal is to make players think differently, not to make them feel helpless.",
  },
  advancement: {
    title: "Advancement",
    what: "How characters grow between sessions. Fate Condensed uses two tiers: Milestones (lateral adjustment) and Breakthroughs (actual power growth).",
    output: "Not a generator — this is reference content for between-session play.",
    rules: [
      "Milestones happen at the end of every session. You may do ONE of: swap two skill ratings, rewrite one stunt, buy a new stunt for 1 Refresh (minimum Refresh 1), or rewrite any aspect except your high concept.",
      "Breakthroughs happen when a major story arc concludes (GM decides). You get one milestone option PLUS all of: rewrite your high concept if desired, begin recovery on moderate/severe consequences, and increase one skill rating by one step.",
      "The GM may additionally offer: a point of Refresh, or a second skill increase. These are for major power-up moments.",
      "There are no 'significant milestones' in Condensed — that's a Fate Core concept. FCon has minor milestones (end of session) and major milestones (end of arc).",
      "D&D Contrast: There are no levels and no XP. Characters change laterally (minor milestones) or grow (major milestones) based on story progress, not kill counts.",
    ],
    gm_tips: "Award a minor milestone every session and a major milestone every 2–4 sessions (whenever a major plot arc resolves). Minor milestones keep characters fresh; major milestones mark genuine story turning points.",
  },

};

// ═══════════════════════════════════════════════════════════════
// GM MODE — Post-roll guidance content for all generators
// Injected into HELP_CONTENT as gm_running, gm_checklist, gm_hook
// ═══════════════════════════════════════════════════════════════
(function() {
  var gm = {
    npc_minor: {
      gm_running: "Introduce them mid-scene with one line of dialogue and a visible motivation. Don't name them unless the players ask — the name is a signal that they matter. Use their weakness aspect against them early to teach players that invoking aspects is how Fate works.",
    },
    npc_major: {
      gm_running: "Their first scene should establish their high concept and hint at their trouble. Let them succeed at something impressive before the PCs confront them — a villain the party never saw win is just a stat block. Have them concede their first conflict dramatically. A villain who escapes and adapts is worth ten who die in session two.",
      gm_hook: "This NPC's trouble aspect is your compel fuel for the next 3-4 sessions. Write it on a card and keep it visible during prep.",
    },
    scene: {
      gm_running: "Announce 1-2 situation aspects as the players arrive. Let them discover the rest through Notice, Investigate, or by getting hit. The danger aspect they didn't know about is far more dramatic than one they did. Hand out index cards for each zone — physical cards teach the system faster than explanations.",
      gm_checklist: ["Announce the 1-2 most visible aspects aloud", "Place index cards for each zone on the table", "Identify which aspect you'll compel first", "Decide which aspect is hidden (discoverable via Notice/Investigate)"],
    },
    campaign: {
      gm_running: "The current issue drives this session's compels. The impending issue is your between-session clock — advance it visibly when the party ignores it. Setting aspects are always true, always invokable, and never go away — treat them as permanent compel fuel.",
      gm_checklist: ["Write the current issue on a visible card at the table", "Plan one compel per session driven by the current issue", "Decide how the impending issue advances if unaddressed", "Use setting aspects as scene-framing springboards"],
      gm_hook: "At session end, ask: has the current issue escalated or resolved? If resolved, promote the impending issue and roll a new impending.",
    },
    encounter: {
      gm_running: "State the victory condition before the first roll — players need to know what winning looks like. Confirm your GM fate point pool (1 per PC). Hold the twist for when the outcome feels settled. If a PC fails, offer success at a cost before declaring a flat failure.",
      gm_checklist: ["State victory and defeat conditions aloud", "Confirm GM fate point pool: 1 per PC", "Announce visible situation aspects", "Hold the twist — deploy when things feel decided", "Track stress on paper, not in your head"],
    },
    seed: {
      gm_running: "Scene 1 is your literal opening sentence at the table — read the location description and drop the players into it with no preamble. The complication is your mid-session pivot. The defeat condition is what happens if they do nothing — make sure it's real and visible.",
      gm_checklist: ["Read Scene 1 opening aloud as your first words", "Know the defeat condition cold — it creates the stakes", "Have the complication ready but don't force it", "Let the players redirect after Scene 1 — follow them", "The three-scene structure is a suggestion, not a script"],
      gm_hook: "After the session, check: did the outcome change the campaign issue? If yes, update it. If no, the issue should escalate next time.",
    },
    compel: {
      gm_running: "Offer the fate point first. Then state the complication. This order matters — the player sees the reward before the cost, which makes acceptance feel like agency rather than punishment. If they refuse, note the FP spend silently. Two refusals in a session means you're targeting the right aspects.",
      gm_compel: "A good compel makes accepting feel dramatically satisfying, not just mechanically rewarded. If you can't imagine the player grinning as they take the fate point, the compel isn't interesting enough — reframe it.",
    },
    challenge: {
      gm_running: "Declare the challenge type and primary skill before any dice touch the table. Let players Create Advantage first — reward preparation with free invokes on the decisive roll. Keep it to 3-5 rolls maximum; longer and the tension deflates.",
      gm_checklist: ["Name the challenge and primary skill", "Set difficulty (usually Fair+2 to Great+4)", "State success AND failure outcomes before rolling", "Allow Create Advantage before the decisive roll", "Failure changes the situation — it doesn't end the scene"],
    },
    contest: {
      gm_running: "Make the victory track visible — physically draw or display it. Watching boxes fill creates tension the dice alone can't. On ties (no one marks victory), introduce a twist aspect that changes the contest. This is the best mechanic in the system — use it aggressively.",
      gm_checklist: ["Display the victory track visibly (first to 3)", "Each exchange: one roll per side, compare efforts", "Succeed with Style = 2 victories (if no one else did)", "Ties: no victory marked, introduce a twist aspect", "Creating Advantage is risky — forfeit your roll or give enemy a free invoke"],
    },
    consequence: {
      gm_running: "Name the consequence evocatively — 'Badly Burned Hands' teaches the table more than 'Injured.' Compel the consequence at least once before it clears; that's how it earns its mechanical weight. Remind players they can invoke their own consequences for +2 if the fiction supports it.",
      gm_compel: "The scene after a consequence is taken is your compel window. The consequence aspect is fresh, narratively loaded, and mechanically active. Use it before the player forgets it exists.",
    },
    faction: {
      gm_running: "Factions exert pressure through NPCs, compels, and scene aspects — not stat blocks. The named face is your session anchor: build them out with the Major NPC generator. Let factions act between sessions — narrate what they achieved off-screen to make them feel real.",
      gm_hook: "At the end of this session, advance this faction one step toward its goal. Tell the players what changed. Factions that move off-screen create urgency that no encounter can match.",
    },
    complication: {
      gm_running: "Introduce one element at a time and let the players react. The new aspect, the arriving NPC, and the environment shift are three separate beats — don't stack them. The best moment to deploy a complication is when the outcome of the current scene feels settled.",
    },
    backstory: {
      gm_running: "Ask the questions and then shut up. Let the player think. Their first answer is the safe answer; wait for the second, messier one. Every answer should produce at least one aspect — write them down as the player speaks. The relationship web questions matter more than the individual ones.",
    },
    obstacle: {
      gm_running: "Obstacles accent enemies — they don't replace them. One obstacle per scene gives a non-combat PC something to do (the face talks down the distraction while the fighter handles the enemy). Announce the obstacle's type before the first roll so players can plan around it.",
    },
    countdown: {
      gm_running: "Put the countdown track where the players can see it. Physically check boxes in front of them. This is the single most effective tension tool in tabletop gaming — visible, mechanical, relentless. Don't hide it. Display the pressure.",
    },
    constraint: {
      gm_running: "Announce limitations before players act — hidden limitations feel like punishments; visible ones feel like tactical puzzles. Resistances should always have a bypass that drives the session: discover the weakness, acquire the tool, execute the plan.",
    },
  };
  Object.keys(gm).forEach(function(k) {
    if (HELP_CONTENT[k]) {
      var g = gm[k];
      if (g.gm_running) HELP_CONTENT[k].gm_running = g.gm_running;
      if (g.gm_checklist) HELP_CONTENT[k].gm_checklist = g.gm_checklist;
      if (g.gm_compel) HELP_CONTENT[k].gm_compel = g.gm_compel;
      if (g.gm_hook) HELP_CONTENT[k].gm_hook = g.gm_hook;
    }
  });
})();

var HELP_ENTRIES = [
  {
    id:"npc_minor", icon:"◎", label:"Minor NPC",
    what:"A named minor NPC (mook): concept, one weakness, and 1–2 stress boxes.",
    how:"Draw before or during a scene. Read name + concept aloud. Use weakness as a compel hook — offer a fate point if they hesitate or flee.",
    tip:"Don't name every mook — only the ones who might interact with the party. Optionally, treat a mob as sharing a single stress track.",
    rule:"Fate Condensed p.43 — Minor NPCs: 1–2 aspects, 0–3 stress boxes, no consequences."
  },
  {
    id:"npc_major", icon:"◉", label:"Major NPC",
    what:"A full antagonist or ally: high concept, trouble, 3 other aspects, a skill pyramid, 2–3 stunts, stress and consequences.",
    how:"Read concept + trouble first — those drive personality. Reveal other aspects through play. Use the skills to set difficulty numbers.",
    tip:"Major NPCs should feel like PCs. Give them a want, a fear, and a reason the party might sympathise with them.",
    rule:"Fate Condensed p.43 — Major NPCs: full aspects, skills, stunts, stress, and consequences."
  },
  {
    id:"scene", icon:"◈", label:"Scene Setup",
    what:"Scene aspects (tone, movement, cover, danger, usable), 2–4 zones with their own aspects, and zone descriptions.",
    how:"Place this before the players arrive. Read zone names aloud. Tell players about openly visible aspects — let them ask about hidden ones.",
    tip:"Scene aspects can be invoked by anyone. Put at least one 'usable' aspect in reach — players love having options.",
    rule:"Fate Condensed p.23 & p.30 — Situation aspects persist as long as the situation does. Zones and their aspects are on p.29."
  },
  {
    id:"campaign", icon:"◇", label:"Campaign Issues",
    what:"One current issue (already causing problems), one impending issue (coming crisis), setting aspects, key faces, and important places.",
    how:"Use these at session zero or between sessions to set the world's stakes. Give players one of each issue as a handout.",
    tip:"Current issues give the party something to react to. Impending issues create urgency. Setting aspects are always true — spend a fate point to invoke them like any other aspect.",
    rule:"Fate Condensed p.4 — Define your setting: issues are aspects that represent current and impending threats."
  },
  {
    id:"encounter", icon:"⚔", label:"Encounter",
    what:"A named opposition force, 2 possible twists, a victory condition, a defeat condition, and the GM's starting fate points.",
    how:"Set the opposition before the scene. Announce the victory condition when combat starts. Use twists when the scene goes flat or players feel too comfortable.",
    tip:"The defeat condition is just as important as victory — it gives consequences weight. GM fate points = number of PCs.",
    rule:"Fate Condensed p.34–38 — Conflicts end when one side concedes or is taken out. GM fate points: p.44."
  },
  {
    id:"seed", icon:"◎", label:"Adventure Seed",
    what:"A full one-page scenario skeleton: location, objective, complication, three-scene structure, opposition, victory/defeat conditions, and a mid-scene twist.",
    how:"Use the opening hook as your first sentence at the table. Run Scene 1 exactly as framed, then let the players respond. Scenes 2 and 3 are flexible — use them as targets, not scripts.",
    tip:"A complete seed is one session of prep. Everything after Scene 1 is a reaction to the players, not a plan. The complication should force a choice, not just an obstacle.",
    rule:"Book of Hanz — A Fate session is a situation with pressure, not a plotted sequence of events."
  },
  {
    id:"compel", icon:"⊗", label:"Compel",
    what:"A concrete situation invoking a specific aspect, a consequence if accepted, and the fate point offer framing.",
    how:"Offer the fate point first. Name the aspect. State the consequence clearly. Accept refusal gracefully — they spend 1 fp.",
    tip:"A good compel creates dramatic interest, not punishment. If accepting feels narratively satisfying, it is a good compel.",
    rule:"Fate Condensed p.25–26 — Compels offer a fate point in exchange for a complication driven by an aspect."
  },
  {
    id:"challenge", icon:"⬡", label:"Challenge",
    what:"A series of overcome rolls against fixed difficulties, resolved collectively. Not a Contest (opposed exchange-by-exchange competition).",
    how:"Announce the challenge type and stakes before any roll. Both outcomes should change the situation interestingly.",
    tip:"Keep challenges to 3–5 rolls. Longer drags the tension. Use Create Advantage first to set up the decisive action.",
    rule:"Fate Condensed p.32–33 — Challenges use overcome actions against set difficulties. Contests (p.33) are opposed rolls with a victory track."
  },
  {
    id:"contest", icon:"🏁", label:"Contest",
    what:"Two sides in direct opposition, exchange by exchange. First to 3 victories wins. Ties introduce twists.",
    how:"Declare both sides' intents. Each exchange: one overcome per side, compare efforts, highest marks a victory. Succeed with style = 2 victories.",
    tip:"Announce the victory track visibly. Ties are the best part — they introduce new aspects that change the contest. Use them aggressively.",
    rule:"Fate Condensed p.33 — Contests: opposed overcome rolls, victory track (first to 3), twist on ties."
  },
  {
    id:"consequence", icon:"⚡", label:"Consequence",
    what:"A lasting aspect taken to absorb a hit — mild (2), moderate (4), or severe (6). Must be treated before it clears.",
    how:"Write the consequence as an evocative aspect on the sheet. Anyone can invoke or compel it — including the character who has it.",
    tip:"Compel the consequence at least once before it clears. Name it specifically: 'Badly Burned Hands' not 'Injured.'",
    rule:"Fate Condensed p.35–38 — Recovery: overcome Academics (physical) or Empathy (mental) at Fair/Great/Fantastic."
  },
  {
    id:"faction", icon:"⚑", label:"Faction",
    what:"A group with a goal, method, weakness, and a named face NPC who represents it in play.",
    how:"Factions exert pressure through NPCs, compels, and scene aspects — not stat blocks. The named face is a major NPC.",
    tip:"Two factions with conflicting goals creates an engine. Three with overlapping methods creates a mess — which is ideal.",
    rule:"Fate Adversary Toolkit — Factions advance toward their goals between sessions if the PCs don't interfere."
  },
  {
    id:"complication", icon:"⚠", label:"Scene Complication",
    what:"A mid-scene interruption: new aspect, arriving NPC, or environment shift. Drop when the scene has settled.",
    how:"Introduce one element at a time. New aspects from complications can be invoked immediately with a free invoke.",
    tip:"The best complications force a choice — solve the new problem or continue with the original goal.",
    rule:"Fate Condensed p.23 — New situation aspects created by complications persist until the scene changes."
  },
  {
    id:"backstory", icon:"📖", label:"PC Backstory",
    what:"Session Zero questions that draw out character history, a relationship web exercise, and an opening hook.",
    how:"Ask at the table with the group — not in private. Every answer should produce at least one aspect.",
    tip:"Relationship web questions are more important than individual questions. Cross-PC history is fuel.",
    rule:"Fate Condensed p.4–5 — Character creation is collaborative. Aspects emerge from shared discussion."
  },
  {
    id:"obstacle", icon:"🛡", label:"Obstacle",
    what:"A hazard, block, or distraction — an obstacle that cannot be attacked and taken out like an enemy.",
    how:"Add to any scene. Hazards attack on their turn. Blocks provide passive opposition. Distractions present choices.",
    tip:"One obstacle per combat scene is ideal. Give non-combat PCs a way to disable it while fighters handle enemies.",
    rule:"Fate Condensed p.49–51 — Obstacles: hazards, blocks, distractions. Adversary Toolkit expands."
  },
  {
    id:"countdown", icon:"⏱", label:"Countdown",
    what:"A pacing clock: boxes that fill on triggers, with an outcome when the last box is checked.",
    how:"Place the track visibly. Check boxes as triggers fire. When the last box fills, the outcome fires — no negotiation.",
    tip:"Put the track where players can see it. Physically marking boxes is one of the best tension tools in the game.",
    rule:"Fate Condensed p.47 — Countdowns: track + trigger + outcome."
  },
  {
    id:"constraint", icon:"🔒", label:"Constraint",
    what:"A limitation (restricts an action with consequences) or a resistance (makes a target immune until bypassed).",
    how:"Attach to an enemy or obstacle. Announce limitations before play. Let players discover resistances through investigation.",
    tip:"One constraint per encounter. Two makes a puzzle. Three makes a slog. Always include a bypass for resistances.",
    rule:"Fate Adversary Toolkit — Constraints: countdowns, limitations, resistances."
  },
];

var SKILL_LABEL = { 1:"Average", 2:"Fair", 3:"Good", 4:"Great", 5:"Superb", 6:"Fantastic" };
var ALL_SKILLS = ["Academics","Athletics","Burglary","Contacts","Crafts","Deceive","Drive","Empathy","Fight","Investigate","Lore","Notice","Physique","Provoke","Rapport","Resources","Shoot","Stealth","Will"];
