<script>
	import { page } from '$app/state';

	let notFound = $derived(page.status === 404);
</script>


<div class="container">

  <div class="code">{page.status}</div>

  {#if notFound}
    <h1>We couldn't find that page</h1>
    <p>
      It may have moved, been unpublished, or the address may have a small typo in it.
    </p>
  {:else}
    <h1>Something went wrong</h1>
    <p>
      Sorry, we couldn't load this page. Please try again in a moment.
    </p>
  {/if}

  <p>
    <a href="/">Take me to the home page</a>
  </p>

</div>


<style>
	.code {
		font-family: var(--font-heading);
		font-size: clamp(5rem, 18vw, 9rem);
		line-height: 1;
		color: var(--color-border);
	}

	h1 {
		margin-top: 1rem;
	}

	p {
		max-width: 34rem;
		margin: 0 0 1rem;
	}
</style>