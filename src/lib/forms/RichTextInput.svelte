<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Check from '@lucide/svelte/icons/check';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Heading2 from '@lucide/svelte/icons/heading-2';
	import Heading3 from '@lucide/svelte/icons/heading-3';
	import List from '@lucide/svelte/icons/list';
	import ListOrdered from '@lucide/svelte/icons/list-ordered';
	import Link from '@lucide/svelte/icons/link';
  import MousePointerClick from '@lucide/svelte/icons/mouse-pointer-click';

	let {
		value = $bindable(''),
		name,
		id = name,
		class: className = '',
		disabled = false,
		onFinishedTyping = undefined,
		oninput,
		onblur
	} = $props();

	let el;
	let editor = null;
	let lastHtml = value; // what the editor last emitted, so we can tell outside changes apart
	let tick = $state(0); // bumped on every transaction so toolbar active states update
	let timer = null;
	let typingDelay = 800;
	let status = $state('idle'); // 'idle' | 'saved' | 'error'
	let statusTimer = null;
	let saveId = 0;

	onMount(() => {
		editor = new Editor({
			element: el,
			extensions: [StarterKit.configure({ link: { openOnClick: false } })],
			content: value || '',
			editable: !disabled,
			editorProps: { attributes: { id: id ?? '', class: className } },
			onUpdate: ({ editor }) => handleInput(editor),
			onBlur: ({ event }) => handleBlur(event),
			onTransaction: () => tick++
		});
	});

	// value changed from outside (e.g. a different record loaded) → push it into the editor
	$effect(() => {
		const v = value ?? '';
		if (editor && v !== lastHtml) {
			lastHtml = v;
			editor.commands.setContent(v, { emitUpdate: false });
		}
	});

	$effect(() => {
		editor?.setEditable(!disabled);
	});

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

	function handleInput(ed) {
		lastHtml = ed.isEmpty ? '' : ed.getHTML(); // empty editor gives '' rather than '<p></p>'
		value = lastHtml;
		oninput?.(value);
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
		editor?.destroy();
	});

	// toolbar helpers
	function isActive(type, attrs) {
		tick; // dependency so this re-runs after each transaction
		return editor?.isActive(type, attrs) ?? false;
	}

	function run(fn) {
		fn(editor.chain().focus()).run();
	}

	function setLink() {
		const previous = editor.getAttributes('link').href ?? '';
		const url = prompt('Link address', previous);
		if (url === null) return;
		if (url === '') run((c) => c.extendMarkRange('link').unsetLink());
		else run((c) => c.extendMarkRange('link').setLink({ href: url }));
	}

  function setButton() {
    if (isActive('link', { class: 'button' })) {
      run((c) => c.extendMarkRange('link').unsetLink());
      return;
    }
    const url = prompt('Button link address');
    if (!url) return;
    run((c) => c.extendMarkRange('link').setLink({ href: url, class: 'button' }));
  }
</script>


<div class="field" class:disabled>
	<div class="toolbar">
		<button type="button" data-tip="Bold" aria-label="Bold" {disabled} class:active={isActive('bold')} onclick={() => run((c) => c.toggleBold())}><Bold /></button>
		<button type="button" data-tip="Italic" aria-label="Italic" {disabled} class:active={isActive('italic')} onclick={() => run((c) => c.toggleItalic())}><Italic /></button>
		<span class="sep"></span>
		<button type="button" data-tip="Heading" aria-label="Heading" {disabled} class:active={isActive('heading', { level: 2 })} onclick={() => run((c) => c.toggleHeading({ level: 2 }))}><Heading2 /></button>
		<button type="button" data-tip="Subheading" aria-label="Subheading" {disabled} class:active={isActive('heading', { level: 3 })} onclick={() => run((c) => c.toggleHeading({ level: 3 }))}><Heading3 /></button>
		<span class="sep"></span>
		<button type="button" data-tip="Bullet list" aria-label="Bullet list" {disabled} class:active={isActive('bulletList')} onclick={() => run((c) => c.toggleBulletList())}><List /></button>
		<button type="button" data-tip="Numbered list" aria-label="Numbered list" {disabled} class:active={isActive('orderedList')} onclick={() => run((c) => c.toggleOrderedList())}><ListOrdered /></button>
		<button type="button" data-tip="Link" aria-label="Link" {disabled} class:active={isActive('link')} onclick={setLink}><Link /></button>
    <button type="button" data-tip="Button" aria-label="Button" {disabled} class:active={isActive('link', { class: 'button' })} onclick={setButton}><MousePointerClick /></button>
	</div>

	<div class="editor" bind:this={el}></div>

	{#if name}
		<input type="hidden" {name} {value} />
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
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		background: #fff;
	}

	.field:focus-within {
		border-color: #94a3b8;
	}

	.field.disabled {
		opacity: 0.6;
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 4px;
		border-bottom: 1px solid #e2e8f0;
	}

	.toolbar button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border: none;
		border-radius: 4px;
		background: none;
		color: #555;
		cursor: pointer;
	}

	.toolbar button :global(svg) {
		width: 16px;
		height: 16px;
	}

	.toolbar button:hover:not(:disabled) {
		background: #f1f5f9;
	}

	.toolbar button.active {
		background: #e2e8f0;
		color: #111;
	}

	.toolbar button:disabled {
		cursor: default;
	}

	.sep {
		width: 1px;
		height: 18px;
		margin: 0 4px;
		background: #e2e8f0;
	}

	.editor :global(.ProseMirror) {
		min-height: 8em;
		padding: 0.5em 2.5em 0.5em 0.75em; /* right padding leaves room for the status icon */
		color: #555;
		font: inherit;
		font-weight: 400;
		outline: none;
	}

	.editor :global(.ProseMirror > :first-child) {
		margin-top: 0;
	}

	.editor :global(.ProseMirror > :last-child) {
		margin-bottom: 0;
	}

	.editor :global(.ProseMirror a) {
		text-decoration: underline;
		cursor: text;
	}

	.status {
		position: absolute;
		right: 0.6rem;
		top: calc(38px + 0.6rem); /* just below the toolbar */
		display: flex;
		pointer-events: none;
	}

	.saved { color: #349500; }
	.error { color: var(--color-error); }

  .editor :global(a.button) {
    display: inline-block;
    padding: 0.4em 1em;
    border-radius: 6px;
    background: #2563eb;
    color: #fff;
    text-decoration: none;
  }
</style>