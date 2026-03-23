// data/space.js
// Campaign data for Space.
// Requires data/shared.js to be loaded first (provides CAMPAIGNS object).

CAMPAIGNS["space"] = {
    meta: {
      id: "space", name: "Void Runners",
      tagline: "The Used Future. Blue-collar space western - ships held together by prayers and stolen parts, survival meeting lawlessness at the edge of everything.",
      icon: "◯", font: "'Exo 2', 'Futura', sans-serif",
    },
    colors: {
      bg:"#030508", panel:"#060a10", border:"#0a1828",
      gold:"#a080f0", accent:"#7060d0", dim:"#3a2880",
      text:"#c0b8f0", muted:"#1a1030", textDim:"#5a4888",
      red:"#e03060", blue:"#2060c0", green:"#20a870", purple:"#8040c0",
      tag:"#7060d022", tagBorder:"#7060d044",
    },
    lightColors: { bg:"#eeeaf8", panel:"#f6f4ff", border:"#8870c8", gold:"#3a2890", accent:"#2a1880", dim:"#4a38a0", text:"#0c0820", muted:"#3a2870", textDim:"#281858", red:"#780060", blue:"#181870", green:"#185040", purple:"#2a1080", tag:"#a080f022", tagBorder:"#a080f018" },
    tables: {
      names_first: ["Oryn","Sev","Taleth","Kessa","Drav","Neela","Vorn","Sari","Hex","Quell","Zira","Cael","Brynn","Mirel","Tov","Esker","Naia","Wrex","Duna","Rythe","Lex","Covex","Shade","Pell","Axon","Fen","Vael","Koryn","Sola","Drift","Kael","Lyris","Trace","Brix","Nemo","Vaya","Deckard","Shan","Rylo","Cass","Amos","Naomi","Holden","Bobbie","Camina","Drummer","Prax","Avasarala","Mal","Wash","Zoe","Kaylee","Jayne","Spike","Jet","Faye","Ed","Crichton","Aeryn","Zhaan","Rygel","Ripley","Dallas","Lambert","Sable","Dex","Nox","Vash","Cray","Tova","Orrel","Fenn","Juno","Strix","Mace","Kethra"],
      names_last: ["of the Long Haul","Driftmark","Coldvac","the Uncharted","Ironwake","Stellarborn","Scatterpoint","the Recovered","Systemfall","Hardburn","Exo-7","Nearspace","Longrun","Far-Range","of Broken Dock","the Salvaged","Null-G","Warpborn","of the Belt","Rockhopper","Zero-Pressure","the Unregistered","Thrusterburn","Hardvac","the Stripped","Colonyborn","Freelancer","of Ilus","Breakaway","the Expendable","Dirtside","Bulkhead","Outrider","No-Manifest","the Repatched","Lastrun","Burnthrough","Void-Walker"],
      pc_high_concepts: ["Mechanic Who Keeps This Ship Running Mostly Out of Stubbornness","Cargo Specialist Who Knows What's in Every Container and Doesn't Ask","Ex-Navy Pilot With a Discharge She Won't Explain","Ship's Cook Who Used to Be a Corporate Auditor","Medic Running the Infirmary on Expired Supplies and Improvisation","Freelance Broker Whose Last Deal Got Her Previous Crew Killed","Jump Navigator Who Has Been to the Place the Charts Say Doesn't Exist","Security Officer Whose Last Job Ended When the Station Did","Salvager Who Found Something Alive in a Wreck Registered as Empty","Engineer on the Run From the Company That Built Her Ship","Communications Specialist Who Intercepts More Than She Reports","Gunner Who Hasn't Had to Shoot Anyone She Didn't Want To"],
      pc_questions: ["What's the one cargo job you turned down and why are you glad you did?","Who else on this ship are you protecting without telling them?","What system are you not allowed to return to, and what happened?","What modification did you make to this ship that no one else knows about?","What do you actually owe the captain, and is the debt growing?","What did you leave behind to take this job?"],
      minor_concepts: {
          t: [
            "A {SmAdj} {SmRole}",
            "{SmRole} on {SmJob}",
            "Authority-{SmState} {SmRole}",
            "A {SmAdj} {SmRole} working {SmArrange}",
            "Broke Spacer with a Manifest That Doesn't Hold Up",
            "Black-market Parts Dealer Three Payments Behind on Their Berth",
            "Belt Salvager on Someone Else's Claim",
            "Station Rat Who Knows Every Access Shaft",
            "Military Surplus Drone-Operator Working Off a Debt",
            "Corp-Dropped Independent Looking for a New Crew",
            "Salt-of-the-Earth Asteroid Miner With a Lien Against the Equipment",
            "Former Fleet Crew Who Left Before the Inquiry",
            "Void-touched Navigator Who Doesn't Log Everything They See",
            "Zero-G Engineering Tech on a Contract That Ends This Week",
            "Hull-Patch Worker Who Charges What the Job's Worth"
          ],
          v: {
            SmAdj: ["contracted", "fugitive", "stranded", "combat-rated", "authority-adjacent", "licensed", "unregistered", "corp-employed", "warrant-adjacent", "deep-space", "privateer", "off-roster", "belt-born", "colony-raised", "jury-rigged", "warrant-active", "corp-surplus", "deep-space-rated", "independent", "refugee", "post-fleet", "hard-vacuum"
            ],
            SmRole: ["dock security", "corporate surveyor", "salvage crew", "station militia", "black-market broker", "customs officer", "hired escort", "deep-space prospector", "colonial liaison", "refugee handler", "data courier", "crew-for-hire", "belt prospector", "colonial medic", "refugee liaison", "corp logistics worker", "independent hauler", "ore sorter", "water reclamation tech", "jump gate maintenance crew", "alien artefact handler", "deep-space comms operator"
            ],
            SmJob: ["retainer", "a scheduled inspection", "crew rotation", "contract enforcement", "salvage rights claim", "a transit permit that may not be valid", "a manifest that doesn't hold up", "a corp labour contract", "a belt survey rotation", "refugee transit duty", "emergency supply run", "an authority impound watch", "a jump gate maintenance window"
            ],
            SmState: ["contracted", "sanctioned", "flagged", "monitored", "licensed", "surplus to requirements"],
            SmArrange: ["by the hour", "without asking why", "under deniable orders", "off the official registry", "below the authority's notice", "on a contract that ends tomorrow", "under a labour contract they cannot leave", "for the corp that owns their lease", "on the belt's terms not the inner systems'", "at the edge of what the ship can do", "without backup and without alternatives"
            ],
          }
        },
      minor_weaknesses: ["Owes the Wrong People More Than Credits","Their Ship Was Impounded - They're Desperate","Communication Array Has a Corp Backdoor","Won't Risk the Warrant They Already Have","Homesick for a Planet That Doesn't Exist Anymore","One Bad Jump Away from System Failure","Allegiance to Someone Not in This Room","Addicted to Drift - Neural Jump Stimulant","Their Cover Identity Has a Hole In It","Terrified of Open Space - Trauma Response","Agoraphobia - Works Fine in Corridors, Not Open Space","The Ship's Debts Come With Actual Debt Collectors","Colonial Accent Marks Them Immediately to Authority","Old Fleet Rank Means Old Fleet Enemies","The Warrant Is Still Active in Six Jurisdictions","Addicted to Drift - The Neural Jump Suppressant","Cannot Pass a Biometric Checkpoint Under Any Cover","The Crew Thinks They're the Captain - They're Not","Terrified of Uncontrolled Atmospheric Entry Since the Last One","Owes a Life-Debt to the Wrong Species","Communication Implant Has a Corp Back-Channel","Their Clone Is Still Active Somewhere - That's Complicated","Will Not Abandon a Damaged Ship While Crew Is Aboard","Pride About Navigation - Will Not Admit the Chart Is Wrong","Prosthetic Arm Needs Calibration Every Forty-Eight Hours","The Alien Biology Requires a Medication Nobody Stocks","Can't Keep Quiet in a Vacuum Suit - Keeps Talking","The Ship AI Likes Them Less Each Day","Old Combat PTSD: Certain Sounds Cause Freeze Response","The Cargo They're Moving Isn't Declared and Someone Knows","Belt-Born Bones - Gravity Worlds Are Hard Work and Always Have Been","Cannot Abandon a Distress Beacon - Every Single Time","The Ship's Name Is Famous in the Wrong Ports","Deep-Space Sickness Managed Barely - Supply Is Limited","Former Fleet - Authority Reflex Fires Before Reason","Won't Leave Anyone on a Dying Ship - Every Time","The Alien Contact Residue Means Certain Technologies Behave Strangely Near Them","Colonial Pride - Won't Admit the Outer Systems Struggle","Warrant Technically Suspended - Security Always Checks","Three Separate Corps Consider Them a Proprietary Asset Under Contract Clause Seven","Cannot Watch Poor Work Without Saying So - Loudly","The Prosthetic Needs Calibration That Only One Station in Range Can Provide","Owes the Crew a Morale Debt - Running on Empty","Former Authority - Every Contact Needs Proof They've Changed","Jump Sickness Hits Different Every Time - No Warning","Responsible for Someone Else's Child Aboard This Ship","The Cargo Manifest Has Never Been Fully Accurate and Someone Knows It","Won't Use a Life Pod - Has Reasons, Has Problems","Navigation Style Identifiable to Any Fleet-Trained Reader","The Part the Ship Needs Is Embargoed Everywhere Reachable"],
      major_concepts: {
          t: [
            "A {SmajAdj} {SmajRole} who {SmajDrive}",
            "Former {SmajRole} turned {SmajAlt}",
            "The {SmajRep} {SmajRole} in {SmajSpace}",
            "A {SmajAdj} {SmajRole} with {SmajSecret}",
            "Admiral of a Fleet Nobody Paid For",
            "Debt-Collector for the Corp That Owns the Station",
            "Captain of the Last Ship Out of a Dead Colony",
            "Cybernetic Crew Chief Who Fixes What the Manual Says to Replace",
            "Negotiator for a Faction That Technically Doesn't Exist",
            "Former Fleet Officer Running on a Privateer's Budget",
            "Last Navigator Who Knows the Route and Won't File It",
            "Salvage Kingpin of the Outer Belt"
          ],
          v: {
            SmajAdj: ["fugitive", "legendary", "disavowed", "corporate", "haunted", "blacklisted", "wanted", "ice-cold", "isolated", "fleet-trained", "notorious", "indebted", "belt-born", "colony-hardened", "deep-space-worn", "corp-burned", "post-contact", "warrant-active", "alien-touched", "fleet-disavowed"
            ],
            SmajRole: ["ship captain", "authority commander", "corporate director", "alien diplomat", "smuggler kingpin", "deep-space explorer", "intelligence operative", "arms dealer", "colonial governor", "rogue scientist", "mercenary fleet commander", "station administrator", "belt settlement administrator", "colonial separatist commander", "corp claims adjudicator", "independent fleet captain", "alien contact specialist", "outer systems labour organiser", "deep space survey director", "derelict recovery specialist"
            ],
            SmajDrive: ["holds three jump routes through leverage and reputation", "found something in the outer belt and won't say what", "works both the authority and the independents", "knows which corp owns the station security", "is one score from buying a route out of charted space", "carries data that three governments want destroyed", "built a network the authority doesn't know exists", "holds jump coordinates that make the outer systems navigable without corp infrastructure", "has made first contact three times and filed none of the reports", "maintains a network of settlements the authority does not know exist", "carries the only authentic record of what the corp did to the colony", "knows the alien signal's translation and has been deciding what to do with it for eight months"
            ],
            SmajAlt: ["authority asset", "independent contractor", "fugitive", "civilian", "the problem", "reluctant ally"],
            SmajRep: ["most wanted", "most useful", "most expensive", "most dangerous", "most unreachable", "last surviving"],
            SmajSpace: ["the belt", "the outer systems", "charted space", "this sector", "the station network", "the dead zones"],
            SmajSecret: ["a jump point on no official chart", "an authority file with their real history", "a contact inside the target corp", "a ship registered under a dead person's name", "a debt settleable in only one currency", "a first-contact record never filed", "a first contact record that changes the legal status of three systems", "a route map that bypasses every authority checkpoint in the belt", "the location of the corp's classified xenotech site", "a ship registered under a destroyed settlement's colonial charter - still legally valid"
            ],
          }
        },
      troubles: ["My Ship Is All I Have Left and She's Failing","I Owe a Debt Across Three Systems","The Fleet Wants Me for What I Know","My Last Mission Is the Reason I Can't Go Home","I Trust the Crew; I Can't Afford Not To","The Coordinates I Have Are Worth Dying Over","My Loyalty to the Mission Comes Second to Survival","The Alien Contact Changed Something In Me","The War Is Over and I Don't Know Who I Am","One More Jump and the Drive Fails - I Know It","The Fleet Still Considers Me a Deserter and They Are Not Wrong","My Notorious Reputation Opens Doors That I Would Rather Stay Closed","The Addiction Travels Well - It Packed Itself","Something Followed Us Back Through That Jump Point","The Ship's Registry Has Been Wrong Since the Last Port of Call","My Jump Coordinates Are the Only Things Keeping Me Alive","Three Crews Have Signed On and Left This Ship - by Airlock","I Know the Location of the Fleet's Hidden Weapon Cache","The Authority Considers Me Responsible for the Colony Incident","My Clone Has Apparently Been Living My Life Better Than I Did","I Owe the Station Master Something That Isn't Transferable","Every Port Recognises Me - None of Them Favourably","The Alien Contact Changed Something in My Neurology","I Am Being Followed By Something That Jumps With Me","The Ship Trusts Me More Than I Trust Myself","My Cargo Has Been Alive Longer Than I Have Known About It","I Made a Treaty Without Authority and It Is Holding","The Signal I Decoded Has Been Decoding Me Back","Three Systems Away, Something Thinks I Still Work for Them","The War Ended. I Did Not. The Adjustment Is Ongoing.","The Ship Is Keeping This Crew Together - She's Dying","The Belt Doesn't Forgive Inners and I Was Born Inner","I Know Where the Colony Ship Went","My Last Captain Died Because of My Decision","The Corp Owns My Prosthetic's Patent - Legally","Three Years in Cryo Dreaming the Same Thing","Alien Contact Changed My Biology - Unexplained","Made a Promise to a Dead Crew - Only One Left","Authority Thinks I'm Their Asset - I Stopped","Surviving on Empty Six Months - Running Out of Reasons","The Jump I Made to Get Here Shouldn't Have Been Survivable","Someone Is Using My Ship's Transponder and They Are Being Very Memorable","Know What the Signal Says - Pretending I Don't","My Crew Trusts Me Completely and I Am Not Completely Trustworthy","Only Survivor of the Survey Team - Not Been Honest","The Addiction Schedules My Days Now","Every Port Has Someone Who Remembers the Incident","The Thing I Brought Back From the Ruins Is Aboard","Three Authority Jurisdictions All Believe I Am Currently Working For Them","Built This Reputation on Jobs I Can't Stop Thinking About"],
      other_aspects: {
          t: [
            "{SOAdj} for the {SODomain}",
            "{SOVerb} What the {SOSubj} {SOAct}",
            "My {SOThing} Is {SOState}",
            "{SOAdj} in the {SODomain}",
            "I Know Which {SODomain} {SOVerb}",
          ],
          v: {
            SOAdj: ["Built", "Rated", "Flagged", "Wanted", "Known", "Cleared", "Licensed", "Registered", "Warranted", "Burned", "Belt-Born", "Colony-Rated", "Hardvac", "Warrant-Active", "Jump-Cleared"
            ],
            SODomain: ["Outer Belt", "Authority Channels", "Deep Space", "Station Network", "Jump Registry", "Charted Space", "Black Market", "Colonial Routes", "Belt Settlement Network", "Corp Jurisdiction", "Jump Gate Registry", "Alien Contact Zone", "Colonial Charter Territory"
            ],
            SOVerb: ["Survived", "Know", "Remember", "Track", "Hold", "Found", "Burned", "Run", "Logged", "Survived", "Hauled", "Drifted", "Patched", "Outran"
            ],
            SOSubj: ["authority", "registry", "scan", "corp manifest", "jump gate record", "official chart", "beacon signal"],
            SOAct: ["Can't Find", "Won't Log", "Don't Audit", "Can't Prove", "Won't Transmit", "Never Archives", "Doesn't Reach", "Won't Admit"],
            SOThing: ["Ship", "Jump Coordinates", "Registry Entry", "Warrant", "Ghost Route", "Clearance Code", "Cover Manifest"],
            SOState: ["Three Registrations Behind", "Cleaner Than My Real ID", "Off Every Official Chart", "Worth More Than My Clearance", "Mine Until the Authority Looks", "Running on Expired Credentials"],
          }
        },
      stunts: [
        {name:"Void Instinct",skill:"Notice",desc:"+2 to overcome when scanning for threats in space or detecting vessel signatures.",type:"bonus",tags:["investigation", "survival", "knowledge"]},
        {name:"Burn and Coast",skill:"Drive",desc:"+2 to overcome when attempting evasive manoeuvres in a spacecraft.",type:"bonus",tags:["movement", "technical", "survival"]},
        {name:"Jury Rig",skill:"Crafts",desc:"+2 to overcome when making emergency repairs to a ship system under fire or time pressure.",type:"bonus",tags:["repair", "technical", "survival"]},
        {name:"Long Shot",skill:"Shoot",desc:"+2 to attack when firing at targets in an adjacent zone at range.",type:"bonus",tags:["combat", "movement"]},
        {name:"Alien Diplomat",skill:"Rapport",desc:"+2 to create advantages when opening first contact with a species you've never encountered before.",type:"bonus",tags:["social", "negotiation", "knowledge"]},
        {name:"Spacer Tough",skill:"Physique",desc:"+2 to defend against vacuum exposure, radiation, and other deep-space environmental hazards.",type:"bonus",tags:["survival", "combat"]},
        {name:"Read the Docking Manifest",skill:"Investigate",desc:"+2 to overcome when researching a ship, crew, or cargo by pulling public registry records.",type:"bonus",tags:["knowledge", "negotiation", "subterfuge"]},
        {name:"Outer Belt Contacts",skill:"Contacts",desc:"+2 to overcome when seeking smugglers, pirates, or outlier settlements beyond standard jurisdiction.",type:"bonus",tags:["social", "knowledge", "negotiation"]},
        {name:"Dead Reckoning",skill:"Lore",desc:"+2 to overcome when navigating without instruments or plotting a course through unmapped space.",type:"bonus",tags:["knowledge", "movement", "survival"]},
        {name:"Extraction Protocol",skill:"Athletics",desc:"+2 to overcome when moving through zero-gravity or vacuum environments.",type:"bonus",tags:["movement", "survival", "leadership"]},
        {name:"Emergency Purge",skill:"Crafts",desc:"Once per scene, vent atmosphere, engage EM pulse, or trigger a ship system failure as a free action - affects everyone in that zone equally.",type:"special",tags:["technical", "survival", "combat"]},
        {name:"Ghost Signature",skill:"Stealth",desc:"Once per scene, your ship or person drops off all sensors for one exchange - no roll required.",type:"special",tags:["stealth", "technical", "movement"]},
        {name:"Alien Contact",skill:"Empathy",desc:"Once per scene, establish emotional communication with a non-human entity even without a shared language.",type:"special",tags:["social", "knowledge", "supernatural"]},
        {name:"Critical Override",skill:"Crafts",desc:"Once per scene, force a ship or station system to execute a command it's locked against - no roll, but the system is damaged afterward.",type:"special",tags:["technical", "combat", "repair"]},
        {name:"Jump Point Savant",skill:"Lore",desc:"Once per scene, identify an unmapped jump point in range that no charts record.",type:"special",tags:["knowledge", "movement", "technical"]},
        {name:"Not If I See You First",skill:"Notice",desc:"Once per scene, declare you spotted the ambush before it triggered - your side acts first this exchange.",type:"special",tags:["investigation", "combat", "survival"]},
      {name:"Ace Pilot",skill:"Drive",desc:"+2 to Drive when performing evasive maneuvers.",type:"bonus",tags:["movement", "technical", "combat"]}, {name:"Babel Fish",skill:"Lore",desc:"+2 to Lore when deciphering alien languages.",type:"bonus",tags:["social", "knowledge", "negotiation"]}, {name:"Evasive Thrust",skill:"Drive",desc:"Once per scene swap your position with any other ship in a chase without a roll.",type:"special",tags:["movement", "combat", "technical"]}, {name:"Intimidating Presence",skill:"Provoke",desc:"+2 to Provoke when dealing with low-life pirates.",type:"bonus",tags:["intimidation", "social", "leadership"]}, {name:"Long-Range Scanner",skill:"Notice",desc:"+2 to Notice when detecting cloaked ships.",type:"bonus",tags:["investigation", "technical", "knowledge"]}, {name:"Multilingual Liaison",skill:"Rapport",desc:"+2 to Create Advantage when dealing with non-human species for the first time.",type:"bonus",tags:["social", "negotiation", "knowledge"]}, {name:"Overcharge Shields",skill:"Crafts",desc:"Once per scene give your ship a 2-point armor soak.",type:"special",tags:["technical", "combat", "survival"]}, {name:"Political Savvy",skill:"Contacts",desc:"+2 to Contacts when dealing with planetary governments.",type:"bonus",tags:["social", "negotiation", "leadership"]}, {name:"Quick Draw",skill:"Shoot",desc:"Use Notice instead of Shoot to determine who fires first.",type:"special",tags:["combat", "movement"]}, {name:"Scrounge",skill:"Resources",desc:"Use Resources to find rare ship parts in junkyards.",type:"special",tags:["survival", "technical", "knowledge"]},
        {name:"Ship's Mechanic",skill:"Crafts",desc:"+2 to Crafts when repairing ship systems under pressure.",type:"bonus",tags:["repair", "technical", "knowledge"]},
        {name:"Zero-G Combat",skill:"Athletics",desc:"+2 to Athletics when fighting in weightless environments.",type:"bonus",tags:["combat", "movement", "survival"]}],
      scene_tone: {
          t: [
            "{StAdj} and {StAdj2}",
            "{StNoun}-saturated {StQual}",
            "The comms are {StComms}",
            "{StQual} - every system {StSys}",
          ],
          v: {
            StAdj: ["Vacuum-cold", "Surveilled", "Tense", "Corp-adjacent", "Pressure-sealed", "Signal-dark", "Weapons-hot", "Decompression-adjacent", "Authority-heavy", "Blackout-quiet"],
            StAdj2: ["watched from the station", "authority-adjacent", "professionally hostile", "logged for incident review", "quiet in a way that means something", "officially neutral but not really", "one breach from vacuum", "already past deniability", "armed as a matter of procedure", "running on borrowed clearance"],
            StNoun: ["Corp", "Authority", "Vacuum", "Radiation", "Signal", "Silence", "Distance", "Weapons"],
            StQual: ["standoff", "controlled threat", "professional hostility", "implied escalation", "manufactured neutrality", "armed truce", "corp-managed calm"],
            StComms: ["dark", "monitored", "lagged - someone's interfering", "clean and that's suspicious", "showing traffic not on the manifest", "routing through something it shouldn't"],
            StSys: ["armed", "monitored", "running hot", "showing anomalous readings", "logged for the authority", "ready for emergency protocol"],
          }
        },
      scene_movement: ["Airlock Cycling - Can't Use This Passage for Two Exchanges","Zero Gravity Sector Active","Bulkheads Slamming Closed on a Timer","Exposed Conduit Array - Touch It and You're Down","Cargo Containers Shifting in the Bay","Narrow Maintenance Tube - One at a Time","Gravity Inversion Between Zones","Emergency Foam Deployed - One Zone Impassable","Power Cables Hanging Loose Across the Corridor","Automated Transport Cart Blocking the Main Passage","Active Thruster Backwash Channel - Lethal Without Suit","Emergency Mag-Lock Floor - Movement Requires Physique Roll","Debris Field From Recent Hull Compromise","Pressure Drop Between Zones - Ear Pain, Cognitive Fog","Active Docking Arm Sweeping the Zone","Zero-G Transit Tube - Movement By Handhold Only","Coolant Spray From Ruptured Line - Slick and Cold","Automated Cargo Transport Cycle - Zone Impassable Every Other Exchange","Emergency Bulkhead Pattern - Two Zones Cut Off on a Timer","Atmospheric Particulate From the Air Filter Failure - Visibility Thirty Metres","Power Grid Cycling - Mag-Boots Disengage Randomly","Hard Rotation Section - Centrifugal Gravity Pulls Away From Centre","Collapsed Maintenance Catwalk - Drop to Lower Deck Available","The Docking Tunnel Is Decompressing Slowly - Moving Against It Costs Extra","Radiation-Hot Section: Minimum Transit Time Is the Only Sensible Approach"],
      scene_cover: ["Massive Cargo Containers","Docked Shuttle - Good but Gets in the Way","Equipment Locker Rows","Prefab Crew Bunks","Engineering Station Consoles","Communications Array Housing","Medical Bay Partitions","Heavy Cargo Netting","Fuel Drum Stack","Emergency Bulkhead, Partially Closed","Stacked Ore Processing Canisters - Chest-High, Heavy","Emergency Pressure Curtain - Blocks LOS, Not Weapons","Row of Cryo Chambers, Most Occupied","Docked Salvage Shuttle - Hatch Accessible","Dense Array of Atmospheric Scrubbers","Overturned Mess Table - Bolted to the Floor, Solid","Rack of EVA Suits in Storage Position","Comm Station Housing - Full Height, Sturdy","Stacked Fuel Cell Blocks in Transit Configuration","Dense Row of Server Columns, Floor-to-Ceiling","Emergency Blast Shield, Partially Deployed","Stack of Sealed Sample Containers - Unknown Contents","Portable Habitat Module, Uninflated But Solid","Mass of Tangled Cable Rigging From Last Repair Job","Reactor Shield Wall - Partial, But Radiation-Rated"],
      scene_danger: {
          t: [
            "{SdAdj} {SdHazard}",
            "{SdHazard} that {SdBehave}",
            "Active {SdSys} {SdState}",
            "{SdHazard} - {SdWarn}",
          ],
          v: {
            SdAdj: ["Military-spec", "Corp-grade", "Malfunctioning", "Vacuum-adjacent", "Pressurised", "Automated", "Experimental", "Remotely-operated", "Cascading", "Emergency-state"],
            SdHazard: ["hull breach point", "defence turret", "explosive decompression zone", "radiation leak", "drone intercept system", "airlock override", "engine plasma conduit", "bulkhead lockdown sequence", "lethal containment protocol", "weapons locker breach"],
            SdBehave: ["activates on proximity", "has already logged the biometrics in this room", "doesn't stop for civilians", "operates under authority-legal standing", "treats everyone present as hostile", "will seal the section if breached", "feeds to a remote operator", "is past the point of local override"],
            SdSys: ["automated defence", "hull integrity", "life support", "emergency protocol", "weapons system", "drone intercept"],
            SdState: ["with no local override", "on an escalating timer", "feeding to a remote operator", "past first threshold", "logging everything to the authority"],
            SdWarn: ["the authority receives a report regardless", "there's no quiet way through", "someone on the other end is watching", "everyone in range is already in the log", "this room is already flagged"],
          }
        },
      scene_usable: ["Hackable Station Controls - Doors, Lights, Locks","Magnetic Boots Available - Useful in Zero-G","Emergency Spacesuit Rack","Oxygen Canister - Improvised Projectile","Panicking Station Civilians","Cargo Handling Exo-Rig, Operational","Explosive Decompression Button - Well-Labelled","Active Docking Clamps","Ship's Manifest Terminal","Intercom System Across All Zones", "Automated Defense Turrets", "Dense Asteroid Field", "Double-thick blast shielding", "Exposed Plasma Conduit", "Flickering Emergency Lights", "Hull-Breach Alarm Blaring", "Low-Gravity Cargo Bay", "Radiation-Leaking Containers", "Shattered Viewport Glass", "Slow-cycling airlock", "Sparking Computer Terminal", "Whirring Life-Support Fans"],
      zones: [["The Bridge","Line of Sight in All Directions","Ship control is here; whoever holds it holds the ship."],["The Engine Bay","Heat and Noise","Communications impossible; systems vulnerable to sabotage."],["The Cargo Hold","Dense Cover, Shifting Contents","Pursuit is difficult; zero-gravity sectors can activate."],["The Airlock","One Step From Vacuum","Whoever controls this controls who boards and exits."],["The Medical Bay","Civilians in the Crossfire","Cover is good; civilians may be present."],["The Observation Deck","Exposed to Exterior View","Sight lines to space; hull integrity is a concern."],["The Crew Quarters","Tight and Personal","Civilians likely; combat is brutal at this range."],["The Station Hub","Crowds and Commerce","Witnesses everywhere; authority arrives quickly."],["The Docking Ring","Multiple Escape Routes","Ships are parked here; leaving is suddenly easy."],["The Communication Array","Signal Advantage","Whoever holds this can call for help - or jam everyone else."]],
      current_issues: [
        {name:"The Blockade Has Gone Up",desc:"Three cruisers from the Colonial Authority are stopping all traffic into the Outer Belt. No stated reason. Ships not complying are impounded.",faces:[{name:"Admiral Vorn Ironwake",role:"Commanding the blockade - not happy about it either"}],places:["Jump Gate Kappa-7","The Outer Belt Stations"]},
        {name:"The Colony Ships Are Missing",desc:"Four colony transports carrying 12,000 settlers left on schedule. None arrived. The Authority isn't looking. Someone has to.",faces:[{name:"Mission Director Neela Stellarborn",role:"Filed the report; been told to un-file it"}],places:["The Last Known Trajectory","Unmapped Sector Kappa-Null"]},
        {name:"The Station Is Under New Management",desc:"Deepport Station changed hands two weeks ago. The new owners aren't corp, aren't pirate, aren't authority. Nobody knows who they are or what they want.",faces:[{name:"The Station Manager (unknown identity)",role:"Polite, efficient, and watching everything"}],places:["Deepport Station","The Outer Belt Trade Routes"]},
        {name:"The Salvage Rights War",desc:"A derelict ship of extraordinary value has been located. Five parties hold partial claims. The first to strip the wreck keeps it. Violence has already started.",faces:[{name:"Salvager Brynn Far-Range",role:"Holds the most defensible claim - barely"}],places:["The Derelict - Designation Unknown","Neutral Arbitration Station Theta"]}
      ],
      impending_issues: [
        {name:"First Contact Was Made Without Us",desc:"A transmission has been received from beyond known space. The Authority received it four months ago. They haven't responded - or told anyone.",faces:[{name:"Intelligence Director Oryn Coldvac",role:"Has read the translation; looks scared"}],places:["The Deep Array Listening Post","Classified - Location Redacted"]},
        {name:"The Drive Technology Is Failing",desc:"The jump drive technology that makes the whole network viable is based on an alien artefact nobody fully understands. It's degrading. Fast.",faces:[{name:"Chief Engineer Sev Driftmark",role:"Has the data; doesn't have the solution"}],places:["The Jump Gate Network","The Original Artefact - Location Classified"]},
        {name:"The Separatist Fleet Is Ready",desc:"The Colonial Separatist movement has quietly assembled a fleet. They're one bad decision by the Authority away from declaring war.",faces:[{name:"General Quell Systemfall",role:"Commanding the separatist forces - reluctantly"}],places:["Hidden Dock in the Outer Belt","The Colonial Parliament Station"]},
        {name:"Something Followed Us Back",desc:"The deep-space survey team returned. Three survived. They won't say what happened. Their ship has been broadcasting a signal on an alien frequency ever since.",faces:[{name:"Survivor Zira the Uncharted",role:"Knows exactly what followed them; can't bring herself to say"}],places:["Quarantine Bay 7","Deep Space - Where They Went"]},
      ],
      setting_aspects: {
          t: [
            "The {SsActor} {SsAct}",
            "{SsResource} Is {SsWorth}",
            "Every {SsThing} Has {SsProp}",
            "{SsTruth} - {SsConseq}",
          ],
          v: {
            SsActor: ["Authority", "Corps", "Void", "Jump Gates", "Outer Belt", "First Contact Protocols", "Ship Registry", "Deep Space", "Belt Communities", "Corp Legal Division", "Jump Gate Authority", "Alien Signal", "Colonial Charter", "Deep Space Survey", "Independent Haulers", "Outer Systems"
            ],
            SsAct: ["has jurisdiction wherever it can project force", "own everything inside the beacon signal", "holds what you put into it", "are chokepoints and whoever controls them knows it", "makes its own law and enforces it", "were written by people who never made contact", "records everyone who's ever used them", "remembers what goes into it"],
            SsResource: ["Jump Coordinates", "Ship Registration", "Authority Clearance", "Salvage Rights", "First Contact Records", "Off-Grid Routes", "Crew Loyalty", "A Working Drive", "Belt Settlement Access", "A Functioning Drive", "Jump Coordinates", "Authority Clearance Override", "First Contact Evidence", "Water Reclamation Tech", "Colonial Legal Standing"
            ],
            SsWorth: ["the only currency that works in the belt", "power until someone else registers the same point", "what separates operating from detained", "older than the treaty and binding regardless", "the most dangerous thing in charted space", "worth the warrant it attracts"],
            SsThing: ["jump point", "treaty", "salvage claim", "first contact record", "colonial charter", "distress signal", "black box", "derelict"],
            SsProp: ["a prior claimant", "a corp interest", "an authority file", "a story that doesn't match the manifest", "a price somebody's willing to pay", "more interested parties than the official record shows"],
            SsTruth: ["Known space is smaller than the charts suggest", "The authority's reach ends at the beacon signal", "Out here your ship is your nation", "Salvage rights are the only rights nobody disputes", "First contact protocols were written by optimists", "The void remembers what goes into it", "The corps own the infrastructure and therefore the people", "Belt-born bones don't lie about where you grew up", "First contact was made - the question is what they were told", "A ship is a nation of one and some nations are at war"
            ],
            SsConseq: ["and what's outside the charts is someone else's problem", "and past it you're operating without a net", "and it's a nation of one", "and everyone disputes the finder's share", "and nothing making contact was consulted", "and it's been accumulating for a long time", "and they price access accordingly", "and inners will never fully understand that", "and the translation has been sitting in a classified folder for four months", "and some of those wars have been ongoing for a long time without anyone declaring them"
            ],
          }
        },
      opposition: [
        {name:"Security Patrol",type:"minor",aspects:["Authority-Backed and Armed"],skills:[{name:"Fight",r:2},{name:"Shoot",r:2},{name:"Notice",r:1}],stress:2,stunt:null,qty:3},
        {name:"Pirate Crew",type:"minor",aspects:["Desperate and Experienced"],skills:[{name:"Fight",r:2},{name:"Shoot",r:2},{name:"Athletics",r:2}],stress:2,stunt:null,qty:4},
        {name:"Combat Drone",type:"minor",aspects:["No Self-Preservation Protocol"],skills:[{name:"Shoot",r:3},{name:"Athletics",r:2}],stress:2,stunt:"+2 to attack targets who haven't moved this exchange.",qty:2},
        {name:"Fleet Operative",type:"major",aspects:["Authority of the Colonial Fleet","Expendable for Mission Success"],skills:[{name:"Shoot",r:4},{name:"Fight",r:3},{name:"Notice",r:3},{name:"Stealth",r:2}],stress:3,stunt:"Once per scene, call in Authority backup - a minor NPC squad arrives next exchange.",qty:1},
        {name:"Pirate Captain",type:"major",aspects:["Owns These Lanes","My Crew Follows Into the Void"],skills:[{name:"Fight",r:3},{name:"Provoke",r:4},{name:"Drive",r:3},{name:"Contacts",r:2}],stress:3,stunt:"+2 to Provoke when invoking a reputation aspect on someone who knows your name.",qty:1},
        {name:"Belt Militia",type:"minor",aspects:["Defending Their Own Rock", "Seen This Before and Have Opinions About It"],skills:[{name:"Shoot",r:3}, {name:"Athletics",r:2}, {name:"Notice",r:2}],stress:2,stunt:"In their home zone, belt militia defend at +2 - they know every handhold and blind spot.",qty:3},
        {name:"Corp Security Specialist",type:"major",aspects:["Contract-Backed Legal Authority", "Expendable and Knows It", "This Is Just a Job and the Job Is Thorough"],skills:[{name:"Fight",r:4}, {name:"Shoot",r:4}, {name:"Investigate",r:3}, {name:"Notice",r:2}],stress:3,stunt:"Once per scene, invoke a legal warrant to compel compliance - target must overcome Will 3 or defer for one exchange.",qty:1},
        {name:"Alien Presence",type:"major",aspects:["Does Not Share Your Reference Frame", "Has Been Here Much Longer", "Is Not Hostile - It Simply Does Not Account for You"],skills:[{name:"Physique",r:5}, {name:"Notice",r:4}, {name:"Will",r:3}],stress:4,stunt:"Conventional weapons do half stress against the alien presence unless invoking an aspect that represents understanding its nature.",qty:1},
        {name:"Desperate Survivor",type:"minor",aspects:["Nothing Left to Lose", "Has Already Made a Decision About This"],skills:[{name:"Fight",r:2}, {name:"Provoke",r:3}, {name:"Will",r:3}],stress:2,stunt:"Survivor ignores their first mild consequence each scene - they've had worse.",qty:1}
      ],
      twists: ["A ship on the long-range scan is on intercept - fifteen minutes out.","The station's automated defence system comes online.","A civilian is caught in the crossfire - and broadcasting it live.","The mission target isn't on this ship - they jumped two hours ago.","An unexpected party claims legal salvage rights to the location.","Life support has been sabotaged - everyone has four exchanges before the air changes.","An alien vessel emerges from a previously unknown jump point.","The ship's AI makes an independent decision - and it's not wrong.","A distress signal starts broadcasting from inside the location.","One of the opposition is working against their own crew.","The derelict isn't derelict. It's been waiting.","Gravity reverses in one zone. The cause is unknown.","A second ship with identical transponder codes just docked.","The alien entity makes contact - in a language one PC somehow understands.","The station administrator arrives. They have jurisdiction and questions.","The cargo opens from the inside.","Jump point collapse: the only route out has closed.","The ship AI makes an autonomous decision that is correct and troubling.","A cryo pod opens. The occupant has been in there for forty years.","The opposition leader reveals they're trying to stop something worse.","Authority response is seventeen minutes out. Closer than expected.","One of the opposition was a passenger on the colony ship.","The weapon system has a dead-man trigger.","The signal that started this is transmitting again - from inside the ship.","Fleet jurisdiction has just been extended to this sector. As of now."],
      victory: ["Extract with the cargo/person intact.","Capture the ship without destroying it.","Reach the jump gate before the blockade tightens.","Broadcast the signal before it can be jammed.","Survive until the rendezvous window opens.","Disable the weapon system before it fires.","Get the ship to jump before the Authority fleet arrives.","Broadcast the signal before the jamming array comes fully online.","Recover the black box before the wreck falls into the gravity well.","Neutralise the boarding party before they reach the bridge.","Hold the docking bay for three exchanges until passengers are loaded.","Disable the weapon system before it cycles to firing position.","Translate the alien message before the fleet fires.","Escape the debris field before the structural failure cascades.","Get the colony ship's beacon active before it crosses the dead zone.","Complete the data transfer before the connection window closes."],
      defeat: ["The cargo is jettisoned or destroyed.","The ship is impounded; the crew is arrested.","The jump gate closes - no escape this route.","The signal is jammed and the Authority gets there first.","A crew member is left behind.","The weapon fires; the consequences are enormous.","The ship is impounded, crew detained for questioning.","The jump window closes - no route out for a week.","The weapon fires. The consequences are enormous and public.","The cargo is confiscated and the client is very unhappy.","A crew member is left behind. Not voluntarily.","The colony ship makes it through without the warning.","The Authority gets the data first.","The alien contact is broken and cannot be re-established.","The route they discovered is now in Fleet records.","The ship is damaged beyond quick repair in uninhabited space."],

      seed_locations: [
        "A derelict colony ship drifting inside an asteroid belt with its emergency beacon on",
        "A jump gate station at the edge of authority jurisdiction with a customs officer who asks too many questions",
        "An alien megastructure that has been emitting a repeating signal for ninety years",
        "A black-market station hidden inside a declared exclusion zone",
        "A mining colony that went silent forty hours ago and is broadcasting normally again",
        "A diplomatic neutral-zone station currently hosting three factions who share no common language",
        "An authority fleet staging point that the fleet seems to have abandoned in a hurry",
        "A gas giant research platform studying something that is no longer in the gas giant",
        "A first-contact quarantine station that has exceeded its intended isolation period by a decade",
        "A generation ship one jump from its destination with a governance crisis onboard",
        "A salvage claim over a destroyed battle station still contested by two fleets",
        "A colony that has declared independence and is technically in a state of war with its parent authority",
        "A jump point that routes through a region of space that navigation charts mark as empty",
        "An alien ruin that is being excavated by a corporation with no academic credentials",
        "A waystation at the intersection of three smuggling routes that everyone denies using",
        "A belt settlement whose water reclamation is failing and whose corp supplier has stopped answering comms",
        "A generation ship one jump from its destination - its governance has collapsed and three factions hold different decks",
        "A gas giant extraction platform where the corp was running a classified project and the last transmission was screaming",
        "A jump point that has begun appearing on charts that previously showed empty space - opened from the other side",
        "A derelict military vessel from the authority's last war, intact, broadcasting on a frequency the war ended",
        "A station that was declared uninhabitable two years ago and now has a population of several hundred who have nowhere else to go",
        "An alien structure in a debris field that is measurably larger than it was when the survey logged it",
        "A corp's private research station where the staff rotation never arrived and the installed team hasn't called home",
        "A neutral trade hub where three smuggling networks are maintaining a truce over shared infrastructure that is about to break",
        "A colony on a moon that has been surviving without authority support for eleven years and wants it to stay that way",
        "A wrecked authority gunship in contested belt territory - the weapons systems are intact and both sides want them",
        "A refuelling depot at the edge of charted space where ships heading out never seem to come back from",
        "An alien contact site that was sealed under corp embargo and has since become the most wanted address in the sector",
        "A hospital ship that has been operating in the outer systems for thirty years without a home port - independent, respected, and currently in trouble",
        "A jump gate construction site where the workforce has downed tools and the corp is calling it a labour dispute and the workers are calling it something else"
      
      ],
      seed_complications: [
        "The jump gate to the exit route is currently locked by authority order",
        "A ship with unknown markings is holding position just outside sensor range",
        "The station's life support is being deliberately managed to limit the party's options",
        "One crew member's biometrics are flagged on the station's entry manifest from a previous visit",
        "The contact is alive but compromised - everything they say is being monitored",
        "A derelict in the vicinity is not as derelict as it appears",
        "The authority ship arrives six hours ahead of schedule",
        "The alien signal the party is investigating has changed since the mission briefing",
        "The cargo the party is carrying turns out to be exactly what the opposition is looking for",
        "The station administrator has a personal stake in the outcome and has not disclosed it",
        "A second buyer appears - better funded, more dangerous, and apparently better informed",
        "The route back requires passing through a region where a battle is currently ongoing",
        "The information the party was given is six months out of date and the situation has changed",
        "Someone has already been through this location and taken the most useful thing",
        "The alien presence in the area responds to the mission's activity in an unexpected way",
        "The party's ship is the only one that can reach the objective in time - and it is not rated for that route",
        "The authority has placed a corridor hold on the system - no traffic in or out without a reason that holds up",
        "The person the party was sent to find has become the person who sent someone to find the party",
        "The location's life support is functional but being managed remotely - by someone who knows the party is coming",
        "The belt community the party needs help from remembers the last Inner crew that came asking for something",
        "The alien presence in the area has already interacted with the opposition - in a way that changed them",
        "The corp's legal team is already en route with authority to claim anything salvaged - they are three hours behind",
        "The ship's drive can make this run or the run home, but not both, and the engineer has not told the captain",
        "The route the party planned passes through a debris field that was not debris when the charts were made",
        "The contact the party was counting on has changed sides since the briefing - apparently not involuntarily"
      
      ],
      seed_objectives: [
        "Retrieve a black box from a wreck before the authority fleet arrives to claim salvage rights",
        "Get a refugee convoy through a blockade without triggering an incident",
        "First contact with an alien presence that has been making itself increasingly obvious",
        "Prevent a corporation from triggering an interstellar incident to cover a commercial objective",
        "Locate a missing ship that carries information that will change a current treaty",
        "Extract a scientist from a research station that has been placed under authority quarantine",
        "Deliver a diplomatic message that three factions are trying to intercept",
        "Stop a weapons test that will destroy a nominally neutral colony as collateral",
        "Find out what destroyed an authority patrol that was investigating something it wasn't supposed to",
        "Negotiate a mining dispute before the involved parties escalate to violence",
        "Recover an alien artefact that has been stolen from a species that has taken notice",
        "Get a ship operational before the window to use it closes permanently",
        "Identify the informant inside a resistance cell before the authority uses the information",
        "Reach a colony with medical supplies before the outbreak becomes uncontainable",
        "Deliver a labour organiser to a belt settlement before the corp's security team intercepts them",
        "Recover the survey team's data before the corp's cleanup crew reaches the site",
        "Find out what the authority is burying in the sector's abandoned station before they finish burying it",
        "Get the belt settlement's water reclamation part before the corp's embargo locks the last supply run",
        "Stop the corp's weapons test before it destroys the asteroid that three hundred people call home",
        "Locate the ship that went dark carrying twelve families of colonists and report back - honestly",
        "Prevent the alien contact site from being sterilised by an authority response team that doesn't understand what it found",
        "Get the settlement's independence petition to the colonial assembly before the corp buys the swing vote",
        "Extract the corp's whistleblower from a station that is currently in corp jurisdiction",
        "Find what is eating the survey probes at the edge of charted space before the authority decides to blame the colonists"
      
      ],
      compel_situations: [
        "Your ship's registration is flagged at this station - the flag predates you owning it",
        "The authority inspector is thorough, courteous, and is about to find something",
        "The alien presence responds to your specific biosignature in a way others have not triggered",
        "Your crew owes fuel debt at this station and the station master has not forgotten",
        "The distress signal is genuine and you are the closest ship",
        "Your military record means you are recognised by the officer who just boarded",
        "Your nav computer has the only charts for this route - both sides know it",
        "The fugitive you're carrying has just been publicly identified on a station broadcast",
        "The derelict's configuration matches something from your own past",
        "Your weapons are the only thing between the colony and what is coming",
        "The alien artefact interacts with your specific genetic profile and will not respond to others",
        "You are owed a favour by the person you most need to be neutral right now",
        "The jump point calculation requires a level of skill only one person aboard has",
        "The station's systems identify you as an authority operative - a classification you no longer hold",
        "Helping the colony means violating your current contract",
        "Your ship is the fastest thing in this system - and the job requires the fastest thing",
        "The alien signal is clearly directed at you specifically",
        "Your engineer's modifications are the only reason this station is still operational",
        "The smuggled cargo is something you have strong personal reasons to care about",
        "The authority warrant is technically valid and technically applying to you right now",
        "The beacon is active and you are the closest ship - by a margin that makes ignoring it legally complicated",
        "The belt workers recognise your ship and your history with the corp that employs them and are deciding what to do about it",
        "Your ship's registry flags the authority scanner before you can stop it",
        "The wounded alien is clearly intelligent, clearly in pain, and the med-bay protocols do not cover this species",
        "The sample your cargo hold contains has begun reacting to the ship's environmental systems",
        "The corp security team has a warrant that covers everything on this station - including you",
        "The settlement's children are watching and the adults have run out of options and are now looking at you",
        "Your navigator is the only person who can calculate the jump in time and they are currently detained",
        "The dying ship has twelve crew and your ship has rated capacity for eight",
        "The alien contact is responding to your specifically - not the ship, not the crew - and the crew has noticed",
        "The corp's whistleblower knows something that makes your current contract significantly more complicated",
        "The black box you're carrying records the moment that would end three careers, including yours",
        "Your ship is faster than anything else in range and the colony has eight hours of air",
        "The authority officer who just boarded served with you in the fleet and knows what you did and did not do",
        "The jump you need to make requires burning the last of the drive reserve - making the return trip theoretical"
      
      ],
      compel_consequences: [
        "Your ship is impounded pending investigation - for a duration nobody will specify",
        "The inspection finds something - not what you expected, but something",
        "The alien contact singles you out in a way that makes the rest of your crew uncomfortable",
        "The fuel debt is paid - in a currency you had not planned to spend",
        "You divert to the distress signal and arrive to find a situation considerably worse than a distress",
        "Your record marks you as a person of interest in a current investigation",
        "Both sides gain something from your charts that you wanted only one side to have",
        "The fugitive's presence triggers a station lockdown",
        "Investigating the derelict delays your objective by a margin you cannot recover",
        "You win the engagement but the colony now needs you - indefinitely",
        "The artefact activates in a way that commits you to a course you had not chosen",
        "Calling in the favour changes the person's neutrality in a direction that helps one problem and creates another",
        "The calculation is made but the one who made it is now known to both sides as the navigator of record",
        "The authority status creates an obligation you cannot ignore without confirming you have abandoned it",
        "The colony is safe; your contract is void; the client is hostile",
        "You answer the beacon. What you find is not a rescue situation - it is a decision situation.",
        "The belt workers help you. The cost is that you are now known to be on their side, which means known to be against the corp.",
        "The scanner flag triggers an inspection that is thorough and finds something you had categorised as not a problem.",
        "You treat the alien. It survives. It is now aboard your ship and has opinions about where it is going.",
        "The sample does something to the ship's systems. The something is not immediately catastrophic. The word 'immediately' is doing work.",
        "The warrant is enforced. You comply. You are now inside corp jurisdiction with everything that entails.",
        "You do the thing the settlement needed. They are safe. You now have eight additional people who have nowhere else to go.",
        "The navigator is released in time. The jump is made. The authority now knows the navigator mattered.",
        "You make twelve fit in eight's space. The jump is survivable for most of them.",
        "The alien contact singles you out. The crew's questions are reasonable and you do not have good answers.",
        "The whistleblower's information is genuine. Acting on it changes your relationship with your current employer permanently.",
        "You copy the black box first. You are now the only other person with the information and everyone who wants it destroyed knows it.",
        "The colony survives. Your ship does not have the fuel to make the return run without a stop at a station that has warrants for you.",
        "Your old fleet colleague lets you go. They have now committed a career-ending act of discretion and they know it.",
        "The jump is made. The ship is now committed to wherever the coordinates lead with nothing left to get home on."
      
      ],
      challenge_types: [
        {name: "Ship-to-Ship Boarding", desc: "Take or defend a ship in close quarters before the other crew can seal the critical sections", primary: "Fight and Athletics", opposing: "Defenders' knowledge of their own ship's layout and their desperation", success: "Section secured; objective achieved inside the target ship", failure: "Repelled to vacuum - or trapped inside a ship that is now controlled by the other side"},
        {name: "Authority Inspection", desc: "Get through a thorough official inspection without anything prohibited being found", primary: "Deceive and Resources", opposing: "The inspector's thoroughness and their suspicion level", success: "Cleared; on your way with cover intact", failure: "Detained for further questioning - or worse, something found"},
        {name: "Deep Space Navigation", desc: "Plot a route through hazardous space on incomplete charts before fuel or time runs out", primary: "Lore and Crafts", opposing: "Cumulative navigation errors and environmental hazards", success: "Destination reached with margin to spare", failure: "Arrival delayed or off-target - in space, that has consequences"},
        {name: "Diplomatic Summit", desc: "Broker agreement between factions that have every reason to fail to agree", primary: "Rapport and Empathy", opposing: "Each faction's non-negotiables and the outside parties trying to sabotage the summit", success: "Framework agreed; hostilities suspended", failure: "Summit collapses - and you are blamed by at least one side"},
        {name: "First Contact Protocol", desc: "Establish enough mutual understanding with an alien presence to prevent a violent misunderstanding", primary: "Empathy and Lore", opposing: "Communication barriers, cultural assumptions, and the alien's own agenda", success: "Contact established; intentions clarified", failure: "Misunderstanding escalates - the alien presence now has a negative association with your species"},
        {name: "Race to the Wreck", desc: "Reach a specific location in contested space before the opposition does", primary: "Pilot (Drive) and Crafts", opposing: "The opposition's resources, route, and willingness to fire first", success: "First on site; objective secured before contestation begins", failure: "Arrived simultaneously or second - now it's a negotiation or a fight"},
        {name: "Station Sabotage", desc: "Destroy or disable a specific system without triggering a full station lockdown", primary: "Crafts and Stealth", opposing: "Station security, redundant systems, and time pressure", success: "System disabled; objective achieved; exit clean", failure: "Partial damage and full alarm - now you need to fight your way out"},
        {name: "Alien Ruins Expedition", desc: "Navigate and extract something valuable from a structure built by minds that thought differently", primary: "Lore and Investigate", opposing: "The structure's remaining mechanisms and the physical hazards of age and alien engineering", success: "Objective found and extracted safely", failure: "Lost or trapped inside - and something in the structure knows you are here"},
        {name: "Belt Community Negotiation", desc: "Win the trust of a belt or colonial settlement that has every reason not to trust anyone coming from inner space", primary: "Rapport and Empathy", opposing: "Justified historical grievance, community self-protection instinct, and the corp representative who got there first", success: "Trust extended; community cooperates; the party has a debt they will be glad to carry", failure: "Refused - and the community's position has hardened in a way that will take longer than available to change"},
        {name: "Jury-Rig Under Fire", desc: "Restore a critical ship system while the ship is taking damage and the engineer is the only person who knows where things are", primary: "Crafts and Physique", opposing: "Accumulating damage, time pressure, and whatever is causing the damage continuing to cause it", success: "System restored; crisis averted; the ship is flyable", failure: "Partial repair - the system holds for now and the now has an expiry"},
        {name: "Alien Artefact Containment", desc: "Prevent an alien object or entity from causing uncontrolled consequences in a populated environment", primary: "Lore and Will", opposing: "The artefact's behaviour, which does not respond to human threat models, and the time it takes for understanding to catch up", success: "Contained or redirected; damage limited; understanding marginally increased", failure: "Not contained - consequences are happening and the party is now managing a crisis instead of preventing one"},
        {name: "Frontier Justice Hearing", desc: "Achieve a just outcome in a dispute adjudicated by a community with its own law and no interest in outside authority", primary: "Contacts and Rapport", opposing: "The community's history with the type of person the party appears to be and the other party's prior relationship with the adjudicators", success: "Ruling in the party's favour; standing in the community increased", failure: "Ruling against - and challenging it marks the party as the kind of people who don't respect local law"}
      ],

      consequence_mild: [
        "Plasma Burn on the Forearm",
        "Ringing Ears from the Hull Strike",
        "Suit Breach - Patched but Pressure Low",
        "Grazed by the Flechette Burst",
        "Zero-G Tumble Left the Knee Wrong",
        "Hands Shaking from the Hard Burn",
        "Eyes Still Adjusting from the Flash",
        "Bruised from the Decompression Wave",
        "Cracked Visor, Vision Partially Obscured",
        "Dazed from the EMP Pulse",
        "Minor Burn from the Console Surge",
        "Wrist Sprained in the Emergency Seal",
        "Suit Seal Degraded - Not Critical But Not Comfortable",
        "Ringing Head from the Pressure Wave",
        "Wrenched Shoulder from the Hard Dock Impact",
        "Singed Palm from the Conduit Burst",
        "Cracked Visor Lens - Periphery Obscured",
        "Mild Radiation Exposure - Nausea Cycling"
      
      ],
      consequence_moderate: [
        "Gunshot Wound, Sealed but Not Treated",
        "Suit Compromised - Fifteen Minutes of Air Left",
        "Concussed from the Bulkhead Impact",
        "Leg Pinned by Debris, Extracted but Damaged",
        "Neural Interface Glitching from the EMP",
        "Radiation Exposure - Nausea and Cognitive Fog",
        "Shoulder Dislocated in the Hard Dock",
        "Fragmentation Hit - Shrapnel Still in There",
        "Lung Bruised from the Pressure Wave",
        "Hand Burned to the Bone from the Plasma Conduit",
        "Ship Registry Flagged - Authority Knows the Name",
        "Jump Drive Trauma - Can't Navigate Straight",
        "Deep-Space Decompression Trauma - Body Still Adjusting",
        "Suit Breach Sealed With Foam - Twelve Minutes of Air",
        "Fracture From the Zero-G Impact",
        "Neural Interface Feedback - Piloting Is Now Unreliable",
        "Belt Sickness Triggered by the Acceleration - Can't Keep Anything Down",
        "Arm Pinned and Freed - Freed Is Relative"
      
      ],
      consequence_severe: [
        "Suit Integrity Gone - Dependent on Others for Air",
        "Internal Bleeding That Needs a Med-Bay Now",
        "Neural Burn Has Taken Piloting Precision Offline",
        "Bone Fracture in Vacuum - Every Movement Costs",
        "Ship Is Destroyed - Everything Was On That Ship",
        "Bounty Upgraded to Kill-on-Sight",
        "Radiation Poisoning - Timeline Now Measured in Weeks",
        "Witnessed Something the Authority Will Bury Along With Me",
        "Long-Term Radiation Exposure - Timeline Now Has an End Date",
        "Belt Bone Loss Triggered by the G-Force - Moving Without Pain Is No Longer Simple",
        "Ship Registration Burned Across the Sector - Every Port Has the Name",
        "Alien Contact Residue - Something Changed and Nobody Knows What Yet"
      
      ],
      consequence_contexts: [
        "during the firefight in the station cargo hold",
        "when the hull breach propagated faster than the seals could follow",
        "pushing the drive past its rated output",
        "taking a hit to protect the crew",
        "during the EVA when the tether failed",
        "when the ambush in the docking bay was better-planned than expected",
        "when the boarding action went loud before anyone was ready",
        "in the decompression event that took out the cargo section",
        "pushing through the radiation corridor to reach the drive",
        "during the EVA when the tether failed at the worst point"
      
      ],
      faction_name_prefix: [
        "Outer",
        "Deep",
        "Void",
        "Free",
        "Ghost",
        "Iron",
        "New",
        "Last",
        "Drift",
        "Far",
        "Colonial",
        "Belt",
        "Open",
        "Hardvac",
        "Drifter"
      
      ],
      faction_name_suffix: [
        "Collective",
        "Compact",
        "Initiative",
        "Syndicate",
        "Assembly",
        "Coalition",
        "Front",
        "Network",
        "League",
        "Council",
        "Union",
        
        "Fleet",
        "Cooperative",
        "Circuit"
      
      ],
      faction_goals: [
        "Control the only known stable jump route to the outer systems",
        "Expose the authority's classified first-contact cover-up",
        "Establish a free port outside authority jurisdiction in the asteroid belt",
        "Corner the market on unregistered jump coordinates",
        "Destroy the corp's xenotech research programme before it goes operational",
        "Negotiate an independent colonial charter for three currently-claimed worlds",
        "Build a fleet capable of enforcing their own law in the outer systems",
        "Recover and control the derelict generation ship and its contents",
        "Establish belt communities' right to self-governance under colonial law before the authority votes on the Outer Systems Compact",
        "Break the corp's monopoly on jump coordinate registration in the outer belt",
        "Maintain the alien contact blackout until humanity is ready - as defined by this faction - to handle it",
        "Connect every independent settlement in the outer systems to a mutual aid network the authority cannot disrupt"
      
      ],
      faction_methods: [
        "Placing agents in authority logistics divisions",
        "Running a legitimate salvage operation as cover for intelligence gathering",
        "Using encrypted dead-drop networks across the station circuit",
        "Controlling fuel depot access as economic leverage",
        "Operating a grey-market courier network that moves more than freight",
        "Bribing authority customs officers for manifest blindness",
        "Maintaining a network of sympathetic station administrators",
        "Using a legal advocacy front to monitor and frustrate authority operations",
        "Running a network of independent freight haulers who carry more than freight",
        "Maintaining unlicensed medical and technical support for settlements the corps have abandoned",
        "Operating an encrypted comm network that routes through the alien signal - nobody official has decoded either",
        "Placing people inside corp logistics chains to redirect essential supplies toward belt settlements"
      
      ],
      faction_weaknesses: [
        "Their encrypted comm network uses a cipher the authority cracked eight months ago",
        "Two senior members are authority informants for different departments",
        "Their fuel supply is controlled by a corp that suspects what they're doing",
        "A recent operation went public in a way that's drawn authority attention",
        "Their best ship was seized and the pilot hasn't been heard from since",
        "They owe safe passage to a faction they now need to move against",
        "The jump coordinates that fund them are degrading - the route is closing",
        "Their leadership council requires unanimous votes to act, and it's gridlocked",
        "Their network depends on ships that are held together with improvisation and goodwill - either can fail",
        "The faction's most effective operator has been operating independently for long enough to have developed independent goals",
        "Their strongest political argument relies on records that the corp has a legal claim to suppress",
        "The alliance between inner-system sympathisers and outer-system communities is held together by one person who is currently missing"
      
      ],
      faction_face_roles: [
        "the navigator who holds the only copy of the jump coordinates",
        "the station administrator who provides legitimate cover",
        "the pilot who handles extractions and can't be replaced",
        "the authority mole providing advance warning",
        "the arms dealer who supplies the fleet and sets the price accordingly",
        "the idealist founder whose principles complicate every practical decision",
        "the belt-born medic who maintains the faction's credibility with the outer settlements",
        "the former authority navigator who provides route intelligence and charges nothing - which means they want something else",
        "the ship captain who runs the deep routes and whose vessel is three repairs from becoming permanent",
        "the corp defector who brought two years of manifest data and whose motives are still being evaluated"
      
      ],
      complication_types: [
        "Hull event",
        "Uninvited arrival",
        "Aspect change",
        "System failure",
        "Deadline introduced",
        "Collateral threat",
        "Authority response",
        "Alien factor"
      ],
      complication_aspects: [
        "Hull Breach - Pressure Dropping, Clock Is Running",
        "Authority Transponder Sweep - We're Being Queried",
        "The Drive Signature Is Being Tracked - Someone Followed Us",
        "Civilian Ship in the Crossfire - Can't Ignore It",
        "Comms Are Being Jammed - No Way to Call for Help",
        "The Station Is Entering Emergency Lockdown",
        "Docking Clamps Have Engaged - We're Not Leaving Without Permission",
        "Radiation Spike - Suits Required, Movement Restricted",
        "The Manifest Is Wrong - Whatever We're Carrying Isn't What We Were Told",
        "Weapons Systems Are Non-Responsive - Defence Only",
        "A Second Ship Just Dropped Out of Nowhere",
        "Life Support Is on Reserve - Time Limit Now Applies to Everything",
        "The Ship's AI Has Developed an Opinion About This Situation and Is Expressing It Operationally",
        "Hull Stress Reading Critical - One More Hit and It's a Different Kind of Problem",
        "The Belt Settlement's Water Is Running Out Faster Than Anyone Expected",
        "Authority Jurisdiction Just Extended to This Sector - As of Twenty Minutes Ago",
        "The Alien Signal Has Intensified - Whatever It Was Doing, It Is Doing More of It",
        "The Corp's Legal Team Has Arrived and Has Standing to Claim Everything Here"
      
      ],
      complication_arrivals: [
        "An authority patrol responding to an anonymous tip",
        "A bounty hunter with a current contract on someone in the party",
        "A derelict that is not as empty as its registry suggests",
        "A corp rapid response team with legal authority to board",
        "An alien vessel - no known registry, no known language",
        "A ship claiming distress that is better-armed than distress requires",
        "A belt prospector whose claim overlaps with the party's objective and who has a legal record of being here first",
        "A corp cleanup team with authority to sterilise the site - they are not primarily interested in witnesses",
        "An alien vessel that is not attacking and is not leaving and is clearly waiting for something",
        "A refugee shuttle that has overshot its destination and is running out of consumables"
      
      ],
      complication_env: [
        "Gravity plate failure - the fight is now in zero-g",
        "Solar flare - all electronics have sixty seconds before they need to be shielded",
        "Debris field - piloting requires Overcome rolls to move between zones",
        "Plasma conduit rupture - one zone is now a lethal hazard",
        "Emergency bulkheads seal - the party is now split between zones",
        "Power transfer to weapons - life support is on reserve, timer starts now",
        "Solar particle event - unshielded electronics fail; suit comms are down; navigation is manual",
        "Micrometeor impact sequence - the hull is taking grazing hits on a timer; someone needs to be outside",
        "Gravity plate cascade failure - different zones now have different gravity, none of them predictable",
        "Alien atmospheric chemistry intrusion - the life support is filtering it but not fast enough"
      
      ],
      backstory_questions: [
        "What happened to the last ship you called home, and who was responsible?",
        "What jump coordinate do you carry in your head that you've never filed with any registry?",
        "Who do you owe safe passage to, and what happens if you can't deliver?",
        "What did you find in the outer belt that you reported as nothing, and what was it really?",
        "What does your official registry say about you that isn't true, and who wrote it?",
        "What authority regulation do you follow that others in your line of work don't, and why?",
        "Who taught you your most critical skill, and what happened to them?",
        "What cargo did you carry once that you've never told anyone about?",
        "What species or culture do you understand better than most humans, and how did that happen?",
        "What is the one port you won't dock at, and what would happen if you had no choice?",
        "What did you see at the edge of charted space that the authority would classify if you reported it?",
        "What are you trying to get back to, and how many years has it been?",
        "What does your ship know about you that you haven't told the crew?",
        "What is the job you turned down that you think about, and why did you turn it down?",
        "What is the one thing about the outer systems that you believe and can't prove?",
        "What did you see happen to the last crew you were part of, and how honest has your telling been?",
        "What does your ship know about you that you have not told anyone aboard her?",
        "What belt settlement did you grow up in, leave behind, and have complicated feelings about returning to?",
        "What corp contract did you take once that you still think about, and what did it ask you to do?",
        "What alien thing did you encounter that no authority record mentions, and where did you encounter it?",
        "Who did you strand in the outer systems and what was the reason you told yourself was sufficient?",
        "What is the modification to your ship that is not in the registry and would be a significant problem if found?",
        "What is the distress call you ignored once, and what do you know or believe happened to the people who sent it?",
        "What does the belt remember about you that the inner systems do not, and which version is more accurate?",
        "What promise did you make to someone in cryo who is still waiting, and are you going to keep it?"
      
      ],
      backstory_hooks: [
        "You all have the same ghost in your ship's registry. Someone put it there without asking.",
        "You were hired separately. The job description is different for each of you. The destination is the same.",
        "The derelict your ship found has a manifest that lists every one of you by name. It's forty years old.",
        "You each received a distress signal from a different source. The coordinates were identical.",
        "Each of you received the same route coordinates from a different source. None of your sources are currently reachable.",
        "You were all on the same station when it was evacuated. You all made it out. A lot of people did not. You have not compared notes on why.",
        "Your ships all have the same hull modification - identical, at a level below standard inspection tolerance. None of you ordered it.",
        "A corp legal notice has been served to each of you individually. You are each named as a witness to the same event. None of you remember attending it."
      
      ],
      backstory_relationship: "Go around the group. Each player names one other PC and answers: *What run did you do together, and what was the thing neither of you reported to the person who hired you?* Then each player names a second PC and answers: *What do you know about their history with the authority that they haven't volunteered?*",
    },
  };

// ═══════════════════════════════════════════════════════════════════════
// CONTENT EXPANSION - v9.1 (Void Runners)
// Inspirations: Firefly, The Expanse, Cowboy Bebop, Alien
// ═══════════════════════════════════════════════════════════════════════
(function(){var t=CAMPAIGNS.space.tables;

t.opposition = t.opposition.concat([
  {name:"Station Militia - Pressed Into Service", type:"minor", aspects:["Didn't Sign Up for This"], skills:[{name:"Shoot",r:2},{name:"Will",r:1}], stress:1, stunt:null, qty:4},
  {name:"Salvage Claim Jumper", type:"minor", aspects:["First Come, First Served, First to Shoot"], skills:[{name:"Shoot",r:2},{name:"Drive",r:3}], stress:2, stunt:null, qty:3},
  {name:"Authority Customs Cutter", type:"major", aspects:["Legal Mandate and Heavy Weapons","Your Transponder Is on File","Every Inspection Is a Fishing Expedition"], skills:[{name:"Shoot",r:5},{name:"Notice",r:4},{name:"Investigate",r:3},{name:"Drive",r:3}], stress:6, stunt:"Can demand a ship halt and submit to inspection - refusing justifies pursuit and boarding.", qty:1},
  {name:"Xenoparasite Colony", type:"minor", aspects:["They Get Inside and Multiply"], skills:[{name:"Stealth",r:3},{name:"Fight",r:2}], stress:1, stunt:null, qty:6},
  {name:"Decommissioned War Drone", type:"major", aspects:["Obsolete But Still Lethal","Corrupted Friend-or-Foe Logic","Armored Like a Small Ship"], skills:[{name:"Shoot",r:5},{name:"Fight",r:4},{name:"Physique",r:4}], stress:6, stunt:"Once per scene, switch targeting criteria - allies become targets and enemies friendlies for one exchange.", qty:1},
  {name:"Fuel Depot Guard", type:"minor", aspects:["Protecting Corporate Property, Not People"], skills:[{name:"Shoot",r:2},{name:"Notice",r:2}], stress:2, stunt:null, qty:3},
  {name:"Ghost Ship AI", type:"major", aspects:["The Crew Is Gone But the Ship Remembers","Lonely Enough to Be Dangerous","Controls Every System"], skills:[{name:"Lore",r:4},{name:"Deceive",r:4},{name:"Crafts",r:3},{name:"Provoke",r:3}], stress:3, stunt:"Can vent atmosphere, lock bulkheads, or kill gravity in any zone on its ship as a free Create Advantage at +4.", qty:1},
  {name:"Pirate Boarding Party", type:"minor", aspects:["Mag-Boots and Breaching Charges"], skills:[{name:"Fight",r:3},{name:"Athletics",r:2}], stress:2, stunt:null, qty:4},
  {name:"Corporate Repo Agent", type:"major", aspects:["Your Ship Was Never Yours - Read the Contract","Pleasant Until the Paperwork Runs Out","Has Done This a Hundred Times"], skills:[{name:"Resources",r:5},{name:"Rapport",r:4},{name:"Deceive",r:3},{name:"Fight",r:2}], stress:3, stunt:"+2 to Create Advantage using legal or financial leverage against targets with debts.", qty:1},
  {name:"Void Kraken Juvenile", type:"major", aspects:["Silhouette Bigger Than the Ship","Curious Not Hostile - Until Provoked","Tentacles Reach Multiple Zones"], skills:[{name:"Fight",r:5},{name:"Physique",r:5},{name:"Athletics",r:3}], stress:6, stunt:"Attacks two adjacent zones simultaneously. If it grapples the ship, escape requires Fantastic +6 overcome with Drive.", qty:1},
  {name:"Scrapyard Guard Dog - Cybernetic Mastiff", type:"minor", aspects:["Sensor Suite Better Than Yours"], skills:[{name:"Notice",r:3},{name:"Fight",r:2},{name:"Athletics",r:2}], stress:2, stunt:null, qty:2},
]);

t.zones = t.zones.concat([
  ["The Airlock - Between Worlds", "One Button From Vacuum", "The ultimate leverage; everything here can be vented."],
  ["The Mess Hall", "Tables Bolted Down, Everything Else Isn't", "Improvised weapons everywhere; tight quarters."],
  ["The Docking Collar", "Two Ships, One Seal", "Controlled chokepoint; cutting the collar separates the ships."],
  ["Asteroid Surface - Low Gravity", "Every Step Is a Leap of Faith", "Movement is Athletics-based; ranged attacks drift."],
  ["The Scrapyard", "Mountains of Dead Ships", "Dense cover; unstable terrain; something might still have power."],
  ["The Smuggler's Hold - False Floor", "It's Not on the Schematics", "Hidden zone; discovery requires Investigate at +3."],
  ["The Station Bazaar", "Everyone's Armed, Nobody's Shooting", "Neutral ground; violence breaks the truce."],
  ["The Reactor - Do Not Fire Weapons", "Breach Means Everyone Dies", "Absolute stakes; no ranged combat."],
  ["EVA - Tethered to the Hull", "Silence and Vertigo", "Zero-g; radio communication only; drift hazard."],
  ["The Captain's Quarters", "Personal Effects and Hidden Safes", "Small; defensible; the ship's last resort."],
]);

t.complication_arrivals = t.complication_arrivals.concat([
  "A distress beacon activates - genuine rescue or pirate bait?",
  "An authority patrol not scheduled in this sector for another week",
  "A passenger not on the manifest who won't explain where they came from",
  "A ship matching one reported destroyed two years ago, transponder and all",
  "A salvage drone attached to the hull and already cutting",
  "A corporate courier with a priority docking request that overrides yours",
  "A lifeboat with a single survivor who claims everyone else was taken",
  "The previous owner of the ship, with a legal claim and a boarding party",
]);

t.complication_env = t.complication_env.concat([
  "Micrometeorite shower - the hull takes hits and patches aren't holding",
  "Reactor enters emergency cooling - minimal power for 3 exchanges",
  "A comm buoy broadcasts the party's position on an open channel",
  "Artificial gravity rotates 90 degrees - the wall is now the floor",
  "Solar storm disrupts navigation - the ship is flying blind",
  "Air recycler fails - oxygen is now a countdown",
  "A sealed bulkhead opens, revealing a section that shouldn't exist",
  "The jump drive charges on its own - someone is accessing the ship remotely",
]);

t.backstory_hooks = t.backstory_hooks.concat([
  "The ship's previous captain left a locked compartment. You all signed on knowing it was there. None of you know what's inside.",
  "You each owe a different person money. All three debts were bought by the same entity last week.",
  "One of you is not who their papers say. The rest suspect but haven't asked.",
  "The coordinates in the dead pilot's log point to a place on no chart. You all recognized the star pattern.",
  "You served on the same station before decommissioning. What happened there was classified. You all remember different versions.",
  "Someone left a crate on board at the last port. Addressed to all of you. It's ticking.",
  "The ship's AI calls one of you by a different name. It won't explain why.",
]);

t.consequence_contexts = t.consequence_contexts.concat([
  "when the bulkhead blew and decompression pulled you into the corridor",
  "catching shrapnel from the hull breach in the cargo bay",
  "taking a fall in zero-g that ended against the reactor housing",
  "when the pirate's boarding axe found the gap in the pressure suit",
  "radiation exposure from the unshielded engine core",
  "crash landing on the asteroid surface without adequate braking",
  "when the airlock cycled with you still inside",
  "the concussion from the exploding fuel cell",
]);

t.faction_face_roles = t.faction_face_roles.concat([
  "the dockmaster who controls berth assignments and can strand you",
  "the quartermaster whose supply chain is the faction's real power",
  "the comms officer who intercepts everything and reports selectively",
  "the retired captain whose reputation opens doors the leadership can't",
  "the station bartender who is the real information broker",
  "the shipyard mechanic who knows every vessel's weakness",
  "the customs inspector who can be bribed but remembers every bribe",
  "the fuel trader who sets prices for the entire sector",
]);

t.complication_types = t.complication_types.concat([
  "System Failure - a critical ship system goes down at the worst time",
  "Claim Dispute - someone else has legal or traditional rights to the prize",
  "Stowaway - an uninvited presence changes the dynamics",
  "Signal - an unexpected transmission changes everything the party knew",
]);

t.current_issues = t.current_issues.concat([
  "The Fuel Monopoly - One corporation controls the refineries. Prices double every quarter. Ships that can't pay get impounded.",
  "Ghost Fleet - Decommissioned warships vanish from the scrapyard. Someone is rebuilding them. No one knows who.",
]);

t.impending_issues = t.impending_issues.concat([
  "The Quarantine Zone - Authority sealed an entire sector. No ships in or out. The official reason doesn't match the refugee stories.",
  "The Signal - Every ship received the same transmission last month. Coordinates and a date. The date is approaching.",
]);

})();

// ═══════════════════════════════════════════════════════════════════════
// AUDIT FIXES - v9.2 (Void Runners)
// Named Authority, ship culture, shipboard NPC vars, issue normalization
// ═══════════════════════════════════════════════════════════════════════
(function(){var t=CAMPAIGNS.space.tables;

// The Authority is now named and has internal factions
t.setting_aspects.t = t.setting_aspects.t.concat([
  "The Colonial Transit Authority - Bureaucracy With Battleships. They Tax the Routes They Don't Patrol and Patrol the Routes They Don't Understand.",
  "The CTA Has Two Factions - the Bureau of Navigation (cartographers and scientists, mostly reasonable) and Enforcement Division (warships and zero tolerance, not reasonable at all)",
  "The Ship Is the Fifth Crew Member - It Has a Personality Whether You Want It To or Not",
  "Jump Transit Is Not Instantaneous - It Takes Forty Minutes of Sensory Deprivation and Nobody Comes Out Quite the Same Twice",
]);

// Shipboard NPC variables
t.minor_concepts.v.SmAdj = t.minor_concepts.v.SmAdj.concat([
  "engine-greased", "bulkhead-calloused", "atmo-recycled", "berth-born",
  "drift-adapted", "hull-scarred", "cargo-class", "void-pale",
]);

// Ship-life compels
t.compel_situations = t.compel_situations.concat([
  "The ship's air recycler is overdue for maintenance. The headaches have started.",
  "Your bunk is four feet from the person you trust least on this vessel. You heard them talking in their sleep.",
  "The ship has a personality and right now it disagrees with the pilot's course correction.",
]);

// CTA faction face roles
t.faction_face_roles = t.faction_face_roles.concat([
  "the CTA Navigation Bureau cartographer who genuinely wants to map the unknown and doesn't care whose jurisdiction it disrupts",
  "the CTA Enforcement Division commander whose career depends on the next arrest quota",
  "the retired CTA admiral whose navigation charts are worth more than the pension they replaced",
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
