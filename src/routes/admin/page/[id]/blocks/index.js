import TextEditor from './editors/Text.svelte';
import TextPreview from './preview/Text.svelte';
import ImageEditor from './editors/Image.svelte';
import ImagePreview from './preview/Image.svelte';
import NavigationPreview from './preview/Navigation.svelte';

export const blockTypes = {
	text: {
		defaults: { text: '' },
		Editor: TextEditor,
		Preview: TextPreview
	},
	image: {
		defaults: { path: '', alt: '' },
    Editor: ImageEditor,
		Preview: ImagePreview
	},
  navigation: {
		defaults: { },
    Editor: null,
		Preview: NavigationPreview
	}
};