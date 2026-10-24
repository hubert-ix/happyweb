/**
 * Helpers for the drag-and-drop page tree.
 * The tree is handled as a flat list in display order, where each item
 * has a depth (0 = top level). Parent and order are derived from that.
 */

/** Turns rows from the database into a flat, depth-annotated list. */
export function flatten(pages) {
	const ids = new Set(pages.map((p) => p.id));
	const byParent = new Map();

	for (const page of pages) {
		// A page whose parent no longer exists is shown at the top level
		const parent = ids.has(page.parent_id) ? page.parent_id : 0;
		if (!byParent.has(parent)) byParent.set(parent, []);
		byParent.get(parent).push(page);
	}

	for (const siblings of byParent.values()) {
		siblings.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
	}

	const list = [];
	const visit = (parent, depth) => {
		for (const page of byParent.get(parent) ?? []) {
			list.push({ ...page, parent_id: parent, depth });
			visit(page.id, depth + 1);
		}
	};
	visit(0, 0);

	return list;
}

/** Index just past the last descendant of items[index]. */
export function subtreeEnd(items, index) {
	const depth = items[index].depth;
	let end = index + 1;
	while (end < items.length && items[end].depth > depth) end++;
	return end;
}

/**
 * Allowed depths when inserting at `index` in `others`:
 * at most one level deeper than the row above, and at least as deep as
 * the row below (so the row below keeps its parent).
 */
export function depthRange(others, index) {
	const prev = others[index - 1];
	const next = others[index];
	return {
		min: next ? next.depth : 0,
		max: prev ? prev.depth + 1 : 0
	};
}

/** Recomputes parent_id and display_order (0, 1, 2… per parent) from depths. */
export function renumber(list) {
	const parents = [];
	const counters = new Map();

	return list.map((item) => {
		const parent_id = item.depth === 0 ? 0 : parents[item.depth - 1];
		parents[item.depth] = item.id;
		parents.length = item.depth + 1;

		const display_order = counters.get(parent_id) ?? 0;
		counters.set(parent_id, display_order + 1);

		return { ...item, parent_id, display_order };
	});
}

/** Rows whose parent or order differ between two lists. */
export function changedRows(before, after) {
	const old = new Map(before.map((item) => [item.id, item]));
	return after
		.filter((item) => {
			const prev = old.get(item.id);
			return !prev || prev.parent_id !== item.parent_id || prev.display_order !== item.display_order;
		})
		.map(({ id, parent_id, display_order }) => ({ id, parent_id, display_order }));
}