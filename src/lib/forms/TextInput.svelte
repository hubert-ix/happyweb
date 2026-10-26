<script>
	import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import Check from '@lucide/svelte/icons/check';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';

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
	let status = $state('idle'); // 'idle' | 'saved' | 'error'
  let statusTimer = null;
  let saveId = 0;

  async function finish() {
    clearTimeout(timer);
    timer = null;
    if (!onFinishedTyping) return;
    const id = ++saveId;
    try {
      await onFinishedTyping(value);
      if (id !== saveId) return; // a newer save has started, let it report
      showStatus('saved', 1500);
    } 
		catch (e) {
      if (id !== saveId) return;
      console.error(e);
      showStatus('error', 4000);
    }
  }

	function showStatus(s, duration) {
    clearTimeout(statusTimer);
    status = s;
    statusTimer = setTimeout(() => (status = 'idle'), duration);
  }

  function handleInput(e) {
    oninput?.(e);
    if (!onFinishedTyping) return;
    status = 'idle'; // hide the old tick as soon as they type again
    clearTimeout(timer);
    timer = setTimeout(finish, typingDelay);
  }

  function handleBlur(e) {
    onblur?.(e);
    if (timer) finish(); // save straight away if something is pending
  }

  onDestroy(() => {
    clearTimeout(statusTimer);
    if (timer) finish();
  });
</script>


<div class="field" class:textarea={controlType === 'textarea'}>
	{#if controlType == "input"}
		<input {id} {name} bind:value {disabled} class={className} oninput={handleInput} onblur={handleBlur} {...rest} />
	{:else}
		<textarea {id} {name} bind:value {disabled} class={className} oninput={handleInput} onblur={handleBlur} {...rest}></textarea>
	{/if}

	{#if status === 'saved'}
    <span class="status saved" transition:fade={{ duration: 200 }} title="Saved">
      <Check />
    </span>
  {:else if status === 'error'}
    <span class="status error" transition:fade={{ duration: 200 }} title="Could not save">
      <CircleAlert />
    </span>
  {/if}
</div>


<style>
	.field {
    position: relative;
  }

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

	.status {
    position: absolute;
    right: 0.6rem;
    top: 50%;
    translate: 0 -50%;
    display: flex;
    pointer-events: none;
  }

  /* textareas: pin to the top-right corner instead of centring */
  .field.textarea .status {
    top: 0.6rem;
    translate: none;
  }

  .saved { color: #349500; }
  .error { color: var(--color-error); }
</style>