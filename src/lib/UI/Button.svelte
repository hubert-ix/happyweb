<script>
	let {
		clicked = undefined,
		href = undefined,
		disabled = false,
		class: className = '',
		children,
		...rest
	} = $props();
</script>


{#if href}
	<a {href} class="button {className}" class:disabled	onclick={(e) => { if (disabled) return e.preventDefault(); clicked?.(e);}}>
		{@render children?.()}
	</a>
{:else}
	<button {disabled} class="button {className}" onclick={clicked} {...rest}>
		{@render children?.()}
	</button>
{/if}


<style>
	
</style>