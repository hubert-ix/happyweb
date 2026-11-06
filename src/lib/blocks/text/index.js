import Display from './Display.svelte';
import Preview from './Preview.svelte';
import Editor from './Editor.svelte';
import Icon from '@lucide/svelte/icons/type';

export default {
  label: 'Some text',
  weight: 0,
  defaults: { text: '' },
  Editor,
  Preview,
  Display,
  Icon
};