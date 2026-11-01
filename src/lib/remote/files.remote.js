import { command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

const PUBLIC_PREFIX = '/storage/v1/object/public/files/';


export const getUploadUrl = command('unchecked', async ({ folder, filename }) => {
	const { locals } = getRequestEvent();
	const safeFolder = String(folder ?? '').replace(/[^a-z0-9/_-]/gi, '').replace(/^\/+|\/+$/g, '');
	if (!safeFolder || safeFolder.includes('..')) error(400, 'Invalid folder');
	// split "photo.final.jpg" into "photo.final" and "jpg"
	const original = String(filename ?? '');
	const dot = original.lastIndexOf('.');
	const base = dot > 0 ? original.slice(0, dot) : original;
	const ext = dot > 0 ? original.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
	const path = `${safeFolder}/${slugify(base)}-${crypto.randomUUID()}${ext ? `.${ext}` : ''}`;
	const storage = locals.supabase.storage.from('files');
	const { data, error: signError } = await storage.createSignedUploadUrl(path);
	if (signError) throw signError;
	const { data: { publicUrl } } = storage.getPublicUrl(path);
	return { signedUrl: data.signedUrl, publicUrl };
});


export const deleteFile = command('unchecked', async (publicUrl) => {
	const { locals } = getRequestEvent();
	// only accept URLs pointing into our own "files" bucket
	let path;
	try {
		const { pathname } = new URL(publicUrl);
		if (!pathname.startsWith(PUBLIC_PREFIX)) throw new Error();
		path = decodeURIComponent(pathname.slice(PUBLIC_PREFIX.length));
	} catch {
		error(400, 'Invalid file URL');
	}
	if (!path || path.includes('..')) error(400, 'Invalid file URL');
	const { data, error: removeError } = await locals.supabase.storage.from('files').remove([path]);
	if (removeError) throw removeError;
	if (!data?.length) {
		throw new Error(`Nothing deleted for "${path}": check the storage policies for the files bucket`);
	}
	return {};
});


function slugify(name) {
	return name
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')   // strip accents
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')       // anything else becomes a dash
		.replace(/^-+|-+$/g, '')
		.slice(0, 60) || 'file';
}