<script>
	import { page } from '$app/state';
  import '#lib/styles/common.css';

	let { data, children } = $props();
</script>


<svelte:head>
	<link rel="icon" href="/images/favicon.png" />
	<title>{page.data.pageTitle} | Happy Web</title>
</svelte:head>

{@render children()}
