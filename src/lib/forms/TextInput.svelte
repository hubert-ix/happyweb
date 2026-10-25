<script>
	let {
		value = $bindable(''),
		controlType = "input",
		name,
		id = name,
		class: className = '',
		disabled = false,
		...rest
	} = $props();
</script>


{#if controlType == "input"}
	<input {id} {name} bind:value {disabled} class={className} {...rest} />
{:else}
	<textarea {id} {name} bind:value {disabled} class={className} {...rest}></textarea>
{/if}


<style>
	input, textarea {
		font: inherit;
		font-weight: 400;
		padding: 0.5em 0.75em;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
    width: 100%;
	}

	input.error, textarea.error {
		border-color: #dc2626;
	}
</style>