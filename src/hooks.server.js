import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '$app/env/public';

// /admin and everything under it, but not e.g. /administrator
function isAdmin(pathname) {
	return pathname === '/admin' || pathname.startsWith('/admin/');
}

export const handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				);
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) return { session: null, user: null };
		// getUser() verifies the token with Supabase; getSession() alone doesn't
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) return { session: null, user: null };
		return { session, user };
	};

	const { pathname, search } = event.url;

	// Only verify the user where it matters. Public pages skip the round-trip to Supabase Auth; they can still call locals.safeGetSession() if needed.
	if (isAdmin(pathname)) {
		const { session, user } = await event.locals.safeGetSession();
		if (!user) {
			// Remember where they were going, so /login can send them back
			const redirectTo = encodeURIComponent(pathname + search);
			redirect(303, `/login?redirectTo=${redirectTo}`);
		}
		event.locals.session = session;
		event.locals.user = user;
	}

	if (pathname === '/login') {
		const { user } = await event.locals.safeGetSession();
		if (user) redirect(303, '/admin');
	}

	return resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-range' || name === 'x-supabase-api-version'
	});
};