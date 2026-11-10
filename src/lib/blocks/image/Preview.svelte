<script>
  let { data } = $props();
</script>


{#if data.url}
  <div class="preview">
    <img src={data.url} alt={data.alt} />
  </div>
{:else}
  <div class="empty">
    Click the edit button to choose an image
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
    font-size: 0.9rem;
  }
</style>