<svelte:head>
  <title>Fate Mechanics — Ogma Help</title>
  <meta name="description" content="Fate Condensed mechanics behind the generators" />
</svelte:head>

<main class="wiki-content" id="main-content">
    
<div class="wiki-page-eyebrow">Fate Mechanics</div>
<h1>Fate Condensed — the mechanics behind the generators</h1>
<p class="wiki-page-desc">Ogma generates mechanically correct Fate Condensed content. This page explains the mechanics behind the generators, with deep dives into Create Advantage, the fate point economy, GM prep structure, common errors, and further reading.</p>

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
  <a href="#challenges">Challenges</a>
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
<p><strong>Rules:</strong> Give it a name immediately — <em>"Stunned,"</em> <em>"Off Balance,"</em> <em>"Momentary Opening."</em> The free invoke works just like invoking any aspect (+2 or reroll), costs no Fate Point, and can be passed to an ally in the same exchange. Use it or lose it — a boost expires as soon as the scene ends or when the free invoke is spent.</p>
<div class="callout callout-tip">
  <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> Boost vs. aspect</div>
  <p>A boost is a stripped-down aspect. It cannot be invoked a second time (there's only one free invoke), cannot be compelled, and has no persistence. If you want a lasting effect, use Create Advantage for a real aspect instead. The practical difference: boosts reward exceptional rolls with immediate firepower; aspects reward patient setup with reusable leverage.</p>
</div>

<h2 id="the-skill-ladder">The Skill Ladder</h2>
<p>Skills are rated on the <strong>Fate Ladder</strong>: Average (+1), Fair (+2), Good (+3), Great (+4), Superb (+5), Fantastic (+6), Epic (+7), Legendary (+8). Most NPCs have a peak skill of Good (+3) to Superb (+5). Major NPCs have 5 rated skills; Minor NPCs have 1. <a href="https://fate-srd.com/fate-condensed/getting-started" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>The four actions in Fate are <strong>Overcome</strong> (clear an obstacle), <strong>Create an Advantage</strong> (place or discover an aspect), <strong>Attack</strong> (inflict stress), and <strong>Defend</strong> (resist an action).</p>

<div class="callout callout-dnd">
  <div class="callout-title">&#9876; Coming from D&amp;D — skills</div>
  <p>D&amp;D skills use a flat proficiency bonus (+2 to +6) added to an ability modifier. Fate's skill pyramid means you choose 10 skills you care about and rank them — everything else defaults to +0 (Mediocre). Your top skill IS your character's core competency. A +4 (Great) Fight character reliably hits Fair (+2) difficulty. A D&amp;D equivalent would be proficiency + ability modifier around +7 — Fate's narrower range keeps results tighter and less swingy.</p>
</div>

<h2 id="stress">Stress</h2>
<p>Stress is <strong>not hit points</strong>. It measures how long a character can stay in a conflict before being taken out. All stress boxes clear at the end of every scene — there is no long-term attrition from stress alone. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>Fate Condensed uses <strong>1-point stress boxes</strong> (not escalating like Fate Core). Minor NPCs have 1–3 stress boxes. Major NPCs have physical and mental tracks separately, each 2–4 boxes depending on Physique/Will.</p>
<p>Ogma's interactive stress track lets you tap boxes during play. When all boxes are filled, the character is <strong>Taken Out</strong> — the TAKEN OUT overlay fires .</p>

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
<p>The Consequence generator produces a named aspect ready to write on a character sheet. Always name it specifically — <em>"Badly Burned Hands"</em> not just <em>"Injured"</em>. The aspect must work as a compel hook.</p>

<div class="callout callout-tip">
  <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> GM tip from the generator</div>
  <p>Plan at least one compel on a consequence before it heals. A consequence that never got invoked or compelled was a missed dramatic opportunity.</p>
</div>

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
<p>A stunt should do two things: name a specific skill, and name a specific condition. Vague stunts ("I'm better at fighting") aren't stunts — they're wishful thinking. Specific stunts create interesting moments:</p>
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
<p>The <strong>stunt browser</strong> is available in the sidebar under <strong>Generate</strong>. It shows every stunt from the current world plus the universal pool (56+ stunts total). Filter by skill, tag, or keyword. Click any stunt to copy its name and description to the clipboard — ready to paste into a character sheet or session notes.</p>
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
<p>The Contest generator gives you the two sides, their relevant skills, a situation aspect, and 3 pre-rolled twists. The interactive victory track lets you tap boxes during play — scores appear live .</p>

<div class="callout callout-dnd">
  <div class="callout-title">&#9876; Coming from D&amp;D — contests vs. opposed checks</div>
  <p>D&amp;D uses opposed ability checks (both sides roll, higher wins) for everything from arm wrestling to chases. Fate separates Contests (race for a goal, first to 3 victories) from Conflicts (mutual harm) and Challenges (obstacle sequences). The distinction forces you to think about what the scene is <em>really about</em> — not just "who rolls higher."</p>
</div>

<h2 id="challenges">Challenges</h2>
<p>A Challenge is a sequence of Overcome actions against different obstacles, each with its own skill and difficulty. The group succeeds on the whole challenge only if they pass all individual rolls — or accepts success at a cost when they fail some. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>The Challenge generator gives you a named challenge, success and failure consequences, and a situation aspect. Use it when the party needs to accomplish something complex before an external pressure resolves.</p>

<h2 id="countdowns">Countdowns</h2>
<p>A Countdown is a threat clock. It has 4–8 boxes and fills when a trigger condition occurs. When the last box fills, the outcome happens — no exceptions. Use countdowns to create temporal pressure the players can see building. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>The live countdown track fills as the GM marks boxes. When the clock hits zero, particles fire and the outcome appears.</p>

<h2 id="compels">Compels</h2>
<p>A Compel is when the GM offers a Fate Point to a player in exchange for an aspect making their character's life harder. The player can spend a Fate Point to refuse — but they have to spend one they already have. <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
<p>The Compel generator produces a ready-to-offer compel: the situation ("You've been made by the corporate drone") and the consequence if accepted ("Your only exit is the one they're watching"). Offer the Fate Point before you describe the consequence.</p>

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
      <p>The tie result catches many GMs off guard. A tie is not a failure — the aspect is real — but you don't get the free invoke that makes Create Advantage so powerful. In practice this means a tie is a soft win: the narrative fact is established, but you'll need a fate point to invoke it immediately.</p>
    </div>
    <div class="callout callout-scenario">
      <div class="callout-title"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> Worked example — fighting a skilled swordsman</div>
      <p>Your Fight is Good (+3). The enemy's Fight is Great (+4) — you're at a mechanical disadvantage every exchange if you just attack.</p>
      <p><strong>Without Create Advantage:</strong> You attack at Fight +3 vs. their Defend at +4. Odds are against you. Repeat until someone runs out of stress.</p>
      <p><strong>With Create Advantage:</strong> You throw sand (Athletics +2) to Create Advantage "Sand in His Eyes" — a new situation aspect with one free invoke. You succeed. Next exchange, you Attack at Fight +3 <em>plus</em> your free invoke (+2) = effectively +5 vs. their +4. You're now the favourite.</p>
      <p>The fight changed because you thought before you swung.</p>
    </div>
    <div class="callout callout-dnd">
      <div class="callout-title">⚔ Coming from D&amp;D</div>
      <p>D&amp;D has no equivalent to Create Advantage. The closest analogy is the Help action — but Help gives advantage to one ally on one roll. Create Advantage places a reusable aspect that <em>anyone</em> can invoke, stacks with other free invokes, and creates narrative facts the fiction must honour. It's fundamentally more powerful and more interesting than Help.</p>
    </div>
    <div class="callout callout-tip">
      <div class="callout-title"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> GM tip — aspects created by players are real</div>
      <p>When a player successfully creates "Perched on the High Ground," that aspect exists in the fiction. It's true. It gives the player's side a free invoke. It also means the enemy should <em>react to it</em> — they might spend their action trying to remove it (Overcome), or the GM might compel it ("Your high ground also makes you the most visible target in the courtyard").</p>
    </div>

    <h2 id="fate-point-economy-gm">The fate point economy — a GM guide</h2>
    <p>The economy breaks when GMs forget to compel. Here's the full cycle. <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
    <ol>
      <li><strong>Session start:</strong> Each player gets fate points equal to their Refresh (usually 3). The GM gets 1 per PC per scene — not per NPC, not per encounter. A party of 4 = 4 GM fate points per scene.</li>
      <li><strong>During the scene:</strong> GM offers compels to create complications. Players who accept earn 1 FP. Players who refuse spend 1 FP. The GM uses their pool for NPC invokes.</li>
      <li><strong>End of scene:</strong> Reset GM pool to 1 per PC. Player pools carry over — they don't reset until a breakthrough.</li>
    </ol>
    <div class="callout callout-warning">
      <div class="callout-title"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> The economy stalls without compels</div>
      <p>If the GM never compels, players hoard fate points they never spend (no dramatic moments needed them) and never earn new ones (no compels to accept). The game goes flat. Aim for at least 1–2 compels per session. Each one is a story beat, not a punishment.</p>
    </div>
    <div class="callout callout-tip">
      <div class="callout-title"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> GM tip — offer compels on troubles first</div>
      <p>Troubles are pre-approved complications — the player wrote them specifically to be compelled. Start there. "Your trouble is <em>Always the Last to Know</em> — would your character hear about the ambush in time?" Offering the FP before describing the complication is the correct procedure. They can always refuse.</p>
    </div>

    <h2 id="what-gms-prepare">What the GM prepares — and what they don't</h2>
    <p>Fate GMs don't write encounter maps or stat-blocked combat setpieces. They prepare <strong>situations</strong>. The formula:</p>
    <ul>
      <li><strong>A current issue</strong> — the problem already in motion that the PCs can engage with immediately.</li>
      <li><strong>An impending issue</strong> — something approaching that will become a current issue if not addressed.</li>
      <li><strong>3–5 NPCs with faces</strong> — who is doing what about each issue.</li>
      <li><strong>2–3 locations with aspects</strong> — what is true and interesting about the places the story will visit.</li>
    </ul>
    <p>That's enough for a full session. The fiction fills in everything else. Ogma's generators — especially Campaign Frame, Adventure Seed, Faction, and NPC — produce all of these in under two minutes.</p>
    <div class="callout callout-dnd">
      <div class="callout-title">⚔ Coming from D&amp;D</div>
      <p>D&amp;D GMs pre-write the plot. Fate GMs pre-write the situation and let the plot emerge from character choices. The key shift: stop asking "what will happen" and start asking "who wants what, and why can't they have it?"</p>
    </div>

    <h2 id="common-errors">Common errors and how to fix them</h2>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "We forgot to invoke aspects all session"</div>
      <p><strong>Fix:</strong> At the start of next session, put a physical index card in front of each player with their aspects on it. Make aspects visible. Aspects that aren't visible don't get invoked. Once the habit forms, the cards become optional.</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "Players roll for everything, including obvious things"</div>
      <p><strong>Fix:</strong> Apply the three-question test before any roll: (1) Is the outcome uncertain? (2) Would failure be interesting? (3) Does the outcome matter to the story? If any answer is no, don't roll — just narrate. A skilled lockpick opening a simple lock in a non-tense situation shouldn't roll.</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "Our conflicts take two hours"</div>
      <p><strong>Fix:</strong> Introduce concession early. Tell players explicitly: "You can concede at any time before a roll. You control what happens to your character, and you earn fate points." Most long conflicts happen because players don't know concession exists. Design conflicts to have a clear "this side wins" condition so players can see when conceding is the smart move.</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "Nobody compels — the economy is dead"</div>
      <p><strong>Fix:</strong> This is always a GM problem, not a player problem. Set a target: two compels per session minimum. Write your NPCs' situations so complications naturally arise from PC troubles. "Your trouble is <em>Owes Money to the Wrong People</em> — the loan shark just walked through the door" is a compel. Offer the FP before you describe what happens.</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "Players attack every round instead of Create Advantage"</div>
      <p><strong>Fix:</strong> Have an NPC use Create Advantage against them. Let them feel "Sand in His Eyes" when it's used against a PC. Once players see how effective it is, they start using it. You can also explicitly suggest it: "You could attack, or you could try to Create Advantage — maybe 'Off Balance' after that near-miss?"</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> "Stress feels like hit points and runs out too fast"</div>
      <p><strong>Fix:</strong> Remind players that stress clears at end of scene. Encourage consequence-taking as a narrative choice, not a last resort. A player who takes "Winded and Desperate" as a consequence is making a story decision, not failing. Frame it positively: "Taking that consequence keeps you in the fight and gives the GM something interesting to work with."</p>
    </div>

    <h2 id="further-reading">Further reading</h2>
    <p>The community resources that go deeper than the SRD:</p>
    <ul>
      <li><a href="https://bookofhanz.com/" target="_blank" rel="noreferrer"><strong>The Book of Hanz</strong></a> — Robert Hanz's collected essays on Fate philosophy. The single best resource for understanding <em>why</em> Fate works the way it does. Free to read online. Especially recommended: "Fate Doesn't Have a Damage System," "Aspects Are the Most Important Thing," and "Fate as a Narrative Game."</li>
      <li><a href="https://fate-srd.com/fate-condensed" target="_blank" rel="noreferrer"><strong>Fate Condensed SRD</strong></a> — The complete rules, free. Use it as a reference during play. The GM chapter (p.41) is especially useful for difficulty-setting and NPC design.</li>
      <li><a href="https://fate-srd.com/odds-ends/introducing-people-fate" target="_blank" rel="noreferrer"><strong>"Introducing People to Fate"</strong></a> — Official SRD community article on teaching the game to new players. Covers sequencing and what to de-emphasise in session zero.</li>
      <li><a href="https://www.uptofourplayers.com/ready-to-roll/fate-core-rules/" target="_blank" rel="noreferrer"><strong>Up to Four Players — Fate Core Rules comic</strong></a> — Two-page visual summary of Fate Core mechanics. Widely cited as the fastest way to hand someone a Fate overview. Fate Core not Condensed, but the core concepts are identical.</li>
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
  <div style="font-size:var(--text-label);color:var(--text-muted)">
    Fate&#8482; is a trademark of Evil Hat Productions, LLC &nbsp;·&nbsp;
    D&amp;D&#174; is a trademark of Wizards of the Coast LLC &nbsp;·&nbsp;
    Released under <a href="/license">CC BY 3.0</a>
  </div>
</div>
</main>
