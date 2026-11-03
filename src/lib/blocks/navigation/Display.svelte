<script>
  import { page } from '$app/state';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';

  let { data = $bindable() } = $props();
  let links = $derived(page.data.page.nav_pages ?? []);
  let currentId = $derived(page.data.page?.id);
</script>


{#if links.length}
  <nav>
    {#each links as link (link.id)}
      <a href="/{link.path}" class:parent={link.isParent} class:selected={link.id == currentId}>
        <!--
        {#if link.isParent}
          <ChevronLeft />
        {/if}
        -->
        {link.title}
      </a>
    {/each}
  </nav>
{/if}


<style>
  nav {
    display: grid;
    gap: 1rem;
    border: solid 1px #ddd;
    border-radius: 0.5rem;
    padding: 1.5rem;
    background-color: rgb(255 255 255 / 50%);
  }

  nav a {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    text-decoration: none;
    position: relative;
    padding-left: 1rem;
    border-left: solid 3px transparent;
  }

  nav a.selected {
    color: #2986c2;
    font-weight: 600;
    border-color: #2986c2;
  }

  nav a.parent {
    font-weight: 600;
  }

  nav a.parent.selected {
    color: #000;
  }
</style>