import { fail, redirect } from '@sveltejs/kit';
import { validatePage } from '../PageValidation.js';

export const actions = {
	default: async ({ request, locals }) => {
		let data = await request.formData();
		let title = data.get('title');
		let path = data.get('path');
		// validate the data
		let { values, errors } = validatePage({ title, path });
		if (errors) {
      return fail(400, { values, errors });
    }
		let { count } = await locals.supabase.from('page').select('*', { count: 'exact', head: true }).eq('parent_id', 0);
		values.display_order = count;
		// insert the new page
		await locals.supabase.from('page').insert(values);
		// redirect
		redirect(303, '/admin');
	}
};