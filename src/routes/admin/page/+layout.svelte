<script>
  import '#lib/styles/admin.css';
  
  let { children } = $props();
</script>


<div class="container padding admin">
  {@render children?.()}
</div>

