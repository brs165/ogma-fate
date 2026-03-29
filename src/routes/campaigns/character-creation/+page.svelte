<script>
  import { onMount } from 'svelte';

  onMount(() => {
    // Redirect to the unified session zero wizard, preserving query params
    const params = new URLSearchParams(window.location.search);
    const target = '/campaigns/sessionzero' + (params.toString() ? '?' + params.toString() : '');
    window.location.replace(target);
  });
</script>

<svelte:head>
  <title>Redirecting to Session Zero — Ogma</title>
</svelte:head>

<div style="display:flex;align-items:center;justify-content:center;min-height:60vh;color:var(--text-muted);font-size:14px">
  Redirecting to Session Zero wizard&hellip;
</div>
