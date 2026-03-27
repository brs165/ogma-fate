<script>
    let { children } = $props();
import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { LS } from '$lib/db.js';
  import Footer from '$lib/components/shared/Footer.svelte';

  let theme = $state('dark');
  let learnOpen = $state(false);
  let navOpen = $state(false);

  let currentPath = $derived($page.url.pathname);

  function isActive(href) {
    const clean = currentPath.replace(/\/$/, '') || '/';
    const target = href.replace(/\/$/, '') || '/';
    return clean === target;
  }

  // Close nav on route change
  $effect(() => {
    currentPath;
    navOpen = false;
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
</script>

<div class="land-shell">
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="land-topnav topbar">
    <!-- Hamburger — mobile only -->
    <button
      class="mn-hamburger"
      onclick={() => { navOpen = !navOpen; }}
      aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
      aria-expanded={String(navOpen)}
    ><i class={navOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} aria-hidden="true"></i></button>
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
          <span class="icon"><i class="fa-solid fa-house" aria-hidden="true"></i></span>Wiki Home
        </a>
        <a href="/help/new-to-ogma" class="wiki-sidebar-link" class:active={isActive('/help/new-to-ogma')}>
          <span class="icon"><i class="fa-solid fa-hand" aria-hidden="true"></i></span>New to Ogma?
        </a>
        <a href="/help/getting-started" class="wiki-sidebar-link" class:active={isActive('/help/getting-started')}>
          <span class="icon"><i class="fa-solid fa-rocket" aria-hidden="true"></i></span>Getting Started
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Learn</div>
        <button class="wiki-sidebar-parent" class:active={currentPath.startsWith('/help/learn-fate')}
          aria-expanded={String(learnOpen || currentPath.startsWith('/help/learn-fate'))}
          onclick={() => { learnOpen = !learnOpen; }}>
          <span class="wiki-sidebar-parent-label"><span class="icon"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i></span>Learn Fate</span>
          <span class="wiki-sidebar-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
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
            <a class="wiki-sidebar-child" href="/help/learn-fate-deep" style="font-weight:600;color:var(--accent)"><i class="fa-solid fa-graduation-cap" aria-hidden="true" style="font-size:10px"></i> Deep Dive</a>
          </nav>
        {/if}
        <a href="/help/how-to-use-ogma" class="wiki-sidebar-link" class:active={isActive('/help/how-to-use-ogma')}>
          <span class="icon"><i class="fa-solid fa-book-open" aria-hidden="true"></i></span>How to Use Ogma
        </a>
        <a href="/help/dnd-transition" class="wiki-sidebar-link" class:active={isActive('/help/dnd-transition')}>
          <span class="icon"><i class="fa-solid fa-right-left" aria-hidden="true"></i></span>D&amp;D Transition
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Prep &amp; Play</div>
        <a href="/campaigns/character-creation" class="wiki-sidebar-link" aria-label="Session Zero — guided character creation">
          <span class="icon"><i class="fa-solid fa-masks-theater" aria-hidden="true"></i></span>Session Zero
        </a>
        <a href="/help/generators" class="wiki-sidebar-link" class:active={isActive('/help/generators')}>
          <span class="icon"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i></span>Generator Suite
        </a>
        <a href="/help/fate-mechanics" class="wiki-sidebar-link" class:active={isActive('/help/fate-mechanics')}>
          <span class="icon"><i class="fa-solid fa-gears" aria-hidden="true"></i></span>Fate Mechanics
        </a>
        <a href="/help/at-the-table" class="wiki-sidebar-link" class:active={isActive('/help/at-the-table')}>
          <span class="icon"><i class="fa-solid fa-users" aria-hidden="true"></i></span>At the Table
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Advanced</div>
        <a href="/help/export-share" class="wiki-sidebar-link" class:active={isActive('/help/export-share')}>
          <span class="icon"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i></span>Export &amp; Share
        </a>
        <a href="/help/customise" class="wiki-sidebar-link" class:active={isActive('/help/customise')}>
          <span class="icon"><i class="fa-solid fa-gear" aria-hidden="true"></i></span>Customise
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Hosting</div>
        <a href="/help/hosting" class="wiki-sidebar-link" class:active={isActive('/help/hosting')}>
          <span class="icon"><i class="fa-solid fa-globe" aria-hidden="true"></i></span>Hosting &amp; Multiplayer
        </a>
      </div>

      <div class="wiki-sidebar-divider"></div>

      <div class="wiki-sidebar-section">
        <div class="wiki-sidebar-label">Help</div>
        <a href="/help/faq" class="wiki-sidebar-link" class:active={isActive('/help/faq')}>
          <span class="icon"><i class="fa-solid fa-circle-question" aria-hidden="true"></i></span>FAQ
        </a>
      </div>
    </aside>

    {@render children?.()}
  </div>

  <Footer />
</div>
