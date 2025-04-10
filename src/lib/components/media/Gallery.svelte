<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import { cn } from '$lib/utils';
	import { Cross2 } from 'radix-icons-svelte';
	import type { CarouselAPI } from '../ui/carousel/context';
	import { setSiteScrollable } from '$lib';

	let {
		post,
		blur,
		class: className
	}: { post: RedditT3Data; blur?: boolean; class?: string } = $props();

	const galleryItems = post?.gallery_data?.items ?? [];

	let expanded = $state(false);
	let zoomed = $state(false);
	let blurred = $state(blur ?? false);

	let api = $state<CarouselAPI>();
	let current = $state(0);
	const count = $derived(api ? api.scrollSnapList().length : 0);

	$effect(() => {
		if (!api) return;

		current = api.selectedScrollSnap() + 1;
		api.on('select', () => {
			current = api!.selectedScrollSnap() + 1;
		});
	});

	$effect(() => {
		if (!api) return;
		if (!blurred) api.reInit({ active: true });
	});

	const getMediaType = (post: RedditT3Data, media_id: string) => {
		const mediaType = post?.media_metadata[media_id].m as string; // example: "image/png"
		if (mediaType) return mediaType.substring(mediaType.indexOf('/') + 1);
		else return '';
	};

	const mediaIdToURL = (media_id: string) => {
		return `https://i.redd.it/${media_id}.${getMediaType(post, media_id)}`;
	};

	const handleExpand = () => {
		expanded = !expanded;

		setSiteScrollable(!expanded);
	};
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.code == 'Escape' && expanded) handleExpand();
	}}
/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class={cn(
		expanded && 'fixed left-0 top-0 z-30 flex h-lvh w-lvw items-center overflow-auto bg-background',
		galleryItems.length == 0 && 'hidden',
		(blurred || !expanded) && 'cursor-pointer',
		!expanded && className
	)}
>
	<Carousel.Root
		setApi={(emblaApi) => (api = emblaApi)}
		opts={{ duration: 20, active: !blurred }}
		onclick={() => {
			if (blurred) blurred = false;
		}}
		class={cn('h-full w-full', !zoomed && 'flex items-center')}
	>
		{#if expanded}
			<div
				class="fixed left-4 top-4 z-30 cursor-pointer rounded-full border-2 border-white bg-zinc-900 p-2.5 opacity-25 hover:opacity-85 hover:brightness-110"
				onclick={(e) => {
					e.stopPropagation();
					handleExpand();
				}}
			>
				<Cross2 size={25} />
			</div>
		{/if}

		<Carousel.Content
			class={cn('flex items-center', expanded && !zoomed && 'h-lvh w-[101lvw]')}
			onclick={() => {
				if (expanded) handleExpand();
			}}
		>
			{#each galleryItems as galleryItem, idx}
				<Carousel.Item>
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<img
						alt=""
						onclick={(e) => {
							e.stopImmediatePropagation();
							if (!expanded) handleExpand();
							else zoomed = !zoomed;
						}}
						class={cn(
							'mx-auto my-auto object-contain',
							expanded
								? zoomed && idx + 1 == current
									? 'min-h-lvh min-w-[85lvw] cursor-zoom-out'
									: 'h-full max-h-lvh max-w-[85lvw] cursor-zoom-in'
								: 'max-h-[600px] w-full',
							blurred && 'pointer-events-none blur-xl'
						)}
						src={mediaIdToURL(galleryItem.media_id)}
					/>
				</Carousel.Item>
			{/each}
		</Carousel.Content>

		<Carousel.Previous disabled={blurred} class="translate-x-12" />
		<Carousel.Next disabled={blurred} class="-translate-x-12" />

		<div
			class={cn(
				'bottom-0 left-1/2 mb-2 flex -translate-x-1/2 rounded-md bg-background/50 p-1',
				expanded ? 'fixed z-50' : 'absolute'
			)}
		>
			{#each { length: count } as _, idx}
				<div
					class={cn(
						'mx-[1px] size-1.5 rounded-full bg-zinc-200 bg-opacity-45 transition-all duration-200',
						current - 1 == idx && 'w-2.5 bg-opacity-85 brightness-105'
					)}
				></div>
			{/each}
		</div>
	</Carousel.Root>
</div>
