<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { VERSION } from '$lib/version.js';

  let theme = 'dark';

  let world = $derived($page.params.world);

  const WORLD_NAMES = {
    thelongafter: 'The Long After',
    cyberpunk: 'Neon Abyss',
    fantasy: 'Shattered Kingdoms',
    space: 'Void Runners',
    victorian: 'The Gaslight Chronicles',
    postapoc: 'The Long Road',
    western: 'Dust and Iron',
    dVentiRealm: 'dVenti Realm',
  };
  let worldName = $derived(WORLD_NAMES[world] || 'Campaign Guide');

  const GUIDES = {
    fantasy: `<h1 id="main-content">✦ Shattered Kingdoms</h1>
<div class="cg-sub">Dark Fantasy - The Weight of History</div>
<p>Magic is an ecological wound left by wars that broke the world. The Blight - a slow, fungal transformation that doesn't kill but rewrites - spreads from the eastern marches. The throne is broken. The Inquisition hunts magic users. And beneath everything, the Old Oaths are waking up. The dead are rising not as enemies, but as creditors.</p>
<div class="cg-stats">
<div class="cg-stat"><b>1536+</b><span>Entries</span></div>
<div class="cg-stat"><b>20</b><span>Opposition</span></div>
<div class="cg-stat"><b>28</b><span>Stunts</span></div>
<div class="cg-stat"><b>184</b><span>Names</span></div>
<div class="cg-stat"><b>12</b><span>Challenges</span></div>
</div>


<h2>Tone & Atmosphere</h2>
<p>Low fantasy with mythic undertones. Magic has a cost - to the caster, to the land, and to the social order that fears it. The monsters are ecological consequences. The gods may be real. They are not kind.</p>
<h2>For Players</h2>
<p>You are oath-bearers, deserters, hedge-practitioners, and swords-for-hire in a kingdom coming apart. The Blight changes what it touches. The Throne demands impossible loyalties. The Inquisition considers your skills evidence of corruption.</p>
<h2>Key Factions</h2>
<p>Crown claimants (three competing courts), the Inquisition (anti-magic religious authority), mercenary companies, hedge covens (old magic, old loyalties), the Blighted (survivors who built community in the changed lands).</p>
<h2>Inspirations</h2>
<div class="cg-card"><p style="margin:0">Malazan Book of the Fallen, The Black Company, The Witcher, Dark Souls, The First Law</p></div>
<h2>Sample Troubles</h2>
<p>Every PC has a Trouble - the thing that makes their life complicated:</p>
<div class="cg-sample">Every Kingdom I Serve Eventually Falls</div>
<div class="cg-sample">The Magic Is Burning Out of Me</div>
<div class="cg-sample">I Made a Bargain I Cannot Undo</div>
<div class="cg-sample">There Are People Alive Because I Lied to Them</div>
<h2>Sample Locations</h2>
<p>Adventure seeds start here. Each suggests a situation, not just a place:</p>
<div class="cg-sample">A fortress built into a scar in the earth where a god fell</div>
<div class="cg-sample">A city beneath a city, inhabited by a population that does not acknowledge the surface</div>
<div class="cg-sample">A border crossing where three kingdoms' laws apply simultaneously and contradict each other</div>
<div class="cg-sample">A ruined mage tower with wards that are still actively hostile</div>

<h2>Building Your Character</h2>
<p>Fate Condensed characters have five aspects, a skill pyramid, one stunt, and two stress tracks. The <a href="/campaigns/character-creation?world=fantasy">Session Zero tool</a> walks you through every step — or use the guide below.</p>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 1 — Two aspects</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Your <strong>High Concept</strong> is who you are in one phrase. It can always be invoked or compelled. Your <strong>Trouble</strong> is the thing that makes your life complicated. The generator has 50+ — roll until one bites.</p>
  <div class="cg-sample">Disgraced Knight-Inquisitor Who Saw What the Blight Actually Is</div>
  <div class="cg-sample">The Magic Is Burning Out of Me</div>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 2 — Skill pyramid</strong></p>
  <p style="margin:0 0 8px;font-size:var(--text-sm);color:var(--text-dim)">Assign skills in this shape: one at +4 (Great), two at +3 (Good), three at +2 (Fair), four at +1 (Average). Everything else is +0.</p>
  <div class="cg-pyramid">
    <div class="cg-pyramid-row cg-pyramid-row--peak">+4 · Fight or Lore</div>
    <div class="cg-pyramid-row cg-pyramid-row--high">+3 · Athletics &amp; Notice</div>
    <div class="cg-pyramid-row cg-pyramid-row--mid">+2 · three skills</div>
    <div class="cg-pyramid-row cg-pyramid-row--low">+1 · Contacts &amp; three others</div>
  </div>
  <p style="margin:6px 0 0;font-size:var(--text-label);color:var(--text-muted)">Physique sets physical stress boxes (Fair +2 → 4 boxes, Good +3 → 6). Will sets mental stress boxes. Characters with neither above +0 have 3 boxes each.</p>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 3 — Stunt</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Choose one stunt from the Shattered Kingdoms list. Shattered Kingdoms stunts cover swordcraft, hedge magic, field medicine, and Blight-lore. Your refresh starts at 3; each additional stunt costs 1.</p>
</div>

<p style="font-size:var(--text-sm);color:var(--text-muted)">The <a href="/campaigns/character-creation?world=fantasy">Session Zero tool</a> handles the pyramid maths and exports a clean character sheet. If joining a live board session, the character builder runs automatically when you connect.</p>

<h2>Content Overview</h2>
<div class="cg-card"><p style="margin:0;font-size:var(--text-sm);line-height:2;color:var(--text-dim)">
<strong>NPCs:</strong> 98 first names, 86 epithets, variety-matrix concepts, 52 troubles, 28 stunts<br>
<strong>Scenes:</strong> 20 zones, 25 movement, 25 cover, 22 objects<br>
<strong>Adventures:</strong> 30 locations, 24 objectives, 25 complications<br>
<strong>Encounters:</strong> 20 opposition, 30 twists, 16 victories, 15 defeats<br>
<strong>Factions:</strong> 12 goals, 12 methods, 21 face roles<br>
<strong>Compels:</strong> 38 situations, 25 consequences
</p></div>

<div class="cg-card" style="margin-top:20px;border-color:color-mix(in srgb,var(--accent) 25%,transparent)">
  <h2 style="margin:0 0 8px;font-size:15px;color:var(--accent)">📄 Print &amp; Play — Coming Soon</h2>
  <p style="margin:0 0 0;font-size:13px;color:var(--text-dim);line-height:1.6">
    A print-ready world digest for this campaign is in the works — world lore, stat blocks, factions, and a starter scenario in one printable PDF. For now, use the generator above and jot it down the old-fashioned way.
  </p>
</div>

<div class="cg-cta">
<a href="/campaigns/fantasy" class="cg-cta-primary">🎲 Open Generator</a>
<a href="/campaigns/character-creation" class="cg-cta-secondary">🎭 Session Zero</a>
</div>
</div>

<div class="cg-guide-nav">
  <a href="/">🌍 All Worlds</a>
  <a href="/campaigns/fantasy">⚔ Open Shattered Kingdoms Generator</a>`,
    cyberpunk: `<h1 id="main-content">⬡ Neon Abyss</h1>
<div class="cg-sub">Corporate Dystopia in Meridian</div>
<p>Meridian is a vertical city where altitude equals wealth. Corporations own the infrastructure, the law, and increasingly the bodies of their employees through augmentation contracts. The street economy runs on fixers, black clinics, and data brokerage. The net is throttled by district. The augments have kill switches.</p>
<div class="cg-stats">
<div class="cg-stat"><b>1469+</b><span>Entries</span></div>
<div class="cg-stat"><b>20</b><span>Opposition</span></div>
<div class="cg-stat"><b>28</b><span>Stunts</span></div>
<div class="cg-stat"><b>109</b><span>Names</span></div>
<div class="cg-stat"><b>12</b><span>Challenges</span></div>
</div>


<h2>Tone & Atmosphere</h2>
<p>Noir-inflected techno-anxiety. The technology is personal - in your body, owned by someone else, knowing things about you that you don't. The corporations are profitable in a way that makes evil efficient.</p>
<h2>For Players</h2>
<p>You are runners, fixers, and ghosts in the machine. Your augments are your résumé and your leash. Every job pays the debt a little - and puts you deeper into someone else's ledger.</p>
<h2>Key Factions</h2>
<p>Megacorporations (OmniSec and others), street gangs (territorial), fixer networks (grey-market brokers), underground resistance, black clinics (outside the contract system), media operatives (the story is the weapon).</p>
<h2>Inspirations</h2>
<div class="cg-card"><p style="margin:0">Neuromancer, Blade Runner, Cyberpunk Edgerunners, Ghost in the Shell, Akira, Mr. Robot</p></div>
<h2>Sample Troubles</h2>
<p>Every PC has a Trouble - the thing that makes their life complicated:</p>
<div class="cg-sample">My Augments Are Corp Property and They Know It</div>
<div class="cg-sample">There's a Kill Switch I Can't Find</div>
<div class="cg-sample">I Owe Everyone and Trust No One</div>
<div class="cg-sample">The Corp Has My Family</div>
<h2>Sample Locations</h2>
<p>Adventure seeds start here. Each suggests a situation, not just a place:</p>
<div class="cg-sample">A corp server farm running a black-budget project on unlisted hardware</div>
<div class="cg-sample">A megaplex sublevel market where corp security doesn't go</div>
<div class="cg-sample">A decommissioned data vault with active ICE and no listed owner</div>
<div class="cg-sample">A luxury arcology whose internal systems have been compromised for three days</div>

<h2>Building Your Character</h2>
<p>Fate Condensed characters have five aspects, a skill pyramid, one stunt, and two stress tracks. The <a href="/campaigns/character-creation?world=cyberpunk">Session Zero tool</a> walks you through every step — or use the guide below.</p>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 1 — Two aspects</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Your <strong>High Concept</strong> is who you are in one phrase. It can always be invoked or compelled. Your <strong>Trouble</strong> is the thing that makes your life complicated. The generator has 50+ — roll until one bites.</p>
  <div class="cg-sample">Ex-Corporate Analyst With the Data That Could Burn It All Down</div>
  <div class="cg-sample">There's a Kill Switch I Can't Find</div>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 2 — Skill pyramid</strong></p>
  <p style="margin:0 0 8px;font-size:var(--text-sm);color:var(--text-dim)">Assign skills in this shape: one at +4 (Great), two at +3 (Good), three at +2 (Fair), four at +1 (Average). Everything else is +0.</p>
  <div class="cg-pyramid">
    <div class="cg-pyramid-row cg-pyramid-row--peak">+4 · Stealth or Crafts</div>
    <div class="cg-pyramid-row cg-pyramid-row--high">+3 · Notice &amp; Investigate</div>
    <div class="cg-pyramid-row cg-pyramid-row--mid">+2 · three skills</div>
    <div class="cg-pyramid-row cg-pyramid-row--low">+1 · Contacts &amp; three others</div>
  </div>
  <p style="margin:6px 0 0;font-size:var(--text-label);color:var(--text-muted)">Physique sets physical stress boxes (Fair +2 → 4 boxes, Good +3 → 6). Will sets mental stress boxes. Characters with neither above +0 have 3 boxes each.</p>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 3 — Stunt</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Choose one stunt from the Neon Abyss list. Neon Abyss stunts cover hacking, augment exploitation, social engineering, and black-market access. Your refresh starts at 3; each additional stunt costs 1.</p>
</div>

<p style="font-size:var(--text-sm);color:var(--text-muted)">The <a href="/campaigns/character-creation?world=cyberpunk">Session Zero tool</a> handles the pyramid maths and exports a clean character sheet. If joining a live board session, the character builder runs automatically when you connect.</p>

<h2>Content Overview</h2>
<div class="cg-card"><p style="margin:0;font-size:var(--text-sm);line-height:2;color:var(--text-dim)">
<strong>NPCs:</strong> 70 first names, 39 epithets, variety-matrix concepts, 50 troubles, 28 stunts<br>
<strong>Scenes:</strong> 20 zones, 25 movement, 25 cover, 22 objects<br>
<strong>Adventures:</strong> 30 locations, 24 objectives, 25 complications<br>
<strong>Encounters:</strong> 20 opposition, 25 twists, 16 victories, 16 defeats<br>
<strong>Factions:</strong> 15 goals, 12 methods, 18 face roles<br>
<strong>Compels:</strong> 35 situations, 25 consequences
</p></div>

<div class="cg-card" style="margin-top:20px;border-color:color-mix(in srgb,var(--accent) 25%,transparent)">
  <h2 style="margin:0 0 8px;font-size:15px;color:var(--accent)">📄 Print &amp; Play — Coming Soon</h2>
  <p style="margin:0 0 0;font-size:13px;color:var(--text-dim);line-height:1.6">
    A print-ready world digest for this campaign is in the works — world lore, stat blocks, factions, and a starter scenario in one printable PDF. For now, use the generator above and jot it down the old-fashioned way.
  </p>
</div>

<div class="cg-cta">
<a href="/campaigns/cyberpunk" class="cg-cta-primary">🎲 Open Generator</a>
<a href="/campaigns/character-creation" class="cg-cta-secondary">🎭 Session Zero</a>
</div>
</div>

<div class="cg-guide-nav">
  <a href="/">🌍 All Worlds</a>
  <a href="/campaigns/cyberpunk">⚔ Open Neon Abyss Generator</a>`,
    thelongafter: `<h1 id="main-content">◈ The Long After</h1>
<div class="cg-sub">Sword-and-Planet Dying Earth</div>
<p>The world ended. The world that replaced it thinks the debris is magic. Ancient Phade vaults litter a landscape of sand, fungal forests, and city-states ruled by warlords who claim divine authority because they can read the error messages. Delvers descend into the ruins to recover what was lost. The vaults are not empty. The technology is not dead.</p>
<div class="cg-stats">
<div class="cg-stat"><b>1917+</b><span>Entries</span></div>
<div class="cg-stat"><b>14</b><span>Opposition</span></div>
<div class="cg-stat"><b>28</b><span>Stunts</span></div>
<div class="cg-stat"><b>181</b><span>Names</span></div>
<div class="cg-stat"><b>16</b><span>Challenges</span></div>
</div>


<h2>Tone &amp; Atmosphere</h2>
<p>Pulp adventure with literary depth. The action is broad - sky-chases, arena fights, beast-riding - but the world asks real questions about technology, authority, and building civilisation on someone else's ruins. The Phade are not gods. The warlords know this. The people do not.</p>
<h2>For Players</h2>
<p>You are delvers, wanderers, and rebels in a world where understanding is the most valuable commodity. Phade technology grants power but changes those who use it. Every vault teaches you something - and something in the vault learns about you.</p>
<h2>Key Factions</h2>
<p>Warlord states (military theocracies built on partial Phade knowledge), delver crews (scavenger-scholars), arena circuits (blood-sport economies), Phade cults (true believers in the old gods' return), sky-city remnants (last survivors of the old civilisation).</p>
<h2>Inspirations</h2>
<div class="cg-card"><p style="margin:0">Nausicaä of the Valley of the Wind, The Book of the New Sun, Thundarr the Barbarian, Horizon Zero Dawn, She-Ra, The Dying Earth</p></div>
<h2>Sample Troubles</h2>
<p>Every PC has a Trouble - the thing that makes their life complicated:</p>
<div class="cg-sample">Cannot Resist the Pull of Forbidden Technology</div>
<div class="cg-sample">My Empire Was Built on a Lie</div>
<div class="cg-sample">The Phade Shard Is Eating My Mind</div>
<div class="cg-sample">Every Victory Costs Me Someone I Love</div>
<h2>Sample Locations</h2>
<p>Adventure seeds start here. Each suggests a situation, not just a place:</p>
<div class="cg-sample">A sealed Phade vault that began cycling open three nights ago</div>
<div class="cg-sample">A warlord's fortress built directly on top of a buried city</div>
<div class="cg-sample">The last sky-road waystation before the Deep Wastes</div>
<div class="cg-sample">An arena city where the games have been suspended without explanation</div>

<h2>Building Your Character</h2>
<p>Fate Condensed characters have five aspects, a skill pyramid, one stunt, and two stress tracks. The <a href="/campaigns/character-creation?world=thelongafter">Session Zero tool</a> walks you through every step — or use the guide below.</p>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 1 — Two aspects</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Your <strong>High Concept</strong> is who you are in one phrase. It can always be invoked or compelled. Your <strong>Trouble</strong> is the thing that makes your life complicated. The generator has 50+ — roll until one bites.</p>
  <div class="cg-sample">Vault-Born Archivist on First Surface Mission</div>
  <div class="cg-sample">The Phade Fragment in My Blood Has Opinions of Its Own</div>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 2 — Skill pyramid</strong></p>
  <p style="margin:0 0 8px;font-size:var(--text-sm);color:var(--text-dim)">Assign skills in this shape: one at +4 (Great), two at +3 (Good), three at +2 (Fair), four at +1 (Average). Everything else is +0.</p>
  <div class="cg-pyramid">
    <div class="cg-pyramid-row cg-pyramid-row--peak">+4 · Athletics or Lore</div>
    <div class="cg-pyramid-row cg-pyramid-row--high">+3 · Shoot &amp; Notice</div>
    <div class="cg-pyramid-row cg-pyramid-row--mid">+2 · three skills</div>
    <div class="cg-pyramid-row cg-pyramid-row--low">+1 · Contacts &amp; three others</div>
  </div>
  <p style="margin:6px 0 0;font-size:var(--text-label);color:var(--text-muted)">Physique sets physical stress boxes (Fair +2 → 4 boxes, Good +3 → 6). Will sets mental stress boxes. Characters with neither above +0 have 3 boxes each.</p>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 3 — Stunt</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Choose one stunt from the The Long After list. The Long After stunts cover ruin navigation, Phade identification, desert survival, and arena tactics. Your refresh starts at 3; each additional stunt costs 1.</p>
</div>

<p style="font-size:var(--text-sm);color:var(--text-muted)">The <a href="/campaigns/character-creation?world=thelongafter">Session Zero tool</a> handles the pyramid maths and exports a clean character sheet. If joining a live board session, the character builder runs automatically when you connect.</p>

<h2>Content Overview</h2>
<div class="cg-card"><p style="margin:0;font-size:var(--text-sm);line-height:2;color:var(--text-dim)">
<strong>NPCs:</strong> 121 first names, 60 epithets, variety-matrix concepts, 54 troubles, 28 stunts<br>
<strong>Scenes:</strong> 21 zones, 57 movement, 51 cover, 65 objects<br>
<strong>Adventures:</strong> 40 locations, 34 objectives, 35 complications<br>
<strong>Encounters:</strong> 14 opposition, 68 twists, 36 victories, 35 defeats<br>
<strong>Factions:</strong> 16 goals, 16 methods, 14 face roles<br>
<strong>Compels:</strong> 50 situations, 37 consequences
</p></div>

<div class="cg-card" style="margin-top:20px;border-color:color-mix(in srgb,var(--accent) 40%,transparent)">
  <h2 style="margin:0 0 8px;font-size:15px;color:var(--accent)">📄 Print &amp; Play — Go Fully Offline</h2>
  <p style="margin:0 0 10px;font-size:13px;color:var(--text-dim);line-height:1.6">
    Sometimes the best session prep is a stack of paper and a pen. This world digest gives you everything in one printable document — world lore, opposition stat blocks, factions, adventure seeds, and a three-act starter scenario. No screen required.
  </p>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
    <a href="/assets/pdf/the_long_after.pdf" download="the_long_after.pdf"
       style="display:inline-flex;align-items:center;gap:7px;background:var(--accent);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;text-decoration:none;font-family:var(--font-ui)">
      ⬇ Download PDF <span style="opacity:.75;font-weight:400">· 40pp</span>
    </a>
    <span style="font-size:11px;color:var(--text-muted)">Print · fold · play. No power needed.</span>
  </div>
</div>

<div class="cg-cta">
<a href="/campaigns/thelongafter" class="cg-cta-primary">🎲 Open Generator</a>
<a href="/campaigns/character-creation" class="cg-cta-secondary">🎭 Session Zero</a>
</div>
</div>

<div class="cg-guide-nav">
  <a href="/">🌍 All Worlds</a>
  <a href="/campaigns/thelongafter">⚔ Open The Long After Generator</a>`,
    space: `<h1 id="main-content">◯ Void Runners</h1>
<div class="cg-sub">Blue-Collar Space Western</div>
<p>The Colonial Transit Authority controls the jump routes, taxes the fuel, and enforces the law when profitable. Everyone else is trying to make the ship payment. The fuel monopoly means every job is a calculation. The Ghost Fleet suggests someone is building something. The Signal - coordinates and a date - suggests someone is expecting something.</p>
<div class="cg-stats">
<div class="cg-stat"><b>1463+</b><span>Entries</span></div>
<div class="cg-stat"><b>20</b><span>Opposition</span></div>
<div class="cg-stat"><b>28</b><span>Stunts</span></div>
<div class="cg-stat"><b>114</b><span>Names</span></div>
<div class="cg-stat"><b>12</b><span>Challenges</span></div>
</div>


<h2>Tone & Atmosphere</h2>
<p>Working-class science fiction. Ships held together by spit and the mechanic's refusal to admit what the warranty doesn't cover. Space is expensive, dangerous, and governed by people who have never been there.</p>
<h2>For Players</h2>
<p>You are crew. Your ship is your home, your livelihood, and your prison. The CTA wants transit fees. Pirates want cargo. Corporations want labour. Jump transit takes forty minutes of sensory deprivation and nobody comes out quite the same.</p>
<h2>Key Factions</h2>
<p>Colonial Transit Authority (CTA - Navigation Bureau vs. Enforcement Division), pirate fleets, corporate interests (fuel monopoly, salvage), free ports (independent stations), ghost fleet operators (unknown, well-funded).</p>
<h2>Inspirations</h2>
<div class="cg-card"><p style="margin:0">Firefly, The Expanse, Cowboy Bebop, Alien, Outlaw Star, Killjoys</p></div>
<h2>Sample Troubles</h2>
<p>Every PC has a Trouble - the thing that makes their life complicated:</p>
<div class="cg-sample">My Ship Is All I Have Left and She's Failing</div>
<div class="cg-sample">I Owe a Debt Across Three Systems</div>
<div class="cg-sample">The Fleet Wants Me for What I Know</div>
<div class="cg-sample">My Last Mission Is the Reason I Can't Go Home</div>
<h2>Sample Locations</h2>
<p>Adventure seeds start here. Each suggests a situation, not just a place:</p>
<div class="cg-sample">A derelict colony ship drifting inside an asteroid belt with its emergency beacon on</div>
<div class="cg-sample">A jump gate station at the edge of authority jurisdiction with a customs officer who asks too many questions</div>
<div class="cg-sample">An alien megastructure that has been emitting a repeating signal for ninety years</div>
<div class="cg-sample">A black-market station hidden inside a declared exclusion zone</div>

<h2>Building Your Character</h2>
<p>Fate Condensed characters have five aspects, a skill pyramid, one stunt, and two stress tracks. The <a href="/campaigns/character-creation?world=space">Session Zero tool</a> walks you through every step — or use the guide below.</p>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 1 — Two aspects</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Your <strong>High Concept</strong> is who you are in one phrase. It can always be invoked or compelled. Your <strong>Trouble</strong> is the thing that makes your life complicated. The generator has 50+ — roll until one bites.</p>
  <div class="cg-sample">Jump-Sick Pilot Who Flies Routes No One Else Will Touch</div>
  <div class="cg-sample">My Ship Is All I Have Left and She's Failing</div>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 2 — Skill pyramid</strong></p>
  <p style="margin:0 0 8px;font-size:var(--text-sm);color:var(--text-dim)">Assign skills in this shape: one at +4 (Great), two at +3 (Good), three at +2 (Fair), four at +1 (Average). Everything else is +0.</p>
  <div class="cg-pyramid">
    <div class="cg-pyramid-row cg-pyramid-row--peak">+4 · Drive or Shoot</div>
    <div class="cg-pyramid-row cg-pyramid-row--high">+3 · Notice &amp; Crafts</div>
    <div class="cg-pyramid-row cg-pyramid-row--mid">+2 · three skills</div>
    <div class="cg-pyramid-row cg-pyramid-row--low">+1 · Contacts &amp; three others</div>
  </div>
  <p style="margin:6px 0 0;font-size:var(--text-label);color:var(--text-muted)">Physique sets physical stress boxes (Fair +2 → 4 boxes, Good +3 → 6). Will sets mental stress boxes. Characters with neither above +0 have 3 boxes each.</p>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 3 — Stunt</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Choose one stunt from the Void Runners list. Void Runners stunts cover ship handling, vacuum survival, cargo negotiation, and jump navigation. Your refresh starts at 3; each additional stunt costs 1.</p>
</div>

<p style="font-size:var(--text-sm);color:var(--text-muted)">The <a href="/campaigns/character-creation?world=space">Session Zero tool</a> handles the pyramid maths and exports a clean character sheet. If joining a live board session, the character builder runs automatically when you connect.</p>

<h2>Content Overview</h2>
<div class="cg-card"><p style="margin:0;font-size:var(--text-sm);line-height:2;color:var(--text-dim)">
<strong>NPCs:</strong> 76 first names, 38 epithets, variety-matrix concepts, 50 troubles, 28 stunts<br>
<strong>Scenes:</strong> 20 zones, 25 movement, 25 cover, 22 objects<br>
<strong>Adventures:</strong> 30 locations, 24 objectives, 25 complications<br>
<strong>Encounters:</strong> 20 opposition, 25 twists, 16 victories, 16 defeats<br>
<strong>Factions:</strong> 12 goals, 12 methods, 21 face roles<br>
<strong>Compels:</strong> 38 situations, 30 consequences
</p></div>

<div class="cg-card" style="margin-top:20px;border-color:color-mix(in srgb,var(--accent) 25%,transparent)">
  <h2 style="margin:0 0 8px;font-size:15px;color:var(--accent)">📄 Print &amp; Play — Coming Soon</h2>
  <p style="margin:0 0 0;font-size:13px;color:var(--text-dim);line-height:1.6">
    A print-ready world digest for this campaign is in the works — world lore, stat blocks, factions, and a starter scenario in one printable PDF. For now, use the generator above and jot it down the old-fashioned way.
  </p>
</div>

<div class="cg-cta">
<a href="/campaigns/space" class="cg-cta-primary">🎲 Open Generator</a>
<a href="/campaigns/character-creation" class="cg-cta-secondary">🎭 Session Zero</a>
</div>
</div>

<div class="cg-guide-nav">
  <a href="/">🌍 All Worlds</a>
  <a href="/campaigns/space">⚔ Open Void Runners Generator</a>`,
    victorian: `<h1 id="main-content">⊕ The Gaslight Chronicles</h1>
<div class="cg-sub">Gothic Cosmic Horror in Gaslit London</div>
<p>The Enlightenment promised reason would banish the darkness. It lied. In the gaslit streets, the veil between the rational and the incomprehensible is very thin. The Obsidian Lodge contains what it can. Scotland Yard investigates what it understands. And beneath everything - in the fog, in the mirrors - something ancient is paying attention.</p>
<div class="cg-stats">
<div class="cg-stat"><b>1581+</b><span>Entries</span></div>
<div class="cg-stat"><b>20</b><span>Opposition</span></div>
<div class="cg-stat"><b>28</b><span>Stunts</span></div>
<div class="cg-stat"><b>249</b><span>Names</span></div>
<div class="cg-stat"><b>12</b><span>Challenges</span></div>
</div>


<h2>Tone & Atmosphere</h2>
<p>Investigative horror with a social dimension. Victorian society's rigid class structure is both shield and prison. The horror is not that the monsters exist - it's that they always have, and the rational world has been a polite agreement not to notice.</p>
<h2>For Players</h2>
<p>You are investigators, scholars, doctors, and outcasts drawn into cases that begin as mundane mysteries and end as confrontations with the incomprehensible. Your accent marks you. Your class follows you. The entities do not care about any of it.</p>
<h2>Key Factions</h2>
<p>The Obsidian Lodge (occult secret society), Scotland Yard (overwhelmed), rival lodges (competing rituals), the spiritualist movement (frauds and the genuine, indistinguishable), the entities themselves (they have rules - the rules are not in English).</p>
<h2>Inspirations</h2>
<div class="cg-card"><p style="margin:0">Penny Dreadful, From Hell, The Prestige, Lovecraft, Bram Stoker, Arthur Machen, M.R. James</p></div>
<h2>Sample Troubles</h2>
<p>Every PC has a Trouble - the thing that makes their life complicated:</p>
<div class="cg-sample">The Lodge Has Eyes in Every Institution</div>
<div class="cg-sample">My Research Has Gone Further Than I Can Come Back From</div>
<div class="cg-sample">I Know What Took My Friend and I Cannot Say It</div>
<div class="cg-sample">The Creature Left Something In My Mind</div>
<h2>Sample Locations</h2>
<p>Adventure seeds start here. Each suggests a situation, not just a place:</p>
<div class="cg-sample">A gentlemen's club whose private rooms have been sealed following a member's death</div>
<div class="cg-sample">A foreign embassy with an outbreak of incidents the ambassador cannot explain to the Foreign Office</div>
<div class="cg-sample">A railway terminus where the night train always arrives on time but the passengers are never the same ones who boarded</div>
<div class="cg-sample">A hospital wing that was closed for renovation and has not been opened - the renovation never began</div>

<h2>Building Your Character</h2>
<p>Fate Condensed characters have five aspects, a skill pyramid, one stunt, and two stress tracks. The <a href="/campaigns/character-creation?world=victorian">Session Zero tool</a> walks you through every step — or use the guide below.</p>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 1 — Two aspects</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Your <strong>High Concept</strong> is who you are in one phrase. It can always be invoked or compelled. Your <strong>Trouble</strong> is the thing that makes your life complicated. The generator has 50+ — roll until one bites.</p>
  <div class="cg-sample">Disgraced Physician Whose Patients Keep Surviving Inexplicably</div>
  <div class="cg-sample">My Research Has Gone Further Than I Can Come Back From</div>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 2 — Skill pyramid</strong></p>
  <p style="margin:0 0 8px;font-size:var(--text-sm);color:var(--text-dim)">Assign skills in this shape: one at +4 (Great), two at +3 (Good), three at +2 (Fair), four at +1 (Average). Everything else is +0.</p>
  <div class="cg-pyramid">
    <div class="cg-pyramid-row cg-pyramid-row--peak">+4 · Investigate or Lore</div>
    <div class="cg-pyramid-row cg-pyramid-row--high">+3 · Contacts &amp; Will</div>
    <div class="cg-pyramid-row cg-pyramid-row--mid">+2 · three skills</div>
    <div class="cg-pyramid-row cg-pyramid-row--low">+1 · Deceive &amp; three others</div>
  </div>
  <p style="margin:6px 0 0;font-size:var(--text-label);color:var(--text-muted)">Physique sets physical stress boxes (Fair +2 → 4 boxes, Good +3 → 6). Will sets mental stress boxes. Characters with neither above +0 have 3 boxes each.</p>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 3 — Stunt</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Choose one stunt from the Gaslight Chronicles list. Gaslight Chronicles stunts cover forensic investigation, occult scholarship, social navigation, and self-control under the uncanny. Your refresh starts at 3; each additional stunt costs 1.</p>
</div>

<p style="font-size:var(--text-sm);color:var(--text-muted)">The <a href="/campaigns/character-creation?world=victorian">Session Zero tool</a> handles the pyramid maths and exports a clean character sheet. If joining a live board session, the character builder runs automatically when you connect.</p>

<h2>Content Overview</h2>
<div class="cg-card"><p style="margin:0;font-size:var(--text-sm);line-height:2;color:var(--text-dim)">
<strong>NPCs:</strong> 135 first names, 114 epithets, variety-matrix concepts, 50 troubles, 28 stunts<br>
<strong>Scenes:</strong> 20 zones, 25 movement, 25 cover, 29 objects<br>
<strong>Adventures:</strong> 30 locations, 24 objectives, 25 complications<br>
<strong>Encounters:</strong> 20 opposition, 50 twists, 26 victories, 16 defeats<br>
<strong>Factions:</strong> 12 goals, 12 methods, 18 face roles<br>
<strong>Compels:</strong> 43 situations, 25 consequences
</p></div>

<div class="cg-card" style="margin-top:20px;border-color:color-mix(in srgb,var(--accent) 40%,transparent)">
  <h2 style="margin:0 0 8px;font-size:15px;color:var(--accent)">📄 Print &amp; Play — Go Fully Offline</h2>
  <p style="margin:0 0 10px;font-size:13px;color:var(--text-dim);line-height:1.6">
    Sometimes the best session prep is a stack of paper and a pen. This world digest gives you everything in one printable document — world lore, opposition stat blocks, factions, adventure seeds, and a three-act starter scenario. No screen required.
  </p>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
    <a href="/assets/pdf/the_gaslight_chronicles.pdf" download="the_gaslight_chronicles.pdf"
       style="display:inline-flex;align-items:center;gap:7px;background:var(--accent);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;text-decoration:none;font-family:var(--font-ui)">
      ⬇ Download PDF <span style="opacity:.75;font-weight:400">· 49pp</span>
    </a>
    <span style="font-size:11px;color:var(--text-muted)">Print · fold · play. No power needed.</span>
  </div>
</div>

<div class="cg-cta">
<a href="/campaigns/victorian" class="cg-cta-primary">🎲 Open Generator</a>
<a href="/campaigns/character-creation" class="cg-cta-secondary">🎭 Session Zero</a>
</div>
</div>

<div class="cg-guide-nav">
  <a href="/">🌍 All Worlds</a>
  <a href="/campaigns/victorian">⚔ Open The Gaslight Chronicles Generator</a>`,
    postapoc: `<h1 id="main-content">◻ The Long Road</h1>
<div class="cg-sub">The Beautiful Apocalypse</div>
<p>The world collapsed. Nature came back. The highways are forests. The cities are coral reefs of concrete and vine. Survivors scavenge what the old world left - lethal, tempting, occasionally still powered on. The Water Wars define local politics. The Reclamation Cult preaches that scavenging is sin. And somewhere, the Clean Zone draws people like a compass needle.</p>
<div class="cg-stats">
<div class="cg-stat"><b>1728+</b><span>Entries</span></div>
<div class="cg-stat"><b>15</b><span>Opposition</span></div>
<div class="cg-stat"><b>28</b><span>Stunts</span></div>
<div class="cg-stat"><b>168</b><span>Names</span></div>
<div class="cg-stat"><b>18</b><span>Challenges</span></div>
</div>


<h2>Tone & Atmosphere</h2>
<p>Lyrical post-apocalypse. The world is dangerous but beautiful. Nature is not hostile - it is indifferent, and its indifference is gorgeous. The pre-war technology is miraculous and cursed. The question is not how to survive but what kind of world you build with what you salvage.</p>
<h2>For Players</h2>
<p>You are scavengers, healers, scouts, and builders. Every piece of the old world has a price. The settlements need what you find. The road gangs want what you carry. The Reclamation Cult says what you do is blasphemy.</p>
<h2>Key Factions</h2>
<p>Settlement councils (fragile democracies), road gangs (territorial raiders), the Reclamation Cult (ruins are sacred, nature is the correction), trade caravans, vault communities (pre-war survivors emerging for the first time).</p>
<h2>Inspirations</h2>
<div class="cg-card"><p style="margin:0">The Road, Station Eleven, The Last of Us, Mad Max: Fury Road, Horizon Zero Dawn, Nausicaä</p></div>
<h2>Sample Troubles</h2>
<p>Every PC has a Trouble - the thing that makes their life complicated:</p>
<div class="cg-sample">Everything I've Built Will Outlast Everyone I've Built It With</div>
<div class="cg-sample">The Medicine That Keeps Me Going Is Running Out</div>
<div class="cg-sample">I Know What I Did to Survive Before and So Does Someone Else</div>
<div class="cg-sample">My People Trust Me and I'm Not Sure They Should</div>
<h2>Sample Locations</h2>
<p>Adventure seeds start here. Each suggests a situation, not just a place:</p>
<div class="cg-sample">A pre-war military installation whose automated defences are still functional</div>
<div class="cg-sample">A river crossing controlled by a toll collector who has been at it so long they've become a local institution</div>
<div class="cg-sample">A vault that opened six months ago and whose inhabitants are navigating the surface for the first time</div>
<div class="cg-sample">A dead city with a functioning power grid and no obvious source for the power</div>

<h2>Building Your Character</h2>
<p>Fate Condensed characters have five aspects, a skill pyramid, one stunt, and two stress tracks. The <a href="/campaigns/character-creation?world=postapoc">Session Zero tool</a> walks you through every step — or use the guide below.</p>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 1 — Two aspects</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Your <strong>High Concept</strong> is who you are in one phrase. It can always be invoked or compelled. Your <strong>Trouble</strong> is the thing that makes your life complicated. The generator has 50+ — roll until one bites.</p>
  <div class="cg-sample">Road Medic Who Knows Which Settlements Are Worth Saving</div>
  <div class="cg-sample">The Medicine That Keeps Me Going Is Running Out</div>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 2 — Skill pyramid</strong></p>
  <p style="margin:0 0 8px;font-size:var(--text-sm);color:var(--text-dim)">Assign skills in this shape: one at +4 (Great), two at +3 (Good), three at +2 (Fair), four at +1 (Average). Everything else is +0.</p>
  <div class="cg-pyramid">
    <div class="cg-pyramid-row cg-pyramid-row--peak">+4 · Notice or Crafts</div>
    <div class="cg-pyramid-row cg-pyramid-row--high">+3 · Lore &amp; Fight</div>
    <div class="cg-pyramid-row cg-pyramid-row--mid">+2 · three skills</div>
    <div class="cg-pyramid-row cg-pyramid-row--low">+1 · Contacts &amp; three others</div>
  </div>
  <p style="margin:6px 0 0;font-size:var(--text-label);color:var(--text-muted)">Physique sets physical stress boxes (Fair +2 → 4 boxes, Good +3 → 6). Will sets mental stress boxes. Characters with neither above +0 have 3 boxes each.</p>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 3 — Stunt</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Choose one stunt from the The Long Road list. The Long Road stunts cover scavenging, field medicine, road navigation, and salvage trading. Your refresh starts at 3; each additional stunt costs 1.</p>
</div>

<p style="font-size:var(--text-sm);color:var(--text-muted)">The <a href="/campaigns/character-creation?world=postapoc">Session Zero tool</a> handles the pyramid maths and exports a clean character sheet. If joining a live board session, the character builder runs automatically when you connect.</p>

<h2>Content Overview</h2>
<div class="cg-card"><p style="margin:0;font-size:var(--text-sm);line-height:2;color:var(--text-dim)">
<strong>NPCs:</strong> 110 first names, 58 epithets, variety-matrix concepts, 50 troubles, 28 stunts<br>
<strong>Scenes:</strong> 20 zones, 25 movement, 25 cover, 29 objects<br>
<strong>Adventures:</strong> 34 locations, 25 objectives, 26 complications<br>
<strong>Encounters:</strong> 15 opposition, 50 twists, 26 victories, 26 defeats<br>
<strong>Factions:</strong> 16 goals, 16 methods, 14 face roles<br>
<strong>Compels:</strong> 40 situations, 27 consequences
</p></div>

<div class="cg-card" style="margin-top:20px;border-color:color-mix(in srgb,var(--accent) 40%,transparent)">
  <h2 style="margin:0 0 8px;font-size:15px;color:var(--accent)">📄 Print &amp; Play — Go Fully Offline</h2>
  <p style="margin:0 0 10px;font-size:13px;color:var(--text-dim);line-height:1.6">
    Sometimes the best session prep is a stack of paper and a pen. This world digest gives you everything in one printable document — world lore, opposition stat blocks, factions, adventure seeds, and a three-act starter scenario. No screen required.
  </p>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
    <a href="/assets/pdf/the_long_road.pdf" download="the_long_road.pdf"
       style="display:inline-flex;align-items:center;gap:7px;background:var(--accent);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;text-decoration:none;font-family:var(--font-ui)">
      ⬇ Download PDF <span style="opacity:.75;font-weight:400">· 68pp</span>
    </a>
    <span style="font-size:11px;color:var(--text-muted)">Print · fold · play. No power needed.</span>
  </div>
</div>

<div class="cg-cta">
<a href="/campaigns/postapoc" class="cg-cta-primary">🎲 Open Generator</a>
<a href="/campaigns/character-creation" class="cg-cta-secondary">🎭 Session Zero</a>
</div>
</div>

<div class="cg-guide-nav">
  <a href="/">🌍 All Worlds</a>
  <a href="/campaigns/postapoc">⚔ Open The Long Road Generator</a>`,
    western: `<h1 id="main-content">★ Dust and Iron</h1>
<div class="cg-sub">Frontier justice. Railroad money. The weight of the old war.</div>
<p>The survey stakes went in at dawn. The Harker Company wants the land. The homesteaders pulled the stakes up. The law rides for the company. The circuit judge is two days out and the verdict is already written. You're somewhere in between — which means everybody needs something from you and nobody's going to say thank you.</p>
<div class="cg-stats">
<div class="cg-stat"><b>900+</b><span>Entries</span></div>
<div class="cg-stat"><b>14</b><span>Opposition</span></div>
<div class="cg-stat"><b>28</b><span>Stunts</span></div>
<div class="cg-stat"><b>59</b><span>Names</span></div>
<div class="cg-stat"><b>5</b><span>Challenges</span></div>
</div>


<h2>Tone &amp; Voice</h2>
<p>Hard-earned and spare. The frontier strips things down to what they actually are. People are loyal or they aren't. Land is worth what someone will kill for. The darkness in this setting comes from human choices — greed, cowardice, the specific cruelty of men with institutional backing. Violence has weight. Death is rarely poetic. The railroad is coming whether anyone wants it or not.</p>
<p>The territory is not lawless. It's worse: the law is present and it belongs to someone. Your characters are the people who aren't in that pocket — or who used to be and are trying to get out.</p>

<h2>For Players</h2>
<p>You ride with a past and a price. Every character has a debt, a reputation, and something they're trying to protect that is probably worth less than what it's going to cost them to protect it. The Troubles are the things that made you dangerous and the things that followed you here. The compels will find them. Use them first.</p>

<h2>Key Factions</h2>
<p>The Harker Company (land acquisition, bought law, corporate patience), the Cattlemen's Association (the old guard, fencing wars, diminishing leverage), the Railroad Trust (progress as inevitability, indifferent to what's in the way), homesteaders and small ranchers (the stakes are their lives and their children's lives), circuit judges and marshals (the law, such as it is, going where the money points), Pinkerton agents (hired trouble from back East, professional, thorough, loyal to the contract not the territory).</p>

<h2>Inspirations</h2>
<div class="cg-card"><p style="margin:0">Blood Meridian, Deadwood, True Grit, Lonesome Dove, No Country for Old Men, Hell on Wheels, Tombstone, The Assassination of Jesse James</p></div>

<h2>Sample Troubles</h2>
<p>Every PC has a Trouble — the thing that makes their life complicated:</p>
<div class="cg-sample">Wanted Dead or Alive in Three Counties for Three Different Reasons</div>
<div class="cg-sample">The Company Owns the Sheriff and the Judge and Probably the Clerk</div>
<div class="cg-sample">The Debt Won't Let Me Leave and the Creditor Is Getting Impatient</div>
<div class="cg-sample">Blood Feud Older Than Either Side Remembers and Neither Side Will Drop It</div>

<h2>Sample Locations</h2>
<p>Adventure seeds start here. Each suggests a situation, not just a place:</p>
<div class="cg-sample">A ghost town that isn't quite empty — someone moved back in and won't say why</div>
<div class="cg-sample">The county jail with the wrong man inside and the right man in the crowd outside</div>
<div class="cg-sample">A remote homestead with fresh graves, a locked strongbox, and a deed that contradicts itself</div>
<div class="cg-sample">The last honest assayer in the territory — for now — with three armed men waiting outside</div>

<h2>Running Fate on the Frontier</h2>
<p><strong>Gunfights are narrative, not tactical.</strong> Describe the cover, the light, the number of exchanges before someone's horse bolts. Stress is how long you stay in the fight — not how many bullets you absorb. A taken-out result is surrender, flight, or getting shot. Which one fits the fiction.</p>
<p><strong>The law as opposition.</strong> The sheriff, the marshal, the Pinkerton — these are antagonists with professional standing and institutional backing. They can compel your aspects and invoke situation aspects against you. The Resources gap between the Harker Company and your players is the engine of every story in this setting.</p>
<p><strong>The old war.</strong> The War Between the States ended on paper. Half the people on the frontier are running from what they did in it. Aspects and Troubles that reference the war give the GM free compels for life.</p>


<h2>Building Your Character</h2>
<p>Fate Condensed characters have five aspects, a skill pyramid, one stunt, and two stress tracks. The <a href="/campaigns/character-creation?world=western">Session Zero tool</a> walks you through every step — or use the guide below.</p>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 1 — Two aspects</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Your <strong>High Concept</strong> is who you are in one phrase. It can always be invoked or compelled. Your <strong>Trouble</strong> is the thing that makes your life complicated — the debt you ride with, the law that rides after you, or the thing you did in the war. The generator has 50 — roll until one bites.</p>
  <div class="cg-sample">Former Pinkerton Turned Against the Hand That Hired Her</div>
  <div class="cg-sample">The Company Owns the Sheriff and the Judge and Probably the Clerk</div>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 2 — Skill pyramid</strong></p>
  <p style="margin:0 0 8px;font-size:var(--text-sm);color:var(--text-dim)">Assign skills in this shape: one at +4 (Great), two at +3 (Good), two at +2 (Fair), four at +1 (Average). Everything else is +0.</p>
  <div class="cg-pyramid">
    <div class="cg-pyramid-row cg-pyramid-row--peak">+4 · Shoot or Fight</div>
    <div class="cg-pyramid-row cg-pyramid-row--high">+3 · Notice &amp; one other</div>
    <div class="cg-pyramid-row cg-pyramid-row--mid">+2 · Athletics or Ride &amp; one other</div>
    <div class="cg-pyramid-row cg-pyramid-row--low">+1 · Contacts &amp; three others</div>
  </div>
  <p style="margin:6px 0 0;font-size:var(--text-label);color:var(--text-muted)">Physique sets physical stress boxes (Fair +2 → 3 boxes, Good +3 → 4). Will sets mental stress boxes. Characters with neither above +0 have 3 boxes each — plan accordingly.</p>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 3 — Stunt</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Choose one stunt from the Dust and Iron list. Dust and Iron stunts cover quick draw, tracking, intimidation, and wilderness survival. Your refresh starts at 3; each additional stunt costs 1.</p>
</div>

<p style="font-size:var(--text-sm);color:var(--text-muted)">The <a href="/campaigns/character-creation?world=western">Session Zero tool</a> handles the pyramid maths and exports a clean character sheet. If joining a live board session, the character builder runs automatically when you connect.</p>
<h2>Content Overview</h2>
<div class="cg-card"><p style="margin:0;font-size:var(--text-sm);line-height:2;color:var(--text-dim)">
<strong>NPCs:</strong> 33 first names, 26 surnames, variety-matrix minor + major concepts, 50 troubles, 28 stunts<br>
<strong>Scenes:</strong> 6 zones, 8 movement, 8 cover, 8 usable objects, 8 scene tones<br>
<strong>Adventures:</strong> 30 locations, 7 complications, 6 objectives<br>
<strong>Encounters:</strong> 14 opposition, 30 twists, 5 victories, 5 defeats<br>
<strong>Factions:</strong> 12 goals, 13 methods, 15 face roles<br>
<strong>Compels:</strong> 35 situations, 6 consequences
</p></div>

<div class="cg-card" style="margin-top:20px;border-color:color-mix(in srgb,var(--accent) 25%,transparent)">
  <h2 style="margin:0 0 8px;font-size:15px;color:var(--accent)">📄 Print &amp; Play — Coming Soon</h2>
  <p style="margin:0 0 0;font-size:13px;color:var(--text-dim);line-height:1.6">
    A print-ready world digest for this campaign is in the works — world lore, stat blocks, factions, and a starter scenario in one printable PDF. For now, use the generator above and jot it down the old-fashioned way.
  </p>
</div>

<div class="cg-cta">
<a href="/campaigns/western" class="cg-cta-primary">🎲 Open Generator</a>
<a href="/campaigns/character-creation" class="cg-cta-secondary">🎭 Session Zero</a>
</div>
</div>
<div class="cg-guide-nav">
  <a href="/">🌍 All Worlds</a>
  <a href="/campaigns/western">⚔ Open Dust and Iron Generator</a>`,
    dVentiRealm: `<h1 id="main-content">⚔ dVenti Realm</h1>
<div class="cg-sub">The Senate fell. The dragons followed. The world is still learning what that means.</div>
<p>The Arcane Senate collapsed thirty years ago and left a legal vacuum that guilds, temples, and liches have been fighting over ever since. Eighteen months ago, the last known great wyrm died — and the world is only now understanding what dragons were actually <em>for</em>. Their territorial claims kept ancient things sealed underground. Their hoards grounded wild magic. Their presence suppressed what lived in the deep places. All of that is gone now. The dungeons are still there. The contracts are still binding. The things that were being contained are not.</p>
<div class="cg-stats">
<div class="cg-stat"><b>900+</b><span>Entries</span></div>
<div class="cg-stat"><b>12</b><span>Opposition</span></div>
<div class="cg-stat"><b>28</b><span>Stunts</span></div>
<div class="cg-stat"><b>130</b><span>Names</span></div>
<div class="cg-stat"><b>12</b><span>Challenges</span></div>
</div>



<h2>Tone &amp; Atmosphere</h2>
<p>Two collapses, one world. The Senate's fall created a legal and institutional void — expired licences, unrenewed compacts, constructs running thirty-year-old directives, a phylactery registry nobody has the authority to open. The dragons' extinction created an ecological one — ward-lines failing, deep creatures surfacing, kobold clans in existential crisis, ancient things stirring under mountains that used to be safe.</p>
<p>The game lives in the gap between bureaucratic procedure and genuine dread. Every session is shaped by two questions: <em>what's waking up now</em>, and <em>who's trying to fill the gap</em>. The contracts are real. The monsters are also real. The guilds are trying to solve the second problem with tools designed for the first, and it is not going well.</p>

<h2>For Players</h2>
<p>You are dungeon delvers, guild contractors, void-touched mercenaries, kobold crew bosses, and scholars of things the Senate classified and forgot to unclassify. You navigate a world where every job has a contract, every contract has a penalty clause, and the thing the contract was written to contain may no longer be in the container.</p>
<p>Your class is your High Concept. Your spell is a stunt. Your dungeon licence covers you for the first three floors. What's on the fourth floor now is a different question entirely.</p>

<h2>Coming from D&amp;D?</h2>
<p>You already know what dragons are. The question this world asks is: <em>what were they for?</em> Everything else transfers. Kobolds, golems, undead, aberrations from the deep places, liches with phylacteries and lawyers — the vocabulary is the same. The system underneath is leaner. No action economy. No hit points. Your Sneak Attack is a stunt. Your Counterspell is a stunt. Your Bardic Inspiration is a stunt — all 28 are named after D&amp;D class features and translated directly to Fate mechanics.</p>
<p>The biggest shift: in D&amp;D, the dragon is the encounter. In dVenti Realm, the dragon was the infrastructure. You're not here to fight what the dragons left behind. You're here to survive it, negotiate with it, or figure out how to do what the dragons were doing — without being dragons.</p>

<h2>Key Factions</h2>
<p><strong>The Guild Network</strong> — contracts, licences, arbitration, and an increasingly desperate attempt to apply commercial law to an ecological catastrophe. <strong>The Temple Compact</strong> — divine authority filling the Senate's administrative void, with doctrinal disagreements about whether the gods planned any of this. <strong>The Kobold Clans</strong> — fractured: some building shrines to dead dragons, some trying to become what dragons were, some who've gone quiet and moved deeper and stopped talking to outsiders. <strong>The Lich Underground</strong> — post-Senate magicians outside the licensing system, who understood what the dragons were for and are not sharing that understanding freely. <strong>Goblin Mercenary Unions</strong> — organised, opinionated, contractually protected, and currently the most reliable source of information about what's actually coming up from underground.</p>

<h2>The Rumour</h2>
<div class="cg-card">
<p style="margin:0 0 10px">There is a ward-line in the northern reaches that should have failed eighteen months ago. It hasn't. A kobold clan moved deeper and went silent — no mourning, no shrine-building, no doomsday preaching. Just gone quiet. Miners in the Ashfold Mountains say the ground still hums the old way. Every seer who tries to answer the question <em>are they truly all gone?</em> gets the same response: not the silence of absence. The silence of something choosing not to answer.</p>
<p style="margin:0;font-size:var(--text-sm);color:var(--text-muted)">The rumour of a surviving dragon is itself a setting aspect — one that factions will kill over, betray over, build religions around. The PCs don't need to find a dragon to feel its pull. They just need to live in a world where the possibility changes what everyone does. Pay it off if you want. Leave it unresolved if you don't. The second choice is more Fate.</p>
</div>

<h2>Inspirations</h2>
<div class="cg-card"><p style="margin:0">D&amp;D 5e SRD, Pathfinder, Dragon Age: Origins, The Dresden Files, Discworld, Critical Role, Naomi Novik's <em>Temeraire</em> series (dragons as infrastructure)</p></div>

<h2>Sample Troubles</h2>
<p>Every PC has a Trouble — the thing that makes their life complicated:</p>
<div class="cg-sample">Guild Debt — Still Running and the Interest Is Not Theoretical</div>
<div class="cg-sample">The Void-Bond Grows Stronger Every Time I Use It</div>
<div class="cg-sample">The Contract Is Still Active. The Employer Is Not.</div>
<div class="cg-sample">I Know What the Kobold Clan Knows. They Know I Know.</div>
<div class="cg-sample">The Ward-Line I'm Standing On Was a Dragon's Territory Marker</div>

<h2>Sample Locations</h2>
<p>Adventure seeds start here. Each suggests a situation, not just a place:</p>
<div class="cg-sample">A Senate Vault rated Class Seven — sealed thirty years, door open from the inside eighteen months ago, nobody has filed the incident report</div>
<div class="cg-sample">A ward-line that should have failed with the last dragon. Still active. No one knows who's maintaining it or why.</div>
<div class="cg-sample">A kobold settlement that moved deeper six months ago. They left the contracts, the equipment, the debt records. They took nothing except whatever was in the shrine.</div>
<div class="cg-sample">A city where the guild, the temple, and the goblin union all hold legitimate legal claims to the dragon's former territory — and something from underground is moving into the dispute</div>


<h2>Building Your Character</h2>
<p>Fate Condensed characters have five aspects, a skill pyramid, one stunt, and two stress tracks. The <a href="/campaigns/character-creation?world=dVentiRealm">Session Zero tool</a> walks you through every step — or use the guide below.</p>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 1 — Two aspects</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Your <strong>High Concept</strong> is who you are in one phrase. It can always be invoked or compelled. Your <strong>Trouble</strong> is the thing that makes your life complicated — the thing you delved into that came back with you, the licence you operate under (or around), or the entity that has noticed you exist. The generator has 40.</p>
  <div class="cg-sample">Guild-Licensed Void Thaumaturge, Permit Class C (Lapsed)</div>
  <div class="cg-sample">The Contract Has a Penalty Clause I Did Not Read Carefully Enough</div>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 2 — Skill pyramid</strong></p>
  <p style="margin:0 0 8px;font-size:var(--text-sm);color:var(--text-dim)">Assign skills in this shape: one at +4 (Great), two at +3 (Good), two at +2 (Fair), four at +1 (Average). Everything else is +0.</p>
  <div class="cg-pyramid">
    <div class="cg-pyramid-row cg-pyramid-row--peak">+4 · Lore or Will</div>
    <div class="cg-pyramid-row cg-pyramid-row--high">+3 · Investigate &amp; one other</div>
    <div class="cg-pyramid-row cg-pyramid-row--mid">+2 · Stealth or Crafts &amp; one other</div>
    <div class="cg-pyramid-row cg-pyramid-row--low">+1 · Contacts &amp; three others</div>
  </div>
  <p style="margin:6px 0 0;font-size:var(--text-label);color:var(--text-muted)">Physique sets physical stress boxes (Fair +2 → 3 boxes, Good +3 → 4). Will sets mental stress boxes. Characters with neither above +0 have 3 boxes each — plan accordingly.</p>
</div>

<div class="cg-card">
  <p style="margin:0 0 10px"><strong>Step 3 — Stunt</strong></p>
  <p style="margin:0 0 6px;font-size:var(--text-sm);color:var(--text-dim)">Choose one stunt from the dVenti Realm list. All 28 dVenti stunts are translated D&D class features — Sneak Attack, Counterspell, Bardic Inspiration and more. Your class is your High Concept; your signature move is your stunt. Your refresh starts at 3; each additional stunt costs 1.</p>
</div>

<p style="font-size:var(--text-sm);color:var(--text-muted)">The <a href="/campaigns/character-creation?world=dVentiRealm">Session Zero tool</a> handles the pyramid maths and exports a clean character sheet. If joining a live board session, the character builder runs automatically when you connect.</p>
<h2>Content Overview</h2>
<div class="cg-card"><p style="margin:0;font-size:var(--text-sm);line-height:2;color:var(--text-dim)">
<strong>NPCs:</strong> 80 first names, 50 epithets, variety-matrix concepts, 40 troubles, 28 stunts<br>
<strong>Scenes:</strong> 12 zones, 16 movement, 16 cover, 15 objects<br>
<strong>Adventures:</strong> 25 locations, 22 objectives, 24 complications<br>
<strong>Encounters:</strong> 12 opposition, 25 twists, 14 victories, 15 defeats<br>
<strong>Factions:</strong> 12 goals, 12 methods, 12 face roles<br>
<strong>Compels:</strong> 25 situations · <strong>Backstory:</strong> 25 questions, 8 hooks
</p></div>

<div class="cg-card" style="margin-top:20px;border-color:color-mix(in srgb,var(--accent) 25%,transparent)">
  <h2 style="margin:0 0 8px;font-size:15px;color:var(--accent)">📄 Print &amp; Play — Coming Soon</h2>
  <p style="margin:0 0 0;font-size:13px;color:var(--text-dim);line-height:1.6">
    A print-ready world digest for this campaign is in the works — world lore, stat blocks, factions, and a starter scenario in one printable PDF. For now, use the generator above and jot it down the old-fashioned way.
  </p>
</div>

<div class="cg-cta">
<a href="/campaigns/dVentiRealm" class="cg-cta-primary">🎲 Open Generator</a>
<a href="/campaigns/character-creation" class="cg-cta-secondary">🎭 Session Zero</a>
</div>
</div></div>

<div class="cg-guide-nav">
  <a href="/">🌍 All Worlds</a>
  <a href="/campaigns/dVentiRealm">⚔ Open dVenti Realm Generator</a>`
  };

  let guideHtml = $derived(GUIDES[world] || null);
  $effect(() => { if (typeof document !== 'undefined' && world) {
    document.documentElement.setAttribute('data-campaign', world);
  } });

  onMount(() => {
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      theme = p.theme || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
    if (world) document.documentElement.setAttribute('data-campaign', world);
    return () => {
      if (typeof document !== 'undefined') document.documentElement.removeAttribute('data-campaign');
    };
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      p.theme = theme;
      localStorage.setItem('fate_prefs_v1', JSON.stringify(p));
    } catch (e) {}
  }
</script>

<svelte:head>
  <title>{worldName} — Campaign Guide · Ogma</title>
  <meta name="description" content="World guide, lore, and generator reference for {worldName} — a Fate Condensed campaign world." />
</svelte:head>

<div class="land-shell">
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="land-topnav topbar" role="banner">
    <a href="/" class="topbar-wordmark" aria-label="Ogma home">OGMA</a>
    <nav class="topbar-crumb" aria-label="Breadcrumb">
      <a href="/" class="topbar-crumb-item">Home</a>
      <span class="topbar-crumb-sep" aria-hidden="true">&#8250;</span>
      <a href="/campaigns/{world}" class="topbar-crumb-item">{worldName}</a>
      <span class="topbar-crumb-sep" aria-hidden="true">&#8250;</span>
      <span class="topbar-crumb-item current" aria-current="page">Guide</span>
    </nav>
    <div class="topbar-spacer" style="flex:1"></div>
    <div class="topbar-status">
      <a href="/campaigns/{world}" class="btn btn-ghost topbar-nav-btn topbar-nav-hide-sm" style="font-size:13px;text-decoration:none">&#9654; Generate</a>
      <a href="/help" class="btn btn-ghost topbar-nav-btn topbar-nav-hide-sm" style="font-size:13px;text-decoration:none">&#128218; Help</a>
      <button class="btn btn-icon btn-ghost" onclick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style="width:44px;height:44px">{theme === 'dark' ? '☀️' : '◑'}</button>
    </div>
  </header>

  {#if guideHtml}
    <main class="cg" id="main-content">
      {@html guideHtml}
    </main>
  {:else}
    <main id="main-content" style="max-width:680px;margin:0 auto;padding:40px 20px;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">&#128218;</div>
      <h1 style="font-size:var(--text-xl);margin-bottom:8px">Campaign Guide Not Found</h1>
      <p style="color:var(--text-dim)">No guide available for this world.</p>
      <a href="/" style="color:var(--accent);text-decoration:none;margin-top:16px;display:inline-block">&#8592; Back to worlds</a>
    </main>
  {/if}

  <footer class="land-footer">
    <div class="land-footer-inner">
      <div style="font-style:italic;color:var(--text-muted);margin-bottom:4px">
        <strong>O</strong>n-demand <strong>G</strong>enerator for <strong>M</strong>asterful <strong>A</strong>dventures
      </div>
      <div>
        <a href="/license">Full Attribution</a> &middot;
        <a href="/help">&#128218; Help</a> &middot;
        <a href="/about">About</a>
      </div>
      <div class="sz-center">
        <span class="about-version-badge">v{VERSION}</span>
      </div>
    </div>
  </footer>
</div>
