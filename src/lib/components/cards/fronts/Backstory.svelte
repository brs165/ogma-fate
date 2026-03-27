<script>
  import { Collapsible } from 'bits-ui';
  let { data = {}, campName = '', catColor = 'var(--fs-section)', cardState = {}, onUpdate = () => {} } = $props();

  let qs = $derived(Array.isArray(data.questions) ? data.questions : []);
  let answers = $derived(cardState?.answers || {});
  let openQ = $state(null); // which question has write-in open

  function saveAnswer(i, val) {
    onUpdate({ answers: { ...answers, [i]: val } });
  }
</script>

<div class="fs-section-gap">
  <div class="fs-section-hdr">SESSION ZERO QUESTIONS</div>
  {#each qs as q, i}
    <Collapsible.Root open={openQ === i} onOpenChange={(o) => { openQ = o ? i : null; }}>
      <div style="display:flex; gap:8px; align-items:flex-start; margin-bottom:4px">
        <span class="fs-skill-badge" style="min-width:22px; height:22px; border-radius:50%; font-size:11px; flex-shrink:0">{i+1}</span>
        <div style="flex:1; min-width:0">
          <div style="font-size:12px; color:var(--fs-text); line-height:1.45; margin-bottom:4px">{q}</div>
          <Collapsible.Trigger
            style="font-size:10px; font-weight:700; color:{answers[i] ? 'var(--fs-section)' : 'var(--fs-text-muted)'}; background:none; border:1px dashed {answers[i] ? 'var(--fs-section)' : 'var(--fs-border)'}; border-radius:3px; padding:2px 8px; cursor:pointer; letter-spacing:0.06em"
            aria-label="{openQ === i ? 'Close answer' : 'Write answer for question ' + (i+1)}"
          >{answers[i] ? '\u270F Edit answer' : '+ Write answer'}</Collapsible.Trigger>
          <Collapsible.Content>
            <textarea
              class="bs-answer-area"
              placeholder="Player's answer…"
              value={answers[i] || ''}
              onchange={(e) => saveAnswer(i, e.target.value)}
              aria-label="Answer for question {i+1}"
              rows="3"
            ></textarea>
            {#if answers[i]}
              <div style="font-size:11px; color:var(--fs-text-dim); font-style:italic; margin-top:2px; padding:0 2px">"{answers[i]}"</div>
            {/if}
          </Collapsible.Content>
        </div>
      </div>
    </Collapsible.Root>
  {/each}
</div>

{#if data.hook}
  <div class="fs-section-gap">
    <div class="fs-stunt" style="border-left:3px solid var(--fs-section); border-radius:0 3px 3px 0">
      <div class="fs-stunt-name">ADVENTURE HOOK</div>
      <div class="fs-stunt-desc" style="font-style:italic">{data.hook}</div>
    </div>
  </div>
{/if}

<div class="fs-stunt">
  <div class="fs-stunt-name">RELATIONSHIP WEB</div>
  <div class="fs-stunt-desc">{data.relationship || 'Each player names two PCs. What do you share? What secret?'}</div>
</div>
