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
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
		padding: 0.75rem 1rem;
		border: 1px solid transparent;
		border-radius: 0.5rem;
		background: #119501;
		color: #fff;
		font: inherit;
		line-height: 1.2;
		text-decoration: none;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.button:hover {
		opacity: 0.8;
	}

	.button:disabled,
	.button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	.button.cancel {
		background: #999;
	}

	.button.delete {
		background: var(--color-error);
	}

	button.columns {
		background-color: #fff;
		border: 1px dashed #cbd5e1;
		width: 100%;
		color: #000;
	}

	button.bare {
		background: none;
		border: none;
		cursor: pointer;
		margin: 0;
		padding: 0;
		font-size: 1rem;
		color: inherit;
	}
</style>