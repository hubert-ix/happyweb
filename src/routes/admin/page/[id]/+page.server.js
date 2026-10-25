import { fail, redirect, error } from '@sveltejs/kit';
import { validatePage } from '../PageValidation.js';
import { getPageOptions, checkParent, nextOrder } from '../parent.server.js';

export const load = async ({ locals, params }) => {
	const [{ data: page, error: err }, pages] = await Promise.all([
		locals.supabase.from('page').select().eq('id', params.id).maybeSingle(),
		getPageOptions(locals.supabase)
	]);
	if (err && err.code !== '22P02') {
		console.error('Failed to load page:', err);
		error(500, 'Could not load this page.');
	}
	if (!page) {
    error(404, 'Page not found.');
  }
	return { page, pages };
};

export const actions = {
	default: async ({ request, locals, params }) => {
		let data = await request.formData();
		// get the form values
		let title = data.get('title');
		let path = data.get('path');
		let published = data.get('published');
		let parent_id = data.get('parent_id');
		let meta_title = data.get('meta_title');
		let meta_description = data.get('meta_description');
		let in_menu = data.get('in_menu');
		// validate the data
		let { values, errors } = validatePage({ title, path, published, meta_title, meta_description, in_menu });
		if (errors) {
			return fail(400, { values, errors });
		}
		// update the page
		await locals.supabase.from('page').update(values).eq('id', params.id);
		// redirect
		redirect(303, '/admin');
	}
};