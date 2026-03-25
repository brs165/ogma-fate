<svelte:options runes={false} />

<script>
  import { onMount } from 'svelte';
  let theme = 'dark';
  onMount(() => {
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      theme = p.theme || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  });
  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
    try {
      const p = JSON.parse(localStorage.getItem('fate_prefs_v1') || '{}');
      p.theme = theme;
      localStorage.setItem('fate_prefs_v1', JSON.stringify(p));
    } catch (e) {}
  }
</script>

<svelte:head>
  <title>Help &amp; Wiki — Ogma Help</title>
  <meta name="description" content="Everything you need to master Ogma — the local-first, offline-ready generator suite for Fate Condensed." />
</svelte:head>

<div class="land-shell">
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header class="land-topnav topbar" role="banner">
    <a href="/" class="topbar-wordmark" aria-label="Ogma home">OGMA</a>
    <div class="topbar-spacer" style="flex:1"></div>
    <div class="topbar-status">
      <a href="/help" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none">&#128218; Help</a>
      <a href="/about" class="btn btn-ghost topbar-nav-btn" style="font-size:13px;text-decoration:none">About</a>
      <button class="btn btn-icon btn-ghost" on:click={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style="width:44px;height:44px">{theme === 'dark' ? '☀️' : '◑'}</button>
    </div>
  </header>

  <main class="wiki-content" id="main-content">

    <div class="wiki-page-eyebrow">Ogma Help &amp; Wiki</div>
    <h1>Everything you need to master Ogma</h1>
    <p class="wiki-page-desc">Ogma is a <strong>local-first, offline-ready generator suite</strong> for Fate Condensed. This wiki covers every feature — from your first roll to session export.</p>

    <div class="callout callout-scenario">
      <div class="callout-title">&#9654; Start here — pick your path</div>
      <p><strong>&#127922; New to Fate Condensed?</strong>&nbsp; <a href="/help/learn-fate">Learn Fate in 7 steps</a> — fiction first, aspects, dice, fate points, stress, stunts, and your first scene. 15 minutes.</p>
      <p><strong>&#9876; Coming from D&amp;D?</strong>&nbsp; <a href="/help/dnd-transition">D&amp;D Transition guide</a> — every D&amp;D habit that breaks Fate, and what to do instead.</p>
      <p><strong>&#128640; Already know Fate, new to Ogma?</strong>&nbsp; <a href="/help/getting-started">Getting Started</a> — your first roll, pinning results, exporting, and offline use.</p>
    </div>

    <div class="gen-grid">
      <a href="/help/getting-started" class="gen-card" style="text-decoration:none">
        <div class="gen-card-icon">&#128640;</div>
        <div class="gen-card-name">Getting Started</div>
        <div class="gen-card-desc">Local-first data model, first roll, keyboard shortcuts, and data backup.</div>
      </a>
      <a href="/help/generators" class="gen-card" style="text-decoration:none">
        <div class="gen-card-icon">&#127922;</div>
        <div class="gen-card-name">Generator Suite</div>
        <div class="gen-card-desc">All 16 generators across 8 campaign worlds. 128 combinations explained.</div>
      </a>
      <a href="/help/fate-mechanics" class="gen-card" style="text-decoration:none">
        <div class="gen-card-icon">&#9855;</div>
        <div class="gen-card-name">Fate Mechanics</div>
        <div class="gen-card-desc">Stress, Consequences, Aspects, Skills, Fate Points, Stunts.</div>
      </a>
      <a href="/help/at-the-table" class="gen-card" style="text-decoration:none">
        <div class="gen-card-icon">&#127481;</div>
        <div class="gen-card-name">At the Table</div>
        <div class="gen-card-desc">FP Tracker, Inspiration, Quick Prep Pack, Export.</div>
      </a>
      <a href="/help/export-share" class="gen-card" style="text-decoration:none">
        <div class="gen-card-icon">&#128279;</div>
        <div class="gen-card-name">Export &amp; Share</div>
        <div class="gen-card-desc">Markdown, Ogma JSON, shareable links, batch export.</div>
      </a>
      <a href="/help/customise" class="gen-card" style="text-decoration:none">
        <div class="gen-card-icon">&#9881;</div>
        <div class="gen-card-name">Customise</div>
        <div class="gen-card-desc">Result reference panel, Table Manager, Session Zero, theme, and more.</div>
      </a>
      <a href="/help/faq" class="gen-card" style="text-decoration:none">
        <div class="gen-card-icon">&#10067;</div>
        <div class="gen-card-name">FAQ</div>
        <div class="gen-card-desc">Cache, offline use, data loss prevention, browser support.</div>
      </a>
    </div>

    <h2>Quick reference — keyboard shortcuts</h2>
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

    <h2>About Ogma</h2>
    <p>Ogma — <strong>O</strong>n-demand <strong>G</strong>enerator for <strong>M</strong>asterful <strong>A</strong>dventures — is an independent fan project built on the <a href="https://fate-srd.com" target="_blank" rel="noreferrer">Fate Condensed SRD</a> (CC BY 3.0). It runs entirely in your browser with no server, no account, and no internet connection required after the first load.</p>
    <p><strong>8 campaign worlds.</strong> <strong>16 generators.</strong> <strong>128 generator/campaign combinations.</strong> <strong>9,900+ table entries.</strong></p>

  </main>

  <footer class="land-footer">
    <div class="land-footer-inner">
      <div style="font-style:italic;color:var(--text-muted);margin-bottom:4px">
        <strong>O</strong>n-demand <strong>G</strong>enerator for <strong>M</strong>asterful <strong>A</strong>dventures
      </div>
      <div>
        <a href="/license">Full Attribution</a> &middot;
        <a href="/help">&#128218; Help</a> &middot;
        <a href="/about">About</a>
      </div>
    </div>
  </footer>
</div>
