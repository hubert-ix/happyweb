<script>
	import { flatten, subtreeEnd } from '../pageTree.js';

	let {
		pages = [],
		value = $bindable(0),
		excludeId = undefined, // the page being edited — it can't go under itself or its sub-pages
		name = 'parent_id',
		id = name,
		class: className = '',
		...rest
	} = $props();

	let options = $derived.by(() => {
		const list = flatten(pages);
		const index = list.findIndex((page) => page.id === excludeId);
		if (index === -1) return list;
		return [...list.slice(0, index), ...list.slice(subtreeEnd(list, index))];
	});

	// Non-breaking spaces, because normal spaces collapse inside <option>
	const indent = (depth) => ' '.repeat(depth * 4);
</script>


<select {id} {name} bind:value class={className} {...rest}>
	<option value={0}>None (top level)</option>
	{#each options as page (page.id)}
		<option value={page.id}>{indent(page.depth + 1)}{page.title}</option>
	{/each}
</select>


<style>
	select {
		font: inherit;
		font-weight: 400;
		padding: 0.5em 0.75em;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		background: #fff;
    width: 100%;
	}

	select.error {
		border-color: #dc2626;
	}
</style>