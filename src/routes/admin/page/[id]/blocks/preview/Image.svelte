<script>
  let { data } = $props();
</script>


{#if data.url}
  <div class="preview">
    {data.url}
  </div>
{:else}
  <div class="empty">
    No image has been added yet
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