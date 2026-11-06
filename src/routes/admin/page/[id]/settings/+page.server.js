import { fail, redirect, error } from '@sveltejs/kit';
import { validatePage } from '../../pageValidation.js';
import { getPageOptions, checkParent, nextOrder } from '../../parent.server.js';
import { updatePage } from '#lib/remote/pages.remote.js';

export const load = async ({ locals }) => {
	return { pages: await getPageOptions(locals.supabase) };
};

export const actions = {
  default: async ({ request, locals, params, url }) => {
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
		try {
			await updatePage({ id: params.id, values });
		} 
    catch (e) {
			if (e?.status) throw e; // SvelteKit errors (e.g. 401) pass through
			// 23505 = unique_violation: the path is already taken
			if (e.code === '23505') {
				return fail(400, { values, errors: { path: 'A page with this address already exists.' } });
			}
			console.error('Failed to update page:', e);
			return fail(500, { values, errors: { form: 'Could not save the page. Please try again.' } });
		}
    // redirect
    redirect(303, url.searchParams.get('returnURL') ?? '/admin');
  }
};