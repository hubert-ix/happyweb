<script>
  import { invalidate } from '$app/navigation';
  import { slide } from "svelte/transition";
  import { flip } from 'svelte/animate';
  import { dragHandleZone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
  import { addBlock, deleteBlock, reorderBlocks } from "#lib/blocks.remote.js";
  import { blockTypes } from './blocks/index.js';
  import Button from "#lib/UI/Button.svelte";
  import Modal from "#lib/UI/Modal.svelte";
  import Plus from '@lucide/svelte/icons/plus';
  import Trash from '@lucide/svelte/icons/trash';
  import Block from "./Block.svelte";

  let { column } = $props();
  let adding = $state(false);
  let showCreatePopup = $state(false);
  let justAddedBlockId = $state(null);
  let blocks = $derived(column.blocks ?? []);
  const flipDurationMs = 200;

  async function createBlock(type) {
    showCreatePopup = false;
    adding = true;
    try {
      const { block } = await addBlock({ columnId: column.id, type });
      justAddedBlockId = block.id;
      blocks = [...blocks, block];
    } 
    catch (e) {
      console.error(e);
      alert('Sorry, the block could not be added.');
    } 
    finally {
      adding = false;
    }
  }

  async function removeBlock(blockId) {
    blocks = blocks.filter((s) => s.id !== blockId);
		await deleteBlock(blockId);
		await invalidate("page");
  }

  function replaceBlock(updatedBlock) {
    blocks = blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
  }

  // while dragging: let the library rearrange the list live
  function handleConsider(e) {
    blocks = e.detail.items;
  }

  // on drop: fires in both the source and the target column, each saves its own order
  async function handleFinalize(e) {
    blocks = e.detail.items;
    try {
      await reorderBlocks({ columnId: column.id, blockIds: blocks.map((b) => b.id) });
    } 
    catch (err) {
      console.error(err);
      alert('Sorry, the new order could not be saved.');
      invalidate('page');
    }
  }
</script>


<div class="column">

  <div class="blocks"
    use:dragHandleZone={{
      items: blocks,
      type: `section-${column.section_id}`,   // only columns of the same section
      flipDurationMs,
      dropTargetStyle: {}
    }}
    onconsider={handleConsider}
    onfinalize={handleFinalize}
  >
    {#each blocks as block (block.id)}
      <div animate:flip={{ duration: flipDurationMs }}>
        {#if block[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
          <div class="placeholder"></div>
        {:else}
          <Block 
            {block} 
            onremove={removeBlock} 
            onupdate={replaceBlock} 
            autoEdit={block.id === justAddedBlockId}
            onautoedited={() => justAddedBlockId = null}
          />
        {/if}
      </div>
    {/each}
  </div>
  
  <Button class="columns" disabled={adding} onclick={() => showCreatePopup = true}>
		<Plus /> 
		{adding ? "Adding..." : "Add something"}
	</Button>

</div>

{#if showCreatePopup}
  <Modal showCloseButton={true} close={() => showCreatePopup = false}>
    <h3>What kind of content shall we add?</h3>
    <div class="add-block-buttons">
      {#each Object.entries(blockTypes) as [key, type]}
        <button class="bare" onclick={() => createBlock(key)}>{type.label}</button>
      {/each}
    </div>
  </Modal>
{/if}


<style>
  .column {
    min-height: 10rem;
    position: relative;
  }

  .add-block-buttons {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .add-block-buttons button {
    text-align: left;
    text-decoration: underline;
    text-underline-position: under;
    color: #13587a;
  }

  .blocks {
    min-height: 4rem;
  }

  .placeholder {
    height: 4rem;
    margin-bottom: 1rem;
    border: dashed 2px #e36f6f;
    border-radius: 0.3rem;
    background: rgb(227 111 111 / 0.06);
  }
</style>