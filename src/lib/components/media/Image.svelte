<script lang="ts">
	import { cn } from '$lib/utils';
	import Spinner from '../layout/Spinner.svelte';
	import ExpandedImage from './ExpandedImage.svelte';

	let {
		url,
		blur: _blur,
		class: className
	}: { url: string; blur?: boolean; class?: string } = $props();

	let blur = $state(_blur ?? false);
	let expanded = $state(false);
	let error = $state(false);
	let loading = $state(false);

	const handleClick = () => {
		expanded = !expanded;

		const body = document.querySelector('body');
		if (body) body.style.overflow = expanded ? 'hidden' : 'auto';
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
	class={cn(
		'mx-auto flex h-[600px] max-h-fit w-full items-center justify-center overflow-hidden',
		className
	)}
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
		{#if blur}
			<button
				class="absolute z-10 mx-auto h-fit rounded-xl bg-background px-3 py-2 hover:bg-zinc-900"
				onclick={() => {
					blur = false;
				}}
			>
				Unblur Image
			</button>
		{/if}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<img
			alt=""
			class={cn(
				'max-h-[600px] grow cursor-pointer object-contain',
				blur && 'pointer-events-none blur-xl'
			)}
			src={url}
			onclick={handleClick}
			onerror={() => (error = true)}
			onload={() => (loading = false)}
		/>
	{/if}
</div>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
{#if expanded}
	<ExpandedImage {url} onClick={handleClick} />
{/if}
