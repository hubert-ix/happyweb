<script>
	import { page } from '$app/state';
  import { fontStack, isGoogleFontsUrl, isValidFamily } from '#lib/fonts.js';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
  import '#lib/styles/public.css';

	let { data, children } = $props();

	// the fonts chosen in the site settings (empty means the defaults in public.css)
	let fontUrl = $derived(isGoogleFontsUrl(data.settings?.font_url) ? data.settings.font_url : null);
	let fontBody = $derived(isValidFamily(data.settings?.font_body) ? fontStack(data.settings.font_body, 'sans-serif') : undefined);
	let fontHeading = $derived(isValidFamily(data.settings?.font_heading) ? fontStack(data.settings.font_heading, 'serif') : undefined);
</script>


<svelte:head>
	{#if fontUrl}
		<link rel="stylesheet" href={fontUrl} />
	{/if}
</svelte:head>

<div class="public" style:--font-body={fontBody} style:--font-heading={fontHeading}>

  <Header pages={data.pages} user={data.user} settings={data.settings} topPageId={page.data.topPageId} />

  <main>
    {@render children()}
  </main>

	<Footer settings={data.settings} />

</div>


<style>
  .public {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  main {
    flex: 1;
  }
</style>
