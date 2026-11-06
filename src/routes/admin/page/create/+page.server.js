import { fail, redirect } from '@sveltejs/kit';
import { validatePage } from '../pageValidation.js';
import { getPageOptions, checkParent, nextOrder } from '../parent.server.js';
import { addSection } from '#lib/remote/sections.remote.js';
import { addPage } from '#lib/remote/pages.remote.js';

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
		let page;
		try {
			({ page } = await addPage(values));
		} 
		catch (e) {
			// 23505 = unique_violation: the path is already taken
			if (e.code === '23505') {
				return fail(400, { values, errors: { path: 'A page with this address already exists.' } });
			}
			console.error('Failed to create page:', e);
			return fail(500, { values, errors: { form: 'Could not create the page. Please try again.' } });
		}
		// insert a new section
		try {
			await addSection(page.id);
		} 
		catch (e) {
			console.error('Failed to create the first section:', e);
		}
		// redirect
		redirect(303, '/admin/page/' + page.id);
	}
};