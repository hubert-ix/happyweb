<script>
  import TextInput from '#lib/forms/TextInput.svelte';
  import { FONT_SUGGESTIONS, isValidFamily, normaliseFamily, fontStack, familyParam, googleFontsUrl } from '#lib/fonts.js';

  let {
    value = $bindable(''),
    name,
    id = name,
    defaultFont, // used when the field is left empty
    sample = 'The quick brown fox jumps over the lazy dog',
    class: className = ''
  } = $props();

  // wait until they stop typing before loading the font for the preview
  let previewFamily = $state(normaliseFamily(value));
  let timer;
  $effect(() => {
    let family = normaliseFamily(value);
    clearTimeout(timer);
    timer = setTimeout(() => (previewFamily = family), 400);
    return () => clearTimeout(timer);
  });

  let family = $derived(isValidFamily(previewFamily) ? previewFamily : defaultFont);
  let previewUrl = $derived(family === defaultFont ? null : googleFontsUrl([familyParam(family)]));
</script>


<svelte:head>
  {#if previewUrl}
    <link rel="stylesheet" href={previewUrl} />
  {/if}
</svelte:head>

<TextInput {id} {name} bind:value list="{id}-suggestions" placeholder={defaultFont} autocomplete="off" spellcheck="false" class={className} />

<datalist id="{id}-suggestions">
  {#each FONT_SUGGESTIONS as font (font.family)}
    <option value={font.family}>{font.category}</option>
  {/each}
</datalist>

<div class="preview" class:heading={name == "font_heading"} style:font-family={fontStack(family)}>
  {sample}
</div>


<style>
  .preview {
    display: none;
    margin-top: 0.6rem;
    font-size: 1;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  .preview.heading {
    font-size: 1.25rem;
  }
</style>
