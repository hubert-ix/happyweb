import Display from './Display.svelte';
import Preview from './Preview.svelte';
import Editor from './Editor.svelte';

export default {
  label: 'Some text',
  defaults: { text: '' },
  Editor,
  Preview,
  Display
};