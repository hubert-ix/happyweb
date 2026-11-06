<script>
	import Settings from '@lucide/svelte/icons/settings';

  let { pages, user, settings, topPageId } = $props();
</script>


<header>
  <div class="container header">
    <nav>
      {#if settings?.logo_url}
        <a href="/" class="logo"><img src={settings.logo_url} alt={settings.site_name} /></a>
      {/if}
      {#each pages as link (link.id)}
        <a href={link.is_home ? '/' : `/${link.path}`} class:selected={link.id === topPageId}>{link.title}</a>
      {/each}
    </nav>
    {#if user}
      <div class="user">
        Hello, {user.first_name}
        <a href="/admin" data-tip="Go to site admin" data-tip-direction="below">
          <Settings />
        </a>
      </div>
    {/if}
  </div>	
</header>


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