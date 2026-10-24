<script>
  import Info from '@lucide/svelte/icons/info';
	import CirclePlus from '@lucide/svelte/icons/circle-plus';
	import Button from '#lib/UI/Button.svelte';
  
  let { page } = $props();
</script>


<div class="help full margin-top-medium">
	<div class="icon">
    <Info />
  </div>
	This is where you build the content of your page.<br />
	You can have one or several rows, and each row can have one or several columns (each row also has an optional heading)<br />
	Then each column has some content inside it.
</div>

<Button>
	<CirclePlus />
	Add a new row
</Button>
