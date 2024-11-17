<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import { cn } from '$lib/utils';
	import ExpandedImage from './ExpandedImage.svelte';

	let {
		post,
		blur: _blur,
		class: className
	}: { post: RedditT3Data; blur?: boolean; class?: string } = $props();
	const galleryItems = post?.gallery_data?.items ?? [];

	let expanded = $state(false);

	let api: any = $state(0);
	let count = $state(0);
	let current = $state(0);

	let blur = $state(_blur ?? false);

	$effect(() => {
		if (!api) return;
		count = api.scrollSnapList().length;
		current = api.selectedScrollSnap() + 1;
		api.on('select', () => {
			current = api.selectedScrollSnap() + 1;
		});
	});

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

<div class={cn('justify-center rounded-md', className)}>
	<Carousel.Root
		bind:api
		opts={{ duration: 20 }}
		class="flex max-h-[600px] items-center justify-center"
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
		<Carousel.Content>
			{#each galleryItems as galleryItem}
				<Carousel.Item>
					<div class="mx-auto flex h-full items-center justify-center">
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<img
							alt=""
							onclick={handleExpand}
							class={cn(
								'h-full max-h-[600px] w-fit max-w-full cursor-pointer object-contain',
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
	</Carousel.Root>
	<div class={'mt-1.5 flex items-center justify-center'}>
		{#each { length: count } as _, idx}
			<div
				class={cn(
					'mx-[1px] size-1.5 rounded-full bg-zinc-200 bg-opacity-45 transition-all duration-200',
					current - 1 == idx && 'w-2.5 bg-opacity-85 brightness-105'
				)}
			></div>
		{/each}
	</div>
</div>

{#if expanded}
	<ExpandedImage url={mediaIdToURL(galleryItems[current - 1].media_id)} onClick={handleExpand} />
{/if}
