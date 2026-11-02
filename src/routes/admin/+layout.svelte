<script>
  import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Tabs from '#lib/UI/Tabs.svelte';

  let { children } = $props();
  let segment = $derived(page.url.pathname.split('/')[2] ?? null);
	let tabs = [
		{ label: 'Your pages', href: '/admin', value: "" },
		{ label: 'Sumptuous settings', href: '/admin/settings', value: "settings" }
	];
</script>


<div class="container padding">
	<h1>Amazing admin dashboard</h1>
  <Tabs {tabs} {segment} />
  {@render children?.()}
</div>

