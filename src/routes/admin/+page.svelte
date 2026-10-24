<script>
  import CirclePlus from '@lucide/svelte/icons/circle-plus';
  import Info from '@lucide/svelte/icons/info';
  import Button from '#lib/UI/Button.svelte';
  import PageTree from './PageTree.svelte';

  let { data } = $props();
</script>


<h1>Amazing admin dashboard</h1>

<div class="help margin-bottom-medium">
  <div class="icon">
    <Info />
  </div>
  These are all the pages on your site.<br />
  You can edit or delete them, and also create a new page.<br />
  You can also change their order by clicking on a page's handle and moving it around.
</div>

<div class="margin-bottom-large">
  <Button href="/admin/page/create">
    <CirclePlus />
    Create a new awesome page
  </Button>
</div>

<div class="pages">
  {#await data.pages then pages}
    <PageTree {pages} />
  {/await}
</div>


<style>
  .pages {
    max-width: 50rem;
  }
</style>
