<script>
  import { layouts } from '#lib/layouts.js';

  let { value = $bindable(), onchange } = $props();

  function select(key) {
    if (key === value) return;
    value = key;
    onchange?.(key);
  }
</script>


<div class="layout-picker">
  {#each layouts as layout (layout.key)}
    <button
      type="button"
      class:active={value === layout.key}
      aria-pressed={value === layout.key}
      title={layout.label}
      aria-label={layout.label}
      onclick={() => select(layout.key)}
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
    gap: 1rem;
  }

  button {
    padding: 0.4rem;
    background: #fff;
    border: solid 1px #ccc;
    border-radius: 0.3rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }

  button.active {
    border-color: #e36f6f;
  }

  button:hover {
    transform: translateY(-2px);
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