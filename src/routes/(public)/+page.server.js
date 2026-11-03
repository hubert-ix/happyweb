import { error } from '@sveltejs/kit';
import { getPage } from '#lib/remote/pages.remote.js';

export const load = async () => {
	const { page } = await getPage({ is_home: true });
	if (!page) error(404, 'No home page has been set');
	return {
		page,
		pageTitle: page.meta_title?.trim() || page.title,
		topPageId: page.top_parent_id
	};
};