<script>
  import { enhance } from '$app/forms';
  import { snackbar } from '#lib/UI/Snackbar.svelte.js';
  import FileInput from '#lib/forms/FileInput.svelte';
  import FormItem from '#lib/forms/FormItem.svelte';
  import TextInput from '#lib/forms/TextInput.svelte';
  import FontInput from '#lib/forms/FontInput.svelte';
  import { DEFAULT_BODY_FONT, DEFAULT_HEADING_FONT } from '#lib/fonts.js';
  import Button from '#lib/UI/Button.svelte';

  let { data, form } = $props();
  let initial = form?.values ?? data.settings ?? {};
  let siteName = $state(initial.site_name ?? '');
  let footerText = $state(initial.footer_text ?? '');
  let logoUrl = $state(initial.logo_url ?? '');
  let faviconUrl = $state(initial.favicon_url ?? '');
  let fontBody = $state(initial.font_body ?? '');
  let fontHeading = $state(initial.font_heading ?? '');
  let submitting = $state(false);
  let errors = $derived(form?.errors ?? null);

  function handleSubmit({ cancel }) {
    if (!siteName.trim()) {
      errors = { site_name: 'Please enter a website name.' };
      return cancel();
    }
    submitting = true;
    return async ({ result, update }) => {
      await update({ reset: false });
      if (result.type === 'success') {
        // show the tidied-up font names, e.g. "lato" becomes "Lato"
        fontBody = result.data?.values?.font_body ?? '';
        fontHeading = result.data?.values?.font_heading ?? '';
        snackbar.show('Settings saved');
      }
      submitting = false;
    };
  }
</script>


<form method="POST" use:enhance={handleSubmit}>

  <div class="sheet margin-bottom-medium">
  <FormItem label="Website name" id="site_name" description="This is what is displayed in Google, and also at the top of the browser" errorMessage={errors?.site_name}>
    <TextInput name="site_name" bind:value={siteName} autocomplete="off" class={errors?.site_name ? 'error' : ''} />
  </FormItem>

  <FormItem label="Footer text" id="footer_text" description="This is displayed at the very bottom of every page" errorMessage={errors?.footer_text}>
    <TextInput name="footer_text" bind:value={footerText} autocomplete="off" class={errors?.footer_text ? 'error' : ''} />
  </FormItem>

  <FormItem label="Header logo" id="logo" description="This image will go at the left side of the navigation bar at the top">
    <FileInput id="logo" folder="site" bind:value={logoUrl} />
    <input type="hidden" name="logo_url" value={logoUrl} />
  </FormItem>

  <FormItem label="Favicon" id="favicon" description="This is the small image displayed in the browser's tabs">
    <FileInput id="favicon" folder="site" accept="image/png,image/svg+xml,image/x-icon" optimise={false} bind:value={faviconUrl} />
    <input type="hidden" name="favicon_url" value={faviconUrl} />
  </FormItem>
  </div>

  <div class="sheet margin-bottom-medium">

  <FormItem label="Text font" id="font_body" description="This is the font used for text throughout the site" errorMessage={errors?.font_body}>
    <FontInput name="font_body" bind:value={fontBody} defaultFont={DEFAULT_BODY_FONT} class={errors?.font_body ? 'error' : ''} />
  </FormItem>

  <FormItem label="Headings font" id="font_heading" description="And this is used for titles and headings" errorMessage={errors?.font_heading}>
    <FontInput name="font_heading" bind:value={fontHeading} defaultFont={DEFAULT_HEADING_FONT} sample="A heading for your page" class={errors?.font_heading ? 'error' : ''} />
  </FormItem>

  </div>

  <div class="flex">
    <Button type="submit" disabled={submitting}>
      {submitting ? 'Saving…' : 'Save settings'}
    </Button>
  </div>

  {#if errors?.form}
    <div class="error">{errors.form}</div>
  {/if}

</form>


<style>
  .error {
    color: var(--color-error);
  }
</style>