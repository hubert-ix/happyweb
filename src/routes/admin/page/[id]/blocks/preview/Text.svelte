<script>
  let { data } = $props();
</script>


{#if data.text}
  <div class="preview">
    {data.text}
  </div>
{/if}


<style>
  .preview {
    margin: 0;
    white-space: pre-line;
  }
</style>