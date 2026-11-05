let current = $state(null);
let timer;

export const snackbar = {
	get current() {
		return current;
	},

	show(text, { type = 'success', duration = 3000 } = {}) {
		clearTimeout(timer);
		current = { id: Date.now(), text, type };
		timer = setTimeout(() => (current = null), duration);
	},

	hide() {
		clearTimeout(timer);
		current = null;
	}
};