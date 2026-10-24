import { slugify } from '#lib/slugify.js';

export function validatePage({ title = '', path = '' }) {
	let errors = {};
	if (!title) {
		errors.title = 'Please enter a title.';
	}
	if (!path) {
		errors.path = 'The path needs at least one letter or number.';
	}
	return { values: { title, path }, errors: Object.keys(errors).length ? errors : null };
}