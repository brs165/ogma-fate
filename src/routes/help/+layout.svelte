<script>
  let { children } = $props();
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { LS } from '$lib/db.js';
  import Footer from '$lib/components/shared/Footer.svelte';

  let theme = $state('dark');
  let navOpen = $state(false);
  let activeSection = $state('');

  let currentPath = $derived($page.url.pathname.replace(/\/$/, '') || '/help');

  // ── Section data per page (keyed by path, child items from h2[id]) ──────
  const PAGE_SECTIONS = {
    '/help/new-to-ogma': [
      { id: 'new-ttrpg', label: "Never played a TTRPG" },
      { id: 'from-dnd', label: 'I play D&D' },
      { id: 'from-other', label: 'I play other RPGs' },
      { id: 'run-better', label: 'Help me run Fate better' },
    ],
    '/help/fate-mechanics': [
      { id: 'aspects', label: 'Aspects' },
      { id: 'boosts', label: 'Boosts' },
      { id: 'the-skill-ladder', label: 'The Skill Ladder' },
      { id: 'stress', label: 'Stress' },
      { id: 'consequences', label: 'Consequences' },
      { id: 'fate-points-and-refresh', label: 'Fate Points & Refresh' },
      { id: 'stunts', label: 'Stunts' },
      { id: 'contests', label: 'Contests' },
      { id: 'challenges', label: 'Challenges' },
      { id: 'zones', label: 'Zones' },
      { id: 'countdowns', label: 'Countdowns' },
      { id: 'compels', label: 'Compels' },
      { id: 'create-advantage', label: 'Create an Advantage' },
      { id: 'fate-point-economy-gm', label: 'Fate Point Economy' },
      { id: 'what-gms-prepare', label: 'What GMs Prepare' },
      { id: 'common-errors', label: 'Common Errors' },
      { id: 'further-reading', label: 'Further Reading' },
    ],
    '/help/generators': [
      { id: 'characters', label: 'Characters' },
      { id: 'scenes', label: 'Scenes' },
      { id: 'pacing', label: 'Pacing' },
      { id: 'world', label: 'World' },
      { id: 'the-result-panel', label: 'The Result Panel' },
      { id: 'quick-prep-pack-prep', label: 'Quick Prep Pack' },
    ],
    '/help/at-the-table': [
      { id: 'fate-point-tracker', label: 'Fate Point Tracker' },
      { id: 'quick-prep-pack-prep-packet', label: 'Quick Prep Pack' },
      { id: 'table-prep', label: 'Table Prep' },
      { id: 'session-structure', label: 'Session Structure' },
      { id: 'conflict-walkthrough', label: 'Conflict Walkthrough' },
    ],
    '/help/customise': [
      { id: 'reference-panel-depth', label: 'Reference Panel' },
      { id: 'skills', label: 'Skills' },
      { id: 'table-manager--customising-results', label: 'Table Manager' },
      { id: 'universal-table-merge', label: 'Universal Table Merge' },
    ],
    '/help/export-share': [
      { id: 'markdown-export', label: 'Markdown Export' },
      { id: 'shareable-links', label: 'Shareable Links' },
      { id: 'ogma-json-export', label: 'JSON Export' },
      { id: 'table-prep', label: 'Table Prep' },
    ],
    '/help/hosting': [
      { id: 'how-it-works', label: 'How It Works' },
      { id: 'quick-start', label: 'Quick Start' },
      { id: 'deploy-server', label: 'Deploy Server' },
      { id: 'host-a-session', label: 'Host a Session' },
      { id: 'join-a-session', label: 'Join a Session' },
      { id: 'player-controls', label: 'Player Controls' },
      { id: 'troubleshooting', label: 'Troubleshooting' },
    ],
    '/help/dnd-transition': [
      { id: 'characters-aspects-vs-ability-scores', label: 'Aspects vs Ability Scores' },
      { id: 'skills-broad-strokes', label: 'Skills' },
      { id: 'the-four-actions-not-attack-bonus-move-reaction', label: 'The Four Actions' },
      { id: 'aspects-the-heart-of-the-system', label: 'Aspects Deep Dive' },
      { id: 'fate-points-the-economy', label: 'Fate Points Economy' },
      { id: 'combat-stress-consequences', label: 'Combat & Stress' },
      { id: 'initiative-popcorn-style', label: 'Initiative' },
      { id: 'challenges-contests-conflicts', label: 'Challenges & Contests' },
      { id: 'quick-faq', label: 'Quick FAQ' },
    ],
    '/help/faq': [
      { id: 'fate-rules', label: 'Fate Rules' },
      { id: 'data-storage', label: 'Data & Storage' },
      { id: 'offline-install', label: 'Offline & Install' },
      { id: 'ui-questions', label: 'UI Questions' },
    ],
    '/help/learn-fate-deep': [
      { id: 'tutorial', label: 'Interactive Tutorial' },
      { id: 'walkthrough', label: 'Play-by-Post' },
      { id: 'strategy', label: 'Strategy Guide' },
      { id: 'checklist', label: 'First Session Checklist' },
    ],
  };

  // Learn Fate keeps its special hardcoded children (step-based)
  const LEARN_FATE_CHILDREN = [
    { id: 'step-1', label: '1. Fiction first' },
    { id: 'step-2', label: '2. Aspects' },
    { id: 'step-3', label: '3. Skills & dice' },
    { id: 'step-4', label: '4. Fate points' },
    { id: 'step-5', label: '5. Stress' },
    { id: 'step-6', label: '6. Stunts' },
    { id: 'step-7', label: '7. For the GM' },
  ];

  let currentSections = $derived(PAGE_SECTIONS[currentPath] || []);
  let hasChildren = $derived(currentSections.length > 0);

  // Track which expandable parent is open
  let openParent = $state('');

  // Auto-expand when navigating to a page with sections
  $effect(() => {
    // Find which nav item matches the current path
    for (const path in PAGE_SECTIONS) {
      if (currentPath === path) { openParent = path; return; }
    }
    if (currentPath.startsWith('/help/learn-fate')) { openParent = '/help/learn-fate'; return; }
    openParent = '';
  });

  function isActive(href) {
    const clean = currentPath;
    const target = href.replace(/\/$/, '') || '/';
    return clean === target;
  }

  function toggleParent(path) {
    openParent = openParent === path ? '' : path;
  }

  function isParentOpen(path) {
    return openParent === path;
  }

  // Close nav on route change
  $effect(() => {
    currentPath;
    navOpen = false;
  });

  // ── Scroll spy via IntersectionObserver ──────────────────────────────
  $effect(() => {
    if (typeof document === 'undefined') return;
    const sections = currentSections;
    if (!sections.length) { activeSection = ''; return; }

    // Small delay to let page content render
    const timer = setTimeout(() => {
      const ids = sections.map(s => s.id);
      const elements = ids.map(id => document.getElementById(id)).filter(Boolean);
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              activeSection = entry.target.id;
            }
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );

      elements.forEach(el => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  });

  onMount(() => {
    try {
      theme = LS.get('theme') || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
    LS.set('theme', theme);
  }

  function closeNavOnClick() { navOpen = false; }

  // Helper: render a sidebar link that may have child sections
  function linkHasSections(href) {
    const clean = href.replace(/\/$/, '') || '/';
    return !!PAGE_SECTIONS[clean];
  }

  // ── Page order for prev/next navigation ──────────────────────────────
  const PAGE_ORDER = [
    { href: '/help',                label: 'Help Home' },
    { href: '/help/new-to-ogma',    label: 'New to Ogma?' },
    { href: '/help/getting-started', label: 'Getting Started' },
    { href: '/help/learn-fate',     label: 'Learn Fate' },
    { href: '/help/learn-fate-deep', label: 'Learn Fate — Deep Dive' },
    { href: '/help/dnd-transition', label: 'D&D Transition' },
    { href: '/help/how-to-use-ogma', label: 'How to Use Ogma' },
    { href: '/help/generators',     label: 'Generator Suite' },
    { href: '/help/fate-mechanics', label: 'Fate Mechanics' },
    { href: '/help/at-the-table',   label: 'At the Table' },
    { href: '/help/export-share',   label: 'Export & Share' },
    { href: '/help/customise',      label: 'Customise' },
    { href: '/help/hosting',        label: 'Hosting & Multiplayer' },
    { href: '/help/faq',            label: 'FAQ' },
  ];

  let currentPageIdx = $derived(PAGE_ORDER.findIndex(p => p.href === currentPath));
  let prevPage = $derived(currentPageIdx > 0 ? PAGE_ORDER[currentPageIdx - 1] : null);
  let nextPage = $derived(currentPageIdx >= 0 && currentPageIdx < PAGE_ORDER.length - 1 ? PAGE_ORDER[currentPageIdx + 1] : null);
</script>

<div class="land-shell">
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="land-topnav topbar">
    <a href="/" class="topbar-wordmark" aria-label="Ogma home">OGMA</a>
    <div class="topbar-spacer" style="flex:1"></div>
    <div class="topbar-status">
      <a href="/help" class="btn btn-ghost topbar-nav-btn mn-desktop-only" style="font-size:13px;text-decoration:none"><i class="fa-solid fa-book-open" aria-hidden="true"></i> Help</a>
      <a href="/about" class="btn btn-ghost topbar-nav-btn mn-desktop-only" style="font-size:13px;text-decoration:none">About</a>
      <button class="btn btn-icon btn-ghost" onclick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style="width:44px;height:44px"><i class={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-circle-half-stroke'} aria-hidden="true"></i></button>
    </div>
  </header>

  <!-- Mobile backdrop -->
  {#if navOpen}
    <div class="mn-backdrop" onclick={() => { navOpen = false; }} aria-hidden="true"></div>
  {/if}

  <div class="wiki-shell">
    <aside class="wiki-sidebar" class:mn-open={navOpen} role="navigation" aria-label="Help navigation">
      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Getting Started</div>
        <a href="/help" class="wiki-sidebar-link" class:active={isActive('/help')}>
          <span class="icon"><i class="fa-solid fa-house" aria-hidden="true"></i></span>Help Home
        </a>

        {#if linkHasSections('/help/new-to-ogma')}
          <button class="wiki-sidebar-parent" class:active={isActive('/help/new-to-ogma')}
            aria-expanded={String(isParentOpen('/help/new-to-ogma'))}
            onclick={() => { toggleParent('/help/new-to-ogma'); }}>
            <span class="wiki-sidebar-parent-label"><span class="icon"><i class="fa-solid fa-hand" aria-hidden="true"></i></span>New to Ogma?</span>
            <span class="wiki-sidebar-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
          </button>
          {#if isParentOpen('/help/new-to-ogma')}
            <nav class="wiki-sidebar-children open" aria-label="New to Ogma sections">
              <a class="wiki-sidebar-link" href="/help/new-to-ogma" class:active={isActive('/help/new-to-ogma')} onclick={closeNavOnClick} style="padding-left:14px;font-size:11px">
                Overview
              </a>
              {#each PAGE_SECTIONS['/help/new-to-ogma'] as sec}
                <a class="wiki-sidebar-child" class:active={activeSection === sec.id && isActive('/help/new-to-ogma')}
                  href="/help/new-to-ogma#{sec.id}" onclick={closeNavOnClick}>{sec.label}</a>
              {/each}
            </nav>
          {/if}
        {/if}

        <a href="/help/getting-started" class="wiki-sidebar-link" class:active={isActive('/help/getting-started')}>
          <span class="icon"><i class="fa-solid fa-rocket" aria-hidden="true"></i></span>Getting Started
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Learn</div>
        <button class="wiki-sidebar-parent" class:active={currentPath.startsWith('/help/learn-fate')}
          aria-expanded={String(isParentOpen('/help/learn-fate'))}
          onclick={() => { toggleParent('/help/learn-fate'); }}>
          <span class="wiki-sidebar-parent-label"><span class="icon"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i></span>Learn Fate</span>
          <span class="wiki-sidebar-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
        </button>
        {#if isParentOpen('/help/learn-fate')}
          <nav class="wiki-sidebar-children open" aria-label="Step progress">
            {#each LEARN_FATE_CHILDREN as sec}
              <a class="wiki-sidebar-child" class:active={activeSection === sec.id && currentPath === '/help/learn-fate'}
                href="/help/learn-fate#{sec.id}" onclick={closeNavOnClick}>{sec.label}</a>
            {/each}
            <a class="wiki-sidebar-child" href="/help/learn-fate-deep" style="font-weight:600;color:var(--accent)" onclick={closeNavOnClick}><i class="fa-solid fa-graduation-cap" aria-hidden="true" style="font-size:10px"></i> Deep Dive</a>
          </nav>
        {/if}

        {#if linkHasSections('/help/dnd-transition')}
          <button class="wiki-sidebar-parent" class:active={isActive('/help/dnd-transition')}
            aria-expanded={String(isParentOpen('/help/dnd-transition'))}
            onclick={() => { toggleParent('/help/dnd-transition'); }}>
            <span class="wiki-sidebar-parent-label"><span class="icon"><i class="fa-solid fa-right-left" aria-hidden="true"></i></span>D&amp;D Transition</span>
            <span class="wiki-sidebar-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
          </button>
          {#if isParentOpen('/help/dnd-transition')}
            <nav class="wiki-sidebar-children open" aria-label="D&amp;D Transition sections">
              {#each PAGE_SECTIONS['/help/dnd-transition'] as sec}
                <a class="wiki-sidebar-child" class:active={activeSection === sec.id && isActive('/help/dnd-transition')}
                  href="/help/dnd-transition#{sec.id}" onclick={closeNavOnClick}>{sec.label}</a>
              {/each}
            </nav>
          {/if}
        {/if}

        <a href="/help/how-to-use-ogma" class="wiki-sidebar-link" class:active={isActive('/help/how-to-use-ogma')}>
          <span class="icon"><i class="fa-solid fa-book-open" aria-hidden="true"></i></span>How to Use Ogma
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Prep &amp; Play</div>
        <a href="/campaigns/character-creation" class="wiki-sidebar-link" aria-label="Session Zero — guided character creation">
          <span class="icon"><i class="fa-solid fa-masks-theater" aria-hidden="true"></i></span>Session Zero
        </a>

        {#if linkHasSections('/help/generators')}
          <button class="wiki-sidebar-parent" class:active={isActive('/help/generators')}
            aria-expanded={String(isParentOpen('/help/generators'))}
            onclick={() => { toggleParent('/help/generators'); }}>
            <span class="wiki-sidebar-parent-label"><span class="icon"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i></span>Generator Suite</span>
            <span class="wiki-sidebar-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
          </button>
          {#if isParentOpen('/help/generators')}
            <nav class="wiki-sidebar-children open" aria-label="Generator Suite sections">
              {#each PAGE_SECTIONS['/help/generators'] as sec}
                <a class="wiki-sidebar-child" class:active={activeSection === sec.id && isActive('/help/generators')}
                  href="/help/generators#{sec.id}" onclick={closeNavOnClick}>{sec.label}</a>
              {/each}
            </nav>
          {/if}
        {/if}

        {#if linkHasSections('/help/fate-mechanics')}
          <button class="wiki-sidebar-parent" class:active={isActive('/help/fate-mechanics')}
            aria-expanded={String(isParentOpen('/help/fate-mechanics'))}
            onclick={() => { toggleParent('/help/fate-mechanics'); }}>
            <span class="wiki-sidebar-parent-label"><span class="icon"><i class="fa-solid fa-gears" aria-hidden="true"></i></span>Fate Mechanics</span>
            <span class="wiki-sidebar-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
          </button>
          {#if isParentOpen('/help/fate-mechanics')}
            <nav class="wiki-sidebar-children open" aria-label="Fate Mechanics sections">
              {#each PAGE_SECTIONS['/help/fate-mechanics'] as sec}
                <a class="wiki-sidebar-child" class:active={activeSection === sec.id && isActive('/help/fate-mechanics')}
                  href="/help/fate-mechanics#{sec.id}" onclick={closeNavOnClick}>{sec.label}</a>
              {/each}
            </nav>
          {/if}
        {/if}

        {#if linkHasSections('/help/at-the-table')}
          <button class="wiki-sidebar-parent" class:active={isActive('/help/at-the-table')}
            aria-expanded={String(isParentOpen('/help/at-the-table'))}
            onclick={() => { toggleParent('/help/at-the-table'); }}>
            <span class="wiki-sidebar-parent-label"><span class="icon"><i class="fa-solid fa-users" aria-hidden="true"></i></span>At the Table</span>
            <span class="wiki-sidebar-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
          </button>
          {#if isParentOpen('/help/at-the-table')}
            <nav class="wiki-sidebar-children open" aria-label="At the Table sections">
              {#each PAGE_SECTIONS['/help/at-the-table'] as sec}
                <a class="wiki-sidebar-child" class:active={activeSection === sec.id && isActive('/help/at-the-table')}
                  href="/help/at-the-table#{sec.id}" onclick={closeNavOnClick}>{sec.label}</a>
              {/each}
            </nav>
          {/if}
        {/if}
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Advanced</div>

        {#if linkHasSections('/help/export-share')}
          <button class="wiki-sidebar-parent" class:active={isActive('/help/export-share')}
            aria-expanded={String(isParentOpen('/help/export-share'))}
            onclick={() => { toggleParent('/help/export-share'); }}>
            <span class="wiki-sidebar-parent-label"><span class="icon"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i></span>Export &amp; Share</span>
            <span class="wiki-sidebar-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
          </button>
          {#if isParentOpen('/help/export-share')}
            <nav class="wiki-sidebar-children open" aria-label="Export &amp; Share sections">
              {#each PAGE_SECTIONS['/help/export-share'] as sec}
                <a class="wiki-sidebar-child" class:active={activeSection === sec.id && isActive('/help/export-share')}
                  href="/help/export-share#{sec.id}" onclick={closeNavOnClick}>{sec.label}</a>
              {/each}
            </nav>
          {/if}
        {/if}

        {#if linkHasSections('/help/customise')}
          <button class="wiki-sidebar-parent" class:active={isActive('/help/customise')}
            aria-expanded={String(isParentOpen('/help/customise'))}
            onclick={() => { toggleParent('/help/customise'); }}>
            <span class="wiki-sidebar-parent-label"><span class="icon"><i class="fa-solid fa-gear" aria-hidden="true"></i></span>Customise</span>
            <span class="wiki-sidebar-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
          </button>
          {#if isParentOpen('/help/customise')}
            <nav class="wiki-sidebar-children open" aria-label="Customise sections">
              {#each PAGE_SECTIONS['/help/customise'] as sec}
                <a class="wiki-sidebar-child" class:active={activeSection === sec.id && isActive('/help/customise')}
                  href="/help/customise#{sec.id}" onclick={closeNavOnClick}>{sec.label}</a>
              {/each}
            </nav>
          {/if}
        {/if}
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Hosting</div>

        {#if linkHasSections('/help/hosting')}
          <button class="wiki-sidebar-parent" class:active={isActive('/help/hosting')}
            aria-expanded={String(isParentOpen('/help/hosting'))}
            onclick={() => { toggleParent('/help/hosting'); }}>
            <span class="wiki-sidebar-parent-label"><span class="icon"><i class="fa-solid fa-globe" aria-hidden="true"></i></span>Hosting &amp; Multiplayer</span>
            <span class="wiki-sidebar-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
          </button>
          {#if isParentOpen('/help/hosting')}
            <nav class="wiki-sidebar-children open" aria-label="Hosting sections">
              {#each PAGE_SECTIONS['/help/hosting'] as sec}
                <a class="wiki-sidebar-child" class:active={activeSection === sec.id && isActive('/help/hosting')}
                  href="/help/hosting#{sec.id}" onclick={closeNavOnClick}>{sec.label}</a>
              {/each}
            </nav>
          {/if}
        {/if}
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Help</div>

        {#if linkHasSections('/help/faq')}
          <button class="wiki-sidebar-parent" class:active={isActive('/help/faq')}
            aria-expanded={String(isParentOpen('/help/faq'))}
            onclick={() => { toggleParent('/help/faq'); }}>
            <span class="wiki-sidebar-parent-label"><span class="icon"><i class="fa-solid fa-circle-question" aria-hidden="true"></i></span>FAQ</span>
            <span class="wiki-sidebar-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
          </button>
          {#if isParentOpen('/help/faq')}
            <nav class="wiki-sidebar-children open" aria-label="FAQ sections">
              {#each PAGE_SECTIONS['/help/faq'] as sec}
                <a class="wiki-sidebar-child" class:active={activeSection === sec.id && isActive('/help/faq')}
                  href="/help/faq#{sec.id}" onclick={closeNavOnClick}>{sec.label}</a>
              {/each}
            </nav>
          {/if}
        {/if}
      </div>
    </aside>

    <div class="wiki-main-col">
      {@render children?.()}

      {#if prevPage || nextPage}
        <nav class="wiki-prev-next" aria-label="Page navigation">
          {#if prevPage}
            <a href={prevPage.href} class="wiki-prev-next-link">
              <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {prevPage.label}
            </a>
          {:else}
            <span></span>
          {/if}
          {#if nextPage}
            <a href={nextPage.href} class="wiki-prev-next-link">
              {nextPage.label} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>
          {/if}
        </nav>
      {/if}
    </div>
  </div>

  <!-- Mobile bottom nav — always visible on small screens for help navigation -->
  <nav class="wiki-mobile-nav" aria-label="Help pages">
    <a href="/help" class="wiki-mobile-nav-btn" class:active={isActive('/help')}>
      <i class="fa-solid fa-house" aria-hidden="true"></i>
      <span>Home</span>
    </a>
    <a href="/help/learn-fate" class="wiki-mobile-nav-btn" class:active={currentPath.startsWith('/help/learn-fate')}>
      <i class="fa-solid fa-dice-d20" aria-hidden="true"></i>
      <span>Learn</span>
    </a>
    <a href="/help/generators" class="wiki-mobile-nav-btn" class:active={isActive('/help/generators')}>
      <i class="fa-solid fa-gears" aria-hidden="true"></i>
      <span>Generators</span>
    </a>
    <a href="/help/fate-mechanics" class="wiki-mobile-nav-btn" class:active={isActive('/help/fate-mechanics')}>
      <i class="fa-solid fa-book-open" aria-hidden="true"></i>
      <span>Mechanics</span>
    </a>
    <button class="wiki-mobile-nav-btn" onclick={() => { navOpen = !navOpen; }} aria-label="All help topics">
      <i class="fa-solid fa-bars" aria-hidden="true"></i>
      <span>More</span>
    </button>
  </nav>

  <Footer />
</div>
