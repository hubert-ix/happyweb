<script>
  import { enhance } from '$app/forms';
  import FileInput from '#lib/forms/FileInput.svelte';
  import FormItem from '#lib/forms/FormItem.svelte';
  import TextInput from '#lib/forms/TextInput.svelte';
  import Button from '#lib/UI/Button.svelte';

  let { data, form } = $props();
  let initial = form?.values ?? data.settings ?? {};
  let siteName = $state(initial.site_name ?? '');
  let logoUrl = $state(initial.logo_url ?? '');
  let faviconUrl = $state(initial.favicon_url ?? '');
  let submitting = $state(false);
  let errors = $derived(form?.errors ?? null);

  function handleSubmit({ cancel }) {
    if (!siteName.trim()) {
      errors = { site_name: 'Please enter a website name.' };
      return cancel();
    }
    submitting = true;
    return async ({ update }) => {
      await update({ reset: false });
      submitting = false;
    };
  }
</script>


<form method="POST" use:enhance={handleSubmit}>

  <FormItem label="Website name" id="site_name" description="This is what is displayed in Google, and also at the top of the browser" errorMessage={errors?.site_name}>
    <TextInput name="site_name" bind:value={siteName} autocomplete="off" class={errors?.site_name ? 'error' : ''} />
  </FormItem>

  <FormItem label="Header logo" id="logo" description="This image will go at the left side of the navigation bar at the top">
    <FileInput id="logo" folder="site" bind:value={logoUrl} />
    <input type="hidden" name="logo_url" value={logoUrl} />
  </FormItem>

  <FormItem label="Favicon" id="favicon" description="This is the small image displayed in the browser's tabs">
    <FileInput id="favicon" folder="site" accept="image/png,image/svg+xml,image/x-icon" optimise={false} bind:value={faviconUrl} />
    <input type="hidden" name="favicon_url" value={faviconUrl} />
  </FormItem>

  <div class="flex margin-top-large">
    <Button type="submit" disabled={submitting}>
      {submitting ? 'Saving…' : 'Save settings'}
    </Button>
  </div>

  {#if form?.saved}
    <p class="saved">Settings saved.</p>
  {/if}

  {#if errors?.form}
    <div class="error">{errors.form}</div>
  {/if}

</form>


<style>
  form {
    max-width: 32rem;
  }

  .saved {
    color: #349500;
  }

  .error {
    color: var(--color-error);
  }
</style>