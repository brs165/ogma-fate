<script>
  let { label = '', color = 'var(--text-muted)' } = $props();
  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
</script>

<div style:font-size="10px"
     style:font-weight="800"
     style:letter-spacing="0.22em"
     style:color={color}
     style:font-family={CV4_MONO}
     style:text-transform="uppercase"
     style:margin-bottom="4px"
     style:line-height="1">
  {label}
</div>
