<svelte:options runes={false} />

<script>
  import { page } from '$app/stores';
  import Campaign from '$lib/components/campaign/Campaign.svelte';

  $: world = $page.params.world;
</script>

<Campaign campId={world} />
