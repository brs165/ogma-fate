<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const world = params.get('world') || 'fantasy';
    const room = params.get('room');
    let dest = '/campaigns/' + encodeURIComponent(world) + '?canvas=1&mode=play';
    if (room) dest += '&room=' + encodeURIComponent(room);
    goto(dest, { replaceState: true });
  });
</script>

<svelte:head>
  <title>Run Session — Ogma</title>
</svelte:head>

<div class="land-shell" style="display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:16px">
  <div style="font-size:32px">&#9654;</div>
  <div style="font-size:16px;font-weight:700;color:var(--text)">Redirecting to Play mode&hellip;</div>
  <a href="/campaigns/fantasy?canvas=1&mode=play" style="margin-top:8px;padding:10px 24px;background:var(--accent);color:#000;border-radius:100px;text-decoration:none;font-weight:700;font-size:14px">Open Play Mode &rarr;</a>
</div>
