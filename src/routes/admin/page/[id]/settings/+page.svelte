<script>
	import { page } from '$app/state';
	import PageForm from '../../PageForm.svelte';

	let { data, form } = $props();
</script>


{#key data.page.id}
	<PageForm {form} page={data.page} pages={data.pages} />
{/key}

