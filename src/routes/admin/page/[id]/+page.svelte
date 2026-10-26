<script>
	import { invalidate } from '$app/navigation';
	import { addSection, deleteSection } from '#lib/sections.remote.js';
  import Info from '@lucide/svelte/icons/info';
	import CirclePlus from '@lucide/svelte/icons/circle-plus';
	import Button from '#lib/UI/Button.svelte';
  import Section from './Section.svelte';
  
  let { data } = $props();
	let adding = $state(false);
	let sections = $derived(data.page.sections);

	async function createSection() {
		adding = true;
		await addSection(data.page.id);
		await invalidate("page");
		adding = false;
	}

	async function removeSection(sectionId) {
		sections = sections.filter((s) => s.id !== sectionId);
		await deleteSection(sectionId);
		await invalidate("page");
	}
</script>


<div class="help full margin-bottom-medium">
	<div class="icon">
    <Info />
  </div>
	This is where you build the content of your page.<br />
	You can have one or several sections, and each section can have one or several columns (each section also has an optional heading)<br />
	Then each column has some content inside it.
</div>

{#each sections as section (section.id)}
	<Section page={data.page} {section} onremove={removeSection} />
{/each}

<div class="margin-bottom-medium">
	<Button onclick={createSection} disabled={adding}>
		<CirclePlus />
		{adding ? "Adding..." : "Add a new section"}
	</Button>
</div>