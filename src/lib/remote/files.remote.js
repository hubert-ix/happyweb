import { command, query, getRequestEvent } from '$app/server';
import { requireUser } from '#lib/server/auth.js';
import { error } from '@sveltejs/kit';

const PUBLIC_PREFIX = '/storage/v1/object/public/files/';
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg)$/i;


export const getUploadUrl = command('unchecked', async ({ folder, filename }) => {
	const { locals } = getRequestEvent();
	const safeFolder = cleanFolder(folder);
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


// every image in files/[folder], newest first
export const listImages = query('unchecked', async (folder) => {
	const locals = await requireUser();
	const safeFolder = cleanFolder(folder);
	const storage = locals.supabase.storage.from('files');
	const { data, error: listError } = await storage.list(safeFolder, {
		limit: 1000,
		sortBy: { column: 'created_at', order: 'desc' }
	});
	if (listError) throw listError;
	return (data ?? [])
		// sub-folders come back with a null id; skip them and Supabase's placeholder file
		.filter((item) => item.id && item.name !== '.emptyFolderPlaceholder')
		.filter((item) => item.metadata?.mimetype?.startsWith('image/') || IMAGE_EXT.test(item.name))
		.map((item) => ({
			name: item.name,
			url: storage.getPublicUrl(`${safeFolder}/${item.name}`).data.publicUrl
		}));
});


export const deleteFile = command('unchecked', async (publicUrl) => {
	const locals = await requireUser();
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


function cleanFolder(folder) {
	const safeFolder = String(folder ?? '').replace(/[^a-z0-9/_-]/gi, '').replace(/^\/+|\/+$/g, '');
	if (!safeFolder || safeFolder.includes('..')) error(400, 'Invalid folder');
	return safeFolder;
}


function slugify(name) {
	return name
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')   // strip accents
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')       // anything else becomes a dash
		.replace(/^-+|-+$/g, '')
		.slice(0, 60) || 'file';
}