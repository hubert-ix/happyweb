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
    {@render children()}
  </div>

  {#if errorMessage}
		<div class="error">
      {errorMessage}
    </div>
	{/if}

</div>


<style>
  .form-item {
    margin-bottom: 1rem;
  }

  label {
		display: block;
	}

  .description {
    color: #888;
  }

  .input {
    margin-top: 0.5rem;
  }

  .error {
    margin-top: 0.5rem;
  }
</style>