<svelte:head>
  <title>DnD Transition Guide — Ogma Help</title>
  <meta name="description" content="Transitioning from DnD to Fate Condensed" />
</svelte:head>

<main class="wiki-content" id="main-content">
    
<div class="wiki-page-eyebrow">D&amp;D Transition</div>
<h1>Coming from D&amp;D 5e</h1>
<p class="wiki-page-desc">You already know how to play TTRPGs. Here's every major mechanical and philosophical difference between D&amp;D 5e and Fate Condensed — section by section, with concrete play examples.</p>

<details class="learn-quickstart" open>
  <summary class="learn-quickstart-toggle">Quick Start — 5 biggest differences from D&amp;D</summary>
  <ol class="learn-quickstart-list">
    <li><strong>Fiction first</strong> — describe the action, then pick a skill. Not the other way around.</li>
    <li><strong>No HP</strong> — stress clears every scene. Consequences are narrative wounds ("Broken Arm"), not numbers.</li>
    <li><strong>Aspects replace everything</strong> — no ability scores, feats, or backgrounds. Just short phrases that are true.</li>
    <li><strong>Failure moves the story</strong> — a failed roll never means "nothing happens." The situation always changes.</li>
    <li><strong>Fate points = drama currency</strong> — spend to boost rolls (+2), earn by accepting complications from your flaws.</li>
  </ol>
</details>

<div class="callout callout-info">
  <div class="callout-title"><i class="fa-solid fa-book-open" aria-hidden="true"></i> Where this fits</div>
  <p>This is the deep-dive reference. For a quick overview of the three biggest shifts, see <a href="/help/new-to-ogma#from-dnd">New to Ogma? → I play D&amp;D</a>. For Fate mechanics without D&amp;D comparison, see <a href="/help/fate-mechanics">Fate Mechanics</a>.</p>
</div>

<nav class="wiki-toc" aria-label="On this page">
  <div class="wiki-toc-title">On this page</div>
  <a href="#the-big-shift">The big philosophical shift</a>
  <a href="#characters-aspects-vs-ability-scores">Aspects vs ability scores</a>
  <a href="#skills-broad-strokes">Skills</a>
  <a href="#the-four-actions-not-attack-bonus-move-reaction">The four actions</a>
  <a href="#aspects-the-heart-of-the-system">Aspects deep dive</a>
  <a href="#fate-points-the-economy">Fate points</a>
  <a href="#combat-stress-consequences">Combat &amp; stress</a>
  <a href="#initiative-popcorn-style">Initiative</a>
  <a href="#challenges-contests-conflicts">Challenges &amp; contests</a>
  <a href="#quick-faq">Quick FAQ</a>
</nav>

<h2 id="the-big-shift">The big philosophical shift</h2>
<p>D&amp;D asks: <em>"What can your character do?"</em> — and answers it with a class, subclass, ability scores, proficiencies, and a grid of features.</p>
<p>Fate asks: <em>"Who is your character?"</em> — and answers it with five short phrases (aspects) that are always true, a skill pyramid, and three stunts. Everything else is narrated, not tracked.</p>
<p>This matters because it changes what you optimise for. In D&amp;D, you build around mechanical capability. In Fate, you build around narrative interest — a character is interesting <em>because of their flaws</em>, not despite them. <a href="https://fate-srd.com/fate-condensed/getting-started" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>

<h2 id="characters-aspects-vs-ability-scores">Characters: Aspects vs. ability scores</h2>
<div class="wiki-table-wrap">
<table class="wiki-table">
  <thead><tr><th scope="col">D&amp;D</th><th scope="col">Fate Condensed</th></tr></thead>
  <tbody>
    <tr><td>6 ability scores (STR, DEX, CON, INT, WIS, CHA)</td><td>5 aspects — short phrases, not numbers</td></tr>
    <tr><td>Class + subclass = identity</td><td>High Concept aspect = identity ("Burned-Out Fixer With One Last Job")</td></tr>
    <tr><td>Background provides flavour, minimal mechanics</td><td>Trouble aspect drives drama ("My Loyalty Will Be My Ruin")</td></tr>
    <tr><td>Proficiency in specific skills and tools</td><td>One skill pyramid (peak at +4, no negatives possible)</td></tr>
    <tr><td>Feats are optional mechanical upgrades</td><td>Stunts are +2 bonuses in specific circumstances or once-per-scene effects</td></tr>
  </tbody>
</table>
</div>

<div class="callout callout-scenario">
  <div class="callout-title"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> Example — D&amp;D character vs Fate character</div>
  <p><strong>D&amp;D:</strong> Human Rogue 5, STR 10 DEX 18 CON 12 INT 14 WIS 13 CHA 16. Expertise in Stealth and Sleight of Hand. Uncanny Dodge. Evasion.</p>
  <p><strong>Fate:</strong> High Concept: <em>"Chrome-Fingered Pickpocket Who Knows Every Face in the Market."</em> Trouble: <em>"I Owe the Syndicate a Debt I Can't Pay."</em> Stunt: "When I palm a small object in a crowd, I get +2 to Stealth."</p>
  <p>The Fate version tells you who she is and what will get her in trouble. The D&amp;D version tells you what she can do. Both are valid — they're answering different questions.</p>
</div>

<h2 id="skills-broad-strokes">Skills: Broad strokes, not specifics</h2>
<p>D&amp;D has 18 skills. Fate Condensed has 18 skills — but they're dramatically broader. <strong>Athletics</strong> covers everything D&amp;D's Acrobatics, Athletics, and some Survival tasks do. <strong>Notice</strong> covers Perception and some Investigation. There are no tool proficiencies, no weapon proficiencies, no saving throw proficiencies.</p>
<p>The skill pyramid means every character is <em>deliberately incompetent</em> at most things. This is by design — the incompetence creates drama and supports character specialisation without requiring a 20-level ability progression.</p>

<h2 id="the-four-actions-not-attack-bonus-move-reaction">The four actions — not attack/bonus/move/reaction</h2>
<div class="wiki-table-wrap">
<table class="wiki-table">
  <thead><tr><th scope="col">Fate action</th><th scope="col">What it does</th><th scope="col">D&amp;D equivalent (approximate)</th></tr></thead>
  <tbody>
    <tr><td><strong>Overcome</strong></td><td>Clear an obstacle, remove a situation aspect</td><td>Ability check against a DC</td></tr>
    <tr><td><strong>Create Advantage</strong></td><td>Add/discover an aspect, gain free invokes</td><td>Has no real equivalent — this is Fate's superpower</td></tr>
    <tr><td><strong>Attack</strong></td><td>Inflict stress shifts on a target</td><td>Attack roll → damage roll</td></tr>
    <tr><td><strong>Defend</strong></td><td>Resist an attack or advantage</td><td>Armour Class / saving throw</td></tr>
  </tbody>
</table>
</div>
<p>The most important action D&amp;D doesn't have is <strong>Create Advantage</strong>. It places a new aspect on a target, an ally, or the scene. That aspect has a free invoke — anyone can cash it for +2 on a relevant roll. Stacking two or three free invokes before the decisive attack is Fate's version of "pre-buffing." It's the tactically optimal play that most D&amp;D converts discover in their second session. <a href="https://fate-srd.com/fate-condensed/taking-action-rolling-the-dice" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>

<h2 id="aspects-the-heart-of-the-system">Aspects: The heart of the system</h2>
<p>Every aspect is a phrase that is <strong>always narratively true</strong>. If the room is <em>Pitch Black</em>, you cannot see — no roll to perceive light that isn't there. If an NPC has the aspect <em>Loyal to the Old King</em>, you can compel that to complicate their relationship with the new regime.</p>
<p>Aspects are mechanically active in two ways:</p>
<ul>
  <li><strong>Invoke</strong> — spend a fate point (or use a free invoke) to get +2 or a reroll. You must explain how the aspect is relevant.</li>
  <li><strong>Compel</strong> — the GM offers a fate point in exchange for the aspect making your life harder. Refuse by spending a fate point. Accept by taking the fate point and the complication.</li>
</ul>

<h2 id="fate-points-the-economy">Fate Points: The economy of drama</h2>
<p>In D&amp;D, inspiration is a binary bonus you either have or don't. In Fate, fate points are a <em>flowing economy</em>.</p>
<ul>
  <li>You start each session at your Refresh (default 3).</li>
  <li>You spend fate points to invoke aspects (be more awesome now).</li>
  <li>You earn fate points by accepting compels (accept trouble now, be awesome later).</li>
  <li>At zero fate points, you cannot refuse compels — the story bends toward your trouble aspects.</li>
</ul>
<p>The optimal play is <em>not</em> to conserve fate points — it's to spend freely and accept compels to refill. GMs who understand this hand out compels constantly and the economy hums. <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>

<h2 id="combat-stress-consequences">Combat: Stress, Consequences, and Taken Out</h2>
<div class="wiki-table-wrap">
<table class="wiki-table">
  <thead><tr><th scope="col">D&amp;D</th><th scope="col">Fate Condensed</th></tr></thead>
  <tbody>
    <tr><td>Hit points — persistent across encounters, healed by rest or spells</td><td>Stress boxes — clear every scene, not cumulative</td></tr>
    <tr><td>Damage is abstract (HP lost), specific effects via conditions</td><td>Shifts are absorbed by stress or paid with consequences</td></tr>
    <tr><td>Death saving throws — knocked out at 0 HP</td><td>Taken Out — attacker narrates what happens to you</td></tr>
    <tr><td>Healing word, potions, short/long rest</td><td>Concede before being Taken Out — lose but narrate how on your terms</td></tr>
  </tbody>
</table>
</div>

<div class="callout callout-warning">
  <div class="callout-title"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Stress is NOT hit points</div>
  <p>Stress boxes each absorb exactly 1 shift and clear at the end of every scene. There is no "5 HP remaining" equivalent. A character who took 3 stress boxes in scene 1 is fully reset in scene 2. The persistent damage track is the <strong>consequence slots</strong> — not stress. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
</div>

<h2 id="initiative-popcorn-style">Initiative: Popcorn style</h2>
<p>D&amp;D uses fixed initiative order (roll dex, act in sequence). Fate Condensed uses <strong>popcorn initiative</strong>: after you act, you choose who goes next — ally or enemy. There is no fixed turn order.</p>
<p>This creates tactical decisions about pacing. Enemies can chain activations. Players can chain activations. The group that controls the sequencing controls the tempo of the conflict.</p>

<h2 id="challenges-contests-conflicts">Challenges, Contests, and Conflicts</h2>
<p>In D&amp;D, almost all dramatic situations resolve as combat. Fate Condensed has three structured scene types:</p>
<ul>
  <li><strong>Challenge</strong> — a series of overcome rolls against different obstacles. Success on all → success; failure on some → success at a cost.</li>
  <li><strong>Contest</strong> — two sides racing toward a goal. Each exchange, both roll; higher effort scores a victory. First to 3 victories wins.</li>
  <li><strong>Conflict</strong> — the full combat structure, when someone wants to harm someone else and the other side resists.</li>
</ul>

<h2 id="quick-faq">Quick FAQ</h2>
<p><strong>Where's the damage? How much does a sword do?</strong> In Fate, weapons don't deal fixed damage — you roll your Fight skill, and shifts above the defender's effort become stress. A sword might grant +1 Weapon rating (add +1 to shifts on successful attacks), but there's no d6/d8/d10 damage die.</p>
<p><strong>Can my character die?</strong> Yes, but only if you agree. The standard outcome of being Taken Out is narrative removal from the conflict — captured, fled, dramatically incapacitated. Permanent death is a table conversation, not a mechanical outcome.</p>
<p><strong>There's no CR. How do I know if an encounter is appropriate?</strong> You don't balance by math — you balance by stakes. A fight where the GM doesn't know who will win is a fight worth having. Most encounters in Fate are significantly harder than "appropriate-by-CR," because consequences create lasting complications even from victories.</p>
<p><strong>What about magic?</strong> There's no spell list. Magic is handled by aspects and stunts. "I am a Flame-Touched Witch" as a High Concept means you can invoke it to justify fire-related attacks and creates advantages. A stunt might say "once per session, I can cause a fire to erupt at any visible point within 30 feet."</p>

    <div class="wiki-footer">
  <div>
    <a href="/help">Help Home</a> &nbsp;·&nbsp;
    <a href="/">Open Ogma</a> &nbsp;·&nbsp;
    <a href="/about">About</a> &nbsp;·&nbsp;
    <a href="/license">Full Attribution</a> &nbsp;·&nbsp;
    <!-- FARI_PARKED_2026.03.154 fari.app link --> &nbsp;·&nbsp;
    <a href="https://fate-srd.com/" target="_blank" rel="noreferrer">fate-srd.com</a>
  </div>
  <div style="font-size:var(--text-label);color:var(--text-muted)">
    Fate&#8482; is a trademark of Evil Hat Productions, LLC &nbsp;·&nbsp;
    D&amp;D&#174; is a trademark of Wizards of the Coast LLC &nbsp;·&nbsp;
    Released under <a href="/license">CC BY 3.0</a>
  </div>
</div>
</main>
