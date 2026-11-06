<script>
  let { data } = $props();
</script>


{#if data.text}
  <div class="preview">
    {@html data.text}
  </div>
  {#if data.author}
    <div class="author">
      {@html data.author}
    </div>
  {/if}
{:else}
  <div class="empty">
    Click the edit button to start entering a great quote
  </div>
{/if}


<style>
  .preview {
    margin: 0;
    white-space: pre-line;
    font-style: italic;
  }

  .author {
  }

  .empty {
    font-style: italic;
    opacity: 0.6;
  }
</style>