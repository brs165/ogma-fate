<svelte:options runes={false} />

<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let theme = 'dark';
  let learnOpen = false;

  $: currentPath = $page.url.pathname;

  function isActive(href) {
    return currentPath === href;
  }

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

  <div class="wiki-shell">
    <aside class="wiki-sidebar" role="navigation" aria-label="Help navigation">
      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Getting Started</div>
        <a href="/help" class="wiki-sidebar-link" class:active={isActive('/help')}>
          <span class="icon">&#127968;</span>Wiki Home
        </a>
        <a href="/help/new-to-ogma" class="wiki-sidebar-link" class:active={isActive('/help/new-to-ogma')}>
          <span class="icon">&#128075;</span>New to Ogma?
        </a>
        <a href="/help/getting-started" class="wiki-sidebar-link" class:active={isActive('/help/getting-started')}>
          <span class="icon">&#128640;</span>Getting Started
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Learn</div>
        <button class="wiki-sidebar-parent" class:active={currentPath.startsWith('/help/learn-fate')}
          aria-expanded={String(learnOpen || currentPath.startsWith('/help/learn-fate'))}
          on:click={() => { learnOpen = !learnOpen; }}>
          <span class="wiki-sidebar-parent-label"><span class="icon">&#127922;</span>Learn Fate</span>
          <span class="wiki-sidebar-chevron" aria-hidden="true">&#8250;</span>
        </button>
        {#if learnOpen || currentPath.startsWith('/help/learn-fate')}
          <nav class="wiki-sidebar-children open" aria-label="Step progress">
            <a class="wiki-sidebar-child" href="/help/learn-fate#step-1">1. Fiction first</a>
            <a class="wiki-sidebar-child" href="/help/learn-fate#step-2">2. Aspects</a>
            <a class="wiki-sidebar-child" href="/help/learn-fate#step-3">3. Skills &amp; dice</a>
            <a class="wiki-sidebar-child" href="/help/learn-fate#step-4">4. Fate points</a>
            <a class="wiki-sidebar-child" href="/help/learn-fate#step-5">5. Stress</a>
            <a class="wiki-sidebar-child" href="/help/learn-fate#step-6">6. Stunts</a>
            <a class="wiki-sidebar-child" href="/help/learn-fate#step-7">7. For the GM</a>
          </nav>
        {/if}
        <a href="/help/how-to-use-ogma" class="wiki-sidebar-link" class:active={isActive('/help/how-to-use-ogma')}>
          <span class="icon">&#128218;</span>How to Use Ogma
        </a>
        <a href="/help/dnd-transition" class="wiki-sidebar-link" class:active={isActive('/help/dnd-transition')}>
          <span class="icon">&#9876;</span>D&amp;D Transition
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Prep &amp; Play</div>
        <a href="/campaigns/character-creation" class="wiki-sidebar-link" aria-label="Session Zero — guided character creation">
          <span class="icon">&#127917;</span>Session Zero
        </a>
        <a href="/help/generators" class="wiki-sidebar-link" class:active={isActive('/help/generators')}>
          <span class="icon">&#127922;</span>Generator Suite
        </a>
        <a href="/help/fate-mechanics" class="wiki-sidebar-link" class:active={isActive('/help/fate-mechanics')}>
          <span class="icon">&#127922;</span>Fate Mechanics
        </a>
        <a href="/help/at-the-table" class="wiki-sidebar-link" class:active={isActive('/help/at-the-table')}>
          <span class="icon">&#127481;</span>At the Table
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Advanced</div>
        <a href="/help/export-share" class="wiki-sidebar-link" class:active={isActive('/help/export-share')}>
          <span class="icon">&#128279;</span>Export &amp; Share
        </a>
        <a href="/help/customise" class="wiki-sidebar-link" class:active={isActive('/help/customise')}>
          <span class="icon">&#9881;</span>Customise
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Hosting</div>
        <a href="/help/hosting" class="wiki-sidebar-link" class:active={isActive('/help/hosting')}>
          <span class="icon">&#127760;</span>Hosting &amp; Multiplayer
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Help</div>
        <a href="/help/faq" class="wiki-sidebar-link" class:active={isActive('/help/faq')}>
          <span class="icon">&#10067;</span>FAQ
        </a>
      </div>
    </aside>

    <slot />
  </div>

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
