import Display from './Display.svelte';
import Preview from './Preview.svelte';
import Editor from './Editor.svelte';

export default {
  label: 'A great quote',
  defaults: { text: '', author: '' },
  Editor,
  Preview,
  Display
};