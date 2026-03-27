<svelte:options runes={false} />

<script>
  // Fonts loaded via svelte:head; theme.css loaded via app.html link tag
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300..900;1,300..900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="app-shell" data-theme="dark">
  <slot />
</div>
