<script lang="ts">
	import { cn } from '$lib/utils';
	import Spinner from '../layout/Spinner.svelte';
	import ExpandedImage from './ExpandedImage.svelte';

	let { url, class: className }: { url: string; class?: string } = $props();

	let expanded = $state(false);
	let error = $state(false);
	let loading = $state(false);

	const handleExpand = () => {
		expanded = !expanded;

		const body = document.querySelector('body');
		if (body) body.style.overflow = expanded ? 'hidden' : 'auto';
	};
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.code == 'Escape' && expanded) handleExpand();
	}}
/>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class={cn('flex items-center justify-center', className)}>
	{#if error}
		<div class="flex h-20 flex-col items-center text-xl">
			<p class="p-1.5 text-zinc-300">Error loading image</p>
			<button
				class="rounded-md p-1 text-zinc-400 hover:bg-secondary"
				onclick={() => {
					const img = new Image();
					img.onerror = () => (error = true);
					img.onload = () => (loading = false);
					img.src = url;
					loading = true;
					error = false;
				}}>Retry</button
			>
		</div>
	{:else if loading}
		<Spinner class="h-20" />
	{:else}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<img
			alt=""
			class="max-h-fit cursor-pointer object-contain md:max-h-[600px]"
			loading="lazy"
			src={url}
			onclick={handleExpand}
			onerror={() => (error = true)}
			onload={() => (loading = false)}
		/>
	{/if}
</div>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
{#if expanded}
	<ExpandedImage {url} onClick={handleExpand} />
{/if}
