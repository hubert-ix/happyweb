<script>
  import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Tabs from '#lib/UI/Tabs.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import LogOut from '@lucide/svelte/icons/log-out';
	import FaceSlightlySmiling from '@lucide/svelte/icons/face-slightly-smiling';
	import CircleChevronRight from '@lucide/svelte/icons/circle-chevron-right';
	import '#lib/styles/admin.css';

  let { data, children } = $props();
  let segment = $derived(page.url.pathname.split('/')[2] ?? null);
	let tabs = [
		{ label: 'Your pages', href: '/admin', value: "" },
		{ label: 'Sumptuous site settings', href: '/admin/settings', value: "settings" }
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


<div class="admin">

	<header>
		<div class="container header">
			<div class="happyweb flex">
				<FaceSlightlySmiling />
				HappyWeb <span>Admin</span>
			</div>
			<div class="user flex">
				Hello, {data.user.first_name}
				<a href="/" data-tip="Back to your site" data-tip-direction="below">
					<CircleChevronRight />
				</a>
			</div>
		</div>
	</header>

	<main>
		{#if segment != 'page'}
			<div class="container padding">
				<h1>
					<img src="/images/favicon.ico" />
					Amazing admin dashboard
				</h1>
				<Tabs {tabs} {segment} />
				{@render children?.()}
			</div>
		{:else}
			{@render children?.()}
		{/if}
	</main>

</div>


<style>
	header {
		padding: 1rem 0;
		border-bottom: solid 2px #eee;
		background: #f4f4ee;
		position: fixed;
		top: 0;
		display: block;
		width: 100%;
		z-index: 10;
	}

	.container.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.happyweb {
		font-weight: 600;
		color: #000;
		gap: 0.5rem;
	}

	.happyweb span {
		font-weight: 400;;
		color: #999;
	}

	.user a {
		display: flex;
	}
</style>