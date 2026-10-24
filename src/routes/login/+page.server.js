import { fail, redirect } from '@sveltejs/kit';

// Only allow redirects within this site ("/admin", not "//evil.com")
function safeRedirect(target) {
	return target?.startsWith('/') && !target.startsWith('//') ? target : '/admin';
}

export const actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { email, error: 'Please enter your email and password.' });
		}

		const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

		if (error) {
			// Same message either way, so we don't reveal which emails exist
			return fail(400, { email, error: 'Incorrect email or password.' });
		}

		redirect(303, safeRedirect(url.searchParams.get('redirectTo')));
	}
};