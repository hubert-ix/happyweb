<script>
	import { flip } from 'svelte/animate';
	import { deserialize } from '$app/forms';
	import { invalidate } from '$app/navigation';
  import { flatten, subtreeEnd, depthRange, renumber, changedRows } from './pageTree.js';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import File from '@lucide/svelte/icons/file';
	import Pencil from '@lucide/svelte/icons/pencil';

	let { pages } = $props();

	const INDENT = 32; // px per level, also the horizontal distance to change level
	const SCROLL_EDGE = 60; // px from the window edge where auto-scroll starts

	// Writable derived: follows `pages`, but we can overwrite it after a drop
	let items = $derived(renumber(flatten(pages)));

	// Drag state. Split in two so moving the pointer doesn't rebuild the list:
	// `drag` only changes when the drop position changes, `pointer` on every move.
	let drag = $state.raw(null);
	let pointer = $state.raw({ x: 0, y: 0 });
	let listEl;
	let raf = 0;
	let error = $state('');

	// What's rendered: during a drag, the dragged page and its children are
	// replaced by a single placeholder showing where they'll land
	let view = $derived.by(() => {
		if (!drag) return items;
		const placeholder = { ...drag.block[0], depth: drag.depth, placeholder: true };
		return [...drag.others.slice(0, drag.index), placeholder, ...drag.others.slice(drag.index)];
	});

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	function startDrag(e, id) {
		if (e.button !== 0) return;
		e.preventDefault();

		const index = items.findIndex((item) => item.id === id);
		const end = subtreeEnd(items, index);
		const row = e.currentTarget.closest('.page');
		const rect = row.getBoundingClientRect();
		const rows = listEl.children;

		drag = {
			block: items.slice(index, end),
			others: [...items.slice(0, index), ...items.slice(end)],
			index,
			depth: items[index].depth,
			startDepth: items[index].depth,
			startX: e.clientX,
			grabX: e.clientX - rect.left,
			grabY: e.clientY - rect.top,
			width: rect.width,
			// Distance between rows (offsetTop ignores running animations)
			stride: rows.length > 1 ? rows[1].offsetTop - rows[0].offsetTop : rect.height
		};
		pointer = { x: e.clientX, y: e.clientY };
		error = '';

		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', drop);
		window.addEventListener('pointercancel', cancel);
		window.addEventListener('keydown', onKey);
		document.body.classList.add('is-dragging');
		raf = requestAnimationFrame(autoScroll);
	}

	function onMove(e) {
		pointer = { x: e.clientX, y: e.clientY };
		project();
	}

	// Works out where the dragged page would land, from the pointer position
	function project() {
		const listTop = listEl.getBoundingClientRect().top;
		const top = pointer.y - drag.grabY - listTop;
		const index = clamp(Math.round(top / drag.stride), 0, drag.others.length);
		const { min, max } = depthRange(drag.others, index);
		const wanted = drag.startDepth + Math.round((pointer.x - drag.startX) / INDENT);
		const depth = clamp(wanted, min, max);
		if (index !== drag.index || depth !== drag.depth) {
			drag = { ...drag, index, depth };
		}
	}

	function autoScroll() {
		if (!drag) return;
		const bottom = window.innerHeight - SCROLL_EDGE;
		let dy = 0;
		if (pointer.y < SCROLL_EDGE) dy = -Math.ceil((SCROLL_EDGE - pointer.y) / 4);
		else if (pointer.y > bottom) dy = Math.ceil((pointer.y - bottom) / 4);
		if (dy) {
			window.scrollBy(0, dy);
			project();
		}
		raf = requestAnimationFrame(autoScroll);
	}

	function onKey(e) {
		if (e.key === 'Escape') cancel();
	}

	function stopDragging() {
		window.removeEventListener('pointermove', onMove);
		window.removeEventListener('pointerup', drop);
		window.removeEventListener('pointercancel', cancel);
		window.removeEventListener('keydown', onKey);
		document.body.classList.remove('is-dragging');
		cancelAnimationFrame(raf);
		drag = null;
	}

	function cancel() {
		stopDragging();
	}

	function drop() {
		const { block, others, index, depth, startDepth } = drag;
		const shift = depth - startDepth;
		const moved = block.map((item) => ({ ...item, depth: item.depth + shift }));
		const before = items;
		items = renumber([...others.slice(0, index), ...moved, ...others.slice(index)]);
		stopDragging();
		save(before, items);
	}

	async function save(before, after) {
		const changes = changedRows(before, after);
		if (!changes.length) return;
		const body = new FormData();
		body.set('changes', JSON.stringify(changes));
		try {
			const response = await fetch('?/reorder', {
				method: 'POST',
				body,
				headers: { accept: 'application/json', 'x-sveltekit-action': 'true' }
			});
			const result = deserialize(await response.text());
			if (result.type !== 'success') throw new Error();
			// Refresh the site header menu (see depends('app:menu') in the root layout)
			invalidate('app:menu');
		} 
    catch {
			items = before;
			error = "Couldn't save the new order. Please refresh the page and try again.";
		}
	}
</script>


{#if error}
	<p class="error" role="alert">{error}</p>
{/if}

<div class="tree" bind:this={listEl}>
	{#each view as item (item.id)}
		<div class="page"	class:placeholder={item.placeholder} style:margin-left="{item.depth * INDENT}px" animate:flip={{ duration: 150 }}>
      <div class="left">
        <button	type="button"	class="handle" aria-label="Drag to move {item.title}" onpointerdown={(e) => startDrag(e, item.id)}>
          <GripVertical size={16} />
        </button>
        <a href="/admin/page/{item.id}">{item.title}</a>
				{#if !item.published}
					<div class="status">
						Unpublished
					</div>
				{/if}
      </div>
			<a href="/admin/page/{item.id}"><Pencil size="16" /></a>
		</div>
	{/each}
</div>

{#if drag}
	<div class="page overlay"	style:width="{drag.width}px" style:transform="translate3d({pointer.x - drag.grabX}px, {pointer.y - drag.grabY}px, 0)">
		<span class="handle"><GripVertical size={16} /></span>
		<span>{drag.block[0].title}</span>
		{#if drag.block.length > 1}
			<span class="badge">+{drag.block.length - 1}</span>
		{/if}
	</div>
{/if}


<style>
  a {
    text-decoration: none;
    color: #000;
  }

	.page {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: solid 1px #ccc;
		padding: 0.75rem;
		margin-bottom: -1px;
		background: #fff;
		transition: margin-left 120ms ease;
	}

  .left {
    display: flex;
		align-items: center;
		gap: 0.5rem;
  }

	.handle {
		display: flex;
		padding: 0.25rem;
		border: 0;
		background: none;
		color: #000;
		cursor: grab;
		touch-action: none; /* lets touch screens drag instead of scrolling */
	}

	.handle:hover {
		color: #475569;
	}

	.placeholder {
		border-style: dashed;
		border-color: #2563eb;
		background: #eff6ff;
		position: relative;
		z-index: 1;
	}

	.placeholder > * {
		opacity: 0.4;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		pointer-events: none;
		box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
		will-change: transform;
	}

	.overlay .handle {
		cursor: grabbing;
	}

	.badge {
		margin-left: auto;
		padding: 0 0.5em;
		border-radius: 999px;
		background: #e2e8f0;
		font-size: 0.75rem;
	}

	.error {
		color: #dc2626;
	}

	:global(body.is-dragging) {
		cursor: grabbing;
		user-select: none;
	}

	.status {
		display: flex;
		align-items: center;
		padding: 0.25em 1em;
		border-radius: 999px;
		background: #f9d6ff;
		color: #5e0e92;
		font-size: 0.75rem;
		white-space: nowrap;
	}
</style>