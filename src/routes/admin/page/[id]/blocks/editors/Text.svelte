<script>
  import FormItem from '#lib/forms/FormItem.svelte';
  import TextInput from '#lib/forms/TextInput.svelte';

  let { data = $bindable() } = $props();
</script>


<FormItem label="Text" id="block-text">
  <TextInput name="block-text" controlType="textarea" rows="12" bind:value={data.text} />
</FormItem>