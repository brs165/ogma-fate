<svelte:head>
  <title>Getting Started — Ogma Help</title>
  <meta name="description" content="Set up Ogma, roll your first generator, and learn how to save and back up your prep. Start here." />
</svelte:head>

<main class="wiki-content" id="main-content">

    <div class="wiki-page-eyebrow">Getting Started</div>
    <h1>Your first session with Ogma</h1>
    <p class="wiki-page-desc">Ready the moment you open it — no login, no setup, no internet after first load.</p>

    <details class="learn-quickstart" open>
      <summary class="learn-quickstart-toggle">Quick Start — 5 essentials</summary>
      <ol class="learn-quickstart-list">
        <li><strong>Everything is local</strong> — your data lives in your browser. No account, no cloud.</li>
        <li><strong>Press Space to roll</strong> — pick a generator on the left, hit Space, read the result.</li>
        <li><strong>Send to Table</strong> — click "→ Table" to place cards on your prep canvas.</li>
        <li><strong>Export before clearing cache</strong> — clearing browser data deletes everything permanently.</li>
        <li><strong>Install as PWA</strong> — works fully offline after first visit. Add to home screen on mobile.</li>
      </ol>
    </details>

    <h2>The local-first philosophy</h2>
    <p>Ogma stores <strong>everything in your browser</strong> — no server, no cloud sync, no account. Works offline, loads instantly, and your data is private by default. Two storage mechanisms:</p>
    <ul>
      <li><strong>IndexedDB</strong> — stores your session state: last result, saved cards, FP tracker state, history ring. This persists across browser restarts.</li>
      <li><strong>localStorage</strong> — stores your preferences: theme, universal merge. Table customisations and session data use IndexedDB for reliability.</li>
    </ul>

    <div class="callout callout-warning">
      <div class="callout-title"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Before you clear your browser cache</div>
      <p>Clearing your browser cache, cookies, or site data will <strong>permanently delete</strong> your session history, pinned results, FP tracker state, and table customisations. There is no server backup. Always <a href="/help/export-share">export your pinned results as Markdown</a> before clearing storage.</p>
    </div>

    <h2>The service worker — offline first</h2>
    <p>On first visit, Ogma installs a <strong>service worker</strong> that caches all 740KB of assets. After that, runs with no internet — cabin, no-signal venue, anywhere. When a new version deploys, a <strong>"Update available — reload?"</strong> toast appears. Click it. Your data is unaffected.</p>

    <div class="callout callout-tip">
      <div class="callout-title"><i class="fa-solid fa-camera" aria-hidden="true"></i> Install as a PWA</div>
      <p>Ogma is a Progressive Web App. On desktop Chrome/Edge, look for an install icon in the address bar. On iOS Safari, tap Share → Add to Home Screen. This gives you a dedicated app icon and a cleaner full-screen experience.</p>
    </div>

    <h2>Choosing your campaign world</h2>
    <p>From the home page, pick one of the <strong>8 campaign worlds</strong>. Each world has a distinct genre, tone, and ~1,500 AI-generated table entries tuned to that aesthetic:</p>
    <div class="wiki-table-wrap">
    <table class="wiki-table">
      <thead><tr><th>World</th><th>Genre</th><th>Vibes</th></tr></thead>
      <tbody>
        <tr><td><strong>The Long After</strong></td><td>Sword &amp; Planet</td><td>Nausica&auml;, Thundarr, Book of the New Sun</td></tr>
        <tr><td><strong>Neon Abyss</strong></td><td>Cyberpunk</td><td>Neuromancer, Blade Runner, Edgerunners</td></tr>
        <tr><td><strong>Shattered Kingdoms</strong></td><td>Dark Fantasy</td><td>Malazan, Black Company, The Witcher</td></tr>
        <tr><td><strong>Void Runners</strong></td><td>Space Western</td><td>Firefly, The Expanse, Cowboy Bebop</td></tr>
        <tr><td><strong>The Gaslight Chronicles</strong></td><td>Gothic Horror</td><td>Penny Dreadful, From Hell, The Prestige</td></tr>
        <tr><td><strong>The Long Road</strong></td><td>Post-Apocalypse</td><td>Mad Max, The Last of Us, Station Eleven</td></tr>
        <tr><td><strong>Dust and Iron</strong></td><td>Frontier Western</td><td>Blood Meridian, Deadwood, True Grit</td></tr>
      </tbody>
    </table>
    </div>

    <h2>Your first roll</h2>
    <ol class="steps">
      <li><div class="step-body"><strong>Pick a generator</strong><span>Use the sidebar on the left — generators are grouped into Characters, Scenes, Pacing, and World. Start with <em>Minor NPC</em> for something immediately useful.</span></div></li>
      <li><div class="step-body"><strong>Roll</strong><span>Press <kbd>Space</kbd> or click the big Roll button. A complete, mechanically-correct result appears in the right panel.</span></div></li>
      <li><div class="step-body"><strong>Read the result</strong><span>The result card shows the full output. Below it, the <strong>For GM</strong> tab gives running tips and rules references. If you're coming from D&amp;D, the <strong>&#9876; D&amp;D?</strong> tab compares the mechanic.</span></div></li>
      <li><div class="step-body"><strong>Keep it if you want to save it</strong><span>Press <kbd>P</kbd> or click the Save to Binder button. The result goes to your <strong>Binder</strong> (sidebar → Binder) where you can review or export it later.</span></div></li>
    </ol>
    <p>New to the dice system? The <a href="https://fate-srd.com/fate-condensed/taking-action-rolling-the-dice" target="_blank" rel="noreferrer" class="srd-link">Fate SRD <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a> covers the full 4dF + Skill mechanic.</p>

    <div class="callout callout-scenario">
      <div class="callout-title"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> Scenario: You need a quick NPC mid-session</div>
      <p>Your players just knocked on an unexpected door. Press <kbd>Space</kbd> with Minor NPC selected. A name, two aspects (high concept + weakness), skill level, and stress track appear in under a second. The result is thematically appropriate to your campaign world — no generic fantasy names in a cyberpunk game. Press <kbd>P</kbd> to pin it, <kbd>V</kbd> to show it on your second screen.</p>
    </div>

    <h2>Backing up your work</h2>
    <p>Ogma does not have an auto-sync or cloud backup. To preserve your work:</p>
    <ul>
      <li><strong>Keep results you want to save</strong> — press <kbd>P</kbd> after any roll.</li>
      <li><strong>Export pinned results</strong> — open History (<i class="fa-solid fa-clipboard" aria-hidden="true"></i>), then use the "Copy all as Markdown" button to get a full Markdown document of every pinned card.</li>
      <li><strong>Download the ZIP</strong> — from the About page, download the full Ogma ZIP file. This is the entire app as a folder you can run from your desktop with no internet ever.</li>
    </ul>

    <h2>Offline use</h2>
    <p>Ogma works fully offline after first visit. You can also download the ZIP and serve it locally with <code>npx serve</code> or any static web server.</p>
</main>
