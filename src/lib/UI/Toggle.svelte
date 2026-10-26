<script>
	/**
	 * An on/off switch. Under the hood it's a real checkbox, so it supports
	 * the keyboard (Space) and screen readers out of the box.
	 * Submits "true" or "false" under `name` via a hidden input.
	 */
	let {
		checked = $bindable(false),
		name,
		id = name,
		label = undefined,
		disabled = false,
		class: className = '',
		...rest
	} = $props();
</script>


<!-- A checkbox sends nothing when unchecked, so the hidden input carries the value -->
{#if name}
	<input type="hidden" {name} value={checked ? 'true' : 'false'} />
{/if}

<label class="toggle {className}" class:disabled>
	<input type="checkbox" role="switch" {id} bind:checked {disabled} {...rest} />
	<span class="track" aria-hidden="true"><span class="thumb"></span></span>
	{#if label}
		<span class="text">{label}</span>
	{/if}
</label>


<style>
	.toggle {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		user-select: none;
	}

	/* Visually hidden, but still focusable and announced by screen readers */
	input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
		margin: 0;
	}

	.track {
		position: relative;
		flex: none;
		width: 2.5rem;
		height: 1.5rem;
		border-radius: 999px;
		background: #cbd5e1;
		transition: background 0.15s;
	}

	.thumb {
		position: absolute;
		top: 0.1875rem;
		left: 0.1875rem;
		width: 1.125rem;
		height: 1.125rem;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
		transition: transform 0.15s;
	}

	input:checked + .track {
		background: #349500;
	}

	input:checked + .track .thumb {
		transform: translateX(1rem);
	}

	input:focus-visible + .track {
		outline: 2px solid #93c5fd;
		outline-offset: 2px;
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>