<script>
  import FormItem from '#lib/forms/FormItem.svelte';
  import FileInput from '#lib/forms/FileInput.svelte';
  import TextInput from '#lib/forms/TextInput.svelte';

  let { data = $bindable() } = $props();
  const uid = $props.id(); // unique ids, so several image blocks on one page don't clash
</script>


<FormItem id="{uid}-url">
  <FileInput name="block-image" id="{uid}-url" folder="images" bind:value={data.url} includeLibrary={true} />
</FormItem>

<FormItem label="Image description" id="{uid}-alt">
  <TextInput name="block-alt" id="{uid}-alt" bind:value={data.alt} />
</FormItem>