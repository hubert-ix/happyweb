<script>
  import PageView from './PageView.svelte';

  let { data } = $props();
</script>


<PageView page={data.page} user={data.user} />
