import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

export async function requireUser() {
	const { locals } = getRequestEvent();
	const { user } = await locals.safeGetSession();
	if (!user) error(401, 'Not signed in');
	return locals;
}