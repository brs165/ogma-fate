<svelte:head>
  <title>Export and Share — Ogma Help</title>
  <meta name="description" content="Export and share your generated content" />
</svelte:head>

<main class="wiki-content" id="main-content">
    
<div class="wiki-page-eyebrow">Export & Share</div>
<h1>Getting your results out of Ogma</h1>
<p class="wiki-page-desc">Every way to get content out — clipboard copy, JSON export, shareable links, and Roll20 import.</p>

<details class="learn-quickstart" open>
  <summary class="learn-quickstart-toggle">Quick Start — 5 export options</summary>
  <ol class="learn-quickstart-list">
    <li><strong>Copy as Markdown</strong> — press C to copy the current result for pasting into notes or VTT.</li>
    <li><strong>Export canvas as JSON</strong> — download your entire table as a portable Ogma file.</li>
    <li><strong>Import JSON</strong> — load a previously exported canvas or share tables between sessions.</li>
    <li><strong>Print reference card</strong> — one-page A4 cheat sheet at /help/reference for physical tables.</li>
    <li><strong>Back up regularly</strong> — everything is in your browser. Export before clearing cache.</li>
  </ol>
</details>

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
<p>Press <kbd>L</kbd> or click 🔗 to generate a URL for the current result. It encodes the seed — anyone who opens it sees the same card. Format: <code>/campaigns/[world]?gen=[generator]&amp;seed=[hex-seed]</code></p>

<div class="callout callout-scenario">
  <div class="callout-title"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> Scenario: Sharing prep with your co-GM</div>
  <p>You rolled a Major NPC during solo prep. Press <kbd>L</kbd> — URL goes to clipboard. Paste it in Discord. Your co-GM opens the link and sees the exact same NPC. No file, no attachment.</p>
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
<p>Export NPCs as <strong>Roll20 character JSON</strong> (Fate Core Official sheet format). From any NPC result's share options, click "Roll20 JSON" and import via Roll20's character import tool. Requires the Fate Core Official sheet — the D&amp;D 5e sheet is not supported.</p>

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
<p>Download the complete app ZIP from the <a href="/about">About page</a>. Unzip and open in any browser — no internet ever required. Useful for:</p>
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
    <a href="/help">Help Home</a> &nbsp;·&nbsp;
    <a href="/">Open Ogma</a> &nbsp;·&nbsp;
    <a href="/about">About</a> &nbsp;·&nbsp;
    <a href="/license">Full Attribution</a> &nbsp;·&nbsp;
    <!-- FARI_PARKED_2026.03.154 fari.app link --> &nbsp;·&nbsp;
    <a href="https://fate-srd.com/" target="_blank" rel="noreferrer">fate-srd.com</a>
  </div>
  <div class="wiki-footer-meta">
    Fate&#8482; is a trademark of Evil Hat Productions, LLC &nbsp;·&nbsp;
    D&amp;D&#174; is a trademark of Wizards of the Coast LLC &nbsp;·&nbsp;
    Released under <a href="/license">CC BY 3.0</a>
  </div>
</div>
</main>
