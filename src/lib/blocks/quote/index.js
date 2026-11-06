import Display from './Display.svelte';
import Preview from './Preview.svelte';
import Editor from './Editor.svelte';
import Icon from '@lucide/svelte/icons/quote';

export default {
  label: 'A great quote',
  weight: 2,
  defaults: { text: '', author: '' },
  Editor,
  Preview,
  Display,
  Icon
};