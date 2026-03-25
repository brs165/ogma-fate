<svelte:options runes={false} />

<svelte:head>
  <title>Generator Suite — Ogma Help</title>
  <meta name="description" content="Complete reference for all 16 Ogma generators — NPCs, scenes, encounters, compels, countdowns, and more." />
</svelte:head>

<main class="wiki-content" id="main-content">

    <div class="wiki-page-eyebrow">Generator Suite</div>
    <h1>16 generators. 8 worlds. 128 combinations.</h1>
    <p class="wiki-page-desc">Every generator produces a mechanically complete, thematically correct Fate Condensed result. Each one is tuned to its campaign world — a Minor NPC in Shattered Kingdoms gets dark fantasy names and aspects; the same generator in Neon Abyss gets chrome and neon.</p>

    <h2>How generators and campaigns combine</h2>
    <p>When you roll, Ogma pulls from <strong>two table layers</strong>:</p>
    <ul>
      <li><strong>Campaign-specific tables</strong> — names, aspects, factions, and world details tuned to your chosen world (e.g. Shattered Kingdoms' "Blight-touched" aspects).</li>
      <li><strong>Universal tables</strong> — shared mechanical content that works in any genre (stress thresholds, consequence severity, skill ladders). The <em>Universal Merge</em> toggle in Settings controls whether these supplement or replace campaign tables.</li>
    </ul>

    <h2 id="characters">Characters</h2>
    <div class="gen-grid">
      <div class="gen-card"><div class="gen-card-icon">&#128100;</div><div class="gen-card-name">Minor NPC</div><div class="gen-card-desc">Name, 2 aspects (high concept + weakness), 1 skill, stress track. Ready in one roll — no prep needed.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#128081;</div><div class="gen-card-name">Major NPC</div><div class="gen-card-desc">Full character: HC, Trouble, 3 aspects, 5 skills, 2 stunts, physical/mental stress, consequences, refresh.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#128221;</div><div class="gen-card-name">PC Backstory</div><div class="gen-card-desc">Session Zero questions that generate aspects organically. Also includes a relationship web prompt and an opening hook.</div></div>
    </div>

    <div class="callout callout-scenario">
      <div class="callout-title">&#127914; Scenario: Building a recurring villain</div>
      <p>Select <em>Major NPC</em> and roll. You get a complete character: maybe "The Archivist of Broken Oaths" (high concept), "Debts I Cannot Repay" (trouble), three supporting aspects, ranked skills with ladder labels, two stunts (one +2 bonus, one once-per-scene), and a refresh of 3. (Two stunts sit within the three free stunt slots — no refresh penalty.) The For GM tab tells you to show their high concept in action before the PCs engage — let them win something small first so the stakes feel real.</p>
    </div>

    <h2 id="scenes">Scenes</h2>
    <div class="gen-grid">
      <div class="gen-card"><div class="gen-card-icon">&#127775;</div><div class="gen-card-name">Scene Setup</div><div class="gen-card-desc">2–4 situation aspects in categories (tone, cover, movement, danger, usable), plus 3–5 named zones. Tap aspects to mark them active during play.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#9876;</div><div class="gen-card-name">Encounter</div><div class="gen-card-desc">Victory condition, defeat condition, situation aspect, 3–5 opposition NPCs with stress. Designed to run the whole encounter from one card.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#9889;</div><div class="gen-card-name">Complication</div><div class="gen-card-desc">A new aspect + optional new arrival + environmental shift. For when the scene needs a surprise mid-conflict.</div></div>
    </div>

    <h2 id="pacing">Pacing</h2>
    <div class="gen-grid">
      <div class="gen-card"><div class="gen-card-icon">&#9889;</div><div class="gen-card-name">Challenge</div><div class="gen-card-desc">Named challenge, description, success condition, failure condition, optional scene aspect. The full Fate Challenge structure in one card.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#9876;</div><div class="gen-card-name">Contest</div><div class="gen-card-desc">Two sides, victory track (first to 3), situation aspect, 3 twist aspects for tied exchanges. Live score tracking — tap boxes to fill them.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#128683;</div><div class="gen-card-name">Obstacle</div><div class="gen-card-desc">Named obstacle, aspect, type (hazard/block/distraction), disable/bypass condition, opposition rating.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#9200;</div><div class="gen-card-name">Countdown</div><div class="gen-card-desc">Named clock, 4–8 boxes, trigger condition, outcome. Tap boxes to fill them — particles fire when the clock hits zero.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#128683;</div><div class="gen-card-name">Constraint</div><div class="gen-card-desc">Limitation or resistance. Limitations restrict an action; resistances require a bypass. Each includes a how-to-bypass.</div></div>
    </div>

    <h2 id="world">World</h2>
    <div class="gen-grid">
      <div class="gen-card"><div class="gen-card-icon">&#127758;</div><div class="gen-card-name">Campaign Frame</div><div class="gen-card-desc">Current issue + impending issue + 3 setting aspects. Your campaign's backbone in one roll.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#127760;</div><div class="gen-card-name">Adventure Seed</div><div class="gen-card-desc">Location, objective, complication, victory condition, defeat condition, 3-scene sketch. Run Session 1 from this card.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#127942;</div><div class="gen-card-name">Faction</div><div class="gen-card-desc">Name, goal, method, weakness, named face NPC. Gives you a faction you can immediately compel.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#128161;</div><div class="gen-card-name">Compel</div><div class="gen-card-desc">Situation + consequence. Hands the GM a ready-to-offer compel for any scene.</div></div>
      <div class="gen-card"><div class="gen-card-icon">&#129657;</div><div class="gen-card-name">Consequence</div><div class="gen-card-desc">Severity (Mild/Moderate/Severe), named aspect, context. Includes recovery guidance and treatment difficulty.</div></div>
    </div>

    <h2 id="the-result-panel">The result panel</h2>
    <p>Every result card has a two-column reference sheet directly below it — always visible, no click required:</p>
    <ul>
      <li><strong>What it is</strong> (left column) — what this generator produces and the relevant Fate Condensed rule with a direct SRD link.</li>
      <li><strong>For GM</strong> (right column) — imperative running tips, invoke and compel examples from the FCon SRD and Book of Hanz.</li>
    </ul>
    <p>Two tabs appear below every result. <strong>What this is &middot; For GM</strong> shows what the generator produces and running tips. <strong>&#9876; D&amp;D?</strong> (when available) gives a side-by-side comparison for players coming from D&amp;D or Pathfinder.</p>
    <ul>
      <li><strong>What &middot; For GM</strong> — the default 2-column view above.</li>
      <li><strong>&#127793; New here?</strong> — plain-language explanation for players new to Fate, with key term definitions.</li>
      <li><strong>&#9876; D&amp;D?</strong> — side-by-side comparison of Fate and D&amp;D mechanics for GMs switching systems.</li>
    </ul>

    <h2>Pinning results</h2>
    <p>Press <kbd>P</kbd> or click the Save to Table Prep button on any result to pin it. Open pinned cards from the <strong>Binder</strong> section in the sidebar.</p>
    <p>From History you can: re-view any card, copy or download as Markdown, export your whole session as an Ogma JSON file, or import a previously saved <code>.ogma.json</code> file.</p>

    <h2>Shareable links</h2>
    <p>Press <kbd>L</kbd> or click the &#128279; button to copy a shareable URL for the current result. The URL encodes a seed that reproduces the exact same result — share it in Discord, paste it into session notes, or send it to your co-GM. Anyone who opens the link sees the same card.</p>

    <h2>Inspiration mode</h2>
    <p>Press <kbd>I</kbd> to roll three results at once and pick the one you want. The other two fade as ghost cards. Great when a single roll isn't sparking anything — seeing three options simultaneously often unlocks the right direction.</p>

    <h2 id="quick-prep-pack-prep">Quick Prep Pack prep</h2>
    <p>In the <strong>Binder</strong> section of the sidebar, click <strong>Quick Prep Pack</strong> to generate an Adventure Seed + Countdown + Compel as a stacked 3-card packet. This is your Session 1 prep in one click — location, first threat, and a ready-to-offer complication.</p>

    <h2>Table Manager</h2>
    <p>Click the &#8862; icon in the action bar to open the Table Manager. You can:</p>
    <ul>
      <li><strong>Exclude</strong> any table from generation (e.g. if you've already used that faction name)</li>
      <li><strong>Lock</strong> a table to always use that entry (e.g. fix a PC's name)</li>
      <li><strong>Add custom entries</strong> that sit alongside the built-in content</li>
    </ul>
</main>
