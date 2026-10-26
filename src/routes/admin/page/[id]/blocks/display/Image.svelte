<script>
  let { data = $bindable() } = $props();
</script>


<img src={data.url} alt={data.alt} />

