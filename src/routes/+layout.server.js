export const load = async ({ locals }) => {
	let [ response1, response2 ] = await Promise.all([
		locals.supabase.from('page').select('id, title, path').eq('parent_id', 0).eq('published', true).order('display_order', { ascending: true }),
		locals.supabase.from('user').select().eq('id', locals.user.id)
	]);
	let pages = response1.data;
	let user = response2.data[0];
	return { pages, user };
};