// data/victorian.js
// Campaign data for Victorian.
// Requires data/shared.js to be loaded first (provides CAMPAIGNS object).

CAMPAIGNS["victorian"] = {
    meta: {
      id: "victorian", name: "The Gaslight Chronicles",
      tagline: "Gothic Cosmic Horror. The arrogance of the Enlightenment meets ancient, incomprehensible dread - in the gaslit streets where industrial progress ends, the veil is very thin.",
      icon: "⊕", font: "'Inter', sans-serif",
    },
    colors: {
      bg:"#08090a", panel:"#0f1012", border:"#1e2015",
      gold:"#b8952a", accent:"#7a9048", dim:"#4a5828",
      text:"#c8c4a8", muted:"#1e2018", textDim:"#6a6848",
      red:"#882020", blue:"#2a3860", green:"#2a4830", purple:"#482040",
      tag:"#7a904822", tagBorder:"#7a904844",
    },
    lightColors: { bg:"#f5ede0", panel:"#fff8f0", border:"#c09860", gold:"#5a3808", accent:"#4a2800", dim:"#704818", text:"#1c1008", muted:"#604028", textDim:"#483018", red:"#780010", blue:"#183858", green:"#204828", purple:"#381458", tag:"#b8952a22", tagBorder:"#b8952a18" },
    tables: {
      names_first: ["Edmund","Vivienne","Alistair","Constance","Reginald","Mira","Cornelius","Agnes","Bartholomew","Evangeline","Dorian","Lavinia","Percival","Octavia","Ambrose","Clementine","Thaddeus","Rosalind","Ignatius","Wilhelmina","Lucian","Harriet","Phineas","Beatrice","Abigale","Ada","Agatha","Arabella","Caroline","Cecilia","Charlotte","Dora","Eleanor","Eliza","Emma","Flora","Grace","Hannah","Henrietta","Julia","Juliet","Kate","Katherine","Laura","Lily","Louisa","Mabel","Mary","Matilda","Mercy","Mildred","Molly","Nelly","Patience","Phoebe","Prudence","Rachel","Rebecca","Ruth","Sophia","Tabitha","Temperance","Violet","Aaron","Arthur","Augustus","Barnabas","Benjamin","Clarence","Clement","Daniel","Ernest","Francis","Frederick","George","Gilbert","Harold","Henry","Herbert","Isaac","Jasper","Jonathan","Joseph","Julius","Lawrence","Levi","Lewis","Martin","Matthew","Maurice","Michael","Nathaniel","Nicholas","Nigel","Oliver","Ralph","Robert","Roger","Samuel","Sebastian","Simon","Solomon","Stephen","Thomas","Timothy","Victor","Walter","William","Vanessa","Ethan","Ferdinand","Lucretia","Iphigenia","Malachy","Zenobia","Cassius","Seraphina","Obadiah","Cordelia","Leander","Thessaly","Emrys","Rowena","Aldous","Perdita","Sylvester","Bennet","Cormac","Kes","Siobhan","Donal","Aoife","Tam"],
      names_last: ["Ashmore","the Third","of Whitechapel","Blackwood","Coldshaw","Grimsby","the Younger","of the Society","Galloway","Dusk","Hargrove","Moorcroft","Pale","the Condemned","Finch","Crowswick","Undertow","of Redmoor","Vane","Brightmore","Ashton","Baker","Banks","Barclay","Barton","Beaumont","Beeching","Brewer","Brock","Chambers","Chandler","Compton","Cooper","Davenport","Dawkins","Dickinson","Emerson","Featherstone","Fielding","Fleming","Flint","Gates","Glass","Goodall","Granger","Griffin","Hawk","Heaton","Huddleston","Humphries","Jarvis","Kettle","King","Kingsland","Larkin","Latimer","Lewis","Longhurst","Lovegrove","Maitland","Marsh","Massey","Maxwell","Moody","Mortimer","Norris","Oakley","Palmer","Parsons","Pennington","Porter","Potter","Prescott","Radcliff","Riggs","Rowley","Sackville","Sawyer","Scarborough","Sheridan","Silver","Sparks","Stanhope","Steele","Sterling","Stokes","Theobald","Tinker","Turner","Weller","Wheeler","Whiting","Wilkins","Yardley","Nighthollow","of the Unlit Stair","Greymantle","the Unrecorded","Voidmere","of the Inner Circle","Ashbourne","Coldwick","the Unreliable","Dunmorrow","of Redchurch","the Witnessed","Blackthorn","Pallister","Cruciform","of the Third Compact","Wraithmoor","Sealock","the Unnamed","Grimthorpe"],
      pc_high_concepts: ["Natural Philosopher Whose Notes Would Be Burned by Either Side","Detective Whose Methods the Constabulary Officially Discourages","Society Doctor Who Treats Patients the Hospitals Won't","Correspondent Filing Stories She Cannot Print Under Her Real Name","Academic Whose Dissertation Findings Were Suppressed by the Institution","Engineer Who Built Something That Should Not Function","Archivist Whose Research Has Made Her a Person of Interest","Alienist Who Has Started Believing Her Patients","Astronomer Who Charted Something She Was Told Not to Publish","Chemist Whose Compound Has Applications Beyond the Laboratory","Barrister Who Knows Which Cases She Was Paid Not to Win","Spiritualist Who Has Started Finding Evidence"],
      pc_questions: ["What did you observe that your profession told you was impossible, and what did you do with that knowledge?","Which institution are you still formally affiliated with, and what do they think you are doing?","Who in this city knows what you actually are, and are they keeping that knowledge for leverage?","What do you believe about the nature of what you've encountered, and how wrong might you be?","What have you promised someone you cannot deliver?","What are you protecting by being careful, and is careful still working?"],
      minor_concepts: {
          t: [
            "A {VmAdj} {VmRole}",
            "{VmRole} in employ of {VmMaster}",
            "A {VmAdj} {VmRole} with {VmTrait}",
            "{VmRole} - {VmStatus}",
            "Constable on the Occult Beat",
            "Cursed Violinist",
            "Disgraced Medium",
            "Fringe-Science Inventor",
            "Mad Asylum Doctor",
            "Occult Bookseller",
            "Opium-den Informant",
            "Opium-hazed Fog-Watcher",
            "Society Lady with a Secret",
            "Society-scorned Eldritch-marked Investigator",
            "Steampunk Automaton Butler",
            "Street Urchin Pickpocket"
          ],
          v: {
            VmAdj: ["loyal", "desperate", "suspicious", "well-dressed", "corrupt", "frightened", "hired", "unremarkable", "well-placed", "resentful", "observant", "purchased", "eldritch-touched", "socially ruined", "compelled", "medically irregular", "colonial-returned", "Lodge-adjacent", "classified", "grief-hollowed", "methodically unreliable", "asylum-released"
            ],
            VmRole: ["footman", "constable", "dockworker", "household servant", "hired thug", "telegraph operator", "society spy", "low clerk", "pawnbroker", "informant", "nightwatchman", "blackmailer's agent", "colonial artefact handler", "Lodge-adjacent solicitor's clerk", "committed medium's keeper", "charitable institution worker", "print shop compositor", "asylum orderly", "night-soil man with unusual routes", "telegraph operator on the classified circuit", "theatrical costumier who sees backstage", "private sanatorium administrator"
            ],
            VmMaster: ["the household", "a society member", "the highest bidder", "an absent lord", "someone they've never met", "the instructions they were given and won't question", "someone in the Third Circle who may not know they are being used", "the entity - through an intermediary the NPC has never questioned", "a Lodge faction whose interest in this specific matter is not coincidental"
            ],
            VmTrait: ["eyes open for extra income", "a loyalty available for purchase", "information and the sense not to act on it alone", "a story that doesn't quite hold together", "nothing to lose and something to prove", "a Lodge membership they cannot technically resign", "a colonial artefact in their possession they don't own", "nothing to lose and a working theory"
            ],
            VmStatus: ["paid to be unremarkable", "positioned to observe", "not as uninformed as they appear", "following instructions from three sources", "working for someone neither party knows", "hearing things that inform their choices in ways they don't discuss", "already past the point of useful denial", "working for three principals none of whom know about the others"
            ],
          }
        },
      minor_weaknesses: ["The Thing They Saw Has Not Left Them","Blackmailed Into This Position","Addicted to Laudanum or Something Worse","Their Employer Would Destroy Them if They Talked","The Faith They Had Is Gone and They Know It","One Act of Conscience Away from Ruin","Family Name Carries a Darker History Than They Admit","The Creature Marked Them - They Don't Know It Yet","They've Already Told Someone Where They Are","Guilt Over the Last Person Who Trusted Them","The Blackmail Material Is Real and Extremely Specific","Gambling Debts Owed to a Particularly Persistent Creditor","Their Name Appears in the Lodge's Membership Rolls - Accurately","The Addiction Is Under Control Until It Suddenly Isn't","A Prior Conviction That Complicates All Encounters With Law","They Cannot Bring Themselves to Betray a Confidence","The Creature Left a Mark That Flares Near Its Kind","Family Obligation Requires Weekly Attendance - Inconvenient","Their Own Testimony Implicates Them in a Prior Incident","Will Not Leave a Witness - But Cannot Harm One Either","Aversion to the Dark Since the Incident in the Cellar","Reputation for Eccentricity Means Nobody Takes Them Seriously","The Medicine Is Necessary and Controlled by the Wrong Doctor","Compulsive Need to Document Everything - Including This","Recognisable to Every Constable in a Five-Mile Radius","Old Family Shame That Surfaces at Social Functions","Cannot Enter a Church Since the Vision","Owes a Debt to the Society That Cannot Be Repaid In Money","The Thing They Carry Wants to Be Found","Terrified of Mirrors Since Whitechapel","Cannot Stand Confined Spaces Since the Vault","The Sight Opens Without Warning Near the Dying - Inconvenient, Unreliable, Unchosen","Bound by Lodge Oath Taken Before Understanding the Lodge","Will Not Permit a Dissection - Reasons Are Personal","Handwriting Changes When Something Writes Through Them","Owes Something Old - It Collects in Non-Monetary Ways","The Newspaper Has Their Face and Uses It Freely","The Locket Never Removed Is Not Theirs and Is Not Empty","Name in the Lodge's Black Register - Any Member May Call","Cannot Leave a Ritual Witnessed in Progress Unfinished","Scar Itches Near the Entity - Unwanted Warning System","Laudanum Veils the Visions - Required Dose Keeps Rising","Colonial Artefact They Carry Still Has a Living Owner","Won't Enter Without Mapping Exits - Creates Problems","Their Scientific Reputation Means Any Claim of Supernatural Experience Is Professionally Suicidal","Church-Estranged but Bound by Promises Made in Extremis","The Creature Shown Mercy Thinks Mercy Means Ownership","The Lodge Holds Something - Not Yet Chosen to Use It","Weather Responds to Their Emotions - Demonstrably","Most Dangerous Knowledge Is Also the Most Published"],
      major_concepts: {
          t: [
            "A {VmajAdj} {VmajRole} who {VmajDrive}",
            "Former {VmajRole} turned {VmajAlt}",
            "The most {VmajAdj} {VmajRole} in {VmajSphere}",
            "A {VmajAdj} {VmajRole} carrying {VmajBurden}",
            "Detective who talks to the dead",
            "Disgraced Surgeon with the sight for the Unseen",
            "Eldritch Scholar of the Black Library",
            "Escaped Experiment from the Sewers",
            "High-Society Occultist",
            "Inventor of the Ghost-Catcher",
            "Journalist of the Weird and macabre",
            "Lead Investigator of the Secret Society",
            "Medium possessed by a helpful spirit",
            "Monster-slaying Nun",
            "Vampire Hunter with a tragic past"
          ],
          v: {
            VmajAdj: ["disgraced", "celebrated", "feared", "indebted", "brilliant", "notorious", "connected", "fallen", "occult", "distinguished", "ruined", "classified", "psychically-compromised", "Lodge-marked", "colonial-haunted", "obsession-hollowed", "eldritch-touched", "empire-broken", "twice-classified", "grief-driven"
            ],
            VmajRole: ["consulting detective", "alienist", "society matriarch", "disgraced surgeon", "intelligence operative", "occultist", "colonial administrator", "investigative journalist", "hereditary peer", "blackmailer", "forensic scientist", "professional medium", "private alienist to Lodge members", "colonial governor returned changed", "experimental psychicist at the Academy", "hereditary keeper of the Third Compact", "unofficial Vatican emissary for the anomalous", "former Lodge Grandmaster now regretting the tenure", "mesmerist to the Queen's household"
            ],
            VmajDrive: ["controls three society factions through accumulated knowledge", "found evidence that cannot be published without destroying innocents", "works both the official inquiry and the lodge simultaneously", "knows which families own the precinct and charges accordingly", "is three cases from complete professional ruin", "holds a secret that ends a dynasty if it surfaces", "built a reputation on cases that never officially existed", "has read the Ashmore Papers and is the only one who has and survived with full cognition", "maintains the Lodge's only accurate record of what was bound and when the binding expires", "serves the entity sincerely and is not wrong that the entity offers things it actually delivers", "has spent eleven years establishing that one death was not self-inflicted and is one document away from proof"
            ],
            VmajAlt: ["government consultant", "private investigator", "blackmailer", "society liability", "reluctant witness", "the problem"],
            VmajSphere: ["the society", "the lodge network", "the city", "the profession", "three counties", "official circles"],
            VmajBurden: ["evidence they cannot legally use", "a secret that protects the undeserving", "a past contradicting the official record", "a debt to something that collected early", "a promise made to someone who didn't survive", "a classification that never expires", "a working that began before their birth that technically requires them to complete it", "the entity's mark in a location that cannot be concealed from those who know to look", "knowledge of the Lodge's complete membership that three factions would kill to possess"
            ],
          }
        },
      troubles: ["The Lodge Has Eyes in Every Institution","My Research Has Gone Further Than I Can Come Back From","I Know What Took My Friend and I Cannot Say It","The Creature Left Something In My Mind","My Good Name Is the Only Armour I Have Left","I Have Made Compacts I Cannot Undo","The Case That Destroyed My Career Won't Stay Closed","I Believe Everything I've Seen - and That Terrifies Me","My Family Must Never Know What I've Become","The Madness Comes in Waves and the Tide Is Coming","The Addiction Owns Me Body and Soul - I Just Manage It","Something Has Been Hunting Me Longer Than I Have Known","The Corruption Runs Deeper Than Any Audit Could Find","My Notorious Past Travels Faster Than I Do","I Will Not Let This Wrong Go Unpunished","The Indebted Never Truly Get Free - They Just Change Creditors","The Lodge Has My Signature on Something I Cannot Repudiate","I Have Seen Through the Veil and It Has Seen Through Me","The Evidence Proves Everything and Convicts Me Equally","My Rational Framework Cannot Accommodate What I Have Witnessed","The Creature Has Taken an Inappropriate Interest in My Research","I Have Made Promises to the Dead That I Must Now Keep","The Society Considers My Knowledge a Liability to Be Managed","Every Investigation Leads Back to the Same Name","The Medicine That Controls the Condition Is Running Out","My Social Position Requires I Deny What My Eyes Have Confirmed","I Was There When It Happened - No One Believes Me","The Record Says I Was Somewhere I Was Not","I Am Being Followed by Something That Learns My Patterns","Three Months of Memory Are Gone - Selectively Gone","The Thing That Came Through Needed Me Specifically to Open It","Haven't Told My Partner What I Know - Too Dangerous","The Entity Made an Offer - I Didn't Refuse Clearly Enough","Something Writes Through My Hand - Better Instincts Than Mine","The Obsession Consumed Every Friendship - Nearly Worth It","Ancestor's Compact Still Active - Has Found This Generation","Was in the Ice When It Found Us - Only Survivor","The Knowledge Was Not Freely Given - Debt Still Active","Been Somewhere Time Runs Wrong - Not Certain I'm Back","The Architecture Speaks to Me - I've Started Answering","The Creature I Made Knows Where I Am","The Dreams Show What Happens Before It Does","The Entity Calls Me by the Name I Have Never Told Anyone","I Hear the City's Dead - Not All of Them Are Quiet","My Double Has Been Seen Doing Things I Have Not","My Published Theories Are Correct - That's the Problem","The Empire Brought Something Back That Knows My Family's Name Before Mine","The Magic in My Blood Costs Something - Still Costing","Three Are Dead Because I Didn't Act on What I Knew","My Reflection Has Stopped Mirroring Me Exactly"],
      other_aspects: {
          t: [
            "{VOAdj} in {VOSphere}",
            "{VOVerb} What the {VOSubj} {VOAct}",
            "My {VOThing} Is {VOState}",
            "Known in {VOSphere} as {VOEpithet}",
            "I Have {VOVerb} What the {VOSubj} {VOAct}",
          ],
          v: {
            VOAdj: ["Trained", "Known", "Feared", "Connected", "Classified", "Marked", "Trusted", "Ruined", "Celebrated", "Suspected", "Eldritch-Marked", "Lodge-Adjacent", "Classified", "Empire-Returned", "Twice-Committed"
            ],
            VOSphere: ["Society", "The Lodge Network", "Official Circles", "The Profession", "Three Counties", "The Right Clubs", "Scotland Yard", "The Academy", "The Veil Circuit", "Lodge Membership", "Colonial Record", "The Classified Archive", "The Third Circle"
            ],
            VOVerb: ["Survived", "Documented", "Witnessed", "Classified", "Found", "Buried", "Kept", "Recorded", "Sealed", "Classified", "Committed", "Recovered", "Survived"
            ],
            VOSubj: ["official record", "academy", "tribunal", "society", "lodge", "inquest", "report"],
            VOAct: ["Won't Publish", "Can't Prove", "Doesn't Acknowledge", "Won't Investigate", "Never Records", "Refuses to Admit", "Would Never Believe"],
            VOThing: ["Dossier", "Reputation", "Classification", "Source", "Evidence File", "Society Standing", "Official Record"],
            VOState: ["Three Witnesses Deep", "Cleaner Than the Official Version", "Worth More Than My Retainer", "Mine Until It Surfaces", "Buried Under the Right Name", "Running on Borrowed Standing"],
            VOEpithet: ["the Reliable", "the Difficult", "the One They Call Last", "the One They Won't Acknowledge", "the Expensive", "Useful Until Inconvenient", "the One They Don't Name in Reports", "the Inconvenient", "the Third Account", "the One the Lodge Watches"
            ],
          }
        },
      stunts: [
        {name:"Deductive Mind",skill:"Investigate",desc:"+2 to create advantages when observing a person or crime scene with at least one minute of study.",type:"bonus",tags:["investigation", "knowledge", "technical"]},
        {name:"Society Connections",skill:"Contacts",desc:"+2 to overcome when seeking information within the upper classes, clubs, or government institutions.",type:"bonus",tags:["social", "knowledge", "negotiation"]},
        {name:"Street Knowledge",skill:"Contacts",desc:"+2 to overcome when seeking information from the criminal underworld, dockworkers, or lower city.",type:"bonus",tags:["knowledge", "investigation", "social"]},
        {name:"Iron Nerve",skill:"Will",desc:"+2 to defend against the mental stress of witnessing supernatural events, aberrant phenomena, or profound horror.",type:"bonus",tags:["survival", "combat", "leadership"]},
        {name:"Occult Library",skill:"Lore",desc:"+2 to overcome when researching arcane texts, identifying occult symbols, or recognising ritual patterns.",type:"bonus",tags:["knowledge", "supernatural", "investigation"]},
        {name:"Pugilist",skill:"Fight",desc:"+2 to attack with Fight when your opponent is unarmed or smaller than you.",type:"bonus",tags:["combat"]},
        {name:"Disguise",skill:"Deceive",desc:"+2 to overcome when adopting a false identity in a social class you have personally observed closely.",type:"bonus",tags:["subterfuge", "stealth", "social"]},
        {name:"The Listening City",skill:"Notice",desc:"+2 to overcome when gathering information by eavesdropping in public spaces.",type:"bonus",tags:["investigation", "knowledge", "social"]},
        {name:"Steady Hand",skill:"Shoot",desc:"+2 to attack when you have at least one exchange to aim and the target is not aware of you.",type:"bonus",tags:["combat","stealth"]},
        {name:"Medical Training",skill:"Crafts",desc:"+2 to create advantages or remove complications related to physical injury or poisoning.",type:"bonus",tags:["repair", "knowledge", "technical"]},
        {name:"Psychic Barrier",skill:"Will",desc:"Once per scene, force a supernatural entity to make a Will overcome roll to target you mentally - on a fail, it cannot affect you this scene.",type:"special",tags:["supernatural", "survival", "combat"]},
        {name:"On the Case",skill:"Investigate",desc:"Once per scene, ask the GM one yes/no question about a crime, scene, or person you've been able to observe for at least a few minutes.",type:"special",tags:["investigation", "knowledge", "technical"]},
        {name:"Face in the Crowd",skill:"Stealth",desc:"Once per scene, become completely unnoticeable in a crowd - witnesses will not recall you were present, no roll required.",type:"special",tags:["stealth", "subterfuge", "social"]},
        {name:"Invoking the Compact",skill:"Rapport",desc:"Once per scene, call upon a formal agreement, debt, or oath held over an NPC to demand a single specific action from them.",type:"special",tags:["social", "knowledge", "supernatural"]},
        {name:"Exorcism Rite",skill:"Lore",desc:"Once per scene, begin a ritual that, if uninterrupted for one exchange, suppresses or drives off a supernatural entity present in the zone.",type:"special",tags:["supernatural", "combat", "knowledge"]},
        {name:"Read the Room",skill:"Empathy",desc:"Once per scene, identify the single most useful hidden motivation of an NPC you're currently speaking with - the GM must answer honestly.",type:"special",tags:["social", "investigation", "knowledge"]},
      {name:"Anatomist",skill:"Fight",desc:"Use Investigate instead of Fight when targeting a creature's weak point.",type:"special",tags:["knowledge", "combat", "technical"]}, {name:"Deduction",skill:"Investigate",desc:"Use Investigate instead of Empathy to spot a lie.",type:"special",tags:["investigation", "knowledge", "technical"]}, {name:"Deductive Leap",skill:"Investigate",desc:"Once per scene, automatically discover one hidden clue or concealed fact without a roll - the GM must answer honestly.",type:"special",tags:["investigation", "knowledge", "technical"]}, {name:"Forbidden Rites",skill:"Lore",desc:"Use Lore to attack an entity from beyond the veil as if it were a physical weapon.",type:"special",tags:["supernatural", "knowledge", "subterfuge"]}, {name:"Gadgeteer",skill:"Crafts",desc:"Once per scene produce a specialized tool for the task at hand.",type:"special",tags:["technical", "repair", "knowledge"]}, {name:"Grim Resolve",skill:"Physique",desc:"+2 to Physique when resisting poison or disease.",type:"bonus",tags:["survival", "combat", "leadership"]}, {name:"Iron Will",skill:"Will",desc:"+2 to Will when defending against mental corruption.",type:"bonus",tags:["survival", "combat", "leadership"]}, {name:"Occult Knowledge",skill:"Lore",desc:"+2 to Lore when identifying eldritch rituals.",type:"bonus",tags:["knowledge", "supernatural", "investigation"]}, {name:"Shadow-Stalker",skill:"Stealth",desc:"+2 to Stealth when in thick fog or darkness.",type:"bonus",tags:["stealth", "movement", "investigation"]}, {name:"Silver-Tongue",skill:"Rapport",desc:"+2 to Rapport when dealing with the upper class.",type:"bonus",tags:["social", "negotiation", "subterfuge"]},
        {name:"Duelist's Aim",skill:"Shoot",desc:"+2 to Shoot when using flintlock or steam-powered pistols.",type:"bonus",tags:["combat"]},
        {name:"Underworld Contacts",skill:"Contacts",desc:"+2 to Contacts when searching for illicit information.",type:"bonus",tags:["social", "knowledge", "subterfuge"]}],
      scene_tone: {
          t: [
            "{VtAdj} and {VtAdj2}",
            "{VtNoun}-heavy {VtQual}",
            "The air is {VtAir}",
            "{VtQual} - every surface {VtSurface}",
          ],
          v: {
            VtAdj: [
              "Fog-wrapped", "Oppressively civil", "Class-stratified", "Scandal-adjacent",
              "Evidentially rich", "Formally hostile", "Impeccably maintained", "Colony-returned",
              "Lodge-saturated", "Veil-thin", "Eldritch-charged", "Occultly active",
              "Rational-until-it-isn't", "Socially-observed", "Empire-stained",
              "Supernaturally-adjacent", "Archive-dense", "Séance-warm",
              "Doubt-resistant", "Correctly-witnessed", "Reform-era tense",
              "Upper-class terrified", "Scientifically-inexplicable", "Confession-ready",
              "Compactly-haunted"
            ],
            VtAdj2: [
              "watched from behind correct manners",
              "thick with what isn't being said",
              "loaded with implications nobody will state",
              "carrying a secret toward the surface",
              "two social exchanges from crisis",
              "perfectly maintained and deeply wrong",
              "watching every exit",
              "waiting for someone to name what everyone knows",
              "thin over something significant",
              "wrong in exactly one detail",
              "carrying something that came home from somewhere it shouldn't have been brought",
              "thin over something that has been building for decades",
              "wrong in a way that Lore confirms and reason contests",
              "holding very still in the way things hold still before they act",
              "full of people who have already decided what they didn't see",
              "aware of the investigation and choosing not to acknowledge it",
              "keeping the ritual going by not naming it as one",
              "managing the horror through administrative procedure",
              "requiring something to happen before anyone speaks first",
              "performing normality with the concentration of the genuinely frightened"
            ],
            VtNoun: ["Scandal", "Fog", "Propriety", "Evidence", "Class", "Secrecy", "Inquest", "Compact", "Ritual", "Lodge"],
            VtQual: ["tension", "formal hostility", "polished menace", "studied ignorance", "enforced civility", "barely-contained revelation", "lodge atmosphere", "investigation weight"],
            VtAir: [
              "thick with the unsaid",
              "wrong in a way instruments can't measure",
              "heavy with old money and older secrets",
              "carrying something from the floor below",
              "perfumed over something it shouldn't cover",
              "carrying the particular smell of something not from this city",
              "wrong in a measurable way that no instrument will confirm officially",
              "holding the temperature of something that left recently",
              "disturbed by breath that isn't ours",
              "carrying the specific weight of a name not yet spoken",
              "wrong the way evidence is wrong when it's been arranged"
            ],
            VtSurface: [
              "a potential witness",
              "carrying evidence",
              "watching without appearing to",
              "wrong in one specific detail",
              "placed by someone who wasn't supposed to be here",
              "touched since this morning in a pattern that suggests purpose",
              "precisely as it was left and precisely not as it should be",
              "oriented toward the door in a way that suggests prior knowledge",
              "clean in a room where nothing else is clean",
              "carrying the mark of something that pressed against it from the other side"
            ],
          }
        },
      scene_movement: ["Wet Cobblestones - Running Is Treacherous","Narrow Victorian Corridor - Single File Only","Dense Fog Limits All Notice Rolls","Collapsed Floor Above - Risk of Falling Through","Packed Street Crowd - Pursuit Is Slow","Wrought Iron Gate, Locked, Between Zones","Flooded Cellar - Shin-Deep","Loose Bookshelves - Easily Knocked Into a Pursuers Path","Winding Staircase - High Ground Advantage to Defenders","Secret Passage - Fast But Dangerous","Collapsed Gas Main - Exposed Pipe, No Naked Flames Anywhere","Dense Deliberate Crowd - Movement Requires an Overcome or a Scene","Knee-Deep Floodwater in the Lower Crypt","Servant Passages - Too Narrow for a Full Coat and a Hurry","Swinging Chandelier Occupies the Zone Transition Entirely","Active Ritual Ward on the Floor - Crossing Requires Will Roll","Shattered Greenhouse Glass on Every Surface","Spatial Disorientation Between Zones - the Entity's Doing","Iron Chain Across the Passage, Padlocked, Waist Height","Steep Wet Stairs Down to the River - Fast in One Direction","Collapsing Tenement Floor - Weight Limit Unclear","Chemical Smoke From the Laboratory Below - Breathing Has a Cost","The Clock Has Stopped and the Doors Will Not Move While It Is Not Ticking","Tramcar on Rails Through the Zone - Passes Every Exchange","Flooded Gas Cellar - The Flame Downstairs Would End Everything"],
      scene_cover: ["Heavy Oak Furniture","Floor-to-Ceiling Bookcases","Pew Rows in the Dark Chapel","Market Stalls Along the Street","Omnibus - Stopped and Occupied","Iron Pillars of the Factory Floor","Dense Curtaining Throughout","Archive Filing Cabinets","Decorative Stonework","Parked Hansom Cabs","Overturned Printing Press - Heavy, Immobile, Excellent","Stone Sarcophagus Lid Standing on Its Edge","Row of Taxidermied Specimens, Dense Enough to Crouch Behind","Factory Steam Engine Housing - Warm, Loud, Solid","Archive Shelving Rows, Floor-to-Ceiling, Paper-Dense","Dense Iron Railings of the Asylum Perimeter","Low Churchyard Wall, Ancient Stone, Knee-High","Grand Piano, Upright in the Parlour - Absurd but Sufficient","Row of Laboratory Glass Specimen Cases","Stack of Broadsheet Bales in the Print Shop","Thick Stage Curtains - Heavy Velvet, Full Length","Row of Wooden Confession Booths","Toppled Wardrobe in the Abandoned Bedroom","Stone Baptismal Font - Inconvenient but Solid","Banker's Deed Boxes, Stacked Three-High on the Floor"],
      scene_danger: {
          t: [
            "{VdAdj} {VdHazard}",
            "{VdHazard} that {VdBehave}",
            "Active {VdMagic} with {VdResult}",
            "{VdHazard} - {VdWarn}",
          ],
          v: {
            VdAdj: ["Unstable", "Supernatural", "Undocumented", "Occult", "Volatile", "Half-triggered", "Classified", "Recently disturbed", "Chemically", "Structurally"],
            VdHazard: ["ritual circle mid-activation", "entity at the threshold", "reactive chemical compound", "structural weakness in old stonework", "restricted document within reach", "ward pattern carved into the stone", "evidence that changes everything", "gas leak under pressure", "summoning residue", "a presence that shouldn't be here"],
            VdBehave: ["responds to belief", "activates on intrusion", "doesn't follow natural law", "has been building to this for months", "escalates with contact", "remembers who touched it", "tells someone regardless", "is the evidence and the danger simultaneously"],
            VdMagic: ["summoning circle", "ward sequence", "medium channel", "ley convergence", "occult compact", "manifestation in progress"],
            VdResult: ["consequences that outlast the scene", "a witness that cannot be dismissed", "effects the Academy will deny", "a record that survives destruction", "something that changes the case's nature"],
            VdWarn: ["the last person who interfered is a cautionary tale", "dismissing it is the wrong choice", "the lodge has already been notified", "this is both evidence and hazard simultaneously"],
          }
        },
      scene_usable: ["Occult Library - Relevant If You Can Search It","Society Guests as Witnesses and Leverage","Locked Evidence Box - Someone Has the Key","Laboratory Equipment as Improvised Weapons","Gas Lamp on a Loose Mounting","Servant Passages Between Zones","The Thing in the Jar Might Communicate","Printing Press - Can Broadcast Anything You Write","Locked Confession in an Envelope","The Creature's Binding Object", "Cluttered Occult Study", "Cobblestone Streets", "Creaking Floorboards", "Distant Wolf Howls", "Eerie Shadow-Play", "Flickering Gaslights", "Heavy velvet curtains hiding the alcove", "Hidden Secret Passageways", "Rusty Iron Gates", "Scent of Ozone and Sulphur", "Thick London Fog", "Yellow-fogged and damp streets","Electrical Apparatus - Early and Dangerous and Charged","The Medium's Trance Channel - Still Open","Loaded Revolver in the Desk Drawer the Host Has Not Noticed","The Creature's Weakness Object on the Mantelpiece","Bound Text That Completes the Ritual in Either Direction","Servant Who Knows Everything and Has Been Waiting to Be Asked","Photographic Plates Already Developed - Showing Something That Wasn't There"],
      zones: [["The Drawing Room","Witnesses of the Better Sort","Scandal is more dangerous than violence here."],["The Study","Knowledge is Power","Evidence everywhere; knowledge is the currency."],["The Basement","Something Was Done Here","Signs of ritual, recent and ongoing."],["The Fog-Choked Alley","Nowhere to Run Clearly","Pursuit is possible; escape routes are unclear."],["The Chapel","Sanctified - For Now","Certain entities cannot enter; others are drawn."],["The Docks","Industrial and Lawless","Witnesses don\'t cooperate; escape is easy."],["The Club Smoking Room","Secrets Bought and Sold Here","Violence draws attention; information is the real prize."],["The Laboratory","Dangerous and Illuminating","Experiments in progress; evidence abundant."],["The Rooftop","Wind and Exposed Height","Advantage for those with nerve; deadly for those without."],["The Séance Room","The Veil Is Thin Here","Supernatural aspects cost one less fate point to invoke."],["The Private Sanatorium","Voluntary Detention Applies to Visitors","Screams here are unremarkable; nothing is taken at face value; the staff are not neutral."],["The Underground Excavation","Gas Pockets and Unstable Ground","The deepest section has produced results the foreman has not put in the report."],["The Theatre Backstage","Illusion Is the Working Material Here","Exits are numerous and obscured; the audience is audible but blind; nothing is as it appears from the front."],["The Opium Den","The Veil Is Thin Here and Inexpensive","Occupants are witnesses who cannot testify; the entity moves easily in the ambience."],["The Factory Night Floor","Industrial Noise, No Constables, No Witnesses","Violence and investigation both occur under cover of machinery that doesn\'t stop."],["The Sealed Room","Untouched Since 1843","Whatever occupies this space has had decades to learn it and settle into its habits."]],
      current_issues: [
        {name:"The Whitechapel Disappearances",desc:"Fourteen people have vanished in six weeks from the same neighbourhood. The police have a suspect. The investigators know the police are wrong.",faces:[{name:"Inspector Edmund Coldshaw",role:"Closing the case on the wrong man - willingly or not"}],places:["The Whitechapel Rookeries","The Mortuary of St. Agatha"]},
        {name:"The Obsidian Lodge Convenes",desc:"The Lodge meets once a decade. It's been eight years. The early convening means something is wrong at the highest levels of occult society.",faces:[{name:"Grand Master Cornelius Blackwood",role:"Called the meeting; won't say why to anyone below the Third Circle"}],places:["The Lodge's Undisclosed Location","The Coded Invitation Circuit"]},
        {name:"The Exhibition Opens Too Many Things",desc:"The museum's new archaeological exhibition features artefacts from three different digs. Three curators have had breakdowns. One is missing.",faces:[{name:"Archaeologist Vivienne Moorcroft",role:"The missing curator - last seen in the storage basement"}],places:["The Metropolitan Museum","The Sealed Lower Galleries"]},
        {name:"The Pamphlets Are Spreading",desc:"Anonymous pamphlets are appearing across the city detailing genuine occult knowledge. Someone is educating the public - deliberately.",faces:[{name:"Printer Bartholomew Finch",role:"Distributing them but doesn't know who's writing them"}],places:["The Underground Print Shops","The Reading Rooms of Four Parishes"]}
      ],
      impending_issues: [
        {name:"The Ritual Has a Calendar",desc:"Cross-referencing seven separate incidents reveals they are steps in a single ritual. The final step is on the winter solstice. Seventeen days remain.",faces:[{name:"Scholar Ambrose Vane",role:"Made the connection; terrified of being right"}],places:["The Seven Sites Across London","The Final Location - Still Unknown"]},
        {name:"Something Is Using the Dreams",desc:"Across the city, the same dream is being reported - a door, a sound, a figure. The dreamers are slowly changing their behaviour toward a common purpose.",faces:[{name:"Alienist Lucian Undertow",role:"Has forty case files of identical dreams; being silenced"}],places:["The Private Sanatorium","The Shared Location in the Dreams"]},
        {name:"The Lodge Splinters",desc:"A faction within the Obsidian Lodge has decided the entities they've been containing should be let free. They have the access to do it.",faces:[{name:"Lodge Member Dorian the Condemned",role:"True believer; already begun the first unlocking"}],places:["The Lodge Archive","The Containment Vault Below the City"]},
        {name:"The Man Has Been Here Before",desc:"Photographs from 1843 and 1798 show the same man in the same neighbourhood. He's been seen again this week. The same man.",faces:[{name:"The Unchanged Man (name unknown)",role:"Aware he's been noticed; watching back"}],places:["The Archives of Record","Whitechapel - Every Decade"]},
      ],
      setting_aspects: {
          t: [
            "The {VsActor} {VsAct}",
            "{VsResource} Is {VsWorth}",
            "Every {VsThing} Has {VsProp}",
            "{VsTruth} - {VsConseq}",
          ],
          v: {
            VsActor: ["Empire", "Society", "Lodge", "Science", "Fog", "Class", "Old City", "The Rational Mind", "The Veil", "Colonial Import", "The City's Dead", "The Lodge Circuit", "Progress", "The Empire's Arrogance", "Old Compact", "Eldritch Pattern"
            ],
            VsAct: ["papers over what it cannot explain", "watches everything and acknowledges nothing", "reaches everywhere with a plaque on the wall", "cannot account for what it dismisses", "carried more home than it intended to", "determines what you're allowed to see", "runs beneath the new one", "refuses what it has sufficient evidence to accept", "thins in proportion to collective certainty that it doesn't exist", "carries more home than the ships' manifests admit", "have opinions the living can sometimes be made to hear", "reaches every institution if you know the handshake", "papers over every crack until the crack is structural", "named what it encountered and moved on without understanding either", "runs beneath every formal relationship in this city", "repeats until someone notices and then continues"
            ],
            VsResource: ["Reputation", "Society Access", "Lodge Membership", "Official Standing", "Classified Knowledge", "Well-Placed Connections", "Evidence", "A Good Address", "Lodge Standing", "Classified Colonial Report", "Occult Sensitivity", "A Correct Diagnosis", "Evidence the Academy Cannot Dismiss", "Third Circle Access", "A Sealed Verdict"
            ],
            VsWorth: ["armour until it isn't", "what separates investigated from investigator", "what the truth costs to hold", "power the law doesn't formally recognise", "the most dangerous thing in any investigation", "rarer than the official record admits"],
            VsThing: ["investigation", "scandal", "society member", "colonial import", "secret society", "classified file", "unexplained death", "official verdict"],
            VsProp: ["a second story", "a lodge connection", "a price for silence", "a classified dimension omitted from the official record", "more interested parties than the file shows", "implications that outlast the conclusion"],
            VsTruth: ["The Empire's confidence papers over its rot", "What the Academy cannot explain still exists", "Class determines what you're allowed to see", "Every lodge has a lower level nobody discusses", "The dead know things the living can sometimes ask", "Reputation is the only wall between respectability and ruin", "The veil thins fastest where people are most certain it doesn't exist", "What the Empire named and categorised is still out there and still has opinions", "The Lodge's knowledge is genuine and its judgment is terrible", "Every city has a lower city and the lower city has a lower city again"
            ],
            VsConseq: ["and the rot is structural", "and some of it has opinions", "and it determines what you're allowed to know", "and what happens there stays unreported", "and the method is unreliable but the information isn't", "and the wall is considerably thinner than it appears", "and the thinnest point is directly under rational certainty", "and the opinions have been forming for considerably longer than the naming", "and the combination has been producing consequences for four decades", "and the third one is not accessible by stair"
            ],
          }
        },
      opposition: [
        {name:"Cult Initiates",type:"minor",aspects:["Believing Every Word They Were Told"],skills:[{name:"Fight",r:2},{name:"Will",r:2},{name:"Stealth",r:1}],stress:2,stunt:null,qty:4},
        {name:"Lodge Enforcer",type:"minor",aspects:["Keeping the Secrets Buried"],skills:[{name:"Fight",r:3},{name:"Stealth",r:2},{name:"Physique",r:2}],stress:3,stunt:null,qty:2},
        {name:"Possessed Servant",type:"minor",aspects:["Inhabited and Desperate","Not Quite Dead Yet"],skills:[{name:"Fight",r:3},{name:"Physique",r:3},{name:"Notice",r:2}],stress:3,stunt:"Once per scene, a Possessed Servant ignores one mild consequence - the host body feels no pain.",qty:2},
        {name:"Lodge Master",type:"major",aspects:["Custodian of Forbidden Knowledge","Has Done This Before and Won"],skills:[{name:"Lore",r:4},{name:"Provoke",r:3},{name:"Deceive",r:3},{name:"Will",r:2}],stress:3,stunt:"Once per scene, invoke a supernatural entity or ritual already in motion to create a situation aspect with a free invoke.",qty:1},
        {name:"Metropolitan Detective",type:"major",aspects:["Authorised Force","Inconveniently Close to the Truth"],skills:[{name:"Investigate",r:4},{name:"Fight",r:3},{name:"Provoke",r:3},{name:"Notice",r:2}],stress:3,stunt:"+2 to Investigate when gathering testimony from anyone who has spoken to them before.",qty:1},
        {name:"The Fae-Adjacent Creature",type:"minor",aspects:["Does Not Share Your Reference Frame", "Drawn to the City's Gaslight", "Offended by Iron in the Modern Quantities"],skills:[{name:"Deceive",r:3}, {name:"Empathy",r:3}, {name:"Will",r:2}],stress:2,stunt:"Once per scene the creature creates a perfect illusion of a trusted person - recognising it requires a Will overcome at Difficulty 3.",qty:1},
        {name:"Psychically Compromised Investigator",type:"major",aspects:["Was One of You Until Recently", "The Entity Feeds Her Information", "Believes Every Word She Is Being Told"],skills:[{name:"Investigate",r:4}, {name:"Deceive",r:3}, {name:"Empathy",r:3}, {name:"Will",r:2}],stress:3,stunt:"Once per scene invoke a piece of intelligence about the party that the entity has gathered - creates a free aspect on the target reflecting their specific vulnerability.",qty:1},
        {name:"Eldritch Manifestation",type:"major",aspects:["Not Entirely Present in This Space", "Responds to Belief, Not Physics", "Has Been Here Much Longer Than the Building"],skills:[{name:"Will",r:5}, {name:"Provoke",r:4}, {name:"Notice",r:3}],stress:4,stunt:"Conventional attacks against the manifestation require invoking an aspect representing genuine understanding of its nature - without this, they do no stress.",qty:1},
        {name:"Empire's Occult Agent",type:"major",aspects:["Crown Authority and Official Deniability", "Has Done Worse in Service of Less", "The Colonial Methods Work Here Too"],skills:[{name:"Fight",r:4}, {name:"Deceive",r:4}, {name:"Investigate",r:3}, {name:"Contacts",r:2}],stress:3,stunt:"Once per scene invoke Crown authority to compel a local official's cooperation - the official acts; consequences fall on the agent later, if at all.",qty:1}
      ],
      twists: [
        "The ritual was completed one step early - effects begin immediately.",
        "Someone on the investigation is compromised and has been reporting your movements.",
        "The supernatural entity in the scene is communicating - if someone is willing to listen.",
        "A constable arrives - armed with authority and entirely the wrong information.",
        "The evidence points to a member of the group's own social circle.",
        "Something previously contained in the building is no longer contained.",
        "A witness turns out to be a relevant survivor from an earlier incident.",
        "The creature is protecting something, not hunting.",
        "The document that proves everything is also the document that destroys a reputation.",
        "Someone helpful knows more than they've said - and it changes everything.",
        "The landlord/owner arrives and knows exactly what this building is.",
        "An anonymous letter arrives mid-scene - addressed to one of the investigators.",
        "The body was moved. This is not where it happened.",
        "A member of the nobility is present - and clearly terrified.",
        "The creature is not hostile. It appears to be waiting for something.",
        "The supernatural entity is cooperating with someone in the room.",
        "A second murder has occurred - same method - while the party was here.",
        "The confession letter is genuine. The confessor is also present.",
        "The Lodge member being questioned is the Lodge's informant on the party.",
        "The creature isn't here for them - it's protecting something unnoticed.",
        "A Member of Parliament has arrived with questions and a constable.",
        "The archive has a gap. Recent, deliberate, and relevant.",
        "The ritual circle in the basement is a copy. Someone has been practicing.",
        "The informant is dead. The information was delivered before they were.",
        "The ghost is trying to communicate something specific - time is short.",
        "The society doesn't know this branch has operated independently for forty years.",
        "The suspect's alibi is airtight and also impossible.",
        "The chemical compound has already been administered to someone here.",
        "The occult symbol predates the organisation suspected of using it.",
        "The constable on the door has been replaced. Recently.",
        "The body is not dead. It has been occupied and is simulating death with commendable patience.",
        "The occult symbol predates the civilisation the Lodge claims invented it by two thousand years.",
        "The medium channels someone the party recognises. The message concerns this specific moment.",
        "The inspector admits he has been having the same dreams as the victims. Since the same date.",
        "The ritual circle is protective - the thing it was protecting against is now inside the room with everyone.",
        "The creature stops and speaks. In English. Grammatically correctly and with evident intent.",
        "The society matriarch produces documentation proving she owns the building and every person here has signed something.",
        "The entity is not singular. There are two of them. They are competing. The party is the prize.",
        "A message in one party member's future handwriting is found in a sealed archive dated thirty years ago.",
        "The gas lamps along the street dim simultaneously. Something is moving through the gas lines.",
        "The mechanical apparatus produces a result that is physically impossible. It does it again.",
        "The artefact's previous owner arrives - alive - from circumstances that suggest they should not be.",
        "The figure in the photograph from 1843 is one of the party's ancestors. This is that location.",
        "The lodge member being questioned has been dead for six months. They seem surprised you noticed.",
        "The thing being hunted has been in this room since before the party arrived and has been very patient.",
        "The silence stops. Not because noise starts - because something else that had been present stops.",
        "Two sealed letters arrive simultaneously, addressed to different party members, containing the same sentence.",
        "The entity withdraws completely. According to the Lore roll, this is considerably worse than it advancing.",
        "The witness's account is completely accurate and completely impossible and they have no idea it is either.",
        "The suspect's alibi is confirmed by three independent sources and is physically impossible to reconcile with the evidence."
      
      ],
      victory: [
        "Expose the Lodge's activities to the right authority.",
        "Contain or banish the entity before the ritual completes.",
        "Recover the evidence before it's destroyed.",
        "Identify the true culprit before the wrong person is convicted.",
        "Perform the counter-ritual within the available window.",
        "Survive the night with enough to publish.",
        "Expose the Lodge's activities before the evidence is destroyed.",
        "Perform the counter-ritual within the available exchanges.",
        "Get the testimony in writing before the witness is relocated.",
        "Banish the entity before the ritual window closes.",
        "Retrieve the document before it reaches the Fire.",
        "Identify the true culprit before the wrong person hangs.",
        "Survive the night with everything needed to publish.",
        "Seal the breach before whatever is using it comes fully through.",
        "Convince the Commissioner with evidence he cannot deny.",
        "Break the Society's hold on the institution without scandal.",
        "Recover the full ritual text before the Lodge activates the secondary site across the city.",
        "Extract the patient from the sanatorium before the doctor arrives with the permanent committal papers.",
        "Contain the creature before the press photographer develops the plate already exposed.",
        "Prevent the medium from completing the final invocation without destroying her in the process.",
        "Expose the Lodge's Parliamentary candidate before the by-election closes tomorrow morning.",
        "Find and seal the secondary manifestation point before the primary entity uses it to step fully through.",
        "Keep the evidence intact through the night until the sympathetic magistrate arrives at first light.",
        "Get the witness to the one journalist who cannot be bought before the Lodge's solicitors serve the injunction.",
        "Close the working before the solstice window - success makes it another generation's problem, not tonight's.",
        "Survive the entity's focused attention for seven exchanges while the binding completes itself."
      ],
      defeat: [
        "The ritual completes; the consequences are permanent.",
        "The evidence is destroyed or discredited.",
        "A party member is taken as a sacrifice or vessel.",
        "The Lodge's identity remains secret and the investigators are discredited.",
        "The wrong person pays for the right crime.",
        "What was banished returns, better informed.",
        "The ritual completes at a secondary site the party didn't know existed. The effects are immediate and structural.",
        "The wrong person hangs - publicly, at dawn, attended by the true culprit.",
        "The medium is consumed. What wears her face is considerably more communicative than before.",
        "The Lodge's Parliamentary candidate is elected. The legislation enabling the Lodge follows within the month.",
        "The witness disappears - no body, no note, no traceable agent. The Lodge's cleanest work.",
        "The entity is not banished. It is invited in, by someone in the room the party trusted.",
        "The investigator is committed. The Lodge has four alienist signatures and the evidence is in the asylum now.",
        "The creature escapes into the city. It knows the party's names, faces, and home addresses.",
        "The veil tears rather than mends. What comes through knows it has entered a permanent opening.",
        "The document is published. The dynasty it destroys was protecting something that now has no protection."
      ],

      seed_locations: [
        "A gentlemen's club whose private rooms have been sealed following a member's death",
        "A foreign embassy with an outbreak of incidents the ambassador cannot explain to the Foreign Office",
        "A railway terminus where the night train always arrives on time but the passengers are never the same ones who boarded",
        "A hospital wing that was closed for renovation and has not been opened - the renovation never began",
        "A private library collection being catalogued for the first time in a century",
        "A lodging house where four of the last seven residents have died of unrelated causes",
        "An archaeological dig in the home counties that has produced anachronistic results",
        "A factory whose night shift has reported consistent anomalies to the management, who have said nothing",
        "A country house whose previous owners all sold it quickly and refused to discuss why",
        "A medium's regular séance circle that has recently begun producing verifiable information",
        "A church crypt that has been locked since a nineteenth-century renovation and is making sounds",
        "The office of a recently deceased colonial administrator whose files are being requested by three different departments",
        "A dockside warehouse district where disappearances have been attributed to press gangs - except there haven't been press gangs in forty years",
        "A photography studio that has been producing images of things not present during the sitting",
        "An underground network connecting several properties in a district that doesn't appear on any official plans",
        "A telegraph exchange whose night operators have been transcribing messages sent from no registered station",
        "A newly opened Underground station whose deepest excavation has produced results the engineers are not discussing",
        "A private sanatorium whose intake records show the same patient name recurring at ten-year intervals since 1801",
        "A theatrical magician's estate being auctioned - the cataloguer has found a room not on any floor plan",
        "A colonial shipping warehouse holding uncatalogued material from three expeditions whose crews all died returning",
        "A university natural philosophy department whose apparatus has produced anomalous results since the dean's death",
        "The home of a deceased alienist whose files contain three hundred cases of identical delusion",
        "A Masonic hall beneath a church that predates both institutions and whose original purpose neither can identify",
        "A paper mill producing broadsheets that contain information nobody at the mill claims to have set in type",
        "A music hall whose leading performer has not visibly aged in eleven years and whose management will not be asked about it",
        "An abandoned workhouse converted to flats where the previous residents left simultaneously one November night leaving everything behind",
        "A natural history museum's collection of items removed from public display after three separate proximity incidents",
        "A country estate whose groundskeeper maintains a second set of records no one has asked about and everyone has avoided",
        "A clockmaker's shop in the City where every clock shows a different time and the owner's repairs are always correct regardless",
        "A river police holding room containing objects recovered from the Thames that match no reported loss and no known origin"
      ],

      seed_complications: [
        "A constable has been assigned to investigate the same matter from a completely different angle",
        "The key witness is a member of a class that will not be believed without corroboration",
        "The evidence is genuine but its chain of custody is impossible to establish",
        "A society with an interest in the matter has sent a representative who is being helpful in a suspicious way",
        "The location becomes unavailable in forty-eight hours - legally or otherwise",
        "The suspect has protection at a level that makes direct accusation catastrophic",
        "An earlier investigator looked into this and vanished - their notes are the only lead left",
        "The supernatural element is undeniable to everyone present but would not survive a court of law",
        "A member of the party has a personal connection to the case they have not disclosed",
        "The case connects to a much larger matter that dangerous people have a stake in remaining unresolved",
        "The official version is wrong in a way that exposes official negligence - and that may be why it's wrong",
        "The entity involved is cooperating with the investigation - for its own reasons",
        "The medical evidence points to a cause of death that is not officially possible",
        "The document that proves everything belongs to someone who does not know they have it",
        "A second death occurs while the investigation is in progress - same method, different victim",
        "The Lodge has an injunction from a sympathetic judge making direct investigation of the primary location legally dangerous",
        "The key informant is currently committed to the private sanatorium and cannot communicate in terms anyone will accept",
        "A Fleet Street journalist has the same lead and a three-day head start and will print regardless of consequences",
        "The entity made contact with one party member before the investigation began - they haven't mentioned it",
        "The primary location falls in two jurisdictions whose authorities refuse to cooperate on procedural principle",
        "The witness is a colonial subject whose testimony requires a translator who is also a Lodge member",
        "A member of the Royal Society has arrived to officially debunk the investigation and has institutional standing to do so",
        "The ritual requires the same lunar window as the investigation - the same night, the same location, the same hours",
        "The party's patron has a personal stake in the outcome they disclosed as merely academic interest",
        "The supernatural evidence is genuine and would not survive five minutes of cross-examination"
      
      ],
      seed_objectives: [
        "Identify the cause of deaths that the authorities have attributed to natural causes and been wrong about",
        "Recover a document before it is used to destroy someone who does not deserve it",
        "Prevent a supernatural entity from reaching a specific location before the equinox",
        "Expose a conspiracy within an institution that polices itself and resents outside attention",
        "Protect a witness long enough for them to give testimony that cannot be suppressed",
        "Locate a missing person whose disappearance connects to something nobody wants found",
        "Determine whether the medium's communications are genuine - and if so, what they mean",
        "Stop a ritual that has been in preparation for longer than anyone living has been aware of it",
        "Acquire proof of something that everyone knows is true but cannot be officially acknowledged",
        "Prevent a publication that would trigger consequences out of proportion to its contents",
        "Find what is in the sealed wing before the estate is sold and the contents dispersed",
        "Identify the Lodge member who is informing to the authorities - and why",
        "Persuade a scientific institution to take seriously evidence they are professionally obligated to dismiss",
        "Recover something that was taken from a colonial subject who has every right to want it returned",
        "Prevent a Parliamentary bill that would give the Lodge legal authority over a specific class of investigation",
        "Locate the second volume of the working - the first was found on a dead man's desk, the second was taken before the party arrived",
        "Identify the entity's point of ingress and seal it before the solstice concentrates its presence to critical mass",
        "Extract the medium from the Lodge's custody before she is used to complete the summoning willingly or otherwise",
        "Find the third artefact before the Lodge does - they have the first two and are not being careful with either",
        "Prove a death was not self-inflicted before the inquest concludes - the Lodge's preferred verdict benefits them considerably",
        "Return the creature to its origin before its continued presence in London becomes publicly undeniable",
        "Identify which of three lodge members carries the entity's mark - all three are present at tonight's society dinner",
        "Destroy the compact before it automatically transfers to the next generation - the heir is eleven years old",
        "Recover the colonial prisoner before they are incorporated into a ritual they have not consented to"
      
      ],
      compel_situations: [
        "Your reputation in this district means the constable defers to you - which creates a responsibility",
        "The evidence is inadmissible and you obtained it in a way that cannot be explained",
        "The supernatural element you have witnessed is undeniable to you and completely deniable to the inquiry",
        "A social obligation requires your presence at an event that conflicts with the investigation",
        "The person you need information from is owed a social debt by someone you cannot afford to offend",
        "Your medical or scientific training makes you the only credible voice - which means you bear the consequences",
        "The entity has made contact with you specifically - ignoring it has costs",
        "Your knowledge of the occult marks you as a suspect in exactly this kind of case",
        "The information would destroy an innocent person's reputation while saving someone more culpable",
        "Your social class grants access - and makes your presence there conspicuous",
        "The case requires you to act outside your official standing - without official standing, this is illegal",
        "The document in your possession is genuine and its provenance would not survive scrutiny",
        "The person you're protecting knows more than they've told you and has decided now is the time",
        "The Lodge's interests and the investigation's interests have diverged - you are in both",
        "Your published work has made you the authority on exactly the thing you need to deny knowing about",
        "The society has sent someone to observe you - politely, professionally, and non-negotiably",
        "The ritual site is on private property belonging to someone with the law firmly on their side",
        "Your accent, clothes, or bearing places you outside the social world where the evidence is",
        "The ghost is trying to tell you something that would implicate someone currently in the room",
        "The colonial artefact responds to you in a way that requires an explanation you cannot give",
        "The entity has a legitimate grievance against someone present and has selected you as the appropriate authority to hear it",
        "Your published monograph on exactly this phenomenon means your denial of the supernatural is now publicly documented",
        "The Lodge has invoked your initiation oath - you are technically obligated to attend and cannot demonstrate the invocation was improper",
        "The creature is following you specifically - which means it is not following anyone else - which means someone is being protected by your exposure",
        "Your medical examination of the victim is the official record and it contains a conclusion you did not write",
        "The entity can only be engaged through a medium - the only available medium is the primary suspect",
        "Your social class means you are the only person in this room whose testimony carries weight with that inquiry",
        "The information you hold would destroy the investigation by resolving it too publicly before the Lodge knows you have it",
        "The witness will only speak to someone who can demonstrate genuine occult knowledge - yours is demonstrably sufficient",
        "The doctor's death has created a vacancy in the Lodge's inner circle and your name is apparently already proposed",
        "The artefact requires a carrier with your specific sensitivity and there is no time to find an alternative",
        "The patient in the asylum has been communicating something through symptoms the alienist has been recording without realising what they have",
        "The binding requires a willing witness with no taint of the Lodge - you are currently the only person in the room who qualifies",
        "Your reputation for absolute discretion means you have been told something that changes everything and cannot be repeated",
        "The journalist has found you and is offering you the press as a weapon - the Lodge will know the moment you use it"
      
      ],
      compel_consequences: [
        "The responsibility cannot be discharged without compromising the investigation's independence",
        "The evidence must be used through unofficial channels - with all the risk that entails",
        "The inquiry concludes what it was going to conclude - your testimony is noted and ignored",
        "The social obligation costs you the window in which the evidence was available",
        "The debt is honoured - and the person you needed information from now knows your interest",
        "The official position commits you to a conclusion you do not privately hold",
        "The entity has added something to your situation - a piece of knowledge with a price",
        "The investigation now has a suspect - you - which redirects official attention inconveniently",
        "The innocent person's reputation is preserved - the culpable one goes free this time",
        "Your presence is noted in a record that will be read by someone who will draw conclusions",
        "The action achieves its goal - but outside official standing, so the goal cannot be officially celebrated",
        "The provenance question surfaces at a critical moment and the document's value is questioned",
        "The fuller truth changes the investigation's direction - and someone has a strong interest in the old direction",
        "You are now operating in both interests simultaneously - and they are about to conflict",
        "The published expertise makes you a target for parties who have a stake in the ignorance remaining",
        "The entity's grievance is acknowledged - it will now cooperate on exactly its own terms and no others",
        "The monograph is cited in the inquiry - your own published scepticism is entered as the official position",
        "You attend the Lodge meeting and learn why it was called with your direction in mind",
        "You are protected by the creature's attention - and everything it does while following you instead of them is your responsibility",
        "The medical record stands - the truth must now travel through you unofficially or not travel at all",
        "The medium cooperates with the interrogation - the suspect now knows you know, and knows you used them",
        "Your testimony gives the inquiry something solid - and places your name in the official record of a case you wanted handled quietly",
        "The investigation resolves without scandal - the Lodge is not warned - and the party is now the only external record anything happened",
        "The witness speaks - your demonstrated occult knowledge becomes a matter of official record in the hearing",
        "The vacancy is filled by someone the Lodge preferred - because you hesitated, and the hesitation was observed"
      
      ],
      challenge_types: [
        {name: "Criminal Investigation", desc: "Build a case against a suspect before evidence is destroyed, lost, or the suspect escapes", primary: "Investigate and Contacts", opposing: "The suspect's resources and the institutional resistance to an embarrassing conclusion", success: "Case made; confrontation productive", failure: "Case incomplete - the suspect walks, or walks into a better position"},
        {name: "Séance and Supernatural Inquiry", desc: "Communicate with or contain a supernatural presence before it acts on its apparent intention", primary: "Lore and Empathy", opposing: "The entity's own agenda and the scepticism of any witnesses whose testimony matters", success: "Communication established; situation clarified or resolved", failure: "The entity acts - and the situation gets considerably harder to explain"},
        {name: "Society Infiltration", desc: "Enter a closed society, lodge, or institution and extract specific information without being identified", primary: "Deceive and Rapport", opposing: "The society's internal security and the members' loyalty to each other", success: "Information extracted; cover maintained", failure: "Identified - and the society now knows the information is of interest to outsiders"},
        {name: "Parliamentary Manoeuvre", desc: "Achieve a legislative or official outcome in the face of organised opposition", primary: "Rapport and Contacts", opposing: "Opposing political faction's resources and the ordinary resistance of institutions", success: "Measure passes; influence extended", failure: "Measure fails - and the opposition has learned something about your methods"},
        {name: "Colonial Mystery", desc: "Investigate an anomaly imported from the Empire's territories before it achieves whatever it was brought here to achieve", primary: "Lore and Investigate", opposing: "The anomaly's nature, the ignorance of everyone involved, and those with an interest in it not being found", success: "Anomaly identified and contained or resolved", failure: "Anomaly achieves its purpose - with consequences that will not be fully apparent until later"},
        {name: "Dockside Pursuit", desc: "Track someone or something through the city's least cooperative districts before it disappears", primary: "Investigate and Athletics", opposing: "The district's opacity, the quarry's knowledge of it, and the constabulary's unhelpfulness", success: "Quarry located or objective retrieved", failure: "Trail goes cold - you know more than before but not enough"},
        {name: "Medical Emergency", desc: "Diagnose and treat something whose cause is not in any standard text, under time pressure", primary: "Lore and Empathy", opposing: "The condition's progression and the patient's unwillingness or inability to provide useful information", success: "Patient stabilised; cause identified", failure: "Patient survives but the cause is still unknown - and apparently still present"},
        {name: "Society Scandal Containment", desc: "Manage a scandal that threatens someone's reputation before it reaches the newspapers", primary: "Contacts and Deceive", opposing: "The information's momentum and the parties who benefit from it spreading", success: "Scandal contained; relationships preserved", failure: "Story runs - the damage is done, though how bad depends on what you managed to control"},
        {name: "Psychic Assault Resistance", desc: "Hold the mind intact against a sustained attempt by an entity to reshape, occupy, or extract from it", primary: "Will and Lore", opposing: "The entity's accumulated knowledge of the target's specific vulnerabilities and its patience", success: "Contact broken; mind intact; some information exchanged at a price the party chose", failure: "Partial occupation - the entity has something now, and so does its host, and neither is fully separable"},
        {name: "Conspiracy Map", desc: "Trace the full structure of a secret operation before its architects realise the thread is being pulled", primary: "Investigate and Contacts", opposing: "Institutional resistance, the conspiracy's active countermeasures, and the sheer size of what is being concealed", success: "Structure identified; key vulnerabilities located; exposure possible on chosen terms", failure: "The architects are aware - they begin removing evidence and personnel before anything can be acted on"},
        {name: "Lodge Tribunal", desc: "Navigate an internal Lodge judicial proceeding where the rules are the Lodge's and the judge is Lodge too", primary: "Rapport and Lore", opposing: "The Lodge's procedural control of evidence and the tribunal's interest in a particular outcome", success: "Ruling acceptable; standing maintained or restored; the Lodge's internal legitimacy is used against it", failure: "Expelled, condemned, or worse - the Lodge's internal ruling carries weight in circles the party cannot ignore"},
        {name: "The Body Horror Case", desc: "Diagnose and treat a condition that no medical text describes and whose cause is still present and active", primary: "Lore and Empathy", opposing: "The condition's progression, its resistance to conventional treatment, and its apparent intentionality", success: "Patient stabilised; cause identified and isolated; the condition's source now knows it has been found", failure: "Patient survives - the cause is unidentified and still present and has learned something about who was looking"}
      ],

      consequence_mild: [
        "Grazed by the Revolver Shot",
        "Shaken by the Supernatural Encounter",
        "Winded from the Chase Across Rooftops",
        "Cut by Broken Glass from the Forced Entry",
        "Rattled by the Séance's Unexpected Success",
        "Bruised from the Constable's Truncheon",
        "Cloak Torn, Dignity Compromised",
        "Ankle Turned on the Wet Cobblestones",
        "Hands Shaking from the Chemical Compound",
        "Ears Still Ringing from the Explosion",
        "Face Cut, Reputation Intact for Now",
        "Momentarily Overcome by the Supernatural Presence",
        "Chemical Compound Burned Into the Palm - Stings, Smells Wrong, Fades in Days",
        "The Entity Made Eye Contact - Rattled in a Way That Doesn't Describe Correctly",
        "Twisted Knee on the Cellar Stairs",
        "Cloak Caught and Torn on the Wrought Iron Railing",
        "Bitten - by Something That Left an Unusual Mark That Has Not Faded",
        "Splashed by the Ritual Compound - Stings Where It Hit"
      
      ],
      consequence_moderate: [
        "Bullet Wound, Dressed but Not Treated Properly",
        "Rattled to the Core by What I Witnessed",
        "Concussed from the Blow to the Head",
        "Hand Burned by the Alchemical Compound",
        "Leg Wound Requiring a Cane Indefinitely",
        "Reputation Damaged by Public Association",
        "Partial Possession - Something Is Still in There",
        "Rib Cracked by the Assailant's Kick",
        "The Sight Has Opened and Won't Close Easily",
        "Evidence Destroyed in the Struggle",
        "Source Burned - That Contact Will Not Speak Again",
        "Shoulder Dislocated by the Constable's Grip",
        "Something Has Moved Into the Peripheral Vision and Will Not Entirely Leave",
        "The Psychic Contact Left a Residue - Waking Visions, Irregular Onset",
        "Knife Wound Across the Forearm - Deep and Poorly Stitched in the Dark",
        "Fell From the Balcony - Ribs Involved, Mobility Materially Affected",
        "Cover Story Burned by the Inspector's Unsolicited Testimony",
        "The Veil Opened in Front of Others - Multiple Witnesses Exist and Are Uncontrolled"
      
      ],
      consequence_severe: [
        "Shot Through and Through - Needs Surgery",
        "Mind Touched by the Eldritch Entity - Recurring Visions Now",
        "Identity Exposed - Cover is Permanently Blown",
        "Leg Injury Requiring Months of Recovery",
        "Wanted by the Lodge for What Was Witnessed",
        "Partial Possession Has Left Permanent Marks",
        "Key Evidence Destroyed - The Case May Be Unwinnable",
        "Public Scandal - The Name Is Now a Liability",
        "Partial Psychic Possession - Controlled, Intermittent, and Demonstrably Deteriorating",
        "Known to the Lodge as an Active Threat - the File Is Open and Has Been Actioned",
        "The Oath Was Broken in Front of Witnesses - the Society Has Formal Legal Standing to Respond",
        "The Vault Left a Mark on the Soul - the Priest Was Consulted and Says It Is Permanent"
      
      ],
      consequence_contexts: [
        "during the confrontation in the study",
        "when the ritual went further than anticipated",
        "fleeing through the fog with the constables behind",
        "during the séance that summoned something uninvited",
        "taking a blow meant to silence the investigation permanently",
        "when the society's internal enforcers arrived",
        "during the attempt to seal the entity before the ritual window closed",
        "when the Lodge's enforcer arrived with professional thoroughness and no hesitation",
        "in the séance room at the moment the veil opened fully",
        "stepping between the witness and what was coming for them"
      
      ],
      faction_name_prefix: [
        "The Veiled",
        "The Crimson",
        "The Golden",
        "The Obsidian",
        "The Silver",
        "The Hollow",
        "The Ancient",
        "The Hidden",
        "The Black",
        "The Pale",
        "The Twilight",
        "The Sovereign",
        "The Eternal",
        "The Inverted",
        "The Compound"
      
      ],
      faction_name_suffix: [
        "Lodge",
        "Society",
        "Circle",
        "Brotherhood",
        "Compact",
        "Order",
        "Institute",
        "Assembly",
        "Covenant",
        "Syndicate",
        "Accord",
        "Inquisition",
        "Chapter",
        "Tribunal",
        "Foundation"
      
      ],
      faction_goals: [
        "Open a permanent conduit between this world and the one beyond the veil",
        "Expose and destroy the rival lodge before their ritual reaches completion",
        "Seize control of the three artefacts needed to complete the Restoration Working",
        "Suppress all public knowledge of the supernatural for another generation",
        "Install their candidate in the position of Home Secretary",
        "Locate and secure the Black Library before the church burns it",
        "Complete the summoning that the original lodge abandoned a century ago",
        "Discredit the investigating journalist before the story reaches the printer",
        "Restore the old compact between the Lodge and the entity before the current generation misunderstands the terms further",
        "Place a controlled medium in every major hospital and asylum in the city within the year",
        "Identify and catalogue every individual in London with natural occult sensitivity before a rival Lodge does",
        "Prevent the publication of the Ashmore Papers - the first person to read them completely has not recovered"
      
      ],
      faction_methods: [
        "Operating through legitimate learned societies as public face",
        "Blackmailing society members using evidence gathered during initiation",
        "Controlling access to classified Home Office files through a planted official",
        "Using séances as intelligence-gathering operations",
        "Recruiting from the bereaved and desperate who come seeking the deceased",
        "Manipulating the press through a sympathetic newspaper proprietor",
        "Assassinating inconvenient investigators using staged accidents",
        "Maintaining a network of servants placed in target households",
        "Funding charitable institutions that give them access to the vulnerable and the desperate",
        "Embedding trained sensitives in newspaper editorial offices to monitor and shape coverage of relevant incidents",
        "Maintaining a network of sympathetic coroners who return appropriate verdicts and ask nothing further",
        "Operating a legitimate antiquarian book trade as distribution infrastructure for restricted occult texts"
      
      ],
      faction_weaknesses: [
        "A key ritual component was stolen and they don't yet know by whom",
        "One of their members has been approached by a rival lodge and is considering it",
        "Their Home Office contact is under internal investigation",
        "The entity they've been communing with has started lying to them",
        "A journalist has correctly identified three of their front organisations",
        "Their most powerful working requires a willing participant they haven't found",
        "The founding document that grants their authority is a forgery",
        "Two senior members died recently under circumstances that are suspicious to insiders",
        "Their primary entity has begun lying to them in small ways that suggest it is pursuing a subsidiary agenda",
        "The Lodge's best operative has been running a personal investigation that the Lodge leadership has not sanctioned",
        "Their Parliamentary patron is three months from a scandal that they know about and cannot prevent",
        "Two of their founding documents were forged - the forger is now a problem because they know and want something"
      
      ],
      faction_face_roles: [
        "the Grandmaster known only by title",
        "the society hostess whose salon is their primary intelligence network",
        "the disgraced surgeon who handles the occult operations",
        "the Home Office official who provides access and deniability",
        "the medium who channels the entity and is starting to be consumed by it",
        "the archivist who maintains the lodge's records and knows where every body is",
        "the colonial administrator who provides both material and deniability for operations outside domestic law",
        "the private press proprietor who ensures the right stories appear and the wrong ones do not",
        "the committed alienist whose diagnoses are professionally sound and occasionally strategically applied",
        "the entity's current preferred vessel - cooperative, well-placed, and beginning to have preferences of their own"
      
      ],
      complication_types: [
        "Supernatural shift",
        "Uninvited arrival",
        "Aspect change",
        "Evidence threat",
        "Deadline introduced",
        "Collateral threat",
        "Authority response",
        "Occult activation"
      ],
      complication_aspects: [
        "The Constables Are Coming - Someone Called Them",
        "A Witness Saw More Than They Should Have",
        "The Entity Has Become Aware of the Investigation",
        "Evidence Is Being Destroyed Right Now in Another Room",
        "The Séance Has Gone Further Than Intended",
        "The Real Target Has Already Left - We're in the Wrong Place",
        "The Gas Has Leaked - Naked Flame Is Now a Catastrophic Risk",
        "Society Is Watching - What Happens Here Will Have Consequences",
        "The Ritual Has Reached the Point of No Interruption",
        "A Third Party Claims Ownership of What We Came For",
        "The Informant Was a Plant - Everything They Said Is Reversed",
        "The Fog Is Unnaturally Thick - Something Is Using It",
        "The Entity Is Now Specifically Aware of This Investigation and Has Begun Countermeasures",
        "The Ritual Has Entered Its Final Phase - What Was Possible an Hour Ago Is No Longer",
        "A Second Lodge Has Arrived With a Competing Claim on What We Came For",
        "The Building Itself Has Begun to Respond - the Architecture Is Not Neutral",
        "Something That Was Sealed Has Been Opened From the Inside While We Were Occupied",
        "The Fog Is Supernaturally Dense and Is Demonstrably Moving Against the Wind"
      
      ],
      complication_arrivals: [
        "A Scotland Yard inspector with a warrant and bad timing",
        "A rival lodge member who wants the same thing for opposite reasons",
        "A journalist who has been following the investigation from a distance",
        "The client, present when they should not be, knowing things they shouldn't",
        "A creature from beyond the veil that followed the investigation in",
        "A society figure whose presence here cannot be explained innocently",
        "A colonial official with documents suggesting legal authority over the supernatural entity in question",
        "A representative of a second lodge who is technically an ally and practically more complicated than an enemy",
        "The entity's previous host - free, lucid, and carrying significant information about what it wants",
        "A genuinely sympathetic alienist who will commit the wrong party member for entirely valid medical reasons"
      
      ],
      complication_env: [
        "Gas light fails - the scene shifts entirely to shadow and candlelight",
        "The entity's presence warps the space - geometry becomes unreliable",
        "Heavy fog rolls in from the Thames, cutting visibility to yards",
        "A fire starts in the lower floor - evacuation now competes with the objective",
        "A spiritual presence manifests physically - it can be interacted with",
        "The chemical compound in the laboratory becomes unstable - immediately",
        "The entity's presence warps local time - exchanges feel the same length but clocks have moved differently",
        "The building begins actively responding - doors seal, passages reroute, the architecture is cooperating with something",
        "The ley convergence reaches maximum - every occult aspect in every zone costs one less fate point to invoke",
        "A second ritual begins in an adjacent location - its interference with the current scene is immediate and physical"
      
      ],
      backstory_questions: [
        "What did you witness that the official record says didn't happen, and who told you to forget it?",
        "What is the one society connection you maintain that you'd be embarrassed to explain to the group?",
        "What case or investigation did you abandon, and why does it still follow you?",
        "What is the nature of your gift or affliction, and who else in your family had it?",
        "What do you know about the lodge that its members don't know you know?",
        "What did you have to become to survive something that should have killed you?",
        "Who owes you a favour significant enough to risk their reputation, and what will you ask for?",
        "What professional reputation do you maintain that is mostly fabricated, and who helped you build it?",
        "What is the one variety of supernatural phenomenon you've never encountered, and why does that matter to you?",
        "What did you take from a scene that you didn't put in your report, and what have you done with it?",
        "What does the thing beyond the veil want from you specifically, and how long have you been ignoring it?",
        "What is the name in your file at Scotland Yard, and what is the entry's status?",
        "What does your family believe you do for a living, and how do you maintain that fiction?",
        "What would make you go to the press, and what is stopping you right now?",
        "What do you understand about the occult that your colleagues would call impossible?",
        "What entity first made contact with you, and what has it asked for that you have still not given?",
        "What colonial act committed in the Empire's name did you witness that no official record acknowledges?",
        "What have you sacrificed to the thing you are pursuing that you have reclassified as a professional decision?",
        "What did the séance show you about your own future that you have since been attempting to make untrue?",
        "What were you doing the night the gap in your memory begins, and who else was present at the start of it?",
        "What publication or report did you suppress because the truth was structurally worse than the silence?",
        "What is the one variety of entity you have encountered and refused to classify, and what does that choice protect?",
        "What does the Lodge know about you that your allies do not, and what did the Lodge give you for telling it?",
        "What would your colleagues say if they knew the full method by which you obtained your most important result?",
        "What is the nature of the family gift, and which relative do you most resemble in that specific regard?"
      
      ],
      backstory_hooks: [
        "You all received an invitation to the same address. None of you sent it to the others.",
        "The body was found at a location each of you had been investigating independently. The constables arrived at the same time you did.",
        "You share a common informant who is now dead. Their last message named all of you.",
        "You were each hired by a different client for what is demonstrably the same case.",
        "Each of you carries the same scar in the same location. None of you have the same memory of acquiring it.",
        "A sealed envelope addressed to each of you was deposited with the same Holborn solicitor six months ago, to be opened when all recipients were present together. This is the first time.",
        "You have each been visited by the same figure in waking hours over the past month. You have each been treating the visits as private. They were not dreams and they were not private.",
        "The Lodge's black register contains an entry for each of you. The entries predate your awareness of anything occult by between three and twelve years each."
      
      ],
      backstory_relationship: "Go around the group. Each player names one other PC and answers: *What investigation brought you into contact, and what did you each see that you haven't fully shared?* Then each player names a second PC and answers: *What do you know about their connection to the supernatural that they've underplayed to the group?*",
    },
  };

// ═══════════════════════════════════════════════════════════════════════
// CONTENT EXPANSION - v9.1 (The Gaslight Chronicles)
// Inspirations: Penny Dreadful, From Hell, The Prestige, Lovecraft, Stoker
// ═══════════════════════════════════════════════════════════════════════
(function(){var t=CAMPAIGNS.victorian.tables;

t.opposition = t.opposition.concat([
  {name:"Resurrected Thing", type:"major", aspects:["Assembled From Multiple Donors","The Stitches Are Visible and Fresh","Stronger Than Any Living Person"], skills:[{name:"Fight",r:5},{name:"Physique",r:5},{name:"Will",r:2}], stress:6, stunt:"First taken-out result inflicts a severe consequence instead. Only a second taken-out removes it.", qty:1},
  {name:"Mesmerist", type:"major", aspects:["The Voice Is the Weapon","You Didn't Notice You Were Obeying","Society Protects Its Own"], skills:[{name:"Provoke",r:5},{name:"Rapport",r:4},{name:"Deceive",r:4},{name:"Will",r:3}], stress:3, stunt:"+2 to Create Advantage using mental suggestion on targets who have been socially introduced.", qty:1},
  {name:"Dockyard Thug", type:"minor", aspects:["Muscle for Hire, No Questions"], skills:[{name:"Fight",r:2},{name:"Physique",r:2}], stress:2, stunt:null, qty:4},
  {name:"The Thing in the Mirror", type:"major", aspects:["Only Visible in Reflections","Knows Your Deepest Shame","Can Reach Through Any Reflective Surface"], skills:[{name:"Provoke",r:5},{name:"Stealth",r:4},{name:"Fight",r:3},{name:"Deceive",r:3}], stress:4, stunt:"Attacks from any zone containing a mirror, window, or still water. Covering reflective surfaces removes this ability.", qty:1},
  {name:"Opium Den Guard", type:"minor", aspects:["Loyalty Measured in Doses"], skills:[{name:"Fight",r:2},{name:"Notice",r:1}], stress:1, stunt:null, qty:3},
  {name:"Clockwork Sentinel", type:"minor", aspects:["Wound Tight and Precise"], skills:[{name:"Fight",r:3},{name:"Notice",r:3}], stress:3, stunt:null, qty:2},
  {name:"The Collector", type:"major", aspects:["Every Specimen Has a Price","The Collection Is Never Complete","Rooms That Don't Exist on the Plans"], skills:[{name:"Resources",r:5},{name:"Lore",r:4},{name:"Investigate",r:3},{name:"Contacts",r:3}], stress:3, stunt:"Once per scene, reveal a pre-prepared trap in any room of the house - situation aspect with two free invokes.", qty:1},
  {name:"Feral Street Children - Pack", type:"minor", aspects:["Knows Every Alley and Sewer Grate"], skills:[{name:"Stealth",r:3},{name:"Athletics",r:3},{name:"Notice",r:2}], stress:1, stunt:null, qty:5},
  {name:"Alienist With Questionable Methods", type:"major", aspects:["Licensed to Commit Anyone","The Asylum Is a Fortress","The Ends Justify the Means"], skills:[{name:"Academics",r:5},{name:"Will",r:4},{name:"Provoke",r:3},{name:"Resources",r:3}], stress:3, stunt:"Can have a PC committed with a successful Academics overcome vs. their Rapport. Escape requires a full challenge.", qty:1},
  {name:"Automaton Servant", type:"minor", aspects:["Follows Its Last Instruction Literally"], skills:[{name:"Fight",r:2},{name:"Physique",r:3}], stress:3, stunt:null, qty:2},
  {name:"The Hound of the Fog", type:"major", aspects:["Size of a Horse, Made of Shadow","Only Appears in Thick Fog","The Master's Will Made Flesh"], skills:[{name:"Fight",r:5},{name:"Athletics",r:4},{name:"Stealth",r:4},{name:"Notice",r:3}], stress:5, stunt:"In fog zones, gains +2 to attacks and cannot be targeted by Shoot.", qty:1},
]);

t.zones = t.zones.concat([
  ["The Operating Theatre - Gallery Above", "Observed From All Angles", "The audience sees everything; the patient sees nothing."],
  ["The Sewers Beneath the Cathedral", "Ancient and Vast", "Navigation without a map requires Investigate; acoustics betray movement."],
  ["The Greenhouse - Tropical Heat", "Glass Walls, Dense Foliage", "Glass shatters for escape; the plants may not all be botanical."],
  ["The Dockside Warehouse - After Hours", "Crates Stacked to the Rafters", "Dense cover; the river is one wall away; rats everywhere."],
]);

t.complication_arrivals = t.complication_arrivals.concat([
  "A Bow Street Runner with a personal grudge and questionable jurisdiction",
  "A spiritualist medium who senses the entity and begins channeling involuntarily",
  "A correspondent from The Times investigating the same case from the public angle",
  "A child who has been watching the house for days and knows the patterns inside",
  "A mortician's assistant who has noticed anomalies in the recent bodies",
  "A retired army surgeon who recognizes the wounds from the colonies",
  "A lamplighter who works this street nightly and has seen things he can't explain",
  "A society lady whose missing servant was last seen entering this building",
]);

t.complication_env = t.complication_env.concat([
  "The séance circle activates without participants - candles reignite by themselves",
  "The Thames rises - the basement floods with cold, filthy water",
  "A gas main ruptures - open flame is now suicidal",
  "The building settles - doors won't fit frames, windows crack, geometry shifts",
  "Church bells ring at the wrong hour - every dog in the district howls",
  "Temperature drops sharply - breath mists, water freezes, something draws heat from the room",
  "London particular fog - a yellow-brown wall making lanterns useless past arm's length",
  "The clockwork in the walls runs backward - time feels wrong in this room",
]);

t.backstory_hooks = t.backstory_hooks.concat([
  "You each received a mourning card for someone who isn't dead yet. The date is next week.",
  "One of you inherited a house from an uncle who never existed. The deed is real. The uncle is in no records.",
  "A photograph shows all of you in a room none of you recognize. It's dated twenty years before you were born.",
  "You all experienced the same nightmare last Tuesday. Compared notes. The details match exactly.",
  "The dead woman's diary mentions each of you by name. You didn't know her. She knew you intimately.",
  "A locked box was delivered to each of you on the same morning. Each contains a different bone. Together they form a hand.",
  "The patient in Ward 9 speaks only prophecy. Last week the prophecy named your addresses.",
]);

t.consequence_contexts = t.consequence_contexts.concat([
  "when the entity's touch left frost burns across the forearm",
  "inhaling gas from the ruptured main",
  "falling through the rotted floor into the cellar",
  "when the mesmerist's suggestion cracked something inside your mind",
  "the bite wound that doesn't heal and won't stop weeping",
  "blinded by flash powder in the photographer's trap",
  "burns from the alchemical compound that ignited during the struggle",
  "the cold that settled into the bones after the séance and hasn't left",
]);

t.faction_face_roles = t.faction_face_roles.concat([
  "the antiquarian whose collection contains items that should have been destroyed",
  "the cemetery groundskeeper who has noticed graves disturbed from below",
  "the music hall performer whose act conceals genuine supernatural ability",
  "the dock foreman who controls what arrives on the ships and what gets reported",
  "the reformist MP whose legislation threatens the faction's operations",
  "the asylum attendant who is more prisoner than employee",
  "the forger who produces documents, identities, and provenances",
  "the retired inspector removed from a case that was never officially closed",
]);

t.complication_types = t.complication_types.concat([
  "Haunting - the supernatural intrudes, uninvited and uncontrollable",
  "Scandal - the investigation threatens someone powerful enough to end careers",
  "Madness - exposure to the truth pushes someone toward a mental consequence",
  "Evidence Destroyed - a critical piece of the puzzle has been deliberately eliminated",
]);

t.current_issues = t.current_issues.concat([
  "The Whitechapel Resurgence - Bodies appearing again, wounds matching no known weapon. Scotland Yard won't acknowledge the pattern.",
  "The Spiritist Craze - Half of London's drawing rooms host séances. Most are frauds. The real ones have stopped being entertaining.",
]);

t.impending_issues = t.impending_issues.concat([
  "The Great Exhibition of the Impossible - A collector assembles artifacts from every occult tradition for public display. They should never be in the same building.",
  "The Threshold Year - Multiple prophetic traditions converge on the same date. The astronomical alignment hasn't occurred in four thousand years.",
]);

})();

// ═══════════════════════════════════════════════════════════════════════
// AUDIT FIXES - v9.2 (The Gaslight Chronicles)
// Class-structure compels, supernatural constraints, London-specific tone,
// issue normalization
// ═══════════════════════════════════════════════════════════════════════
(function(){var t=CAMPAIGNS.victorian.tables;

// Class-structure compels
t.compel_situations = t.compel_situations.concat([
  "Your accent marks you. The drawing room adjusts its posture. You are being assessed.",
  "The servant recognises you from before you had the title. Their silence has a price.",
  "This is a conversation between gentlemen. You are not, technically, a gentleman. Everyone knows it.",
  "The evidence you need is in a house where people like you enter through the servants' entrance.",
  "Your working-class origins are visible here, and the people you need to impress have noticed.",
]);

// Supernatural constraints
t.compel_situations = t.compel_situations.concat([
  "The entity cannot enter without invitation - but it has become very good at obtaining invitations.",
  "The supernatural operates by rules older than English. Breaking them has consequences. Following them has different consequences.",
  "The entity remembers everyone who has looked at it. You looked. That was enough.",
]);

// London-specific scene tone adjectives
t.scene_tone.v.VtAdj = t.scene_tone.v.VtAdj.concat([
  "lamplit", "coal-smoke thick", "pre-dawn grey", "Thames-damp",
  "gin-soaked", "fog-muffled", "gaslit-flickering", "river-mist drifting",
  "chimney-stack grey", "omnibus-crowded", "sermon-adjacent", "cholera-memory heavy",
]);

// Issue normalization
['current_issues','impending_issues'].forEach(function(k){
  for(var i=t[k].length-1;i>=0;i--){
    if(typeof t[k][i]==='string'){
      var p=t[k][i].split(' - ');
      t[k][i]={name:p[0],desc:p.slice(1).join(' - ')};
    }
  }
});

})();
