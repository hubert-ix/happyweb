<script>
	import { page } from '$app/state';
	import Settings from '@lucide/svelte/icons/settings';
  import '#lib/styles/public.css';

	let { data, children } = $props();
</script>


<div class="public">

  <header>
    <div class="container header">
      <nav>
				{#if data.settings?.logo_url}
					<a href="/" class="logo"><img src={data.settings.logo_url} /></a>
				{/if}
        {#each data.pages as link (link.id)}
          <a href={link.is_home ? '/' : `/${link.path}`} class:selected={link.id === page.data.topPageId}>{link.title}</a>
        {/each}
      </nav>
      {#if data.user}
        <div class="user">
          Hello, {data.user.first_name}
          <a href="/admin" data-tip="Go to site admin" data-tip-direction="below">
            <Settings />
          </a>
        </div>
      {/if}
    </div>	
  </header>

  <main>
    {@render children()}
  </main>

</div>


<style>
	header {
		padding: 1rem 0;
		border-bottom: solid 2px #eee;
		background: #fff;
		position: fixed;
		top: 0;
		display: block;
		width: 100%;
		z-index: 10;
	}

	.container.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	nav a {
		text-decoration: none;
		border-bottom: solid 2px transparent;
	}

	nav a.selected {
		border-color: #000;
	}

	a.logo {
		display: flex;
		margin-block: -1rem;   /* same as the header's vertical padding */
		border-bottom: none;
	}

	a.logo img {
		display: block;
		height: 3rem;
		width: auto;
	}

	.user {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user a {
		display: flex;
	}
</style>