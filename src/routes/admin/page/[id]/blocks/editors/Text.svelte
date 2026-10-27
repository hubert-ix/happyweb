<script>
  import FormItem from '#lib/forms/FormItem.svelte';
  import RichTextInput from '#lib/forms/RichTextInput.svelte';

  let { data = $bindable() } = $props();
</script>


<FormItem label="Text" id="block-text">
  <RichTextInput name="block-text" bind:value={data.text} />
</FormItem>