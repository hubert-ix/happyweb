import Display from './Display.svelte';
import Preview from './Preview.svelte';
import Editor from './Editor.svelte';
import Icon from '@lucide/svelte/icons/image';

export default {
  label: 'Some image',
  weight: 1,
  //inline: true, // edit directly in the block, no side panel
  defaults: { url: null, alt: '' },
  Editor,
  Preview,
  Display,
  Icon
};