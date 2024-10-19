<script lang="ts">
	import { cn } from '$lib/utils';
	import ExpandedImage from './ExpandedImage.svelte';

	let { url, class: className }: { url: string; class?: string } = $props();

	let expanded = $state(false);
	let error = $state(false);

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

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class={cn('flex items-center justify-center', className)}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->

	<img
		alt=""
		class={cn('max-h-fit cursor-pointer object-contain md:max-h-[600px]')}
		loading="lazy"
		src={url}
		onclick={handleExpand}
		onerror={() => (error = true)}
	/>
	<div class={cn('flex h-20 items-center text-xl', !error && 'hidden')}>
		<span class="p-1.5 text-zinc-300">Error loading image</span>
		<button
			class="rounded-md p-1 text-zinc-400 hover:bg-accent"
			onclick={() => {
				const img = new Image();
				img.src = url;
				error = false;
			}}>Retry</button
		>
	</div>
</div>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
{#if expanded}
	<ExpandedImage {url} onClick={handleExpand} />
{/if}
