<script>
  import { fade, slide } from "svelte/transition";
  import { dragHandle } from 'svelte-dnd-action';
  import { updateBlock } from '#lib/blocks.remote.js';
  import { blockTypes } from './blocks/index.js';
  import Modal from "#lib/UI/Modal.svelte";
  import Button from "#lib/UI/Button.svelte";
  import BlockPanel from './BlockPanel.svelte';
  import Pencil from '@lucide/svelte/icons/pencil';
  import Move from '@lucide/svelte/icons/move';
  import Trash from '@lucide/svelte/icons/trash';

  let { block, onremove, onupdate } = $props();
  let type = $derived(blockTypes[block.type]);
  let editing = $state(false);
  let showDeletePopup = $state(false);

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
    <div class="handle" use:dragHandle aria-label="Drag to move this block">
      <Move size="18" />
    </div>
    <div class="flex">
      <div class="type">
        {block.type}
      </div>
      {#if type?.Editor}
        <button class="bare" onclick={() => editing = true}>
          <Pencil size="18" />
        </button>
      {/if}
      <button class="bare delete" onclick={() => showDeletePopup = true}>
        <Trash size="18" />
      </button>
    </div>
  </div>

  {#if type}
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
    border: dashed 1px #ccc;
    border-radius: 0.3rem;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #fafafa;
  }

  .toolbar {
    justify-content: space-between;
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