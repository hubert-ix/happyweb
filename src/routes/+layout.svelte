<script>
	import { page } from '$app/state';
	import FaceSlightlySmiling from '@lucide/svelte/icons/face-slightly-smiling';
  import './styles.css';

	let { data, children } = $props();
</script>


<svelte:head>
	<link rel="icon" href="/images/favicon.png" />
	<title>{page.data.pageTitle} | Happy Web</title>
</svelte:head>

<header>
	<div class="container header">
		<nav>
			{#each data.pages as page}
				<a href="/{page.path}">{page.title}</a>
			{/each}
		</nav>
		{#if data.user}
			<div class="user">
				Hello, {data.user.first_name}
				<a href="/admin">
					<FaceSlightlySmiling />
				</a>
			</div>
		{/if}
	</div>	
</header>

<div class="container">
	{@render children()}
</div>


<style>
	header {
		padding: 1rem 0;
		border-bottom: solid 2px #eee;
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

	.user {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.user a {
		color: #f6cb4e;
		display: flex;
	}
</style>