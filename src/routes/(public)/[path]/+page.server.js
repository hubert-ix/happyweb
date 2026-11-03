import { error, redirect } from '@sveltejs/kit';
import { getPage } from '#lib/remote/pages.remote.js';

export const load = async ({ params }) => {
	const { page } = await getPage({ path: params.path });
	if (!page) {
    error(404, 'Page not found.');
  }
	if (page.is_home) {
    redirect(301, '/');
  }
	return {
		page,
		pageTitle: page.meta_title?.trim() || page.title,
		topPageId: page.top_parent_id
	};
};