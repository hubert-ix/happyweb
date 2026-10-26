import TextEditor from './editors/Text.svelte';
import TextPreview from './preview/Text.svelte';
import TextDisplay from './display/Text.svelte';
import ImageEditor from './editors/Image.svelte';
import ImagePreview from './preview/Image.svelte';
import ImageDisplay from './display/Image.svelte';
import NavigationPreview from './preview/Navigation.svelte';
import NavigationDisplay from './display/Navigation.svelte';

export const blockTypes = {
	text: {
    label: 'Some text',
		defaults: { text: '' },
		Editor: TextEditor,
		Preview: TextPreview,
		Display: TextDisplay
	},
	image: {
    label: 'A nice image',
		defaults: { url: '', alt: '' },
    Editor: ImageEditor,
		Preview: ImagePreview,
		Display: ImageDisplay
	},
  navigation: {
    label: 'A navigation block',
		defaults: { },
    Editor: null,
		Preview: NavigationPreview,
		Display: NavigationDisplay
	}
};