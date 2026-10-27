<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Tabs from '#lib/UI/Tabs.svelte';
	import Eye from '@lucide/svelte/icons/eye';

	let { data, children } = $props();
  let segment = $derived(page.url.pathname.split('/')[4] ?? null);
	let tabs = $derived.by(() => {
		const base = `/admin/page/${data.page.id}`;
		const returnURL = page.url.searchParams.get('returnURL');
		const query = returnURL ? `?returnURL=${encodeURIComponent(returnURL)}` : '';
		return [
			{ label: 'Awesome content', path: base, href: base + query, value: "" },
			{ label: 'Superb settings', path: `${base}/settings`, href: `${base}/settings${query}`, value: "settings" }
		];
	});
</script>


<h1>
	Edit “{data.page.title}”
	<button class="bare" data-tip="View this page" onclick={() => goto("/" + data.page.path)}>
		<Eye />
	</button>
</h1>

<Tabs {tabs} {segment} />

{@render children()}