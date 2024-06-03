<script lang="ts">
	import { Cross2 } from 'radix-icons-svelte';
	import { cn } from '$lib/utils';

	let { url, onClick }: { url: string; onClick?: () => void } = $props();

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

	$effect(() => {
		if (!imageState || originalHeight * originalWidth === 0) return;

		const { height, width } = getAdjustedImageDimensions(originalHeight, originalWidth, zoomed);
		imageState.height = height;
		imageState.width = width;
	});

	const clamp = (v: number, l: number, h: number) => (v < l ? l : v > h ? h : v);

	const getAdjustedImageDimensions = (height: number, width: number, zoomed: boolean) => {
		const screenHeight = document.documentElement.clientHeight;
		const screenWidth = document.documentElement.clientWidth;

		const ZOOM_RATIO = zoomed ? 1.5 : 1;
		const ZOOM_SCREEN_RATIO = 0.8;

		const imageClamp = (dimension: number, clampValue: number) =>
			zoomed ? clamp(dimension, clampValue, dimension) : clamp(dimension, dimension, clampValue);

		if (height >= width) {
			const clampedHeight = imageClamp(height * ZOOM_RATIO, screenHeight * ZOOM_SCREEN_RATIO);
			const adjustedWidth = (clampedHeight / height) * width;
			if (adjustedWidth > screenWidth * ZOOM_SCREEN_RATIO) {
				return {
					height: ((screenWidth * ZOOM_SCREEN_RATIO) / width) * height,
					width: screenWidth * ZOOM_SCREEN_RATIO
				};
			}
			return { height: clampedHeight, width: adjustedWidth };
		} else {
			const clampedWidth = zoomed ? screenWidth * ZOOM_SCREEN_RATIO : screenWidth * 0.6;

			return { height: (clampedWidth / width) * height, width: clampedWidth };
		}
	};
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class="fixed left-0 top-0 z-20 m-0 flex h-[100lvh] w-[100lvw] items-center overflow-auto bg-background"
	onclick={() => {
		zoomed = false;
		onClick && onClick();
	}}
>
	<div
		class="fixed left-3 top-3 cursor-pointer rounded-full bg-zinc-900 p-2.5 opacity-25 hover:opacity-85 hover:brightness-110"
	>
		<Cross2 size={25} />
	</div>
	<img
		bind:this={imageState}
		class={cn('m-auto', zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in')}
		src={url}
		onclick={(e) => {
			e.preventDefault();
			e.stopPropagation();
			zoomed = !zoomed;
		}}
	/>
</div>
