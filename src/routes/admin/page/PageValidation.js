import { slugify } from '#lib/slugify.js';

export function validatePage({ title = '', path = '', published = false, meta_title = '', meta_description = '', in_menu = true }) {
	let errors = {};
	if (!title) {
		errors.title = 'Please enter a title.';
	}
	if (!path) {
		errors.path = 'The path needs at least one letter or number.';
	}
	return { values: { title, path, published, meta_title, meta_description, in_menu }, errors: Object.keys(errors).length ? errors : null };
}