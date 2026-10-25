<script>
	import PageForm from '../PageForm.svelte';

	let { data, form } = $props();
</script>


<h1>Edit “{data.page.title}”</h1>

{#key data.page.id}
	<PageForm {form} page={data.page} pages={data.pages} />
{/key}

