<script>
  import { goto } from '$app/navigation';
  import Pencil from '@lucide/svelte/icons/pencil';

  let { data } = $props();
</script>


<h1>
  {data.page.title}
  {#if data.user}
    <button class="edit-page" onclick={() => goto('/admin/page/' + data.page?.id)}>
      <Pencil />
    </button>
  {/if}
</h1>