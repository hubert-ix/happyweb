import { query, command, getRequestEvent } from '$app/server';
import { requireUser } from '#lib/server/auth.js';
import { error } from '@sveltejs/kit';

// READ
export const getSettings = query(async () => {
	const { locals } = getRequestEvent();
	const { data, error: fetchError } = await locals.supabase.from('settings').select().maybeSingle();
	if (fetchError) throw fetchError;
	return { settings: data };
});

// UPDATE
export const updateSettings = command('unchecked', async (values) => {
	const locals = await requireUser();
	const { user } = await locals.safeGetSession();
	if (!user) error(401, 'Not signed in');
	const { error: updateError } = await locals.supabase
		.from('settings')
		.update({ ...values, updated_at: new Date().toISOString() })
		.eq('id', true);
	if (updateError) throw updateError;
	return {};
});