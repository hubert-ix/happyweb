import { fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	return {
		pages: locals.supabase.from('page').select().order('display_order').then(({ data }) => data ?? [])
	};
};


export const actions = {
	// Called by PageTree after a drag and drop, with only the rows that changed
	reorder: async ({ request, locals }) => {
		const changes = parseChanges(await request.formData());
		if (!changes?.length) return fail(400, { error: 'Invalid data.' });
		const error = await applyChanges(locals.supabase, changes);
		if (error) {
			console.error('Failed to reorder pages:', error);
			return fail(500, { error: 'Could not save the new order.' });
		}
		return { success: true };
	},

	// Called by PageTree's delete popup. The page's direct children are hidden
	// from the menu, and `changes` moves its sub-pages up a level and closes
	// the gap in its siblings' order.
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');
		const changes = parseChanges(formData);
		if (!id || !changes || changes.some((c) => String(c.id) === id)) {
			return fail(400, { error: 'Invalid data.' });
		}
		// Hide the direct children from the menu. Done here rather than trusting
		// the browser, and before the move, while they still point at this page
		const { error: hideError } = await locals.supabase.from('page').update({ in_menu: false }).eq('parent_id', id);
		if (hideError) {
			console.error('Failed to hide sub-pages from the menu:', hideError);
			return fail(500, { error: 'Could not delete the page.' });
		}
		// Move the sub-pages, so nothing is left pointing at the deleted page
		const moveError = await applyChanges(locals.supabase, changes);
		if (moveError) {
			console.error('Failed to move sub-pages:', moveError);
			return fail(500, { error: 'Could not delete the page.' });
		}
		const { data, error } = await locals.supabase.from('page').delete().eq('id', id).select('id');
		if (error || !data?.length) {
			// No row deleted: already gone, or RLS doesn't allow deleting
			console.error('Failed to delete page:', error ?? 'no row deleted');
			return fail(500, { error: 'Could not delete the page.' });
		}
		return { success: true };
	}
};


/** Parses the `changes` JSON sent by PageTree. Returns null if invalid. */
function parseChanges(formData) {
	let changes;
	try {
		changes = JSON.parse(String(formData.get('changes') ?? '[]'));
	} 
	catch {
		return null;
	}
	const valid =
		Array.isArray(changes) &&
		changes.every(
			(c) =>
				c?.id != null &&
				Number.isInteger(c.parent_id) &&
				c.parent_id >= 0 &&
				c.parent_id !== c.id &&
				Number.isInteger(c.display_order) &&
				c.display_order >= 0
		);
	return valid ? changes : null;
}

/** Saves new parent_id / display_order values. Returns the first error, if any. */
async function applyChanges(supabase, changes) {
	const results = await Promise.all(
		changes.map(({ id, parent_id, display_order }) =>
			supabase.from('page').update({ parent_id, display_order }).eq('id', id)
		)
	);
	return results.find((r) => r.error)?.error;
}