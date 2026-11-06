<script>
	import { page } from '$app/state';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
  import '#lib/styles/public.css';

	let { data, children } = $props();
</script>


<div class="public">

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