<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    goto('/help/dnd-transition', { replaceState: true });
  });
</script>

<svelte:head>
  <title>D&amp;D Transition Guide — Ogma</title>
</svelte:head>

<div class="land-shell" style="display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:16px">
  <div style="font-size:32px">&#9876;</div>
  <div style="font-size:16px;font-weight:700;color:var(--text)">D&amp;D Transition has moved</div>
  <div style="font-size:14px;color:var(--text-dim)">The D&amp;D guide is now part of the <strong>Help &amp; Wiki</strong>.</div>
  <a href="/help/dnd-transition" style="margin-top:8px;padding:10px 24px;background:var(--accent);color:#000;border-radius:100px;text-decoration:none;font-weight:700;font-size:14px">Go to D&amp;D Transition Guide &rarr;</a>
</div>
