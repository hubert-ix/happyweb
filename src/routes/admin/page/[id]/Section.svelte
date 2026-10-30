<script>
  import { fade, slide } from "svelte/transition";
  import { getLayout, defaultLayout, tracks } from "#lib/layouts.js";
  import { updateSection } from "#lib/sections.remote.js";
  import FormItem from "#lib/forms/FormItem.svelte";
  import TextInput from "#lib/forms/TextInput.svelte";
  import RichTextInput from "#lib/forms/RichTextInput.svelte";
  import Modal from "#lib/UI/Modal.svelte";
  import Button from "#lib/UI/Button.svelte";
  import Toggle from "#lib/UI/Toggle.svelte";
  import FileInput from "#lib/forms/FileInput.svelte";
  import Settings from '@lucide/svelte/icons/settings';
  import Move from '@lucide/svelte/icons/move';
  import Trash from '@lucide/svelte/icons/trash';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Column from "./Column.svelte";
  import LayoutPicker from "./LayoutPicker.svelte";

  let { section, page, onremove } = $props();
  let showDeletePopup = $state(false);
  let showSettings = $state(false);
  let showIntro = $state(false);
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
    <div class="options margin-bottom-medium" transition:slide>
      <h4>Options for this section</h4>
      <FormItem label="Background image" id="background">
        <FileInput name="block-image" folder="images" bind:value={section.background_url} onchange={() => saveSectionKey("background_url")} />
      </FormItem>
      <div class="flex">
        <Toggle bind:checked={section.hidden} label="Hide this section" onchange={() => saveSectionKey("hidden")}/>
        <Toggle bind:checked={section.center_heading} label="Center the heading" onchange={() => saveSectionKey("center_heading")} />
      </div>
    </div>
  {/if}

  <FormItem label="Heading" id="heading">
    <TextInput name="heading" bind:value={section.heading} placeholder="Optional heading" onFinishedTyping={() => saveSectionKey("heading")} />
  </FormItem>

  <div class="intro margin-bottom-small">
    <button class="bare" class:opened={showIntro} onclick={() => showIntro = !showIntro}>
      <div class="icon">
        <ChevronRight />
      </div>
      Optional intro
    </button>

    {#if showIntro}
      <div transition:slide>
        <RichTextInput name="intro" placeholder="Optional intro text" bind:value={section.intro} onFinishedTyping={() => saveSectionKey("intro")} />
      </div>
    {/if}
  </div>

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

  .intro button {
    color: #d8716f;
    text-decoration: underline;
    text-underline-position: under;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .intro button .icon {
    transition: transform 0.3s;
  }

  .intro button.opened .icon {
    transform: rotate(90deg);
  }

  .toolbar {
    justify-content: space-between;
  }

  .options {
    border: solid 1px #ccc;
    background: #fff;
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .columns {
    display: grid;
    margin-inline: -1rem;
    transition: grid-template-columns 0.4s ease;
  }

  .track {
    transition: opacity 0.3s ease;
  }

  .track.hidden {
    opacity: 0;
  }

  .pad {
    padding-inline: 1rem;   /* replaces gap: 2rem */
  }
</style>