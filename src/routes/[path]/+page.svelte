<script>
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { getLayout, defaultLayout, tracks } from "#lib/layouts.js";
  import { blockTypes } from '../admin/page/[id]/blocks/index.js';
  import Pencil from '@lucide/svelte/icons/pencil';

  let { data } = $props();
</script>


{#if data.user}
  <div class="container edit-page">
    <button class="bare" data-tip="Edit this page" onclick={() => goto('/admin/page/' + data.page?.id + '?returnURL=/' + data.page.path)}>
      <Pencil />
    </button>
  </div>
{/if}

{#each data.page.sections as section}
  {@const layout = getLayout(section.layout)}
  <section in:fade>
    <div class="container">
      {#if section.heading}
        <h2 class:centered={section.center_heading}>{section.heading}</h2>
      {/if}
      {#if section.intro}
        <div class="intro margin-bottom-medium">
          {section.intro}
        </div>
      {/if}
      <div class="columns layout-{section.layout}">
        {#each section.columns.slice(0, layout.columns) as column (column.id)}
          <div class="column">
            {#each column.blocks as block}
              {@const Display = blockTypes[block.type]?.Display}
              {#if Display}
                <div class="block">
                  <Display data={block.data} />
                </div>
              {/if}
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </section>
{/each}


<style>
  .edit-page {
    position: absolute;
    top: 5rem;
    left: 0;
    right: 0;
    text-align: right;
  }

  .columns {
    display: grid;
    gap: 4rem;
  }

  .columns.layout-2-equal {
    grid-template-columns: 1fr 1fr;
  }

  .columns.layout-2-wide-left {
    grid-template-columns: 2fr 1fr;
  }

  .columns.layout-2-wide-right {
    grid-template-columns: 1fr 2fr;
  }

  .columns.layout-3 {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .columns.layout-4 {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  section {
    background: #f4f4f4;
    border-bottom: solid 1px #efefef;
    padding: 3rem 0;
  }

  section:nth-child(even) {
    background: #fafafa;
  }

  .block {
    margin-bottom: 2rem;
  }

  @media (max-width: 990px) {
    .columns.layout-2-equal {
      grid-template-columns: 1fr;
    }

    .columns.layout-2-wide-left {
      grid-template-columns: 1fr;
    }

    .columns.layout-2-wide-right {
      grid-template-columns: 2fr;
    }

    .columns.layout-3 {
      grid-template-columns: 1fr 1fr;
    }

    .columns.layout-4 {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 700px) {
    .columns.layout-3 {
      grid-template-columns: 1fr;
    }

    .columns.layout-4 {
      grid-template-columns: 1fr;
    }
  }
</style>