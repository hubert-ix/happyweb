<script>
	import { fade, scale } from 'svelte/transition';
	import { snackbar } from './Snackbar.svelte.js';
</script>


<div class="snackbar-region" role="status" aria-live="polite">
	{#key snackbar.current?.id}
		{#if snackbar.current}
			<div class="snackbar {snackbar.current.type}" in:scale|global out:fade|global={{ duration: 200 }}>
				<span>{snackbar.current.text}</span>
				<button type="button" onclick={() => snackbar.hide()} aria-label="Dismiss">&times;</button>
			</div>
		{/if}
	{/key}
</div>


<style>
	.snackbar-region {
    position: fixed;
    left: 20px;
    bottom: 20px;
    z-index: 10;
    display: grid;
  }

  .snackbar {
    grid-area: 1 / 1;
    color: #fff;
    display: flex;
    justify-content: space-between;
    text-align: left;
    padding: 12px 16px;
    width: 350px;
    flex-grow: 1;
    flex-wrap: wrap;
    align-items: center;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    border-radius: 4px;
    margin-top: 12px;
    background-color: rgb(50, 50, 50);
    box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.05), 0px 6px 5px 0px rgba(0,0,0,0.05), 0px 1px 5px 0px rgba(0,0,0,0.05);
  }

	button {
		background: none;
		border: 0;
		color: inherit;
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
		opacity: 0.7;
		padding: 0;
	}

	button:hover {
		opacity: 1;
	}
</style>