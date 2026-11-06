<script>
  let { data = $bindable() } = $props();
</script>


{#if data.text}
  <div class="line"></div>
  <div class="quote">
    {@html data.text}
  </div>
  {#if data.author}
    <div class="author">
      {data.author}
    </div>
  {/if}
{/if}


<style>
  .line {
    width: 3rem;
    height: 2px;
    background: #608997;
  }

  .quote {
    font-size: 1.5rem;
    font-style: italic;
    color: #3b7285;
    padding: 1rem 0;
    line-height: 1.4;
  }

  .author {
    font-style: italic;
    font-weight: 600;
    position: relative;
    top: -1rem;
    color: #1a4b5c;
  }
</style>