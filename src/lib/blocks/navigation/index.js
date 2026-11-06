import Display from './Display.svelte';
import Preview from './Preview.svelte';
import Editor from './Editor.svelte';
import Icon from '@lucide/svelte/icons/square-menu';

export default {
  label: 'A navigation block',
  weight: 3,
  defaults: { },
  Editor: null,
  Preview,
  Display,
  Icon
};