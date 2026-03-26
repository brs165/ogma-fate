<script>
  import { VERSION } from '$lib/version.js';
</script>

<svelte:head>
  <title>About Ogma - On-demand Generator for Masterful Adventures</title>
  <meta name="description" content="About Ogma - how it was built, what's inside, and how to use it offline." />
</svelte:head>

  <main class="about" id="main-content">
    <h1>About Ogma</h1>

    <div class="about-version" role="status" aria-label="Suite version information">
      <span class="about-version-badge">v{VERSION}</span>
      <div class="about-version-meta">
        <strong style="color:var(--text)">Ogma - A Fate Condensed Generator Suite</strong><br>
        March 2026 &middot; 16 generators &middot; 8 campaign worlds &middot; 9,900+ table entries
      </div>
      <div class="about-version-qa">&#10003; 128/128 smoke &middot; 97 named assertions &middot; WCAG 2.1 AA</div>
    </div>

    <p><em><strong>O</strong>n-demand <strong>G</strong>enerator for <strong>M</strong>asterful <strong>A</strong>dventures.</em> That's what Ogma is &mdash; a tool that collapses the distance between an idea and a playable session. Every result is mechanically complete, thematically specific to its campaign world, and ready to put on the table without a second pass. Ogma is an independent fan project built on the Fate Condensed SRD.</p>

    <p style="font-style:italic;color:var(--text-dim);border-left:3px solid var(--accent);padding-left:14px;margin:20px 0;">Every GM should be able to run a great Fate Condensed session, regardless of how much time they had to prep.</p>

    <div class="about-card" style="text-align:center">
      <div class="about-stat"><div class="about-stat-n">16</div><div class="about-stat-l">Generators</div></div>
      <div class="about-stat"><div class="about-stat-n">8</div><div class="about-stat-l">Campaign Worlds</div></div>
      <div class="about-stat"><div class="about-stat-n">128</div><div class="about-stat-l">Combinations</div></div>
      <div class="about-stat"><div class="about-stat-n">97</div><div class="about-stat-l">QA Assertions</div></div>
    </div>

    <h2>Features</h2>
    <p><strong>16 generators</strong> across four categories &mdash; People (Minor NPC, Major NPC, PC Backstory), Scene (Scene Setup, Encounter, Complication), Mechanics (Compel, Consequence, Challenge, Contest, Obstacle, Countdown, Constraint), and World (Campaign Frame, Adventure Seed, Faction).</p>
    <p><strong>8 campaign worlds</strong> &mdash; The Long After (sword &amp; planet), Neon Abyss (cyberpunk), Shattered Kingdoms (dark fantasy), Void Runners (space western), The Gaslight Chronicles (gothic horror), The Long Road (post-apocalypse), Dust and Iron (frontier western), dVenti Realm (arcane collapse). Each has 1,300&ndash;1,900 thematic table entries.</p>
    <p><strong>Field Dossier cards</strong> &mdash; every generator result renders as a structured card with campaign-tinted headers, two-column layout, interactive stress boxes, fate point tracking, and contest scoring. Clickable, compact, designed for use at the table.</p>
    <p><strong>Table Prep</strong> &mdash; save generated content to a persistent session. Browse, export individual cards or entire sessions as JSON. Import sessions from other devices. Quick Prep Pack generates a complete Seed &middot; Scene &middot; NPC skeleton in one click.</p>
    <p><strong>Learn Fate in 7 steps</strong> &mdash; guided walkthrough of Fate Condensed rules with D&amp;D bridging language. Every generator includes an expandable "How to use this" reference section with beginner guidance.</p>
    <p><strong>Export</strong> &mdash; Markdown copy, print/PDF, seed links for sharing, per-card export, and full session JSON export/import.</p>
    <p><strong>Works offline</strong> &mdash; installable as a PWA. After first visit, works fully offline with no internet required.</p>
    <p><strong>Dark and light modes</strong> &mdash; campaign-tinted design with accessible touch targets (48dp minimum) and WCAG 2.1 AA compliance.</p>

    <h2>Coming from D&amp;D?</h2>
    <p>If you or your players are transitioning from D&amp;D 5e, the <a href="/help/dnd-transition">D&amp;D Transition guide</a> covers every major conceptual shift with side-by-side comparisons and concrete examples.</p>

    <h2>Running Offline</h2>
    <p>The suite is fully offline-capable. After your first visit, the service worker caches everything for use without an internet connection. There are two ways to access Ogma:</p>
    <p><strong>Option 1 &mdash; Install as a PWA.</strong> Visit the site in Chrome or Edge, then use the browser's install option (address bar or menu &rarr; "Install Fate Condensed Generator"). The app installs to your device and runs from the home screen with no internet required.</p>
    <p><strong>Option 2 &mdash; Download the zip.</strong> Download the complete suite as a standalone zip. Serve locally with <code>npx serve</code> or any static web server.</p>

    <h2>Technology</h2>
    <p>SvelteKit + Vite with adapter-static. CSS custom properties with dark/light/per-campaign theming, IndexedDB persistence via Dexie 4, WebSocket-based multiplayer via PartySocket. Hosted on GitHub Pages with service worker for full offline capability.</p>
    <p style="font-size:var(--text-sm);color:var(--text-dim)">The generator engine (<code>src/lib/engine.js</code>) has zero Svelte or DOM dependencies and runs in Node for QA &mdash; <strong>128 generator/campaign combinations</strong> are smoke-tested before every release, plus 97 named assertions covering component structure, CSS consistency, touch target compliance, and Fate rules accuracy.</p>

    <h2>How Ogma Is Built</h2>
    <p>Ogma is developed using a structured team of specialised AI roles, each with a defined domain. The generator logic, UI, and QA harness are built and tested systematically &mdash; 128 generator/campaign combinations are verified before every release.</p>
    <p>The table content &mdash; names, aspects, factions, scene details &mdash; is AI-generated. It is not manually written or independently reviewed. The Fate Condensed SRD is used as the reference for rules accuracy in the generator engine.</p>

    <div class="about-card" style="font-size:var(--text-sm);line-height:1.9;color:var(--text-dim);padding:14px 18px">
      <strong style="color:var(--accent)">Rules Expert + Content Designer</strong> &rarr; campaign table content and GM tips<br>
      <strong style="color:var(--accent)">Senior Dev + CSS Engineer</strong> &rarr; UI features, interactive renderers, design system<br>
      <strong style="color:var(--accent)">UX Researcher + IA Specialist</strong> &rarr; navigation, information architecture, help site structure<br>
      <strong style="color:var(--accent)">QA Engineer + Senior Dev</strong> &rarr; every code change (128/128 smoke test required)<br>
      <strong style="color:var(--accent)">A11y Specialist</strong> &rarr; WCAG AA compliance, keyboard navigation, touch targets<br>
      <strong style="color:var(--accent)">Documentation Lead</strong> &rarr; the Help &amp; Wiki &mdash; zero-questions standard
    </div>

    <h2>Credits</h2>
    <p>Ogma is an independent fan project. See the <a href="/license">License &amp; Attribution</a> page for full credits, Fate SRD attribution blocks, and open-source library notices.</p>

    <h2>Help &amp; Wiki</h2>
    <div class="wiki-card-grid" style="margin-top:24px">
      <a href="/learn">
        <div style="font-size:18px">&#127922;</div>
        <div style="font-size:var(--text-sm);font-weight:700;color:var(--text)">Learn Fate</div>
        <div style="font-size:var(--text-label);color:var(--text-muted)">7-step guided walkthrough</div>
      </a>
      <a href="/campaigns/fantasy">
        <div style="font-size:18px">&#127922;</div>
        <div style="font-size:var(--text-sm);font-weight:700;color:var(--text)">Generator Suite</div>
        <div style="font-size:var(--text-label);color:var(--text-muted)">All 16 generators, 128 combinations</div>
      </a>
      <a href="/license">
        <div style="font-size:18px">&#169;</div>
        <div style="font-size:var(--text-sm);font-weight:700;color:var(--text)">License &amp; Attribution</div>
        <div style="font-size:var(--text-label);color:var(--text-muted)">CC BY 3.0, Fate SRD credits</div>
      </a>
    </div>
  </main>
