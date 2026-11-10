import { familyParam, googleFontsUrl } from '#lib/fonts.js';

// Google Fonts returns an error if we ask for a weight or style a font doesn't have,
// so try the richest set first and fall back to simpler ones.
const SPECS = [
	'ital,wght@0,400;0,700;1,400;1,700', // regular, bold, and their italics
	'wght@400;700', // regular and bold
	'' // whatever the font has (some fonts only come in one weight)
];

// Returns the URL parameter that works for this family (e.g. "family=Lato:wght@400;700"),
// or null if Google Fonts doesn't know the font.
// Throws if Google Fonts can't be reached at all.
export async function resolveFamilyParam(family, fetch) {
	for (let spec of SPECS) {
		let param = familyParam(family, spec);
		let response = await fetch(googleFontsUrl([param]), { signal: AbortSignal.timeout(5000) });
		if (response.ok) return param;
		if (response.status !== 400) throw new Error(`Google Fonts returned ${response.status}`);
	}
	return null;
}
