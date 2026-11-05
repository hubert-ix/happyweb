<script>
	import { page } from '$app/state';
	import Snackbar from '#lib/UI/Snackbar.svelte';
  import '#lib/styles/common.css';

	let { data, children } = $props();
</script>


<svelte:head>
	<link rel="icon" href={data.settings?.favicon ?? "/images/favicon.svg"} />
	<title>{page.data.pageTitle} | {data.settings?.site_name}</title>
</svelte:head>

{@render children()}
<Snackbar />
