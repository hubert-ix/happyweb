import { fail, redirect } from '@sveltejs/kit';
import { validatePage } from '../pageValidation.js';
import { getPageOptions, checkParent, nextOrder } from '../parent.server.js';

export const load = async ({ locals }) => {
	return { pages: await getPageOptions(locals.supabase) };
};

export const actions = {
	default: async ({ request, locals }) => {
		let data = await request.formData();
		// get the form values
		let title = data.get('title');
		let path = data.get('path');
		let parent_id = data.get('parent_id');
		// validate the data
		let { values, errors } = validatePage({ title, path });
		if (errors) {
      return fail(400, { values, errors });
    }
		let { count } = await locals.supabase.from('page').select('*', { count: 'exact', head: true }).eq('parent_id', 0);
		values.display_order = count;
		// insert the new page
		let { data: page, error } = await locals.supabase.from('page').insert(values).select('id').maybeSingle();
		if (error) {
			// 23505 = unique_violation: the path is already taken
			if (error.code === '23505') {
				return fail(400, { values, errors: { path: 'A page with this address already exists.' } });
			}
			console.error('Failed to create page:', error);
			return fail(500, { values, errors: { form: 'Could not create the page. Please try again.' } });
		}
		// redirect
		redirect(303, '/admin/page/' + page.id);
	}
};