<svelte:head>
  <title>At the Table — Ogma Help</title>
  <meta name="description" content="Using Ogma at the table during play" />
</svelte:head>

<main class="wiki-content" id="main-content">
    
<div class="wiki-page-eyebrow">At the Table</div>
<h1>Running your session with Ogma</h1>
<p class="wiki-page-desc">Ogma is designed for session prep — generating content, keeping results, and exporting them to your table. This guide covers the tools that make prep fast and seamless.</p>

<h2 id="fate-point-tracker">Fate Point Tracker</h2>
<p>Click the ◎ button in the action bar to open the FP Tracker. It has three tabs:</p>
<ul>
  <li><strong>Fate Points</strong> — tracks the party pool (shared points), per-PC points, and per-NPC points. Each PC has a Refresh value; clicking ↺ resets everyone to refresh.</li>
  <li><strong>Milestones</strong> — Milestone (end of every session) and Breakthrough (end of a story arc) checklists. Check items off as the group achieves them; tick marks animate.</li>
  <li><strong>Popcorn Initiative</strong> — the Balsera-style turn order. Add participants, then pass the token by clicking "Goes next →". No fixed turn order — the acting character picks who goes next.</li>
</ul>

<div class="callout callout-scenario">
  <div class="callout-title">&#127914; Scenario: Tracking a tense contest</div>
  <p>You've rolled a Contest — two gangs racing to reach the weapons cache. As each exchange resolves, you tap the victory boxes on your screen. The left track (Crimson Scars) and right track (Iron Saints) fill up. On the third tie, the twist aspect — "The Cache is Already Open" — gets revealed. Export the final state as Ogma JSON so players can see it on their devices.</p>
</div>

<h2>Inspiration Mode</h2>
<p>Press <kbd>I</kbd> to enter Inspiration Mode. Ogma rolls three results simultaneously. They display as overlapping ghost cards. Click the one you want to use — the others fade out. If none work, press <kbd>I</kbd> again for three more. Useful when a single roll isn't sparking anything creative.</p>

<h2 id="quick-prep-pack-prep-packet">Quick Prep Pack prep packet</h2>
<p>In the <strong>Binder</strong> section of the sidebar, click <strong>Quick Prep Pack</strong>. Ogma generates three connected cards simultaneously:</p>
<ul>
  <li><strong>Adventure Seed</strong> — location, objective, complication, 3-scene sketch</li>
  <li><strong>Countdown</strong> — a threat clock already ticking from session start</li>
  <li><strong>Compel</strong> — a ready-to-offer complication for the first scene</li>
</ul>
<p>These three cards together are a Session 1 prep packet — enough to run 2–3 hours of play with no other prep. Click "Keep all" to save all three to your session at once.</p>

<h2>History and your session</h2>
<p>Every roll goes into a history ring (last 8 results). Kept cards persist until you remove them. Open History with the 📋 button in the action bar or press the keyboard shortcut.</p>
<p>From History you can:</p>
<ul>
  <li>Re-view any card in full</li>
  <li>Remove individual cards</li>
  <li>Copy all saved cards as a single Markdown document</li>
  <li>Export all saved results as a single Ogma JSON file (re-importable in any Ogma campaign)</li>
</ul>
<p>Press <kbd>Z</kbd> to immediately undo the last keep without opening History.</p>

<h2 id="table-prep">Table Prep — save, load, and share</h2>
<p>Table Prep is your persistent storage, accessed from the <strong>Binder</strong> section in the sidebar. It lets you:</p>
<ul>
  <li><strong>Save</strong> — give your current set of saved cards a name and save them. They persist across browser sessions.</li>
  <li><strong>Load</strong> — click any saved session to add its cards to your current session.</li>
  <li><strong>Export</strong> — download any session as a <code>.json</code> file. This is the share mechanism — drop it in Discord, email it, put it on a USB stick.</li>
  <li><strong>Import</strong> — load a <code>.json</code> file from another GM or another device into your session.</li>
  <li><strong>Per-card export</strong> — in the History panel, each pinned card has a ↓ button that exports just that card as JSON.</li>
</ul>
<div class="callout callout-tip">
  <div class="callout-title">Tip</div>
  <p>Saved Prep stores everything in your browser's IndexedDB. It works fully offline. JSON files are the way to move sessions between devices or share with other GMs.</p>
</div>

<h2>Campaign Guide pages</h2>
<p>Each campaign world has a dedicated Guide page (accessible from the sidebar under Navigate → Campaign Guide). These pages contain:</p>
<ul>
  <li>World tone and atmosphere</li>
  <li>Player-facing setting summary</li>
  <li>Key factions</li>
    <li>Full content overview (table entry counts by category)</li>
</ul>
<p>Guide pages are printable — use Ctrl+P to print a reference sheet for your players.</p>

    <hr style="border:none;border-top:1px solid var(--border);margin:32px 0">

    <h2 id="session-structure">What a Fate session looks like</h2>
    <p>A Fate session has no fixed structure — but most sessions follow a natural rhythm:</p>
    <ol>
      <li><strong>Opening scene</strong> — establish where the PCs are and what pressure is already on them. Frame it with a situation aspect or two. Don't wait for players to "find" the adventure — put them in it.</li>
      <li><strong>Middle scenes</strong> — scenes where PCs pursue goals, face complications (compels), and the situation shifts. Each scene should end differently than it started. If nothing changed, cut the scene.</li>
      <li><strong>Climax</strong> — usually a conflict or contest. The stakes are clear because the middle scenes established them. Use zone aspects generated by Ogma's Encounter or Scene Setup generator to set the stage.</li>
      <li><strong>Denouement</strong> — consequences are named and tended to, loose ends are noted for next session, milestone conversation happens. 5 minutes. Don't skip it.</li>
    </ol>
    <div class="callout callout-tip">
      <div class="callout-title">&#127922; The "so" test for scenes</div>
      <p>After every scene ask: "So what changed?" If the answer is "nothing — we just got information," that's fine occasionally, but information scenes should be short. If the answer is "an NPC's loyalty shifted, a consequence was taken, a new aspect appeared" — that's a real scene. Ogma's Complication generator is specifically for injecting scene-changers mid-session.</p>
    </div>

    <h2 id="conflict-walkthrough">A conflict, step by step</h2>
    <p>This walkthrough shows a single 3-exchange conflict. Use it as a reference for your first few sessions.</p>
    <div class="callout callout-scenario">
      <div class="callout-title">&#127914; Setup — warehouse chase gone wrong</div>
      <p><strong>Scene:</strong> The PCs are cornered in a warehouse by a hired enforcer. Two zones: <em>Warehouse Floor</em> (crates, cover) and <em>Loading Dock</em> (open, exit). Situation aspects: "Crates Everywhere" and "One Exit."</p>
      <p><strong>Enforcer (minor NPC):</strong> Fight +3, Athletics +2. 2 stress boxes. Aspect: <em>Gets Paid to Finish the Job.</em></p>
      <p><strong>PC:</strong> Fight +2, Athletics +3. 3 stress boxes. Trouble: <em>Too Proud to Run.</em></p>
    </div>
    <div class="callout callout-scenario">
      <div class="callout-title">&#127914; Exchange 1 — PC goes first (fiction determines order)</div>
      <p><strong>PC declares:</strong> "I knock over a stack of crates to get between us."</p>
      <p><strong>Action:</strong> Create Advantage with Athletics. Difficulty: Fair (+2) — not many crates, but doable fast.</p>
      <p><strong>Result:</strong> Success — "Stack of Crates Between Us" aspect placed, 1 free invoke.</p>
      <p><strong>Enforcer's turn:</strong> Attacks with Fight +3. PC defends with Fight +2. Roll: enforcer gets +1 result (total +4), PC gets 0 result (total +2). 2 shifts of damage.</p>
      <p><strong>PC absorbs:</strong> Spends the free invoke on "Stack of Crates Between Us" (+2) to reduce damage to 0. Narrates: the crates absorbed the hit.</p>
    </div>
    <div class="callout callout-scenario">
      <div class="callout-title">&#127914; Exchange 2 — escalation</div>
      <p><strong>GM offers a compel:</strong> "Your trouble — <em>Too Proud to Run</em> — the loading dock exit is right there, but your character won't take it, will they? Take this fate point and stay to fight." Player accepts, earns 1 FP.</p>
      <p><strong>PC attacks:</strong> Fight +2 plus 1 FP invoke on "Stack of Crates Between Us" (still true!) = effectively Fight +4. Enforcer defends at Fight +3. PC wins by 2 shifts.</p>
      <p><strong>Enforcer absorbs:</strong> Takes 2 stress (boxes ticked). Aspect "<em>Gets Paid to Finish the Job</em>" is invoked by the enforcer (GM spends 1 FP): +2 to their next attack.</p>
    </div>
    <div class="callout callout-scenario">
      <div class="callout-title">&#127914; Exchange 3 — resolution</div>
      <p><strong>Enforcer attacks:</strong> Fight +3 + 2 (invoke) = +5. PC defends: Fight +2 + spend FP on their own aspect = +4. 1 shift through.</p>
      <p><strong>PC options:</strong> Tick a stress box (absorbs 1 shift), take a Mild consequence ("Bruised Ribs" — written as an aspect on the sheet; GM can invoke it against relevant rolls or compel it for a fate point), or concede.</p>
      <p><strong>PC concedes:</strong> "I don't want to take the consequence. I concede — my character bolts for the loading dock, dignity wounded." Earns 1 FP. Player narrates: they escape, but the enforcer saw their face.</p>
      <p><strong>Result:</strong> PC is out of the scene on their terms, story has moved (enforcer knows who they are), and a future complication is seeded. No one "lost" — the story got richer.</p>
    </div>
    <div class="callout callout-info">
      <div class="callout-title">&#128196; Key takeaways from this conflict</div>
      <p>Create Advantage shaped the whole exchange. The compel created a story moment. Concession ended it quickly with consequences that matter narratively. The whole conflict took 10 minutes. That's Fate at its best.</p>
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
