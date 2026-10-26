import { fail, redirect, error } from '@sveltejs/kit';

export const load = async ({ locals, params, depends }) => {
  depends("page");
  const { data: page, error: err } = await locals.supabase
    .from('page')
    .select('*, sections:section(*, columns:column(*))')
    .eq('id', params.id)
    .order('index', { referencedTable: 'sections' })
    .order('index', { referencedTable: 'sections.columns' })
    .maybeSingle();
  if (err && err.code !== '22P02') {
    console.error('Failed to load page:', err);
    error(500, 'Could not load this page.');
  }
  if (!page) {
    error(404, 'Page not found.');
  }
  return { page };
};
