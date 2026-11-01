import Display from './Display.svelte';
import Preview from './Preview.svelte';
import Editor from './Editor.svelte';

export default {
  label: 'Some image',
  defaults: { url: null, alt: '' },
  Editor,
  Preview,
  Display
};