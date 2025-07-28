<script lang="ts">
	import { setSiteScrollable } from '$lib';
	import { cn } from '$lib/utils';
	import Spinner from '../layout/Spinner.svelte';
	import ExpandedImage from './ExpandedImage.svelte';

	let { url, blur, class: className }: { url: string; blur?: boolean; class?: string } = $props();

	let blurred = $state(blur ?? false);
	let expanded = $state(false);
	let error = $state(false);
	let loading = $state(false);

	const handleClick = () => {
		if (blurred) return (blurred = false);

		expanded = !expanded;
		setSiteScrollable(!expanded);
	};
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.code == 'Escape' && expanded) handleClick();
	}}
/>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={cn('mx-auto flex h-fit w-full cursor-pointer  justify-center', className)}
	onclick={handleClick}
>
	{#if error}
		<div class="flex flex-col items-center">
			<div class="mx-auto flex h-fit items-center gap-2 text-xl">
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
			<a href={url}> {url}</a>
		</div>
	{:else if loading}
		<Spinner class="h-20" />
	{:else}
		<img
			alt=""
			class={cn('max-h-[600px] object-contain', blurred && 'blur-xl')}
			src={url}
			onerror={() => (error = true)}
			onload={() => (loading = false)}
		/>
	{/if}
</div>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
{#if expanded}
	<ExpandedImage {url} onClick={handleClick} />
{/if}
