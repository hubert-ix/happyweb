<script>
  import { fade, slide } from "svelte/transition";
  import { dragHandle } from 'svelte-dnd-action';
  import Modal from "#lib/UI/Modal.svelte";
  import Button from "#lib/UI/Button.svelte";
  import Pencil from '@lucide/svelte/icons/pencil';
  import Move from '@lucide/svelte/icons/move';
  import Trash from '@lucide/svelte/icons/trash';

  let { block, onremove } = $props();
  let showDeletePopup = $state(false);

  function deleteBlock() {
    showDeletePopup = false;
    onremove(block.id);
  }
</script>


<div class="block">
  
  <div class="toolbar flex margin-bottom-small">
    <div class="handle" use:dragHandle aria-label="Drag to move this block">
      <Move size="18" />
    </div>
    <div class="flex">
      <button class="bare">
        <Pencil size="18" />
      </button>
      <button class="bare delete" onclick={() => showDeletePopup = true}>
        <Trash size="18" />
      </button>
    </div>
  </div>

  {block.type}

</div>

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
    text-transform: capitalize;
  }

  .toolbar {
    justify-content: space-between;
  }

  .handle {
    cursor: grab;
    display: flex;
  }
</style>