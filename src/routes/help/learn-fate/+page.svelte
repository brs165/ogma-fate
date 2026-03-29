<script>
  import HelpDiceRoller from '$lib/components/shared/HelpDiceRoller.svelte';

  let copied = $state(false);
  function shareGuide() {
    const url = window.location.origin + '/help/learn-fate';
    // Use native share sheet on mobile (#16), clipboard on desktop
    if (navigator.share) {
      navigator.share({ title: 'Learn Fate — Ogma', url }).catch(() => {});
      return;
    }
    navigator.clipboard.writeText(url).then(() => {
      copied = true;
      setTimeout(() => { copied = false; }, 2500);
    }).catch(() => {
      prompt('Copy this link and send it to your players:', url);
    });
  }
</script>

<svelte:head>
  <title>Learn Fate — Ogma Help</title>
  <meta name="description" content="Learn the core Fate Condensed rules in 7 steps" />
</svelte:head>

<main class="wiki-content" id="main-content">
    <div class="wiki-page-eyebrow">Learn</div>
    <h1>Learn Fate in 7 steps</h1>
    <p class="wiki-page-desc">A guided walkthrough of the Fate Condensed rules — everything a player needs, plus the extras a GM needs on top.</p>

    <!-- Share button (#19) -->
    <div class="learn-share-row">
      <button class="learn-share-btn" onclick={shareGuide} aria-label="Copy link to share with players">
        <i class="fa-solid {copied ? 'fa-check' : 'fa-share-nodes'}" aria-hidden="true"></i>
        {copied ? 'Link copied!' : 'Share this guide with your players'}
      </button>
    </div>

    <!-- Quick Start summary (#20) -->
    <details class="learn-quickstart" open>
      <summary class="learn-quickstart-toggle">Quick Start — 5 things to know</summary>
      <ol class="learn-quickstart-list">
        <li><strong>Fiction first</strong> — describe what your character does, then pick a skill and roll.</li>
        <li><strong>Aspects</strong> — short phrases that are true. Spend a fate point to invoke one for +2, or accept a compel for complications + 1 FP.</li>
        <li><strong>4dF + skill</strong> — roll four Fate dice (−1/0/+1 each), add your skill. Beat the target by 1–2 = success, 3+ = success with style.</li>
        <li><strong>Fate points</strong> — start with 3. Spend to invoke aspects, earn by accepting compels. This is the heartbeat of Fate.</li>
        <li><strong>Stress clears each scene</strong> — consequences (Mild/Moderate/Severe) are lasting harm. No HP — just narrative truths.</li>
      </ol>
    </details>

    <nav class="wiki-toc" aria-label="On this page">
      <div class="wiki-toc-title">On this page</div>
      <a href="#step-1">1. Fiction first</a>
      <a href="#step-2">2. Aspects</a>
      <a href="#step-3">3. Skills &amp; dice</a>
      <a href="#step-4">4. Fate points</a>
      <a href="#step-5">5. Stress</a>
      <a href="#step-6">6. Stunts</a>
      <a href="#step-7">7. For the GM</a>
    </nav>

    <details class="step-block" id="step-1" open>
      <summary class="step-summary"><span class="step-num">1</span> Fiction first</summary>
      <div class="step-body">
        <p>In Fate, you describe what your character does in the story, <strong>then</strong> choose the skill and action that fits. The fiction drives the rules, not the other way around. You don't say "I roll Athletics." You say "I leap over the counter and slide behind the bar" — and the GM says "that sounds like Athletics to overcome the obstacle."</p>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>In D&D you pick a skill, then describe the action. In Fate it's reversed. Describe first, mechanics second.</p></div>
        <div class="callout callout-info" role="note"><div class="callout-title"><i class="fa-solid fa-thumbs-up" aria-hidden="true"></i> You will get this wrong at first — and that's fine</div><p>Every table plays Fate wrong for a few sessions. You'll forget to invoke aspects. Players will attack instead of Create Advantage. The GM won't compel enough. None of this breaks the game. Fate is resilient. Play first, refine as you go. The rules only matter in the moments they make the story better.</p></div>
        <div class="callout callout-scenario" role="note">
          <div class="callout-title">Try it — describe first, then roll</div>
          <p>Say out loud what your character does. Then roll. Notice how the dice feel like they're answering the fiction, not replacing it.</p>
          <HelpDiceRoller mode="basic" label="4dF — raw roll" />
        </div>
      </div>
    </details>

    <details class="step-block" id="step-2" open>
      <summary class="step-summary"><span class="step-num">2</span> Aspects — the core of everything</summary>
      <div class="step-body">
        <p>An <strong>aspect</strong> is a short phrase that is true about a character, scene, or situation. "Burned-Out Corp Fixer," "Slippery Deck in the Storm," "The Crown Owes Me a Favour." Aspects do two things: you can <strong>invoke</strong> them (spend a fate point for +2 on a roll when they're relevant) or they can be <strong>compelled</strong> (the GM offers you a fate point to accept a complication).</p>
        <p>Your character has 5 aspects: a <strong>High Concept</strong> (who you are), a <strong>Trouble</strong> (what makes your life complicated), a <strong>Relationship</strong> (your connection to another PC), and two more. <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>Aspects replace ability scores, feats, and background features in one mechanic. "Strong as an Ox" is not a Strength score — it's a narrative truth you can invoke for +2 on any roll where being strong matters, and get compelled when being big is a problem.</p></div>
        <div class="callout callout-tip" role="note"><div class="callout-title">✍ Writing good aspects</div><p>Test every aspect in both directions before writing it down. Can you imagine a moment where invoking it for +2 makes narrative sense? Can you imagine a moment where it causes you a problem worth a fate point? If not — rewrite it. "Skilled Fighter" only works one way. "Fights Before Thinking" works both.</p></div>
        <div class="callout callout-scenario" role="note">
          <div class="callout-title">Try an invoke — roll twice, pick the better result</div>
          <p>Pick an aspect like <em>"Stronger Than I Look."</em> Roll 4dF. That's your base. Now roll again with <strong>+2</strong> (the invoke bonus) — that's your roll after spending a fate point. Feel the difference.</p>
          <div class="learn-double-roll">
            <HelpDiceRoller mode="basic" label="Without invoke" />
            <HelpDiceRoller mode="skill" skill={2} label="With invoke (+2)" />
          </div>
        </div>
      </div>
    </details>

    <details class="step-block" id="step-3" open>
      <summary class="step-summary"><span class="step-num">3</span> Skills and dice</summary>
      <div class="step-body">
        <p>Your character has 19 skills rated from +0 (Mediocre) to +4 (Great). When you act, you roll 4 Fate dice (each shows +1, 0, or −1), add the relevant skill, and compare to a target number. Results: <strong>Fail</strong> (below target), <strong>Tie</strong> (equal), <strong>Success</strong> (+1 or +2 over), <strong>Success with Style</strong> (+3 or more).</p>
        <p>Every roll uses one of four actions. Choose the one that fits what your character is doing. <a href="https://fate-srd.com/fate-condensed/taking-action-rolling-the-dice" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
        <div class="lf-actions-grid" role="list" aria-label="The four Fate actions">
          <div class="lf-action lf-action-overcome" role="listitem">
            <div class="lf-action-hdr"><i class="fa-solid fa-forward" aria-hidden="true"></i> Overcome</div>
            <div class="lf-action-body">
              <div class="lf-action-use">Push past any obstacle standing between you and a goal — locked door, flooded river, hostile crowd, ticking clock.</div>
              <div class="lf-action-outcomes">
                <div class="lf-out-row"><span class="lf-out lf-out-fail">Fail</span>Don't get through, or succeed at serious cost</div>
                <div class="lf-out-row"><span class="lf-out lf-out-tie">Tie</span>Get through with a minor complication</div>
                <div class="lf-out-row"><span class="lf-out lf-out-win">Success</span>Clear the obstacle cleanly</div>
                <div class="lf-out-row"><span class="lf-out lf-out-style">Style</span>Clear it and earn a boost</div>
              </div>
            </div>
          </div>
          <div class="lf-action lf-action-advantage" role="listitem">
            <div class="lf-action-hdr"><i class="fa-solid fa-layer-group" aria-hidden="true"></i> Create an Advantage</div>
            <div class="lf-action-body">
              <div class="lf-action-use">Place a new aspect on the scene or a character with a free invoke. Set up the fiction before the decisive roll.</div>
              <div class="lf-action-outcomes">
                <div class="lf-out-row"><span class="lf-out lf-out-fail">Fail</span>GM gets a free invoke against you instead</div>
                <div class="lf-out-row"><span class="lf-out lf-out-tie">Tie</span>Aspect created, but no free invoke</div>
                <div class="lf-out-row"><span class="lf-out lf-out-win">Success</span>Aspect + one free invoke</div>
                <div class="lf-out-row"><span class="lf-out lf-out-style">Style</span>Aspect + two free invokes</div>
              </div>
            </div>
          </div>
          <div class="lf-action lf-action-attack" role="listitem">
            <div class="lf-action-hdr"><i class="fa-solid fa-burst" aria-hidden="true"></i> Attack</div>
            <div class="lf-action-body">
              <div class="lf-action-use">Inflict stress or consequences on a target in a conflict. Only valid when you intend to harm — physically, socially, or mentally.</div>
              <div class="lf-action-outcomes">
                <div class="lf-out-row"><span class="lf-out lf-out-fail">Fail</span>Attack misses or is absorbed</div>
                <div class="lf-out-row"><span class="lf-out lf-out-tie">Tie</span>No damage, but attacker earns a boost</div>
                <div class="lf-out-row"><span class="lf-out lf-out-win">Success</span>Shifts of damage dealt as stress (1 shift = 1 box)</div>
                <div class="lf-out-row"><span class="lf-out lf-out-style">Style</span>Shifts dealt — or reduce by 1 for a boost</div>
              </div>
            </div>
          </div>
          <div class="lf-action lf-action-defend" role="listitem">
            <div class="lf-action-hdr"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Defend</div>
            <div class="lf-action-body">
              <div class="lf-action-use">React to stop an Attack or Create Advantage against you. Usually triggered automatically — you don't declare it, you roll when targeted.</div>
              <div class="lf-action-outcomes">
                <div class="lf-out-row"><span class="lf-out lf-out-fail">Fail</span>Attacker's action succeeds fully</div>
                <div class="lf-out-row"><span class="lf-out lf-out-tie">Tie</span>Attacker succeeds but you can spend a FP to stop it</div>
                <div class="lf-out-row"><span class="lf-out lf-out-win">Success</span>Attack or advantage fails completely</div>
                <div class="lf-out-row"><span class="lf-out lf-out-style">Style</span>Block the action and earn a boost</div>
              </div>
            </div>
          </div>
        </div>
        <div class="callout callout-info" role="note">
          <div class="callout-title"><i class="fa-solid fa-bolt" aria-hidden="true"></i> What is a boost?</div>
          <p>A <strong>boost</strong> is a fleeting aspect with exactly <strong>one free invoke</strong>. You earn it from Success with Style on most actions, or a Tie on Attack. Name it immediately — <em>"Off Balance,"</em> <em>"Momentary Opening,"</em> <em>"Blinded by Debris."</em> Use the free invoke on your next roll (or pass it to an ally this exchange). Once used, or when the scene ends, the boost disappears. It costs no Fate Point to create and none to use — it's pure momentum reward for exceptional rolling.</p>
        </div>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>4dF averages to 0 with a range of −4 to +4. Your skill rating IS your expected result. A +3 skill hits Fair (+2) difficulty most of the time. No d20 swingyness.</p></div>
        <div class="callout callout-info" role="note"><div class="callout-title">📋 Ties succeed — with a cost</div><p>A tie (matching the difficulty exactly) is not a failure. The player achieves their goal, but something complicates it — they take a minor cost, the situation shifts, or a new complication enters the scene. <a href="https://fate-srd.com/fate-condensed/taking-action-rolling-the-dice" target="_blank" rel="noreferrer" class="srd-link">FCon SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a> Never use a tie to simply block forward progress.</p></div>
        <div class="callout callout-scenario" role="note">
          <div class="callout-title">Try a roll — Good (+3) Athlete vs. Fair (+2) difficulty</div>
          <p>Your character has Athletics +3. Roll 4dF and add 3. <strong>+1 or +2 over target = Success. +3 or more = Success with Style. 0 = Tie. Below = Fail.</strong> Roll a few times — feel how rarely you land on extremes.</p>
          <HelpDiceRoller mode="skill" skill={3} difficulty={2} label="Athletics +3" />
        </div>
      </div>
    </details>

    <details class="step-block" id="step-4" open>
      <summary class="step-summary"><span class="step-num">4</span> Fate points — the economy</summary>
      <div class="step-body">
        <p>You start each session with at least 3 <strong>fate points</strong>. Spend one to <strong>invoke</strong> an aspect for +2 on a roll (or a reroll). Earn one when you accept a <strong>compel</strong> — the GM offers a fate point and a complication based on one of your aspects. You can refuse a compel by spending a fate point instead.</p>
        <p>The flow is: accept compels to earn points, spend points to invoke aspects on big rolls. This is the heartbeat of Fate. More compels = more fate points = more dramatic swings. <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a> For the GM-side of the economy (how many points the GM starts with per scene), see <a href="/help/fate-mechanics#fate-point-economy-gm">Fate Point Economy →</a></p>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>There is no equivalent in D&D. The closest analogy: imagine if every flaw on your character sheet gave you Inspiration when it caused problems, and you could spend Inspiration for +2 on any roll. That's the fate point economy.</p></div>
        <div class="callout callout-tip" role="note"><div class="callout-title">🎲 GM tip — compel honestly</div><p>A compel is an offer, not a punishment. Frame it as a question: "Your aspect <em>Always Takes the Hard Way</em> — would your character take the obvious exit, or insist on going back for the contact?" The player decides what their character would actually do. If it feels like a gotcha, it's not a compel — it's a trap.</p></div>
        <div class="callout callout-scenario" role="note">
          <div class="callout-title">The compel moment — roll, then decide</div>
          <p>You have a trouble: <em>"Always Takes the Hard Way."</em> Roll Stealth (+1) to sneak past the guard. If the result is bad, the GM offers you a fate point to have your character make noise on purpose. Accept and earn the point — or spend one to refuse.</p>
          <HelpDiceRoller mode="skill" skill={1} label="Stealth +1 (trouble in play)" />
        </div>
      </div>
    </details>

    <details class="step-block" id="step-5" open>
      <summary class="step-summary"><span class="step-num">5</span> Stress and consequences</summary>
      <div class="step-body">
        <p>When you take a hit, you absorb it with <strong>stress boxes</strong> (1 shift each, 3 per track by default — you can mark <em>as many as you need</em> per hit) or <strong>consequences</strong> (named aspects: Mild absorbs 2 shifts, Moderate absorbs 4, Severe absorbs 6). Stress clears at end of every scene. If you can't absorb all the shifts, you're <strong>taken out</strong> — the attacker narrates what happens. You can also <strong>concede before your opponent rolls</strong> — you leave the scene on your terms and earn fate points. Once dice hit the table, the window to concede has passed (<a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">FCon SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>).</p>
        <p>Stress clears at the end of every scene. Consequences persist: Mild clears after a scene (with treatment), Moderate after a session, Severe after a breakthrough. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>There are no hit points. Stress is plot armour — it goes away after every scene. Consequences are the real damage, and they're aspects that can be invoked and compelled. "Badly Burned Hands" affects you in every scene until it heals.</p></div>
        <div class="callout callout-warning" role="note"><div class="callout-title">⚠ Common mistake — consequence recovery</div><p>Consequences don't heal automatically. They require a treatment roll first (Overcome against the consequence's difficulty), <em>then</em> the timer starts. Mild: Fair +2 difficulty, clears end of next scene. Moderate: Great +4, clears end of session. Severe: Fantastic +6, clears end of breakthrough. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">FCon SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p></div>
        <div class="callout callout-scenario" role="note">
          <div class="callout-title">Try an attack roll — see how many shifts hit</div>
          <p>An enemy has Fight +2. You defend with Athletics +1. Roll both — the difference is the shifts. Under 3 shifts: tick stress boxes. 3–5: take a consequence. 6+: you're in trouble.</p>
          <div class="learn-double-roll">
            <HelpDiceRoller mode="skill" skill={2} label="Enemy Attack (Fight +2)" noOutcome={true} />
            <HelpDiceRoller mode="skill" skill={1} label="Your Defence (Athletics +1)" noOutcome={true} />
          </div>
        </div>
      </div>
    </details>

    <details class="step-block" id="step-6" open>
      <summary class="step-summary"><span class="step-num">6</span> Stunts and advancement</summary>
      <div class="step-body">
        <p><strong>Stunts</strong> give your character a special edge: +2 to a specific skill in a specific situation, or a once-per-scene special ability. You start with 3 free; each extra costs 1 Refresh (minimum Refresh 1).</p>
        <p>Characters grow through <strong>milestones</strong> (end of session: swap skills, rewrite aspects or stunts) and <strong>breakthroughs</strong> (end of story arc: increase a skill, rewrite your high concept, begin consequence recovery). No XP. No levels. <a href="https://fate-srd.com/fate-condensed/getting-started" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>Stunts replace feats but are narrower and cheaper. Milestones replace levelling up but happen every session. Characters change laterally (different) more than vertically (stronger).</p></div>
        <div class="callout callout-info" role="note"><div class="callout-title">📋 Stunt format — two valid patterns</div><p><strong>Pattern 1 (most common):</strong> "+2 to [Skill] when [specific condition]." The condition must be narrow enough that it doesn't apply every roll. <strong>Pattern 2:</strong> "Once per scene, [special effect] when [trigger]." No fate point cost. Stunts should never charge a fate point — that's compels. <a href="https://fate-srd.com/fate-condensed/getting-started" target="_blank" rel="noreferrer" class="srd-link">FCon SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p></div>
        <div class="callout callout-scenario" role="note">
          <div class="callout-title">See the stunt difference — roll with and without</div>
          <p>A character has Deceive +2. Their stunt: <em>"Silver Tongue: +2 to Deceive when creating an advantage through misdirection."</em> The situation triggers it — they effectively roll at +4.</p>
          <div class="learn-double-roll">
            <HelpDiceRoller mode="skill" skill={2} label="Deceive +2 (no stunt)" />
            <HelpDiceRoller mode="skill" skill={4} label="Deceive +4 (stunt active)" />
          </div>
        </div>
        <div class="learn-npc-demo" id="step-6-npc" aria-label="Example NPC with stunts">
          <div class="learn-npc-eyebrow">🎲 Generated NPC — see stunts in action</div>
          <div class="learn-npc-name">Cassidy "Threadbare" Voss</div>
          <div class="learn-npc-aspects">
            <div class="learn-npc-asp-row"><span class="learn-npc-asp-label">High Concept</span><span class="learn-npc-asp-val">Debt-Collector Who Knows All the Exits</span></div>
            <div class="learn-npc-asp-row"><span class="learn-npc-asp-label">Trouble</span><span class="learn-npc-asp-val">Owes the People She Collects For</span></div>
          </div>
          <div class="learn-npc-skills">Fight +3 · Contacts +3 · Deceive +2 · Athletics +2 · Notice +1</div>
          <div class="learn-npc-stunts">
            <div class="learn-npc-stunt"><strong>Exit Strategy:</strong> +2 to Athletics when escaping a location she has previously visited.</div>
            <div class="learn-npc-stunt"><strong>I Know What You Owe:</strong> Once per scene, invoke a target's financial or social debt as a free aspect with one free invoke.</div>
          </div>
          <div class="learn-npc-note">Notice how both stunts are tied to her High Concept — "knows all the exits" is Exit Strategy, "knows what people owe" is the free invoke. Aspects and stunts reinforce each other.</div>
        </div>
      </div>
    </details>

    <details class="step-block" id="step-7" open>
      <summary class="step-summary"><span class="step-num">7</span> Running the game <span class="step-tag">For the GM</span></summary>
      <div class="step-body">
        <p>As a GM, your main tools are: <strong>compels</strong> (offer fate points to create complications), <strong>scene aspects</strong> (set the stage with invokable/compellable truths), <strong>NPCs</strong> (minor = 1-2 aspects, no consequences; major = full character sheet), and the <strong>GM fate point pool</strong> (1 per PC, shared across all NPCs).</p>
        <p>Set difficulty using the adjective ladder: Fair (+2) for routine, Good (+3) for challenging, Great (+4) for hard. Use <strong>challenges</strong> for multi-skill problems, <strong>contests</strong> for opposed races, and <strong>conflicts</strong> when both sides can hurt each other.</p>
        <p>The golden rule: <strong>failure is never boring.</strong> On a failed roll, the situation changes — it doesn't stall. "Success at a cost" is your best friend: they get what they want, but something else goes wrong. <a href="https://fate-srd.com/fate-condensed/being-the-game-master" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
        <div class="callout callout-tip" role="note"><div class="callout-title">🎲 GM tip — failure moves the story</div><p>Never let a failed roll mean "nothing happens." On a failure, the situation changes — the character doesn't get what they wanted AND something new enters the fiction. A failed Stealth roll doesn't just mean the guard heard them; it means the guard is now between them and the exit, with backup on the way. <em>FCon SRD p.20: "Fail forward."</em></p></div>
        <div class="callout callout-tip" role="note"><div class="callout-title">🎲 For the GM</div><p>Ogma's generators create all of this for you: NPCs with aspects and skills, scenes with zones and situation aspects, encounters with opposition and stake conditions, and more. The <strong>How</strong> tab below every result gives you running tips specific to that generator.</p></div>
        <div class="callout callout-scenario" role="note">
          <div class="callout-title">Set a difficulty — does the player beat it?</div>
          <p>A player wants to pick a lock (Burglary +2). You set difficulty at Good (+3) — challenging but not impossible. Roll for the player and see if they succeed, tie (succeed at a cost), or fail (situation changes).</p>
          <HelpDiceRoller mode="skill" skill={2} difficulty={3} label="Burglary +2 vs Good (+3) lock" />
        </div>
      </div>
    </details>

    <div class="callout callout-scenario">
      <div class="callout-title">Ready to try it?</div>
      <p>Pick a <a href="/">campaign world</a> and roll a Minor NPC. Read the result, check the <strong>What</strong> tab to understand the mechanic, and check <strong>In play</strong> for an invoke/compel example. That's your first Fate moment.</p>
    </div>

    <div class="callout callout-info">
      <div class="callout-title"><i class="fa-solid fa-book-open" aria-hidden="true"></i> Go deeper</div>
      <p><strong>Ready for more?</strong> <a href="/help/learn-fate-deep"><strong>Learn Fate — Deep Dive</strong></a> has an interactive tutorial scene, a full play-by-post walkthrough, a strategy guide covering Create Advantage and the FP economy, and a first session checklist.</p>
      <p>The community's #1 recommended resource for truly understanding Fate: <a href="https://bookofhanz.com/" target="_blank" rel="noreferrer"><strong>The Book of Hanz</strong></a> — Robert Hanz's essays on Fate philosophy. Free to read. Start with "Fate Doesn't Have a Damage System."</p>
      <p>For the full mechanics reference: <a href="/help/fate-mechanics"><strong>Fate Mechanics &rarr;</strong></a> · For a conflict walkthrough: <a href="/help/at-the-table#conflict-walkthrough"><strong>At the Table &rarr;</strong></a></p>
    </div>

</main>
