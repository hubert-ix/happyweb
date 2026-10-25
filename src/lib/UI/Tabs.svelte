<script>
	let { tabs, segment } = $props();
</script>


<nav class="tabs margin-bottom-large">
	{#each tabs as tab (tab.label)}
		{@const selected = (tab.value || null) === segment}
		<a href={tab.href} class:selected>
			{tab.label}
		</a>
	{/each}
</nav>


<style>
	.tabs {
		display: flex;
		gap: 0.25rem;
		border-bottom: 1px solid #e2e8f0;
	}

	a {
		padding: 0.6rem 1rem;
		margin-bottom: -1px;
		border-bottom: 2px solid transparent;
		color: #555;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.15s, border-color 0.15s;
	}

	a:hover {
		color: #0f172a;
		border-bottom-color: #ccc;
	}

	a.selected {
		color: #ee82d3;
		border-bottom-color: #ee82d3;
	}

	a:focus-visible {
		outline: 2px solid #93c5fd;
		outline-offset: -2px;
		border-radius: 4px;
	}
</style>