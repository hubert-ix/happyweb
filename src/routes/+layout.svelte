<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import FaceSlightlySmiling from '@lucide/svelte/icons/face-slightly-smiling';
	import Settings from '@lucide/svelte/icons/settings';
  import './styles.css';

	let { data, children } = $props();

	onMount(() => {
    function closeTip(e) {
      const el = e.target.closest?.('[data-tip]');
      if (!el) return;
      el.classList.add('tip-closed');
      el.addEventListener('pointerleave', () => el.classList.remove('tip-closed'), { once: true });
    }
    document.addEventListener('pointerdown', closeTip, true);
    return () => document.removeEventListener('pointerdown', closeTip, true);
  });
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
					<Settings />
				</a>
			</div>
		{/if}
	</div>	
</header>

{@render children()}


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
		gap: 1rem;
	}

	.user a {
		display: flex;
	}
</style>