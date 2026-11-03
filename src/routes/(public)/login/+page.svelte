<script>
	import { enhance } from '$app/forms';
	import Button from '#lib/UI/Button.svelte';
	import FormItem from '#lib/forms/FormItem.svelte';
	import TextInput from '#lib/forms/TextInput.svelte';

	let { form } = $props();
	let submitting = $state(false);

	function handleSubmit() {
		submitting = true;
		return async ({ update }) => {
			await update();
			submitting = false;
		};
	}
</script>

<main>
	<h1>Log in</h1>

	<form method="POST" use:enhance={handleSubmit}>
		<FormItem label="Email" id="email">
			<TextInput
				name="email"
				type="email"
				value={form?.email ?? ''}
				autocomplete="email"
				required
			/>
		</FormItem>

		<FormItem label="Password" id="password">
			<TextInput name="password" type="password" autocomplete="current-password" required />
		</FormItem>

		{#if form?.error}
			<p class="error" role="alert">{form.error}</p>
		{/if}

		<Button type="submit" disabled={submitting}>
			{submitting ? 'Logging in…' : 'Log in'}
		</Button>
	</form>
</main>

<style>
	main {
		max-width: 24rem;
		margin: 4rem auto;
		padding: 0 1rem;
	}

	.error {
		color: #dc2626;
	}
</style>