// data/fantasy.js
// Campaign data for Fantasy.
// Requires data/shared.js to be loaded first (provides CAMPAIGNS object).

CAMPAIGNS["fantasy"] = {
    meta: {
      id: "fantasy", name: "Shattered Kingdoms",
      tagline: "The Weight of History. Magic is an ecological wound left by wars that broke the world - and the old oaths still bind.",
      icon: "✦", font: "'Inter', sans-serif",
    },
    colors: {
      bg:"#080b06", panel:"#0e130b", border:"#1a2a12",
      gold:"#c8a030", accent:"#8ab040", dim:"#4a6020",
      text:"#d4e0b0", muted:"#2a3a18", textDim:"#6a7a50",
      red:"#b03020", blue:"#204878", green:"#2a6a3a", purple:"#602878",
      tag:"#8ab04022", tagBorder:"#8ab04044",
    },
    lightColors: { bg:"#f5f0e4", panel:"#fffcf4", border:"#a8c070", gold:"#2a5a10", accent:"#1e4a08", dim:"#3a6a18", text:"#101808", muted:"#385020", textDim:"#284018", red:"#7a1400", blue:"#1a3a60", green:"#205a18", purple:"#401868", tag:"#70a03022", tagBorder:"#70a03018" },
    tables: {
      names_first: ["Aldric","Seraphine","Torvin","Maren","Cassiel","Bran","Isolde","Uther","Nimue","Draven","Sylara","Cormac","Thessaly","Hadric","Elowen","Rodric","Vespera","Orin","Caelith","Brynn","Sovara","Edwyn","Thorn","Lysara","Arabella","Cecilia","Chloe","Constance","Dora","Eleanor","Eliza","Emma","Esther","Flora","Grace","Helena","Iris","Julia","Kate","Leah","Leonora","Lydia","Mabel","Phoebe","Scarlett","Ursula","Violet","Alexander","Amos","Arthur","Barnabas","Benedict","Cassius","Daniel","Ezra","Felix","Gideon","Isaac","Jasper","Leander","Leonidas","Lysander","Marcus","Nathaniel","Sebastian","Silas","Solomon","Tobias","Gavrel","Thessan","Morwenna","Idris","Vareth","Sioned","Caius","Elspeth","Brennan","Sorcha","Aldwyn","Vesna","Cradoc","Lirien","Ulfric","Maeve","Osric","Talwyn","Gawain","Niamh","Colwyn","Aelith","Branwen","Keiran","Rhoswen","Isolwen","Davan","Ceridwen","Orryn"],
      names_last: ["of the Broken Crown","the Ashwalker","Duskblade","Ironsong","Wraithborn","the Exiled","of Thornhaven","Coldmantle","Embervow","the Twice-Damned","Stoneheart","Silverblood","of the Long War","Ashroot","the Oathless","Grimhallow","Nightward","Fairborn","of Sunken Athelas","Ashton","Bray","Brewer","Brock","Chambers","Chandler","Compton","Davenport","Fairbeard","Featherstone","Fielding","Fleming","Flint","Granger","Griffin","Gunn","Hawk","Jarvis","Kettle","Larkin","Latimer","Lewis","Maitland","Marsh","Massey","Maxwell","Mortimer","Norris","Oakley","Palmer","Prescott","Radcliff","Riggs","Sackville","Sawyer","Scarborough","Silver","Sparks","Stanhope","Steele","Sterling","Stokes","Theobald","Turner","Wheeler","Wilkins","Yardley","the Unmourned","Greymantle","of the First Wound","Ironvow","Bloodtide","the Returned","of Old Athelas","Ashenwarden","Ruinborn","the Oathbreaker","Duskhollow","of the Pale Compact","Thornwatch","the Forgotten","Cinderveil","of the Sunken Law","Grimward","the Unkingly","Rootdeep","Lastborn"],
      minor_concepts: {
          t: [
            "A {FmAdj} {FmRole}",
            "{FmRole} in service to {FmMaster}",
            "A {FmAdj} {FmRole} driven by {FmDrive}",
            "{FmRole} fallen to {FmFall}",
            "Battle-scarred Cleric",
            "Cursed Treasure Hunter",
            "Dwarven Forge-Master",
            "Elven Star-Gazer",
            "Exiled Mage-Knight",
            "Forest-dwelling Ranger",
            "Half-orc Outcast",
            "Oath-bound Spell-scarred Guard",
            "Royal Court Spy",
            "Rune-etched Sellsword",
            "Wandering Troubadour",
            "Wyrm-touched Iron-Garrison Veteran"
          ],
          v: {
            FmAdj: ["desperate", "fanatical", "loyal", "corrupt", "frightened", "brutish", "cunning", "hollow-eyed", "well-armed", "enspelled", "dishonoured", "mercenary", "blight-touched", "oathless", "war-maddened", "consecrated", "starving", "ancient-bound", "twice-dead", "spell-scarred", "rootless", "scar-bound", "god-marked", "debt-sworn", "pact-broken", "ruin-born", "compact-held", "last-of-their-order"
            ],
            FmRole: ["castle guard", "cult initiate", "petty lord's enforcer", "deserter", "undead thrall", "bandit raider", "hedge mage", "inquisitor's agent", "forest outlaw", "village militia", "pit creature", "hired blade", "compact enforcer", "blight-touched scout", "war-mage's apprentice", "travelling hedge-priest", "border-guard deserter", "undead warden", "old-faith cultist", "mercenary siege engineer", "fallen inquisitor's agent", "prophecy-runner"
            ],
            FmMaster: ["a petty lord", "the temple", "the highest bidder", "a dead master", "an absent cause", "something they don't name", "orders they were given and never questioned", "a patron whose face they have never seen", "a compact older than the current kingdom", "an entity that is technically still paying", "the last standing clause of a broken treaty", "a prophecy they were handed instead of orders"
            ],
            FmDrive: ["fear", "fanaticism", "hunger", "a grudge that outlasted its reason", "an oath they can't break", "a debt they can't repay", "a command they can't refuse", "a blight they carry and manage daily", "the last living memory of a dead order", "something the war made permanent in them", "the cost of having read the compact fully"
            ],
            FmFall: ["poverty", "fanaticism", "desperation", "a dark bargain", "bad orders", "the wrong oath", "a patron who changed their nature"],
          }
        },
      minor_weaknesses: ["Haunted by the War That Never Ended","Cursed - Something Has Claim on Their Soul","Owes a Tithe They Cannot Pay","The Old Wound Opens When It Matters Most","Bound by an Oath to the Wrong Lord","Terrified of Magic After What They Saw","Only Following Orders - Barely","Will Not Harm a Child, No Matter What","Their Gods Have Abandoned Them and They Know It","Loyalty to One Person, Not the Cause","The Old Oath Still Holds and They Know It","Terrified of the Undead - Saw Too Many Rise","Cursed Blade Compels Use When Blood Is Near","The God Is Watching - Disobedience Has Consequences","Wanted in the Capital for Something They Actually Did","Will Not Strike an Unarmed Opponent","Deep Superstition About Owls - Will Not Move After Midnight","The Old Wound Costs Them When the Cold Comes","Owes Fealty to a House That Should Have No Claim","Can't Resist a Direct Bet - Pride Over Sense","Known to the Inquisition by Face and Reputation","Addicted to the Alchemist's Compound Since the War","Compelled to Confess Under Magical Interrogation","Their Name Appears in the Prophecy - They've Read It","Cannot Bear to See a Child Suffer - Will Act Without Thinking","The Magic Costs More Than They Admit","Bound by a Geas They Did Not Consent To","Family Honour Requires Vengeance They Cannot Afford","Terrified of Deep Water After the River Crossing","The Enemy Knows Their Real Name","The Old Magic Calls Physically - Must Fight Not to Answer","Cannot Strike First - the Oath Holds","Performs Last Rites for Any Fallen - Cannot Leave Without","Known to the Undead by Sight - They Part","Scar Reacts to Old Magic - Unwanted Living Compass","Bound by Hospitality Law - Cannot Refuse a Guest Meal or Shelter","Cannot Lie After Dusk - Old Sky Oath Bites","Will Not Burn a Forest, Whatever Else Happens","Old Blood Price - Still Valid in Three Nations","True Name in the Black Archive - Someone Has the Book","Cannot Refuse a Child's Plea - Enemies Have Learned This","The Weapon Won't Strike a Surrendering Foe","Blight Sickness Held Back - Cold or Hunger Breaks It","Cursed to Dream True - Sleep Is Never Restful","Owes Tithe to the Forest - Three Seasons Overdue","Abandoned God Still Sends Signs - Harder to Ignore","Pride Won't Let Them Admit the Magic Beat Them","Cannot Enter Consecrated Ground of the Old Faith Without Pain","The Title Compels Conduct They Haven't Resigned","War Actions Classified by Three Parties - Two Hostile"],
      major_concepts: {
          t: [
            "A {FmajAdj} {FmajRole} who {FmajDrive}",
            "Former {FmajRole} carrying {FmajBurden}",
            "The last {FmajRole} of {FmajOrigin}",
            "A {FmajAdj} {FmajRole} bound by {FmajOath}",
            "Archmage seeking the Lost Spells",
            "Dragon-Slayer with a dark secret",
            "Guardian of the Sacred Grove",
            "Hero of the Peasant Rebellion",
            "High Priest of the Dying Sun",
            "Knight-Errant on a Quest for Redemption",
            "Last Scion of the Fallen Duchy looking to rekindle the Sun-Forge",
            "Master of the Flying Citadel",
            "Scion of a Forgotten Bloodline",
            "Shadow-Assassin of the Unseen Hand",
            "Warlord of the Shattered Isles"
          ],
          v: {
            FmajAdj: ["exiled", "disgraced", "legendary", "feared", "calculating", "ruthless", "ancient", "cursed", "oathbound", "hunted", "ascendant", "hollow", "blight-marked", "war-ancient", "oathsworn", "prophecy-bound", "twice-fallen", "god-touched", "scar-deep", "hollow-crowned"
            ],
            FmajRole: ["warlord", "court mage", "fallen paladin", "ancient dragon", "noble heir", "grand inquisitor", "rebel general", "oracle", "assassin guildmaster", "undead king", "rogue archmage", "temple champion", "last surviving archmage of the old college", "compact keeper for a dead kingdom", "warlord whose army is entirely undead", "prophet who has read the end", "blight-touched noble who has not told their court", "god-fragment in a mortal body wearing out", "inquisitor general who has found what they were looking for and does not like it"
            ],
            FmajDrive: ["holds three kingdoms in balance through old debts", "found power through a door better left closed", "fights for a kingdom that ended a generation ago", "serves a god whose instructions have become unclear", "built an empire on a secret that would end it", "is one revelation from losing everything", "remembers the old magic and won't teach it", "holds the last intact copy of the pre-Cataclysm compact and will die before releasing it", "has found the source of the Blight and understood that no one will believe them", "has been dead twice and each time came back knowing something new", "serves a god that has not spoken in three centuries and is managing the silence professionally", "carries a prophecy that names them as the cause of the next Cataclysm and is working to make it a lie"
            ],
            FmajBurden: ["a curse they earned", "a prophecy they can't escape", "an oath to a dead king", "a secret their order died keeping", "a power they can barely contain", "a name that opens the wrong doors"],
            FmajOrigin: ["the old kingdom", "the fallen empire", "the last war", "the previous age", "a bloodline thought extinct", "the temple before the schism"],
            FmajOath: ["a dead king's last command", "a blood compact older than current law", "a promise to something that still listens", "the order's law even though the order is gone", "a debt that compounds across generations", "the compact sworn at the founding of the old kingdom - still technically in force", "a blood debt to the Forest that compounds with every season unpaid", "a promise made to the last god before it went silent", "the original wording of the binding that sealed the Scar"
            ],
          }
        },
      troubles: ["Every Kingdom I Serve Eventually Falls","The Magic Is Burning Out of Me","I Made a Bargain I Cannot Undo","There Are People Alive Because I Lied to Them","The Crown Wants Me Dead and the Crown is Right","My Power Comes at a Cost That Isn't Mine to Pay","I Cannot Kill the Person I Need To","The Prophecy Names Me and I Refuse It","Honour Has Cost Me Everyone","The God I Serve Has Other Plans","The Prophecy Has My Name In It and I Cannot Walk Away","Made a Pact With Something That Always Collects","The Curse Was Supposed to Protect Others","My Ambition Has Burned Every Bridge I Ever Crossed to Get Here","Chosen by the Wrong God for an Unknown Purpose","The Enemy I Couldn't Kill Is Still Patient","The Magic Chose Me at Birth - No Opinion Requested","Everything I Build Eventually Serves the Prophecy I Refuse","The Cursed Blade Whispers and I Have Started Listening","I Was the Weapon - No War Left to Define Me","The God I Serve and I Disagree on Methodology","My Bloodline Opens Doors I Would Rather Keep Closed","There Are People Alive Because of Terrible Things I Did","The Old Kingdom's Laws Still Apply to Me","I Am the Thing the Old Stories Warned About","The Enemy I Could Not Kill Returns Stronger Each Time","Every Ally I Gain Becomes a Target of My Enemies","The Magic Leaves Something Behind Each Time I Use It","My True Name Is Known to the Wrong Entity","I Won the War and Lost Everything I Fought It For","The Crown Has a Legal Claim on My Service I Cannot Contest","I Have Seen the End - It Includes Me","The Magic Left Something Inside Me When It Passed Through","Every Kingdom I Helped Build Has Since Burned","The God I Stopped Believing In Has Not Stopped Believing in Me","The Old Compact Binds My Bloodline - No Choice","I Know What's in the Sealed Vault","The Curse Passes to My Killer - So I Can't Die","The Dead Army I Led Is Still Following","I Was the Last to Hold the Ritual - Did It Wrong","My Power Grows With Despair - Hope Is Depleting","Prophecy Written by Someone Who Hated Me - Still True","I Serve a Dead King Whose Commands Were Never Rescinded","The Magic Recognised What I Spend My Life Denying","I Was the War's Weapon - Still Sharp After","Everything I've Built Will Be Used Against Them","Three Courts All Claim My Loyalty - None Know the Others","The Scar Where the Spell Exited Has Been Growing for Four Years","I Know How This Age Ends - I Was There Before","Broke an Oath to the Old Gods - Their Silence Is Worse","The Creature I Spared Survived - Now a Problem","Remember the Kingdom Before - Everything Since Disappoints"],
      other_aspects: {
          t: [
            "{FOAdj} in the {FODomain}",
            "{FOVerb} What {FOSubj} Others {FOAct}",
            "Marked by {FOSource}",
            "The {FODomain} {FOVerb} My Name",
            "I Carry the {FOThing} of {FOSource}",
          ],
          v: {
            FOAdj: ["Trained", "Blooded", "Known", "Feared", "Trusted", "Marked", "Gifted", "Bound", "Wanted", "Forgotten", "Blight-Touched", "Oathbound", "Scar-Deep", "Last-Standing", "Twice-Fallen"
            ],
            FODomain: ["Old Kingdom", "Temple", "Court", "Wilderness", "Deep Roads", "Arena", "Bloodline", "Arcane Order", "The Wound", "Old Compact", "Blight Edge", "Dead Kingdom", "The Scar"
            ],
            FOVerb: ["Survived", "Remember", "Know", "Carry", "Hold", "Found", "Lost", "Still Owes", "Carried", "Sealed", "Broke", "Witnessed", "Outlasted"
            ],
            FOSubj: ["What", "Something", "Nothing", "What", "A Truth", "The Kind of", "A Name"],
            FOAct: ["Don't Survive", "Can't Forget", "Won't See", "Can't Hold", "Won't Acknowledge", "Never Know", "Never Carries", "Has Never Paid"],
            FOSource: ["the Old War", "the Temple", "an Ancient Compact", "the Bloodline", "Something Without a Name", "the Last Age", "a Dead God"],
            FOThing: ["Debt", "Oath", "Scar", "Secret", "Name", "Mark", "Memory"],
          }
        },
      stunts: [
        {name:"Shield Wall",skill:"Fight",desc:"+2 to defend when protecting an adjacent ally in the same zone.",type:"bonus",tags:["combat", "leadership"]},
        {name:"Arcane Reading",skill:"Lore",desc:"+2 to overcome when identifying the nature, origin, or weakness of a magical effect or creature.",type:"bonus",tags:["knowledge", "supernatural", "investigation"]},
        {name:"Scout's Instinct",skill:"Notice",desc:"+2 to overcome when detecting an ambush or hidden enemies before they strike.",type:"bonus",tags:["investigation", "movement", "survival"]},
        {name:"Silver Tongue",skill:"Rapport",desc:"+2 to create advantages by making a compelling first impression on nobles, clergy, or those who value status.",type:"bonus",tags:["social", "negotiation", "subterfuge"]},
        {name:"Fear Incarnate",skill:"Provoke",desc:"+2 to attack with Provoke against enemies who have already witnessed you defeat one of their allies this scene.",type:"bonus",tags:["intimidation", "combat", "social"]},
        {name:"Battlefield Awareness",skill:"Athletics",desc:"+2 to defend against physical attacks when you have moved at least one zone this exchange.",type:"bonus",tags:["combat", "movement", "investigation"]},
        {name:"Court Intrigue",skill:"Deceive",desc:"+2 to overcome when passing as a person of rank or navigating political ceremony.",type:"bonus",tags:["subterfuge", "social", "knowledge"]},
        {name:"Hunter's Eye",skill:"Shoot",desc:"+2 to attack when your target is at longer range and you have time to draw a bead.",type:"bonus",tags:["combat", "investigation", "survival"]},
        {name:"Iron Constitution",skill:"Physique",desc:"+2 to overcome the effects of poison, disease, or magical affliction.",type:"bonus",tags:["survival", "combat"]},
        {name:"Hedge Magic",skill:"Crafts",desc:"+2 to create advantages representing minor enchantments, wards, or alchemical preparations.",type:"bonus",tags:["supernatural", "technical", "knowledge"]},
        {name:"Lay On Hands",skill:"Will",desc:"Once per scene, remove a mild consequence from yourself or an ally through concentrated focus or prayer.",type:"special",tags:["repair", "supernatural", "social"]},
        {name:"Battle Cry",skill:"Provoke",desc:"Once per scene, your shout grants every ally in the same zone a free invoke on an aspect of your choice.",type:"special",tags:["leadership", "combat", "intimidation"]},
        {name:"Fate's Ward",skill:"Will",desc:"Once per scene, when you or an adjacent ally would take a consequence, you may take it instead.",type:"special",tags:["supernatural", "survival", "combat"]},
        {name:"Dead Man's Draw",skill:"Fight",desc:"Once per scene, when taken out in combat, make one final attack before leaving the scene.",type:"special",tags:["combat", "subterfuge"]},
        {name:"Ancient Tongue",skill:"Lore",desc:"Once per scene, read an inscription, rune, or magical seal that no living scholar should be able to decipher.",type:"special",tags:["knowledge", "social", "supernatural"]},
        {name:"Shadow Walk",skill:"Stealth",desc:"Once per scene, move through a zone undetected even with witnesses present - they simply don't notice you.",type:"special",tags:["stealth", "movement", "supernatural"]},
      {name:"Arcane Shield",skill:"Lore",desc:"Use Lore to defend against magical attacks.",type:"special",tags:["supernatural", "combat", "survival"]}, {name:"Deadly Aim",skill:"Shoot",desc:"+2 to Shoot when attacking from a hidden position.",type:"bonus",tags:["combat"]}, {name:"Divine Favor",skill:"Will",desc:"Once per session automatically succeed on a Will-based defense roll.",type:"special",tags:["supernatural", "survival", "leadership"]}, {name:"Inspiring Leader",skill:"Rapport",desc:"+2 to Create Advantage when boosting ally morale.",type:"bonus",tags:["leadership", "social", "combat"]}, {name:"Lock-Pick Expert",skill:"Burglary",desc:"+2 to Burglary when opening physical locks.",type:"bonus",tags:["subterfuge", "technical", "investigation"]}, {name:"Merchant's Tongue",skill:"Resources",desc:"+2 to Resources when bartering for goods.",type:"bonus",tags:["negotiation", "social", "knowledge"]}, {name:"Shadow Step",skill:"Stealth",desc:"+2 to Stealth when moving through dim light or shadows.",type:"bonus",tags:["stealth", "movement"]}, {name:"Shield Bash",skill:"Fight",desc:"Use Fight to push an opponent into an adjacent zone.",type:"special",tags:["combat", "movement"]}, {name:"Shield-Wall Veteran",skill:"Physique",desc:"+2 to Defend others in your zone when you are using a shield.",type:"bonus",tags:["combat", "leadership", "survival"]}, {name:"Whirlwind Attack",skill:"Fight",desc:"Once per scene attack all enemies in your zone.",type:"special",tags:["combat", "movement"]},
        {name:"Wilderness Survival",skill:"Notice",desc:"+2 to Notice when tracking creatures in the wild.",type:"bonus",tags:["survival", "movement", "investigation"]},
        {name:"Words of the First Age",skill:"Lore",desc:"+2 to Provoke when speaking to magical creatures or ancient entities.",type:"bonus",tags:["knowledge", "supernatural", "social"]}],
      scene_tone: {
          t: [
            "{FtAdj} and {FtAdj2}",
            "{FtNoun}-heavy {FtQual}",
            "The stones feel {FtStone}",
            "{FtQual} - old enough to have {FtMem}",
          ],
          v: {
            FtAdj: ["Ominous", "Ancient", "Blood-charged", "Consecrated", "Cursed", "Tense", "Hallowed", "Siege-worn", "Prophetic", "Ritual-heavy"],
            FtAdj2: ["watching", "waiting for the right trigger", "thick with old magic", "heavy with what was done here", "too quiet for a place this old", "remembering everything", "hostile to the living", "beyond negotiation", "weighted with accumulated consequence", "charged under the surface"],
            FtNoun: ["Blood", "Old Bone", "Prophecy", "Grudge", "Stone", "Oath", "Ruin", "Divine"],
            FtQual: ["standoff", "sanctified silence", "armed ceremony", "fragile peace", "ritual gravity", "siege atmosphere", "court hostility", "dungeon dread"],
            FtStone: ["like they've heard worse", "older than the current kingdom", "consecrated under a different name", "like a warning made permanent", "worn by the right kind of feet"],
            FtMem: ["seen this before", "heard the same arguments", "witnessed the last time", "swallowed the evidence", "a different name for the same ending"],
          }
        },
      scene_movement: ["Collapsed Siege Tower Blocks the Passage","Hip-Deep Marsh Water","Crumbling Rope Bridge - One Crossing at a Time","Loose Rubble of a Broken Fortification","Thorned Magical Undergrowth","Heavy Snow - Two Moves Per Exchange","River Current Threatening to Pull Characters Downstream","Ancient Ward Stops All Movement Into the Next Zone","Mud So Deep It Swallows Boots","Ice-Slicked Stone Floors","Wild Magic Scar on the Ground - Crossing It Requires a Roll","Chest-Deep Ritual Ash - Every Step Takes Effort","Ancient Ward Still Active - Certain Bloodlines Cannot Pass","The Stone Floor Is Alive and Shifting Slowly","Dense Entanglement Hex on the Western Half of the Zone","The River Has Been Diverted - New Course Cuts Through the Centre","Living Thorns Close Off the Passage Between Zones","Gravity Pulls Toward the Ritual Circle - Moving Away Costs Double","The Bridge Was Cut - Crossing Requires a Climb or a Leap","Blood-Summons Fog Makes Every Zone Boundary Uncertain","Intermittent Planar Rift - Zone Is Unreachable Every Other Exchange","Collapsed Crypt Floor - Weight Bearing Is Zone-Wide","The Undead Formation Is Holding the Corridor as Terrain","Magical Ice Has Glazed Every Surface Since the Binding Failed","The Drawbridge Is Raising and Hasn't Finished Yet"],
      scene_cover: ["Ancient Standing Stones","Toppled Siege Engines","Dense Forest Undergrowth","Abandoned Market Stalls","Castle Ruins - Walls Still Waist-High","Fallen Statues of Old Gods","Natural Rock Formation","Overturned Carts of Refugees","Stone Pillars of a Collapsed Temple","Giant Tree Roots Breaking the Ground","Shattered Colossus Knee - Chest-High, Solid Stone","Ancient Siege Wall Section, Still Standing at an Angle","Dense Crowd of Pilgrims Who Will Not Move","Fallen Bell Tower - Six Feet of Bronze on Its Side","Grove of Petrified Warriors - Exact Width of a Body","Toppled Library Stack - Scrolls Everywhere, Solid Shelves","Field of Old Grave Markers - Dense, Irregular, Knee-High","Torn Battle Standard Draped Over Intact Archway","Merchant Wagon Train, Halted, Packed Close","Enormous Root Ball From Uprooted Ancient Tree","Two-Metre Idol of Old God, Fallen Face-Down","Intact Section of Collapsed Temple Roof","Dense Pack of Warhorses - Nervous, Moving, Present","Stack of Bound Siege Shields, Abandoned","Broken Gate Doors Resting Against Arch - Cover for Four"],
      scene_danger: {
          t: [
            "{FdAdj} {FdHazard}",
            "{FdHazard} that {FdBehave}",
            "Active {FdMagic} with {FdResult}",
            "{FdHazard} - {FdWarn}",
          ],
          v: {
            FdAdj: ["Ancient", "Cursed", "Unstable", "Desecrated", "Wild", "Trapped", "Collapsing", "Consecrated", "Prophetically active", "Divine"],
            FdHazard: ["ward array", "necromantic field", "arcane surge zone", "structural collapse", "possessed artefact", "ritual circle mid-activation", "censure zone", "magical trap sequence", "planar boundary anomaly", "ley line confluence"],
            FdBehave: ["responds to blood", "activates on failed will", "doesn't distinguish the living from the dead", "has been waiting for exactly this", "escalates with each casting", "is older than the kingdom and remembers older laws", "punishes the wrong alignment", "has already been triggered once today"],
            FdMagic: ["necromantic ley line", "divine ward", "wild magic field", "ritual circle", "planar boundary", "curse array"],
            FdResult: ["no known counterspell", "collateral damage to every caster", "a failure mode that involves the walls", "a trigger already pulled", "effects that outlast the scene"],
            FdWarn: ["the last mage who tried left a stain", "dispelling it is worse than leaving it", "it remembers who touched it", "the gods are watching this specific situation"],
          }
        },
      scene_usable: ["Ancient Statue That Could Be Toppled","Siege Engine - Functional if Slow","Crowd of Frightened Villagers as Cover","Chained War Beast With a Breakable Lock","Elevated Walkway - Easy to Cut","Burning Pitch Barrel","Loose Arrows From a Fallen Quiver","Mirror That Confuses Magical Senses","Giant Bell - Deafening When Rung","Loose Flagstones, Easily Lifted", "Ancient Dragon Graveyard", "Crumbling Marble Pillars", "Deep Underground Caverns", "Floating Ruins of Aethelgard", "Glowing Mana Fountains", "Gnarled Whispering Trees", "Rushing Waterfall of Fire", "Sentient Brambles and Thorns", "Shimmering Illusionary Walls", "Swirling Mist of the Lost", "Toppled hero's statue blocking the path", "Unstable font of raw mana"],
      zones: [["The Gatehouse","Defensible Chokepoint","One skilled defender holds off many."],["The Great Hall","Echoing and Open","No stealth; every sound carries."],["The Ramparts","High Ground, Wind-Blasted","Archers rule here; melee is treacherous."],["The Dungeon Depths","Darkness and Despair","No light without effort; sounds mislead."],["The Ritual Circle","Magic in the Air","Magic is amplified - and unpredictable."],["The Throne Room","Symbol of Power","Who controls this zone controls the narrative."],["The Village Square","Panicking Witnesses","Collateral damage has political consequences."],["The Forest Clearing","Ancient and Watched","Old magic is present; the trees remember."],["The Collapsed Crypt","Unstable Ground","Difficult terrain; the dead may not stay that way."],["The Battlefield","Nowhere to Hide","Wide open; flanking is real, cover is scarce."],["The Mage Tower","Arcane Instability","Wild magic surges affect every dice roll here."],["The Market Quarter","Dense and Chaotic","Pursuit is hard; losing someone is easy."]],
      current_issues: [
        {name:"The Succession War Ignites",desc:"The old king is dead and three heirs each hold a third of the army. War hasn't been declared. Everyone knows it's already started.",faces:[{name:"Duke Aldric Stoneheart",role:"Most likely to strike first - and knows it"}],places:["The Royal Capital","The Three Border Fortresses"]},
        {name:"The Blight Moves West",desc:"Crops fail in a spreading radius. Animals die. The people in the affected villages change slowly. Nobody knows the cause; everyone has a theory.",faces:[{name:"Witch-Finder Hadric Grimhallow",role:"Blaming sorcery - loudly and publicly"}],places:["The Blighted Farmlands","The Temple of the Earth Mother"]},
        {name:"The Inquisition Has New Warrants",desc:"The High Inquisitor has received new authority from the Crown. The list of 'heretics' includes people the party almost certainly knows.",faces:[{name:"High Inquisitor Seraphine the Twice-Damned",role:"Believes every word she says - that's what makes her dangerous"}],places:["The Inquisition Tower","The Free City of Ashroot"]},
        {name:"The Mercenary Companies Choose Sides",desc:"Three major sellsword companies are accepting very generous contracts. Nobody is saying who from. The banners they're flying are old ones.",faces:[{name:"Captain-General Torvin Coldmantle",role:"The last neutral commander - and being pressured"}],places:["The Mercenary Quarter","Fort Ironsong"]}
      ],
      impending_issues: [
        {name:"The Old Gods Wake Up Angry",desc:"Temple auguries are unanimous: something old is stirring. It predates the gods the people worship. It doesn't recognise borders or kings.",faces:[{name:"Oracle Nimue Ashwalker",role:"Has been dreaming its movements for three months"}],places:["The Ancient Shrine Below the Capital","The Forbidden Eastern Reaches"]},
        {name:"The Spell Is Unravelling",desc:"The great binding that ended the Last War was a spell, not a treaty. It's degrading. The thing it bound was worse than the war itself.",faces:[{name:"Archmage Cassiel of the Long War",role:"The last living person who knows what was bound"}],places:["The Binding Spire","The Scar - where the Last War ended"]},
        {name:"The Dead Remember Everything",desc:"Reports of mass undead risings have an unusual feature: the dead are organised. They're heading somewhere specific - and they remember who killed them.",faces:[{name:"Necromancer Draven Embervow",role:"Claims innocence - and might be telling the truth"}],places:["The Great Cemetery","The Ruins of Old Athelas"]},
        {name:"A Kingdom Nobody Remembers",desc:"Maps are changing. Roads lead somewhere they didn't before. People are returning from places that shouldn't exist - different.",faces:[{name:"Cartographer Maren Fairborn",role:"The only person who noticed the maps changed"}],places:["The Unmapped Eastern Territories"]},
      ],
      setting_aspects: {
          t: [
            "The {FsActor} {FsAct}",
            "{FsResource} Is {FsWorth}",
            "Every {FsThing} Was Built on {FsBase}",
            "{FsTruth} - {FsConseq}",
          ],
          v: {
            FsActor: ["Old War", "Gods", "Dead Kingdoms", "Prophecy", "Magic", "Blood", "Oath", "Throne", "Blight", "The Scar", "Old Compact", "Prophecy Wheel", "Dead Armies", "The Wound", "Forest Law", "Undead March"
            ],
            FsAct: ["ended but never finished", "meddle and take sides", "wrote the current laws and left", "is always fulfilling someone's", "costs more than the wielder expects", "remembers what the names were", "outlasts everyone who swears it", "belongs to whoever holds it longest"],
            FsResource: ["Lineage", "Court Influence", "Divine Favour", "Ancient Oaths", "Old Magic", "A Legitimate Claim", "The Sword", "A Sealed Compact", "A True Name", "Blood Compact Rights", "Intact Wardstone", "God-Touched Lineage", "The Old Tongue", "Working Waystone", "A Legitimate Seal"
            ],
            FsWorth: ["power and a prison simultaneously", "what separates a king from a pretender", "borrowed never given", "older than the law and binding regardless", "the most expensive thing in any room", "worth the war it starts"],
            FsThing: ["kingdom", "noble house", "temple", "bloodline", "treaty", "title", "throne", "army"],
            FsBase: ["someone else's grave", "a broken oath", "the last war's outcome", "a prophecy convenient to somebody", "a lie everyone agreed to believe", "what the old kingdom left"],
            FsTruth: ["The old magic is waking", "Every crown carries its founding sin", "Power moves to fill a vacuum", "The gods play favourites", "A kingdom holds only as long as its weakest oath", "Blood remembers even when the records don't", "The Cataclysm did not end - it is still happening slowly", "The Blight is not evil; it is hungry", "Every throne in the current age sits on a broken oath", "Magic remembers everything that has been done with it"
            ],
            FsConseq: ["whether the current age is ready or not", "and the holder knows it in their worst hours", "and it doesn't ask permission", "and right now they favour someone else", "and everyone at court knows which oaths are weakest", "and the throne keeps score", "and it is spreading by roughly one field per season", "and it remembers who made it this way", "and the law still knows that even if the king doesn't", "and it will cost more to use than the last time it was called"
            ],
          }
        },
      opposition: [
        {name:"Bandit Warband",type:"minor",aspects:["Desperate and Cornered"],skills:[{name:"Fight",r:2},{name:"Athletics",r:1},{name:"Shoot",r:2}],stress:2,stunt:null,qty:4},
        {name:"Inquisition Guard",type:"minor",aspects:["Following Holy Orders"],skills:[{name:"Fight",r:2},{name:"Will",r:2},{name:"Provoke",r:1}],stress:2,stunt:null,qty:3},
        {name:"Undead Soldier",type:"minor",aspects:["Does Not Feel Pain","Remembers Who You Are"],skills:[{name:"Fight",r:3},{name:"Physique",r:2}],stress:3,stunt:"Undead ignore mild consequences from physical attacks.",qty:3},
        {name:"Knight Champion",type:"major",aspects:["Unbroken in a Hundred Battles","Honour Is Not Negotiable"],skills:[{name:"Fight",r:4},{name:"Physique",r:3},{name:"Will",r:3},{name:"Provoke",r:2}],stress:4,stunt:"+2 to defend against Fight attacks when carrying a shield.",qty:1},
        {name:"Court Sorcerer",type:"major",aspects:["Magic Is My Native Language","The Kingdom Owes Me Everything"],skills:[{name:"Lore",r:4},{name:"Will",r:3},{name:"Provoke",r:3},{name:"Deceive",r:2}],stress:3,stunt:"Once per scene, introduce a magical complication as a situation aspect with a free invoke.",qty:1},
        {name:"Blight-Turned Soldier",type:"minor",aspects:["Still Wearing the Old Kingdom's Colours", "The Infection Is Fully In Charge Now"],skills:[{name:"Fight",r:3}, {name:"Physique",r:2}],stress:3,stunt:"Blight-Turned ignore their first moderate consequence each scene.",qty:3},
        {name:"Inquisitor",type:"major",aspects:["The Church Is the Law and the Law Is Me", "Absolutely Certain", "Has Read Every Heresy Dossier in the Archive"],skills:[{name:"Will",r:5}, {name:"Provoke",r:4}, {name:"Investigate",r:3}, {name:"Fight",r:2}],stress:3,stunt:"Once per scene, declare that a character's aspect is evidence of heresy and compel it for free.",qty:1},
        {name:"War-Ghost",type:"minor",aspects:["Died With Unfinished Orders", "Cannot Be Turned by the Living"],skills:[{name:"Fight",r:2}, {name:"Will",r:3}, {name:"Stealth",r:2}],stress:2,stunt:"Weapons pass through a war-ghost unless invoking an aspect relevant to its specific death or oath.",qty:2},
        {name:"Broken-Oaths Knight",type:"major",aspects:["Was Honoured Once", "Power Purchased at Permanent Cost", "Remembers What Honour Felt Like"],skills:[{name:"Fight",r:5}, {name:"Provoke",r:4}, {name:"Athletics",r:3}, {name:"Will",r:2}],stress:4,stunt:"Once per scene, when taking a consequence, instead distribute it as two mild consequences - one to themselves and one to the nearest ally.",qty:1}
      ],
      twists: ["A herald arrives bearing terms - fighting pauses, briefly.","The true nature of the location is revealed - it's sacred ground.","An unexpected magical effect reshapes one zone completely.","Someone on the opposition side breaks ranks and offers aid.","A third army appears on the horizon - unknown banner.","The objective is not what the party thought it was.","An ally is revealed to be under a geas or compulsion.","The structure begins to collapse - ancient foundations giving way.","Something ancient in the walls stirs at the sound of fighting.","The weather shifts suddenly and dramatically.","A monster arrives - but it ignores the combatants and goes for something specific.","The fallen enemy was someone's kin. That someone is now present.","A divine or magical judgment begins - both sides feel it.","The terrain itself is alive. It just chose a side.","The ancient inscription on the wall becomes suddenly relevant to what is happening.","The enemy dead begin to rise - nobody in the current fight caused this.","A divine portent interrupts. Both sides feel obligated to pause.","The fortress's original occupant returns. Neither faction invited them.","The holy relic in the room activates in response to violence.","A messenger arrives with news that changes the stakes entirely.","One opponent removes their helm. It's someone the party owes a debt to.","The ground beneath the field shifts - ancient ruins exposed.","The prophecy's secondary clause becomes relevant. It's about this moment.","The creature the party thought they killed is here. It remembers.","A third army appears. They're flying a flag nobody recognises.","The binding holding the entity in the cellar begins to fail.","The king's legitimacy is challenged. Mid-fight. With documentation.","Rain begins - magical rain. Specifically.","The location is revealed to be the final site of the ancient prophecy.","The traitor reveals themselves. It isn't who anyone suspected."],
      victory: ["Defeat the champion and break the army's morale.","Retrieve the relic before the ritual is completed.","Hold the gate until the civilians are evacuated.","Capture the commander without sparking a massacre.","Expose the betrayal in front of the assembled court.","Seal the breach before whatever is coming through arrives.","Break the siege line before the garrison's water runs out.","Seal the ritual circle before the third convergence.","Hold the bridge until the evacuation is complete.","Retrieve the relic before it is consecrated to the enemy's cause.","Force the warlord's public surrender in front of their army.","Drive the entity back into the binding without destroying the circle.","Keep the negotiation alive through three full exchanges.","Burn the fleet before it reaches the harbour.","Get the heir to safety before the succession crisis hardens.","Destroy the phylactery while the lich is occupied."],
      defeat: ["The relic is consecrated and used against the kingdom.","The commander escapes with everything they need.","The town is burned; survivors remember who failed them.","The party's involvement is exposed to the crown.","A major ally is killed or captured.","The ancient thing gets through - and it remembers.","The kingdom signs the treaty on unfavourable terms.","The siege holds. The garrison runs out of water in three days.","The heir is captured. The succession is now contested by force.","The ancient evil completes the ritual.","The party's patron is publicly disgraced.","An ally falls in the retreat.","The coalition fractures - each faction blames the others.","The enemy takes the high ground and builds fortifications.","The forbidden knowledge escapes containment."],

      seed_locations: [
        "A fortress built into a scar in the earth where a god fell",
        "A city beneath a city, inhabited by a population that does not acknowledge the surface",
        "A border crossing where three kingdoms' laws apply simultaneously and contradict each other",
        "A ruined mage tower with wards that are still actively hostile",
        "A river oracle whose answers have been wrong for exactly one year",
        "A merchant road that has seen three caravans vanish in six weeks",
        "A royal archive whose restricted section has been accessed from the inside",
        "A mountain monastery that was sealed by its own inhabitants two centuries ago",
        "A battlefield where the dead have been seen walking by multiple reliable witnesses",
        "A dragon's old lair with recent signs of occupation - not by a dragon",
        "A treaty city that maintains neutrality and is currently hosting all three sides of a war",
        "A magical academy whose headmaster has not been seen in forty days",
        "An ancient grove where the local fae have stopped accepting tribute without explanation",
        "A port city where three pirate fleets maintain a fragile truce over shared infrastructure",
        "A ruined castle that has been rebuilt from the inside without any construction crews being seen",
        "A valley where two armies fought to mutual annihilation - both still present as functional undead",
        "A drowned city accessible only at low tide, with lights still visible in the deep windows",
        "The living forest at the edge of the Blight, where the trees have started moving toward the source",
        "An intact tower from before the Cataclysm, perfectly preserved, with no record of how",
        "A border keep jointly administered by three former enemies under a compact none of them trust",
        "A wandering mountain - exactly one per generation, it changes position, and it is due",
        "A treaty market city built at the site of the Last War's final battle, on top of the mass grave",
        "The God's Eye: a crater lake of perfect clarity where divination always works and lying is impossible",
        "A ruined mage-city where the streets still run with the ambient magic of the catastrophe that emptied it",
        "A monastery built inside a dead dragon - the skeleton is structurally sound and the monks are fine about it",
        "The throne room of a kingdom that exists in a time-slip - anyone entering finds it mid-coronation, always",
        "A sealed valley where the old language is still spoken and the old laws still apply",
        "The Wound: a rent in the earth two miles long where the Cataclysm's final blow landed - still bleeding magic",
        "An oracle who lives inside a collapsed prophecy - she gives answers to questions not yet asked",
        "A waystone network that still functions but routes to destinations that no longer exist"
      
      ],
      seed_complications: [
        "The ancient compact that grants access to this location requires a blood price",
        "A noble faction is also pursuing the objective with considerably more resources",
        "The magic in this region has been behaving strangely for a week - spells do unexpected things",
        "The guide the party hired knows more about the destination than they revealed",
        "A prophecy has named the party - on the wrong side",
        "The objective is inside a location that is currently under divine protection",
        "The person the party is protecting has a secret that makes them a liability",
        "What the party was hired to retrieve has already been moved by someone who knew they were coming",
        "An old curse attached to one party member activates in proximity to the objective",
        "The enemy is already here - has been for days - and is waiting",
        "The noble who hired the party and the noble who opposes them are the same person using two identities",
        "The location is on the verge of a magical event that will change the situation entirely",
        "A third faction appears with a legitimate claim that complicates every other claim",
        "The objective requires crossing territory that an ally holds and will not give passage through",
        "Completing the job will trigger a chain of events the party was not told about",
        "The route requires crossing the Blight-touched zone - the corruption recognises old blood",
        "The guide is a dead man walking on a binding oath - technically reliable, limited shelf life",
        "The compact that grants access expires at dawn - then this is trespass under old law",
        "The local faction did not hire the party and has legitimate authority and no interest in cooperation",
        "The objective is inside a creature - alive, dormant, and digesting slowly",
        "The blessing that protects the party from the ward also marks them as something old things remember",
        "Three prophetic texts describe this exact moment differently and at least one is correct",
        "The person they are protecting knows something they cannot be told that changes their priority",
        "Completing the objective requires someone to stay behind - the binding requires a willing anchor",
        "The Inquisition has a warrant for one party member that predates the current legal code and is still valid"
      
      ],
      seed_objectives: [
        "Retrieve an artefact before it is used in a ritual that cannot be undone",
        "Prevent an assassination that would start a war no one is ready to survive",
        "Find evidence that a noble house's claim to the throne is legitimate - or falsified",
        "Deliver a treaty to a faction that has every reason to refuse it and one reason to sign",
        "Stop a magical experiment that has already killed its original researchers",
        "Escort a witness to testimony that could end a war - or start a different one",
        "Break a siege before the inhabitants are forced to surrender terms that will not hold",
        "Locate a missing heir before the succession crisis becomes a civil war",
        "Destroy a cursed artefact that everyone else is trying to acquire or control",
        "Negotiate passage through a territory controlled by something that does not negotiate",
        "Recover a stolen divine relic before its absence is noticed by the deity it belongs to",
        "Infiltrate a court long enough to identify the faction behind a string of disappearances",
        "Convince a dragon to move before a kingdom's army decides to make it move",
        "Find what is killing the magic in a region and stop it before the mages are blamed",
        "Recover the missing pages of the Black Compact before they are used to reinstate a abolished law",
        "Get the warlord's true name - the one that binds - before the army crosses the border",
        "Destroy the lich's phylactery before it finishes reconstituting in the ruins of the old capital",
        "Find the last living speaker of the old tongue - the translation cannot wait and cannot be wrong",
        "Stop the Scar from widening by finding and replacing what was removed from the binding anchor",
        "Prove the current king's bloodline is illegitimate - legally and publicly - before the war it would prevent becomes inevitable",
        "Escort the wounded god-fragment to the nearest intact shrine before it dissipates entirely",
        "Prevent the Inquisition from burning the last archive of pre-Cataclysm magical knowledge",
        "Convince the Forest to hold its border - it is sentient, patient, and currently very angry",
        "Find the thirteenth seal and close it - twelve were enough for four centuries and apparently that was wrong"
      
      ],
      compel_situations: [
        "Your oath requires you to treat this person as an honoured guest - but they are the enemy",
        "The magic you need to use is exactly the kind your order forbids",
        "Your noble title gives you access - and also makes you recognisable",
        "The prophecy names you - and not favourably",
        "An old blood debt has been invoked by someone who is technically owed it",
        "The enemy is offering terms that are genuinely just, and refusing them is genuinely wrong",
        "Your magic activates in the presence of this specific kind of artifact",
        "The person you're supposed to apprehend has a legitimate grievance against you personally",
        "Your lineage grants access to the restricted section - but logging the access creates a record",
        "Helping the commoners means visibly defying the noble - in public",
        "The ancient compact requires a representative of your bloodline - there is no one else",
        "Your reputation precedes you here, but not the reputation you want",
        "The consecrated ground prevents violence - but only for those who respect it, and you do",
        "The creature you need to negotiate with has a prior debt with you",
        "Standing aside is complicity - but intervening means choosing a side",
        "The relic responds to your specific magical affinity whether you want it to or not",
        "The court's protocol requires you to challenge the insult - it cannot be overlooked",
        "Your healing ability means you are the only option and cannot tactically withhold it",
        "The forbidden tome is the only source and your scholarship makes it readable",
        "The law here is on the wrong side and you are an officer of the law",
        "The creature you're facing is bound by a compact your bloodline created - you are the authority it recognises",
        "The old law still applies here and by old law you are the ranking title holder in this room",
        "The god is speaking and specifically naming you and the assembled faithful are watching for your response",
        "Your former order's mark is visible and the local temple has not rescinded your standing in their records",
        "The relic reacts to you specifically - not chosen, but keyed - in front of everyone present",
        "The warlord knows your name and the thing you did at the Pass and is using it as leverage right now",
        "The child is carrying something that is actively calling to you and the child does not know what it is",
        "The wild magic in this zone responds to grief and you are the person in this group with the most",
        "You recognise the true name being carved into the stone and understand what the completed carving will do",
        "Your bloodline compact requires you to offer sanctuary to anyone who invokes it - they just did",
        "The undead here were your soldiers and they have not been given new orders and they are waiting",
        "The Inquisitor's warrant names your teacher and you are the only person alive who knows where they are",
        "The injured thing is not the creature they think it is - you know what it actually is and it is not the enemy",
        "The ancient text is readable only in the old tongue and you are the only one present who speaks it",
        "The treaty requires a witness of noble blood - you are technically the only one who qualifies"
      
      ],
      compel_consequences: [
        "Your oath locks you into a course of action you cannot retreat from honourably",
        "The forbidden magic leaves a mark - visible to anyone who knows what to look for",
        "You are recognised and your presence is now politically significant to the wrong people",
        "The prophecy's fulfilment becomes slightly more inevitable",
        "The blood debt costs you something material - equipment, time, or allegiance",
        "You accept just terms that disadvantage your current objective",
        "The artefact bonds to you whether you consented or not",
        "The apprehension turns into a conversation that delays everything",
        "The access log creates evidence that will be found at the worst moment",
        "You create a public confrontation with a noble faction that was previously neutral",
        "The compact extracts a promise you now must keep",
        "Your reputation commits you to an action you hadn't planned",
        "You cannot resolve the situation quickly - the creature requires a full accounting",
        "The violence you wanted to prevent happens - but later, and worse",
        "Your side in the conflict is now publicly known",
        "You exercise the authority - and everything that inherited it is now your problem",
        "The god names you its instrument, publicly, in front of the Inquisition",
        "The compact extracts the price your ancestor agreed to on your behalf",
        "You translate the inscription correctly and now know something you cannot unknow",
        "The relic bonds to you irrevocably - the previous bearer's enemies are now yours",
        "Your former order's mark is visible and the people who know what it means have noticed",
        "The wild magic surges through the grief and you get what you needed and cannot control the rest",
        "The sanctuary is given and you have now guaranteed the safety of someone everyone else wants",
        "Your soldiers follow their last order - which was yours, and was given in a different context",
        "You provide the witness - and your name is now on the treaty that is going to start the war"
      
      ],
      challenge_types: [
        {name: "Castle Assault", desc: "Take or infiltrate a fortified position before defenders can reinforce or destroy the objective inside", primary: "Fight and Athletics", opposing: "Defenders' organisational response and fortification advantage", success: "Objective reached; position taken or bypassed", failure: "Repelled or trapped inside - the objective may be destroyed in the confusion"},
        {name: "Royal Court Intrigue", desc: "Achieve a political goal at court without triggering scandal or open opposition", primary: "Rapport and Deceive", opposing: "Court factions' competing interests and the monarch's attention", success: "Goal achieved; position in court improved or maintained", failure: "Outmanoeuvred - and the court now knows what you wanted"},
        {name: "Magical Ritual", desc: "Complete a ritual under adverse conditions before it destabilises catastrophically", primary: "Lore and Will", opposing: "Environmental interference, opposition, and the ritual's own demands", success: "Ritual completes correctly; intended effect achieved", failure: "Ritual fails or corrupts - unpredictable magical consequences"},
        {name: "Wilderness Survival", desc: "Navigate dangerous terrain to a destination before the journey kills you", primary: "Lore and Physique", opposing: "Cumulative environmental hazards and dwindling resources", success: "Destination reached with enough left to accomplish the objective", failure: "Arrival compromised - injuries, lost gear, or critically delayed"},
        {name: "Siege Diplomacy", desc: "Negotiate an end to a siege before the defenders' position collapses", primary: "Rapport and Contacts", opposing: "The attacker's war aims and the defender's pride", success: "Terms agreed; bloodshed avoided", failure: "Talks collapse - the assault begins with the party in the middle"},
        {name: "Monster Hunt", desc: "Track and confront a creature that has been preying on the region before it moves on or kills again", primary: "Investigate and Notice", opposing: "The creature's behaviour, terrain advantage, and survival instincts", success: "Creature defeated, driven off, or dealt with appropriately", failure: "Wounded and forced to retreat - the creature has learned something about you"},
        {name: "Forbidden Archive", desc: "Locate and extract specific knowledge from a restricted or hostile magical repository", primary: "Lore and Stealth", opposing: "Guardians, wards, and the archive's own defences", success: "Knowledge found and safely extracted", failure: "Partial knowledge - and something in the archive is now aware of you"},
        {name: "Succession Crisis", desc: "Secure a legitimate claim to power before rival factions can install their candidate", primary: "Contacts and Rapport", opposing: "Competing noble houses and the candidate's own reluctance", success: "Claim established; succession secured", failure: "Rival installed - your faction is now the opposition"},
        {name: "Blight Containment", desc: "Slow or reverse the spread of the magical corruption before it takes the farmland or the settlement", primary: "Lore and Physique", opposing: "The Blight's rate of spread and resistance to conventional magical intervention", success: "Spread arrested; source identified or isolated", failure: "Blight advances - the settlement is now inside it, and so is the party"},
        {name: "God Negotiation", desc: "Reach an accommodation with a divine or semi-divine entity over something it considers its domain", primary: "Will and Rapport", opposing: "The entity's ancient logic, its genuine grievances, and its complete indifference to mortal timelines", success: "Terms reached; entity's cooperation or withdrawal secured", failure: "Offended - the entity acts unilaterally and the party's position is now factored into that action"},
        {name: "Prophecy Management", desc: "Act within the constraints of a known prophecy to reach the desired outcome without fulfilling the part that ends badly", primary: "Lore and Deceive", opposing: "The prophecy's own momentum and the people trying to ensure it fulfils in their favour", success: "Desired outcome achieved; bad clause avoided or deferred", failure: "Bad clause triggered - the prophecy is completing and someone is in the wrong position"},
        {name: "Wild Magic Traversal", desc: "Cross a zone saturated with unstable post-Cataclysm magic without triggering a surge", primary: "Lore and Athletics", opposing: "The magic itself - ambient, responsive, and not malicious but not careful either", success: "Traversal complete; zone navigated without incident", failure: "Surge triggered - uncontrolled magical effect, consequences for everyone present"}
      ],

      consequence_mild: [
        "Sword Arm Aching",
        "Singed by the Spell Discharge",
        "Winded from the Shield Blow",
        "Cracked Lip and Bruised Pride",
        "Sand in the Visor",
        "Rattled by the Curse Touch",
        "Grazed by the Arrow",
        "Ankle Turned on the Dungeon Stone",
        "Cloak Soaked in Something Foul",
        "Shaken by the Undead's Gaze",
        "Cut Across the Shield Arm",
        "Minor Burn from the Mage-Fire",
        "Sword Notched and Pulling to the Left",
        "Magical Backlash Rings the Ears",
        "Bruised Ribs From the Shield Pommel",
        "Armour Clasp Broken - One Piece Hanging",
        "Dazzled by the Rune's Flash",
        "Wrenched Knee on the Rubble"
      
      ],
      consequence_moderate: [
        "Sword Wound, Bound but Weeping",
        "Armour Dented and Binding Movement",
        "Concussed by the Ogre's Club",
        "Magical Exhaustion - Spells Cost Double",
        "Arrow Lodged, Not Deep but Present",
        "Broken Knuckles on the Stone Wall",
        "Cursed Touch Has Spread to the Wrist",
        "Ribs Cracked, Breathing Laboured",
        "Shoulder Wrenched from the Chain",
        "Leg Gashed by the Portcullis Drop",
        "Voice Gone from the Magical Silence",
        "Memory Fogged by the Witch's Dust",
        "Curse-Touch Has Blackened Three Fingers",
        "Deep Gash Across the Shield Arm - Held Together by Will",
        "The Spell Went Wrong and Hasn't Finished Going Wrong",
        "Helm Split - Skull Intact by Luck Not Armour",
        "Ankle Broken in the Ditch",
        "Blood Loss Slowing Everything Down"
      
      ],
      consequence_severe: [
        "Sword Through the Side - Needs a Healer Now",
        "Curse Has Taken Root - Visible and Worsening",
        "Arm Broken in the Fall from the Battlements",
        "Magical Backlash Has Silenced the Casting Hand",
        "Wanted by the Church - Sanctuary is Gone",
        "Ancient Ward Has Marked the Soul",
        "Taken Out and Left for Dead - Survival Was Luck",
        "Oath Broken in Front of Witnesses - Name is Mud Now",
        "The Ward-Scar Has Spread to the Casting Hand - Magic Is Now a Question Not a Given",
        "Undead Taint - The Cold Has Reached the Core and Is Spreading",
        "A Compact Broken Under Oath: Magically Enforced Inability to Act Against the Debtor",
        "Name Spoken Into the Black Archive - Something Old Now Has It"
      
      ],
      consequence_contexts: [
        "holding the gate against the warlord's vanguard",
        "when the ancient spell discharged without warning",
        "in the dungeon when the trap reset behind us",
        "during the ambush on the road to the keep",
        "taking the hit that was meant for an ally",
        "when the summoning went wrong",
        "when the ritual went wrong in the second phase",
        "holding the line while the evacuation passed behind",
        "in the moment the ward discharged through the wrong hand",
        "taking a blow that was meant for the person they were protecting"
      
      ],
      faction_name_prefix: [
        "The Silver",
        "The Iron",
        "The Crimson",
        "The Broken",
        "The Hidden",
        "The Ancient",
        "The Veiled",
        "The Last",
        "The High",
        "The Shadowed",
        "The Bound",
        "The Hollow",
        "The Ashen",
        "The Thornwarden",
        "The Restored"
      
      ],
      faction_name_suffix: [
        "Compact",
        "Brotherhood",
        "Covenant",
        "Circle",
        "Hand",
        "Council",
        "Order",
        "Assembly",
        "Pact",
        "Court",
        "Remnant",
        "Vigil",
        "Tribunal",
        "Accord",
        "Succession"
      
      ],
      faction_goals: [
        "Restore the old kingdom's bloodline to the throne before the current regent consolidates power",
        "Obtain and control the Seals of the First Age before the church does",
        "Purge all magical practitioners from the kingdom under cover of religious authority",
        "Break the necromancer's hold on the northern territories before winter",
        "Establish a free mage college independent of church oversight",
        "Seize control of the trade routes between the shattered isles",
        "Locate and open the Vault of the First Kings before the Dragon-Slayer does",
        "Unify the barbarian clans under a single banner to threaten the southern cities",
        "Locate and reseal the Scar before the entity that created it finishes remembering it did so",
        "Restore the old compact system as the basis of law before the current throne consolidates precedent",
        "Contain and study the Blight rather than fight it - understanding it is the only real option",
        "Crown the prophesied heir before any of the three false claimants triggers the war clause"
      
      ],
      faction_methods: [
        "Infiltrating noble households through marriage and service",
        "Controlling the priesthood's lower ranks as intelligence assets",
        "Funding adventuring parties to retrieve specific artefacts",
        "Using prophecy strategically - delivering only the parts that serve them",
        "Blackmailing nobles with evidence of heresy or illegitimacy",
        "Maintaining an assassin network for surgical removal of opposition",
        "Operating a legitimate scholarly institution as public cover",
        "Building loyalty among the dispossessed and disgraced",
        "Embedding scholars in Inquisition libraries to copy restricted texts before they are destroyed",
        "Keeping the old compact stones in circulation so the old law cannot be declared fully obsolete",
        "Funding monster hunters who bring them specimens instead of trophies",
        "Maintaining a network of waystation priests who owe no loyalty to any specific throne"
      
      ],
      faction_weaknesses: [
        "Their patron noble is three votes from being stripped of their title",
        "A key prophecy they've been using is starting to diverge from events",
        "Two founding members have irreconcilable philosophical differences",
        "Their artefact cache has been partially identified by church investigators",
        "They depend on one corrupt official who is being investigated",
        "An assassin they hired has been captured and knows too much",
        "Their mage asset's power is being slowly consumed by the very artefact they seek",
        "The bloodline they're restoring has a secret that would end the cause if known",
        "Their most important asset is a prophecy that may have been deliberately corrupted at the source",
        "Two-thirds of their membership believes the cause; one-third is there for the access to restricted archives",
        "The thing they are trying to restore was not actually good - it was better than current, which is different",
        "Their leader has received a divine instruction that contradicts the faction's founding purpose"
      
      ],
      faction_face_roles: [
        "the spymaster operating through seven layers of cutouts",
        "the court scholar who provides intelligence and arcane support",
        "the disgraced knight who handles the dirty work",
        "the noble patron who provides funding and political cover",
        "the defector who brought the faction's best intelligence and worst liability",
        "the prophet whose visions may or may not be manipulated",
        "the hedge mage who maintains the old wards and understands what failing them would mean",
        "the former Inquisitor who defected and brought three years of their former order's files",
        "the creature liaison who speaks for things the faction needs cooperative rather than opposed",
        "the bloodline heir who does not want the throne and is the only one who could actually hold it"
      
      ],
      complication_types: [
        "Magical shift",
        "Uninvited arrival",
        "Aspect change",
        "Resource loss",
        "Deadline introduced",
        "Collateral threat",
        "Divine intervention",
        "Ancient activation"
      ],
      complication_aspects: [
        "The Ward Just Shattered - Whatever Was Kept Out Is Now In",
        "Reinforcements Incoming - Someone Sent a Signal",
        "The Magic Is Behaving Strangely Here - Spells Are Unreliable",
        "Civilians Are Watching - This Will Be in Every Tavern by Nightfall",
        "The Building Is Structurally Compromised - Choose Quickly",
        "An Old Compact Has Been Invoked - Someone Owes Something Now",
        "The Ritual Is Accelerating - We Have Less Time Than Thought",
        "The Artefact Chose That Moment to Activate",
        "Weather Just Became Supernaturally Bad",
        "The Enemy Has a Hostage Who Complicates Everything",
        "A Third Party Has Arrived with a Claim on What We Came For",
        "The Prophecy Seems to Be Unfolding Right Now",
        "The God's Eye Is Open - Everyone Present Is Being Witnessed and Judged",
        "The Blight Has Moved Since the Last Report - The Map Is Now Wrong",
        "Something Has Been Released From the Old Binding - It Is Currently Oriented",
        "The Inquisition Has Arrived With a New Writ - Broader Than the Last One",
        "The Scar Is Widening - Visibly, Audibly, Right Now",
        "A Compact Has Been Invoked That Supersedes Everything Else in This Room"
      
      ],
      complication_arrivals: [
        "A rival adventuring company with the same objective and fewer scruples",
        "A church inquisitor who considers this scene their jurisdiction",
        "A creature bound by the old magic that has just been released",
        "A messenger bearing news that changes the stakes entirely",
        "An ancient guardian that was dormant until thirty seconds ago",
        "Someone the party owes something to, arriving at the worst possible time",
        "A creature from before the Cataclysm that should not exist and is very confused about why everyone is frightened",
        "An emissary from the Forest - not human, politely present, here with a formal grievance",
        "A company of mercenaries whose contract was to the party's enemy but whose enemy just died",
        "An old soldier who recognises this exact situation and knows how the last three versions ended"
      
      ],
      complication_env: [
        "Wild magic surge - every spell cast this scene has an unpredictable secondary effect",
        "The dungeon begins a collapse sequence, apparently intentional",
        "Supernatural darkness - not the absence of light but the presence of something",
        "The temperature drops below zero in seconds - the undead are more comfortable than the living",
        "The walls begin to move - the architecture is responding to something",
        "Fire, started by a spell mishap, spreading faster than it should",
        "The Blight touches the zone - living things in it begin to feel its pull",
        "A ley line confluence reaches maximum - magic doubles in cost and triples in effect for one exchange",
        "The ancestral binding weakens - something that was warded is no longer warded",
        "Dawn breaks during a contested ritual - the shift in divine attention changes everything mid-process"
      
      ],
      backstory_questions: [
        "What oath did you swear that you've since found a reason to question, and to whom did you swear it?",
        "What bloodline do you carry that you don't advertise, and who would come for you if they knew?",
        "What did you find in the ruins that you kept, and what has it cost you since?",
        "Who trained you, and what did they ask you to do that you refused?",
        "What is the one deed that made your name, and how much of the story is true?",
        "What does the church think you did, and are they right?",
        "What creature or entity owes you something, and what are the terms of that debt?",
        "What is the one place in the kingdom you won't return to, and why?",
        "What did you take from someone who deserved worse, and do they know it was you?",
        "What do you believe about the old magic that most scholars would call heresy?",
        "What title or rank were you offered that you didn't take, and what did you do instead?",
        "Who is hunting you, and what do they actually want?",
        "What is the prophecy that applies to you, and how much of it have you fulfilled without meaning to?",
        "What was the moment that made you leave the life you had before this one?",
        "What is the one thing you're better at than you've ever told anyone?",
        "What did the magic show you the first time it came through you, and do you believe what you saw?",
        "What kingdom did you fight for that no longer exists, and what part did you play in its ending?",
        "What creature made a pact with you that you have not fulfilled, and what happens when it collects?",
        "What does your bloodline open that you have been careful never to stand near?",
        "What is the oldest thing you have ever spoken to, and what did it want?",
        "What was your order's purpose before the Cataclysm, and what has it become since?",
        "What did you do during the war that was necessary and wrong in equal measure?",
        "What is the name you no longer use, and who still knows it?",
        "What lie have you told so many times that you no longer remember the true version?",
        "What would the world have to become for you to believe your fight was worth it?"
      
      ],
      backstory_hooks: [
        "You all received a summons from someone who is already dead. The summons is dated last week.",
        "You were each separately hired to find the same thing. None of you knew about the others until now.",
        "You share a common enemy. You didn't know that until ten minutes ago.",
        "A dying stranger gave each of you one piece of something. You've just realised the pieces fit together.",
        "Each of you carries one fragment of a shattered compact stone. They resonate in proximity. Someone made sure you would all end up here.",
        "You were all at the same battle. You were on different sides. The battle ended strangely and none of you have spoken of it until now.",
        "You share a scar in the same location on your bodies. None of you know how it got there. It has been there as long as you can remember.",
        "A dying scholar gave each of you the same instruction in different languages. You have just confirmed it was the same instruction."
      
      ],
      backstory_relationship: "Go around the group. Each player names one other PC and answers: *When did you fight on the same side, and what happened that neither of you has mentioned to anyone else?* Then each player names a second PC and answers: *What do you suspect about their past that would complicate things if you were right?*",
    },
  };

// ═══════════════════════════════════════════════════════════════════════
// CONTENT EXPANSION - v9.1 (Shattered Kingdoms)
// Inspirations: Malazan, Black Company, Witcher, Dark Souls
// ═══════════════════════════════════════════════════════════════════════
(function(){var t=CAMPAIGNS.fantasy.tables;

t.opposition = t.opposition.concat([
  {name:"Oathbound Revenant", type:"major", aspects:["Death Could Not Release Me From My Vow","The Armor Has Grown Into the Flesh","Remembers Every Face That Broke the Pact"], skills:[{name:"Fight",r:5},{name:"Will",r:4},{name:"Physique",r:4},{name:"Provoke",r:3}], stress:4, stunt:"Cannot be taken out while the oath object exists. Destroying it (overcome at Fantastic +6) makes the revenant vulnerable.", qty:1},
  {name:"War Mage Conscript", type:"minor", aspects:["The Spell Burns the Caster Too"], skills:[{name:"Lore",r:3},{name:"Shoot",r:2},{name:"Will",r:2}], stress:2, stunt:null, qty:3},
  {name:"Wyvern", type:"major", aspects:["Flies Low and Strikes Fast","Scales Like Iron, Temper to Match","The Clutch Is Nearby"], skills:[{name:"Fight",r:5},{name:"Athletics",r:4},{name:"Physique",r:4},{name:"Notice",r:3}], stress:6, stunt:"Breath weapon: once per scene, attack everyone in a zone at +4. Defend with Athletics.", qty:1},
  {name:"Blighted Wolves", type:"minor", aspects:["Corrupted by the Wound in the Land"], skills:[{name:"Fight",r:2},{name:"Athletics",r:3},{name:"Notice",r:2}], stress:1, stunt:null, qty:5},
  {name:"Hedge Witch", type:"major", aspects:["The Old Ways Before the Towers","Knows Your Name Whether You Told It or Not","The Forest Answers to Her"], skills:[{name:"Lore",r:4},{name:"Will",r:4},{name:"Empathy",r:3},{name:"Deceive",r:3}], stress:3, stunt:"Once per scene, invoke a natural aspect for free. Two free invokes if in a forest.", qty:1},
  {name:"Toll Collector with Enforcers", type:"minor", aspects:["The Bridge Belongs to the Baron"], skills:[{name:"Fight",r:2},{name:"Provoke",r:3}], stress:2, stunt:null, qty:3},
  {name:"Cursed Mirror Knight", type:"minor", aspects:["Reflects Your Technique Back at You"], skills:[{name:"Fight",r:3},{name:"Athletics",r:4}], stress:2, stunt:"+2 to defend. On defense with style, attacker takes 1 stress from reflected force.", qty:1},
  {name:"Mercenary Rear Guard", type:"minor", aspects:["Professional and Disinterested"], skills:[{name:"Shoot",r:2},{name:"Fight",r:2},{name:"Notice",r:1}], stress:2, stunt:null, qty:4},
  {name:"Deep Wurm", type:"major", aspects:["It Was Here Before the Kingdom","The Tunnels Are Its Body","Swallows Horses Whole"], skills:[{name:"Fight",r:5},{name:"Physique",r:5},{name:"Stealth",r:3}], stress:6, stunt:"Tunneling: can create new zones by burrowing. Vacated zones collapse one exchange later.", qty:1},
  {name:"Temple Guardian Automaton", type:"minor", aspects:["Stone and Prayer Given Purpose"], skills:[{name:"Fight",r:3},{name:"Physique",r:3}], stress:3, stunt:null, qty:2},
  {name:"Excommunicated Paladin", type:"major", aspects:["The Vows Still Burn Even Though the Church Cast Me Out","Fights Like Someone With Nothing Left","Knows Every Consecrated Ground and Its Weakness"], skills:[{name:"Fight",r:5},{name:"Will",r:4},{name:"Athletics",r:3},{name:"Lore",r:2}], stress:4, stunt:"+2 to attack on consecrated ground. -2 to Will when confronted with the faith's corruption.", qty:1},
]);

t.zones = t.zones.concat([
  ["The Collapsed Cloister", "Consecrated Ground - Evil Weakened", "Undead take -2 to attack; the ceiling is unstable."],
  ["The Mudflat Before the Walls", "Open Ground, Sucking Mud", "No cover; movement costs double; archers on the walls."],
  ["The Alchemist's Workshop", "Volatile Reagents Everywhere", "A stray spark could detonate the shelves."],
  ["The Throne Room - Occupied", "All Eyes on the Seat of Power", "Political power tangible; violence has cascading consequences."],
  ["The Undercrypt", "The Dead Sleep Restlessly", "Disturbing anything may wake something. Torchlight only."],
  ["The Hanging Bridge", "Swaying Over the Gorge", "Single file; cutting the ropes is trivially easy."],
  ["The Blighted Field", "Nothing Grows Here - Nothing Should", "Magic behaves unpredictably; the soil itself is hostile."],
  ["The Mill Wheel Chamber", "Deafening, Crushing Machinery", "The wheel is cover, weapon, and obstacle all at once."],
]);

t.complication_arrivals = t.complication_arrivals.concat([
  "A column of refugees fleeing the same threat the party investigates",
  "A sworn knight with orders to arrest one of the party members",
  "A wounded creature - not hostile, fleeing something worse",
  "A tax collector with armed escort claiming jurisdiction",
  "A child who claims to have been sent by someone the party thought dead",
  "A herald announcing the territory has changed hands - new laws immediately",
  "A necromancer's messenger raven carrying terms of surrender",
  "An ancient golem that just woke and follows its last thousand-year-old order",
]);

t.complication_env = t.complication_env.concat([
  "The earth splits - a fissure opens across the battlefield, creating a new zone",
  "Old wards activate - magic in this zone costs the caster 1 stress per use",
  "A flash flood from the hills turns low ground into a drowning hazard",
  "The trees begin to move - the forest is repositioning around the party",
  "A blood moon rises - creatures of the blight gain a free invoke",
  "Fog of ancient manufacture rolls in - cold, wet, and whispering names",
  "The ground consecrates spontaneously - blighted creatures cannot enter",
  "An earthquake reveals a hidden entrance to something below",
]);

t.backstory_hooks = t.backstory_hooks.concat([
  "One of you carries a blade that hums near the others. Forged for a group. This group. None of you commissioned it.",
  "You all bear the same mark - a scar in the same shape. You didn't have it a year ago.",
  "The oracle named each of you before you arrived. She named a fifth. That person isn't here yet.",
  "You all served the same lord, but in different years. That lord has been dead a century.",
  "A dying knight gave each of you a different piece of a message. Together it reads like a confession.",
  "You woke in the same ruin with no memory of the past three days. Your equipment is different.",
  "The same song follows each of you - different bards, different towns, same melody. The last verse is unwritten.",
]);

t.consequence_contexts = t.consequence_contexts.concat([
  "when the revenant's gauntlet closed around your throat",
  "catching the war mage's uncontrolled discharge",
  "falling through the rotten floor into the undercrypt",
  "when the cursed blade cut deeper than any natural weapon should",
  "holding the bridge alone while the others crossed",
  "breathing the spores from the blighted field",
  "when the wyvern's tail sweep caught you mid-dodge",
  "crushed beneath the collapsing siege tower",
]);

t.faction_face_roles = t.faction_face_roles.concat([
  "the bastard heir with a claim nobody wants to validate",
  "the battlefield chaplain who has seen too much to believe and too little to stop",
  "the caravan master whose routes are the faction's economic lifeline",
  "the court poisoner who keeps the peace through selective assassination",
  "the deserter who knows the enemy's order of battle from the inside",
  "the hedge witch whose loyalty is to the land, not the lord",
  "the siege engineer whose fortifications are the faction's greatest asset",
  "the wandering bard who carries messages in songs only initiates decode",
]);

t.complication_types = t.complication_types.concat([
  "Awakening - something ancient stirs because of the party's actions",
  "Oath Conflict - two sworn obligations contradict each other",
  "Corruption - the blight spreads to something the party values",
  "Succession - a power vacuum opens and multiple parties rush to fill it",
]);

t.current_issues = t.current_issues.concat([
  "The Blight Spreads - The magical wound in the eastern marches grows a mile each season. What it touches does not die. It changes.",
  "The Broken Throne - Three claimants, two armies, and a coronation that ended in blood. No legitimate ruler.",
]);

t.impending_issues = t.impending_issues.concat([
  "The Old Oaths Wake - Pacts sworn by kings a thousand years ago are activating. The dead rise not as enemies but as creditors.",
  "The Last Library Burns - Someone is destroying every archive of pre-war magic. When the knowledge is gone, the blight is permanent.",
]);

})();

// ═══════════════════════════════════════════════════════════════════════
// AUDIT FIXES - v9.2 (Shattered Kingdoms)
// Blight phenomenology, Inquisition depth, genre-specific adjectives,
// issue normalization
// ═══════════════════════════════════════════════════════════════════════
(function(){var t=CAMPAIGNS.fantasy.tables;

// Blight phenomenological setting aspects
t.setting_aspects.t = t.setting_aspects.t.concat([
  "The Blight Doesn't Kill - It Rewrites. Flesh Becomes Fungal. Stone Becomes Porous. Memory Becomes Unreliable.",
  "Magic Has a Wound Tax Here - Every Spell Leaves a Scar on the Land That Doesn't Close",
  "The Blighted Lands Are Not Dead - They Are Alive in a Way That No Longer Includes Us",
]);

// Blight-specific complication_env entries
t.complication_env = t.complication_env.concat([
  "Blight spores drift through the zone - exposed skin develops grey veining within minutes. Reversible, but not comfortable.",
  "The blighted ground is warm and pulsing - something underneath is growing toward the surface",
  "A blighted tree drops fruit that looks perfect. The fruit is aware of being observed.",
]);

// Inquisition faction face roles and theology
t.faction_face_roles = t.faction_face_roles.concat([
  "the High Inquisitor whose faith is genuine and whose methods are monstrous - they see no contradiction",
  "the Inquisition's field torturer who has begun to doubt but cannot stop without being subjected to their own tools",
  "the young inquisitor who joined to help people and has just witnessed their first burning",
]);

// Inquisition compel situations
t.compel_situations = t.compel_situations.concat([
  "The Inquisition believes magic is the Blight's vector - and you just used magic in front of a witness",
  "The Inquisition's theology holds that the Blight is divine punishment. Curing it is heresy. You have a cure.",
  "The Inquisitor asks you a direct question. Lying to the Inquisition is a capital offence. The truth is worse.",
]);

// Genre-specific minor concept adjectives
t.minor_concepts.v.FmAdj = t.minor_concepts.v.FmAdj.concat([
  "blight-touched", "oath-scarred", "exile-branded", "war-tithe", "hedge-born",
  "famine-gaunt", "consecration-burned", "pact-bound",
]);

// Issue normalization
var keys = ['current_issues','impending_issues'];
keys.forEach(function(k){
  for(var i=t[k].length-1;i>=0;i--){
    if(typeof t[k][i]==='string'){
      var p=t[k][i].split(' - ');
      t[k][i]={name:p[0],desc:p.slice(1).join(' - ')};
    }
  }
});

})();
