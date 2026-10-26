<script>
  import { page } from '$app/state';

  let { data = $bindable() } = $props();
  let links = $derived(page.data.navPages ?? []);
</script>


{#if links.length}
  <nav>
    {#each links as link (link.id)}
      <a href="/{link.path}" class:parent={link.isParent}>{link.title}</a>
    {/each}
  </nav>
{/if}


<style>
  nav {
    display: grid;
    gap: 1rem;
  }

  nav a.parent {
    font-weight: 600;
  }
</style>