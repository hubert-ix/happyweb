<script>
  import { fade, fly } from 'svelte/transition';
  import { blockTypes } from './blocks/index.js';
  import X from '@lucide/svelte/icons/x';
  import Button from '#lib/UI/Button.svelte';

  let { block, onsave, onclose } = $props();

  let type = $derived(blockTypes[block.type]);
  const original = JSON.stringify({ ...type?.defaults, ...block.data });
  let draft = $state(JSON.parse(original));
  let dirty = $derived(JSON.stringify(draft) !== original);
  let saving = $state(false);
  let errorMessage = $state('');

  function requestClose() {
    if (saving) return;
    if (dirty && !confirm('Discard your changes?')) return;
    onclose();
  }

  async function save() {
    saving = true;
    errorMessage = '';
    try {
      await onsave($state.snapshot(draft));
    } 
    catch (e) {
      console.error(e);
      errorMessage = "Your changes couldn't be saved. Try again.";
      saving = false;
    }
  }
</script>


<svelte:window onkeydown={(e) => e.key === 'Escape' && requestClose()} />

<div class="backdrop" transition:fade={{ duration: 200 }} onclick={requestClose}></div>

<aside class="panel" transition:fly={{ x: -600, duration: 250 }}>
  <header>
    <h3>Edit block</h3>
    <button class="bare" onclick={requestClose} aria-label="Close">
      <X />
    </button>
  </header>

  <div class="body">
    {#if type.Editor}
      <type.Editor bind:data={draft} />
    {:else}
      <p>This block type can't be edited yet.</p>
    {/if}
  </div>

  <footer>
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
    <div class="flex">
      <Button onclick={save} disabled={saving || !type.Editor}>
        {saving ? 'Saving…' : 'Save'}
      </Button>
      <Button class="cancel" onclick={requestClose} disabled={saving}>Cancel</Button>
    </div>
  </footer>
</aside>


<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 0.4);
    z-index: 20;
  }

  .panel {
    position: fixed;
    top: 0;
    left: 0;
    width: min(800px, 100%);
    height: 100dvh;
    background: #fff;
    box-shadow: 4px 0 16px rgb(0 0 0 / 0.15);
    z-index: 21;
    display: flex;
    flex-direction: column;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: solid 1px #eee;
  }

  header h3 {
    margin: 0;
  }

  .body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }

  footer {
    padding: 1rem 1.5rem;
    border-top: solid 1px #eee;
  }

  .error {
    color: var(--color-error);
    margin: 0 0 0.75rem;
  }
</style>