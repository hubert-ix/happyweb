import { fail, redirect, error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
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
  let pageTitle = page.meta_title?.trim() || page.title;
  return { page, pageTitle };
};
