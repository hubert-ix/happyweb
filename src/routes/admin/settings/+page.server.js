import { fail } from '@sveltejs/kit';
import { getSettings, updateSettings } from '#lib/remote/settings.remote.js';
import { deleteFile } from '#lib/remote/files.remote.js';

export const actions = {
	default: async ({ request }) => {
		let data = await request.formData();
		// get the form values
		let values = {
			site_name: String(data.get('site_name') ?? '').trim(),
			logo_url: data.get('logo_url') || null,
			favicon_url: data.get('favicon_url') || null
		};
		// validate the data
		if (!values.site_name) {
			return fail(400, { values, errors: { site_name: 'Please enter a website name.' } });
		}
		// remember the current files, to tidy up the ones being replaced
		let { settings: before } = await getSettings();
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