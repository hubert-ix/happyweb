<script>
  let { settings } = $props();
</script>


{#if settings?.footer_text}
  <footer>
    <div class="container">
      {settings.footer_text}
    </div>
  </footer>
{/if}


<style>
  footer {
    background: #f2f2f2;
    border-top: solid 1px #eee;
    padding: 1rem 0;
    font-size: 0.9rem;
  }
</style>