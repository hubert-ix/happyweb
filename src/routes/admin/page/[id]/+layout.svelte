<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Tabs from '#lib/UI/Tabs.svelte';
	import Eye from '@lucide/svelte/icons/eye';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	let { data, children } = $props();
  let segment = $derived(page.url.pathname.split('/')[4] ?? null);
	let tabs = $derived.by(() => {
		const base = `/admin/page/${data.page.id}`;
		const returnURL = page.url.searchParams.get('returnURL');
		const query = returnURL ? `?returnURL=${encodeURIComponent(returnURL)}` : '';
		return [
			{ label: 'Awesome page content', href: base + query, value: "" },
			{ label: 'Superb page settings', href: `${base}/settings${query}`, value: "settings" }
		];
	});
</script>


<div class="back">
	<a href="/admin">
		<ChevronLeft />
		Back to admin dashboard
	</a>
</div>

<div class="header flex">
	<h1>Edit '{data.page.title}'</h1>
	{#if !data.page.published}
		<div class="chip">
			Unpublished
		</div>
	{/if}
	<button class="bare" data-tip="View this page" onclick={() => goto("/" + data.page.path)}>
		<Eye />
	</button>
</div>

<Tabs {tabs} {segment} />

{@render children()}


<style>
	.back {
		/*
		position: absolute;
		top: 0;
		right: 2rem;
		*/
		position: relative;
		top: 2rem;
	}

	.back a {
		text-decoration: none;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: #6899be;
	}

	.chip {
		display: flex;
		align-items: center;
		padding: 0.25em 1em;
		border-radius: 999px;
		background: #f9d6ff;
		color: #5e0e92;
		font-size: 0.75rem;
		white-space: nowrap;
	}
</style>