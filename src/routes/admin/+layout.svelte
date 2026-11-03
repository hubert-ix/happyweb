<script>
  import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Tabs from '#lib/UI/Tabs.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import '#lib/styles/admin.css';

  let { children } = $props();
  let segment = $derived(page.url.pathname.split('/')[2] ?? null);
	let tabs = [
		{ label: 'Your pages', href: '/admin', value: "" },
		{ label: 'Sumptuous settings', href: '/admin/settings', value: "settings" }
	];

	onMount(() => {
    function closeTip(e) {
      const el = e.target.closest?.('[data-tip]');
      if (!el) return;
      el.classList.add('tip-closed');
      el.addEventListener('pointerleave', () => el.classList.remove('tip-closed'), { once: true });
    }
    document.addEventListener('pointerdown', closeTip, true);
    return () => document.removeEventListener('pointerdown', closeTip, true);
  });
</script>


<div class="container padding admin">
	<div class="back">
		<a href="/">
			<ChevronLeft />
			Back to your site
		</a>
	</div>
	<h1>Amazing admin dashboard</h1>
  <Tabs {tabs} {segment} />
  {@render children?.()}
</div>


<style>
	.back {
		position: relative;
		top: 2.5rem;
	}

	.back a {
		text-decoration: none;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: #6899be;
	}
</style>