<script>
	import PageForm from '../PageForm.svelte';

	let { form, data } = $props();
</script>


<h1>Create a new page</h1>

<PageForm {form} pages={data.pages} submitLabel="Create page" submittingLabel="Creating…" />