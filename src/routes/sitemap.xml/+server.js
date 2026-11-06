// /sitemap.xml: every published page, for search engines
export const GET = async ({ locals, url }) => {
	const { data: pages, error } = await locals.supabase
		.from('page')
		.select('path, is_home')
		.eq('published', true)
		.order('is_home', { ascending: false })
		.order('path');
	if (error) {
		console.error('Failed to build the sitemap:', error);
		return new Response('Sitemap unavailable', { status: 500 });
	}

	const urls = (pages ?? [])
		.map((p) => `  <url><loc>${escapeXml(url.origin + (p.is_home ? '/' : '/' + p.path))}</loc></url>`)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};

function escapeXml(text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}