<script>
	import { page as currentPage } from '$app/state';
	import { enhance } from '$app/forms';
	import { validatePage } from './pageValidation.js';
	import Button from '#lib/UI/Button.svelte';
	import FormItem from '#lib/forms/FormItem.svelte';
	import TextInput from '#lib/forms/TextInput.svelte';
	import Toggle from '#lib/UI/Toggle.svelte';
	import ParentSelect from './ParentSelect.svelte';
  import PageContent from './PageContent.svelte';

	let {
		form = undefined,
		page = undefined,
		pages = [],
		submitLabel = 'Save this page',
		submittingLabel = 'Saving…'
	} = $props();
	
	let initial = form?.values ?? page ?? {};
	let title = $state(initial.title ?? '');
	let path = $state(initial.path ?? '');
	let parentId = $state(initial.parent_id ?? 0);
	let metaTitle = $state(initial.meta_title ?? '');
	let metaDescription = $state(initial.meta_description ?? '');
	let published = $state(initial.published ?? false);
	let inMenu = $state(initial.in_menu ?? true);

	let pathTouched = $state(Boolean(initial.path));
	let submitting = $state(false);
	let clientErrors = $state(null);
	let errors = $derived(form?.errors ?? null);

	function slugify(text = '') {
  	return text.split('/').map(slugify).filter(Boolean).join('/');
  }

	function recheck(fields, values) {
		if (!errors) return;
		const fresh = validatePage({ title, path, published, ...values }).errors ?? {};
		const next = { ...errors };
		for (const field of fields) {
			if (next[field]) next[field] = fresh[field];
		}
		errors = next;
	}

	function onTitleInput(e) {
		const value = e.target.value;
		if (!pathTouched) {
      path = slugify(value);
    }
		recheck(pathTouched ? ['title'] : ['title', 'path'], { title: value, path });
	}

	function onPathInput(e) {
		pathTouched = e.target.value !== '';
		recheck(['path'], { path: e.target.value });
	}

	function onPathBlur() {
		path = slugify(path || title);
	}

	function handleSubmit({ cancel }) {
		const clientErrors = validatePage({ title, path, published }).errors;
		if (clientErrors) {
			errors = clientErrors;
			return cancel();
		}
		submitting = true;
		return async ({ update }) => {
			await update({ reset: false });
			submitting = false;
		};
	}
</script>


<form	method="POST" use:enhance={handleSubmit}>
	
	<FormItem label="Page title" id="title" errorMessage={errors?.title}>
		<TextInput name="title" placeholder="A simple but eloquent title for the page"	bind:value={title} autocomplete="off"	class={errors?.title ? 'error' : ''} oninput={onTitleInput} />
	</FormItem>

	<FormItem label="Page address" id="path" errorMessage={errors?.path}>
		<TextInput name="path" placeholder="Something like 'about-us', or 'a-cool-news'" bind:value={path} autocomplete="off" class={errors?.path ? 'error' : ''} oninput={onPathInput}	onblur={onPathBlur}	/>
	</FormItem>

	<!--
	<FormItem label="Select the parent of the page" id="parent_id">
		<ParentSelect {pages} bind:value={parentId} excludeId={page?.id} />
	</FormItem>
	-->

	{#if page}
		<FormItem label="Text in the top bar of the browser" id="meta_title">
			<TextInput name="meta_title" bind:value={metaTitle} autocomplete="off" />
		</FormItem>

		<FormItem label="Description" id="meta_description">
			<TextInput name="meta_description" controlType="textarea" placeholder="This is optional. It is used for search engines like Google. Let's type something that will describe your awesome page!"	bind:value={metaDescription} autocomplete="off" />
		</FormItem>

		<FormItem label="Show this page in the menu system" id="in_menu">
			<Toggle name="in_menu" bind:checked={inMenu} />
		</FormItem>

		<FormItem label="Published" id="published">
			<Toggle name="published" bind:checked={published} />
		</FormItem>
	{/if}

	<div class="flex margin-top-large">
		<Button type="submit" disabled={submitting}>
			{submitting ? submittingLabel : submitLabel}
		</Button>

		<a href={currentPage.url.searchParams.get('returnURL') ?? '/admin'}>Nope, cancel that</a>
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