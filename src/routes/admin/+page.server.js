import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	return {
		pages: locals.supabase.from('page').select().order('display_order').then(({ data }) => data ?? [])
	};
};

export const actions = {
	// Called by PageTree after a drag and drop, with only the rows that changed
	reorder: async ({ request, locals }) => {
		const formData = await request.formData();
		let changes;
		try {
			changes = JSON.parse(String(formData.get('changes') ?? '[]'));
		} 
		catch {
			return fail(400, { error: 'Invalid data.' });
		}
		const valid =
			Array.isArray(changes) &&
			changes.length > 0 &&
			changes.every(
				(c) =>
					c?.id != null &&
					Number.isInteger(c.parent_id) &&
					c.parent_id >= 0 &&
					c.parent_id !== c.id &&
					Number.isInteger(c.display_order) &&
					c.display_order >= 0
			);
		if (!valid) return fail(400, { error: 'Invalid data.' });
		const results = await Promise.all(
			changes.map(({ id, parent_id, display_order }) =>
				locals.supabase.from('page').update({ parent_id, display_order }).eq('id', id)
			)
		);
		const failed = results.find((r) => r.error);
		if (failed) {
			console.error('Failed to reorder pages:', failed.error);
			return fail(500, { error: 'Could not save the new order.' });
		}

		return { success: true };
	}
};