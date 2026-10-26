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
    color: #000;
	}

  .description {
    color: #de78ba;
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }

  .input {
    margin-top: 0.1rem;
  }

  .error {
    margin-top: 0.5rem;
  }
</style>