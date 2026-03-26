<script>
  import CvLabel from '../CvLabel.svelte';
  import ClockTrack from '../ClockTrack.svelte';
  let { data = {}, campName = '', catColor = 'var(--accent)', cardState = {}, onUpdate = () => {} } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
  const CV4_SANS = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";

  let boxes = $derived(data.boxes || 4);
  let filled = $derived(cardState?.cdFilled ?? 0);

  function setFilled(n) { onUpdate({ cdFilled: n }); }
</script>

<div style="flex:1; padding:12px 16px 14px; display:flex; gap:14px">
  <!-- Left column -->
  <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-width:0">
    <div style="font-size:15px; font-weight:800; color:var(--text); font-family:{CV4_MONO}; line-height:1.1">{data.name || ''}</div>

    <div>
      <CvLabel label="TRIGGER" color={catColor} />
      <p style="margin:0; font-size:11px; color:var(--text-dim); font-family:{CV4_SANS}; line-height:1.4">{data.trigger || ''}</p>
    </div>

    <div style="padding:7px 10px; background:color-mix(in srgb,var(--c-red,#f87171) 8%,var(--cv-card-dark,var(--panel))); border:1px solid var(--c-red,#f87171)33; border-left:3px solid var(--c-red,#f87171); border-radius:0 2px 2px 0">
      <CvLabel label="OUTCOME WHEN FULL" color="var(--c-red,#f87171)" />
      <p style="margin:0; font-size:11px; font-weight:600; color:var(--c-red,#f87171); font-family:{CV4_SANS}; line-height:1.35">{data.outcome || ''}</p>
    </div>
  </div>

  <!-- Right column -->
  <div style="width:160px; flex-shrink:0; display:flex; flex-direction:column; gap:8px">
    <ClockTrack {boxes} {filled} {setFilled} color={catColor} />

    <div style="padding:7px 10px; background:var(--inset); border:1px solid var(--cv-card-bdr,var(--border)); border-radius:2px">
      <CvLabel label="UNIT" color={catColor} />
      <div style="font-size:13px; font-weight:700; color:var(--text); text-transform:capitalize; font-family:{CV4_MONO}">{data.unit || ''}</div>
    </div>
  </div>
</div>
