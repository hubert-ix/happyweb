export const layouts = [
	{ key: '1', columns: 1, template: '1fr', label: 'One column' },
	{ key: '2-equal', columns: 2, template: '1fr 1fr', label: 'Two columns 50/50' },
	{ key: '2-wide-right', columns: 2, template: '1fr 2fr', label: 'Two columns 25/75' },
	{ key: '2-wide-left', columns: 2, template: '2fr 1fr', label: 'Two columns 75/25' },
	{ key: '3', columns: 3, template: '1fr 1fr 1fr', label: 'Three columns' },
	{ key: '4', columns: 4, template: '1fr 1fr 1fr 1fr', label: 'Four columns' }
];

export const defaultLayout = '2-50-50';

export function getLayout(key) {
	return layouts.find((l) => l.key === key) ?? layouts.find((l) => l.key === defaultLayout);
}

// always 4 tracks, hidden ones at 0fr, so layout changes can be animated
export function tracks(layout) {
	const sizes = layout.template.split(' ');
	while (sizes.length < 4) sizes.push('0fr');
	return sizes.map((s) => `minmax(0, ${s})`).join(' ');
}