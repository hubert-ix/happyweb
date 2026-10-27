<script>
  import { fade, slide } from "svelte/transition";
  import { getLayout, defaultLayout, tracks } from "#lib/layouts.js";
  import { updateSection } from "#lib/sections.remote.js";
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

  let { section, page, onremove } = $props();
  let showDeletePopup = $state(false);
  let showSettings = $state(false);
  let layout = $derived(section.layout ?? defaultLayout);
  let current = $derived(getLayout(layout));
  let columns = $derived([...section.columns].sort((a, b) => a.index - b.index));

  function deleteSection() {
    showDeletePopup = false;
    onremove(section.id);
  }

  async function saveLayout(key) {
    section.layout = key;
    await saveSectionKey('layout');
  }

  async function saveSectionKey(key) {
    await updateSection({ id: section.id, values: { [key]: section[key] } });
  }
</script>


<div class="section" transition:fade>

  <div class="toolbar flex margin-bottom-small">
    <Move />
    <div class="flex">
      <button class="bare" data-tip="Show settings for this section" onclick={() => showSettings = !showSettings}>
        <Settings />
      </button>
      <button class="bare delete" data-tip="Delete this section" onclick={() => showDeletePopup = true}>
        <Trash />
      </button>
    </div>
  </div>

  {#if showSettings}
    <div class="options flex margin-bottom-medium" transition:slide>
      <Toggle bind:checked={section.hidden} label="Hide this section" onchange={() => saveSectionKey("hidden")}/>
      <Toggle bind:checked={section.center_heading} label="Center the heading" onchange={() => saveSectionKey("center_heading")} />
    </div>
  {/if}

  <FormItem label="Heading" id="heading">
    <TextInput name="heading" bind:value={section.heading} placeholder="Optional heading" onFinishedTyping={() => saveSectionKey("heading")} />
  </FormItem>

  <FormItem label="Intro" id="intro">
    <TextInput name="intro" controlType="textarea" placeholder="Optional intro text" bind:value={section.intro} onFinishedTyping={() => saveSectionKey("intro")} />
  </FormItem>

  <FormItem label="Layout">
    <LayoutPicker bind:value={layout} onchange={saveLayout} />
  </FormItem>

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