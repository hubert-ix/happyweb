<script>
	let {
		value = $bindable(''),
		name,
		id = name,
		class: className = '',
		disabled = false,
		...rest
	} = $props();
</script>


<input {id} {name} bind:value {disabled} class={className} {...rest} />


<style>
	input {
		font: inherit;
		font-weight: 400;
		padding: 0.5em 0.75em;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
    width: 100%;
	}

	input.error {
		border-color: #dc2626;
	}
</style>