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
    margin-bottom: 2.25rem;
  }

  label {
    display: block;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.15rem;
  }

  .description {
    font-size: 0.875rem;
    line-height: 1.4;
    color: #64748b;
    margin-bottom: 0.6rem;
  }

  .input {
    margin-top: 0.1rem;
  }

  .error {
    margin-top: 0.5rem;
  }
</style>