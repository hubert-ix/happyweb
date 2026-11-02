import Display from './Display.svelte';
import Preview from './Preview.svelte';
import Editor from './Editor.svelte';

export default {
  label: 'Some image',
  //inline: true, // edit directly in the block, no side panel
  defaults: { url: null, alt: '' },
  Editor,
  Preview,
  Display
};