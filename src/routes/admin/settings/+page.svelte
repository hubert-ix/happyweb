<script>
  import FileInput from "#lib/forms/FileInput.svelte";
  import FormItem from "#lib/forms/FormItem.svelte";
  import TextInput from "#lib/forms/TextInput.svelte";
  import Button from "#lib/UI/Button.svelte";
</script>


<div class="form">

  <FormItem label="Website name" description="This is what is displayed in Google, and also at the top of the browser">
    <TextInput />
  </FormItem>

  <FormItem label="Header logo" description="This image will go at the left side of the navigation bar at the top">
    <FileInput />
  </FormItem>

  <Button>Save settings</Button>

</div>


<style>
  .form {
    max-width: 32rem;
  }
</style>