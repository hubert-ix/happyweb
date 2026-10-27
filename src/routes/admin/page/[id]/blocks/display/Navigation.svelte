<script>
  import { page } from '$app/state';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';

  let { data = $bindable() } = $props();
  let links = $derived(page.data.navPages ?? []);
  let currentId = $derived(page.data.page?.id);
</script>


{#if links.length}
  <nav>
    {#each links as link (link.id)}
      <a href="/{link.path}" class:parent={link.isParent} class:selected={link.id == currentId}>
        {#if link.isParent}
          <ChevronLeft />
        {/if}
        {link.title}
      </a>
    {/each}
  </nav>
{/if}


<style>
  nav {
    display: grid;
    gap: 1rem;
  }

  nav a {
    display: flex;
    align-items: flex;
    gap: 0.25rem;
    text-decoration: none;
    padding-left: 1rem;
  }

  nav a.selected {
    color: #2986c2;
    font-weight: 600;
  }

  nav a.parent {
    font-weight: 600;
    border-bottom: solid 1px #ccc;
    border-left: none;
    padding-left: 0;
    padding-bottom: 0.5rem;
  }
</style>