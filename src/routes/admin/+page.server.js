import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	return {
		pages: locals.supabase.from('page').select().order('display_order').then(({ data }) => data ?? [])
	};
};