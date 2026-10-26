export const layouts = [
	{ key: '1',       columns: 1, template: '1fr',             label: 'One column' },
	{ key: '2-50-50', columns: 2, template: '1fr 1fr',         label: 'Two columns 50/50' },
	{ key: '2-25-75', columns: 2, template: '1fr 3fr',         label: 'Two columns 25/75' },
	{ key: '2-75-25', columns: 2, template: '3fr 1fr',         label: 'Two columns 75/25' },
	{ key: '3',       columns: 3, template: '1fr 1fr 1fr',     label: 'Three columns' },
	{ key: '4',       columns: 4, template: '1fr 1fr 1fr 1fr', label: 'Four columns' }
];

export const defaultLayout = '2-50-50';

export function getLayout(key) {
	return layouts.find((l) => l.key === key) ?? layouts.find((l) => l.key === defaultLayout);
}