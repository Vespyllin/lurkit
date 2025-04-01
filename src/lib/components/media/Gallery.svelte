<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import { cn } from '$lib/utils';
	import { Cross2 } from 'radix-icons-svelte';
	import type { CarouselAPI } from '../ui/carousel/context';

	let {
		post,
		blur: _blur,
		class: className
	}: { post: RedditT3Data; blur?: boolean; class?: string } = $props();
	const galleryItems = post?.gallery_data?.items ?? [];

	let expanded = $state(false);
	let zoomed = $state(false);

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

	let blur = $state(_blur ?? false);

	const getMediaType = (post: RedditT3Data, media_id: string) => {
		const mediaType = post?.media_metadata[media_id].m as string; // example: "image/png"
		if (mediaType) return mediaType.substring(mediaType.indexOf('/') + 1);
		else return '';
	};

	const handleExpand = () => {
		expanded = !expanded;

		const body = document.querySelector('body');
		if (body) body.style.overflow = expanded ? 'hidden' : 'auto';
	};

	const mediaIdToURL = (media_id: string) =>
		`https://i.redd.it/${media_id}.${getMediaType(post, media_id)}`;
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.code == 'Escape' && expanded) handleExpand();
	}}
/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class={expanded
		? 'fixed left-0 top-0 z-30 flex h-lvh w-lvw justify-center overflow-auto bg-background'
		: cn('justify-center rounded-md', galleryItems.length == 0 && 'hidden', className)}
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

	<Carousel.Root
		setApi={(emblaApi) => (api = emblaApi)}
		opts={{ duration: 20 }}
		class={cn(expanded ? 'h-full w-full' : 'flex max-h-[600px] items-center justify-center')}
	>
		{#if blur}
			<button
				class="absolute z-10 h-fit w-36 rounded-xl bg-background px-3 py-2 hover:bg-zinc-900"
				onclick={() => {
					blur = false;
				}}
			>
				Unblur Images
			</button>
		{/if}
		<Carousel.Content
			onclick={() => {
				if (expanded) handleExpand();
			}}
		>
			{#each galleryItems as galleryItem}
				<Carousel.Item>
					<div
						class={cn(expanded ? 'w-lvh h-lvh' : 'mx-auto flex h-full items-center justify-center')}
					>
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<img
							alt=""
							onclick={(e) => {
								e.stopImmediatePropagation();
								if (!expanded) return handleExpand();
							}}
							class={cn(
								expanded ? 'mx-auto h-full' : 'h-full max-h-[600px] w-fit max-w-full',
								'cursor-pointer object-contain',
								blur && 'pointer-events-none scale-90 blur-lg'
							)}
							src={mediaIdToURL(galleryItem.media_id)}
						/>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous class="translate-x-12" />
		<Carousel.Next class="-translate-x-12" />
		<div
			class="absolute bottom-0 left-1/2 z-50 mb-2 flex -translate-x-1/2 items-center justify-center rounded-md bg-background/50 p-1"
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
