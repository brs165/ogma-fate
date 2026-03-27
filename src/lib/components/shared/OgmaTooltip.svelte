<script>
  // OgmaTooltip — thin wrapper around Bits Tooltip with Ogma styling
  // Replaces raw title= attributes across board components.
  // Usage: <OgmaTooltip tip="Invoke aspect (+2)"><button>...</button></OgmaTooltip>
  import { Tooltip } from 'bits-ui';
  let { tip = '', delay = 600, children } = $props();
</script>

{#if tip}
  <Tooltip.Root openDelay={delay} closeDelay={100}>
    <Tooltip.Trigger asChild>
      {@render children?.()}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content sideOffset={8}>
        <Tooltip.Arrow />
        {tip}
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
{:else}
  {@render children?.()}
{/if}
