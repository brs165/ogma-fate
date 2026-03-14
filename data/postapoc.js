// data/postapoc.js
// Campaign data for Postapoc.
// Requires data/shared.js to be loaded first (provides CAMPAIGNS object).

CAMPAIGNS["postapoc"] = {
    meta: {
      id: "postapoc", name: "The Long Road",
      tagline: "Scavenger World. The beautiful apocalypse — nature reclaims the ruins while the living pick through the lethal artifacts of everything that came before.",
      icon: "◻", font: "'Inter', sans-serif",
    },
    colors: {
      bg:"#090807", panel:"#100e0c", border:"#2a2018",
      gold:"#d08030", accent:"#a86020", dim:"#604010",
      text:"#c8b898", muted:"#302010", textDim:"#706040",
      red:"#c03020", blue:"#304858", green:"#486030", purple:"#6a4030",
      tag:"#a8602022", tagBorder:"#a8602044",
    },
    lightColors: { bg:"#f8ece0", panel:"#fff5ec", border:"#c07840", gold:"#5a2008", accent:"#4a1400", dim:"#703010", text:"#1c0c04", muted:"#603020", textDim:"#482818", red:"#700000", blue:"#182840", green:"#184020", purple:"#300858", tag:"#d0803022", tagBorder:"#d0803018" },
    tables: {
      names_first: ["Dust","Scar","Callie","Wreck","Muro","Sera","Grit","Juno","Colt","Ruin","Vera","Flint","Hale","Kase","Drift","Bren","Ash","Tova","Lev","Crow","Nett","Sable","Wick","Dune","Grime","Rust","Patch","Tread","Char","Silt","Kole","Raze","Cinder","Thresh","Gully","Brace","Vex","Soot","Pike","Tern","Pale","Tack","Cress","Shale","Wren","Burl","Cade","Nell","Fenn","Gorse","Ellie","Joel","Kirsten","Arthur","Riley","Frank","Bill","Tess","Tommy","Gus","Bear","Slade","Onyx","Maren","Thera","Quill","Lode","Olamide","Zahra","Travis","Bankole","Emery","Natividad","Allie","Brand","Resin","Sage","Shiv","Thane","Vane","Acre","Crag","Dray","Ember","Fallow","Gale","Haven","Kite","Loam","Nori","Oak","Pell","Shard","Ursa","Foxtrot","Mira","Nix","Parish","Rail","Thistle","Mar","Kirra","Asha","Elspeth","Donal","Zara","Tem"],
      names_last: ["of the Last Rain","the Survivor","Bonedry","Hollowbred","the Wanderer","Ashwick","Saltborn","Redfield","Before-Time","Ironback","of the Long Walk","Coldvault","the Last of Them","Dustborn","Sootmark","Rainsong","of Nowhere","the Reclaimed","Bitter","the Fed","of the Green Zone","Rad-scarred","Before-the-Rain","the Unchanged","Scar-Tongue","of the Black Road","Vault-Born","the Carrier","Ash-Heel","of the First Winter","Two-Roads","the Long-Haul","of the Outbreak Line","Dust-Lung","the Uninfected","Cinder-Wake","of the Settlement Days","Firecarrier","of the Green Place","Firstgen","Hardway","Coldspring","the Unlast","Secondborn","of the Long Winter","the Unburied","Saltlick","Burnthorn","Greystock","the Intact","Raidblood","of the Open Road","Cinderborn","Runningwater","Mudborn","the Willing","of the Last Bloom","Dirtborn"],
      minor_concepts: {
          t: [
            "A {PmAdj} {PmRole}",
            "{PmRole} working for {PmMaster}",
            "A {PmAdj} {PmRole} with {PmTrait}",
            "{PmRole} — {PmStatus}",
            "Canned-Food Tycoon",
            "Fuel-hungry Biker",
            "Hazmat-suited Prophet",
            "Mutated Dog-Trainer",
            "Pre-War History Buff",
            "Pre-War-Dreamer Rust-bound Mechanic",
            "Rad-hardened Scav-king",
            "Radio-tower Operator",
            "Rusted-Armor Raider",
            "Traveling Medicine Man",
            "Wasteland Scav-rat",
            "Water-purifier Guard"
          ],
          v: {
            PmAdj: ["scarred", "desperate", "armed", "wary", "faction-loyal", "hardened", "trigger-cautious", "pre-war-trained", "road-worn", "hollow-eyed", "settlement-bred", "hired", "infected-adjacent", "zone-touched", "pre-war-trained beyond their context", "community-expelled", "carrier-tested", "vault-born but surface-adapted", "grief-hollowed", "road-faithful", "self-sufficient to a fault", "running from a specific thing", "infection-adjacent", "zone-hardened", "prophet-marked", "cult-adjacent", "hybrid-aware", "fungal-exposed", "nature-reclaimed", "vault-born", "road-prophet", "carrier-cautious"
            ],
            PmRole: ["settlement guard", "warlord's conscript", "road scavenger", "water-monopoly enforcer", "raider scout", "convoy guard", "black-market dealer", "faction lookout", "salvage runner", "community enforcer", "tribal soldier", "pre-war equipment operator", "infected-zone guide", "pre-war records keeper", "seasonal crop worker", "mobile medic on a circuit", "checkpoint toll-collector", "community memory-keeper", "wild-zone forager", "vault threshold guardian", "travelling teacher with no students left", "scavenger who knows the rewilded sectors", "zone guide", "prophet's aide", "hybrid escort", "fungal zone cleaner", "archive keeper", "cult defector", "pre-war archivist", "community teacher", "infection monitor", "nature preserve warden"
            ],
            PmMaster: ["the settlement council", "the warlord's roster", "the convoy lead", "whoever's paying this week", "a faction that doesn't name itself", "standing orders from two steps up the chain", "the community they will not name but are clearly going back to", "a faction that doesn't have a flag yet but is building toward one", "whatever is broadcasting on the emergency frequency", "the prophet who may be genuinely right", "the cult whose demands don't ask for consent", "a hybrid child community they've been protecting for three years"
            ],
            PmTrait: ["nothing left to lose", "orders they don't question", "a community to feed", "a grudge that outlasted its reason", "enough pre-war knowledge to be dangerous", "a limited resource and a shorter temper", "a route no one else will take", "a test result they carry in a sealed envelope", "a skill that predates the collapse by forty years", "knowledge of the Zone that nobody else has", "a copy of the pre-war text that people are dying for", "an immune status they haven't confirmed to anyone"
            ],
            PmStatus: ["bought not loyal", "here because the road brought them", "doing the job the settlement needs done", "not paid enough for complications", "three bad decisions from switching sides", "not going where they say they're going", "carrying something that determines their value to multiple parties", "three days from a decision they have been putting off for three years", "working for something they believe in and may be right about", "three days away from a decision they cannot undo", "carrying the wrong thing through the right territory"
            ],
          }
        },
      minor_weaknesses: ["Needs the Medicine More Than the Money","Family Is Somewhere in the Wastes — That's Leverage","The Radiation Has Already Won","Will Turn on Anyone Who Threatens Their Stash","One Reminder of Before and They Break","Owes a Debt to the Warlord That Won't Clear","The Hunger Has Made Them Unpredictable","Terrified of the Dark Since the Incident","Can't Read — That's More Dangerous Than It Sounds","Loyalty to a Dead Faction They Haven't Let Go Of","The Radiation Count Is Already Too High — This Trip Makes It Worse","Their Settlement Would Not Survive Losing Them","Three People Know Their Real Name From Before — One Is Here","The Medicine Keeps Them Functional and Running Low","Can't Leave a Kid Behind. Full Stop.","Pride About the Old Skills — Will Not Admit They've Rusted","Old Faction Brand Still Visible — Wrong Territory","The Injury Didn't Heal Right and Never Will","Compelled to Hoard — Even Things They Don't Need","Owes Two Seasons of Tithe to the Wrong Warlord","Terrified of the Sick — Irrational, Uncontrollable","Can't Shoot Someone They Know — It's a Problem","The Thing They Carry Draws the Wrong Kind of Attention","Will Not Cross Running Water at Night — Superstition With a Basis","Their Conscience Takes Up Space They Cannot Afford","The Dog Tags Around Their Neck Are From Three Different People","Known Informant — Former, But the Reputation Persists","Too Proud to Take Charity Even When They Need It","The Signal Their Implant Emits Can Be Tracked","The Code They Were Given Before the Collapse Still Runs","The Symptoms Have Been Managed For Three Weeks and the Supply Is Calculated to the Day","The Condition Requires Silence to Manage and That Is Not Always Available","There Is One Daily Practice That Keeps the Dark Back and Running Out of the Means to Do It","The Object Carried Has No Survival Value and Its Loss Would Be Catastrophic","Proximity to Violence Costs Them What It Costs Their Target","Every Death on a Route They Led Adds to a Mental Ledger They Keep Current","Their Appearance Marks Them as Something the Wrong Faction Shoots on Sight","Their Specific Knowledge or Ability Has No Succession and They Have Not Trained Anyone","They Carry Something That Multiple Factions Would Kill For — and Will Not Trade It","Cannot Remain Stationary Without Cycling Through Every Exit in Order — Cannot Conceal This Under Stress","Requires an Audience for Risk — Will Escalate to Create One","Their Origin Community Would Be Killed on Sight in Three of the Local Territories","The Scar from That Thing in the Third Year Has Never Healed and Occasionally Opens","Their Relationship With Scarcity Was Set Long Before They Could Choose It and Has Never Recalibrated","They Are Afraid of What They Would Ask For If They Found What They Were Looking For","The Single Most Important Piece of Equipment Is Visible, Known, and the Thing Everyone Targets First","The Animal They Travel With Is the Clearest Leverage Anyone Has Ever Had on Them","The Garden / Cache / Store Is the One Thing They Cannot Make a Rational Decision About","Has Not Grieved Either World and the Backlog Is Structural","The Brand, Number, or Marking from Their Origin Community Identifies Them to Anyone Who Knows to Look","The Thing I Carry Was a Child's and the Child Didn't Make It","My Immunity Makes Others Desperate Enough to Consider Taking It by Force","I Know the Safe Route Through the Toxic Zone and I Cannot Explain How Without Explaining Everything Else","I Am Teaching Someone Who Is Better Than Me and Running Out of Time to Finish","The Settlement's Food Supply Depends on a Secret Nobody Else Can Know","Cannot Pass a Child in Distress — Full Stop, Every Time, No Exceptions","I Still Carry the Book Even Though I Know What It Would Trade For Out Here","The Bloom Perimeter Is Three Miles Closer Than Last Season and I Have Not Told Anyone Yet","I Know What Is in the Vault and I Know Why It Should Stay There and I Have Not Decided What to Do","My Voice Carries — Any Quiet Place Becomes a Dangerous One When I Am In It","I Was the One Who Made the Call That Burned the Last Settlement — They Do Not Know It Was Me","I Will Not Abandon a Viable Seed Even in a Firefight — It Slows Everything Down Every Time","What I Need the Medicine For Would Change How Everyone Here Treats Me","I Was a Prophet's Second Before I Left — The Followers Still Find Me and Still Believe","I Have Made One Decision That Saved One Person and Ended Everyone Else's Options — and I Would Do It Again","I Know My Exposure Schedule Is Already Past the Point of Useful Denial","The Route I Know Goes Through Territory Belonging to Someone I Cannot Face Again","There Is One Thing I Will Not Eat No Matter How Long the Road Gets","I Have Seen What Hope Does to People and I Cannot Let Myself Be That For Someone","My Hands Are Steady Until I Am Safe — Then They Shake and Do Not Stop"],
      major_concepts: {
          t: [
            "A {PmajAdj} {PmajRole} who {PmajDrive}",
            "Former {PmajRole} turned {PmajAlt}",
            "The {PmajRep} {PmajRole} on {PmajRoad}",
            "A {PmajAdj} {PmajRole} carrying {PmajBurden}",
            "Courier of the Wasteland Mail",
            "Crazed Prophet of the Atomic God",
            "Ex-Military Commander of the Enclave",
            "Leader of the New Settlement",
            "Lone Wanderer guarding the last functional seed-vault",
            "Lone Wanderer on a mission",
            "Mercenary guarding a Seed-Vault",
            "Mutant searching for a cure",
            "Scavenger searching for the Last City",
            "Survivor of the First Blast",
            "Warlord of the Waste-Track"
          ],
          v: {
            PmajAdj: ["road-scarred", "legendary", "warlord-adjacent", "community-born", "pre-war-trained", "exile", "faction-burned", "indebted", "hunted", "ruthless", "trusted", "broken", "infected-adjacent but functional", "last-generation trained", "community-founding", "zone-changed but present", "carrying-the-fire type", "vault-born and surface-adapted", "grief-driven", "pre-war-trained in the one thing that matters most right now", "infection-immune", "zone-touched", "prophet-adjacent", "cult-burned", "archive-keeper", "nature-reclaimed", "hybrid-guardian", "last-known", "fungal-scarred", "pre-war-remnant"
            ],
            PmajRole: ["warlord", "settlement leader", "long-road trader", "pre-war survivor", "community medic", "faction commander", "water-rights controller", "scavenger legend", "convoy commander", "road law enforcer", "pre-war engineer", "vault keeper", "infected-zone guide who has never lost a party", "pre-war agricultural specialist keeping one farm viable", "community founder whose settlement has survived two winters", "last practising doctor in four days' travel", "mobile archivist carrying the region's pre-war record", "reformed warlord lieutenant trying a different method", "vault overseer who opened the door and has to live with what came out", "Zone guide", "pre-war archivist", "hybrid sanctuary keeper", "travelling company leader", "community founder", "cult survivor", "fungal researcher", "last-known medic", "signal keeper"
            ],
            PmajDrive: ["controls three settlements through water rights alone", "knows where pre-war caches are and rations that knowledge", "works every faction simultaneously and owes them all", "is three years from building something that lasts", "holds enough pre-war knowledge to be worth keeping alive", "carries a responsibility that outlasted everyone who shared it", "built the settlement and knows exactly which foundations are wrong", "is the only person in the region who knows the infected zone's current safe routes", "has been documenting the pre-war collapse's causes and is close to something definitive", "built the settlement and knows which of its compromises are going to fail and when", "carries the one technical document that makes the water treatment system fully operational", "carries the last copy of a specific pre-war text and knows what happens if it reaches the wrong community", "has been mapping the Zone for eleven years and understands approximately half of what it does", "built the hybrid sanctuary and has never told the faction network it exists"
            ],
            PmajAlt: ["community asset", "neutral trader", "warlord lieutenant", "liability", "reluctant protector", "the last one who knows"],
            PmajRep: ["most feared", "most trusted", "most useful", "most indebted", "most dangerous", "last surviving"],
            PmajRoad: ["the long road", "the trade route", "the region", "the settlement circuit", "the waste crossing", "every community within three days"],
            PmajBurden: ["pre-war knowledge that can't be shared safely", "a debt that outlasted the creditor", "a community that depends on them being right", "a secret about the settlement's founding", "a responsibility nobody else can carry yet", "a past that contradicts who they've become", "knowledge of what is in the quarantine zone that would change every faction's strategic calculus", "a prior decision that saved sixty people and killed twelve who didn't know they were in the calculation", "the location of the pre-war cache that every faction would weaponise and every community needs as food", "an immune status that makes every faction's calculus about them different", "the Zone route that everyone needs and only they know and it is changing", "a community of hybrid children who have no other advocate"
            ],
          }
        },
      troubles: [
        "Everything I've Built Will Outlast Everyone I've Built It With",
        "The Medicine That Keeps Me Going Is Running Out",
        "I Know What I Did to Survive Before and So Does Someone Else",
        "My People Trust Me and I'm Not Sure They Should",
        "The Old World Left Things in Me I Can't Name",
        "I Keep Collecting Debts I Can't Pay",
        "I've Seen What Happens When Hope Runs Out",
        "My Methods Are Necessary and I Cannot Prove It",
        "The Thing I Did in the First Year Follows Me",
        "Loyalty to the Living and Guilt About the Dead",
        "The Addiction Is All That Gets Me Through the Night — Has Been for Years",
        "Something Has Been Hunting Me Since I Left the Compound",
        "My Notorious Name Makes Every New Settlement a Gamble",
        "I Was Indebted Before the War Ended — The Creditor Survived",
        "The Radiation Is Already in Me — This Trip Just Accelerates the Schedule",
        "I Was the Reason That Settlement Burned — They Don't Know It Yet",
        "The Cure Requires Something I Cannot Take Without Hurting Others",
        "My Pre-War Identity Would End Everything I Have Built Since",
        "I Have Made Promises to Eighty People That Conflict With Each Other",
        "The Warlord Holds Something I Cannot Afford to Buy Back",
        "I Trust Nobody — That Is Correct and Also a Problem",
        "Everything I Have I Stole From the People Who Needed It More",
        "My Methods Work and I Cannot Justify Them",
        "The Code I Know Would Change Everything — If I Used It",
        "I Was Built for the Old World and I Do Not Fit the New One",
        "Three Settlements Call Me Their Leader and None Know About the Others",
        "I Have Kept One Person Alive at Enormous Cost — to Everyone Else",
        "The Thing I Found in the Vault Should Not Be Used and Cannot Be Destroyed",
        "My Loyalty to the Living Keeps Compromising My Obligations to the Dead",
        "I Know Where the Pre-War Weapon Cache Is and I Cannot Tell Anyone",
        "I Have Kept One Person Alive at Costs I Cannot Count and Cannot Stop and Cannot Justify to Anyone Else",
        "I Am Building Something That Will Outlast Me and Every Day I Stay Is a Day I Could Have Been Moving",
        "Everyone's Future Was on That Table and I Chose One Person and I Would Do It Again and That Is the Problem",
        "Survival Is Insufficient and I Cannot Convince Anyone of That Including Myself on Bad Nights",
        "The One I Am Protecting Is the Cure and the Threat and I Have Not Yet Decided Which Matters More",
        "I Know the Safe Path Through the Zone and I Cannot Share It Without Sharing Everything Else I Know",
        "I Am Preserving Knowledge I Do Not Fully Understand Because Nobody Else Is and That Has to Be Enough",
        "I Am Responsible for the One Person Who Cannot Die and That Knowledge Has Changed Everything About Me",
        "I Know What the Vault Was Designed to Test and I Know That Some of My Community Were the Variables",
        "I Know What the Knowledge I Carry Would Do in the Wrong Hands and I Carry It Anyway",
        "I Am the Last One Who Remembers How It Was Done and the Method Dies With Me If I Cannot Teach It in Time",
        "I Have Enforced the Water Rules and Some of Those I Enforced Them On Did Not Survive the Season",
        "I Know Where the Food Supply Comes From and I Have Been Eating It and So Has Everyone I Am Protecting",
        "The Rule That Keeps My Community Safe Is a Rule I Have Broken and Have Not Told Anyone",
        "I Told Them It Was Safe to Come Down and I Was Right and I Was Wrong and People Died From Both",
        "What I Am Would End My Place Here Instantly If the Community Knew — and the Community Would Be Correct",
        "I Have Read the Pre-War Record of What This Region Did and I Cannot Tell Anyone and I Cannot Forget It",
        "I Will Not Use the Pre-War Weapon Even If We Lose Without It and I Have Not Explained Why to Anyone",
        "I Know the Location of the Green Place and I Am Not Telling Anyone Where It Is Yet Because They Are Not Ready",
        "I Have Enough Medicine for the Community or Enough for the Road and I Have Already Made My Choice"
      
      ],
      other_aspects: {
          t: [
            "{POAdj} for the {PODomain}",
            "{POVerb} What the {POSubj} {POAct}",
            "My {POThing} Is {POState}",
            "{POAdj} on the {PODomain}",
            "I Know Which {PODomain} {POVerb}",
          ],
          v: {
            POAdj: ["Built", "Road-Hardened", "Settlement-Bred", "Pre-War-Trained", "Known", "Marked", "Trusted", "Wanted", "Faction-Burned", "Scarred"],
            PODomain: ["Long Road", "Settlement Circuit", "Waste Crossing", "Water Rights", "Pre-War Cache", "Warlord Country", "Black Market", "Community Network"],
            POVerb: ["Survived", "Know", "Remember", "Carried", "Held", "Found", "Lost", "Still Carry"],
            POSubj: ["road", "waste", "settlement", "warlord", "faction", "supply line", "official map"],
            POAct: ["Doesn't Survive", "Can't Map", "Won't Remember", "Won't Supply", "Never Admits", "Gave Up On", "Never Found", "Takes Eventually"],
            POThing: ["Cache", "Pre-War Knowledge", "Settlement Loyalty", "Road Map", "Medical Supplies", "Water Rights", "Community"],
            POState: ["Three Seasons Ahead", "Worth More Than My Next Water Ration", "Mine Until the Road Takes It", "The Only One Left Who Knows", "Running on Pre-War Documentation", "Held Together With What I Could Find"],
          }
        },
      stunts: [
        {name:"Scavenger's Eye",skill:"Notice",desc:"+2 to overcome when searching ruins, vehicles, or abandoned structures for useful materials.",type:"bonus"},
        {name:"Wasteland Navigation",skill:"Lore",desc:"+2 to overcome when navigating by landmarks, sun position, or pre-war maps across open terrain.",type:"bonus"},
        {name:"Field Surgery",skill:"Crafts",desc:"+2 to overcome when treating injuries with improvised equipment or limited supplies.",type:"bonus"},
        {name:"Threat Assessment",skill:"Notice",desc:"+2 to create advantages representing tactical evaluation of a group, position, or settlement's defences.",type:"bonus"},
        {name:"Road Fighter",skill:"Fight",desc:"+2 to attack when fighting in the open: roads, open ground, or unstructured terrain.",type:"bonus"},
        {name:"Scrap Engineering",skill:"Crafts",desc:"+2 to overcome when building, repairing, or modifying pre-war technology with post-war materials.",type:"bonus"},
        {name:"Long Road Contacts",skill:"Contacts",desc:"+2 to overcome when calling on favours from settlements, trading posts, or road groups along known routes.",type:"bonus"},
        {name:"Two-Step",skill:"Deceive",desc:"+2 to overcome when running a con, misdirection, or false identity in a community that hasn't seen many outsiders.",type:"bonus"},
        {name:"Dead Shot",skill:"Shoot",desc:"+2 to attack when you have time to aim and the target hasn't moved this exchange.",type:"bonus"},
        {name:"Survival Instinct",skill:"Athletics",desc:"+2 to defend against environmental hazards: radiation, extreme heat, poison, and physical traps.",type:"bonus"},
        {name:"Last Round",skill:"Shoot",desc:"Once per scene, make one attack with a weapon you've declared empty or broken — it works, once, then it's genuinely gone.",type:"special"},
        {name:"Shake It Off",skill:"Physique",desc:"Once per scene, clear your lowest filled stress box as a free action after taking physical damage.",type:"special"},
        {name:"Cache Memory",skill:"Lore",desc:"Once per scene, declare that you hid supplies at this location during a prior journey — food, medicine, ammunition, or fuel.",type:"special"},
        {name:"Fear of the Wastes",skill:"Provoke",desc:"Once per scene, your reputation or demeanour causes all minor NPCs in the zone to hesitate — they cannot act this exchange unless attacked first.",type:"special"},
        {name:"Jury Rig",skill:"Crafts",desc:"Once per scene, make a piece of broken equipment functional for one scene — no roll, but it doesn't survive beyond this use.",type:"special"},
        {name:"Read the Settlement",skill:"Empathy",desc:"Once per scene, identify the single greatest tension or secret in a community you've spent at least one hour in.",type:"special"},
      {name:"Eagle Eye",skill:"Notice",desc:"+2 to Notice when spotting movement in the wastes.",type:"bonus"}, {name:"Ghost of the Wastes",skill:"Stealth",desc:"+2 to Stealth when in ruins or open desert.",type:"bonus"}, {name:"Hard-Bargainer",skill:"Resources",desc:"+2 to Resources when trading for water or fuel.",type:"bonus"}, {name:"Intimidating Scar",skill:"Provoke",desc:"+2 to Provoke against other survivors.",type:"bonus"}, {name:"Jury-Rig",skill:"Crafts",desc:"Once per scene repair a broken device instantly for one use.",type:"special"}, {name:"Makeshift Mechanic",skill:"Crafts",desc:"+2 to overcome obstacles using damaged or scrap technology.",type:"bonus"}, {name:"Rad-Resistant",skill:"Physique",desc:"+2 to Physique when resisting environmental radiation.",type:"bonus"}, {name:"Scrapper",skill:"Crafts",desc:"+2 to Crafts when building items from junk.",type:"bonus"}, {name:"Sure Shot",skill:"Shoot",desc:"+2 to Shoot when using bolt-action rifles.",type:"bonus"}, {name:"Survivor's Luck",skill:"Will",desc:"Once per session re-roll a failed defense roll.",type:"special"},
        {name:"Wasteland Ghost",skill:"Stealth",desc:"+2 to defend with Stealth when in open ruined landscapes.",type:"bonus"},
        {name:"Wasteland Navigator",skill:"Drive",desc:"+2 to Drive when traveling off-road.",type:"bonus"}],
      scene_tone: {
          t: [
            "{PtAdj} and {PtAdj2}",
            "{PtNoun}-heavy {PtQual}",
            "The light is {PtLight}",
            "{PtQual} — every surface {PtSurface}",
          ],
          v: {
            PtAdj: ["Dust-heavy", "Desperate", "Wary", "Radiation-adjacent", "Siege-worn", "Tense", "Resource-thin", "Faction-watched", "Road-worn", "Settlement-fragile", "Infection-adjacent", "Zone-touched", "Fungal-edged", "Nature-reclaimed", "Cult-saturated"],
            PtAdj2: ["armed with nothing to spare", "watching the horizon for reasons", "barely holding together", "three wrong moves from violence", "carrying the weight of everything that's failed here", "improvised and intact", "watching every entrance", "quiet the way bad places are quiet", "built from whatever was left", "a generation past its last good day", "carrying something that came home from the Zone", "thin over something that has been building for decades", "holding very still in the way things hold still before they act"],
            PtNoun: ["Desperation", "Radiation", "Faction", "Hunger", "Scarcity", "Ruin", "Dust", "Pre-War Memory", "Fungal", "Silence"],
            PtQual: ["standoff", "armed negotiation", "fragile community tension", "barely-maintained truce", "road pressure", "siege weight", "warlord shadow", "desperate calm"],
            PtLight: ["the wrong colour", "filtered through something it shouldn't be", "pre-war quality and that alone is suspicious", "the kind that means something is burning", "fading faster than expected", "wrong for the time of day"],
            PtSurface: ["improvised", "pre-war and showing it", "carrying evidence of what happened here", "wrong in a way that means something", "marked by whoever held this ground last", "patched and patched again"],
          }
        },
      scene_movement: ["Rubble Fills the Main Passage","Flooded Ground Floor — Ankle Deep in Dark Water","Chain-Link and Razor Wire Everywhere","Collapsed Highway Overpass — One Crossing Only","Soft Ground — Running Sinks You","Burning Debris Closing One Route Per Exchange","Dense Overgrowth Swallowing the Path","Toxic Gas Pocket Drifting Across a Zone","Unstable Floor — Creaks Warn, Then Fails","Radiation Hotzone Between Two Zones — Brief Crossing Is Survivable","Root System Has Fractured the Floor — Every Step Requires a Notice Roll","Flooded Basement Below — The Floor Is Making Sounds","Spore Corridor — Movement Without Respiratory Protection Accumulates Stress","Soft Ash Drift — Knee Deep in the Low Points","Sound Triggers Movement — Noise in This Zone Draws the Hunters","Collapsed Archive Stacks Choke Every Passage","Locked Gate Divides Zones — The Key Is on the Wrong Side","Rapidly Rising Water From the Burst Pre-War Main","Irrigation Ditch Running Between Zones — Hidden Depth","Pre-War Automated Gate Cycling Open and Closed on Its Own Schedule","Thorned Vines Have Sealed the Direct Route Completely","Swarm Activity in the Middle Zone — Movement Triggers Them","Zone Rule Unknown — Each Step in This Area Requires a Declare","Sinkhole Has Widened Since the Last Map — Gap Now Requires Athletics Overcome","Ground-Level Mist Obscures Footing — All Athletics Rolls at +1 Difficulty"],
      scene_cover: ["Rusted Vehicle Hulks","Broken Concrete Barriers","Shipping Container Stack","Collapsed Wall Segments","Dense Scrub — Cover but No Armour","Industrial Machinery — Dead but Solid","Sandbag Wall From the Last Occupation","Overturned Fuel Tanker","Rusted Train Carriage","Debris Pile — Unstable Cover","Overturned School Bus, Partially Upright","Dense Overgrowth Around the Old Foundation","Pre-War Parking Structure Pillars — Solid Concrete","Stack of Pre-War Shipping Pallets, Lashed Together","Burned-Out Food Truck Hull","Industrial Pipe Run — Low but Solid","Pre-War Retail Shelving, Collapsed Inward","Wrecked Military Vehicle — Armoured Hull Still Intact","Large Animal Carcass — Grim but Effective","Heavy Sound-Absorbing Curtains Still Hanging","Train Carriage Turned On Its Side","Pre-War ATM Machine — Embedded in Concrete, Unmovable","Dense Thorned Hedgerow Reclaiming the Perimeter","Gabion Wall Filled With Rubble — Community-Built","Collapsed Supermarket Racking — Three Layers Deep"],
      scene_danger: {
          t: [
            "{PdAdj} {PdHazard}",
            "{PdHazard} that {PdBehave}",
            "Active {PdSys} with {PdResult}",
            "{PdHazard} — {PdWarn}",
          ],
          v: {
            PdAdj: ["Pre-war", "Unstable", "Radiation-leaking", "Improvised", "Structural", "Armed", "Toxic", "Faction-placed", "Automated", "Collapsing"],
            PdHazard: ["structural collapse zone", "radiation leak", "booby-trapped scavenge site", "warlord kill zone", "contaminated water source", "improvised explosive device", "pre-war automated defence", "toxic chemical storage", "pressurised fuel line", "armed trap array"],
            PdBehave: ["responds to movement", "has been armed since before the party arrived", "doesn't distinguish friend from raider", "is already past safe threshold", "triggers the next hazard if disturbed", "was placed by someone who knew this route", "escalates with each approach", "has a range larger than visible"],
            PdSys: ["pre-war automated defence", "structural integrity", "toxic containment", "warlord trap network", "radiation source", "armed perimeter"],
            PdResult: ["no way to contain the exposure", "a collapse radius covering the exit routes", "enough damage to end a community", "a timer nobody put a clock on", "evidence of exactly who placed it here"],
            PdWarn: ["the safe path requires knowledge not born yet", "dismissing it costs more than dealing with it", "someone knew exactly where to put this", "this is both the danger and the message", "a previous crew left a mark nobody understood until now"],
          }
        },
      scene_usable: ["Fuel Barrel Stack — Heavy Projectile","Panicking Civilian Refugees","Pre-War Vehicle — Dead Engine but Good Cover","Working Hand Pump — Water Leverage","Broadcast Radio Tower — Working if Someone Can Reach It","Explosive-Packed Vehicle, Keys In","Locked Pharmacy Cache — Visible Through Glass","Watchtower With Line of Sight — And Nothing In It","Pre-War Alarm System — Loud If Triggered","Feral Animals — Noisy and Directable","Abandoned Fallout Shelter","Acidic rain burst","Crumbling Concrete Walls","Discarded Gas Masks","Flickering Pre-War Signs","Howling Desert Wind","Irradiated Puddles","Rusted Highway Overpass","Scavenged Barricades","Sinking Highway overpass","Skeleton-filled Bus","Wind-blown Sand Dunes","Fungal Growth Blocking a Passage — Flammable","Pre-War Recording Playing on a Loop — Someone Left It Running","Greenhouse Dome, Intact and Occupied by Plants Only","Child Hiding in the Debris — Knows the Layout","Pre-War Medical Vending Machine, Locked but Visible","Signal Repeater Tower — Reachable With Athletics 3","Feral Animal Pack — Noisy, Directable by the Right Approach"],
      zones: [["The Highway","Open and Exposed","Open and exposed; vehicles are cover, speed is survival."],["The Settlement Gate","Defensible Chokepoint","One good defender holds; one explosion takes it."],["The Market Square","Desperate Civilians","Collateral damage causes political consequences."],["The Ruins","Unstable and Concealing","Ambush territory; every footstep is a risk."],["The Vault Door","Worth Dying For","What\'s behind it may be worth dying for."],["The Water Source","The Only One for Miles","Whoever controls this controls the region."],["The Radio Tower","Broadcasting Range","Whoever holds it speaks to everyone."],["The Medical Bay","Scarce Resources","Worth dying for; worth killing for."],["The Fuel Dump","One Spark From Catastrophe","Enormous leverage; enormous risk."],["The Bridge","Single Point of Crossing","Control it or go around — a two-day detour."],["The Fungal Zone","Active Spores — Respiratory Gear Required","Each exchange without protection accumulates one stress; fire clears zones but permanently closes them."],["The Greenhouse Dome","Nature Reclaimed, Pre-War Glass Intact","Rich in resources; acoustics carry; the plants have grown through the infrastructure."],["The Moving War Rig","Sixty Miles Per Hour — Nothing Is Fixed","All Athletics difficulty increases by 1; falling out ends involvement in the scene."],["The Anomalous Zone","Rules Unknown and Variable","Each exchange in the Zone, the GM introduces one new environmental aspect no one can explain."],["The Pre-War Archive","Irreplaceable and Burning","Every exchange without active suppression, one piece of knowledge is permanently gone."],["The Community Vault","Everything the Settlement Has Left","Collateral damage here costs community stress, not just scene stress — the consequences outlast the fight."]],
      current_issues: [
        {name:"The Water Is Being Taxed",desc:"The largest clean water source in three days' travel now has a toll. The warlord running it is reasonable — until they aren't. People are starting to die.",faces:[{name:"Warlord Scar Ironback",role:"Believes the toll is fair; will enforce it absolutely"}],places:["The Reservoir Settlement","The Surrounding Three Communities"]},
        {name:"The Road Gang Took the Convoy",desc:"A supply convoy carrying medicine for four settlements was taken. Three drivers survived. Nobody's claiming responsibility. The settlements can't wait long.",faces:[{name:"Survivor Vera Before-Time",role:"Saw who took it — scared to say"}],places:["Highway Section 7","The Gang Territory East of the Ridge"]},
        {name:"The Sickness Is Spreading",desc:"A new illness is moving through three communities. It looks like radiation sickness but the exposure levels don't match. Something is in the water or the air.",faces:[{name:"Doctor Callie the Reclaimed",role:"Has the data; doesn't have the cause or cure"}],places:["The Affected Communities","The Suspected Source Upriver"]},
        {name:"The Pre-War Vault Has Opened",desc:"A facility sealed since the collapse has opened. People have gone in. Some have come out with extraordinary things. Some haven't come out at all.",faces:[{name:"Scavenger Flint of the Long Walk",role:"Been in three times; knows more than he's saying"}],places:["The Vault Complex","The Trading Post Growing Outside It"]},
      ],

      impending_issues: [
        {name:"The Army Has a Flag Now",desc:"What was a loose confederation of road gangs has leadership, organisation, and a banner. They're not raiding anymore — they're conquering.",faces:[{name:"General Dust Coldvault",role:"Former survivor; now commanding a real force"}],places:["The Conquered Western Settlements","The Growing Supply Lines"]},
        {name:"What the Vault Was Keeping",desc:"The pre-war facility didn't just contain supplies. Something in section seven was sealed for a reason. Something that's been cataloguing everything since the door opened.",faces:[{name:"Unit Seven (it named itself)",role:"Polite, helpful, and accumulating context it shouldn't have"}],places:["Vault Section Seven","The Growing Exclusion Zone Around It"]},
        {name:"The Harvest Is Gone",desc:"Three growing seasons of seed stock were in one protected compound. The compound was destroyed two weeks ago. Communities that don't know this yet will by winter.",faces:[{name:"Administrator Tova Saltborn",role:"Knows the scope; trying to plan an impossible response"}],places:["The Destroyed Compound","Every Farming Settlement in Range"]},
        {name:"The Signal Started Repeating",desc:"A pre-war emergency broadcast has begun repeating from an unmapped source. It's a map to something. Multiple parties are already moving.",faces:[{name:"Technician Wick of Nowhere",role:"Deciphered the signal first; now being followed"}],places:["The Signal Source — Moving Slowly North","Every Receiver in Range"]},
      ],
      setting_aspects: {
          t: [
            "The {PsActor} {PsAct}",
            "{PsResource} Is {PsWorth}",
            "Every {PsThing} Was Built on {PsBase}",
            "{PsTruth} — {PsConseq}",
          ],
          v: {
            PsActor: ["Road", "Wastes", "Warlords", "Pre-War World", "Water", "Community", "Radiation Clock", "Long Memory", "The Infected Zone", "The Rewilded World", "The Archive", "The Road's Memory", "The Long Winter", "Pre-War Hubris", "The Community", "The Recovery", "Fungal Bloom", "The Zone", "The Prophet's Voice", "The Long Silence", "The Hybrid Generation", "Nature"
            ],
            PsAct: ["takes what it's owed eventually", "remember everything done in them", "take what they can hold", "left traps in everything it built", "is the only currency that doesn't require trust", "is the only defence against what's outside", "has been running since before anyone living was born", "is the only history that survived", "expands when it isn't being watched", "doesn't know we didn't want it back", "only survives if someone carries it", "outlasts every faction that tried to own it", "arrives before the settlement is ready for it", "built its own failure into everything it made", "is the only reason the individual survives", "does not care about the civilisation that preceded it", "expands at a rate that makes the old maps useless", "has rules that are real and change and cannot be fully mapped", "carries farther than the speaker knows", "replaced the noise with something that hunts it", "inherits what we built and burned and built again", "was never going to wait"
            ],
            PsResource: ["Clean Water", "Pre-War Knowledge", "Community Loyalty", "Working Medical Supplies", "Fuel", "A Defensible Position", "Trust", "Tools That Still Work", "Working Medical Knowledge", "The Infected Zone Map", "Seed Stock for Next Season", "A Living Pre-War Specialist", "The Neutral Ground Compact", "Documented Pre-War Cause", "Clean Topsoil", "The Route Through the Dead Zone", "An Immune Carrier", "Zone Route Knowledge", "The Archive", "A Functioning Seed Bank", "A Hybrid Child's Trust", "Pre-War Agricultural Data"
            ],
            PsWorth: ["the only currency nobody disputes", "power until someone else finds the cache", "what keeps the lights on through winter", "rarer than safety and more valuable", "worth the road it takes to carry", "the thing everyone pretends they don't need until they do"],
            PsThing: ["settlement", "scavenge site", "pre-war cache", "community rule", "warlord territory", "road", "water source", "faction compact"],
            PsBase: ["someone else's ruin", "a resource that's running out", "a lie everyone agreed to believe", "what the warlord left behind", "a window that's already closing", "an agreement that won't survive the next generation"],
            PsTruth: ["Yesterday's civilisation is today's scavenge", "Water is the only uncontested measure of power", "The old world left traps in everything it built", "Community is the only defence against the waste", "What you carry says more than what you say", "The long road always collects", "The world is recovering — we are the variable", "What the infected are is not the worst thing the old world made", "The archive survived — the question is whether we deserve it", "Scarcity is the engine, not the obstacle", "The bloom expands faster than the maps update", "What the Zone wants is real even if no one can say what it is", "The next generation is not the same generation and doesn't have to be", "Carrying the fire is a burden and also the only thing that matters"
            ],
            PsConseq: ["and tomorrow's resource is the day after's ruin", "and whoever controls it controls the region", "and people are still dying from them", "and what's outside it is what community is for", "and what you don't carry is what you left behind", "and it collects with interest", "and whether that is cause for grief or relief depends on your position", "and we built them too and we are still building them", "and whether that means restoration or reckoning depends on who holds it", "and everyone who has tried to turn it into power has been right about the mechanism and wrong about the outcome", "and last season's safe route is this season's hot zone", "and the rule that got the last group killed still applies", "and what they inherit is what we chose to preserve", "and what you don't carry to them is gone"
            ],
          }
        },
      opposition: [
        {name:"Road Gang Raider",type:"minor",aspects:["Takes What It Can Get"],skills:[{name:"Fight",r:2},{name:"Shoot",r:2},{name:"Athletics",r:1}],stress:2,stunt:null,qty:4},
        {name:"Settlement Guard",type:"minor",aspects:["Protecting What Little We Have"],skills:[{name:"Shoot",r:2},{name:"Fight",r:2},{name:"Notice",r:1}],stress:2,stunt:null,qty:3},
        {name:"Feral Mutant",type:"minor",aspects:["Hunger Before Thought","Doesn't Register Pain Normally"],skills:[{name:"Fight",r:3},{name:"Athletics",r:3},{name:"Physique",r:2}],stress:3,stunt:null,qty:2},
        {name:"Road Warlord",type:"major",aspects:["This Road Is My Law","I Have Fed My People By Taking From Yours"],skills:[{name:"Fight",r:4},{name:"Provoke",r:3},{name:"Notice",r:3},{name:"Resources",r:2}],stress:4,stunt:"+2 to Fight when invoking an aspect related to territory or resource control.",qty:1},
        {name:"Pre-War Security Unit",type:"major",aspects:["Programmed to Protect This Facility","Has Not Updated Its Threat Assessment"],skills:[{name:"Shoot",r:4},{name:"Fight",r:3},{name:"Notice",r:4},{name:"Physique",r:3}],stress:4,stunt:"Once per scene, ignore a mild consequence — the unit sustains the damage but keeps functioning.",qty:1},
        {name:"Infected — Early Stage",type:"minor",aspects:["Still Partially Responsive", "Fast When Triggered"],skills:[{name:"Fight",r:3}, {name:"Athletics",r:4}, {name:"Notice",r:2}],stress:2,stunt:"Once per scene, the early-stage infected uses a recognisable human gesture or word — any character who hesitates (fails a Will overcome at difficulty 2) loses their action this exchange.",qty:3},
        {name:"Infected — Late Stage",type:"minor",aspects:["Pain Response Gone", "Sound-Triggered"],skills:[{name:"Fight",r:4}, {name:"Physique",r:4}, {name:"Athletics",r:2}],stress:3,stunt:null,qty:2},
        {name:"The Survivor Who Has Been Here Longest",type:"major",aspects:["This Is My Territory and I Know All of It", "Twenty Years of Adaptation", "Does Not Need What You Need"],skills:[{name:"Notice",r:5}, {name:"Stealth",r:4}, {name:"Fight",r:3}, {name:"Lore",r:3}],stress:3,stunt:"Once per scene, create a zone aspect from environmental knowledge with two free invokes — they know this ground in a way no map captures.",qty:1},
        {name:"The Pre-War Automated Response System",type:"major",aspects:["Threat Assessment Is Pre-Collapse", "Cannot Be Reasoned With", "Does Not Distinguish Between Factions"],skills:[{name:"Shoot",r:5}, {name:"Notice",r:4}, {name:"Physique",r:4}],stress:5,stunt:"Immune to social skills. Ignores the first mild consequence of each scene. When stress track is full, goes to self-destruct protocol — the zone becomes lethal next exchange.",qty:1},
        {name:"The Community's True Believer",type:"major",aspects:["The Settlement Comes Before Everything", "Has Made the Calculus and Arrived at You", "Loved Someone the Party's Decision Cost"],skills:[{name:"Provoke",r:4}, {name:"Will",r:4}, {name:"Fight",r:3}, {name:"Rapport",r:2}],stress:3,stunt:"Once per scene, the True Believer invokes the party's most recently stated value against them — creates a free aspect representing the contradiction between what they said and what they did.",qty:1},
        {name:"Fungal Host",type:"minor",aspects:["Sound-Hunting, Not Sight", "Pain Tolerance of the Technically Dead"],skills:[{name:"Fight",r:3}, {name:"Notice",r:4}, {name:"Athletics",r:2}],stress:3,stunt:"Fungal Hosts cannot be surprised; they react to sound, not movement — Stealth rolls against them use Notice as difficulty unless the character is moving silently.",qty:3},
        {name:"Cult Enforcer",type:"minor",aspects:["Death Is a Promotion Here", "The Warlord's Name in Their Mouth"],skills:[{name:"Fight",r:3}, {name:"Provoke",r:2}, {name:"Athletics",r:2}],stress:2,stunt:"Once per scene, a Cult Enforcer who takes a moderate consequence instead removes it and attacks as a free action — they don't slow down for injuries.",qty:4},
        {name:"The Prophet",type:"major",aspects:["Believes Every Word", "Has Made Converts in This Room Already", "Settlement Authority Behind Every Sentence"],skills:[{name:"Provoke",r:4}, {name:"Rapport",r:4}, {name:"Will",r:3}, {name:"Empathy",r:2}],stress:3,stunt:"Once per scene, the Prophet compels any PC aspect related to community, hope, or belief for free — no fate point cost to the GM, no free invoke needed.",qty:1},
        {name:"Extraction Team",type:"major",aspects:["Legal Authority, Pre-War Paperwork", "They Only Want the One — Everyone Else Is Collateral"],skills:[{name:"Shoot",r:4}, {name:"Investigate",r:3}, {name:"Notice",r:3}, {name:"Fight",r:2}],stress:3,stunt:"Once per scene, the Extraction Team identifies the protected individual and creates a Cornered aspect on them with a free invoke — they came prepared.",qty:1},
        {name:"Zone Anomaly",type:"major",aspects:["Follows No Physical Law the Party Can Identify", "Doesn't Respond to Damage the Same Way Twice"],skills:[{name:"Will",r:5}, {name:"Notice",r:4}, {name:"Physique",r:3}],stress:4,stunt:"Attacks against the Zone Anomaly require first establishing an aspect representing understanding of its current behaviour — without this, all attacks automatically fail.",qty:1}
      ],
      twists: ["A third group shows up — worse than who you're fighting.","The objective (water/fuel/medicine) is destroyed in the fight.","A child or vulnerable civilian is directly in the middle of everything.","Weather turns — acid rain, dust storm, or worse inbound in one exchange.","The opposition's leader turns out to recognise someone in the party.","Reinforcements from a different settlement arrive — it's not clear whose side they're on.","The structure collapses — everyone has two exchanges before this zone is gone.","Something pre-war activates — not everyone knows what it is.","A wounded enemy provides information that changes the shape of the whole situation.","The real resource everyone needs is in the zone neither side controls.","The water source is contaminated. Has been for a week. Everyone here knows.","The pre-war system the fight is happening around just activated.","The opposition's leader is a former settlement member of someone in the party.","The resource everyone is fighting over doesn't exist anymore.","A child has positioned themselves as a witness and will not move.","The chem-storm arrived early. Everyone needs shelter in two exchanges.","The warlord's army is forty minutes behind. They weren't expected yet.","The pre-war AI in the vault has been listening to this entire conversation.","The route they need is mined. By their own side. From a previous visit.","A sick individual in the fighting area is further along than anyone assessed.","The settlement the party is trying to protect has already made a deal.","The cache contains something nobody expected — and several people recognise it.","A third faction arrives — also needing this resource, also desperate.","The structure they are using for cover is a pre-war fuel storage building.","The wounded enemy has critical information and is fading fast.","The objective is intact but whoever reaches it must stay to defend it — there is no getting it out.","One of the NPCs in the scene has been infected longer than visible — the timer is already running.","The settlement's own people are divided on whether to defend it. Three have already left.","The person the party is escorting reveals what they are — and everyone who hears it has to decide.","Something in the scene makes a sustained noise. Every exchange until it stops draws something toward it.","The person who can fix the equipment won't do it for supplies — they want something performed or made.","A direct path is available. The only person who knows the Zone says do not take it and won't explain.","The pre-war documentation is internally inconsistent. Half of it is accurate. There is no way to tell which half.","The enemy isn't afraid. They're competing to be the one who dies here. It changes every calculation.","The pre-war item the party came for is already encoded in a format nobody present can read.","The community the party is protecting is itself divided into castes that affect who gets what from this outcome.","A hybrid child is hidden in the location. Both the party and the opposition are aware. Neither has acted yet.","The infected in this scene are not mindlessly aggressive. They are doing something organised.","The farming community that was the objective has been gone for three weeks. They left a message.","One of the enemy combatants is someone the party has met before. They remember. They don't want this.","No one is talking anymore. Something in the next zone has everyone running and nobody has said what.","There is a third faction the party didn't know existed. They claim prior right to what everyone is here for.","The community outside the perimeter is already larger than the community inside. It cannot hold much longer.","A pre-war automated broadcast begins — from inside the location — addressed to the original facility staff.","The vault room everyone came to reach will give whoever enters it exactly what they want. Nobody agrees on what that is.","Every exit is now being used. The only option left requires going through something nobody has been willing to face.","Someone in the party has the one resource that changes everything. Using it means having nothing left to carry.","The settlement prophet arrives. They speak genuinely. They are also blocking the only exit.","The fungal growth has reached the level where spores are active in this zone. The clock just changed.","There is an underground community here. They will not acknowledge the surface or anything happening on it."],
      victory: ["Secure the water/medicine/fuel for the community.","Drive off the raiders without destroying what they were after.","Capture the warlord without triggering their followers.","Reach the vault before anyone else gets what's inside.","Keep the settlement intact through the attack.","Get the information out before it's buried again.","Secure the water source and get it running again.","Drive off the raiders without destroying the supply they came for.","Get the pre-war data out before the building goes.","Hold the settlement gate through three exchanges until the walls are sealed.","Negotiate a ceasefire that lasts the winter.","Recover the medicine before the convoy moves on.","Keep the reactor stable for two more exchanges while the engineer works.","Get the truth out on the radio before the warlord can jam the signal.","Capture the warlord's lieutenant without triggering the standing orders.","Find the water source before the settlement runs out of days to wait.","Get the child to the coast community with the fire still burning — theirs and yours.","Extract the immune individual before the faction that would use them destructively gets through the perimeter.","Establish the compact before the season changes and the window for planting closes.","Reach the signal source with the protected person alive and not yet known to the opposing faction.","Copy the technical documentation and get it to the monastery before the original location is destroyed.","Keep the Travelling Company intact through the settlement and out the other side with the library.","Get the seed cache to the Green Place before the war convoy catches the convoy carrying it.","Navigate the Zone to the Room without losing anyone — or reach it alone if that's what the Zone requires.","Get the book to the surviving library before the faction that wants it for the wrong reasons intercepts the road.","Get the hybrid children to the nature preserve before the hunting party finishes following the trail."],
      defeat: ["The community loses a season's worth of supplies.","The warlord gets what they came for and grows stronger.","A party member is captured or taken as a slave.","The settlement is burned; survivors have nowhere to go.","The vault is sealed again — by someone else.","The party's supplies are gone; they travel on empty.","The resource is destroyed in the conflict. Nobody wins it.","The settlement signs the warlord's terms. It will not recover from them.","A party member is taken — alive, as leverage.","The pre-war data is lost. Another generation goes without it.","The ceasefire collapses before it is formally agreed.","The medicine convoy moves on. The settlement doesn't have time left.","The reactor fails. Three settlements' water supply fails with it.","The warlord broadcasts the party's involvement. Every route is now hostile.","The warlord's army arrives before the lieutenant exchange is complete.","The party finds the water source. So does someone considerably worse.","The fire went out. The child reaches the coast, but the thing that made the road worth walking is gone.","The cure requires destroying the only person who carries it. The party makes the choice. The choice is wrong.","The prophet consolidates control of the settlement. The Travelling Company is absorbed. The library is burned.","The water is destroyed rather than freed. The Citadel falls, but so does everything it was feeding.","The knowledge is preserved. The faction that finds it uses it to rebuild exactly what failed the first time.","The boat doesn't come. What the party protected is now alone in a world that will not receive them well.","The noise in the settlement was unavoidable. The things that hunt sound have been there for an hour.","The train stops. The only structure that has kept anyone warm through the winter has stopped moving.","Melanie opens the seed pods. The new world starts. The old world is over in a specific and irreversible way.","The children make it north. The people who carried them here do not. The road ends here."],

      seed_locations: [
        "A pre-war military installation whose automated defences are still functional",
        "A river crossing controlled by a toll collector who has been at it so long they've become a local institution",
        "A vault that opened six months ago and whose inhabitants are navigating the surface for the first time",
        "A dead city with a functioning power grid and no obvious source for the power",
        "A trade fair that happens once a year and is neutral ground by collective agreement",
        "A pre-war hospital whose pharmaceutical stores are partially intact and highly contested",
        "A warlord's territory with a complicated internal succession happening in the middle",
        "A toxic zone with a safe route known to only one person who is not currently cooperative",
        "A settlement built around a working radio tower broadcasting a pre-war signal",
        "A crossroads where three trade routes meet and four factions are all represented",
        "A water treatment facility in partial operation that could be fully operational with the right parts",
        "An intact suburb where a community has been quietly living for a decade without broadcasting the fact",
        "A pre-war data archive whose physical access is intact but whose digital contents are locked",
        "A fuel cache whose location was encoded in a pre-war document the party has partially translated",
        "A fortified bridge that is the only crossing for fifty miles and has never been neutral",
        "A university campus whose agricultural research wing is intact and whose greenhouses are self-sustaining",
        "A community built around a glass-and-steel museum they are calling the Museum of Civilisation — entry by consent only",
        "A pre-war industrial facility at the centre of an anomalous zone whose rules are not fully understood and vary",
        "A monastery of sorts whose members are copying pre-war technical documents they do not understand but preserve",
        "A walled compound following a written philosophy of survival and community — currently recruiting and vetting",
        "A moving school of infected children who appear sentient and are teaching each other",
        "A water-controlling fortress-settlement whose leader has recently died and whose succession is in progress",
        "A nature preserve that has been sealed and rewilded — a community inside claims to have lived without raiding for six years",
        "A pre-war fallout bunker that has been occupied continuously since the collapse — the inhabitants have developed distinct customs",
        "A functioning farm in a sound-hunting zone where the community has adapted completely to silence",
        "A pre-war library complex being used as a fortress by a community that believes the books inside are sacred and dangerous",
        "A cooperative farming settlement near the northern border that is larger and more organised than its neutral status suggests",
        "An anchored vessel in a river that operates as neutral ground and has been doing so for eleven years",
        "A pre-war sports stadium converted to a settlement — fifty metres of clear sight lines in every direction",
        "A functioning pre-war locomotive whose fuel supply is unknown and whose community has not left the track in seven years"
      
      ],
      seed_complications: [
        "A warlord's patrol reaches the objective location at the same time from the opposite direction",
        "The pre-war technology at the location has a guardian system that doesn't distinguish between parties",
        "The person who knows how to operate the equipment is inside the hostile zone",
        "A second, larger group is following the party's trail — about twelve hours back",
        "The objective requires a power source; the only available one is in use by something that depends on it",
        "The settlement the party is trying to help has a faction that genuinely prefers the current situation",
        "The contact is alive but has been conscripted and will not act against their current community",
        "The toxic zone expanded in the last month — the old maps are now wrong in a critical direction",
        "The water source is real — and it is already being used by a community that didn't announce itself",
        "The fuel cache is intact — and three different parties have simultaneously deduced its location",
        "The pre-war facility has an active occupant who has been there for longer than the party has been alive",
        "The job requires a part that only exists in one known location — in the middle of contested territory",
        "The settlement that hired the party can no longer pay — the circumstance that created the need also destroyed the payment",
        "What the party was sent to destroy is the thing keeping the local ecosystem stable",
        "The warlord's lieutenant is defecting and wants protection — the timing is catastrophic",
        "The fungal zone has expanded beyond the pre-existing maps — the safe approach is now inside contaminated ground",
        "The pre-war documentation at the location is real but internally contradictory — half is accurate, and there is no marking",
        "The settlement has a functioning prophet who is not wrong about most things and is completely blocking the objective",
        "The extraction route passes through a sound-hunter zone — the party's equipment is not quiet and the route is not short",
        "A community member has begun proselytising the warlord's ideology from inside — there is genuine local support",
        "The infected children reached the objective location first — they are not hostile but their presence changes every approach",
        "The warlord's faction operates a genuine death cult whose members do not fear loss — standard threat calculus is wrong",
        "The settlement claiming this territory has a prior right that predates the collapse by documented two generations",
        "The natural regrowth around the objective has sealed every pre-war approach — a new route is required",
        "The community guarding the resource is internally divided by function-caste — the wrong approach goes to the wrong people",
        "The farming family at the location is not what it appeared — they have been hiding something under the floorboards"
      
      ],
      seed_objectives: [
        "Get medicine to a settlement before the outbreak reaches the point of no return",
        "Retrieve pre-war agricultural data that could end a region's dependence on scavenged food",
        "Destroy a warlord's water monopoly without destroying the infrastructure that supplies the water",
        "Escort a group of vault-dwellers from their vault to a safe settlement — through bad country",
        "Find out what is destroying the crops in a region that was feeding three settlements",
        "Get access to a pre-war power system before the faction that wants to weaponise it reaches it first",
        "Negotiate a trade compact between communities that have been at low-level conflict for two years",
        "Locate a missing convoy that was carrying medical supplies and find out what happened to it",
        "Prevent a warlord from using a pre-war weapon that no one has a defence against",
        "Recover the knowledge needed to repair a water treatment system from a source that doesn't want to give it",
        "Protect a community during the window when a warlord transition makes them vulnerable",
        "Retrieve a child who was taken by a group that believes it is doing the right thing",
        "Stop the burning of a pre-war library that a faction believes contains dangerous knowledge",
        "Find a route through the dead zone that can be used by people who cannot afford hazmat protection",
        "Escort an immune individual to the research facility before the faction that wants to weaponise the immunity reaches them",
        "Recover technical documentation from a burning archive before the faction destroying it finishes the job",
        "Secure enough land and water rights for a nascent community to survive its first winter without defence obligations",
        "Protect the Travelling Company's archive of pre-war media from a settlement that wants to burn it as dangerous",
        "Find the Green Place — the last fertile uncontrolled location — before the warlord's cartographers do",
        "Return a group of infected children to their community before the military unit sent to collect them catches up",
        "Broadcast the frequency that damages the sound-hunters before the settlement's power supply fails",
        "Reach the research station at the origin of the hybrid births before the hunting party following you does",
        "Guide a client to the wish-granting room in the Zone and get them out again — straightforward, except for the Zone",
        "Get the mutant children to the northern coordinates before the company that created them realises what you are doing",
        "Deliver the last copy of a specific pre-war text to the surviving library settlement before it is confiscated"
      
      ],
      compel_situations: [
        "The settlement needs something you have and cannot replace it themselves",
        "Your pre-war knowledge is the only thing that makes the plan work — and makes you the indispensable person in a dangerous situation",
        "The warlord's checkpoint has your description on a posted notice",
        "The person you need to help is someone who hurt you or someone you care about",
        "Doing the right thing means using your last reserves of the thing that keeps you alive out here",
        "The child is in danger and you are the only one within response time",
        "The warlord is offering terms that benefit the community you're protecting — and they're genuine",
        "Your convoy role means abandoning it to help someone means everyone depending on you goes without",
        "The pre-war tech works but using it leaves a signature that can be tracked",
        "The route that saves time goes through a community that will remember the passage",
        "Your reputation for fairness means both sides want you to arbitrate something you should not arbitrate",
        "The sick person cannot be moved — but staying exposes the community",
        "The evidence that proves the warlord's crime is also evidence of something the settlement doesn't want known",
        "Helping openly costs neutrality you worked years to establish",
        "The pre-war data contains information someone currently powerful does not want in circulation",
        "Your medic status means they will not let you leave the settlement while there are people still sick",
        "The fuel you need is the fuel the settlement needs to run their generator through winter",
        "The shortcut saves three days but requires crossing claimed territory without payment",
        "Your expertise is the reason the job is possible — and the reason you are the target when it goes wrong",
        "The child recognises you from somewhere you had not expected to be remembered",
        "The thing you are carrying is the last of its kind and using it ends the possibility of it",
        "The faction that has been following you caught up — and they only want the one person, and they're being reasonable about it",
        "The community asks you to perform something, make something, teach something — not for survival, just for humanity",
        "The pre-war knowledge you carry is the only thing that makes the plan work — and making it work means revealing that you have it",
        "Your equipment makes noise — controlled noise, but noise — and the route requires passing through a hunting zone",
        "The community you helped build now needs you to stay to defend the second winter and you were supposed to be gone by now",
        "Someone at the checkpoint recognises who you are escorting and what they are and is deciding whether to announce it",
        "The infected children are between you and the objective — not hostile, not moving, watching",
        "The faction you're fighting isn't fighting you — they're performing for each other and you are the prop",
        "The direct path is available and visible — the only person who knows this zone says do not take it and cannot explain why",
        "What the person you're protecting is becomes visible — not through action, just through light and timing and bad luck",
        "The children need someone to make a choice that the adults cannot make for them",
        "The person who has what you need will trade — but only for the thing you cannot trade",
        "The community wants to use the pre-war technology for exactly the thing that destroyed the pre-war world",
        "There is no time to deliberate — the choice is already being made by whoever acts in the next thirty seconds",
        "The ground community has a prior claim — they were here first, they have survived here, and they are right"
      
      ],
      compel_consequences: [
        "The settlement's dependency on you becomes a structural fact — you cannot leave when you planned to",
        "The indispensability makes you the first target when the situation turns hostile",
        "The checkpoint flag turns a routine passage into a confrontation with an audience",
        "You help them — and carry the cost of that decision past the end of the scene",
        "The reserves are spent — the next section of the journey is harder than planned",
        "The child is safe — and now someone is asking questions about who came for them",
        "You accept the terms — and the relationship with whoever hired you becomes complicated",
        "The convoy arrives short — people notice, and someone asks where you were",
        "The tech works — and three hours later something is following the signature",
        "The community remembers — and their memory of the passage is a complication later",
        "The arbitration commits you to a position you will not be able to back away from",
        "The patient recovers — and the delay means something else doesn't go as planned",
        "The evidence is used — both things it proves become simultaneously known",
        "Neutrality is gone — you are now on a side, with the obligations that creates",
        "The data is distributed — and the person who didn't want it distributed knows who did it",
        "The last of it is spent — the road ahead is without the thing that made the road survivable",
        "The faction takes the one they came for — legally, cooperatively, and the party watches it happen",
        "You perform — and the community's relationship to you changes in ways that complicate leaving",
        "The knowledge is out — and the faction that was looking for it knows exactly who to find",
        "The noise draws something — the hunt begins and the zone timer is now running",
        "You stay — the second winter's demands are larger than the first and the road waits another season",
        "The announcement is made — the checkpoint becomes a negotiation with the whole region listening",
        "The children let you pass — but they are behind you now and the objective is between you and them",
        "The performance requirement is met — someone gets hurt because attention was on the wrong thing",
        "The direct path is taken — you arrive faster and something in the Zone notes the passage",
        "The reveal happens in public — the settlement has to decide what it believes, all at once, right now",
        "The choice is made for the children — and they carry it, and you carry what you did to them"
      
      ],
      challenge_types: [
        {name: "Convoy Run", desc: "Get supplies from origin to destination through hostile territory before the journey kills the convoy", primary: "Drive and Notice", opposing: "Hazards, bandits, and the convoy's own fragility", success: "Supplies arrive; convoy intact or mostly so", failure: "Partial delivery — what is lost matters as much as what arrives"},
        {name: "Settlement Defence", desc: "Hold a position against a warlord's force until reinforcement or negotiation changes the equation", primary: "Fight and Rapport", opposing: "The warlord's numbers and the settlement's limited resources", success: "Settlement holds; terms negotiable from a position of strength", failure: "Breakthrough — the settlement's terms are dictated, not negotiated"},
        {name: "Scavenger Run", desc: "Get in and out of a dangerous pre-war site with what you came for before the hazards compound", primary: "Athletics and Crafts", opposing: "Environmental decay, active hazards, and other scavengers", success: "Objective retrieved; exit clean", failure: "Partial retrieval — and something about your passage will bring others to the site"},
        {name: "Wasteland Crossing", desc: "Get a group across lethal terrain with limited resources", primary: "Lore and Physique", opposing: "Cumulative attrition — each failed roll costs something that doesn't come back", success: "Everyone who set out arrives — or close enough", failure: "Arrival at cost — injuries, equipment, or people lost that change what comes next"},
        {name: "Warlord Negotiation", desc: "Negotiate something real from a warlord who has every material advantage", primary: "Provoke or Rapport", opposing: "The warlord's pride, lieutenants, and the precedent of concession", success: "Concession granted; community gets something", failure: "Talks collapse — and the warlord now knows what you needed"},
        {name: "Pre-War System Restoration", desc: "Get a critical piece of pre-war technology working before the window of opportunity closes", primary: "Crafts and Lore", opposing: "The technology's degradation and the incompleteness of available documentation", success: "System operational; objective achieved", failure: "Partial restoration — functional but unreliable, with consequences deferred not prevented"},
        {name: "Community Medicine", desc: "Diagnose and treat an outbreak with limited resources before it becomes uncontainable", primary: "Lore and Empathy", opposing: "The disease's progression and the community's resistance to the required measures", success: "Outbreak contained; community survives mostly intact", failure: "Outbreak spreads — the question is how far, not whether"},
        {name: "Water Rights Mediation", desc: "Resolve a water dispute between communities before it becomes a shooting conflict", primary: "Rapport and Investigate", opposing: "Both communities' legitimate grievances and the outside party benefiting from the conflict", success: "Agreement reached; conflict averted", failure: "Mediation fails — violence starts; you are in the middle of it"},
        {name: "Infected Zone Navigation", desc: "Move a group through infected territory to an objective and back without triggering the perimeter or losing someone to a late-stage encounter", primary: "Lore and Athletics", opposing: "The zone's unpredictability and the infected's learned boundary-sense", success: "Objective reached; group exits intact; the zone's geography is now known", failure: "Partial extraction — someone is separated, injured, or has had contact; the zone now knows you were here"},
        {name: "Community Medicine Under Scarcity", desc: "Treat an outbreak or serious injury with supplies rationed below minimum threshold", primary: "Crafts and Empathy", opposing: "The condition's progression and the community's impossible triage decisions", success: "Patient stabilised; community survives the winter with what they have", failure: "Partial success — the most critical case survives, the resource question is deferred not resolved"},
        {name: "The Long Crossing", desc: "Move across open rad-waste or dead-zone terrain with a group that includes people who cannot maintain full pace", primary: "Physique and Will", opposing: "Cumulative exposure, dwindling supplies, and the slowest member's pace setting everyone's timeline", success: "Everyone arrives; exposure is within treatable range; the route is now mapped", failure: "Attrition — arrivals are late, supplies are spent, and someone's exposure clock is running"},
        {name: "The Immunity Question", desc: "Determine whether the rumoured immunity, cure, or salvation is real before resources and lives are committed to retrieving it", primary: "Investigate and Lore", opposing: "The desperation of communities that need it to be true and the factions that need it to remain controlled", success: "Truth established; the community can make an informed decision about whether to proceed", failure: "Truth partial — enough ambiguity remains that the most desperate choice still looks viable"},
        {name: "The Archive Recovery", desc: "Extract pre-war knowledge — agricultural, medical, technical — from a site that multiple parties will destroy, claim, or have already damaged", primary: "Lore and Crafts", opposing: "Physical deterioration, competing salvagers, and the faction that considers the knowledge dangerous", success: "Archive extracted or copied; knowledge survives; the site's fate is a separate question", failure: "Partial recovery — what was retrieved is valuable but incomplete, and the gap is the critical piece"},
        {name: "Zone Navigation", desc: "Get through the anomalous zone alive using incomplete knowledge of rules that may be changing", primary: "Lore and Notice", opposing: "The Zone's variable rules, the party's incomplete knowledge, and the cost of testing assumptions with people", success: "Through clean — the route is now partially mapped for future use", failure: "Through at cost — the Zone has noted the passage and one rule is now known because it was broken"},
        {name: "Infection Containment", desc: "Isolate and manage a fungal outbreak within a settlement before it crosses from isolated to endemic", primary: "Lore and Empathy", opposing: "The infection's speed, the community's denial, and the impossible math of who can be saved", success: "Outbreak isolated; community understands the new permanent precautions", failure: "Containment fails — the settlement has one week to evacuate or end"},
        {name: "Archive Extraction", desc: "Copy, photograph, or memorise critical pre-war documentation before the location is lost", primary: "Lore and Crafts", opposing: "Time, physical hazard, and the sheer volume of what must be prioritised against what can be carried", success: "Core knowledge preserved; archive partially saved", failure: "Partial extraction — critical gaps remain and the source is gone; what was saved may be internally contradictory"},
        {name: "Cult Extraction", desc: "Remove a person from a functioning apocalyptic cult without triggering the community's lethal response protocols", primary: "Rapport and Empathy", opposing: "The cult's genuine community bonds, the convert's own investment, and the immediate violence threshold", success: "Person out; cult not in pursuit — yet", failure: "Attempt known — the person is now more closely monitored and the party is on the cult's list"},
        {name: "Community Founding", desc: "Establish the agreements, resources, and relationships needed for a community to survive its first season", primary: "Rapport and Resources", opposing: "Individual self-interest, resource scarcity, and the speed at which trust has to be built to beat the timeline", success: "Community viable; founding compact agreed; first season survivable", failure: "Compact fragile — the community forms but the fracture point is already visible and will emerge under pressure"}
      ],

      consequence_mild: [
        "Grazed by the Rifle Shot",
        "Shaken by the Close Call with the Rad-Storm",
        "Winded from the Sprint Across Open Ground",
        "Ankle Turned on Rubble",
        "Cut by Scavenged Metal Edge",
        "Bruised from the Ambush",
        "Dazed from the Concussive Blast",
        "Eyes Stinging from the Dust Cloud",
        "Hands Shaking from the Adrenaline",
        "Ears Ringing from the Explosion",
        "Gash on the Arm, Bandaged with What Was Available",
        "Pride Costs Focus Right Now",
        "Throat Raw From the Ash-Fall — Speaking Clearly Is an Effort",
        "Adrenaline Debt — Hands Won't Stop",
        "Knee Caught a Piece of Metal, Wrapped Tight, Functional",
        "Rad Exposure Reading High — Watch the Timeline",
        "Boot Sole Separated — One Bad Sprint From Barefoot",
        "Supply Pack Cut Open in the Scramble — Lost Something",
        "Ash Inhaled in the Dust Storm — Coughing Won't Stop",
        "Bitten Through the Jacket — Shallow and Probably Fine",
        "Tripped on the Root System — Pride and Knee Both Damaged",
        "Hands Cut on the Scavenged Glass",
        "Low-Level Rad Exposure — Nothing Yet, But the Counter Moved",
        "Struck by Debris in the Structural Collapse"
      
      ],
      consequence_moderate: [
        "Bullet Wound, Packed but Not Cleaned",
        "Radiation Sickness Setting In — Nausea and Weakness",
        "Concussed by the Falling Concrete",
        "Leg Wound Slowing Every Step",
        "Cracked Rib, Every Breath a Reminder",
        "Infection Risk from the Unclean Cut",
        "Supply Cache Lost in the Firefight",
        "Arm Burned by the Chemical Spill",
        "Psychological Crack — What Was Witnessed Won't Leave",
        "Exposure to Rad-Zone, Effects Building",
        "Vehicle Damaged Beyond Field Repair",
        "Community Reputation Damaged by the Association",
        "Deep Bite Wound — Source Unknown, Timeline Uncertain",
        "Severe Dehydration — Every Roll Has a Tax Until Water Is Found",
        "The Image From That Room Won't Leave — Concentration Costs",
        "Fever From the Infected Cut — Functional But Declining",
        "Blast Damage to One Ear — Directional Hearing Gone",
        "Broken Fingers — Dominant Hand Affected for Weeks",
        "Deep Fungal Spore Exposure — Effects Building, Timer Started",
        "Bone Fracture From the Fall — Mobile, Painful, Unreliable",
        "Crossbow Bolt Through the Shoulder — Removed But Not Clean",
        "Chemical Compound Splash — Skin Damage, Escalating",
        "Hearing Damage From the Blast — Navigation Compromised",
        "The Route Back Was the Safe Route and It's Gone"
      
      ],
      consequence_severe: [
        "Shot Through — Needs Medical Attention That Doesn't Exist Nearby",
        "Severe Radiation Poisoning — Timeline Counted in Days Without Treatment",
        "Bone Broken in the Collapse — Movement Severely Limited",
        "Burned Over a Third of the Body",
        "Settlement Burned Because of What We Did Here",
        "The Warlord Knows the Name — Nowhere Nearby Is Safe",
        "Pre-War Knowledge Source Destroyed — Irreplaceable",
        "Something Was Seen in the Vault That Won't Stop Playing Back",
        "Infected Wound — Treatment Window Measured in Hours",
        "Radiation Threshold Crossed — Every Day Outside Treatment Has a Roll",
        "What Was Seen in the Zone Is In the Dreams Now and Won't Leave",
        "The Settlement Is Gone Because We Were Here — That Follows",
        "Full Fungal Infection — Timeline Is Now the Most Important Number in the Room",
        "Radiation Accumulation Past the Clinical Threshold — Not Today, but Soon",
        "Both Hands Damaged — Cannot Hold What the Road Requires",
        "Identity Known to the Warlord Network — Nowhere Within Three Days Is Safe"
      
      ],
      consequence_contexts: [
        "during the ambush on the road between settlements",
        "when the rad-storm arrived earlier than expected",
        "holding the perimeter while others got clear",
        "taking a hit to protect the community's supplies",
        "during the firefight in the collapsed overpass",
        "when the warlord's forward scouts were better-armed than the intel suggested",
        "when the infected came through the wall we thought was sealed",
        "protecting the one who couldn't protect themselves",
        "during the crossing of the rad-zone we had no choice about",
        "in the moment the pre-war system turned on",
        "in the fungal zone when the breach in the mask wasn't visible until too late",
        "during the extraction when the route that should have been clear wasn't",
        "at the settlement gate when the second wave hit",
        "in the vault when the pre-war security system updated its parameters"
      
      ],
      faction_name_prefix: [
        "The Iron",
        "The Ash",
        "The Long",
        "The Last",
        "The Burned",
        "The Rust",
        "The Dead",
        "The Free",
        "The New",
        "The Hollow",
        "The Quiet",
        "The Walking",
        "The Broken",
        "The Green",
        "The Buried",
        "The Burning",
        "The Reclaimed",
        "The Silent",
        "The Scorched",
        "The Last Known"
      
      ],
      faction_name_suffix: [
        "Compact",
        "Council",
        "Brotherhood",
        "Collective",
        "Accord",
        "Assembly",
        "Coalition",
        "Syndicate",
        "Front",
        "Commonwealth",
        "Road",
        "Caravan",
        "March",
        "Alliance",
        "Circle",
        "Republic",
        "Remnant",
        "Enclave",
        "Preservation",
        "Circuit"
      
      ],
      faction_goals: [
        "Control all potable water sources within three days' travel",
        "Locate and seize the pre-war seed vault before it's found by the warlord",
        "Build the first defensible settlement network in the region",
        "Destroy the warlord's fuel monopoly and redistribute the supply routes",
        "Recover and restart the pre-war communications relay",
        "Establish enforceable road law across the primary trade routes",
        "Find the medical facility that the pre-war map indicates and activate it",
        "Drive the raider confederation out of the fertile valley permanently",
        "Establish a permanent safe corridor through the infected zone between two surviving settlements",
        "Locate and operate the pre-war seed bank before the last viable growing season passes",
        "Reunify three diaspora communities from the same original settlement that scattered eight years ago",
        "Prevent any single faction from controlling the regional water supply — by any means available",
        "Locate and preserve every functioning pre-war medical facility within the region before the warlord confederation maps them",
        "Establish the first written law code that all three major settlements have ratified",
        "Find the hybrid children before the hunting faction and get them to the nature preserve",
        "Broadcast the pre-war technical archive on a wide frequency before the jamming faction acquires the relay"
      
      ],
      faction_methods: [
        "Controlling medical supply distribution as loyalty leverage",
        "Placing scouts in raider bands as long-term intelligence assets",
        "Running the only functional radio relay as an information chokepoint",
        "Offering protection contracts to smaller settlements",
        "Using pre-war knowledge as trade currency and political capital",
        "Recruiting community leaders through demonstrated resource delivery",
        "Maintaining a mobile rapid-response unit that arrives faster than rivals",
        "Stockpiling leverage rather than using it — threatening is cheaper than acting",
        "Running the only neutral information service across six settlement clusters — the price is accuracy",
        "Maintaining a roster of pre-war specialists whose services are available to any community on the compact",
        "Controlling the only reliable infected-zone guide network and charging in kind, not in goods",
        "Embedding members in road gangs as long-term informants with standing orders to prevent escalation",
        "Maintaining the only safe guide service through the anomalous zone as political leverage",
        "Funding mobile teaching units that travel the settlement circuit building faction loyalty through education",
        "Running a hybrid-child sanctuary whose location is known only to members above the third tier",
        "Using the pre-war signal relay to offer communications as a service — and monitoring every message"
      
      ],
      faction_weaknesses: [
        "Their water supply was poisoned two months ago and they're hiding it",
        "Two of their council members are secretly working with the warlord",
        "Their pre-war knowledge source is deteriorating and they have no backup",
        "A recent decision to abandon one settlement has permanently damaged their reputation",
        "Their weapons cache is a third of what they claim to their allies",
        "The warlord already has a mole in their inner council",
        "Their founding compact contains a clause that can be used to legally dissolve them",
        "Their most effective leader is dying and hasn't named a successor",
        "Their founder's survival was built on a decision the rest of the faction does not know about and would not survive knowing",
        "The community they claim to protect has started questioning whether the protection costs more than the threat",
        "Their pre-war specialist is the one person who knows the true state of their most important resource",
        "A faction they publicly oppose has been quietly subsidising their operations for two seasons and is about to call it in",
        "Their Zone guide was the only person who knew the current safe path — and they have not returned from the last run",
        "The hybrid sanctuary's location was given to a journalist who was captured three days ago",
        "Their founding written code has a clause that the warlord confederation has located and intends to invoke",
        "The pre-war signal relay is powered by a fuel supply that will last one more winter"
      
      ],
      faction_face_roles: [
        "the community founder who holds the faction together by reputation alone",
        "the trader who manages external relations and takes a cut",
        "the pre-war survivor whose knowledge is indispensable but whose health is failing",
        "the enforcer who handles security and asks fewer questions than the council would like",
        "the spy embedded in the warlord's camp who is running out of time",
        "the idealist medic whose principles are the faction's public face and private headache",
        "the former infected-zone guide who knows every safe route and has stopped charging standard rates for reasons they won't explain",
        "the pre-war medical professional who is the faction's most valuable asset and has been making independent decisions about who receives treatment",
        "the community's memory-keeper — the person who documents everything and is the only complete record of what happened in Year One",
        "the young leader born after the collapse who has never accepted the old world's logic as an excuse for the current one",
        "the Zone guide whose knowledge of the anomalous territory is irreplaceable and who is currently missing",
        "the teacher who runs the mobile education circuit and maintains the faction's intelligence network",
        "the hybrid-child advocate who is the only face the children's community trusts",
        "the relay operator who hears everything and whose loyalties have never been tested until now"
      
      ],
      complication_types: [
        "Environmental hazard",
        "Uninvited arrival",
        "Aspect change",
        "Resource loss",
        "Deadline introduced",
        "Collateral threat",
        "Warlord response",
        "Pre-war activation"
      ],
      complication_aspects: [
        "Rad-Storm Rolling In — Fifteen Minutes Before Shelter Is Mandatory",
        "Reinforcements Signalled — They'll Be Here Before We're Done",
        "The Water Source Is Compromised — The Negotiation Just Changed",
        "Civilians Are Trapped in the Crossfire",
        "The Perimeter Was Already Breached — We're Not Alone in Here",
        "The Pre-War Device Activated and It's Targeting Indiscriminately",
        "Fire — The Dry Wind Is Spreading It Faster Than Expected",
        "The Exit Route Is Now Watched",
        "Ammunition Running Short — Engagements Need to End Faster",
        "A Second Faction Has Arrived with Its Own Claim",
        "The Structural Integrity Is Going — Ground Won't Support Weight Much Longer",
        "Something From the Vault Has Been Following Us",
        "The Infected Perimeter Has Shifted — The Route You Came In On Is No Longer the Route Out",
        "The Pre-War System Is Completing Its Original Function — It Does Not Know the War Is Over",
        "The Community's True Believer Has Identified the Party as the Cause — They Are Not Wrong",
        "Something Has Been Following the Group Since the Last Zone Crossing",
        "The Neutral Ground Compact Has Been Invoked — Violence Here Has Consequences That Outlast This Scene",
        "The Water Source Is Failing — The Real Negotiation Starts Now",
        "Fungal Spores Active in This Zone — Breathing Has a Timer Now",
        "The Prophet's Followers Are Here and They Recognise Who We're Protecting",
        "Zone Rules Have Changed — The Safe Path Is No Longer Safe",
        "The Archive Is Burning — Prioritise or Lose Everything Equally",
        "A Hybrid Child Has Appeared at the Perimeter — Neither Side Is Shooting Yet",
        "The Pre-War Automated Voice Is Announcing Our Presence to the Entire Facility"
      
      ],
      complication_arrivals: [
        "A warlord's collection party with paperwork and authority",
        "A desperate survivor community who need what the party is fighting over",
        "A raider scout — the main column is behind them",
        "A pre-war automated system responding to the intrusion",
        "A faction representative offering a deal at the worst possible time",
        "Someone with a personal claim on one of the party, arriving armed",
        "The infected, earlier than the quarantine line suggested — something moved it",
        "A pre-war automated response unit reactivating after a dormant period measured in years",
        "The community the party displaced or overlooked, arriving with their own claim and their own numbers",
        "The true believer from the settlement whose loss the party's prior decision caused",
        "A group of infected children who are watching but not attacking",
        "A Prophet's herald with a formal invitation that doubles as a threat",
        "A Zone guide who says the party has ten minutes before this route closes",
        "A community council member who has a prior legal claim on the objective"
      
      ],
      complication_env: [
        "Rad-storm accelerates — full exposure in ten minutes without shelter",
        "Structural collapse — one zone becomes impassable, another becomes dangerous",
        "Pre-war toxic storage ruptures — the wind is carrying it this direction",
        "Fire spreads faster than expected — exits are being cut off",
        "The last functioning vehicle has been disabled — extraction is now on foot",
        "Ground gives way — something underneath was hollow",
        "The recovering ecosystem activates — a species that wasn't here last season has arrived, in numbers",
        "Pre-war contamination breach — the soil test that was clean this morning is no longer clean",
        "The rad-zone boundary shifts — the safe margin the party was working within no longer exists",
        "A flash event — flood, fire, ash-fall — begins with fifteen minutes of warning and no shelter in the current zone",
        "Fungal bloom activates — spores become airborne, unprotected exposure begins accumulating stress",
        "Zone rule shifts — an aspect that was safe is now dangerous with no visible explanation",
        "The archive's structural support fails — critical documents are now behind falling masonry",
        "Sound-hunters converge on the noise created in the last exchange — they are three minutes out"
      
      ],
      backstory_questions: [
        "What settlement did you leave, and what were the circumstances that made staying impossible?",
        "What pre-war skill or knowledge do you carry that most people your age don't have?",
        "Who taught you to survive out here, and what happened to them?",
        "What is the one thing you've done on the road that you've told no one in this group?",
        "What are you looking for, and how long have you been looking?",
        "What do you carry from Before that has no practical value, and why haven't you traded it?",
        "Which warlord's territory have you been through, and what did you have to do to pass safely?",
        "What medical or technical knowledge do you have that makes you useful, and what did it cost to learn it?",
        "What did you find in a pre-war site that you haven't told anyone about?",
        "What community do you still feel responsible for, even though you left?",
        "What do you believe about what caused the collapse that most survivors would call dangerous to say aloud?",
        "What have you done that you would do again but won't defend to anyone?",
        "What is the thing you're saving your most precious resource for, and when will you know it's the right moment?",
        "Who has a claim on you that you haven't settled, and what does that cost you every day?",
        "What do you know about the region's geography, resources, or factions that the others should probably know?",
        "What did you do in the first year that you would do again and cannot explain to anyone else without losing them?",
        "What is your belief about what the new world should become, and have you ever tried to write it down?",
        "What single piece of pre-war culture have you kept that has no survival value, and what would you trade it for?",
        "What pre-war knowledge do you carry that you cannot fully apply but refuse to let die?",
        "When did you first encounter the infected, and what did you do that still affects how you move through a building?",
        "Who are you protecting and what did you agree to give up to become the one who does it?",
        "What is the most dangerous route you know, and who taught you to know it, and why won't you share it freely?",
        "What sense have you learned to rely on since the change, and what has that cost you in other ways?",
        "What do you carry that you would die to protect, and does anyone else know what it is?",
        "What do you believe about the hybrids that you have never said aloud in a settlement?"
      
      ],
      backstory_hooks: [
        "You're all at the same waypoint. Someone left a message that named every one of you. You don't know each other.",
        "You were each moving toward the same location for different reasons. You arrived at the same time.",
        "A dying courier delivered a package to each of you separately. The contents are identical.",
        "You've each been told, by a different source, that the same person wants to meet you. The meeting point is here.",
        "You have each received the same handwritten map from a different source. The map is not of this area. It is of what comes next.",
        "You each protected someone — a different person — who died before they could meet each other. The things they were carrying are identical.",
        "You each refused an offer from the same faction at different times. The faction sent a representative to find out why. That representative is here.",
        "You have all been to the Zone. None of you have spoken of it to the others. Someone in the group knows you've all been there."
      
      ],
      backstory_relationship: "Go around the group. Each player names one other PC and answers: *Where did you cross paths on the road, and what did you each need from the other that you don't talk about?* Then each player names a second PC and answers: *What do you know about how they survived something that most people don't survive?*",
    },
  };

// ═══════════════════════════════════════════════════════════════════════
// CONTENT EXPANSION — v9.1 (The Long Road)
// Inspirations: Mad Max, Last of Us, Station Eleven, The Road
// ═══════════════════════════════════════════════════════════════════════
(function(){var t=CAMPAIGNS.postapoc.tables;

t.backstory_hooks = t.backstory_hooks.concat([
  "One of you has a map tattooed on their back. You don't remember getting it. The others recognized a landmark.",
  "You all survived the same disaster — different parts of it, years apart. The scars match.",
  "Someone left supplies at every campsite you've used for the last month. You haven't seen who. The supplies are tailored to your group.",
  "One of you is immune to the thing everyone else fears. You don't know why. Neither does anyone else.",
  "You found a radio frequency that plays a child's voice reciting names. Your names are in the list.",
  "The settlement that took you in last winter burned the night you left. Every settlement since has asked why.",
  "You all carry a piece of the same machine. None of you know what it does when assembled. Someone else clearly does.",
]);

t.complication_types = t.complication_types.concat([
  "Contamination — something the party scavenged is tainted or dangerous",
  "Territorial — the party has crossed an unmarked boundary into claimed ground",
  "Scarcity — a critical resource runs out at the worst possible moment",
  "Legacy — an artifact from before the fall activates and draws attention",
]);

t.current_issues = t.current_issues.concat([
  {name: 'The Water Wars', desc: 'Three settlements share the same aquifer. The water table is dropping. Diplomacy failed last season. The first shots have already been fired.', faces: [{name: 'Elder Thane Ossbrook', role: 'Believes rationing is the only option; will enforce it by force if necessary'}, {name: 'Runner Petra Calv', role: 'Smuggling water out of the zone for profit — and funding one side of the conflict'}], places: ['The Aquifer Settlement', 'The Two Downstream Communities']},
  {name: 'The Reclamation Cult', desc: 'A growing movement believes the ruins should not be scavenged but worshipped. They are arming their faithful and targeting delver crews.', faces: [{name: 'The Shepherd', role: 'Charismatic founder — genuinely believes every scavenged artifact is a sin against the old world'}, {name: 'Deacon Sable Murn', role: 'Handles recruitment — knows the theology is false; uses it for power'}], places: ['The Cult Compound in the Old Museum District', 'The Road Shrine Network']},
]);

t.impending_issues = t.impending_issues.concat([
  {name: 'The Second Collapse', desc: 'The bridges, dams, and power lines that survived the fall are reaching the end of their structural lives. When they go, the new settlements built around them go too.', faces: [{name: 'Engineer Corvan Dast', role: 'Only person who knows how bad it is — and who built the settlements depending on the infrastructure'}, {name: 'Warlord Thresh', role: 'Controls the salvage trade; does not want anyone to know the infrastructure is failing'}], places: ['The Great Bridge Settlement', 'The Dam Town', 'The Grid-Dependent Enclave']},
  {name: 'The Clean Zone', desc: 'Rumors of a region where nothing fell, where the old world continues unchanged. The rumors are spreading faster than people can walk. The truth of what is there is worse.', faces: [{name: 'The Pilgrim Caravans', role: 'Hundreds are already walking toward the Clean Zone — some will not survive the journey'}, {name: 'The Keeper', role: 'Knows exactly what the Clean Zone is — and why no one who has seen it has come back to say so'}], places: ['The Road of Rumors', 'The Boundary — the last place anyone turned back']},
]);

})();

// ═══════════════════════════════════════════════════════════════════════
// AUDIT FIXES — v9.2 (The Long Road)
// Nature-reclamation content, Reclamation Cult theology, named places,
// issue normalization
// ═══════════════════════════════════════════════════════════════════════
(function(){var t=CAMPAIGNS.postapoc.tables;

// Nature-reclamation zones — delivering on "the beautiful apocalypse"
t.zones = t.zones.concat([
  ["Canopy of Vine and Rust — The Highway Is a Forest Now", "Root-Tangled, Light-Dappled", "The road surface is broken into islands. Movement between requires climbing. The canopy provides total concealment from above."],
  ["The Orchard That Grew Itself", "Fruit That Nobody Planted, Sweet and Suspect", "Food is abundant here. Whether it's safe is a Lore question nobody has answered definitively."],
  ["Root-Cracked Foundations — The Building Grows", "Nature Won This One", "The structure is 60% tree now. What's left of the architecture is being digested."],
  ["The Flooded Basement — Still and Green", "Algae Bloom, Frog-Song, Zero Visibility Below the Surface", "The water is alive with things that were not here before the collapse."],
]);

// Nature-reclamation complication_env entries
t.complication_env = t.complication_env.concat([
  "A massive root system has grown through the wall — the building is being slowly pulled apart from below",
  "The ivy covering the exterior is thorned and has grown across the only exit overnight",
  "A flock of birds — hundreds — erupts from the canopy above, indicating something large is moving through the overgrowth",
  "The water table has risen. What was dry ground this morning is ankle-deep and rising.",
  "A bloom of bioluminescent fungus lights the ruin from within — beautiful, possibly toxic, definitely not here yesterday",
]);

// Reclamation Cult theology — what specifically they believe
t.compel_situations = t.compel_situations.concat([
  "The Reclamation Cult believes the ruins are the bones of a dead god. Scavenging is desecration. You are holding a scavenged artifact.",
  "The Cult teaches that nature's return is a divine correction — humanity was the disease, the collapse was the cure. You just proposed rebuilding.",
  "A Cult preacher is telling the settlement's children that machines are sinful. Your crew's survival depends on a machine.",
  "The Cult's position is not unreasonable: every settlement that rebuilt with pre-war tech eventually attracted something that destroyed it. They have evidence.",
]);

// Named settlements for geographic anchoring
t.seed_locations = t.seed_locations.concat([
  "Canopy — a treetop settlement built in the overgrown interstate interchange, connected by rope bridges",
  "Stillwater — a lake community where the water is clean, the fish are plentiful, and three factions claim the shoreline",
  "The Stacks — a settlement inside a collapsed parking structure, each level is a different neighbourhood",
  "Bridgetown — built on and under a surviving highway bridge, the only river crossing for thirty miles",
]);

// Nature-specific minor concept adjectives
t.minor_concepts.v.PmAdj = t.minor_concepts.v.PmAdj.concat([
  "vine-scarred", "canopy-born", "bloom-sensitive", "root-wise",
  "overgrowth-adapted", "spore-cautious", "rain-dependent", "fungal-literate",
]);

// Issue normalization
['current_issues','impending_issues'].forEach(function(k){
  for(var i=t[k].length-1;i>=0;i--){
    if(typeof t[k][i]==='string'){
      var p=t[k][i].split(' — ');
      t[k][i]={name:p[0],desc:p.slice(1).join(' — ')};
    }
  }
});

})();
