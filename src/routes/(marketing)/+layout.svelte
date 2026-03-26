<script>
    let { children } = $props();
import { onMount } from 'svelte';
import { LS } from '$lib/db.js';
import Footer from '$lib/components/shared/Footer.svelte';

  let theme = $state('dark');
  let navOpen = $state(false);

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
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        style="width:44px;height:44px"><i class={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-circle-half-stroke'} aria-hidden="true"></i></button>
    </div>
  </header>

  <!-- Mobile backdrop -->
  {#if navOpen}
    <div class="mn-backdrop" onclick={() => { navOpen = false; }} aria-hidden="true"></div>
  {/if}

  <!-- Mobile drawer -->
  <nav class="mn-drawer" class:mn-open={navOpen} aria-label="Site navigation">
    <div class="mn-drawer-section">
      <a href="/" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-house" aria-hidden="true" style="width:20px;text-align:center"></i> Home</a>
      <a href="/help" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-book-open" aria-hidden="true" style="width:20px;text-align:center"></i> Help &amp; Learn</a>
      <a href="/about" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-circle-info" aria-hidden="true" style="width:20px;text-align:center"></i> About</a>
      <a href="/license" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-scale-balanced" aria-hidden="true" style="width:20px;text-align:center"></i> License</a>
    </div>
    <div class="mn-drawer-divider"></div>
    <div class="mn-drawer-section">
      <div class="mn-drawer-label">WORLDS</div>
      <a href="/campaigns/fantasy" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-hat-wizard" aria-hidden="true" style="width:20px;text-align:center"></i> Shattered Kingdoms</a>
      <a href="/campaigns/cyberpunk" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-microchip" aria-hidden="true" style="width:20px;text-align:center"></i> Neon Abyss</a>
      <a href="/campaigns/thelongafter" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-biohazard" aria-hidden="true" style="width:20px;text-align:center"></i> The Long Road</a>
      <a href="/campaigns/postapoc" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-sun" aria-hidden="true" style="width:20px;text-align:center"></i> The Long After</a>
      <a href="/campaigns/space" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-rocket" aria-hidden="true" style="width:20px;text-align:center"></i> Void Runners</a>
      <a href="/campaigns/victorian" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-landmark" aria-hidden="true" style="width:20px;text-align:center"></i> Gaslight Chronicles</a>
      <a href="/campaigns/western" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-horse" aria-hidden="true" style="width:20px;text-align:center"></i> Dust and Iron</a>
      <a href="/campaigns/dVentiRealm" class="mn-drawer-link" onclick={() => { navOpen = false; }}><i class="fa-solid fa-dragon" aria-hidden="true" style="width:20px;text-align:center"></i> dVenti Realm</a>
    </div>
  </nav>

  {@render children?.()}

  <Footer />
</div>
