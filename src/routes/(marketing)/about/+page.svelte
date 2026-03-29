<script>
  import { VERSION } from '$lib/version.js';
  import { Accordion } from 'bits-ui';
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
        March 2026 &middot; 17 generators &middot; 8 campaign worlds &middot; 9,900+ table entries
      </div>
      <div class="about-version-qa">&#10003; 187 QA checks &middot; 166 export checks &middot; WCAG 2.1 AA</div>
    </div>

    <p><em><strong>O</strong>n-demand <strong>G</strong>enerator for <strong>M</strong>asterful <strong>A</strong>dventures.</em> That's what Ogma is &mdash; a tool that collapses the distance between an idea and a playable session. Every result is mechanically complete, thematically specific to its campaign world, and ready to put on the table without a second pass. Ogma is an independent fan project built on the Fate Condensed SRD.</p>

    <p style="font-style:italic;color:var(--text-dim);border-left:3px solid var(--accent);padding-left:14px;margin:20px 0;">Every GM should be able to run a great Fate Condensed session, regardless of how much time they had to prep.</p>

    <div class="about-card" style="text-align:center">
      <div class="about-stat"><div class="about-stat-n">17</div><div class="about-stat-l">Generators</div></div>
      <div class="about-stat"><div class="about-stat-n">8</div><div class="about-stat-l">Campaign Worlds</div></div>
      <div class="about-stat"><div class="about-stat-n">136</div><div class="about-stat-l">Combinations</div></div>
      <div class="about-stat"><div class="about-stat-n">187</div><div class="about-stat-l">QA Checks</div></div>
    </div>

    <h2>Features</h2>
    <p><strong>17 generators</strong> across four categories &mdash; People (Minor NPC, Major NPC, PC, PC Backstory), Scene (Scene Setup, Encounter, Complication), Mechanics (Compel, Consequence, Challenge, Contest, Obstacle, Countdown, Constraint), and World (Campaign Frame, Adventure Seed, Faction).</p>
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
    <p>SvelteKit + Vite with adapter-static. CSS custom properties with dark/light/per-campaign theming, IndexedDB persistence via Dexie 4, WebSocket-based multiplayer via PartySocket. Hosted on Cloudflare Pages with service worker for full offline capability.</p>
    <p style="font-size:var(--text-sm);color:var(--text-dim)">The generator engine (<code>src/lib/engine.js</code>) has zero Svelte or DOM dependencies and runs in Node for QA &mdash; <strong>136 generator/campaign combinations</strong> are smoke-tested before every release, plus 187 QA checks covering component structure, CSS consistency, touch target compliance, and Fate rules accuracy.</p>

    <h2>How Ogma Is Built</h2>
    <p>Ogma is developed using a structured team of specialised AI roles, each with a defined domain. The generator logic, UI, and QA harness are built and tested systematically &mdash; 136 generator/campaign combinations verified before every release.</p>
    <p>The table content &mdash; names, aspects, factions, scene details &mdash; is AI-generated and not manually written or independently reviewed. The Fate Condensed SRD is the reference for rules accuracy.</p>

    <div class="about-team-roles">
      <div class="about-team-role"><span class="about-team-role-name">Rules Expert + Content Designer</span><span class="about-team-role-desc">Campaign table content and GM tips</span></div>
      <div class="about-team-role"><span class="about-team-role-name">Senior Dev + CSS Engineer</span><span class="about-team-role-desc">UI features, interactive renderers, design system</span></div>
      <div class="about-team-role"><span class="about-team-role-name">UX Researcher + IA Specialist</span><span class="about-team-role-desc">Navigation, information architecture, help site structure</span></div>
      <div class="about-team-role"><span class="about-team-role-name">QA Engineer + Senior Dev</span><span class="about-team-role-desc">Every code change &mdash; 189 QA checks required</span></div>
      <div class="about-team-role"><span class="about-team-role-name">A11y Specialist</span><span class="about-team-role-desc">WCAG AA compliance, keyboard navigation, touch targets</span></div>
      <div class="about-team-role"><span class="about-team-role-name">Documentation Lead</span><span class="about-team-role-desc">Help &amp; Wiki &mdash; zero-questions standard</span></div>
    </div>

    <Accordion.Root type="single" class="about-prompt-acc">
      <Accordion.Item value="prompts" class="about-prompt-item">
        <Accordion.Header>
          <Accordion.Trigger class="about-prompt-trigger">
            <span>View role prompts</span>
            <i class="fa-solid fa-chevron-down about-prompt-chevron" aria-hidden="true"></i>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content class="about-prompt-content">
          <div class="about-prompt-role">
            <div class="about-prompt-role-name">Rules Expert + Content Designer</div>
            <div class="about-prompt-role-text">You are a Fate Condensed rules expert and fiction writer specialising in tabletop RPG content. Generate thematic table entries &mdash; names, aspects, factions, scene hooks, NPC concepts &mdash; that are rules-mechanically sound and tonally specific to each of Ogma's eight campaign worlds. All output must follow the Fate Condensed SRD and be formatted as JavaScript array literals compatible with the existing data module schema.</div>
          </div>
          <div class="about-prompt-role">
            <div class="about-prompt-role-name">Senior Dev + CSS Engineer</div>
            <div class="about-prompt-role-text">You are a senior Svelte 5 developer and CSS engineer working on a SvelteKit + Vite project in full runes mode. Use $state, $derived, $props, $effect &mdash; never legacy prop syntax or on:event syntax. All styling goes to static/assets/css/theme.css only; no &lt;style&gt; blocks. Implement UI features for the native pointer/wheel canvas, interactive card renderers, and the design system using bits-ui primitives. Preserve WCAG 2.1 AA on every change.</div>
          </div>
          <div class="about-prompt-role">
            <div class="about-prompt-role-name">UX Researcher + IA Specialist</div>
            <div class="about-prompt-role-text">You design navigation structure, generator discovery flow, and help site architecture for Ogma. Follow mobile-first principles with 44px minimum touch targets. Your decisions are grounded in how GMs use the tool at the table &mdash; fast-access prep, progressive onboarding for new Fate players, and expert shortcuts for veterans. Produce IA audits, navigation proposals, and information hierarchy diagrams.</div>
          </div>
          <div class="about-prompt-role">
            <div class="about-prompt-role-name">QA Engineer + Senior Dev</div>
            <div class="about-prompt-role-text">You are a QA engineer for the Ogma generator suite. Run scripts/qa-hard.mjs (189 checks), scripts/qa-export.mjs (166 export round-trip checks), and scripts/qa-unit.mjs before approving any delivery. Verify npx vite build prints &#x2714; done. Review component structure against architecture rules, flag regressions in content coverage or Fate rules accuracy, and confirm zero broken a11y attributes.</div>
          </div>
          <div class="about-prompt-role">
            <div class="about-prompt-role-name">A11y Specialist</div>
            <div class="about-prompt-role-text">You are an accessibility specialist mandated with WCAG 2.1 AA compliance across all 78 Svelte components. Review every component for semantic HTML, correct ARIA roles and labels, keyboard navigability, focus management in dialogs and menus, contrast ratios, and minimum 44dp touch targets. Produce a compliance report with each violation and required fix before approving delivery.</div>
          </div>
          <div class="about-prompt-role">
            <div class="about-prompt-role-name">Documentation Lead</div>
            <div class="about-prompt-role-text">You are the documentation lead for Ogma's help site. Write to a zero-questions standard &mdash; every page answers the question a GM would ask before they need to ask it. Maintain consistency across all help pages: Quick Start summary at top, core concept explanation, GM tips, common mistakes, and cross-links to related generators. Write for GMs coming from D&amp;D 5e as well as Fate veterans.</div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>

    <h2>Credits</h2>
    <p>Ogma is an independent fan project. See the <a href="/license">License &amp; Attribution</a> page for full credits, Fate SRD attribution blocks, and open-source library notices.</p>

    <h2>Help &amp; Wiki</h2>
    <div class="wiki-card-grid" style="margin-top:24px">
      <a href="/learn">
        <div style="font-size:18px"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i></div>
        <div style="font-size:var(--text-sm);font-weight:700;color:var(--text)">Learn Fate</div>
        <div style="font-size:var(--text-label);color:var(--text-muted)">7-step guided walkthrough</div>
      </a>
      <a href="/campaigns/fantasy">
        <div style="font-size:18px"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i></div>
        <div style="font-size:var(--text-sm);font-weight:700;color:var(--text)">Generator Suite</div>
        <div style="font-size:var(--text-label);color:var(--text-muted)">All 17 generators, 136 combinations</div>
      </a>
      <a href="/license">
        <div style="font-size:18px"><i class="fa-regular fa-copyright" aria-hidden="true"></i></div>
        <div style="font-size:var(--text-sm);font-weight:700;color:var(--text)">License &amp; Attribution</div>
        <div style="font-size:var(--text-label);color:var(--text-muted)">CC BY 3.0, Fate SRD credits</div>
      </a>
    </div>
  </main>
