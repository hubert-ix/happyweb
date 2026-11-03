<script>
  import PageView from './[path]/PageView.svelte';

  let { data } = $props();
</script>


<PageView page={data.page} user={data.user} />
