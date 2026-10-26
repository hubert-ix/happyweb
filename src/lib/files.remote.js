import { command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

export const getUploadUrl = command('unchecked', async ({ folder, filename }) => {
	const { locals } = getRequestEvent();
	// letters, digits, dashes, underscores and slashes only: no "..", no leading slash
	const safeFolder = String(folder ?? '').replace(/[^a-z0-9/_-]/gi, '').replace(/^\/+|\/+$/g, '');
	if (!safeFolder || safeFolder.includes('..')) error(400, 'Invalid folder');
	// unique name, keep the original extension
	const ext = String(filename ?? '').split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
	const path = `${safeFolder}/${crypto.randomUUID()}.${ext}`;
	const storage = locals.supabase.storage.from('files');
	const { data, error: signError } = await storage.createSignedUploadUrl(path);
	if (signError) throw signError;
	const { data: { publicUrl } } = storage.getPublicUrl(path);
	return { signedUrl: data.signedUrl, publicUrl };
});