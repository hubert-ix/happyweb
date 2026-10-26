<script>
  import { invalidate } from '$app/navigation';
  import { slide } from "svelte/transition";
  import { addBlock, deleteBlock } from "#lib/blocks.remote.js";
  import Button from "#lib/UI/Button.svelte";
  import Modal from "#lib/UI/Modal.svelte";
  import CirclePlus from '@lucide/svelte/icons/circle-plus';
  import Trash from '@lucide/svelte/icons/trash';
  import Block from "./Block.svelte";

  let { column } = $props();
  let adding = $state(false);
  let showCreatePopup = $state(false);
  let blocks = $derived(column.blocks ?? []);

  async function createBlock(type) {
    showCreatePopup = false;
    adding = true;
    try {
      const { block } = await addBlock({ columnId: column.id, type });
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
</script>


<div class="column">

  {#each blocks as block (block.id)}
    <Block {block} onremove={removeBlock} />
  {/each}
  
  <Button class="columns" disabled={adding} onclick={() => showCreatePopup = true}>
		<CirclePlus /> 
		{adding ? "Adding..." : "Add something"}
	</Button>

</div>

{#if showCreatePopup}
  <Modal showCloseButton={true} close={() => showCreatePopup = false}>
    <h3>What kind of content shall we add?</h3>
    <div class="add-block-buttons">
      <button class="bare" onclick={() => createBlock("text")}>Some text</button>
      <button class="bare" onclick={() => createBlock("image")}>An image</button>
      <button class="bare" onclick={() => createBlock("navigation")}>A navigation block</button>
    </div>
  </Modal>
{/if}


<style>
  .column {
    border: solid 1px #ccc;
    background: #fff;
    border-radius: 0.5rem;
    padding: 1rem;
    min-height: 10rem;
    position: relative;
  }

  .footer {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
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
    color: #337a13;
  }
</style>