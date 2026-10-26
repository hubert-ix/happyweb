<script>
  import { fade } from "svelte/transition";
  import { getLayout, defaultLayout } from "#lib/layouts.js";
  import FormItem from "#lib/forms/FormItem.svelte";
  import TextInput from "#lib/forms/TextInput.svelte";
  import Modal from "#lib/UI/Modal.svelte";
  import Button from "#lib/UI/Button.svelte";
  import Settings from '@lucide/svelte/icons/settings';
  import Move from '@lucide/svelte/icons/move';
  import Trash from '@lucide/svelte/icons/trash';
  import Column from "./Column.svelte";
  import ColumnsLayout from "./ColumnsLayout.svelte";

  let { section, page, remove } = $props();
  let showDeletePopup = $state(false);
  let layout = $derived(section.layout ?? defaultLayout);
  let current = $derived(getLayout(layout));
  let visibleColumns = $derived(
    [...section.columns]
      .sort((a, b) => a.index - b.index)
      .slice(0, current.columns)
  );

  function deleteSection() {
    showDeletePopup = false;
    remove(section.id);
  }
</script>


<div class="section" transition:fade>

  <div class="toolbar flex margin-bottom-small">
    <Move />
    <Settings />
  </div>

  <FormItem id="heading">
    <TextInput name="heading" bind:value={section.heading} placeholder="You can include an optional heading for the section" />
  </FormItem>

  <FormItem id="intro">
    <TextInput name="intro" controlType="textarea" placeholder="Optional intro text" bind:value={section.intro} />
  </FormItem>

  <ColumnsLayout bind:value={layout} />

  <div class="columns" style:grid-template-columns={current.template}>
    {#each visibleColumns as column (column.id)}
      <Column {column} />
    {/each}
  </div>

  <div class="footer flex">
    <button onclick={() => showDeletePopup = true}>
      <Trash />
    </button>
  </div>

</div>

{#if showDeletePopup}
  <Modal>
    <p>Are you sure you want to delete this great section?<br />This cannot be undone</p>
    <div class="flex">
      <Button class="delete" onclick={deleteSection}>Yes, delete</Button>
      <Button class="cancel" onclick={() => showDeletePopup = false}>Oh no!</Button>
    </div>
  </Modal>
{/if}


<style>
  .section {
    border: solid 1px #ccc;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 2rem;
    overflow: hidden;
  }

  .toolbar {
    justify-content: space-between;
    color: #999
  }

  .columns {
    display: grid;
    gap: 2rem;
  }

  .footer {
    justify-content: end;
  }

  button {
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-error);
  }
</style>