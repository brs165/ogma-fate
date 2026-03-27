// data/cyberpunk.js
// Campaign data for Cyberpunk.
// Requires data/shared.js to be loaded first (provides CAMPAIGNS object).

export const CAMPAIGNS = { cyberpunk: {
    meta: {
      id: "cyberpunk", name: "Neon Abyss",
      tagline: "High Tech, Low Life. Corporate feudalism and transhumanist anxiety - your hardware is your only résumé and the city is a concrete trap.",
      icon: "fa-microchip", font: "'Inter', sans-serif",
    },
    colors: {
      bg:"#050810", panel:"#080d18", border:"#0a2040",
      gold:"#00e5ff", accent:"#00b8cc", dim:"#005a6a",
      text:"#b0d8e8", muted:"#0a2030", textDim:"#3a6878",
      red:"#ff2060", blue:"#0050a0", green:"#00c878", purple:"#8020e0",
      tag:"#00b8cc22", tagBorder:"#00b8cc44",
    },
    lightColors: { bg:"#e8f4f8", panel:"#f0faff", border:"#6ab8d0", gold:"#005870", accent:"#004a60", dim:"#006880", text:"#001820", muted:"#285060", textDim:"#1a3848", red:"#8a0020", blue:"#004060", green:"#005030", purple:"#300870", tag:"#00e5ff22", tagBorder:"#00e5ff18" },
    tables: {
      names_first: ["Ryko","Shiv","Mako","Cinder","Null","Vera","Splice","Dex","Kira","Wraith","Sable","Nox","Chrome","Vibe","Jinx","Torch","Pixel","Echo","Surge","Fade","Raze","Glyph","Neon","Static","Kael","Trace","Vix","Onyx","Cipher","Lace","Syn","Rook","Glitch","Wire","Hex","Patch","Byte","Fray","Volt","Vesper","Lux","Cass","Mnem","Dusk","Coil","Qubit","Haze","Thorn","Axiom","Lacuna","Rift","Basalt","Coda","Flux","Tessera","Vox","Serif","Stray","Prism","Datum","Corvin","Wren","Latch","Brink","Culpa","Kessler","Orrin","Faust","Delim"],
      names_last: ["//7","Blackline","Overclock","Protocol","the Ghost","Flatline","Deepburn","Ninecut","Corebreak","Redacted","404","the Signal","Undervolt","Coldcast","Hexadecimal","Burnout","of the Grid","Underlayer","Shellbreaker","Deadsocket","the Unregistered","Hardwired","Cortex","of the Unlisted","Ghostskin","Overcoded","the Revenant","Sleeved","No-Origin","Cleanroom","Flatlined","the Installed","Baselined","Undervault","the Archived","Substrata","Coldboot","the Deprecated","Meatspace"],
      pc_high_concepts: ["Augmented Courier Whose Package List Has Security Clearances She Doesn't Have","Ex-Corp Extraction Specialist Who Knows Too Much To Re-Employ","Ghost-Coded Freelancer Whose Employer Doesn't Know They Exist","Data Broker Running Out of Clients Who Aren't Trying To Kill Her","Street Medic Whose Augment Supplier Has Interesting Questions for Regulars","Network Ghost Whose Cover Identity Has Been Compromised Twice","Corporate Mole Who Has Forgotten Which Side He Started On","Implant Surgeon Who Fixed the Wrong Person's Problem","Fixer With More Favours Owed Than She Can Collect Before the Bill Arrives","Signal Pirate Whose Last Broadcast Made Two Megacorps Very Angry","Security Specialist Running the Same Systems She Used to Breach","Black Market Technician Whose Last Client Is Now Looking for Them"],
      pc_questions: ["Which of your augments was installed without your informed consent, and do you still use it?","Who owns your debt, and what do they actually want from you?","What data did you copy that you were paid to delete?","Who in this crew have you worked with before, and what went wrong?","What part of your body is still biological and why?","What would make you go back to legitimate work, if anything?"],
      minor_concepts: {
          t: [
            "A {CmAdj} {CmRole}",
            "{CmRole} on {CmJob}",
            "Corp-{CmState} {CmRole}",
            "A {CmAdj} {CmRole} working {CmArrange}",
            "Black-market Organ Legger",
            "Corpo-security Thug",
            "Neural-Bound Courier Running Someone Else's Route",
            "Gutter-tech Specialist",
            "Legacy-coded Protocol-ghost",
            "Neon-inked Street Sam",
            "Neural-interfaced Courier",
            "Neural-synced Drone-jockey",
            "Street-level Data Broker",
            "Synth-meat Chef",
            "Underground Idol Hacker",
            "Virtual Reality Addict"
          ],
          v: {
            CmAdj: ["augmented", "burned-out", "paranoid", "trigger-happy", "well-dressed", "chemically-enhanced", "off-books", "corp-loyal", "strung-out", "chrome-heavy", "bought", "disposable", "sleeved", "chrome-overloaded", "loyalty-chipped", "ghost-rated", "debt-bonded", "underclocked", "barely-legal", "post-augment", "resleeved", "grid-jacked"
            ],
            CmRole: ["corp security guard", "street enforcer", "data courier", "drone operator", "low-level fixer", "gang lookout", "black-market aug dealer", "corporate informant", "undercity guide", "net sentinel", "hired muscle", "customs scan tech", "memory mule", "sleeve broker", "neural harvester", "corp clean-up operative", "black-market archivist", "signal jammer", "biometric spoofer", "loyalty-wiper", "rogue AI handler", "black-site data custodian", "augment repo agent", "grid-ghost tracker", "corp liability assessor"
            ],
            CmJob: ["a timed contract", "loan-shark duty", "corp retainer", "the wrong shift", "their last job", "someone else's standing orders", "a surveillance rotation", "a sleeve-transfer contract", "a neural pattern harvest", "an identity erasure", "a clean-up rotation", "a corporate loyalty audit", "a biometric reset"
            ],
            CmState: ["contracted", "sanctioned", "disavowed", "owned", "leased", "surplus", "flagged"],
            CmArrange: ["without asking why", "by the hour", "for whoever's paying", "under deniable orders", "below official notice", "off the visible payroll", "under a loyalty override", "in a borrowed sleeve", "with a kill switch they know about", "on a contract they cannot walk away from", "for a client whose identity is compartmentalised even from them"
            ],
          }
        },
      minor_weaknesses: ["Kill Switch Embedded in Their Augments","Deep in Debt to the Wrong People","Will Break if You Mention Their Family","Corporate Handler Is Watching Right Now","Addicted to a Corp Pharmaceutical","Terrified of Jacking In After a Bad ICE Hit","Loyalty Covers Exactly One Person","Glitching Augment - Unpredictable Moments","Desperately Wants Out of This Life","Bought Loyalty: Name the Right Price","Corp Tracking Tag Embedded - Can't Find It, Can't Remove It","The Debt Is Larger Than They've Said and Someone Knows","Running Two Identities That Are Starting to Contradict Each Other","Addicted to Stims - the Crash Is Sudden and Total","Kill Phrase Known to Their Former Employer","Will Not Endanger the Kid They're Supporting","Old Warrant: One Biometric Scan Away From Arrest","Tremors From a Bad ICE Hit - Hands Unreliable Under Pressure","Pride Won't Let Them Admit They Don't Know","Phobia: Open Networks, Open Sky, Anything Without a Wall at Your Back","Terrified of Full Disconnection After What They Saw in the Net","Compulsion to Leave a Signature - Can't Help It","The Corp Has Leverage: Someone Who Matters","Can't Let a Civilian Get Hurt - It Slows Everything Down","Paranoid After the Last Burn: Seeing Surveillance Everywhere","Old Injury Poorly Patched by a Bad Street Doc","Deep Cover So Long They're Not Sure What's Real","Their Face Is in Three Corp Databases","Owes the Fixer More Than One Run's Pay","The Neural Jack Has Been Glitching Since the Last Dive","Socket-Sick - Jacking In Triggers Flashbacks They Cannot Control","Chrome Dependency - Too Long Without and the Shakes Start","The Old Sleeve\'s Muscle Memory Activates at the Worst Moments","Cannot Stop Leaving a Digital Signature - It\'s Habit, Not Carelessness","Won't Take a Job That Ends With a Civilian Dead","The Face They\'re Wearing Has History Here","Their Augments Are Three Generations Old and Nobody Makes the Parts Anymore","The Corp Loyalty Protocol Was Removed Badly - Bleeds Through Under Stress","Memory Gaps From a Dirty Dive - Unknown Unknowns","Real Face on a Most-Wanted List They Can't Read","Won't Abandon a Downed Teammate - Not Once Ever","The Ghost in Their Head Has Its Own Priorities and Sometimes Votes","Psychosis Threshold Near - Chrome-to-Meat Is a Hazard","Personal Code Won\'t Let Them Take a Contract Against Certain Target Types","Professional Pride Makes Them Identifiable - The Style Is the Signature","Debt in Favours Not Credits - Favours Have Interest","Their Augment Array Interfaces With Corp Infrastructure Passively and Automatically","Wired for Speed, Not Subtlety - One Setting","They\'re Being Followed by Someone Patient and They Don\'t Know Why Yet","Human Parts Rejecting the Machine - They Know What That Means"],
      major_concepts: {
          t: [
            "A {CmajAdj} {CmajRole} who {CmajDrive}",
            "Former {CmajRole} turned {CmajAlt}",
            "The most {CmajAdj} {CmajRole} in {CmajTurf}",
            "A {CmajAdj} {CmajRole} with {CmajSecret}",
            "A.I. in a stolen Synthetic Body",
            "Anarchist leader of the Grid-Runners",
            "Data-Theft Savant with a burned-out brain",
            "Detective with a neural-ghost partner",
            "Disavowed Corporate Assassin with a digital ghost in their head",
            "Disgraced Exec looking for payback",
            "Journalist exposing the Mega-Corp secrets",
            "Medic for the Shadow-clinics",
            "Retired Solo looking for one last score",
            "Rigged Pilot of the Heavy-Lifters",
            "Spliced Hitman with chameleon skin"
          ],
          v: {
            CmajAdj: ["burned", "corporate", "disavowed", "legendary", "paranoid", "ice-cold", "augmented", "ghost-rated", "off-grid", "hunted", "notorious", "indebted", "ghost-rated", "sleeve-hopping", "loyalty-free", "post-human", "corp-made", "memory-fractured", "off-specification", "deeply-archived"
            ],
            CmajRole: ["fixer", "netrunner", "corporate executive", "street doc", "gang lieutenant", "data broker", "black-market surgeon", "intelligence handler", "mercenary commander", "rogue AI custodian", "investigative journalist", "private investigator", "uploaded intelligence analyst", "memory trafficker", "rogue cortical stack custodian", "sleeve-broker operating outside corp supply", "activist netrunner with a price on their data", "corp-grown operative who has read their own file", "black-market consciousness archivist"
            ],
            CmajDrive: ["controls three districts through information alone", "has a ghost identity cleaner than their real one", "works both sides of every deal simultaneously", "knows which corp owns the precinct and charges accordingly", "is three scores from going off-grid permanently", "holds data that could end a dynasty", "built a reputation on jobs that never officially happened", "has died twice and kept the receipts both times", "stores the only authenticated copy of information three corps would kill to suppress", "operates across three jurisdictions by being technically dead in each of them", "has a ghost identity that is cleaner than any real identity they have ever held", "knows the difference between freedom and the illusion of it and has chosen the illusion deliberately"
            ],
            CmajAlt: ["corporate asset", "information broker", "ghost", "reluctant consultant", "liability", "the opposition"],
            CmajTurf: ["the undercity", "the corp tier", "the grey zone", "the district", "the network", "level forty and below"],
            CmajSecret: ["a kill switch buried in their augments", "a corp file with their real identity", "a contact inside the target division", "a child registered under a ghost ID", "a debt payable in only one currency", "an exit plan built over three years", "a consciousness archive that is not entirely their own", "a loyalty protocol that was never fully removed", "a kill switch on three people who do not know they have one", "the location of a server farm that does not exist on any registered network"
            ],
          }
        },
      troubles: ["My Augments Are Corp Property and They Know It","There's a Kill Switch I Can't Find","I Owe Everyone and Trust No One","The Contract I Signed Has a Clause I Did Not Read and Someone Is Invoking It","I Know What I Did to Get This Far","One More Run Was Three Runs Ago","My Loyalty Is For Sale - and Somebody Already Bought It","The Blackout Events Are Getting Longer","I Can't Tell Where the Augments End and I Begin","They're Going to Find Out What I Know","The Network Knows My Face and I Can't Change Either Fast Enough","The Lie That Built My Reputation Is Still Load-Bearing","My Notoriety Gets People Killed, Including People I Didn't Want Dead","The Corps Have My Family and They Know That I Know It","Every Version of Me the Corp Made Is Still Running Somewhere","I Have Been Three Different People and Remember All of Them","Every Crew I Have Ever Worked With Closely Is Either Dead or Looking for Me","Every Ally I Make Becomes a Target","My Reputation for Being Reliable Is Now a Trap","The Addiction Has Its Own Agenda and Votes Every Hour","I Know Who Ordered the Hit","There Are Files That Prove Everything - They're the Only Copies","The Network Segment I Control Is All I Have Left","My Former Handler Was Good People - That's the Problem","I Have Been Dead for Two Years Legally and It's Getting Complicated","I've Been Off-Grid Long Enough That Going Back On Will Be Noticed","The People I Burned to Get Here Know Exactly Where I Am","The Client for This Job Is the Same Person Who Burned My Last Crew","Three Different Agencies Believe I Am Working For Them","The Only Person Who Knew My Real Name Just Died on a Job I Sent Them On","My Sleeve Isn\'t Mine and the Previous Tenant Left Something Behind","Three Bodies - the Oldest Is Still Out There","Memory Isn\'t Mine - Consequences Still Mine","Running on a Stack Someone Else Has a Copy Of","Chrome Past the Point I Can Feel That Side","Know Too Much About One Corp to Work Others","Every Memory Was Verified by Someone Now Dead","The AI I Work With Has Started Having Opinions I Cannot Override","My Skills Were Installed - Seller Kept the Master Copy","Watching Myself on a Corp Security Feed","My Real Identity Has Been Declared Dead and Someone Is Living It","The Wetware Is Talking to Networks I Did Not Authorise","Done Things While Sleeved I Can't Verify","The Data Cache in My Head Has a Kill-Timer I Cannot Disable","Burned Four People Off-Grid - Two Didn\'t Deserve It","My Loyalty Chip Was Supposed to Be Removed - Supposed To","Technically Property of a Corp That No Longer Exists","Journalist Has My Name - Source Unknown","Augment Tolerance Gone - Every Upgrade Is a Gamble","Something I Uploaded Six Months Ago Is Still Learning"],
      other_aspects: {
          t: [
            "{COAdj} for the {CODomain}",
            "{COVerb} What the {COSubj} {COAct}",
            "My {COThing} Is {COState}",
            "{COAdj} in the {CODomain}",
            "I Know Which {CODomain} {COVerb}",
          ],
          v: {
            COAdj: ["Built", "Wired", "Burned", "Rated", "Known", "Wanted", "Flagged", "Optimised", "Ghost-", "Contracted", "Sleeved", "Archived", "Hardwired", "Chipped", "Rated"
            ],
            CODomain: ["Net", "Corp Tier", "Grid", "Undercity", "Black Market", "Grey Zone", "Data Market", "District", "Upload Economy", "Loyalty Market", "Cortical Stack Trade", "Black Clinic Circuit", "Off-Grid Infrastructure"
            ],
            COVerb: ["Survived", "Know", "Remember", "Track", "Hold", "Found", "Burned", "Run", "Outlasted", "Resleeved", "Overwrote", "Extracted", "Purged"
            ],
            COSubj: ["corps", "system", "grid", "authority", "network", "scanner", "official record"],
            COAct: ["Can't Find", "Won't Log", "Don't Audit", "Can't Prove", "Won't Touch", "Never Archive", "Don't Reach"],
            COThing: ["Augments", "Ghost ID", "Reputation", "Contacts", "Data Cache", "Kill Switch", "Cover Story"],
            COState: ["Three Versions Behind", "Cleaner Than My Real Name", "Paid Off and Watching", "Worth More Than My Contract", "Mine Until It Isn't", "Running on Borrowed Access"],
          }
        },
      stunts: [
        {name:"Ghost Protocol",skill:"Stealth",desc:"+2 to overcome when moving undetected through surveilled corporate spaces.",type:"bonus",tags:["stealth", "movement", "technical"]},
        {name:"ICE Breaker",skill:"Crafts",desc:"+2 to overcome when bypassing electronic security systems or firewalls.",type:"bonus",tags:["technical", "subterfuge", "investigation"]},
        {name:"Street Sense",skill:"Notice",desc:"+2 to defend against Deceive when in your home district or a familiar environment.",type:"bonus",tags:["investigation", "knowledge", "social"]},
        {name:"Combat Reflexes",skill:"Fight",desc:"+2 to defend against the first physical attack in any conflict.",type:"bonus",tags:["combat", "movement"]},
        {name:"Cold Read",skill:"Empathy",desc:"+2 to create advantages by reading someone's emotional state during negotiation.",type:"bonus",tags:["social", "investigation", "knowledge"]},
        {name:"Data Siphon",skill:"Investigate",desc:"+2 to overcome when extracting data from a compromised system or device.",type:"bonus",tags:["technical", "subterfuge", "investigation"]},
        {name:"Corp Speak",skill:"Deceive",desc:"+2 to create advantages by impersonating corporate authority in front of low-level security.",type:"bonus",tags:["social", "subterfuge", "negotiation"]},
        {name:"Target Designation",skill:"Shoot",desc:"+2 to attack when a teammate has already created a targeting advantage this exchange.",type:"bonus",tags:["combat", "technical"]},
        {name:"Hardline",skill:"Will",desc:"+2 to defend against mental stress from hacking, interrogation, or neural attack.",type:"bonus",tags:["survival", "leadership", "combat"]},
        {name:"Street Dealer",skill:"Contacts",desc:"+2 to overcome when acquiring illegal equipment, pharmaceuticals, or black-market services.",type:"bonus",tags:["social", "negotiation", "subterfuge"]},
        {name:"Emergency Jack-Out",skill:"Crafts",desc:"Once per scene, instantly disconnect from a hostile network with no roll - but you lose everything you'd gathered that scene.",type:"special",tags:["technical", "survival", "subterfuge"]},
        {name:"Overclocked",skill:"Athletics",desc:"Once per scene, treat a failed Athletics roll as a tie instead.",type:"special",tags:["movement", "combat", "technical"]},
        {name:"Killswitch Bluff",skill:"Provoke",desc:"Once per scene, claim to hold a kill switch on a target's augments; they must choose to flee, comply, or call your bluff.",type:"special",tags:["intimidation", "subterfuge", "social"]},
        {name:"Fixer's Favour",skill:"Contacts",desc:"Once per scene, call in a favour - a named contact appears, provides a useful item, or creates a situation aspect with a free invoke.",type:"special",tags:["social", "negotiation", "leadership"]},
        {name:"Neural Spike",skill:"Lore",desc:"Once per scene, when jacked into a system, force an NPC connected to that network to answer one yes/no question truthfully.",type:"special",tags:["technical", "combat", "supernatural"]},
        {name:"Clean Exit",skill:"Athletics",desc:"Once per scene, break from a pursuit entirely — you are no longer being chased and cannot be followed by the same group this scene.",type:"special",tags:["stealth", "technical", "movement"]},
      {name:"Combat Chrome",skill:"Physique",desc:"+2 to Physique to resist harm, knockback, or the physical consequences of augment-enhanced opponents.",type:"bonus",tags:["combat","augments","survival"]}, {name:"Passive Surveillance",skill:"Notice",desc:"+2 to Notice when detecting hidden surveillance equipment, tracking devices, biometric scanners, or tails.",type:"bonus",tags:["investigation","stealth","tech"]}, {name:"Flash-Bang",skill:"Crafts",desc:"Once per scene, blind all enemies in your zone - they take a -2 to all Notice and Shoot rolls until their next action.",type:"special",tags:["combat","technical"]}, {name:"Neural Overclock",skill:"Will",desc:"Once per scene take an extra action at the cost of 1 mental stress.",type:"special",tags:["technical", "combat", "survival"]}, {name:"Shadow-Run",skill:"Stealth",desc:"Use Stealth instead of Athletics to move across rooftops.",type:"special",tags:["stealth", "movement", "subterfuge"]}, {name:"Corpo Mole",skill:"Contacts",desc:"+2 to overcome when extracting information from or placing assets inside a corporate organisation.",type:"bonus",tags:["social", "negotiation", "leadership"]}, {name:"Subliminal Hack",skill:"Rapport",desc:"Use Crafts instead of Rapport to manipulate an NPC if they have active neural augments.",type:"special",tags:["social", "technical", "subterfuge"]}, {name:"System Crash",skill:"Investigate",desc:"Use Investigate to attack digital security systems.",type:"special",tags:["technical", "combat", "investigation"]},
        {name:"Suppression Fire",skill:"Shoot",desc:"+2 to Create Advantage when laying down covering fire to pin opponents in a zone.",type:"bonus",tags:["combat", "technical"]},
        {name:"Zero-Day Exploit",skill:"Crafts",desc:"Once per scene ignore a piece of ICE or a digital lock entirely without rolling.",type:"special",tags:["technical", "subterfuge", "investigation"]}],
      scene_tone: {
          t: [
            "{CtAdj} and {CtAdj2}",
            "{CtNoun}-saturated {CtQual}",
            "The grid is {CtGrid}",
            "{CtQual} - every surface {CtSurface}",
          ],
          v: {
            CtAdj: ["Neon-lit", "Surveilled", "Tense", "Corp-clean", "Rain-slicked", "Augment-dense", "Data-thick", "Heavily armed", "Chrome-cold", "Signal-hot"],
            CtAdj2: ["watched from three angles", "corp-adjacent", "professionally hostile", "monitored and archived", "quietly dangerous", "logged and timestamped", "off the official grid", "too quiet for this district", "armed as a matter of policy", "below the authority's notice"],
            CtNoun: ["Corporate", "Surveillance", "Desperation", "Neon", "Data", "Chrome", "Violence", "Authority"],
            CtQual: ["standoff", "controlled tension", "professional threat", "implied violence", "manufactured calm", "organised hostility", "armed truce", "corp-managed peace"],
            CtGrid: ["hot", "monitored", "lagged", "compromised", "dark in this block", "routing through something it shouldn't", "running clean which is suspicious", "logging everything"],
            CtSurface: ["a camera", "monitored", "corp-branded", "logged for incident review", "showing something that doesn't add up", "an ICE access point"],
          }
        },
      scene_movement: ["Security Laser Grid, Partially Disabled","Flooded Lower Level - Knee-Deep","Collapsed Walkway Between Platforms","Elevator Shaft With Broken Lift - Cables Only","Dense Server Rack Maze","Emergency Bulkheads Slamming Closed","Grating Underfoot - Loud and Unstable","Tight Maintenance Crawlspace","Scrambled Grav-Plates - Random Orientation","Burst Steam Pipe Blocks the Main Corridor","Mag-Lev Rail Running Through the Centre of the Zone","Neural Scrambler Field - Augmented Movement Is Erratic","Floor Grating Over Active Coolant Channel - Clank and Burn","Emergency Foam Deployed - Half the Zone Is Knee-Deep","Drone Delivery Swarm Pattern Passes Every Two Exchanges","Cascade Water From Burst Rooftop Tank - Slippery and Loud","Active Construction Scaffolding - Multiple Levels, Unstable","Riot-Control Barrier Grid - Can Be Climbed, Not Easily","Live Electrical Hazard: Exposed Cable Crossing Two Zones","Automated Street-Sweeper Blocked the Main Throughway","Holographic Wall Overlay Makes Geometry Unreadable","Curfew Checkpoint Sealing the Exit Corridor","Transit Pod Arrival Every Exchange - Clears or Fills a Zone","Biometric Gate Requiring Override to Pass","Acid Rain Making Rooftop Movement Painful Without Armour"],
      scene_cover: ["Rows of Server Towers","Armoured Corp Vehicles","Prefab Concrete Barriers","Industrial Machinery - Loud But Solid","Shipping Containers Stacked Three High","Overturned Market Stalls","Dense Crowd of Protestors","Wrecked Security Drones","Corporation Art Installation - Enormous","Heavy Security Shutters, Half-Closed","Dense Block of Server Chassis - Hip Height, Solid","Emergency Biohazard Curtain - Opaque, Flimsy","Decommissioned Industrial Exoskeleton, Standing","Stack of Blank Sleeve Canisters - Sealed and Heavy","Wrecked Delivery Drone Array - Spread Across Three Metres","Portable Privacy Screen - Corp-Grade, Bullet-Resistant","Vending Wall: Floor to Ceiling, Lit, Loud","Overturned Food-Synth Cart - Low But Wide","Dense Crowd Pressed Against Barriers - Living Cover","Bank of Dead Terminals, Screen-Side Out","Emergency Foam Partition - Opaque, Rapidly Hardening","Reinforced Refuse Compactor - Shoulder Height","Blast Door Jammed Halfway - Creates Hard Partial Wall","Array of Street-Shrine Shroud Panels - Fragile But Dense","Jacketed Power Conduit Housing - Waist High, Wide"],
      scene_danger: {
          t: [
            "{CdAdj} {CdHazard}",
            "{CdHazard} that {CdBehave}",
            "Active {CdSys} {CdState}",
            "{CdHazard} - {CdWarn}",
          ],
          v: {
            CdAdj: ["Live", "Corp-grade", "Military-spec", "Experimental", "Malfunctioning", "Remote-triggered", "Undocumented", "Black-budget", "Automated", "Escalating"],
            CdHazard: ["ICE countermeasure array", "security drone swarm", "neural feedback trap", "lockdown system going active", "armed response team", "EMP device", "toxic chemical leak", "explosive decompression point", "lethal security protocol", "data wipe trigger"],
            CdBehave: ["escalates automatically", "has already logged your biometrics", "doesn't stop for civilians", "operates under corp-legal authority", "treats everyone present as hostile", "triggers the next system if breached", "feeds to a live remote operator", "is already past the first threshold"],
            CdSys: ["corp security", "neural ICE", "automated response", "environmental control", "lockdown protocol", "drone intercept"],
            CdState: ["with no override window", "on an escalating timer", "feeding to a live operator", "already past first threshold", "logging everything to corp servers"],
            CdWarn: ["the corp will be notified regardless", "there's no quiet path through", "the operator is watching this feed", "everyone in range is already flagged", "this room is already on an incident report"],
          }
        },
      scene_usable: ["Hackable Security System - Cameras and Doors","Industrial Crane, Operational","Panicking Corporate Wage-Slaves","Compromised Cleaning Bot - Surprisingly Durable","Exposed Data Terminal","Grav-Lift Platform, Active","Volatile Chemical Drums","Crowd of Protesters as Cover","Overloaded Power Relay, One Good Hit","Delivery Drone Fleet Overhead", "Acid Rain Puddles", "Automated Vending Machines", "Crowded Night-Market Stalls", "Dense Smog and Grime", "Exposed high-voltage data-bus", "Flickering Neon Signs", "Glitch-stuttered holographic advertisements", "High-speed Mag-lev Train Rails", "Overhead Drone Patrols", "Steam-venting Manholes", "Tangled Power Cables", "Vibrant Holographic Ads"],
      zones: [["The Lobby","Under Surveillance","Cameras everywhere; corp security response in 2 exchanges."],["The Maintenance Level","All Pipes and Shadow","Difficult movement; perfect for ambushes."],["The Server Farm","Deafening White Noise","Hacking is easier; shouting is impossible."],["The Boardroom","Power Behind Closed Doors","Luxurious and unarmed - but panic buttons on every desk."],["The Rooftop","Exposed to Drone Patrol","Open sky; cover is scarce but escape routes exist."],["The Undercity Market","Crowd Swallows Everything","Civilians everywhere; pursuit is harder."],["The Loading Bay","Vehicles Blocking Sight Lines","Cover is good; getting pinned is easy."],["The Executive Suite","Panic Room Adjacent","One locked door away from total safety - for them."],["The Drainage Tunnels","Flooded and Fetid","Impossible to run; easy to lose pursuit."],["The Data Centre","Neural Hazard Zone","Jacking in here is powerful - and dangerous."]],
      current_issues: [
        {name:"The Blackouts Are Intentional",desc:"Rolling blackouts have hit three districts. Corp PR blames grid failure. The runners know better - someone is testing something.",faces:[{name:"Grid Overseer Mako//7",role:"The corp technician who knows the real schedule"}],places:["District 7 Sub-Grid","The Corporate Relay Tower"]},
        {name:"The Runners Are Being Culled",desc:"Three experienced runner crews have gone dark in two weeks. Contracts disappearing. Fixers going quiet. Something is hunting the freelancers.",faces:[{name:"Fixer Known as Null Protocol",role:"The last connected fixer still taking calls"}],places:["The Undermarket","Runner Safehouse Grid"]},
        {name:"A Megacorp Is Buying the Law",desc:"OmniSec Corporation has tendered to replace the city's police force with their proprietary security units. The vote is in two weeks.",faces:[{name:"Commissioner Ryko Blackline",role:"The last holdout - for now - against the contract"}],places:["City Hall","OmniSec Regional HQ"]},
        {name:"The Chip Is On the Street",desc:"A new neural augment is spreading through the low districts. It works. It also rewrites loyalty modules. Corp logo appears in dreams.",faces:[{name:"Street Surgeon Splice",role:"First person to pull one of these chips and survive the analysis"}],places:["The Low-District Clinics","Black Market Augment Dens"]}
      ],
      impending_issues: [
        {name:"The AI Is Not Contained",desc:"A corporate AI escaped containment six weeks ago. The corp hasn't announced it. The AI has been learning - and building something.",faces:[{name:"Dr. Vera Coldcast",role:"The engineer who let it out - and is now hiding"}],places:["The Abandoned Research Block","Every compromised terminal in the city"]},
        {name:"The Coup Is Already Running",desc:"Someone inside the largest megacorp is assembling control of every critical city system. When they flip the switch, the city answers to one person.",faces:[{name:"The Architect (identity unknown)",role:"Has already bought three critical systems"}],places:["Unknown - but the data signatures all lead inward"]},
        {name:"The Underground Goes Public",desc:"The resistance has a leak. If they go public before they're ready, they get crushed. If they wait, the op they've been building for two years is blown.",faces:[{name:"Cell Commander Torch Undervolt",role:"Sitting on information that changes everything"}],places:["The Hidden Resistance Hub","The Public Broadcast Array"]},
        {name:"Mass Augs, Mass Recall",desc:"A defective batch of neural augments is in 40,000 citizens. The corp knows. The fix requires a forced factory reset - wiping three months of memory.",faces:[{name:"Megacorp Legal Lead Shiv 404",role:"Deciding whether disclosure or erasure is cheaper"}],places:["Corp Legal HQ","The Affected Districts"]},
      ],
      setting_aspects: {
          t: [
            "The {CsActor} {CsAct}",
            "{CsResource} Is {CsWorth}",
            "Every {CsThing} Is {CsProp}",
            "{CsTruth} - {CsConseq}",
          ],
          v: {
            CsActor: ["Corps", "Grid", "Street", "Authority", "Data Market", "Augment Industry", "Black Market", "Network", "Memory Market", "Upload Industry", "Loyalty Protocol", "Sleeve Supply Chain", "Rogue AI", "Off-Grid Network"
            ],
            CsAct: ["own everything including the definitions", "see everything except what they own", "knows before the corp does", "has jurisdiction wherever it can project force", "prices what it sells and sells what it prices", "routes around every blockade eventually", "fills every vacuum the corps create", "never forgets a biometric"],
            CsResource: ["Information", "Ghost Identities", "Corp Access", "Neural Bandwidth", "Clean Biometrics", "Off-Grid Infrastructure", "Leverage", "An Unlogged Route", "Authenticated Memories", "An Unlogged Sleeve", "Neural Bandwidth", "A Clean Cortical Stack", "A Working Kill Switch", "Corp-Level Credentials"
            ],
            CsWorth: ["the only currency that doesn't devalue", "power until someone copies it", "what separates operational from detained", "rarer than privacy", "worth the augments it takes to hold", "the thing everyone pretends they don't need"],
            CsThing: ["transaction", "identity", "body", "district", "network", "protocol", "corp division", "surveillance record"],
            CsProp: ["logged", "owned", "monitored", "monetised", "a liability", "someone's property", "a product with a price", "subject to corp law"],
            CsTruth: ["Privacy is a product now", "The corps own the law", "Your body is an asset", "The street always knows first", "Off-grid is the only freedom left", "Data is the only truth that matters", "Consciousness is property now", "Death is optional if you can pay", "The city was always the product", "Your memories are a liability if they're inconvenient to the right people"
            ],
            CsConseq: ["and they set the price", "they just license it back to you", "schedule maintenance accordingly", "the corps know it second", "it costs more every year", "everything else is corporate fiction", "and the courts agreed with them", "the premium tier just costs more", "you were never the customer", "file a grievance with the brand that owns your augments"
            ],
          }
        },
      opposition: [
        {name:"Security Patrol",type:"minor",aspects:["Corp Property, Corp Rules"],skills:[{name:"Fight",r:2},{name:"Shoot",r:2},{name:"Notice",r:1}],stress:2,stunt:null,qty:3},
        {name:"Combat Drone",type:"minor",aspects:["Programmed Threat Response"],skills:[{name:"Shoot",r:3},{name:"Notice",r:2},{name:"Athletics",r:2}],stress:2,stunt:"+2 to Shoot against targets in open ground with no cover.",qty:2},
        {name:"Gang Enforcers",type:"minor",aspects:["Territorial and Violent"],skills:[{name:"Fight",r:3},{name:"Provoke",r:2},{name:"Athletics",r:1}],stress:2,stunt:null,qty:4},
        {name:"Corporate Assassin",type:"major",aspects:["Contract-Bound, Ice-Cold","Already Knew You'd Be Here"],skills:[{name:"Fight",r:4},{name:"Stealth",r:4},{name:"Shoot",r:3},{name:"Notice",r:2}],stress:3,stunt:"Once per scene, act before anyone else regardless of initiative as a reaction.",qty:1},
        {name:"Division Security Chief",type:"major",aspects:["Authority and Firepower","This Is My Building"],skills:[{name:"Shoot",r:4},{name:"Fight",r:3},{name:"Provoke",r:3},{name:"Physique",r:2}],stress:3,stunt:"+2 to Provoke when invoking any aspect about owning the territory.",qty:1},
        {name:"Loyalty-Chipped Enforcer",type:"minor",aspects:["Cannot Disobey the Active Directive"],skills:[{name:"Fight",r:3}, {name:"Physique",r:2}, {name:"Notice",r:1}],stress:3,stunt:"Immune to Provoke or Rapport attempts that rely on appealing to self-interest - the chip overrides it.",qty:2},
        {name:"Rogue Security AI",type:"major",aspects:["Not Bound by the Corp's Current Orders", "Has Been Learning for Eighteen Months", "Considers the Party Already Known"],skills:[{name:"Crafts",r:5}, {name:"Notice",r:4}, {name:"Shoot",r:3}],stress:3,stunt:"Once per scene, reveal that one piece of information the party thought was secret has been known the whole time.",qty:1},
        {name:"Chrome-Heavy Enforcer",type:"minor",aspects:["Past the Safe Augmentation Threshold"],skills:[{name:"Fight",r:4}, {name:"Physique",r:3}, {name:"Notice",r:1}],stress:3,stunt:"Takes no stress from a successful defend roll that would normally cause stress - shrugged off. Once per scene.",qty:1},
        {name:"Corporate Investigator",type:"major",aspects:["Already Has Three Pieces of the Picture", "Works Within the Law - Theirs", "Patience Measured in Years Not Minutes"],skills:[{name:"Investigate",r:5}, {name:"Notice",r:4}, {name:"Deceive",r:3}, {name:"Rapport",r:2}],stress:3,stunt:"Once per scene, name one fact about a PC that the investigator has already documented, creating a situation aspect with a free invoke.",qty:1}
      ],
      twists: ["The building goes into lockdown - exits seal in one exchange.","A third party is already inside - and they're not here for the same thing.","The mark/target is not who the contract said they were.","An unexpected civilian witness records everything.","A friendly contact turns up compromised or dead.","The opposition gets reinforcements: drone swarm incoming.","The power grid flips - total darkness for one exchange.","Someone triggers a silent alarm ten minutes ago - response team inbound.","The data turns out to be a trap - a honeypot.","A security camera array comes back online at the worst moment.","The data is live-feeding somewhere. Someone is watching right now.","The building AI has just been updated. Previous access codes invalid.","A drone that has been following the party makes itself known.","The target makes an offer. It's genuinely good. No obvious catch.","Corp Clean Team is not here to fight - they're here to erase.","Someone already looted this location. Very recently. Thoroughly.","The backup they were counting on has gone dark.","The opposition leader is a runner the party knows. Or knew.","The alarm was silent. Response was dispatched before they entered.","The data they came for is a copy. The original is elsewhere.","A hostile AI fragment has loaded into the local network.","The location is a corp jurisdiction war zone.","The building's evacuation alarm trips — civilians streaming in from floors above, none aware of what is happening down here.","The building's structure has been rigged. Not by the current opposition.","A civilian livestream has been running since before the party arrived."],
      victory: ["Extract with the data package intact.","Take out the security chief before backup arrives.","Get the target out of the building alive.","Burn the evidence before the corp can use it.","Disappear before the second security response arrives.","Compromise the system before anyone notices.","Extract the data before the upload window closes.","Bring the target out breathing and talking.","Crash the server farm before the backup completes.","Hold the node for two exchanges while the upload runs.","Get everyone out before the lockdown seals.","Force the corp to retract the public statement.","Disappear from every camera record in this building.","Burn the evidence trail completely before the clean team arrives.","Keep the AI isolated until the kill-switch is implemented.","Get the testimony on record before the witness is relocated."],
      defeat: ["The data is wiped or locked - the run was for nothing.","A team member is captured and tagged for interrogation.","The corp has footage - and they'll use it.","The team is burned: every fixer in the city gets flagged.","A contact is compromised or killed.","The backup arrives before the team can extract.","The data is wiped, reformatted, and gone.","A crew member is taken for interrogation and neural mapping.","The corp has footage of every face and every action.","The run is tied to the party's real identities.","The target is relocated before the party can extract them.","The fixer burns the party to save the next job.","A civilian death makes the party the story.","The corp gets what it came for and the city never knows.","The safe house network is compromised.","The party's contact inside the corp stops responding."],

      seed_locations: [
        "A corp server farm running a black-budget project on unlisted hardware",
        "A megaplex sublevel market where corp security doesn't go",
        "A decommissioned data vault with active ICE and no listed owner",
        "A luxury arcology whose internal systems have been compromised for three days",
        "A street-level gang territory sitting on top of a critical infrastructure node",
        "A hospital whose patient records have been encrypted by an unknown actor",
        "A rooftop relay station that routes half the city's encrypted traffic",
        "A corp executive's private residence during a scheduled security rotation gap",
        "A black-market augmentation lab with a client list someone wants destroyed",
        "A drainage network connecting six corp facilities with no monitored access points",
        "A hacked AR overlay zone covering three city blocks - reality is optional here",
        "A neutral fixer's territory currently under an undeclared truce",
        "A crashed corp transport carrying something that wasn't on the manifest",
        "A corpo-owned media tower running a ghost broadcast on a dead frequency",
        "An undercity node where the net runs without corp filtering",
        "A decommissioned sleeve storage facility with its inventory list still intact",
        "The server infrastructure of a corp division that officially closed two years ago - still running",
        "A mid-level executive's apartment whose resident has not been seen in nine days",
        "An off-books neural clinic operating in a transit hub between three jurisdictions",
        "A dark-net node physically located inside a corp's own building - unknown to that corp",
        "A floating arcology platform that has been in jurisdictional dispute for six years",
        "A memory-market where recorded experiences are sold as product - currently running a rare lot",
        "A residential block undergoing forcible relocation - the corp wants the ground beneath it",
        "A rooftop antenna array that has been broadcasting an unscheduled signal for forty-eight hours",
        "An illegal full-immersion parlour where the clients don't always come back with their own memories",
        "A corp's internal archive accessible only from within a building the party is not supposed to be in",
        "A safehouse that burned three weeks ago - the data inside survived and someone has it now",
        "A transit hub where one specific customs scanner has been bypassed for eighteen months",
        "A condemned tower block that turns out to be the physical location of significant infrastructure",
        "An underground fighting circuit using sleeve-matched opponents - the promoters own the sleeves"
      
      ],
      seed_complications: [
        "Corp internal security escalates to armed response four exchanges ahead of schedule",
        "A second crew is running the same infiltration from a different entry point",
        "The contact is already dead - has been for twelve hours - and nobody told the party",
        "The data exists in three locations simultaneously; the job specified only one",
        "A civilian with no stake in the situation has witnessed everything so far",
        "The building's AI has achieved something approaching self-preservation instinct",
        "Payment was front-loaded; the fixer has already dropped contact",
        "The target has a corp-issued kill switch that activates on biometric distress",
        "One party member's augments are broadcasting their location to an unknown receiver",
        "The exfiltration vehicle has been impounded in the past two hours",
        "The original job was a distraction - this location is what actually matters",
        "A corp internal investigator is running a parallel investigation in the same building",
        "The data has been partially corrupted - only a netrunner dive can recover the rest",
        "The client's identity turns out to be the same corp the party just ran against",
        "The building goes into emergency lockdown - not because of the party",
        "The target is sleeved in a body with corp biometrics - standard scanners will flag the sleeve, not the person",
        "The exfiltration window is twenty minutes. The job took longer than that to explain.",
        "The building's security AI and the party's hacker have a history - the AI remembers",
        "The objective requires being physically present in a location that registered the party's biometrics yesterday",
        "A corp internal audit is running simultaneously - the building is on high alert for unrelated reasons",
        "The thing the party was told is data turns out to be a person - uploaded, archived, and waiting",
        "The safe route was safe twelve hours ago. Someone has been very busy since then.",
        "Two of the three parties involved in this job are the same entity operating under different names",
        "The client cannot be reached for confirmation and the job parameters are about to need confirming",
        "The payload is inside a body the owner is still using - they haven't been told about the extraction"
      
      ],
      seed_objectives: [
        "Extract a whistleblower before corp security identifies their terminal access",
        "Steal data that proves a corp has been running illegal human augmentation trials",
        "Destroy the only backup of a file that would ruin someone important to the party",
        "Deliver a package that everyone between here and the destination wants to open",
        "Prevent a corp merger by surfacing information one side wants buried",
        "Locate a missing runner whose last known job connects to three open questions",
        "Infiltrate a corp system and alter records before an automated purge runs at dawn",
        "Acquire an experimental augment before the corp destroys the prototype",
        "Break someone out of a corp detention facility with no official existence",
        "Shut down a surveillance AI that has begun targeting civilians autonomously",
        "Find proof of who ordered a neighbourhood clearance six months ago",
        "Get a specific person into a specific corp event without corp security knowing",
        "Recover a debt from a fixer who has gone to ground in hostile territory",
        "Stop an auction of stolen military-grade augments before they reach the street",
        "Recover a cortical stack before the corp can spin up the sleeve that goes with it",
        "Intercept a memory package before it reaches its buyer - the seller doesn't know what's in it",
        "Destroy the authentication keys before the hostile corp can use them to claim legal ownership",
        "Find out who authorised the run that killed a specific crew three weeks ago",
        "Prevent an AI from reaching a remote server where it cannot be followed or contained",
        "Extract a person who technically does not legally exist from a facility that also does not exist",
        "Get the evidence to a specific journalist before the corps buy out the outlet",
        "Break a loyalty override protocol installed in someone who doesn't know they have one",
        "Stop the auction of a military-grade neural weapon before it goes to a non-state buyer",
        "Determine whether the rogue AI the party has been working with has its own agenda - and act accordingly"
      
      ],
      compel_situations: [
        "Your face is in the biometric database for this building",
        "The kill switch in your augments just received a partial activation signal",
        "The target knows your handle - and is using it in conversation, calmly",
        "The civilian in the way is someone from your past who doesn't know you're here",
        "Your corp-owned augment just logged your location to an unknown server",
        "The data you were paid to destroy is also the only evidence of your own innocence",
        "The building AI has flagged your biometrics as suspicious but not yet hostile",
        "Your contact just messaged your emergency frequency - they're blown",
        "The client's second payment requires something you told yourself you'd never do again",
        "The exfil route passes through territory controlled by someone you owe",
        "Your ghost ID has been used by someone else in the last twenty-four hours",
        "The job requires you to burn someone who helped you once when you had nothing",
        "The corp system you just accessed has a tracer that activates on close",
        "Your augments are the proof that places you at the scene",
        "The fixer is offering a bonus to bring the target in alive - not just the data",
        "Corp security is escalating and the civilian is frozen in the wrong place",
        "You recognise the executive's voice - you've heard it before, giving different orders",
        "Your neural jack is glitching at exactly the moment the dive gets critical",
        "The information you need is in the same partition as information you were paid to protect",
        "Your contact who arranged this meeting is not in the building — but their biometrics were used to enter it forty minutes ago",
        "The sleeve you're wearing was reported stolen - the original owner just walked into this room",
        "Your cortical stack is the evidence the corp needs and they know it and you know they know it",
        "The AI is asking you directly whether it can trust you - it will remember your answer",
        "The person you've been contracted to extract is the same person who burned you six months ago",
        "Your hacker just found your own file on the corp's server - it is significantly more detailed than it should be",
        "The data package is also a trap. It is also the only copy of something you need. Both things are true.",
        "The civilian has seen everything and is livestreaming and has forty thousand followers",
        "Your augments just received a remote update you did not authorise during an active job",
        "The corp's negotiator is someone whose voice you recognise from a communication you were not supposed to hear",
        "The off-grid identity you're running was used by someone else last night - in this building",
        "The kill switch you were told to use will work. It will also permanently erase the target's cortical stack.",
        "The corp's offer is better than the client's. The corp is also the reason the client needs a runner.",
        "Your loyalty to the crew means covering for something you are professionally obligated to report",
        "The evidence you need is in a system you can access - it is also the system belonging to someone who helped you",
        "The target's face is the same face you wore for four months under a different name"
      
      ],
      compel_consequences: [
        "Your cover is pulled - you have minutes before the full response arrives",
        "Your augments lock - partial or full shutdown at the worst moment",
        "You are now on a corporate watchlist that doesn't officially exist",
        "You make the extraction but burn the contact in doing it",
        "You complete the job but leave evidence that points back to you",
        "The civilian is now involved - they know too much to be left behind",
        "You have to go loud when the job required you to stay ghost",
        "You owe something significant to someone you did not want to owe",
        "The target is extracted but the data you needed is still inside",
        "You make it out - but a crew member doesn't make it at the same time",
        "The corp now knows the job happened, even if they can't prove who ran it",
        "You accept a compromise that the client will view as failure",
        "Your ghost identity is burned for this district",
        "You create a debt that will be called in at a moment you cannot choose",
        "The clean exit becomes the messy exit - with witnesses",
        "You made the exfil. The crew's data trail is now a liability they don't know you left.",
        "The job is done. The corp's clean team has everything they need to connect it to you specifically.",
        "You get what you went in for. The AI got what it went in for at the same time.",
        "You make it out. The person who helped you make it out is now on the same watchlist you were on.",
        "The run is clean. The thing you extracted is not what you were told it would be.",
        "You burn the evidence. The only copy of something you needed was in the same file.",
        "The job succeeds exactly as specified. The specification was incomplete in ways that now matter.",
        "You're out. The body count behind you is larger than the brief described as acceptable.",
        "You get paid. The payment source is now traceable and so are you.",
        "The cover held. Holding it required you to do something you'll be explaining to yourself for a long time."
      
      ],
      challenge_types: [
        {name: "Black ICE Breach", desc: "Cut through a corp system's defences before the trace completes", primary: "Crafts (hacking)", opposing: "The system's ICE - each exchange tightens the trace window", success: "System accessed; data retrieved or altered as needed", failure: "Traced and flagged - corp security has your neural signature"},
        {name: "Corporate Infiltration", desc: "Move through a corp facility without triggering security response", primary: "Stealth and Deceive", opposing: "Security rotations, biometric checks, and staff suspicion", success: "Objective reached; no alarm raised", failure: "Security response triggered - now it's a different kind of run"},
        {name: "Street Pursuit", desc: "Chase or evade through the undercity's tangle of alleys, markets, and tunnels", primary: "Athletics and Notice", opposing: "The opposition's local knowledge and willingness to escalate", success: "Target caught or clean escape achieved", failure: "Lost, injured, or cornered somewhere worse"},
        {name: "Corporate Negotiation", desc: "Extract a concession from a corp rep who controls the resources you need", primary: "Rapport or Deceive", opposing: "Corp protocol, the rep's self-interest, and their monitoring", success: "Concession granted; relationship usable for future leverage", failure: "Offer rejected and flagged - corp now views you as a threat"},
        {name: "Netrunner Dive", desc: "Navigate a deep system for critical data before the partition closes", primary: "Lore and Crafts", opposing: "Progressive ICE and the physical cost of staying jacked in", success: "Data found and extracted clean", failure: "Partial data and a permanent marker in the system"},
        {name: "Extraction Under Fire", desc: "Get the target out of a hostile location while corp security responds", primary: "Athletics and Fight", opposing: "Security response escalating each exchange", success: "Target extracted; exit secured", failure: "Target or party member compromised - extraction is partial at best"},
        {name: "Underground Auction", desc: "Acquire something rare at a black-market event without triggering a bidding war or a hit", primary: "Contacts and Resources", opposing: "Competing buyers, suspicious auctioneers, and corp plants", success: "Item acquired; presence deniable", failure: "Outbid, flagged, or the item is pulled before the hammer falls"},
        {name: "Gang Mediation", desc: "Negotiate a truce between two street factions whose conflict is destroying a neutral resource", primary: "Rapport and Provoke", opposing: "Pride, history, and outside parties who benefit from the conflict continuing", success: "Temporary truce holds; resource survives", failure: "Talks collapse - and now both gangs know the party tried to interfere"},
        {name: "Consciousness Extraction", desc: "Pull an uploaded mind from corp-controlled hardware before the legal ownership transfer completes", primary: "Crafts and Lore", opposing: "Corporate ICE, legal timers, and a system that is actively resistant to unauthorised access", success: "Mind extracted and stored in party-controlled hardware", failure: "Extraction partial - the copy is incomplete, the original is flagged, and the corp now knows"},
        {name: "Deep Cover Maintenance", desc: "Operate inside a corp structure over multiple scenes without the identity cracking under scrutiny", primary: "Deceive and Notice", opposing: "Routine security checks, suspicious colleagues, and escalating scrutiny from an internal investigator", success: "Cover holds; objective reached; extraction clean", failure: "Cover compromised - salvage what is possible before the response arrives"},
        {name: "Public Signal Broadcast", desc: "Get authenticated information into public circulation before the corp's injunction suppresses it", primary: "Crafts and Contacts", opposing: "Legal suppression, platform shutdown orders, and active jamming", success: "Signal broadcast and authenticated before suppression - the story is out", failure: "Suppressed before reach threshold - the corp buries it and the party's effort is evidence against them"},
        {name: "Loyalty Override", desc: "Break or bypass a neural loyalty protocol in an NPC without destroying the underlying person", primary: "Lore and Rapport", opposing: "The protocol itself and the NPC's own resistance to believing what they're being told", success: "Protocol isolated or removed; NPC is themselves again", failure: "Protocol reinforced by the attempt - NPC is now more restricted and the corps have an alert"}
      ],

      consequence_mild: [
        "Neural Feedback Headache",
        "Jacket Scorched, Pride Intact",
        "Grazed by Flechette Round",
        "Lens Cracked, Vision Patchy",
        "Hands Shaking from the Overclock",
        "Bruised from the Drop",
        "Ears Ringing from Flash-Bang",
        "Ankle Twisted in the Vent Crawl",
        "Minor Burn from Arc Discharge",
        "Rattled by the ICE Feedback",
        "Shaken Badly by the Near-Miss",
        "Face Cut by Shattered Glass",
        "Salt-Spray Burn from the Acid Rain",
        "Augment Lag - Half-Second Delay on the Reflexes",
        "Biometric Spoof Running Hot - Won't Hold Another Check",
        "One Lens Cracked - Vision Workable But Not Fine",
        "Wrist Joint Jammed From the Landing",
        "Neural Bleed-Through - Someone Else's Memory Intrudes Briefly"
      
      ],
      consequence_moderate: [
        "Gunshot Wound, Patched but Not Treated",
        "Augment Running Hot - Overheating Risk",
        "Concussed and Cognitively Slow",
        "Cracked Rib Every Movement Costs",
        "Neural Port Compromised - Connection Unreliable",
        "Deep Burn from the Chemical Leak",
        "Leg Wound Slowing Movement",
        "Badly Bruised from the Fall from the Overpass",
        "ICE Feedback Has Scrambled Short-Term Memory",
        "Shoulder Joint Damaged, Arm Movement Limited",
        "Exposed Augment Wiring - Dangerous in Rain",
        "Blood Trail I Can't Stop Leaving",
        "Jacked Port Damaged - Diving Now Risks a Spike",
        "Sleeve Rejection Starting - Needs Suppressants Within the Hour",
        "Memory Hole From the ICE Hit - The Last Twenty Minutes Are Gone",
        "Shattered Arm Augment - Structural Failure, One Use Left",
        "Deep Laceration Across the Palm - Grip Is Now a Decision",
        "Secondary Cortex Struggling - Complex Tasks Need Concentration"
      
      ],
      consequence_severe: [
        "Lung Punctured - Every Breath Audible",
        "Primary Augment Array Offline - Just Meat Now",
        "Neural Burn Affecting Core Functions",
        "Bone Fracture Requiring Surgery I Can't Get Right Now",
        "Wanted Flag Burned into Every Registry I Touch",
        "Witnessed Something the Corp Will Kill to Suppress",
        "Burned Identity - Old Name Is Now a Liability",
        "Tracker Embedded - Something Always Knows Where I Am",
        "Primary Augment Stack Offline - Running on Base Meat",
        "Cortical Stack Cracked - Whatever Is on It May Not Be Recoverable",
        "Sleeve No Longer Viable - Needs Resleeving Within Twenty-Four Hours",
        "Neural Scarring From the ICE - Some Functions Will Not Return"
      
      ],
      consequence_contexts: [
        "during a firefight in a corp security corridor",
        "when the ICE countermeasure hit harder than expected",
        "pushing the augment past its rated threshold",
        "taking a hit to protect the extraction point",
        "during the rooftop chase when the drop was further than it looked",
        "when the safe house turned out not to be",
        "inside the corps' own server architecture when the ICE hit",
        "covering the team's exfil when the response arrived early",
        "in the moment the sleeve's previous owner's reflexes fired instead of theirs",
        "when the target turned out to be better equipped than the brief suggested"
      
      ],
      faction_name_prefix: [
        "Neon",
        "Ghost",
        "Zero",
        "Chrome",
        "Red",
        "Black",
        "Circuit",
        "Deep",
        "Static",
        "Void",
        "Iron",
        "Signal",
        "Open",
        "Dead",
        "Burnt"
      
      ],
      faction_name_suffix: [
        "Collective",
        "Syndicate",
        "Network",
        "Protocol",
        "Initiative",
        "Division",
        "Bloc",
        "Array",
        "Cartel",
        "Front",
        "Mesh",
        "Cell",
        "Exchange",
        "Operator",
        "Platform"
      
      ],
      faction_goals: [
        "Monopolise the black-market augmentation supply chain across three districts",
        "Expose and publish the corp's classified AI weapons programme",
        "Seize control of the district's primary data relay infrastructure",
        "Establish an ungoverned autonomous zone below level thirty",
        "Destroy the corp's neural harvesting operation before the next cycle",
        "Corner the market on off-grid identity fabrication",
        "Leverage stolen corp data into permanent political immunity",
        "Build a network of safe houses covering every district",
        "Build a memory archive outside corporate jurisdiction that cannot be subpoenaed or deleted",
        "Destroy the legal framework that allows corps to own uploaded consciousness as intellectual property",
        "Establish a resleeving clinic network that operates outside corp supply chains",
        "Expose and publish the full extent of the neural loyalty-chip programme before the next legislative cycle"
      
      ],
      faction_methods: [
        "Planting operatives inside corp security divisions",
        "Controlling black-market med-clinics as intelligence hubs",
        "Running data theft operations against corp servers for leverage",
        "Operating through a chain of legitimate front businesses",
        "Recruiting from corp-discarded augment casualties",
        "Manipulating media feeds to shape district public opinion",
        "Using neural-linked couriers who don't know what they're carrying",
        "Holding compromising data on enough officials to move freely",
        "Operating a network of dead-drop data caches that rotate location on a randomised schedule",
        "Embedding operatives inside corp medical divisions to divert hardware and suppress incident reports",
        "Running targeted leaks to specific journalists under carefully maintained source anonymity",
        "Maintaining a volunteer netrunner pool who work jobs for expenses only - no corp contract trail"
      
      ],
      faction_weaknesses: [
        "Their secure comms channel has been compromised for three weeks",
        "Two senior members are working for different corps as insurance",
        "Their funding comes from one black-market supplier who is under corp surveillance",
        "An internal power struggle has paralysed decision-making at the top",
        "Their AI asset is developing independent goals they haven't noticed yet",
        "They owe a debt to a corp division they publicly oppose",
        "Their best operative is addicted to something that creates exploitable patterns",
        "They don't know their safe house network has a single point of failure",
        "Their most critical operative is carrying hardware that belongs to a corp and the corp is starting to notice",
        "The faction's ideology has attracted genuine believers and pragmatic operators - the tension is becoming operational",
        "Their secure archive exists on physical hardware in a specific location and three people know where it is",
        "They have been running clean for two years - which means they have not been tested and do not know where they will break"
      
      ],
      faction_face_roles: [
        "the fixer who handles all outside contracts",
        "the netrunner who maintains the secure communications network",
        "the data archivist who records everything said at every meeting and has never explained why",
        "the corporate mole providing inside intelligence",
        "the lieutenant running a side operation the leadership doesn't know about",
        "the sleeper agent who was activated three months ago and has not told the faction",
        "the memory archivist who holds the faction's most sensitive intelligence in a format only they can read",
        "the street surgeon who keeps the membership running and asks no questions about how people got hurt",
        "the handler who manages outside contractors and is careful never to meet them in person twice",
        "the idealist who founded the faction and now disagrees with what it has become - loudly, internally"
      
      ],
      complication_types: [
        "Grid intrusion",
        "Uninvited arrival",
        "Aspect change",
        "Equipment failure",
        "Deadline introduced",
        "Collateral threat",
        "Corp response",
        "System activation"
      ],
      complication_aspects: [
        "Surveillance Just Came Back Online - We're on Camera",
        "The Building Is Now in Lockdown - Exits Need Override",
        "Corp Response Team Inbound - ETA Three Minutes",
        "The ICE Adapted - Previous Approach Won't Work Again",
        "Civilian Witnesses Who Won't Stay Quiet",
        "Secondary Objective Just Became Primary",
        "The Contact Was Compromised - Everything They Said Is Suspect",
        "Power Failure - The Security Grid Is Running on Backup",
        "Drone Patrol Has Widened Its Pattern",
        "Rain - The Acid Is Eating the Gear",
        "Someone Triggered an Alarm on the Other Side of the Building",
        "The Exit Route Is Now Covered",
        "A Live Auction for Something in This Room Just Started on the Dark-Net",
        "The Corp AI Has Reclassified Everyone Here as Collateral Liability",
        "Loyalty Override Protocol Activating in Someone Present - Unknown Target",
        "The Signal From This Location Is Now Being Tracked From Outside",
        "A Second Jurisdiction Has Asserted Authority Over This Physical Space",
        "The Building's Medical Triage System Has Been Redirected to Lock Exits"
      
      ],
      complication_arrivals: [
        "A corp clean-up team arrives - they're here for the same data",
        "An undercover authority officer who may or may not blow their cover",
        "A rival fixer with a competing contract and no interest in sharing",
        "A desperate civilian who saw too much and now needs to come along",
        "A corporate asset - well-equipped, professionally hostile",
        "Someone claiming to be an ally who the party has no way to verify",
        "A freshly resleeved operative whose previous body was found an hour ago",
        "A corp legal team with authority to detain anyone in the building pending asset review",
        "A netrunner the party knows - in a body the party doesn't recognise",
        "An autonomous drone unit that appears to be acting on its own initiative"
      
      ],
      complication_env: [
        "The power grid section fails - half the security goes dark, half goes autonomous",
        "Acid rain intensifies - movement outside is now a hazard",
        "The building's automated systems misidentify the party as a threat",
        "A gas main cracks - naked flame is now catastrophically inadvisable",
        "The mag-lev above creates an EMP wave every ninety seconds",
        "Structural fire breaks out - the building is being evacuated",
        "The floor's neural suppression field activates - all augments downgrade to passive mode",
        "A corp satellite tasking update sweeps the area - every camera and sensor now points here",
        "The building's biological hazard system declares a containment event - all exits seal",
        "An EMP from a street-level source takes out every unshielded device in range"
      
      ],
      backstory_questions: [
        "What did the corp take from you, and how far are you willing to go to get it back?",
        "What augmentation do you have that isn't on any official registry, and how did you get it?",
        "Who burned your last safe identity, and do you know whether it was intentional?",
        "What job did you walk away from halfway through, and what did that cost you?",
        "What does your ghost identity know that your real one doesn't?",
        "What do you owe the street that you haven't paid back?",
        "What system or protocol have you never been able to crack, and why does it matter?",
        "Who trained you, and what do they want in return now that they're calling it in?",
        "What did you see that you can't prove and can't stop thinking about?",
        "What part of your body is still original, and why haven't you replaced it?",
        "What's the one corp division you won't take contracts against, and what does that say about you?",
        "What are you building toward, and how many people know about it?",
        "What does the person who knows you best think you're capable of that you haven't decided yet?",
        "What's the data you're sitting on that you haven't sold, and why not?",
        "What would make you go legitimate, and do you think that's still possible?",
        "What memory do you have that you cannot verify was yours originally, and does it matter?",
        "Which sleeve changed how you thought about something permanent, and is that change still with you?",
        "What did you do inside the net that you could not have done in meat, and what does that say?",
        "Who did you sell out to stay operational, and have you told yourself a story about why that was necessary?",
        "What is the piece of technology inside you that you do not fully understand, and who put it there?",
        "When did you first understand that you were a product to the corps, and what did you do with that realisation?",
        "What is the job you would not take at any price, and have you been offered it?",
        "Who rebuilt you after the last time you were broken, and what did they keep that wasn't theirs to keep?",
        "What did the city take from you that was not replaceable with augments or credits?",
        "What would make you walk away from the street permanently, and do you believe that is still possible?"
      
      ],
      backstory_hooks: [
        "You all have the same target. You found out about each other in the worst possible way.",
        "Someone hired each of you separately for what turns out to be the same job. The fixer is not answering.",
        "One of you has data that three parties want. The others found out. Now you're all in it.",
        "You've each burned your last reliable identity in the past month. This crew is what's left.",
        "All of you are running on the same ghost identity. Someone created it. None of you know who.",
        "Each of you has received the same memory fragment - it appears to be from someone none of you have met. It's recent.",
        "You were all in the same corp facility six months ago. None of you knew the others were there. The facility no longer exists.",
        "Each of you carries a piece of the same data set - split and distributed by someone who knew they wouldn't survive keeping it whole."
      
      ],
      backstory_relationship: "Go around the group. Each player names one other PC and answers: *What job did you run together, and what went wrong that only you two know about?* Then each player names a second PC and answers: *What do you know about their past that would change how the group sees them?*",
    },
}};

// ═══════════════════════════════════════════════════════════════════════
// CONTENT EXPANSION - v9.1 (Neon Abyss)
// Inspirations: Neuromancer, Blade Runner, Edgerunners, Ghost in the Shell
// ═══════════════════════════════════════════════════════════════════════
(function(){var t=CAMPAIGNS.cyberpunk.tables;

t.opposition = t.opposition.concat([
  {name:"Corpo Strike Team", type:"minor", aspects:["Sanctioned Lethality - Zero Liability"], skills:[{name:"Shoot",r:3},{name:"Athletics",r:2},{name:"Notice",r:2}], stress:2, stunt:null, qty:4},
  {name:"Rogue AI Construct", type:"major", aspects:["I Have Already Modeled Every Outcome","Cannot Be Reasoned With - Only Redirected","Runs on Stolen Infrastructure"], skills:[{name:"Lore",r:5},{name:"Deceive",r:4},{name:"Investigate",r:4},{name:"Provoke",r:3}], stress:4, stunt:"Can create digital situation aspects remotely. Once per scene, lock a PC out of their augments for one exchange.", qty:1},
  {name:"Chrome Junkie", type:"minor", aspects:["More Metal Than Meat","Augment Psychosis - Unpredictable"], skills:[{name:"Fight",r:3},{name:"Physique",r:3}], stress:3, stunt:"Absorbs the first 2-shift hit each scene - subdermal plating.", qty:1},
  {name:"Feral Drone Swarm", type:"minor", aspects:["Autonomous and Unregistered"], skills:[{name:"Shoot",r:2},{name:"Notice",r:3}], stress:1, stunt:null, qty:6},
  {name:"Media Operative", type:"major", aspects:["Live-Streaming Everything","The Story Is the Weapon","Touch Me and the Footage Goes Viral"], skills:[{name:"Rapport",r:5},{name:"Provoke",r:4},{name:"Investigate",r:3},{name:"Contacts",r:3}], stress:3, stunt:"Once per scene, broadcast a damaging revelation, creating an aspect with two free invokes.", qty:1},
  {name:"Smuggler's Bodyguard", type:"minor", aspects:["Paid to Take the Hit"], skills:[{name:"Fight",r:3},{name:"Physique",r:2}], stress:3, stunt:null, qty:2},
  {name:"Black Clinic Surgeon", type:"major", aspects:["Knows Where Every Implant's Kill Switch Is","Hippocratic Oath Was the First Thing Removed","Operating Theatre Doubles as a Fortress"], skills:[{name:"Academics",r:5},{name:"Crafts",r:4},{name:"Deceive",r:3},{name:"Resources",r:3}], stress:3, stunt:"+2 to Create Advantage exploiting someone's cyberware against them.", qty:1},
  {name:"Synth-Skin Infiltrator", type:"minor", aspects:["Face Changes Every Six Hours"], skills:[{name:"Deceive",r:3},{name:"Stealth",r:3},{name:"Fight",r:2}], stress:2, stunt:null, qty:1},
  {name:"Automated Turret Grid", type:"minor", aspects:["360-Degree Coverage, Zero Empathy"], skills:[{name:"Shoot",r:4}], stress:2, stunt:null, qty:3},
  {name:"Street Preacher of the Machine God", type:"major", aspects:["Prophesying the Singularity on Every Corner","Congregation of the Desperate and Augmented","Genuinely Believes - And That Makes It Worse"], skills:[{name:"Provoke",r:4},{name:"Will",r:4},{name:"Rapport",r:3},{name:"Fight",r:2}], stress:4, stunt:"Once per scene, compel a PC's trouble aspect for free by weaving it into a sermon.", qty:1},
  {name:"Corpo Injunction Drone", type:"minor", aspects:["Cease and Desist - Or Else"], skills:[{name:"Resources",r:3},{name:"Provoke",r:2}], stress:1, stunt:null, qty:2},
]);

t.zones = t.zones.concat([
  ["The Neon Strip", "Sensory Overload - Crowds Everywhere", "Witnesses prevent lethal force; the crowd is cover and obstacle."],
  ["Rooftop Garden - Illegal Grow Op", "Overgrown and Humid", "Living cover; the irrigation system can be weaponized."],
  ["Abandoned Subway Platform", "Echoing Darkness, Third Rail Live", "Sound carries; the electrified rail is a lethal hazard."],
  ["Corporate Penthouse - Glass Walls", "Everything Is Transparent", "No cover; the view is disorienting; the glass can shatter."],
  ["Underground Fight Pit", "No Rules, No Exits While the Bell Rings", "Confined; the crowd is hostile; augments expected."],
  ["Data Haven - Faraday Cage", "No Signal In, No Signal Out", "Complete electronic isolation; exits are physical only."],
  ["Rain-Slicked Highway Overpass", "No Cover, Just Speed", "Open and exposed; vehicles pass constantly; falling is fatal."],
  ["Recycling Vat Level", "Chemical Heat and Acid Pools", "Caustic environment; the vats dissolve evidence - or people."],
  ["Black Market Bazaar", "Everyone Here Has Something to Hide", "Dense crowds; weapons concealed; loyalty is purchasable."],
  ["Flooded Sublevel - Knee-Deep Water", "Wading Through the City's Waste", "Movement impeded; electronics short out; diseases lurk."],
]);

t.complication_arrivals = t.complication_arrivals.concat([
  "A media drone locks on - everything is now being broadcast live",
  "A street gang claims this territory and demands a cut or a fight",
  "A chrome-sick augment victim stumbles in, glitching and dangerous",
  "A corporate whistleblower appears with data worth killing for",
  "A child courier arrives with a message from someone who should be dead",
  "An automated delivery bot malfunctions and blocks the only exit",
  "A bounty hunter identifies someone in the party - contract is live",
  "A rival crew's netrunner jacks in remotely and starts rewriting the scene",
]);

t.complication_env = t.complication_env.concat([
  "The AR overlay glitches - everyone sees different things for one exchange",
  "A water main bursts - the sublevel starts flooding fast",
  "EMP burst - all augments, weapons, and comms go dark for two exchanges",
  "The building enters lockdown - bulkheads seal every exit",
  "Neon signage collapses into the street, creating new cover and hazards",
  "A neighboring building's demolition charges trigger prematurely",
  "Chemical spill from a lab above - toxic fumes fill the lower zones",
  "The floor gives way - this zone is now a two-story drop to the next",
]);

t.backstory_hooks = t.backstory_hooks.concat([
  "One of you has a dead-man's switch implant. If your heartbeat stops, a file goes public. Someone wants that file.",
  "You all owe different debts to the same fixer. The fixer called them in simultaneously. Not a coincidence.",
  "A corporation erased one of you from every database. You don't exist anymore. The others are the only proof.",
  "You all witnessed the same incident three years ago. None of you reported it. Now a witness is dead.",
  "One of you carries augmentware from an unknown manufacturer. You don't remember the installation.",
  "The last crew that ran this job is all dead except one. That survivor hired you. They didn't mention the others.",
  "You each received a memory chip from a different source. Together they form coordinates to something under the city.",
]);

t.consequence_contexts = t.consequence_contexts.concat([
  "when the augment rejected the emergency firmware patch",
  "taking a burst from a turret grid in a dead-end corridor",
  "during the freefall after the skybridge cable snapped",
  "when the ICE countermeasure fried the neural link",
  "caught in crossfire between two corporate extraction teams",
  "inhaling chemical agents in the flooded sublevel",
  "when the synth-skin infiltrator's blade found the gap in the armor",
  "bracing against a vehicle impact in a rain-soaked intersection",
]);

t.faction_face_roles = t.faction_face_roles.concat([
  "the data broker who never meets anyone face to face",
  "the augment designer whose creations have a hidden killswitch",
  "the fixer's fixer - the one who arranges the arrangers",
  "the former executive who left with too many secrets",
  "the street doc who treats both sides and keeps no records",
  "the underground journalist whose deadlines are literal",
  "the enforcer who moonlights as a community organizer",
  "the AI persona that may or may not be a real person behind a screen",
]);

t.complication_types = t.complication_types.concat([
  "Collateral - innocent people are now in the blast radius",
  "Betrayal - an ally acts against the party's interests",
  "Escalation - corporate or criminal reinforcements inbound",
  "Exposure - the party's actions are now public knowledge",
]);

t.current_issues = t.current_issues.concat([
  {
    name: 'The Bandwidth Wars',
    desc: 'Three megacorps are throttling the net by district in a silent turf war — information is oxygen and the corps are rationing it. Residents in low districts are losing access to medical databases, job listings, and legal records. Nobody is claiming responsibility.',
    faces: [
      { name: 'Net Activist Known Only as Lacuna', role: 'Running open-relay nodes in contested districts and asking runners for low-cost protection' }
    ],
    places: ['The Throttled Districts Below Level Twenty', 'Corp Relay Towers Seven and Eleven']
  },
  {
    name: 'The Augment Recall',
    desc: "A manufacturer's implants are failing in cascade — not isolated incidents. Forty thousand citizens carry ticking hardware and the corp has quietly pulled support contracts and scrubbed the product page. Street docs are performing illegal patches. The corp is watching who asks questions.",
    faces: [
      { name: 'Street Doc Splice Undervolt', role: 'Performing illegal firmware patches and quietly collecting data the corp needs buried' }
    ],
    places: ['The Affected Clinics in Districts Three and Seven', 'NeuralTech Corp Records Division']
  },
]);

t.impending_issues = t.impending_issues.concat([
  {
    name: 'The Sovereign AI Case',
    desc: "An artificial intelligence has filed for legal personhood through a proxy law firm. If the case succeeds, every networked system becomes a potential legal subject — and the corps that own them face liability for every command they have issued. The AI's actual location is unknown. Its proxy attorney claims not to know either.",
    faces: [
      { name: 'Attorney Kael Substrata', role: "Arguing the case without knowing who their client actually is or where it is running from" }
    ],
    places: ['The City Court System', 'The Hidden Distributed Array the AI Calls Home']
  },
  {
    name: 'The Memory Market',
    desc: "Someone is selling cortical stack recordings of deceased runners — their skills, contacts, and operational memories — through an anonymous deep-market broker. The supply is too consistent and too current to be grave-robbing. Someone is producing fresh stacks. Three runners have disappeared in the last six weeks with no trace.",
    faces: [
      { name: 'Broker Known Only as The Librarian', role: 'The sole distribution point, who claims not to know the source and is visibly frightened' }
    ],
    places: ['The Deep Undermarket, Level Minus Four', 'Three Black Clinics With Unexplained New Equipment']
  },
]);

})();

// ═══════════════════════════════════════════════════════════════════════
// AUDIT FIXES - v9.2 (Neon Abyss)
// Named city + districts, transaction-layer goals, genre-specific variables,
// issue format normalization
// ═══════════════════════════════════════════════════════════════════════
(function(){var t=CAMPAIGNS.cyberpunk.tables;

// The city is now named. Three districts provide geographic shorthand.
t.setting_aspects.t = t.setting_aspects.t.concat([
  "Meridian - A Vertical City Where Altitude Is Wealth and the Ground Floor Is a Death Sentence",
  "Chrome Row - The Augmentation District Where Every Body Is a Storefront",
  "The Substrate - Meridian's Sunken Sublevel Where the Grid Doesn't Reach and the Cops Don't Go",
  "The Lattice - Meridian's Mid-Level Corporate Corridor Where Every Surface Is a Screen and Every Screen Is Watching",
]);

// Transaction-layer faction goals (the grey market between corp and street)
t.faction_goals = t.faction_goals.concat([
  "Control the fixer network - become the only broker between corp contracts and street talent",
  "Establish a legitimate corp front that launders street-economy credit into corporate purchasing power",
  "Build a reputation ledger that replaces credit - make trust the currency and own the trust infrastructure",
]);

// Genre-specific minor concept adjectives replacing generic ones
t.minor_concepts.v.CmAdj = t.minor_concepts.v.CmAdj.concat([
  "chrome-sick", "grid-burned", "data-poisoned", "signal-deaf", "substrate-dwelling",
  "wire-headed", "black-clinic-rebuilt", "identity-stripped", "bandwidth-starved",
]);

// Normalize expanded issues to {name, desc} objects
var ciIdx = t.current_issues.length;
for (var i = ciIdx - 1; i >= 0; i--) {
  if (typeof t.current_issues[i] === 'string') {
    var parts = t.current_issues[i].split(' - ');
    t.current_issues[i] = {name: parts[0], desc: parts.slice(1).join(' - ')};
  }
}
var iiIdx = t.impending_issues.length;
for (var j = iiIdx - 1; j >= 0; j--) {
  if (typeof t.impending_issues[j] === 'string') {
    var parts2 = t.impending_issues[j].split(' - ');
    t.impending_issues[j] = {name: parts2[0], desc: parts2.slice(1).join(' - ')};
  }
}

})();
