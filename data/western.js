// ═══════════════════════════════════════════════════════════════════════════
// data/western.js  —  Dust and Iron  (Frontier / Western)
// BL-08: Frontier western world — 7th campaign for Ogma
//
// Voice: Hard-earned, spare, bone-dry. The land is hostile and the law
// is whoever's holding the gun. Loyalty is currency. History is a wound.
// ═══════════════════════════════════════════════════════════════════════════

CAMPAIGNS["western"] = {
  meta: {
    id:      "western",
    name:    "Dust and Iron",
    tagline: "Frontier justice. Railroad money and the weight of the old war.",
    icon:    "★",
    font:    "'Georgia', serif",
  },
  colors: {
    bg:"#1a0f06", panel:"#241508", border:"#3d2510",
    gold:"#d4924a", accent:"#c07830", dim:"#5a3818",
    text:"#e8d5b8", muted:"#2a1a0a", textDim:"#8a6840",
    red:"#c03020", blue:"#4a7890", green:"#507040",
    tag:"rgba(192,120,48,0.15)", tagBorder:"rgba(192,120,48,0.35)",
    orbA:"rgba(192,120,48,0.12)", orbB:"rgba(160,90,20,0.07)",
    campBg:"linear-gradient(160deg,#1a0f06 0%,#2d1a08 30%,#0f0804 100%)",
  },
  lightColors: {
    accent:"#8B4513", dim:"#A0522D", gold:"#6B3410",
    tag:"rgba(139,69,19,0.08)", tagBorder:"rgba(139,69,19,0.20)",
    orbA:"rgba(192,120,48,0.10)", orbB:"rgba(160,90,20,0.07)",
    campBg:"linear-gradient(160deg,#FFF8F0 0%,#FFF0DC 40%,#F8EED8 100%)",
  },
  tables: {

    // ── Names ──────────────────────────────────────────────────────────────
    names_first: [
      "Elias","Colton","Rafe","Hector","Silas","Jasper","Luther","Virgil",
      "Cord","Decker","Wes","Buck","Trace","Cash","Dade","Holt","Clem",
      "Ada","Nora","Bess","Clara","Ida","Ramona","Lupe","Delia","Vera",
      "Mae","Rosa","Josephine","Hazel","Ruth","Cecilia","Alma","Estelle",
    ],
    names_last: [
      "Alcott","Brannigan","Calhoun","Devereaux","Ellison","Farrow",
      "Garza","Holt","Irons","Jarvis","Kincaid","Laramie","Morrow",
      "Navarro","Oakes","Pruitt","Quinn","Reyes","Sutter","Tate",
      "Underhill","Valdez","Wace","Xantos","Yancey","Zorn",
      "Delgado","Blackwood","Rourke","Crane","Bauer","Holloway",
    ],

    // ── Minor NPC concepts ─────────────────────────────────────────────────
    minor_concepts: {
      t: [
        "{DmAdj} {DmRole} from {DmOrigin}",
        "{DmRole} with a {DmFlaw}",
        "{DmAdj} {DmRole} who {DmAct}",
      ],
      v: {
        DmAdj:    ["worn-out","desperate","cunning","hard-drinking","shiftless",
                   "loyal","crooked","trigger-happy","wary","proud"],
        DmRole:   ["drifter","ranch hand","card sharp","stage driver","miner",
                   "saloon girl","bounty hunter","telegraph man","sutler","preacher"],
        DmOrigin: ["back East","the war","the border","the territories","nowhere worth naming"],
        DmFlaw:   ["gambling debt","grudge to settle","past to outrun","sickness coming on"],
        DmAct:    ["asks too many questions","knows the wrong people","owes the wrong man",
                   "saw something they shouldn't","talks when they should listen"],
      },
    },

    // ── Minor weaknesses ───────────────────────────────────────────────────
    minor_weaknesses: [
      "Owes money to the wrong man",
      "Can't bluff to save their life",
      "Drinks before noon",
      "Yellow when it matters",
      "Talks when they should stay quiet",
      "Loyalty lasts until the cash runs out",
      "Flinches at gunfire",
      "Wanted in the next county",
      "Old war wound slows them down",
      "Can't turn down a wager",
      "Reads people wrong every time",
      "Holds a grudge longer than is healthy",
      "Trusts the boss more than the facts",
      "Too proud to ask for help",
      "Running from a name they used to wear",
    ],

    // ── Major NPC concepts ─────────────────────────────────────────────────
    major_concepts: {
      t: [
        "{CmajTitle} who {CmajDrive}",
        "The {CmajRole} of {CmajTurf}",
        "{CmajAdj} {CmajRole} with {CmajSecret}",
        "{CmajRole} who {CmajDrive} and {CmajAlt}",
      ],
      v: {
        CmajAdj:    ["feared","respected","broken","calculating","righteous","corrupt",
                     "dangerous","aging","ambitious","haunted"],
        CmajTitle:  ["The Marshal","The Rancher","The Preacher","The Widow","The Colonel",
                     "The Madam","The Banker","The Outlaw","The Engineer","The Cattle Baron"],
        CmajRole:   ["lawman","land baron","railroad agent","outlaw queen","circuit preacher",
                     "company man","war veteran","border smuggler","range detective","mine foreman"],
        CmajDrive:  ["built this territory from nothing","owns everyone who matters",
                     "came here to die in peace","wants one thing no one will give them",
                     "has a score to settle before they go"],
        CmajAlt:    ["won't break the law to do it","has already broken worse",
                     "needs someone else to pull the trigger","doesn't care what it costs"],
        CmajTurf:   ["the valley","the railhead","the mesa","the border crossing",
                     "the silver claim","the cattle route","the county seat"],
        CmajSecret: ["a warrant back East","blood on their hands from the war",
                     "a family they walked away from","the proof they've been buying the judges",
                     "a price on their head older than this town"],
      },
    },

    // ── Troubles ───────────────────────────────────────────────────────────
    troubles: [
      "Wanted dead or alive in three counties",
      "The railroad wants this land and won't stop",
      "The last honest lawman just rode out",
      "A debt that won't let you leave town",
      "Every decision made on an empty stomach",
      "Blood feud older than either side remembers",
      "Name that opens some doors and closes others",
      "War record that follows wherever I go",
      "The money isn't mine and the man knows it",
      "Born on the wrong side of the border for these parts",
      "A face known to too many marshals",
      "The only skill I have is the one that gets people killed",
      "The company owns the sheriff and the judge",
      "Can't stop looking for the man who killed my father",
    ],

    // ── Other aspects ──────────────────────────────────────────────────────
    other_aspects: {
      t: [
        "{COAdj} {CODomain} {COVerb}",
        "{COSubj} in {CODomain}",
        "{COAct} the {COThing}",
        "{COState} but {COResolve}",
      ],
      v: {
        COAdj:    ["iron","cracked","borrowed","bloodied","earned","dead man's"],
        CODomain: ["reputation","iron","trail","saddlebag","frontier","law"],
        COVerb:   ["that precedes me","that opens doors","I haven't earned"],
        COSubj:   ["fastest gun","last honest broker","best tracker","only doctor"],
        COAct:    ["rode with","ran from","buried","burned"],
        COThing:  ["Pinkerton","company","marshal","gang","old crew"],
        COState:  ["unarmed","broke","wanted","alone"],
        COResolve:["not helpless","not finished","not done yet","still dangerous"],
      },
    },

    // ── Stunts ─────────────────────────────────────────────────────────────
    stunts: [
      {name:"Dead-Eye",skill:"Shoot",
       desc:"+2 to attack when you have a moment to aim and your target isn't in cover.",type:"bonus"},
      {name:"Quick Draw",skill:"Shoot",
       desc:"+2 to Shoot on the first exchange of a gunfight when you acted on a surprise.",type:"bonus"},
      {name:"Hard Rider",skill:"Physique",
       desc:"+2 to overcome obstacles involving riding or endurance on horseback.",type:"bonus"},
      {name:"Trail Sense",skill:"Notice",
       desc:"+2 to notice tracks, ambush signs, or weather changes in the open country.",type:"bonus"},
      {name:"Silver Tongue",skill:"Rapport",
       desc:"+2 to create advantage when convincing someone with a story or flattery.",type:"bonus"},
      {name:"Frontier Medicine",skill:"Lore",
       desc:"+2 to overcome when treating wounds with frontier means and no proper supplies.",type:"bonus"},
      {name:"Bluff the Law",skill:"Deceive",
       desc:"+2 to overcome or defend when feeding false information to a lawman.",type:"bonus"},
      {name:"Shake 'Em Down",skill:"Provoke",
       desc:"+2 to create an advantage by intimidating someone into revealing information.",type:"bonus"},
      {name:"Poker Face",skill:"Deceive",
       desc:"+2 to defend against Empathy when hiding your intentions at a card table or parley.",type:"bonus"},
      {name:"Range Instinct",skill:"Athletics",
       desc:"+2 to defend against Shoot when in open terrain with room to move.",type:"bonus"},
      {name:"Hardscrabble Living",skill:"Physique",
       desc:"Once per scene, reduce a mild consequence from physical hardship to a 1-shift stress hit instead.",type:"special"},
      {name:"Known Name",skill:"Rapport",
       desc:"Once per scene, invoke your reputation to open a door — getting an audience, a favour, or information.",type:"special"},
      {name:"Favours Owed",skill:"Contacts",
       desc:"Once per session, call in a debt — someone in town has to help you, no questions asked.",type:"special"},
    ],

    // ── Scene setup ────────────────────────────────────────────────────────
    scene_tone: [
      "High noon heat. No shade anywhere.",
      "Wind carries dust and the smell of something dead.",
      "The quiet before the other shoe drops.",
      "Everyone in the room knows something you don't.",
      "Money is changing hands and it isn't yours.",
      "The law is here, but not on your side.",
      "Someone's been waiting for this moment a long time.",
      "Rain coming in. Everyone's in a hurry to get somewhere.",
    ],
    scene_movement: [
      "Main street — wide open, nowhere to hide","Narrow alley — one way in, one way out",
      "Saloon floor — tables and bodies in the way","Cliff trail — one misstep ends it",
      "Rail car in motion — everything shifts","Dry creek bed — low ground, exposed",
      "Livery stable — dark, horses skittish","Church — cover and witnesses",
    ],
    scene_cover: [
      "Water trough","Overturned wagon","Barrel stack",
      "Hitching post","Church pew","Door frame","Boulder","Horse carcass",
    ],
    scene_danger: [
      "Civilian in the line of fire","Burning building nearby",
      "Horses stampeding","Support beam failing","Flash flood coming",
      "Dynamite in the wrong hands","Second shooter on the roof","Law arriving fast",
    ],
    scene_usable: [
      "Rope and pulley rig","Loose board hatch","Unsecured gun rack",
      "Barrels of gunpowder","Panicked horse tied nearby","Oil lantern",
      "Heavy safe in the corner","Locked strongbox on the counter",
    ],

    // ── Zones ─────────────────────────────────────────────────────────────
    zones: [
      ["Main Street","Exposed and Watched","Everyone on the street is a witness — or a shot waiting to happen."],
      ["The Saloon","Noise and Confusion","Crowd covers movement; a wrong word here echoes everywhere."],
      ["The Jailhouse","Iron Bars and Hard Floor","One door in. One door out. The keys are on the lawman's belt."],
      ["Open Range","Nothing Between You and the Horizon","No cover. Long sight lines. Distance is life or death."],
      ["The Mine Shaft","Dark and Close","Sound carries differently. One lantern between everyone."],
      ["The Rail Depot","Noise and Smoke","Trains mask sound and movement; strangers come and go without notice."],
    ],

    // ── Current issues ─────────────────────────────────────────────────────
    current_issues: [
      {name:"The Railroad Survey Gang",
       desc:"Cartographers and hired muscle have been marking land that people live on. The stakes go in at dawn."},
      {name:"A Hanging With No Trial",
       desc:"Someone was strung up last week. The wrong people are asking questions, and the right people won't answer."},
      {name:"The Wells Are Going Dry",
       desc:"Three homesteads have gone under. The cause is upstream, and upstream belongs to the Harker Company."},
      {name:"Cattlemen vs. Farmers",
       desc:"The fence lines are going up and the grass wars have started. The town is choosing sides."},
    ],
    impending_issues: [
      {name:"Silver Strike Rumour",
       desc:"Someone found colour in the creek. When word spreads, every speculator and claim-jumper within two days' ride will be here."},
      {name:"Pinkerton Contract",
       desc:"Someone hired detectives. No one local knows who — or who they're looking for."},
      {name:"Army Withdrawal",
       desc:"The garrison is pulling out. What the soldiers kept away will come back with interest."},
      {name:"The Old Blood Feud Wakes Up",
       desc:"The Morrow boy rode back into town. His father's enemies haven't forgotten."},
    ],

    // ── Setting aspects ────────────────────────────────────────────────────
    setting_aspects: {
      t: [
        "{CsActor} {CsAct} {CsResource}",
        "{CsWorth} in {CsDomain}",
        "{CsThing} {CsProp}",
        "{CsTruth} and {CsConseq}",
      ],
      v: {
        CsActor:  ["The Harker Company","The railroad","The territorial governor",
                   "The circuit judge","The Cattlemen's Association"],
        CsAct:    ["owns","controls","has bought","is buying","just lost"],
        CsResource:["the water rights","the land title","the sheriff's loyalty",
                    "the only bridge","the contract for the army supply route"],
        CsWorth:  ["A man's word","A woman's deed","A gun","A horse"],
        CsDomain: ["this territory means everything","the wrong hands","this economy"],
        CsThing:  ["The stage route","The telegraph line","The land office"],
        CsProp:   ["changes everything","is compromised","is the only path forward",
                   "runs through land that isn't theirs"],
        CsTruth:  ["The law is for sale","Money built this town","Justice rode out"],
        CsConseq: ["everyone knows it","no one says it","the debt is coming due",
                   "the reckoning is close"],
      },
    },

    // ── Opposition ─────────────────────────────────────────────────────────
    opposition: [
      {name:"Company Enforcer",type:"minor",
       aspects:["On the Harker Payroll"],
       skills:[{r:3,name:"Shoot"},{r:2,name:"Physique"},{r:1,name:"Provoke"}],
       stress:[true,true,true]},
      {name:"Crooked Deputy",type:"minor",
       aspects:["The Badge Is a Prop"],
       skills:[{r:3,name:"Provoke"},{r:2,name:"Shoot"},{r:1,name:"Deceive"}],
       stress:[true,true,true]},
      {name:"Bounty Hunter",type:"moderate",
       aspects:["Paid to Bring You In Alive — Mostly","Knows the Frontier Cold"],
       skills:[{r:4,name:"Shoot"},{r:3,name:"Athletics"},{r:2,name:"Notice"},{r:1,name:"Physique"}],
       stress:[true,true,true,true]},
      {name:"Railroad Foreman",type:"major",
       aspects:["The Company Stands Behind Me","Hired Thirty Men Last Week","The Schedule Does Not Bend"],
       skills:[{r:5,name:"Resources"},{r:4,name:"Provoke"},{r:3,name:"Contacts"},{r:2,name:"Shoot"},{r:1,name:"Physique"}],
       stress:[true,true,true,true],consequences:["mild","moderate"]},
    ],

    // ── Twists ─────────────────────────────────────────────────────────────
    twists: [
      "The law arrives — but they're on the other side",
      "Someone in the room has been watching since the start",
      "The deal was already made before you got here",
      "The witness turns out to know a great deal more",
      "The fire you didn't start is being blamed on you",
      "The money isn't where it's supposed to be",
      "The man you're looking for is already dead",
      "An old face from the war shows up at the worst moment",
      "The thing everyone came here for doesn't exist",
      "The person you trusted has been bought",
    ],
    victory: [
      "The deed is yours — if you can hold it",
      "The guilty party faces justice, whatever that means out here",
      "The town has one more day before the next problem rides in",
      "You walked out with what you came for and nothing you didn't want",
      "The railroad route changes and the land stays in the right hands",
    ],
    defeat: [
      "You ride out with less than you came in with",
      "The company gets the land and the town pays the price",
      "Another name gets added to the list of the missing",
      "The crooked badge stays on and the honest man leaves",
      "Everything you protected is now in someone else's hands",
    ],

    // ── Adventure seeds ────────────────────────────────────────────────────
    seed_locations: [
      "a ghost town that isn't quite empty","the last honest assayer in the territory",
      "a Pinkerton safe house","the railroad's land office","a disputed claim shack",
      "the county jail","a river crossing with a toll","the army's abandoned fort",
      "a medicine show camp","a remote homestead with fresh graves",
    ],
    seed_complications: [
      "the witness is the most wanted man in the territory",
      "the deed was forged by the man who filed it",
      "the cattle were rustled by the rancher's own son",
      "everyone in town knows the truth and no one will say it",
      "the Pinkertons arrived yesterday and haven't left the hotel",
      "the water was poisoned from upstream and no one will touch the Harkers",
      "the circuit judge has a brother on the wrong side of this",
    ],
    seed_objectives: [
      "get the deed before the land office opens",
      "get a witness out of the territory alive",
      "find who is rustling the Reyes herd before the range war starts",
      "stop the hanging long enough to ask one question",
      "deliver the payroll before the company men intercept it",
      "find the surveyor's notes before they become law",
    ],

    // ── Compels ────────────────────────────────────────────────────────────
    compel_situations: [
      "Your reputation arrives before you do — and it isn't helpful",
      "The person you need to trust is the same person you can't",
      "Your past comes through the door at exactly the wrong moment",
      "The easy path would mean crossing a line you said you wouldn't",
      "Doing the right thing means breaking the law you've been hired to uphold",
      "Your loyalty is being tested by someone who doesn't deserve it",
      "The money would solve everything — if you could live with where it came from",
    ],
    compel_consequences: [
      "Now the marshal is looking for you too",
      "The town decides you were working for the company all along",
      "The honest rancher loses the land to make up for your mistake",
      "Your name shows up on the wanted board",
      "The one person who trusted you stops trusting you",
      "The blood feud you weren't part of is now yours",
    ],

    // ── Challenges ─────────────────────────────────────────────────────────
    challenge_types: [
      {name:"Trail Pursuit",
       desc:"Track a fugitive across harsh terrain before they reach the border",
       primary:"Notice (tracking), Athletics (riding)",
       opposing:"Difficult terrain, fading sign, the fugitive's lead",
       success:"Fugitive caught or cornered before they cross",
       failure:"They reach friendly territory — now it's political"},
      {name:"Homestead Defence",
       desc:"Hold a farmstead against company men until the circuit judge arrives",
       primary:"Shoot, Physique, Crafts (fortifications)",
       opposing:"Superior numbers, burning tactics, time running short",
       success:"The judge arrives and the homesteaders keep their land",
       failure:"The deed changes hands and the family rides out"},
      {name:"Negotiation at Gunpoint",
       desc:"Reach an agreement between two armed factions before the first shot",
       primary:"Rapport, Empathy, Provoke",
       opposing:"Old grievances, a hot-headed second on each side, limited time",
       success:"Terms agreed without bloodshed",
       failure:"Someone fires first — now there's a range war"},
    ],

    // ── Consequences ───────────────────────────────────────────────────────
    consequence_mild: [
      "Graze wound, arm stiff","Spooked horse, lost time",
      "Cracked rib from the pistol-whipping","Thrown from the saddle, bruised",
      "Dust in the eyes, half-blind","Burned hand from the stove",
    ],
    consequence_moderate: [
      "Bullet through the shoulder","Wanted poster going up tonight",
      "Broken leg from the fall into the ravine","Lost the horse — on foot in bad country",
      "Fever from the infected wound","The law has your description now",
    ],
    consequence_severe: [
      "Shot through and through — needs a real doctor, not a barber",
      "Name on the territorial marshal's list",
      "The reputation is gone — no one in the territory will vouch for you",
      "Hand that won't close right anymore",
    ],
    consequence_contexts: [
      "in the first exchange of the gunfight","on the open road",
      "during the ride-out","at the poker table","at the parley",
    ],

    // ── Factions ───────────────────────────────────────────────────────────
    faction_name_prefix: [
      "Harker","Consolidated","Territorial","Frontier","Iron","Mesa",
      "Red Rock","Prairie","Border","Saddleback","High Plains","Rimfire",
    ],
    faction_name_suffix: [
      "Land Company","Cattle Association","Railroad Trust","Mining Syndicate",
      "Development Corporation","Freight Service","Territorial Agency","Riders",
    ],
    faction_goals: [
      "Acquire the water rights before the spring thaw",
      "Drive the small ranchers off the disputed mesa land",
      "Control the only rail spur into the silver territory",
      "Install a compliant sheriff before the county elections",
      "Buy the territorial judge's ruling before it's filed",
      "Push the homesteaders out without triggering a range war",
    ],
    faction_methods: [
      "hired Pinkerton detectives","bought the local law","legal deed challenges",
      "sabotage and arson","intimidation through gunhands","bribery up the chain",
      "forged surveys","strangling the supply route","calling in old debts",
    ],
    faction_weaknesses: [
      "overextended across three disputed claims",
      "the foreman knows where the bodies are buried",
      "one honest clerk still works in the land office",
      "the investors back East are getting nervous",
      "they need the stage route — and someone else holds the right-of-way",
      "the hired guns are loyal to money, not the cause",
    ],
    faction_face_roles: [
      "land agent","company enforcer","bought sheriff","railroad surveyor",
      "legal counsel","range boss","company accountant","Pinkerton liaison",
    ],

    // ── Complications ──────────────────────────────────────────────────────
    complication_types: [
      {name:"Claim Jumpers",
       aspect:"This Land Has Another Name On the Deed Now"},
      {name:"Informant in the Group",
       aspect:"Someone Has Been Talking to the Company"},
      {name:"Mistaken Identity",
       aspect:"You're the Man on the Wanted Poster"},
      {name:"Supply Cutoff",
       aspect:"The Stage Isn't Coming and the Wells Are Low"},
    ],
    complication_aspects: [
      "The law is coming but it's not on your side",
      "The only help available comes with strings attached",
      "The honest path and the surviving path aren't the same",
      "Someone with money wants this to end badly for you",
      "The clock is running and the judge isn't",
    ],
    complication_arrivals: [
      "The moment the deed would have been signed",
      "When the last bullet was accounted for",
      "On the day the circuit judge was due in town",
      "Exactly when the trail went cold",
      "Right before the witness could testify",
    ],
    complication_env: [
      "a box canyon with one exit","the only road between here and the county seat",
      "the middle of a lightning storm on open range",
      "the night before the land auction",
      "the saloon during a crowded Saturday night",
    ],

    // ── Backstory ──────────────────────────────────────────────────────────
    backstory_questions: [
      "What did you do during the war that you don't talk about?",
      "Who did you ride with before you ended up here, and how did that end?",
      "What did you take that wasn't yours? What became of it?",
      "Who in this territory knows your real name?",
      "What were you trying to leave behind when you came west?",
      "What did you have to do to survive the first winter out here?",
      "Who taught you the skill you rely on most? What do you owe them?",
    ],
    backstory_hooks: [
      "An old partner shows up claiming you owe them",
      "A letter arrives from a town you left in bad shape",
      "Someone recognises you and they aren't pleased to see you",
      "A deed with your name on it turns up in the land office",
      "The man you rode against in the war is now the county sheriff",
      "A bounty poster from three territories back has just been reprinted",
    ],
    backstory_relationship: [
      "we survived the same ambush and never talked about it",
      "we're the last two people who know what happened at the crossing",
      "you pulled me off a charge that would've hanged me",
      "we want the same thing but came at it from opposite sides",
      "I owe you a debt I haven't figured out how to pay",
      "you were riding with the people I was hunting",
    ],

    // ── Obstacles ─────────────────────────────────────────────────────────
    // (Used by universal.js obstacle generator — campaign-specific flavour)
    obstacle_aspects: [
      "The Canyon Trail Is Washed Out",
      "The Stage Is Three Days Late",
      "The Sheriff Won't Open the Office",
      "A Locked Strongbox With No Key",
      "The Only Bridge Is Guarded",
      "A Flooded River Crossing",
      "Wanted in the Next County Over",
      "The Witness Won't Testify",
    ],
  }, // end tables
}; // end CAMPAIGNS["western"]
