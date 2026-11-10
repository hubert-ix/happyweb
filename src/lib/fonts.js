// Google Fonts for the public site.
// The admin can type any Google Font name; this list is only used for suggestions,
// for fixing the capitals ("lato" -> "Lato") and for the fallback font while it loads.

export const DEFAULT_BODY_FONT = 'Open Sans';
export const DEFAULT_HEADING_FONT = 'Playfair Display';

export const FONT_SUGGESTIONS = [
	// sans-serif
	{ family: 'Open Sans', category: 'sans-serif' },
	{ family: 'Roboto', category: 'sans-serif' },
	{ family: 'Lato', category: 'sans-serif' },
	{ family: 'Montserrat', category: 'sans-serif' },
	{ family: 'Poppins', category: 'sans-serif' },
	{ family: 'Inter', category: 'sans-serif' },
	{ family: 'Raleway', category: 'sans-serif' },
	{ family: 'Nunito', category: 'sans-serif' },
	{ family: 'Source Sans 3', category: 'sans-serif' },
	{ family: 'Work Sans', category: 'sans-serif' },
	{ family: 'DM Sans', category: 'sans-serif' },
	{ family: 'Rubik', category: 'sans-serif' },
	{ family: 'Mulish', category: 'sans-serif' },
	{ family: 'Karla', category: 'sans-serif' },
	{ family: 'Fira Sans', category: 'sans-serif' },
	{ family: 'PT Sans', category: 'sans-serif' },
	{ family: 'Quicksand', category: 'sans-serif' },
	{ family: 'Josefin Sans', category: 'sans-serif' },
	{ family: 'Oswald', category: 'sans-serif' },
	{ family: 'Bebas Neue', category: 'sans-serif' },
	// serif
	{ family: 'Playfair Display', category: 'serif' },
	{ family: 'Merriweather', category: 'serif' },
	{ family: 'Lora', category: 'serif' },
	{ family: 'PT Serif', category: 'serif' },
	{ family: 'Libre Baskerville', category: 'serif' },
	{ family: 'EB Garamond', category: 'serif' },
	{ family: 'Cormorant Garamond', category: 'serif' },
	{ family: 'Crimson Text', category: 'serif' },
	{ family: 'Source Serif 4', category: 'serif' },
	{ family: 'DM Serif Display', category: 'serif' },
	{ family: 'Roboto Slab', category: 'serif' },
	{ family: 'Bitter', category: 'serif' },
	{ family: 'Abril Fatface', category: 'serif' },
	// handwriting
	{ family: 'Caveat', category: 'cursive' },
	{ family: 'Dancing Script', category: 'cursive' },
	{ family: 'Pacifico', category: 'cursive' },
	// monospace
	{ family: 'Roboto Mono', category: 'monospace' },
	{ family: 'Space Mono', category: 'monospace' }
];

// letters, numbers and spaces only: that covers every Google Font name, and keeps the value safe to put in CSS
const FAMILY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 ]{0,59}$/;

export function isValidFamily(family) {
	return FAMILY_PATTERN.test(family ?? '');
}

// tidy what the user typed: trim, collapse spaces, and use the proper capitals for fonts we know
export function normaliseFamily(family) {
	let clean = String(family ?? '').trim().replace(/\s+/g, ' ');
	let known = FONT_SUGGESTIONS.find((f) => f.family.toLowerCase() === clean.toLowerCase());
	return known ? known.family : clean;
}

// e.g. "'Lato', sans-serif"
export function fontStack(family, fallback = 'sans-serif') {
	let known = FONT_SUGGESTIONS.find((f) => f.family === family);
	return `'${family}', ${known?.category ?? fallback}`;
}

// e.g. "family=Open+Sans:wght@400;700"
export function familyParam(family, spec = '') {
	return 'family=' + family.replaceAll(' ', '+') + (spec ? ':' + spec : '');
}

export function googleFontsUrl(params) {
	return 'https://fonts.googleapis.com/css2?' + params.join('&') + '&display=swap';
}

export function isGoogleFontsUrl(url) {
	return typeof url === 'string' && url.startsWith('https://fonts.googleapis.com/css2?');
}
