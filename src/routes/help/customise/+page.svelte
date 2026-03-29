<svelte:head>
  <title>Customise — Ogma Help</title>
  <meta name="description" content="Customise Ogma — world themes, result reference depth, table filtering, and session preferences." />
</svelte:head>

<main class="wiki-content" id="main-content">

    <div class="wiki-page-eyebrow">Customise</div>
    <h1>Making Ogma work for your table</h1>
    <p class="wiki-page-desc">Ogma adapts to different experience levels, play styles, and table setups. Here's how to tune it to your needs.</p>

    <details class="learn-quickstart" open>
      <summary class="learn-quickstart-toggle">Quick Start — 5 ways to customise</summary>
      <ol class="learn-quickstart-list">
        <li><strong>Reference panel depth</strong> — switch between GM, New Player, and D&amp;D tabs below every result.</li>
        <li><strong>Skills</strong> — use the default Fate Condensed 19 or define your own custom skill list.</li>
        <li><strong>Table Manager</strong> — filter, sort, and merge generator tables across worlds.</li>
        <li><strong>Session Zero</strong> — guided character creation wizard with aspect prompts.</li>
        <li><strong>Theme</strong> — dark/light mode toggle plus adjustable text size.</li>
      </ol>
    </details>

    <nav class="wiki-toc" aria-label="On this page">
      <div class="wiki-toc-title">On this page</div>
      <a href="#reference-panel-depth">Result Reference Panel</a>
      <a href="#skills">Skills</a>
      <a href="#table-manager--customising-results">Table Manager</a>
      <a href="#universal-table-merge">Universal table merge</a>
      <a href="#session-zero-wizard">Session Zero wizard</a>
      <a href="#dnd-transition-guide">D&amp;D Transition guide</a>
      <a href="#theme-and-text-size">Theme and text size</a>
      <a href="#keyboard-shortcuts">Keyboard shortcuts</a>
    </nav>

    <h2 id="reference-panel-depth">Result Reference Panel</h2>
    <p>Every generator result shows a reference panel directly below it. <strong>What this is &middot; For GM</strong> shows what the generator produces, rules references, and GM running tips. The <strong>&#9876; D&amp;D?</strong> tab appears when a D&amp;D comparison is available.</p>
    <div class="wiki-table-wrap">
    <table class="wiki-table">
      <thead><tr><th scope="col">Tab</th><th scope="col">Who it's for</th><th scope="col">What it shows</th></tr></thead>
      <tbody>
        <tr><td><strong>What &middot; For GM</strong></td><td>Default — all GMs</td><td>What the generator produces, running tips, invoke and compel examples</td></tr>
        <tr><td><strong><i class="fa-solid fa-seedling" aria-hidden="true"></i> New here?</strong></td><td>New to tabletop RPGs or Fate</td><td>Plain-language explanation of the mechanic and how it works at the table</td></tr>
        <tr><td><strong>&#9876; D&amp;D?</strong></td><td>Converting from D&amp;D 5e / Pathfinder</td><td>Side-by-side comparison of Fate and D&amp;D mechanics — aspects vs ability scores, stress vs HP, fate points vs inspiration</td></tr>
      </tbody>
    </table>
    </div>

    <h2 id="skills">Skills</h2>
    <p>Ogma uses the <strong>18 default Fate Condensed skills</strong> (Athletics, Burglary, Contacts, Crafts, Deceive, Drive, Empathy, Fight, Investigate, Lore, Notice, Physique, Provoke, Rapport, Resources, Shoot, Stealth, Will). If your campaign uses a custom skill list or approaches (from Fate Accelerated), the generated skill pyramids will use FCon defaults. The <a href="https://fate-srd.com/fate-system-toolkit/skills-and-stunts" target="_blank" rel="noopener noreferrer">Fate System Toolkit</a> has guidance on building custom skill lists.</p>

    <h2 id="table-manager--customising-results">Table Manager — customising results</h2>
    <p>Open the Table Manager with the <i class="fa-solid fa-square-plus" aria-hidden="true"></i> button in the action bar. It shows every table that feeds the current generator.</p>
    <ul>
      <li><strong>Exclude</strong> an entry by toggling the checkbox — it won't appear in future rolls. Useful when you've already used that NPC name or faction descriptor.</li>
      <li><strong>Lock</strong> an entry to always use it — roll any number of times and that entry will be the one that appears for that slot. Useful for fixed character names.</li>
      <li><strong>Add custom entries</strong> — type your own entry and add it to the table. It participates in generation alongside the built-in content.</li>
    </ul>
    <p>Table customisations are saved to localStorage and persist across browser restarts.</p>

    <h2 id="universal-table-merge">Universal table merge</h2>
    <p>Ogma has a set of <strong>Universal tables</strong> — genre-neutral content that works in any campaign. The Universal Merge toggle (in the sidebar Preferences panel) controls whether these tables supplement the campaign-specific ones:</p>
    <ul>
      <li><strong>On (default)</strong> — universal entries are added to the campaign pool. More variety, slightly less world-specific flavour.</li>
      <li><strong>Off</strong> — only campaign-specific entries. Maximum thematic consistency.</li>
    </ul>

    <h2 id="session-zero-wizard">Session Zero wizard</h2>
    <p>The Prep Wizard (<i class="fa-solid fa-bolt" aria-hidden="true"></i> Prep in the topbar) is a 5-step guided flow that gets you session-ready in minutes: choose a world, describe your players, generate a seed, build a scene, and create an NPC. Each step lets you reroll and the output saves automatically to IndexedDB for import into the Run surface.</p>
    <p>For collaborative character creation with your players, use the Character Creation Wizard — it walks a group through the Phase Trio, skills, stunts, and refresh.</p>

    <h2 id="dnd-transition-guide">D&amp;D Transition guide</h2>
    <p>The <a href="/help/dnd-transition">D&amp;D Transition guide</a> explains every major mechanical difference between Fate Condensed and D&amp;D — side by side, in plain language. Available from the sidebar on any Help page.</p>

    <h2 id="theme-and-text-size">Theme and text size</h2>
    <p>Press the <i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i> button in the topbar to toggle between dark and light mode. Your preference is saved to localStorage.</p>
    <p>Text size can be adjusted via the <i class="fa-solid fa-square-plus" aria-hidden="true"></i> Table Manager panel or the Preferences panel in the sidebar. Three levels are available.</p>

    <h2 id="keyboard-shortcuts">Keyboard shortcuts</h2>
    <p>Press <kbd>?</kbd> to open the full keyboard shortcuts reference. All shortcuts are single-key (no modifier required) and are blocked when a text input is focused.</p>

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
