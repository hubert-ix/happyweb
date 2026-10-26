import TextEditor from './editors/Text.svelte';
import TextPreview from './preview/Text.svelte';
import ImageEditor from './editors/Image.svelte';
import ImagePreview from './preview/Image.svelte';
import NavigationPreview from './preview/Navigation.svelte';

export const blockTypes = {
	text: {
    label: 'Some text',
		defaults: { text: '' },
		Editor: TextEditor,
		Preview: TextPreview
	},
	image: {
    label: 'A nice image',
		defaults: { url: '', alt: '' },
    Editor: ImageEditor,
		Preview: ImagePreview
	},
  navigation: {
    label: 'A navigation block',
		defaults: { },
    Editor: null,
		Preview: NavigationPreview
	}
};