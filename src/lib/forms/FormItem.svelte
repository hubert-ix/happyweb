<script>
  let { label, id = undefined, description = undefined, errorMessage, children } = $props();
</script>


<div class="form-item">

  <label for={id}>
    {label}
  </label>

  {#if description}
    <div class="description">
      {description}
    </div>
  {/if}

  <div class="input">
    {@render children?.()}
  </div>

  {#if errorMessage}
		<div class="error">
      {errorMessage}
    </div>
	{/if}

</div>


<style>
  .form-item {
    margin-bottom: 1.5rem;
  }

  label {
		display: block;
    color: #555;
	}

  .description {
    color: #888;
  }

  .input {
    margin-top: 0.1rem;
  }

  .error {
    margin-top: 0.5rem;
  }
</style>