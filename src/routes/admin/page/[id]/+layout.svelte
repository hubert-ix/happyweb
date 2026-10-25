<script>
	import { page } from '$app/state';
	import Tabs from '#lib/UI/Tabs.svelte';

	let { data, children } = $props();
  let segment = $derived(page.url.pathname.split('/')[4] ?? null);
	let tabs = $derived.by(() => {
		const base = `/admin/page/${data.page.id}`;
		const returnURL = page.url.searchParams.get('returnURL');
		const query = returnURL ? `?returnURL=${encodeURIComponent(returnURL)}` : '';
		return [
			{ label: 'Content', path: base, href: base + query, value: "" },
			{ label: 'Settings', path: `${base}/settings`, href: `${base}/settings${query}`, value: "settings" }
		];
	});
</script>


<h1>Edit “{data.page.title}”</h1>

<Tabs {tabs} {segment} />

{@render children()}