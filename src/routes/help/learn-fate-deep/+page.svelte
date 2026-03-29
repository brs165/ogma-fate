<script>
  import HelpDiceRoller from '$lib/components/shared/HelpDiceRoller.svelte';
  let tutStep = $state(0);
  let stratOpen = $state('ca');
</script>

<svelte:head>
  <title>Learn Fate — Deep Dive · Ogma Help</title>
  <meta name="description" content="Go deeper into Fate Condensed: an interactive tutorial scene, a full play-by-post walkthrough, strategy guide, and first session checklist." />
</svelte:head>

<main class="wiki-content" id="main-content">
  <div class="wiki-breadcrumb"><a href="/help">Help</a> <span class="sep">/</span> <a href="/help/learn-fate">Learn Fate</a> <span class="sep">/</span> Deep Dive</div>
  <div class="wiki-page-eyebrow">Deep Dive</div>
  <h1>Learn Fate — Deep Dive</h1>
  <p class="wiki-page-desc">You know the 7 steps. Now learn how they feel at the table — through a guided scene, a full walkthrough, a strategy primer, and a session-one checklist.</p>

  <nav class="wiki-section" aria-label="Page sections" style="margin-bottom:32px">
    <div class="wiki-card-grid">
      <a href="#tutorial"><span class="card-icon"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i></span><strong>Interactive Tutorial</strong><span class="wiki-card-sub">Guided scene: describe, roll, interpret</span></a>
      <a href="#walkthrough"><span class="card-icon"><i class="fa-solid fa-book-open" aria-hidden="true"></i></span><strong>Play-by-Post</strong><span class="wiki-card-sub">A full scene played out beat by beat</span></a>
      <a href="#strategy"><span class="card-icon"><i class="fa-solid fa-chess" aria-hidden="true"></i></span><strong>Strategy Guide</strong><span class="wiki-card-sub">Create Advantage, FP economy, conceding</span></a>
      <a href="#checklist"><span class="card-icon"><i class="fa-solid fa-list-check" aria-hidden="true"></i></span><strong>First Session</strong><span class="wiki-card-sub">What to prep, what to skip, how to pace</span></a>
    </div>
  </nav>

  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <!-- SECTION 1: INTERACTIVE TUTORIAL -->
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <div class="wiki-section" id="tutorial">
    <h2 class="wiki-section-title"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i> Interactive Tutorial — Your First Scene</h2>
    <p>This walks you through a single Fate Condensed scene, step by step. At each beat, you'll describe what your character does, then roll dice to see what happens. The Teacher voice explains the <em>why</em> behind every mechanic as it comes up.</p>

    <div class="callout callout-info" role="note">
      <div class="callout-title"><i class="fa-solid fa-user" aria-hidden="true"></i> Your character</div>
      <p><strong>Kira Vasquez</strong> — a burned-out courier in a post-apocalyptic city.<br/>
      <strong>High Concept:</strong> <em>"Last Courier Who Knows the Old Routes"</em><br/>
      <strong>Trouble:</strong> <em>"Trusts the Map More Than Her Eyes"</em><br/>
      <strong>Skills:</strong> Athletics +3 (Good), Notice +2 (Fair), Drive +2 (Fair), Stealth +1 (Average)</p>
    </div>

    <!-- Tutorial steps — progressive disclosure -->
    <div class="step-block">
      <div class="step-num"><i class="fa-solid fa-play" aria-hidden="true"></i></div>
      <div class="step-body">
        <div class="step-title">The scene opens</div>
        <p>The GM says: <em>"You're in the ruins of the old rail station. There's a package behind the ticket counter — the one you were hired to retrieve. But the floor is covered in broken glass, and through the shattered windows you can see two scavengers approaching from the east platform. What do you do?"</em></p>

        <div class="callout callout-tip" role="note">
          <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> The Teacher says</div>
          <p>Notice the GM didn't say "roll initiative." They described the <strong>fiction</strong> — the broken glass, the scavengers, the package. Your response should also be fiction. Don't say "I roll Stealth." Say what Kira <em>does</em>.</p>
        </div>

        <p><strong>You say:</strong> <em>"I crouch behind the overturned bench and try to reach the counter without being seen — moving low through the debris."</em></p>
        <p>The GM says: <em>"That sounds like you're trying to Overcome the obstacle of crossing the station unseen. Roll Stealth against Fair (+2) difficulty — the scavengers aren't actively searching, but the glass makes it tricky."</em></p>

        <div class="callout callout-scenario" role="note">
          <div class="callout-title"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> Roll Stealth (+1)</div>
          <p>Roll 4dF and add your Stealth of +1. You need to beat Fair (+2).</p>
          <HelpDiceRoller mode="skill" skill={1} difficulty={2} label="Stealth +1" />
        </div>

        <div class="callout callout-info" role="note">
          <div class="callout-title"><i class="fa-solid fa-book" aria-hidden="true"></i> Reading the result</div>
          <p><strong>Succeed (+2 or higher):</strong> You reach the counter unseen. You have the initiative.<br/>
          <strong>Tie (exactly +2):</strong> You get there, but at a minor cost — maybe you knock something over and they heard it.<br/>
          <strong>Fail (+1 or lower):</strong> They spot you. But here's the Fate difference: <em>failure doesn't end the scene.</em> The GM might say "They see movement — one shouts and they start running toward you. What do you do?" The story keeps moving.</p>
        </div>
      </div>
    </div>

    <div class="step-block">
      <div class="step-num"><i class="fa-solid fa-bolt" aria-hidden="true"></i></div>
      <div class="step-body">
        <div class="step-title">Using an aspect — the invoke</div>
        <p>Let's say you rolled a total of +1 — one short. You failed. But wait.</p>
        <p>Your High Concept is <em>"Last Courier Who Knows the Old Routes."</em> You know this station. You know there's a maintenance hatch behind the bench — a route the scavengers wouldn't know about.</p>

        <div class="callout callout-tip" role="note">
          <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> The Teacher says</div>
          <p>This is an <strong>invoke</strong>. You spend 1 fate point and explain how your aspect makes you better at this task. The reward: <strong>+2 to your roll</strong> (turning your +1 into +3 — a success!). The key: the explanation has to make fictional sense. "I know the old routes" → "I know about the maintenance hatch" → success.</p>
        </div>

        <p><strong>You say:</strong> <em>"I spend a fate point. Kira remembers — there's a service crawlspace behind this bench. She's used it before. She doesn't need to cross the open floor at all."</em></p>
        <p>The GM says: <em>"That's a great invoke. +2, you succeed. You emerge behind the ticket counter, package in hand, and the scavengers haven't seen you."</em></p>
      </div>
    </div>

    <div class="step-block">
      <div class="step-num"><i class="fa-solid fa-hand-point-right" aria-hidden="true"></i></div>
      <div class="step-body">
        <div class="step-title">Getting compelled — earning fate points</div>
        <p>You have the package. Time to leave. But the GM slides a fate point toward you.</p>
        <p><em>"Your Trouble is 'Trusts the Map More Than Her Eyes.' You check the map for the exit route — but the map shows the east corridor as clear. It's not. The scavengers are right there. You walk straight into them because you were looking at the map instead of the corridor."</em></p>

        <div class="callout callout-tip" role="note">
          <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> The Teacher says</div>
          <p>This is a <strong>compel</strong>. The GM is using your Trouble aspect to make your life complicated — in exchange for a fate point. You have a choice: <strong>accept</strong> the fate point and deal with the complication, or <strong>refuse</strong> by spending a fate point of your own. Most of the time, accepting is the right call — it earns you FP for later invokes, and it creates great drama.</p>
        </div>

        <p><strong>You say:</strong> <em>"I accept. Kira rounds the corner, nose in the map, and freezes. They're five metres away."</em></p>
        <p>You earn 1 fate point. The scene continues — now it's a conflict, a chase, or a negotiation. The fiction drives what happens next.</p>
      </div>
    </div>

    <div class="step-block">
      <div class="step-num"><i class="fa-solid fa-star" aria-hidden="true"></i></div>
      <div class="step-body">
        <div class="step-title">Create Advantage — the move that changes everything</div>
        <p>The scavengers block the exit. Kira could attack — but her Fight is only +1. Instead:</p>
        <p><strong>You say:</strong> <em>"I kick the fire extinguisher off the wall — it ruptures and fills the corridor with white fog."</em></p>
        <p>The GM says: <em>"That's Create Advantage using Athletics. Roll against Fair (+2)."</em></p>

        <div class="callout callout-scenario" role="note">
          <div class="callout-title"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> Roll Athletics (+3)</div>
          <HelpDiceRoller mode="skill" skill={3} difficulty={2} label="Athletics +3" />
        </div>

        <div class="callout callout-tip" role="note">
          <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> The Teacher says</div>
          <p><strong>Create Advantage is the most powerful action in Fate.</strong> If you succeed, you create a new situation aspect — <em>"Corridor Filled With Choking Fog"</em> — with a <strong>free invoke</strong>. That free invoke is +2 on your next roll, without spending a fate point. Stack two of these and you're rolling at +4 bonus before the dice even hit the table. This is how Fate combat works: you set up advantages, then strike when you're loaded with bonuses.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <!-- SECTION 2: PLAY-BY-POST WALKTHROUGH -->
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <div class="wiki-section" id="walkthrough">
    <h2 class="wiki-section-title"><i class="fa-solid fa-book-open" aria-hidden="true"></i> Play-by-Post — A Complete Scene</h2>
    <p>A full Fate Condensed scene played out beat-by-beat, showing exactly what the GM says, what the player says, when dice are rolled, and why. Read this like a script.</p>

    <div class="callout callout-info" role="note">
      <div class="callout-title"><i class="fa-solid fa-clapperboard" aria-hidden="true"></i> The setup</div>
      <p><strong>Setting:</strong> Victorian London. <strong>PC:</strong> Dr. Helena Blackwood — <em>"Disgraced Surgeon With Steady Hands"</em> (HC), <em>"The Lancet Called Me a Fraud — I'll Prove Them Wrong"</em> (Trouble). Skills: Academics +4, Empathy +3, Notice +3, Rapport +2, Investigate +2.<br/>
      <strong>Scene:</strong> The Royal Society's private library. Helena needs a specific journal before the rival professor locks it in the vault at midnight.</p>
    </div>

    <div class="pbt-exchange">
      <div class="pbt-label">GM</div>
      <div class="pbt-text">"The library closes in twenty minutes. Professor Carstairs is at the far table, packing his materials. The journal you need — Harrington's unpublished notes on the Whitechapel case — is on the shelf behind him. A librarian is stamping returns near the door. What do you do?"</div>
    </div>
    <div class="pbt-exchange">
      <div class="pbt-label">Helena</div>
      <div class="pbt-text">"I approach the librarian and engage her in conversation about a rare folio I donated last month — something that would flatter her and keep her attention away from the shelves."</div>
    </div>
    <div class="pbt-exchange">
      <div class="pbt-label">GM</div>
      <div class="pbt-text">"That's Create Advantage using Rapport. You're trying to place 'Librarian Completely Distracted' on the scene. She's not suspicious, so this is Fair (+2). Roll it."</div>
    </div>
    <div class="pbt-exchange">
      <div class="pbt-label pbt-roll">Roll</div>
      <div class="pbt-text">Rapport +2, dice show [+][+][0][-] = +1. Total: <strong>+3 vs Fair (+2). Success.</strong> New aspect: <em>"Librarian Completely Distracted"</em> with one free invoke.</div>
    </div>
    <div class="pbt-exchange">
      <div class="pbt-label">Helena</div>
      <div class="pbt-text">"Good. While she's talking, I casually move toward the shelf section where the journal sits — keeping the conversation going over my shoulder."</div>
    </div>
    <div class="pbt-exchange">
      <div class="pbt-label">GM</div>
      <div class="pbt-text">"Now you need to get the journal off the shelf without Carstairs noticing. That's Overcome using Stealth — but wait, you don't have Stealth. You can try at Mediocre (+0), or find another approach."</div>
    </div>
    <div class="pbt-exchange">
      <div class="pbt-label">Helena</div>
      <div class="pbt-text">"I don't sneak. I walk directly to the shelf as if I have every right to be there — I'm Dr. Blackwood, I <em>do</em> have a right. I use Academics. I know exactly where the journal is, I pull three books including it, and carry them to a reading table as if I'm doing research."</div>
    </div>
    <div class="pbt-exchange">
      <div class="pbt-label">GM</div>
      <div class="pbt-text">"I love it. That's Overcome with Academics. Carstairs is Good (+3) opposition — he knows the collection. But I'll let you use your free invoke on 'Librarian Completely Distracted' since she's not going to challenge you either."</div>
    </div>
    <div class="pbt-exchange">
      <div class="pbt-label pbt-roll">Roll</div>
      <div class="pbt-text">Academics +4, dice show [0][-][0][+] = 0. Total: <strong>+4, plus free invoke +2 = +6 vs Good (+3). Success with style!</strong></div>
    </div>
    <div class="pbt-exchange">
      <div class="pbt-label">GM</div>
      <div class="pbt-text">"You don't just get the journal — you succeed with style. You also notice that Carstairs has left his own notes unattended on the table. You gain a boost: <em>'Glimpsed Carstairs' Notes.'</em> The journal is yours. But as you turn to leave—"</div>
    </div>
    <div class="pbt-exchange">
      <div class="pbt-label">GM</div>
      <div class="pbt-text">"—your Trouble. 'The Lancet Called Me a Fraud — I'll Prove Them Wrong.' Carstairs looks up and says, loudly enough for the librarian to hear: 'Dr. Blackwood! I see you're still... <em>researching.</em> I do hope this one holds up better than your last paper.' He's goading you. Here's a fate point. Do you rise to the bait — publicly — or swallow your pride and leave with the journal?"</div>
    </div>

    <div class="callout callout-tip" role="note">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> The Teacher says</div>
      <p>Notice what happened: Helena never rolled Stealth. She used her <em>best skill</em> (Academics +4) by reframing the action in fiction — not sneaking, but acting with authority. She stacked a Create Advantage free invoke for +2. She succeeded with style and got a bonus. Then the GM compelled her Trouble — not to punish, but to create a dramatic choice. This is Fate at its best: fiction drives mechanics, and aspects create drama in both directions.</p>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <!-- SECTION 3: STRATEGY GUIDE -->
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <div class="wiki-section" id="strategy">
    <h2 class="wiki-section-title"><i class="fa-solid fa-chess" aria-hidden="true"></i> Strategy Guide</h2>
    <p>Fate looks simple, but there's deep tactical play hiding beneath the fiction. These are the strategies that separate a first-session player from a skilled one.</p>

    <h3 id="strat-ca"><i class="fa-solid fa-plus-circle" aria-hidden="true" style="color:var(--accent)"></i> Create Advantage — the action you should use most</h3>
    <p>In D&amp;D, the default action is Attack. In Fate, the default action should be <strong>Create Advantage</strong>. Here's why:</p>
    <div class="callout callout-info" role="note">
      <div class="callout-title">The math</div>
      <p>An Attack with Fight +3 against Defend +3 has roughly a 1-in-3 chance of dealing real shifts — ties only give a boost, not damage. But if you Create Advantage first (<em>"I kick sand in their eyes"</em>), you get a free invoke worth +2. Now your Attack is effectively +5 vs +3 — you hit hard most of the time and average 2–4 shifts. <strong>Two rounds of Create Advantage + one Attack beats three rounds of Attack every time.</strong></p>
    </div>
    <p><strong>When to Create Advantage:</strong> Always the first 1–2 exchanges of any conflict. When your Attack skill is lower than the opposition's Defend. When you want to set up a teammate for a big hit. When you're not sure what else to do.</p>
    <p><strong>When NOT to:</strong> When the opposition is about to be Taken Out and one more shift finishes the job. When the scene is almost over and you need results now.</p>

    <h3 id="strat-fp"><i class="fa-solid fa-coins" aria-hidden="true" style="color:var(--accent)"></i> Fate point economy — the hidden game</h3>
    <p>Fate points are the most important resource in the game. More important than skills, more important than stunts. The player who manages their FP well plays Fate better than everyone else at the table.</p>
    <div class="callout callout-dnd" role="note">
      <div class="callout-title"><i class="fa-solid fa-dragon" aria-hidden="true"></i> Coming from D&amp;D</div>
      <p>Fate points are like Inspiration, except you use them constantly, they flow both directions (GM gives and takes), and running out means you can't invoke <em>any</em> of your aspects. A PC with 0 FP is functionally weaker than their character sheet suggests.</p>
    </div>
    <p><strong>Earning FP:</strong> Accept compels (GM or self-compel). Start of session (refresh to 3). Concede a conflict (1 base + 1 per consequence taken).</p>
    <p><strong>Spending FP:</strong> Invoke an aspect for +2 or a reroll. Refuse a compel (costs 1 FP).</p>
    <p><strong>The rhythm:</strong> Early in a session, accept compels aggressively — bank FP. Mid-session, spend FP on pivotal rolls. Late session, if you're at 0 FP, self-compel to earn one back. Never refuse a compel unless the complication would derail something you care about deeply.</p>

    <h3 id="strat-concede"><i class="fa-solid fa-flag" aria-hidden="true" style="color:var(--accent)"></i> Conceding — the strategic surrender</h3>
    <p>In D&amp;D, you fight until you win or die. In Fate, you <strong>concede</strong> — and it's one of the smartest things you can do.</p>
    <div class="callout callout-info" role="note">
      <div class="callout-title">Why concede?</div>
      <p><strong>You choose the terms.</strong> When you concede, you narrate how you lose — you escape, you surrender with dignity, you get captured but hide the evidence. If you're Taken Out (reduced to zero), the <em>GM</em> narrates what happens to you. Conceding gives you narrative control over your defeat.<br/><br/>
      <strong>You earn FP.</strong> 1 fate point base, plus 1 extra per consequence you took during the conflict (<a href="https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests" target="_blank" rel="noreferrer" class="srd-link">FCon SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>). Took a Mild and a Moderate? That's 3 FP. Plus you're alive and still in the story.</p>
    </div>
    <p><strong>When to concede:</strong> When you've taken a Moderate or Severe consequence and the opposition still looks strong. When losing this fight doesn't mean losing the war. When the story is more interesting if you fail here and come back later.</p>

    <h3 id="strat-self"><i class="fa-solid fa-hand-point-right" aria-hidden="true" style="color:var(--accent)"></i> Self-compels — getting paid to make the story better</h3>
    <p>You don't have to wait for the GM to compel you. You can compel <em>yourself</em>.</p>
    <p><strong>How:</strong> Look at your aspects. Say: <em>"My Trouble is 'Can't Walk Away From a Broken Thing.' This engine is about to explode, but I think my character would try to fix it anyway. Can I compel myself?"</em> If the table agrees it fits, you earn 1 FP.</p>
    <p><strong>Why this is powerful:</strong> You choose the timing. You choose the complication. You get a fate point for doing something your character would do anyway. GMs love self-compels because they create player-driven drama.</p>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <!-- SECTION 4: FIRST SESSION CHECKLIST -->
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <div class="wiki-section" id="checklist">
    <h2 class="wiki-section-title"><i class="fa-solid fa-list-check" aria-hidden="true"></i> First Session Checklist</h2>
    <p>Running your first Fate Condensed session? Here's what to prepare, what to skip, and how to pace.</p>

    <h3><i class="fa-solid fa-check icon-success" aria-hidden="true"></i> Before the session (30 min prep)</h3>
    <div class="callout callout-info" role="note">
      <div class="callout-title">What to prepare</div>
      <p><strong>One current issue</strong> — the thing that's already on fire. Write it as an aspect: <em>"The Water Supply Is Poisoned and Nobody Knows Why."</em><br/>
      <strong>One impending issue</strong> — the thing that gets worse if they don't act: <em>"The Merchant Council Votes to Seal the Lower Quarter in Three Days."</em><br/>
      <strong>One opening scene</strong> — just a location, a situation, and one NPC. Don't plan the outcome.<br/>
      <strong>Two minor NPCs</strong> — one aspect each, one skill at +2. Use Ogma to generate them.<br/>
      <strong>Three scene aspects for your opening location</strong> — use Ogma's scene generator.</p>
    </div>

    <h3><i class="fa-solid fa-xmark icon-danger" aria-hidden="true"></i> What to skip</h3>
    <div class="callout callout-info" role="note">
      <div class="callout-title">Don't prepare these</div>
      <p><strong>Don't write a plot.</strong> Fate is not a scripted adventure. Prepare situations, not storylines.<br/>
      <strong>Don't plan more than 3 scenes.</strong> You won't use them. Players will go somewhere unexpected by scene 2.<br/>
      <strong>Don't stat out a big bad.</strong> For session one, minor NPCs and environmental challenges are enough. The antagonist can emerge from play.<br/>
      <strong>Don't fill all stunt slots.</strong> Leave 1–2 blank for each PC. Fill them during play when a player says "I wish I could..." — each stunt costs 1 Refresh (minimum Refresh 1), so pre-writing all slots locks Refresh before the character's playstyle is known.</p>
    </div>

    <h3><i class="fa-solid fa-clock" aria-hidden="true" style="color:var(--accent)"></i> Pacing the session</h3>
    <div class="callout callout-info" role="note">
      <div class="callout-title">The 3-hour session template</div>
      <p><strong>First 30 minutes:</strong> Recap / Session Zero catchup. Compel someone's Trouble to start the action.<br/>
      <strong>Minutes 30–90:</strong> The main scene. Run it until the interesting part is over, then cut. Don't let it drag.<br/>
      <strong>Minutes 90–120:</strong> Complication or twist. A new NPC arrives, a countdown advances, or a compel changes the direction.<br/>
      <strong>Minutes 120–150:</strong> Climax — conflict, contest, or challenge. Declare stakes before the first roll.<br/>
      <strong>Last 30 minutes:</strong> Wrap up. Ask each player: "What does your character do after?" Hand out milestone advances if earned.</p>
    </div>

    <h3><i class="fa-solid fa-triangle-exclamation icon-warning" aria-hidden="true"></i> Common first-session mistakes</h3>
    <div class="callout callout-dnd" role="note">
      <div class="callout-title"><i class="fa-solid fa-dragon" aria-hidden="true"></i> D&amp;D habits to unlearn</div>
      <p><strong>"I search the room" syndrome:</strong> In Fate, don't passively investigate. <em>Declare what you want to find and why.</em> The GM sets difficulty based on how interesting failure would be.<br/><br/>
      <strong>The initiative reflex:</strong> Fate doesn't have initiative. The GM decides who goes first based on fiction, then each player picks who goes next. This is deliberate — it rewards teamwork and setup.<br/><br/>
      <strong>The HP mindset:</strong> Stress is not hit points. It clears every scene. Consequences are the real injuries. Don't hoard stress boxes — they're meant to be spent.<br/><br/>
      <strong>The "I attack" loop:</strong> If everyone attacks every round, you're playing D&amp;D with Fate dice. Use Create Advantage first. Stack aspects. Then attack when you're loaded with free invokes.</p>
    </div>

    <div class="callout callout-tip" role="note">
      <div class="callout-title"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> The single best thing you can do</div>
      <p>At the start of the session, say this to your table: <em>"In this game, failure doesn't end the story — it makes it more interesting. When you fail a roll, something unexpected happens. It might be worse than what you planned, but it will never be boring."</em></p>
    </div>
  </div>

  <div class="wiki-back-center">
    <a href="/help/learn-fate" class="wiki-back"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to Learn Fate in 7 Steps</a>
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
