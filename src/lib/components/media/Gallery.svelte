<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import { cn } from '$lib/utils';

	let { post }: { post: ListingData } = $props();
	const galleryItems = post?.gallery_data?.items ?? [];

	let hideCounter = $state(true);
	let hideTimer: number | undefined = undefined;

	let api: any = $state(0);
	let count = $state(0);
	let current = $state(0);

	$effect(() => {
		if (!api) return;
		count = api.scrollSnapList().length;
		current = api.selectedScrollSnap() + 1;
		api.on('select', () => {
			current = api.selectedScrollSnap() + 1;
			handleCounter();
		});
	});

	const handleCounter = () => {
		hideCounter = false;

		if (hideTimer) {
			clearTimeout(hideTimer);
			hideTimer = undefined;
		}

		hideTimer = setTimeout(() => {
			hideCounter = true;
		}, 1500);
	};

	const getMediaType = (post: ListingData, media_id: string) => {
		const mediaType = post?.media_metadata[media_id].m as string; // example: "image/png"
		if (mediaType) return mediaType.substring(mediaType.indexOf('/') + 1);
		else return '';
	};
</script>

<div class="relative flex justify-center">
	<Carousel.Root bind:api class="flex h-[600px] items-center justify-center">
		<Carousel.Content>
			{#each galleryItems as galleryItem}
				<Carousel.Item class="rounded-2xl">
					<div class="mx-auto flex h-full items-center justify-center">
						<img
							class="h-full max-h-[600px] w-full object-contain"
							src={`https://i.redd.it/${galleryItem.media_id}.${getMediaType(post, galleryItem.media_id)}`}
						/>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous class="translate-x-12" />
		<Carousel.Next class="-translate-x-12" />
	</Carousel.Root>
	<div
		class={cn(
			'absolute bottom-0 mb-1 flex h-fit w-fit  items-center justify-center rounded-3xl bg-black bg-opacity-45 px-4 py-1 ',
			!!hideCounter && 'select-none opacity-0 transition-all duration-500'
		)}
	>
		<span class="text-white opacity-85">{current} ∕ {count}</span>
	</div>
</div>
