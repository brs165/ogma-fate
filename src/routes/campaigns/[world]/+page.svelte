<script>
  import { page } from '$app/stores';
  import Campaign from '$lib/components/campaign/Campaign.svelte';

  let world = $derived($page.params.world);
</script>

<Campaign campId={world} />
