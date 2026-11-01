<script>
  import FormItem from '#lib/forms/FormItem.svelte';
  import FileInput from '#lib/forms/FileInput.svelte';
  import TextInput from '#lib/forms/TextInput.svelte';
  import RichTextInput from '#lib/forms/RichTextInput.svelte';

  let { data = $bindable() } = $props();
</script>


<FormItem label="Quote" id="block-text">
  <RichTextInput name="block-text" bind:value={data.text} />
</FormItem>

<FormItem label="Author (optional)" id="block-author">
  <TextInput name="block-author" bind:value={data.author} />
</FormItem>