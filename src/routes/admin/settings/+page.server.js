import { fail } from '@sveltejs/kit';
import { getSettings, updateSettings } from '#lib/remote/settings.remote.js';
import { deleteFile } from '#lib/remote/files.remote.js';
import { isValidFamily, normaliseFamily, googleFontsUrl } from '#lib/fonts.js';
import { resolveFamilyParam } from '#lib/server/googleFonts.js';

export const actions = {
	default: async ({ request, fetch }) => {
		let data = await request.formData();
		// get the form values
		let values = {
			site_name: String(data.get('site_name') ?? '').trim(),
			footer_text: String(data.get('footer_text') ?? '').trim(),
			logo_url: data.get('logo_url') || null,
			favicon_url: data.get('favicon_url') || null,
			// empty means "use the default font"
			font_body: normaliseFamily(data.get('font_body')) || null,
			font_heading: normaliseFamily(data.get('font_heading')) || null
		};
		// validate the data
		let errors = {};
		if (!values.site_name) errors.site_name = 'Please enter a website name.';
		if (values.font_body && !isValidFamily(values.font_body)) errors.font_body = 'A font name can only contain letters, numbers and spaces.';
		if (values.font_heading && !isValidFamily(values.font_heading)) errors.font_heading = 'A font name can only contain letters, numbers and spaces.';
		if (Object.keys(errors).length) {
			return fail(400, { values, errors });
		}
		// remember the current settings, to tidy up replaced files and to skip checking fonts that haven't changed
		let { settings: before } = await getSettings();
		// check the fonts exist on Google Fonts, and work out the stylesheet URL for them
		let fontsUnchanged = before && before.font_body === values.font_body && before.font_heading === values.font_heading;
		if (fontsUnchanged) {
			values.font_url = before.font_url ?? null;
		}
		else {
			let fields = ['font_body', 'font_heading'].filter((field) => values[field]);
			let params;
			try {
				params = await Promise.all(fields.map((field) => resolveFamilyParam(values[field], fetch)));
			}
			catch (e) {
				console.error('Failed to reach Google Fonts:', e);
				return fail(502, { values, errors: { form: 'Could not reach Google Fonts to check the fonts. Please try again.' } });
			}
			fields.forEach((field, i) => {
				if (!params[i]) errors[field] = `"${values[field]}" isn't on Google Fonts. Check the spelling and the capitals: it should match the name on fonts.google.com exactly.`;
			});
			if (Object.keys(errors).length) {
				return fail(400, { values, errors });
			}
			// one stylesheet for both fonts (no duplicate if they're the same font)
			let unique = [...new Set(params)];
			values.font_url = unique.length ? googleFontsUrl(unique) : null;
		}
		// save
		try {
			await updateSettings(values);
		}
		catch (e) {
			console.error('Failed to save settings:', e);
			return fail(500, { values, errors: { form: 'Could not save the settings. Please try again.' } });
		}
		// delete files that are no longer used
		let unused = [before?.logo_url, before?.favicon_url]
			.filter((url) => url && url !== values.logo_url && url !== values.favicon_url);
		let results = await Promise.allSettled(unused.map((url) => deleteFile(url)));
		for (let r of results) {
			if (r.status === 'rejected') console.error('Failed to remove old file:', r.reason);
		}
		return { values, saved: true };
	}
};
