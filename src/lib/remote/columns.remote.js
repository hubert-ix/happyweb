import { query, command, getRequestEvent } from '$app/server';


// CREATE
export const addColumn = command('unchecked', async (values) => {
	const { locals } = getRequestEvent();
	const { data, error: insertError } = await locals.supabase.from('column').insert(values).select().single();
	if (insertError) throw insertError;
	return { column: data };
});


// READ ONE
export const getColumn = query('unchecked', async (id) => {
	const { locals } = getRequestEvent();
	const { data, error: fetchError } = await locals.supabase.from('column').select().eq('id', id).maybeSingle();
	if (fetchError) throw fetchError;
	return { column: data };
});


// UPDATE
export const updateColumn = command('unchecked', async ({ id, values }) => {
	const { locals } = getRequestEvent();
	const { error: updateError } = await locals.supabase.from('column').update(values).eq('id', id);
	if (updateError) throw updateError;
	return {};
});


// DELETE
export const deleteColumn = command('unchecked', async (id) => {
	const { locals } = getRequestEvent();
	const { error: deleteError } = await locals.supabase.from('column').delete().eq('id', id);
	if (deleteError) throw deleteError;
	return {};
});