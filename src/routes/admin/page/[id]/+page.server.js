import { fail, redirect, error } from '@sveltejs/kit';
import { validatePage } from '../PageValidation.js';

export const load = async ({ locals, params }) => {
	const { data: page, error: err } = await locals.supabase.from('page').select().eq('id', params.id).maybeSingle();
	if (err && err.code !== '22P02') {
		console.error('Failed to load page:', err);
		error(500, 'Could not load this page.');
	}
	if (!page) {
    error(404, 'Page not found.');
  }
	return { page };
};

export const actions = {
	default: async ({ request, locals, params }) => {
		let data = await request.formData();
		let title = data.get('title');
		let path = data.get('path');
		let published = data.get('published');
		// validate the data
		let { values, errors } = validatePage({ title, path, published });
		if (errors) {
			return fail(400, { values, errors });
		}
		// update the page
		await locals.supabase.from('page').update(values).eq('id', params.id);
		// redirect
		redirect(303, '/admin');
	}
};