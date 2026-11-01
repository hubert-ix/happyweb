<script>
  let { data = $bindable() } = $props();
</script>


{#if data.url}
  <img src={data.url} alt={data.alt} />
{/if}

