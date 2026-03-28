<script>
  // OgmaTooltip — thin wrapper around Bits Tooltip with Ogma styling
  // Desktop: hover to show. Mobile: long-press (~400ms) to show.
  import { Tooltip } from 'bits-ui';
  let { tip = '', delay = 600, children } = $props();

  let forceOpen = $state(false);
  let pressTimer = $state(null);

  function onPointerDown(e) {
    if (e.pointerType !== 'touch') return;
    pressTimer = setTimeout(() => { forceOpen = true; pressTimer = null; }, 400);
  }
  function onPointerUp(e) {
    if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
  }
  function onPointerCancel(e) {
    if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
  }
  function dismiss() { forceOpen = false; }
</script>

{#if tip}
  <Tooltip.Root openDelay={delay} closeDelay={100} open={forceOpen || undefined}
    onOpenChange={(o) => { if (!o) forceOpen = false; }}>
    <Tooltip.Trigger asChild
      style="appearance:none;background:none;border:none;padding:0;display:contents"
      onpointerdown={onPointerDown}
      onpointerup={onPointerUp}
      onpointercancel={onPointerCancel}>
      {@render children?.()}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content sideOffset={8} onpointerdown={dismiss}>
        <Tooltip.Arrow />
        {tip}
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
{:else}
  {@render children?.()}
{/if}
