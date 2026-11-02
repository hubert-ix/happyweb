<script>
  import { fade, slide } from "svelte/transition";
  import { onMount, onDestroy, untrack } from 'svelte';
  import { dragHandle } from 'svelte-dnd-action';
  import { updateBlock } from '#lib/remote/blocks.remote.js';
  import { blockTypes } from '#lib/blocks';
  import Modal from "#lib/UI/Modal.svelte";
  import Button from "#lib/UI/Button.svelte";
  import BlockPanel from './BlockPanel.svelte';
  import Pencil from '@lucide/svelte/icons/pencil';
  import Move from '@lucide/svelte/icons/move';
  import Trash from '@lucide/svelte/icons/trash';
  import Check from '@lucide/svelte/icons/check';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';

  let { block, onremove, onupdate, autoEdit = false, onautoedited } = $props();
  let type = $derived(blockTypes[block.type]);
  let editing = $state(false);
  let showDeletePopup = $state(false);

  // inline editing: the Editor is shown in the block itself and saves automatically
  let inline = $derived(!!type?.inline);
  const initialJson = untrack(() => JSON.stringify({ ...blockTypes[block.type]?.defaults, ...block.data }));
  let draft = $state(JSON.parse(initialJson));
  let lastSaved = initialJson;
  let saveTimer = null;
  let pendingJson = null;
  let saveStatus = $state('idle'); // 'idle' | 'saved' | 'error'
  let statusTimer = null;

  $effect(() => {
    if (!inline) return;
    const json = JSON.stringify(draft);
    if (json === lastSaved) return;
    pendingJson = json;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveInline, 800);
  });

  async function saveInline() {
    clearTimeout(saveTimer);
    const json = pendingJson;
    pendingJson = null;
    if (!json || json === lastSaved) return;
    lastSaved = json;
    const data = JSON.parse(json);
    try {
      await updateBlock({ id: block.id, values: { data } });
      onupdate({ ...block, data });
      showStatus('saved', 1500);
    }
    catch (e) {
      console.error(e);
      lastSaved = null; // so the next change retries
      showStatus('error', 4000);
    }
  }

  function showStatus(s, duration) {
    clearTimeout(statusTimer);
    saveStatus = s;
    statusTimer = setTimeout(() => (saveStatus = 'idle'), duration);
  }

  onDestroy(() => {
    clearTimeout(statusTimer);
    if (pendingJson) saveInline(); // don't lose a change made just before leaving
  });

  onMount(() => {
    if (autoEdit && type?.Editor && !inline) editing = true;
    onautoedited?.();
  });

  function deleteBlock() {
    showDeletePopup = false;
    onremove(block.id);
  }

  async function saveBlock(data) {
    await updateBlock({ id: block.id, values: { data } });
    onupdate({ ...block, data });
    editing = false;
  }
</script>


<div class="block">
  
  <div class="toolbar flex margin-bottom-small">
    <div class="flex">
      <div class="handle" data-tip="Move this block" use:dragHandle aria-label="Drag to move this block">
        <Move size="18" />
      </div>
      <div class="type">
        {block.type}
      </div>
    </div>
    <div class="flex">
      {#if saveStatus === 'saved'}
        <span class="status saved" transition:fade={{ duration: 200 }} title="Saved"><Check size="18" /></span>
      {:else if saveStatus === 'error'}
        <span class="status error" transition:fade={{ duration: 200 }} title="Could not save"><CircleAlert size="18" /></span>
      {/if}
      {#if type?.Editor && !inline}
        <button class="bare" data-tip="Edit this block" onclick={() => editing = true}>
          <Pencil size="18" />
        </button>
      {/if}
      <button class="bare delete" data-tip="Delete this block" onclick={() => showDeletePopup = true}>
        <Trash size="18" />
      </button>
    </div>
  </div>

  {#if inline}
    <type.Editor bind:data={draft} />
  {:else if type}
    <type.Preview data={block.data ?? {}} />
  {/if}

</div>

{#if editing}
  <BlockPanel {block} onsave={saveBlock} onclose={() => editing = false} />
{/if}

{#if showDeletePopup}
  <Modal>
    <p>Are you sure you want to delete this nice block?<br />This cannot be undone</p>
    <div class="flex">
      <Button class="delete" onclick={deleteBlock}>Yes, delete</Button>
      <Button class="cancel" onclick={() => showDeletePopup = false}>Oh my, no!</Button>
    </div>
  </Modal>
{/if}


<style>
  .block {
    border: 1px solid #cbd5e1;
    border-radius: 0.3rem;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #fff;
  }

  .toolbar {
    justify-content: space-between;
    color: #999;
  }

  .status {
    display: flex;
  }

  .saved { 
    color: #349500; 
  }
  
  .error { 
    color: var(--color-error); 
  }

  .handle {
    cursor: grab;
    display: flex;
  }

  .type {
    display: flex;
		align-items: center;
		padding: 0.25em 1em;
		border-radius: 0.25rem;
		background: #f9d6ff;
		color: #5e0e92;
		font-size: 0.75rem;
		white-space: nowrap;
  }
</style>