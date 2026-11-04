import { query, command, getRequestEvent } from '$app/server';
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
	const { locals } = getRequestEvent();
	const { user } = await locals.safeGetSession();
	if (!user) error(401, 'Not signed in');
	const { error: updateError } = await locals.supabase
		.from('settings')
		.update({ ...values, updated_at: new Date().toISOString() })
		.eq('id', true);
	if (updateError) throw updateError;
	return {};
});