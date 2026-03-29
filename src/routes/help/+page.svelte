<svelte:head>
  <title>Help — Ogma</title>
  <meta name="description" content="Everything you need to master Ogma — the local-first, offline-ready generator suite for Fate Condensed." />
</svelte:head>

<main class="wiki-content" id="main-content">

    <div class="wiki-page-eyebrow">Ogma Help</div>
    <h1>Everything you need to master Ogma</h1>
    <p class="wiki-page-desc">Ogma is a <strong>local-first, offline-ready generator suite</strong> for Fate Condensed. This wiki covers every feature — from your first roll to session export.</p>

    <div class="callout callout-scenario">
      <div class="callout-title"><i class="fa-solid fa-play" aria-hidden="true"></i> Start here — pick your path</div>
      <p><strong><i class="fa-solid fa-dice-d20" aria-hidden="true"></i> New to Fate Condensed?</strong>&nbsp; <a href="/help/learn-fate">Learn Fate in 7 steps</a> — fiction first, aspects, dice, fate points, stress, stunts, and your first scene. 15 minutes.</p>
      <p><strong>&#9876; Coming from D&amp;D?</strong>&nbsp; <a href="/help/dnd-transition">D&amp;D Transition guide</a> — every D&amp;D habit that breaks Fate, and what to do instead.</p>
      <p><strong><i class="fa-solid fa-rocket" aria-hidden="true"></i> Already know Fate, new to Ogma?</strong>&nbsp; <a href="/help/getting-started">Getting Started</a> — your first roll, pinning results, exporting, and offline use.</p>
    </div>

    <div class="gen-grid">
      <a href="/help/getting-started" class="gen-card">
        <div class="gen-card-icon"><i class="fa-solid fa-rocket" aria-hidden="true"></i></div>
        <div class="gen-card-name">Getting Started</div>
        <div class="gen-card-desc">Local-first data model, first roll, keyboard shortcuts, and data backup.</div>
      </a>
      <a href="/help/generators" class="gen-card">
        <div class="gen-card-icon"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i></div>
        <div class="gen-card-name">Generator Suite</div>
        <div class="gen-card-desc">All 16 generators across 8 campaign worlds. 128 combinations explained.</div>
      </a>
      <a href="/help/fate-mechanics" class="gen-card">
        <div class="gen-card-icon"><i class="fa-solid fa-wheelchair" aria-hidden="true"></i></div>
        <div class="gen-card-name">Fate Mechanics</div>
        <div class="gen-card-desc">Stress, Consequences, Aspects, Skills, Fate Points, Stunts.</div>
      </a>
      <a href="/help/at-the-table" class="gen-card">
        <div class="gen-card-icon"><i class="fa-solid fa-users" aria-hidden="true"></i></div>
        <div class="gen-card-name">At the Table</div>
        <div class="gen-card-desc">FP Tracker, Inspiration, Quick Prep Pack, Export.</div>
      </a>
      <a href="/help/export-share" class="gen-card">
        <div class="gen-card-icon"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i></div>
        <div class="gen-card-name">Export &amp; Share</div>
        <div class="gen-card-desc">Markdown, Ogma JSON, shareable links, batch export.</div>
      </a>
      <a href="/help/customise" class="gen-card">
        <div class="gen-card-icon"><i class="fa-solid fa-gear" aria-hidden="true"></i></div>
        <div class="gen-card-name">Customise</div>
        <div class="gen-card-desc">Result reference panel, Table Manager, Session Zero, theme, and more.</div>
      </a>
      <a href="/help/hosting" class="gen-card">
        <div class="gen-card-icon"><i class="fa-solid fa-globe" aria-hidden="true"></i></div>
        <div class="gen-card-name">Hosting &amp; Multiplayer</div>
        <div class="gen-card-desc">WebSocket multiplayer, PartyKit deploy, and session hosting.</div>
      </a>
      <a href="/help/faq" class="gen-card">
        <div class="gen-card-icon"><i class="fa-solid fa-circle-question" aria-hidden="true"></i></div>
        <div class="gen-card-name">FAQ</div>
        <div class="gen-card-desc">Cache, offline use, data loss prevention, browser support.</div>
      </a>
      <a href="/help/mistakes" class="gen-card">
        <div class="gen-card-icon"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i></div>
        <div class="gen-card-name">20 Common Mistakes</div>
        <div class="gen-card-desc">Errors that trip up new GMs and D&D converts, with fixes and FCon page refs.</div>
      </a>
    </div>

    <details class="learn-quickstart" style="margin-top:4px">
      <summary class="learn-quickstart-toggle">Fate Condensed glossary — quick definitions</summary>
      <dl class="gloss-grid">
        <div class="gloss-item"><dt class="gloss-term">Aspect</dt><dd class="gloss-def">A phrase that is narratively true. Invoke by spending 1 FP for +2 on a roll; get compelled for a complication and earn 1 FP.</dd></div>
        <div class="gloss-item"><dt class="gloss-term">Boost</dt><dd class="gloss-def">A temporary aspect with exactly one free invoke. Created by Success with Style or a Tie on Attack. Expires when used or when the scene ends.</dd></div>
        <div class="gloss-item"><dt class="gloss-term">Compel</dt><dd class="gloss-def">The GM offers 1 FP; your aspect causes trouble. Accept the FP and the complication, or spend 1 FP to refuse.</dd></div>
        <div class="gloss-item"><dt class="gloss-term">Consequence</dt><dd class="gloss-def">A lasting aspect taken to absorb extra stress. Mild (−2), Moderate (−4), Severe (−6). Requires a treatment roll before recovery starts.</dd></div>
        <div class="gloss-item"><dt class="gloss-term">Exchange</dt><dd class="gloss-def">One round of a conflict — everyone takes one action. Not a fixed time; as long as the dramatic moment takes.</dd></div>
        <div class="gloss-item"><dt class="gloss-term">Free Invoke</dt><dd class="gloss-def">Use an aspect's +2 bonus once without spending a FP. Created by Create Advantage or boosts. Multiple free invokes stack.</dd></div>
        <div class="gloss-item"><dt class="gloss-term">Invoke</dt><dd class="gloss-def">Spend 1 FP on a relevant aspect for +2 to a roll or a full reroll. Must be narratively justified.</dd></div>
        <div class="gloss-item"><dt class="gloss-term">Refresh</dt><dd class="gloss-def">The FP floor you start each session with (default 3). Each stunt beyond the free three costs 1 Refresh (minimum 1).</dd></div>
        <div class="gloss-item"><dt class="gloss-term">Shifts</dt><dd class="gloss-def">The margin of success: your total minus the difficulty. 1–2 shifts = Success; 3+ = Success with Style. In attacks, shifts = stress dealt.</dd></div>
        <div class="gloss-item"><dt class="gloss-term">Stress</dt><dd class="gloss-def">Short-term pacing buffer. Mark boxes to absorb hits (1 shift each). All stress clears at end of every scene — not hit points.</dd></div>
        <div class="gloss-item"><dt class="gloss-term">Taken Out</dt><dd class="gloss-def">Removed from conflict when you can't absorb a hit. The attacker decides what happens. Conceding before the roll lets you control your exit.</dd></div>
        <div class="gloss-item"><dt class="gloss-term">Zone</dt><dd class="gloss-def">An abstract area in a conflict. Move within a zone freely; entering an adjacent zone costs one action. Each zone has 1–2 situation aspects.</dd></div>
      </dl>
    </details>

    <h2>Quick reference — keyboard shortcuts</h2>
    <div class="wiki-table-wrap">
    <table class="wiki-table">
      <thead><tr><th>Key</th><th>Action</th></tr></thead>
      <tbody>
        <tr><td><kbd>Space</kbd></td><td>Roll the current generator</td></tr>
        <tr><td><kbd>G</kbd></td><td>Cycle to next generator</td></tr>
        <tr><td><kbd>P</kbd></td><td>Pin current result to History</td></tr>
        <tr><td><kbd>Z</kbd></td><td>Undo last pin</td></tr>
        <tr><td><kbd>I</kbd></td><td>Inspiration mode — roll 3, pick one</td></tr>
        <tr><td><kbd>C</kbd></td><td>Copy result as Markdown</td></tr>
        <tr><td><kbd>L</kbd></td><td>Copy shareable link for this result</td></tr>
        <tr><td><kbd>?</kbd></td><td>Open keyboard shortcuts panel</td></tr>
        <tr><td><kbd>Esc</kbd></td><td>Close any open panel or sidebar</td></tr>
      </tbody>
    </table>
    </div>

    <h2>About Ogma</h2>
    <p>Ogma — <strong>O</strong>n-demand <strong>G</strong>enerator for <strong>M</strong>asterful <strong>A</strong>dventures — is an independent fan project built on the <a href="https://fate-srd.com" target="_blank" rel="noreferrer">Fate Condensed SRD</a> (CC BY 3.0). It runs entirely in your browser with no server, no account, and no internet connection required after the first load.</p>
    <p><strong>8 campaign worlds.</strong> <strong>16 generators.</strong> <strong>128 generator/campaign combinations.</strong> <strong>9,900+ table entries.</strong></p>
</main>
