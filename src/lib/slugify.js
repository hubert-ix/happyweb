export function slugify(text = '') {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // strip accents
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-') // anything else becomes a dash
		.replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
}