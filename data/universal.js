// data/universal.js - Setting-agnostic Fate Condensed content
// Every entry works in ALL 6 campaigns. Deduplicated vs all campaign tables.
// Sources: Fate Condensed, Fate Core, Fate Adversary Toolkit, Fate System Toolkit, Book of Hanz
var UNIVERSAL = {
  hazards: [
    {name:"Ranged Weapon Emplacement", rating:4, weapon:3, aspect:"Automated Kill Zone", disable:"Reach the mechanism behind it (overcome Athletics or Burglary at +4)"},
    {name:"Hidden Marksman", rating:5, weapon:4, aspect:"You Can't Reach Them From Here", disable:"Flank through adjacent zones and close the distance"},
    {name:"Whirling Blade Apparatus", rating:4, weapon:2, aspect:"Spinning Death", disable:"Jam a heavy object into the mechanism (overcome Physique at +4)"},
    {name:"Spreading Fire", rating:3, weapon:2, aspect:"Flames Everywhere", disable:"Overcome with appropriate skill (Athletics to escape, Crafts to smother) at +3"},
    {name:"Collapsing Ceiling", rating:4, weapon:3, aspect:"Coming Down Around Us", disable:"Cannot be disabled - must be escaped or endured"},
    {name:"Toxic Fumes", rating:3, weapon:2, aspect:"Can't Breathe in Here", disable:"Seal the source (overcome Crafts at +3) or evacuate the zone"},
    {name:"Charged Surface", rating:4, weapon:2, aspect:"Every Step Is a Gamble", disable:"Find and cut the power source (overcome Crafts or Investigate at +4)"},
    {name:"Rolling Boulder Trap", rating:5, weapon:3, aspect:"Get Out of the Way - Now", disable:"Single trigger - dodge it once and it's spent"},
    {name:"Patrolling Sentinel", rating:3, weapon:2, aspect:"It Does Not Sleep", disable:"Disable or distract (overcome Crafts or Deceive at +3)"},
    {name:"Pressure Plate Trap Array", rating:4, weapon:3, aspect:"The Floor Is the Trigger", disable:"Map the safe path (overcome Investigate at +4) or trigger from a distance"},
    {name:"Flooding Chamber", rating:3, weapon:2, aspect:"Water Rising Fast", disable:"Find the drain mechanism (overcome Investigate or Crafts at +3)"},
    {name:"Unstable Explosive Cache", rating:5, weapon:4, aspect:"One Spark and We're Done", disable:"Carefully remove triggers (overcome Crafts at +5 - failure means detonation)"},
    {name:"Swinging Pendulum Blades", rating:4, weapon:2, aspect:"Timing Is Everything", disable:"Time the pattern (overcome Notice at +4) to create safe passage"},
    {name:"Caustic Spray Jets", rating:3, weapon:3, aspect:"Chemical Burn Incoming", disable:"Reroute the piping or plug the jets (overcome Crafts at +3)"},
    {name:"Guard Beast on a Chain", rating:4, weapon:2, aspect:"Reach Exceeds Expectations", disable:"Calm it (overcome Rapport or Empathy at +4) or break the chain anchor"},
    {name:"Trigger-Linked Defence System", rating:4, weapon:2, aspect:"Friend-or-Foe Active", disable:"Trick the recognition system (overcome Crafts, Lore, or Deceive at +4)"},
    {name:"Crumbling Bridge", rating:3, weapon:3, aspect:"Every Step Costs Structure", disable:"Cannot be disabled - cross fast (overcome Athletics at +3) or find another way"},
    {name:"Fuel Spill Awaiting Ignition", rating:4, weapon:3, aspect:"The Whole Floor Is an Accelerant", disable:"Smother the surface (overcome with appropriate skill at +4) before ignition"},
    {name:"Ricochet Zone", rating:3, weapon:1, aspect:"Projectiles Come From Everywhere Here", disable:"Move to a zone without hard reflective surfaces"},
    {name:"Psychic Static Field", rating:4, weapon:2, aspect:"Your Thoughts Are Not Your Own Here", disable:"Overcome Will at +4 to push through - or leave the zone"}
  ],
  blocks: [
    {name:"Reinforced Door", rating:4, weapon:0, aspect:"Locked and Built to Last", disable:"Bypass the lock (Burglary at +6) or force it open (Physique at +6)"},
    {name:"Perimeter Fence", rating:2, weapon:0, aspect:"Climb It or Cut It", disable:"Athletics at +4 to scale, Physique at +4 to cut"},
    {name:"Vat of Acid", rating:3, weapon:4, aspect:"Don't Fall In", disable:"Cover or drain (Crafts at +5)"},
    {name:"Barricaded Doorway", rating:3, weapon:0, aspect:"They Don't Want You Coming Through", disable:"Force it (Physique at +5) or find another entry"},
    {name:"Roaring River Current", rating:4, weapon:2, aspect:"The Water Decides Where You Go", disable:"Cannot be removed - overcome Athletics at +4 to cross"},
    {name:"Energy Barrier", rating:5, weapon:1, aspect:"Nothing Physical Gets Through", disable:"Find the source (Investigate at +5) and destroy it"},
    {name:"Protective Ward", rating:4, weapon:2, aspect:"Ancient Protection Still Holds", disable:"Break the ward (Lore at +6) - or find the keystone"},
    {name:"Firewall of Flame", rating:3, weapon:3, aspect:"Wall of Heat", disable:"Smother a section (Crafts at +5) or wait for it to burn through fuel"},
    {name:"Crowd of Panicked Civilians", rating:3, weapon:0, aspect:"You Can't Push Through Without Hurting Someone", disable:"Calm them (Rapport at +5) or go around"},
    {name:"Animated Guardian", rating:4, weapon:1, aspect:"It Does Not Permit Entry", disable:"Find the control mechanism (Investigate or Lore at +6)"},
    {name:"Rubble Pile", rating:2, weapon:0, aspect:"Blocked by Tonnes of Stone", disable:"Clear a path (Physique at +4) - takes an exchange minimum"},
    {name:"Ice Sheet", rating:2, weapon:1, aspect:"No Traction Whatsoever", disable:"Cannot be removed - overcome Athletics at +2 for any movement"},
    {name:"Trapped Ground", rating:4, weapon:4, aspect:"One Wrong Step", disable:"Map a path (Investigate at +6, failure triggers a trap)"},
    {name:"Sealed Passage", rating:3, weapon:0, aspect:"The Way Forward Is Shut", disable:"Find the opening mechanism or force it (Crafts or Physique at +5)"},
    {name:"Bureaucratic Red Tape", rating:3, weapon:0, aspect:"You Don't Have the Right Authorization", disable:"Overcome with Contacts, Resources, or Deceive at +5"},
    {name:"Language Barrier", rating:2, weapon:0, aspect:"Neither Side Understands the Other", disable:"Overcome with Academics or Rapport at +4"},
    {name:"Collapsed Stairwell", rating:3, weapon:1, aspect:"Gap Between Levels", disable:"Climb or bridge it (Athletics at +5)"},
    {name:"Guarded Checkpoint", rating:3, weapon:0, aspect:"Authorization Required", disable:"Bluff through (Deceive at +5), bribe (Resources at +4), or go around"},
    {name:"Moat of Unknown Liquid", rating:3, weapon:3, aspect:"Width Unknown, Depth Unknown", disable:"Test it first (Investigate at +3) then cross (Athletics at +5)"},
    {name:"Social Taboo", rating:3, weapon:0, aspect:"You Simply Cannot Do That Here", disable:"Overcome Rapport at +5 to find an acceptable alternative"}
  ],
  distractions: [
    {name:"Innocents in the Crossfire", choice:"Save the innocents or pursue the objective?", repercussion_leave:"Civilians die or are seriously harmed.", repercussion_deal:"The primary target escapes.", opposition:3},
    {name:"The Structure Is On Fire", choice:"Rescue the people trapped inside or stop the arsonist?", repercussion_leave:"Casualties from the fire.", repercussion_deal:"The arsonist escapes with what they came for.", opposition:3},
    {name:"Ally Taken Hostage", choice:"Negotiate for the hostage or press the attack?", repercussion_leave:"The hostage suffers a severe consequence.", repercussion_deal:"The opposition repositions and gains an advantage.", opposition:4},
    {name:"Evidence Being Destroyed", choice:"Save the evidence or stop the suspects fleeing?", repercussion_leave:"The case collapses without proof.", repercussion_deal:"Suspects escape and go underground.", opposition:3},
    {name:"Bystander in the Line of Fire", choice:"Shield the bystander or take the shot?", repercussion_leave:"The bystander takes a consequence.", repercussion_deal:"The target gains cover and a free invoke.", opposition:2},
    {name:"Structural Collapse Imminent", choice:"Evacuate now or finish the objective?", repercussion_leave:"The objective is buried and inaccessible.", repercussion_deal:"Everyone in the zone risks a severe consequence.", opposition:4},
    {name:"The Escape Route Is Closing", choice:"Flee now or finish what you started?", repercussion_leave:"The mission is incomplete - must return under worse conditions.", repercussion_deal:"The exit seals. You're trapped with whatever's here.", opposition:3},
    {name:"Wounded Ally Needs Immediate Help", choice:"Treat the ally or continue the fight?", repercussion_leave:"Ally is taken out of the scenario.", repercussion_deal:"You lose your action this exchange and enemies reposition.", opposition:3},
    {name:"The Ritual Is Almost Complete", choice:"Stop the ritual or deal with the guardians?", repercussion_leave:"The ritual completes - dramatic status quo change.", repercussion_deal:"The guardians flank you.", opposition:4},
    {name:"Crucial Intelligence Slipping Away", choice:"Secure the information or pursue the immediate threat?", repercussion_leave:"The information is lost - future planning is blind.", repercussion_deal:"The immediate threat escalates while distracted.", opposition:3},
    {name:"Child Calling for Help", choice:"Help the child or maintain your position?", repercussion_leave:"The child is in real danger - consequence at GM discretion.", repercussion_deal:"Your position is overrun while distracted.", opposition:2},
    {name:"Ticking Destruction", choice:"Disarm the threat or evacuate the area?", repercussion_leave:"The area is destroyed along with everything in it.", repercussion_deal:"Those responsible use the chaos to escape.", opposition:5},
    {name:"Ally Turning Against You", choice:"Talk them down or neutralise them?", repercussion_leave:"They act against the party's interests.", repercussion_deal:"Talking takes your action and they may not listen.", opposition:4},
    {name:"Treasure Within Reach", choice:"Grab the prize or stay focused on the mission?", repercussion_leave:"Someone else takes it - or it's lost.", repercussion_deal:"Grabbing it triggers a trap or alert.", opposition:2},
    {name:"Crowd Turning Hostile", choice:"Calm the crowd or push through by force?", repercussion_leave:"The crowd becomes an obstacle (block rating 3).", repercussion_deal:"Violence against the crowd has lasting political consequences.", opposition:3}
  ],
  countdowns: [
    {name:"Explosive Threat", boxes:4, unit:"exchanges", trigger:"One box per exchange", outcome:"Detonation - everyone in the zone takes a Great (+4) attack with Weapon:4"},
    {name:"Reinforcements Incoming", boxes:3, unit:"exchanges", trigger:"One box per exchange after the alarm is raised", outcome:"A fresh wave of opposition arrives - add two threats to the scene"},
    {name:"Structural Collapse", boxes:6, unit:"exchanges", trigger:"One box per exchange, two if heavy impacts in the zone", outcome:"The structure collapses - everyone inside must overcome Fantastic (+6) Athletics or be taken out"},
    {name:"Ritual Completion", boxes:5, unit:"exchanges", trigger:"One box per exchange the ritualist is uninterrupted", outcome:"The ritual completes - dramatic permanent status quo change (new setting aspect)"},
    {name:"Poison Taking Effect", boxes:4, unit:"scenes", trigger:"One box per scene without treatment", outcome:"The poisoned character is taken out - narrate as unconsciousness, not death, unless agreed otherwise"},
    {name:"Rising Floodwater", boxes:6, unit:"exchanges", trigger:"One box per exchange", outcome:"The zone is fully submerged - characters without a way to breathe are taken out"},
    {name:"Alarm Escalation", boxes:3, unit:"exchanges", trigger:"One box each time the PCs are detected or make noise", outcome:"Full lockdown - all exits are sealed, all opposition is aware, +2 to all opposition difficulty"},
    {name:"Transport Losing Control", boxes:4, unit:"exchanges", trigger:"One box per exchange the operator fails a roll at +2", outcome:"Crash - everyone aboard takes a Good (+3) attack with Weapon:2"},
    {name:"Hostage Deadline", boxes:4, unit:"scenes", trigger:"One box per scene without meeting the captor's demands", outcome:"The captor escalates - the hostage takes a severe consequence"},
    {name:"Plague Spreading", boxes:6, unit:"sessions", trigger:"One box per session the party doesn't address the outbreak", outcome:"Epidemic - new impending issue becomes a current issue, community suffers"},
    {name:"Political Pressure", boxes:4, unit:"sessions", trigger:"One box per session the party ignores the political angle", outcome:"Warrants issued - the party is now officially wanted by the authorities"},
    {name:"Critical System Failing", boxes:5, unit:"exchanges", trigger:"One box per exchange, two if the system takes stress", outcome:"Total failure - the zone and all adjacent zones become uninhabitable"},
    {name:"Window of Opportunity Closing", boxes:3, unit:"scenes", trigger:"One box per scene", outcome:"The window is gone - whatever required it cannot be attempted again soon"},
    {name:"Morale Breaking", boxes:4, unit:"exchanges", trigger:"One box each time an allied NPC is taken out", outcome:"The allies rout - the PCs are on their own"},
    {name:"Evidence Degrading", boxes:4, unit:"scenes", trigger:"One box per scene without preserving it", outcome:"The evidence is useless - the case cannot be made"},
    {name:"The Enemy's Plan Advances", boxes:6, unit:"sessions", trigger:"One box per session the party fails to interfere", outcome:"The plan succeeds - the current issue escalates dramatically"},
    {name:"Air Supply Running Out", boxes:4, unit:"exchanges", trigger:"One box per exchange in the sealed environment", outcome:"Suffocation - all characters in the zone begin taking stress each exchange"},
    {name:"Bridge Collapsing", boxes:3, unit:"exchanges", trigger:"One box per exchange, two if heavy combat in the zone", outcome:"The bridge falls - anyone on it must overcome Superb (+5) Athletics or fall"},
    {name:"Rage Building", boxes:4, unit:"exchanges", trigger:"One box each time the NPC is provoked or insulted", outcome:"The NPC snaps - immediate unprovoked attack at +2 to their apex skill"},
    {name:"The Way Out Is Closing", boxes:3, unit:"exchanges", trigger:"One box per exchange after activation", outcome:"The exit seals - whatever is on the other side is inaccessible"}
  ],
  limitations: [
    {name:"Civilians Present", restricted_action:"Lethal force or area attacks", consequence:"Civilian casualties - severe narrative consequence and potential compel on any morality aspect"},
    {name:"No Weapons Allowed", restricted_action:"Using obvious weapons", consequence:"Immediate hostile response from neutral parties; social position destroyed"},
    {name:"Fragile Environment", restricted_action:"High-impact actions (explosions, Physique-based attacks)", consequence:"Structural damage - trigger a countdown toward collapse"},
    {name:"Being Watched", restricted_action:"Any illegal or suspicious action", consequence:"Witnesses report what they saw - can be compelled later; authority response escalates"},
    {name:"Diplomatic Immunity", restricted_action:"Arresting or physically detaining the target", consequence:"Political incident - consequences cascade to patrons and allies"},
    {name:"Sacred Ground", restricted_action:"Violence of any kind", consequence:"The community turns hostile - all social rolls in this location are at +2 difficulty indefinitely"},
    {name:"Ally in the Crossfire", restricted_action:"Ranged attacks targeting the enemy's zone", consequence:"Risk hitting the ally - on a failed attack, the ally takes the stress instead"},
    {name:"Dead Man's Switch", restricted_action:"Taking out the person holding the switch", consequence:"The switch triggers - whatever it's connected to activates immediately"},
    {name:"Public Setting", restricted_action:"Anything that would cause a scene", consequence:"Witnesses - the party's actions become public knowledge; compel-able in future scenes"},
    {name:"Oath or Promise", restricted_action:"Acting against the sworn commitment", consequence:"Breaking the oath triggers a compel on the character's high concept - no refusal possible without rewriting the aspect"},
    {name:"Time-Locked Evidence", restricted_action:"Rushing the investigation", consequence:"Each failed Investigate roll destroys one piece of evidence permanently"},
    {name:"Hostage Bound to a Trap", restricted_action:"Direct assault on the captor", consequence:"The trap triggers - the hostage takes a Weapon:4 hit"},
    {name:"Noise Will Draw Attention", restricted_action:"Loud actions (combat, breaking things, shouting)", consequence:"Mark one box on a 3-box countdown - when full, reinforcements arrive"},
    {name:"The Target Is a Child", restricted_action:"Physical force of any kind", consequence:"Every character present must defend against a Superb (+5) Empathy attack representing moral revulsion"},
    {name:"Structural Instability", restricted_action:"Movement between zones at speed", consequence:"Each fast movement triggers a passive Physique roll at +3 or the floor gives way beneath you"}
  ],
  resistances: [
    {name:"Impervious to Ordinary Weapons", bypass:"Find or forge the one weapon that works (requires a quest or challenge)", what_resists:"All physical attacks deal zero stress unless the bypass is achieved"},
    {name:"Immune to Social Skills", bypass:"The entity does not experience emotion - communicate through logic (Academics) or demonstrate through action", what_resists:"Rapport, Provoke, Empathy, and Deceive have no effect"},
    {name:"Regeneration", bypass:"Discover the weakness that prevents healing (Investigate or Lore at +4)", what_resists:"All consequences clear at the end of each exchange unless the weakness is exploited"},
    {name:"Shielded by Minions", bypass:"Take out or bypass all minions first", what_resists:"All attacks on the leader are redirected to the nearest minion"},
    {name:"Phase Shifting", bypass:"Create an aspect that anchors the target to physical reality (Lore or Crafts at +4)", what_resists:"Physical attacks pass through - zero stress dealt"},
    {name:"Armoured Shell", bypass:"Target the weak point (Create Advantage with Notice or Investigate at +4 to discover it)", what_resists:"Armor:3 against all physical attacks until the weak point is found"},
    {name:"Political Protection", bypass:"Build a public case first (challenge using Contacts, Investigate, and Rapport)", what_resists:"Cannot be arrested, detained, or publicly accused without the bypass"},
    {name:"Warded Against Harm", bypass:"Disrupt the ward source (overcome Lore at +5 or destroy the anchor object)", what_resists:"All supernatural or exotic attacks are absorbed entirely"},
    {name:"Hive Mind Coordination", bypass:"Disrupt the communication link (Crafts or Lore at +4)", what_resists:"The group cannot be surprised and gets +2 to defend as long as any two members are active"},
    {name:"Environmental Adaptation", bypass:"Change the environment (Create Advantage to alter the zone's conditions)", what_resists:"+2 to all defend rolls in the entity's native environment"},
    {name:"Fear Aura", bypass:"Succeed on a Will overcome at +4 to shake it off for the scene", what_resists:"All PCs in the zone take -2 to attack rolls until the bypass is achieved"},
    {name:"Reflective Surface", bypass:"Attack from an angle that avoids the reflection (Create Advantage with Athletics or Notice)", what_resists:"Ranged energy attacks are reflected back at the attacker"},
    {name:"Blood Ward", bypass:"Willingly give blood (take a mild consequence) to pass the ward", what_resists:"The protected area cannot be entered by any means"},
    {name:"Interference Field", bypass:"Build a counter-device or ritual (Crafts or Lore challenge at +4, 3 rolls)", what_resists:"All specialised equipment and exotic abilities fail within the zone"},
    {name:"Narrative Protection", bypass:"Complete the story condition (the prophecy, the riddle, the appointed time)", what_resists:"The target simply cannot be harmed until the narrative condition is met - no mechanical bypass exists"}
  ],
  stunts: [
    {name:"Combat Medic", skill:"Academics", desc:"+2 to overcome when treating physical consequences under time pressure.", type:"bonus"},
    {name:"Danger Sense", skill:"Notice", desc:"+2 to defend against ambushes or surprise attacks.", type:"bonus"},
    {name:"Hard to Kill", skill:"Physique", desc:"+2 to defend against physical attacks when you already have a consequence.", type:"bonus"},
    {name:"Lie Detector", skill:"Empathy", desc:"+2 to overcome or create advantage when detecting lies.", type:"bonus"},
    {name:"First Strike", skill:"Shoot", desc:"+2 to attack on the first exchange of a conflict before anyone has acted.", type:"bonus"},
    {name:"Disarming Charm", skill:"Rapport", desc:"+2 to overcome social obstacles when you have had no prior hostile interaction with the target.", type:"bonus"},
    {name:"Menacing Stare", skill:"Provoke", desc:"+2 to create advantage by threatening someone who is outnumbered or outmatched.", type:"bonus"},
    {name:"Lockbreaker", skill:"Burglary", desc:"+2 to overcome when bypassing physical locks, seals, or security mechanisms.", type:"bonus"},
    {name:"Field Mechanic", skill:"Crafts", desc:"+2 to overcome when repairing equipment under fire or time pressure.", type:"bonus"},
    {name:"Tracker", skill:"Investigate", desc:"+2 to overcome when following a trail or tracking someone through difficult terrain.", type:"bonus"},
    {name:"Sure-Footed", skill:"Athletics", desc:"+2 to overcome movement impediments in any difficult terrain.", type:"bonus"},
    {name:"Well Connected", skill:"Contacts", desc:"+2 to overcome when looking for a specific person or service in a populated area.", type:"bonus"},
    {name:"Evasive Manoeuvres", skill:"Drive", desc:"+2 to defend when operating a vehicle, mount, or conveyance under pursuit.", type:"bonus"},
    {name:"Unshakeable", skill:"Will", desc:"+2 to defend against Provoke when you have chosen to stand your ground.", type:"bonus"},
    {name:"Deep Pockets", skill:"Resources", desc:"+2 to overcome when acquiring uncommon but obtainable goods or services.", type:"bonus"},
    {name:"Ambush Striker", skill:"Stealth", desc:"+2 to attack when your target is not yet aware of your presence.", type:"bonus"},
    {name:"Encyclopedic Knowledge", skill:"Lore", desc:"+2 to create advantage when recalling obscure facts relevant to the current situation.", type:"bonus"},
    {name:"Deceptive Feint", skill:"Deceive", desc:"+2 to create advantage in combat by faking an opening.", type:"bonus"},
    {name:"Weapon Specialist", skill:"Fight", desc:"When attacking with Fight and invoking an aspect representing careful positioning, gain Weapon:2.", type:"special"},
    {name:"Armoured Up", skill:"Physique", desc:"You have Armor:2 against physical attacks as long as you are wearing appropriate protection.", type:"special"},
    {name:"Apex Flexibility", skill:"varies", desc:"Twice per session, use your apex skill in place of any other skill.", type:"special"},
    {name:"Zone Assault", skill:"Fight", desc:"Once per scene, attack all enemies in your zone with Fight.", type:"special"},
    {name:"Ranged Zone Assault", skill:"Shoot", desc:"Once per scene, attack all enemies in an adjacent zone with Shoot.", type:"special"},
    {name:"Indomitable", skill:"Will", desc:"Once per scene, when you would take a mental consequence, you may instead clear your mental stress track entirely.", type:"special"},
    {name:"Second Wind", skill:"Physique", desc:"Once per scene, clear your physical stress track as a free action.", type:"special"},
    {name:"Stroke of Luck", skill:"varies", desc:"Once per session, reroll any roll and take the better result.", type:"special"},
    {name:"Sense Motive", skill:"Empathy", desc:"Once per scene, you may ask the GM one true thing about any NPC's emotional state or hidden motivation.", type:"special"},
    {name:"Never Unarmed", skill:"Fight", desc:"You always have a small concealed weapon on your person, even when searched. This is a narrative fact, not a roll.", type:"special"}
  ],
  consequence_mild: ["Winded","Bruised Ribs","Rattled","Twisted Ankle","Ringing Ears","Scraped and Bleeding","Grit in My Eyes","Sore All Over","Cut Lip","Shaken Confidence","Strained Shoulder","Knocked Prone","Dizzy Spell","Pride Wounded More Than Body","Slight Concussion","Embarrassed in Front of Everyone","Minor Burns","Nicked by the Blade","Lost My Footing","Saw Something I Cannot Unsee","Wrenched Knee","Bitten - Nothing Deep","Heart Still Racing","Spooked and Jumpy","Dead Arm from the Impact"],
  consequence_moderate: ["Broken Ribs","Head Trauma - Seeing Double","Dislocated Shoulder","Deep Laceration","Second-Degree Burns","Leg Barely Bears Weight","Blood Loss Making Me Slow","Cracked Collarbone","Shattered Trust","Vision Going Blurry","Puncture Wound - Needs Closing","Reputation Damaged Publicly","Broken Nose - Can Barely Breathe","Internal Bruising","Knee Hyperextended","Fractured Wrist - Dominant Hand","Psychologically Scarred","Shield Arm Useless","Deep Tissue Burn","Cannot Sleep Since the Incident","Weapon Hand Nerve Damage","Jaw Wired Shut","Lost Two Teeth - Talking Hurts","Muscle Tear - Right Leg","Panic Attack Triggered by Loud Sounds"],
  consequence_severe: ["Broken Spine - Limited Mobility","Lost an Eye - Depth Perception Gone","Internal Bleeding","Lost Three Fingers","Crippled Leg - Permanent Limp","Severe Traumatic Brain Injury","Crushed Hand - May Never Grip Again","Third-Degree Burns Over My Back","Completely Lost Trust in Authority","Marked for Death by a Powerful Enemy","Shattered Pelvis","Cannot Speak Above a Whisper","Severed Tendon - Sword Arm Done","Total Psychological Shutdown","Branded as a Traitor - Everyone Knows"],
  consequence_contexts: ["during a desperate fight with no retreat","when the ambush caught everyone off guard","trying to hold a position that was already lost","in a moment of hesitation that cost everything","when the plan went sideways in the worst possible way","taking a hit meant for someone who didn't see it coming","when the environment turned against the party","in the aftermath of an explosion nobody expected","pushing through when the body said stop","when the betrayal became clear mid-action","protecting a civilian who froze in the crossfire","during the pursuit when the ground gave way","when the opponent turned out to be far more dangerous than expected","in the final exchange when victory was within reach","when the equipment failed at the worst moment"],
  compel_situations: ["Your trouble aspect puts you in exactly the wrong place at exactly the wrong time.","An old obligation resurfaces - someone you owe calls in the debt, right now.","Your high concept makes you the obvious person to handle this - whether you want to or not.","The enemy knows your weakness and exploits it publicly.","Your reputation precedes you - and it's not helping.","Something you said three sessions ago comes back with consequences.","Your loyalty to an ally forces you into a compromising position.","The faction you once worked with wants a favour - and refusal has a price.","Your principles clash directly with the most expedient course of action.","An innocent person is about to suffer because of something you did.","Your curiosity leads you somewhere dangerous before you realise the risk.","Your competitive streak blinds you to a more important priority.","The secret you've been keeping is about to become public knowledge.","Your pride won't let you accept help even though you clearly need it.","Someone from your past recognises you - at the worst possible moment.","The thing you're carrying or wearing marks you as a target.","Your emotional attachment to someone clouds your tactical judgement.","You're the only one who can do this - and doing it will cost you.","Your honour code demands action that the group would prefer you didn't take.","The authority you represent makes you a symbol - and symbols get targeted.","Your expertise means everyone expects you to have the answer. You don't.","The shortcut you took earlier has caught up with you.","Your temper flares at the exact moment diplomacy was needed.","The promise you made conflicts with what you now know to be true.","Your fear surfaces when the stakes are highest.","The resource you relied on is suddenly unavailable.","Your idealism puts you at odds with the pragmatic choice.","The enemy offers you something you actually want.","Your protective instinct overrides your tactical awareness.","The truth would help - but telling it would betray a confidence."],
  compel_consequences: ["You're separated from the group and must act alone.","You lose a free invoke you were counting on - the situation has shifted.","An NPC's trust in you is damaged - future social rolls with them are at +2 difficulty.","You take a mild consequence representing the emotional toll.","You miss the window of opportunity - must now do it the hard way.","The opposition learns something about you they can use later.","You owe someone a favour - and they will collect.","Your gear is damaged or lost - one piece of equipment is gone until repaired.","You're in the wrong place when the action starts - spend your first exchange repositioning.","An ally is put in danger because of your choice.","Your cover is blown - everyone in the scene knows who you are.","The political cost is real - a faction's disposition toward you drops.","You're compelled to act - your next action must address the compel, not the mission.","Resources are spent - lose access to one aspect's narrative benefit for the rest of the session.","The secret you discovered comes with a cost - you now know something you wish you didn't.","Public embarrassment - the failure is witnessed and will be talked about.","You hesitate - and the initiative passes to the opposition.","The emotional weight of the decision creates a new mild consequence.","A countdown clock advances an extra box because of the delay.","You succeed at what you're doing - but the method burns a bridge.","The enemy escapes because you chose to do the right thing instead.","Your action creates a new situation aspect that benefits the opposition.","You're now under scrutiny - someone powerful is watching.","The group's plan has to change because of what you did. They're not happy.","You acquire what you wanted - but it's trapped, cursed, tracked, or broken."],
  compel_event_templates: ["You have {aspect} and are in {situation}, so it makes sense that, unfortunately, {complication} would happen to you. Damn your luck.","Because you are {aspect}, the {external_force} naturally targets you first. The consequence is {complication}.","Your {aspect} is well known. When {situation} arises, {complication} follows whether you like it or not.","The universe conspires: {aspect} plus {situation} equals {complication}. Accept the fate point and the complication.","Something outside your control triggers {complication} - your {aspect} made you the obvious target.","Your {aspect} draws the wrong kind of attention. In this {situation}, that means {complication}.","Fate conspires against you: because of {aspect}, when {situation} happens, {complication} is the natural result.","Your {aspect} has always been a double-edged sword. Right now, the sharp edge is pointed at you: {complication}.","The {situation} would be manageable for anyone else. But you have {aspect}, which means {complication}.","Through no fault of your own, {aspect} and {situation} combine to produce {complication}."],
  compel_decision_templates: ["You have {aspect} in {situation}, so it makes sense that you'd decide to {bad_decision}. This goes wrong when {complication} happens.","Because of {aspect}, you can't bring yourself to {smart_action}. Instead you {bad_decision}, which leads to {complication}.","Your {aspect} won't let you walk away from this. You choose {bad_decision} - and {complication} is the price.","Given your {aspect}, there's really only one choice you'd make here: {bad_decision}. The fallout is {complication}.","You know the smart play. But {aspect} means you choose {bad_decision} instead. {complication} follows.","Your {aspect} compels you to act. You {bad_decision}, and when the dust settles, {complication}.","Against all advice, your {aspect} drives you to {bad_decision}. {complication} is the inevitable result.","The {situation} demands pragmatism. Your {aspect} demands {bad_decision}. {complication} is what happens when those collide.","You see the trap. You walk into it anyway because {aspect}. You {bad_decision}. {complication}.","Everyone at the table knows what you're going to do - {aspect} makes it a foregone conclusion. {bad_decision}. {complication}."],
  scene_framing_questions: ["What is this scene about? (If you can't answer in one sentence, the scene isn't focused enough.)","What's at stake? (Something must change - for better or worse - before the scene ends.)","What could go wrong? (If nothing can go wrong, skip the scene - it's not worth playing.)","What interesting thing is about to happen? (Start the scene as close to this as possible.)"],

  // ── Contest data (Condensed p.33) ──────────────────────────────────────
  contest_types: [
    {name:"Chase", desc:"One side flees, the other pursues. The environment is the real enemy.", side_a:"Pursuers", side_b:"Quarry", skills_a:"Athletics, Drive, Notice", skills_b:"Athletics, Drive, Stealth"},
    {name:"Race", desc:"Both sides race toward a goal. First to arrive wins.", side_a:"Side A", side_b:"Side B", skills_a:"Athletics, Drive, Physique", skills_b:"Athletics, Drive, Physique"},
    {name:"Debate", desc:"A public argument before an audience. Words are weapons, reputation is armour.", side_a:"Proponent", side_b:"Opponent", skills_a:"Rapport, Provoke, Academics", skills_b:"Rapport, Provoke, Academics"},
    {name:"Negotiation", desc:"Both sides want a deal, but the terms are everything. Whoever blinks first loses leverage.", side_a:"Party A", side_b:"Party B", skills_a:"Rapport, Empathy, Deceive", skills_b:"Rapport, Empathy, Deceive"},
    {name:"Heist", desc:"The infiltrators work against the clock while security closes in.", side_a:"Infiltrators", side_b:"Security", skills_a:"Burglary, Stealth, Deceive", skills_b:"Notice, Investigate, Contacts"},
    {name:"Escape", desc:"The captives flee while the captors tighten the net.", side_a:"Escapees", side_b:"Captors", skills_a:"Athletics, Stealth, Crafts", skills_b:"Notice, Athletics, Contacts"},
    {name:"Ritual Duel", desc:"A formal contest of skill or will - magical, martial, or social. Rules constrain both sides.", side_a:"Challenger", side_b:"Defender", skills_a:"Lore, Will, Fight", skills_b:"Lore, Will, Fight"},
    {name:"Wilderness Survival", desc:"The party races against the environment to reach safety before conditions overwhelm them.", side_a:"Party", side_b:"The Wild", skills_a:"Athletics, Crafts, Notice", skills_b:"(passive: set difficulty)"},
    {name:"Investigation Race", desc:"Both sides hunt for the same critical piece of evidence. Whoever finds it first controls the narrative.", side_a:"Investigators", side_b:"Opposition", skills_a:"Investigate, Contacts, Academics", skills_b:"Investigate, Contacts, Burglary"},
    {name:"Political Manoeuvring", desc:"Two factions vie for influence over an authority. Every exchange is a round of meetings, favours, and pressure.", side_a:"Faction A", side_b:"Faction B", skills_a:"Contacts, Resources, Rapport", skills_b:"Contacts, Resources, Deceive"},
    {name:"Tense Standoff", desc:"Both sides have weapons drawn. Nobody wants to fire first, but everyone's nerves are fraying.", side_a:"Party", side_b:"Opposition", skills_a:"Provoke, Will, Empathy", skills_b:"Provoke, Will, Shoot"},
    {name:"Pursuit of Knowledge", desc:"A research race - who can decode the artefact, translate the text, or solve the puzzle first?", side_a:"Researchers", side_b:"Rivals", skills_a:"Academics, Investigate, Lore", skills_b:"Academics, Investigate, Lore"},
  ],
  contest_twists: [
    "The terrain shifts - a new zone opens up or an existing route collapses.",
    "A third party enters with their own agenda. They're not on anyone's side.",
    "The environment escalates - fire, flood, crowd, or structural failure.",
    "Critical information surfaces - everything both sides assumed was wrong.",
    "An ally switches sides, or appears to.",
    "The prize moves - the goal is no longer where everyone thought it was.",
    "A countdown begins - 3 exchanges until the window closes permanently.",
    "A bystander gets caught in the middle and demands attention.",
    "The rules of engagement change - what was off-limits is now on the table.",
    "One side's approach backfires, creating a situation aspect against them.",
    "Reinforcements arrive - but for which side?",
    "A hidden obstacle is revealed, adding passive opposition to both sides.",
    "The weather or lighting changes dramatically, altering which skills apply.",
    "Someone's secret is exposed, reframing the entire contest.",
    "The stakes escalate - winning now means more than originally agreed.",
  ],
};

// ════════════════════════════════════════════════════════════════════════
// SESSION ZERO: PHASE TRIO DATA
// ════════════════════════════════════════════════════════════════════════

UNIVERSAL.phase_trio = {
  guest_star_roles: [
    {id:"specialist", label:"The Specialist", desc:"You provided a specific skill the lead character lacked.", aspect_hint:"Competence or expertise - what you uniquely bring to the table.", examples:["Always Has the Right Tool","The One Who Reads the Old Languages","Nobody Picks a Lock Like Me"]},
    {id:"complication", label:"The Complication", desc:"You made the situation harder, but the outcome was better for it.", aspect_hint:"Chaos, rivalry, or unpredictability - what makes you interesting to be around.", examples:["Plans Are for People Who Don't Improvise","Friendly Rivalry with {PC}","My Way Is Louder but It Works"]},
    {id:"savior", label:"The Savior", desc:"You pulled them out of the fire when things went sideways.", aspect_hint:"Loyalty, debt, or protectiveness - the bond that formed.", examples:["Nobody Gets Left Behind on My Watch","Owes {PC} a Life-Debt","{PC} and I Have Bled Together"]}
  ],
  phase1_template: "I was at {location} when {threat} happened, and I [solved it / survived / escaped] by ______.",
  relationship_templates: [
    "I owe {PC} because ______.",
    "{PC} and I disagree about ______.",
    "I trust {PC} with my life, but not with ______.",
    "{PC} saved me from ______, and I haven't repaid that yet.",
    "{PC} and I both want ______, and we can't both have it.",
    "{PC} knows a secret about me: ______."
  ],
  flashback_rules: "You have three Flashback Slots. During play, when a dramatic moment calls for it, spend a slot to say: 'Wait - I know this person,' or 'I've been here before,' or 'I have exactly the right thing.' Narrate a quick flashback, write the aspect that comes from it, and use it immediately. Your Relationship aspect and two free aspects are discovered this way.",
  aspect_tips: [
    "Go broad, not specific. 'Last Sword of the Fallen Legion' beats 'Good Fighter' - it does everything Good Fighter does plus grants permission for history, loyalty, and loss.",
    "Make it double-edged. If an aspect can only help you, it's boring. If it can also cause you trouble, it will earn you fate points through compels.",
    "Think about what you'd want to see in a story about this character, not what you'd want on a character sheet.",
    "Skills handle what you CAN do. Aspects handle who you ARE and what complications follow you around.",
    "If you're stuck, use this formula: [Adjective] [Noun] with a [Complication]. Example: 'Brilliant Engineer with a Gambling Problem.'"
  ],
  dnd_contrasts: {
    high_concept: "This isn't your class. A D&D fighter's high concept might be 'Disgraced Knight Seeking Redemption' - the fighting part lives in your skills, not your concept.",
    trouble: "In D&D, your flaw rarely matters mechanically. In Fate, your trouble PAYS you when it causes problems. A good trouble earns you fate points every session.",
    skills: "There are no classes. Your skill pyramid IS your class - it defines what you're best at. Your Great (+4) skill is your main thing.",
    stunts: "Stunts are like feats, but narrower and always conditional. '+2 to all Fight rolls' is NOT a legal stunt - the circumstance must actually limit it.",
    stress: "You don't have hit points. Stress is plot armor - it clears after every scene. Consequences are real injuries that stick around and can be used against you.",
    aspects: "Aspects are always true. If you write 'Owns a Ship,' you own a ship. If you write 'Wanted by the Crown,' you are wanted. Aspects define what's real in the story."
  }
};

// ═══════════════════════════════════════════════════════════════════════
// CONTENT EXPANSION - v9.1
// Brings thin tables up to average levels. All entries are setting-agnostic.
// ═══════════════════════════════════════════════════════════════════════

UNIVERSAL.consequence_severe = UNIVERSAL.consequence_severe.concat([
  "Spine Fractured - Paralyzed Below the Waist",
  "Third-Degree Burns Over Half the Body",
  "Crushed Hand - May Never Grip Again",
  "Traumatic Brain Injury - Memory in Fragments",
  "Internal Bleeding - Running on Borrowed Time",
  "Shattered Kneecap - Walking Is Now an Overcome",
  "Punctured Lung - Every Breath Is an Effort",
  "Severed Tendon - The Sword Arm Doesn't Work",
  "Blinded by Chemical Splash - Permanent?",
  "Compound Fracture - Bone Through Skin",
]);

UNIVERSAL.resistances = UNIVERSAL.resistances.concat([
  {name:"Immune to Intimidation", what_resists:"Provoke-based social attacks", bypass:"The entity has already accepted its own death - threaten what it cares about instead (requires Empathy to discover)"},
  {name:"Invisible to Technology", what_resists:"Electronic detection, surveillance, targeting", bypass:"The threat doesn't register on sensors - track it through secondary effects like displaced air, footprints, or witnesses (requires Notice + creative approach)"},
  {name:"Regenerates From Any Wound", what_resists:"All physical attacks (stress clears at start of its next action)", bypass:"Find the source of regeneration and destroy or separate it (requires Investigate to locate)"},
  {name:"Terrain Advantage - Cannot Be Flanked", what_resists:"Positional advantages, flanking, surrounding", bypass:"Collapse, flood, or otherwise alter the terrain itself (requires Create Advantage against the environment, not the enemy)"},
  {name:"Bonded Pair - Harm One, Heal the Other", what_resists:"Attacks against either individual while paired", bypass:"Defeat both simultaneously in the same exchange, or separate them beyond bonding range (requires Lore to learn the range)"},
]);

UNIVERSAL.limitations = UNIVERSAL.limitations.concat([
  {name:"Ticking Clock - Collateral Damage", restricted_action:"Taking more than one exchange to resolve the current obstacle", consequence:"Each additional exchange triggers a countdown box. When it fills, an innocent is harmed or a resource is destroyed."},
  {name:"Oath of Non-Violence", restricted_action:"Attack actions that deal physical stress", consequence:"Breaking the oath destroys the aspect that grants your power. The power is gone until the oath is renewed at a major milestone."},
  {name:"Fragile Alliance", restricted_action:"Actions that contradict the allied faction's stated goals", consequence:"The alliance fractures immediately. Allied NPCs become neutral or hostile. Shared resources are contested."},
  {name:"Hostile Environment - Limited Air", restricted_action:"Extended actions (challenges, lengthy overcome sequences)", consequence:"Each exchange past the third requires a Physique overcome at escalating difficulty. Failure means a mild consequence."},
  {name:"Under Observation", restricted_action:"Any action that would reveal the party's true purpose", consequence:"The observer reports immediately. Reinforcements arrive in 2 exchanges. The element of surprise is permanently lost."},
]);

UNIVERSAL.distractions = UNIVERSAL.distractions.concat([
  {name:"Structural Collapse Imminent", choice:"Shore up the supports (losing your action) or keep fighting and hope the ceiling holds?", repercussion_leave:"The structure collapses - everyone in the zone takes a 2-shift hit and the exit is blocked.", repercussion_deal:"You lose your next action and create the aspect Braced but Exposed with a free invoke for the enemy.", opposition:3},
  {name:"Wounded Ally Calling for Help", choice:"Break off to stabilize your ally or trust someone else to handle it?", repercussion_leave:"The ally takes a moderate consequence from worsening injuries and is removed from the scene.", repercussion_deal:"You stabilize them but take a boost of Distracted and Out of Position for the enemy.", opposition:2},
  {name:"The Objective Is Moving", choice:"Abandon the fight to pursue the objective, or finish the fight and risk losing it?", repercussion_leave:"The objective escapes the scene. Recovering it requires an entirely new scenario.", repercussion_deal:"You break away, taking a free attack from any engaged enemy as you go.", opposition:3},
  {name:"Bystander Escalation", choice:"De-escalate the panicking crowd or let them scatter into danger?", repercussion_leave:"A bystander is injured, creating a severe moral complication and potential consequences.", repercussion_deal:"You spend your action on Rapport or Provoke to manage the crowd. The enemy acts unopposed this exchange.", opposition:2},
  {name:"Ticking Explosive", choice:"Disarm the device or evacuate the area?", repercussion_leave:"The device detonates - 4-shift hit to everyone in the zone, situation aspect Devastated Wreckage.", repercussion_deal:"Disarming requires a Crafts overcome at +4. Failure means it detonates in your hands.", opposition:4},
]);

UNIVERSAL.scene_framing_questions = UNIVERSAL.scene_framing_questions.concat([
  "What can the PCs do here that they couldn't do anywhere else? (If nothing, move the scene somewhere more interesting.)",
  "Who opposes the PCs in this scene, and what do they want? (Even non-combat scenes work better with a competing agenda.)",
]);

UNIVERSAL.contest_twists = UNIVERSAL.contest_twists.concat([
  "The prize splits - both sides can claim part of it, but neither gets everything.",
  "A natural disaster forces both sides to cooperate temporarily or die separately.",
  "One side's key ally switches loyalty mid-contest.",
  "The rules change - what was a contest of speed becomes a contest of endurance.",
  "An audience appears, and public perception now matters as much as the outcome.",
]);
