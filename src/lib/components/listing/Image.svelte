<script lang="ts">
	import { cn } from '$lib/utils';
	import { CrossCircled } from 'radix-icons-svelte';

	let { url }: { url: string } = $props();

	let expanded = $state(false);
	let zoomed = $state(false);

	let imageState: HTMLImageElement | undefined = $state(undefined);
	let originalHeight = 0;
	let originalWidth = 0;

	$effect(() => {
		if (originalHeight == 0 && originalWidth == 0) {
			if (!imageState) return;

			const { height, width } = imageState;
			originalHeight = height;
			originalWidth = width;
			console.log('saving original');
		}
	});

	$effect(() => {
		if (!imageState) return;

		if (zoomed) {
			imageState.height = originalHeight * 1.5;
			imageState.width = originalWidth * 1.5;
		} else {
			imageState.height = originalHeight;
			imageState.width = originalWidth;
		}
	});

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
{#if !expanded}
	<div class="flex items-center justify-center">
		<img src={url} class="max-h-[600px] cursor-pointer object-contain" onclick={handleExpand} />
	</div>
{:else}
	<div
		class="fixed left-4 top-4 z-30 h-fit w-fit cursor-pointer opacity-40 hover:opacity-100"
		onclick={handleExpand}
	>
		<CrossCircled size={50} />
	</div>
	<div
		onclick={handleExpand}
		class="fixed left-0 top-0 z-20 flex h-screen w-screen items-center overflow-auto bg-background"
	>
		<img
			bind:this={imageState}
			class={cn('m-auto ', zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in')}
			src={url}
			onclick={(e) => {
				e.stopPropagation();
				zoomed = !zoomed;
			}}
		/>
	</div>
{/if}
