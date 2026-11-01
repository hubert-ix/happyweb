<script>
  let { data } = $props();
</script>


{#if data.url}
  <div class="preview">
    <img src={data.url} alt={data.alt} />
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

  .preview img {
    max-width: 100%;
  }

  .empty {
    font-style: italic;
    opacity: 0.6;
  }
</style>