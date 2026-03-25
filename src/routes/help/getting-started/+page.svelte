<svelte:options runes={false} />

<svelte:head>
  <title>Getting Started — Ogma Help</title>
  <meta name="description" content="Set up Ogma, roll your first generator, and learn how to save and back up your prep. Start here." />
</svelte:head>

<main class="wiki-content" id="main-content">

    <div class="wiki-page-eyebrow">Getting Started</div>
    <h1>Your first session with Ogma</h1>
    <p class="wiki-page-desc">Ogma is ready to use the moment you open it — no login, no setup, no internet after first load. This guide explains how it works and what you need to know to use it safely.</p>

    <h2>The local-first philosophy</h2>
    <p>Ogma stores <strong>everything in your browser</strong> — there is no server, no cloud sync, no account. This is a deliberate design choice: it means the tool works offline, loads instantly, and your data is private by default.</p>
    <p>Specifically, Ogma uses two browser storage mechanisms:</p>
    <ul>
      <li><strong>IndexedDB</strong> — stores your session state: last result, saved cards, FP tracker state, history ring. This persists across browser restarts.</li>
      <li><strong>localStorage</strong> — stores your preferences: theme, universal merge. Table customisations and session data use IndexedDB for reliability.</li>
    </ul>

    <div class="callout callout-warning">
      <div class="callout-title">&#9888; Before you clear your browser cache</div>
      <p>Clearing your browser cache, cookies, or site data will <strong>permanently delete</strong> your session history, pinned results, FP tracker state, and table customisations. There is no server backup. Always <a href="/help/export-share">export your pinned results as Markdown</a> before clearing storage.</p>
    </div>

    <h2>The service worker — offline first</h2>
    <p>On your first visit, Ogma installs a <strong>service worker</strong> that caches all 740KB of assets (HTML, CSS, JS, fonts, data) to your device. After that, the tool works with no internet connection at all — you can run it in a cabin with no signal.</p>
    <p>When a new version of Ogma is deployed, the service worker detects the change and shows an <strong>"Update available — reload?"</strong> toast. Clicking it reloads with the latest version. Your data is not affected by updates.</p>

    <div class="callout callout-tip">
      <div class="callout-title">&#128247; Install as a PWA</div>
      <p>Ogma is a Progressive Web App. On desktop Chrome/Edge, look for an install icon in the address bar. On iOS Safari, tap Share &#8594; Add to Home Screen. This gives you a dedicated app icon and a cleaner full-screen experience.</p>
    </div>

    <h2>Choosing your campaign world</h2>
    <p>From the home page, pick one of the <strong>8 campaign worlds</strong>. Each world has a distinct genre, tone, and ~1,500 AI-generated table entries tuned to that aesthetic:</p>
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

    <h2>Your first roll</h2>
    <ol class="steps">
      <li><div class="step-body"><strong>Pick a generator</strong><span>Use the sidebar on the left — generators are grouped into Characters, Scenes, Pacing, and World. Start with <em>Minor NPC</em> for something immediately useful.</span></div></li>
      <li><div class="step-body"><strong>Roll</strong><span>Press <kbd>Space</kbd> or click the big Roll button. A complete, mechanically-correct result appears in the right panel.</span></div></li>
      <li><div class="step-body"><strong>Read the result</strong><span>The result card shows the full output. Below it, the <strong>For GM</strong> tab gives running tips and rules references. If you're coming from D&amp;D, the <strong>&#9876; D&amp;D?</strong> tab compares the mechanic.</span></div></li>
      <li><div class="step-body"><strong>Keep it if you want to save it</strong><span>Press <kbd>P</kbd> or click the Save to Binder button. The result goes to your <strong>Binder</strong> (sidebar &#8594; Binder) where you can review or export it later.</span></div></li>
    </ol>

    <div class="callout callout-scenario">
      <div class="callout-title">&#127914; Scenario: You need a quick NPC mid-session</div>
      <p>Your players just knocked on an unexpected door. Press <kbd>Space</kbd> with Minor NPC selected. A name, two aspects (high concept + weakness), skill level, and stress track appear in under a second. The result is thematically appropriate to your campaign world — no generic fantasy names in a cyberpunk game. Press <kbd>P</kbd> to pin it, <kbd>V</kbd> to show it on your second screen.</p>
    </div>

    <h2>Backing up your work</h2>
    <p>Ogma does not have an auto-sync or cloud backup. To preserve your work:</p>
    <ul>
      <li><strong>Keep results you want to save</strong> — press <kbd>P</kbd> after any roll.</li>
      <li><strong>Export pinned results</strong> — open History (&#128203;), then use the "Copy all as Markdown" button to get a full Markdown document of every pinned card.</li>
      <li><strong>Download the ZIP</strong> — from the About page, download the full Ogma ZIP file. This is the entire app as a folder you can run from your desktop with no internet ever.</li>
    </ul>

    <h2>Offline use</h2>
    <p>Ogma works fully offline after your first visit. The service worker caches all assets automatically — generators, campaign data, styles, and scripts. No internet required after the initial load. You can also download the zip and serve it locally with <code>npx serve</code> or any static web server.</p>
</main>
