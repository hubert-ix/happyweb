<script>
  import FileInput from "#lib/forms/FileInput.svelte";
  import FormItem from "#lib/forms/FormItem.svelte";
  import TextInput from "#lib/forms/TextInput.svelte";
</script>


<div class="form">

  <FormItem label="Website name">
    <TextInput />
  </FormItem>

  <FormItem label="Header logo">
    <FileInput />
  </FormItem>

</div>


<style>
  .form {
    max-width: 32rem;
  }
</style>