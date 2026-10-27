import { fail, redirect, error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
  // load the page
  const { data: page, error: err } = await locals.supabase
    .from('page')
    .select('*, sections:section(*, columns:column(*, blocks:block(*)))')
    .eq('path', params.path)
    .order('index', { referencedTable: 'sections' })
    .order('index', { referencedTable: 'sections.columns' })
    .order('index', { referencedTable: 'sections.columns.blocks' })
    .maybeSingle();
  if (err && err.code !== '22P02') {
    console.error('Failed to load page:', err);
    error(500, 'Could not load this page.');
  }
  if (!page) {
    error(404, 'Page not found.');
  }
  // if we need to display a navigation block, load the child pages
  const hasNav = page.sections.some(s =>
    s.columns.some(c => c.blocks.some(b => b.type === 'navigation'))
  );
  let navPages = [];
  if (hasNav) {
    navPages = await getPages(locals.supabase, page.id);
    if (!navPages.length && page.parent_id) {
      const [parent, siblings] = await Promise.all([
        getPage(locals.supabase, page.parent_id),
        getPages(locals.supabase, page.parent_id)
      ]);
      navPages = parent ? [{ ...parent, isParent: true }, ...siblings] : siblings;
    }
  }
  // get the page title
  let pageTitle = page.meta_title?.trim() || page.title;
  return { page, navPages, pageTitle };
};


async function getPages(supabase, parentId) {
  const { data, error } = await supabase
    .from('page')
    .select('id, title, path')
    .eq('parent_id', parentId)
    .eq('published', true)
    .eq('in_menu', true)
    .order('display_order');
  if (error) console.error(error);
  return data ?? [];
}


async function getPage(supabase, id) {
  const { data, error } = await supabase
    .from('page')
    .select('id, title, path')
    .eq('id', id)
    .eq('published', true)
    .eq('in_menu', true)
    .maybeSingle();
  if (error) console.error(error);
  return data;
}