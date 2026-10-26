import { query, command, getRequestEvent } from '$app/server';


// CREATE
export const addSection = command('unchecked', async (pageId) => {
	const { locals } = getRequestEvent();
  // count how many sections we have for that page
  const { data: last } = await locals.supabase.from('section').select('index').eq('page_id', pageId).order('index', { ascending: false }).limit(1).maybeSingle();
  // insert the new section
	const { data: section } = await locals.supabase.from('section').insert({page_id: pageId, index: (last?.index ?? -1) + 1}).select().single();
  // 4 columns in one insert
	const { data: columns } = await locals.supabase.from('column').insert([0, 1, 2, 3].map((index) => ({ section_id: section.id, index }))).select();
	return { section: { ...section, columns } };
});


// READ ONE
export const getSection = query('unchecked', async (id) => {
	const { locals } = getRequestEvent();
	const { data, error: fetchError } = await locals.supabase.from('section').select().eq('id', id).maybeSingle();
	if (fetchError) throw fetchError;
	return { section: data };
});


// UPDATE
export const updateSection = command('unchecked', async ({ id, values }) => {
	const { locals } = getRequestEvent();
	const { error: updateError } = await locals.supabase.from('section').update(values).eq('id', id);
	if (updateError) throw updateError;
	return {};
});


// DELETE
export const deleteSection = command('unchecked', async (id) => {
	const { locals } = getRequestEvent();
	const { error: deleteError } = await locals.supabase.from('section').delete().eq('id', id);
	if (deleteError) throw deleteError;
	return {};
});