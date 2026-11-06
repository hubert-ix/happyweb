<script>
  let { data } = $props();
</script>


{#if data.text}
  <div class="preview">
    {@html data.text}
  </div>
{:else}
  <div class="empty">
    Click the edit button to enter some text
  </div>
{/if}


<style>
  .preview {
    margin: 0;
    white-space: pre-line;
  }

  .empty {
    font-style: italic;
    opacity: 0.6;
  }
</style>