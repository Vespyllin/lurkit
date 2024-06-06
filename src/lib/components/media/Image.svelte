<script lang="ts">
	import { cn } from '$lib/utils';
	import ExpandedImage from './ExpandedImage.svelte';

	let { url, class: className }: { url: string; class?: string } = $props();

	let expanded = $state(false);

	const handleExpand = () => {
		expanded = !expanded;

		const body = document.querySelector('body');
		if (body) body.style.overflow = expanded ? 'hidden' : 'auto';
	};
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.code == 'Escape' && expanded) handleExpand();
	}}
/>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class={cn('flex items-center justify-center', className)}>
	<img
		src={url}
		class="max-h-fit cursor-pointer object-contain md:max-h-[600px]"
		onclick={handleExpand}
	/>
</div>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if expanded}
	<ExpandedImage {url} onClick={handleExpand} />
{/if}
