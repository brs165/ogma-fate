<svelte:head>
  <title>Hosting — Ogma Help</title>
  <meta name="description" content="How to host a live multiplayer Ogma session — deploy the sync server, share a room code, and play with remote players in real time." />
</svelte:head>

<main class="wiki-content" id="main-content">

    <div class="wiki-page-eyebrow">Hosting</div>
    <h1>Online multiplayer with Ogma</h1>
    <p class="wiki-page-desc">Ogma supports real-time remote play. The GM runs the session normally — generating cards, tracking stress, rolling dice — and players follow along on their own devices. No accounts, no installs, no subscription. Just a room code.</p>

    <h2 id="how-it-works">How it works</h2>
    <p>Ogma uses a small relay server hosted on Cloudflare to pass state between browsers. The GM's browser is always the source of truth. The relay just forwards the GM's state to players and forwards player actions (FP changes, stress boxes) back to the GM.</p>
    <ul>
      <li><strong>Offline play is unchanged.</strong> If you never click Host, nothing is different from before.</li>
      <li><strong>GM-only cards stay private.</strong> Cards marked GM are never sent over the wire — only the GM sees them.</li>
      <li><strong>Reconnection is automatic.</strong> If a player's connection drops, it re-establishes silently in the background.</li>
      <li><strong>No accounts needed.</strong> Sessions are identified by a 4-character room code that expires when the GM closes the tab.</li>
    </ul>

    <div class="callout callout-info">
      <div class="callout-title">&#9432; What players can do</div>
      <p>Remote players can see the full scene board (non-GM cards), claim their own character, and edit their own FP, stress boxes, and consequences. They cannot add or remove cards, generate content, or see GM-only notes.</p>
    </div>

    <h2 id="quick-start">Quick start — 5 minutes to your first online session</h2>
    <p>If you just want to play right now and someone else (or Ogma's hosted instance) is running the server, this is all you need:</p>
    <ol>
      <li>Open any campaign page (e.g. <strong>The Gaslight Chronicles</strong>), do your prep, then click <strong>Table</strong> in the top nav.</li>
      <li>Click <strong>&#127760; Host</strong> in the toolbar. A room code like <code>7K3F</code> appears with a &#128203; copy button.</li>
      <li>Click &#128203; to copy the join link and paste it into Discord, iMessage, or wherever your players are.</li>
      <li>Players open the link — they see a "Joining Room 7K3F" screen, enter their name, and they're in.</li>
      <li>Players click <strong>This is me</strong> next to their character to claim it and unlock their own controls.</li>
    </ol>

    <div class="callout callout-scenario">
      <div class="callout-title">&#127914; Scenario: starting a remote session</div>
      <p>You're running The Long After online. Before the session you generate a Seed, two NPCs, and a Scene card and save them to the Table canvas. At session time you click Host, share the link in Discord. Your three players open it and each claim their character. You open the Dice tab and ask the first player to roll their Shoot skill — they click it on their screen, the result appears as a toast on everyone's display. Five minutes from link to first roll.</p>
    </div>

    <h2 id="deploy-server">Deploying your own sync server</h2>
    <p>Ogma's shared server handles casual play. If you run regular campaigns, host events, or want full privacy, deploying your own takes about five minutes and is free.</p>

    <h3>What you need</h3>
    <ul>
      <li>A free <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a> account</li>
      <li>A free <a href="https://cloudflare.com" target="_blank" rel="noreferrer">Cloudflare</a> account (you already have one if ogma.net is on Cloudflare)</li>
    </ul>

    <h3>Step 1 — Create the server repo on GitHub</h3>
    <p>Go to <strong>github.com &rarr; New repository</strong>. Name it <code>ogma-sync</code>, make it Public, skip the README, and click Create. Then on your machine:</p>
    <pre><code>unzip ogma-sync-server.zip
cd ogma-sync
git init
git add .
git commit -m "Initial relay server"
git remote add origin https://github.com/YOUR_USERNAME/ogma-sync.git
git push -u origin main</code></pre>

    <h3>Step 2 — Add two secrets to your GitHub repo</h3>
    <p>Go to your <code>ogma-sync</code> repo &rarr; <strong>Settings &rarr; Secrets and variables &rarr; Actions &rarr; New repository secret</strong> and add both of these:</p>

    <table class="wiki-table">
      <thead>
        <tr>
          <th scope="col">Secret name</th>
          <th scope="col">Where to find it</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>CLOUDFLARE_API_TOKEN</code></td>
          <td>dash.cloudflare.com &rarr; avatar (top right) &rarr; <strong>My Profile</strong> &rarr; <strong>API Tokens</strong> &rarr; <strong>Create Token</strong> &rarr; choose the <strong>Edit Cloudflare Workers</strong> template &rarr; Continue &rarr; Create Token. <strong>Copy it immediately</strong> — you only see it once.</td>
        </tr>
        <tr>
          <td><code>CLOUDFLARE_ACCOUNT_ID</code></td>
          <td>dash.cloudflare.com &rarr; look at the right sidebar on any page &rarr; copy the <strong>Account ID</strong> value.</td>
        </tr>
      </tbody>
    </table>

    <div class="callout callout-warning">
      <div class="callout-title">&#9888; Two secrets are required</div>
      <p>The deploy action needs both the API token <em>and</em> the account ID. Missing either one causes the action to fail silently or time out.</p>
    </div>

    <h3>Step 3 — Push to main</h3>
    <p>The repo includes a GitHub Action at <code>.github/workflows/deploy.yml</code> that runs <code>wrangler deploy</code> directly. Here's what it contains:</p>
    <pre><code>name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install Wrangler
        run: npm install -g wrangler@4
      - name: Deploy
        run: wrangler deploy --config wrangler.toml
        env:
          CLOUDFLARE_API_TOKEN: $&#123;&#123; secrets.CLOUDFLARE_API_TOKEN &#125;&#125;
          CLOUDFLARE_ACCOUNT_ID: $&#123;&#123; secrets.CLOUDFLARE_ACCOUNT_ID &#125;&#125;</code></pre>
    <p>It's already committed in the repo — just push and it runs. As soon as you push to <code>main</code> it runs automatically — no configuration needed. It takes about 30 seconds. When it finishes, look for this line in the Actions log:</p>
    <pre><code>https://ogma-sync.&lt;your-subdomain&gt;.workers.dev</code></pre>
    <p>That's your sync server URL — copy it, you'll need it in Step 4. You can also trigger the deploy manually any time: Actions tab &rarr; <strong>Deploy to Cloudflare Workers</strong> &rarr; <strong>Run workflow</strong>.</p>

    <div class="callout callout-tip">
      <div class="callout-title">&#128161; Tip: custom domain</div>
      <p>If ogma.net is on Cloudflare, add a CNAME DNS record: name <code>sync</code>, target <code>ogma-sync.your-subdomain.workers.dev</code>, proxy <strong>off</strong> (grey cloud — WebSockets don't work through the Cloudflare proxy). Then set your sync server to <code>sync.ogma.net</code>.</p>
    </div>

    <div class="callout callout-warning">
      <div class="callout-title">&#9888; Free tier requires <code>new_sqlite_classes</code></div>
      <p>The <code>wrangler.toml</code> in the repo uses <code>new_sqlite_classes</code> (not <code>new_classes</code>) in the <code>[[migrations]]</code> block. Cloudflare's free tier changed to SQLite-backed Durable Objects in 2024 — the old key returns error <code>10097</code> and the deploy fails silently.</p>
    </div>

    <h3>Step 4 — Point Ogma at your server</h3>
    <p>In the Table toolbar, click the small <strong>&#9881;</strong> button (visible when not connected, next to the Join button). Paste your worker URL. Ogma saves it to your browser preferences — you only need to do this once per device.</p>

    <h2 id="host-a-session">Hosting a session</h2>
    <p>Open any campaign's <strong>Table</strong> canvas. Click <strong>&#127760; Host</strong> in the toolbar. Ogma generates a 4-character room code and connects to the sync server. A green pill appears in the toolbar showing the code and how many players are online.</p>
    <p>Click the &#128203; icon inside the pill to copy a full join link. Share it anywhere — Discord, iMessage, email. Players who open it go directly to the join screen.</p>
    <p>The toolbar also shows a live count of connected players. When a player joins you'll see the number tick up — no separate notification needed.</p>
    <p>Click <strong>Stop</strong> in the pill to end the session. Players see a "GM disconnected" toast. If you accidentally close the tab, reopen it, click Host with the same room code (if you remember it) and everyone reconnects. Card state is saved locally in your browser's IndexedDB regardless of connectivity.</p>

    <h2 id="join-a-session">Joining a session</h2>
    <p>Open the join link your GM shared. You'll see:</p>
    <blockquote>
      <strong>&#127760; Joining Room 7K3F</strong><br>
      You've been invited to a live Ogma session. Enter your name to join as a player.
    </blockquote>
    <p>Type your name and click <strong>Join Session</strong>. If your name matches a character already on the GM's board, you're auto-claimed as that character. Otherwise you join as a spectator and can click <strong>This is me</strong> next to any character to claim it.</p>
    <p>You can also click <strong>Watch only</strong> to join without a character — useful for a co-GM or someone observing.</p>

    <h2 id="player-controls">What players can control</h2>
    <p>Once you've claimed a character you can:</p>
    <ul>
      <li>Spend and gain your own <strong>Fate Points</strong> (the + and &minus; buttons on your character row)</li>
      <li>Toggle your own <strong>stress boxes</strong> (Physical and Mental)</li>
      <li>Fill in your own <strong>consequences</strong></li>
      <li>Toggle your own <strong>acted</strong> indicator in the turn order bar</li>
      <li>Roll dice from the <strong>Dice</strong> toolbar button — your roll appears as a toast on everyone's screen</li>
    </ul>
    <p>Everything else is GM-only: adding or removing cards, generating content, moving cards on the canvas, managing other players' characters, and seeing GM-only notes.</p>

    <div class="callout callout-dnd">
      <div class="callout-title">&#9876; Coming from D&amp;D VTTs</div>
      <p>Ogma's multiplayer is deliberately lighter than Foundry or Roll20. There's no shared map, no token movement, and no dice rolling by default (players roll their own physical dice or use the Dice tab). Ogma's job is scene management and content generation, not combat simulation. Use it alongside your preferred voice/video tool.</p>
    </div>

    <h2 id="custom-server">Custom sync server</h2>
    <p>The sync server is open source at <code>github.com/brs165/ogma-sync</code>. Anyone can deploy their own instance for free using Cloudflare's free tier (100,000 WebSocket message-days per month — enough for roughly 125 four-hour sessions). The <strong>Deploy to Cloudflare</strong> button in the repo README does the whole setup in one click if you prefer not to use the command line.</p>
    <p>To point your Ogma installation at a custom server, click &#9881; in the toolbar (visible when not connected) and enter the server URL. This is saved in your browser and used for all future sessions on that device.</p>

    <h2 id="troubleshooting">Troubleshooting</h2>

    <h3>Players see a blank board after joining</h3>
    <p>The GM needs to have added at least one card to the canvas before players join — the server only stores the state from the most recent GM broadcast, and an empty board is valid state. Have the GM add a card or click Host again to re-broadcast.</p>

    <h3>The Host button does nothing or shows "Sync unavailable offline"</h3>
    <p>The <code>partysocket</code> client script failed to load. This usually means the browser is fully offline. The script is cached by the service worker after first load, so if you've opened a campaign page online at least once, it should work offline. Try a hard refresh (<kbd>Ctrl+Shift+R</kbd> / <kbd>Cmd+Shift+R</kbd>) while online.</p>

    <h3>Players keep disconnecting</h3>
    <p>The <code>partysocket</code> client reconnects automatically with exponential backoff. Brief dropouts are normal and recover silently. If a player is on a corporate or school network, port 443 WebSocket connections are occasionally blocked — a personal hotspot usually fixes it.</p>

    <h3>A player can't see the GM's cards</h3>
    <p>Check that the cards aren't marked GM-only (amber dashed border). GM-only cards are never sent to players — this is by design. In Edit mode, click the <strong>GM / pub</strong> toggle on each card to make it visible.</p>

    <h3>The room code expired</h3>
    <p>Room codes are only active while the GM has the Table canvas open and is connected. If you close the tab or click Stop, the room ends. Start a new session with a new code — card state is saved locally in your browser and reloads automatically when you reopen the Table canvas.</p>
</main>
