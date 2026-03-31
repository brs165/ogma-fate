<svelte:head>
  <title>Generator Suite — Ogma Help</title>
  <meta name="description" content="Complete reference for all 16 Ogma generators — NPCs, scenes, encounters, compels, countdowns, and more." />
</svelte:head>

<main class="wiki-content" id="main-content">

    <div class="wiki-page-eyebrow">Generators</div>
    <h1>16 generators. 8 worlds. 128 combinations.</h1>
    <p class="wiki-page-desc">16 generators, each tuned to its campaign world. Same generator, different world = different flavour.</p>

    <details class="learn-quickstart" open>
      <summary class="learn-quickstart-toggle">Quick Start — 5 generator essentials</summary>
      <ol class="learn-quickstart-list">
        <li><strong>16 generators</strong> — NPCs, Scenes, Encounters, Seeds, Factions, Compels, Consequences, and more.</li>
        <li><strong>8 worlds</strong> — each has ~1,500 themed table entries. Same generator, different world = different flavour.</li>
        <li><strong>Every card has GM guidance</strong> — click "GM GUIDANCE" on any result for running tips and rules refs.</li>
        <li><strong>Seeds = adventure packs</strong> — one roll gives you a scene, NPCs, and complications ready to play.</li>
        <li><strong>Space to roll, → Table to place</strong> — generate in the left panel, build your session on the canvas.</li>
      </ol>
    </details>

    <nav class="wiki-toc" aria-label="On this page">
      <div class="wiki-toc-title">On this page</div>
      <a href="#how-generators-combine">How generators combine</a>
      <a href="#characters">Characters</a>
      <a href="#scenes">Scenes</a>
      <a href="#pacing">Pacing</a>
      <a href="#world">World</a>
      <a href="#the-result-panel">The result panel</a>
      <a href="#pinning-results">Pinning results</a>
      <a href="#quick-prep-pack-prep">Quick Prep Pack</a>
      <a href="#table-manager">Table Manager</a>
    </nav>

    <h2 id="how-generators-combine">How generators and campaigns combine</h2>
    <p>When you roll, Ogma pulls from <strong>two table layers</strong>:</p>
    <ul>
      <li><strong>Campaign-specific tables</strong> — names, aspects, factions, and world details tuned to your chosen world (e.g. Shattered Kingdoms' "Blight-touched" aspects).</li>
      <li><strong>Universal tables</strong> — shared mechanical content that works in any genre (stress thresholds, consequence severity, skill ladders). The <em>Universal Merge</em> toggle in Settings controls whether these supplement or replace campaign tables.</li>
    </ul>

    <h2 id="characters">Characters</h2>
    <div class="gen-grid">
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-user" aria-hidden="true"></i></div><div class="gen-card-name">Minor NPC</div><div class="gen-card-desc">Name, 2 aspects (high concept + weakness), 1 skill, stress track. Ready in one roll — no prep needed.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-chess-rook" aria-hidden="true"></i></div><div class="gen-card-name">Major NPC</div><div class="gen-card-desc">Full character: HC, Trouble, 3 aspects, 5 skills, 2 stunts, physical/mental stress, consequences, refresh.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-scroll" aria-hidden="true"></i></div><div class="gen-card-name">PC Backstory</div><div class="gen-card-desc">Session Zero questions that generate aspects organically. Also includes a relationship web prompt and an opening hook.</div></div>
    </div>

    <div class="callout callout-scenario">
      <div class="callout-title"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> Scenario: Building a recurring villain</div>
      <p>Roll <em>Major NPC</em> and get a complete villain: high concept, trouble, three aspects, ranked skills, two stunts, and refresh 3. The <strong>For GM</strong> tab says: let them win something small before the PCs engage — so the stakes feel real when they clash.</p>
    </div>

    <h2 id="scenes">Scenes</h2>
    <div class="gen-grid">
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-map" aria-hidden="true"></i></div><div class="gen-card-name">Scene Setup</div><div class="gen-card-desc">2–4 situation aspects in categories (tone, cover, movement, danger, usable), plus 3–5 named zones. Tap aspects to mark them active during play.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-burst" aria-hidden="true"></i></div><div class="gen-card-name">Encounter</div><div class="gen-card-desc">Victory condition, defeat condition, situation aspect, 3–5 opposition NPCs with stress. Designed to run the whole encounter from one card.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-bolt" aria-hidden="true"></i></div><div class="gen-card-name">Complication</div><div class="gen-card-desc">A new aspect + optional new arrival + environmental shift. For when the scene needs a surprise mid-conflict.</div></div>
    </div>

    <h2 id="pacing">Pacing</h2>
    <div class="gen-grid">
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-bolt" aria-hidden="true"></i></div><div class="gen-card-name">Challenge</div><div class="gen-card-desc">Named challenge, description, success condition, failure condition, optional scene aspect. The full Fate Challenge structure in one card.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-burst" aria-hidden="true"></i></div><div class="gen-card-name">Contest</div><div class="gen-card-desc">Two sides, victory track (first to 3), situation aspect, 3 twist aspects for tied exchanges. Live score tracking — tap boxes to fill them.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></div><div class="gen-card-name">Obstacle</div><div class="gen-card-desc">Named obstacle, aspect, type (hazard/block/distraction), disable/bypass condition, opposition rating.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-clock" aria-hidden="true"></i></div><div class="gen-card-name">Countdown</div><div class="gen-card-desc">Named clock, 4–8 boxes, trigger condition, outcome. Tap boxes to fill them — particles fire when the clock hits zero.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></div><div class="gen-card-name">Constraint</div><div class="gen-card-desc">Limitation or resistance. Limitations restrict an action; resistances require a bypass. Each includes a how-to-bypass.</div></div>
    </div>

    <h2 id="world">World</h2>
    <div class="gen-grid">
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-earth-americas" aria-hidden="true"></i></div><div class="gen-card-name">Campaign Frame</div><div class="gen-card-desc">Current issue + impending issue + 3 setting aspects. Your campaign's backbone in one roll.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-seedling" aria-hidden="true"></i></div><div class="gen-card-name">Adventure Seed</div><div class="gen-card-desc">Location, objective, complication, victory condition, defeat condition, 3-scene sketch. Run Session 1 from this card.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-trophy" aria-hidden="true"></i></div><div class="gen-card-name">Faction</div><div class="gen-card-desc">Name, goal, method, weakness, named face NPC. Gives you a faction you can immediately compel.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i></div><div class="gen-card-name">Compel</div><div class="gen-card-desc">Situation + consequence. Hands the GM a ready-to-offer compel for any scene.</div></div>
      <div class="gen-card"><div class="gen-card-icon"><i class="fa-solid fa-compass" aria-hidden="true"></i></div><div class="gen-card-name">Consequence</div><div class="gen-card-desc">Severity (Mild/Moderate/Severe), named aspect, context. Includes recovery guidance and treatment difficulty.</div></div>
    </div>

    <h2 id="the-result-panel">The result panel</h2>
    <p>Every result has three tabs below it:</p>
    <ul>
      <li><strong>What · For GM</strong> — what the generator produces + imperative running tips with SRD links.</li>
      <li><strong><i class="fa-solid fa-seedling" aria-hidden="true"></i> New here?</strong> — plain-language explanation with key term definitions.</li>
      <li><strong>&#9876; D&amp;D?</strong> — side-by-side comparison for GMs switching from D&amp;D or Pathfinder.</li>
    </ul>

    <h2 id="pinning-results">Pinning results</h2>
    <p>Press <kbd>P</kbd> to pin any result. Open pinned cards in the <strong>Binder</strong> sidebar. From Binder: re-view, copy as Markdown, export as Ogma JSON, or import a saved <code>.ogma.json</code>.</p>

    <h2>Shareable links</h2>
    <p>Press <kbd>L</kbd> to copy a shareable URL. It encodes the seed — anyone who opens it sees the same result.</p>

    <h2>Inspiration mode</h2>
    <p>Press <kbd>I</kbd> to roll three results at once. Pick one, the others fade. Useful when a single roll isn't sparking ideas.</p>

    <h2 id="quick-prep-pack-prep">Quick Prep Pack</h2>
    <p>In the <strong>Binder</strong> sidebar, click <strong>Quick Prep Pack</strong> for an Adventure Seed + Countdown + Compel in one click — location, threat, and a ready-to-offer complication.</p>

    <h2 id="table-manager">Table Manager</h2>
    <p>Click the <i class="fa-solid fa-square-plus" aria-hidden="true"></i> icon in the action bar to open the Table Manager. You can:</p>
    <ul>
      <li><strong>Exclude</strong> any table from generation (e.g. if you've already used that faction name)</li>
      <li><strong>Lock</strong> a table to always use that entry (e.g. fix a PC's name)</li>
      <li><strong>Add custom entries</strong> that sit alongside the built-in content</li>
    </ul>

    <div class="callout callout-scenario">
      <div class="callout-title"><i class="fa-solid fa-compass" aria-hidden="true"></i> Related pages</div>
      <p><a href="/help/fate-mechanics">Fate Mechanics</a> — the rules behind each generator. <a href="/help/at-the-table">At the Table</a> — using generated content during play. <a href="/help/customise">Customise</a> — filtering and extending generator tables.</p>
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
