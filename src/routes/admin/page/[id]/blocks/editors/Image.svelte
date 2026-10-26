<script>
  import FormItem from '#lib/forms/FormItem.svelte';
  import FileInput from '#lib/forms/fileInput.svelte';
  import TextInput from '#lib/forms/TextInput.svelte';

  let { data = $bindable() } = $props();
</script>


<FormItem label="Upload an image" id="block-url">
  <FileInput name="block-image" folder="images" bind:value={data.url} />
</FormItem>

<FormItem label="Image description" id="block-alt">
  <TextInput name="block-alt" bind:value={data.alt} />
</FormItem>