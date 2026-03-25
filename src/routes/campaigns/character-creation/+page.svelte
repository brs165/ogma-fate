<svelte:options runes={false} />

<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    goto('/help/learn-fate', { replaceState: true });
  });
</script>

<svelte:head>
  <title>Character Creation — Ogma</title>
</svelte:head>

<div class="land-shell" style="display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:16px">
  <div style="font-size:32px">&#127917;</div>
  <div style="font-size:16px;font-weight:700;color:var(--text)">Redirecting to Learn Fate&hellip;</div>
  <div style="font-size:14px;color:var(--text-dim)">Character creation guidance is part of the Learn Fate guide.</div>
  <a href="/help/learn-fate" style="margin-top:8px;padding:10px 24px;background:var(--accent);color:#000;border-radius:100px;text-decoration:none;font-weight:700;font-size:14px">Go to Learn Fate &rarr;</a>
</div>
