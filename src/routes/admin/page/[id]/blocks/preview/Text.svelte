<script>
  let { data } = $props();
</script>


{#if data.text}
  <div class="preview">
    {@html data.text}
  </div>
{:else}
  <div class="empty">
    No text has been entered yet
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