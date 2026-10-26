<script>
  import { fade, slide } from "svelte/transition";
  import { getLayout, defaultLayout, tracks } from "#lib/layouts.js";
  import FormItem from "#lib/forms/FormItem.svelte";
  import TextInput from "#lib/forms/TextInput.svelte";
  import Modal from "#lib/UI/Modal.svelte";
  import Button from "#lib/UI/Button.svelte";
  import Toggle from "#lib/UI/Toggle.svelte";
  import Settings from '@lucide/svelte/icons/settings';
  import Move from '@lucide/svelte/icons/move';
  import Trash from '@lucide/svelte/icons/trash';
  import Column from "./Column.svelte";
  import LayoutPicker from "./LayoutPicker.svelte";

  let { section, page, remove } = $props();
  let showDeletePopup = $state(false);
  let showSettings = $state(false);
  let layout = $derived(section.layout ?? defaultLayout);
  let current = $derived(getLayout(layout));
  let columns = $derived([...section.columns].sort((a, b) => a.index - b.index));

  function deleteSection() {
    showDeletePopup = false;
    remove(section.id);
  }
</script>


<div class="section" transition:fade>

  <div class="toolbar flex margin-bottom-small">
    <Move />
    <div class="flex">
      <button class="bare" onclick={() => showSettings = !showSettings}>
        <Settings />
      </button>
      <button class="bare delete" onclick={() => showDeletePopup = true}>
        <Trash />
      </button>
    </div>
  </div>

  {#if showSettings}
    <div class="options flex margin-bottom-medium" transition:slide>
      <Toggle checked={section.hidden} label="Hide this section" />
      <Toggle checked={section.center_heading} label="Center the heading" />
    </div>
  {/if}

  <FormItem id="heading">
    <TextInput name="heading" bind:value={section.heading} placeholder="Optional heading" />
  </FormItem>

  <FormItem id="intro">
    <TextInput name="intro" controlType="textarea" placeholder="Optional intro text" bind:value={section.intro} />
  </FormItem>

  <LayoutPicker bind:value={layout} />

  <div class="columns" style:grid-template-columns={tracks(current)}>
    {#each columns as column, i (column.id)}
      {@const hidden = i >= current.columns}
      <div class="track" class:hidden inert={hidden}>
        <div class="pad">
          <Column {column} />
        </div>
      </div>
    {/each}
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
    background: #f9f9f9;
    border-radius: 0.5rem;
    padding: 1rem 1rem 2rem;
    margin-bottom: 2rem;
    overflow: hidden;
  }

  .toolbar {
    justify-content: space-between;
  }

  .columns {
    display: grid;
    margin-inline: -1rem;
    transition: grid-template-columns 0.4s ease;
  }

  .track {
    overflow: hidden;
    transition: opacity 0.3s ease;
  }

  .track.hidden {
    opacity: 0;
  }

  .pad {
    padding-inline: 1rem;   /* replaces gap: 2rem */
  }
</style>