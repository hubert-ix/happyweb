import { query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

const types = ['text', 'image', 'navigation'];

// CREATE
export const addBlock = command('unchecked', async ({ columnId, type }) => {
	const { locals } = getRequestEvent();
	if (!types.includes(type)) error(400, 'Invalid block type');
	// index = number of existing blocks in this column
	const { count, error: countError } = await locals.supabase.from('block').select('id', { count: 'exact', head: true }).eq('column_id', columnId);
	if (countError) throw countError;
  // insert the block
  const { data, error: insertError } = await locals.supabase.from('block').insert({ column_id: columnId, type, index: count ?? 0 }).select().single();
  if (insertError) throw insertError;
	return { block: data };
});


// READ ONE
export const getBlock = query('unchecked', async (id) => {
	const { locals } = getRequestEvent();
	const { data, error: fetchError } = await locals.supabase.from('block').select().eq('id', id).maybeSingle();
	if (fetchError) throw fetchError;
	return { block: data };
});


// UPDATE
export const updateBlock = command('unchecked', async ({ id, values }) => {
	const { locals } = getRequestEvent();
	const { error: updateError } = await locals.supabase.from('block').update(values).eq('id', id);
	if (updateError) throw updateError;
	return {};
});


// DELETE
export const deleteBlock = command('unchecked', async (id) => {
	const { locals } = getRequestEvent();
	const { error: deleteError } = await locals.supabase.from('block').delete().eq('id', id);
	if (deleteError) throw deleteError;
	return {};
});