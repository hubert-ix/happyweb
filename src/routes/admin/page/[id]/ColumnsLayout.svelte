<script>
  import { layouts } from '#lib/layouts.js';

  let { value = $bindable() } = $props();
</script>


<div class="layout-picker">
  {#each layouts as layout (layout.key)}
    <button
      type="button"
      class:active={value === layout.key}
      aria-pressed={value === layout.key}
      title={layout.label}
      aria-label={layout.label}
      onclick={() => value = layout.key}
    >
      <span class="icon" style:grid-template-columns={layout.template}>
        {#each { length: layout.columns } as _}
          <span></span>
        {/each}
      </span>
    </button>
  {/each}
</div>


<style>
  .layout-picker {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  button {
    padding: 0.4rem;
    background: none;
    border: solid 1px #ccc;
    border-radius: 0.3rem;
    cursor: pointer;
  }

  button.active {
    border-color: #e36f6f;
  }

  .icon {
    display: grid;
    gap: 3px;
    width: 60px;
    height: 34px;
  }

  .icon span {
    background: #ccc;
    border-radius: 2px;
  }

  button.active .icon span {
    background: #e36f6f;
  }
</style>