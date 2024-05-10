<script lang="ts">
	import { cn } from '$lib/utils';

	let { url }: { url: string } = $props();

	let expanded = $state(false);
	let zoomed = $state(false);

	let imageState: HTMLImageElement | undefined = $state(undefined);
	let originalHeight = 0;
	let originalWidth = 0;

	$effect(() => {
		if (originalHeight * originalWidth !== 0) return;

		if (!imageState) return;

		const { height, width } = imageState;
		originalHeight = height;
		originalWidth = width;
	});

	const clamp = (v: number, l: number, h: number) => (v < l ? l : v > h ? h : v);

	const getAdjustedImageDimensions = (height: number, width: number, zoomed: boolean) => {
		const maxHeight = document.documentElement.clientHeight;
		const maxWidth = document.documentElement.clientWidth;

		const ZOOM_RATIO = zoomed ? 1.5 : 1;
		const ZOOM_OUT_SCREEN_RATIO = 0.8;

		if (height >= width) {
			const clampedHeight = clamp(height, height, maxHeight * ZOOM_OUT_SCREEN_RATIO) * ZOOM_RATIO;
			return { height: clampedHeight, width: (clampedHeight / height) * width };
		} else {
			const clampedWidth = clamp(width, width, maxWidth * ZOOM_OUT_SCREEN_RATIO) * ZOOM_RATIO;
			return { height: (clampedWidth / width) * height, width: clampedWidth };
		}
	};

	$effect(() => {
		if (!imageState || originalHeight * originalWidth === 0) return;

		const { height, width } = getAdjustedImageDimensions(originalHeight, originalWidth, zoomed);
		imageState.height = height;
		imageState.width = width;
	});

	const handleExpand = () => {
		expanded = !expanded;
		zoomed = false;

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
		<img
			src={url}
			class="max-h-fit cursor-pointer object-contain md:max-h-[600px]"
			onclick={handleExpand}
		/>
	</div>
{:else}
	<div
		onclick={handleExpand}
		class="fixed left-0 top-0 z-20 flex h-[100lvh] w-[100lvw] items-center overflow-auto bg-background"
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
