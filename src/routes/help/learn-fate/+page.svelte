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
    <p class="wiki-page-desc">Fate Condensed in 7 steps — everything players need, plus the GM extras.</p>

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
        <p>Describe what your character does, <strong>then</strong> choose the skill and action. Fiction drives the rules. Not "I roll Athletics" — "I leap over the counter and slide behind the bar."</p>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>D&D: pick a skill, then describe. Fate: describe first, mechanics second.</p></div>
        <div class="callout callout-info" role="note"><div class="callout-title"><i class="fa-solid fa-thumbs-up" aria-hidden="true"></i> You will get this wrong at first — that's fine</div><p>Every table forgets to invoke aspects, attacks instead of Create Advantage, and doesn't compel enough. None of this breaks the game. Play first, refine as you go.</p></div>
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
        <p>An <strong>aspect</strong> is a short phrase that is true about a character, scene, or situation. Invoke one (spend 1 FP) for +2 on a relevant roll. Accept a <strong>compel</strong> on one and earn 1 FP when it causes you trouble.</p>
        <p>Your character has 5 aspects: <strong>High Concept</strong> (who you are), <strong>Trouble</strong> (what complicates your life), <strong>Relationship</strong> (connection to another PC), and two more. <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>Aspects replace ability scores, feats, and backgrounds in one mechanic. "Strong as an Ox" is a narrative truth — invoke it when strength helps, get compelled when size is a problem.</p></div>
        <div class="callout callout-tip" role="note"><div class="callout-title">✍ Writing good aspects</div><p>Test in both directions. Can it be invoked for +2? Can it cause a problem worth a fate point? "Skilled Fighter" only works one way. "Fights Before Thinking" works both.</p></div>
        <div class="callout callout-info" role="note">
          <div class="callout-title"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i> Invoking aspects you don't own</div>
          <p>Invoke <em>any</em> aspect true in the scene — enemy consequences, situation aspects, a teammate's boost. Spend 1 FP and explain the relevance. The aspect's owner doesn't matter; its <strong>fictional truth</strong> does.</p>
        </div>
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
        <p>Roll 4 Fate dice, add the relevant skill, compare to a target. Results: <strong>Fail</strong> (below), <strong>Tie</strong> (equal — succeeds with a complication), <strong>Success</strong> (+1 or +2), <strong>Style</strong> (+3 or more). Skills are rated +0 to +4, arranged in a pyramid (1 at peak, 2 next, 3 below, 4 at Average).</p>
        <div class="lf-skill-pyramid" aria-label="FCon skill pyramid">
          <div class="lf-sp-tier"><span class="lf-sp-rating">Great (+4)</span><span class="lf-sp-slots">× 1</span></div>
          <div class="lf-sp-tier"><span class="lf-sp-rating">Good (+3)</span><span class="lf-sp-slots">× 2</span></div>
          <div class="lf-sp-tier"><span class="lf-sp-rating">Fair (+2)</span><span class="lf-sp-slots">× 3</span></div>
          <div class="lf-sp-tier"><span class="lf-sp-rating">Average (+1)</span><span class="lf-sp-slots">× 4</span></div>
          <div class="lf-sp-all">All others: Mediocre (+0)</div>
          <div class="lf-sp-list">Athletics · Burglary · Contacts · Crafts · Deceive · Drive · Empathy · Fight · Investigate · Lore · Notice · Physique · Provoke · Rapport · Resources · Shoot · Stealth · Will</div>
        </div>
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
        <div class="callout callout-warning" role="note">
          <div class="callout-title"><i class="fa-solid fa-ban" aria-hidden="true"></i> When NOT to roll</div>
          <p>Ask three questions before picking up the dice. If <em>any</em> answer is <strong>no</strong>, skip the roll and narrate the outcome.</p>
          <ol>
            <li><strong>Is the outcome uncertain?</strong> A master locksmith opening a basic lock isn't uncertain — it's automatic.</li>
            <li><strong>Would failure be interesting?</strong> Failure should push the story forward, not stall it. If failing just means "try again next round," don't roll.</li>
            <li><strong>Does the outcome matter right now?</strong> Stakes must be active in this scene. Rolling for things that have no consequences wastes the dice.</li>
          </ol>
          <p>Rolling for everything devalues the dice. <a href="https://fate-srd.com/fate-condensed/taking-action-rolling-the-dice" target="_blank" rel="noreferrer" class="srd-link">FCon SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
        </div>
        <div class="callout callout-info" role="note">
          <div class="callout-title"><i class="fa-solid fa-bolt" aria-hidden="true"></i> What is a boost?</div>
          <p>A <strong>boost</strong> is a fleeting aspect with one free invoke. Earned from Style on most actions, or a Tie on Attack. Name it immediately — <em>"Off Balance,"</em> <em>"Momentary Opening."</em> Pass it to an ally or use it yourself. Gone when used or when the scene ends.</p>
        </div>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>4dF ranges −4 to +4, averaging 0. Your skill rating is your expected result. A +3 skill hits Fair (+2) most of the time. No d20 swingyness.</p></div>
        <div class="callout callout-info" role="note"><div class="callout-title">📋 Ties succeed — with a cost</div><p>A tie is not a failure. The player gets what they wanted — but a complication enters. Never use a tie to block progress. <a href="https://fate-srd.com/fate-condensed/taking-action-rolling-the-dice" target="_blank" rel="noreferrer" class="srd-link">FCon SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p></div>
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
        <p>Start each session with at least 3 <strong>fate points</strong>. Spend one to <strong>invoke</strong> an aspect for +2. Earn one when you accept a <strong>compel</strong>. Refuse a compel by spending a fate point. <a href="https://fate-srd.com/fate-condensed/aspects-and-fate-points" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a> For the GM-side, see <a href="/help/fate-mechanics#fate-point-economy-gm">Fate Point Economy →</a></p>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>Imagine every flaw on your sheet gave you Inspiration when it caused problems, and you could spend Inspiration for +2 on any roll. That's the fate point economy.</p></div>
        <div class="callout callout-tip" role="note"><div class="callout-title">🎲 GM tip — compel honestly</div><p>A compel is an offer, not a punishment. "Your aspect <em>Always Takes the Hard Way</em> — would your character go back for the contact?" The player decides. If it feels like a gotcha, it's a trap, not a compel.</p></div>
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
        <p>Absorb hits with <strong>stress boxes</strong> (3 per track, 1 shift each) or <strong>consequences</strong> (Mild = 2 shifts, Moderate = 4, Severe = 6). Stress clears every scene. Can't absorb all shifts? You're <strong>taken out</strong>. <strong>Concede before your opponent rolls</strong> to exit on your terms and earn fate points. <a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">FCon SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>No hit points. Stress is plot armour — clears every scene. Consequences are lasting damage as aspects. "Badly Burned Hands" affects you until healed.</p></div>
        <div class="callout callout-info" role="note">
          <div class="callout-title"><i class="fa-solid fa-heart-pulse" aria-hidden="true"></i> Consequence recovery — the exact steps</div>
          <ol>
            <li><strong>Take the consequence</strong> — write a named aspect on your sheet (<em>"Badly Burned Hands"</em>). It absorbs: Mild = 2 shifts · Moderate = 4 shifts · Severe = 6 shifts.</li>
            <li><strong>Get treated</strong> — someone makes an Overcome roll against the consequence's difficulty: Mild Fair (+2) · Moderate Great (+4) · Severe Fantastic (+6). Must succeed before recovery starts.</li>
            <li><strong>Timer starts after treatment</strong> — Mild: clears at the end of the <em>next scene</em> · Moderate: clears at the end of the <em>next session</em> · Severe: clears after a <em>breakthrough</em>.</li>
            <li><strong>Until cleared</strong> — the consequence is a live aspect. The GM can invoke it against you; you can compel it for fate points. Untreated consequences never clear on their own.</li>
          </ol>
          <p><a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">FCon SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
        </div>
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
        <p>Characters grow through two advancement types — no XP, no levels. Every session ends with a <strong>Milestone</strong>. Story arcs end with a <strong>Breakthrough</strong>. <a href="https://fate-srd.com/fate-condensed/advancement" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
        <div class="wiki-table-wrap">
        <table class="wiki-table">
          <thead><tr><th scope="col">Type</th><th scope="col">When</th><th scope="col">What you can do — choose one per option</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Milestone</strong></td>
              <td>End of every session</td>
              <td>Swap two skill ratings · rename one aspect · swap one stunt for another · begin recovering a Mild consequence (if untreated)</td>
            </tr>
            <tr>
              <td><strong>Breakthrough</strong></td>
              <td>End of a story arc</td>
              <td>All Milestone options, plus: add +1 to a skill column · add a new stunt (costs 1 Refresh) · rewrite your High Concept · begin recovering a Severe consequence</td>
            </tr>
          </tbody>
        </table>
        </div>
        <div class="callout callout-dnd" role="note"><div class="callout-title">⚔ Coming from D&amp;D</div><p>Stunts replace feats — narrower and cheaper. Milestones replace levelling up but happen every session. Characters change laterally (different) more than vertically (stronger).</p></div>
        <div class="callout callout-info" role="note"><div class="callout-title">📋 Stunt format</div><p><strong>Pattern 1:</strong> "+2 to [Skill] when [specific condition]." <strong>Pattern 2:</strong> "Once per scene, [effect] when [trigger]." Stunts never cost a fate point. <a href="https://fate-srd.com/fate-condensed/getting-started" target="_blank" rel="noreferrer" class="srd-link">FCon SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p></div>
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
        <p>As a GM, your main tools are: <strong>compels</strong> (offer fate points to create complications), <strong>scene aspects</strong> (set the stage with invokable/compellable truths), <strong>NPCs</strong> (minor = 1–2 aspects, no consequences; major = full character sheet), and the <strong>GM fate point pool</strong>. <a href="https://fate-srd.com/fate-condensed/being-the-game-master" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>

        <div class="callout callout-info" role="note">
          <div class="callout-title"><i class="fa-solid fa-coins" aria-hidden="true"></i> The GM fate point pool</div>
          <p>1 fate point per PC per scene — shared across all NPCs. Resets every scene. Use for NPC invokes. When a player refuses a compel, you pocket their spent point.</p>
        </div>

        <div class="callout callout-tip" role="note">
          <div class="callout-title"><i class="fa-solid fa-film" aria-hidden="true"></i> Scene framing</div>
          <p>Start with the action in motion: not "you arrive at the warehouse" but "you're inside, crates moving." Establish: (1) <strong>what's at stake</strong>, (2) <strong>situation aspects</strong>, (3) <strong>what happens if PCs don't act</strong>. End the moment the dramatic question is answered.</p>
        </div>

        <p><strong>Setting difficulty:</strong> Use the Fate Ladder as a guide. When in doubt, Fair (+2) is the baseline — a competent character should succeed more often than not. Raise it when failure is genuinely interesting; don't raise it to make the game harder.</p>
        <div class="wiki-table-wrap">
        <table class="wiki-table">
          <thead><tr><th scope="col">Difficulty</th><th scope="col">Rating</th><th scope="col">Use when…</th></tr></thead>
          <tbody>
            <tr><td>Mediocre</td><td>+0</td><td>Any trained person auto-succeeds — roll only if you want narrative drama</td></tr>
            <tr><td>Average</td><td>+1</td><td>Minor obstacle; specialists barely notice it</td></tr>
            <tr><td>Fair</td><td>+2</td><td>Routine challenge; a competent character succeeds more often than not</td></tr>
            <tr><td>Good</td><td>+3</td><td>Genuinely hard; even skilled characters might fail</td></tr>
            <tr><td>Great</td><td>+4</td><td>Requires specialisation or free invokes; reserve for important moments</td></tr>
            <tr><td>Superb (+5) or higher</td><td>+5+</td><td>Exceptional feats; climactic moments only — very rare</td></tr>
          </tbody>
        </table>
        </div>

        <p><strong>Choosing the right structure:</strong> Before reaching for conflict, ask whether challenge or contest fits better.</p>
        <div class="wiki-table-wrap">
        <table class="wiki-table">
          <thead><tr><th scope="col">Structure</th><th scope="col">Use when…</th><th scope="col">How it works</th></tr></thead>
          <tbody>
            <tr><td><strong>Challenge</strong></td><td>Group faces multiple obstacles in sequence; no direct opponent</td><td>Series of Overcome rolls vs. set difficulties; partial success accepted</td></tr>
            <tr><td><strong>Contest</strong></td><td>Two sides race for a goal without trying to harm each other</td><td>Both sides roll each exchange; higher effort wins a point. First to 3 points wins</td></tr>
            <tr><td><strong>Conflict</strong></td><td>Both sides intend to harm or forcibly remove the other</td><td>Attack vs. Defend each exchange; shifts = stress; ends when one side is taken out or concedes</td></tr>
          </tbody>
        </table>
        </div>

        <div class="callout callout-info" role="note">
          <div class="callout-title"><i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> Conflict turn order</div>
          <p>Turn order comes from narrative logic — who noticed the threat first. Many tables use <strong>Popcorn Initiative</strong>: after acting, choose who goes next. Rewards tactical coordination.</p>
        </div>

        <p><strong>Failure is never boring.</strong> On a fail, the situation changes. On a Tie, success with a complication. "Success at a cost" is an option on any fail: offer what they want, with a consequence. <a href="https://fate-srd.com/fate-condensed/being-the-game-master" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></p>
        <div class="callout callout-tip" role="note"><div class="callout-title">🎲 For the GM</div><p>Ogma's generators produce NPCs, scenes, encounters, and more. The <strong>How</strong> tab below every result gives running tips specific to that generator.</p></div>
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
      <p><a href="/help/learn-fate-deep"><strong>Deep Dive</strong></a> — interactive tutorial, play-by-post walkthrough, Create Advantage strategy, first session checklist.</p>
      <p><a href="https://bookofhanz.com/" target="_blank" rel="noreferrer"><strong>The Book of Hanz</strong></a> — the community's best resource for understanding <em>why</em> Fate works. Free. Start with "Fate Doesn't Have a Damage System."</p>
      <p><a href="/help/fate-mechanics"><strong>Fate Mechanics &rarr;</strong></a> · <a href="/help/at-the-table#conflict-walkthrough"><strong>At the Table &rarr;</strong></a></p>
    </div>

    <div class="wiki-footer">
      <div>
        <a href="/help">Help Home</a> &nbsp;·&nbsp;
        <a href="/">Open Ogma</a> &nbsp;·&nbsp;
        <a href="/about">About</a> &nbsp;·&nbsp;
        <a href="/license">Full Attribution</a> &nbsp;·&nbsp;
        <a href="https://fate-srd.com/" target="_blank" rel="noreferrer">fate-srd.com</a>
      </div>
      <div class="wiki-footer-meta">
        Fate&#8482; is a trademark of Evil Hat Productions, LLC &nbsp;·&nbsp;
        D&amp;D&#174; is a trademark of Wizards of the Coast LLC &nbsp;·&nbsp;
        Released under <a href="/license">CC BY 3.0</a>
      </div>
    </div>

</main>
