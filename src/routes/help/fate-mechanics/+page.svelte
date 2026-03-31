<svelte:head>
  <title>Fate Mechanics — Ogma Help</title>
  <meta name="description" content="Fate Condensed mechanics behind the generators" />
</svelte:head>

<main class="wiki-content" id="main-content">
    
<div class="wiki-page-eyebrow">Fate Mechanics</div>
<h1>Fate Condensed — the mechanics behind the generators</h1>
<p class="wiki-page-desc">The Fate Condensed mechanics behind every Ogma generator.</p>

<details class="learn-quickstart" open>
  <summary class="learn-quickstart-toggle">Quick Start — 5 core mechanics</summary>
  <ol class="learn-quickstart-list">
    <li><strong>4dF + Skill</strong> — roll four Fate dice (range −4 to +4), add your skill rating. Beat the target number.</li>
    <li><strong>Four actions</strong> — Overcome, Create Advantage, Attack, Defend. Every roll is one of these.</li>
    <li><strong>Aspects</strong> — true facts. Invoke for +2 (costs 1 FP) or compel for complications (earns 1 FP).</li>
    <li><strong>Stress + Consequences</strong> — stress clears each scene. Consequences (Mild −2, Moderate −4, Severe −6) persist.</li>
    <li><strong>Create Advantage is king</strong> — stacking free invokes before a big roll is how Fate groups win fights.</li>
  </ol>
</details>

<div class="callout callout-info">
  <div class="callout-title"><i class="fa-solid fa-book-open" aria-hidden="true"></i> New to Fate?</div>
  <p>Start with the <a href="/help/learn-fate">Quick Start guide</a> or the <a href="/help/dnd-transition">D&amp;D Transition guide</a>. This page goes deeper into specific mechanics.</p>
</div>

<nav class="wiki-toc" aria-label="On this page">
  <div class="wiki-toc-title">On this page</div>
  <a href="#aspects">Aspects</a>
  <a href="#boosts">Boosts</a>
  <a href="#the-skill-ladder">The Skill Ladder</a>
  <a href="#stress">Stress</a>
  <a href="#consequences">Consequences</a>
  <a href="#fate-points-and-refresh">Fate Points &amp; Refresh</a>
  <a href="#stunts">Stunts</a>
  <a href="#contests">Contests</a>
  <a href="#initiative">Turn order</a>
  <a href="#challenges">Challenges</a>
  <a href="#zones">Zones</a>
  <a href="#countdowns">Countdowns</a>
  <a href="#compels">Compels</a>
  <a href="#create-advantage">Create an Advantage</a>
  <a href="#fate-point-economy-gm">Fate Point Economy (GM)</a>
  <a href="#what-gms-prepare">What GMs Prepare</a>
  <a href="#common-errors">Common Errors</a>
  <a href="#further-reading">Further Reading</a>
</nav>

<h2 id="aspects">Aspects</h2>
<p>An <strong>Aspect</strong> is a short phrase that describes something true and important about a character, scene, or situation. Aspects can be <strong>invoked</strong> (spend a Fate Point for +2 or a reroll) or <strong>compelled</strong> (the GM offers a Fate Point to introduce a complication). <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>Every NPC Ogma generates has:</p>
<ul>
  <li><strong>High Concept</strong> — the character in a phrase. "Chrome Fixer with a Debt to the Yakuza." Always invokable for the character's core competency.</li>
  <li><strong>Trouble</strong> — the thing that makes their life complicated. "The Magic is Burning Out of Me." The GM's primary compel lever.</li>
  <li><strong>Other aspects</strong> — supporting details. Can be invoked or compelled situationally.</li>
</ul>

<h2 id="boosts">Boosts</h2>
<p>A <strong>boost</strong> is a special temporary aspect with exactly <strong>one free invoke</strong>, created in the moment and gone when used. Boosts are not aspects you write on a sheet — they're fleeting narrative momentum. <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points#boosts" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p><strong>When you get a boost:</strong></p>
<ul>
  <li><strong>Success with Style (+3 margin)</strong> on Overcome or Create Advantage</li>
  <li><strong>Tie (0 margin)</strong> on an Attack — the attacker earns a boost even though no damage lands</li>
  <li><strong>Success with Style</strong> on Defend — the defender earns a boost</li>
  <li>Some stunts grant boosts under specific conditions</li>
</ul>
<p>Name it immediately — <em>"Stunned,"</em> <em>"Off Balance,"</em> <em>"Momentary Opening."</em> Rules:</p>
<ul>
  <li>Free invoke works like any aspect (+2 or reroll). No Fate Point cost.</li>
  <li>Pass it to an ally before using it.</li>
  <li>Gone when used or when the scene ends.</li>
</ul>
<div class="callout callout-tip">
  <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> Boost vs. aspect</div>
  <p>A boost has one free invoke, cannot be compelled, and expires at scene end. Want a lasting effect? Use Create Advantage for a real aspect instead.</p>
</div>

<h2 id="the-skill-ladder">The Skill Ladder</h2>
<p>Skills are rated on the <strong>Fate Ladder</strong>: Average (+1), Fair (+2), Good (+3), Great (+4), Superb (+5), Fantastic (+6), Epic (+7), Legendary (+8). Most NPCs have a peak skill of Good (+3) to Superb (+5). Major NPCs have 5 rated skills; Minor NPCs have 1. <a href="https://fate-srd.com/fate-condensed/getting-started" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>The four actions in Fate are <strong>Overcome</strong> (clear an obstacle), <strong>Create an Advantage</strong> (place or discover an aspect), <strong>Attack</strong> (inflict stress), and <strong>Defend</strong> (resist an action).</p>

<div class="callout callout-dnd">
  <div class="callout-title">&#9876; Coming from D&amp;D — skills</div>
  <p><strong>D&D:</strong> flat proficiency bonus added to an ability modifier. <strong>Fate:</strong> choose 10 skills, rank them — everything else is +0. Your top skill defines your character. <strong>Key shift:</strong> Fate's narrower range (−4 to +4) keeps results tight. No d20 swingyness.</p>
</div>

<h2 id="stress">Stress</h2>
<p>Stress is <strong>not hit points</strong>. It measures how long a character can stay in a conflict before being taken out. All stress boxes clear at the end of every scene — there is no long-term attrition from stress alone. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>Fate Condensed uses <strong>1-point stress boxes</strong> (not escalating like Fate Core). Minor NPCs get 1–3 boxes. Major NPCs have separate physical and mental tracks (2–4 boxes each, based on Physique/Will). When all boxes fill, the character is <strong>Taken Out</strong>.</p>

<h2 id="consequences">Consequences</h2>
<p>Consequences are lasting aspects that a character takes to avoid being Taken Out. They persist beyond the scene and must be treated. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<div class="wiki-table-wrap">
<table class="wiki-table">
  <thead><tr><th scope="col">Severity</th><th scope="col">Shifts absorbed</th><th scope="col">Treatment difficulty</th><th scope="col">Clears after</th></tr></thead>
  <tbody>
    <tr><td><strong>Mild (−2)</strong></td><td>2 shifts</td><td>Fair (+2)</td><td>One full scene after treatment</td></tr>
    <tr><td><strong>Moderate (−4)</strong></td><td>4 shifts</td><td>Great (+4)</td><td>One full session after treatment</td></tr>
    <tr><td><strong>Severe (−6)</strong></td><td>6 shifts</td><td>Fantastic (+6)</td><td>After a Breakthrough</td></tr>
  </tbody>
</table>
</div>
<p>Name consequences specifically — <em>"Badly Burned Hands"</em> not <em>"Injured"</em>. It must work as a compel hook. Plan at least one compel before it heals.</p>

<h2 id="fate-points-and-refresh">Fate Points and Refresh</h2>
<p>Fate Points are the economy of player agency. Players start each session with their <strong>Refresh</strong> (usually 3). They spend Fate Points to invoke aspects; they earn them when they accept compels. <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>Major NPCs have a <strong>Refresh</strong> calculated as <code>max(1, 3 − stunts)</code>. The GM starts each scene with this many Fate Points for that NPC. The FP Tracker in Ogma manages this automatically.</p>
<p>See the <a href="/help/at-the-table">At the Table guide</a> for how to use the FP Tracker during play.</p>

<h2 id="stunts">Stunts</h2>
<p>Stunts give characters specific mechanical advantages. Fate Condensed has two types. <a href="https://fate-srd.com/fate-condensed/getting-started" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<ul>
  <li><strong>+2 Bonus stunts</strong> — when a specific condition applies, add +2 to a named skill. E.g. "When I bluff a mark face to face with Deceive, add +2."</li>
  <li><strong>Once-per-scene stunts</strong> — a special mechanical effect beyond a simple +2. Can only be used once per scene. E.g. "Once per scene, I can treat a failed Physique roll as a tie."</li>
</ul>
<p>Each stunt a character has costs 1 point of Refresh (minimum Refresh 1). Major NPCs in Ogma have 1&ndash;2 stunts, and their Refresh is automatically reduced accordingly.</p>

<h3>What makes a good stunt?</h3>
<p>Name a specific skill and a specific condition. Vague stunts ("I'm better at fighting") aren't stunts.</p>
<div class="wiki-table-wrap">
<table class="rules-table">
  <thead><tr><th scope="col">Weak ✗</th><th scope="col">Strong ✓</th></tr></thead>
  <tbody>
    <tr><td>+2 to Fight</td><td>+2 to Fight when attacking from an elevated position</td></tr>
    <tr><td>I'm good at sneaking</td><td>+2 to Stealth when moving through crowd cover</td></tr>
    <tr><td>Once per scene I can do something impressive</td><td>Once per scene, spend a Fate Point to automatically succeed on one Overcome roll with Crafts</td></tr>
  </tbody>
</table>
</div>

<h3>Stunt browser — all world stunts in one place</h3>
<p>The <strong>stunt browser</strong> is in the sidebar under <strong>Generate</strong>. Filter 56+ stunts by skill, tag, or keyword. Click to copy to clipboard.</p>
<p>Stunt tags: <em>combat, stealth, subterfuge, social, negotiation, leadership, knowledge, investigation, technical, repair, survival, movement, intimidation, supernatural</em></p>

<h3>Examples from each world</h3>
<dl class="stunt-examples">
  <dt>The Long After</dt>
  <dd><em>Ruin Reader</em> (Lore): +2 to create advantages when examining pre-collapse artifacts or structures.</dd>
  <dt>Neon Abyss</dt>
  <dd><em>Ghost Protocol</em> (Stealth): +2 to overcome when moving undetected through surveilled corporate spaces.</dd>
  <dt>Shattered Kingdoms</dt>
  <dd><em>Wound-Lore</em> (Academics): +2 to overcome when treating consequences caused by magical means.</dd>
  <dt>Void Runners</dt>
  <dd><em>Jump Sense</em> (Pilot): +2 to create advantages when planning faster-than-light routes under time pressure.</dd>
  <dt>The Gaslight Chronicles</dt>
  <dd><em>Reading the Room</em> (Empathy): +2 to defend against Deceive when first meeting someone in a social setting.</dd>
  <dt>The Long Road</dt>
  <dd><em>Salvage Eye</em> (Notice): +2 to overcome when searching ruined structures for usable materials.</dd>
  <dt>Dust and Iron</dt>
  <dd><em>Dead Aim</em> (Shoot): +2 to attack when you have not moved this exchange.</dd>
  <dt>The dVenti Realm</dt>
  <dd><em>Senate Protocol</em> (Rapport): +2 to create advantages in formal political negotiations involving vault authority.</dd>
</dl>

<h2 id="contests">Contests</h2>
<p>A Contest is used when two sides compete for the same goal without directly harming each other. Each exchange, both sides roll — the higher effort marks a victory. <strong>First to 3 victories wins.</strong> A tie (equal effort) means neither side scores; instead, introduce a twist aspect. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>The Contest generator gives you two sides, relevant skills, a situation aspect, and 3 pre-rolled twists.</p>

<div class="callout callout-dnd">
  <div class="callout-title">&#9876; Coming from D&amp;D — contests vs. opposed checks</div>
  <p><strong>D&D:</strong> opposed ability checks for everything from arm wrestling to chases. <strong>Fate:</strong> separates Contests (race for a goal), Conflicts (mutual harm), and Challenges (obstacle sequences). <strong>Key shift:</strong> the distinction forces you to think about what the scene is <em>really about</em>.</p>
</div>

<h2 id="initiative">Turn order in conflicts</h2>
<p>Fate Condensed doesn't use rolled initiative. At the start of a conflict, determine turn order from the fiction — who saw the threat first, who was in the best position to act. Each <strong>exchange</strong> (one round), every character acts once in that order. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>Many tables use <strong>Popcorn Initiative</strong>: after acting, choose who goes next. Rewards tactical coordination — players can chain Create Advantage before the big Attack.</p>
<div class="callout callout-dnd">
  <div class="callout-title">&#9876; Coming from D&amp;D — initiative</div>
  <p><strong>D&D:</strong> roll once, lock the order for the whole combat. <strong>Fate:</strong> turn order comes from narrative logic and can flex. <strong>Key shift:</strong> who acts when is a group tactical decision, not a number rolled at session start.</p>
</div>

<h2 id="challenges">Challenges</h2>
<p>A Challenge is a sequence of Overcome actions against different obstacles, each with its own skill and difficulty. The group succeeds on the whole challenge only if they pass all individual rolls — or accepts success at a cost when they fail some. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>The Challenge generator gives you a named challenge, success and failure consequences, and a situation aspect.</p>

<h2 id="zones">Zones</h2>
<p>A <strong>zone</strong> is an abstract area within a conflict scene. Zones replace precise grid positioning with narrative space — anywhere you can act without meaningful effort is the same zone. Most conflicts use 2–4 zones; more than that becomes logistics rather than drama. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<ul>
  <li><strong>Within a zone:</strong> Free to move. Attack anyone in the same zone without restriction.</li>
  <li><strong>Adjacent zone:</strong> Costs one exchange action to move — or an Overcome roll if something blocks the path.</li>
  <li><strong>Ranged attacks:</strong> Certain weapons and stunts let you attack into an adjacent zone.</li>
  <li><strong>Zone aspects:</strong> Each zone gets 1–2 situation aspects. Anyone in the zone can invoke them.</li>
</ul>

<div class="zone-map" role="img" aria-label="Three-zone conflict example: Street, Warehouse Floor, Loading Dock">
  <div class="zone-box">
    <div class="zone-name">Street</div>
    <div class="zone-asp">"Rain-Slicked Cobbles"</div>
  </div>
  <div class="zone-connector" aria-hidden="true">
    <span class="zone-arrow">⇄</span>
    <span class="zone-cost">1 action</span>
  </div>
  <div class="zone-box zone-box--focus">
    <div class="zone-name">Warehouse Floor</div>
    <div class="zone-asp">"Crates Everywhere"</div>
    <div class="zone-asp">"Unstable Upper Catwalk"</div>
  </div>
  <div class="zone-connector" aria-hidden="true">
    <span class="zone-arrow">⇄</span>
    <span class="zone-cost">1 action</span>
  </div>
  <div class="zone-box">
    <div class="zone-name">Loading Dock</div>
    <div class="zone-asp">"One Exit — One Guard"</div>
  </div>
</div>

<div class="callout callout-tip">
  <div class="callout-title"><i class="fa-solid fa-map" aria-hidden="true"></i> Design zones to offer different tactics</div>
  <p>Aim for one zone that favours melee, one for ranged or fleeing, one with narrative urgency. Zones that feel identical flatten the conflict.</p>
</div>
<div class="callout callout-dnd">
  <div class="callout-title">⚔ Coming from D&D</div>
  <p><strong>D&D:</strong> 5-foot squares, precise movement, opportunity attacks. <strong>Fate:</strong> narrative zones — "I sprint into the warehouse," not "move to K14." <strong>Key shift:</strong> movement is a dramatic question, not a geometry problem.</p>
</div>

<h2 id="countdowns">Countdowns</h2>
<p>A Countdown is a threat clock with 4–8 boxes. When a trigger occurs, fill a box. When the last box fills, the outcome happens — no exceptions. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>

<h2 id="compels">Compels</h2>
<p>A Compel is when the GM offers a Fate Point to a player in exchange for an aspect making their character's life harder. The player can spend a Fate Point to refuse — but they have to spend one they already have. <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>The Compel generator gives you the situation and the consequence. Offer the Fate Point before describing the complication.</p>

    <hr style="border:none;border-top:1px solid var(--border);margin:32px 0">

    <h2 id="create-advantage">Create an Advantage — the most important action</h2>
    <p><strong>Create an Advantage</strong> is the action new players skip and experienced players build entire sessions around. It places a new aspect on a scene, character, or situation — or discovers an existing hidden aspect — and gives you one or two free invokes on it. <a href="https://fate-srd.com/fate-condensed/taking-action-rolling-the-dice" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
    <p>Why it matters: a free invoke stacks on top of a paid invoke (+2 each). Stack two free invokes before your Attack and you're rolling at effectively +4 over your skill — without spending a single Fate Point.</p>

    <div class="callout callout-warning">
      <div class="callout-title"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> The four outcomes of Create Advantage (<a href="https://fate-srd.com/fate-condensed/taking-action-rolling-the-dice" target="_blank" rel="noreferrer" class="srd-link">FCon SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>)</div>
      <ul>
        <li><strong>Fail:</strong> You don't create the aspect, or — if it already existed — your opponent gets a free invoke on it instead.</li>
        <li><strong>Tie:</strong> You <em>do</em> create the aspect, but you get <strong>no free invoke</strong>. The aspect exists and anyone can invoke it by spending a fate point.</li>
        <li><strong>Succeed:</strong> You create the aspect and gain <strong>one free invoke</strong>.</li>
        <li><strong>Succeed with Style (+3):</strong> You create the aspect and gain <strong>two free invokes</strong>.</li>
      </ul>
      <p>A tie is not a failure — the aspect is real. But no free invoke. Spend a fate point to invoke it immediately, or leave it for anyone to use later.</p>
    </div>
    <div class="callout callout-scenario">
      <div class="callout-title"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> Worked example — fighting a skilled swordsman</div>
      <p>Your Fight is Good (+3). The enemy's Fight is Great (+4) — you're at a mechanical disadvantage every exchange if you just attack.</p>
      <p><strong>Without Create Advantage:</strong> You attack at Fight +3 vs. their Defend at +4. Odds are against you. Repeat until someone runs out of stress.</p>
      <p><strong>With Create Advantage:</strong> You throw sand (Athletics +2) to Create Advantage "Sand in His Eyes" — a new situation aspect with one free invoke. You succeed. Next exchange, you Attack at Fight +3 <em>plus</em> your free invoke (+2) = effectively +5 vs. their +4. You're now the favourite.</p>
      <p>The fight changed because you thought before you swung.</p>
    </div>
    <div class="callout callout-scenario">
      <div class="callout-title"><i class="fa-solid fa-users" aria-hidden="true"></i> Group tactics — two allies, stacked free invokes</div>
      <p>The real power appears when a party coordinates. Your group faces Vex, an elite enforcer with Fight +5.</p>
      <div class="fm-invoke-stack">
        <div class="fm-is-row fm-is-setup">
          <span class="fm-is-who">Crow (Notice +2)</span>
          <span class="fm-is-action">Create Advantage → Success → <em>"Exposed Flank"</em></span>
          <span class="fm-is-badge">1 free invoke</span>
        </div>
        <div class="fm-is-row fm-is-setup">
          <span class="fm-is-who">River (Provoke +3)</span>
          <span class="fm-is-action">Create Advantage → Style → <em>"Rattled and Off-Balance"</em></span>
          <span class="fm-is-badge">2 free invokes</span>
        </div>
        <div class="fm-is-divider"></div>
        <div class="fm-is-row fm-is-attack">
          <span class="fm-is-who">Crow attacks</span>
          <span class="fm-is-action">Fight +3 &nbsp;+&nbsp; Exposed Flank +2 &nbsp;+&nbsp; Rattled +2</span>
          <span class="fm-is-badge fm-is-badge--total">= +7 effective</span>
        </div>
        <div class="fm-is-row fm-is-defend">
          <span class="fm-is-who">Vex defends</span>
          <span class="fm-is-action">Fight +5</span>
          <span class="fm-is-badge fm-is-badge--outcome">+2 margin → 2 stress</span>
        </div>
      </div>
      <p>Two rounds of setup produced a +4 swing on the attack without spending a single Fate Point. This is the tactical heartbeat of Fate group combat: build free invokes together, spend them together.</p>
    </div>
    <div class="callout callout-dnd">
      <div class="callout-title">⚔ Coming from D&amp;D</div>
      <p><strong>D&D:</strong> Help gives advantage to one ally on one roll. <strong>Fate:</strong> Create Advantage places a reusable aspect anyone can invoke, stacks with other free invokes, and creates narrative facts the fiction must honour. <strong>Key shift:</strong> it's fundamentally more powerful than Help.</p>
    </div>
    <div class="callout callout-tip">
      <div class="callout-title"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> GM tip — player-created aspects are real</div>
      <p>"Perched on the High Ground" exists in the fiction. The enemy should react — try to remove it (Overcome), or compel it against the player ("also makes you the most visible target").</p>
    </div>

    <h2 id="fate-point-economy-gm">The fate point economy — a GM guide</h2>
    <p>The economy breaks when GMs forget to compel. Here's the full cycle. <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
    <ol>
      <li><strong>Session start:</strong> Each player gets Refresh fate points (usually 3). GM gets 1 per PC per scene — resets every scene.</li>
      <li><strong>During scene:</strong> GM compels to create complications. Accept = player earns 1 FP. Refuse = player spends 1 FP. GM spends pool on NPC invokes.</li>
      <li><strong>End of scene:</strong> GM pool resets. Player pools carry over until a breakthrough.</li>
    </ol>
    <div class="callout callout-warning">
      <div class="callout-title"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> The economy stalls without compels</div>
      <p>No compels = players hoard fate points and never earn new ones. The game goes flat. Aim for 1–2 compels per session. Each is a story beat, not a punishment.</p>
    </div>
    <div class="callout callout-tip">
      <div class="callout-title"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> GM tip — compel troubles first</div>
      <p>Troubles are pre-approved complications. "Your trouble is <em>Always the Last to Know</em> — would your character hear about the ambush in time?" Offer the FP before describing the complication. They can always refuse.</p>
    </div>

    <h2 id="what-gms-prepare">What the GM prepares — and what they don't</h2>
    <p>Fate GMs don't write encounter maps or stat-blocked combat setpieces. They prepare <strong>situations</strong>. The formula:</p>
    <ul>
      <li><strong>A current issue</strong> — the problem already in motion that the PCs can engage with immediately.</li>
      <li><strong>An impending issue</strong> — something approaching that will become a current issue if not addressed.</li>
      <li><strong>3–5 NPCs with faces</strong> — who is doing what about each issue.</li>
      <li><strong>2–3 locations with aspects</strong> — what is true and interesting about the places the story will visit.</li>
    </ul>
    <p>That's enough for a full session. Ogma's Campaign Frame, Adventure Seed, Faction, and NPC generators produce all of these in under two minutes.</p>
    <div class="callout callout-dnd">
      <div class="callout-title">⚔ Coming from D&amp;D</div>
      <p><strong>D&D:</strong> GMs pre-write the plot. <strong>Fate:</strong> GMs pre-write the situation and let plot emerge from character choices. <strong>Key shift:</strong> stop asking "what will happen" — ask "who wants what, and why can't they have it?"</p>
    </div>

    <h2 id="common-errors">Common errors and how to fix them</h2>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "We forgot to invoke aspects all session"</div>
      <p><strong>Fix:</strong> Put an index card with each player's aspects visible on the table. Aspects that aren't visible don't get invoked.</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "Players roll for everything, including obvious things"</div>
      <p><strong>Fix:</strong> Three-question test before any roll: (1) Is the outcome uncertain? (2) Would failure be interesting? (3) Does it matter to the story? Any "no" = don't roll, just narrate.</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "Our conflicts take two hours"</div>
      <p><strong>Fix:</strong> Introduce concession early. "You can concede before any roll — you control your exit and earn fate points." Most long conflicts happen because players don't know concession exists.</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "Nobody compels — the economy is dead"</div>
      <p><strong>Fix:</strong> Always a GM problem. Set a target: two compels minimum per session. "Your trouble is <em>Owes Money to the Wrong People</em> — the loan shark just walked through the door." Offer the FP before describing what happens.</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "Players attack every round instead of Create Advantage"</div>
      <p><strong>Fix:</strong> Have an NPC use Create Advantage against them first. Let them feel it. Once players see how effective it is, they start using it.</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "We confused Tie with 'success at a cost'"</div>
      <p><strong>Fix:</strong> A <strong>Tie</strong> is automatic success with a complication — mechanical, always happens. "Success at a cost" on a <strong>Fail</strong> is an optional GM offer. Never use a Tie to mean nothing happens.</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "Stress feels like hit points and runs out too fast"</div>
      <p><strong>Fix:</strong> Remind players stress clears every scene. Frame consequences as story choices: "Taking 'Winded and Desperate' keeps you in the fight and gives the GM something to work with."</p>
    </div>

    <h2 id="further-reading">Further reading</h2>
    <ul>
      <li><a href="https://bookofhanz.com/" target="_blank" rel="noreferrer"><strong>The Book of Hanz</strong></a> — Robert Hanz's essays on Fate philosophy. The best resource for understanding <em>why</em> Fate works. Start with "Fate Doesn't Have a Damage System."</li>
      <li><a href="https://fate-srd.com/fate-condensed" target="_blank" rel="noreferrer"><strong>Fate Condensed SRD</strong></a> — The complete rules, free. GM chapter (p.41) covers difficulty-setting and NPC design.</li>
      <li><a href="https://fate-srd.com/odds-ends/introducing-people-fate" target="_blank" rel="noreferrer"><strong>"Introducing People to Fate"</strong></a> — Teaching sequencing and what to skip in session zero.</li>
      <li><a href="https://www.uptofourplayers.com/ready-to-roll/fate-core-rules/" target="_blank" rel="noreferrer"><strong>Up to Four Players — Fate Core Rules comic</strong></a> — Two-page visual overview. Fate Core, but core concepts are identical.</li>
    </ul>

    <div class="wiki-footer">

  <div>
    <a href="/help">Help Home</a> &nbsp;·&nbsp;
    <a href="/">Open Ogma</a> &nbsp;·&nbsp;
    <a href="/about">About</a> &nbsp;·&nbsp;
    <a href="/license">Full Attribution</a> &nbsp;·&nbsp;
    <!-- FARI_PARKED_2026.03.154 fari.app link --> &nbsp;·&nbsp;
    <a href="https://fate-srd.com/" target="_blank" rel="noreferrer">fate-srd.com</a>
  </div>
  <div class="wiki-footer-meta">
    Fate&#8482; is a trademark of Evil Hat Productions, LLC &nbsp;·&nbsp;
    D&amp;D&#174; is a trademark of Wizards of the Coast LLC &nbsp;·&nbsp;
    Released under <a href="/license">CC BY 3.0</a>
  </div>
</div>
</main>
