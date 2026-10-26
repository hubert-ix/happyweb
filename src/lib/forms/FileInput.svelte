<script>
  import { fade } from 'svelte/transition';
  import { getUploadUrl, deleteFile } from '#lib/files.remote.js';
  import Upload from '@lucide/svelte/icons/upload';
  import X from '@lucide/svelte/icons/x';

  let {
    value = $bindable(''),   // public URL of the uploaded file
    folder,                  // stored in files/[folder]
    accept = 'image/*',
    name,
    id = name,
    onuploaded = undefined
  } = $props();
  let progress = $state(0);  // 0–100
  let uploading = $state(false);
  let errorMessage = $state('');
  let isImage = $derived(accept.startsWith('image'));

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

  async function upload(e) {
    const file = e.currentTarget.files?.[0];
    e.currentTarget.value = '';   // lets the same file be picked again after an error
    if (!file) return;
    uploading = true;
    progress = 0;
    errorMessage = '';
    try {
      const { signedUrl, publicUrl } = await getUploadUrl({ folder, filename: file.name });
      await put(signedUrl, file);
      value = publicUrl;
      uploadedHere.add(publicUrl);
      onuploaded?.(publicUrl);
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
    if (!uploadedHere.has(url)) return;   // a saved file: leave it, Save will handle it
    uploadedHere.delete(url);
    try {
      await deleteFile(url);
    }
    catch (err) {
      console.error(err);
    }
  }
</script>


<div class="file-input">

  {#if value && !uploading}
    <div class="current" transition:fade={{ duration: 150 }}>
      {#if isImage}
        <img src={value} alt="" />
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
  .current {
    position: relative;
    display: inline-block;
    margin-bottom: 0.75rem;
  }

  .current img {
    display: block;
    max-width: 100%;
    max-height: 240px;
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