<script>
  export let text = '';
  export let color = 'var(--accent)';

  const CV4_MONO = "'Jost','Futura','Century Gothic','Trebuchet MS',sans-serif";
</script>

<span style:font-size="10px"
      style:font-weight="800"
      style:letter-spacing="0.12em"
      style:color={color}
      style:border="1.5px solid {color}66"
      style:border-radius="2px"
      style:padding="2px 6px"
      style:margin-right="4px"
      style:white-space="nowrap"
      style:display="inline-block"
      style:font-family={CV4_MONO}>
  {text}
</span>
