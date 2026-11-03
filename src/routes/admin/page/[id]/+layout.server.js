import { fail, redirect, error } from '@sveltejs/kit';
import { getPage } from '#lib/remote/pages.remote.js';

export const load = async ({ locals, params, depends }) => {
  depends("page");
  const { page } = await getPage(params.id);
  if (!page) {
    error(404, 'Page not found.');
  }
  return { page };
};
