import { query, command, getRequestEvent } from '$app/server';
import { requireUser } from '#lib/server/auth.js';
import { error } from '@sveltejs/kit';

// READ ONE
export const getPage = query('unchecked', async (arg) => {
	const { locals } = getRequestEvent();
	const { user } = await locals.safeGetSession();
	const supabase = locals.supabase;
	let q = supabase
		.from('page')
		.select('*, sections:section(*, columns:column(*, blocks:block(*)))')
		.order('index', { referencedTable: 'sections' })
		.order('index', { referencedTable: 'sections.columns' })
		.order('index', { referencedTable: 'sections.columns.blocks' });
	// only show unpublished page to logged in users
	if (!user) q = q.eq('published', true);
  // find out which param to use to load the page
	if (arg?.path !== undefined) {
    q = q.eq('path', arg.path);
  }
	else if (arg?.is_home) {
    q = q.eq('is_home', true);
  }
	else {
    q = q.eq('id', arg);
  }
	const { data: page, error: fetchError } = await q.maybeSingle();
	if (fetchError && fetchError.code !== '22P02') throw fetchError;   // 22P02 = malformed id, treat as not found
	if (!page) return { page: null };
	const [top_parent_id, nav_pages] = await Promise.all([
		getTopParentId(supabase, page),
		getNavPages(supabase, page)
	]);
	return { page: { ...page, top_parent_id, nav_pages } };
});

// CREATE
export const addPage = command('unchecked', async (values) => {
	const locals = await requireUser();
	const { data, error: insertError } = await locals.supabase.from('page').insert(values).select().single();
	if (insertError) throw insertError;
	return { page: data };
});

// UPDATE
export const updatePage = command('unchecked', async ({ id, values }) => {
	const locals = await requireUser();
	const { error: updateError } = await locals.supabase.from('page').update(values).eq('id', id);
	if (updateError) throw updateError;
	return {};
});

// DELETE
export const deletePage = command('unchecked', async (id) => {
	const locals = await requireUser();
	const { error: deleteError } = await locals.supabase.from('page').delete().eq('id', id);
	if (deleteError) throw deleteError;
	return {};
});


// HELPERS (not exported)

// the top-level ancestor of a page (the page itself if it's top-level)
async function getTopParentId(supabase, page) {
	if (!page.parent_id) return page.id;
	const { data, error: fetchError } = await supabase.from('page').select('id, parent_id');
	if (fetchError) throw fetchError;
	const parents = new Map(data.map((p) => [p.id, p.parent_id]));
	let id = page.id;
	const seen = new Set();
	while (parents.get(id) && !seen.has(id)) {   // stops at a top-level page, and on a loop
		seen.add(id);
		id = parents.get(id);
	}
	return id;
}

// the page above its children, or else its parent above its siblings
// (only when the page contains a navigation block)
async function getNavPages(supabase, page) {
	const hasNav = page.sections.some((s) =>
		s.columns.some((c) => c.blocks.some((b) => b.type === 'navigation'))
	);
	if (!hasNav) return [];
	const children = await getMenuPages(supabase, page.id);
	if (children.length) {
		return [{ id: page.id, title: page.title, path: page.path, isParent: true }, ...children];
	}
	if (page.parent_id) {
		const [parent, siblings] = await Promise.all([
			getMenuPage(supabase, page.parent_id),
			getMenuPages(supabase, page.parent_id)
		]);
		return parent ? [{ ...parent, isParent: true }, ...siblings] : siblings;
	}
	return [];
}

async function getMenuPages(supabase, parentId) {
	const { data, error: fetchError } = await supabase
		.from('page')
		.select('id, title, path, is_home')
		.eq('parent_id', parentId)
		.eq('published', true)
		.eq('in_menu', true)
		.order('display_order');
	if (fetchError) throw fetchError;
	return data ?? [];
}

async function getMenuPage(supabase, id) {
	const { data, error: fetchError } = await supabase
		.from('page')
		.select('id, title, path, is_home')
		.eq('id', id)
		.eq('published', true)
		.eq('in_menu', true)
		.maybeSingle();
	if (fetchError) throw fetchError;
	return data;
}
