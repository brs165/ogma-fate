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
  <title>Export and Share — Ogma Help</title>
  <meta name="description" content="Export and share your generated content" />
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
    
<div class="wiki-page-eyebrow">Export & Share</div>
<h1>Getting your results out of Ogma</h1>
<p class="wiki-page-desc">Ogma is fully offline and local-first — but your results shouldn't stay trapped. Here's every way to get content out, from quick clipboard copy to full VTT import.</p>

<h2 id="markdown-export">Copy as Markdown — single result</h2>
<p>Press <kbd>C</kbd> or click the 📋 button in the action bar to copy the current result as formatted Markdown. This gives you:</p>
<ul>
  <li>Character sheet-style formatting for NPCs (aspects as headers, skills as a list)</li>
  <li>Structured block format for scenes, encounters, countdowns, and other generators</li>
  <li>GM Note included at the bottom of NPC cards</li>
</ul>
<p>Paste into Obsidian, Notion, Google Docs, Discord — the formatting holds in any Markdown-aware app.</p>

<h2>Copy all pinned as Markdown — batch</h2>
<p>Open the Binder (sidebar → Binder) and click <strong>"Copy all as Markdown"</strong>. This exports every pinned card as a single Markdown document with a header per card. Useful for session notes or a reference doc for your players.</p>

<h2 id="shareable-links">Shareable links</h2>
<p>Press <kbd>L</kbd> or click the 🔗 button to generate a shareable URL for the current result. The URL encodes a <strong>seed</strong> — the random number that produced this exact result. Anyone who opens the link sees the same card.</p>
<p>The URL format is: <code>/campaigns/[world]?gen=[generator]&amp;seed=[hex-seed]</code></p>

<div class="callout callout-scenario">
  <div class="callout-title">&#127914; Scenario: Sharing prep with your co-GM</div>
  <p>You rolled a fantastic Major NPC in your solo prep session. Press <kbd>L</kbd> — the URL updates and goes to your clipboard. Paste it into your Discord prep channel. Your co-GM opens the link and sees the exact same NPC, right down to the stunt descriptions. No export file, no attachment, no formatting work.</p>
</div>

<!-- FARI_PARKED_2026.03.154: Fari JSON section — see BACKLOG.md parking lot -->
<h2 id="ogma-json-export">Ogma JSON export</h2>
<p>Every generated result can be exported as an <strong>Ogma JSON</strong> file — a self-contained, re-importable format that works with any Ogma campaign. Use it to save results for later, share with other GMs, or move prep between devices.</p>
<ol class="steps">
  <li><div class="step-body"><strong>Roll an NPC result</strong><span>Use either Minor NPC or Major NPC generator.</span></div></li>
  <!-- FARI_PARKED -->
  <li><div class="step-body"><strong>Copy or download the JSON</strong><span>Copy to clipboard or download as a .json file.</span></div></li>
  <!-- FARI_PARKED -->
</ol>
<p>For <strong>batch export</strong>, save multiple results and use "&#123; &#125; Export Ogma JSON" from History. This saves all saved results as a single <code>.ogma.json</code> file. Re-import the whole session into any Ogma campaign at any time.</p>

<h2>Roll20 JSON</h2>
<p>Ogma can also export NPCs as <strong>Roll20 character JSON</strong> (Fate Core Official sheet format). From the share options on any NPC result, click "Roll20 JSON" — then import via the Roll20 character import tool.</p>
<p>Note: Roll20 JSON import works with the Fate Core Official character sheet. The D&amp;D 5e sheet is not supported.</p>

<h2 id="table-prep">Table Prep — session save &amp; share</h2>
<p>The <strong>Binder</strong> section in the sidebar (sidebar → Binder) saves your pinned cards as named sessions and handles JSON export and import — the primary way to share sessions between devices or GMs.</p>
<ul>
  <li><strong>Save</strong> — name your session and save. Persists in IndexedDB across browser restarts.</li>
  <li><strong>Export session</strong> — downloads the full session as a <code>.json</code> file. Share via Discord, email, or USB.</li>
  <li><strong>Import session</strong> — click "Import from file" and select a <code>.json</code> file. The session appears in your Vault.</li>
  <li><strong>Per-card export</strong> — in History, each pinned card has a ↓ button that exports just that card as JSON.</li>
  <li><strong>Session Zero export</strong> — at the end of the Session Zero Wizard, click "📁 Export JSON" to save the character creation output as an importable file.</li>
</ul>
<div class="callout callout-info">
  <div class="callout-title">JSON is the share mechanism</div>
  <p>Ogma is fully offline — there's no cloud sync. JSON files are how you move sessions between devices, share with co-GMs, or back up your prep. The format is open and human-readable.</p>
</div>

<h2>Download the ZIP</h2>
<p>From the <a href="/about">About page</a>, click the GitHub link to download the full Ogma ZIP file. This is the complete, self-contained app — unzip it and open <code>/</code> in any browser. No internet connection ever required. Useful for:</p>
<ul>
  <li>Running at a convention with unreliable wifi</li>
  <li>Running on an air-gapped device</li>
  <li>Archiving a specific version of Ogma with your campaign data</li>
</ul>

<div class="callout callout-tip">
  <div class="callout-title">Moving your data</div>
  <p>The ZIP contains the app, not your session data. Use your session's JSON export to save your sessions before switching devices or browsers. Import them on the new device and pick up where you left off.</p>
</div>

    <div class="wiki-footer">
  <div>
    <a href="/help">Wiki Home</a> &nbsp;·&nbsp;
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
