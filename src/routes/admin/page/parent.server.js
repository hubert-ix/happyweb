/** All pages, for the parent dropdown. */
export async function getPageOptions(supabase) {
	const { data, error } = await supabase.from('page').select('id, title, parent_id, display_order').order('display_order');
	if (error) {
		console.error('Failed to load pages for the parent dropdown:', error);
		return [];
	}
	return data ?? [];
}

/**
 * Checks that `parentId` is a valid parent for page `pageId`
 * (pageId is undefined when creating). Returns an error message, or null if fine.
 */
export async function checkParent(supabase, parentId, pageId) {
	if (!Number.isInteger(parentId) || parentId < 0) return 'Please choose a valid parent page.';
	if (parentId === 0) return null;
	if (parentId === pageId) return "A page can't be its own parent.";
	const { data: pages, error } = await supabase.from('page').select('id, parent_id');
	if (error) throw error;
	const parentOf = new Map(pages.map((p) => [p.id, p.parent_id]));
	if (!parentOf.has(parentId)) return 'The selected parent page no longer exists.';
	// Walk up from the new parent: reaching this page means it would end up
	// inside its own sub-pages (a loop)
	if (pageId !== undefined) {
		let current = parentId;
		for (let steps = 0; current && steps <= pages.length; steps++) {
			if (current === pageId) return "A page can't be placed under one of its own sub-pages.";
			current = parentOf.get(current);
		}
	}
	return null;
}

/** display_order that puts a page last among the children of `parentId`. */
export async function nextOrder(supabase, parentId) {
	const { data, error } = await supabase.from('page').select('display_order').eq('parent_id', parentId).order('display_order', { ascending: false }).limit(1).maybeSingle();
	if (error) throw error;
	return (data?.display_order ?? -1) + 1;
}