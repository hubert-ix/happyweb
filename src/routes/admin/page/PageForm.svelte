<script>
	import { enhance } from '$app/forms';
	import { slugify } from '#lib/slugify.js';
	import { validatePage } from './pageValidation.js';
	import Button from '#lib/UI/Button.svelte';
	import FormItem from '#lib/forms/FormItem.svelte';
	import TextInput from '#lib/forms/TextInput.svelte';
	import Toggle from '#lib/UI/Toggle.svelte';
  import PageContent from './PageContent.svelte';

	let {
		form = undefined,
		page = undefined,
		submitLabel = 'Save',
		submittingLabel = 'Saving…'
	} = $props();
	
	let initial = form?.values ?? page ?? {};
	let title = $state(initial.title ?? '');
	let path = $state(initial.path ?? '');
	let published = $state(initial.published ?? false);

	let pathTouched = $state(Boolean(initial.path));
	let submitting = $state(false);
	let clientErrors = $state(null);
	let errors = $derived(clientErrors ?? form?.errors);

	function onTitleInput(e) {
		if (!pathTouched) {
      path = slugify(e.target.value);
    }
	}

	function onPathInput(e) {
		// Clearing the field hands control back to the title
		pathTouched = e.target.value !== '';
	}

	function onPathBlur() {
		path = slugify(path || title);
	}

	function handleSubmit({ cancel }) {
		clientErrors = validatePage({ title, path, published }).errors;
		if (clientErrors) return cancel();
		submitting = true;
		return async ({ update }) => {
			await update({ reset: false });
			submitting = false;
		};
	}
</script>


<form	method="POST"use:enhance={handleSubmit}>
	
	<FormItem label="Title" id="title" errorMessage={errors?.title}>
		<TextInput name="title" placeholder="A simple but eloquent title for the page"	bind:value={title} autocomplete="off"	class={errors?.title ? 'error' : ''} oninput={onTitleInput} />
	</FormItem>

	<FormItem label="Path" id="path" errorMessage={errors?.path}>
		<TextInput name="path" placeholder="Something like 'about-us', or 'news/a-cool-news'" bind:value={path} autocomplete="off" class={errors?.path ? 'error' : ''} oninput={onPathInput}	onblur={onPathBlur}	/>
	</FormItem>

	{#if page}
		<FormItem label="Published" id="published">
			<Toggle name="published" bind:checked={published} />
		</FormItem>
	{/if}

	<div class="flex margin-top-large">
		<Button type="submit" disabled={submitting}>
			{submitting ? submittingLabel : submitLabel}
		</Button>

		<a href="/admin">Nope, cancel that</a>
	</div>

  {#if form?.errors?.form}
		<div class="error">
      {form.errors.form}
    </div>
	{/if}

</form>


<style>
	form {
		max-width: 32rem;
	}

	.error {
		color: #dc2626;
	}
</style>