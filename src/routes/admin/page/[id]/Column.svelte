<script>
  import Button from "#lib/UI/Button.svelte";
  import CirclePlus from '@lucide/svelte/icons/circle-plus';
  import Trash from '@lucide/svelte/icons/trash';

  let { column } = $props();
  let adding = $state(false);
</script>


<div class="column">
  
  <Button class="columns" disabled={adding}>
		<CirclePlus /> 
		{adding ? "Adding..." : "Add some content"}
	</Button>

  <div class="footer flex">
    <button class="bare delete" onclick={() => showDeletePopup = true}>
      <Trash />
    </button>
  </div>

</div>


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
</style>