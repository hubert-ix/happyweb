<script>
  import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Tabs from '#lib/UI/Tabs.svelte';

  let { children } = $props();
  let segment = $derived(page.url.pathname.split('/')[4] ?? null);
	let tabs = [
			{ label: 'Pages', path: '/admin', value: "" },
			{ label: 'Settings', path: '/admin/settings', value: "settings" }
		];
</script>


<div class="container">
  <!--<Tabs {tabs} {segment} />-->
  {@render children?.()}
</div>

