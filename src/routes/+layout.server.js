// src/routes/+layout.server.js
export const load = async ({ locals, depends }) => {
	depends('app:menu');
	const user = locals.user ?? (await locals.safeGetSession()).user;
	const [menu, profile] = await Promise.all([
		locals.supabase.from('page').select('id, title, path').eq('parent_id', 0).eq('published', true).eq('in_menu', true).order('display_order', { ascending: true }),
		user
			? locals.supabase.from('user').select('first_name').eq('id', user.id).maybeSingle()
			: { data: null }
	]);
	if (menu.error) console.error('Failed to load menu:', menu.error);
	if (profile.error) console.error('Failed to load user profile:', profile.error);
	return { pages: menu.data ?? [], user: profile.data };
};