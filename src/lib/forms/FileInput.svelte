<script>
  import { fade } from 'svelte/transition';
  import { onDestroy } from 'svelte';
  import { getUploadUrl, deleteFile, listImages } from '#lib/remote/files.remote.js';
  import { optimiseImage } from '#lib/optimiseImage.js';
  import Upload from '@lucide/svelte/icons/upload';
  import X from '@lucide/svelte/icons/x';
  import Images from '@lucide/svelte/icons/images';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import Button from '#lib/UI/Button.svelte';

  let {
    value = $bindable(''),
    folder, // stored in files/[folder]
    accept = 'image/*',
    name,
    id = name,
    onchange = undefined,
    includeLibrary = false // adds an "Open library" button listing the images already in files/[folder]
  } = $props();
  let progress = $state(0);  // 0–100
  let uploading = $state(false);
  let errorMessage = $state('');
  let isImage = $derived(accept.startsWith('image'));
  let localPreview = $state(null); // the picked file, shown straight away instead of waiting for storage
  let libraryOpen = $state(false);
  let libraryEl = $state();

  const uploadedHere = new Set();

  // XMLHttpRequest rather than fetch, because only XHR reports upload progress
  function put(url, file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('x-upsert', 'false');
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) progress = Math.round((e.loaded / e.total) * 100);
      };
      xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(xhr.responseText)));
      xhr.onerror = () => reject(new Error('Network error'));
      // same body format supabase-js uses for signed uploads
      const body = new FormData();
      body.append('cacheControl', '3600');
      body.append('', file);
      xhr.send(body);
    });
  }

  function setLocalPreview(file) {
    if (localPreview) URL.revokeObjectURL(localPreview);
    localPreview = file ? URL.createObjectURL(file) : null;
  }

  onDestroy(() => setLocalPreview(null));

  async function upload(e) {
    let file = e.currentTarget.files?.[0];
    e.currentTarget.value = '';   // lets the same file be picked again after an error
    if (!file) return;
    uploading = true;
    progress = 0;
    errorMessage = '';
    try {
      file = await optimiseImage(file);
      const { signedUrl, publicUrl } = await getUploadUrl({ folder, filename: file.name });
      await put(signedUrl, file);
      value = publicUrl;
      uploadedHere.add(publicUrl);
      onchange?.(publicUrl);
      if (includeLibrary) listImages(folder).refresh();
    } 
    catch (err) {
      console.error(err);
      errorMessage = "That file couldn't be uploaded. Try again.";
    } 
    finally {
      uploading = false;
    }
  }

  async function remove() {
    const url = value;
    value = '';
    errorMessage = '';
    onchange?.('');
    if (!uploadedHere.has(url)) return;   // a saved file: leave it, Save will handle it
    uploadedHere.delete(url);
    try {
      await deleteFile(url);
      if (includeLibrary) listImages(folder).refresh();
    }
    catch (err) {
      console.error(err);
    }
  }

  function toggleLibrary() {
    libraryOpen = !libraryOpen;
    if (libraryOpen) listImages(folder).refresh();   // pick up files added elsewhere since last time
  }

  function pickFromLibrary(url) {
    setLocalPreview(null);
    errorMessage = '';
    value = url;
    libraryOpen = false;
    onchange?.(url);
  }

  // close on Escape or a click outside the library
  function onWindowKeydown(e) {
    if (libraryOpen && e.key === 'Escape') libraryOpen = false;
  }
  function onWindowClick(e) {
    if (libraryOpen && libraryEl && !libraryEl.contains(e.target)) libraryOpen = false;
  }
</script>


<svelte:window onkeydown={onWindowKeydown} onclick={onWindowClick} />

<div class="file-input">

  {#if value && !uploading}

    <div class="current" transition:fade={{ duration: 150 }}>
      {#if isImage}
        <img src={localPreview ?? value} alt="" />
      {:else}
        <a href={value} target="_blank" rel="noopener">{value.split('/').pop()}</a>
      {/if}
      <button type="button" class="bare remove" onclick={remove} aria-label="Remove file">
        <X size="18" />
      </button>
    </div>
  {/if}

  {#if uploading}

    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
      <div class="bar" style:width="{progress}%"></div>
      <span>{progress}%</span>
    </div>

  {:else if !value}

    {#if includeLibrary}
      <div class="library" bind:this={libraryEl}>
        <Button onclick={toggleLibrary}>
          Choose an existing image
        </Button>
        {#if libraryOpen}
          <div class="dropdown" id="{id}-library" transition:fade={{ duration: 150 }}>
            {#await listImages(folder)}
              <p class="note">Loading images…</p>
            {:then images}
              {#if images.length}
                <ul>
                  {#each images as image (image.url)}
                    <li>
                      <button type="button" class="bare thumb" onclick={() => pickFromLibrary(image.url)} title={image.name}>
                        <img src={image.url} alt={image.name} loading="lazy" />
                      </button>
                    </li>
                  {/each}
                </ul>
              {:else}
                <p class="note">No images uploaded yet.</p>
              {/if}
            {:catch}
              <p class="note error">The library couldn't be loaded.</p>
            {/await}
          </div>
        {/if}
      </div>

      <div class="margin-bottom-xsmall">
        or
      </div>
    {/if}

    <label class="pick">
      <Upload size="18" />
      Choose a file
      <input type="file" {id} {accept} onchange={upload} />
    </label>

  {/if}

  {#if errorMessage}
    <div class="error">
      {errorMessage}
    </div>
  {/if}

</div>

<style>
  .file-input {
    overflow: hidden;
  }

  .current {
    position: relative;
    display: inline-block;
    margin-bottom: 0.75rem;
  }

  .current img {
    display: block;
    max-width: 100%;
    max-height: 150px;
    min-width: 80px;
    border-radius: 6px;
  }

  .remove {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    padding: 0.2rem;
    border-radius: 50%;
    background: rgb(255 255 255 / 0.9);
    display: flex;
  }

  .library {
    margin-bottom: 0.75rem;
  }

  .open-library {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
  }

  .open-library :global(.flipped) {
    transform: rotate(180deg);
  }

  .dropdown {
    margin-top: 0.5rem;
    padding: 0.5rem;
    border: solid 1px #cbd5e1;
    border-radius: 6px;
    background: #fff;
    max-height: 260px;
    overflow-y: auto;
  }

  .dropdown ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 0.5rem;
  }

  .thumb {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    padding: 0;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    outline-offset: 2px;
  }

  .thumb:hover,
  .thumb:focus-visible {
    outline: 2px solid #93c5fd;
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .note {
    margin: 0.25rem;
    color: #555;
    font-size: 0.9rem;
  }

  .pick {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.6rem 1rem;
    border: dashed 1px #cbd5e1;
    border-radius: 6px;
    cursor: pointer;
    color: #555;
  }

  .pick:focus-within {
    outline: 2px solid #93c5fd;
    outline-offset: 2px;
  }

  /* visually hidden, still focusable */
  .pick input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  .progress {
    position: relative;
    height: 2rem;
    border-radius: 6px;
    background: #eef2f7;
    overflow: hidden;
  }

  .bar {
    height: 100%;
    background: #349500;
    transition: width 0.15s;
  }

  .progress span {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 0.85rem;
  }

  .error {
    color: var(--color-error);
    margin: 0.5rem 0 0;
  }
</style>