<script>
  import { fade, slide } from "svelte/transition";
  import { getLayout, defaultLayout, tracks } from "#lib/layouts.js";
  import { updateSection } from "#lib/remote/sections.remote.js";
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
  import ChevronUp from '@lucide/svelte/icons/chevron-up';
  import Column from "./Column.svelte";
  import LayoutPicker from "./LayoutPicker.svelte";

  let { section = $bindable(), page, onremove } = $props();
  let showDeletePopup = $state(false);
  let showSettings = $state(false);
  let showIntro = $state(false);
  let showContent = $state(true);
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


<div class="section" class:hide-content={showContent} transition:fade>

  <div class="section-header flex">
    <div class="section-header-left flex">
      <div class="section-name">
        Section {section.index + 1}
      </div>
      <!--<Move />-->
      {#if section.hidden}
        <div class="hidden-label">
          Hidden section
        </div>
      {/if}
    </div>
    <div class="flex">
      <button class="bare" data-tip="Show settings for this section" onclick={() => showSettings = !showSettings}>
        <Settings />
      </button>
      <button class="bare delete" data-tip="Delete this section" onclick={() => showDeletePopup = true}>
        <Trash />
      </button>
      <button class="bare show-content" onclick={() => showContent = !showContent}>
        <ChevronUp />
      </button>
    </div>
  </div>

  {#if showContent}
    <div class="section-content" transition:slide>

      {#if showSettings}
        <div class="options margin-bottom-medium" transition:slide>
          <div class="options-left width-medium">
            <FormItem label="Anchor name" id="anchor-{section.id}" description="This is used to click on a link and jump to this section">
              <TextInput name="anchor-{section.id}" bind:value={section.anchor} />
            </FormItem>
            <FormItem label="Section background image" id="background">
              <FileInput name="block-image" folder="images" includeLibrary={true} inline={true} bind:value={section.background_url} onchange={() => saveSectionKey("background_url")} />
            </FormItem>
          </div>
          <div class="options-right">
            <FormItem>
              <Toggle bind:checked={section.hidden} label="Hide this section" onchange={() => saveSectionKey("hidden")}/>
            </FormItem>
            <FormItem>
              <Toggle bind:checked={section.center_heading} label="Center the heading" onchange={() => saveSectionKey("center_heading")} />
            </FormItem>
          </div>
        </div>
      {/if}

      <FormItem label="Heading" id="heading">
        <TextInput name="heading" class="full-width" bind:value={section.heading} placeholder="Optional heading" onFinishedTyping={() => saveSectionKey("heading")} />
      </FormItem>

      <!--
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
      -->

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
  {/if}

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
    background: #faf9f6; /* #f4f2ec */
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .section-header {
    justify-content: space-between;
    background: #e9e9e0;
    border-bottom: solid 1px #ddd;
    padding: 1rem;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  .section-name {
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    color: rgb(107, 102, 94);
  }

  .hidden-label {
    opacity: 0.4;
    font-style: italic;
  }

  .section-content {
    padding: 1rem 1rem 2rem;
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

  .options {
    border: solid 1px #cbd5e1;
    background: #fff;
    border-radius: 0.5rem;
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .options-right {
    padding-top: 1rem;
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

  button.show-content {
    transform:rotate(180deg);
    transition: transform 0.3s;
  }

  .hide-content button.show-content {
    transform:rotate(0deg);
  }
</style>