<script>
	import { onDestroy } from 'svelte';

	let {
		value = $bindable(''),
		controlType = "input",
		name,
		id = name,
		class: className = '',
		disabled = false,
		onFinishedTyping = undefined,
		oninput,
    onblur,
		...rest
	} = $props();

	let timer = null;
	let typingDelay = 800;

  function finish() {
    clearTimeout(timer);
    timer = null;
    onFinishedTyping?.(value);
  }

  function handleInput(e) {
    oninput?.(e);
    if (!onFinishedTyping) return;
    clearTimeout(timer);
    timer = setTimeout(finish, typingDelay);
  }

  function handleBlur(e) {
    onblur?.(e);
    if (timer) finish(); // save straight away if something is pending
  }

  // unmounting (navigation, section deleted): don't drop a pending call
  onDestroy(() => {
    if (timer) finish();
  });
</script>


{#if controlType == "input"}
	<input {id} {name} bind:value {disabled} class={className} oninput={handleInput} onblur={handleBlur} {...rest} />
{:else}
	<textarea {id} {name} bind:value {disabled} class={className} oninput={handleInput} onblur={handleBlur} {...rest}></textarea>
{/if}


<style>
	input, textarea {
		font: inherit;
		font-weight: 400;
		padding: 0.5em 0.75em;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
    width: 100%;
		color: #555;
	}

	input::placeholder, textarea::placeholder {
		color: #999;
	}

	input.error, textarea.error {
		border-color: #dc2626;
	}
</style>